# 开发流程规范

本文档记录了项目开发过程中需要遵循的流程和规范，确保文档和代码的一致性。

## 文档同步规则 ⚠️ 重要

### 核心原则
**每次项目有实质性更新时，必须同步更新相关文档。**

### 必须更新的文档

#### 1. 技术决策变更时

当做出重要技术决策（如选择框架、库、工具）时：

✅ **必须创建 ADR**
- 路径：`.claude/decisions/XXX-description.md`
- 格式：按 ADR 模板编写
- 编号：递增（001, 002, 003...）

✅ **必须更新 .claude/README.md**
- 在"架构决策记录"部分添加新 ADR 链接
- 更新"更新日志"

✅ **必须更新 .claude/context/tech-stack.md**
- 在对应章节添加或更新技术栈信息
- 更新"更新记录"

✅ **必须更新根目录 README.md**
- 更新"技术栈"部分
- 更新"路线图"（如果相关）
- 如有新文档，更新"项目结构"

---

#### 2. 添加新文档时

当在 `docs/` 或 `.claude/` 下创建新文档时：

✅ **必须更新 docs/README.md**
- 在对应分类下添加新文档链接

✅ **必须更新根目录 README.md**
- 更新"项目结构"树形图
- 确保新文件路径正确

✅ **必须更新 .claude/README.md**（如果是 .claude/ 下的文档）
- 在对应章节添加链接

---

#### 3. 项目结构变更时

当添加新的包、目录或配置文件时：

✅ **必须更新根目录 README.md**
- 更新"项目结构"部分
- 使用 `tree` 或 `ls` 确保结构准确

示例命令：
```bash
# 查看 docs 目录下的所有 md 文件
ls -1 docs/*.md

# 查看 .claude/decisions 下的所有 ADR
ls -1 .claude/decisions/*.md
```

---

#### 4. 完成重要任务时

✅ **必须更新 .claude/tasks/current-sprint.md**
- 将已完成任务移到"已完成"部分
- 添加完成日期
- 更新"里程碑"（如果适用）
- 更新"更新记录"

✅ **必须更新 .claude/sessions/YYYY-MM/DD-*.md**
- 记录完成的工作
- 更新"下一步"
- 更新"创建的文件"列表

---

#### 5. 创建或更新产品需求文档时

当创建新 PRD 或更新产品规划时：

✅ **必须更新 prds/README.md**
- 在对应分类下添加新 PRD 链接
- 更新"更新记录"

✅ **必须更新 .claude/README.md**
- 在"产品文档"部分添加重要 PRD 链接（如产品概述、核心功能等）

✅ **必须更新根目录 README.md**
- 更新"项目状态"（如果产品阶段发生变化）
- 更新"路线图"（如果有新的产品里程碑）
- 更新"项目结构"（如果添加了新的 PRD 文件）

✅ **根据需要更新 .claude/context/project-overview.md**
- 当产品��位、核心功能等发生重大变化时同步更新

---

## 开发流程检查清单

### 开始新任务前
- [ ] 阅读 `.claude/context/` 下的上下文文档
- [ ] 查看 `.claude/tasks/current-sprint.md` 了解当前任务
- [ ] 查看最新的会话记录

### 完成任务后
- [ ] 更新 `.claude/tasks/current-sprint.md`
- [ ] 更新会话记录
- [ ] 如果有技术决策，创建 ADR
- [ ] 更新所有相关文档（见上文规则）
- [ ] 提交代码前，确保所有文档都已更新

### 提交代码前
- [ ] 运行 `git status` 检查是否有遗漏的文档
- [ ] 确认 README.md 的项目结构是最新的
- [ ] 确认所有新文档都已添加索引
- [ ] 遵循 Git 提交规范（Conventional Commits）

---

## 文档更新优先级

### P0（必须立即更新）
- ✅ ADR（架构决策记录）
- ✅ README.md（项目结构）
- ✅ tech-stack.md（技术栈变更）
- ✅ current-sprint.md（任务状态）
- ✅ prds/README.md（产品文档索引）

### P1（应该及时更新）
- ✅ 会话记录（sessions/）
- ✅ docs/README.md（文档索引）
- ✅ .claude/README.md（协作记录索引）
- ✅ prds/产品概述.md（产品定位变更）
- ✅ 具体 PRD 文档（功能需求）

### P2（可以稍后更新）
- 🟡 project-overview.md（项目概述）
- 🟡 architecture.md（架构设计）
- 🟡 其他上下文文档

---

## 自动化提醒

### Git Hooks
项目配置了 pre-commit hook，可以在提交前自动检查：
- Commit message 格式（commitlint）
- 代码格式（如果配置）

### 手动检查命令

**检查文档是否最新**：
```bash
# 查看所有 markdown 文件的修改时间
find . -name "*.md" -not -path "*/node_modules/*" -exec ls -lh {} \;

# 查看 git 状态
git status

# 对比 docs 目录和 README.md 中的文档列表
ls -1 docs/*.md
grep "docs/" README.md
```

---

## 常见场景示例

### 场景 1: 选择了新的技术框架

例如：确定使用 Excalidraw 作为白板框架

**需要更新**：
1. ✅ 创建 ADR：`.claude/decisions/004-whiteboard-excalidraw.md`
2. ✅ 更新 `.claude/README.md`：添加 ADR 004 链接
3. ✅ 更新 `.claude/context/tech-stack.md`：添加白板框架信息
4. ✅ 更新 `.claude/context/project-overview.md`：更新核心功能
5. ✅ 更新根 `README.md`：技术栈 + 路线图
6. ✅ 更新 `.claude/tasks/current-sprint.md`：标记任务完成
7. ✅ 创建技术调研文档：`docs/开源白板项目选型.md` 等
8. ✅ 更新 `docs/README.md`：添加新文档链接

---

### 场景 2: 添加了新的配置文件

例如：添加了 `turbo.json`

**需要更新**：
1. ✅ 更新根 `README.md`：在"项目结构"中添加 `turbo.json`
2. ✅ 创建说明文档：`docs/TURBOREPO.md`
3. ✅ 更新 `docs/README.md`：添加文档链接

---

### 场景 3: 完成一个开发任务

例如：完成了 Git 提交规范配置

**需要更新**：
1. ✅ 更新 `.claude/tasks/current-sprint.md`：任务状态改为已完成
2. ✅ 更新会话记录：记录完成的工作
3. ✅ 如果有新文件，更新根 `README.md` 的项目结构

---

### 场景 4: 创建产品需求文档

例如：创建了产品概述文档

**需要更新**：
1. ✅ 创建 `prds/产品概述.md`：详细产品规划
2. ✅ 更新 `prds/README.md`：添加文档链接
3. ✅ 更新 `.claude/README.md`：在产品文档部分添加链接
4. ✅ 更新根 `README.md`：
   - 项目结构：添加新的 PRD 文件
   - 项目状态：更新为"正在进行产品规划"
   - 路线图：添加产品规划相关任务
5. ✅ 更新 `.claude/context/project-overview.md`：如产品定位有重大变化
6. ✅ 更新 `.claude/tasks/current-sprint.md`：标记任务完成

---

## 文档模板

### ADR 模板
参考：`.claude/decisions/001-package-manager-pnpm.md`

必须包含：
- 状态（已接受/已废弃）
- 背景
- 决策
- 理由
- 影响
- 相关文档
- 参与者

### 技术调研文档模板
参考：`docs/开源白板项目选型.md`

建议包含：
- 项目概览（表格对比）
- 详细分析
- 选型建议
- 下一步行动
- 参考资源

---

## 特殊提醒

### 网络代理
访问 GitHub 等外网资源时，记得设置代理：
```bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7890
```

详见：[dev-environment.md](./dev-environment.md)

---

## 违反规则的后果

如果不及时更新文档：
- ❌ 文档与实际不符，误导开发
- ❌ 上下文丢失，需要重新理解项目
- ❌ 团队协作困难
- ❌ 无法追溯历史决策

---

## 更新记录
- 2026-01-14: 创建开发流程规范文档
- 2026-01-15: 添加 PRD 文档更新规则（场景 5）
