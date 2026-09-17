# Jeremy Design

Apple 人机界面指南（HIG）前端设计规范速查 —— 一个 Claude Code / Claude Agent skill。

把 Apple 官方 HIG 的权威规范带给前端与界面设计任务。**所有规则和数值忠实摘自 [developer.apple.com/design](https://developer.apple.com/design/human-interface-guidelines/) 官方原文**（2026-09 快照），每条可溯源——exact values, not vibes.

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
| `SKILL.md` | 入口：路由表 + 核心速查 + 使用规则 |
| `references/layout.md` | 布局、间距、层级、safe area |
| `references/typography.md` | 字体、字号、Dynamic Type、SF Pro / New York |
| `references/color-dark-mode.md` | 配色、语义色、系统色板、Dark Mode |
| `references/materials.md` | 材质、毛玻璃、Liquid Glass |
| `references/motion.md` | 动效、转场、动画时长 |
| `references/fluid-motion-web.md` | 弹簧参数、手势拖拽、速度传递、动量投影、橡皮筋、reduced-motion |
| `references/accessibility.md` | 对比度、触控目标、VoiceOver |
| `references/interaction-feedback.md` | 反馈、触感、加载、手势 |
| `references/components-controls.md` | 按钮 / 弹窗 / 菜单 / 开关 / 滑杆等控件规范 |
| `references/icons-symbols.md` | App 图标、SF Symbols |
| `references/platforms.md` | 各平台差异 |
| `references/design-principles.md` | 设计总原则、包容性 |
| `references/hig-index-all-pages.md` | 172 页 HIG 原文 URL 全索引 |

## 一个例子：触控目标

网上常见的简化说法是「最小 44×44pt」。HIG 原文实际上是**两个不同口径**：

- **按钮 hit region** ≥ 44×44 pt（visionOS ≥ 60×60 pt）— 来自 buttons 页
- **控件默认 / 最小尺寸**：iOS 44/28 · macOS 28/20 · tvOS 66/56 · visionOS 60/28 · watchOS 44/28 pt — 来自 accessibility 页

44 是 iOS 的**默认值**，不是最小值。这个区别在实现时很关键。详见 `references/accessibility.md`。

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
