# ADR 003: Git 提交规范

## 状态
✅ 已接受 (2026-01-14)

## 背景
随着项目开发的推进，需要建立统一的 Git 提交信息规范，以便：
- 自动生成 CHANGELOG
- 快速了解每次提交的目的
- 提升团队协作效率
- 支持语义化版本管理

## 决策
采用 **约定式提交（Conventional Commits）** 规范，并使用 commitlint + husky 自动检查。

## 规范内容

### 提交格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 提交类型
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式调整
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `build`: 构建系统或依赖变更
- `ci`: CI 配置变更
- `chore`: 其他变更
- `revert`: 回退提交

### 示例
```bash
feat: 添加用户登录功能
fix(server): 修复 API 认证问题
docs: 更新 README
refactor(web): 重构状态管理
```

## 理由

### 为什么选择约定式提交？

1. **行业标准**
   - 被广泛采用的开源标准
   - 与语义化版本完美配合
   - 工具生态完善

2. **自动化能力**
   - 自动生成 CHANGELOG
   - 自动确定版本号
   - CI/CD 集成简单

3. **可读性强**
   - 提交历史清晰明了
   - 快速定位特定类型的更改
   - 便于代码审查

4. **工具支持**
   - commitlint: 自动检查格式
   - husky: Git hooks 管理
   - conventional-changelog: 自动生成日志

### 为什么现在就配置？

虽然项目初期、单人开发，但：
- **习惯养成**：从一开始就建立规范，避免后续改造成本
- **配置简单**：只需几分钟，不影响开发效率
- **未来准备**：为团队扩大和自动化流程打基础
- **示范作用**：作为 AI 辅助开发的最佳实践

## 工具配置

### 依赖包
```json
{
  "devDependencies": {
    "husky": "^9.1.7",
    "@commitlint/cli": "^20.3.1",
    "@commitlint/config-conventional": "^20.3.1"
  }
}
```

### commitlint.config.js
```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0], // 允许任意大小写
  },
};
```

### husky hook
- `.husky/commit-msg` - 提交时自动检查

## 影响

### 积极影响
- **提交质量提升**：强制规范化，减少随意提交
- **历史清晰**：便于追溯和回溯
- **自动化基础**：为后续 CI/CD 和版本管理铺路
- **团队协作**：统一标准，降低沟通成本

### 需要注意
- 首次使用需要适应规范格式
- commit 时会有格式检查，不合规会被拒绝
- 紧急情况可使用 `--no-verify` 跳过（不推荐）

## 实施计划

1. ✅ 安装依赖：husky, commitlint
2. ✅ 配置 commitlint 规则
3. ✅ 配置 commit-msg hook
4. ✅ 创建提交规范文档
5. ✅ 更新项目 README

## 相关资源
- [约定式提交规范](https://www.conventionalcommits.org/zh-hans/)
- [commitlint 文档](https://commitlint.js.org/)
- [提交规范详情](../../../docs/GIT_COMMIT_GUIDELINES.md)

## 参与者
- Vincent (项目负责人)
- Claude Code (AI 辅助开发)
