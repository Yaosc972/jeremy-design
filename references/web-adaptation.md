# Web 适配层（原生 Apple 概念 → Web 实现）

> **性质**：`WEB-ADAPTATION`——本文件是把原生规范转换到浏览器的工程约定，**不声称与原生等价**。需要把原生概念适配到 Web 时按相关章节读取；纯原生（SwiftUI/UIKit/AppKit）项目不需要本文件。
> 规则数值本身的出处见对应 reference（typography / accessibility / materials / fluid-motion-web 等）。

## 0. 单位策略（最重要的一条）

- **原生 Apple 坐标使用逻辑 point**（由系统映射到设备像素）；**Web 使用 CSS px/rem**。CSS 的 `pt` 是 DTP 点（1pt = 4/3 px），**不是** Apple 的逻辑 point——禁止做"网页按钮 32px ≈ 24pt，低于 28pt"这类跨单位推导。
- 正确流程：原生尺寸表（pt）→ 判断意图（这是 hit region / 字号 / 间距？）→ Web 端按意图选 CSS px 值并在项目中记录适配决策。
- 本 skill 的 Web 默认值（均为 `PROJECT-DEFAULT`，可按项目调整）：

| 原生值（HIG） | Web 默认适配 | 说明 |
|---|---|---|
| 按钮 hit region ≥44×44 pt | 点击区域 ≥44×44 CSS px | 用 padding/min-height 补足，而非放大视觉外形 |
| iOS Body 17 pt | 正文 17px（可 rem 化） | 见 typography.md |
| 控件间距约 12/24 pt（官方原文为 about，非精确值） | 紧邻交互元素间距 ≥12px，裸元素 ≥24px | |
| 10px 手势余量（fluid-motion-web.md） | hit slop ~10px | 伪元素扩热区 |

- **参照系**：网页自身的 WCAG 2.2 AA「目标尺寸」条款为 24×24 CSS px 且带间距等例外条件——这是另一套标准，与 Apple 的 28/44 数值并行使用、不要合并成一个"最低值"。

## 1. 原生概念 → Web 映射表

| 原生概念 | Web 适配要点 |
|---|---|
| **point / hit region** | §0 的单位策略；`pointer-events`、伪元素扩热区、触屏 `touch-action: manipulation` 消 300ms 延迟 |
| **Dynamic Type** | 默认架构：文字用相对尺寸（rem/em/无单位行高）、文本容器优先自适应高度、布局允许换行和重新分栏、应用内字号设置按产品需要增加；若产品提供应用内字号（A+/A−），可用全局系数（如 `--dt`）+ `calc(基准 × var(--dt))` 实现，至少验到 200% 放大不破版不截断，大字号下内联项改堆叠布局。验证：页面级 A+/A− 或浏览器字号缩放实测 |
| **语义色 label/systemBackground** | CSS custom properties 定义两套值：`[data-theme="dark"]` + `@media (prefers-color-scheme: dark)`（auto 档）；提供 Increase Contrast 近似（`prefers-contrast: more` 提对比）；只提供产品实际支持的外观；单一浅色产品保持 `color-scheme: light`，不额外引入暗色主题 |
| **Safe Area** | `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` + `env(safe-area-inset-top/bottom/left/right)` 用于 fixed 头尾的 padding；无刘海环境的普通留白不混用 env() |
| **Sheet / 弹窗** | 模态语义不止是动画：`role="dialog"` + `aria-modal`、打开时焦点移入、焦点圈定（keyboard trap）内、Esc/关闭按钮可达、关闭后焦点还原触发元素、背景对读屏不可交互（`inert` 或等价）。弹簧动画只是外壳 |
| **Liquid Glass** | `backdrop-filter: blur() saturate()` 是**视觉近似**：`-webkit-` 前缀按目标浏览器决定（Safari 18 已支持无前缀版本，只需兼容更旧 Safari 时才加）；提供降级（`@supports not (backdrop-filter:…)` → 更高不透明度实底）；`prefers-reduced-transparency: reduce` → 去模糊提实底；可读性永远优先于玻璃效果 |
| **Haptics** | `navigator.vibrate` 仅 Android 支持；桌面/ iOS Safari 无效——视觉/听觉反馈必须独立成立，不能依赖触感 |

## 2. 无障碍验收（Web 口径）

- 对比度按 **W3C WCAG** 判定：普通文字（含小字号粗体）≥4.5:1；大号文字（≥24 CSS px 常规 / ≥约 18.67 CSS px 粗体）≥3:1。Apple Accessibility 页的"Bold 任意字号 3:1"仅适用于原生平台口径（见 accessibility.md 的冲突说明）。
- 三个媒体查询都要响应：`prefers-reduced-motion`（滑移→交叉淡化，**不改变组件显隐状态**）、`prefers-reduced-transparency`（玻璃→实底）、`prefers-contrast: more`（提对比+明确边线）。
- 键盘可达：所有**功能**键盘可达、可见 focus 态、`:focus-visible` 而非全局 outline 移除。复合组件（Tabs、菜单、网格）通常采用"组件间 Tab、组件内方向键"的漫游焦点模式；Enter/Space 的激活语义按元素与交互模式处理（button 用 Enter+Space、链接用 Enter、ARIA 模式按 APG 对应示例），不能统一套用。

## 3. 最低验收基线（本 skill 的工程约定，非 Apple 规定）

区分两类验收，不要混淆：

- **skill 维护**：用固定示例（设置页/模态 sheet/拖拽播放器）验证**规则与脚本本身**——这三个页面是 skill 的回归样例。
- **用户项目交付**：验收**该项目实际存在的**页面与关键流程。用户要一个数据工作台，就不应为验收额外造一个播放器。

交付用户项目时，对实际页面跑 detail-audit.md 的矩阵：浅/深色、字号放大（≥200% 或项目支持的最大档）、纯键盘操作、读屏要点（dialog role/focus）、reduced-motion、动画中断，外加该项目自身的空态/加载/异常状态。报告时区分"已验证"与"未验证"。

## 4. 中文排版与断行（CJK line breaking）

> `WEB-ADAPTATION` + `PROJECT-DEFAULT`。断行问题以中文/中英混排最严重；纯英文页面基本无拆词问题，但过窄容器等场景仍可能产生短行与孤字（检测矩阵对英文文本同样会告警）。生成中文/中英混排页面必须处理，否则出现拆词、孤字行、专名跨行等中文特有的排版事故。

中文词间无空格，浏览器默认可在任意汉字间断行——语法合法但经常难看。四类问题与对策：

**4.1 单行保护要克制**（先保证可读，再谈不拆词）

- **优先单行**：短且长度受控的按钮 / 状态标签 / chip——它们通常本来就该一行放下。
- **允许合理换行**：表头、表单标签、说明文案——折行是合理重排，不是事故；不要为了"绝不换行"把容器撑破。
- **空间不足时先让容器重排**（放宽列宽、调整网格、`flex-wrap:wrap`），不要为保一行给整块文案上 nowrap。

```css
.btn, .tag, .chip { white-space: nowrap; }  /* 短控件：优先单行 */
```

- 事故辨析：四字标签被折成 3+1 行（"模拟开/关"）确实难看——但处置是**让容器放得下或改文案**，不是无条件 nowrap。nowrap 后容器仍装不下时，整项换行，不允许挤压拆词。
- flex 行内文字最易被压拆（flex item 默认收缩）：给必须保完整的项 `flex:none`，容器加 `flex-wrap:wrap` 让装不下的项整体换行。

**4.2 段落防孤字行、防标点行首**

```css
p, .intro, .note { text-wrap: pretty; }   /* 末行不孤立单字/短词（渐进增强） */
h1, h2, h3      { text-wrap: balance; }   /* 标题均衡分行（渐进增强） */
body            { line-break: strict; }   /* 强化 CJK 避头尾禁则 */
```

- 事故形态：整段最后一行只剩"洁。"两个字。
- **禁止**对正常文案使用 `word-break: break-all`——它在汉字任意处断行并破坏标点禁则，是不规范换行的头号来源；只配用于 URL、哈希等无词边界的字符串。
- `overflow-wrap: anywhere` 是**应急断行机制**（长字符串无其他断点时的最后手段），与 `break-all` 不是同一种行为，必要时可用；但正常中文文案应靠合理换行与局部 nowrap，而不是依赖它。
- `text-wrap: pretty/balance` 对 CJK 无词边界信息，是缓解而非保证；关键句仍被拆时用 4.3 的 nowrap 单元兜底。

**4.3 关键单元不跨行**（中文文本内嵌的英文专名、数值+单位）

```css
.nw { white-space: nowrap; }
```

- 英文专名整体不拆：`<span class="nw">App Icon</span>`、`<i class="nw">Designing Fluid Interfaces</i>`。
- 英文缩写与其紧邻中文语义单元粘住：`<span class="nw">HIG 原文</span>`——中文夹英文缩写时该组合常被空格断点拆开。
- 数值+单位用 `&nbsp;`：`44&nbsp;pt`、`17&nbsp;pt`、`200&nbsp;%`。
- nowrap 单元的宽度必须能容纳于最窄目标视口（按 320px 宽、200% 字号验算）；超长单元先拆成更小的语义片段再保护。

**4.4 标点**

- 中文文本内的引号用全角 “ ” ‘ ’（半角引号贴汉字过紧、观感破碎）；英文短语内部用半角。
- 中英之间的视觉留白可用普通半角空格，其带来的断点问题按 4.3 处理。

**验收**：320px 窄视口 + 200% 字号下检查——**内容完整可读是底线**（不截断、不溢出、专名与数值+单位完整、无行首标点）；无拆词、无孤字行是**优化目标**，不与可读性冲突时优先达成——不要为消灭孤字行改坏正常布局。折行相关问题按 `detail-audit.md` 的分级验收口径处置（阻断清零、警告逐项复核）。
