# 技术栈

> 当前状态：规划中

## 核心技术（已确定）

### 包管理器
**pnpm** - Performant npm
- 为 Monorepo 优化设计
- 安装速度比 npm 快 2-3 倍
- 通过硬链接大幅节省磁盘空间
- 严格的依赖管理，避免幽灵依赖
- 被 Vue 3、Vite、Microsoft 等大型项目使用

### 项目架构
**Monorepo** - 单一代码仓库管理多个包
- 前后端代码统一管理
- 便于共享组件和工具
- 简化依赖管理和版本控制

### 构建工具
**Turborepo** - 高性能 Monorepo 构建系统
- 智能缓存：基于内容哈希，永不重复构建
- 并行执行：充分利��多核 CPU
- 增量构建：只构建改变的部分
- 实测性能：缓存命中时速度提升 20 倍+
- 配置简单，与 pnpm 完美集成

### 语言和框架基础
- **前端**: React
- **后端**: Node.js
- **白板框架**: Excalidraw (npm: @excalidraw/excalidraw)

## 待确定

### 前端
- 框架：Next.js / Vite + React
- 状态管理：待定
- UI 组件库：待定

### 白板相关
- ✅ 核心框架：Excalidraw（已确定）
- 素材库：使用 Excalidraw 官方素材库
- AI 集成点：onChange 监听、自定义 UI、API 注入

### 后端
- 框架：Express / Fastify / NestJS
- API 风格：RESTful / GraphQL / tRPC

### 数据库
待定义...

### AI 集成
- 大模型接入：OpenAI / Anthropic Claude / ...
- AI 功能：待规划

### 部署方案
待定义...

## 开发工具
- **版本控制**: Git
- **AI 辅助开发**: Claude Code
- **AI 设计**: nanobanana（规划中）

## 决策记录
参考根目录 [技术选型.md](../../../docs/技术选型.md) 和 [decisions](../decisions/) 目录

## 更新记录
- 2026-01-14: 创建技术栈文档
- 2026-01-14: 确定使用 pnpm 作为包管理器，Monorepo 架构
- 2026-01-14: 确定使用 Turborepo 作为构建工具
- 2026-01-14: 确定使用 Excalidraw 作为白板框架
