# 2026-01-21 开发会话：AI 生成图表功能

**日期**: 2026-01-21
**主题**: 实现 AI 生成白板图表的完整功能
**状态**: ✅ 已完成

---

## 会话概述

本次会话实现了从大模型返回内容到白板图表的完整转换流程，包括简化格式定义、自动转换器、演示界面等。

---

## 需求背景

用户提出问题：
> "如果我要调用大模型，比如我和大模型说，我想生成一个app的架构图，大模型怎么才能输出白板区域可以执行的内容呢，类似之前测试按钮的代码"

**核心问题**：如何让大模型输出一种格式，让白板能够理解并渲染？

---

## 技术方案设计

### 方案对比

我们讨论了三种方案：

1. **大模型直接输出 Excalidraw 格式**
   - ❌ 格式太复杂，对大模型要求高
   - ❌ 需要大量必需字段（seed, versionNonce, roundness 等）

2. **简化格式 + 前端转换** ⭐ **最终采用**
   - ✅ 大模型易于理解和输出
   - ✅ 前端灵活控制样式和布局
   - ✅ 可扩展性强

3. **使用 Mermaid 语法**
   - ⚠️ 需要复杂的解析器
   - ⚠️ Mermaid → Excalidraw 转换较复杂

---

## 实现内容

### 1. 简化的图表格式定义

**文件**: `src/types/diagram.ts`

```typescript
export interface DiagramNode {
  id: string              // 节点唯一标识
  label: string           // 节点文字（支持 \n 换行）
  type?: 'rectangle' | 'ellipse' | 'diamond'  // 形状类型
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray'
}

export interface DiagramConnection {
  from: string            // 起始节点 ID
  to: string              // 目标节点 ID
  label?: string          // 连接线标签
}

export interface SimplifiedDiagram {
  type: 'architecture' | 'flowchart' | 'sequence'
  title?: string
  nodes: DiagramNode[]
  connections: DiagramConnection[]
}
```

**大模型输出示例**:

```json
{
  "type": "architecture",
  "title": "App 架构图",
  "nodes": [
    {
      "id": "frontend",
      "label": "前端层\nReact + Vite",
      "type": "rectangle",
      "color": "blue"
    },
    {
      "id": "backend",
      "label": "后端服务\nNode.js API",
      "type": "rectangle",
      "color": "green"
    }
  ],
  "connections": [
    { "from": "frontend", "to": "backend", "label": "HTTPS" }
  ]
}
```

---

### 2. 格式转换器

**文件**: `src/utils/diagramConverter.ts` (170 行)

#### 核心功能

**颜色映射**:
```typescript
const COLOR_MAP = {
  blue: '#1971c2',
  green: '#2f9e44',
  purple: '#9c36b5',
  orange: '#f76707',
  red: '#e03131',
  gray: '#495057',
}
```

**自动布局算法** - 网格布局：
```typescript
const NODE_WIDTH = 200
const NODE_HEIGHT = 100
const HORIZONTAL_SPACING = 150
const VERTICAL_SPACING = 150

// 计算网格位置
const cols = Math.ceil(Math.sqrt(diagram.nodes.length))
diagram.nodes.forEach((node, index) => {
  const col = index % cols
  const row = Math.floor(index / cols)
  const x = START_X + col * (NODE_WIDTH + HORIZONTAL_SPACING)
  const y = START_Y + row * (NODE_HEIGHT + VERTICAL_SPACING)
  // ...
})
```

**Excalidraw 元素生成**:
- ✅ 自动补全所有必需字段（seed, version, versionNonce...）
- ✅ 形状元素创建（rectangle, ellipse, diamond）
- ✅ 文字标签渲染（支持多行文字）
- ✅ 箭头连接创建（自动计算起点和终点）
- ✅ 连接线标签渲染

**转换函数**:
```typescript
export function convertDiagramToExcalidraw(diagram: SimplifiedDiagram): any[]
```

输入：简化格式
输出：Excalidraw 元素数组

---

### 3. 扩展 Whiteboard 组件

**文件**: `src/components/Whiteboard.tsx`

**新增方法**:
```typescript
export interface WhiteboardHandle {
  addRandomShape: () => void                          // 旧方法
  addAIGeneratedDiagram: (diagram: SimplifiedDiagram) => void  // 新方法
}
```

**实现逻辑**:
```typescript
addAIGeneratedDiagram: (diagram: SimplifiedDiagram) => {
  if (!excalidrawAPI.current) return

  try {
    // 1. 转换简化格式为 Excalidraw 格式
    const newElements = convertDiagramToExcalidraw(diagram)

    // 2. 添加到白板（保留现有内容）
    excalidrawAPI.current.updateScene({
      elements: [
        ...excalidrawAPI.current.getSceneElements(),
        ...newElements,
      ],
    })
  } catch (error) {
    console.error('Failed to add AI generated diagram:', error)
  }
}
```

---

### 4. UI 演示界面

**文件**: `src/pages/Board.tsx`

#### AI 生成按钮

```tsx
<button
  onClick={handleGenerateAIDiagram}
  className="btn btn-ghost gap-2 h-10 min-h-10"
  aria-label="AI 生成图表"
>
  <Sparkles className="w-4 h-4" />
  <span className="hidden sm:inline text-sm font-medium">AI 生成</span>
</button>
```

- 位置：顶部导航栏左侧
- 图标：Sparkles（闪光图标）
- 响应式：移动端隐藏文字

#### 演示模态框

模拟大模型返回内容，展示完整的数据格式：

```tsx
{showAIModal && (
  <div className="modal modal-open">
    <div className="modal-box max-w-2xl">
      {/* 标题 */}
      <h3 className="font-bold text-lg mb-4">模拟大模型返回内容</h3>

      {/* JSON 内容展示 */}
      <div className="mockup-code mb-6">
        <pre className="px-6 py-4">
          <code className="text-sm">
            {JSON.stringify(mockAIResponse, null, 2)}
          </code>
        </pre>
      </div>

      {/* 功能说明 */}
      <div className="alert alert-info mb-6">
        <ul className="list-disc list-inside space-y-1">
          <li>大模型输出简化的 JSON 格式（nodes + connections）</li>
          <li>前端转换器自动转换为 Excalidraw 元素</li>
          <li>支持自动布局、颜色映射、箭头连接</li>
        </ul>
      </div>

      {/* 操作按钮 */}
      <div className="modal-action">
        <button onClick={() => setShowAIModal(false)}>取消</button>
        <button onClick={confirmGenerate}>生成图表</button>
      </div>
    </div>
  </div>
)}
```

#### 模拟数据

完整的 App 架构图示例：

```typescript
const mockAIResponse: SimplifiedDiagram = {
  type: 'architecture',
  title: 'App 架构图',
  nodes: [
    { id: 'frontend', label: '前端层\nReact + Vite', type: 'rectangle', color: 'blue' },
    { id: 'backend', label: '后端服务\nNode.js API', type: 'rectangle', color: 'green' },
    { id: 'database', label: '数据库\nPostgreSQL', type: 'ellipse', color: 'purple' },
    { id: 'cache', label: '缓存层\nRedis', type: 'diamond', color: 'orange' },
    { id: 'cdn', label: 'CDN\n静态资源', type: 'ellipse', color: 'red' },
  ],
  connections: [
    { from: 'frontend', to: 'backend', label: 'HTTPS' },
    { from: 'frontend', to: 'cdn', label: 'Assets' },
    { from: 'backend', to: 'database', label: 'SQL' },
    { from: 'backend', to: 'cache', label: 'Cache' },
  ],
}
```

---

## 使用流程

### 用户操作流程

```
┌─────────────────────────┐
│ 1. 用户点击"AI 生成"按钮 │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 2. 弹出模态框           │
│    展示大模型返回内容    │
│    (JSON 格式)          │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 3. 用户查看数据格式     │
│    阅读功能说明         │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 4. 点击"生成图表"       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 5. 转换器处理数据       │
│    - 网格布局计算       │
│    - 创建形状元素       │
│    - 创建文字标签       │
│    - 创建箭头连接       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 6. 白板渲染图表         │
│    ✅ 架构图完成！      │
└─────────────────────────┘
```

### 技术数据流

```
大模型 API
    │
    │ 返回 SimplifiedDiagram
    ▼
前端接收
    │
    │ 调用转换器
    ▼
convertDiagramToExcalidraw()
    │
    │ 输出 Excalidraw 元素数组
    ▼
Whiteboard.addAIGeneratedDiagram()
    │
    │ updateScene()
    ▼
白板渲染
```

---

## 技术亮点

### 1. 简化的 DSL 设计

**优势**:
- ✅ 大模型易于理解（只需描述节点和连接）
- ✅ JSON 格式通用，易于生成
- ✅ 支持多语言（中英文混合）
- ✅ 支持换行符（\n）

**示例**:
```typescript
// 大模型只需输出这样简单的结构
{
  "nodes": [
    { "id": "A", "label": "节点 A", "color": "blue" }
  ],
  "connections": [
    { "from": "A", "to": "B", "label": "连接" }
  ]
}
```

### 2. 自动布局算法

**网格布局**:
- 自动计算行列数：`cols = Math.ceil(Math.sqrt(nodes.length))`
- 均匀分布节点
- 可配置的间距参数

**未来可扩展**:
- 层次布局（适用于流程图）
- 力导向布局（适用于关系图）
- 树状布局（适用于组织架构图）

### 3. 颜色语义化

```typescript
blue   → 前端、UI、客户端
green  → 后端、服务器、API
purple → 数据库、存储
orange → 缓存、中间件
red    → 安全、监控、错误处理
gray   → 工具、配置、其他
```

### 4. 完整的类型安全

- TypeScript 全程保障
- 接口清晰定义
- 编译时错误检查

---

## 应用场景

### 1. AI 助手生成架构图

**对话示例**:
```
用户: "请帮我画一个电商系统的架构图"

AI: "好的，我来生成架构图"

[返回 SimplifiedDiagram JSON]

前端自动转换并渲染到白板 ✅
```

### 2. 快速原型设计

- 口述需求，AI 自动生成图表
- 节省手动绘制时间
- 支持多次迭代修改

### 3. 教育培训

- 讲解架构时自动生成示意图
- 可视化抽象概念
- 提高学习效率

### 4. 文档自动化

- 从代码生成架构图
- API 文档可视化
- 数据流图自动生成

---

## 扩展性设计

### 1. 支持更多形状类型

```typescript
type ShapeType =
  | 'rectangle'  // 矩形
  | 'ellipse'    // 椭圆
  | 'diamond'    // 菱形
  | 'cylinder'   // 圆柱体（数据库）
  | 'cloud'      // 云形（云服务）
  | 'actor'      // 人形（用户）
  | 'hexagon'    // 六边形
```

### 2. 支持自定义布局算法

```typescript
interface LayoutStrategy {
  calculate(nodes: DiagramNode[]): NodePosition[]
}

class GridLayout implements LayoutStrategy { ... }
class HierarchyLayout implements LayoutStrategy { ... }
class ForceDirectedLayout implements LayoutStrategy { ... }
```

### 3. 支持样式配置

```typescript
interface DiagramStyle {
  nodeWidth?: number
  nodeHeight?: number
  spacing?: number
  fontSize?: number
  strokeWidth?: number
  borderRadius?: number
}
```

### 4. 支持更复杂的连接

```typescript
interface Connection {
  from: string
  to: string
  type: 'arrow' | 'line' | 'dashed' | 'bidirectional'
  style?: 'solid' | 'dashed' | 'dotted'
  label?: string
}
```

---

## 性能优化

### 1. 批量创建元素

```typescript
// ✅ 一次性添加所有元素
excalidrawAPI.current.updateScene({
  elements: [...existing, ...newElements],
})

// ❌ 避免逐个添加（会触发多次重渲染）
newElements.forEach(el => addElement(el))
```

### 2. 元素 ID 生成优化

```typescript
// 使用时间戳 + 随机字符串
function generateId(): string {
  return `ai-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
```

### 3. 数据验证

```typescript
// 检查节点是否存在
if (!fromNode || !toNode) {
  console.warn(`Connection skipped: ${conn.from} -> ${conn.to}`)
  return
}
```

---

## 未来改进方向

### 1. 集成真实 AI API

当前使用模拟数据，未来可集成：
- Claude API
- OpenAI GPT-4
- 其他大模型服务

### 2. Prompt 工程

优化大模型 prompt，确保输出格式正确：

```
系统提示词：
你是一个架构图生成助手。当用户要求生成图表时，请严格按照以下 JSON 格式输出：

{
  "type": "architecture",
  "nodes": [
    { "id": "唯一ID", "label": "节点文字", "type": "rectangle|ellipse|diamond", "color": "blue|green|purple|orange|red|gray" }
  ],
  "connections": [
    { "from": "起始ID", "to": "目标ID", "label": "连接文字（可选）" }
  ]
}

注意事项：
1. id 必须唯一
2. label 支持 \n 换行
3. type 和 color 必须从预定义选项中选择
4. connections 中的 from 和 to 必须是已存在的节点 id
```

### 3. 用户编辑后的反向转换

```typescript
// 用户在白板上修改后，可以导出回简化格式
function convertExcalidrawToDiagram(elements: any[]): SimplifiedDiagram
```

### 4. 图表模板库

```typescript
const templates = {
  'three-tier': {
    nodes: [
      { id: 'frontend', label: '前端层', type: 'rectangle', color: 'blue' },
      { id: 'backend', label: '业务层', type: 'rectangle', color: 'green' },
      { id: 'database', label: '数据层', type: 'ellipse', color: 'purple' },
    ],
    connections: [
      { from: 'frontend', to: 'backend' },
      { from: 'backend', to: 'database' },
    ],
  },
  'microservices': { ... },
  'event-driven': { ... },
}
```

### 5. 动画效果

```typescript
// 逐个显示节点和连接，增强视觉效果
async function animateGeneration(elements: any[]) {
  for (const element of elements) {
    await addWithAnimation(element)
    await delay(100)
  }
}
```

---

## 文件变更统计

### 新增文件
- `src/types/diagram.ts` - 类型定义（21 行）
- `src/utils/diagramConverter.ts` - 转换器（170 行）

### 修改文件
- `src/components/Whiteboard.tsx` - 添加 addAIGeneratedDiagram 方法（+18 行）
- `src/pages/Board.tsx` - 添加 UI 和演示功能（+65 行）

### 总计
- **4 个文件变更**
- **+378 行, -10 行**

---

## 提交记录

```bash
commit 857a570
feat(ai): 实现 AI 生成图表功能

## 核心功能
- 创建简化的图表格式类型定义（SimplifiedDiagram）
- 实现图表格式转换器（diagramConverter.ts）
- 扩展 Whiteboard 组件支持 AI 生成内容
- 添加 AI 生成按钮和演示模态框

## 技术实现
1. 简化的 DSL 设计：大模型只需输出 nodes 和 connections
2. 自动布局算法：网格布局，自动计算节点位置
3. 格式转换器：简化格式 → Excalidraw 完整元素
4. 演示功能：可视化展示数据格式和转换流程
```

---

## 测试验证

### 功能测试

1. **点击 AI 生成按钮** ✅
   - 按钮显示正常
   - 图标渲染正确
   - 响应式适配正常

2. **查看模态框** ✅
   - JSON 代码高亮显示
   - 功能说明清晰
   - 布局美观

3. **生成图表** ✅
   - 5 个节点正确渲染
   - 4 条连接线正确连接
   - 颜色映射正确
   - 文字标签显示正常
   - 箭头方向正确

4. **编辑能力** ✅
   - 生成后可以手动移动节点
   - 可以修改文字
   - 可以调整样式
   - 可以删除元素

### 构建测试

```bash
npm run build
```
- ✅ 构建成功
- ✅ 无 TypeScript 错误
- ⚠️ 大文件警告（正常，来自 Excalidraw）

---

## 相关文档

- [项目概述](../../.claude/context/project-overview.md)
- [技术栈详情](../../.claude/context/tech-stack.md)
- [UI/UX 设计指南](../../docs/ui-ux-design-guide.md)
- [聊天面板可调整大小功能](./21-chat-panel-resizable.md)

---

## 总结

本次会话成功实现了从大模型到白板的完整转换流程：

1. ✅ **简化格式设计** - 大模型易于输出
2. ✅ **自动转换器** - 前端灵活处理
3. ✅ **演示界面** - 可视化展示流程
4. ✅ **可扩展性** - 支持未来功能扩展

**核心价值**：
- 降低了 AI 生成图表的技术门槛
- 提供了清晰的接口规范
- 为后续集成真实 AI 服务打下基础

**下一步工作**：
- 集成真实的 AI API
- 优化 Prompt 工程
- 添加更多布局算法
- 支持更多图表类型

---

**创建时间**: 2026-01-21
**最后更新**: 2026-01-21
**会话时长**: 约 45 分钟
**完成度**: 100%
**代码质量**: ✅ 构建通过，无错误
