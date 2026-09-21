# Typography（排版）

> 来源: https://developer.apple.com/design/human-interface-guidelines/typography
> 整理自 Apple HIG 原文（2026-09 抓取）。规范条目忠实原文，未新增规则。

排版选择帮助文字清晰易读、传达信息层级、突出重要内容，并表达你的品牌或风格。

## 读取范围

本文件含千行原生平台规格表，不应为普通 Web 字体任务全文加载。Web 工作台先看 `hras-workbench.md` 与 `web-tokens.md`；明确的原生需求再定位平台、字号档位或字体家族对应章节。可搜索 `Large (default)`、`macOS built-in text styles`、`Tracking values`，不要把所有平台的数字套在一个网页上。

## 保证可读性（Ensuring legibility）

- **使用大多数人都能轻松阅读的字号。** 文字要在各种观看距离与条件下可读。无论自定义字体还是系统字体，都遵循各平台推荐的默认与最小字号，确保文字在所有设备上可读。字重也影响易读性：使用细体（thin weight）的自定义字体时，应以大于推荐值的字号为目标来提升易读性。

| Platform | Default size | Minimum size |
|---|---|---|
| iOS, iPadOS | 17 pt | 11 pt |
| macOS | 13 pt | 10 pt |
| tvOS | 29 pt | 23 pt |
| visionOS | 17 pt | 12 pt |
| watchOS | 16 pt | 12 pt |

- **在不同场景下测试可读性。** 例如游戏文字要在其运行的每个平台上测试可读性。若测试发现部分文字难读，考虑使用更大字号、通过修改文字或背景颜色提高对比，或使用为易读性优化的字体（如系统字体）。
- **一般避免 light（细）字重。** 使用系统字体时优选 Regular、Medium、Semibold 或 Bold，避免 Ultralight、Thin、Light——这些字重难以看清，尤其是文字较小时。

## 传达层级（Conveying hierarchy）

- **按需调整字重、字号与颜色来强调重要信息、帮助人们看见层级。** 当人们调整字号时，务必保持文本元素的相对层级与视觉区分。
- **尽量减少使用的字体（typeface）数量，即使界面高度定制。** 混用太多不同字体会模糊信息层级、妨碍可读性，还会让界面显得内部不一致或设计不佳。
- **响应字号变化时优先处理重要内容。** 人们选择更大字号通常是想让关心的内容更易读，而不总是想放大屏幕上每一个字。例如把字号调大以阅读标签页窗口内容时，人们不期望标签页标题也变大；游戏中人们通常更关心角色的对话，而非瞬时的伤害数字。

## 使用系统字体（system fonts）

Apple 提供两个覆盖大量字重、字号、样式与语言的字体家族：

- **San Francisco (SF)**：无衬线字体家族，包括 SF Pro、SF Compact、SF Arabic、SF Armenian、SF Georgian、SF Hebrew 与 SF Mono 变体。SF Pro、SF Compact、SF Arabic、SF Armenian、SF Georgian、SF Hebrew 还提供 rounded（圆体）变体，可与柔和或圆润的 UI 元素外观协调，或提供另一种排版声音。
- **New York (NY)**：衬线字体家族，可单独使用，也可与 SF 字体搭配使用。

两种字体可在 [developer.apple.com/fonts](https://developer.apple.com/fonts/) 下载。系统以 *variable font*（可变字体）格式提供 SF 与 NY：多种字体样式合并在同一个文件中，并支持样式间插值生成中间样式。

> **Note:** 可变字体支持 *optical sizing*（光学尺寸）——针对不同字号调整字体设计。所有平台的系统字体支持 *dynamic optical sizes*（动态光学尺寸），把离散光学尺寸（如 Text 与 Display）与字重合并为单一连续设计，系统对每个字形插值，产生精确适配磅值的字形结构。使用动态光学尺寸时，除非所用设计工具不支持可变字体格式的全部特性，否则无需使用离散光学尺寸。

系统字体提供从 Ultralight 到 Black 的多种字重，SF 还提供 Condensed、Expanded 等多种宽度。SF Symbols 使用等效字重，因此无论选择的字号或样式如何，符号与相邻文字都能精确匹配字重。

> **Note:** SF Symbols 提供与 San Francisco 系统字体无缝集成的完整符号库，在所有字重与字号下自动与文本对齐。需要传达概念或描绘物体（尤其是在文本之中）时，考虑使用符号。

系统定义了一组与两个字体家族配合的排版属性——**text style**（文本样式）：为每种文字大小指定字重、磅值与行距（leading）值的组合。例如 *body* 样式的取值支持多行文本的舒适阅读，*headline* 样式用字号与字重把标题从周围内容中区分出来。text style 整体构成一个排版层级，可用于表达内容的不同重要程度；text style 还让文字在人们改变系统字号或开启无障碍调整（如辅助功能设置中的 Larger Text）时按比例缩放。

- **考虑使用内置 text styles。** 系统定义的 text style 通过字号与字重提供便捷、一致的方式来传达信息层级；text style 配合系统字体还能确保支持 Dynamic Type 与更大的无障碍字号（如可用），让人们选择适合自己的字号（参见 Supporting Dynamic Type）。
- **必要时修改内置 text styles。** 系统 API 定义了 *symbolic traits*（符号特征）来修改 text style 的某些方面：例如 bold trait 增加字重，可创造另一个层级；也可用 symbolic traits 调整行距。在宽栏或长段落中，更大的行间距（*loose leading*，松行距）方便人们逐行移动视线不串行；反之，在高度受限的区域（如列表行）显示多行文本时，减小行间距（*tight leading*，紧行距）帮助文字放得下。若需显示三行或更多文本，即使高度有限也避免 tight leading（开发参考：leading(_:)）。
- **必要时在界面 mockup 中调整 tracking。** 运行中的 app 里，系统字体会在每个磅值动态调整 tracking；制作使用可变系统字体的精确界面 mockup 时，不必在特定磅值选择离散光学尺寸，但可能需要调整 tracking（见 Tracking values）。

> **Developer note:** 用 Font.Design 常量访问所有系统字体（Font.Design.default 取各平台系统字体，Font.Design.serif 取 New York）——不要把系统字体嵌入 app 或游戏。

## 使用自定义字体（custom fonts）

- **确保自定义字体可读。** 在各种观看距离与条件下都要容易阅读；使用自定义字体时，参照 Specifications 中各样式与字重的推荐最小字号。
- **为自定义字体实现无障碍特性。** 系统字体自动支持 Dynamic Type（如可用）并响应 Bold Text 等无障碍特性；使用自定义字体时要确保实现相同行为（开发参考：Applying custom fonts to text）。Unity 游戏可用 [Apple 的 Unity 插件](https://github.com/apple/unityplugins)支持 Dynamic Type；若插件不适用，务必让玩家能以其他方式调整字号。

## 支持 Dynamic Type

Dynamic Type 是 iOS、iPadOS、tvOS、visionOS、watchOS 上的系统级功能，让人们调整设备上可见文字的大小以保证可读性与舒适（相关指南见 Accessibility；macOS 不支持）。可用 Dynamic Type 尺寸列表见 Specifications；各平台的 Dynamic Type 尺寸表可在 [Apple Design Resources](https://developer.apple.com/design/resources/) 下载。

- **确保 app 布局适配所有字号。** 验证设计可缩放、文字与符号在所有字号下都清晰可读。在 iPhone 或 iPad 上，到 设置 > 辅助功能 > 显示与文字大小 > Larger Text 开启 Larger Accessibility Text Sizes，确认 app 仍舒适可读。
- **字号增大时同步增大有意义的界面图标。** 用界面图标传达重要信息时，确保它们在更大字号下也易于查看。使用 SF Symbols 即可获得随 Dynamic Type 字号变化自动缩放的图标。
- **字号增大时尽量减少文本截断。** 一般目标是：在最大无障碍字号下显示的有用文本量与最大标准字号下相当。避免在可滚动区域截断文本，除非人们能打开单独视图阅读剩余内容；可把 label 配置为使用足够多的行数来显示有用数量的文本（numberOfLines）。
- **考虑在大字号下调整布局。** 水平受限的场景中，内联项目（符号、时间戳等）与容器边界会挤压文字，造成截断或重叠。为提升可读性，考虑改用堆叠布局——文字出现在次要项目上方。多栏文本在大字号下也会因水平空间受限而降低可读性；字号增大时减少栏数，避免截断并提升可读性（isAccessibilityCategory）。
- **无论当前字号如何，都保持一致的信息层级。** 例如即使字号很大，也要把主要元素保持在视图顶部，避免人们丢失对这些元素的定位。

## 平台注意事项

### iOS, iPadOS
系统字体是 SF Pro；iOS/iPadOS app 也可使用 NY。

### macOS
系统字体是 SF Pro；用 Mac Catalyst 构建的 Mac app 可使用 NY。macOS 不支持 Dynamic Type。

- **必要时使用动态系统字体变体，匹配标准控件中的文本。** 动态系统字体变体让你的文本获得与系统控件文本相同的外观与质感；用下表所列变体获得与平台上其他 app 一致的效果。

| Dynamic font variant | API |
|---|---|
| Control content | controlContentFont(ofSize:) |
| Label | labelFont(ofSize:) |
| Menu | menuFont(ofSize:) |
| Menu bar | menuBarFont(ofSize:) |
| Message | messageFont(ofSize:) |
| Palette | paletteFont(ofSize:) |
| Title | titleBarFont(ofSize:) |
| Tool tips | toolTipsFont(ofSize:) |
| Document text (user) | userFont(ofSize:) |
| Monospaced document text (user fixed pitch) | userFixedPitchFont(ofSize:) |
| Bold system font | boldSystemFont(ofSize:) |
| System font | systemFont(ofSize:) |

### tvOS
系统字体是 SF Pro；app 也可使用 NY。

### visionOS
系统字体是 SF Pro；使用 NY 时需要指定所需的 type styles。visionOS 使用更粗的 Dynamic Type body 与 title 样式，并引入 Extra Large Title 1 与 Extra Large Title 2，用于宽幅编辑式布局。用 vibrancy 指示文字与符号层级的指南见 visionOS。

- **一般偏好 2D 文本。** 文字字符的视觉深度越大越难读。少量 3D 文本可作为吸引人们注意的趣味视觉元素，但需要人们阅读理解的内容，应使用几乎没有或完全没有视觉深度的文本。
- **确保文字缩放后好看且保持可读。** 选用让文字在完整尺寸下美观的 text style，然后在不同的缩放比例下测试可读性。
- **最大化文字与其容器背景之间的对比。** 默认系统以白色显示文字——白色与默认系统背景材质对比强烈，更易读。若要用其他文字颜色，务必在多种场景下测试。
- **显示无背景的文字时，考虑加粗以提升可读性。** 这种场景一般避免用阴影增加文字对比：当前空间可能没有可投射精确阴影的视觉表面，且无法预测什么样的阴影大小与密度适合个人当前的 Environment。
- **尽量让文字面向人。** 与空间中某点关联的文字（如 3D 物体的标签）通常应使用 *billboarding*——无论佩戴者或物体如何移动，文字都面向佩戴者。若不旋转文字使其始终面向佩戴者，人们从侧面或极斜角度观看时文字将无法阅读。例如物理桌面上的虚拟台灯标签：要一直可读，标签需随人绕桌移动绕 y 轴旋转——文字基线保持垂直于人的视线。

### watchOS
系统字体是 SF Compact；app 也可使用 NY。表盘 complications（复杂功能）使用 SF Compact Rounded。

## Specifications（规格）

可用 symbolic traits 显示系统 text style 的强调（emphasized）变体：SwiftUI 用 bold() 修饰符，UIKit 用 UIFontDescriptor 的 traitBold。强调字重可为 medium、semibold、bold 或 heavy。以下规格包含每个 text style 的强调字重。

### iOS, iPadOS Dynamic Type sizes

#### xSmall

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 31 | 38 | Bold |
| Title 1 | Regular | 25 | 31 | Bold |
| Title 2 | Regular | 19 | 24 | Bold |
| Title 3 | Regular | 17 | 22 | Semibold |
| Headline | Semibold | 14 | 19 | Semibold |
| Body | Regular | 14 | 19 | Semibold |
| Callout | Regular | 13 | 18 | Semibold |
| Subhead | Regular | 12 | 16 | Semibold |
| Footnote | Regular | 12 | 16 | Semibold |
| Caption 1 | Regular | 11 | 13 | Semibold |
| Caption 2 | Regular | 11 | 13 | Semibold |

Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

#### Small

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 32 | 39 | Bold |
| Title 1 | Regular | 26 | 32 | Bold |
| Title 2 | Regular | 20 | 25 | Bold |
| Title 3 | Regular | 18 | 23 | Semibold |
| Headline | Semibold | 15 | 20 | Semibold |
| Body | Regular | 15 | 20 | Semibold |
| Callout | Regular | 14 | 19 | Semibold |
| Subhead | Regular | 13 | 18 | Semibold |
| Footnote | Regular | 12 | 16 | Semibold |
| Caption 1 | Regular | 11 | 13 | Semibold |
| Caption 2 | Regular | 11 | 13 | Semibold |

Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

#### Medium

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 33 | 40 | Bold |
| Title 1 | Regular | 27 | 33 | Bold |
| Title 2 | Regular | 21 | 26 | Bold |
| Title 3 | Regular | 19 | 24 | Semibold |
| Headline | Semibold | 16 | 21 | Semibold |
| Body | Regular | 16 | 21 | Semibold |
| Callout | Regular | 15 | 20 | Semibold |
| Subhead | Regular | 14 | 19 | Semibold |
| Footnote | Regular | 12 | 16 | Semibold |
| Caption 1 | Regular | 11 | 13 | Semibold |
| Caption 2 | Regular | 11 | 13 | Semibold |

Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

#### Large (default)

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 34 | 41 | Bold |
| Title 1 | Regular | 28 | 34 | Bold |
| Title 2 | Regular | 22 | 28 | Bold |
| Title 3 | Regular | 20 | 25 | Semibold |
| Headline | Semibold | 17 | 22 | Semibold |
| Body | Regular | 17 | 22 | Semibold |
| Callout | Regular | 16 | 21 | Semibold |
| Subhead | Regular | 15 | 20 | Semibold |
| Footnote | Regular | 13 | 18 | Semibold |
| Caption 1 | Regular | 12 | 16 | Semibold |
| Caption 2 | Regular | 11 | 13 | Semibold |

Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

#### xLarge

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 36 | 43 | Bold |
| Title 1 | Regular | 30 | 37 | Bold |
| Title 2 | Regular | 24 | 30 | Bold |
| Title 3 | Regular | 22 | 28 | Semibold |
| Headline | Semibold | 19 | 24 | Semibold |
| Body | Regular | 19 | 24 | Semibold |
| Callout | Regular | 18 | 23 | Semibold |
| Subhead | Regular | 17 | 22 | Semibold |
| Footnote | Regular | 15 | 20 | Semibold |
| Caption 1 | Regular | 14 | 19 | Semibold |
| Caption 2 | Regular | 13 | 18 | Semibold |

Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

#### xxLarge

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 38 | 46 | Bold |
| Title 1 | Regular | 32 | 39 | Bold |
| Title 2 | Regular | 26 | 32 | Bold |
| Title 3 | Regular | 24 | 30 | Semibold |
| Headline | Semibold | 21 | 26 | Semibold |
| Body | Regular | 21 | 26 | Semibold |
| Callout | Regular | 20 | 25 | Semibold |
| Subhead | Regular | 19 | 24 | Semibold |
| Footnote | Regular | 17 | 22 | Semibold |
| Caption 1 | Regular | 16 | 21 | Semibold |
| Caption 2 | Regular | 15 | 20 | Semibold |

Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

#### xxxLarge

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 40 | 48 | Bold |
| Title 1 | Regular | 34 | 41 | Bold |
| Title 2 | Regular | 28 | 34 | Bold |
| Title 3 | Regular | 26 | 32 | Semibold |
| Headline | Semibold | 23 | 29 | Semibold |
| Body | Regular | 23 | 29 | Semibold |
| Callout | Regular | 22 | 28 | Semibold |
| Subhead | Regular | 21 | 28 | Semibold |
| Footnote | Regular | 19 | 24 | Semibold |
| Caption 1 | Regular | 18 | 23 | Semibold |
| Caption 2 | Regular | 17 | 22 | Semibold |

Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

### iOS, iPadOS larger accessibility type sizes

#### AX1

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 44 | 52 | Bold |
| Title 1 | Regular | 38 | 46 | Bold |
| Title 2 | Regular | 34 | 41 | Bold |
| Title 3 | Regular | 31 | 38 | Semibold |
| Headline | Semibold | 28 | 34 | Semibold |
| Body | Regular | 28 | 34 | Semibold |
| Callout | Regular | 26 | 32 | Semibold |
| Subhead | Regular | 25 | 31 | Semibold |
| Footnote | Regular | 23 | 29 | Semibold |
| Caption 1 | Regular | 22 | 28 | Semibold |
| Caption 2 | Regular | 20 | 25 | Semibold |

Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

#### AX2

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 48 | 57 | Bold |
| Title 1 | Regular | 43 | 51 | Bold |
| Title 2 | Regular | 39 | 47 | Bold |
| Title 3 | Regular | 37 | 44 | Semibold |
| Headline | Semibold | 33 | 40 | Semibold |
| Body | Regular | 33 | 40 | Semibold |
| Callout | Regular | 32 | 39 | Semibold |
| Subhead | Regular | 30 | 37 | Semibold |
| Footnote | Regular | 27 | 33 | Semibold |
| Caption 1 | Regular | 26 | 32 | Semibold |
| Caption 2 | Regular | 24 | 30 | Semibold |

Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

#### AX3

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 52 | 61 | Bold |
| Title 1 | Regular | 48 | 57 | Bold |
| Title 2 | Regular | 44 | 52 | Bold |
| Title 3 | Regular | 43 | 51 | Semibold |
| Headline | Semibold | 40 | 48 | Semibold |
| Body | Regular | 40 | 48 | Semibold |
| Callout | Regular | 38 | 46 | Semibold |
| Subhead | Regular | 36 | 43 | Semibold |
| Footnote | Regular | 33 | 40 | Semibold |
| Caption 1 | Regular | 32 | 39 | Semibold |
| Caption 2 | Regular | 29 | 35 | Semibold |

Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

#### AX4

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 56 | 66 | Bold |
| Title 1 | Regular | 53 | 62 | Bold |
| Title 2 | Regular | 50 | 59 | Bold |
| Title 3 | Regular | 49 | 58 | Semibold |
| Headline | Semibold | 47 | 56 | Semibold |
| Body | Regular | 47 | 56 | Semibold |
| Callout | Regular | 44 | 52 | Semibold |
| Subhead | Regular | 42 | 50 | Semibold |
| Footnote | Regular | 38 | 46 | Semibold |
| Caption 1 | Regular | 37 | 44 | Semibold |
| Caption 2 | Regular | 34 | 41 | Semibold |

Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

#### AX5

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 60 | 70 | Bold |
| Title 1 | Regular | 58 | 68 | Bold |
| Title 2 | Regular | 56 | 66 | Bold |
| Title 3 | Regular | 55 | 65 | Semibold |
| Headline | Semibold | 53 | 62 | Semibold |
| Body | Regular | 53 | 62 | Semibold |
| Callout | Regular | 51 | 60 | Semibold |
| Subhead | Regular | 49 | 58 | Semibold |
| Footnote | Regular | 44 | 52 | Semibold |
| Caption 1 | Regular | 43 | 51 | Semibold |
| Caption 2 | Regular | 40 | 48 | Semibold |

Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

### macOS built-in text styles

| Text style | Weight | Size (points) | Line height (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 26 | 32 | Bold |
| Title 1 | Regular | 22 | 26 | Bold |
| Title 2 | Regular | 17 | 22 | Bold |
| Title 3 | Regular | 15 | 20 | Semibold |
| Headline | Bold | 13 | 16 | Heavy |
| Body | Regular | 13 | 16 | Semibold |
| Callout | Regular | 12 | 15 | Semibold |
| Subheadline | Regular | 11 | 14 | Semibold |
| Footnote | Regular | 10 | 13 | Semibold |
| Caption 1 | Regular | 10 | 13 | Medium |
| Caption 2 | Medium | 10 | 13 | Semibold |

Point size based on image resolution of 144 ppi for @2x designs.

### tvOS built-in text styles

| Text style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Title 1 | Medium | 76 | 96 | Bold |
| Title 2 | Medium | 57 | 66 | Bold |
| Title 3 | Medium | 48 | 56 | Bold |
| Headline | Medium | 38 | 46 | Bold |
| Subtitle 1 | Regular | 38 | 46 | Medium |
| Callout | Medium | 31 | 38 | Bold |
| Body | Medium | 29 | 36 | Bold |
| Caption 1 | Medium | 25 | 32 | Bold |
| Caption 2 | Medium | 23 | 30 | Bold |

Point size based on image resolution of 72 ppi for @1x and 144 ppi for @2x designs.

### watchOS Dynamic Type sizes

#### xSmall

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 30 | 32.5 | Bold |
| Title 1 | Regular | 28 | 30.5 | Semibold |
| Title 2 | Regular | 24 | 26.5 | Semibold |
| Title 3 | Regular | 17 | 19.5 | Semibold |
| Headline | Semibold | 14 | 16.5 | Semibold |
| Body | Regular | 14 | 16.5 | Semibold |
| Caption 1 | Regular | 13 | 15.5 | Semibold |
| Caption 2 | Regular | 12 | 14.5 | Semibold |
| Footnote 1 | Regular | 11 | 13.5 | Semibold |
| Footnote 2 | Regular | 10 | 12.5 | Semibold |

#### Small (default 38mm)

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 32 | 34.5 | Bold |
| Title 1 | Regular | 30 | 32.5 | Semibold |
| Title 2 | Regular | 26 | 28.5 | Semibold |
| Title 3 | Regular | 18 | 20.5 | Semibold |
| Headline | Semibold | 15 | 17.5 | Semibold |
| Body | Regular | 15 | 17.5 | Semibold |
| Caption 1 | Regular | 14 | 16.5 | Semibold |
| Caption 2 | Regular | 13 | 15.5 | Semibold |
| Footnote 1 | Regular | 12 | 14.5 | Semibold |
| Footnote 2 | Regular | 11 | 13.5 | Semibold |

#### Large (default 40mm/41mm/42mm)

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 36 | 38.5 | Bold |
| Title 1 | Regular | 34 | 36.5 | Semibold |
| Title 2 | Regular | 28 | 30.5 | Semibold |
| Title 3 | Regular | 19 | 21.5 | Semibold |
| Headline | Semibold | 16 | 18.5 | Semibold |
| Body | Regular | 16 | 18.5 | Semibold |
| Caption 1 | Regular | 15 | 17.5 | Semibold |
| Caption 2 | Regular | 14 | 16.5 | Semibold |
| Footnote 1 | Regular | 13 | 15.5 | Semibold |
| Footnote 2 | Regular | 12 | 14.5 | Semibold |

#### xLarge (default 44mm/45mm/49mm)

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 40 | 42.5 | Bold |
| Title 1 | Regular | 38 | 40.5 | Semibold |
| Title 2 | Regular | 30 | 32.5 | Semibold |
| Title 3 | Regular | 20 | 22.5 | Semibold |
| Headline | Semibold | 17 | 19.5 | Semibold |
| Body | Regular | 17 | 19.5 | Semibold |
| Caption 1 | Regular | 16 | 18.5 | Semibold |
| Caption 2 | Regular | 15 | 17.5 | Semibold |
| Footnote 1 | Regular | 14 | 16.5 | Semibold |
| Footnote 2 | Regular | 13 | 15.5 | Semibold |

#### xxLarge

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 41 | 43.5 | Bold |
| Title 1 | Regular | 39 | 41.5 | Semibold |
| Title 2 | Regular | 31 | 33.5 | Semibold |
| Title 3 | Regular | 21 | 23.5 | Semibold |
| Headline | Semibold | 18 | 20.5 | Semibold |
| Body | Regular | 18 | 20.5 | Semibold |
| Caption 1 | Regular | 17 | 19.5 | Semibold |
| Caption 2 | Regular | 16 | 18.5 | Semibold |
| Footnote 1 | Regular | 15 | 17.5 | Semibold |
| Footnote 2 | Regular | 14 | 16.5 | Semibold |

#### xxxLarge

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 42 | 44.5 | Bold |
| Title 1 | Regular | 40 | 42.5 | Semibold |
| Title 2 | Regular | 32 | 34.5 | Semibold |
| Title 3 | Regular | 22 | 24.5 | Semibold |
| Headline | Semibold | 19 | 21.5 | Semibold |
| Body | Regular | 19 | 21.5 | Semibold |
| Caption 1 | Regular | 18 | 20.5 | Semibold |
| Caption 2 | Regular | 17 | 19.5 | Semibold |
| Footnote 1 | Regular | 16 | 18.5 | Semibold |
| Footnote 2 | Regular | 15 | 17.5 | Semibold |

### watchOS larger accessibility type sizes

#### AX1

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 44 | 46.5 | Bold |
| Title 1 | Regular | 42 | 44.5 | Semibold |
| Title 2 | Regular | 34 | 41 | Semibold |
| Title 3 | Regular | 24 | 26.5 | Semibold |
| Headline | Semibold | 21 | 23.5 | Semibold |
| Body | Regular | 21 | 23.5 | Semibold |
| Caption 1 | Regular | 18 | 20.5 | Semibold |
| Caption 2 | Regular | 17 | 19.5 | Semibold |
| Footnote 1 | Regular | 16 | 18.5 | Semibold |
| Footnote 2 | Regular | 15 | 17.5 | Semibold |

#### AX2

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 45 | 47.5 | Bold |
| Title 1 | Regular | 43 | 46 | Semibold |
| Title 2 | Regular | 35 | 37.5 | Semibold |
| Title 3 | Regular | 25 | 27.5 | Semibold |
| Headline | Semibold | 22 | 24.5 | Semibold |
| Body | Regular | 22 | 24.5 | Semibold |
| Caption 1 | Regular | 19 | 21.5 | Semibold |
| Caption 2 | Regular | 18 | 20.5 | Semibold |
| Footnote 1 | Regular | 17 | 19.5 | Semibold |
| Footnote 2 | Regular | 16 | 17.5 | Semibold |

#### AX3

| Style | Weight | Size (points) | Leading (points) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 46 | 48.5 | Bold |
| Title 1 | Regular | 44 | 47 | Semibold |
| Title 2 | Regular | 36 | 38.5 | Semibold |
| Title 3 | Regular | 26 | 28.5 | Semibold |
| Headline | Semibold | 23 | 25.5 | Semibold |
| Body | Regular | 23 | 25.5 | Semibold |
| Caption 1 | Regular | 20 | 22.5 | Semibold |
| Caption 2 | Regular | 19 | 21.5 | Semibold |
| Footnote 1 | Regular | 18 | 20.5 | Semibold |
| Footnote 2 | Regular | 17 | 19.5 | Semibold |

### Tracking values

#### iOS, iPadOS, visionOS — SF Pro

| Size (points) | Tracking (1/1000 em) | Tracking (points) |
|---|---|---|
| 6 | +41 | +0.24 |
| 7 | +34 | +0.23 |
| 8 | +26 | +0.21 |
| 9 | +19 | +0.17 |
| 10 | +12 | +0.12 |
| 11 | +6 | +0.06 |
| 12 | 0 | 0.0 |
| 13 | -6 | -0.08 |
| 14 | -11 | -0.15 |
| 15 | -16 | -0.23 |
| 16 | -20 | -0.31 |
| 17 | -26 | -0.43 |
| 18 | -25 | -0.44 |
| 19 | -24 | -0.45 |
| 20 | -23 | -0.45 |
| 21 | -18 | -0.36 |
| 22 | -12 | -0.26 |
| 23 | -4 | -0.10 |
| 24 | +3 | +0.07 |
| 25 | +6 | +0.15 |
| 26 | +8 | +0.22 |
| 27 | +11 | +0.29 |
| 28 | +14 | +0.38 |
| 29 | +14 | +0.40 |
| 30 | +14 | +0.40 |
| 31 | +13 | +0.39 |
| 32 | +13 | +0.41 |
| 33 | +12 | +0.40 |
| 34 | +12 | +0.40 |
| 35 | +11 | +0.38 |
| 36 | +10 | +0.37 |
| 37 | +10 | +0.36 |
| 38 | +10 | +0.37 |
| 39 | +10 | +0.38 |
| 40 | +10 | +0.37 |
| 41 | +9 | +0.36 |
| 42 | +9 | +0.37 |
| 43 | +9 | +0.38 |
| 44 | +8 | +0.37 |
| 45 | +8 | +0.35 |
| 46 | +8 | +0.36 |
| 47 | +8 | +0.37 |
| 48 | +8 | +0.35 |
| 49 | +7 | +0.33 |
| 50 | +7 | +0.34 |
| 51 | +7 | +0.35 |
| 52 | +6 | +0.33 |
| 53 | +6 | +0.31 |
| 54 | +6 | +0.32 |
| 56 | +6 | +0.30 |
| 58 | +5 | +0.28 |
| 60 | +4 | +0.26 |
| 62 | +4 | +0.24 |
| 64 | +4 | +0.22 |
| 66 | +3 | +0.19 |
| 68 | +2 | +0.17 |
| 70 | +2 | +0.14 |
| 72 | +2 | +0.14 |
| 76 | +1 | +0.07 |
| 80 | 0 | 0 |
| 84 | 0 | 0 |
| 88 | 0 | 0 |
| 92 | 0 | 0 |
| 96 | 0 | 0 |

Not all apps express tracking values as 1/1000 em. Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

#### iOS, iPadOS, visionOS — SF Pro Rounded

| Size (points) | Tracking (1/1000 em) | Tracking (points) |
|---|---|---|
| 6 | +87 | +0.51 |
| 7 | +80 | +0.54 |
| 8 | +72 | +0.57 |
| 9 | +65 | +0.57 |
| 10 | +58 | +0.57 |
| 11 | +52 | +0.56 |
| 12 | +46 | +0.54 |
| 13 | +40 | +0.51 |
| 14 | +35 | +0.48 |
| 15 | +30 | +0.44 |
| 16 | +26 | +0.41 |
| 17 | +22 | +0.37 |
| 18 | +21 | +0.37 |
| 19 | +20 | +0.37 |
| 20 | +18 | +0.36 |
| 21 | +17 | +0.35 |
| 22 | +16 | +0.34 |
| 23 | +16 | +0.35 |
| 24 | +15 | +0.35 |
| 25 | +14 | +0.35 |
| 26 | +14 | +0.36 |
| 27 | +14 | +0.36 |
| 28 | +13 | +0.36 |
| 29 | +13 | +0.37 |
| 30 | +12 | +0.37 |
| 31 | +12 | +0.36 |
| 32 | +12 | +0.38 |
| 33 | +12 | +0.39 |
| 34 | +12 | +0.38 |
| 35 | +11 | +0.38 |
| 36 | +11 | +0.39 |
| 37 | +10 | +0.38 |
| 38 | +10 | +0.39 |
| 39 | +10 | +0.38 |
| 40 | +10 | +0.39 |
| 41 | +10 | +0.38 |
| 42 | +10 | +0.39 |
| 43 | +9 | +0.38 |
| 44 | +8 | +0.37 |
| 45 | +8 | +0.37 |
| 46 | +8 | +0.36 |
| 47 | +8 | +0.37 |
| 48 | +8 | +0.35 |
| 49 | +8 | +0.36 |
| 50 | +7 | +0.34 |
| 51 | +6 | +0.32 |
| 52 | +6 | +0.33 |
| 53 | +6 | +0.31 |
| 54 | +6 | +0.32 |
| 56 | +6 | +0.30 |
| 58 | +4 | +0.25 |
| 60 | +4 | +0.23 |
| 62 | +4 | +0.21 |
| 64 | +3 | +0.19 |
| 66 | +2 | +0.16 |
| 68 | +2 | +0.13 |
| 70 | +2 | +0.14 |
| 72 | +2 | +0.11 |
| 76 | +1 | +0.07 |
| 80 | 0 | 0.00 |
| 84 | 0 | 0.00 |
| 88 | 0 | 0.00 |
| 92 | 0 | 0.00 |
| 96 | 0 | 0.00 |

Not all apps express tracking values as 1/1000 em. Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

#### iOS, iPadOS, visionOS — New York

| Size (points) | Tracking (1/1000 em) | Tracking (points) |
|---|---|---|
| 6 | +40 | +0.23 |
| 7 | +32 | +0.22 |
| 8 | +25 | +0.20 |
| 9 | +20 | +0.18 |
| 10 | +16 | +0.15 |
| 11 | +11 | +.12 |
| 12 | +6 | +0.07 |
| 13 | +4 | +0.05 |
| 14 | +2 | +0.03 |
| 15 | +0 | +0.00 |
| 16 | -2 | -0.03 |
| 17 | -4 | -0.07 |
| 18 | -6 | -0.11 |
| 19 | -8 | -0.15 |
| 20 | -10 | -0.20 |
| 21 | -10 | -0.21 |
| 22 | -10 | -0.23 |
| 23 | -11 | -0.25 |
| 24 | -11 | -0.26 |
| 25 | -11 | -0.27 |
| 26 | -12 | -0.29 |
| 27 | -12 | -0.32 |
| 28 | -12 | -0.33 |
| 29 | -12 | -0.34 |
| 30 | -12 | -0.37 |
| 31 | -13 | -0.39 |
| 32 | -13 | -0.41 |
| 33 | -13 | -0.42 |
| 34 | -14 | -0.45 |
| 35 | -14 | -0.48 |
| 36 | -14 | -0.49 |
| 38 | -14 | -0.52 |
| 40 | -14 | -0.55 |
| 42 | -14 | -0.57 |
| 44 | -14 | -0.62 |
| 46 | -14 | -0.65 |
| 48 | -14 | -0.68 |
| 50 | -14 | -0.71 |
| 52 | -14 | -0.74 |
| 54 | -15 | -0.79 |
| 58 | -15 | -0.85 |
| 62 | -15 | -0.91 |
| 66 | -15 | -0.97 |
| 70 | -16 | -1.06 |
| 72 | -16 | -1.09 |
| 80 | -16 | -1.21 |
| 88 | -16 | -1.33 |
| 96 | -16 | -1.50 |
| 100 | -16 | -1.56 |
| 120 | -16 | -1.88 |
| 140 | -16 | -2.26 |
| 160 | -16 | -2.58 |
| 180 | -17 | -2.99 |
| 200 | -17 | -3.32 |
| 220 | -18 | -3.76 |
| 240 | -18 | -4.22 |
| 260 | -18 | -4.57 |

Not all apps express tracking values as 1/1000 em. Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

#### macOS tracking values

| Size (points) | Tracking (1/1000 em) | Tracking (points) |
|---|---|---|
| 6 | +41 | +0.24 |
| 7 | +34 | +0.23 |
| 8 | +26 | +0.21 |
| 9 | +19 | +0.17 |
| 10 | +12 | +0.12 |
| 11 | +6 | +0.06 |
| 12 | 0 | 0.0 |
| 13 | -6 | -0.08 |
| 14 | -11 | -0.15 |
| 15 | -16 | -0.23 |
| 16 | -20 | -0.31 |
| 17 | -26 | -0.43 |
| 18 | -25 | -0.44 |
| 19 | -24 | -0.45 |
| 20 | -23 | -0.45 |
| 21 | -18 | -0.36 |
| 22 | -12 | -0.26 |
| 23 | -4 | -0.10 |
| 24 | +3 | +0.07 |
| 25 | +6 | +0.15 |
| 26 | +8 | +0.22 |
| 27 | +11 | +0.29 |
| 28 | +14 | +0.38 |
| 29 | +14 | +0.40 |
| 30 | +14 | +0.40 |
| 31 | +13 | +0.39 |
| 32 | +13 | +0.41 |
| 33 | +12 | +0.40 |
| 34 | +12 | +0.40 |
| 35 | +11 | +0.38 |
| 36 | +10 | +0.37 |
| 37 | +10 | +0.36 |
| 38 | +10 | +0.37 |
| 39 | +10 | +0.38 |
| 40 | +10 | +0.37 |
| 41 | +9 | +0.36 |
| 42 | +9 | +0.37 |
| 43 | +9 | +0.38 |
| 44 | +8 | +0.37 |
| 45 | +8 | +0.35 |
| 46 | +8 | +0.36 |
| 47 | +8 | +0.37 |
| 48 | +8 | +0.35 |
| 49 | +7 | +0.33 |
| 50 | +7 | +0.34 |
| 51 | +7 | +0.35 |
| 52 | +6 | +0.31 |
| 53 | +6 | +0.33 |
| 54 | +6 | +0.32 |
| 56 | +6 | +0.30 |
| 58 | +5 | +0.28 |
| 60 | +4 | +0.26 |
| 62 | +4 | +0.24 |
| 64 | +4 | +0.22 |
| 66 | +3 | +0.19 |
| 68 | +2 | +0.17 |
| 70 | +2 | +0.14 |
| 72 | +2 | +0.14 |
| 76 | +1 | +0.07 |
| 80 | 0 | 0 |
| 84 | 0 | 0 |
| 88 | 0 | 0 |
| 92 | 0 | 0 |
| 96 | 0 | 0 |

Not all apps express tracking values as 1/1000 em. Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

#### tvOS tracking values

| Size (points) | Tracking (1/1000 em) | Tracking (points) |
|---|---|---|
| 6 | +41 | +0.24 |
| 7 | +34 | +0.23 |
| 8 | +26 | +0.21 |
| 9 | +19 | +0.17 |
| 10 | +12 | +0.12 |
| 11 | +6 | +0.06 |
| 12 | 0 | 0.0 |
| 13 | -6 | -0.08 |
| 14 | -11 | -0.15 |
| 15 | -16 | -0.23 |
| 16 | -20 | -0.31 |
| 17 | -26 | -0.43 |
| 18 | -25 | -0.44 |
| 19 | -24 | -0.45 |
| 20 | -23 | -0.45 |
| 21 | -18 | -0.36 |
| 22 | -12 | -0.26 |
| 23 | -4 | -0.10 |
| 24 | +3 | +0.07 |
| 25 | +6 | +0.15 |
| 26 | +8 | +0.22 |
| 27 | +11 | +0.29 |
| 28 | +14 | +0.38 |
| 29 | +14 | +0.40 |
| 30 | +14 | +0.40 |
| 31 | +13 | +0.39 |
| 32 | +13 | +0.41 |
| 33 | +12 | +0.40 |
| 34 | +12 | +0.40 |
| 35 | +11 | +0.38 |
| 36 | +10 | +0.37 |
| 37 | +10 | +0.36 |
| 38 | +10 | +0.37 |
| 39 | +10 | +0.38 |
| 40 | +10 | +0.37 |
| 41 | +9 | +0.36 |
| 42 | +9 | +0.37 |
| 43 | +9 | +0.38 |
| 44 | +8 | +0.37 |
| 45 | +8 | +0.35 |
| 46 | +8 | +0.36 |
| 47 | +8 | +0.37 |
| 48 | +8 | +0.35 |
| 49 | +7 | +0.33 |
| 50 | +7 | +0.34 |
| 51 | +7 | +0.35 |
| 52 | +6 | +0.31 |
| 53 | +6 | +0.33 |
| 54 | +6 | +0.32 |
| 56 | +6 | +0.30 |
| 58 | +5 | +0.28 |
| 60 | +4 | +0.26 |
| 62 | +4 | +0.24 |
| 64 | +4 | +0.22 |
| 66 | +3 | +0.19 |
| 68 | +2 | +0.17 |
| 70 | +2 | +0.14 |
| 72 | +2 | +0.14 |
| 76 | +1 | +0.07 |
| 80 | 0 | 0 |
| 84 | 0 | 0 |
| 88 | 0 | 0 |
| 92 | 0 | 0 |
| 96 | 0 | 0 |

Not all apps express tracking values as 1/1000 em. Point size based on image resolution of 144 ppi for @2x and 216 ppi for @3x designs.

#### watchOS tracking values — SF Compact

| Size (points) | Tracking (1/1000 em) | Tracking (points) |
|---|---|---|
| 6 | +50 | +0.29 |
| 7 | +30 | +0.21 |
| 8 | +30 | +0.23 |
| 9 | +30 | +0.26 |
| 10 | +30 | +0.29 |
| 11 | +24 | +0.26 |
| 12 | +20 | +0.23 |
| 13 | +16 | +0.20 |
| 14 | +14 | +0.19 |
| 15 | +4 | +0.06 |
| 16 | 0 | 0.00 |
| 17 | -4 | -0.07 |
| 18 | -8 | -0.14 |
| 19 | -12 | -0.22 |
| 20 | 0 | 0.00 |
| 21 | -2 | -0.04 |
| 22 | -4 | -0.09 |
| 23 | -6 | -0.13 |
| 24 | -8 | -0.19 |
| 25 | -10 | -0.24 |
| 26 | -11 | -0.28 |
| 27 | -12 | -0.30 |
| 28 | -12 | -0.34 |
| 29 | -14 | -0.38 |
| 30 | -14 | -0.42 |
| 31 | -15 | -0.45 |
| 32 | -16 | -0.50 |
| 33 | -17 | -0.55 |
| 34 | -18 | -0.60 |
| 35 | -18 | -0.63 |
| 36 | -20 | -0.69 |
| 37 | -20 | -0.72 |
| 38 | -20 | -0.74 |
| 39 | -20 | -0.76 |
| 40 | -20 | -0.78 |
| 41 | -20 | -0.80 |
| 42 | -20 | -0.82 |
| 43 | -20 | -0.84 |
| 44 | -20 | -0.86 |
| 45 | -20 | -0.88 |
| 46 | -20 | -0.92 |
| 47 | -20 | -0.94 |
| 48 | -20 | -0.96 |
| 49 | -21 | -1.00 |
| 50 | -21 | -1.03 |
| 51 | -21 | -1.05 |
| 52 | -21 | -1.07 |
| 53 | -22 | -1.11 |
| 54 | -22 | -1.13 |
| 56 | -22 | -1.20 |
| 58 | -22 | -1.25 |
| 60 | -22 | -1.32 |
| 62 | -22 | -1.36 |
| 64 | -23 | -1.44 |
| 66 | -24 | -1.51 |
| 68 | -24 | -1.56 |
| 70 | -24 | -1.64 |
| 72 | -24 | -1.69 |
| 76 | -25 | -1.86 |
| 80 | -26 | -1.99 |
| 84 | -26 | -2.13 |
| 88 | -26 | -2.28 |
| 92 | -28 | -2.47 |
| 96 | -28 | -2.62 |

Not all apps express tracking values as 1/1000 em. Point size based on image resolution of 144 ppi for @2x designs.

#### watchOS tracking values — SF Compact Rounded

| Size (points) | Tracking (1/1000 em) | Tracking (points) |
|---|---|---|
| 6 | +28 | +0.16 |
| 7 | +26 | +0.18 |
| 8 | +24 | +0.19 |
| 9 | +22 | +0.19 |
| 10 | +20 | +0.20 |
| 11 | +18 | +0.19 |
| 12 | +16 | +0.19 |
| 13 | +14 | +0.18 |
| 14 | +12 | +0.16 |
| 15 | +10 | +0.15 |
| 16 | +8 | +0.12 |
| 17 | +6 | +0.10 |
| 18 | +4 | +0.07 |
| 19 | +2 | +0.04 |
| 20 | 0 | 0.00 |
| 21 | -2 | -0.04 |
| 22 | -4 | -0.09 |
| 23 | -6 | -0.13 |
| 24 | -8 | -0.19 |
| 25 | -10 | -0.24 |
| 26 | -11 | -0.28 |
| 27 | -12 | -0.30 |
| 28 | -12 | -0.34 |
| 29 | -14 | -0.38 |
| 30 | -14 | -0.42 |
| 31 | -15 | -0.45 |
| 32 | -16 | -0.50 |
| 33 | -17 | -0.55 |
| 34 | -18 | -0.60 |
| 35 | -18 | -0.63 |
| 36 | -20 | -0.69 |
| 37 | -20 | -0.72 |
| 38 | -20 | -0.74 |
| 39 | -20 | -0.76 |
| 40 | -20 | -0.78 |
| 41 | -20 | -0.80 |
| 42 | -20 | -0.82 |
| 43 | -20 | -0.84 |
| 44 | -20 | -0.86 |
| 45 | -20 | -0.88 |
| 46 | -20 | -0.92 |
| 47 | -20 | -0.94 |
| 48 | -20 | -0.96 |
| 49 | -21 | -1.00 |
| 50 | -21 | -1.03 |
| 51 | -21 | -1.05 |
| 52 | -21 | -1.07 |
| 53 | -22 | -1.11 |
| 54 | -22 | -1.13 |
| 56 | -22 | -1.20 |
| 58 | -22 | -1.25 |
| 60 | -22 | -1.32 |
| 62 | -22 | -1.36 |
| 64 | -23 | -1.44 |
| 66 | -24 | -1.51 |
| 68 | -24 | -1.56 |
| 70 | -24 | -1.64 |
| 72 | -24 | -1.69 |
| 76 | -25 | -1.86 |
| 80 | -26 | -1.99 |
| 84 | -26 | -2.13 |
| 88 | -26 | -2.28 |
| 92 | -28 | -2.47 |
| 96 | -28 | -2.62 |

Not all apps express tracking values as 1/1000 em. Point size based on image resolution of 144 ppi for @2x designs.

## 数值速查

| 分类 | 项 | 数值 |
|---|---|---|
| 平台字号 | iOS, iPadOS | 默认 17 pt / 最小 11 pt |
| 平台字号 | macOS | 默认 13 pt / 最小 10 pt |
| 平台字号 | tvOS | 默认 29 pt / 最小 23 pt |
| 平台字号 | visionOS | 默认 17 pt / 最小 12 pt |
| 平台字号 | watchOS | 默认 16 pt / 最小 12 pt |
| iOS Dynamic Type（Body 值） | xSmall / Small / Medium | 14 / 15 / 16 pt（行高 19 / 20 / 21） |
| iOS Dynamic Type（Body 值） | Large (default) / xLarge / xxLarge | 17 / 19 / 21 pt（行高 22 / 24 / 26） |
| iOS Dynamic Type（Body 值） | xxxLarge | 23 pt（行高 29） |
| iOS 较大无障碍字号（Body 值） | AX1 / AX2 / AX3 | 28 / 33 / 40 pt（行高 34 / 40 / 48） |
| iOS 较大无障碍字号（Body 值） | AX4 / AX5 | 47 / 53 pt（行高 56 / 62） |
| watchOS Dynamic Type（Body 值） | xSmall / Small(38mm) / Large(40–42mm) | 14 / 15 / 16 pt（行高 16.5 / 17.5 / 18.5） |
| watchOS Dynamic Type（Body 值） | xLarge(44–49mm) / xxLarge / xxxLarge | 17 / 18 / 19 pt（行高 19.5 / 20.5 / 21.5） |
| watchOS 较大无障碍字号（Body 值） | AX1 / AX2 / AX3 | 21 / 22 / 23 pt（行高 23.5 / 24.5 / 25.5） |
| macOS text style | Large Title | 26 pt，行高 32，强调 Bold |
| macOS text style | Title 1 | 22 pt，行高 26，强调 Bold |
| macOS text style | Title 2 | 17 pt，行高 22，强调 Bold |
| macOS text style | Title 3 | 15 pt，行高 20，强调 Semibold |
| macOS text style | Headline | 13 pt Bold，行高 16，强调 Heavy |
| macOS text style | Body | 13 pt，行高 16，强调 Semibold |
| macOS text style | Callout | 12 pt，行高 15，强调 Semibold |
| macOS text style | Subheadline | 11 pt，行高 14，强调 Semibold |
| macOS text style | Footnote | 10 pt，行高 13，强调 Semibold |
| macOS text style | Caption 1 | 10 pt，行高 13，强调 Medium |
| macOS text style | Caption 2 | 10 pt Medium，行高 13，强调 Semibold |
| tvOS text style | Title 1 | 76 pt Medium，行距 96，强调 Bold |
| tvOS text style | Title 2 | 57 pt Medium，行距 66，强调 Bold |
| tvOS text style | Title 3 | 48 pt Medium，行距 56，强调 Bold |
| tvOS text style | Headline | 38 pt Medium，行距 46，强调 Bold |
| tvOS text style | Subtitle 1 | 38 pt Regular，行距 46，强调 Medium |
| tvOS text style | Callout | 31 pt Medium，行距 38，强调 Bold |
| tvOS text style | Body | 29 pt Medium，行距 36，强调 Bold |
| tvOS text style | Caption 1 | 25 pt Medium，行距 32，强调 Bold |
| tvOS text style | Caption 2 | 23 pt Medium，行距 30，强调 Bold |
| tracking 锚点 | SF Pro（iOS/iPadOS/visionOS；macOS/tvOS 表数值相同） | ≤11 pt 为正；12 pt 为 0；13–23 pt 为负（17 pt 最负 -26/1000 em）；24 pt 起转正（28–30 pt 最正 +14）；80 pt 及以上归零 |
| tracking 锚点 | SF Pro Rounded（iOS/iPadOS/visionOS） | 全程非负（6 pt 最大 +87/1000 em）；80 pt 及以上归零 |
| tracking 锚点 | New York（iOS/iPadOS/visionOS） | ≤14 pt 为正（6 pt 最大 +40）；15 pt 归零后随字号转负，260 pt 最负 -18 |
| tracking 锚点 | SF Compact / SF Compact Rounded（watchOS） | ≤15 pt / ≤19 pt 为正；16 pt / 20 pt 为 0；之后转负，96 pt 最负 -28（两家族 20 pt 起数值相同） |

注：速查表为关键锚点汇总；每档 text style 的完整 11 样式（iOS/iPadOS/macOS/tvOS）或 10 样式（watchOS）表格见上文 Specifications。
