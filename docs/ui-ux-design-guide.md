# UI/UX 设计规范总结

基于 UI/UX Pro Max 设计系统（57种样式 + 98条UX指南 + 96个色彩方案）

## 核心设计原则

### 1. 表单设计最佳实践（Forms）

| 规则 | 正确做法 ✓ | 错误做法 ✗ |
|------|-----------|-----------|
| **输入标签** | 每个输入框都有可见标签（上方或左侧） | 仅使用 placeholder 作为标签 |
| **错误提示** | 错误信息显示在相关输入框下方 | 所有错误集中在表单顶部 |
| **内联验证** | blur 时验证大多数字段 | 仅在提交时验证 |
| **输入类型** | 使用正确的 input type（email, tel, number） | 所有字段都用 text |
| **必填标识** | 使用 * 或 (required) 文本 | 不标记必填字段 |
| **密码可见性** | 提供显示/隐藏密码切换 | 密码始终隐藏 |
| **提交反馈** | 显示加载 → 成功/失败状态 | 点击按钮无响应 |
| **输入外观** | 输入框有明显的边框/背景 | 无边框输入框 |
| **移动键盘** | 使用 inputmode 属性 | 所有输入都显示默认键盘 |

### 2. 交互设计（Interaction）

| 规则 | 正确做法 ✓ | 错误做法 ✗ |
|------|-----------|-----------|
| **焦点状态** | 可见的焦点环（focus:ring-2） | outline-none 无替代 |
| **悬停状态** | 改变颜色 + cursor-pointer | 可点击元素无悬停反馈 |
| **激活状态** | 按压时视觉变化（active:scale-95） | 无激活状态反馈 |
| **禁用状态** | 降低不透明度 + cursor-not-allowed | 禁用与启用样式相同 |
| **加载按钮** | 禁用 + 显示 loading spinner | 允许在加载时多次点击 |
| **错误反馈** | 清晰的错误信息（靠近问题处） | 静默失败 |
| **成功反馈** | Toast 通知或勾选标记 | 操作完成无确认 |
| **确认对话框** | 删除/不可逆操作前确认 | 直接删除无确认 |

### 3. 动画与过渡（Animation）

| 规则 | 正确做法 ✓ | 错误做法 ✗ |
|------|-----------|-----------|
| **持续时间** | 微交互 150-300ms | 超过 500ms 的 UI 动画 |
| **减少动效** | 检查 prefers-reduced-motion | 忽略动效偏好设置 |
| **加载状态** | 骨架屏或 spinner | 加载时 UI 冻结 |
| **悬停 vs 点击** | 主要交互用点击/轻触 | 仅依赖悬停 |
| **连续动画** | 仅用于加载指示器 | 装饰性元素也无限动画 |
| **缓动函数** | ease-out（进入） ease-in（退出） | linear 用于 UI 过渡 |

### 4. 可访问性（Accessibility）

| 规则 | 正确做法 ✓ | 错误做法 ✗ |
|------|-----------|-----------|
| **颜色对比** | 最小 4.5:1（正常文本） | 低对比度文本（<3:1） |
| **颜色之外** | 图标+文本 辅助颜色 | 仅用颜色表示错误/成功 |
| **替代文本** | 有意义的图片都有 alt | 缺少或空 alt |
| **表单标签** | label 带 for 或包裹 input | 仅 placeholder 无 label |
| **错误消息** | role="alert" 或 aria-live | 仅视觉显示错误 |
| **键盘导航** | Tab 顺序匹配视觉顺序 | 无法通过键盘访问 |

### 5. 响应式设计（Responsive）

| 规则 | 正确做法 ✓ | 错误做法 ✗ |
|------|-----------|-----------|
| **触摸目标** | 最小 44x44px | 移动端小按钮（<32px） |
| **触摸间距** | 触摸目标间距最小 8px | 紧密排列的可点击元素 |
| **字体大小** | 移动端最小 16px | 移动端小于 14px 的文本 |
| **视口设置** | viewport meta 标签 | 缺少 viewport 设置 |
| **水平滚动** | 内容适应视口宽度 | 移动端出现水平滚动 |

### 6. 色彩系统

#### 认证/登录场景推荐配色
基于 "SaaS General" 配色方案：

```css
/* Primary Colors */
--primary: #2563EB       /* Trust Blue - 主要 CTA */
--secondary: #3B82F6     /* Lighter Blue - 次要元素 */
--accent: #F97316        /* Orange - 强调/链接 */

/* Background & Text */
--background: #F8FAFC    /* Off-white - 背景 */
--text: #1E293B          /* Dark Grey - 文本 */
--border: #E2E8F0        /* Light Grey - 边框 */

/* Feedback Colors */
--success: #22C55E       /* Green - 成功 */
--error: #EF4444         /* Red - 错误 */
--warning: #F59E0B       /* Amber - 警告 */
```

### 7. 间距系统

基于 8px 网格系统（Tailwind CSS 默认）：

- **内边距（Padding）**: 4px (p-1), 8px (p-2), 12px (p-3), 16px (p-4), 24px (p-6)
- **外边距（Margin）**: 同上
- **间隙（Gap）**: 8px (gap-2), 16px (gap-4), 24px (gap-6)
- **圆角（Radius）**: 4px (rounded), 8px (rounded-lg), 12px (rounded-xl)

### 8. 排版系统

```css
/* 标题 */
h1: text-2xl (24px) font-bold
h2: text-xl (20px) font-semibold
h3: text-lg (18px) font-semibold

/* 正文 */
body: text-base (16px) leading-normal
small: text-sm (14px)
tiny: text-xs (12px)
```

### 9. 登录框设计检查清单

#### 布局
- [ ] 使用 `<dialog>` 标准元素
- [ ] 最大宽度约束（max-w-md 或 448px）
- [ ] 合理的内边距（px-6 py-8）
- [ ] 标题醒目（text-2xl font-bold）

#### 表单
- [ ] 每个输入框都有可见标签
- [ ] 输入框有明显边框（input-bordered）
- [ ] 验证码输入框和按钮使用 join 组合
- [ ] 提供必填字段标识
- [ ] 错误提示带图标和 role="alert"

#### 交互
- [ ] 发送验证码按钮有60秒倒计时
- [ ] 登录按钮有加载状态
- [ ] 禁用状态清晰可见
- [ ] 所有按钮有 cursor-pointer
- [ ] Enter 键可提交表单

#### 可访问性
- [ ] 颜色对比度符合 WCAG AA（4.5:1）
- [ ] 焦点状态清晰可见
- [ ] 错误消息可被屏幕阅读器读取
- [ ] 支持键盘导航

#### 视觉
- [ ] 配色专业（蓝色系表示信任）
- [ ] 间距一致（使用 space-y-*）
- [ ] 圆角适中（rounded-lg）
- [ ] 阴影适当（modal-box 默认）

### 10. DaisyUI 组件最佳实践

#### Modal（弹窗）
```tsx
// 使用标准 <dialog> 元素
<dialog ref={dialogRef} className="modal">
  <div className="modal-box max-w-md">
    {/* 内容 */}
    <div className="modal-action">
      <form method="dialog">
        <button className="btn">关闭</button>
      </form>
    </div>
  </div>
  {/* 点击背景关闭 */}
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
```

#### Form Control（表单控件）
```tsx
<label className="form-control">
  <div className="label">
    <span className="label-text font-medium">标签</span>
  </div>
  <input className="input input-bordered" />
</label>
```

#### Join（组合元素）
```tsx
<div className="join w-full">
  <input className="input input-bordered join-item flex-1" />
  <button className="btn btn-neutral join-item">按钮</button>
</div>
```

#### Alert（警告提示）
```tsx
<div role="alert" className="alert alert-error">
  <svg>{/* 图标 */}</svg>
  <span>错误信息</span>
</div>
```

## 参考资源

- **UI/UX Pro Max**: 57种UI样式 + 98条UX指南 + 96个色彩方案
- **DaisyUI文档**: `docs/daisyui.md`
- **WCAG标准**: AA级对比度 4.5:1，AAA级对比度 7:1
- **成功案例**: [登录框视觉优化案例](../.claude/context/development-workflow.md#ui-设计成功案例--参考标准) ⭐

---

**更新时间**: 2026-01-19
**来源**: nextlevelbuilder/ui-ux-pro-max-skill
