# 组件与控件（Buttons / Alerts / Menus / Sheets / Tab Bars / Segmented Controls / Toggles / Sliders / Pickers / Text Fields）

> 来源: https://developer.apple.com/design/human-interface-guidelines/buttons · /alerts · /menus · /sheets · /tab-bars · /segmented-controls · /toggles · /sliders · /pickers · /text-fields
> 整理自 Apple HIG 原文（2026-09 抓取）。规范条目忠实原文，未新增规则。

---

## 1. Button（按钮）

### 用途

Button 触发即时（instantaneous）动作。Button 由三个属性组合传达功能：

- **Style（样式）**：基于尺寸、颜色、形状的视觉样式。
- **Content（内容）**：符号（icon）、文本标签，或两者。
- **Role（角色）**：系统定义的角色，标识按钮语义含义，可影响外观。

许多类按钮组件有独立外观与行为：Toggle、Pop-up button、Segmented control。

### 变体

- **iOS/iPadOS**：可将按钮配置为在延迟完成时显示 activity indicator。
- **macOS** 专属类型：
  - **Push button（按压按钮）**：标准按钮，可显示文本/符号/icon/图像组合，可作默认按钮、可着色。
  - **Square button（方形按钮，又称 gradient button）**：触发与某个视图相关的动作（如增删表格行），只含符号或 icon（不含文本），可配置为 push/toggle/pop-up 行为。
  - **Help button（帮助按钮）**：圆形、统一尺寸、含问号，打开 app 帮助文档。
  - **Image button（图像按钮）**：在视图中显示图像/符号/icon，可配置为 push/toggle/pop-up 行为。
- **visionOS**：三种标准形状——icon-only 用圆形，text-only 用 roundedRectangle 或 capsule，icon+text 用 capsule。按钮以不同视觉样式表达四种交互状态；通常有可见背景并在交互时播放声音。
- **watchOS**：所有 inline 按钮使用 capsule 形状；与内容并置时获得材质效果以保证可读性。

visionOS 按钮尺寸（pt）与形状可用性矩阵（✓ = 该形状有此尺寸；— = 无）：

| 形状 | Mini (28 pt) | Small (32 pt) | Regular (44 pt) | Large (52 pt) | Extra large (64 pt) |
|---|---|---|---|---|---|
| Circular | ✓ | ✓ | ✓ | ✓ | ✓ |
| Capsule（仅文本） | — | ✓ | ✓ | ✓ | — |
| Capsule（文本+icon） | — | — | ✓ | ✓ | — |
| Rounded rectangle | — | ✓ | ✓ | ✓ | — |

> **Note:** macOS 和 visionOS 中，悬停片刻后系统显示 tooltip（解释按钮用途的简短短语）。visionOS 的按钮**不支持自定义 hover 效果**；按钮含文本时通常无需 tooltip。

### 行为规范（Best practices）

- **让按钮易于使用。** 按钮周围必须有足够空间，使其与周围组件和内容在视觉上可区分；足够的空间对选中/激活按钮也至关重要（无论何种输入方式）。一般规则：按钮需要**至少 44x44 pt 的 hit region**——visionOS 为 **60x60 pt**——确保用指尖、指针、眼睛或遥控器都能轻松选中。
- **自定义按钮必须包含按压状态（press state）。** 没有按压状态的按钮让人感觉无响应，怀疑输入未被接受。
- **通常为视图中最可能的操作使用视觉突出的按钮样式。** 突出样式让系统给按钮背景应用 accent color；带颜色的按钮最具视觉辨识度。**每个视图的 prominent 按钮控制在 1-2 个**——太多会增加认知负荷。
- **用样式——而非尺寸——区分多个选项中的首选。** 等尺寸按钮表明它们是一组连贯选项；大小不一的按钮并置让界面混乱不一致。突出首选项用更突出的样式，其余用较不突出的样式。
- **避免给按钮标签和内容层背景使用相近颜色。** 内容层已有明亮多彩内容时，优先使用按钮标签的默认单色（monochromatic）外观。参见 Liquid Glass color。
- **确保每个按钮清晰传达其用途。** 依据平台，按钮可含符号、文本标签或两者。
- **尽量把熟悉动作与熟悉图标关联。** 如 `square.and.arrow.up` 让人预测分享功能。使用图标时考虑现有或自定义 SF Symbols。参见 Standard icons。
- **短文本比图标更清晰时考虑用文本。** 用 title-style capitalization 写几个词，考虑以动词开头——如 "Add to Cart"。
- **为按钮分配角色（Role）：Normal（无特定含义）/ Primary（默认按钮，最可能被选择）/ Cancel（取消当前操作）/ Destructive（执行可能导致数据破坏的动作）。** 角色影响外观：primary 使用 app accent color，destructive 使用系统红色。
- **把 primary 角色分配给最可能被选择的按钮。** primary 响应 Return 键便于快速确认；在 Sheet、可编辑视图或 Alert 等临时视图中，primary 角色让按 Return 时视图自动关闭。
- **不要把 primary 角色分配给执行破坏性操作的按钮——即使该操作是最可能的选择。** 用户有时不读内容就选 primary 按钮；把 primary 留给非破坏性按钮帮助用户避免丢失内容。

#### 平台差异

- **iOS/iPadOS**：**需要为不会立即完成的操作提供反馈时，配置按钮显示 activity indicator。** 按钮内嵌指示器节省空间且明确延迟原因；可同时配置替代标签（如 "Checkout" 变为 "Checking out…"）。延迟发生时系统在原/替代标签旁显示指示器，隐藏按钮图像。
- **macOS push button**：
  - **仅在需要显示高或可变高度内容时使用 flexible-height push button。** 其支持与普通 push button 相同的配置（相同圆角与内容 padding），可容纳两行文本或高 icon；否则用标准 push button。
  - **push button 打开另一个窗口、视图或 app 时，标题结尾加省略号（…）。** 省略号表示需要用户额外输入。
  - **考虑支持 spring loading。** 配备 Magic Trackpad 的设备上，用户把选中项拖到按钮上方并 force click（重按）即可激活，且不放下选中项、可继续拖动。
- **macOS square button**：
  - **在视图内使用，不要放窗口框（window frame）。** 不用于 toolbar 或 status bar；需要工具栏按钮时用 toolbar item。
  - **优先使用符号。** SF Symbols 默认状态和交互响应下自动获得合适着色。
  - **避免用标签文字介绍 square button。** 其与视图紧密关联，无需描述性文本。
- **macOS help button**：
  - **使用系统提供的帮助按钮显示帮助文档。**
  - **尽可能打开与当前上下文相关的帮助主题**；无特定主题时打开帮助文档顶层。
  - **每个窗口 help button 不超过一个。** 同一上下文多个帮助按钮让人难以预测点击结果。
  - **放在用户预期位置**：

| 视图样式 | Help button 位置 |
|---|---|
| 带关闭按钮（如 OK、Cancel）的对话框 | 下角，与关闭按钮相对且垂直对齐 |
| 无关闭按钮的对话框 | 左下或右下角 |
| 设置窗口或面板 | 左下或右下角 |

  - **help button 放视图内而非窗口框**（避免放 toolbar 或 status bar）。
  - **避免显示介绍 help button 的文字。** 用户已知道它是干什么的。
- **macOS image button**：
  - **在视图内使用，不要放窗口框。** 工具栏中需要图像按钮时用 toolbar item。
  - **图像边缘与按钮边缘之间留约 10 px padding。** 按钮边缘即使不可见也定义了可点击区域，padding 保证未精确点击图像时点击也生效。一般避免给 image button 加系统提供的边框。
  - **如需标签，放在图像按钮下方。** 参见 Labels。
- **visionOS**：
  - **优先使用有可辨识背景形状和填充的按钮。** 对比背景填充的形状更容易被看到；例外是位于 toolbar、context menu、alert 或 Ornaments 中的按钮（所在组件的形状和材质已保证可见性）。按钮浮在 glass 上时用 thin 材质作背景；漂浮在空间中时用 visionOS 窗口材质作背景（注：原文抓取此处残缺，材质名称为按上下文推断）。
  - **避免创建白底黑字（黑 icon）的自定义按钮。** 系统保留该视觉样式用于表达 toggled 状态。
  - **通常优先圆形或 capsule 形状按钮。** 视线容易被形状的角吸引，越圆润越容易稳定注视。需要单独显示按钮时优先 capsule。
  - **按钮周围留足注视空间。** 按钮中心间距**至少 60 pt**；按钮尺寸 ≥60 pt 时四周加 **4 pt padding** 防止 hover 效果重叠。通常避免在垂直堆叠或水平行中显示 small 或 mini 按钮。
  - **在堆叠或行中显示带文本按钮时选对形状：垂直堆叠优先 rounded-rectangle，水平行优先 capsule。**
  - **使用标准控件以利用用户已熟悉的可听反馈。** visionOS 系统不播放 haptics，声音反馈尤其重要。
- **watchOS**：
  - **用 toolbar 把按钮放在角落。** 系统自动移动时间和标题以容纳工具栏按钮，并应用 Liquid Glass 外观与下方内容形成清晰区分。
  - **app 的 primary action 优先用横跨屏幕宽度的按钮。** 全宽按钮更好看、更易点按。两个按钮必须共享同一水平空间时，两者等高，内容用图像或短文本标题。
  - **用 toolbar 按钮提供到相关区域的导航或视图内容的上下文操作。**
  - **垂直堆叠的一行/两行文本按钮使用相同高度。** 尽可能用一致高度保持视觉一致。

### 何时不用

- 需要在两个对立状态间切换、从列表选择等场景，不要用普通 Button——分别使用 Toggle、Pop-up button、Segmented control 等类按钮组件。
- 按钮（square、image、help）不要放在窗口框/工具栏中——用 toolbar item。
- visionOS 中不要自定义白底黑字按钮样式（系统保留给 toggled 状态）。
- 按钮延迟完成时不要用系统 Alert 等打断——按钮内 activity indicator 即可。

---

## 2. Alert（警告框）

### 用途

Alert 立即向用户传达所需的关键信息：告知问题、警告操作可能破坏数据、让用户确认购买或其他重要操作。

### 变体（结构与内容）

Alert 是模态视图，在不同平台外观不同。所有平台显示：**标题 + 可选说明文本（informative text）+ 最多三个按钮**。部分平台可包含更多元素：

- iOS、iPadOS、macOS、visionOS 的 alert 可包含一个 text field。
- macOS 和 visionOS 的 alert 可包含 icon 和 accessory view。
- macOS alert 可加 suppression checkbox 和 help button。

> visionOS：Shared Space 中 alert 显示在 app 窗口前方（沿 z 轴略向前）；用户移动未关闭 alert 的窗口时，alert 保持锚定该窗口。Full Space 中 alert 居中于用户视野。macOS 自动显示 app icon，可替换；可配置可重复 alert 让用户抑制后续出现；必要时可附加自定义视图（accessoryView）和打开帮助文档的 help button。

### 行为规范（Best practices）

- **节制使用 Alert。** Alert 传达重要信息但打断当前任务。确保每个 alert 只包含必要信息和有用操作，用户才会重视。
- **避免仅为了提供信息而用 Alert。** 用户不喜欢只有信息、无法操作的打断。只需提供信息时，优先在相关上下文内用其他方式传达——如服务器连接不可用时 Mail 显示一个可点击了解更多详情的指示器。
- **避免为常见、可撤销的操作显示 Alert——即使操作是破坏性的。** 删除邮件或文件是用户主动丢弃数据、且可撤销的，无需每次警告。反之，**不常见的、不可撤销的破坏性操作必须用 Alert**，以防用户误触发。
- **避免在 app 启动时显示 Alert。** 需要在打开 app 时告知新信息或重要信息，设计易于发现的方式；启动时检测到问题（如无网络）考虑替代方案——如显示缓存/占位数据加一个说明问题的非侵入式标签。
- **所有 alert 文案直接表达，用中性、亲和的语气。** Alert 常描述问题和严重情形，避免拐弯抹角、指责用户，或掩盖问题的严重性。
- **标题清晰简洁地描述情况。** 帮助用户快速理解：完整具体但不冗长，尽可能说明发生了什么、上下文和原因。避免无信息量的标题（如 "Error" 或 "Error 329347 occurred"），也避免超过两行的过长标题。完整句用 sentence-style capitalization 和相应结尾标点；句子片段用 title-style capitalization，不加结尾标点。
- **仅在说明文本有附加价值时才包含。** 需要时保持尽可能短，用完整句、sentence-style capitalization 和相应标点。
- **避免在 alert 中解释按钮。** 文本与按钮标题清晰时无需解释。极少数需要指导选择按钮时，用 *choose* 这类不依赖设备的词，且用按钮的精确标题指代（不加引号）。
- **如平台支持，仅在需要用户输入才能解决情况时包含 text field。** 例如需要密码时显示安全文本输入框。
- **按钮标题简洁、有逻辑。** 用 1-2 个词描述选择按钮的结果；优先使用与 alert 文本直接相关的动词和动词短语（如 "View All"、"Reply"、"Ignore"）。仅纯信息性 alert 中可用 "OK" 表示接受，避免 "Yes"/"No"。取消 alert 动作的按钮**始终**用 "Cancel" 作为标题。所有按钮标题用 sentence-style capitalization，不加结尾标点。
- **避免用 OK 作为默认按钮标题，除非 alert 纯粹是信息性的。** 即使在请用户确认的 alert 中 "OK" 含义也可能不清："OK" 是"我要执行"还是"我知道后果了"？具体标题如 "Erase"、"Convert"、"Clear"、"Delete" 帮助用户理解自己在做什么。
- **把按钮放在用户预期的位置。** 通常最可能被选择的按钮放在按钮行尾（trailing side）或堆叠顶部；**默认按钮始终在行尾或堆叠顶部**；Cancel 通常在行首（leading side）或堆叠底部。
- **用 destructive 样式标识执行"用户并非有意选择"的破坏性操作的按钮。** 例如用户主动选择 Empty Trash 后，结果 alert 不对 Empty Trash 按钮应用 destructive 样式——该按钮执行的是用户本意，按 Return 确认的便利大于重申破坏性的收益；反之，用户原本未打算执行破坏性操作时，alert 用破坏性样式提醒很有价值。
- **存在破坏性操作时，包含 Cancel 按钮，给用户明确、安全地避开操作的方式。** 标题始终用 "Cancel"。**不要把 Cancel 设为默认按钮。** 若希望用户阅读 alert 而非自动按 Return 关闭，不要把任何按钮设为默认按钮。必须显示单按钮且为默认的 alert时，用 Done 按钮，不要用 Cancel 按钮。
- **合理时提供取消 alert 的替代方式**：

| 操作 | 平台 |
|---|---|
| 退出到主屏幕（Home Screen） | iOS, iPadOS |
| 外接键盘按 Escape (Esc) 或 Command-Period (.) | iOS, iPadOS, macOS, visionOS |
| 遥控器按 Menu | tvOS |

### 平台差异

- **iOS/iPadOS**：
  - **提供与用户有意操作相关的选项时用 Action Sheet——而非 Alert。** 如取消正在编辑的邮件时，action sheet 提供删除草稿/保存草稿/继续编辑等选择。alert 可确认或取消有破坏性后果的操作，但**不能**提供与该操作相关的其他选项。参见 Action sheets。
  - **尽量避免显示会滚动的 alert。** 用短标题和仅在必要时附简短消息来把滚动可能性降到最低。
- **macOS**：**节制使用警告符号**（如 `exclamationmark.triangle`）——过度使用削弱其分量。只在真正需要额外注意时使用，如确认可能导致意外数据丢失的操作时；仅用于覆盖或删除数据目的的任务（保存、清空废纸篓）不要使用。
- **visionOS**：如需在 alert 中显示 accessory view，视图最大高度 **154 pt**、圆角 **16 pt**。

### 何时不用

- 只提供信息、不可操作时不用 alert（用上下文内的指示器等替代）。
- 常见、可撤销的破坏性操作（删邮件、删文件）不用 alert。
- app 启动时不用 alert。
- iOS/iPadOS 中提供与意图操作相关的多个选项时用 Action Sheet 而非 alert。

---

## 3. Menu（菜单）

### 用途

Menu 在用户与之交互时展示其选项，是呈现命令节省空间的方式。打开 menu 展示一个或多个 **menu item**，每个代表影响当前选择或上下文的命令、选项或状态。菜单标注与组织的规范适用于所有类型菜单。

> **Note:** 多个系统组件内含菜单：Pop-up button / Pull-down button 展示与其动作直接相关的选项菜单；Context menu 提供与当前视图或任务相关的高频操作；macOS 和 iPadOS 中菜单栏（menu bar）包含 app 可执行的所有命令。

### 变体

- **iOS/iPadOS 三种布局**：
  - **Small**：菜单顶部一行 4 个条目（仅符号/icon、无标签），其下为其余条目的列表。
  - **Medium**：顶部一行 3 个条目（符号/icon 在短标签上方），其下为列表。
  - **Large（默认）**：所有条目以列表显示。
- **visionOS**：支持 iOS/iPadOS 的 small 和 large 布局；可从 3D 内容以 SwiftUI view 呈现菜单；可用 breakthrough（穿透）效果保证菜单始终可见；与 macOS 一样，窗口中的打开菜单可出现在窗口边界之外。
- **In-game menu（游戏内菜单）**：控制玩法与整体设置的菜单。

### 行为规范（Best practices）

#### Labels（标签）

- **每个菜单项写清晰简洁描述其功能的标签。** 触发动作的菜单项一般用动词或动词短语（View、Close、Select）。语气遵循 app 的沟通风格。
- **为与平台体验一致，使用 title-style capitalization。** 除冠词、并列连词、短介词外每个词首字母大写，且标签最后一个词无论词性都大写。
- **从菜单项标签中删除冠词 a/an/the 以省空间。** 冠词总是加长标签却很少增强理解（"View the Settings" 不比 "View Settings" 更清楚）。
- **显示菜单项不可用状态。** 不可用菜单项通常变暗且不响应交互。**菜单的所有条目都不可用时，菜单本身必须保持可用**，让用户能打开并了解其中的命令。
- **动作需要更多信息才能完成时，标签结尾加省略号（…）。** 省略号表示用户需要输入信息或做额外选择，通常在另一个视图中。

#### Icons（图标）

- **一致地表达常见动作。** 系统为 Share、Print、Search 等常见动作提供标准图标；使用标准图标让 app 更易用、更熟悉。参见 Standard icons。
- **节制且有目的地使用菜单项图标。** 图标帮助用户更快找到菜单项、明确选中后做什么。用于突出最常见动作和关键功能、文件系统位置、已连接设备、视觉概念（旋转/翻转图像）和用户生成内容（文件夹、文档）。**找不到清楚表达该菜单项的图标时，不要显示图标。**
- **同一组菜单项的图标视觉处理保持统一。** 为保持视觉一致与平衡，一组内要么全部有图标，要么全部没有。

#### Organization（组织）

- **优先把重要或常用的菜单项排在前面。** 用户从顶部开始扫描菜单，高优先级条目在前常常让人无需读完整菜单就找到所需。
- **考虑把逻辑相关的条目分组。** 如 Copy/Cut/Paste 编辑命令一组。用 **separator（分隔线）** 区分组——不同平台可能是水平线或菜单背景中的短间隙。
- **把所有逻辑相关命令放在同一组，即使重要程度不同。** 如 Paste and Match Style 使用频率低于 Paste，但用户预期两者都与 Copy、Cut 在同一编辑命令组中。
- **注意菜单长度。** 长菜单需要更多时间注意力，用户可能漏掉想要的命令。菜单过长考虑拆分为多个菜单，或用子菜单缩短列表（如 New Game 下的难度子菜单）。例外：包含用户自定义或动态生成内容的菜单（如 Safari 的 History 和 Bookmarks）——用户预期它容纳所有添加的条目，长菜单可以，滚动也可接受。

#### Submenus（子菜单）

子菜单是菜单项展开的从属列表（标签后带 chevron 等符号），功能上与菜单相同，只是层级位置不同。

- **节制使用子菜单。** 每个子菜单增加界面复杂性并隐藏其条目。当一个词出现在同一组两个以上菜单项中时可考虑（如 Sort by Date/Score/Time 合并为 Sort by 子菜单，列出 Date、Score、Time）。
- **限制子菜单的深度和长度。** 展开多层子菜单困难，一般最好**限制为单层**；子菜单包含**超过约 5 个条目**时考虑新建菜单。
- **嵌套菜单项不可用时，子菜单本身保持可用。** 子菜单项需要能被打开以了解其中命令。
- **优先使用子菜单，而非缩进菜单项。** 缩进与系统不一致，也无法清楚表达菜单项之间的关系。

#### Toggled items（可切换条目）

菜单项常表示可开/关的属性或对象。为避免每个状态列一条，可创建单个可切换菜单项传达当前状态并允许更改。

- **考虑用描述当前状态的可变标签。** 如 "Show Map" ↔ "Hide Map" 单条切换，而非两条并列。
- **可变标签不够清楚时加入动词。** 如 "HDR On"/"HDR Off" 可能分不清是动作还是状态，可改为 "Turn HDR On"/"Turn HDR Off"。
- **必要时同时显示两个菜单项而非单个可切换条目。** 如同时列出 "Take Account Online" 和 "Take Account Offline"，账户在线时只有 Offline 项可用。
- **考虑用勾选标记（checkmark）表示属性当前生效。** 用户在属性列表中扫描勾选标记即可找到选中项（如 Format > Font 菜单中标明作用于所选文本的样式）。
- **考虑提供一键移除多个已切换属性的菜单项。** 如让用户对选中文本应用多种样式时，提供 "Plain" 之类的条目一次移除全部格式。

#### In-game menus（游戏内菜单）

- **让玩家用平台默认交互方式导航游戏内菜单。** 玩家期望用与设备上其他菜单相同的交互——如 iOS/iPadOS 用触摸、visionOS 用直接和间接手势。
- **确保菜单在支持的所有平台上都易打开、易阅读。** 各平台对字体和交互目标有最佳尺寸；游戏内容缩放到不同屏幕（尤其移动设备屏幕）可能让菜单过小。此时修改点击目标尺寸并考虑其他传达菜单内容的方式。

### 平台差异

- **iOS/iPadOS**：**当 small 或 medium 布局能帮助精简选择时选用它们。** app 有 3 个用户常执行的重要动作时考虑 medium 布局（如 Notes 的 Scan/Lock/Pin）；small 布局仅用于通常成组出现的紧密相关动作（Bold/Italic/Underline/Strikethrough），且每个动作用无需标签即可识别的符号。
- **visionOS**：
  - **优先把菜单显示在它所控制的内容附近。** 用户点按菜单项前需注视它；内容太远时用户可能看不到操作效果。
  - **多数情况优先 subtle（细微）breakthrough 效果。** 它让呈现与周围内容融合，兼顾可读可用与场景深度上下文；选择 automatic 时对与 3D 内容重叠的菜单系统默认应用 subtle。prominent 可让菜单醒目显示于整个场景之上，但会干扰体验、可能引起不适；none 让菜单完全被 3D 内容遮挡——可能让人难以看到和访问菜单（如需要绕过障碍的解谜游戏）。

### 何时不用

- 菜单过长时拆分为多个菜单或用子菜单缩短（用户自定义内容菜单除外，长菜单可接受）。
- 子菜单超过约 5 项时考虑新建菜单而非继续加深。
- 不用缩进表达层级关系——用子菜单。
- 需要执行动作（而非显示选择状态）时不要混入展示选择状态的 segment 控制（见 Segmented control）。

---

## 4. Sheet（模态/非模态面板）

### 用途

Sheet 帮助用户执行与当前上下文密切相关的局部任务：请求用户提供特定信息，或呈现可在返回父视图前完成的简单任务（如附加文件、选择保存位置）。

### 变体

- **modal（模态）**：macOS、tvOS、visionOS、watchOS 中 sheet 总是模态——阻止用户与父视图交互直至关闭。
- **nonmodal（非模态）**：iOS 和 iPadOS 中 sheet 可为非模态——屏幕上时用户用其功能影响父视图而无需关闭（如 Notes 的格式化 sheet）。
- 常见导航/关闭按钮：
  - **Cancel（或 Close）**：不保存任何更改关闭 sheet；多数 sheet 常见。
  - **Done**：完成任务或明确保存更改后关闭。
  - **Back**：在多步流程中返回上一步，或返回层级中的父视图；**不是**用来关闭 sheet 的。
- **可调整大小的 sheet（iOS/iPadOS）**：滚动内容或拖动 **grabber**（sheet 顶部边缘的小水平指示条）可展开；按 **detents**（sheet 自然停靠的特定高度）调整——系统定义 **large**（完全展开高度）与 **medium**（约一半高度）两个 detent，也可有自定义 detent。

> **Note（iPadOS）:** 要呈现不可转换为 tab bar 的 sidebar，用 navigation split view 而非 tab view。参见 Sidebars。

### 行为规范（Best practices）

- **复杂或长时间的用户流程，考虑 sheet 之外的替代方案。** iOS/iPadOS 的全屏模态视图适合展示视频、照片、相机画面或文档/照片编辑等多步任务；macOS 可打开新窗口或进入全屏（如文档编辑适合独立窗口、媒体查看适合全屏）；visionOS 可提供转入 Full Space 的方式深入内容或任务。
- **主界面一次只显示一个 sheet。** 关闭 sheet 后用户预期回到父视图或窗口；若关闭后又回到另一个 sheet，用户会迷失位置。sheet 内的操作导致另一个 sheet 出现时，**先关闭第一个再显示新 sheet**；必要时可在第二个关闭后重新显示第一个。
- **呈现影响父视图主任务的补充内容时用非模态视图。** 为让用户继续与主窗口交互的同时访问所需信息与操作：visionOS 考虑 Split views，macOS 考虑 Panels，iOS/iPadOS 可用非模态 sheet。
- **为 Done 按钮提供替代选项。** 提供 Done 时**必须**同时搭配 Cancel（不确认/不保存即可退出）或 Back（返回上一步）。只有 Done 意味着完成任务是退出 sheet 的唯一方式，令人感觉受限或误导。
- **避免同时显示 Cancel、Done、Back 三个按钮。**

### 平台差异

- **iOS/iPadOS**：
  - 单视图 sheet：**Cancel 在顶部工具栏行首（leading edge）**，**Done 在行尾（trailing edge）**；多步流程中按钮位置可随步骤变化。
  - **iPhone app 中考虑支持 medium detent 实现渐进式披露。** 如分享 sheet 在 medium 高度显示最相关条目，查看更多再滚动或展开；内容只在全高才有用时不用 medium detent（如 Messages、Mail 的撰写 sheet 只显示全高）。
  - **可调整大小的 sheet 包含 grabber。** grabber 表明可拖动调整大小、可点击在 detents 间切换，并支持 VoiceOver 在不看着屏幕的情况下调整大小。
  - **支持滑动关闭 sheet。** 用户期望垂直滑动而非点击按钮来关闭。开始滑动关闭时 sheet 内有未保存更改，用 action sheet 让用户确认。
  - **iPadOS app 优先使用 page 或 form sheet 呈现样式。** 各自使用默认尺寸、内容居中显示在变暗背景之上，提供一致体验。
- **macOS**：sheet 是浮动在父窗口之上的圆角卡片式视图；显示期间父窗口变暗，但**用户预期可以先与其他 app 窗口交互**。
  - **以合理的默认尺寸呈现 sheet。** 用户一般不预期调整 sheet 大小，尺寸须适合内容；不过支持调整大小也挺好（如需要放大内容看清时）。
  - **让用户无需先关闭 sheet 即可与其他 app 窗口交互。** sheet 打开时其父窗口（含文档窗口的无模态相关 panel）置前；用户要操作其他窗口时确保能把那些窗口调到前面。
  - **用户需要反复输入并观察结果时用 panel 而非 sheet。** 如查找替换 panel 可逐个执行替换以核对每次结果。
- **visionOS**：sheet 浮动在父窗口前方并使其变暗，成为交互目标。
  - **避免显示从窗口底边滑出的 sheet。** 为便于查看，优先将其居中于用户视野。
  - **以帮助用户保留上下文的默认尺寸呈现 sheet。** 避免遮住窗口的大部分或全部；可考虑允许用户调整大小。
- **watchOS**：sheet 是滑过当前内容的全屏视图；半透明以保留上下文，但系统对背景应用材质，模糊并降低所覆盖内容的饱和度。
  - **仅在模态任务需要自定义标题或自定义内容呈现时用 sheet。** 需要传达重要信息或呈现一组选择时，考虑用 Alerts 或 Action sheets。
  - **保持 sheet 交互简短且偶尔。** sheet 只作为当前工作流的临时中断、只用于促进重要任务；**避免用 sheet 帮助用户导航 app 内容**。
  - **更改默认标签时优先用 SF Symbols 表达动作。** 避免使用会让人误以为 sheet 是层级导航一部分的标签；若行首角落的文本像页面或 app 标题，用户将不知道如何关闭 sheet。

### 何时不用

- 复杂、多步或长时间流程不用 sheet——用全屏模态（iOS/iPadOS）、新窗口/全屏（macOS）或 Full Space（visionOS）。
- 需要反复输入并观察结果时（macOS）用 panel 不用 sheet。
- watchOS 传达重要信息/呈现选择时用 Alerts 或 Action sheets，不用 sheet。
- watchOS 不用 sheet 做内容导航。

---

## 5. Tab Bar（标签栏）

### 用途

Tab bar 让用户在 app 的顶层 section 之间导航，帮助用户理解 app 提供的信息/功能类型，并在保留各 section 当前导航状态的同时快速切换。

### 变体（平台形态）

- **iOS**：浮动于屏幕底部内容之上，条目置于 Liquid Glass 背景上（内容可透出）。可附加 accessory（如 Music 的 MiniPlayer），向下滚动时可最小化 tab bar 并把 accessory 移入其中；点按 tab 或滚动到顶部即退出最小化状态。可在行尾包含专用 search tab。
- **iPadOS**：显示在屏幕顶部附近；可为固定元素，或带一个可转换为 sidebar 的按钮（tabBarOnly / sidebarAdaptable）。
- **tvOS**：高度可自定义（背景 tint/color/image、tab 字体含选中字体、选中/未选中 tint、按钮 icon 如设置和搜索）。默认半透明、仅选中 tab 不透明；遥控器聚焦时选中 tab 带投影强调选中态。**tab bar 高度 68 pt，顶边距屏幕顶部 46 pt，均不可更改。**
- **visionOS**：tab bar 总是垂直的，浮动于窗口行首侧的固定位置；用户注视时自动展开，注视某 tab 并点击打开。展开时可能暂时遮挡其后内容。
- watchOS 不支持 tab bar。

### 行为规范（Best practices）

- **用 tab bar 做导航，不要提供动作。** Tab bar 用于在 app 不同 section 间导航；作用于当前视图元素的控制用 Toolbars。
- **确保用户在 app 各 section 间导航时 tab bar 可见。** 隐藏 tab bar 会让人忘记所在位置。例外：模态视图覆盖 tab bar（模态是临时且自包含的）。
- **使用帮助用户导航 app 所需的合适数量的 tab。** Tab bar 是 app 层级的体现，需权衡额外 tab 的复杂性与用户频繁访问各 section 的需要；tab 越少越易导航。信息结构复杂的 app 可考虑 sidebar 或可转换为 sidebar 的 tab bar。
- **避免 overflow tabs。** 设备尺寸和方向可能让可见 tab 少于全部 tab；空间不足时 iOS/iPadOS 的行尾 tab 变成 More tab，在单独列表中显示其余条目。More tab 让被隐藏 tab 的内容更难触达和注意，**应限制 app 中出现这种情况的场景**。
- **不要禁用或隐藏 tab bar 按钮——即使其内容不可用。** 忽有忽无让界面显得不稳定、不可预测。section 为空时解释其内容为何不可用。
- **包含 tab 标签辅助导航。** 标签显示在图标下方或旁边，清楚描述 tab 的内容或功能类型。**尽可能使用单个词。**
- **考虑用 SF Symbols 提供熟悉、可缩放的 tab bar 图标。** SF Symbols 图标自动适配不同上下文（tab bar 常规/紧凑布局、图标与标签上下/并排）。**为与平台一致优先使用填充（filled）符号或图标。** 自定义图标尺寸参考 Apple Design Resources。
- **用 badge 指示有重要信息。** badge 是红色椭圆，含白色数字或感叹号，表示该 section 有值得注意的新信息。**badge 只用于关键信息**，以免稀释其影响与含义。参见 Notifications。
- **避免给 tab 标签和内容层背景使用相近颜色。** 内容层明亮多彩时，优先 tab bar 单色外观，或选择视觉差异充分的 accent color。参见 Liquid Glass color。

### 平台差异

- **iPadOS**：
  - **优先用 tab bar 做导航**——提供用户最常用 section 的访问；更复杂的 app 可提供转换为 sidebar 的选项以访问更多导航项。
  - **允许用户自定义 tab bar。** section 很多时，让用户把常用条目加入 tab bar、移除不常用的（如 Music 中把喜欢的播放列表加入）。让用户自选 tab 时，默认列表**控制在 5 个或更少**，以保持紧凑与常规视图尺寸之间的连续性。
- **tvOS**：
  - **注意 tab bar 的滚动行为。** 默认当前 tab 只含单一主视图时，用户可把 tab bar 滚出屏幕（如 TV app 的 Watch Now/Movies/TV Show/Sports/Kids tab）；例外是包含 split view 的屏幕（TV app 的 Library tab、app 的 Settings）——tab bar 固定在顶部。无论 tab 内容如何，用户按遥控器 Menu 键时焦点**总是**回到页面顶部的 tab bar。
  - **直播类 app 中以一致方式组织 tab**：直播内容 → 云端 DVR 或其他录制内容 → 其他内容。参见 Live-viewing apps。
  - 条目过多放不下时，系统从 tab bar 右侧开始对最右条目应用渐隐截断；条目多到引起滚动时左侧同样应用渐隐。
- **visionOS**：
  - **为每个 tab 提供符号和文本标签。** 符号在 tab bar 中始终可见；用户注视 tab bar 时系统显示标签。即使 tab bar 会展开，标签也须保持简短以便一眼读完。
  - **合理时可考虑在 tab 内使用 sidebar。** app 层级较深时可用 sidebar 支持tab 内的二级导航；此时**必须防止 sidebar 中的选择改变当前打开的 tab**。

### 何时不用

- 提供作用于当前视图的动作时用 Toolbars，不用 tab bar。
- app 信息结构复杂时考虑 sidebar 或可转换 tab bar 的 sidebar。
- 呈现固定 sidebar（不转换为 tab bar）时（iPadOS）用 navigation split view。
- 切换完全独立的 app section（而非相关子视图）时（见 Segmented control 平台差异）用 Tab bar。

---

## 6. Segmented Control（分段控件）

### 用途

Segmented control 是两个或多个 segment 的线性集合，每个 segment 功能如同按钮。所有 segment 通常等宽；segment 可含文本或图像，也可在下方（或整个控件下方）带文本标签。

- 提供一组选项中的**单选**；macOS 中也可**多选**（如 Keynote 字体属性控件可组合粗体、斜体、下划线）。
- 还可作为**执行动作的一组按钮**而不显示选择状态（momentary，如 macOS Mail 的 Reply / Reply all / Forward）。

### 变体

单选/多选（macOS）两种选择模式 + momentary（瞬态动作）模式。

### 行为规范（Best practices）

- **用 segmented control 提供影响对象、状态或视图的紧密相关选择。** 如 inspector 中选择一个或多个应用于所选内容的属性，或 toolbar 中提供作用于当前视图的一组动作。
- **当需要把功能分组、或清楚显示其选择状态时考虑 segmented control。** 与其他按钮样式不同，segmented control 无论视图尺寸或位置如何都保持成组；分组也帮助用户一眼看出哪些控件当前被选中。
- **单个 segmented control 内控件类型保持一致。** **不要**在一个本表示选择状态的控件里给 segment 分配动作，也**不要**在本执行动作的控件里显示选择状态。
- **限制控件内 segment 数量。** 太多 segment 难以解析、导航耗时。宽界面上**不超过约 5-7 个**，iPhone 上**不超过约 5 个**。
- **通常保持 segment 尺寸一致。** 等宽的 segmented control 更平衡；icon 和标题宽度也尽量一致。

#### Content（内容）

- **单个 segmented control 中优先只用文本或只用图像——不要混用。** 混用导致界面割裂混乱。
- **尽可能让每个 segment 的内容尺寸相近。** segment 等宽时，内容填满部分 segment 而另一部分不满会不好看。
- **segment 标签用名词或名词短语**，title-style capitalization。显示文本标签的 segmented control 不需要引导文字。

### 平台差异

- **iOS/iPadOS**：**考虑用 segmented control 在紧密相关的子视图间切换。** 如日历新建事件 sheet 中在"新建事件"与"新建提醒"子视图间切换。**切换 app 完全独立的 section 用 Tab bar。**
- **macOS**：
  - **考虑用引导文本说明 segmented control 的用途。** 控件用符号或界面图标时，可在每个 segment 下方加标签说明含义；app 有 tooltip 时为每个 segment 提供 tooltip。
  - **主窗口区域的视图切换用 tab view，而非 segmented control。** Tab view 高效切换视图，外观类似 box + segmented control 的组合。segmented control 适合帮助用户在 toolbar 或 inspector 面板中切换视图。
  - **考虑支持 spring loading**（Magic Trackpad 上拖过并 force click 激活 segment）。
- **tvOS**：
  - **内容筛选屏幕考虑用 split view 而非 segmented control。** split view 中在内容与筛选选项间来回更方便；segmented control 视位置可能不易访问。
  - **避免把其他可聚焦元素放在 segmented control 附近。** segment 在焦点移到其上时即被选中（而非点击时）。位置不当会让用户切换 segment 时误聚焦其他元素。
- **visionOS**：用户注视使用图标的 segmented control 时，系统显示包含描述文字的 tooltip。
- watchOS 不支持 segmented control。

### 何时不用

- 切换 app 完全独立的 section：用 Tab bar，不用 segmented control。
- macOS 主窗口区域视图切换：用 tab view。
- tvOS 内容筛选界面：用 split view。
- 短列表选择（见 Picker"何时不用"）或两个对立状态开关：分别考虑 Pull-down button 与 Toggle。

---

## 7. Toggle / Switch / Checkbox / Radio Button（开关）

### 用途

Toggle 让用户在一对对立状态（如开/关）之间选择，用不同外观表示每个状态。Toggle 有多种样式（switch、checkbox 等），不同平台使用方式不同。所有平台也支持行为如同 toggle 的按钮（每种状态用不同外观）。

### 变体

- **Switch**：iOS/iPadOS 列表行中；macOS 窗口主体（另有 mini switch 用于 grouped form）。
- **Checkbox**：macOS——小方形按钮，关时空、开时含勾选标记、可含表示混合状态的短横；通常尾侧带标题，可编辑清单中可不带。
- **Radio button**：macOS——小圆形按钮后跟标签；通常以 2-5 个一组呈现互斥选项；状态为选中（实心圆）或未选中（空心圆），混合状态很少有用。
- 类 toggle 行为的按钮：一般用界面图标传达用途，通过改背景等方式更新外观表达当前状态。

### 行为规范（Best practices）

- **用 toggle 帮助用户在影响内容或视图状态的两个对立值之间选择。** Toggle 总是管理某物的状态；需要其他类型操作（如从列表中选择项目）时用其他组件（如 Pop-up button）。
- **清楚标示 toggle 影响的设置、视图或内容。** 通常周围上下文足以说明开/关的是什么；某些情况（常见于 macOS app）也可提供描述该状态的标签。
- **确保 toggle 状态的视觉差异明显。** 可增删颜色填充、显示/隐藏背景形状、更改内部细节（勾选标记或圆点）等表达开/关。**避免仅靠不同颜色传达状态**——不是每个人都能感知颜色差异。

### 平台差异

- **iOS/iPadOS**：
  - **switch 样式只在列表行（list row）中使用。** 此情况无需提供标签——行内容已提供 switch 所控制状态的上下文。
  - **仅在必要时更改 switch 的默认颜色。** 默认绿色通常适用，也可改用 app accent color；**务必使用与未着色外观对比充分的颜色**。
  - **列表之外用行为如 toggle 的按钮，不用 switch。** 如 Phone app 用 toggle 行为的按钮过滤最近通话：激活时加蓝色高亮，取消时移除。
  - **避免提供解释按钮用途的标签。** 界面图标加替代的背景外观已足够说明。
- **macOS**：**switch、checkbox 和 radio button 用在窗口主体（window body），不要放窗口框（window frame）。** 尤其避免在 toolbar 或 status bar 中使用。

##### Switches（macOS）

- **想强调的设置优先用 switch。** switch 视觉分量比 checkbox 重，适合控制比 checkbox 通常更多的功能——如一组设置的开关而非单个设置。
- **grouped form 中考虑用 mini switch 控制单行设置。** mini switch 高度与按钮等控件相近，行高一致；需呈现设置层级时，主设置用 regular switch、从属设置用 mini switch。
- **一般不要用 switch 替换 checkbox。** 界面已在用 checkbox 的话，继续用 checkbox 为好。

##### Checkboxes（macOS）

- **需要呈现设置的层级时用 checkbox 而非 switch。** checkbox 视觉样式利于对齐和表达分组；通过沿行首对齐和缩进展示依赖关系（如一个 checkbox 管辖从属 checkbox 的状态）。
- **需要呈现两个以上互斥选项时考虑 radio buttons。** 用户需要"开/关"之外的选择时，多个 radio button 可为每个选项配唯一标签。
- **checkbox 组的关系不清晰时考虑用标签引入。** 描述这组选项，并把标签基线与组内第一个 checkbox 对齐。
- **checkbox 外观准确反映其状态。** 状态可为开、关或混合（mixed）。用一个 checkbox 全局开关多个从属 checkbox 时，从属状态不一致要显示混合状态（如全局开关所有文本样式，也允许单独选粗体/斜体/下划线）。

##### Radio buttons（macOS）

- **互斥选项优先用一组 radio buttons。** 需要在组内多选时用 checkboxes。
- **避免一组列出过多 radio buttons。** 长列表占空间且令人应接不暇；**超过约 5 个选项**时考虑用 Pop-up button 等组件。
- **呈现单一的开/关设置时优先用 checkbox。** 单个 radio button 虽也能开关某物，但 checkbox 的勾选标记有无让当前状态更一目了然。极少数单个 checkbox 无法清楚表达对立状态时，可用一对 radio buttons，各带指明其控制状态的标签。
- **水平显示 radio buttons 时间距一致。** 按最长按钮标签测量所需空间并统一使用。
- radio button 组通常为 **2-5 个**。

### 何时不用

- 从列表选择项目而非切换状态：用 Pop-up button 等组件，不用 toggle。
- iOS/iPadOS 列表行之外：用 toggle 行为的按钮，不用 switch。
- macOS 需要设置层级：用 checkbox 不用 switch；单一开/关设置用 checkbox；互斥选项超过约 5 个用 Pop-up button。
- 表达混合状态：用 checkbox，radio button 的混合状态很少有用。

---

## 8. Slider（滑块）

### 用途

Slider 是一条水平轨道加一个称为 **thumb（滑块钮）** 的控件，用户可在最小值与最大值之间调整。取值变化时，最小值到 thumb 之间的轨道以颜色填充。可选显示左右 icon 说明最小/最大值含义。tvOS 不支持 slider。

### 变体

- **macOS**：可含 **tick marks（刻度）**。线性 slider（有无刻度均可）thumb 为窄长菱形，轨道填充颜色，常带补充图标说明两端含义；**circular slider（圆形 slider）** thumb 为小圆，刻度为环绕的均匀分布圆点。
- **watchOS**：slider 是水平轨道——呈离散步进（discrete steps）或连续条（continuous bar），表示有限取值范围；用户可点按两侧按钮按预定义量增减。
- iOS/iPadOS、visionOS：水平 slider。

### 行为规范（Best practices）

- **若能增加价值，可自定义 slider 外观。** 可调整轨道颜色、thumb 图像与着色、左右 icon，使其融入 app 设计并传达意图。如调整图像尺寸的 slider 左边显示小图 icon、右边显示大图 icon。
- **使用用户熟悉的 slider 方向。** 用户预期所有 app 中 slider 的最小/最大端一致：水平 slider 最小值在行首侧、最大值在行尾侧（如百分比从行首 0% 到行尾 100%）；垂直 slider 最小值在下、最大值在上。
- **考虑用对应的 text field 和 stepper 补充 slider。** 尤其 slider 表示大范围数值时，用户会希望看到精确值并在文本框输入具体值；加 stepper 提供按整值递增的便捷方式。参见 Text fields 和 Steppers。

### 平台差异

- **iOS/iPadOS**：**不要用 slider 调节音频音量。** app 内需要音量控制时用 volume view——可自定义，含音量 slider 和切换活跃音频输出设备的控件。参见 Playing audio。
- **macOS**：
  - **slider 取值变化时考虑提供实时反馈。** 实时反馈让用户看到即时结果——如 Dock 设置的 Size slider 动态缩放 Dock 图标。
  - **选择符合用户预期的 slider 样式。** 在固定起止点之间移动用水平 slider（如设置对象不透明度 0-100%）；取值循环或无限延续用圆形 slider（如调整对象旋转 0-360 度、动画旋转圈数）。
  - **考虑用标签引入 slider。** 标签一般用 sentence-style capitalization 并以冒号结尾。
  - **用 tick marks 提升清晰度与准确性。** 刻度帮助用户理解测量刻度、更容易定位具体值。
  - **考虑给 tick marks 加标签以更清晰。** 标签可以是数字或词。除非为减少困惑，不必给每个刻度都加标签——多数情况只标注最小/最大值即可。取值非线性时周期性标签提供上下文。用户把指针悬停在 thumb 上时，最好提供显示当前值的 tooltip。
- **visionOS**：**优先水平 slider。** 左右滑动手势通常比上下更轻松。
- **watchOS**：**必要时创建自定义 glyph 说明 slider 用途。** 系统默认显示加号和减号。

### 何时不用

- iOS/iPadOS 调音量不用 slider——用 volume view。
- 需要精确输入特定值时用 text field + stepper 补充。
- 短选项列表的选择用 Pull-down button（见 Picker）。

---

## 9. Picker（选择器）

### 用途

Picker 显示一个或多个可滚动的互不相同的取值列表供用户选择。系统提供多种样式，各自提供不同类型的可选值和不同外观。picker 显示的具体值及其顺序取决于设备语言。Picker 通过让用户选择单值或多段值帮助输入信息；**Date picker** 还额外提供日历视图选日期、数字键盘输入日期时间等方式。

### 变体

#### iOS/iPadOS Date picker 样式

- **Compact**：按钮形式，在模态视图中显示可编辑的日期和时间内容。
- **Inline**：仅时间时显示值轮（wheels）；日期与时间时显示内嵌日历视图。
- **Wheels**：一组滚动轮，也支持内置或外接键盘数据输入。
- **Automatic**：系统根据当前平台和 date picker 模式决定样式。

#### iOS/iPadOS Date picker 模式

- **Date**：月、日、年。
- **Time**：时、分、（可选）AM/PM。
- **Date and time**：日期、时、分、（可选）AM/PM。
- **Countdown timer**：时和分，**最多 23 小时 59 分钟**；inline 和 compact 样式不支持此模式。

#### macOS Date picker

- **textual（文本式）**：空间有限、预期用户做具体日期时间选择时适用。
- **graphical（图形式）**：需要日历翻阅或选择日期范围、或钟面外观契合 app 时适用。

#### watchOS

- 用 **Digital Crown** 导航列表精确选择；列表用 wheels 样式（日期时间 picker 也可用 wheels）。可配置 picker 显示 outline、caption 和滚动指示。
- 更长的列表：navigation link 把 picker 显示为按钮，点按后显示选项列表；用户也可不点按钮、直接用 Digital Crown 滑动选项。

### 行为规范（Best practices）

- **考虑用 picker 提供中到长的列表。** 相当短的选择列表考虑用 Pull-down button——picker 对短列表视觉分量过重；**非常大量的条目**考虑用 Lists and tables——其可调整高度、表格可带索引，能更快定位列表区段。
- **使用可预测、逻辑有序的值。** 用户操作 picker 前很多值是隐藏的，最好让人能预测隐藏值（如按字母排序的国家列表），从而快速移动到目标。
- **避免为显示 picker 而切换视图。** Picker 在上下文中（用户编辑的字段下方或附近）效果好；通常出现在窗口底部或 popover 中。
- **日期 picker 的分钟粒度可考虑放宽。** 默认分钟列表含 60 个值（0 到 59）；可选增大分钟间隔，**只要能整除 60**。如一刻钟间隔（0、15、30、45）。

### 平台差异

- **iOS/iPadOS**：**空间受限时用 compact date picker。** compact 样式显示一个以 app accent color 显示当前值的按钮；点按后打开模态视图，提供熟悉的日历式编辑器和时间 picker；模态视图中可多次修改日期时间，点按视图外确认选择。
- **macOS**：**选择适合 app 的 date picker 样式**（textual / graphical，见变体）。
- **tvOS**：Picker 通过 SwiftUI 提供。
- **watchOS**：见变体（Digital Crown、wheels、navigation link）。
- visionOS 无额外考虑。

### 何时不用

- 短列表选择用 Pull-down button，不用 picker。
- 非常大量的条目用 Lists and tables（可调高度、可带索引）。
- 避免切换视图来展示 picker——保持在编辑上下文中。

---

## 10. Text Field（文本输入框）

### 用途

Text field 是一个矩形区域，用户在其中输入或编辑少量、特定的文本。输入大量文本用 Text views。

### 变体

- **Secure text field（安全文本框）**：隐藏敏感数据（如密码）。
- **iOS/iPadOS**：可显示 Clear button（行尾）、自定义图像与系统按钮（如 Bookmarks）。
- **macOS**：可与选择列表配对为 **combo box**。
- 平台键盘：iOS/iPadOS/tvOS/visionOS 可指定适合输入类型的键盘（数字、URL 等）。

### 行为规范（Best practices）

- **用 text field 请求少量信息，如姓名或邮箱。** 更大篇幅文本输入用 Text views。
- **在 text field 中显示提示（hint）帮助说明其用途。** 字段无其他文本时可含 placeholder text（如 "Email"、"Password"）；placeholder 在用户开始输入即消失，因此再配一个描述该字段的独立标签提醒用途也很有用。
- **用安全文本框隐藏私密数据。** app 请求敏感数据（如密码）时**必须**使用 secure text field。
- **尽可能让 text field 的尺寸匹配预期文本量。** 尺寸帮助用户直观判断应提供多少信息。
- **多个 text field 间距均匀。** 布局含多个字段时留足空间，让人容易看出每个标签对应哪个输入框。尽可能垂直堆叠多个 text field，用一致的宽度创造更有序的布局——如地址表单中名/姓字段一个宽度，地址和城市字段另一个宽度。
- **确保字段间 Tab 切换顺序符合预期。** 在字段间 Tab 时按逻辑顺序移动焦点。系统会自动实现这一点，通常无需自定义。
- **合理时校验字段。** 如字段只允许数字，用户输入了其他字符时 app 需要提醒。检查时机视上下文：输入邮箱时在切换到其他字段时校验；创建用户名或密码时**在切换字段之前**校验。
- **数字数据使用 number formatter。** Number formatter 自动配置字段只接受数值，还能以特定方式显示值（指定小数位数、百分比、货币）。但**不要假定数据的实际呈现**——格式因用户 locale 而异。
- **按字段需要调整换行方式。** 默认系统裁剪超出边界的文本；也可配置在字符或词级别换行，或在开头、中间、结尾截断（以省略号表示）。
- **考虑用展开 tooltip（expansion tooltip）显示被裁剪或截断文本的完整内容。** 展开 tooltip 行为如普通 tooltip，指针悬停在字段上时出现。
- **iOS/iPadOS/tvOS/visionOS app 中显示合适的键盘类型。** 不同键盘类型适合不同输入（数字、URL 等）；为精简输入，显示与内容类型匹配的键盘。参见 Virtual keyboards。
- **tvOS 和 watchOS app 中尽量减少文本输入。** 在 Apple TV 和 Apple Watch 上输入长文本或填写大量字段很耗时；尽量减少文本输入，考虑用按钮等更高效的方式收集信息。

### 平台差异

- **iOS/iPadOS**：
  - **在 text field 行尾显示 Clear button 帮助用户清除输入。** 该元素在场时，用户点按即可清空内容，无需反复点 Delete 键。
  - **用图像和按钮为 text field 提供清晰性与功能。** 可在两端显示自定义图像，或添加系统按钮（如 Bookmarks）。一般行首（leading end）表示字段用途，行尾（trailing end）提供附加功能（如书签）。
- **macOS**：**需要把文本输入与选择列表配对时考虑用 combo box。**
- **watchOS**：**仅在必要时呈现 text field。** 尽可能显示选项列表而非要求文本输入。
- tvOS、visionOS 无额外考虑。

### 何时不用

- 大量文本输入不用 text field——用 Text views。
- 敏感数据不用普通 text field——用 secure text field。
- watchOS 尽量避免文本输入——优先选项列表。
- macOS 文本输入 + 选项列表的场景用 combo box。

---

## 附：关键数值一览（按组件）

| 组件 | 数值 |
|---|---|
| Button | hit region ≥ 44x44 pt（visionOS 60x60 pt）；每视图 prominent 按钮 1-2 个；macOS image button 边距约 10 px；visionOS 尺寸 Mini 28 / Small 32 / Regular 44 / Large 52 / Extra large 64 pt，中心间距 ≥ 60 pt，≥60 pt 按钮四周 4 pt padding |
| Alert | 最多 3 个按钮；标题不超过两行；visionOS accessory view 最高 154 pt、圆角 16 pt |
| Menu | iOS Small 布局顶部 4 项（仅图标）、Medium 3 项（图标+短标签）、Large 为默认全列表；子菜单限单层、超过约 5 项考虑新建菜单 |
| Sheet | detents：large（全高）/ medium（约一半高度）；Cancel 在行首、Done 在行尾（iOS/iPadOS 单视图 sheet）；一次只显示一个 sheet；勿同显 Cancel+Done+Back |
| Tab bar | tvOS 高 68 pt、顶边距屏顶 46 pt（不可改）；iPadOS 自定义 tab 默认 ≤ 5 个；badge 仅用于关键信息；优先 filled SF Symbols |
| Segmented control | 宽界面 ≤ 约 5-7 个 segment；iPhone ≤ 约 5 个 |
| Toggle | macOS radio button 组通常 2-5 个，超过约 5 个用 Pop-up button；iOS switch 仅用于列表行 |
| Slider | 水平：最小在行首、最大在行尾；垂直：最小在下最大在上；iOS 调音量用 volume view 不用 slider |
| Picker | 分钟默认 60 值（0-59），间隔须整除 60；Countdown timer 最多 23 小时 59 分钟 |
| Text field | 邮箱字段在切换字段时校验；用户名/密码在切换前校验；显示匹配内容类型的键盘 |
