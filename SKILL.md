---
name: jeremy-design
description: 设计、实现和改进前端界面，重点覆盖 HRAS 风格的企业工作台、数据审核后台，以及明确要求 Apple 质感的 Web/移动界面。用于页面布局、视觉层级、组件状态与交互落地；纯后端、无视觉影响的代码修改不触发。
---

# Jeremy Design

把用户任务组织成清晰、可操作、有辨识度的界面。企业工作台以 HRAS 的真实页面组织经验为参考；Apple HIG 是按需查阅的平台资料，不是所有网页的默认模板。

## 先判断，再设计

从现有页面、`DESIGN.md`、组件和用户参考中确定：主要使用者、第一任务、内容形态、输入方式、已有视觉系统。能读到的信息直接读取；只有会改变方案的缺口才问用户。

先用一小段说明本次选择：页面类型、主要操作、布局结构、密度和保留的设计特征，然后实施。局部修复不要求额外方案文档。

优先级：用户明确要求 → 项目设计规范与已选参考 → 本次产品模式 → 本 skill 默认值。规范与现有代码不一致时区分“目标规范”和“观察到的实现”，不要静默把其中一方当成另一方。

| 当前任务 | 读取 |
|---|---|
| 企业门户、模块首页、薪酬/审批/运营工作台 | [工作台交互](patterns/workbench.md) + [HRAS 设计模式](references/hras-workbench.md) |
| 移动 Web、小屏触控界面 | [移动 Web](patterns/mobile-web.md) + [Web 适配](references/web-adaptation.md) |
| 网站、内容展示、新建页面方向未定 | [设计流程](references/design-workflow.md) |
| 明确要求 Apple / iOS 风格或原生规范 | [Apple 速查](references/apple-quick-reference.md)，再按平台和组件查对应资料 |
| 建立或补充设计 token | [Web tokens](references/web-tokens.md)；选中 HRAS 风格时使用其参考文件中的成对色值 |
| 列表、表单、保存、异步任务 | [状态与表单](references/states-and-forms.md) |
| React 实现 | [React 约定](references/react-implementation.md)，仅在项目使用 React 时读取 |
| 布局改造、响应式问题、视觉验收 | [按影响范围验证](references/detail-audit.md) |

每次只加载相关资料。不要为一个桌面表格任务读取整套 Apple 平台手册或引入新的 UI 框架。

## 实施原则

- **模块入口、批次处理、结果审核是不同页面。** 首页突出可执行模块和最近批次；处理页突出上下文与当前阶段；审核页让表格、异常和下一步操作占主导。
- **既有项目复用优先。** 延续真实业务标签、路由、组件和数据契约。局部修复只改相关部分；新建或明确改版才重建视觉系统。
- **精致来自层次、对齐和节奏。** 工作台用紧凑标题、清晰表头、统一数字与少量语义强调；不要靠大标题、装饰性统计卡和全屏模糊制造“高级感”。现有项目有良好材质时保留。
- **信息密度按输入方式决定。** 桌面控件可以紧凑；触控扩大命中区域。Apple point 不直接换算为 CSS px。Web 无障碍口径见 [无障碍](references/accessibility.md)。
- **数据与状态真实。** 未加载用占位，未知值不写成 0；演示数据明确标记。按钮成功态依据实际结果；下载文件不等于完成对外提交。不要为了演示触发真实业务写入。
- **任务闭环可见。** 当前范围、处理状态、阻塞原因和可执行下一步同屏可得。异步任务失败后保留输入和恢复入口，部分失败不包装为全部成功。
- **主题和动效按需。** 浅色工作台不强行新增暗色模式；手势、弹簧、玻璃材质仅在适合的界面采用。复用现有图标体系，不为更换图标引入依赖。

## 验证与交付

根据改动范围选择代表性页面和状态，执行项目已有检查；有可运行界面时检查真实渲染、关键交互、窄窗口与放大后的可达性。大范围改版保留前后截图并比较层级、密度和语义权重。具体档位与工具选择见 [细节审查](references/detail-audit.md)。

检测器只辅助发现问题；脚本零阻断不证明视觉好看或业务正确。不要为了消除启发式警告破坏正常布局。说明改动、验证证据与未验证范围，不把未运行的检查写成通过。

## 来源与进阶参考

- `HRAS-OBSERVED`：HRAS 本地页面与设计文件中观察到的模式，出处和边界见 [HRAS 设计模式](references/hras-workbench.md)。不是 Apple 规范，也不代表生产版本已核验。
- `PROJECT-DEFAULT`：本 skill 的可调整默认值；`WEB-ADAPTATION`：浏览器实现建议。
- `HIG`：Apple 官方指南；`APPLE-EXAMPLE`：特定演讲/示例。保留适用平台和条件，不能升级成所有网站的通用要求。
- Apple 参考库保留原仓库标注的 2026-09 快照；本次改造不宣称重新核验全部 HIG 数值。需精确官方依据时查原文。

按需查阅：[布局](references/layout.md)、[字体](references/typography.md)、[颜色](references/color-dark-mode.md)、[材质](references/materials.md)、[控件](references/components-controls.md)、[图标](references/icons-symbols.md)、[交互反馈](references/interaction-feedback.md)、[动效](references/motion.md)、[流体手势](references/fluid-motion-web.md)、[平台差异](references/platforms.md)、[设计原则](references/design-principles.md)、[HIG URL 索引](references/hig-index-all-pages.md)。
