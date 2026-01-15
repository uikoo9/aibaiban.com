# ADR 004: 选择 Excalidraw 作为白板基础框架

## 状态
✅ 已接受 (2026-01-14)

## 背景

项目需要一个成熟的白板解决方案作为基础，进行 AI 功能的二次开发。经过调研对比了三个主流开源白板项目：
- **Excalidraw** - 11.4 万 Stars，手绘风格，丰富素材库
- **tldraw** - 4.4 万 Stars，SDK 定位，高度可定制
- **Drawnix** - 1.3 万 Stars，国产，一体化方案

## 决策
选择 **Excalidraw** 作为白板基础框架，通过 npm 包 `@excalidraw/excalidraw` 集成。

## 核心理由

### 1. 素材库是核心竞争力 ⭐

**Excalidraw**:
- ✅ 官方素材库：https://libraries.excalidraw.com/
- ✅ 数千个预制素材（AWS/GCP/Azure 图标、流程图、UML 等）
- ✅ 社区持续贡献
- ✅ 一键导入，开箱即用

**tldraw**:
- ❌ 无内置素材库，仅 10 个基础形状
- ❌ 需要自建素材系统（1-2 个月开发成本）

**结论**: 素材库是白板产品的基础能力，Excalidraw 的丰富素材库显著降低开发成本，提升用户体验。

---

### 2. MIT 协议，商业友好

- ✅ 完全开源，无商用限制
- ✅ 可以 fork、修改、二次开发
- ✅ 可以打包到商业产品中

---

### 3. 社区最活跃

- ✅ 11.4 万 GitHub Stars（是 tldraw 的 2.5 倍）
- ✅ 12,000+ Forks
- ✅ 持续更新（最后更新：2026-01-14）
- ✅ 文档完善，示例丰富

---

### 4. 技术成熟度高

- ✅ 经过大规模生产验证
- ✅ 性能优化良好
- ✅ 手绘风格独特，用户喜爱
- ✅ 支持实时协作、端到端加密

---

### 5. 扩展性满足需求

虽然不是 SDK，但提供了丰富的扩展点：
- ✅ UIOptions - 自定义 UI
- ✅ onChange - 监听变化（AI 分析入口）
- ✅ renderTopRightUI - 自定义工具栏（AI 按钮）
- ✅ initialData - 数据导入导出
- ✅ theme - 主题定制

**评估结果**: 80-90% 的定制需求可以通过官方 API 实现，无需修改核心代码。

---

## 为什么不选 tldraw？

虽然 tldraw 技术上更灵活，但：
1. ❌ **无素材库** - 自建成本 1-2 个月，不划算
2. ❌ **协议不明确** - 标注为 NOASSERTION，需要确认
3. ⚠️ **学习成本高** - SDK 架构，需要时间理解
4. ⚠️ **初期功能简陋** - 需要大量开发才能达到 Excalidraw 水平

**结论**: tldraw 更适合从零构建高度定制的白板产品，对于需要快速上线、素材库是刚需的场景，不是最优选择。

---

## 为什么不选 Drawnix？

1. 🟡 社区规模较小（1.3 万 Stars）
2. 🟡 技术栈复杂（自研框架）
3. 🟡 更新频率相对低
4. 🟡 文档和示例相对少

**结论**: 适合需要中文友好、功能全面的场景，但社区和生态不如 Excalidraw。

---

## 集成方案

### 选择方案：npm 包集成 ⭐

**包名**: `@excalidraw/excalidraw`
**版本**: 0.18.0
**协议**: MIT

### 为什么不用 Git Submodule？

1. ❌ 与 Monorepo + pnpm 不兼容
2. ❌ 团队协作复杂（容易忘记更新）
3. ❌ 构建流程复杂
4. ❌ Excalidraw 仓库大（94MB），占用空间

### 为什么不直接 Fork？

1. ⚠️ 难以同步上游更新
2. ⚠️ 维护成本高
3. ⚠️ 除非需要大幅修改核心，否则不值得

### 渐进式策略

**Phase 1** (立即): 使用 npm 包
- 快速验证可行性
- 了解 Excalidraw API
- 实现 AI 功能原型

**Phase 2** (1 周后): 评估定制需求
- 测试官方 API 是否满足需求
- 确定是否需要深度修改

**Phase 3** (如需要): 考虑 Fork
- 如果官方 API 不够，再考虑 Fork
- 发布私有 npm 包，便于管理

---

## AI 集成策略

### 扩展点

1. **onChange 监听**
   ```typescript
   onChange={(elements, state) => {
     // AI 分析用户绘制内容
     analyzeDrawing(elements);
   }}
   ```

2. **自定义按钮**
   ```typescript
   renderTopRightUI={() => (
     <AIAssistantButton onClick={handleAIGenerate} />
   )}
   ```

3. **侧边栏 AI 助手**
   - 实现自定义侧边栏
   - 集成 AI 对话界面
   - 展示 AI 建议

4. **数据注入**
   ```typescript
   // AI 生成的元素可以通过 API 插入
   excalidrawAPI.updateScene({
     elements: [...existingElements, ...aiGeneratedElements]
   });
   ```

### AI 功能设想

- 🤖 AI 生成图形/图标
- 🤖 智能布局优化
- 🤖 自动美化/对齐
- 🤖 语音转图表
- 🤖 图表智能识别和分类
- 🤖 协作建议

---

## 影响

### 积极影响

1. **快速上线** - 素材库开箱即用，节省 1-2 个月开发时间
2. **用户体验** - 丰富素材 + 手绘风格，用户喜爱度高
3. **降低风险** - 成熟项目，稳定性好
4. **社区支持** - 问题容易找到解决方案
5. **商业友好** - MIT 协议，无后顾之忧

### 需要注意

1. **深度定制受限** - 如果需要大幅修改核心逻辑，可能需要 Fork
2. **API 依赖** - 需要熟悉 Excalidraw 的 API 和数据结构
3. **版本管理** - 需要跟踪上游更新，避免 breaking changes

### 缓解措施

1. **API 优先** - 尽量使用官方 API，避免侵入式修改
2. **包装层** - 创建自己的包装组件，隔离依赖
3. **测试覆盖** - 确保升级时不会破坏功能
4. **保留后路** - 如果真的需要，随时可以 Fork

---

## 技术栈更新

### 前端

- React
- TypeScript
- **Excalidraw** (白板核心)

### 待确定

- 前端框架：Next.js / Vite + React
- 状态管理
- UI 组件库

---

## 下一步行动

1. ✅ 确定前端框架（Next.js 或 Vite）
2. ⏸️ 安装 `@excalidraw/excalidraw`（暂缓，先完成文档）
3. ⏸️ 创建白板页面
4. ⏸️ 测试素材库功能
5. ⏸️ 设计 AI 集成架构
6. ⏸️ 实现第一个 AI 功能原型

---

## 参考资源

- [Excalidraw GitHub](https://github.com/excalidraw/excalidraw)
- [Excalidraw 素材库](https://libraries.excalidraw.com/)
- [npm 包文档](https://www.npmjs.com/package/@excalidraw/excalidraw)
- [开源白板项目选型](../../../docs/开源白板项目选型.md)
- [白板素材库对比](../../../docs/白板素材库对比.md)
- [Excalidraw 集成方案](../../../docs/Excalidraw集成方案.md)

---

## 相关决策
- [ADR 001: 选择 pnpm](./001-package-manager-pnpm.md)
- [ADR 002: 选择 Turborepo](./002-build-tool-turborepo.md)
- [ADR 003: Git 提交规范](./003-git-commit-convention.md)

## 参与者
- Vincent (项目负责人)
- Claude Code (AI 辅助开发)
