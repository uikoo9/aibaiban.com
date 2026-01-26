# AI 白板项目 - Claude Code 协作指南

> 该文件由 Claude Code 自动加载，包含项目核心信息和设计规范。

## 快速导航

### ⭐ Ant Design 版本（默认，推荐）
**当前默认版本 - 企业级 UI 体验**：
- **访问路由**: `/` (默认入口)
- **主要文档**:
  - [新版本说明](./antd/README-NEW-VERSION.md) ⭐ 完整功能介绍和优化记录
  - [Ant Design 架构分析](./antd/ant-design-architecture-analysis.md) - 深度技术分析
  - [Ant Design X 组件指南](./antd/antd-x-guide.md) - AI 组件完整指南
  - [迁移可行性分析](./antd/migration-analysis.md) - 技术选型依据

### 📦 DaisyUI 版本（备份）
**原版本 - 保留为备份**：
- **访问路由**: `/legacy`
- **主要文档**:
  - [UI/UX 设计指南](./docs/ui-ux-design-guide.md) - 核心设计原则、色彩系统、间距规范
  - [DaisyUI 组件文档](./docs/daisyui.md) - 组件用法和最佳实践
  - [开发流程规范](./.claude/context/development-workflow.md) - UI 开发检查清单

### 重要：在开发 UI 组件时
- **新功能开发**: 推荐使用 Ant Design 版本
- **原版本维护**: 参考 DaisyUI 设计规范文档

---

## 项目上下文

### 项目简介
- **项目名称**: AI 白板 ([aibaiban.com](https://aibaiban.com/))
- **项目定位**: AI 驱动的在线协作白板工具
- **当前阶段**: 前端框架已完成，正在实现 AI 功能

### 技术栈
- **前端框架**: React 19.2.3 + TypeScript 5.9.3 + Vite 7.3.1
- **样式系统**:
  - 原版本: Tailwind CSS v4 + DaisyUI 5
  - 新版本 (推���): Ant Design 5.22.5 + Ant Design X 1.1.1
- **白板框架**: Excalidraw 0.18.0
- **构建工具**: npm 10.28.0
- **路由**: React Router 7.12.0

### 核心文档
- [项目概述](./.claude/context/project-overview.md)
- [技术栈详情](./.claude/context/tech-stack.md)
- [架构设计](./.claude/context/architecture.md)
- [产品需求](./prds/README.md)
- [Excalidraw 绘图指南](./docs/excalidraw-drawing-guide.md) ⭐ 必读：白板绘图核心机制

---

## UI 开发规范 (重要)

### 开发新组件时的必读顺序
1. ✅ [设计规范](./docs/ui-ux-design-guide.md) - 了解设计原则
2. ✅ [DaisyUI 文档](./docs/daisyui.md) - 查看组件用法
3. ✅ [开发流程](./.claude/context/development-workflow.md) - 遵循检查清单

### 设计原则速查

#### 间距系统（8px 网格）
- **内边距**: 8px (p-2), 16px (p-4), 20px (p-5), 24px (p-6), 32px (p-8), 40px (p-10)
- **字段间距**: 16px (space-y-4), 20px (space-y-5), 24px (space-y-6)
- **圆角**: 8px (rounded-lg), 16px (rounded-2xl)

#### 字号系统
| 元素 | Tailwind Class | 尺寸 | 使用场景 |
|------|---------------|------|---------|
| 标题 | `text-2xl` | 24px | 对话框标题 |
| 标签 | `text-[15px]` | 15px | 表单标签（自定义） |
| 输入/按钮 | `text-base` | 16px | 输入框、按钮文字 |
| 副标题 | `text-sm` | 14px | 辅助说明文字 |
| 提示 | `text-xs` | 12px | 错误提示、标签小文字 |

#### 色彩系统
```css
/* Primary Colors */
--primary: #2563EB       /* Trust Blue - 主要 CTA、图标 */
--success: #22C55E       /* Green - 成功状态 */
--error: #EF4444         /* Red - 错误状态 */
--warning: #F59E0B       /* Amber - 警告 */

/* Background & Text */
--background: #F8FAFC    /* Off-white - 背景 */
--text: #1E293B          /* Dark Grey - 文本 */
--border: #E2E8F0        /* Light Grey - 边框 */
```

#### 组件尺寸规范
| 组件 | DaisyUI Class | 高度 | 说明 |
|------|--------------|------|------|
| 大输入框 | `input-lg` | 48px | 移动端友好的触摸目标 |
| 大按钮 | `btn-lg` | 48px | 与输入框保持一致 |
| 触摸目标 | - | ≥44px | WCAG 标准（推荐 48px） |
| 图标容器 | `w-16 h-16` | 64px | 视觉焦点，传达品质感 |

#### 透明度层次
- **100%**: 主要内容
- **60%**: 副标题、辅助文字 (`text-base-content/60`)
- **20%**: 按钮阴影 (`shadow-primary/20`)
- **10%**: 图标背景 (`bg-primary/10`)
- **5%**: 渐变装饰 (`from-primary/5`)

### 常用 DaisyUI 组件

#### Modal（弹窗）
```tsx
// ✅ 使用 HTML5 <dialog> 元素
<dialog ref={dialogRef} className="modal">
  <div className="modal-box max-w-md p-0">
    {/* 头部区域 */}
    <div className="bg-gradient-to-b from-primary/5 to-transparent px-8 pt-10 pb-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          {/* 图标 SVG */}
        </div>
        <h2 className="text-2xl font-bold text-base-content mb-2">标题</h2>
        <p className="text-sm text-base-content/60">副标题</p>
      </div>
    </div>

    {/* 内容区域 */}
    <div className="px-8 py-6">
      {/* 表单内容 */}
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
<div className="form-control">
  <label className="label pb-2">
    <span className="label-text text-[15px] font-semibold">标签</span>
    <span className="label-text-alt text-error text-xs">必填</span>
  </label>
  <input
    className="input input-bordered input-lg w-full text-base"
    placeholder="占位符"
  />
</div>
```

#### Join（组合元素 - 验证码场景）
```tsx
<div className="join w-full">
  <input className="input input-bordered input-lg join-item flex-1" />
  <button className="btn btn-neutral btn-lg join-item">发送验证码</button>
</div>
```

#### Button（主按钮）
```tsx
<button className="btn btn-primary btn-lg w-full text-base font-semibold shadow-lg shadow-primary/20">
  立即登录
</button>
```

#### Alert（警告提示）
```tsx
<div role="alert" className="alert alert-error">
  <svg className="w-5 h-5">{/* 图标 */}</svg>
  <span>错误信息</span>
</div>
```

### 可访问性要点
- ✅ 颜色对比度最小 4.5:1（WCAG AA 标准）
- ✅ 触摸目标最小 44x44px（推荐 48px）
- ✅ 所有输入框都有可见标签（不要仅用 placeholder）
- ✅ 错误消息添加 `role="alert"`
- ✅ 焦点状态清晰可见（`focus:ring-2`）
- ✅ 支持键盘导航（Tab 顺序匹配视觉顺序）

---

## 项目组织结构

```
.claude/                       # Claude Code 协作记录
  ├── context/                # 项目上下文文档
  │   ├── project-overview.md # 项目概述
  │   ├── tech-stack.md       # 技术栈详情
  │   ├── architecture.md     # 架构设计
  │   └── development-workflow.md # 开发流程和规范 ⭐
  ├── decisions/              # 架构决策记录 (ADR)
  └── sessions/               # 开发会话记录

antd/                          # Ant Design 新版本文档 🆕
  ├── README-NEW-VERSION.md   # 新版本使用说明 ⭐
  ├── ant-design-architecture-analysis.md  # Ant Design 架构分析
  ├── antd-x-guide.md         # Ant Design X 组件指南
  └── migration-analysis.md   # 迁移可行性分析

docs/                          # 技术文档
  ├── ui-ux-design-guide.md   # UI/UX 设计规范 ⭐ 必读
  ├── daisyui.md              # DaisyUI 组件文档 ⭐ 必读
  ├── Excalidraw集成方案.md   # 白板集成方案
  ├── 前端渲染方案选型.md      # 技术选型文档
  └── ...其他技术文档

prds/                          # 产品需求文档
  ├── README.md               # PRD 索引
  ├── 产品概述.md
  └── ...其他 PRD

src/                           # 前端应用源码
  ├── components/             # React 组件
  │   ├── Auth/              # 认证组件
  │   │   ├── LoginModal.tsx       # DaisyUI 登录弹窗（原版本）
  │   │   └── LoginModalAntd.tsx   # Ant Design 登录弹窗 🆕
  │   ├── Chat/              # 聊天面板组件
  │   │   ├── ChatPanel.tsx        # DaisyUI 聊天面板（原版本）
  │   │   ├── ChatPanelAntd.tsx    # Ant Design X 聊天面板 🆕
  │   │   └── MessageBubble.tsx    # 消息气泡
  │   ├── Whiteboard.tsx     # 白板核心组件
  │   └── ThemeSwitcher.tsx  # 主题切换器
  ├── pages/                  # 页面组件
  │   ├── Board.tsx          # 白板主页面（原版本，路由: /）
  │   └── BoardAntd.tsx      # 白板主页面 Ant Design 版 🆕（路由: /antd）
  ├── hooks/                  # 自定义 Hooks
  │   ├── useAuth.tsx        # 认证状态管理
  │   └── useChat.ts         # 聊天功能
  ├── services/               # API 服务层
  │   ├── api.ts             # 基础 API 封装
  │   └── auth.ts            # 认证 API
  ├── types/                  # TypeScript 类型定义
  │   ├── auth.ts            # 认证类型
  │   ├── chat.ts            # 聊天类型
  │   ├── api.ts             # API 响应类型
  │   └── diagram.ts         # 图表类型（SimplifiedDiagram）
  └── utils/                  # 工具函数
      └── diagramConverter.ts # 图表格式转换器

public/                        # 静态资源
package.json                   # 项目配置
vite.config.ts                # Vite 构建配置
```

---

## 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器 (http://localhost:5173)

# 构建
npm run build        # 生产构建

# 代码检查
npm run lint         # 代码检查（待配置）
npm run test         # 单元测试（待配置）

# Git
git status           # 查看状态
git add .            # 暂存所有更改
git commit -m "type: description"  # 遵循 Conventional Commits
git log --oneline -5 # 查看最近 5 条提交记录
```

---

## 开发流程规范

### UI 组件开发流程
1. ✅ **阅读设计规范**：查看 `docs/ui-ux-design-guide.md`
2. ✅ **查看组件文档**：查看 `docs/daisyui.md` 中对应组件
3. ✅ **参考成功案例**：查看 `.claude/context/development-workflow.md` 中的案例
4. ✅ **编写代码**：遵循设计系统和可访问性规范
5. ✅ **测试组件**：视觉检查 + 键盘导航 + 响应式

### 文档同步规则
**每次项目有实质性更新时，必须同步更新相关文档**。详见：[开发流程规范](./.claude/context/development-workflow.md#文档同步规则-重要)

### Excalidraw 白板开发 ⭐
**重要**：开发白板相关功能时，必须先阅读 [Excalidraw 绘图指南](./docs/excalidraw-drawing-guide.md)

**核心要点**：
1. **文字元素必需字段**：
   ```typescript
   {
     lineHeight: 1.25 as any,    // ← 必须！fontFamily 1 对应的行高
     originalText: text,         // ← 必须！原始文本
     autoResize: true,           // ← 必须！自动调整大小
   }
   ```

2. **容器绑定**（文字跟随形状）：
   ```typescript
   // 文字绑定到容器
   textElement.containerId = shapeId;

   // 容器引用文字
   shapeElement.boundElements = [{ type: 'text', id: textId }];
   ```

3. **支持的形状类型**：
   - ✅ rectangle、ellipse、diamond
   - ❌ cylinder、hexagon、cloud（需映射到支持的类型）

完整文档：[docs/excalidraw-drawing-guide.md](./docs/excalidraw-drawing-guide.md)

### 不要主动启动后台任务
- ❌ 不要主动运行 `npm run dev`
- ❌ 不要使用 `run_in_background: true`
- ✅ 只在用户明确要求时才启动服务

---

## 重要提醒

### Git 提交规范
遵循 Conventional Commits：
```bash
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式（不影响功能）
refactor: 重构
test: 测试相关
chore: 构建/工具配置
```

### 网络代理（如需访问外网）
```bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7890
```

详见：[开发环境配置](./.claude/context/dev-environment.md)

---

## 项目特定的 Slash Commands

项目中已配置以下自定义命令（如果可用）：
- `/init` - 初始化 CLAUDE.md 文档
- `/pr-comments` - 获取 GitHub PR 评论
- `/review` - 审查 PR
- `/security-review` - 安全审查

---

## 快速参考卡片

### 标准模态框头部（带图标装饰）
```tsx
<div className="bg-gradient-to-b from-primary/5 to-transparent px-8 pt-10 pb-8">
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
      {/* 图标 SVG - 使用 w-8 h-8 */}
    </div>
    <h2 className="text-2xl font-bold text-base-content mb-2">标题</h2>
    <p className="text-sm text-base-content/60">副标题说明</p>
  </div>
</div>
```

### 标准表单字段
```tsx
<div className="form-control">
  <label className="label pb-2">
    <span className="label-text text-[15px] font-semibold">字段标签</span>
    <span className="label-text-alt text-error text-xs">必填</span>
  </label>
  <input
    className="input input-bordered input-lg w-full text-base"
    placeholder="请输入..."
  />
</div>
```

### 标准主按钮
```tsx
<button className="btn btn-primary btn-lg w-full text-base font-semibold shadow-lg shadow-primary/20">
  按钮文字
</button>
```

---

## 🆕 Ant Design 新版本

### 概述

项目现已支持基于 **Ant Design + Ant Design X** 的企业级 UI 实现，提供更专业的 AI 聊天体验。

### 访问方式

```bash
# 开发环境
http://localhost:5173/antd

# 原版本（DaisyUI）
http://localhost:5173/
```

### 核心特性

1. **企业级 AI 聊天**
   - `Bubble.List`: 专业消息列表，支持流式渲染、打字效果
   - `Sender`: 企业级输入框，自动大小调整
   - `Welcome` + `Prompts`: 精美的欢迎页和快速提示

2. **完整的表单体验**
   - `Form` 组件: 自动验证、错误提示
   - `Modal`: 企业级弹窗设计
   - 更好的可访问性（WCAG 2.0 AA）

3. **统一的设计语言**
   - 基于 Ant Design 设计规范
   - 一致的间距、圆角、颜色
   - 完整的 TypeScript 支持

### 组件对照

| 功能 | 原版本（DaisyUI） | 新版本（Ant Design） |
|------|------------------|---------------------|
| 登录弹窗 | `LoginModal.tsx` | `LoginModalAntd.tsx` |
| 聊天面板 | `ChatPanel.tsx` | `ChatPanelAntd.tsx` |
| 主页面 | `Board.tsx` (路由: `/`) | `BoardAntd.tsx` (路由: `/antd`) |

### 技术文档

- [新版本说明](./antd/README-NEW-VERSION.md) - 使用指南和功能介绍
- [Ant Design 架构分析](./antd/ant-design-architecture-analysis.md) - 深度技术分析
- [Ant Design X 组件指南](./antd/antd-x-guide.md) - AI 组件完整指南
- [迁移可行性分析](./antd/migration-analysis.md) - 为什么选择 antd + antd-x

### 依赖信息

```json
{
  "dependencies": {
    "antd": "^5.22.5",
    "@ant-design/x": "^1.1.1",
    "@ant-design/icons": "^5.5.3"
  }
}
```

### 优势对比

✅ **新版本优势**：
- 更专业的 AI 聊天体验
- 流式渲染、打字效果内置支持
- 企业级代码质量和社区支持
- 更好的可访问性和国际化

⚠️ **注意事项**：
- 包体积较大（~500KB gzipped）
- 需要同时安装 antd 和 antd-x
- antd-x 依赖 antd，不能单独使用

---

**最后更新**: 2026-01-26
**维护者**: Claude Code
**版本**: 1.1.0
