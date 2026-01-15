# Excalidraw 集成方案

## 方案对比

### 方案 1: 使用 npm 包 ⭐ 推荐

**包名**: `@excalidraw/excalidraw`
**当前版本**: 0.18.0
**协议**: MIT

#### 优势
- ✅ **最简单** - 直接 `pnpm add @excalidraw/excalidraw`
- ✅ **官方维护** - 自动获得更新和 bug 修复
- ✅ **稳定性高** - 经过测试的稳���版本
- ✅ **无需管理源码** - 不占用仓库空间
- ✅ **升级方便** - 一条命令即可升级

#### 劣势
- ⚠️ **定制受限** - 只能通过官方 API 和配置定制
- ⚠️ **深度修改困难** - 无法修改核心逻辑

#### 适用场景
- 不需要修改 Excalidraw 核心代码
- 通过插件、配置、包装层实现定制
- 想要快速集成和验证

#### 集成方式
```bash
# 在 packages/web 中安装
cd packages/web
pnpm add @excalidraw/excalidraw react react-dom
```

```tsx
// 使用示例
import { Excalidraw } from "@excalidraw/excalidraw";

function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Excalidraw />
    </div>
  );
}
```

---

### 方案 2: Git Submodule

#### 优势
- ✅ **保持同步** - 可以跟踪上游更新
- ✅ **独立管理** - 源码独立于主项目
- ✅ **可以修改** - 需要时可以切换到 fork

#### 劣势
- ❌ **管理复杂** - submodule 容易出问题
- ❌ **团队协作难** - 容易忘记 `git submodule update`
- ❌ **构建复杂** - 需要配置额外的构建流程
- ❌ **不适合 Monorepo** - 与 pnpm workspace 不太兼容

#### 集成方式
```bash
# 添加 submodule
git submodule add https://github.com/excalidraw/excalidraw.git packages/excalidraw-source

# 初始化和更新
git submodule init
git submodule update
```

**不推荐理由**: submodule 与 Monorepo + pnpm 配合使用会很复杂

---

### 方案 3: Fork + 复制到 packages/

#### 优势
- ✅ **完全控制** - 可以任意修改代码
- ✅ **简单直接** - 代码在自己仓库中
- ✅ **无依赖问题** - 不依赖外部资源

#### 劣势
- ❌ **难以同步上游** - 手动合并更新非常困难
- ❌ **占用空间大** - Excalidraw 仓库很大（~94MB）
- ❌ **维护成本高** - bug 修复和功能更新需要手动合并

#### 集成方式
```bash
# 1. Fork excalidraw 到你的 GitHub
# 2. 克隆到 packages 目录
git clone https://github.com/YOUR_USERNAME/excalidraw.git packages/excalidraw

# 3. 添加到 pnpm workspace（修改 pnpm-workspace.yaml）
packages:
  - "packages/*"
  - "packages/excalidraw"
```

**不推荐理由**: 除非要大幅修改核心代码，否则维护成本太高

---

### 方案 4: Fork + 发布自己的 npm 包

#### 优势
- ✅ **可定制** - 可以修改源码
- ✅ **易分发** - 作为 npm 包使用
- ✅ **版本控制** - 清晰的版本管理

#### 劣势
- ⚠️ **需要 CI/CD** - 自动构建和发布流程
- ⚠️ **维护成本** - 需要持续维护自己的版本
- ⚠️ **同步上游** - 定期合并上游更新

#### 集成方式
```bash
# 1. Fork excalidraw
# 2. 修改 package.json，改名为 @aibaiban/excalidraw
# 3. 发布到 npm 或私有 registry
# 4. 在项目中使用
pnpm add @aibaiban/excalidraw
```

---

## 推荐方案：渐进式集成 🎯

### Phase 1: 快速验证（1-2 天）✅ 从这里开始

**使用 npm 包**
```bash
cd packages/web
pnpm add @excalidraw/excalidraw
```

**目标**：
- 快速集成验证可行性
- 了解 Excalidraw API 和能力
- 实现基础的 AI 功能原型

**优势**：
- 最快速度看到效果
- 最小风险
- 如果不合适可以随时切换

---

### Phase 2: 评估定制需求（1 周后）

**基于 Phase 1 的使用经验，评估**：
- 官方 API 是否满足需求？
- 是否需要修改核心代码？
- 定制的深度如何？

**决策**：
- ✅ 如果 API 够用 → 继续用 npm 包
- ⚠️ 如果需要深度定制 → 进入 Phase 3

---

### Phase 3: 深度定制（如果需要）

**选择 Fork + 发布私有包**

1. Fork excalidraw 到你的组织
2. 在 packages/ 下创建一个包装包
3. 有选择地复制需要修改的部分
4. 其他部分继续用官方包

**示例结构**：
```
packages/
  ├── web/                 # 你的前端应用
  ├── excalidraw-custom/   # 定制的 Excalidraw 包装
  │   ├── src/
  │   │   ├── AIFeatures.tsx    # 你的 AI 功能
  │   │   ├── CustomUI.tsx      # 自定义 UI
  │   │   └── index.tsx         # 导出包装后的组件
  │   └── package.json
  └── server/
```

---

## 具体建议 💡

### 立即行动

**我建议先用方案 1（npm 包）**，原因：

1. **快速验证** - 今天就能跑起来
2. **风险最低** - 不满意随时换
3. **官方支持** - 文档、示例齐全
4. **80% 需求** - 大部分定制可以通过 API 实现

### Excalidraw 的扩展能力

官方提供了丰富的扩展点：
- **UIOptions** - 自定义 UI
- **initialData** - 预加载数据
- **onChange** - 监听变化
- **renderTopRightUI** - 自定义顶部工具栏
- **renderFooter** - 自定义底部
- **viewModeEnabled** - 控制模式
- **zenModeEnabled** - 禅模式
- **gridModeEnabled** - 网格
- **theme** - 主题定制

**AI 功能可以通过**：
- 监听 onChange，分析用户绘制
- 通过 API 插入 AI 生成的元素
- 自定义按钮调用 AI 服务
- 在侧边栏集成 AI 助手

### 不推荐 Submodule 的理由

1. **Monorepo 不兼容** - pnpm workspace 和 git submodule 配合很别扭
2. **团队协作难** - 每个人都要记得更新 submodule
3. **构建复杂** - CI/CD 配置麻烦
4. **Excalidraw 太大** - 94MB，没必要全部放进来

---

## 实施步骤

### 现在就可以做：

```bash
# 1. 进入 web 包
cd packages/web

# 2. 安装 Excalidraw
pnpm add @excalidraw/excalidraw

# 3. 安装必要的依赖
pnpm add react react-dom

# 4. 创建测试页面
# src/App.tsx
```

### 然后测试这些功能：

1. **基础渲染** - 能否正常显示
2. **素材库** - 能否加载和使用
3. **数据导入导出** - 能否保存和加载
4. **自定义 UI** - 能否添加自己的按钮
5. **AI 集成点** - 在哪里插入 AI 功能

### 1-2 周后再决定：

- 是否需要 Fork
- 是否需要深度定制
- 是否继续用 npm 包

---

## 总结

| 方案 | 推荐度 | 适用场景 |
|------|--------|----------|
| **npm 包** | ⭐⭐⭐⭐⭐ | 立即开始，90% 场景 |
| **Submodule** | ⭐ | 不推荐 |
| **Fork 到 packages** | ⭐⭐ | 需要大改核心代码 |
| **Fork + 私有包** | ⭐⭐⭐⭐ | 确定需要深度定制后 |

**我的建议**: 先用 npm 包，快速验证，有需要再升级方案。

需要我帮你立即集成 Excalidraw npm 包吗？

## 更新记录
- 2026-01-14: Excalidraw 集成方案分析
