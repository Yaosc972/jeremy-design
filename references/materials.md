# Materials(材料,含 Liquid Glass)
> 来源: https://developer.apple.com/design/human-interface-guidelines/materials
> 整理自 Apple HIG 原文(2026-09 抓取)。规范条目忠实原文,未新增规则。

Material(材料)是一种视觉效果,在前景与背景元素之间创造深度感、层次感和层级关系。材料让文本、控件等前景元素与内容、纯色等背景元素在视觉上分离;通过允许颜色从背景透到前景,材料建立视觉层级,帮助人们更容易保持方位感。

Apple 平台有两类材料:**Liquid Glass** 和 **standard materials(标准材料)**。Liquid Glass 是统一 Apple 平台设计语言的动态材料,让你在不遮挡底层内容的前提下呈现控件与导航;与之相对,Standard materials 用于内容层内的视觉区分。

## Liquid Glass

Liquid Glass 为控件和导航元素(tab bar、sidebar 等)构成一个独立的功能层,浮于内容层之上,在功能元素与内容之间建立清晰的视觉层级。内容可以从这些元素下方滚动并探出 (peek through),赋予界面动感与深度,同时保持控件和导航的可读性。

- **不要在内容层 (content layer) 使用 Liquid Glass。** Liquid Glass 最适合在交互元素与内容之间提供清晰区分;把它放进内容层会导致不必要的复杂性和混乱的视觉层级。内容层内的元素(如 App 背景)应改用 Standard materials。**例外**:内容层中带瞬态交互元素的控件,如 Sliders 和 Toggles——用户激活时该元素呈现 Liquid Glass 外观,以强调其可交互性。
- **克制使用 Liquid Glass 效果。** 系统框架的标准组件会自动获得这种材料的外观与行为;若把 Liquid Glass 效果应用于自定义控件,务必克制。Liquid Glass 的目的是把注意力引向底层内容,在多个自定义控件上滥用这种材料会分散注意力、造成欠佳的用户体验。**把这些效果限制在 App 中最重要的功能元素上。**(开发者指引见 Applying Liquid Glass to custom views)
- **仅对出现在视觉丰富背景之上的组件使用 clear Liquid Glass。** Liquid Glass 提供两个变体——regular 与 clear——供构建自定义组件或样式化部分系统组件时选择。这两个变体的外观会响应某些系统设置而变化,例如用户在设备设置中选择 Liquid Glass 的偏好外观,或开启降低透明度、提高对比度等辅助功能设置。
  - **regular 变体**:模糊并调整背景内容的亮度 (luminosity),以保持文本等前景元素的可读性。Scroll edge effects(滚动边缘效果)进一步通过模糊并降低背景内容不透明度来增强可读性。大多数系统组件使用该变体。当背景内容可能造成可读性问题,或组件包含大量文本(如 alerts、sidebars、popovers)时,使用 regular。
  - **clear 变体**:高度半透明,适合优先展示底层内容、确保视觉丰富的背景元素保持突出。用于浮在媒体背景(如照片和视频)之上的组件,以创造更有沉浸感的内容体验。
  - 为获得最佳对比度与可读性,需决定是否在 clear Liquid Glass 组件后面加 dimming layer(变暗层):
    - 如果底层内容较亮,考虑添加**不透明度 35% 的深色 dimming layer**。
    - 如果底层内容足够暗,或使用 AVKit 的标准媒体播放控件(自带 dimming layer),则无需再添加。
  - 颜色使用规范见《color-dark-mode.md》的 "Liquid Glass color" 一节。

## Standard materials

使用标准材料与效果——如 UIBlurEffect、UIVibrancyEffect、NSVisualEffectView.BlendingMode——在 Liquid Glass 下方的内容中传达结构感。

- **基于语义含义和推荐用法选择材料与效果。** 避免按材料给界面带来的表面颜色来选材料,因为系统设置会改变材料的外观和行为;应把材料或 vibrancy style 与具体用例匹配。
- **在材料之上使用 vibrant colors(活力色)以确保可读性。** 使用系统定义的 vibrant colors 时,无需担心颜色在不同语境下过暗、过亮、过饱和或对比度过低。无论选择哪种材料,其上都应使用 vibrant colors。(参见 System colors)
- **选择与 blur 和 vibrancy 效果组合的材料时,考虑对比度与视觉分离。** 例如:更厚的材料更不透明,可为文本等精细元素提供更好的对比;更薄的材料更半透明,通过让底层内容可见,帮助人们保持上下文。(开发者指引见 Material)

## 平台差异

### iOS、iPadOS
除 Liquid Glass 外,iOS 和 iPadOS 继续提供四种标准材料——ultra-thin、thin、regular(默认)、thick——可用于内容层以创建视觉区分。

iOS 和 iPadOS 还为 labels、fills、separators 定义了 vibrant colors,专门配合每种材料使用。Labels 和 fills 有多个 vibrancy 层级;separators 只有一个层级。层级名称表示元素与背景之间的相对对比度:默认层级对比度最高,quaternary(如存在)最低。

除 quaternary 外,以下 vibrancy 值可用于任何材料上的 labels;一般而言,避免在 thin 和 ultraThin 材料上使用 quaternary,因为对比度过低:
- UIVibrancyEffectStyle.label(默认)
- UIVibrancyEffectStyle.secondaryLabel
- UIVibrancyEffectStyle.tertiaryLabel
- UIVibrancyEffectStyle.quaternaryLabel

以下 vibrancy 值可用于所有材料上的 fills:
- UIVibrancyEffectStyle.fill(默认)
- UIVibrancyEffectStyle.secondaryFill
- UIVibrancyEffectStyle.tertiaryFill

系统为 UIVibrancyEffectStyle.separator 提供单一的默认 vibrancy 值,适用于所有材料。

### macOS
macOS 提供多种有指定用途的标准材料,并为所有规格提供 vibrant 版本。(开发者指引见 NSVisualEffectView.Material)

- **决定自定义视图与控件何时允许 vibrancy。** 视配置和系统设置而定,系统视图和控件会使用 vibrancy 让前景内容在任何背景上凸显。在多种语境下测试界面,发现 vibrancy 何时能提升观感、改善沟通。
- **选择与界面设计互补的背景混合模式 (blending mode)。** macOS 定义了两种混合背景内容的模式:behind window 和 within window。(开发者指引见 NSVisualEffectView.BlendingMode)

### tvOS
在 tvOS 上,Liquid Glass 遍布导航元素和系统体验(如 Top Shelf 和 Control Center)。某些界面元素(如 image view 和 button)在获得焦点时会采用 Liquid Glass 外观。

除 Liquid Glass 外,tvOS 继续提供标准材料,可用于在内容层中定义结构。标准材料的厚度影响底层内容透出的显著程度。可参考以下用法:

| 材料 | 推荐用途 |
|---|---|
| ultraThin | 需要浅色方案的全屏视图 |
| thin | 部分遮挡屏幕内容且需要浅色方案的 overlay 视图 |
| regular | 部分遮挡屏幕内容的 overlay 视图 |
| thick | 部分遮挡屏幕内容且需要深色方案的 overlay 视图 |

### visionOS
visionOS 中,窗口通常使用名为 glass 的不可修改的系统定义材料,让光线、当前 Environment、虚拟内容和用户周围的物体透出来,帮助人们保持方位感。glass 是自适应材料:它限制背景颜色信息的范围,使窗口能继续为 App 内容提供对比度,同时随人们的物理环境和其他虚拟内容变亮或变暗。

> **Note:** visionOS 没有独立的 Dark Mode 设置;glass 会自动适配其后方物体与颜色的亮度。

- **窗口中优先半透明,而非不透明颜色。** 不透明区域会遮挡视线,让人感到局促,降低对周围虚拟和物理对象的感知。
- **必要时,选择帮助你创建视觉分隔或指示可交互性的材料。** 如果需要创建自定义组件,可能要为其指定系统材料。参考示例:
  - thin 材料能吸引对交互元素(按钮、选中项)的注意;
  - regular 材料可帮助视觉分隔 App 的不同区域(如 sidebar 或分组表格视图);
  - thick 材料可创建深色元素,叠在使用 regular 背景的区域之上时仍保持视觉可辨。

为确保前景内容显示在材料之上时保持可读,visionOS 对文本、符号和 fills 应用 vibrancy——通过把虚拟与物理环境中的光和颜色向前牵引来增强深度感。visionOS 定义了三个 vibrancy 值,用于表达文本、符号和 fills 的层级:
- UIVibrancyEffectStyle.label 用于标准文本;
- UIVibrancyEffectStyle.secondaryLabel 用于描述性文本(如脚注、副标题);
- UIVibrancyEffectStyle.tertiaryLabel 用于非活动元素,且仅在文本不需要高可读性时使用。

### watchOS
- **在全屏 modal 视图中用材料提供上下文。** watchOS 中全屏 modal 视图很常见,材料层提供的对比能帮助人们在 App 中定位,并把控件、系统元素与其他内容区分开。modal sheet 默认提供的材料背景,不要移除或替换。

---

## 数值速查

| 主题 | 数值/规则 |
|---|---|
| clear Liquid Glass 的 dimming layer | 底层内容较亮时:不透明度 35% 的深色层 |
| 不需要 dimming layer 的情形 | 底层内容足够暗;或使用 AVKit 标准媒体播放控件(自带 dimming layer) |
| Liquid Glass 变体 | regular(模糊+调亮度,多数系统组件)、clear(高度半透明,媒体背景) |
| 内容层中带瞬态交互的控件 | Sliders、Toggles——激活时才呈现 Liquid Glass 外观 |
| iOS/iPadOS 标准材料 4 级 | ultra-thin / thin / regular(默认) / thick |
| iOS labels vibrancy 层级 | label(默认,对比最高)/ secondaryLabel / tertiaryLabel / quaternaryLabel(对比最低) |
| iOS quaternaryLabel 限制 | 避免用于 thin 和 ultraThin 材料(对比过低) |
| iOS fills vibrancy 层级 | fill(默认)/ secondaryFill / tertiaryFill |
| iOS separators vibrancy | 单一默认层级,适用所有材料 |
| macOS 混合模式 | behind window / within window |
| tvOS 材料选择 | ultraThin=浅色全屏;thin=浅色 overlay;regular=overlay;thick=深色 overlay |
| visionOS 窗口材料 | glass(不可修改、自适应,无 Dark Mode 设置) |
| visionOS vibrancy 3 值 | label=标准文本;secondaryLabel=脚注/副标题;tertiaryLabel=非活动元素(不要求高可读性) |
