# Layout（布局）

> 来源: https://developer.apple.com/design/human-interface-guidelines/layout
> 整理自 Apple HIG 原文（2026-09 抓取）。规范条目忠实原文，未新增规则。

跨屏幕尺寸、方向与多任务配置保持一致且能自适应的布局，帮助人们在所有设备上理解并享受你的 app 或游戏。布局是人们理解内容的结构起点：控件与内容之间熟悉的关系让人立刻用上并发现功能，也让设计在每个平台都感到"原生"。Apple 提供模板与布局指南：见 [Apple Design Resources](https://developer.apple.com/design/resources/)。

## 视觉层级（Visual hierarchy）

- **按相对重要性排列内容。** 人们通常按阅读顺序浏览——自上而下、自 leading（前导）侧向 trailing（尾随）侧——因此把最重要的条目放在窗口或屏幕的顶部与前导侧。要支持从右到左的语言，优先使用能自动按各语言自然阅读顺序适配 UI 元素的标准系统组件（参见 Right to left）。
- **对齐元素使其更易扫视，并用缩进表达层级。** 对齐让 app 显得整洁有序，帮助人们在滚动或移动视线时追踪内容。人们默认对齐的项目彼此相关；反过来，缩进的项目被视为从属于其前面的项目。因此要有意识地运用对齐与缩进来表达信息层级。
- **对相关条目分组，清晰表达相关的信息或功能。** 例如用留白（negative space）、容器形状或分隔线表明哪些元素相关、哪些无关。
- **使用渐进式披露（progressive disclosure）让布局更简洁、更易交互。** 内容与选项过多会让人更难快速找到信息、更难理解可用选项。可用展开三角、菜单或嵌套视图减少初始显示的内容；也可用可滚动区块展示更多内容——对视频、音乐、书籍等媒体类 app 尤其有用。
- **区分控件与内容。** 在所有支持 Liquid Glass 材质的平台上利用该材质为控件提供独特外观。不要在控件下方铺纯色或半透明背景色，而应使用 scroll edge effect 让控件在视觉上高于内容（参见 Scroll views）。全屏背景内容务必延伸到 sidebar、toolbar、tab bar 之下，铺满整个屏幕或窗口。
  - 若把背景图拉伸到窗口边缘会导致 sidebar、inspector 等组件遮挡图像的重要部分，可使用 background extension effect：翻转并模糊图像、镜像到相邻组件之下，营造背景延伸到组件下方的观感（开发参考：backgroundExtensionEffect()、UIBackgroundExtensionView）。

## 自适应（Adaptability）

app 与游戏需要适配不同的显示尺寸、方向变化、窗口尺寸与多任务状态。在 iOS、iPadOS、tvOS、visionOS 中，系统定义了会影响 app 或游戏外观的设备环境特征。使用 SwiftUI 或 Auto Layout 确保界面能适配它们。

app 需要处理的常见设备与系统特征：

- 水平与垂直的 regular / compact Size classes
- 不同的设备屏幕尺寸
- 不同的设备方向与宽高比
- Dynamic Island 等系统特性
- 外接显示器支持、Display Zoom、iPad 与 Mac 上的可调整窗口
- 文字大小变化
- 基于区域的国际化特性：从左到右/从右到左布局方向、日期/时间/数字格式、字体变体、文本长度

- **设计能优雅且一致地自适应的布局。** 人们期望旋转设备、调整窗口、添加显示器、切换设备时体验保持熟悉。遵守系统定义的 Safe Area、边距与 guides（如可用），并用布局修饰符微调视图中元素的位置。
  - 即使 app 锁定了某个方向（如仅横屏的游戏），也要确保界面能良好缩放，在各类设备与窗口尺寸下提供最佳体验。
- **为文字大小变化做好准备。** 人们用 Dynamic Type 增大文字以提升可读性，这是系统级设置；不响应此设置的 app 对依赖该功能的人可能难以甚至无法使用。支持 Dynamic Type 就要调整布局以容纳更大的文字：例如水平相邻的视图可能需要改为垂直堆叠以留出更多文字空间；表格行等容器可能需要增高，避免文字被裁剪或与其他内容重叠；默认单行文本的表格行可能需要长高以容纳多行。
  - Unity 游戏可用 Apple 的无障碍插件支持 Dynamic Type（见 [Apple – Accessibility](https://github.com/apple/unityplugins/blob/main/plug-ins/Apple.Accessibility/Apple.Accessibility_Unity/Assets/Apple.Accessibility/Documentation~/Apple.Accessibility.md)）。文字显示指南见 Typography。
- **在多台设备上、用不同 size class、本地化与字号预览 app。** 可先测试最大与最小两种布局版本以简化测试流程；用 Device Hub 在模拟设备上检查裁切等布局问题（如 iPad 上调整窗口大小、或 Mac 上 iPhone Mirroring 时的布局）。
- **必要时随显示变化缩放背景图。** 在不同上下文（如不同宽高比的屏幕）查看时，背景图可能出现被裁切、letterbox 或 pillarbox。此时不要改变图像的宽高比，而是缩放它以完全填满屏幕。注意窗口可能非常宽矮或高窄，背景图常需要延伸超出标准显示宽高比下的可视范围。

### Size classes

在 iOS 与 iPadOS 中，size class 表示界面可用空间量。每个维度（水平、垂直）取两档之一：*compact* 或 *regular*。水平 size class 决定 app 是窄（compact）还是宽（regular），垂直 size class 决定是矮（compact）还是高（regular）。系统根据设备类型、窗口配置与多任务状态设置 size class（如全屏、Slide Over、iPhone 镜像到 Mac）；iOS/iPadOS app 可处于任意 size class 组合。

- **基于 size class 决定布局，而不是设备类型或方向。** size class 描述实际可用空间，与 app 处于竖屏还是横屏无关；反过来，设备的方向与类型（*idiom*）对布局决策没有帮助，因为它们不提供可用空间的信息。
  - size class 还让界面适配大范围的窗口尺寸：macOS 上 iPhone Mirroring 中可自由调整宽高；iPadOS 多任务下或 macOS 上运行 iPad app 时也可调整。
- **考虑 size class 的所有可能组合。** app 会以横竖屏、多种 size class 出现，都要照顾到才能提供好体验：只为 iPhone 横屏（regular 宽 + compact 高）设计的布局，可能用不上 iPad 横屏下窗口调整为 regular 高度时的纵向空间；反之，只为 compact 竖屏设计的布局，在 iPad 窗口调整为 regular 宽度时会留出多余空白。
- **size class 变化时保持功能一致，布局变化保持平台可辨识与熟悉。** 不要因占用空间不同而改变 app 的功能，但可以随空间变化调整屏幕上可见的功能量：如利用更大空间从 Tab bars 切换到 Sidebars，或暴露原本收进溢出菜单的功能。idiom（app 面向的设备类型）在调整窗口大小时不变——布局要对所在平台保持可辨识与熟悉。

## Guides 与 Safe Area

- **Layout guide** 定义一个矩形区域，帮助在屏幕上定位、对齐与分隔内容。系统预置 guide 可轻松应用标准边距、限制文本宽度以获得最佳可读性；也可定义自定义 guide（开发参考：UILayoutGuide、NSLayoutGuide）。
- **Safe Area** 定义窗口内边缘不被硬件特征或窗口内其他视图（toolbar、tab bar、状态栏等）遮挡的区域。遵守 Safe Area 至关重要，可确保系统 UI 与 Dynamic Island 等硬件特征不遮挡内容与控件（开发参考：SafeAreaRegions）。

## 平台注意事项

*iOS / iPadOS：无额外注意事项。*

### macOS

- **避免把控件或关键信息放在窗口底部。** 人们经常移动窗口，使窗口底边低于屏幕底部。
- **避免在窗口顶部边缘相机外壳背后显示内容。**（开发参考：NSPrefersDisplaySafeAreaCompatibilityMode）

### tvOS

- **遵守屏幕 Safe Area。** 主要内容距屏幕上下内缩 60 pt、左右内缩 80 pt。这些边距确保内容无论电视兼容性设置或 overscan 裁切如何都始终可见。
- **在可聚焦元素之间留出适当间距。** 使用 UIKit 与 focus API 时，元素聚焦时会变大；考虑元素聚焦时的外观，确保不遮挡重要信息（开发参考：About focus interactions for Apple TV）。

#### 网格（Grids）

以下网格布局提供最佳观看体验。未聚焦的行与列之间要留出适当间距，防止某项聚焦时与相邻内容重叠。使用 UIKit collection view flow（UICollectionViewFlowLayout）时，网格列数会根据内容宽度与间距自动确定。

原文提供 Two-column 至 Nine-column 共八种网格布局，各档数值如下（布局示意图为图片，见原文或 Apple Design Resources）：

| 网格 | 未聚焦内容宽度 | 水平间距 | 最小垂直间距 |
|---|---|---|---|
| Two-column | 860 pt | 40 pt | 100 pt |
| Three-column | 560 pt | 40 pt | 100 pt |
| Four-column | 410 pt | 40 pt | 100 pt |
| Five-column | 320 pt | 40 pt | 100 pt |
| Six-column | 260 pt | 40 pt | 100 pt |
| Seven-column | 217 pt | 40 pt | 100 pt |
| Eight-column | 184 pt | 40 pt | 100 pt |
| Nine-column | 160 pt | 40 pt | 100 pt |

- **为带标题的行留出额外垂直间距。** 行有标题时，在前一未聚焦行底部与标题中心之间、以及标题底部与该行未聚焦项顶部之间都留出足够间距，避免拥挤。
- **保持间距一致。** 内容间距不一致就不再像网格，也更难扫视。
- **让部分隐藏的内容看起来对称。** 屏幕两侧部分离屏的内容保持相同宽度，把注意力引向完整可见的内容。

### visionOS

visionOS 中可在 window、有边界的 3D volume 或 immersive space 中布局内容。本节聚焦窗口与 volume 中的布局；空间化显示及深度、缩放、定位的最佳实践见 Spatial layout，窗口与 volume 详见 visionOS。

- **一般应支持调整大小。** 可调整窗口与 volume 是 visionOS 的标准行为（同 macOS、iPadOS）。允许调整时确保布局随尺寸变化适配良好；在非常大的尺寸下让内容保持水平居中，便于查看与交互。可为窗口、volume 及 ornament 等附加 UI 元素设置最小/最大尺寸——防止小尺寸下元素重叠、防止大布局过于笨重；但不要用最小/最大尺寸来阻止调整大小（如 Safari 浏览器窗口可调，但自定义导航栏 ornament 有固定最大尺寸以保持控件易触达）。
- **在窗口中少量使用 3D 内容。** visionOS 窗口可显示固定深度的 3D 内容，但应保留给与 2D 内容并列的有意义的时刻（如教育 app 在火箭介绍旁内联显示 3D 模型）。内联 3D 内容要内缩放置，避免与其他内容或控件碰撞、或意外出现在窗口边缘之外。更大的模型或以 3D 为主的内容改用 volume 或 immersive space。
- **补充内容放在相邻窗口，而不是 ornament。** Ornament 虽然灵活到可以当自定义组件用，但最适合 app 专属交互控件（toolbar、视频播放控件等），不适合补充内容。展示补充内容视图时，用 defaultWindowPlacement(_:) 在当前窗口旁打开新窗口。
- **在控件周围留出足够空间便于交互。** 空间要足以让控件清晰可辨，并防止系统 hover 效果遮挡其他内容。例如按钮中心至少相距 60 pt（另见 Eyes、Spatial layout、visionOS）。

### watchOS

- **避免在界面中并排放置超过两三个控件。** 一般规则：一行最多显示 3 个含图标的按钮，或 2 个含文本的按钮。文本按钮通常最好横跨全屏宽度；两个短文本标签按钮并排也可行，前提是屏幕不滚动。
- **在人们可能想展示给他人的视图中支持自动旋转。** 佩戴者手腕翻转离开时，app 通常息屏响应，但某些场景适合自动旋转内容：如向朋友展示图片、向读码器展示 QR code（开发参考：isAutorotating）。

## 数值速查

| 主题 | 数值 |
|---|---|
| tvOS Safe Area：主要内容距屏幕上/下 | 60 pt |
| tvOS Safe Area：主要内容距屏幕左/右 | 80 pt |
| tvOS 网格（2–9 列）：未聚焦内容宽度 | 860 / 560 / 410 / 320 / 260 / 217 / 184 / 160 pt |
| tvOS 网格：水平间距 / 最小垂直间距 | 40 pt / 100 pt |
| visionOS 控件间距：按钮中心间距 | ≥ 60 pt |
| watchOS 一行并排控件上限 | ≤ 3 个含图标的按钮，或 ≤ 2 个含文本的按钮 |
