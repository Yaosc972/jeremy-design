# Jeremy Design

[English](README.en.md) | 简体中文

Apple 人机界面指南（HIG）前端设计规范速查 —— 一个 Claude Code / Claude Agent skill。

把 Apple 官方 HIG 的核心规范带给前端与界面设计任务。**HIG 部分的规则和数值忠实摘自 [developer.apple.com/design](https://developer.apple.com/design/human-interface-guidelines/) 官方原文**（2026-09 快照），每条可溯源——exact values, not vibes。在此之上是**单独标注的 Web 适配建议**：官方指南（`HIG`）、Apple 演讲/示例案例（`APPLE-EXAMPLE`）、浏览器工程转换（`WEB-ADAPTATION`）与本项目默认值（`PROJECT-DEFAULT`）四类来源明确区分，不混用。收录范围是**核心主题摘要**，非 172 页逐条摘录（172 页 URL 索引在 `references/hig-index-all-pages.md`）。

---

## 为什么做这个

HIG 官网是 SPA 应用，正文藏在 DocC JSON 接口里，无法直接检索。更麻烦的是网上流传大量关于 Apple 设计规范的**错误说法**，最典型的就是所谓的「8pt 网格」——HIG 原文从未规定过这个。本项目把 172 页 HIG 原文抓取、解析、整理成可检索的速查文档，把每个数值都落到原文出处上。

覆盖内容包括：

- 各平台尺寸与触控目标（iOS / macOS / tvOS / visionOS / watchOS）
- 完整 Dynamic Type 字号表（1038 行）
- 语义色与 Dark Mode
- 材质与 Liquid Glass（iOS 26 / 2025 新设计系统）
- 无障碍对比度阈值（WCAG AA 口径）
- 控件规范、图标、平台差异
- Web 流体动效实现参数（弹簧、手势、动量投影、橡皮筋）

## 安装

```bash
git clone https://github.com/Yaosc972/jeremy-design.git ~/.claude/skills/jeremy-design
```

Claude 会在设计类任务中自动调用；也可显式触发：`做个 iOS 风格设置页`、`苹果设计规范`、`44pt 触控目标`。

## 文件结构

| 文件 | 内容 |
|---|---|
| `SKILL.md` | 入口：来源分类 + 路由表 + 核心速查 + 执行/验收流程 |
| `references/layout.md` | 布局、间距、层级、safe area |
| `references/typography.md` | 字体、字号、Dynamic Type、SF Pro / New York |
| `references/color-dark-mode.md` | 配色、语义色、系统色板、Dark Mode |
| `references/materials.md` | 材质、毛玻璃、Liquid Glass |
| `references/motion.md` | 动效、转场、动画时长 |
| `references/fluid-motion-web.md` | 弹簧参数、手势拖拽、速度传递、动量投影、橡皮筋、reduced-motion |
| `references/web-adaptation.md` | **原生概念 → Web 适配层**：单位策略、语义色 token、safe area、模态语义、降级与验收基线 |
| `references/accessibility.md` | 对比度、触控目标、VoiceOver |
| `references/interaction-feedback.md` | 反馈、触感、加载、手势 |
| `references/components-controls.md` | 按钮 / 弹窗 / 菜单 / 开关 / 滑杆等控件规范 |
| `references/icons-symbols.md` | App 图标、SF Symbols |
| `references/platforms.md` | 各平台差异 |
| `references/design-principles.md` | 设计总原则、包容性 |
| `references/hig-index-all-pages.md` | 172 页 HIG 原文 URL 全索引 |
| `references/detail-audit.md` | **交付前细节审查（强制）**：四类检测定义、档位验收矩阵、修复决策树 |
| `scripts/detail-audit.js` | 注入式细节检测器（水平溢出 / 字形挤压 / 文本重叠 / CJK 拆词折行） |
| `scripts/audit-matrix.sh` | 档位矩阵运行器：多状态自动跑检测并汇总（headless） |

## 一个例子：触控目标

网上常见的简化说法是「最小 44×44pt」。HIG 原文实际上是**两个不同口径**，对应三个概念（visualSize 可见外形 / hitRegion 命中区域 / spacing 间距）：

- **按钮 hit region** ≥ 44×44 pt（visionOS ≥ 60×60 pt）— 来自 buttons 页，对按钮命中区域的硬性要求
- **控件默认 / 最小尺寸**：iOS 44/28 · macOS 28/20 · tvOS 66/56 · visionOS 60/28 · watchOS 44/28 pt — 来自 accessibility 页的通用控件表

44 是 iOS 的**默认值**，不是最小值；而 accessibility 表的 28×28 pt 是通用控件最小条目，**不能**解释为"按钮热区做到 28 就行"。Web 端把 44×44 CSS px 作为本项目默认点击区域（`PROJECT-DEFAULT`，非 Apple 换算结果；CSS pt ≠ Apple 逻辑 point）。详见 `references/accessibility.md` 与 `references/web-adaptation.md`。

## 数据来源与更新

规范快照为 **2026-09**。Apple 每年 WWDC 后更新 HIG（Liquid Glass 是 iOS 26 / 2025 引入），关键项目建议对照原文确认。

重新抓取的方法记录在 `references/hig-index-all-pages.md`：正文数据端点为
`https://developer.apple.com/tutorials/data/design/human-interface-guidelines/<topic>.json`（DocC JSON），需处理 `tabNavigator` 嵌套表（iOS Dynamic Type 尺寸表按字号档位分 tab）等块类型。

## 已知取舍

- HIG 原文中的色板为图片，未能抓取为文本（且 HIG 本身要求不要硬编码系统色）
- tvOS 网格图为图片，未收录

## 许可

MIT，详见 [LICENSE](LICENSE)。`references/fluid-motion-web.md` 改编自 [emilkowalski/skills](https://github.com/emilkowalski/skills)（MIT, © Emil Kowalski），许可声明已在 LICENSE 中按 MIT 条款保留。

Apple Human Interface Guidelines 版权归 Apple Inc. 所有；本项目是其**公开技术规范的事实性摘要**（数值、尺寸、阈值），非 Apple 原文散文的复制。
