// 前端细节检测器 v3 — 无依赖，注入页面后调用 AUDIT()
//
// 用法：由 audit-runner.mjs / audit-matrix.sh 自动注入；或手工 <script> 注入后调用 AUDIT()。
// 返回 { overflowX, clip[], tight[], overlap[], wrapped[], counts:{blocked,warn} }。
//
// 五类检测（v3 起分两级：blocked 需修复，warn 需人工复核后处置）：
//   overflowX  blocked  页面级水平溢出（scrollWidth - innerWidth > 0，布局严重溢出）
//   clip       blocked  该段文字裁剪后可见面积比 <0.6（内容不可读）
//              warn     可见面积比 0.6~0.95（文字轻微切边，待复核）
//   tight      warn     line-height < 字号×0.95（行高偏紧）
//   overlap    warn     两个文本矩形的视觉重叠（不透明层遮盖场景已豁免）
//   wrapped    warn     CJK 短文案折行且存在 ≤2 字符的行（短行/孤字）
//
// v3 相对 v2 的修复（来自外部审查的浏览器实测用例与演示页回归）：
//   1. wrapped 增加 CJK 门卫——英文在空格处正常换行不再误报（v2 名为 CJK 检测却未判断 CJK）。
//   2. 可见性链补祖先 opacity 检查——祖先 opacity:0 的子树不再参与检测。
//   3. overlap 增加遮挡豁免——对重叠双方分别判定中心点可见性；一方被不透明层盖住即非可见冲突。
//   4. 新增 clip 检测——v2 对 height:5px + overflow:hidden 裁掉文字的场景四项全零。
//   5. clip 判据为「文字自身可见面积比」而非「容器有无溢出」——装饰线/位移元素撑出容器时
//      不再连带误报容器内的完整文字（v3 初版的容器级判据在演示页产生 29 条误报）。
//   6. clip 豁免：零高度收起容器（accordion 合法隐藏）、transform 位移源（动效瞬态）。
//   7. severity 分级——检测器只报事实与建议级别，处置归设计判断（见 detail-audit.md）。
//
// v4 相对 v3 的修复（外部审查第二轮：豁免条件太宽，合法与非法隐藏被混为一谈）：
//   8. 豁免必须带证据——零高度收起容器只有存在展开入口（details / aria-expanded /
//      aria-controls 指向的折叠控件）才豁免；无入口的矮容器照报（v3 里 3px 容器静默通过）。
//   9. transform 位移只有伴随运行中动画（CSS animation / WAAPI）才算动效瞬态；
//      静态 transform 位移不再豁免，报出并注明"无动画证据"。
//  10. 滚动容器不再无条件截断向上检查——容器自身被外层裁掉大半（可见比 <0.6）时按
//      blocked 报出（内层可滚动 ≠ 外层裁切后的内容仍可访问）。
//  11. overlap 判定点在视口外时无法用 elementsFromPoint 判遮挡，不再静默——标记
//      offscreen 报出待滚动复核（v3 首屏外重叠要滚动到该处才出现）。
//  12. 新增 skipped[]——所有豁免携带元素、原因、证据，豁免可审查，不静默消失。
//
// 误报规避（历史实战积累，改检测逻辑前先读）：
//   a. overlap 只遍历元素的「直接子文本节点」——TreeWalker 全后代会让父子矩形互相误报。
//   b. wrapped 用「逐字符 Range」测行——多 rect 各带完整 nodeValue 会重复计数。
//   c. 行聚类用邻近算法（tol = max(8px, 字号×0.5)）——chip 基线差 1-2px 会被分桶法误判。
//   d. 含 <br> 的元素豁免——作者显式断行。
//   e. 文本长度上限 80 字符——长段落末行属正常排版波动。
//   f. 动画元素（animationName 非 none）与不可见子树跳过；裁剪后不可见的矩形不计。
function AUDIT(){
  const CJK=/[⺀-鿿぀-ヿ가-힯豈-﫿]/;
  const out={overflowX:0,pageH:document.documentElement.scrollHeight,clip:[],tight:[],overlap:[],wrapped:[],skipped:[]};
  out.overflowX=Math.max(0,document.documentElement.scrollWidth-window.innerWidth);

  // v4：豁免必须带证据。可折叠证据来源——<details> 收起态、aria-expanded="false"，
  // 以及 aria-controls 指向本容器的折叠控件（其 aria-expanded 当前为 false）。
  const ctrlIds=new Set();
  document.querySelectorAll('[aria-expanded="false"][aria-controls]').forEach(b=>{const id=b.getAttribute('aria-controls');if(id)ctrlIds.add(id);});
  const foldEvidence=p=>{
    if(p.tagName==='DETAILS'&&!p.open)return 'details';
    if(p.closest('details:not([open])'))return 'details-ancestor';
    if(p.getAttribute('aria-expanded')==='false')return 'aria-expanded';
    let q=p;
    while(q&&q!==document.body){
      if(q.id&&ctrlIds.has(q.id))return 'aria-controls';
      q=q.parentElement;
    }
    if(p.closest('[aria-expanded="false"]'))return 'aria-expanded-ancestor';
    // 兄弟结构 accordion（button[aria-expanded=false] 紧邻折叠面板）：控件在前一个兄弟上。
    // 折叠面板可能是容器自身或其子孙包裹层（如 grid-template-rows:0fr 实现里真正
    // overflow:hidden 的是 .acc-body>div），故沿祖先链有限跳数向上，查找前兄弟中的
    // aria-expanded=false 控件。
    let s=p,n=0;
    while(s&&s!==document.body&&n<4){
      const sib=s.previousElementSibling;
      if(sib&&(sib.getAttribute('aria-expanded')==='false'||(sib.querySelector&&sib.querySelector('[aria-expanded="false"]'))))return 'aria-expanded-sibling';
      s=s.parentElement;n++;
    }
    return null;
  };
  const skip=(t,tag,reason,evidence)=>out.skipped.length<200&&out.skipped.push({t,tag,reason,evidence});

  const visChain=el=>{
    let p=el;
    while(p&&p!==document.documentElement){
      const cs=getComputedStyle(p);
      if(cs.display==='none'||cs.visibility==='hidden'||cs.contentVisibility==='hidden')return false;
      if(parseFloat(cs.opacity)<0.05)return false;               // v3: 祖先透明链
      p=p.parentElement;
    }
    return true;
  };
  // 矩形裁剪：mode='visible' 含 auto/scroll 滚动区（重叠判定用：滚动区外文字确实不可见）；
  // mode='clip' 只算 hidden/clip（裁切判定用），从 el 自身起算。返回 nodes=裁剪层（内→外，
  // nodes[0] 为最直接责任者）；folded=true 表示链上遇到「有展开入口证据」的收起容器；
  // scrollInfo 表示进入滚动容器——记其自身经外层裁剪后的可见比（v4）。
  const rectRatioThroughAncestors=el0=>{
    const r0=el0.getBoundingClientRect();
    let o={x:r0.left,y:r0.top,w:r0.width,h:r0.height,nodes:[]};
    let q=el0.parentElement;
    while(q&&q!==document.body){
      const cs=getComputedStyle(q);const ov=cs.overflow+cs.overflowX+cs.overflowY;
      if(/hidden|clip/.test(ov)){
        const pr=q.getBoundingClientRect();
        const x1=Math.max(o.x,pr.left),y1=Math.max(o.y,pr.top);
        o={x:x1,y:y1,w:Math.max(0,Math.min(o.x+o.w,pr.right)-x1),h:Math.max(0,Math.min(o.y+o.h,pr.bottom)-y1),nodes:o.nodes.concat(q)};
      }
      q=q.parentElement;
    }
    return {ratio:Math.max(0,o.w*o.h)/Math.max(1,r0.width*r0.height),cutter:o.nodes[0]||null};
  };
  const clipRect=(r,el,mode)=>{
    const onlyClip=mode==='clip';
    let p=onlyClip?el:el.parentElement,folded=false,foldWhy=null,scrollInfo=null;
    let o={x:r.left,y:r.top,w:r.width,h:r.height,nodes:[]};
    while(p&&p!==document.body){
      const cs=getComputedStyle(p);
      const ov=cs.overflow+cs.overflowX+cs.overflowY;
      const hidden=/hidden|clip/.test(ov);
      if(onlyClip&&hidden&&(p.clientHeight<4||p.clientWidth<4)){
        const ev=foldEvidence(p);
        if(ev){folded=true;foldWhy=ev;break;}   // v4：有展开入口证据的收起态才豁免
        // 无入口证据：不豁免，落入下方常规裁剪计算（矮容器裁掉文字要报）
      }
      if(onlyClip&&/auto|scroll/.test(ov)){
        // v4：内容可经滚动到达（内容维度豁免），但容器自身被外层裁掉时滚动区整体不可达——
        // 记容器经外层裁剪后的可见比，交调用方裁决。
        scrollInfo=rectRatioThroughAncestors(p);
        break;
      }
      if(onlyClip?hidden:/hidden|auto|scroll|clip/.test(ov)){
        const pr=p.getBoundingClientRect();
        const x1=Math.max(o.x,pr.left),y1=Math.max(o.y,pr.top);
        o={x:x1,y:y1,w:Math.max(0,Math.min(o.x+o.w,pr.right)-x1),h:Math.max(0,Math.min(o.y+o.h,pr.bottom)-y1),nodes:o.nodes.concat(p)};
      }
      p=p.parentElement;
    }
    o.folded=folded;o.foldWhy=foldWhy;o.scrollInfo=scrollInfo;
    return o;
  };

  // 豁免辅助：文字可见比低是否由 transform 位移造成。v4 起只有伴随运行中动画证据
  // （CSS animation 或 WAAPI 活动动画，位移元素或其祖先链上任一元素持有）才算动效瞬态
  // 豁免；静态 transform 位移不豁免。返回 null（无位移）或 {node, evidence}
  // （evidence=null 表示有位移但整条链都没有动画证据）。
  const animMoved=(el,box)=>{
    if(!box)return null;
    const c=box.getBoundingClientRect();
    let p=el,moved=null,evidence=null;
    while(p&&p!==box.parentElement){
      const cs=getComputedStyle(p);
      if(!moved&&cs.transform!=='none'){
        const r=p.getBoundingClientRect();
        if(r.bottom>c.bottom+2||r.right>c.right+2||r.top<c.top-2||r.left<c.left-2)moved=p;
      }
      if(!evidence){
        if(cs.animationName&&cs.animationName!=='none')evidence='css-animation: '+cs.animationName.split(',')[0];
        else try{if(p.getAnimations&&p.getAnimations().length)evidence='waapi';}catch(e){}
      }
      p=p.parentElement;
    }
    return moved?{node:moved,evidence}:null;
  };

  const leaves=[];
  for(const el of document.querySelectorAll('body *')){
    if(el.closest('script,style,head,svg'))continue;
    const cs=getComputedStyle(el);
    if(cs.display==='none'||cs.visibility==='hidden'||parseFloat(cs.opacity)<0.05)continue;
    if(cs.animationName&&cs.animationName!=='none')continue;
    if(!visChain(el))continue;

    let hasText=false,hasBlock=false;
    for(const n of el.childNodes){
      if(n.nodeType===3&&n.nodeValue.trim())hasText=true;
      else if(n.nodeType===1){const d=getComputedStyle(n).display;if(d!=='inline'&&d!=='inline-block')hasBlock=true;}
    }
    if(!hasText)continue;
    if(hasBlock)continue;                                        // 只看文本叶子

    const fs=parseFloat(cs.fontSize),lh=parseFloat(cs.lineHeight);
    if(lh&&fs&&lh<fs*0.95)out.tight.push({sev:'warn',t:el.textContent.trim().slice(0,24),fs,lh,tag:el.tagName+'.'+String(el.className||'').slice(0,24)});

    // v3 第五类：文字被 overflow 裁切。判据是「这段文字自身裁剪后的可见面积比」，
    // 不看容器整体溢出 —— 容器溢出但文字完整的情况（装饰线 top:50%+height:100% 撑出、
    // 位移出去的动效元素撑出）不再连带误报容器内其他文本。
    const rects=[];
    let cut={ratio:1,box:null,note:null};
    for(const n of el.childNodes){
      if(n.nodeType!==3||!n.nodeValue.trim())continue;
      const rg=document.createRange();rg.selectNodeContents(n);
      for(const x of rg.getClientRects()){
        if(x.width<1&&x.height<1)continue;
        const cv=clipRect(x,el,'clip');
        let cand=null;
        if(cv.folded){
          // v4：有展开入口证据的合法收起——记入 skipped（可审查），不判裁切
          skip(n.nodeValue.trim().slice(0,24),el.tagName+'.'+String(el.className||'').slice(0,24),'collapsed',cv.foldWhy);
        }else if(cv.scrollInfo){
          // 滚动容器可见则内容可滚动到达（不判）；容器自身被外层裁掉大半则滚动区整体不可达
          if(cv.scrollInfo.ratio<0.6)cand={ratio:cv.scrollInfo.ratio,box:cv.scrollInfo.cutter,note:'滚动区自身被外层裁切(可见比'+cv.scrollInfo.ratio.toFixed(2)+')'};
        }else{
          cand={ratio:(cv.w*cv.h)/Math.max(1,x.width*x.height),box:cv.nodes[0]||null,note:null};
        }
        if(cand&&cand.ratio<cut.ratio)cut=cand;
        const c=clipRect(x,el);
        if(c.w<1&&c.h<1)continue;
        rects.push({...c,t:n.nodeValue.trim(),owner:el});
      }
    }
    // 可见比 <0.6 = 内容不可读（blocked）；0.6~0.95 = 轻微切边（warn，待复核）。
    // v4：transform 位移只有伴随动画证据才豁免（记 skipped）；静态位移照报并注明。
    if(cut.ratio<0.95){
      const am=animMoved(el,cut.box);
      if(am&&am.evidence){
        skip(el.textContent.replace(/\s+/g,' ').trim().slice(0,24),el.tagName+'.'+String(el.className||'').slice(0,24),'transform-transient',am.evidence);
      }else{
        out.clip.push({sev:cut.ratio<0.6?'blocked':'warn',t:el.textContent.replace(/\s+/g,' ').trim().slice(0,24),tag:el.tagName+'.'+String(el.className||'').slice(0,24),cutter:cut.box?cut.box.tagName+'.'+String(cut.box.className||'').slice(0,24)+'('+cut.box.clientWidth+'x'+cut.box.clientHeight+')':'?',ratio:+cut.ratio.toFixed(2),note:cut.note||(am?'静态transform位移，无动画证据':undefined),y:el.getBoundingClientRect().top|0});
      }
    }
    if(!rects.length)continue;

    const txt=el.textContent.replace(/\s+/g,' ').trim();

    // CJK 拆词近似：v3 起先判断文本含 CJK——英文正常断行（空格处换行）不是本检测目标
    if(CJK.test(txt)&&txt.length>=2&&txt.length<=80&&!el.querySelector('br')){
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
        out.wrapped.push({sev:'warn',t:txt.slice(0,30),lines:perLine.length,perLine:perLine.map(l=>l.n),tag:el.tagName+(el.id?'@'+el.id:'')+(el.className&&String(el.className).trim()?'@'+String(el.className).split(' ')[0]:''),y:perLine[0].y|0});
    }

    leaves.push({rects});
  }

  // 视觉重叠：单行矩形按 y 排序 + 邻近窗口两两比对；v3 起对重叠中心点做顶层遮挡豁免
  const allR=[];
  for(const L of leaves)for(const r of L.rects)allR.push(r);
  allR.sort((a,b)=>a.y-b.y);
  const seen=new Set();
  const bgAlpha=e=>{
    const c=getComputedStyle(e),m=c.backgroundColor.match(/rgba?\(([^)]+)\)/);
    if(!m)return 0;
    const parts=m[1].split(',');
    return parts.length>3?parseFloat(parts[3]):1;
  };
  for(let i=0;i<allR.length;i++){
    for(let j=i+1;j<allR.length;j++){
      if(allR[j].y-allR[i].y>40)break;
      const a=allR[i],b=allR[j];
      if(a.owner===b.owner)continue;
      const ox=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x);
      const oy=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);
      if(ox>Math.min(a.w,b.w)*0.35&&oy>Math.min(a.h,b.h)*0.5){
        // v3 遮挡豁免：矩形重叠只是几何事实。对 a/b 双方分别判定「重叠中心点处是否可见」——
        // 若任一方被上层不透明元素盖住（弹层遮背景文字、居中覆盖层），下层文字本就不可见，
        // 不构成可见冲突；双方都可见（真实并列重叠）才报。
        // v4：判定点在视口外时 elementsFromPoint 无效（首屏外重叠曾因此静默）——不判遮挡，
        // 按可疑报出并标记 offscreen，待滚动到该处复核。
        let conflict=true,offscreen=false;
        try{
          const cx=(Math.max(a.x,b.x)+Math.min(a.x+a.w,b.x+b.w))/2;
          const cy=(Math.max(a.y,b.y)+Math.min(a.y+a.h,b.y+b.h))/2;
          if(cx<0||cy<0||cx>window.innerWidth||cy>window.innerHeight){
            offscreen=true;
          }else{
            const st=document.elementsFromPoint(cx,cy);
            const visibleAt=owner=>{
              const i=st.findIndex(e=>e===owner||owner.contains(e)||e.contains(owner));
              if(i<0)return false;
              return !st.slice(0,i).some(e=>{const c=getComputedStyle(e);return bgAlpha(e)>=0.9&&parseFloat(c.opacity)>=0.5;});
            };
            if(!(visibleAt(a.owner)&&visibleAt(b.owner)))conflict=false;
          }
        }catch(e){}
        if(!conflict)continue;
        const idOf=el=>String(el.tagName).toLowerCase()+(el.id?'#'+el.id:'')+(el.className?'.'+String(el.className).split(' ')[0]:'');
        const k=[a.t,b.t,a.y|0,b.y|0].join('|');
        if(seen.has(k))continue;seen.add(k);
        out.overlap.push({sev:'warn',a:idOf(a.owner)+'|'+a.t.slice(0,14),b:idOf(b.owner)+'|'+b.t.slice(0,14),ox:+ox.toFixed(1),oy:+oy.toFixed(1),y1:a.y|0,y2:b.y|0,offscreen:offscreen||undefined});
      }
    }
  }
  const clipBlocked=out.clip.filter(x=>x.sev==='blocked').length;
  out.counts={blocked:(out.overflowX>0?1:0)+clipBlocked,warn:out.tight.length+out.overlap.length+out.wrapped.length+(out.clip.length-clipBlocked)};
  return out;
}
