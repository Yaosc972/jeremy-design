# Color 与 Dark Mode
> 来源: https://developer.apple.com/design/human-interface-guidelines/color https://developer.apple.com/design/human-interface-guidelines/dark-mode
> 整理自 Apple HIG 原文(2026-09 抓取)。规范条目忠实原文,未新增规则。

---

## 一、Color

审慎使用颜色可以增强沟通、唤起品牌感、提供视觉连续性、传达状态与反馈,并帮助人们理解信息。系统定义的颜色在各种背景和外观模式下都表现良好,并能自动适配 Vibrancy 与辅助功能设置——使用 system colors 是让体验自然融入设备的最便捷方式。自定义颜色则可用于表达 App 或游戏的独特个性;无论使用系统色还是自定义色,以下规范均适用。

### 1.1 最佳实践

- **避免用同一种颜色表示不同含义。** 在整个界面中一致地使用颜色,尤其当颜色承担传达状态或可交互性等信息职责时。例如:如果用品牌色表示无边框按钮是可交互的,再用相同或相近颜色去修饰不可交互的文本,就会造成困惑。
- **确保 App 的所有颜色在浅色、深色(Dark Mode)和高对比度三种语境下都表现良好。** iOS、iPadOS、macOS 和 tvOS 都提供浅色与深色外观设置;系统色会随系统外观微妙变化,以保证文本、符号等元素的区分度和对比度。开启 Increase Contrast 后,颜色差异会显著加大。尽可能使用 system colors(已为所有语境定义变体)。自定义颜色必须提供浅色和深色变体,并为每个变体提供提高视觉区分度的 increased contrast 变体。**即使 App 只按单一外观模式发布,也要同时提供浅色与深色两组颜色,以支持这些语境下的 Liquid Glass 自适应性。**
- **在多种光照条件下测试 App 配色。** 阳光下颜色显得更深、更灰暗,暗环境中则显得更亮、更饱和;visionOS 中颜色还会随墙面/物体的颜色及其反光方式而变化。应让 App 颜色在大多数使用场景下呈现最佳效果。
- **在不同设备上测试 App。** True Tone 显示屏(部分 iPhone、iPad、Mac 机型)会根据环境光自动调整白点;以阅读、照片、视频、游戏为主的 App 可通过指定白点自适应样式(见 UIWhitePointAdaptivityStyle)增强或减弱该效果。tvOS App 要在多品牌 HD 和 4K 电视、不同显示设置下测试;Mac 上可在"系统设置 > 显示器"中切换 P3 与 Standard RGB (sRGB) 等 color profile 测试外观。
- **考虑图像和半透明对邻近颜色的影响。** 图像的变化有时需要调整邻近颜色以维持视觉连续性(如 Maps 在地图模式用浅色方案、卫星模式切换为深色方案)。颜色位于工具栏等半透明元素之后或施加于其上时,观感也会不同。
- **如果 App 允许用户挑选颜色,优先使用系统提供的取色控件。** 内置取色器体验一致,且用户保存的一组颜色可在任何 App 中使用(见 ColorPicker)。

### 1.2 包容性颜色 (Inclusive color)

- **避免仅靠颜色区分对象、指示可交互性或传达关键信息。** 用颜色传达信息时,务必以替代方式(文本标签、字形等)提供同样信息,让色盲或其他视觉障碍用户也能理解。
- **避免使用让内容难以感知的颜色。** 对比度不足会让图标和文本与背景混在一起难以阅读;色觉障碍者也可能无法区分某些颜色组合(参见 Accessibility)。
- **考虑颜色在其他国家和文化中的含义。** 例如红色在某些文化中表示危险,在另一些文化中却有积极含义;确保 App 的颜色传达的是你想要的信息。

### 1.3 System colors(系统颜色)

- **避免在 App 中硬编码系统色值。** 文档中的色值仅供设计过程参考,实际值可能随版本和各种环境变量波动;应使用 `Color` 等 API 应用系统颜色。
- **避免重新定义 dynamic system colors 的语义。** 动态系统色按用途(而非外观或色值)语义化定义,自动适配浅色与深色语境。请按原意使用,例如不要把 separator 色当文本色,不要把 secondaryLabel 色当背景色。

### 1.4 Liquid Glass color(Liquid Glass 的颜色)

Liquid Glass 默认本身没有颜色,而是呈现其正后方内容的颜色;也可以给部分 Liquid Glass 元素上色,使其呈现彩色玻璃(stained glass)观感——适合强调特定控件(如主操作),系统对突出按钮的样式正是这种做法。Liquid Glass 上的符号或文本标签也可以有颜色。

对于工具栏、标签栏等较小元素,系统可让 Liquid Glass 依据底层内容在浅色与深色外观之间自适应:其上的符号和文本默认采用单色方案——底层内容偏浅时变深,偏深时变浅。而 sidebar 等较大元素中 Liquid Glass 会更不透明,以便在复杂背景上保持可读性并承载更丰富的表面内容。

- **克制地给 Liquid Glass 材料本身以及其上的符号或文本上色。** 如果要用色,只留给真正受益于强调的元素(如状态指示器或主操作)。强调主操作时,给背景上色而非给符号或文本上色——例如系统把 App accent color 用于"完成"等突出按钮的背景,以吸引注意、提升视觉分量。**不要给多个控件的背景都加色。**
- **App 背景色彩丰富时,避免控件标签使用相近颜色。** 颜色过多会让人难以阅读控件标签。背景或内容视觉丰富的 App,其工具栏和标签栏宜采用单色外观,或选择视觉区分度足够的 accent 色;反之,内容或背景以单色为主的 App,把品牌色设为 accent color 是有效的个性化方式,可体现公司身份。
- **注意内容层中颜色的位置。** 尽量避免内容层与控件之间出现相近颜色重叠,保证界面有足够对比度。色彩丰富的内容虽然可能间歇性滚动到控件下方,但必须保证其默认/静止状态(如可滚动内容的顶部)保持清晰可读。

### 1.5 Color management(色彩管理)

- 色彩空间 (color space) 表示 RGB、CMYK 等色彩模型中的颜色;常见色彩空间(也称色域 gamut)有 sRGB 和 Display P3。color profile 用公式或数据表描述色彩空间中的颜色;图像内嵌其 color profile,设备据此正确解读并在显示器上还原颜色。
- **为图像应用 color profile。** 有助于 App 颜色在不同显示器上按预期呈现;sRGB 色彩空间在大多数显示器上颜色准确。
- **在兼容显示器上使用 wide color 增强视觉体验。** Wide color 显示器支持 P3 色域,能产生比 sRGB 更丰富饱和的颜色,让照片视频更逼真、数据可视化和状态指示更有意义。适当时使用 Display P3 color profile、每通道 16 bit,并以 PNG 格式导出图像。注意:需要 wide color 显示器才能设计 wide color 图像和挑选 P3 颜色。
- **必要时提供按色彩空间区分的图像与颜色变体。** 一般而言 P3 颜色和图像在 sRGB 显示器上显示正常,但偶尔两个非常接近的 P3 颜色在 sRGB 显示器上难以区分,P3 渐变也可能被裁剪。可用 Xcode asset catalog 为每种色彩空间提供不同版本的图像和颜色。

### 1.6 平台差异

#### iOS、iPadOS
iOS 定义了两组动态背景色——system 与 grouped,各含 primary、secondary、tertiary 三级变体用于传达信息层级。有分组表格视图时用 grouped 系列(systemGroupedBackground、secondarySystemGroupedBackground、tertiarySystemGroupedBackground),否则用 system 系列(systemBackground、secondarySystemBackground、tertiarySystemBackground)。两级均按以下方式表达层级:primary 用于整体视图;secondary 用于整体视图内的分组;tertiary 用于 secondary 元素内的分组。

前景内容方面,iOS 定义了以下动态颜色:

| 颜色 | 用途 | UIKit API |
|---|---|---|
| Label | 承载主要内容的文本标签。 | label |
| Secondary label | 承载次要内容的文本标签。 | secondaryLabel |
| Tertiary label | 承载第三层级内容的文本标签。 | tertiaryLabel |
| Quaternary label | 承载第四层级内容的文本标签。 | quaternaryLabel |
| Placeholder text | 控件或文本视图中的占位文本。 | placeholderText |
| Separator | 允许透出部分底层内容的分隔线。 | separator |
| Opaque separator | 不透出底层内容的分隔线。 | opaqueSeparator |
| Link | 作为链接的文本。 | link |

#### macOS
macOS 定义了以下动态系统颜色(也可在标准 Color 面板的 Developer 调色板中查看):

| 颜色 | 用途 | AppKit API |
|---|---|---|
| Alternate selected control text color | 列表或表格中选中表面上的文本。 | alternateSelectedControlTextColor |
| Alternating content background colors | 列表、表格或集合视图中交替行/列的背景。 | alternatingContentBackgroundColors |
| Control accent | 用户在系统设置中选择的强调色。 | controlAccentColor |
| Control background color | 大型界面元素(如浏览器、表格)的背景。 | controlBackgroundColor |
| Control color | 控件的表面。 | controlColor |
| Control text color | 可用控件的文本。 | controlTextColor |
| Current control tint | 系统定义的控件着色。 | currentControlTint |
| Unavailable control text color | 不可用控件的文本。 | disabledControlTextColor |
| Find highlight color | 查找指示器的颜色。 | findHighlightColor |
| Grid color | 表格等界面元素的网格线。 | gridColor |
| Header text color | 表格表头单元格的文本。 | headerTextColor |
| Highlight color | 屏幕上的虚拟光源。 | highlightColor |
| Keyboard focus indicator color | 键盘导航时聚焦控件周围的光环。 | keyboardFocusIndicatorColor |
| Label color | 承载主要内容的标签文本。 | labelColor |
| Link color | 指向其他内容的链接。 | linkColor |
| Placeholder text color | 控件或文本视图中的占位字符串。 | placeholderTextColor |
| Quaternary label color | 重要性低于 tertiary label 的文本(如水印)。 | quaternaryLabelColor |
| Secondary label color | 重要性低于 primary label 的文本(如副标题或补充信息)。 | secondaryLabelColor |
| Selected content background color | key window/视图中选中内容的背景。 | selectedContentBackgroundColor |
| Selected control color | 选中控件的表面。 | selectedControlColor |
| Selected control text color | 选中控件的文本。 | selectedControlTextColor |
| Selected menu item text color | 选中菜单项的文本。 | selectedMenuItemTextColor |
| Selected text background color | 选中文本的背景。 | selectedTextBackgroundColor |
| Selected text color | 选中文本的颜色。 | selectedTextColor |
| Separator color | 内容不同区域之间的分隔线。 | separatorColor |
| Shadow color | 屏幕上凸起物体投下的虚拟阴影。 | shadowColor |
| Tertiary label color | 重要性低于 secondary label 的文本。 | tertiaryLabelColor |
| Text background color | 文本背后的背景色。 | textBackgroundColor |
| Text color | 文档中的文本。 | textColor |
| Under page background color | 文档内容背后的背景。 | underPageBackgroundColor |
| Unemphasized selected content background color | 非 key window/视图中的选中内容。 | unemphasizedSelectedContentBackgroundColor |
| Unemphasized selected text background color | 非 key window/视图中选中文本的背景。 | unemphasizedSelectedTextBackgroundColor |
| Unemphasized selected text color | 非 key window/视图中的选中文本。 | unemphasizedSelectedTextColor |
| Window background color | 窗口的背景。 | windowBackgroundColor |
| Window frame text color | 窗口标题栏区域的文本。 | windowFrameTextColor |

**App accent colors(App 强调色):** macOS 11 起可指定 accent color 定制 App 的按钮、选区高亮和侧栏图标外观。当用户在"通用 > 强调色"设置中选 multicolor 时,系统应用你的 accent color;若用户选了其他强调色,系统会用其所选颜色替换 App 内相关项的颜色。例外:使用固定颜色的 sidebar 图标因其颜色承担语义,不会被用户的强调色设置覆盖(参见 Sidebars)。

#### tvOS
- **考虑选择与 App logo 协调的有限色板。** 克制用色既能传达品牌,又把视觉主角让给内容。
- **避免只用颜色指示焦点。** 元素聚焦时,细微缩放和响应式动画才是表达可交互性的主要方式。

#### visionOS
- **克制用色,尤其在玻璃上。** 标准 visionOS 窗口通常使用系统定义的 glass Materials,物理环境的光线和物体会透过玻璃显示,其颜色会影响窗口中彩色内容的可读性。把颜色用在能引起对重要信息注意、或体现界面各部分关系的地方。
- **优先在粗体文本和大面积区域用色。** 轻量文本或小面积用色会使其更难看清和理解。
- **完全沉浸体验中,保持亮度平衡以维护视觉舒适。** 高对比度有助于聚焦,但当人眼已适应低光或黑暗时也会造成视觉不适。仅当整体视觉环境也明亮时才让内容完全发亮;避免在极暗或纯黑背景上显示明亮物体——尤其当物体闪烁或移动时。

#### watchOS
- **用背景色支持已有内容或补充信息。** 背景色可以建立空间感、帮助识别关键内容(如 Activity 的 Move/Exercise/Stand 圆环各自使用与圆环匹配的背景色)。有信息要传达时才用背景色,不要当作纯视觉装饰;避免在健身、音频播放等可能长时间停留在屏幕上的视图中使用全屏背景色。
- **认识到用户可能希望 graphic complications 使用 tinted mode 而非全彩。** 系统可基于佩戴者选定的单一颜色渲染 complication 的图像、仪表和文本(参见 Complications)。

### 1.7 Specifications(系统色板规格)

> 注:原页面各色值以色板图形呈现,本次抓取的文本未包含具体十六进制值;且 HIG 明确要求勿在 App 中硬编码系统色值,请通过系统 API 取色。

#### System colors
| 名称 | SwiftUI API |
|---|---|
| Red | red |
| Orange | orange |
| Yellow | yellow |
| Green | green |
| Mint | mint |
| Teal | teal |
| Cyan | cyan |
| Blue | blue |
| Indigo | indigo |
| Purple | purple |
| Pink | pink |
| Brown | brown |

visionOS 的 system colors 使用默认深色色值。

#### iOS、iPadOS 系统灰
| 名称 | UIKit API |
|---|---|
| Gray | systemGray |
| Gray (2) | systemGray2 |
| Gray (3) | systemGray3 |
| Gray (4) | systemGray4 |
| Gray (5) | systemGray5 |
| Gray (6) | systemGray6 |

在 SwiftUI 中,`systemGray` 的等价物是 `gray`。

---

## 二、Dark Mode

Dark Mode 是系统级外观设置,用深色调色板为低光环境提供舒适的观看体验。在 iOS、iPadOS、macOS 和 tvOS 上,用户常把 Dark Mode 设为默认界面风格,并普遍期望所有 App 和游戏遵循其偏好。Dark Mode 下系统对所有屏幕、视图、菜单和控件使用深色调色板,还可能加大感知对比度,让前景内容从较深的背景中凸显出来。

### 2.1 最佳实践

- **避免提供 App 专属的外观设置。** App 内的外观选项会让用户多调一处设置;更糟的是,当 App 不响应系统级外观选择时,用户可能以为 App 坏了。
- **确保 App 在两种外观模式下都好看。** 除了手动切换,用户还可以选择 Auto 外观设置,系统会随一天中条件的变化自动在浅色/深色间切换——可能发生在 App 运行过程中。
- **测试内容在两种外观下都保持舒适可读。** 例如在 Dark Mode 下分别和同时开启 Increase Contrast 与 Reduce Transparency,可能发现深色文字在深色背景上可读性下降;Dark Mode 下开启 Increase Contrast 反而可能缩小深色文字与深色背景的视觉对比。视力好的人或许还能读低对比文本,但对许多人来说已不可辨认(参见 Accessibility)。
- **极少数情况下,可考虑仅使用深色外观。** 例如支持沉浸式媒体观看的 App,可以采用永久深色外观,让 UI 隐退、帮助用户专注于媒体本身。

### 2.2 Dark Mode colors(深色模式配色)

Dark Mode 的调色板包含更暗的背景色和更亮的前景色。注意:这些颜色不一定是浅色版的简单反相——许多颜色反相了,有些没有(详见 Specifications)。

- **拥抱能适配当前外观的颜色。** semantic colors(macOS 的 labelColor、controlColor,iOS/iPadOS 的 separator 等)会自动适配当前外观。需要自定义颜色时,在 Xcode asset catalog 中添加 Color Set asset 并指定其亮色与暗色变体。避免使用硬编码色值或不能自适应的颜色。
- **追求所有外观下足够的颜色对比度。** 使用系统定义的颜色有助于在前景与背景之间取得良好对比度。**对比度至少不得低于 4.5:1**;对自定义的前景色与背景色,力求 7:1,尤其是小号文本。该比值确保前景内容从背景中凸显,并帮助内容达到推荐的辅助功能标准。
- **柔化白色背景。** 如果展示的内容图像带有白色背景,考虑把图像稍微调暗,防止其在 Dark Mode 环境中发光。

#### 图标与图像
系统使用 SF Symbols(自动适配 Dark Mode)和针对浅色/深色两种外观优化过的全彩图像。
- **尽可能使用 SF Symbols。** 用动态颜色着色或叠加 vibrancy 时,符号在两种外观下都表现良好(参见 Color)。
- **必要时为浅色和深色外观分别设计界面图标。** 例如描绘满月的图标在浅色背景上可能需要一圈细微的深色描边,在深色背景上则不需要;表示油滴的图标可能需要细边框才能在深色背景上看清边缘。
- **确保全彩图像和图标在两种外观下都好看。** 同一 asset 在两种外观下都好看就复用;只在单一模式下好看,则修改该 asset 或分别创建浅色/深色 asset,并用 asset catalog 把它们合并为一个命名图像。

#### 文本
系统使用 vibrancy 和提高对比度来保持文本在较深背景上的可读性。
- **标签使用系统提供的 label colors。** primary、secondary、tertiary、quaternary 四级标签色会自动适配浅色与深色外观。
- **用系统视图绘制文本框和文本视图。** 系统视图与控件能让文本在所有背景上都表现良好,并自动适配 vibrancy 的有无;尽量用系统视图而非自行绘制文本。

### 2.3 平台差异

> tvOS 无额外注意事项;visionOS 和 watchOS 不支持 Dark Mode。

#### iOS、iPadOS
Dark Mode 下系统使用两组背景色——base 与 elevated——在一层深色界面叠于另一层之上时增强深度感。base 更暗,让背景界面显得后退;elevated 更亮,让前景界面显得前移。

- **优先使用系统背景色。** Dark Mode 是动态的:界面进入前台(如 popover 或 modal sheet)时,背景色自动从 base 切换为 elevated。系统还用 elevated 背景色在多任务环境中分隔 App、在多窗口环境中分隔窗口。使用自定义背景色会让人更难感知这些系统提供的视觉区分。

#### macOS
用户在"通用"设置中选择 graphite 强调色时,macOS 会让窗口背景吸收当前桌面图片的颜色——称为 desktop tinting——一种使窗口与周围内容更和谐融合的微妙效果。

- **适当时,在自定义组件背景中加入一定透明度。** 透明度让组件在 desktop tinting 生效时吸收窗口背景的颜色,即使桌面图片更换也能维持视觉和谐。为达成此效果,只对有可见背景或边框 (bezel) 的自定义组件加透明度,且仅限组件处于中性状态(即不使用颜色的状态)时;组件处于使用颜色的状态时不要加透明度,否则当窗口背景随桌面位置变化或桌面图片更换时,组件颜色会随之波动。

---

## 数值速查

| 主题 | 数值/规则 |
|---|---|
| 对比度下限(所有外观) | 不低于 4.5:1 |
| 对比度目标(自定义前景/背景色,尤其小字) | 力求 7:1 |
| 自定义颜色变体 | 必须提供浅色 + 深色变体;每个变体提供 increased contrast 变体 |
| 单一外观发布的 App | 仍须同时提供浅色与深色颜色(支持 Liquid Glass 自适应) |
| wide color 导出 | Display P3 profile、每通道 16 bit、PNG 格式 |
| App accent color 生效条件 | macOS 11+;用户强调色设为 multicolor 时 |
| iOS 背景色层级 | system / grouped 两组,各 primary、secondary、tertiary |
| iOS 灰色系 | systemGray ~ systemGray6 共 6 级 |
| iOS 前景动态色 | label / secondaryLabel / tertiaryLabel / quaternaryLabel / placeholderText / separator / opaqueSeparator / link |
| Dark Mode 测试组合 | Increase Contrast 与 Reduce Transparency(单独 + 组合) |
| iOS Dark Mode 背景 | base(暗,后退)/ elevated(亮,前移) |
| macOS desktop tinting | 触发条件:用户选择 graphite 强调色 |
| 相关系统设置 | Increase Contrast、Reduce Transparency、Auto 外观、True Tone |
