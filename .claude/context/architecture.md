# 架构设计

> 当前状态：初步设计中

## 系统架构概览

### 整体架构
```
┌─────────────────────────────────────────────────┐
│                  用户浏览器                      │
│  ┌─────────────────────────────────────────┐   │
│  │  前端应用 (React SPA)                    │   │
│  │  - Vite + React + TypeScript             │   │
│  │  - Tailwind CSS + DaisyUI                │   │
│  │  - React Router                          │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
           │                    │
           │ HTTP/WebSocket     │ HTTP
           ▼                    ▼
┌──────────────────┐    ┌──────────────────┐
│   后端 API        │    │   AI 服务         │
│  (待定义)         │    │  (待定义)         │
│                  │    │                  │
└──────────────────┘    └──────────────────┘
           │
           ▼
┌──────────────────┐
│   数据库          │
│  (待定义)         │
│                  │
└──────────────────┘
```

## 前端架构

### 技术栈
- **构建工具**: Vite 7.x
- **框架**: React 19.2.3 + TypeScript 5.9.3
- **路由**: React Router 7.12.0
- **样式**: Tailwind CSS v4 + DaisyUI 5
- **状态管理**: 待按需引入（规划 Zustand）

### 目录结构
```
src/
├── main.tsx           # 应用入口
├── App.tsx            # 根组件（路由配置）
├── index.css          # 全局样式（Tailwind CSS 导入）
├── pages/             # 页面组件
│   └── Board.tsx      # 白板页面（主页面，三栏布局）
├── components/        # UI 组件
│   ├── Auth/         # 认证组件
│   │   └── LoginModal.tsx  # 登录模态框
│   ├── Chat/         # 聊天面板组件
│   │   ├── ChatPanel.tsx    # AI 助手面板
│   │   └── MessageBubble.tsx # 消息气泡
│   ├── Whiteboard.tsx        # 白板核心组件
│   └── ThemeSwitcher.tsx     # 主题切换器
├── hooks/            # 自定义 Hooks
│   ├── useAuth.tsx   # 认证状态管理（Context API）
│   └── useChat.ts    # 聊天功能
├── services/         # API 服务层
│   ├── api.ts        # 基础 API 封装（fetch wrapper）
│   └── auth.ts       # 认证 API（短信、登录）
├── types/            # TypeScript 类型定义
│   ├── auth.ts       # 用户、登录相关类型
│   ├── chat.ts       # 聊天消息类型
│   ├── api.ts        # API 响应类型
│   └── diagram.ts    # 图表类型（SimplifiedDiagram）
├── utils/            # 工具函数
│   └── diagramConverter.ts  # 图表格式转换器（SimplifiedDiagram → Excalidraw）
└── ...
```

### 页面布局架构（当前实现）
```
┌─────────────────────────────────────────────┐
│ Header (h-16)                               │
│  [Logo] AI白板  [AI生成] [登录] [主题] [GitHub] │
├─────────────────────────────────────────────┤
│ Main Content (flex-1)                       │
│  ┌──────────────────┬────────────────────┐ │
│  │                  │                    │ │
│  │  Canvas Area     │  AI Panel          │ │
│  │  (flex-1)        │  (可调整宽度)      │ │
│  │                  │  280px-600px       │ │
│  │  Excalidraw      │  - 标题栏 (h-14)   │ │
│  │                  │  - 消息列表        │ │
│  │                  │  - 输入框          │ │
│  │                  │                    │ │
│  └──────────────────┴────────────────────┘ │
│       ↑ 可拖动分隔条（resize handle）       │
└─────────────────────────────────────────────┘
```

### 路由设计（MVP）
- `/` - 主页面（白板）
- `/board/:id` - 分享的白板（后续实现）

### 设计原则
- **极简导航**：顶部栏占用最小空间（56px）
- **打开即用**：无需登录即可开始绘图（游客模式）
- **渐进式功能**：核心功能优先，高级功能按需加载

## 后端架构

### 技术栈（待定义）
- **框架**: Express / Fastify / NestJS
- **API 风格**: RESTful / GraphQL / tRPC
- **数据库**: 待定义
- **实时协作**: WebSocket / Socket.io

## 白板集成架构

### Excalidraw 集成方案
- **包**: @excalidraw/excalidraw
- **集成方式**: React 组件
- **主题**: 适配 shadcn/ui 主题系统
- **AI 集成点**:
  - onChange 监听（获取画布数据）
  - 自定义 UI（添加 AI 按钮）
  - API 注入（AI 生成元素）

## 数据流

### 用户绘图流程
```
用户操作
  ↓
Excalidraw onChange
  ↓
本地状态更新
  ↓
WebSocket 广播（实时协作）
  ↓
后端保存（定期）
```

### AI 辅助流程（已实现）
```
用户点击"AI 生成"按钮
  ↓
显示演示模态框
  ↓
模拟 AI 返回 SimplifiedDiagram (JSON)
  {
    type: "architecture",
    title: "App 架构图",
    nodes: [{id, label, type, color}, ...],
    connections: [{from, to, label}, ...]
  }
  ↓
diagramConverter.convertDiagramToExcalidraw()
  - 自动布局（网格布局，150px 间距）
  - 颜色映射（6 种预定义颜色）
  - 生成 Excalidraw 元素（形状、文字、箭头）
  - 自动补全必需字段
  ↓
whiteboard.addAIGeneratedDiagram(elements)
  ↓
Excalidraw updateScene() 渲染到白板
```

**下一步**: 集成真实 AI API (Claude/GPT-4)
- 用户在聊天面板输入需求
- 发送到后端 AI 服务
- AI 返回 SimplifiedDiagram JSON
- 自动渲染到白板

## 模块划分

### 前端模块
- **白板模块**：Excalidraw 集成和操作
  - Whiteboard.tsx（forwardRef 暴露 API）
  - addRandomShape()（测试方法）
  - addAIGeneratedDiagram()（AI 生成图表）
- **AI 模块**：AI 聊天和生成功能
  - ChatPanel（聊天面板，Mock AI 回复）
  - SimplifiedDiagram DSL（简化的图表格式）
  - diagramConverter（格式转换器）
- **认证模块**：用户登录和状态管理
  - LoginModal（手机号 + 验证码）
  - useAuth Hook（Context API）
  - 真实 API 集成
- **协作模块**：实时同步和多人协作（待实现）
- **用户模块**：个人中心（待实现）

### 后端模块（待定义）
- **API 模块**：RESTful API
- **AI 模块**：AI 模型调用和数据处理
- **协作模块**：WebSocket 实时通信
- **存储模块**：白板数据存储和管理

## 关键设计决策
参考 [decisions](../decisions/) 目录：
- ADR 001：包管理器选择 - pnpm
- ADR 002：构建工具选择 - Turborepo
- ADR 003：Git 提交规范
- ADR 004：白板框架选择 - Excalidraw
- ADR 005：前端渲染方案 - CSR (Vite + React)
- ADR 006：UI 框架选择 - Tailwind CSS + shadcn/ui (已废弃)
- ADR 007：UI 框架切换 - Tailwind CSS + DaisyUI

## 更新记录
- 2026-01-14: 创建架构文档
- 2026-01-16: 补充前端架构设计（Vite + React + Tailwind + shadcn/ui）
- 2026-01-16: 补充页面布局架构和路由设计
- 2026-01-19: 切换 UI 框架到 DaisyUI，更新技术栈
- 2026-01-21: 更新目录结构（新增 types/diagram.ts、utils/diagramConverter.ts、services/、hooks/）
- 2026-01-21: 更新 AI 辅助流程（SimplifiedDiagram DSL + 自动转换器实现）
- 2026-01-21: 更新页面布局（可拖动调整聊天面板宽度）
- 2026-01-21: 更新模块划分（补充白板 API、AI 图表生成、认证模块详情）
