#!/usr/bin/env bash
# 细节审查矩阵运行器 — 对同一页面跑多个状态档位，每个档位输出四类检测结果。
#
# 用法:
#   ./audit-matrix.sh page.html                       # 只跑页面原始状态
#   ./audit-matrix.sh page.html s1.js s2.js s3.js     # 每个 state 文件是一段 JS
#
# state 文件内容 = 页面 load 后注入执行的 JS（用于切换字号/主题/动效档位），如:
#   echo 'for(let i=0;i<5;i++)document.getElementById("dtPlus").click()' > dt15.js
#   echo 'document.documentElement.dataset.theme="dark"'                  > dark.js
#   echo 'if(typeof setRM==="function")setRM(true)'                       > rm.js
#
# 验收要求（jeremy-design 交付前强制）: 至少覆盖
#   字号 100% / 150% / 200%（页面档位越多越好）、明暗两种外观 × reduced-transparency。
# 全部档位四类检测为 0 才可判定通过；任一轮修复后必须重跑全部档位（防止修一个引入另一个）。
#
# 原理: headless Chrome 注入 detail-audit.js → 等待状态 JS 生效后读取 AUDIT()
#       → document.title 回传 JSON → grep 提取。
# 依赖: python3 + Google Chrome（可用 $CHROME 覆盖路径）。

set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
[ -x "$CHROME" ] || CHROME="$(command -v google-chrome || command -v chromium || echo "$CHROME")"

if [ $# -lt 1 ]; then echo "用法: $0 page.html [state1.js ...]"; exit 2; fi
PAGE="$1"; shift

TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT

# 审计副本: headless 无法模拟 prefers-reduced-transparency，把该媒体查询强制激活，
# 让检测能覆盖 RM 降级分支（只改副本，不动原文件）
python3 - "$PAGE" "$DIR/detail-audit.js" "$TMP" <<'PY'
import sys
page, audit, tmp = sys.argv[1], sys.argv[2], sys.argv[3]
src = open(page, encoding='utf-8').read()
src = src.replace('@media (prefers-reduced-transparency:reduce){', '@media (min-width:1px){')
open(tmp+'/base.html', 'w', encoding='utf-8').write(src)
open(tmp+'/audit.js', 'w', encoding='utf-8').write(open(audit, encoding='utf-8').read())
PY

run_state() {  # $1 = 名称  $2 = 状态 JS
  python3 - "$TMP" "$2" "$1" <<'PY'
import sys
tmp, state, name = sys.argv[1], sys.argv[2], sys.argv[3]
src = open(tmp+'/base.html', encoding='utf-8').read()
audit = open(tmp+'/audit.js', encoding='utf-8').read()
inj = ('<script>' + audit + '''
addEventListener('load',()=>{
 setTimeout(()=>{''' + state + '''},400);
 setTimeout(()=>{const a=AUDIT();
   document.title='RESULT:'+JSON.stringify({o:a.overflowX,t:a.tight.length,ov:a.overlap.length,w:a.wrapped.length,
     detail:{tight:a.tight.slice(0,3),overlap:a.overlap.slice(0,3),wrapped:a.wrapped.slice(0,5)}});},2400);
});
</script></body>''')
open(tmp+'/'+name+'.html', 'w', encoding='utf-8').write(src.replace('</body>', inj))
PY
  local out
  out=$("$CHROME" --headless=new --disable-gpu --dump-dom --window-size=1440,2000 \
        --virtual-time-budget=40000 "file://$TMP/$1.html" 2>/dev/null | grep -o 'RESULT:{.*}' | head -c 1500)
  if [ -z "$out" ]; then echo "── $1  !! 无法提取结果（页面未加载/AUDIT 未定义/超时）"; return 1; fi
  echo "── $1  ${out#RESULT:}"
}

FAIL=0
if [ $# -eq 0 ]; then
  run_state "default" "" || FAIL=1
else
  for S in "$@"; do
    run_state "$(basename "$S" .js)" "$(cat "$S")" || FAIL=1
  done
fi
echo ""
if [ "$FAIL" -eq 0 ]; then echo "矩阵运行完成。注意: 仅当每个档位 o/t/ov/w 均为 0 且明细为空才判定通过。"
else echo "矩阵运行结束但有档位失败（见上）。"; exit 1; fi
