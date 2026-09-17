# 流体动效与手势（Fluid Interfaces → Web 实现参数）

> **来源链**：Apple WWDC 设计演讲（核心为 *Designing Fluid Interfaces*, WWDC 2018；另含 *The Details of UI Typography* WWDC 2020、*Principles of Great Design* WWDC 2026、*Designing Audio-Haptic Experiences*）→
> **适配**：改编自 [emilkowalski/skills](https://github.com/emilkowalski/skills) 的 `apple-design` skill（MIT License, © Emil Kowalski），中文转译并按本 skill 体系重排。
> **性质**：本文件是**演讲转译的实现参数**，与 HIG 文档规范**互补**——HIG 文档只给原则，不含弹簧/手势/投影的具体数值（这正是本文件存在的原因）。
> **适配说明**：省略原 skill 的 "Initial Response" 行为指令（skill 入口话术，不适用于 reference 文件）；§16 八项原则为 WWDC 2026 演讲版全译，与 `design-principles.md`（HIG 文档版）互为补充。

## 0. 核心思想（through-line）

> "当界面顺应人们的思考与运动方式时，奇妙的事情发生了——它不再像一台计算机，而像身体的延伸。"

界面有生命感 = 运动从**当前在屏值**开始、继承用户速度、沿动量前进、**任何瞬间都能抓住并反向**。弹簧是实现这一切的工具：天然可中断、天然速度感知。

界面有流体感 = 像物理世界：即时响应、连续移动、携带动量、边界有阻力、运动中可改向。以下每条都在逼近这一点。

## 1. 响应——消灭延迟

延迟一出现，"直接感"断崖式下跌。响应是其余一切的地基。

- **在 pointer-down 响应，不要等释放。** 按下的瞬间就高亮按钮；等 `click`/touch-up 才反馈就是延迟。
- **审计每一条延迟**：防抖、人工定时器、transition 等待、~300ms 点击延迟。输入路径上非必需的延迟都是倒退。
- **反馈必须连续贯穿交互全程**，不是只发生在结束时。拖拽/滑杆/抽屉要 1:1 跟手，绝不能"手势结束才动"。

```css
/* 反馈发生在按下，且即时 */
.button:active { transform: scale(0.97); transition: transform 100ms ease-out; }
```

## 2. 直接操纵——1:1 跟手

> "触控与内容一起移动。"

拖拽的元素必须贴着手指——并且**尊重从哪里抓住的**（grab offset）。抓住时吸附到元素中心会立刻破坏错觉。

- Pointer Events + `setPointerCapture`，指针离开元素边界仍持续跟踪。
- 维护一个短**速度/位置历史**（最近几次 pointermove），松手时算释放速度要用。
- 关键数字：**tap 目标加 ~10px 手势余量（hysteresis）**；方向拖拽先设 ~10px 阈值再定方向，然后 1:1。

```js
el.addEventListener('pointerdown', (e) => {
  el.setPointerCapture(e.pointerId);
  const grabOffset = e.clientY - el.getBoundingClientRect().top; // 尊重抓取点
  // ...记录 [时间, 位置] 历史，松手算速度
});
```

## 3. 可中断性——最重要的单条原则

> "想法与手势是并行的。"

每个动画都必须能随时中断、随时改向。用户必须能抓住飞行中的元素并反向，而不必等动画播完。正在关闭的 sheet 被再次抓住时应该跟手指走——不是先关完再重新打开。

- **过渡期间绝不锁输入。**
- **永远从 presentation（当前在屏）值开始动画，绝不从目标值开始。** 中断时读取元素在屏 transform 作为新起点；从逻辑/目标值开始 = 可见跳变。
- **手势驱动的运动不要用 CSS transition / @keyframes**——无法在飞行中被平滑抓住反向。弹簧默认从当前值出发，正是中断需要的。
- **手势反向时融合速度，不要硬切。** 换动画时速度不连续 = "撞墙"。选择能在重定目标时**携带速度**的 spring 库（iOS 的 additive animations 原生就是这种行为）。
- **2D 运动分解为独立的 X/Y 弹簧**——单一弹簧挂在 2D 距离上，X/Y 速度不同就会失步。

## 4. 用弹簧，别用时长动画

> "把动画想成你与物体的对话，不是界面规定的剧本。"

固定时长的预设动画无法响应新输入。弹簧可以：新输入只是改变目标，运动保持连续。用户碰得到的一切都用弹簧。

Apple 用两个设计师友好的参数替代 mass/stiffness/damping 三元组。按这两个思考：

- **Damping ratio（阻尼比 ζ）**——控制过冲。`1.0` = 临界阻尼，无弹跳平滑落定；`< 1.0` 会过冲振荡；越低越弹。
- **Response（响应时间 T）**——多快接近目标（秒）。越低越脆。**这不是"时长"**——弹簧没有固定时长，落定时间由参数涌现。

**默认值（`APPLE-EXAMPLE`：WWDC 2018《Designing Fluid Interfaces》原始建议）**：
- 演讲明确建议**从 100% damping（ζ 1.0，无过冲）起步**——优雅、不抢戏。
- **手势本身携带动量时才加弹跳**（ζ ~0.8；演讲以 Music 滑动关闭为例演示 80% damping）。菜单淡入就过冲不对；卡片被甩出去才过冲对。注意：这是演讲本身的建议，不是第三方现代改写。
- 演讲中出现的具体参数组合属**特定案例演示**，不应上升为跨组件、跨平台的统一默认值；"0.4 用于大距离移动"等更细的归档值未在可核实的原始材料中精确定位，**按待核实处理**，使用前自行验证。

**演讲演示的示例组合**（均为演讲案例值，非通用规范）：

| 交互 | ζ | T |
|---|---|---|
| Move / 重定位（如画中画） | 1.0 | 0.4 |
| Rotation | 0.8 | 0.4 |
| Drawer / sheet | 0.8 | 0.3 |

**Web 映射（Motion / Framer Motion）——两种弹簧不可混用（`WEB-ADAPTATION`）**：

| 类型 | 配置方式 | 能否纳入手势/既有速度 |
|---|---|---|
| 物理弹簧 | `stiffness` / `damping` / `mass` | **能**——拖拽释放、甩动、动画中重抓必须用这个 |
| 时长型弹簧 | `duration` / `bounce` | **不能**——只用于非手势的入场、强调动画 |

```js
import { animate } from 'motion';
// 非手势入场/强调：时长型可以（bounce 0 ≈ 临界阻尼观感）
animate(el, { y: 0 }, { type: 'spring', bounce: 0, duration: 0.4 });
// 拖拽释放/甩动：必须物理弹簧并维护当前位置与速度——duration 型会丢掉释放速度，违背 §5
animate(el, { y: t }, { type: 'spring', stiffness: 300, damping: 30, velocity: gestureVelocity });
```

**⚠️ 命名陷阱**：Apple 语境的阻尼比 `ζ`（0–1，1.0=临界阻尼）与 Motion 的参数名 `damping`（物理阻尼系数，与 stiffness/mass 配套）**不是同一个量**——不能把 ζ=0.8 直接写成 `damping: 0.8`。ζ→物理参数换算（m=1，response T）：ω₀=2π/T，`stiffness=ω₀²`，`damping=2ζω₀`。

## 5. 速度传递——拖拽与动画之间无接缝

手势结束时，动画必须**以手指的精确速度继续**——拖拽与动画之间没有可见接缝。这是"流体"与"还行"最大的分界。

把指针释放速度作为弹簧初速度。有些 spring API 要**相对速度**——按剩余距离归一化：

```
relativeVelocity = gestureVelocity / (targetValue − currentValue)
```

例：元素 y=50、目标 y=150（还差 100px）、手指 50px/s → 初速 = 50/100 = 0.5。（Framer Motion / Motion 直接收绝对 px/s，用 `velocity` 选项。）

## 6. 动量投影——动画到手势"要去的地方"

> "小输入，大输出。"

不要从释放点吸附到最近边界。用速度**投影出落点**（与滚动减速同理），再吸附到离投影点最近的目标。这才是"甩"的感觉。

Apple 的投影函数（演讲示例代码；**指数衰减式，不是教科书 v²/2a**）：

```js
// decelerationRate ≈ 0.998 = UIScrollView .normal；0.99 = .fast
function project(initialVelocity, decelerationRate = 0.998) {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}
const projected = current + project(v);
const target = nearestSnapPoint(projected);   // 从投影选目标，不从释放点选
animateSpringTo(target, { velocity: v });     // §5 速度传递
```

> decelerationRate 数值可溯源：`UIScrollView.decelerationRate` normal=0.998 / fast=0.99（UIKit 头文件，Apple 文档页未印数值）。这套"投影→选目标"是优质 bottom-sheet / carousel 库（Vaul、Embla）的标准行为。

## 7. 空间一致性——对称路径、锚定来源

> "从哪儿消失，就从哪儿回来。"

- **进与出走同一条路**。右侧滑入的 panel 从右侧滑出。右进下出 = 脱节。
- **交互锚定触发源**。菜单/弹层从触发它的元素发起——`transform-origin` 指向触发元素，按钮与内容的从属关系一目了然。
- **可反向的过渡镜像 easing**（去与回用互逆的 cubic-bézier 控制点）。

## 8. 沿手势方向预示

人从轨迹预测终态。中间运动要指向结果——控制中心模块"朝手指方向长出来"。中间帧要指向终点，不是盲目插值。

## 9. 橡皮筋——软边界

边界处渐进阻力，不要硬停。硬停 = "冻住了"；连续阻力 = "响应了，但没更多了"。越拖过界阻力越大。

```js
// 出界越远跟随越少——真物体会减速后才停
function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
```

> 可溯源：常数 0.55 与该公式见于 WebKit 源码 `ScrollController.mm`（前身为 ScrollElasticityController.mm）及 UIScrollView 逆向（私有方法 `_rubberBandOffsetForOffset:`）。emil 公式与 WebKit 公式代数等价。

## 10. 手势细节（"手感"清单）

- **Tap**：按下即高亮（即时），抬起才提交。目标四周加 ~10px 手势余量；允许拖开取消、拖回恢复。
- **Drag/swipe**：先 ~10px 阈值（hysteresis）再定方向，然后 1:1。
- **从第一次移动就并行检测所有合理手势**，意图明确后果断取消输家。避免只报告终态的识别器（`swipeleft` 类事件）——它们丢弃了反馈所需的连续跟踪。
- **最小化消歧延迟**。双击检测必然延迟单击；只在真的有双击的地方付这个成本。

## 11. 帧级流畅度

流畅度在于**帧里装了什么**，不只是帧率。

- 每帧位置变化量低于感知阈值，避免频闪。
- 高速运动配轻微**运动模糊/拉伸**编码速度，比硬锐条纹观感好。
- `requestAnimationFrame` 是 web 的 display 同步时钟（对应 CADisplayLink）。只动合成器友好属性——`transform` / `opacity`，运动将至时 `will-change` 提示。

## 12. 材质与深度——半透明承载层级（web 实现）

Apple 用半透明材质做悬浮功能层：提供结构而不抢焦点。Web 用 `backdrop-filter` 近似。

- **导航/工具栏/sheet 做半透明层**（`backdrop-filter: blur()` + 半透明底），内容从下方滚过——不是占一条固定条的实心 bar。
- **材质轻重编码层级**：更深更重的材质分隔结构区（sidebar）；更轻的材质突出交互元素。**绝不在半透明面上叠半透明面**——可读性崩塌。
- **大表面读作更厚**：更强的 blur + 更深的阴影（相对小 chip）。阴影随内容上下文：繁忙文字上更重，素背景上更轻。
- **调暗以聚焦，分离以保流**：模态任务 = 表面 + 变暗 scrim + 背景后推。并行非阻塞面板 = 半透明 + 位移、无 scrim。层叠 sheet 逐层渐暗后推。
- **Vibrancy 保文字可读**：毛玻璃上别用平灰文字——更高对比、略加重字重、字距微增；颜色放实底层，不放半透明前景层。
- **Scroll edge effect，不要硬分割线**：sticky 头下别画 1px 边线，在内容与悬浮 chrome 交界处做渐隐 blur/渐变——只在悬浮 UI 真正压住内容处。
- **材质化入场，不要只淡入**：玻璃面进出场时 blur 半径与 scale 一起动，读作"真实材料到达"，不是纯 opacity 淡入淡出。

```css
.toolbar {
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgba(255,255,255,0.4); /* 亮顶边 = 材质受光 */
}
```

## 13. 多模态反馈——运动+声音+触感

来自 *Designing Audio-Haptic Experiences*，三条组合规则：

1. **因果**——反馈来源必须显而易见。在真实因果事件上触发（开关翻转、项目归位），特性匹配动作的物理感。
2. **和谐**——视觉、声音、触感必须**同帧**触发。它们之间的延迟毁掉错觉；别让 CSS transition 落后于声音/触感（Vibration API）。
3. **实用**——只在值得的地方加。haptic/声音留给有意义时刻（成功、错误、提交、归位）。过度反馈训练用户忽略一切。

## 14. Reduced motion 与无障碍

Reduced motion ≠ 无反馈——是**更温和的非前庭等效**。响应三个独立信号并内建到组件：

- **`prefers-reduced-motion: reduce`**——滑移/弹簧/视差 → 短 opacity 交叉淡化或静态过渡；去掉弹性过冲；保留有助于理解的 opacity/color 变化。
- **`prefers-reduced-transparency: reduce`**——半透明面变"冻"实：提底色不透明度、去 blur。
- **`prefers-contrast: more`**——近实底 + 明确对比边线。
- 另：避免全屏运动背景、慢循环振荡（~0.2 Hz，约 5s 一循环）、暗↔亮主题切换的亮度突跳。大物体移动时半透明；大位移时大表面先淡出落定再淡入。

```css
@media (prefers-reduced-motion: reduce) {
  /* ⚠️ 只改过渡方式，不要改变组件显隐状态：若 sheet 用 transform 表示关闭位
     （如 translateY(100%) 藏于屏下），transform:none!important 会让它常驻可见。
     关闭态应保留定位 transform，仅去掉过渡动画；上线前必须实测显隐正确。 */
  .sheet { transition: opacity 200ms ease; }
}
@media (prefers-reduced-transparency: reduce) {
  .toolbar { background: white; backdrop-filter: none; }
}
```

## 15. 字体——光学尺寸/字距/行高（web 实现）

Apple 让字体随尺寸变形状；web 同理。（*The Details of UI Typography*, WWDC 2020）

- **字距（tracking）是尺寸特定的——绝不一个值打天下**。但**方向取决于字体家族，不存在"大字必负、小字必正"的通用规则**：SF Pro 在 13–23pt 为负、24pt 起转正、80pt+ 归零（完整表见 `typography.md`）；New York 才是 15pt 归零后持续转负。原生运行中的系统字体**自动**按磅值调整 tracking；浏览器 `letter-spacing` 只在需要精确复刻 mockup 时手动设置（`HIG` 区分了这两种场景）。`-0.02em` 之类取值只能作为**项目级视觉调整**（`PROJECT-DEFAULT`），并实测正文、标题及中文等内容。
- **行高与尺寸反向**：大标题紧，正文松。升格脚本（高升部/降部）加大行高；信息密集 UI 收紧行高。
- **层级 = 字重+字号+行高成套设计**，不是只调字号。用字重做强调——增加存在感而不占空间。
- **尊重用户字号设置**（Dynamic Type）：布局随文字缩放——间距用 rem/em，不用固定 px，字号放大不破版。
- **默认平台系统字体**：系统字体自带光学尺寸/字距表/易读性调优；有理由才覆盖。

```css
:root { font: 100%/1.5 system-ui, sans-serif; }
.display {
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.05;        /* 大字紧行高 */
  letter-spacing: -0.02em;  /* 项目级视觉调整示例（PROJECT-DEFAULT），非通用规范；SF Pro 大字实际可正可零 */
  font-optical-sizing: auto;
}
```

## 16. 八项设计原则（演讲版全译）

上面的动效与工艺服务于 Apple 的八项设计原则（*Principles of Great Design*, WWDC 2026）。用这些名字做推理语言：

1. **目的（Purpose）**。带着意图做；决定**不做什么**。每个功能都在请求用户的时间、注意力和信任——只花在值得的地方。
2. **自主（Agency）**。让用户保持掌控：提供选择，不强迫单一路径。配套宽恕机制——失误容易撤销；确认弹窗只给真正破坏性、不可逆的操作（**克制使用；滥用会训练用户无脑点穿**）。
3. **责任（Responsibility）**。以用户利益行事。隐私：在恰当的时机问、只要需要的、透明。安全：预见误用与伤害——尤其涉及 AI 时（一个过敏感知的食谱 app 绝不能建议有害成分）。加预览、确认、免责；砍掉风险大于价值的功能。
4. **熟悉（Familiarity）**。建立在人们已知的东西上。用既不太字面也不太抽象的隐喻（垃圾桶 = 删除），并尊重它们的物理性。保持一致：看起来相同的东西必须行为相同、待在相同的位置（**macOS 上 close 永远在左上角**），让人能预测接下来发生什么。只有能证明更好时才打破熟悉模式——要测试，别假设。
5. **灵活（Flexibility）**。为不同情境、设备和全谱系能力设计。适配平台（iPhone = 快速触达；桌面 = 深度工作流 + 精确指针）与场景。包容设计（年龄、语言、熟练度、无障碍）。当没有单一布局适合所有人时，让人个性化——重排控件、隐藏不用的。
6. **简单——不是极简（Simplicity — not minimalism）**。剥掉不必要的让核心目的发光；把所有东西埋进一个地方看起来极简但并不简单。简洁（平实语言、无黑话、更少步骤）且清晰（用层级——顺序、间距、对比——让最重要的最显眼）。每个元素都要挣得自己的位置；有时**加上下文反而是简化**（显示剩余时间的视频进度条）。常见路径放前面，高级选项深一层。
7. **工艺（Craft）**。不妥协的细节关注建立信任。漂亮的排版、随明暗适配的颜色、清晰的图标、给即时自然反馈的响应式动画。**没有什么是随机的**——每个间距、时序、对齐值都是你能为之辩护的深思熟虑的选择。抖动的滚动、错位的图标、旋转后破版的布局读作敷衍。工艺需要迭代与长寿——随功能与硬件变化持续演进设计。
8. **愉悦（Delight）**。做好前七条的结果，不是贴在上面的彩纸。决定你想让人感受什么情绪（平静、自信、兴奋），并在每个决策里强化它。

**服务这些原则的战术规则**（演讲版可操作增量，HIG 文档版没有）：

- **反馈四类**：status、completion、warning、error。确认有意义动作、暴露进行中状态、问题前预警、**行内校验（不是提交时）**。
- **寻路（wayfinding）**：每屏回答——我在哪？能去哪？有什么？怎么出去？绝不困住用户。
- **分组与映射**：邻近暗示关联；控件放在它影响的东西旁边，排列镜像它们改变的对象。需要标签解释控件 = 映射弱。
- **具体标签胜过安全泛称**：导航按内容命名（"Progress"、"Library"），不用模糊伞（"Home"）。具体 = 可预测。

## 17. 过程

- **交互式原型——一个可交互 demo 胜过一百万张静态图**。在构建与把玩中发现界面；可用原型也立起防止平庸落地的具体标尺。
- **交互与视觉一起设计**，"你分不清哪是交互哪是视觉"。动效不是像素之后再贴的一层。
- **真实情境真人测试**；动效复看用新眼睛——慢放/逐帧看全速时看不见的问题。

## 快速参考表

| 需求 | 技术 | 具体值 |
|---|---|---|
| 默认 UI spring | 临界阻尼无过冲 | ζ `1.0`，T `0.3–0.4`（WWDC18 原始建议即 ζ1.0 起步） |
| 动量/甩动 spring | 欠阻尼小弹跳 | ζ `~0.8`，T `0.3–0.4`（演讲以 Music 滑动关闭为例） |
| Web 弹簧选型 | 手势链路用物理弹簧 | Motion：`stiffness/damping/mass`(+`velocity`)；`duration/bounce` 型**不带速度**，仅限非手势动画；**ζ≠`damping` 参数** |
| 手势→spring 速度 | 传递释放速度 | `v/(target−current)` 若需相对速度 |
| 甩动落点 | 动量投影 | `current + (v/1000)·d/(1−d)`，`d ≈ 0.998`（normal）/ 0.99（fast） |
| 干净中断 | 从 presentation 值出发 | 读在屏 transform |
| 反向不"撞墙" | 重定目标携带速度 | 可融合速度的 spring |
| 可反向过渡 | 镜像 easing | 互逆 cubic-bézier |
| 反向 or 提交 | 用速度**符号**判断 | 释放时 |
| 1:1 拖拽 | Pointer Events + capture | 尊重 grab offset |
| 反馈 | pointer-down 即时、全程连续 | 不只在结束时 |
| 边界 | 橡皮筋不硬停 | `(x·d·c)/(d+c·\|x\|)`，c=0.55 |
| 半透明 chrome | `backdrop-filter` 层 | 内容从下滚过 |
| 字距 | 尺寸+字体特定 | 无通用"大字必负"规则；SF Pro 13–23pt 负、24pt 起转正；覆盖时标 `PROJECT-DEFAULT` 并实测 |
| Reduced motion | 交叉淡化替代滑移/弹簧 | `@media (prefers-reduced-motion)` |

---

*MIT License：本文件改编自 [emilkowalski/skills](https://github.com/emilkowalski/skills)（© Emil Kowalski），可依 MIT 条款再分发；数值口径以本文标注为准。*
