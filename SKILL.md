---
name: jeremy-design
description: Jeremy design — 自建 Apple 风格前端设计规范 skill（原 apple-design-hig，2026-09 改名）。Use when designing or building any Apple-style / iOS-style frontend — web UI, HTML/CSS, React, dashboard, or mobile app — that should follow Apple Human Interface Guidelines, or when implementing fluid/gesture-driven interactions (spring animations, drag/swipe/sheet, momentum, rubber-band, reduced-motion). Triggers include 做个 iOS 风格页面、Apple 风格设计、苹果设计规范、SF Pro 字体、Dynamic Type、暗色模式语义色、Liquid Glass、44pt 触控目标、SF Symbols 图标、safe area、弹簧动画、手势拖拽、底部抽屉 sheet、流畅动效、以及任何"设计一个 App/界面/设置页/播放器"且要求 Apple 质感的前端任务. Provides authoritative HIG rules extracted from developer.apple.com/design (2026-09 snapshot) with exact values, not vibes.
---

# Jeremy Design（Apple HIG 前端设计规范速查）

本 skill 提供 **Apple HIG 核心主题摘要 + 单独标注的 Web 适配建议**。HIG 抓取快照为 2026-09，reference 只收录核心子集（172 页 URL 全索引在 `hig-index-all-pages.md`，并非 172 页完整正文的逐条摘录）。官方指南、Apple 演讲示例、Web 转译与项目默认值必须用来源标记区分，不得混用：

| 来源标记 | 含义 |
|---|---|
| `HIG` | 官方指南中的直接建议（保留条件与平台范围） |
| `APPLE-EXAMPLE` | Apple 演讲、示例代码或设计资源中的**特定案例**，不得升格为跨组件通用规范 |
| `WEB-ADAPTATION` | 为浏览器做的工程转换，不声称与原生等价 |
| `PROJECT-DEFAULT` | 本 skill 选定的默认值，可按项目调整；官方未规定处允许给默认值但必须标为此类 |

## 何时读哪个文件

| 你要做的事 | 读这个文件（references/ 或 patterns/ 下） |
|---|---|
| **任务启动、定方向、产品模式分流（动手前先读）** | `design-workflow.md` |
| 工作台 / 后台管理页面（数据密集界面） | `patterns/workbench.md` |
| 移动 Web（真机环境、软键盘、返回键、触控） | `patterns/mobile-web.md` |
| 页面布局、间距、层级、适配、safe area | `layout.md` |
| 字体、字号、字重、Dynamic Type、SF Pro / New York | `typography.md` |
| 配色、语义色、系统色板、Dark Mode | `color-dark-mode.md` |
| 材质、毛玻璃、Liquid Glass（2025 新设计系统） | `materials.md` |
| 动效、转场、动画时长 | `motion.md` |
| 弹簧动画参数、手势拖拽、速度传递、动量投影、橡皮筋边界、reduced-motion 等 web 流体动效实现 | `fluid-motion-web.md`（WWDC 演讲转译，与 HIG 文档互补） |
| **原生概念 → Web 实现的单位/焦点/降级适配 + 中文断行规范（Web 项目必读）** | `web-adaptation.md`（中文排版见 §4） |
| 无障碍（对比度、触控目标、VoiceOver） | `accessibility.md` |
| 反馈、触感、加载、手势 | `interaction-feedback.md` |
| 按钮/弹窗/菜单/开关/滑杆等控件规范 | `components-controls.md` |
| App 图标、SF Symbols 图标、Web 图标库落地（Lucide 等） | `icons-symbols.md`（Web 项目重点看 §3） |
| 各平台（iOS/macOS/visionOS/watchOS/iPadOS）差异 | `platforms.md` |
| 设计总原则、包容性 | `design-principles.md` |
| 查任何 HIG 页面的原文 URL（172 页全索引） | `hig-index-all-pages.md` |
| 建立 Web 设计系统（三层 tokens、间距刻度、信息密度决策） | `web-tokens.md` |
| 数据列表 / 保存 / 表单的状态与业务交互（加载、空、错、无权限） | `states-and-forms.md` |
| React 项目实现约定（组件复用、key、清理、动画、图标） | `react-implementation.md` |
| **交付前细节审查**（每任务执行，分级验收） | `detail-audit.md` + `scripts/audit-matrix.sh` |

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

## 使用规则

0. **执行流程**（每次任务走一遍）：按 `design-workflow.md` 先定方向（谁使用、核心任务、真实内容、已有设计系统）→ 判断**任务类型**（新建 / 改版 / 局部修复 / 参考复刻——局部修复优先保留原结构，参考复刻优先忠实参考，只有新建或明确改版才主动建立整套视觉方案）与**产品类型**（内容展示网站 / 工作台 / 移动 Web）→ 确认运行环境与输入方式（原生 or Web、目标浏览器、鼠标/触控/键盘）→ 按路由表读任务相关 reference → 区分来源标记，不混用原生 point 与 CSS 单位 → 实现正常、交互、异常三态（按 `states-and-forms.md` 展开）→ 验证无障碍（对比度、字号缩放、reduced-motion、键盘/读屏）、布局与动效（动画中断不跳变）→ **交付前细节审查**（`scripts/audit-matrix.sh` 按实际状态矩阵运行），验收分三级：**阻断问题清零**（关键内容不可读、主要操作不可达、布局严重溢出、运行错误）、**警告逐项复核并记录处置**、**已知例外备案**——阻断清零即通过，不以消除所有启发式告警为目标修改正常布局；修复优先解决布局根因，再复跑矩阵确认其他状态没有退化 → 向用户报告**已验证项与未验证项**；未经实际验证，不声称实现"已符合 HIG"（详细口径见 `detail-audit.md`）
1. **设计前**：按上表读对应 reference 文件（通常 1-2 个），不要跳过直接凭印象写样式；Web 项目必读 `web-adaptation.md`
2. **数值必须来自 reference**：字号、尺寸、对比度阈值以文件内速查表为准；文件里没有的数值不要编造，标注"HIG 未规定"并给出 `PROJECT-DEFAULT` 默认值
3. **平台一致性**：只做一种平台风格时按 `platforms.md` 对应节；混搭风格先声明目标平台
4. **溯源**：每条规范在 reference 文件头部有原文 URL；172 页全索引在 `hig-index-all-pages.md`
5. **时效**：快照为 2026-09；Apple 每年 WWDC 后更新（Liquid Glass 是 iOS 26 / 2025 引入），关键项目建议对照原文确认
6. **适用范围**：Jeremy Design 面向网站、Web 应用、工作台和移动 Web 的设计与实现，以 Apple 的清晰层级、内容优先、克制材质和一致交互作为设计方向。**不要求用户运行 Apple 操作系统**——Windows 上的工作台同样适用本 skill（但不需要被做成放大的 iOS 设置页）。实现以目标浏览器、输入方式、无障碍要求和项目现有设计系统为约束；Apple 原生 API 与专属平台尺寸不直接套用于 Web。无论何种任务，动手前先定一个明确的审美方向（Purpose/Tone/Constraints/Differentiation），避免千篇一律的默认样式（系统字体堆叠、紫色渐变、模板布局）

## 常见错误（来自 HIG 原文的反模式 + 本 skill 的实现守则）

- ⚠️ **材质别走极端**：材质服务于层级区分——实色、边框、轻微阴影均为有效手段，玻璃效果按场景选择、**不作为 Apple 风格的必要条件**；工作台优先保证内容和数据可读。内容层用实色/标准材质本就正确（与速查 Liquid Glass 条同口径，详见 `materials.md`）
- ❌ 按钮可点热区低于 44×44 pt（visionOS ≥60×60 pt）；28×28 pt 是控件最小尺寸、**不能**当按钮热区；网页自身的 WCAG 2.2 AA 目标尺寸条款（24×24 CSS px，含间距等例外）是另一套标准，勿混成一个"最低值"
- ❌ 用 CSS 单位换算判断 Apple 规范（如"32 CSS px ≈ 24 CSS pt，低于 28pt"）——CSS 的 `pt` 不是 Apple 的逻辑 point，两者不能机械换算。原生尺寸用逻辑 point，Web 实现用 CSS px/rem 并明确记录适配策略；Web 端把 44×44 CSS px 作为本 skill 默认点击区域（`PROJECT-DEFAULT`，非 Apple 官方换算结果）
- ❌ 硬编码颜色导致 Dark Mode 失效（应语义色）
- ❌ 用 light 字重做小字号正文
- ❌ 布局不响应字号缩放，大字号下文字被截断
- ❌ 按设备型号/横竖屏决定布局（应按 size class / 可用空间决定）
- ❌ 把演讲示例参数升格为通用规范（如"0.4 用于大距离移动"）、把 Apple 阻尼比 ζ 直接写进 Motion 的 `damping` 参数（两者不是同一个量）、宣称"大字必负字距"（SF Pro 24pt 起转正，方向取决于字体家族）
- ❌ 用 emoji 当 UI 图标（彩色表情符号无法对齐文字字重、无法单色适配明暗外观与 Reduce Transparency，跨平台渲染不一致）→ ✅ UI 图标一律用矢量符号（SF Symbols 或近似 SVG），与相邻文本同色同字重；emoji 只可作内容、不作界面图标。本条为本 skill 工程守则（`PROJECT-DEFAULT`）：HIG 无"禁用 emoji"明文，依据 icons-symbols.md 的单色渲染与字重对齐原则推导。Web 项目取图标的默认库与集成方式见 `icons-symbols.md` §3（默认 Lucide）
- ❌ 交前端页面前不跑细节审查就宣称完成：固定 px 尺寸（行高/容器高/最小宽度）、不可收缩子项与不合理的单行限制会在放大/重排档引发挤字、孤字、溢出，且可能是"特定档位窗口"型（只在某些档位出现）——单档位肉眼通过不构成交付依据；交付前跑 `scripts/audit-matrix.sh`，修完复跑全部档位确认无退化（分级口径见 `detail-audit.md`）
- ❌ 为通过某档位检测而过度修复、波及正常状态：先查固定高度、最小宽度、不可收缩子项与单行限制，优先以布局根因修复解决，确有必要才设特定布局切换点（如只作用于某档位的类/媒体查询）；不要顺手改动其他状态下原本正确的布局（实测过把 1.5x 原本正常的六列色卡改成 3 列的事故）。改过布局的元素截图目视复核观感是否退化
