# Turborepo 配置说明

## 什么是 Turborepo？

Turborepo 是一个高性能的 Monorepo 构建工具，专为 JavaScript/TypeScript 项目优化。

### 核心优势
- ⚡ **增量构建** - 只重新构建改变的内容
- 🔄 **智能缓存** - 本地和远程缓存，永远不重复构建
- 📦 **并行执行** - 最大化利用 CPU 核心
- 🎯 **任务编排** - 自动管理任务依赖关系

## 配置文件

### turbo.json
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],           // 依赖其他包先构建
      "outputs": ["dist/**", ".next/**"] // 缓存输出目录
    },
    "dev": {
      "cache": false,      // 开发模式不缓存
      "persistent": true   // 持久运行
    }
  }
}
```

## 使用方式

### 运行所有包的任务
```bash
pnpm dev     # 运行所有包的 dev 脚本
pnpm build   # 构建所有包
pnpm test    # 测试所有包
```

### 运行单个包的任务
```bash
pnpm --filter @aibaiban/web dev
pnpm --filter @aibaiban/server build
```

### Turbo 特定命令
```bash
# 查看任务依赖图
pnpm turbo run build --graph

# 清除缓存
pnpm turbo run build --force

# 查看执行日志
pnpm turbo run build --summarize
```

## 缓存机制

Turborepo 会自动缓存任务输出：
- 本地缓存在 `.turbo/` 目录
- 基于文件内容哈希，确保缓存正确性
- 团队可共享远程缓存（需配置 Vercel 或自建）

## 更多资源
- [官方文档](https://turbo.build/repo/docs)
- [配置参考](https://turbo.build/repo/docs/reference/configuration)
