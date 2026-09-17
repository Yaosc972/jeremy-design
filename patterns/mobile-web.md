# 移动 Web 真实环境（小屏与触控）

> **性质**：`WEB-ADAPTATION`。本文件覆盖**真机**上才会出现的问题——把浏览器窗口缩窄并不等于移动端测试。与 `web-adaptation.md`（safe area / 触控目标基础）互补，不重复。

## 1. 两个视口：Layout Viewport ≠ Visual Viewport

- **Layout Viewport**：CSS 布局的参照系（`window.innerWidth` 量的是它）。
- **Visual Viewport**：**用户实际看到的区域**——软键盘弹出、双指缩放时它会缩小/移动，而 layout viewport 不变。
- 后果：软键盘弹出时，`position: fixed` 的底部按钮**可能被键盘盖住且不报错**——固定定位默认不感知 visual viewport。
- **Safe Area ≠ 键盘避让**：`env(safe-area-inset-bottom)` 解决的是刘海/Home 指示条，不解决键盘。两者要分别处理。
- 需要精细避让时读 `window.visualViewport`（height/offsetTop + `resize`/`scroll` 事件）；轻量场景可用 `env(keyboard-inset-height)`（支持面窄，视目标浏览器而定）。

## 2. 软键盘弹出的布局

- **底部操作区**（提交按钮、分页器）固定在底部时：聚焦输入框先让内容可滚，提交按钮要么随键盘上浮，要么在键盘打开时收起为紧凑态。
- **聚焦的输入框必须可见**：聚焦后输入框被键盘遮住是硬伤——在 `focus`/`visualViewport.resize` 后 `scrollIntoView({block:'center'})`。
- viewport meta 可声明 `interactive-widget=resizes-content`（Android Chrome 对键盘行为的显式选择）；iOS 行为不可完全控制，以真机实测为准。
- 键盘打开时避免重排整页（如页面高度跳变导致丢失滚动位置）。

## 3. 浏览器返回是"系统手势/按键"，要参与设计

- 弹出的模态/抽屉：打开时 `history.pushState`，用户按返回键应**关闭弹层而不是退出页面**（关闭时 `history.back()` 协调）。
- 多步流程（向导、结账）：每步进或退是一次 history 记录，返回键行为与界面后退按钮一致。
- 不要用返回键拦不住的"整页自绘返回按钮"替代系统返回；两者都要可用。

## 4. 输入体验

- **输入类型**：`type="email|tel|url|number|search"` + `inputmode="numeric|decimal|tel"` 让键盘正确。
- **自动填充**：`autocomplete="name|email|one-time-code|street-address"` 等按语义标注；一次性验证码用 `inputmode="numeric"` + `autocomplete="one-time-code"`。
- **回车键文案**：`enterkeyhint="search|send|next|done"` 提示键盘动作键。
- 表单控件字号 **≥16px**（iOS Safari 聚焦时自动放大页面的阈值）。
- `touch-action: manipulation` 消除双击缩放 300ms 延迟（`web-adaptation.md §1`），但不要全局禁用缩放（`user-scalable=no` 是无障碍问题）。

## 5. 触控替代 hover

- **所有 hover 显示的内容都必须有触控路径**：下拉菜单、tooltip、行内操作按钮——触控设备上首击应展开而非直接跳转（或默认常显）。
- `:hover` 样式用 `@media (hover: hover)` 包裹，避免触屏上"点击后 hover 态粘住"。
- 可点目标按 44×44 CSS px 默认（`PROJECT-DEFAULT`）或适用 WCAG 条款验收。

## 6. 滚动与视口高度

- 高度用 **`100dvh`**（动态视口），不要用 `100vh`——移动浏览器地址栏收起/展开时 `100vh` 比可视区高，底部内容被裁。
- `overscroll-behavior` 控制滚动链（如抽屉内滚动不带动页面）；`-webkit-overflow-scrolling: touch` 已过时，不需要写。
- 吸顶元素的定位要考虑地址栏收缩（`position: sticky` 优于 `fixed` 的多数场景）。

## 7. 验收：跑一条真实任务链

真机或 DevTools 设备模拟下，完整走一遍（比截一张静态图有价值得多）：

> **打开表单 → 聚焦靠近屏幕底部的输入框 → 输入 → 触发并查看错误信息 → 修正 → 完成提交**

过程中检查：输入框是否被键盘遮挡、底部按钮是否可及、错误信息是否可见、提交反馈是否可达、返回键行为是否正确。同时在验收矩阵的窄视口档（320–390px）跑 `detail-audit.md` 的检测器。
