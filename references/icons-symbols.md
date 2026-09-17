# 图标与 SF Symbols（App Icons & SF Symbols）

> 来源: https://developer.apple.com/design/human-interface-guidelines/app-icons 、 https://developer.apple.com/design/human-interface-guidelines/sf-symbols
> 整理自 Apple HIG 原文（2026-09 抓取）。规范条目忠实原文，未新增规则。

---

## 一、App Icons

一个独特、令人难忘的 App Icon 能表达 app 或游戏的用途与个性，帮助人们一眼认出它。App Icon 是品牌与用户体验的关键部分，出现在 Home Screen 及系统各关键位置（搜索结果、通知、系统设置、share sheets 等）。

### 1.1 Layer design（图层设计）

虽然可以提供扁平化图片作为图标，但使用图层（layers）能最大程度控制图标的呈现效果。分层 App Icon 组合出纵深感与活力，各平台系统会施加响应环境与交互的视觉特效。

- **iOS / iPadOS / macOS / watchOS**：图标由一个 background layer 加一个或多个 foreground layers 组合产生立体感。这些图标呈现 Liquid Glass 属性（specular highlights、refraction、translucency）。特效随图标尺寸自动适配、跨平台一致，且可能随系统版本呈现差异。
- **tvOS**：图标使用 2–5 个图层营造动感。聚焦时图标随遥控器手指移动而抬升至前景，表面被照亮并轻轻摇摆；图层间的分离与透明度在 parallax 效果中产生深度感。
- **visionOS**：图标包含一个 background layer 加上方一至两个图层，形成一个人们注视时会轻微扩展的三维物体。系统通过在层间添加阴影表达深度，并利用上方图层的 alpha channel 制造浮雕效果。
- 制作工具：用熟悉的设计工具制作 foreground layers；iOS/iPadOS/macOS/watchOS 图标需导入 Icon Composer（Xcode 内置，亦可从 Apple Developer 网站下载），在其中定义背景层、调整前景层位置、施加 specular highlights 与 refraction 等特效、标注 default/dark/mono 外观变体、跨系统版本测试预览并导出。tvOS 与 visionOS 图标则直接在 Xcode 的 image stack 中叠加图层；可用 Apple Design Resources 提供的 Parallax Previewer 与 Parallax Exporter 插件预览 parallax 效果。

**Best practices（图层设计）：**

- **Prefer clearly defined edges in foreground layers.**（前景层应使用清晰定义的边缘。）为确保系统绘制的高光与阴影效果最佳，避免前景层形状出现柔和、羽化的边缘。
- **Vary opacity in foreground layers to increase the sense of depth and liveliness.**（通过前景层的不透明度变化增加深度感与活力。）例如 Photos 图标将中心部分拆为多个含半透明碎片的图层。建议导入完全不透明的图层，再在 Icon Composer 中调整透明度，以便预览透明度与系统特效的相互影响并据此调整设计。
- **Design a background that both stands out and emphasizes foreground content.**（背景既要突出又要衬托前景内容。）若背景层使用渐变，须确保其对系统光照效果响应良好。Icon Composer 支持纯色与渐变背景，多数情况下无需导入自定义背景图；若确需导入背景层，必须 full-bleed 且不透明。
- **Prefer vector graphics when bringing layers into Icon Composer.**（导入 Icon Composer 时优先使用矢量图形。）矢量（SVG、PDF）可优雅缩放、任意尺寸都清晰。设计时将文字转为轮廓（outline）。mesh gradient 与位图素材优先用 PNG（无损格式）。

### 1.2 Icon shape（图标形状）

图标形状因平台视觉语言而异：iOS/iPadOS/macOS 图标为方形，系统应用遮罩产生与其他系统圆角界面元素及设备边框曲率精确一致的圆角；tvOS 图标为矩形，同样具有同心圆角；visionOS 与 watchOS 图标为方形，系统应用圆形遮罩。

- **Produce appropriately shaped, unmasked layers.**（提供形状正确、未预遮罩的图层。）系统对所有图层边缘应用遮罩以生成最终形状。iOS/iPadOS/macOS 提供方形图层（由系统加圆角）；visionOS/watchOS 提供方形图层（由系统生成圆形）；tvOS 提供矩形图层（由系统加圆角）。自带预遮罩的图层会损害 specular highlight 效果并使边缘呈锯齿状。
- **Keep primary content centered to avoid truncation when the system adjusts corners or applies masking.**（主要内容保持居中，避免系统调整圆角或应用遮罩时被裁切。）visionOS 与 watchOS 图标尤其注意内容居中。可使用 Apple Design Resources 中 app icon 生产模板里的网格辅助摆放。

### 1.3 Design（设计原则）

拥抱简洁。简单图标最易理解与识别。细节精细的图标在系统阴影和高光下可能显得杂乱，小尺寸下细节难以分辨。找到能捕捉 app 或游戏精髓的概念或元素，作为图标核心，用尽可能少的形状以简单、独特的方式表达。背景宜简洁（纯色或渐变），突出主体设计——无需填满整个图标画布。

- **Provide a visually consistent icon design across all the platforms your app supports.**（在支持的所有平台上保持图标视觉一致。）一致的设计帮助人们快速找到你的 app，避免被误认为多个不同的 app。
- **Consider basing your icon design around filled, overlapping shapes.**（可考虑以填充式、相互重叠的形状构建图标。）前景中重叠的实心形状，配合透明度与模糊，可带来纵深感。
- **Include text only when it's essential to your experience or brand.**（仅在图标文字对体验或品牌必不可少时使用文字。）图标内文字不支持无障碍与本地化，通常小到难以阅读，且易显杂乱。许多场景下 app 名称已显示在旁边，再在图标里重复即显冗余。虽然展示首字母等助记符号有助于识别，但应避免加入非必要的指令性词汇（如 "Watch"、"Play"）或语境性词汇（如 "New"、"For visionOS"）。若在 tvOS 图标中使用文字，必须置于其他图层之上，以免被 parallax 效果裁切。
- **Prefer illustrations to photos and avoid replicating UI components.**（优先使用插画而非照片，避免复刻 UI 组件。）照片细节繁多，在不同外观下显示、小尺寸查看或拆分为图层时效果不佳。应改用突出关键特征的图形化表达。避免极细线条与尖锐转角——它们在更小尺寸、更低分辨率下易丢失细节与锐度。若 app 有高辨识度的界面，也不要直接复刻标准 UI 组件或在图标中使用 app 截图。
- **Don't use replicas of Apple hardware products.**（不得使用 Apple 硬件产品的复制品。）Apple 产品受版权保护，不能出现在 App Icon 中。

### 1.4 Visual effects（视觉特效）

- **Let the system handle blurring and other visual effects.**（让系统处理模糊及其他视觉特效。）系统会动态地为图标图层应用视觉特效，无需自备 specular highlights、层间投影、斜面边缘、模糊、光晕等效果。自定义特效不仅会与系统特效冲突，而且是静态的，而系统提供的是动态特效。若确要在图层上加入自定义特效，必须有意为之，并用 Icon Composer、Device Hub 中的模拟设备或真机仔细测试，确保显示符合预期且不与系统特效冲突。
- **Create layer groupings to apply effects to multiple layers at once.**（创建图层分组以同时对多层施加特效。）系统特效通常作用于单个图层；若设计需要，可在 Icon Composer 或设计工具中将多个图层编组，让特效作用于组级别。对分组，Icon Composer 提供额外的 Liquid Glass 特效自定义选项，可配置 specular highlights、refraction、translucency 等属性。

### 1.5 Appearances（外观变体）

在 iOS、iPadOS、macOS 上，用户可选择 Home Screen 图标外观为 default、dark、clear 或 tinted（例如配合壁纸个性化）。可为每种外观设计专属变体；未提供的变体由系统自动生成。

- **Keep your icon's features consistent across appearances.**（各外观下保持图标核心特征一致。）为获得连贯体验，default、dark、clear、tinted 四种外观下应保持图标核心视觉特征相同。避免制作在各变体间换入换出元素的自定义变体——那会让用户切换外观时更难找到你的 app。
- **Design dark and tinted icons that feel at home beside system app icons and widgets.**（设计能与系统图标和 widget 和谐并存的 dark 与 tinted 图标。）可以保留 default 图标的配色，但注意 dark 图标更为低沉，clear 与 tinted 更甚。优秀的 App Icon 在任何外观变体下都可见、易读、可识别。
- **Use your light app icon as the basis for your dark icon.**（以浅色图标为基础设计深色图标。）选择能呼应 default 设计的互补色，避免过度明亮的图像。色彩背景通常在 dark 图标中对比度最佳。
- **Consider offering alternate app icons.**（考虑提供 alternate app icons。）在 iOS、iPadOS、tvOS 及 visionOS 中兼容运行的 app 上，可让用户在 app 设置中选择图标的替代版本（如体育 app 提供不同球队图标）。若提供此能力，确保每个图标与你的内容和体验紧密相关，避免做出可能被误认为其他 app 的图标。

> **Note:** iOS/iPadOS 的 alternate app icons 需要各自的 dark、clear、tinted 变体。与 default 图标一样，所有 alternate 与变体图标均须通过 app review 并遵守 App Review Guidelines。

### 1.6 Platform considerations（平台差异）

- **tvOS** — **Include a safe zone to ensure the system doesn't crop your content.**（预留 safe zone 防止系统裁切内容。）图标聚焦时，系统会在图标缩放与移动过程中裁切边缘内容。为保证图标内容始终可见，四周须保留 safe zone。注意 safe zone 大小随图片尺寸、图层深度与运动而变化，且系统对前景层的裁切多于背景层。
- **visionOS** — **Avoid adding a shape that's intended to look like a hole or concave area to the background layer.**（避免在背景层上制作看似孔洞或凹陷的形状。）系统添加的阴影与 specular highlights 会让这种形状凸出而非凹进。
- **watchOS** — **Avoid using black for your icon's background.**（避免用黑色作图标背景。）应将黑色背景调亮，以免图标融入屏幕背景。
- iOS / iPadOS / macOS：无额外要求。

### 1.7 Specifications（规格）

| Platform | Layout shape | 系统遮罩后的图标形状 | Layout size | Style | Appearances |
|---|---|---|---|---|---|
| iOS, iPadOS, macOS | Square | Rounded rectangle (square) | 1024x1024 px | Layered | Default, dark, clear light, clear dark, tinted light, tinted dark |
| tvOS | Rectangle (landscape) | Rounded rectangle (rectangular) | 800x480 px | Layered (Parallax) | N/A |
| visionOS | Square | Circular | 1024x1024 px | Layered (3D) | N/A |
| watchOS | Square | Circular | 1088x1088 px | Layered | N/A |

系统会自动缩放图标生成较小变体，用于 Settings、通知等位置。

支持的色彩空间：
- sRGB（彩色）
- Gray Gamma 2.2（灰度）
- Display P3（广色域，仅 iOS/iPadOS/macOS/tvOS/watchOS）

---

## 二、SF Symbols

SF Symbols 提供与 San Francisco 系统字体无缝集成的完整符号库，在所有字重与字号下自动与文本对齐。凡界面图标可出现之处（toolbars、tab bars、context menus、文本内嵌）都可用 symbol 传达对象或概念。

单个符号及特性的可用性取决于目标系统版本：某一年引入的符号与特性在更早的操作系统中不可用。

可从 SF Symbols 官网下载 app 浏览全部符号。须了解使用条款，包括禁止将符号（或与之混淆性相似的画面）用于 App Icon、logo 或其他任何商标用途。

### 2.1 Rendering modes（渲染模式）

SF Symbols 提供四种渲染模式，为符号上色提供多种选择。为支持渲染模式，SF Symbols 将符号的路径组织为不同 layer（例如 `cloud.sun.rain.fill` 分为 primary（云）、secondary（太阳及光线）、tertiary（雨滴）三层）。

- **Monochrome** — 对符号所有图层施加一种颜色。路径渲染为指定颜色，或作为纯色填充路径中的透明形状。
- **Hierarchical** — 对所有图层施加一种颜色，并按各层级的层次关系改变颜色不透明度，形成给符号带来深度的视觉层级。
- **Palette** — 为符号施加两种或以上颜色，每层一色。为定义了三个层级的符号只指定两色时，secondary 与 tertiary 层使用同一颜色。
- **Multicolor** — 为部分符号施加内在颜色以增强含义。例如 `leaf` 用绿色对应现实中的叶子，`trash.slash` 用红色警示数据丢失。部分 multicolor 符号包含可接收其他颜色的图层。

无论哪种渲染模式，使用系统提供的颜色都能让符号自动适配无障碍设置及 vibrancy、Dark Mode 等外观模式。

**Confirm that a symbol's rendering mode works well in every context.**（确认渲染模式在每个上下文中表现良好。）符号尺寸、与背景色的对比度等因素都会影响细节可辨性。可用 automatic 设置取得符号的首选渲染模式，但仍应检查结果，判断换一种渲染模式是否能提升可读性。

### 2.2 Gradients（渐变）

SF Symbols 7 及以后版本支持 gradient rendering：从单一源色生成平滑线性渐变。渐变可用于所有渲染模式、系统色与自定义色、以及自定义符号；任意尺寸的符号均可渲染渐变，但在较大尺寸下效果最佳。

### 2.3 Variable color（变量颜色）

Variable color 可表达随时间变化的特征（如容量、强度），且不受渲染模式限制：当数值在 0–100% 间跨越不同阈值时，变量颜色将颜色施加到符号的不同图层。

例如 `speaker.wave.3` 用变量颜色表达三档音量加静音：将表示声波曲线的图层映射到不同分贝区间；无声时无任何图层着色，其余情况下音量达到系统按非零状态数定义的阈值时对应波层着色。符号的部分图层可选择退出变量颜色（如 speaker 本体不随音量变化），一个符号可在任意数量图层上支持变量颜色。

**Use variable color to communicate change — don't use it to communicate depth.**（变量颜色用于表达变化，不要用它表达深度。）表达深度与视觉层级应使用 Hierarchical 渲染模式来突出某些图层、区分符号的前景与背景元素。

### 2.4 Weights and scales（字重与比例）

- SF Symbols 提供 9 种符号字重（ultralight 到 black），每种对应 San Francisco 系统字体的一种字重，实现符号与相邻文本的精确字重匹配，同时兼顾不同尺寸与语境的灵活性。
- 每个符号还有 3 种比例：small、medium（默认）、large。比例以 San Francisco 系统字体的 cap height 为基准定义。
- 指定比例可调整符号相对相邻文本的强调程度，而不破坏与同 point size 文本的字重匹配。

### 2.5 Design variants（设计变体）

SF Symbols 定义了 fill、slash、enclosed 等设计变体，帮助在保持视觉一致与简洁的同时传达精确的状态与动作：slash 变体表示项目或操作不可用，fill 变体表示选中。

- Outline 是最常见的变体：无实心区域，外观近似文本。多数符号另有 fill 变体（部分形状内部为实心）。
- 除 outline 与 fill 外，还有 slash 变体及将符号围入圆形/方形/矩形的 enclosed 变体；许多情况下 enclosed、slash 可与 outline、fill 组合。
- SF Symbols 为拉丁、阿拉伯、希伯来、印地、泰、中文、日文、韩文、西里尔、天城文及多种印度数字系统等语言与文字系统提供大量专属变体，设备语言变化时自动适配。

变体的设计用途举例：
- outline 变体适合 toolbars、lists 等符号与文本并排的场景。
- 围入形状（方、圆）的符号可提升小尺寸下的可读性。
- fill 变体的实心区域带来更强的视觉强调，适合 iOS tab bars、swipe actions 及用 accent color 表达选中的场景。

多数情况下由显示符号的视图决定用 outline 还是 fill，无需自行指定：iOS tab bar 偏好 fill，toolbar 偏好 outline。

### 2.6 Animations（动画）

SF Symbols 提供一组富表现力、可配置的动画，帮助传达想法、对用户操作给出反馈、指示状态变化或进行中的活动。动画作用于库中所有 SF Symbols（全部渲染模式、字重、比例）及自定义符号；可控制播放（一次性播完或无限重复直至条件满足），并可自定义播放速度、重复前是否反向等行为。

动画类型：

- **Appear** — 符号逐渐显现。
- **Disappear** — 符号逐渐隐去。
- **Bounce** — 短暂地以弹性运动缩放符号（向上或向下）后回到初始状态；默认播放一次，可传达某个动作已发生或需要执行。
- **Scale** — 改变符号大小（增或减）。与会回到原状的 bounce 不同，scale 效果持续存在直至设置新比例或移除；可用于吸引注意选中项，或作为用户选择符号的反馈。
- **Pulse** — 随时间改变符号不透明度；默认只对标注了 pulse 的图层生效，也可选择所有图层。适合传达进行中的活动，可持续播放直至条件满足。
- **Variable color（动画）** — 逐层改变图层不透明度，分 cumulative（累积，颜色变化逐层保留至一个动画周期完成）与 iterative（迭代，逐层依次发生）两种。适合表达进度或进行中的活动（播放、连接、广播等）。可配置 autoreverse（反向回起点再重播）及隐藏非活动图层而非降低其不透明度。图层排列决定重复动画的行为：起止点不闭合的线性图层为 *open loop*，起止点闭合（如环形进度指示器）的为 *closed loop*——closed loop 符号的变量颜色动画可无缝连续播放。
- **Replace** — 将一个符号替换为另一个；适用于任意符号、所有字重与渲染模式。三种配置：Down-up（旧符号缩小、新符号放大，传达状态变化）、Up-up（新旧都放大，传达带前进感的状态变化）、Off-up（旧符号立即隐藏、新符号放大，强调下一个可用状态或动作）。
- **Magic Replace** — 在形状相关的两个符号间执行智能过渡（如 slash 划入划出、badge 出现消失，或独立于基础符号替换）。Magic Replace 是新的默认 replace 动画，但不作用于不相关符号——此时回落到默认的 down-up 动画，可为回落动画选择自定义方向。
- **Wiggle** — 符号沿方向轴来回摆动。可用于突出用户可能忽略的变化或行动号召，也可为交互增加动态强调或强化符号含义（如箭头指向）。
- **Breathe** — 平滑地增强与减弱符号的存在感，赋予其生命感。适合表达状态变化或正在进行的活动（如录制中）。与 pulse 相似，但 pulse 只改变不透明度，breathe 同时改变不透明度与大小。
- **Rotate** — 旋转符号作为视觉指示或模拟现实中物体的行为（如任务进行中用旋转确认正常运转）。部分符号整体旋转，部分只有局部旋转（如桌面风扇用 By Layer 选项只转扇叶）。
- **Draw On / Draw Off**（SF Symbols 7 及以后）— 符号沿路径经过一组引导点绘制，从屏外到屏内（Draw On）或从屏内到屏外（Draw Off）。可一次绘制全部图层、错峰绘制或逐层绘制。适合传达进度（下载）或强化符号含义（方向箭头）。

动画使用原则：

- **Apply symbol animations judiciously.**（克制地使用符号动画。）一个视图可加的动画数量没有上限，但过多动画会让界面失焦、分散注意力。
- **Make sure that animations serve a clear purpose in communicating a symbol's intent.**（确保动画在传达符号意图上有明确目的。）每种动画都有各自表达某类动作或引发某类响应的运动方式；考虑用户如何解读动画符号，动画或动画组合是否会令人困惑。
- **Use symbol animations to communicate information more efficiently.**（用符号动画更高效地传达信息。）动画提供视觉反馈，强化"界面上发生了什么"；可用动画以简单方式呈现复杂信息，而不占用大量视觉空间。
- **Consider your app's tone when adding animations.**（添加动画时考虑 app 的语气。）思考动画能传达什么，如何与品牌标识及 app 整体风格、语气保持一致。

### 2.7 Custom symbols（自定义符号）

SF Symbols 没有的符号可以自制：先导出相近符号的 template，再用矢量编辑工具修改。

> **Important:** SF Symbols 中描绘 Apple 产品与功能的符号受版权保护：可在 app 中展示，但不可自定义。SF Symbols app 会为不可自定义的符号标记 Info 图标，并在 inspector 面板说明使用限制。

通过 *annotating*（标注）可为自定义符号的每个图层指定特定颜色或特定层级（primary/secondary/tertiary）；根据支持的渲染模式，app 中该符号的每个实例可使用不同模式。

自定义符号 best practices：

- **Use the template as a guide.**（以模板为准绳。）自定义符号应与系统符号在细节程度、视觉字重（optical weight）、对齐、位置、透视上保持一致。力求设计出：Simple（简洁）、Recognizable（易识别）、Inclusive（包容）、Directly related to the action or content it represents（与所代表的操作或内容直接相关）的符号。
- **Assign negative side margins to your custom symbol if necessary.**（必要时为自定义符号设置负侧边距。）SF Symbols 支持负侧边距，用于符号含 badge 等加宽元素时实现光学的水平对齐（例如一排 folder 符号中部分带 badge）。边距名称含具体配置（如 "left-margin-Regular-M"），添加边距须遵循此命名模式。
- **Optimize layers to use animations with custom symbols.**（优化图层以支持自定义符号动画。）若要按图层动画，须在 SF Symbols app 中标注图层。Z-order 决定变量颜色符号各图层上色的顺序，可选择从前往后或从后往前动画；也可按图层组动画，让相关图层一起运动。
- **Test animations for custom symbols.**（测试自定义符号的动画。）务必用全部动画预设测试自定义符号——图层运动时形状与路径的呈现可能不符预期。建议用完整形状绘制：例如与 `person.2.fill` 相似的自定义符号不必为左侧人形挖空，而是画出完整人形，再画右侧人形的偏移路径表达间隙，之后把该偏移路径标注为 erase layer 即可按预期渲染；这种画法保留额外图层信息，让动画符合预期。
- **Avoid making custom symbols that include common variants, such as enclosures or badges.**（避免在自定义符号中直接包含围合、badge 等常见变体。）SF Symbols app 提供组件库（component library）生成自定义符号的变体，可保持与内置 SF Symbols 的设计一致性。
- **Provide alternative text labels for custom symbols.**（为自定义符号提供替代文本标签。）替代文本标签（即无障碍描述）让 VoiceOver 能描述可见 UI 与内容，方便视障用户导航。
- **Don't design replicas of Apple products.**（不得设计 Apple 产品的复制品。）Apple 产品受版权保护，不能出现在自定义符号中；也不能自定义被 SF Symbols 标识为代表 Apple 功能或产品的符号。

---

## 三、Web 项目图标落地（Web 图标库）

> **性质**：`WEB-ADAPTATION` + `PROJECT-DEFAULT`。SF Symbols 是 Apple 平台资源（字体与符号受 Apple 许可限制，**不可用于 Web 分发**），Web 项目需用观感近似的开源图标库。本节是本 skill 选定的落地工程约定，**不声称与 SF Symbols 等效**。

### 3.1 选型（本 skill 默认）

| 库 | 许可 | 规模 / 风格 | 定位 |
|---|---|---|---|
| **Lucide**（lucide.dev） | ISC，商用免费 | 1600+ 图标；24×24 网格、纯 outline 线性风格、默认 `stroke-width: 2`，颜色/线宽/尺寸均可调 | **Web 图标主选**：线性观感最接近 SF Symbols outline；有 npm（`lucide` / `lucide-static` / 各框架包） |
| useAnimations（useanimations.com） | 代码 MIT；站点声明**禁止 AI 训练其内容** | 90+ 动画图标（Lottie JSON），32px 网格，Feather 同源线性风 | **仅动画图标场景**：加载、成功、空状态等状态反馈。本 skill 只作选型指向、不收录其素材 |
| Rune Icons（runeicons.com） | Apache 2.0 | 900+ 图标；五种风格（outline / duotone / fill / pixel / glass），24px 网格 | 备选：需要 duotone / fill 变体时（Lucide 只有 outline）。较新站点，交付前自行验证 |

选型规则：默认 Lucide；仅当需要"动画化状态图标"时看 useAnimations；仅当需要填充/双色调变体时看 Rune。**同一界面只用一套**——三者笔画风格、网格、圆角语言不同，混用即失去体系一致性。

### 3.2 SF 字重 → stroke-width 映射（`PROJECT-DEFAULT`）

SF Symbols 靠字重匹配实现"符号与相邻文本字重一致"（§2.4）；Web 近似做法是让 SVG 的 `stroke-width` 跟随文本字重。下表为本 skill 的工程映射（按 24px 显示尺寸；Lucide 24 网格、默认 2 对应 medium 档）：

| SF 字重对应 | stroke-width（24px 显示尺寸） |
|---|---|
| ultralight | 1.0 |
| thin | 1.25 |
| light | 1.5 |
| regular | 1.75 |
| medium | 2.0（Lucide 默认） |
| semibold | 2.25 |
| bold | 2.5 |
| heavy | 2.75 |
| black | 3.0 |

- 显示尺寸非 24px 时线宽随缩放等比变化；要保持视觉线宽恒定，按 `目标线宽 × 24 ÷ 显示像素` 换算，或对该元素用 `vector-effect: non-scaling-stroke`（此时 `stroke-width` 直接以 CSS px 生效）。
- 常规正文旁用 regular–medium 档；与 semibold 标题并列时升到 semibold；细档（ultralight–light）只用于大尺寸装饰，勿用于小图标（同 typography 的细字重原则）。
- 同屏图标统一取一个档位，不逐图标微调——§2.4 的字重匹配是"与文本一致"，不是"每个图标各自最美"。

### 3.3 集成方式（以 Lucide 为例）

1. **内联 SVG（单文件 / 需精细控制）**：从 lucide.dev 图标页复制 SVG 源码直接粘贴。零依赖、属性可改。
2. **CDN（无构建项目）**：
   ```html
   <script src="https://unpkg.com/lucide@latest"></script>
   <i data-lucide="camera"></i>
   <script>lucide.createIcons();</script>
   ```
   `data-lucide` 元素会被替换为 `<svg>`；动态插入的图标需再次调用 `createIcons()`。具体 API 以 lucide.dev/guide 为准。
3. **npm（工程化项目）**：`npm i lucide`（vanilla）或 `lucide-react` / `@lucide/vue` 等框架包；只要原始 SVG 文件则用 `lucide-static`（`icons/camera.svg`）。

### 3.4 使用原则

- **颜色随文本**：图标用 `stroke="currentColor"`（Lucide 默认即此），与相邻文本同色、跟随语义色与 Dark Mode；不给图标单独硬编码颜色，警示等语义色除外。
- **尺寸与热区分离**：正文旁图标视觉 16–20px 即可，但**可点击图标的命中区域仍 ≥44×44 CSS px**（web-adaptation §0），用 padding / 伪元素补足。
- **变体语义对齐 §2.5**：outline = 默认与工具栏；表达"选中"用强调色或 fill 风格——Lucide 为纯 outline，选中态可用 Rune 的 fill 风格或自绘填充版，勿以描边变粗冒充 fill。
- **动画克制且可降级**：动画图标只用于传达状态与反馈（加载、成功、连接中），不作装饰；遵循 §2.6 的"明确目的"原则，并响应 `prefers-reduced-motion`（减动效时用静态终态替代）。
- **无障碍**：纯装饰图标 `aria-hidden="true"`；独立承担语义的图标（无文字标签）必须给 `aria-label` 或可见文本，对齐 §2.7 的 alt text 要求。
- **商标**：与 §2.7 一致——不得用任何图标库复刻 Apple 产品，也不得用作 App Icon / logo。
- **不用 emoji 充图标**：UI 图标不得用 emoji（见 SKILL.md 反模式）；emoji 只可作内容、不作界面图标。

---

## 数值速查

### App Icons 尺寸与形状

| 项 | 数值/规格 |
|---|---|
| iOS / iPadOS / macOS 图标 layout size | 1024x1024 px，Square → 系统遮罩为 Rounded rectangle (square)，Layered |
| tvOS 图标 layout size | 800x480 px，Rectangle (landscape) → Rounded rectangle (rectangular)，Layered (Parallax) |
| visionOS 图标 layout size | 1024x1024 px，Square → Circular，Layered (3D) |
| watchOS 图标 layout size | 1088x1088 px，Square → Circular，Layered |
| tvOS 图层数 | 2–5 层（parallax 动感 + 聚焦抬升） |
| visionOS 图层数 | background layer + 上方 1–2 层（3D，注视时轻微扩展） |
| tvOS safe zone | 图标四周预留安全区（随图片尺寸/图层深度/运动变化，前景层裁切多于背景层）；文字须置于顶层避免 parallax 裁切 |
| 外观变体（iOS/iPadOS/macOS） | Default、dark、clear light、clear dark、tinted light、tinted dark；未提供的变体系统自动生成 |
| 色彩空间 | sRGB（彩色）、Gray Gamma 2.2（灰度）、Display P3（广色域，仅 iOS/iPadOS/macOS/tvOS/watchOS） |
| 图层文件格式 | 矢量优先 SVG/PDF；mesh gradient 与位图用 PNG（无损）；背景层如导入须 full-bleed 且不透明 |
| 外观标注 | 在 Icon Composer 中标注 default、dark、mono 三种外观变体 |

### SF Symbols 关键数值

| 项 | 数值/规格 |
|---|---|
| 字重 | 9 种：ultralight → black，逐一对应 San Francisco 字体字重（精确 weight matching） |
| 比例 | 3 种：small / medium（默认）/ large，以 SF 字体 cap height 为基准 |
| 渲染模式 | 4 种：Monochrome、Hierarchical、Palette、Multicolor |
| 符号层级 | primary / secondary / tertiary 三层（Palette 仅给 2 色时 secondary 与 tertiary 同色） |
| Variable color 范围 | 0–100% 按阈值跨层着色 |
| 渐变 | SF Symbols 7+，单一源色生成平滑线性渐变；任意尺寸可用，大尺寸效果最佳 |
| Draw On / Draw Off | SF Symbols 7+ |
| 动画类型 | Appear、Disappear、Bounce、Scale、Pulse、Variable color、Replace（down-up / up-up / off-up）、Magic Replace、Wiggle、Breathe、Rotate、Draw On / Draw Off |
| 商标限制 | 不得将 SF Symbols（或混淆性相似图像）用于 App Icon、logo 或其他商标用途；Apple 产品符号可展示不可自定义 |

### Web 图标（`WEB-ADAPTATION` / `PROJECT-DEFAULT`）

| 项 | 数值/规格 |
|---|---|
| 默认图标库 | Lucide：ISC 许可、1600+ 图标、24×24 网格、纯 outline、默认 stroke-width 2 |
| 字重 → 线宽映射 | stroke-width 1.0–3.0 九档、步进 0.25（ultralight→black，medium=2 为 Lucide 默认；见 §3.2） |
| 图标显示尺寸（正文旁） | 16–20px（可点击图标热区仍 ≥44×44 CSS px） |
| 动画图标库 | useAnimations（Lottie；仅状态反馈场景；站点禁止 AI 训练其内容，本 skill 不收录素材） |
| 填充/双色调备选 | Rune Icons（Apache 2.0，900+，五风格） |
