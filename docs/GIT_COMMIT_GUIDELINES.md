# Git 提交规范

本项目使用 [约定式提交（Conventional Commits）](https://www.conventionalcommits.org/zh-hans/) 规范，通过 commitlint 自动检查。

## 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 必填部分

- **type**: 提交类型（必填）
- **subject**: 简短描述（必填）

### 可选部分

- **scope**: 影响范围（可选）
- **body**: 详细描述（可选）
- **footer**: 备注信息（可选）

## 提交类型 (type)

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 添加白板画笔工具` |
| `fix` | 修复 bug | `fix: 修复画布缩放问题` |
| `docs` | 文档变更 | `docs: 更新 API 文档` |
| `style` | 代码格式（不影响功能） | `style: 格式化代码` |
| `refactor` | 重构（不是新功能也不是修 bug） | `refactor: 重构状态管理` |
| `perf` | 性能优化 | `perf: 优化渲染性能` |
| `test` | 测试相关 | `test: 添加单元测试` |
| `build` | 构建系统或依赖变更 | `build: 升级 React 到 18` |
| `ci` | CI 配置变更 | `ci: 添加 GitHub Actions` |
| `chore` | 其他不修改源码的变更 | `chore: 更新 .gitignore` |
| `revert` | 回退之前的提交 | `revert: 回退 feat: xxx` |

## 提交示例

### 简单提交
```bash
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复内存泄漏问题"
git commit -m "docs: 更新 README"
```

### 带作用域
```bash
git commit -m "feat(web): 添加白板工具栏"
git commit -m "fix(server): 修复 API 认证问题"
git commit -m "perf(shared): 优化工具函数性能"
```

### 完整提交
```bash
git commit -m "feat(web): 添加实时协作功能

- 集成 WebSocket 实时通信
- 添加用户在线状态显示
- 实现光标位置同步

Closes #123"
```

### 破坏性变更
```bash
git commit -m "feat(api): 重构用户认证 API

BREAKING CHANGE: 认证接口从 /auth 迁移到 /api/v2/auth
需要更新客户端调用"
```

## 验证机制

本项目使用 **husky** + **commitlint** 自动验证提交信息：

- ✅ 提交前自动检查格式
- ❌ 不符合规范的提交会被拒绝
- 💡 会显示错误提示和修改建议

## 常见错误

### ❌ 错误示例
```bash
# 缺少 type
git commit -m "添加登录功能"

# type 拼写错误
git commit -m "feature: 添加登录功能"

# subject 为空
git commit -m "feat:"

# type 后面缺少冒号
git commit -m "feat 添加登录功能"
```

### ✅ 正确示例
```bash
git commit -m "feat: 添加登录功能"
git commit -m "fix: 修复登录 bug"
git commit -m "docs: 更新文档"
```

## 跳过检查（不推荐）

紧急情况下可以跳过检查：
```bash
git commit -m "xxx" --no-verify
```

**注意**：除非特殊情况，否则不建议跳过检查。

## 工具推荐

### 命令行工具
```bash
# 安装 commitizen（交互式提交）
npm install -g commitizen cz-conventional-changelog

# 使用交互式提交
git cz
```

### IDE 插件
- **VSCode**: Conventional Commits
- **WebStorm**: Conventional Commit

## 更多资源
- [约定式提交规范](https://www.conventionalcommits.org/zh-hans/)
- [commitlint 文档](https://commitlint.js.org/)
- [语义化版本](https://semver.org/lang/zh-CN/)
