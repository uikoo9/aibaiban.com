# ADR 006: 选择 Tailwind CSS + shadcn/ui 作为 UI 框架

## 状态
✅ 已接受 (2026-01-16)

## 背景

AI白板项目需要确定 UI 框架和组件库方案，主要考虑以下需求：
- **白板应用特点**：70% 是 Excalidraw 自带 UI，30% 是自定义 UI（导航栏 + AI 聊天面板）
- **定制化需求**：AI 聊天面板需要深度定制，不适合标准后台组件
- **开发效率**：需要快速开发 MVP，避免从零开始写 UI 组件
- **一致性**：需要与已确定的 Tailwind CSS 保持技术栈一致

## 决策

**采用 Tailwind CSS + shadcn/ui 组合**

### 技术栈

```typescript
// 核心 UI 方案
Tailwind CSS 3.x              // 样式基础（已在 ADR 005 确定）
shadcn/ui                     // 组件库（代码复制到项目）
Radix UI                      // 无障碍组件基础（shadcn 依赖）

// 工具库
class-variance-authority (cva) // 样式变体管理
clsx + tailwind-merge         // 类名合并工具

// AI 聊天面板相关
react-markdown                // Markdown 渲染（AI 消息）
react-syntax-highlighter      // 代码高亮（可选）
```

### 初期需要的组件

```bash
# 核心组件
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add scroll-area

# AI 聊天面板
npx shadcn@latest add avatar
npx shadcn@latest add card
npx shadcn@latest add skeleton

# 交互组件
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tooltip
npx shadcn@latest add toast
```

## 核心理由

### 1. shadcn/ui 的独特优势 ⭐⭐⭐

**不同于传统组件库的设计理念**：

| 特性 | 传统组件库 (Ant Design, MUI) | shadcn/ui |
|------|------------------------------|-----------|
| 安装方式 | npm 包依赖 | **复制源码到项目** |
| 定制性 | 需要覆盖样式，困难 | **直接修改源码，完全可控** |
| Bundle 大小 | 较大（即使 Tree Shaking） | **只有用到的组件** |
| 样式方案 | Less/CSS-in-JS | **Tailwind CSS** |
| 学习成本 | 需要学习组件 API | **标准 HTML + React** |
| 适用场景 | 标准后台系统 | **需要深度定制的项目** |

**关键特点**：
- ✅ 组件源码在 `components/ui/` 下，可随时修改
- ✅ 基于 Radix UI，无障碍性好
- ✅ 基于 Tailwind，与项目技术栈一致
- ✅ 按需安装，不会引入不必要的代码

---

### 2. 完美匹配项目需求 ⭐⭐⭐

**AI 白板 UI 构成分析**：

```
项目 UI 构成：
├── Excalidraw 白板区域（70%）
│   └── 自带完整 UI，无需额外组件
│
└── 自定义 UI 区域（30%）
    ├── 顶部导航栏（10%）
    │   ├── Logo
    │   ├── 标题输入框
    │   ├── 分享按钮
    │   └── 用户菜单
    │
    └── 右侧 AI 助手面板（20%）⭐ 核心定制区域
        ├── 对话气泡（需要定制样式）
        ├── 输入框（支持多行、快捷键）
        ├── 滚动容器（自动滚动到底部）
        ├── 加载状态（骨架屏、动画）
        └── AI 状态指示器
```

**为什么 shadcn/ui 适合**：
- ✅ AI 聊天面板需要深度定制（间距、颜色、动画），shadcn 源码可改
- ✅ 不是标准后台系统，不需要复杂的表格、表单、数据展示组件
- ✅ 只需要基础组件（Button、Input、Card、Avatar、ScrollArea）
- ✅ 可以轻松调整组件样式以匹配 Excalidraw 的手绘风格

---

### 3. 与技术栈完美兼容 ⭐⭐⭐

**ADR 005 已确定使用 Tailwind CSS**：
- ✅ shadcn/ui 基于 Tailwind，无需引入额外样式系统
- ✅ 统一的样式语言和工具链
- ✅ 主题定制在 `tailwind.config.js` 中统一管理
- ✅ 无 CSS-in-JS 运行时开销

**与 Excalidraw 的兼容性**：
- ✅ Excalidraw 不干涉外部样式
- ✅ Tailwind 基于类名，不会产生样式冲突
- ✅ 可以轻松为 AI 面板自定义主题

---

### 4. 开发效率高 ⭐⭐⭐

**快速上手**：
```bash
# 1. 初始化（自动配置 Tailwind）
npx shadcn@latest init

# 2. 按需添加组件
npx shadcn@latest add button

# 3. 直接使用
import { Button } from "@/components/ui/button"
```

**开发体验**：
- ✅ 组件开箱即用，样式已调好
- ✅ 需要定制时，直接改 `components/ui/button.tsx`
- ✅ 支持 TypeScript，类型安全
- ✅ 有完整的文档和示例

**与从零开始的对比**：
- ❌ 从零开始：需要写 Button、Input、Dialog... 所有基础组件（1-2 周）
- ✅ shadcn/ui：5 分钟安装，立即可用

---

### 5. 社区活跃，生态丰富 ⭐⭐

**数据**：
- ⭐ GitHub Stars: 80k+
- 📦 npm 周下载量: 15 万+（shadcn 命令行工具）
- 🔥 被大量项目采用（包括 Vercel、Supabase 等知名项目）

**生态优势**：
- ✅ 持续更新（每周都有新组件）
- ✅ 社区贡献活跃（有第三方扩展库）
- ✅ 丰富的文档和示例
- ✅ 容易找到问题解决方案

---

## 方案对比

### ❌ 为什么不选 Ant Design？

**不适合原因**：
```typescript
import { Button } from 'antd'  // 整个包 1MB+
import 'antd/dist/antd.css'    // 完整样式
```

- ❌ **设计风格**：偏后台系统，与白板创意工具不搭
- ❌ **Bundle 体积**：即使按需引入，仍然较大
- ❌ **定制困难**：需要覆盖大量样式变量
- ❌ **技术栈冲突**：使用 Less，需要额外配置
- ❌ **过度设计**：提供了大量用不到的组件（Table、Form、Upload...）

**结论**：Ant Design 适合企业后台系统，不适合 AI 白板这种需要轻量、定制化的创意工具。

---

### ❌ 为什么不选 Material-UI (MUI)？

```typescript
import { Button } from '@mui/material'  // 体积大
import { ThemeProvider } from '@mui/material/styles'
```

- ❌ **设计风格**：Material Design 风格强烈，与手绘白板不搭
- ❌ **Bundle 体积**：比 Ant Design 更大
- ❌ **样式方案**：使用 Emotion (CSS-in-JS)，运行时开销
- ❌ **学习成本**：主题系统复杂
- ❌ **技术栈不一致**：与 Tailwind 混用会很混乱

---

### ⚠️ 为什么不选 Headless UI？

```typescript
import { Dialog } from '@headlessui/react'  // 完全无样式
```

**优点**：
- ✅ 完全无样式，100% 可控
- ✅ 无障碍性好
- ✅ 体积小

**缺点**：
- ❌ **开发效率低**：需要从零写所有样式
- ❌ **无开箱即用的组件**：每个组件都要写 Tailwind 类
- ❌ **容易不一致**：不同开发者写的样式风格不一致

**结论**：Headless UI 适合有成熟设计系统的团队，对于 MVP 阶段开发效率太低。

---

### ⚠️ 为什么不选 Radix UI？

```typescript
import * as Dialog from '@radix-ui/react-dialog'
```

**说明**：
- shadcn/ui 本身就是基于 Radix UI 封装的
- Radix UI 是无样式的（类似 Headless UI）
- shadcn/ui = Radix UI + Tailwind CSS 样式

**结论**：直接用 Radix UI 开发效率低，shadcn/ui 已经帮我们做好了封装。

---

### ⚠️ 为什么不选 DaisyUI？

```typescript
<button className="btn btn-primary">Click</button>  // 预设类名
```

**优点**：
- ✅ 基于 Tailwind，兼容性好
- ✅ 开箱即用，有预设样式

**缺点**：
- ❌ **定制困难**：使用预设类名，不够灵活
- ❌ **代码不在项目中**：无法直接修改组件源码
- ❌ **React 支持不佳**：主要面向 HTML，不是 React 组件

**结论**：DaisyUI 适合简单项目，但对于需要深度定制的 AI 聊天面板不够灵活。

---

## 实施方案

### Phase 0: 主题设计（推荐先做）⭐

在初始化项目之前，先使用 **tweakcn.com** 设计主题：

**tweakcn.com** 是一个 shadcn/ui 主题可视化编辑器，提供：
- ✅ 实时预览主题效果
- ✅ 可视化调整颜色、圆角、间距、字体等
- ✅ 支持亮色/暗色模式同时配置
- ✅ 自动���成 Tailwind 配置代码
- ✅ 预览所有 shadcn/ui 组件效果

**使用步骤**：

```bash
# 1. 访问网站
https://tweakcn.com/

# 2. 设计主题
- 调整品牌主色（建议：蓝色/紫色系，专业且现代）
- 设置圆角（建议：0.5rem - 0.75rem，与 Excalidraw 协调）
- 选择字体（建议 Sans: Inter/Geist, Mono: JetBrains Mono）
- 配置亮色/暗色模式
- 实时预览 Button、Card、Input 等组件

# 3. 导出配置
- 复制生成的 CSS 变量定义
- 复制 tailwind.config.js 配置
- 保存到项目文档中

# 4. 应用到项目
- 在初始化时直接使用设计好的主题
```

**推荐主题风格**：
- 主色调：清新、专业（蓝色/紫色系）
- 圆角：中等圆角（8-12px），现代感强
- 字体：Inter（易读性好）+ JetBrains Mono（代码显���）

---

### Phase 1: 初始化（立即执行）

```bash
# 在前端项目中初始化
cd apps/web
npx shadcn@latest init
```

**配置建议**：
```
✔ Would you like to use TypeScript? › yes
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Where is your global CSS file? › src/index.css
✔ Would you like to use CSS variables for colors? › yes
✔ Where is your tailwind.config.js located? › tailwind.config.js
✔ Configure the import alias for components: › @/components
✔ Configure the import alias for utils: › @/lib/utils
```

---

### Phase 2: 安装核心组件（第 1 周）

```bash
# 基础组件
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add textarea

# AI 聊天面板核心组件
npx shadcn@latest add scroll-area  # 聊天滚动容器
npx shadcn@latest add avatar       # 用户/AI 头像
npx shadcn@latest add card         # 消息气泡
npx shadcn@latest add skeleton     # 加载状态
```

---

### Phase 3: 安装交互组件（第 2 周）

```bash
# 弹窗和提示
npx shadcn@latest add dialog       # 设置弹窗
npx shadcn@latest add tooltip      # 工具提示
npx shadcn@latest add toast        # 通知提示

# 导航和菜单
npx shadcn@latest add dropdown-menu
```

---

### Phase 4: 按需扩展（后续）

```bash
# 如果需要
npx shadcn@latest add tabs         # 标签页
npx shadcn@latest add select       # 下拉选择
npx shadcn@latest add popover      # 弹出层
npx shadcn@latest add badge        # 徽章
npx shadcn@latest add separator    # 分隔线
```

---

## 主题配置

### 品牌色定义

```typescript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        // AI 白板品牌色（待设计确定）
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // 主色
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      }
    }
  }
}
```

### 暗色模式支持（可选）

```typescript
// 使用 CSS 变量，支持亮色/暗色切换
// shadcn/ui 初始化时会自动配置
```

---

## 代码示例

### AI 聊天面板实现

```typescript
// apps/web/src/components/AIPanel.tsx
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AIPanel() {
  return (
    <div className="flex flex-col h-full border-l">
      {/* 标题栏 */}
      <div className="p-4 border-b">
        <h2 className="font-semibold">AI 助手</h2>
      </div>

      {/* 聊天历史 */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* AI 消息 */}
          <div className="flex gap-3">
            <Avatar>
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <Card className="flex-1 p-3">
              <p className="text-sm">我可以帮你生成流程图、思维导图...</p>
            </Card>
          </div>

          {/* 用户消息 */}
          <div className="flex gap-3 flex-row-reverse">
            <Avatar>
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
            <Card className="flex-1 p-3 bg-primary text-primary-foreground">
              <p className="text-sm">帮我画一个登录流程图</p>
            </Card>
          </div>

          {/* 加载状态 */}
          <div className="flex gap-3">
            <Avatar>
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <Card className="flex-1 p-3">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          </div>
        </div>
      </ScrollArea>

      {/* 输入框 */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            placeholder="描述你的需求..."
            className="resize-none min-h-[60px]"
          />
          <Button size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
```

### 自定义修改示例

```typescript
// 如果需要定制 Button 样式
// 直接修改 components/ui/button.tsx

import { cn } from "@/lib/utils"

export function Button({ className, variant = "default", ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md...",
        // 添加自定义样式
        variant === "ai" && "bg-gradient-to-r from-blue-500 to-purple-500",
        className
      )}
      {...props}
    />
  )
}

// 使用
<Button variant="ai">AI 生成</Button>
```

---

## 影响

### 积极影响

1. **快速开发 MVP** ⭐⭐⭐
   - 无需从零编写基础组件
   - 开发周期缩短 1-2 周
   - 专注业务逻辑而非 UI 细节

2. **完全可控** ⭐⭐⭐
   - 组件源码在项目中，随时可改
   - 不受第三方库更新影响
   - 可以针对 AI 聊天面板深度定制

3. **技术栈统一** ⭐⭐⭐
   - 与 Tailwind CSS 完美配合
   - 无额外样式系统
   - 降低学习成本

4. **Bundle 体积小** ⭐⭐
   - 只包含用到的组件
   - 无运行时 CSS-in-JS 开销
   - 首屏加载更快

5. **无障碍性好** ⭐⭐
   - 基于 Radix UI，符合 WAI-ARIA 标准
   - 键盘导航支持
   - 屏幕阅读器友好

### 需要注意

1. **组件数量有限**
   - 风险：不是所有组件都有（如复杂的 DatePicker、Table）
   - 缓解：基础组件足够，复杂组件可以自己封装或引入专门的库

2. **需要手动更新**
   - 风险：shadcn 更新后，需要手动同步组件代码
   - 缓解：更新频率低，可以按需更新

3. **初次学习成本**
   - 风险：需要理解 Radix UI + Tailwind 的组合方式
   - 缓解：文档完善，社区资源丰富

---

## 下一步行动

### 立即执行
- [ ] 在 `apps/web` 中初始化 shadcn/ui
- [ ] 安装核心组件（button, input, textarea, scroll-area）
- [ ] 配置主题颜色（品牌色）
- [ ] 创建 AI 聊天面板基础布局

### 短期（1-2 周）
- [ ] 安装 AI 聊天面板所需组件（avatar, card, skeleton）
- [ ] 实现聊天消息渲染
- [ ] 实现输入框和发送功能
- [ ] 添加加载状态和骨架屏

### 中期（1 个月）
- [ ] 安装交互组件（dialog, tooltip, toast）
- [ ] 实现设置弹窗
- [ ] 添加通知提示
- [ ] 优化 AI 面板交互体验

---

## 参考资源

- [shadcn/ui 官网](https://ui.shadcn.com/)
- [Radix UI 文档](https://www.radix-ui.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [class-variance-authority](https://cva.style/docs)

---

## 相关决策

- [ADR 001: 选择 pnpm](./001-package-manager-pnpm.md)
- [ADR 002: 选择 Turborepo](./002-build-tool-turborepo.md)
- [ADR 003: Git 提交规范](./003-git-commit-convention.md)
- [ADR 004: 选择 Excalidraw](./004-whiteboard-excalidraw.md)
- [ADR 005: 选择 CSR (Vite + React)](./005-frontend-rendering-csr.md)

---

## 参与者

- Vincent (项目负责人)
- Claude Code (AI 辅助开发)
