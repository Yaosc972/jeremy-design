# Jeremy Design

[English](README.en.md) | 简体中文

面向 Claude Code / Codex 的前端设计 skill：把 HRAS 企业工作台的页面组织经验与按需查阅的 Apple HIG 参考结合起来。

## 解决什么问题

- 企业入口页：模块入口、业务范围、可用状态、规则入口与最近批次。
- 批次审核页：控制区、流程进度、审核表格、异常处理和输出操作。
- Apple 风格界面：保留原有平台、字体、材质、控件与动效参考，明确区分原生规范和 Web 适配。
- 既有页面修复：复用项目规范，按改动范围验证，避免把小修复变成整站重设计。

默认先尊重用户要求和项目 `DESIGN.md`。HRAS 是可选择的模式，不强制所有页面使用蓝色、玻璃、固定数量的卡片或相同布局。

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

- “用 jeremy-design 做一个 HRAS 风格采购审核工作台，左侧审核，右侧输出。”
- “参考国内劳务首页组织业务模块入口，展示最近批次和可用状态。”
- “修复现有工具栏在窄窗口的文字截断，保留其他视觉。”
- “设计 iOS 风格的移动设置页。”

## 结构

| 文件 | 用途 |
|---|---|
| [SKILL.md](SKILL.md) | 触发、产品模式选择、实现边界与交付 |
| [HRAS 模式](references/hras-workbench.md) | 两类页面骨架、来源、配色、密度、CSS 示例与反例 |
| [工作台交互](patterns/workbench.md) | 筛选、选择范围、表格、详情上下文 |
| [移动 Web](patterns/mobile-web.md) | 触控、软键盘与小屏 |
| [Apple 速查](references/apple-quick-reference.md) | 从原入口移出的原生规范摘要，按需读取 |
| [Web tokens](references/web-tokens.md) | 语义 token、密度与主题选择 |
| [状态与表单](references/states-and-forms.md) | 加载、保存、错误与权限状态 |
| [验证](references/detail-audit.md) | 根据影响选择检查，浏览器脚本为可选辅助 |
| `scripts/`、`tests/` | 原有几何检测器、截图工具与回归用例 |

## 验证

修改审计脚本后运行 `node tests/regression.mjs`（需要可用 Node 和 Chrome，具体运行环境见脚本）。几何检测通过不代表视觉或业务通过；skill 入口校验也不代表已做生成效果 A/B 测试。

行为评估建议：分别尝试新工作台、局部修复和移动 Apple 页面，检查是否正确选资料、保持用户范围、不强加主题或无关审计。

## 来源与许可

HRAS 模式来自本地设计规范及模块工作树，具体文件、版本与适用边界见参考文件；不附带业务数据和品牌资产。Apple 参考保留原仓库标注的 2026-09 快照，未在这次改造中逐条重新验证；需要当前官方结论时查 [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)。来源区分为 `HRAS-OBSERVED`、`HIG`、`APPLE-EXAMPLE`、`WEB-ADAPTATION`、`PROJECT-DEFAULT`。

MIT，见 [LICENSE](LICENSE)。流体动效参考改编自 [emilkowalski/skills](https://github.com/emilkowalski/skills)，保留原许可归属。Apple HIG 版权归 Apple Inc. 所有，本项目不是 Apple 官方产品。
