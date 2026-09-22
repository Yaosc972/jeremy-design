#!/usr/bin/env bash
# audit-matrix.sh — 档位矩阵运行器（面向真实前端应用）
#
# 在真实浏览器（CDP，见 audit-runner.mjs）中打开目标页面，按「状态组合 × 视口 ×
# reduced-transparency 两态」生成矩阵逐档检查，汇总阻断/警告计数与页面错误。
#
# 用法:
#   ./audit-matrix.sh <url|file> [选项]
#
#   --viewport 1440x900        视口（可多次，默认 1440x900）
#   --dim "a.js,b.js"          一个状态维度（可多次；维度间取笛卡尔积，维度内取并集档位）
#   --rm both|reduce|no-preference|off   默认 both（两态都跑）；off 用浏览器默认
#   --timeout 30000            单档导航 load 上限 ms（超时=执行失败）
#   --ready <js-expr>          应用就绪条件（透传运行器，所有档位共用）
#   --assert <js-expr>         状态生效断言（透传运行器，每档执行，为假即失败）
#   --chrome <path>            Chrome 可执行文件（透传运行器；缺省由运行器自动探测）
#
# 示例（真实应用 URL + 字号 × 主题矩阵）:
#   ./audit-matrix.sh http://localhost:5173/workbench \
#     --dim "dt100.js,dt150.js,dt200.js" --dim "light.js,dark.js" \
#     --ready "!!document.querySelector('#app .toolbar')"
#
# 状态文件内容 = 页面稳定前注入执行的 JS（切换字号/主题/数据状态），如:
#   echo 'for(let i=0;i<5;i++)document.getElementById("dtPlus").click()' > dt150.js
#   echo 'document.documentElement.dataset.theme="dark"'                  > dark.js
# 状态文件可自行断言（throw new Error("dt150 未生效")）——状态脚本异常会被判为执行失败。
# 档位级断言用 --assert（配合状态文件断言目标字号/主题确实生效，执行过 ≠ 覆盖了该档位）。
#
# 退出码: 0=全绿；1=检出阻断问题（clip/水平溢出）；2=执行失败（页面打不开/空白/页面报错/AUDIT 失败）
# 注: warn 级（疑似重叠/行高偏紧/短行孤字）不判失败，需逐项人工复核后处置（见 references/detail-audit.md）。
# 依赖: bash 与 node（结果解析用 node，无 python3 要求）。Chrome 由运行器自动探测或用 --chrome 指定。
# 测试可用 JD_RUNNER_NODE 覆盖运行器调用命令（matrix-contract.py 的假运行器即借此注入）。
set -u
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUNNER="$SCRIPT_DIR/audit-runner.mjs"
AUDIT="$SCRIPT_DIR/detail-audit.js"

usage(){ awk 'NR>1 && /^#/{sub(/^# ?/,"");print;next} NR>1{exit}' "$0"; }

TARGET=""; CHROME=""; declare -a VIEWPORTS=() DIMS=()
RM_LIST=("reduce" "no-preference"); TIMEOUT=30000; READY=""; ASSERT=""
while [ $# -gt 0 ]; do
  case "$1" in
    --viewport|--dim|--rm|--timeout|--ready|--assert|--chrome)
      if [ $# -lt 2 ] || [ -z "$2" ] || [[ "$2" == --* ]]; then
        echo "缺少选项值: $1" >&2; exit 2
      fi;;
  esac
  case "$1" in
    --viewport) VIEWPORTS+=("$2"); shift 2;;
    --dim)      DIMS+=("$2"); shift 2;;
    --rm)       case "$2" in
                  both) RM_LIST=("reduce" "no-preference");;
                  off)  RM_LIST=("");;
                  reduce|no-preference) RM_LIST=("$2");;
                  *) echo "无效 --rm: $2" >&2; exit 2;;
                esac; shift 2;;
    --timeout)  TIMEOUT="$2"; shift 2;;
    --ready)    READY="$2"; shift 2;;
    --assert)   ASSERT="$2"; shift 2;;
    --chrome)   CHROME="$2"; shift 2;;
    -h|--help)  usage; exit 0;;
    -*)         echo "未知选项: $1" >&2; usage; exit 2;;
    *)          TARGET="$1"; shift;;
  esac
done
[ -z "$TARGET" ] && { usage; exit 2; }
[ ${#VIEWPORTS[@]} -eq 0 ] && VIEWPORTS=("1440x900")

# 状态组合 = 各维度的笛卡尔积（--dim "a.js,b.js" --dim "c.js" → a+c、b+c）
declare -a COMBOS=("")
for dim in ${DIMS[@]+"${DIMS[@]}"}; do
  if [[ "$dim" == ,* || "$dim" == *, || "$dim" == *,,* ]]; then
    echo "状态维度包含空项: $dim" >&2; exit 2
  fi
  IFS=',' read -ra items <<< "$dim"
  declare -a next=()
  for c in "${COMBOS[@]}"; do
    for it in "${items[@]}"; do
      if [ -z "$c" ]; then next+=("$it"); else next+=("$c,$it"); fi
    done
  done
  COMBOS=("${next[@]}")
done

echo "目标: $TARGET"
echo "视口: ${VIEWPORTS[*]} | RM: ${RM_LIST[*]} | 状态组合: ${#COMBOS[@]}"
printf '%.0s─' {1..64}; echo

worst=0; total_blocked=0; total_warn=0; total_fail=0; idx=0
for vp in "${VIEWPORTS[@]}"; do
  for rm in "${RM_LIST[@]}"; do
    for combo in "${COMBOS[@]}"; do
      idx=$((idx+1))
      declare -a rargs=("--target" "$TARGET" "--audit" "$AUDIT" "--viewport" "$vp" "--timeout" "$TIMEOUT")
      [ -n "$rm" ] && rargs+=("--rm" "$rm")
      [ -n "$READY" ] && rargs+=("--ready" "$READY")
      [ -n "$ASSERT" ] && rargs+=("--assert" "$ASSERT")
      [ -n "$CHROME" ] && rargs+=("--chrome" "$CHROME")
      label=""
      if [ -n "$combo" ]; then
        IFS=',' read -ra fs <<< "$combo"
        for f in "${fs[@]}"; do rargs+=("--state" "$f"); label+="$(basename "$f" .js)+"; done
        label="${label%+}"
      else
        label="(无状态)"
      fi
      rm_label="${rm:-默认}"
      echo "[$idx] $label | $vp | rm=$rm_label"
      out="$("${JD_RUNNER_NODE:-node}" "$RUNNER" "${rargs[@]}" 2>/dev/null)"
      rcode=$?
      if [ $rcode -ne 0 ] || [ -z "$out" ]; then
        failmsg="$(printf '%s' "$out" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{try{console.log(JSON.parse(s).fail||"")}catch(e){console.log("")}})' 2>/dev/null)"
        echo "    ✗ 执行失败（退出码 ${rcode}）${failmsg:+: $failmsg}"
        ([ -z "$failmsg" ] && [ -n "$out" ]) && printf '%s\n' "$out" | head -c 300
        total_fail=$((total_fail+1)); worst=2; continue
      fi
      echo "$out" | node -e '
let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{
let d=null;
try{ d=JSON.parse(s); }catch(e){ console.log("    ✗ 执行失败: 输出不是有效 JSON"); process.exit(2); }
if(!d||d.ok!==true){ console.log("    ✗ 执行失败: "+String(d&&d.fail||"")); process.exit(2); }
if(d.blank){ console.log("    ✗ 页面空白"); process.exit(2); }
if(d.errors&&d.errors.length){ console.log("    ✗ 页面错误: "+d.errors.join("; ").slice(0,200)); process.exit(2); }
const r=d.result;
if(!r||!r.counts){ console.log("    ✗ 执行失败: 缺少 result"); process.exit(2); }
const c=r.counts;
console.log("    blocked="+c.blocked+"  warn="+c.warn);
if(r.overflowX>0){ console.log("    ✗ 水平溢出 "+r.overflowX+"px"); }
(r.clip||[]).slice(0,6).forEach(x=>{
  const note=x.note?("  — "+x.note):"";
  console.log("    "+(x.sev==="blocked"?"✗":"⚠")+" 裁切 ["+x.t+"] ← "+x.cutter+" (可见比"+x.ratio+")"+note);
});
(r.overlap||[]).slice(0,5).forEach(x=>{ console.log("    ⚠ 重叠 "+x.a+" × "+x.b+(x.offscreen?"  (视口外，需滚动复核)":"")); });
(r.wrapped||[]).slice(0,5).forEach(x=>{ console.log("    ⚠ 短行 "+x.t+" 每行字数"+JSON.stringify(x.perLine)); });
(r.tight||[]).slice(0,5).forEach(x=>{ console.log("    ⚠ 行高 "+x.t+" ("+x.lh+"/"+x.fs+")"); });
const sk=r.skipped||[];
if(sk.length){
  console.log("    ⓘ 豁免 "+sk.length+" 项（带证据，可审查）");
  sk.slice(0,4).forEach(x=>{ console.log("      - ["+x.reason+"] "+x.t+" ← "+String(x.evidence)); });
}
process.exit(c.blocked?3:0);
});'
      pcode=$?
      case $pcode in
        0) ;;
        3) total_blocked=$((total_blocked+1)); [ $worst -lt 1 ] && worst=1;;
        *) total_fail=$((total_fail+1)); worst=2;;
      esac
    done
  done
done

printf '%.0s─' {1..64}; echo
echo "汇总: $idx 档 | 阻断档位 $total_blocked | 执行失败 $total_fail"
if [ $worst -eq 0 ]; then
  echo "结果: 全绿（warn 级如有，需逐项人工复核后处置）"
elif [ $worst -ge 2 ]; then
  echo "结果: 存在执行失败 —— 检查无法成立，先修复再重跑全部档位"
else
  echo "结果: 检出阻断问题 —— 修复后必须重跑全部档位"
fi
exit $worst
