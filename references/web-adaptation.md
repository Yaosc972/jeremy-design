# Web 适配层（原生 Apple 概念 → Web 实现）

> **性质**：`WEB-ADAPTATION`——本文件是把原生规范转换到浏览器的工程约定，**不声称与原生等价**。Web 项目必读；纯原生（SwiftUI/UIKit/AppKit）项目不需要本文件。
> 规则数值本身的出处见对应 reference（typography / accessibility / materials / fluid-motion-web 等）。

## 0. 单位策略（最重要的一条）

- **原生 Apple 坐标使用逻辑 point**（由系统映射到设备像素）；**Web 使用 CSS px/rem**。CSS 的 `pt` 是 DTP 点（1pt = 4/3 px），**不是** Apple 的逻辑 point——禁止做"网页按钮 32px ≈ 24pt，低于 28pt"这类跨单位推导。
- 正确流程：原生尺寸表（pt）→ 判断意图（这是 hit region / 字号 / 间距？）→ Web 端按意图选 CSS px 值并在项目中记录适配决策。
- 本 skill 的 Web 默认值（均为 `PROJECT-DEFAULT`，可按项目调整）：

| 原生值（HIG） | Web 默认适配 | 说明 |
|---|---|---|
| 按钮 hit region ≥44×44 pt | 点击区域 ≥44×44 CSS px | 用 padding/min-height 补足，而非放大视觉外形 |
| iOS Body 17 pt | 正文 17px（可 rem 化） | 见 typography.md |
| 控件间距 12/24 pt | 紧邻交互元素间距 ≥12px，裸元素 ≥24px | |
| 10px 手势余量（fluid-motion-web.md） | hit slop ~10px | 伪元素扩热区 |

- **参照系**：网页自身的 WCAG 2.2 AA「目标尺寸」条款为 24×24 CSS px 且带间距等例外条件——这是另一套标准，与 Apple 的 28/44 数值并行使用、不要合并成一个"最低值"。

## 1. 原生概念 → Web 映射表

| 原生概念 | Web 适配要点 |
|---|---|
| **point / hit region** | §0 的单位策略；`pointer-events`、伪元素扩热区、触屏 `touch-action: manipulation` 消 300ms 延迟 |
| **Dynamic Type** | 全局字号系数（如 `--dt`）+ `calc(pt × var(--dt))`；间距用 em/rem 随字缩放；支持至少 200% 放大不破版不截断；大字号下内联项改堆叠布局。验证：用页面级 A+/A− 或浏览器字号设置实测 |
| **语义色 label/systemBackground** | CSS custom properties 定义两套值：`[data-theme="dark"]` + `@media (prefers-color-scheme: dark)`（auto 档）；提供 Increase Contrast 近似（`prefers-contrast: more` 提对比）；永远提供明/暗两套，即使只发布单一外观 |
| **Safe Area** | `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` + `env(safe-area-inset-top/bottom/left/right)` 用于 fixed 头尾的 padding；无刘海环境的普通留白不混用 env() |
| **Sheet / 弹窗** | 模态语义不止是动画：`role="dialog"` + `aria-modal`、打开时焦点移入、焦点圈定（keyboard trap）内、Esc/关闭按钮可达、关闭后焦点还原触发元素、背景对读屏不可交互（`inert` 或等价）。弹簧动画只是外壳 |
| **Liquid Glass** | `backdrop-filter: blur() saturate()` 是**视觉近似**：必须写 `-webkit-` 前缀、必须提供降级（`@supports not (backdrop-filter:…)` → 更高不透明度实底）；`prefers-reduced-transparency: reduce` → 去模糊提实底；可读性永远优先于玻璃效果 |
| **Haptics** | `navigator.vibrate` 仅 Android 支持；桌面/ iOS Safari 无效——视觉/听觉反馈必须独立成立，不能依赖触感 |

## 2. 无障碍验收（Web 口径）

- 对比度按 **W3C WCAG** 判定：普通文字（含小字号粗体）≥4.5:1；大号文字（≥24 CSS px 常规 / ≥约 18.67 CSS px 粗体）≥3:1。Apple Accessibility 页的"Bold 任意字号 3:1"仅适用于原生平台口径（见 accessibility.md 的冲突说明）。
- 三个媒体查询都要响应：`prefers-reduced-motion`（滑移→交叉淡化，**不改变组件显隐状态**）、`prefers-reduced-transparency`（玻璃→实底）、`prefers-contrast: more`（提对比+明确边线）。
- 键盘可达：所有交互元素 Tab 可达、可见 focus 态、Enter/Space 激活、`:focus-visible` 而非全局 outline 移除。

## 3. 最低验收基线（本 skill 的工程约定，非 Apple 规定）

交付 Apple 风格 Web 页面前，至少用三个页面跑一遍：

1. **设置页**（分组列表 + switch + slider）——验语义色明暗、Dynamic Type 缩放不破版。
2. **带表单的模态 sheet**——验模态语义（焦点圈定/还原）、grabber 拖拽、reduced-motion 降级下显隐正确。
3. **支持拖拽的播放器/卡片**——验弹簧可中断不跳变、速度传递、橡皮筋边界、键盘替代操作存在。

每个页面检查：浅/深色、200% 字号、纯键盘操作、读屏要点（dialog role/focus）、reduced-motion、动画中断。报告时区分"已验证"与"未验证"。
