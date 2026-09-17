---
name: jeremy-design
description: Jeremy design — 自建 Apple 风格前端设计规范 skill（原 apple-design-hig，2026-09 改名）。Use when designing or building any Apple-style / iOS-style frontend — web UI, HTML/CSS, React, dashboard, or mobile app — that should follow Apple Human Interface Guidelines, or when implementing fluid/gesture-driven interactions (spring animations, drag/swipe/sheet, momentum, rubber-band, reduced-motion). Triggers include 做个 iOS 风格页面、Apple 风格设计、苹果设计规范、SF Pro 字体、Dynamic Type、暗色模式语义色、Liquid Glass、44pt 触控目标、SF Symbols 图标、safe area、弹簧动画、手势拖拽、底部抽屉 sheet、流畅动效、以及任何"设计一个 App/界面/设置页/播放器"且要求 Apple 质感的前端任务. Provides authoritative HIG rules extracted from developer.apple.com/design (2026-09 snapshot) with exact values, not vibes.
---

# Jeremy Design（Apple HIG 前端设计规范速查）

把 Apple Human Interface Guidelines 的权威规范带给前端/界面设计任务。所有规则和数值忠实摘自官方原文（2026-09 抓取快照），每条可溯源。

## 何时读哪个文件

| 你要做的事 | 读 references/ 下这个文件 |
|---|---|
| 页面布局、间距、层级、适配、safe area | `layout.md` |
| 字体、字号、字重、Dynamic Type、SF Pro / New York | `typography.md` |
| 配色、语义色、系统色板、Dark Mode | `color-dark-mode.md` |
| 材质、毛玻璃、Liquid Glass（2025 新设计系统） | `materials.md` |
| 动效、转场、动画时长 | `motion.md` |
| 弹簧动画参数、手势拖拽、速度传递、动量投影、橡皮筋边界、reduced-motion 等 web 流体动效实现 | `fluid-motion-web.md`（WWDC 演讲转译，与 HIG 文档互补） |
| 无障碍（对比度、触控目标、VoiceOver） | `accessibility.md` |
| 反馈、触感、加载、手势 | `interaction-feedback.md` |
| 按钮/弹窗/菜单/开关/滑杆等控件规范 | `components-controls.md` |
| App 图标、SF Symbols 图标 | `icons-symbols.md` |
| 各平台（iOS/macOS/visionOS/watchOS/iPadOS）差异 | `platforms.md` |
| 设计总原则、包容性 | `design-principles.md` |
| 查任何 HIG 页面的原文 URL（172 页全索引） | `hig-index-all-pages.md` |

## 核心规范速查（均已对照原文验证）

### 尺寸与触控
- **按钮 hit region ≥ 44×44 pt**（visionOS ≥ 60×60 pt）——原文对按钮的硬性要求（"a button needs a hit region of **at least** 44x44 pt"）
- **控件默认/最小尺寸**（原文两列表，别只记 44）：iOS 44/28 · macOS 28/20 · tvOS 66/56 · visionOS 60/28 · watchOS 44/28 pt。注意 44 是 iOS 的**默认**值不是最小值；控件间距：带 bezel 元素四周约 12 pt、无 bezel 约 24 pt
- iOS 正文默认 **Body 17 pt**（Dynamic Type Large 档）、Large Title **34 pt**；完整各平台字号表见 `typography.md`
- 各平台默认/最小字号：iOS 17/11 pt，macOS 13/10 pt，watchOS 16/12 pt，visionOS 17/12 pt，tvOS 29/23 pt
- **HIG 原文没有规定"8pt 网格"**——这是社区流传说法。原文给的是 safe area、layout guides 和 Design Resources 模板（下载见 developer.apple.com/design/resources）

### 字体
- 优先系统字体栈：iOS/macOS 用 **SF Pro**，watchOS 用 SF Compact，长文衬线用 **New York**
- Web 近似写法：`-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif`
- 避免 Ultralight/Thin/Light 字重（小字难读）；用 Regular/Medium/Semibold/Bold
- 用字号+字重+颜色做层级，少用多种 typeface；iOS 风格不依赖斜体
- 必须支持 Dynamic Type（字号可缩放）：布局要适应字号变化，不能截断关键信息

### 颜色与材质
- 用**语义色**（label/secondaryLabel/systemBackground 等）而不是硬编码颜色，Dark Mode 自动适配
- 对比度达标（HIG 采用 WCAG AA 级）：≤17pt 文字 ≥4.5:1；18pt 及以上 ≥3:1；Bold 文字任意字号 ≥3:1；明暗两种外观都要检查
- 2025 新设计系统 **Liquid Glass**：控件用玻璃质感材质 + **scroll edge effect** 与内容区分（不要给控件垫实色背景）。**例外**：内容层中带瞬态交互元素的控件（如 Sliders、Toggles）被激活时可呈现 Liquid Glass 外观以强调可交互性。

### 交互
- 反馈即时可见；破坏性操作需确认；控件行为与平台惯例一致
- 图标优先 SF Symbols 语义（与文字自动对齐字重）；Web 可用近似 SVG 库
- **流体动效（web）**：弹簧动画用 ζ(damping)+response 参数——默认临界阻尼 ζ 1.0（WWDC 演讲原始口径为 ζ 0.8 默认/0.4 大距离）、动量交互 ζ ~0.8；反馈在 pointer-down 即时发生；手势结束把释放速度传给弹簧；甩动落点用动量投影（decelerationRate 0.998）；边界用橡皮筋（c=0.55）不硬停；动画可随时中断并从当前值续走。细节与代码见 `fluid-motion-web.md`

## 使用规则

1. **设计前**：按上表读对应 reference 文件（通常 1-2 个），不要跳过直接凭印象写样式
2. **数值必须来自 reference**：字号、尺寸、对比度阈值以文件内速查表为准；文件里没有的数值不要编造，标注"HIG 未规定"并给出合理默认
3. **平台一致性**：只做一种平台风格时按 `platforms.md` 对应节；混搭风格先声明目标平台
4. **溯源**：每条规范在 reference 文件头部有原文 URL；172 页全索引在 `hig-index-all-pages.md`
5. **时效**：快照为 2026-09；Apple 每年 WWDC 后更新（Liquid Glass 是 iOS 26 / 2025 引入），关键项目建议对照原文确认
6. **适用范围**：本 skill 只管 Apple 平台口径。非 Apple 平台的通用 web 审美任务（反 AI-slop、大胆自定义风格）**不适用本 skill**——不要对非 Apple 项目强套 HIG 规则。若本机装有 `frontend-design` skill 则调用之；未安装时按同源原则自行执行：动手前先定一个明确的审美方向（Purpose/Tone/Constraints/Differentiation），避免千篇一律的默认样式（系统字体堆叠、紫色渐变、模板布局）

## 常见错误（来自 HIG 原文的反模式）

- ❌ 用实色/半透明背景包裹控件（应使用 **Liquid Glass 材质 + scroll edge effect** 让控件浮于内容之上）
- ❌ 可点热区低于平台最小值（iOS 最小值 28×28 pt、默认 44×44；web 上 32px 高的按钮约合 24pt，已低于最小值）
- ❌ 硬编码颜色导致 Dark Mode 失效（应语义色）
- ❌ 用 light 字重做小字号正文
- ❌ 布局不响应字号缩放，大字号下文字被截断
- ❌ 按设备型号/横竖屏决定布局（应按 size class / 可用空间决定）
