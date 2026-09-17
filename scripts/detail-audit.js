// 前端细节审查脚本 — 无依赖，注入页面后调用 AUDIT()
//
// 用法：配合 audit-matrix.sh 跑档位矩阵；或手工注入（<script> 内含本文件 → load 后调用 AUDIT()）。
// 返回 { overflowX, pageH, tight[], overlap[], wrapped[] }——四类检测全部应为空数组 / 0。
//
// 检测：
//   overflowX  页面级水平溢出（scrollWidth - innerWidth，>0 即事故）
//   tight      line-height < 字号×0.95（字形上下溢出风险，常见于固定 px 行高不随字号缩放）
//   overlap    两个文本叶子元素的单行矩形视觉重叠（ox>35% 且 oy>50%）
//   wrapped    CJK 拆词折行：≥2 行且存在 ≤2 字符的行（孤字行/四字标签拆 3+1）
//
// 误报规避（全部来自实战踩坑，改动检测逻辑前先读）：
//   1. overlap 只遍历元素的「直接子文本节点」——若遍历全部后代（TreeWalker），父元素与内层
//      inline（code/span/b）会把同一段文字各收集一次，父子矩形相互误报。
//   2. wrapped 用「逐字符 Range」测量而非按 rect 统计字符——一个跨行文本节点的每个
//      getClientRects() 都带完整 nodeValue，按 rect 统计会把同一段文字重复计数。
//   3. 行聚类用邻近算法（tol = max(8px, 字号×0.5)）而非坐标分桶——chip/徽章与相邻文本
//      基线差 1-2px 会被分桶法误判为换行。
//   4. 含 <br> 的元素豁免——那是作者显式断行，不是拆词事故。
//   5. 文本总长上限 80 字符（低于此才可能是 UI 短文案；长段落末行 2 字属正常排版波动，
//      由 text-wrap:pretty/balance 缓解，不作为检测目标）。
//   6. 动画元素跳过（animationName 非 none 时几何不稳定）；display:none / opacity<0.05
//      的子树不检测；overflow 裁剪后的矩形（clipRect）若不可见则不计。
function AUDIT(){
  const out={overflowX:0,pageH:document.documentElement.scrollHeight,tight:[],overlap:[],wrapped:[]};
  out.overflowX=Math.max(0,document.documentElement.scrollWidth-window.innerWidth);

  const visChain=el=>{
    let p=el;
    while(p&&p!==document.documentElement){
      const cs=getComputedStyle(p);
      if(cs.display==='none'||cs.visibility==='hidden'||cs.contentVisibility==='hidden')return false;
      p=p.parentElement;
    }
    return true;
  };
  const clipRect=(r,el)=>{
    let p=el.parentElement,o={x:r.left,y:r.top,w:r.width,h:r.height};
    while(p&&p!==document.body){
      const cs=getComputedStyle(p);
      if(/hidden|auto|scroll|clip/.test(cs.overflow+cs.overflowX+cs.overflowY)){
        const pr=p.getBoundingClientRect();
        const x1=Math.max(o.x,pr.left),y1=Math.max(o.y,pr.top);
        o={x:x1,y:y1,w:Math.max(0,Math.min(o.x+o.w,pr.right)-x1),h:Math.max(0,Math.min(o.y+o.h,pr.bottom)-y1)};
      }
      p=p.parentElement;
    }
    return o;
  };

  const leaves=[];
  for(const el of document.querySelectorAll('body *')){
    if(el.closest('script,style,head,svg'))continue;
    const cs=getComputedStyle(el);
    if(cs.display==='none'||cs.visibility==='hidden'||parseFloat(cs.opacity)<0.05)continue;
    if(cs.animationName&&cs.animationName!=='none')continue;      // 动画元素几何在变，跳过
    if(!visChain(el))continue;

    let hasText=false,hasBlock=false;
    for(const n of el.childNodes){
      if(n.nodeType===3&&n.nodeValue.trim())hasText=true;
      else if(n.nodeType===1){const d=getComputedStyle(n).display;if(d!=='inline'&&d!=='inline-block')hasBlock=true;}
    }
    if(!hasText)continue;
    if(hasBlock)continue;                                        // 只看文本叶子，容器由子元素代表

    const fs=parseFloat(cs.fontSize),lh=parseFloat(cs.lineHeight);
    if(lh&&fs&&lh<fs*0.95)out.tight.push({t:el.textContent.trim().slice(0,24),fs,lh,tag:el.tagName+'.'+String(el.className||'').slice(0,24)});

    // 单行矩形：Range 按文本节点拆行，彻底消除跨行 inline 联合矩形误报；
    // 只取直接子文本节点——否则父元素与内层 inline（code/span/b/em）收集同一段文字互相误报重叠
    const rects=[];
    for(const n of el.childNodes){
      if(n.nodeType!==3||!n.nodeValue.trim())continue;
      const rg=document.createRange();rg.selectNodeContents(n);
      for(const x of rg.getClientRects()){
        if(x.width<1&&x.height<1)continue;
        const c=clipRect(x,el);
        if(c.w<1&&c.h<1)continue;
        rects.push({...c,t:n.nodeValue.trim(),owner:el});
      }
    }
    if(!rects.length)continue;

    const txt=el.textContent.replace(/\s+/g,' ').trim();

    // CJK 拆词近似：短文案折行且存在 ≤2 字符的行（四字标签被拆成 3+1 的事故形态）
    // 逐字符 Range 测行（含 inline 子元素文字）；行按 y 邻近聚类（chip 基线微差不算换行）；<br> 是作者显式断行，豁免
    if(txt.length>=2&&txt.length<=80&&!el.querySelector('br')){
      const chs=[];
      const walkCn=(node)=>{
        if(node.nodeType===3){
          const s=node.nodeValue;
          for(let i=0;i<s.length;i++){
            if(!s[i].trim())continue;
            const rg=document.createRange();rg.setStart(node,i);rg.setEnd(node,i+1);
            const rc=rg.getClientRects()[0];if(!rc)continue;
            chs.push(rc.y);
          }
        }else if(node.nodeType===1){for(const c of node.childNodes)walkCn(c);}
      };
      for(const c of el.childNodes)walkCn(c);
      chs.sort((a,b)=>a-b);
      const perLine=[];const tol=Math.max(8,fs*0.5);
      for(const y of chs){
        if(!perLine.length||y-perLine[perLine.length-1].y>tol)perLine.push({y,n:0});
        perLine[perLine.length-1].n++;
      }
      if(perLine.length>=2&&perLine.some(l=>l.n<=2))
        out.wrapped.push({t:txt.slice(0,30),lines:perLine.length,perLine:perLine.map(l=>l.n),tag:el.tagName+(el.id?'@'+el.id:'')+(el.className&&String(el.className).trim()?'@'+String(el.className).split(' ')[0]:''),y:perLine[0].y|0});
    }

    leaves.push({rects});
  }

  // 视觉重叠：单行矩形按 y 排序 + 邻近窗口两两比对
  const allR=[];
  for(const L of leaves)for(const r of L.rects)allR.push(r);
  allR.sort((a,b)=>a.y-b.y);
  const seen=new Set();
  for(let i=0;i<allR.length;i++){
    for(let j=i+1;j<allR.length;j++){
      if(allR[j].y-allR[i].y>40)break;
      const a=allR[i],b=allR[j];
      if(a.owner===b.owner)continue;
      const ox=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x);
      const oy=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);
      if(ox>Math.min(a.w,b.w)*0.35&&oy>Math.min(a.h,b.h)*0.5){
        const idOf=el=>String(el.tagName).toLowerCase()+(el.id?'#'+el.id:'')+(el.className?'.'+String(el.className).split(' ')[0]:'');
        const k=[a.t,b.t,a.y|0,b.y|0].join('|');
        if(seen.has(k))continue;seen.add(k);
        out.overlap.push({a:idOf(a.owner)+'|'+a.t.slice(0,14),b:idOf(b.owner)+'|'+b.t.slice(0,14),ox:+ox.toFixed(1),oy:+oy.toFixed(1),y1:a.y|0,y2:b.y|0});
      }
    }
  }
  return out;
}
