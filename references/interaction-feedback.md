# 交互与反馈（Feedback / Gestures / Haptics / Loading）

> 来源: https://developer.apple.com/design/human-interface-guidelines/feedback · https://developer.apple.com/design/human-interface-guidelines/gestures · https://developer.apple.com/design/human-interface-guidelines/playing-haptics · https://developer.apple.com/design/human-interface-guidelines/loading
> 整理自 Apple HIG 原文（2026-09 抓取）。规范条目忠实原文，未新增规则。

---

## 一、Feedback（反馈）

反馈帮助用户了解正在发生什么、发现下一步可做什么、理解操作结果、避免错误。清晰一致的反馈让 app 直觉化并鼓励深入探索。反馈可以传达：

- 某事物的当前状态
- 重要任务或操作的成败
- 对可能有负面后果的操作的警告
- 纠正错误或问题状况的机会

最有效的反馈让信息的重要程度匹配其呈现方式：状态信息宜被动呈现（用户需要时查看）；而可能导致数据丢失的警告必须打断用户，让用户有机会避免问题。

### Best practices

- **确保所有反馈都是无障碍的。** 用多种方式提供反馈，能让更多用户以适合自己的方式接收。例如同时用颜色、文本、声音和 haptics 反馈，用户无论静音设备、移开视线还是使用 VoiceOver，都能收到反馈。（触感反馈参见下文"Playing haptics"。）
- **考虑把状态反馈集成进界面本身。** 状态信息位于所描述对象附近时，用户无需操作或离开当前上下文即可获得关键信息。如 iOS/iPadOS 的 Mail 在邮箱工具栏描述最近更新并显示未读数量——不显眼但随时可查。
- **用 Alert 传达关键且最好可操作的信息。** Alert 天生打断当前上下文，必须让信息重要程度匹配打断程度。过度使用或传达不重要信息会让 Alert 失去作用。参见 Alerts。
- **当用户发起可能造成意外且不可逆数据丢失的任务时发出警告。** 反之，数据丢失是用户操作的预期结果时**不要警告**——例如 Finder 不在每次用户把文件扔进废纸篓时警告，因为删除正是预期结果。
- **在合理时确认重要操作或任务已完成。** 例如用户希望得到 Apple Pay 交易成功的反馈。此类确认只保留给足够重要的活动——因为用户通常默认任务会成功，只需在失败时得知。
- **告知用户命令无法执行，并帮助其理解原因。** 例如请求路线却未指定目的地时，Maps 会说明无法提供起点终点相同的路线。

### Platform considerations

iOS/iPadOS/macOS/tvOS/visionOS 无额外考虑。

- **watchOS：避免显示不确定进度的指示器（如 loading 指示器）。** 动画指示器会让用户觉得需要继续盯着屏幕，体验不好。更好的做法是让用户确信进程完成后会收到通知。

---

## 二、Gestures（手势）

手势是用户用身体动作直接影响 app 内对象的方式。用户可在触摸屏上、空中，或通过触控板、鼠标、遥控器、带触控面的游戏控制器等输入设备做手势。所有平台都支持 tap、swipe、drag 等基础手势——用户熟悉其底层功能，期望在任何地方都能用。

### Best practices

- **给用户不止一种与 app 交互的方式。** 用户常常偏好或需要语音、键盘、Switch Control 等其他输入方式。**不要假设用户能用手势完成某项任务。** 参见 Accessibility。
- **通常应按用户预期响应手势。** 用户期望多数手势在任何上下文中表现一致：tap 激活或选中对象。避免用 tap、swipe 等熟悉手势执行 app 特有操作；也避免创造独特手势执行标准操作（激活按钮、滚动长视图等）。
- **尽可能让手势响应灵敏。** 手势是直接操纵体验的核心，须提供即时反馈：用户做手势时，反馈应帮助预测结果，必要时说明完成动作所需的移动幅度与类型。
- **明确指示手势不可用。** 不清楚说明手势为何无效，用户会以为 app 冻结或自己做错了。例如拖动锁定对象时 UI 可能不提示位置已锁定；激活不可用按钮时，不可用状态可能与可用状态难以区分。

### Custom gestures（自定义手势）

**仅在必要时添加自定义手势。** 自定义手势最适合频繁执行的、现有手势不覆盖的专门任务（如游戏或绘画 app）。实现自定义手势时确保它：

- 可被发现（Discoverable）
- 执行简单（Straightforward to perform）
- 与其他手势有区分（Distinct from other gestures）
- 不是执行 app 重要动作的唯一途径

- **让自定义手势易学。** 在 app 中提供帮助用户快速学会并执行的引导，并在真实场景中测试。如果很难用简单的语言和图形描述一个手势，说明用户也会觉得难学难做。
- **用快捷手势补充标准手势，而非替代。** 用户始终需要简单熟悉的导航方式，即使多一两次点击。例如层级导航 app 保留顶部工具栏的 Back 按钮（一次点击返回），再叠加侧边滑动等快捷手势加速操作。
- **避免与访问系统 UI 的手势冲突。** 多个平台有访问系统行为的专用手势（watchOS 边缘滑动、visionOS 翻手访问系统 overlay 等）。**不要定义可能与这些手势冲突的自定义手势**——用户期望系统控件表现一致。仅游戏或沉浸式体验的特定情形下，开发者可通过延迟系统手势绕开（见平台考虑）。

### Platform considerations

#### iOS, iPadOS

| 手势 | 常见动作 |
|---|---|
| 三指滑动 | 撤销（左滑）；重做（右滑） |
| 三指捏合 | 复制选中文本（捏合）；粘贴已复制文本（张开） |
| 四指滑动（仅 iPadOS） | 切换 app |
| 摇晃（Shake） | 撤销；重做 |

- **如果提升体验，考虑允许多个手势同时识别。** 非游戏 app 中同时手势用处不大，但游戏可包含操纵杆和开火按钮等多个屏幕控件同时操作。

#### macOS

用户主要用键盘和鼠标交互 macOS；也可在 Magic Trackpad、Magic Mouse 或带触控面的游戏控制器上使用标准手势。

#### tvOS

用户期望用兼容遥控器、Siri Remote 或带触控面的游戏控制器以标准手势导航 tvOS app 和游戏。参见 Remotes。

#### visionOS

visionOS 支持两类手势：**indirect（间接）** 与 **direct（直接）**。

- **间接手势**：用户注视目标来定位，再隔空用手操作。例如注视按钮聚焦后，快速捏合手指与拇指选中。间接手势在任何距离都舒适，允许快速切换焦点、以最小移动选择。
- **直接手势**：物理触摸交互对象。例如直接点按 visionOS 虚拟键盘。直接手势适用于触手可及之处；因持续抬臂易疲劳，最好只用于不频繁的操作。visionOS 同时支持所有标准手势的直接版本，用户可自由选择直接或间接交互。

标准直接手势：

| 直接手势 | 常见用途 |
|---|---|
| Touch（触摸） | 直接选中或激活对象 |
| Touch and hold | 打开上下文菜单 |
| Touch and drag | 将对象移到新位置 |
| Double touch | 预览对象/文件；编辑场景中选中一个词 |
| Swipe | 显示操作与控件；关闭视图；滚动 |
| 双手捏合并一起/分开拖动 | 放大或缩小 |
| 双手捏合并画圈拖动 | 旋转对象 |

- **尽可能支持标准手势。** 用户注视对象后，tap 通常是首选的选择/激活手势。即使支持自定义手势，支持 tap 等标准手势能帮助用户快速上手。
- **尽可能同时提供间接与直接交互。** UI 与常见组件（如按钮）优先间接手势；直接手势与自定义手势保留给吸引近距离交互的对象，或游戏/交互体验中的特定动作。
- **避免要求特定的身体动作或姿势作为输入。** 并非所有用户随时都能做特定动作或保持特定姿势（残障、空间限制等）。体验需要动作时，考虑支持替代输入。

##### visionOS 自定义手势设计

自定义手势需要 app 运行在 Full Space，并请求用户授权访问手部信息。要点：

- **优先舒适。** 持续测试所有自定义手势的人体工学。要求保持抬臂哪怕一会儿都会疲劳；连续重复相似动作会劳损肌肉关节。
- **谨慎考虑涉及多指或双手的复杂自定义手势。** 用户不一定双手可用。需要复杂手势时，考虑同时提供动作量更小的替代方案。
- **避免要求使用特定手。** 记住"必须用哪只手"增加认知负荷；对手部主导习惯或肢体差异的用户也不友好。

##### visionOS 系统 overlay 的配合

visionOS 2 起，用户可注视一只手掌心并用快捷手势访问 Home 与 Control Center 的系统 overlay；这些交互系统级保留，仅用于访问系统 overlay。

> **Note:** 系统 overlay 是 visionOS 2+ 访问 Control Center 的默认方式；visionOS 1 的"向上看"行为保留为无障碍设置。

- **把手部周围区域留给系统 overlay 及其手势。** 尽可能**不要把内容锚定到用户的手或手腕**。设计手部锚定内容的游戏时，把内容放在手掌紧邻区域之外，避免与 Home 指示条冲突。
- **沉浸式 app 或游戏可考虑延迟系统 overlay 行为。** 某些情形（如使用虚拟手/手套的游戏）可能不希望用户看掌心时出现 Home 指示条。app 运行在 Full Space 时，可选择要求先点击一次才显示 Home 指示条（开发参考：`persistentSystemOverlays(_:)`）。
- **谨慎设计涉及手、手腕、前臂翻转动作的自定义手势。** 该动作专用于呼出系统 overlay；系统 overlay 始终显示在 app 内容之上、app 无法感知其可见性，必须测试可能冲突的手势与内容。

> **Note:** 为 visionOS 1 构建的 app 默认延迟系统 overlay 行为：app 在 Full Space 运行时，用户注视掌心不会显示 Home 指示条，除非先点击。

#### watchOS

##### Double tap（双击）

watchOS 11+，用户可用双击手势滚动列表和 scroll view、在垂直 tab 视图间前进。可将 toggle 或按钮指定为 app（或 Smart Stack 中 widget/Live Activity）的 primary action——在带 primary action 的视图中双击会先高亮该控件再执行动作。系统也支持通知中的自定义动作：双击执行通知中第一个非破坏性动作。

- **避免在含列表、scroll view 或垂直 tab 的视图中设置 primary action。** 这与用户双击时预期的默认导航行为冲突。
- **选择用户最常用的按钮作为视图的 primary action。** 在不滚动的视图中，双击应执行用户最常用的动作。如媒体控制视图中把播放/暂停按钮设为 primary action。

### Specifications：标准手势（Standard gestures）

系统为所有平台提供以下标准手势支持（触摸屏、visionOS 间接手势、触控板/鼠标/遥控器/游戏控制器）：

| 手势 | 支持平台 | 常见动作 |
|---|---|---|
| Tap | iOS, iPadOS, macOS, tvOS, visionOS, watchOS | 激活控件；选中条目 |
| Swipe | iOS, iPadOS, macOS, tvOS, visionOS, watchOS | 显示操作与控件；关闭视图；滚动 |
| Drag | iOS, iPadOS, macOS, tvOS, visionOS, watchOS | 移动 UI 元素 |
| Touch (or pinch) and hold | iOS, iPadOS, tvOS, visionOS, watchOS | 显示额外控件或功能 |
| Double tap | iOS, iPadOS, macOS, tvOS, visionOS, watchOS | 放大（已放大则缩小）；在 Apple Watch Series 9 / Ultra 2 上执行 primary action |
| Zoom | iOS, iPadOS, macOS, tvOS, visionOS | 缩放视图；放大内容 |
| Rotate | iOS, iPadOS, macOS, tvOS, visionOS | 旋转选中项 |

---

## 三、Playing haptics（触感反馈）

播放 haptics 可调动用户触觉，把对物理世界的熟悉感带入 app。系统可在视觉与听觉反馈之外播放 haptics：switch、slider、picker 等组件在受支持的 iPhone 上自动播放触感；Apple Watch 的 Taptic Engine 为多种内置反馈模式生成触感（配合声音）；配备 Force Touch 触控板的 Mac 上，app 可在拖动内容或 force click 时播放触感。部分外部输入设备也支持触感（游戏控制器、Apple Pencil 和部分触控板）。

### Best practices

- **按系统文档的含义使用系统提供的 haptic 模式。** 用户认识标准触感，因为系统在标准控件上始终一致地播放它们。如果某模式的文档用途在 app 中说不通，**不要挪作他用**——改用通用模式或在支持的平台上自建。参见 Custom haptics。
- **在整个 app 中一致地使用 haptics。** 必须为每种触感与其触发动作建立清晰的因果关系，让用户把特定触感模式与特定体验关联。不强化因果关系的触感令人困惑、显得多余。例如游戏在角色任务失败时播放某触感模式，用户会将其与负面结果关联；若同一模式又用于正面结果（如通关），用户会困惑。
- **优先让 haptics 补充其他反馈。** 视觉、听觉、触觉反馈和谐一致时（物理世界通常如此），体验更连贯自然。触感的强度与锐度应与其伴随动画的强度与锐度匹配；也可让声音与触感同步。
- **避免过度使用 haptics。** 偶尔一次恰到好处，频繁播放则令人厌烦。用户测试有助于找到多数人喜欢的平衡。最好的触感体验往往是用户未必有意识注意到、但关掉后会想念的。
- **多数 app 中优先播放补充离散事件的短触感。** 长时间伴随游戏流程的触感可以增强体验，但 app 中的长触感会稀释反馈含义、分散任务注意力。例如 Apple Pencil Pro 上持续或长久的触感并不能改善书写绘画体验，甚至降低握持舒适度。
- **让触感可关闭。** 允许用户关闭或静音 haptics，并确保没有触感时用户仍能享受 app。
- **注意播放触感可能影响其他体验。** 触感产生的物理振动须确保不干扰涉及摄像头、陀螺仪或麦克风的体验。

### Custom haptics（自定义触感）

游戏常用自定义触感增强玩法；非游戏 app 也可用其提供更丰富愉悦的体验。可设计随用户输入或上下文动态变化的触感模式。两种基本构建块：

- **Transient（瞬态）事件**：短暂紧凑，像点按或脉冲。如点按主屏幕手电筒按钮的触感。
- **Continuous（持续）事件**：像持续的振动，如信息 app 中激光效果的触感。

无论哪种事件类型，还可控制 **sharpness（锐度）** 与 **intensity（强度）**：sharpness 把触感体验抽象为波形——可表达柔和圆润有机，或清脆精准机械的质感；intensity 即触感强弱。组合两种事件、变化锐度与强度、加入可选音频，可创造广泛的触感体验（开发参考：Core Haptics）。

### Platform considerations

#### iOS

在受支持的 iPhone 上：

- 使用播放 Apple 设计系统触感的标准 UI 组件——toggles、sliders、pickers 默认自带。
- 适时用 feedback generator 播放以下类别的预定义触感模式（开发参考：UIFeedbackGenerator）：
  - **Notification**：对任务或操作结果的反馈（如存支票、解锁车辆）。
  - **Impact**：为视觉体验提供物理隐喻（视图到位时的 tap、两个重物碰撞的 thud）。
  - **Selection**：UI 元素取值变化过程中提供的反馈。

#### macOS

有 Magic Trackpad 时，app 可在拖动操作或 force click 时播放以下三种触感模式：

| 触感模式 | 说明 |
|---|---|
| Alignment | 指示被拖动项的对齐。如绘画 app 中拖动形状与另一形状对齐；也可用于缩放适配、定位到偏好位置、到达擦洗条起止/最小最大值 |
| Level change | 指示离散压力层级间的移动。如按快进按钮时播放速度逐级变化，到达不同压力层级时提供触感 |
| Generic | 其他模式不适用时的一般反馈 |

#### watchOS

Apple Watch Series 4+ 为 Digital Crown 提供触感反馈，滚动内容时更具触感。默认系统提供线性 haptic detents，旋转表冠时可以感觉到；部分系统控件（如 table view）在新条目滚入屏幕时提供 detents。watchOS 定义了一组各自传达特定含义的触感类型（开发参考：WKHapticType）。

---

## 四、Loading（加载）

最好的内容加载体验，在用户察觉之前就已完成。若 app 需要加载资源、关卡或其他内容，设计加载行为使其不破坏、不影响用户体验。

### Best practices

- **尽快显示内容。** 让用户盯着空白等待加载完成，他们会以为 app 出了问题。应考虑在加载时显示占位文本、图形或动画，内容就绪后替换。
- **让用户在等待加载时可以做其他事。** 后台加载内容让用户可以访问其他功能。如游戏在后台加载下一关内容，玩家可先了解关卡或查看游戏内菜单。
- **加载不可避免地耗时长时，给用户看点有意思的内容。** 如玩法提示、使用技巧、新功能介绍。尽可能准确地估算剩余加载时间，避免占位内容时间太短没看完、或太长需要重复。
- **后台下载大体积资源，改善安装与启动耗时。** 考虑用 Background Assets framework 把大资源下载（游戏关卡包、3D 角色模型、纹理等）安排在安装完成后立即、更新期间或其他不打扰的时机进行。

### Showing progress（显示进度）

- **清晰传达内容正在加载、大概还需多久。** 理想情况内容即时显示；加载超过片刻时，使用系统提供的 **progress indicator** 表明加载正在进行。知道加载时长时用 **determinate（确定型）** 进度指示器；不知道时用 **indeterminate（不确定型）**。参见 Progress indicators。
- **游戏可考虑创建自定义加载视图。** 标准进度指示器适合多数 app，但在游戏中可能显得格格不入。可设计与游戏风格匹配的自定义动画和元素，营造更投入的体验。

### Platform considerations

iOS/iPadOS/macOS/tvOS/visionOS 无额外考虑。

- **watchOS：尽可能避免在体验中显示 loading 指示器。** 用户期望与 Apple Watch 快速交互，力争立即显示内容。内容需要一两秒才能加载时，显示加载指示器也比空白屏幕好。

---

## 数值速查

| 项目 | 数值 |
|---|---|
| watchOS 不确定进度指示器 | 避免；需 1-2 秒加载时宁显示指示器也不白屏 |
| iOS 多指手势 | 三指滑动=撤销/重做；三指捏合=复制/粘贴；四指滑动（仅 iPadOS）=切换 app；Shake=撤销/重做 |
| 系统 haptic 三类别（iOS） | Notification / Impact / Selection |
| macOS 触感模式（3 种） | Alignment / Level change / Generic |
| visionOS 双手捏合手势 | 拖动分合=缩放；画圈拖动=旋转 |
| 进度指示器选择规则 | 知道时长用 determinate；不知道用 indeterminate |
| watchOS 双击（double tap） | 执行视图 primary action；列表/滚动视图中为导航，勿设 primary action |
