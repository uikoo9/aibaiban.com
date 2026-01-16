# ADR 005: 选择 CSR (Vite + React) 作为前端渲染方案

## 状态
✅ 已接受 (2026-01-15)

## 背景

AI白板项目需要确定前端渲染方案，主要考虑三种方案：
- **CSR** (Client-Side Rendering) - 客户端渲染
- **SSR** (Server-Side Rendering) - 服务端渲染
- **PWA** (Progressive Web App) - 渐进式 Web 应用

需要根据产品特性、技术兼容性、开发成本等因素做出选择。

## 决策

**MVP 阶段采用纯 CSR 方案**，技术栈为：
- **Vite 5.x** - 构建工具
- **React 18.x** - UI 框架
- **TypeScript 5.x** - 类型系统
- **React Router 6.x** - 路由管理
- **Zustand** - 状态管理
- **Tailwind CSS** - 样式方案
- **@excalidraw/excalidraw** - 白板核心

**部署方案**: Vercel 免费托管

## 核心理由

### 1. 产品特性决定不需要 SSR ⭐

**AI白板是工具类应用，不是内容展示类应用**：

| 特性 | 说明 | 对渲染方案的影响 |
|------|------|------------------|
| 工具类应用 | 白板绘图工具，非内容展示 | ❌ 不需要 SEO |
| 高交互性 | 大量实时绘图、拖拽、缩放 | ✅ 需要流畅的客户端渲染 |
| Excalidraw 集成 | 基于纯客户端库 | ❌ SSR 集成困难 |
| AI 实时对话 | 右侧聊天面板实时交互 | ✅ 需要 WebSocket/SSE |

**用户使用场景**：
- 用户直接访问 aibaiban.com 开始绘图
- 不会通过搜索引擎搜索"画流程图"找到我们
- 主要通过直接访问、口碑传播、分享链接获客

**结论**: SEO 需求极低，SSR 的核心优势（SEO 友好）对本产品价值不大。

---

### 2. Excalidraw 完美兼容 CSR ⭐⭐⭐

**Excalidraw 本身就是纯客户端库**：
- ✅ 设计为在浏览器中运行
- ✅ 依赖大量浏览器 API (Canvas、DOM 操作)
- ✅ 无需服务端渲染

**如果使用 SSR (Next.js)**：
- ❌ 需要使用 `'use client'` 标记
- ❌ 失去 SSR 的核心优势
- ❌ 增加复杂度，但没有收益
- ❌ Hydration 可能出现问题

**结论**: CSR 与 Excalidraw 天然兼容，无集成障碍。

---

### 3. 开发速度快，成本低 ⭐⭐⭐

**CSR 优势**：
- ✅ 开发简单，无需考虑服务端/客户端差异
- ✅ 部署方便，静态文件托管（Vercel/Netlify）
- ✅ 零服务器成本（Vercel 免费额度足够）
- ✅ 自动 CI/CD，Git Push 即部署

**SSR 劣势**：
- ❌ 需要 Node.js 服务器（成本 + 运维）
- ❌ 开发复杂度高
- ❌ 调试困难（服务端/客户端双环境）

**MVP 阶段优先级**: 快速验证产品价值 > 首屏性能优化

**结论**: CSR 能让我们在 2-4 周内完成 MVP，SSR 可能需要 4-6 周。

---

## 方案评分对比

### 评分维度

| 维度 | 权重 | CSR | SSR | PWA | 说明 |
|------|------|-----|-----|-----|------|
| **开发速度** | ⭐⭐⭐ | 9 | 5 | 7 | MVP 需要快速迭代 |
| **部署成本** | ⭐⭐⭐ | 9 | 4 | 8 | 初期预算有限 |
| **用户体验** | ⭐⭐⭐ | 8 | 7 | 9 | 流畅度和离线能力 |
| **SEO 需求** | ⭐ | 3 | 9 | 3 | 工具类应用不依赖 SEO |
| **技术兼容** | ⭐⭐⭐ | 10 | 4 | 9 | Excalidraw 兼容性 |
| **可扩展性** | ⭐⭐ | 8 | 8 | 8 | 后续功能扩展 |

### 加权总分

- **CSR**: (9×3 + 9×3 + 8×3 + 3×1 + 10×3 + 8×2) / 15 = **8.3**
- **SSR**: (5×3 + 4×3 + 7×3 + 9×1 + 4×3 + 8×2) / 15 = **5.9**
- **PWA**: (7×3 + 8×3 + 9×3 + 3×1 + 9×3 + 8×2) / 15 = **8.1**

**结论**: CSR 在当前阶段得分最高，最适合 MVP。

---

## 为什么不选 SSR？

虽然 SSR 有首屏快、SEO 友好等优势，但对 AI白板 来说：

### 1. SEO 价值低
- ❌ 工具类应用，用户不会搜索"画流程图"找到我们
- ❌ 主要通过直接访问、口碑传播获客
- ❌ SSR 的核心优势（SEO）对本产品价值不大

### 2. Excalidraw 集成困难
- ❌ Excalidraw 是纯客户端库，依赖浏览器 API
- ❌ 在 Next.js 中需要使用 `'use client'`，失去 SSR 优势
- ❌ Hydration 可能出现问题（服务端/客户端不一致）

### 3. 开发和运维成本高
- ❌ 需要 Node.js 服务器（Vercel Serverless 或自建）
- ❌ 开发复杂度高（需要考虑服务端/客户端差异）
- ❌ 调试困难（双环境问题）

### 4. 首屏性能可通过优化达到可接受水平
- ✅ 代码分割（React.lazy）
- ✅ 路由懒加载
- ✅ CDN 加速 + Gzip/Brotli 压缩
- ✅ 骨架屏提升感知性能

**结论**: SSR 的优势对 AI白板 价值不大，反而增加复杂度和成本。

---

## 为什么不选 PWA（MVP 阶段）？

PWA 得分 8.1，仅次于 CSR (8.3)，但 MVP 阶段不选择的原因：

### 1. 增加开发复杂度
- ⚠️ 需要配置 Service Worker
- ⚠️ 需要设计离线策略
- ⚠️ 调试复杂（Service Worker 缓存问题）

### 2. 浏览器兼容性问题
- ⚠️ Safari 支持有限（iOS 用户受影响）
- ⚠️ 部分功能需要 HTTPS

### 3. MVP 阶段优先级不高
- 离线使用是加分项，不是必需品
- 用户可以接受在线使用
- 可以在成长阶段（3-6 个月后）添加

**渐进式策略**:
- **MVP 阶段**: 纯 CSR，快速验证
- **成长阶段**: CSR + PWA，添加离线能力
- **成熟阶段**: 混合方案（Landing SSR + App CSR）

---

## 演进路径

### Phase 1: MVP 阶段（0-3 个月）- 纯 CSR

**技术栈**:
```
Vite 5.x + React 18.x + TypeScript 5.x
React Router 6.x
Zustand (状态管理)
Tailwind CSS
@excalidraw/excalidraw
```

**部署**: Vercel 免费托管

**优化策略**:
- 代码分割（React.lazy）
- 路由懒加载
- CDN 加速
- Gzip/Brotli 压缩
- 骨架屏

**目标**: 首屏加载 < 2 秒

---

### Phase 2: 成长阶段（3-12 个月）- CSR + PWA

**触发条件**:
- 用户反馈需要离线使用
- 移动端用户占比 > 30%
- 有预算投入 PWA 开发

**新增功能**:
- ✅ 离线使用（Service Worker）
- ✅ 桌面安装（Manifest）
- ✅ 推送通知（协作提醒）
- ✅ 后台同步（离线编辑同步）

**实现方式**:
```bash
pnpm add -D vite-plugin-pwa
```

---

### Phase 3: 成熟阶段（1 年后）- 混合方案

**触发条件**:
- 需要 SEO 流量
- 需要 Landing Page 营销
- 分享链接预览很重要

**架构方案**:
```
aibaiban.com (Landing Page - Next.js SSR)
    ↓
app.aibaiban.com (白板应用 - Vite CSR)
```

或使用 Next.js App Router:
```
/                    → SSR (Landing Page)
/about              → SSR
/pricing            → SSR
/app                → CSR ('use client')
/app/board/[id]     → CSR
```

---

## 影响

### 积极影响

1. **快速上线** ⭐⭐⭐
   - 开发周期：2-4 周
   - 无需考虑服务端/客户端差异
   - 专注核心功能开发

2. **零服务器成本** ⭐⭐⭐
   - Vercel 免费托管
   - 无需维护 Node.js 服务器
   - 自动 CI/CD

3. **技术兼容性好** ⭐⭐⭐
   - Excalidraw 完美兼容
   - 无 Hydration 问题
   - 开发体验流畅

4. **部署简单** ⭐⭐⭐
   - 静态文件托管
   - Git Push 自动部署
   - 全球 CDN 加速

5. **易于扩展** ⭐⭐
   - 后续可添加 PWA
   - 可迁移到混合方案
   - 技术债务低

### 需要注意

1. **首屏加载时间**
   - 风险：JS Bundle 较大，首屏加载可能 > 2 秒
   - 缓解：代码分割、懒加载、CDN 加速、骨架屏

2. **SEO 缺失**
   - 风险：搜索引擎难以抓取
   - 缓解：工具类应用不依赖 SEO，通过其他渠道获客

3. **分享链接预览**
   - 风险：分享链接无法生成 OG 图片预览
   - 缓解：使用预渲染方案或 OG 图片服务

---

## 下一步行动

### 立即执行（本周）

- [ ] 初始化 Vite + React + TypeScript 项目
- [ ] 配置 React Router
- [ ] 配置 Tailwind CSS
- [ ] 配置 ESLint + Prettier
- [ ] 集成 Excalidraw
- [ ] 配置 Vercel 部署
- [ ] 实现基础页面结构（顶部导航 + 白板画布 + 右侧 AI 面板）

### 短期优化（1-2 周）

- [ ] 实现代码分割和懒加载
- [ ] 添加骨架屏
- [ ] 配置 CDN 加速
- [ ] 性能测试和优化
- [ ] 首屏加载时间优化到 < 2 秒

### 中期规划（3-6 个月）

- [ ] 评估 PWA 需求
- [ ] 如果需要，添加 Service Worker
- [ ] 实现离线功能
- [ ] 添加桌面安装支持

---

## 参考资源

- [前端渲染方案选型](../../docs/前端渲染方案选型.md) - 详细的 CSR/SSR/PWA 对比分析
- [产品概述](../../prds/产品概述.md) - 产品定位和页面结构设计
- [白板页面设计](../../prds/白板页面设计.md) - 页面布局和 AI 助手面板设计
- [Vite 官方文档](https://vitejs.dev/)
- [React 官方文档](https://react.dev/)
- [Vercel 部署文档](https://vercel.com/docs)

---

## 相关决策

- [ADR 001: 选择 pnpm](./001-package-manager-pnpm.md)
- [ADR 002: 选择 Turborepo](./002-build-tool-turborepo.md)
- [ADR 003: Git 提交规范](./003-git-commit-convention.md)
- [ADR 004: 选择 Excalidraw](./004-whiteboard-excalidraw.md)

---

## 参与者

- Vincent (项目负责人)
- Claude Code (AI 辅助开发)

