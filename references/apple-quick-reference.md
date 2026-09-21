# Apple 平台速查（按需读取）

本文件保留原仓库的 HIG 摘要，未在本次修订中重新逐条核验。需要具体平台、控件与参数时按需读取；默认设计方向已由 [Apple Web 设计基础](apple-web-foundation.md) 提供，包括工作台任务，无需额外声明 Apple 风格。Web 按目标浏览器、输入方式和 WCAG 口径适配。相对文件名均指本目录。

## 核心规范速查（数值均对照原文验证，来源见标记）

### 尺寸与触控
- **按钮 hit region ≥ 44×44 pt**（visionOS ≥ 60×60 pt）——`HIG`，Buttons 页对按钮的硬性要求（"a button needs a hit region of **at least** 44x44 pt"）
- **控件默认/最小尺寸**（`HIG`，Accessibility 页两列表，别只记 44）：iOS 44/28 · macOS 28/20 · tvOS 66/56 · visionOS 60/28 · watchOS 44/28 pt；控件间距：带 bezel 元素四周约 12 pt、无 bezel 约 24 pt
- **⚠️ 别把 28 当按钮热区**：Accessibility 表的 28×28 pt 是通用控件最小尺寸，按钮命中区域按 Buttons 页 44×44 pt；`visualSize`（可见外形）/ `hitRegion`（命中区域）/ `spacing`（相邻间距）三概念分开记（详见 `accessibility.md`、`web-adaptation.md` §0）
- iOS 正文默认 **Body 17 pt**（Dynamic Type Large 档）、Large Title **34 pt**；完整各平台字号表见 `typography.md`
- 各平台默认/最小字号：iOS 17/11 pt，macOS 13/10 pt，watchOS 16/12 pt，visionOS 17/12 pt，tvOS 29/23 pt
- **HIG 原文没有规定"8pt 网格"**——这是社区流传说法。原文给的是 safe area、layout guides 和 Design Resources 模板（下载见 developer.apple.com/design/resources）

### 字体
- 优先系统字体栈：iOS/macOS 用 **SF Pro**，watchOS 用 SF Compact，长文衬线用 **New York**
- Web 近似写法：`-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif`
- 避免 Ultralight/Thin/Light 字重（小字难读）；用 Regular/Medium/Semibold/Bold
- 用字号+字重+颜色做层级，少用多种 typeface；iOS 风格不依赖斜体
- **中文断行**（Web）：短且长度受控的标签可优先单行；表头、表单标签、说明文案允许合理换行；只有真正需绑定的短语与数值单位（`44&nbsp;pt`）才局部 nowrap；空间不足优先让容器重排而不是禁止换行；正文 `text-wrap:pretty` 防孤字；应急断行 `overflow-wrap:anywhere`（≠ `word-break:break-all`）。对策详见 `web-adaptation.md` §4
- 必须支持 Dynamic Type（字号可缩放）：布局要适应字号变化，不能截断关键信息

### 颜色与材质
- 用**语义色**（label/secondaryLabel/systemBackground 等）而不是硬编码颜色，Dark Mode 自动适配
- 对比度（`HIG`，Apple Accessibility 页口径）：≤17pt 文字 ≥4.5:1；18pt 及以上 ≥3:1；Bold 文字任意字号 ≥3:1；明暗两种外观都要检查。**⚠️ Web 冲突**：Apple 的"Bold 任意字号 3:1"与 W3C WCAG 不一致——网页按 WCAG AA 验收（普通文字含小字号粗体一律 ≥4.5:1，仅大号文字 ≥24 CSS px 常规 / ≥约 18.67 CSS px 粗体放宽 3:1），不得把所有粗体降至 3:1（详见 `accessibility.md`）
- 2025 新设计系统 **Liquid Glass**（`HIG`，按**层级**判断而非"是不是控件"）：功能层（导航/工具栏/tab bar）用玻璃材质 + scroll edge effect 浮于内容之上；内容层（卡片、列表、面板、表单容器）用标准材质，不无差别玻璃化；内容层带瞬态交互的控件（Sliders/Toggles）激活时可呈现玻璃感。Web 端 `backdrop-filter` 只是视觉近似（`WEB-ADAPTATION`），可读性与 Reduce Transparency 降级优先于玻璃效果（详见 `materials.md`）

### 交互
- 反馈即时可见；破坏性操作需确认；控件行为与平台惯例一致
- 图标优先 SF Symbols 语义（与文字自动对齐字重）；Web 项目用近似 SVG 库——默认 **Lucide**（ISC、24px 网格、stroke 可调，字重映射与集成方式见 `icons-symbols.md` §3）
- **流体动效（web）**：弹簧动画用 ζ(damping ratio)+response——WWDC 2018 的原始建议即**从无过冲（ζ 1.0）起步**，带动量的手势（如滑动关闭）才适当加弹跳（ζ ~0.8）；演讲具体参数属特定案例（`APPLE-EXAMPLE`），不上升为统一默认。反馈在 pointer-down 即时发生；手势释放速度传给弹簧（用物理弹簧维护速度，勿用 duration 型）；甩动落点用动量投影（decelerationRate 0.998）；边界用橡皮筋（c=0.55）不硬停；动画可随时中断并从当前值续走。细节与代码见 `fluid-motion-web.md`
