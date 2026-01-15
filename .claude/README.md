# AI白板项目开发记录

这个文件夹记录了与 Claude Code 的开发协作过程，包含项目上下文、架构决策和会话记录。

## 快速导航

### 📋 项目上下文
- [项目概述](./context/project-overview.md) - 项目目标、核心功能和愿景
- [技术栈](./context/tech-stack.md) - 技术选型和依赖
- [架构设计](./context/architecture.md) - 系统架构和设计模式
- [开发环境配置](./context/dev-environment.md) - 网络代理等环境设置
- [开发流程规范](./context/development-workflow.md) - ⚠️ 重要：文档同步规则

### 📦 产品文档
- [产品需求文档 (PRDs)](../prds/README.md) - 产品规划和功能需求
- [产品概述](../prds/产品概述.md) - 产品定位、目标用户、核心价值

### 🎯 架构决策记录 (ADR)
- [ADR 001: 选择 pnpm 作为包管理器](./decisions/001-package-manager-pnpm.md) ✅
- [ADR 002: 选择 Turborepo 作为构建工具](./decisions/002-build-tool-turborepo.md) ✅
- [ADR 003: Git 提交规范](./decisions/003-git-commit-convention.md) ✅
- [ADR 004: 选择 Excalidraw 作为白板框架](./decisions/004-whiteboard-excalidraw.md) ✅

### 💬 开发会话
- [2026-01-14 项目初始化](./sessions/2026-01/14-project-init.md)
- [2026-01-15 产品规划](./sessions/2026-01/15-product-planning.md)

### ✅ 任务管理
- [当前 Sprint](./tasks/current-sprint.md)

## 使用说明

### 对于开发者
每次与 Claude Code 开始新会话时，可以引导其先阅读 `context/` 目录下的文件来快速了解项目状态。

**⚠️ 重要**: 请务必阅读 [development-workflow.md](./context/development-workflow.md)，了解文档同步规则。

### 文件组织规则
- **context/**: 项目核心信息，需要持续更新
- **decisions/**: 重要的技术决策，使用编号前缀（001, 002...）
- **sessions/**: 按年月分组的开发会话记录
- **tasks/**: 当前和未来的任务规划

**⚠️ 文档同步规则**: 每次项目有实质性更新时，必须同步更新相关文档。详见 [development-workflow.md](./context/development-workflow.md)。

## 更新日志
- 2026-01-14: 创建项目协作记录结构
- 2026-01-14: 确定包管理器为 pnpm（ADR 001）
- 2026-01-14: 创建项目 README 和技术选型文档
- 2026-01-14: 初始化 pnpm Monorepo
- 2026-01-14: 安装并配置 Turborepo（ADR 002）
- 2026-01-14: 配置 Git 提交规范（ADR 003）
- 2026-01-14: 选择 Excalidraw 作为白板框架（ADR 004）
- 2026-01-15: 创建产品文档结构（prds/）
- 2026-01-15: 创建产品概述文档
