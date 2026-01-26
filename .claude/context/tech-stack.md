# 技术栈

> 当前状态：前端开发中

## 核心技术（已确定）

### 包管理器
**npm** - Node.js 默认包管理器
- 通用且简单，无需额外安装
- 生态系统成熟，兼容性好
- 适合单体项目

### 项目架构
**单体应用** - 简化的项目结构
- 前端 React 应用
- 未来规划后端服务
- 便于快速迭代和部署

### 语言和框架基础
- **前端**: React 19.2.3 + TypeScript 5.9.3
- **后端**: Node.js（规划中）
- **白板框架**: Excalidraw 0.18.0 (npm: @excalidraw/excalidraw)

### 前端（已确定）
- **构建工具**: Vite 7.3.1（已确定 - ADR 005）
- **框架**: React 19.2.3 + TypeScript 5.9.3（已确定）
- **路由**: React Router 7.12.0（已确定）
- **样式方案**:
  - Tailwind CSS v4（已确定 - ADR 005，ADR 007）
  - **新增**: Ant Design 5.22.5（企业级 UI 组件库）
- **组件库**:
  - DaisyUI 5.5.14（原版本 - 路由: `/`）
  - **新增**: Ant Design 5.22.5 + Ant Design X 1.1.1（新版本 - 路由: `/antd`）⭐
- **图标库**:
  - lucide-react 0.562.0（原版本）
  - **新增**: @ant-design/icons 5.5.3（新版本）
- **工具库**: clsx, tailwind-merge, class-variance-authority
- **状态管理**: 待按需引入（规划 Zustand）

### 开发工具
- **版本控制**: Git
- **AI 辅助开发**: Claude Code
- **图像处理**: sharp 0.34.5 - SVG 转 PNG
- **Favicon 生成**: to-ico 1.1.5 - 生成多分辨率 .ico 文件
- **主题设计**: DaisyUI Theme Generator - 可视化主题编辑器

### 构建和部署
- **构建输出**: ../shun-js/packages/aibaiban-server/static
- **CDN**: static-small.vincentqiao.com
- **环境区分**:
  - 开发环境：本地路径 (/)
  - 生产环境：CDN 路径
- **自动化**: 构建前自动清理输出目录 (emptyOutDir: true)

### PWA 支持
- **Manifest**: manifest.json - PWA 应用清单
- **图标资源**:
  - 192x192 PWA 图标
  - 512x512 PWA 图标
  - 180x180 Apple Touch Icon
  - 1200x1200 OG Image
  - 32x32、16x16 Favicon
- **SEO 优化**:
  - robots.txt
  - 完整 meta 标签
  - Open Graph 标签
  - Twitter Card 标签
  - 社交分享图片

### 品牌资产
- **Logo**: 蓝色长方形白板 + AI 字样
- **配色**: #2563EB (Primary Blue) + #FFFFFF (White)
- **尺寸**: 512x512px，框架 460x260px，文字 180px

## 待确定

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
- 大模型接入：OpenAI / Anthropic Claude / ...（待集成）
- **SimplifiedDiagram DSL**（已实现）
  - 简化的图表格式（nodes + connections）
  - 易于 AI 输出的 JSON 结构
  - 支持 3 种形状：rectangle, ellipse, diamond
  - 支持 6 种颜色：blue, green, purple, orange, red, gray
- **图表转换器**（已实现）
  - diagramConverter.ts - 将 SimplifiedDiagram 转换为 Excalidraw 元素
  - 自动布局算法（网格布局）
  - 颜色映射和样式生成
  - 必需字段自动补全

## 决策记录
参考根目录 [技术选型.md](../../../docs/技术选型.md) 和 [decisions](../decisions/) 目录

## 更新记录
- 2026-01-14: 创建技术栈文档
- 2026-01-14: 确定使用 pnpm 作为包管理器（已废弃）
- 2026-01-14: 确定使用 Excalidraw 作为白板框架
- 2026-01-15: 确定前端渲染方案 - CSR (Vite + React)
- 2026-01-16: 确定 UI 框架 - Tailwind CSS + shadcn/ui（已废弃）
- 2026-01-16: 确定使用 tweakcn.com 作为主题设计工具（已废弃）
- 2026-01-16: 完成前端框架搭建（Vite 7 + React 19 + TypeScript 5.9 + Tailwind v4 + shadcn/ui + React Router 7）
- 2026-01-19: 切换 UI 框架到 DaisyUI 5，更新主题设计工具
- 2026-01-19: 移除 Monorepo 结构，简化为单体应用
- 2026-01-20: 添加 Logo 设计和图标生成工具（sharp、to-ico）
- 2026-01-20: 完善 PWA 资源和 SEO 优化
- 2026-01-20: 配置 CDN 部署和环境区分
- 2026-01-20: 切换包管理器从 pnpm 到 npm
- 2026-01-21: 添加 SimplifiedDiagram DSL 和图表转换器（AI 生成图表功能）
- **2026-01-26**: 添加 Ant Design + Ant Design X 企业级 UI 版本⭐
  - 安装 antd 5.22.5, @ant-design/x 1.1.1, @ant-design/icons 5.5.3
  - 创建 LoginModalAntd, ChatPanelAntd, BoardAntd 组件
  - 企业级 AI 聊天体验（流式渲染、打字效果、圆形头像）
  - 完整的技术文档（架构分析、组件指南、迁移分析）
  - **已成为默认版本**（路由: `/`），原版本移至 `/legacy`
- **2026-01-26**: 优化 Ant Design 版本体验
  - 修复主题切换问题（深色模式完整支持）
  - 优化聊天消息显示（用户右侧、AI 左侧）
  - 添加圆形头像（Avatar 组件）
  - 简化初始状态（默认欢迎消息）
  - 修复自动滚动到底部
  - 统一头像背景色为蓝色

