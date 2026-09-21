# React 实现约定（薄）

> **性质**：`PROJECT-DEFAULT` 工程约定，仅收录与 UI 交付直接相关的内容。不是 React 教程；与 React 官方文档（Effect 清理、列表 key、状态管理）一致处不重复解释。动效与手势的物理模型见 `fluid-motion-web.md`。

## 1. 复用优先

- **先用项目现有组件与样式系统**，不引入第二套按钮/弹层/表单组件。
- 需要新组件时：先在项目内找近似件扩展，再考虑引库；引库遵守 `icons-symbols.md` 的选型纪律。
- 不把原生 DOM 示例直接照搬——skill 中大量示例是原生写法，React 项目应转化为声明式实现（见 §2）。

## 2. 用组件状态表达交互

- UI 变化由 state/props 驱动；**不在事件处理器里直接改 DOM 样式**（`el.style.x = …`）来表达状态。
- 派生状态能算就不存（`const visible = items.filter(...)`，不要再存一份 `visibleItems`）。
- 每帧变化的值（动画中间值、拖拽位置）**放进 ref**，不要进 state——状态更新触发的是相关组件及其渲染路径（不等于每次重渲染整个应用，但每帧 setState 的开销仍可观）；高频动画值优先用 ref 或动画库专用值（如 motion 的 MotionValue）。

## 3. 动画与手势的生命周期

- 订阅式动画（弹簧、拖拽）在 `useEffect` 里挂载、在 **cleanup 中解除**：取消 rAF、移除 pointer 监听、停止弹簧。
- 动画循环用 rAF 驱动、直接写 ref 指向的 DOM（或 CSS 变量），React 只负责挂载与卸载：
  ```jsx
  const ref = useRef(null);
  useEffect(() => {
    let raf, alive = true;
    const tick = () => { /* 直接改 ref.current.style */ if (alive) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); };  // 必须清理
  }, []);
  ```
- React 18+ 开发模式的 StrictMode 会**双调用** Effect——清理不完整会看到动画跑两份/监听器翻倍。把"挂载/清理成对"当作硬要求。
- `prefers-reduced-motion` 的订阅同样要清理（`mq.removeEventListener`）。

## 4. 列表

- `key` 用**稳定标识**（数据 id）；index 作 key 只在列表永不重排/增删时勉强成立——默认别用。
- 长列表先衡量渲染成本，按定位、可访问性与数据量选择分页或虚拟化；需要虚拟化时优先复用成熟实现；同时确认吸顶表头与键盘焦点在虚拟化下的行为（`../patterns/workbench.md` §4）。
- 先用 Profiler 确认慢交互；有证据时再使用 `memo` 配合稳定 props/回调。稳定 handler 本身不能阻止组件重渲染，`memo` 也不是不重渲染的保证。参考 [React memo](https://react.dev/reference/react/memo)。

## 5. 弹层与焦点

- 用成熟的 headless 弹层库（如 Radix UI 系）实现对话框/菜单/抽屉，**不要手写焦点圈定**——`web-adaptation.md §1` 的模态语义要求（焦点移入/圈定/Esc/关闭还原/背景 inert）它们提供可靠基础，但**库 ≠ 配置正确**：可访问名称与内容结构（如 Radix Dialog 的 Title/Description/Trigger 关联）、关闭流程仍需应用侧接对，交付前按 `detail-audit.md` 键盘档实测。
- 若必须自写：焦点还原到触发元素、`inert` 背景、Esc 关闭三件事逐一实测。
- Portal 渲染的浮层注意**层叠上下文**（父级 `transform`/`overflow` 会裁剪 fixed 元素）。

## 6. 依赖与打包

- 按需引入（`import { Camera } from 'lucide-react'`，不是整个包全量）；重组件用动态 `import()` 分包。
- 交付前看一眼 bundle：为了一个图标/日期函数引入大库不划算。
- **图标在 React 用组件包**（`lucide-react`），不用 CDN 的 `createIcons()` DOM 替换流程——组件包里是真正的 JSX 组件，支持 props 与 tree-shaking（`icons-symbols.md` §3.3）。

## 7. 交付前

按 `detail-audit.md` §0 检查受影响状态。相关检查包括 StrictMode 下无泄漏副作用、产品支持主题时切换无过期状态、列表增删后 key 行为符合预期。
