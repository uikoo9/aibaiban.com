# ADR 002: 选择 Turborepo 作为 Monorepo 构建工具

## 状态
✅ 已接受 (2026-01-14)

## 背景
项目采用 pnpm Monorepo 架构，包含前端、后端和共享代码三个包。需要一个高效的构建工具来：
- 管理多包之间的构建依赖
- 提升构建速度
- 支持增量构建和缓存
- 简化开发流程

候选方案：
- **Turborepo** - Vercel 开发的现代 Monorepo 构建工具
- **Nx** - Nrwl 开发的企业级 Monorepo 工具
- **Lerna** - 传统 Monorepo 管理工具
- **原生 pnpm workspaces** - 仅使用 pnpm 的 workspace 功能

## 决策
选择 **Turborepo** 作为项目的 Monorepo 构建工具。

## 理由

### 为什么选择 Turborepo？

1. **极致性能**
   - 智能缓存：基于内容哈希，永不重复构建
   - 并行执行：充分利用多核 CPU
   - 增量构建：只构建改变的部分
   - 实测：缓存命中时速度提升 20 倍+（379ms → 18ms）

2. **配置简单**
   - 零配置即可使用
   - `turbo.json` 配置直观易懂
   - 与 pnpm 完美集成
   - 学习曲线平缓

3. **开发体验优秀**
   - TUI 模式：美观的终端界面
   - 自动任务编排：处理包之间的依赖关系
   - 详细的执行日志和统计信息
   - 支持 `--graph` 可视化任务依赖

4. **生态和未来**
   - Vercel 官方维护，更新活跃
   - Next.js、SvelteKit 等框架推荐使用
   - 社区活跃，文档完善
   - 支持远程缓存（可选）

5. **轻量级**
   - 仅 2MB+ 的安装大小
   - 不侵入项目结构
   - 不强制特定的项目组织方式

### 为什么不选 Nx？
- 功能更强大但配置复杂
- 学习曲线陡峭
- 更适合大型企业级项目
- 对于我们的项目规模来说过于重量级

### 为什么不选 Lerna？
- 维护不够活跃（已由 Nx 团队接手）
- 缺少现代化的缓存机制
- 性能不如 Turborepo
- 配置相对繁琐

### 为什么不用原生 pnpm？
- 缺少智能缓存
- 需要手动管理任务依赖
- 没有增量构建支持
- 开发体验不如专用工具

## 配置

### turbo.json
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": { "dependsOn": ["^build"] },
    "test": { "dependsOn": ["^build"] }
  }
}
```

### 脚本集成
```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test"
  }
}
```

## 影响

### 积极影响
- **开发体验提升**：构建速度大幅提高
- **CI/CD 优化**：缓存机制可节省大量构建时间
- **并行执行**：充分利用多核性能
- **可扩展性**：未来可轻松添加更多包

### 需要注意
- `.turbo/` 目录需加入 `.gitignore`
- 首次构建会创建缓存（略慢）
- 团队成员需了解基本的 Turborepo 概念

## 性能数据

实际测试结果（空构建）：
- 首次构建：379ms
- 缓存命中：18ms（FULL TURBO）
- **速度提升：20x+**

真实项目中，构建时间节省会更加显著。

## 相关资源
- [官方文档](https://turbo.build/repo/docs)
- [TURBOREPO.md](../../../docs/TURBOREPO.md) - 配置说明
- [Why Turborepo?](https://turbo.build/repo/docs/why-turborepo)

## 相关决策
- [ADR 001: 选择 pnpm](./001-package-manager-pnpm.md)

## 参与者
- Vincent (项目负责人)
- Claude Code (AI 辅助开发)
