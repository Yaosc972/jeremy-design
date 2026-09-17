# 各平台设计要点（Designing for iOS / iPadOS / macOS / visionOS / watchOS）

> 来源: https://developer.apple.com/design/human-interface-guidelines/designing-for-ios 、 https://developer.apple.com/design/human-interface-guidelines/designing-for-ipados 、 https://developer.apple.com/design/human-interface-guidelines/designing-for-macos 、 https://developer.apple.com/design/human-interface-guidelines/designing-for-visionos 、 https://developer.apple.com/design/human-interface-guidelines/designing-for-watchos
> 整理自 Apple HIG 原文（2026-09 抓取）。规范条目忠实原文，未新增规则。

> **公共框架说明（不逐条重复）：** 五个平台页面的结构相同——先列设备特征（iOS/iPadOS/macOS/watchOS 为 Display / Ergonomics / Inputs / App interactions / System features；visionOS 为 Space / Immersion / Passthrough 等），再给 Best practices。核心方法论一致：先理解区分该平台体验的设备特征与模式，再用它们指导设计决策，让 app 在该平台"feel at home"。以下按平台提炼各自独有的规范差异；跨平台共通的原则（如适应 Dark Mode、尊重用户配置）仅在该平台条目有额外限定时列出。

---

## 一、Designing for iOS（iPhone）

人们依赖 iPhone 在任何地点、移动中保持连接、玩游戏、看媒体、完成任务、追踪个人数据。

### 设备特征

- **Display**：中等尺寸、高分辨率屏幕。
- **Ergonomics**：通常单手或双手握持，按需在横竖屏之间切换；交互时观看距离一般不超过 1–2 英尺（a foot or two）。
- **Inputs**：Multi-Touch gestures、virtual keyboards、voice（Siri）控制让人们在移动中完成有意义的任务。此外，人们常希望 app 使用其 personal data（隐私）及陀螺仪/加速度计输入，也可能希望参与 spatial interactions。
- **App interactions**：有时只花一两分钟查看事件或社交媒体更新、追踪数据、发消息；有时花一小时以上浏览网页、玩游戏、欣赏媒体。人们通常同时打开多个 app，并频繁在它们之间切换。
- **System features**：iOS 提供以下系统特性——Widgets、Home Screen quick actions、Spotlight、Shortcuts、Activity views。

### Best practices

- 通过**限制屏幕上的控件数量**帮助人们专注于主要任务和内容，同时让次要细节与操作以最少交互即可发现。
- **无缝适应外观变化**——设备方向（orientation）、Dark Mode、Dynamic Type 等——让人们自行选择最适合的配置。
- **支持符合人们握持习惯的交互**。例如控件位于屏幕中部或底部时更易、更舒适地够到，因此支持滑动返回上一级、以及在列表行中滑动发起操作尤为重要。
- 在获得许可的前提下，**整合平台能力提供的信息，提升体验而无需人们手动输入数据**。例如接受支付、通过 biometric authentication 提供安全保护、或提供使用设备位置的功能。

---

## 二、Designing for iPadOS（iPad）

人们看重 iPad 的强大、移动性与灵活性：欣赏媒体、玩游戏、执行细致的生产力任务、把创作变为现实。

### 设备特征

- **Display**：大尺寸、高分辨率屏幕。
- **Ergonomics**：人们常手持使用，也可能放在桌面或支架上。摆放方式会改变观看距离，但交互时通常在设备约 3 英尺以内。
- **Inputs**：Multi-Touch gestures、virtual keyboards、外接键盘或 pointing device、Apple Pencil、voice——且人们经常**组合使用多种输入模式**。
- **App interactions**：有时只执行几个快速操作；有时连续数小时沉浸于游戏、媒体、内容创作或生产力任务。人们经常同时打开多个 app，乐于同屏查看多个 app，并利用 drag and drop 等跨 app 能力。
- **System features**：iPadOS 提供以下系统特性——Multitasking、Widgets、Drag and drop。

### Best practices

- **利用大屏突出人们关心的内容**：减少 modal 界面与全屏转换，把屏幕控件放在易够到但不碍事的位置。
- **用观看距离和输入模式来决定屏幕内容的尺寸与密度**。
- **支持多种输入方式**：Multi-Touch 手势、物理键盘或 trackpad、Apple Pencil，并考虑支持组合多种输入模式的独特交互。
- **无缝适应外观变化**——设备方向、multitasking 模式、Dark Mode、Dynamic Type——并**顺畅过渡到在 macOS 上运行**，让人们自行选择最适合的配置。

---

## 三、Designing for macOS（Mac）

人们依靠 Mac 的强大、宽敞与灵活性执行深度生产力任务、观看媒体内容、玩游戏，且常常同时使用多个 app。

### 设备特征

- **Display**：通常是大尺寸、高分辨率屏幕，且可通过连接额外显示器（包括 iPad）扩展工作区。
- **Ergonomics**：一般在静止状态使用，常把设备放在桌面上；典型用例下观看距离约 1–3 英尺。
- **Inputs**：人们期望以**任意组合的输入模式**输入数据、控制界面——physical keyboards、Pointing devices、Game controls、Siri。
- **App interactions**：交互时长从几分钟的快速任务到数小时的深度专注不等。人们频繁同时打开多个 app，并在切换时**期望 app 在活跃与非活跃状态之间平滑过渡**。
- **System features**：macOS 提供以下系统特性——The menu bar、File management、Going full screen、Dock menus。

### Best practices

- **利用大屏以更少的嵌套层级呈现更多内容、降低对 modality 的需求**，同时保持舒适的信息密度——不让人们费力去看想看的内容。
- **让人们可以调整大小、隐藏、显示和移动你的窗口**，以适应其工作方式与设备配置；支持全屏模式提供无干扰上下文。
- **用 menu bar 让人们轻松访问在 app 中执行操作所需的全部命令**。
- **帮助人们利用高精度输入模式进行像素级的精确选择与编辑**。
- **处理 keyboard shortcuts**，帮助人们加速操作、支持纯键盘工作方式。
- **支持个性化**：让人们自定义 toolbars、配置窗口显示最常用的视图、选择界面中想看到的颜色与字体。

---

## 四、Designing for visionOS（Apple Vision Pro）

戴上 Apple Vision Pro，人们进入一个无限 3D 空间，在与周围环境保持连接的同时使用你的 app 或游戏。

### 设备特征

- **Space**：Vision Pro 提供无限画布，人们可在其中查看 Windows、visionOS volumes 与 3D 物体，并可选择进入能"传送"到不同地点的深度沉浸体验。
- **Immersion**：visionOS app 中人们可在不同沉浸级别间流畅切换。默认 app 启动于 *Shared Space*——多个 app 并排运行，人们可打开、关闭、移动窗口；人们也可把 app 切到 *Full Space*——此时它是唯一运行的 app。Full Space 中可查看与周围环境融合的 3D 内容、打开 portal 通往别处、或进入另一个世界。
- **Passthrough**：沉浸与 passthrough 由设备外部摄像头提供实时视频，帮助人们在看到真实环境的同时与虚拟内容交互。想看到更多或更少周围环境时，人们用 Digital Crown 控制 passthrough 的量。
- **Spatial Audio**：Vision Pro 结合声学与视觉感知技术建模周围环境的声学特性，自动让声音在用户空间中显得自然。app 经许可访问环境信息后，可微调 visionOS 打造定制体验。
- **Eyes and hands**：总体上，人们用眼睛注视虚拟对象，然后做 *indirect* 手势（如 tap）激活它；也可以用 *direct* 手势（如用手指触摸）与虚拟对象交互。
- **Ergonomics**：佩戴 Vision Pro 时，人们看到的真实与虚拟内容全部来自设备摄像头，因此**维持视觉舒适是第一要务**。系统自动把内容放置为相对于佩戴者头部的位置（不论身高、坐立或躺卧）来帮助保持舒适。visionOS 让内容走向人们——而不是让人移动去够内容——因此人们可以在静止休息的状态下使用 app 与游戏。
- **Accessibility**：Vision Pro 支持 VoiceOver、Switch Control、Dwell Control、Guided Access、Head Pointer 等无障碍技术。与其他平台一样，系统提供的 UI 组件默认内建无障碍支持，系统框架也提供增强无障碍的方式。

> **Important:** 为 Apple Vision Pro 构建 app 时，务必考虑设备及其空间计算环境的独特特征，并**特别关注用户安全**（详见 Apple Vision Pro User Guide）。例如：驾驶车辆或操作重型机械时不应使用 Apple Vision Pro；在阳台、街道、楼梯等不安全环境附近移动时也不适合使用。Apple Vision Pro 仅设计给 13 岁及以上人士佩戴使用。

### Best practices

- **Embrace the unique features of Apple Vision Pro.**（拥抱 Vision Pro 的独特能力。）利用 Space、Spatial Audio 与 immersion 为体验注入生命力，同时以贴合设备气质的方式整合 passthrough 与眼手空间输入。
- **Consider different types of immersion as you design ways to present your app's most distinctive moments.**（为 app 最独特的时刻设计呈现方式时，考虑不同类型的沉浸。）可在窗口化、以 UI 为中心的上下文呈现，也可完全沉浸，或介于两者之间。为 app 的每个关键时刻找到**适配的最低沉浸级别**——不要假定每个时刻都需要 fully immersive。
- **Use windows for contained, UI-centric experiences.**（以窗口承载收敛的、UI 中心的体验。）帮助人们完成标准任务时，优先使用以空间平面形式呈现、包含熟悉控件的标准窗口。visionOS 中人们可把窗口移到任何地方，系统的 Scale 帮助窗口内容无论远近都保持可读。
- **Prioritize comfort.**（舒适优先。）帮助人们在交互中保持舒适、身体放松，牢记以下基础项：
  - 在人的 Field of view（视野）内显示内容，并将其相对头部定位。避免把内容放在需要转头或改变姿势才能交互的位置。
  - 避免呈现压倒性、刺眼、过快、或缺少静止参照系的内容。
  - 支持人们在双手放在腿上或体侧的状态下与 app 交互。
  - 若支持 direct 手势，确保可交互内容不太远，且人们无需长时间持续交互。
  - 在 fully Immersive 体验中避免鼓励人们过多移动。
- **Help people share activities with others.**（帮助人们与他人共享活动。）使用 SharePlay 支持共享活动时，人们可查看其他参与者的 *spatial Personas*，营造出大家共处同一空间的感觉。

---

## 五、Designing for watchOS（Apple Watch）

人们瞥一眼 Apple Watch，就知道无论静止还是运动中，都能获取关键信息、完成简单而及时的任务。

### 设备特征

- **Display**：小巧的 Apple Watch 屏幕戴在手腕上，同时提供易读的高分辨率体验。
- **Ergonomics**：因为是佩戴设备，抬腕观看时人们通常距屏幕不超过 1 英尺，用另一只手交互。Always On display 让人们放下手腕时也能在表盘上查看信息。
- **Inputs**：转动 Digital Crown 可垂直导航或检查数据——它在表盘、Home Screen 与 app 内提供一致的控制。运动中也可用 tap、swipe、drag 等标准手势输入。按 Action button 可不看屏幕就发起一项关键操作；shortcuts 帮助人们快速轻松完成例行任务。还可利用设备功能提供的数据：GPS、血氧与心功能传感器、高度计、加速度计、陀螺仪。
- **App interactions**：人们一天中多次瞥视 Always On display，进行每次常常不到 1 分钟的简短 app 交互。人们对 watchOS app 相关体验——complications、notifications、Siri 交互——的使用**常常多于 app 本身**。
- **System features**：watchOS 提供以下系统特性——Complications、Notifications、Always On、Watch faces。

### Best practices

- 支持**快速、glanceable（一眼可读）、单屏**的交互：简洁传达关键信息，让人们用一两个简单手势完成针对性操作。
- **最小化 app 导航的层级深度**，用 Digital Crown 提供垂直导航（滚动或切换屏幕）。
- **个性化体验**：主动预判人们的需求，用设备端数据提供当下或即将相关的可操作内容。
- 用 **complications** 把相关的（可能是动态的）数据与图形直接放到表盘上——人们每次抬腕可见，点按即可直达 app。
- 用 **notifications** 传递及时、高价值的信息，让人们不打开 app 也能执行重要操作。
- 用颜色等**背景内容**传达有用的辅助信息，并用 materials 表达层级与位置感。
- 让 app **独立运作**：与 notifications 和 complications 互补，提供更多细节与功能。
