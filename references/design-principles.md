# 设计原则与 Inclusion（Design Principles & Inclusion）

> 来源: https://developer.apple.com/design/human-interface-guidelines/design-principles 、 https://developer.apple.com/design/human-interface-guidelines/inclusion
> 整理自 Apple HIG 原文（2026-09 抓取）。规范条目忠实原文，未新增规则。

---

## 一、Design principles（设计原则）

最成功、最持久的设计建立在对人们如何思考、感受、与世界交互的深刻理解之上。以下原则是整个 Human Interface Guidelines 指导的基础。应用这些原则没有唯一正确的方式——它们是帮助你在相互竞争的优先级之间权衡、在通往优秀设计的道路上做出关键决策的工具。

### 1.1 Purpose（目的）

- **Create value.**（创造价值。）最好的设计始终指向"什么让产品真正有用"。在开发的每个阶段，都追问你的产品是做什么的、设计是否服务于这个目的。
- **Keep focused.**（保持聚焦。）顺应人们想要如何使用你的 app，优先排布最重要的功能，并专注于把这些功能做到真正出色。用途清晰的产品更能有效帮助人们达成目标。
- **Find new ways to solve the problem.**（寻找解决问题的新方式。）调研既有方案，避免重复造轮子；定义你的产品的独特之处，思考设计如何体现它。

### 1.2 Agency（自主权）

- **Stay out of the way.**（不挡路。）人们用你的产品是为了把事情办成。帮助他们最有效的方式往往是直接把他们带到手头的任务或内容。最好的设计在人们需要时才出现，且不引人注目。
- **Give people the freedom to explore.**（给人们自由探索的空间。）让人们在界面中自由移动、访问功能，而不被锁进特定流程或模式。确需引导流程时，让跳过或退出足够容易，使人们能快速抵达主体验。
- **Help people recover from mistakes.**（帮助人们从错误中恢复。）当人们知道自己可以撤销操作或回到先前状态时，才会放心探索，这种自由让界面更有吸引力。把"宽恕"（forgiveness）内建到设计中并让它足够容易——从意外中恢复不应让人付出时间或丢失工作成果。

### 1.3 Responsibility（责任）

- **Be fully transparent about what your product does and why.**（对产品做什么、为什么这样做保持完全透明。）从用户的第一次交互起你就有机会建立信任关系。确保 app 的意图从一开始就清晰：请求权限时给出明确理由；收集数据时明确说明收集什么、如何使用。
- **Keep people's information safe.**（保护人们的信息安全。）人们信任你维护其数据的完整性。只收集产品运行所需的数据，并谨慎处理。预判数据可能被滥用或造成伤害的方式，设置防护以防止滥用与意外后果。

### 1.4 Familiarity（熟悉感）

- **Use concepts that people know.**（使用人们已知的概念。）人们带着现实世界和其他软件的知识进入每个新体验。两者兼用，让界面感到熟悉而直观。
- **Keep visuals and interactions consistent.**（保持视觉与交互一致。）一旦确立了某元素的行为或外观，就在整个设计中贯彻它。一致性帮助人们更快学会使用，并让他们确信新的交互会按预期运作。
- **Provide clear feedback.**（提供清晰反馈。）在使用 app 的过程中给出清晰的信号：显示控件何时可用、内容何时变化，并使用系统模式展示提醒、提供选择。一致的反馈让人们始终知情、始终掌控。

### 1.5 Flexibility（灵活性）

- **Design for everyone.**（为所有人设计。）被人们放在心上的产品能赋予人们力量。考虑可能接触到你设计的形形色色的人，把他们的经历、视角与需求的广度纳入考量。从第一天起就把 accessibility 当作优先级。以 Inclusion 的方式设计，触达尽可能广的受众，为所有人创造更好的体验。
- **Preserve a person's context.**（保留个人上下文。）当设计跨平台、跨配置自适应时，帮助人们感到宾至如归：内容与控件保持一致、可预期的位置，用自然的动画平滑过渡。
- **Consider a variety of input methods.**（考虑多种输入方式。）人们以不同方式与设备交互。支持尽可能多的输入——voice、touch、keyboard 等——意味着更多人能以最适合自己的方式使用产品。
- **Approach every platform with intention.**（以同等的用心对待每个平台。）你的软件在何处运行都应显得精致、融入环境。给所支持的每个平台同等的关注。

### 1.6 Simplicity（简洁）

- **Include just what's necessary.**（只保留必要之物。）Simplicity 不等于 minimalism。追求聚焦、有用的体验：把重要的东西放在手边，让其余的自然隐去。
- **Be concise.**（表达精炼。）当你找到最简单的说法时，它往往最通用、最有帮助。为传达概念或标注控件，选择恰好够用的词。
- **Establish hierarchy.**（建立层级。）当形式与功能一目了然时，人们就知道如何达成目标。优先使用可辨识的控件与一致的结构，帮助人们明白自己在哪里、下一步是什么。

### 1.7 Craft（工艺）

- **Quality sets the tone.**（品质定下基调。）设计中的每个元素都在告诉人们你有多在乎。对每个决策都深思熟虑，追求惊艳的视觉、流畅的动画、精准的措辞与用心的声音。
- **Experiment and iterate.**（实验并迭代。）尽早做原型，尝试新方法，并愿意丢弃行不通的方案。为每个功能设高标准，打磨，再尝试。在真实场景中测试产品，确保其耐用、可靠、高性能。
- **Maintain your craft.**（持续维护工艺。）发布不是终点。让界面紧跟最新的平台能力与设计模式，保持高水准。设计是一项持续的承诺。

### 1.8 Delight（愉悦）

- **Identify the emotion you want to inspire.**（明确想唤起的情绪。）不同软件用起来感受不同：健身 app 令人振奋，冥想 app 使人平静，游戏让人兴奋。先知道你想唤起什么感受，再让它塑造设计。
- **Create defining moments.**（创造定义性时刻。）每次交互都是展示软件立意的机会。从一次简单的按钮点击到一条错误信息，思考每个时刻是否是加入一抹体现设计精神的个性的机会。
- **Don't mistake delight for decoration.**（不要把愉悦误当作装饰。）记住人们是要完成任务的，不要让为愉悦而愉悦妨碍产品的核心目的。审视整体审美：有些设计受益于经过深思的实用触感，有些则适合一点奇趣。通过实验找到恰当的平衡。
- **Consider the whole.**（考虑整体。）Delight 是你在产品上倾注的所有考量的总和，是人们使用全程体验的集大成：行动的自由、探索的安全、熟悉隐喻带来的舒适、以及在上下文之间切换的灵活。当你带着意图、专注与用心去设计，结果就是一个人们自然感到愉悦的产品。

---

## 二、Inclusion（包容性设计）

Inclusive 的 app 与游戏把人放在第一位：优先考虑尊重的沟通方式，并以人人皆可访问、可理解的方式呈现内容与功能。设计 inclusive app 是需要时间打磨的迭代过程；全程保持审视自己对他人的假设，并对新知保持开放。

### 2.1 Inclusive by design

简单、直观的体验是好设计 app 与游戏的核心。设计直观体验，始于调研人们的目标与视角，才能呈现与他们产生共鸣的内容。

Empathy（同理心）是这项调研的重要工具——它帮你理解不同视角的人会如何回应你创造的内容与体验。例如，你可能发现从某些视角看，某个词或图像无法理解，或具有你未曾预期的含义。

每个人的视角都是人类特质的独特而动态的交集，但所有视角都源于人人共享的人类特征与经历，包括：

- Age（年龄）
- Gender and gender identity（性别与性别认同）
- Race and ethnicity（种族与族裔）
- Sexuality（性取向）
- Physical attributes（身体特征）
- Cognitive attributes（认知特征）
- Permanent, temporary, and situational disabilities（永久性、暂时性与情境性障碍）
- Language and culture（语言与文化）
- Religion（宗教）
- Education（教育）
- Political or philosophical opinions（政治或哲学观点）
- Social and economic context（社会与经济背景）

以不同视角审视 app 或游戏时，不要把这项工作框定为" merely 寻找可能冒犯人的内容"。虽然没有设计应包含冒犯性内容或体验，但"无冒犯"并不等于"inclusive"。聚焦 Inclusion 既帮你避免潜在的冒犯性内容，更帮你创造人人都能享受的欢迎体验。

### 2.2 Welcoming language（友好的语言）

使用平实、包容的语言欢迎所有人。仔细审查文案（copy），确保语气与用词不排斥任何人。写作 tips：

- **Consider the tone of your copy from different perspectives.**（从不同视角审视文案的语气。）写作风格传达的信息几乎与用词一样多。不同 app 沟通风格不同，但要确保语气不会传递你无意发出的信号——例如学术腔会让 app 显得只欢迎高学历人群。寻找适合你体验的风格时，做到清晰、直接、尊重。
- **Pay attention to how you refer to people.**（注意如何称呼用户。）通常用 *you / your* 直接称呼效果很好；间接称 *the user / the player* 会让体验显得疏远冷漠。*we / our* 这类词宜保留给代表你的软件或公司，否则可能暗示一种私人关系，容易被解读为冒犯或居高临下。
- **Avoid using specialized or technical terms without defining them.**（避免不加定义地使用专业或技术术语。）术语能让写作更精炼，但会排斥不懂的人。必须使用时，先定义并让定义便于查阅。即使读者认识句中的术语，用平实语言写成的句子也更容易阅读——也更容易翻译。
- **Replace colloquial expressions with plain language.**（用平实语言替代口语化表达。）口语表达往往有文化特异性、难以翻译；更糟的是，有些短语带有你可能不知道的排斥性含义——例如 *peanut gallery* 与 *grandfathered in* 都源自压迫性语境并延续至今。即使不带排斥含义，听不懂的口语短语也会把不理解它的人排除在外。
- **Consider carefully before including humor.**（使用幽默前三思。）幽默高度主观，且与口语表达一样难以跨文化翻译。加入幽默可能让看不懂的人困惑、让反复遇到的人厌烦、让解读不同的人感到被冒犯。

### 2.3 Being approachable（平易近人）

Approachable 的 app 或游戏不要求人们先具备特定技能或知识才能使用，并为人们提供随时间深入理解的清晰路径。两个做法：

- 呈现清晰、直接的界面（参考各平台 Designing for iOS/iPadOS/macOS/tvOS/visionOS/watchOS 与 Designing for games 指南）。
- 内建学习使用 app 或游戏的方式：设计 onboarding 流程，让新手按步骤上手，同时让熟练者直接跳到想要的内容。

### 2.4 Gender identity（性别认同）

世界各地的文化历来承认超越女性/男性二元划分的自我认同与表达光谱。

- 避免不必要的特定性别指代。例如食谱分享 app 中 "You can let a subscriber post his or her recipes to your shared folder" 可改为 "Subscribers can post recipes to your shared folder"——不仅使用中性名词 *subscribers*，还避免了单数代词 *his/her*，使句子在本地化到使用性别代词的语言时仍保持 inclusive。
- avatar、emoji、glyph、游戏角色也常常可以避免指向特定性别。为欢迎所有人，优先给人们按自己意愿自定义这些元素的工具。
- 需要描绘通用人物时，使用非性别化的人形图像，强化 "generic person 意为 human，而非 man 或 woman" 的信息。SF Symbols 提供许多非性别化 glyph（如 figure、person 符号）。
- 多数 app 与游戏不需要知道用户性别；若确因健康或法律原因需要，考虑提供 inclusive 选项，如 *nonbinary*、*self-identify*、*decline to state*，并可让人们指定自己的代词以便必要时正确称呼。

### 2.5 People and settings（人物与场景描绘）

呈现人类多样性是 app 或游戏欢迎所有人最显眼的方式之一：当人们在体验及相关材料中看到与自己相似的人，更不容易感到被排斥，也更容易相信自己能从中受益。

- 创作代表人物的文案与图像时，呈现人类特征与活动的多样性。例如健身 app 可由不同种族背景、体型、年龄、身体能力的人演示动作。
- 描绘职业或行为时避免刻板印象，如只出现男医生、女护士，或延续现实世界种族/性别刻板印象的英雄与反派。
- 同时审视所展示的场景与物品。展示高消费水平在部分场景合理，但在另一些场景可能显得冷漠、脱节。在合理之处，优先展示多数人熟悉、有共鸣的地点、家居、活动与物品。

### 2.6 Avoiding stereotypes（避免刻板印象）

人人都持有偏见与刻板印象——常常是无意识的。Inclusive design 的目标是觉察自己的偏见与概括，识别它们可能在何处影响设计决策。

例一：帮助管理家庭成员账户访问权限的 app，若采用"女人 + 男人 + 亲生子女"的刻板家庭定义，其文案与图像很可能传递这种视角，从而排斥所有家庭形态不同的人。

例二：要求选择安全提示问题的 app/游戏——"大学最喜欢的科目？""第一辆车是什么品牌？""第一次看到彩虹是什么感受？"——这些问题从某些视角看是寻常经历，但都建立在并非人人共有的经历之上。用特定语境的经历传达信息，对所有不共享该语境的人毫无用处、等于排斥。可改用更普世的人类经验，如"你最喜欢的活动？""第一个朋友的名字？""哪个词最能形容你？"

基于刻板印象或假设做设计决策必然导致排斥，因为概括无法反映人类视角的多样性。避免假设、专注 Inclusion，才能打造让所有人受益的体验。

### 2.7 Accessibility（无障碍）

Inclusive 的 app 或游戏对所有人都是 accessible 的。人们依赖 Apple 的无障碍功能——VoiceOver、Display Accommodations、closed captioning、Switch Control、Speak Screen 等——按个人需求定制设备，支持这些功能至关重要。

同样至关重要的是：不要假设任何障碍会让人不想享受你的软件体验。这类假设会限制 app 或游戏的潜在受众；相反，让每个体验都 accessible，等于让每个人都有机会以适合自己的方式受益。

谨记：

- 每种障碍都是一个 spectrum（光谱）。例如视觉障碍从低视力到完全失明，还包括色盲、视物模糊、光敏感、周边视觉丧失等。
- 人人都可能经历障碍。除随年龄增长出现的障碍外，还有 *temporary disabilities*（暂时性障碍，如感染导致的短期听力下降）与 *situational disabilities*（情境性障碍，如在嘈杂火车上听不清），任何人都可能在某些时刻遇到。

设计欢迎所有能力水平人群的内容时：

- **Avoid images and language that exclude people with disabilities.**（避免排斥残障人士的图像与语言。）在呈现多样化人群时纳入残障人士；避免用"障碍"表达负面品质的语言。
- **Take a people-first approach when writing about people with disabilities.**（书写残障人士时采用 people-first 原则。）例如先描述一个人的成就与目标，再提及可能的障碍。写具体的人或群体时，了解其自我认同的称呼。
- **Prioritize simplicity and perceivability.**（优先考虑简单性与可感知性。）偏好让任务简单完成的熟悉、一致的交互；确保人人都能通过视觉、听觉或触觉感知你的内容。

### 2.8 Languages（语言与本地化）

人们期望通过选择文本语言以及日期、时间、货币等格式化区域来定制设备。为欢迎全球受众：先让软件支持你以外的语言与地区（即 *internationalization*），再为特定 locale 提供翻译后的文本与资源。

创建 inclusive 体验同时也在为本地化做准备：使用平实语言、避免不必要的性别指代、呈现多样化人群、避免刻板印象与文化特异内容，都有助于把软件本地化为更多语言。使用 SF Symbols 提供 glyph 也能简化本地化——SF Symbols 既提供许多语言专属 glyph，也包含可用于从左到右（LTR）与从右到左（RTL）两种语境的 glyph。

本地化时还要注意颜色的使用：颜色常带有强烈的文化特异性含义，务必了解所支持的每个 locale 中人们对特定颜色的反应。例如某些地区白色关联死亡或哀悼，另一些地区关联纯洁或平和。若用颜色传达信息，确保颜色选择在每个语言版本中传达相同含义。
