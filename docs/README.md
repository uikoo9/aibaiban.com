# 项目文档

本目录包含 AI 白板项目的各类文档。

## 📚 文档列表

### 产品与设计
- [AI白板产品竞品调研.md](./AI白板产品竞品调研.md) - 市场竞品分析和功能对比

### 技术文档
- [技术选型.md](./技术选型.md) - 技术栈选择的详细分析和对比
- [前端渲染方案选型.md](./前端渲染方案选型.md) - CSR/SSR/PWA 方案对比与决策
- [TURBOREPO.md](./TURBOREPO.md) - Turborepo 构建工具使用指南
- [开源白板项目选型.md](./开源白板项目选型.md) - 白板框架对比
- [白板素材库对比.md](./白板素材库对比.md) - Excalidraw vs tldraw 素材库
- [Excalidraw集成方案.md](./Excalidraw集成方案.md) - Excalidraw 引入方案分析

### 开发规范
- [GIT_COMMIT_GUIDELINES.md](./GIT_COMMIT_GUIDELINES.md) - Git 提交信息规范

## 📋 架构决策记录 (ADR)

重要的技术决策记录在 [.claude/decisions/](../.claude/decisions/) 目录：
- [ADR 001: 包管理器选择](../.claude/decisions/001-package-manager-pnpm.md)
- [ADR 002: 构建工具选择](../.claude/decisions/002-build-tool-turborepo.md)
- [ADR 003: Git 提交规范](../.claude/decisions/003-git-commit-convention.md)
- [ADR 004: 白板框架选择](../.claude/decisions/004-whiteboard-excalidraw.md)
- [ADR 005: 前端渲染方案](../.claude/decisions/005-frontend-rendering-csr.md)
- [ADR 006: UI 框架选择](../.claude/decisions/006-ui-framework-tailwind-shadcn.md)

## 🔄 开发会话记录

AI 协作开发的详细过程记录在 [.claude/sessions/](../.claude/sessions/) 目录。

## 📝 贡献文档

如需添加新文档，请遵循以下规范：
1. 使用清晰的中文文件名
2. 包含明确的文档目的和更新日期
3. 使用 Markdown 格式
4. 重要决策需创建对应的 ADR
