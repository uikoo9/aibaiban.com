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
- **包管理器**: pnpm - 为 Monorepo 优化，快速且节省磁盘空间
- **构建工具**: Turborepo - 增量构建和智能缓存
- **白板框架**: Excalidraw - 丰富素材库，手绘风格，MIT 协议
- **前端**: React - 熟悉的组件化开发体验
- **后端**: Node.js - JavaScript 全栈开发
- **项目架构**: Monorepo - 统一管理前后端代码

### 规划中
- 前端框架：Next.js / Vite + React (待定)
- 后端框架：Express / Fastify / NestJS (待定)
- 数据库方案 (待定)
- AI 集成方案 (待定)
- 部署方案 (待定)

详见 [技术选型.md](./docs/技术选型.md)、[TURBOREPO.md](./docs/TURBOREPO.md) 和 [开源白板项目选型.md](./docs/开源白板项目选型.md)

## 项目结构

```
aibaiban.com/
├── .claude/                          # AI 协作记录
│   ├── README.md                     # 协作记录索引
│   ├── context/                      # 项目上下文
│   │   ├── project-overview.md      # 项目概述
│   │   ├── tech-stack.md            # 技术栈详情
│   │   ├── architecture.md          # 架构设计
│   │   └── dev-environment.md       # 开发环境配置
│   ├── decisions/                    # 架构决策记录 (ADR)
│   │   ├── 001-package-manager-pnpm.md
│   │   ├── 002-build-tool-turborepo.md
│   │   ├── 003-git-commit-convention.md
│   │   └── 004-whiteboard-excalidraw.md
│   ├── sessions/                     # 开发会话记录
│   │   └── 2026-01/
│   │       └── 14-project-init.md
│   └── tasks/                        # 任务管理
│       └── current-sprint.md
├── packages/                         # Monorepo 包目录
│   ├── web/                          # 前端应用
│   │   ├── package.json
│   │   └── README.md
│   ├── server/                       # 后端服务
│   │   ├── package.json
│   │   └── README.md
│   └── shared/                       # 共享代码
│       ├── package.json
│       └── README.md
├── prds/                             # 产品需求文档
│   ├── README.md                     # PRD 文档索引
│   ├── PRD模板.md                    # PRD 文档模板
│   └── 产品概述.md                   # 产品定位和规划
├── docs/                             # 技术文档
│   ├── README.md                     # 文档索引
│   ├── AI白板产品竞品调研.md         # 竞品分析
│   ├── 技术选型.md                   # 技术选型分析
│   ├── TURBOREPO.md                  # Turborepo 使用指南
│   ├── 开源白板项目选型.md           # 白板框架对比
│   ├── 白板素材库对比.md             # 素材库深度对比
│   ├── Excalidraw集成方案.md        # Excalidraw 引入方案
│   └── GIT_COMMIT_GUIDELINES.md     # Git 提交规范
├── .gitignore                        # Git 忽略文件
├── .husky/                           # Git hooks
│   └── commit-msg                    # Commit 消息检查
├── commitlint.config.js              # Commitlint 配置
├── package.json                      # 根 package.json
├── pnpm-workspace.yaml               # pnpm workspace 配置
├── turbo.json                        # Turborepo 配置
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

# 启动所有包的开发环境
pnpm dev

# 仅启动前端
pnpm --filter @aibaiban/web dev

# 仅启动后端
pnpm --filter @aibaiban/server dev

# 构建所有包
pnpm build
```

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
git commit -m "fix(server): 修复 API 认证问题"
git commit -m "docs: 更新开发文档"
```

详见 [Git 提交规范](./docs/GIT_COMMIT_GUIDELINES.md)

## 项目状态

🟡 **初始阶段** - 已完成技术选型，正在进行产品规划

## 路线图

### 基础设施
- [x] 创建项目结构
- [x] 确定包管理器 (pnpm)
- [x] 初始化 pnpm Monorepo
- [x] 安装并配置 Turborepo
- [x] 确定白板框架 (Excalidraw)
- [x] 创建产品文档结构 (prds/)
- [ ] 确定前后端框架
- [ ] 搭建项目骨架

### 产品规划
- [x] 创建产品概述文档
- [ ] 确定 MVP 功能范围
- [ ] 设计核心用户流程
- [ ] 细化功能 PRD

### 开发实现
- [ ] 集成 Excalidraw
- [ ] 实现第一个 AI 功能
- [ ] 实现核心白板功能
- [ ] 实现实时协作

## 许可证

MIT

## 联系方式

待补充

---

**Built with AI, Powered by Imagination** 🚀
