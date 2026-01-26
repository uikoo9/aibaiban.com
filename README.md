# AI白板 ([aibaiban.com](https://aibaiban.com/))

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
- **包管理器**: npm - Node.js 默认包管理器，通用且简单
- **构建工具**: Vite 7.3.1 - 快速的开发服务器和构建工具
- **白板框架**: Excalidraw 0.18.0 - 丰富素材库，手绘风格，MIT 协议
- **前端框架**: React 19.2.3 + TypeScript 5.9.3
- **样式方案**: Tailwind CSS v4 + Ant Design 6.2.1 - 企业级 UI 组件库
- **AI 组件**: Ant Design X 2.1.3 - AI 场景专用组件
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
│   │       ├── 14-project-init.md
│   │       ├── 15-product-planning.md
│   │       ├── 16-frontend-setup.md
│   │       ├── 19-chat-panel.md
│   │       └── 20-lighthouse-optimization.md
│   └── tasks/                        # 任务管理
│       └── current-sprint.md
├── src/                              # 源代码目录
│   ├── main.tsx                      # 应用入口
│   ├── App.tsx                       # 根组件（路由配置）
│   ├── index.css                     # 全局样式
│   ├── pages/
│   │   └── BoardAntd.tsx              # 白板主页面（Ant Design 版本）
│   ├── components/
│   │   ├── Whiteboard.tsx            # Excalidraw 集成组件
│   │   ├── Auth/
│   │   │   └── LoginModalAntd.tsx    # 登录弹窗（Ant Design）
│   │   └── Chat/
│   │       └── ChatPanelAntd.tsx     # AI 聊天面板（Ant Design X）
│   ├── hooks/
│   │   ├── useChat.ts                # 聊天逻辑 Hook
│   │   └── useAuth.tsx               # 认证逻辑 Hook（Context API）
│   ├── services/
│   │   ├── api.ts                    # 基础 API 封装
│   │   └── auth.ts                   # 认证 API（短信、登录）
│   ├── types/
│   │   ├── chat.ts                   # 聊天类型定义
│   │   ├── auth.ts                   # 认证类型定义
│   │   ├── api.ts                    # API 响应类型
│   │   └── diagram.ts                # 图表类型（SimplifiedDiagram）
│   └── utils/
│       └── diagramConverter.ts       # 图表格式转换器
├── public/                           # 静态资源目录
│   ├── logo.svg                      # 项目 Logo
│   ├── favicon.ico                   # 网站图标
│   ├── icon-192.png                  # PWA 图标 (192x192)
│   ├── icon-512.png                  # PWA 图标 (512x512)
│   ├── apple-touch-icon.png          # iOS 主屏图标
│   ├── og-image.png                  # 社交分享图片
│   ├── manifest.json                 # PWA 清单
│   └── robots.txt                    # 搜索引擎规则
├── scripts/                          # 构建脚本
│   ├── generate-icons.js             # PNG 图标生成脚本
│   └── generate-favicon.js           # Favicon 生成脚本
├── prds/                             # 产品需求文档
│   ├── README.md                     # PRD 文档索引
│   ├── PRD模板.md                    # PRD 文档模板
│   └── 产品概述.md                   # 产品定位和规划
├── docs/                             # 技术文档
│   ├── README.md                     # 文档索引
│   ├── excalidraw-drawing-guide.md  # ⭐ Excalidraw 绘图核心机制（必读）
│   ├── AI白板产品竞品调研.md         # 竞品分析
│   ├── 技术选型.md                   # 技术选型分析
│   ├── 开源白板项目选型.md           # 白板框架对比
│   ├── 白板素材库对比.md             # 素材库深度对比
│   ├── Excalidraw集成方案.md        # Excalidraw 引入方案
│   └── GIT_COMMIT_GUIDELINES.md     # Git 提交规范
├── .gitignore                        # Git 忽略文件
├── .husky/                           # Git hooks
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

### 开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 预览构建结果
npm run preview

# 生成图标
npm run generate-icons
```

访问 http://localhost:3000 查看应用

## 开发协作

本项目采用 AI 辅助开发模式，所有开发过程记录在 `.claude/` 目录：

- **上下文管理**: 查看 `.claude/context/` 了解项目最新状态
- **决策记录**: 重要技术决策记录在 `.claude/decisions/`
- **会话历史**: 开发过程详细记录在 `.claude/sessions/`
- **开发规范**: ⚠️ **重要** - 查看 `.claude/context/development-workflow.md` 了解文档同步规则
- **��板开发**: ⭐ **必读** - 开发白板功能前阅读 `docs/excalidraw-drawing-guide.md`

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

🟢 **开发阶段** - 前端基础框架已完成，AI 图表生成功能已完整实现并与聊天集成

### 已完成
- ✅ 项目 Logo 设计（蓝色长方形白板 + AI 字样）
- ✅ PWA 资源完善（manifest.json、robots.txt、各尺寸图标）
- ✅ 图标生成自动化（SVG→PNG、favicon.ico）
- ✅ Lighthouse 审计优化（SEO、无障碍、性能）
- ✅ 构建配置优化（环境区分、自动清理）
- ✅ Excalidraw 白板集成（支持主题切换、本地存储）
- ✅ Ant Design 企业级 UI 组件库集成
- ✅ Ant Design X AI 聊天组件集成（Bubble.List、Sender）
- ✅ 手机号 + 验证码登录（真实 API 集成）
- ✅ AI 聊天面板 UI（真实 API 集成，流式输出）
- ✅ AI 意图识别（绘图 vs 非绘图请求）
- ✅ 流式对话体验（逐字显示，4 种随机拒绝话术）
- ✅ 聊天加载状态优化（立即显示，自动聚焦）
- ✅ 登录状态持久化
- ✅ 消息历史本地存储
- ✅ Header 品牌展示（Logo + 域名）
- ✅ 白板代码调用功能（forwardRef API）
- ✅ AI 生成图表功能（SimplifiedDiagram DSL + 自动转换器）
- ✅ AI 图表生成与聊天完整集成（/intent + /draw API）
- ✅ Excalidraw 文字渲染问题修复（必需字段 + 容器绑定）
- ✅ Excalidraw 绘图指南文档（基于源码分析）
- ✅ 智能箭头连接算法（自动选择最佳边）
- ✅ 聊天面板可拖动调整宽度（280px-600px）
- ✅ 按用户ID隔离数据（白板和聊天记录）
- ✅ 主题切换支持（浅色/深色模式）

## 路线图

### 基础设施
- [x] 创建项目结构
- [x] 确定包管理器 (pnpm)
- [x] 确定白板框架 (Excalidraw)
- [x] 确定前端渲染方案 (Vite + React)
- [x] 确定 UI 框架 (Tailwind CSS + Ant Design)
- [x] 创建产品文档结构 (prds/)
- [x] 搭建前端项目框架
- [x] 集成 Excalidraw 白板
- [x] 实现主题切换功能（浅色/深色）
- [x] 简化项目结构（移除 Monorepo）
- [x] 设计项目 Logo 和品牌视觉
- [x] 完善 PWA 资源和 SEO
- [x] 优化构建配置和工作流
- [x] 集成 Ant Design 和 Ant Design X
- [ ] 确定后端框架

### 产品规划
- [x] 创建产品概述文档
- [x] 确定 MVP 功能范围
- [x] 开发 AI 聊天面板 UI（已集成真实 API）
- [x] 开发登录功能 UI（已集成真实 API）
- [x] 实现 AI 意图识别（绘图 vs 非绘图）
- [x] 实现第一个 AI 功能（AI 生成图表演示）
- [x] 将 AI 生成图表功能与聊天集成
- [x] 创建 Excalidraw 绘图指南文档
- [x] 实现按用户ID隔离数据
- [x] 使用 Ant Design 重构 UI（替代 DaisyUI）
- [ ] 设计核心用户流程
- [ ] 细化功能 PRD

### 开发实现
- [x] 搭建前端基础框架
- [x] 集成 Excalidraw
- [x] 开发 AI 聊天面板（已集成真实 API）
- [x] 开发登录功能（已集成真实 API）
- [x] 实现 AI 意图识别和流式对话
- [x] 实现白板代码调用功能（forwardRef 暴露 API）
- [x] 实现 AI 生成图表功能（SimplifiedDiagram DSL）
- [x] 实现聊天面板可拖动调整宽度
- [x] 将 AI 生成图表功能与聊天集成
- [x] 修复 Excalidraw 文字渲染问题
- [x] 实现智能箭头连接算法
- [x] 实现按用户ID隔离数据（白板和聊天记录）
- [x] 使用 Ant Design 重构 UI（替代 DaisyUI）
- [ ] 实现实时协作

## 许可证

MIT

## 联系方式

待补充

---

**Built with AI, Powered by Imagination** 🚀
