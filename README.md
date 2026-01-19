# AI白板 (aibaiban.com)

> 一个完全由 AI 构建的智能白板协作平台

## 项目简介

AI白板是一个基于人工智能的在线协作白板工具，致力于提供智能化、直观的视觉协作体验。

### 特色亮点

- **AI 原生构建** - 整个项目从代码到设计完全由 AI 完成
  - 💻 代码开发：Claude Code
  - 🎨 设计实现：nanobanana
  - 🤖 更多 AI 工具：待探索...

- **智能协作** - 融合 AI 能力的白板体验（具体功能规划中）

## 技术栈

### 已确定
- **包管理器**: pnpm 10.28.0 - 快速且节省磁盘空间
- **构建工具**: Vite 7.3.1 - 快速的开发服务器和构建工具
- **白板框架**: Excalidraw 0.18.0 - 丰富素材库，手绘风格，MIT 协议
- **前端框架**: React 19.2.3 + TypeScript 5.9.3
- **样式方案**: Tailwind CSS v4 + DaisyUI 5 - 预设主题，开箱即用
- **路由**: React Router 7.12.0
- **后端**: Node.js - JavaScript 全栈开发（待实现）

### 规划中
- 状态管理：Zustand (待定)
- 后端框架：Express / Fastify / NestJS (待定)
- 数据库方案 (待定)
- AI 集成方案 (待定)
- 部署方案 (待定)

详见 [技术选型.md](./docs/技术选型.md) 和 [开源白板项目选型.md](./docs/开源白板项目选型.md)

## 项目结构

```
aibaiban.com/
├── .claude/                          # AI 协作记录
│   ├── README.md                     # 协作记录索引
│   ├── context/                      # 项目上下文
│   │   ├── project-overview.md      # 项目概述
│   │   ├── tech-stack.md            # 技术栈详情
│   │   ├── architecture.md          # 架构设计
│   │   ├── development-workflow.md  # 开发流程规范
│   │   └── dev-environment.md       # 开发环境配置
│   ├── decisions/                    # 架构决策记录 (ADR)
│   │   ├── 001-package-manager-pnpm.md
│   │   ├── 003-git-commit-convention.md
│   │   ├── 004-whiteboard-excalidraw.md
│   │   ├── 005-frontend-rendering-csr.md
│   │   └── 006-ui-framework-tailwind-shadcn.md
│   ├── sessions/                     # 开发会话记录
│   │   └── 2026-01/
│   └── tasks/                        # 任务管理
│       └── current-sprint.md
├── src/                              # 源代码目录
│   ├── main.tsx                      # 应用入口
│   ├── App.tsx                       # 根组件（路由配置）
│   ├── index.css                     # 全局样式
│   ├── pages/
│   │   └── Board.tsx                 # 白板主页面
│   ├── components/
│   │   ├── Whiteboard.tsx            # Excalidraw 集成组件
│   │   ├── ThemeSwitcher.tsx         # 主题切换组件
│   │   ├── Auth/
│   │   │   └── LoginModal.tsx        # 登录弹窗
│   │   └── Chat/
│   │       ├── ChatPanel.tsx         # AI 聊天面板
│   │       └── MessageBubble.tsx     # 消息气泡组件
│   ├── hooks/
│   │   ├── useChat.ts                # 聊天逻辑 Hook
│   │   └── useAuth.ts                # 认证逻辑 Hook
│   ├── types/
│   │   ├── chat.ts                   # 聊天类型定义
│   │   └── auth.ts                   # 认证类型定义
│   └── lib/
│       └── utils.ts                  # 工具函数
├── prds/                             # 产品需求文档
│   ├── README.md                     # PRD 文档索引
│   ├── PRD模板.md                    # PRD 文档模板
│   └── 产品概述.md                   # 产品定位和规划
├── docs/                             # 技术文档
│   ├── README.md                     # 文档索引
│   ├── AI白板产品竞品调研.md         # 竞品分析
│   ├── 技术选型.md                   # 技术选型分析
│   ├── 开源白板项目选型.md           # 白板框架对比
│   ├── 白板素材库对比.md             # 素材库深度对比
│   ├── Excalidraw集成方案.md        # Excalidraw 引入方案
│   ├── ui-ux-design-guide.md        # UI/UX 设计规范
│   ├── daisyui.md                   # DaisyUI 组件文档
│   └── GIT_COMMIT_GUIDELINES.md     # Git 提交规范
├── .gitignore                        # Git 忽略文件
���── .husky/                           # Git hooks
│   └── commit-msg                    # Commit 消息检查
├── commitlint.config.js              # Commitlint 配置
├── package.json                      # 项目配置
├── tsconfig.json                     # TypeScript 配置
├── vite.config.ts                    # Vite 配置
├── postcss.config.js                 # PostCSS 配置
├── index.html                        # HTML 入口
└── README.md                         # 本文件
```

## 快速开始

### 前置要求
- Node.js >= 18
- pnpm >= 8

### 安装 pnpm
```bash
npm install -g pnpm
```

### 开发
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建项目
pnpm build

# 预览构建结果
pnpm preview
```

访问 http://localhost:3000 查看应用

## 开发协作

本项目采用 AI 辅助开发模式，所有开发过程记录在 `.claude/` 目录：

- **上下文管理**: 查看 `.claude/context/` 了解项目最新状态
- **决策记录**: 重要技术决策记录在 `.claude/decisions/`
- **会话历史**: 开发过程详细记录在 `.claude/sessions/`
- **开发规范**: ⚠️ **重要** - 查看 `.claude/context/development-workflow.md` 了解文档同步规则

### Git 提交规范

本项目使用约定式提交（Conventional Commits）规范，通过 commitlint 自动检查。

**提交格式**：`<type>(<scope>): <subject>`

**常用类型**：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 其他变更

**示例**：
```bash
git commit -m "feat: 添加白板绘图功能"
git commit -m "fix: 修复登录状态问题"
git commit -m "docs: 更新开发文档"
```

详见 [Git 提交规范](./docs/GIT_COMMIT_GUIDELINES.md)

## 项目状态

🟢 **开发阶段** - 前端基础框架已完成，手机号登录和 AI 聊天面板已实现

### 已完成
- ✅ Excalidraw 白板集成（支持主题切换、本地存储）
- ✅ DaisyUI 主题系统（37 个预设主题）
- ✅ AI 聊天面板 UI（Mock 数据版本）
- ✅ 手机号 + 验证码登录（Mock UI）
- ✅ 登录状态持久化
- ✅ 消息历史本地存储
- ✅ UI/UX 设计规范文档

## 路线图

### 基础设施
- [x] 创建项目结构
- [x] 确定包管理器 (pnpm)
- [x] 确定白板框架 (Excalidraw)
- [x] 确定前端渲染方案 (Vite + React)
- [x] 确定 UI 框架 (Tailwind CSS + DaisyUI)
- [x] 创建产品文档结构 (prds/)
- [x] 搭建前端项目框架
- [x] 集成 Excalidraw 白板
- [x] 实现主题切换功能
- [x] 简化项目结构（移除 Monorepo）
- [ ] 确定后端框架

### 产品规划
- [x] 创建产品概述文档
- [x] 确定 MVP 功能范围
- [x] 开发 AI 聊天面板 UI（Mock 版本）
- [x] 开发登录功能 UI（Mock 版本）
- [ ] 集成真实 AI API
- [ ] 集成真实登录后端
- [ ] 设计核心用户流程
- [ ] 细化功能 PRD

### 开发实现
- [x] 搭建前端基础框架
- [x] 集成 Excalidraw
- [x] 开发 AI 聊天面板 Mock 版本
- [x] 开发登录功能 Mock 版本
- [ ] 集成真实 AI API (OpenAI/Claude)
- [ ] 实现第一个 AI 功能（生成流程图）
- [ ] 实现实时协作

## 许可证

MIT

## 联系方式

待补充

---

**Built with AI, Powered by Imagination** 🚀
