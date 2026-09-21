# Jeremy Design

[English](README.en.md) | 简体中文

面向 Claude Code / Codex 的前端设计 skill：以 Apple 设计理念为默认基础，将紧凑工作台、模块入口和轻质数据面板融入同一设计语言，无需额外声明 Apple 风格。

## 解决什么问题

- 视觉层次：配色、字体比例、留白、边框、圆角、轻阴影与材质。
- 组件与布局：卡片网格、紧凑工具栏、数据表格、主辅分区和响应式重排。
- Apple 风格界面：保留原有平台、字体、材质、控件与动效参考，明确区分原生规范和 Web 适配。
- 既有页面修复：复用项目规范，按改动范围验证，避免把小修复变成整站重设计。

默认先尊重用户要求和项目 `DESIGN.md`。工作台、网站和移动界面共用 Apple Web 设计基础，按内容调整布局与密度；不强制蓝色、玻璃、深色侧栏或固定卡片数量。具体原生 HIG 参数仍按需查阅。

## 安装

选择一个目标目录。目录已存在时先检查本地改动，不重复 clone 或强制覆盖。

```bash
# Claude Code
git clone https://github.com/Yaosc972/jeremy-design.git ~/.claude/skills/jeremy-design
# Codex（任选其一）
git clone https://github.com/Yaosc972/jeremy-design.git ~/.codex/skills/jeremy-design
```

以上安装远程默认分支；未推送的本地改造不会通过这条命令安装。使用本地分支时复制其 skill 文件，保留目标目录已有 Git 元数据及个人改动。

## 使用示例

- “用 jeremy-design 设计清晰、紧凑的企业数据界面。”
- “使用冷灰白底、克制的蓝色强调和轻质卡片改善页面层次。”
- “修复现有工具栏在窄窗口的文字截断，保留其他视觉。”
- “设计 iOS 风格的移动设置页。”

## 结构

| 文件 | 用途 |
|---|---|
| [SKILL.md](SKILL.md) | 触发、产品模式选择、实现边界与交付 |
| [Apple Web 设计基础](references/apple-web-foundation.md) | 各类页面默认共用的设计语言与 Web 适配边界 |
| [Apple 风格工作台元素](references/enterprise-visual-language.md) | 共同基础下的配色、密度、轻质面板、组件组合与 CSS 示例 |
| [工作台交互](patterns/workbench.md) | 筛选、选择范围、表格、详情上下文 |
| [移动 Web](patterns/mobile-web.md) | 触控、软键盘与小屏 |
| [Apple 速查](references/apple-quick-reference.md) | 从原入口移出的原生规范摘要，按需读取 |
| [Web tokens](references/web-tokens.md) | 语义 token、密度与主题选择 |
| [状态与表单](references/states-and-forms.md) | 加载、保存、错误与权限状态 |
| [验证](references/detail-audit.md) | 根据影响选择检查，浏览器脚本为可选辅助 |
| `scripts/`、`tests/` | 原有几何检测器、截图工具与回归用例 |

## 验证

修改审计脚本后运行 `node tests/regression.mjs`（需要可用 Node 和 Chrome，具体运行环境见脚本）。几何检测通过不代表视觉或业务通过；skill 入口校验也不代表已做生成效果 A/B 测试。

补充回归：`python3 tests/matrix-contract.py` 检查矩阵退出码与参数；`node tests/visual-review-contract.mjs` 检查报告隔离、断言透传与评审保存（两者不启动浏览器）；`node tests/runner-errors.mjs` 检查浏览器运行器失败路径。

行为评估建议：不提 Apple，直接要求新工作台，检查是否仍采用共同基础；再尝试局部修复和明确其他品牌风格的任务，检查是否保持用户范围与品牌要求。改版另验证前后截图与状态契约。

## 来源与许可

企业界面视觉配方属于可调整的项目默认值，不附带特定平台、业务流程或品牌资产。Apple 参考保留原仓库标注的 2026-09 快照，未在这次改造中逐条重新验证；需要当前官方结论时查 [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)。来源区分为 `HIG`、`APPLE-EXAMPLE`、`WEB-ADAPTATION`、`PROJECT-DEFAULT`。

MIT，见 [LICENSE](LICENSE)。流体动效参考改编自 [emilkowalski/skills](https://github.com/emilkowalski/skills)，保留原许可归属。Apple HIG 版权归 Apple Inc. 所有，本项目不是 Apple 官方产品。
