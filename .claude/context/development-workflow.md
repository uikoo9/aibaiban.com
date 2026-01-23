# 开发流程规范

本文档记录了项目开发过程中需要遵循的流程和规范，确保文档和代码的一致性。

## Excalidraw 白板开发规范 ⭐ 极其重要

### 开发白板功能时的必读文档

**当需要开发白板相关功能（绘图、元素创建、渲染等）时，必须阅读：**

📖 **[Excalidraw 绘图指南](../../docs/excalidraw-drawing-guide.md)** - 基于官方源码的深度解析

**核心要点**：

1. **文字元素的三个必需字段**（缺一不可）：
   ```typescript
   {
     lineHeight: 1.25 as any,    // fontFamily 1 对应的行高
     originalText: text,         // 原始文本，用于编辑和换行
     autoResize: true,           // 自动调整大小标志
   }
   ```

2. **容器绑定机制**（让文字跟随形状移动）：
   ```typescript
   // 步骤1：创建容器元素
   const shapeId = generateId();
   const shape = { id: shapeId, type: 'rectangle', ... };

   // 步骤2：创建文字元素并设置 containerId
   const text = { containerId: shapeId, ... };

   // 步骤3：建立双向绑定
   shape.boundElements = [{ type: 'text', id: text.id }];
   ```

3. **支持的形状类型**：
   - ✅ `rectangle`, `ellipse`, `diamond`, `arrow`, `line`, `text`
   - ❌ `cylinder`, `hexagon`, `cloud`（需映射到支持的类型）

4. **常见错误**：
   - ❌ 缺少 lineHeight 导致文字不显示
   - ❌ 文字坐标计算错误（x 应该是左边缘，不是中心点）
   - ❌ 忘记设置容器的 boundElements

**详细内容见文档**：[docs/excalidraw-drawing-guide.md](../../docs/excalidraw-drawing-guide.md)

---

## UI 开发规范 ⚠️ 重要

### 开发新组件时的必读文档

**当需要开发新的 UI 组件时，必须按顺序阅读以下文档：**

1. ✅ **首先读取 `docs/ui-ux-design-guide.md`**
   - 查看表单、交互、动画、可访问性最佳实践
   - 了解色彩系统和间距规范
   - 参考组件设计检查清单
   - 遵循 98 条 UX 指南

2. ✅ **然后读取 `docs/daisyui.md`**
   - 查看对应组件的官方用法
   - 了解推荐的 class 名称和结构
   - 参考最佳实践和使用规则

### DaisyUI 组件开发规则

**当需要开发 UI 弹窗、对话框等组件时，必须遵循以下流程：**

1. ✅ **优先使用 HTML5 标准元素**
   - 优先使用 HTML5 标准元素（如 `<dialog>` for modal）
   - 使用官方推荐的 class 组合
   - 遵循可访问性（a11y）规范

2. ✅ **使用 DaisyUI 推荐的方式**
   - 优先使用 DaisyUI 提供的 class 名
   - 需要自定义时使用 Tailwind CSS utility classes
   - 最后才考虑自定义 CSS

3. ✅ **遵循设计系统**
   - 使用一致的间距（8px 网格系统）
   - 使用统一的色彩方案
   - 确保可访问性（WCAG AA 标准）
   - 提供清晰的交互反馈

### 示例场景

<details>
<summary>开发登录弹窗</summary>

**错误做法** ❌：
```tsx
// 直接使用 div + 自定义样式
<div className="modal modal-open">
  <div className="modal-box relative">
    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
      <X />
    </button>
    ...
  </div>
</div>
```

**正确做法** ✅：
1. 先读取 `docs/daisyui.md` 中 modal 组件的文档
2. 发现推荐使用 HTML `<dialog>` 元素
3. 使用标准的 modal 结构：
```tsx
<dialog ref={dialogRef} className="modal">
  <div className="modal-box">
    ...
    <div className="modal-action">
      <form method="dialog">
        <button className="btn">Close</button>
      </form>
    </div>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
```
</details>

---

## UI 设计成功案例 ⭐ 参考标准

### 案例：登录框视觉优化（2026-01-19）

这是一个从"不够美观"到"专业精致"的完整优化案例，可作为后续所有 UI 组件设计的参考标准。

#### 优化前的问题

用户反馈："登录框有点丑"、"字号什么的感觉还是点丑"

**主要问题**：
- ❌ 缺乏视觉层次感
- ❌ 字号偏小，间距局促
- ❌ 头部区域单调，缺少设计感
- ❌ 按钮样式平淡，缺少吸引力
- ❌ 整体视觉呼吸感不足

#### 优化方案

**1. 头部区域重设计**
```tsx
// ✅ 优化后：渐变背景 + 图标装饰 + 层次分明
<div className="bg-gradient-to-b from-primary/5 to-transparent px-8 pt-10 pb-8">
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
      <svg className="w-8 h-8 text-primary">
        {/* 盾牌图标 - 传达安全感 */}
      </svg>
    </div>
    <h2 className="text-2xl font-bold text-base-content mb-2">
      欢迎来到 AI 白板
    </h2>
    <p className="text-sm text-base-content/60">
      手机号登录，开启你的创作之旅
    </p>
  </div>
</div>
```

**关键改进**：
- ✅ 渐变背景（`from-primary/5 to-transparent`）增加层次感
- ✅ 64x64px 图标容器，圆角 16px，传达品质感
- ✅ 标题从 `text-3xl` 调整为 `text-2xl`，比例更协调
- ✅ 副标题使用 60% 透明度，形成清晰层次

**2. 字号和尺寸升级**
```tsx
// ✅ 表单标签
<label className="label pb-2">
  <span className="label-text text-[15px] font-semibold">手机号码</span>
  <span className="label-text-alt text-error text-xs">必填</span>
</label>

// ✅ 输入框 - 使用 input-lg
<input
  className="input input-bordered input-lg w-full text-base"
  // 48px 高度，16px 字号
/>

// ✅ 按钮 - 使用 btn-lg + 阴影
<button className="btn btn-primary btn-lg w-full text-base font-semibold shadow-lg shadow-primary/20">
  立即登录
</button>
```

**尺寸规范**：
| 元素 | 尺寸 | 说明 |
|------|------|------|
| 输入框 | `input-lg` (48px 高) | 移动端友好的触摸目标 |
| 按钮 | `btn-lg` (48px 高) | 与输入框保持一致 |
| 标签字号 | `text-[15px]` | 介于 sm 和 base 之间，层次清晰 |
| 输入字号 | `text-base` (16px) | 防止移动端自动缩放 |
| 按钮字号 | `text-base` | 清晰易读 |
| 图标容器 | 64x64px | 视觉焦点，传达品质 |

**3. 间距系统优化**
```tsx
// ✅ 模态框分区控制
<div className="modal-box max-w-md p-0">
  {/* 头部：渐变区 */}
  <div className="px-8 pt-10 pb-8">...</div>

  {/* 表单：主内容区 */}
  <div className="px-8 py-6">
    <div className="space-y-5">
      {/* 表单字段，20px 间距 */}
    </div>
  </div>

  {/* 底部：取消按钮 */}
  <div className="border-t border-base-200 px-8 py-4">...</div>
</div>
```

**间距规范（8px 网格）**：
- 头部内边距：`px-8 pt-10 pb-8`（32px 横向，40px 上，32px 下）
- 表单内边距：`px-8 py-6`（32px 横向，24px 纵向）
- 字段间距：`space-y-5`（20px）
- 底部内边距：`px-8 py-4`（32px 横向，16px 纵向）
- 图标下边距：`mb-4`（16px）
- 标题下边距：`mb-2`（8px）

**4. 视觉细节提升**
```tsx
// ✅ 主按钮阴影效果
className="shadow-lg shadow-primary/20"

// ✅ 服务条款链接
<button className="link link-primary link-hover mx-1">服务条款</button>

// ✅ 文案优化
"手机号" → "手机号码"
"验证码" → "短信验证码"
"登录" → "立即登录"
```

#### 优化结果对比

| 维度 | 优化前 | 优化后 |
|------|--------|--------|
| **视觉层次** | 平淡，缺少焦点 | 渐变头部 + 图标装饰，层次分明 |
| **字号大小** | 偏小（text-sm） | 合理（text-base, text-[15px]） |
| **组件尺寸** | 默认（input, btn） | 加大（input-lg, btn-lg） |
| **间距呼吸感** | 局促（space-y-4） | 舒适（space-y-5, px-8） |
| **按钮吸引力** | 普通 | 阴影 + 大尺寸 + 专业文案 |
| **整体质感** | 业余 | 专业精致 |

#### 核心设计原则总结

**1. 视觉层次三要素**
- ✅ **主焦点**：图标容器（64x64px，渐变背景）
- ✅ **标题层**：大标题（text-2xl）+ 副标题（text-sm，60% 透明度）
- ✅ **内容层**：表单区（独立内边距，清晰分区）

**2. 字号系统**
- ✅ **标题**：`text-2xl`（24px）
- ✅ **标签**：`text-[15px]`（15px，自定义）
- ✅ **输入/按钮**：`text-base`（16px）
- ✅ **副标题**：`text-sm`（14px）
- ✅ **提示文字**：`text-xs`（12px）

**3. 间距规律**
- ✅ 使用 8px 网格倍数：8px, 16px, 20px, 24px, 32px, 40px
- ✅ 大间距外围，小间距内部
- ✅ 分区控制（`p-0` + 内部独立 padding）

**4. 色彩运用**
- ✅ 主色（primary）：CTA 按钮、图标、链接
- ✅ 透明度层次：100% → 60% → 50% → 40%
- ✅ 渐变背景：极浅色（5% 透明度）营造层次

**5. 尺寸选择**
- ✅ 移动端触摸目标最小 44px（使用 48px 更安全）
- ✅ 输入框和按钮保持一致高度（48px）
- ✅ 图标装饰容器醒目但不过大（64x64px）

#### 可复用代码模板

```tsx
// 标准模态框头部（带图标装饰）
<div className="bg-gradient-to-b from-primary/5 to-transparent px-8 pt-10 pb-8">
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
      {/* 图标 SVG */}
    </div>
    <h2 className="text-2xl font-bold text-base-content mb-2">
      {标题}
    </h2>
    <p className="text-sm text-base-content/60">
      {副标题}
    </p>
  </div>
</div>

// 标准表单字段
<div className="form-control">
  <label className="label pb-2">
    <span className="label-text text-[15px] font-semibold">{标签}</span>
    <span className="label-text-alt text-error text-xs">必填</span>
  </label>
  <input
    className="input input-bordered input-lg w-full text-base"
    placeholder={占位符}
  />
</div>

// 标准主按钮
<button className="btn btn-primary btn-lg w-full text-base font-semibold shadow-lg shadow-primary/20">
  {按钮文字}
</button>
```

#### 适用场景

这套设计标准适用于：
- ✅ 所有登录/注册类弹窗
- ✅ 表单提交类对话框
- ✅ 需要用户输入的模态框
- ✅ 任何需要专业视觉质感的 UI 组件

#### 参考文件
- 完整代码：`packages/web/src/components/Auth/LoginModal.tsx`
- 设计规范：`docs/ui-ux-design-guide.md`
- DaisyUI 文档：`docs/daisyui.md`

---

## 后台任务运行规范

### 规则
**不要主动启动后台任务（如开发服务器）。**

- ❌ 不要使用 `run_in_background: true`
- ❌ 不要自动运行 `pnpm dev`、`npm start` 等命令
- ✅ 只在用户明确要求时才启动服务

### 原因
- 用户可能已经在其他终端运行了服务
- 后台任务会占用资源
- 用户可能只是想查看代码，不需要运行

---

## 文档同步规则 ⚠️ 重要

### 核心原则
**每次项目有实质性更新时，必须同步更新相关文档。**

### 必须更新的文档

#### 1. 技术决策变更时

当做出重要技术决策（如选择框架、库、工具）时：

✅ **必须创建 ADR**
- 路径：`.claude/decisions/XXX-description.md`
- 格式：按 ADR 模板编写
- 编号：递增（001, 002, 003...）

✅ **必须更新 .claude/README.md**
- 在"架构决策记录"部分添加新 ADR 链接
- 更新"更新日志"

✅ **必须更新 .claude/context/tech-stack.md**
- 在对应章节添加或更新技术栈信息
- 更新"更新记录"

✅ **必须更新根目录 README.md**
- 更新"技术栈"部分
- 更新"路线图"（如果相关）
- 如有新文档，更新"项目结构"

---

#### 2. 添加新文档时

当在 `docs/` 或 `.claude/` 下创建新文档时：

✅ **必须更新 docs/README.md**
- 在对应分类下添加新文档链接

✅ **必须更新根目录 README.md**
- 更新"项目结构"树形图
- 确保新文件路径正确

✅ **必须更新 .claude/README.md**（如果是 .claude/ 下的文档）
- 在对应章节添加链接

---

#### 3. 项目结构变更时

当添加新的包、目录或配置文件时：

✅ **必须更新根目录 README.md**
- 更新"项目结构"部分
- 使用 `tree` 或 `ls` 确保结构准确

示例命令：
```bash
# 查看 docs 目录下的所有 md 文件
ls -1 docs/*.md

# 查看 .claude/decisions 下的所有 ADR
ls -1 .claude/decisions/*.md
```

---

#### 4. 完成重要任务时

✅ **必须更新 .claude/tasks/current-sprint.md**
- 将已完成任务移到"已完成"部分
- 添加完成日期
- 更新"里程碑"（如果适用）
- 更新"更新记录"

✅ **必须更新 .claude/sessions/YYYY-MM/DD-*.md**
- 记录完成的工作
- 更新"下一步"
- 更新"创建的文件"列表

---

#### 5. 创建或更新产品需求文档时

当创建新 PRD 或更新产品规划时：

✅ **必须更新 prds/README.md**
- 在对应分类下添加新 PRD 链接
- 更新"更新记录"

✅ **必须更新 .claude/README.md**
- 在"产品文档"部分添加重要 PRD 链接（如产品概述、核心功能等）

✅ **必须更新根目录 README.md**
- 更新"项目状态"（如果产品阶段发生变化）
- 更新"路线图"（如果有新的产品里程碑）
- 更新"项目结构"（如果添加了新的 PRD 文件）

✅ **根据需要更新 .claude/context/project-overview.md**
- 当产品��位、核心功能等发生重大变化时同步更新

---

## 开发流程检查清单

### 开始新任务前
- [ ] 阅读 `.claude/context/` 下的上下文文档
- [ ] 查看 `.claude/tasks/current-sprint.md` 了解当前任务
- [ ] 查看最新的会话记录

### 完成任务后
- [ ] 更新 `.claude/tasks/current-sprint.md`
- [ ] 更新会话记录
- [ ] 如果有技术决策，创建 ADR
- [ ] 更新所有相关文档（见上文规则）
- [ ] 提交代码前，确保所有文档都已更新

### 提交代码前
- [ ] 运行 `git status` 检查是否有遗漏的文档
- [ ] 确认 README.md 的项目结构是最新的
- [ ] 确认所有新文档都已添加索引
- [ ] 遵循 Git 提交规范（Conventional Commits）

---

## 文档更新优先级

### P0（必须立即更新）
- ✅ ADR（架构决策记录）
- ✅ README.md（项目结构）
- ✅ tech-stack.md（技术栈变更）
- ✅ current-sprint.md（任务状态）
- ✅ prds/README.md（产品文档索引）

### P1（应该及时更新）
- ✅ 会话记录（sessions/）
- ✅ docs/README.md（文档索引）
- ✅ .claude/README.md（协作记录索引）
- ✅ prds/产品概述.md（产品定位变更）
- ✅ 具体 PRD 文档（功能需求）

### P2（可以稍后更新）
- 🟡 project-overview.md（项目概述）
- 🟡 architecture.md（架构设计）
- 🟡 其他上下文文档

---

## 自动化提醒

### Git Hooks
项目配置了 pre-commit hook，可以在提交前自动检查：
- Commit message 格式（commitlint）
- 代码格式（如果配置）

### 手动检查命令

**检查文档是否最新**：
```bash
# 查看所有 markdown 文件的修改时间
find . -name "*.md" -not -path "*/node_modules/*" -exec ls -lh {} \;

# 查看 git 状态
git status

# 对比 docs 目录和 README.md 中的文档列表
ls -1 docs/*.md
grep "docs/" README.md
```

---

## 常见场景示例

### 场景 1: 选择了新的技术框架

例如：确定使用 Excalidraw 作为白板框架

**需要更新**：
1. ✅ 创建 ADR：`.claude/decisions/004-whiteboard-excalidraw.md`
2. ✅ 更新 `.claude/README.md`：添加 ADR 004 链接
3. ✅ 更新 `.claude/context/tech-stack.md`：添加白板框架信息
4. ✅ 更新 `.claude/context/project-overview.md`：更新核心功能
5. ✅ 更新根 `README.md`：技术栈 + 路线图
6. ✅ 更新 `.claude/tasks/current-sprint.md`：标记任务完成
7. ✅ 创建技术调研文档：`docs/开源白板项目选型.md` 等
8. ✅ 更新 `docs/README.md`：添加新文档链接

---

### 场景 2: 添加了新的配置文件

例如：添加了 `turbo.json`

**需要更新**：
1. ✅ 更新根 `README.md`：在"项目结构"中添加 `turbo.json`
2. ✅ 创建说明文档：`docs/TURBOREPO.md`
3. ✅ 更新 `docs/README.md`：添加文档链接

---

### 场景 3: 完成一个开发任务

例如：完成了 Git 提交规范配置

**需要更新**：
1. ✅ 更新 `.claude/tasks/current-sprint.md`：任务状态改为已完成
2. ✅ 更新会话记录：记录完成的工作
3. ✅ 如果有新文件，更新根 `README.md` 的项目结构

---

### 场景 4: 创建产品需求文档

例如：创建了产品概述文档

**需要更新**：
1. ✅ 创建 `prds/产品概述.md`：详细产品规划
2. ✅ 更新 `prds/README.md`：添加文档链接
3. ✅ 更新 `.claude/README.md`：在产品文档部分添加链接
4. ✅ 更新根 `README.md`：
   - 项目结构：添加新的 PRD 文件
   - 项目状态：更新为"正在进行产品规划"
   - 路线图：添加产品规划相关任务
5. ✅ 更新 `.claude/context/project-overview.md`：如产品定位有重大变化
6. ✅ 更新 `.claude/tasks/current-sprint.md`：标记任务完成

---

## 文档模板

### ADR 模板
参考：`.claude/decisions/001-package-manager-pnpm.md`

必须包含：
- 状态（已接受/已废弃）
- 背景
- 决策
- 理由
- 影响
- 相关文档
- 参与者

### 技术调研文档模板
参考：`docs/开源白板项目选型.md`

建议包含：
- 项目概览（表格对比）
- 详细分析
- 选型建议
- 下一步行动
- 参考资源

---

## 特殊提醒

### 网络代理
访问 GitHub 等外网资源时，记得设置代理：
```bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7890
```

详见：[dev-environment.md](./dev-environment.md)

---

## 违反规则的后果

如果不及时更新文档：
- ❌ 文档与实际不符，误导开发
- ❌ 上下文丢失，需要重新理解项目
- ❌ 团队协作困难
- ❌ 无法追溯历史决策

---

## 更新记录
- 2026-01-14: 创建开发流程规范文档
- 2026-01-15: 添加 PRD 文档更新规则（场景 5）
- 2026-01-19: 添加 UI 设计成功案例（登录框视觉优化）⭐
