# Web Tokens（三层结构 + 信息密度决策）

> **性质**：`PROJECT-DEFAULT` 方法 + `WEB-ADAPTATION`。本文件教**如何建立一套自洽的 token 系统**，不是规定所有项目用同一组数值；具体颜色语义参考 `color-dark-mode.md`（HIG 语义色），本文件是该语义在 Web CSS 的落地结构。

## 1. 三层结构

```text
基础值（palette）   颜色、间距、字号、圆角、阴影的原始刻度
    ↓ 映射
语义值（semantic）  正文、次要文字、页面背景、浮层、边框、危险状态…
    ↓ 组合
组件值（component） 按钮、输入框、表格行、侧栏、弹层…
```

规则：

- **组件只消费语义值**，不直接引用基础值（按钮用 `--color-danger`，不用 `--red-600`）。
- **语义值映射基础值**，暗色模式只改映射层。
- 基础值本身没有"含义"，可以增删；语义值的**名字是接口**，改动会影响全站。

## 2. 示例骨架（支持双主题的项目可参考，数值按项目调）

浅色产品仅采用亮色部分和 `color-scheme: light`，不要复制暗色 media 导致原生控件先变暗。HRAS 配色按 [HRAS 设计模式](hras-workbench.md) 的成对色值选择。

```css
:root {
  color-scheme: light dark;            /* 跟随系统；强制态在下方覆盖 */
  /* ---- 基础值 ---- */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-6: 24px; --space-8: 32px;
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px;
  --text-sm: 0.875rem; --text-base: 1rem; --text-lg: 1.25rem;
  --weight-regular: 400; --weight-semibold: 600;

  /* ---- 语义值（亮色） ---- */
  --color-bg: #ffffff;
  --color-bg-subtle: #f5f5f7;          /* 页面分区底色 */
  --color-label: #1d1d1f;              /* 正文 */
  --color-label-secondary: #6e6e73;    /* 次要文字 */
  --color-border: rgba(0, 0, 0, 0.12);
  --color-surface: #ffffff;            /* 卡片/浮层 */
  --color-accent: #0071e3;
  --color-on-accent: #ffffff;          /* accent 填充上的文字，成对声明 */
  --color-danger: #d70015;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {    /* 跟随系统；强制浅色时排除本分支 */
    /* 只改语义层 */
    --color-bg: #000000;
    --color-bg-subtle: #1c1c1e;
    --color-label: #f5f5f7;
    --color-label-secondary: #a1a1a6;
    --color-border: rgba(255, 255, 255, 0.16);
    --color-surface: #1c1c1e;
    --color-accent: #0a84ff;
    --color-on-accent: #ffffff;
    --color-danger: #ff453a;
    color-scheme: dark;
  }
}

/* 强制深色（用户手选）：暗色语义值与上面 media 块是同一份。
   下面的值可直接运行；工程上更稳的做法是从 media 块生成副本（构建脚本）或提取共享
   声明，二者择一，避免两处手抄漂移。 */
:root[data-theme="dark"] {
  --color-bg: #000000;
  --color-bg-subtle: #1c1c1e;
  --color-label: #f5f5f7;
  --color-label-secondary: #a1a1a6;
  --color-border: rgba(255, 255, 255, 0.16);
  --color-surface: #1c1c1e;
  --color-accent: #0a84ff;
  --color-on-accent: #ffffff;
  --color-danger: #ff453a;
  color-scheme: dark;
}

/* 强制浅色：语义值即 :root 默认（亮色），只需把 color-scheme 钉回 light */
:root[data-theme="light"] { color-scheme: light; }

/* ---- 组件值 ---- */
.btn { background: var(--color-accent); color: var(--color-on-accent); border-radius: var(--radius-md); padding: var(--space-2) var(--space-4); }
```

- 间距刻度坚持一套（如 4 的倍数），组件里出现刻度外的"魔法数字"时，先问是不是刻度该扩充，而不是就地写值。
- 文字用相对单位（rem），容器尺寸用 token——这是字号缩放能正常工作的**前提**，但不等于自动通过：容器的固定高度、不可断长串、宽表格在放大档仍可能溢出裁切。放大档按 `detail-audit.md` §0 选择范围实测，不能用"用了 rem"推断结论。
- 主题三态（跟随系统 / 强制浅 / 强制深）：跟随系统走 media 分支（选择器带 `:not([data-theme="light"])`，保证强制浅不被系统深色盖掉）；强制深色把暗色语义值另写一份到 `:root[data-theme="dark"]`（与 media 同源，构建生成副本）；强制浅色只需修正 `color-scheme`。`color-scheme` 决定滚动条与原生表单控件的明暗，三态都要钉对。

## 3. 命名约定

- **按角色命名**：`--color-label-secondary` 好于 `--color-gray-500`——语义名在暗色映射下仍成立，刻度名在暗色下会说谎。
- 状态成组命名：`--color-danger` / `--color-danger-bg` / `--color-danger-border`（文本/底色/边线三件套）。填充色配 `--color-on-*` 显式声明其上文字色（`--color-accent` 配 `--color-on-accent`），不靠"浅色下用白字"的隐式推断——映射变化时对比度关系不随之失效。
- 组件级 token 只在**确有第二个消费方**时才提取；一次性样式不必 token 化。

## 4. 信息密度决策：44px 不是所有场景的唯一答案

`web-adaptation.md §0` 的 44×44 CSS px 是**触控优先界面**的默认值（`PROJECT-DEFAULT`）。应用到全站前先判断输入方式：

| 场景 | 视觉尺寸 | 命中区域 |
|---|---|---|
| 触控优先（移动 Web、平板上游走的界面） | 按触控尺寸设计 | ≥44×44 CSS px（本 skill 默认） |
| 桌面鼠标为主（工作台、管理后台） | 可以更紧凑（如 32px 高按钮、28px 行高） | **仍按适用的 WCAG 2.2「目标尺寸」条款及例外条件验收**（24×24 CSS px 基准 + 间距例外），不因"鼠标操作"忽略 |

- 不要把工作台工具栏整体放大成移动端尺寸——信息密度是工作台的核心价值。
- 混合输入（触屏笔记本、平板配键盘）：按**主要使用场景**定默认，用 `@media (pointer: coarse)` 对触控设备单独加码。
- Apple 原生数值（44×44 **pt**）与 WCAG 数值（24×24 **CSS px**）是两套并行标准，数值不可互相换算推导（`web-adaptation.md §0`）。

## 5. 新项目 vs 已有项目

- **新项目**：可以按本文件建立 `PROJECT-DEFAULT` tokens，取舍数值时按 §4 的信息密度决策定基调。
- **已有项目**：**优先复用现有 tokens**——不要在项目里另建一套几乎相同的颜色、间距和圆角。发现缺项时先补现有系统（扩刻度/加语义值），而不是并列一套新的。
- 局部修复任务不改动全局 token；确有必要时按最小影响面新增语义值。

## 6. 与验收的关系

- 字号放大与产品实际支持的主题按 `detail-audit.md` §0 验证。token 结构正确是这些档位通过的**必要条件而非充分条件**：破版既可能来自绕过 token 的硬编码值（grep `#` 颜色与固定 px 排查），也可能来自对放大不友好的结构（固定高容器、不可断长串、宽表格）——必须实跑，不能从 token 结构推断结论。
- 对比度按 `accessibility.md` 的 WCAG 口径验收；改语义层映射后重新检查产品支持主题的对比度。
