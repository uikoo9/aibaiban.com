# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# AI 白板项目 - Claude Code 协作指南

> AI 驱动的在线协作白板工具 ([aibaiban.com](https://aibaiban.com/))

## 技术栈核心

- **前端**: React 19 + TypeScript + Vite 7
- **UI 框架**: Ant Design 6.2.1 (基础组件) + Ant Design X 2.1.3 (AI 组件) + Tailwind CSS v4
- **白板引擎**: Excalidraw 0.18.0 (手绘风格，MIT 协议)
- **路由**: React Router 7.12.0
- **后端**: Node.js (待实现)

## 关键架构决策

### 数据隔离机制
**重要**: 白板和聊天记录按用户ID隔离存储在 localStorage：
- 白板数据: `excalidraw-state-${userId}`
- 聊天历史: `chat-history-${userId}`
- 未登录用户使用 `guest` 作为 userId

### 主题系统
使用 Ant Design ConfigProvider 统一管理：
```tsx
<ConfigProvider
  theme={{
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: { colorPrimary: '#1677ff', borderRadius: 8 }
  }}
>
  <XProvider>{children}</XProvider>
</ConfigProvider>
```

### 构建配置特点
- **多页面应用**: `index.html` (静态落地页) + `board.html` (React SPA)
- **代码分割**: React、Ant Design、Excalidraw 独立打包
- **静态资源**: 生产环境使用 CDN (`https://static-small.vincentqiao.com/aibaiban/static/`)
- **输出目录**: `../shun-js/packages/aibaiban-server/static` (Monorepo 结构)

### 核心文档路径
- [Excalidraw 绘图指南](./docs/excalidraw-drawing-guide.md) ⭐ **必读** - 白板绘图核心机制
- [Ant Design 版本说明](./antd/README-NEW-VERSION.md) - 组件使用示例
- [开发流程规范](./.claude/context/development-workflow.md) - 开发检查清单
- [架构设计](./.claude/context/architecture.md) - 详细架构说明

---

## Excalidraw 白板开发 ⭐ 极其重要

**开发白板相关功能前，必须阅读**: [docs/excalidraw-drawing-guide.md](./docs/excalidraw-drawing-guide.md)

### 核心要点（错误会导致文字不显示）

1. **文字元素必需字段**:
   ```typescript
   {
     lineHeight: 1.25 as any,    // ← 必须！fontFamily 1 对应的行高
     originalText: text,         // ← 必须！原始文本
     autoResize: true,           // ← 必须！自动调整大小
   }
   ```

2. **容器绑定**（文字跟随形状移动）:
   ```typescript
   // 文字绑定到容器
   textElement.containerId = shapeId;
   // 容器引用文字
   shapeElement.boundElements = [{ type: 'text', id: textId }];
   ```

3. **支持的形状类型**:
   - ✅ `rectangle`, `ellipse`, `diamond`, `arrow`, `line`, `text`
   - ❌ `cylinder`, `hexagon`, `cloud` (需映射到支持的类型)

4. **常见错误**:
   - 缺少 lineHeight → 文字不显示
   - 文字 x 坐标错误 → x 应该是左边缘，不是中心点
   - 忘记设置双向绑定 → 文字不跟随形状移动

完整文档: [docs/excalidraw-drawing-guide.md](./docs/excalidraw-drawing-guide.md)

---

## UI 组件开发规范

### Ant Design 使用指南

**开发新组件时的参考顺序**:
1. [Ant Design 官方文档](https://ant.design/) - 查看组件用法和 API
2. [Ant Design X 官方文档](https://x.ant.design/) - AI 场景组件（如需要）
3. [antd/README-NEW-VERSION.md](./antd/README-NEW-VERSION.md) - 项目中的使用示例

### 常用组件速查

**基础组件**: `ConfigProvider` (主题), `Modal` (弹窗), `Form` (表单), `Button`, `Input`, `Dropdown`, `Avatar`

**AI 组件**: `XProvider` (全局配置), `Bubble.List` (消息列表), `Sender` (AI 输入框)

### 可访问性要求
- 所有交互元素都有明确的 aria-label
- 键盘导航支持（Tab 顺序合理）
- 焦点状态清晰可见
- 错误消息添加 `role="alert"`

---

## 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器 (http://localhost:3000)

# 构建
npm run build        # 生产构建（TypeScript → Vite build）
npm run build:analyze # 构建 + 包分析（可视化依赖关系）
npm run preview      # 预览构建结果

# 资源生成
npm run generate-icons # 生成 PNG 图标和 favicon.ico

# Git
git status           # 查看状态
git add .            # 暂存所有更改
git commit -m "type: description"  # 遵循 Conventional Commits
git log --oneline -5 # 查看最近 5 条提交记录
```

---

## 开发流程规范

### 文档同步规则（重要）
**每次项目有实质性更新时，必须同步更新相关文档**。详见：[开发流程规范](./.claude/context/development-workflow.md#文档同步规则-重要)

### Git 提交规范
遵循 Conventional Commits：
```bash
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式（不影响功能）
refactor: 重构
test: 测试相关
chore: 构建/工具配置
```

### 不要主动启动后台任务
- ❌ 不要主动运行 `npm run dev`
- ❌ 不要使用 `run_in_background: true`
- ✅ 只在用户明确要求时才启动服务

---

## 项目组织结构

```
aibaiban.com/
├── .claude/                       # Claude Code 协作记录
│   ├── context/                   # 项目上下文文档
│   ├── decisions/                 # 架构决策记录 (ADR)
│   └── sessions/                  # 开发会话记录
├── antd/                          # Ant Design 版本相关文档
│   └── README-NEW-VERSION.md      # ⭐ 组件使用示例
├── docs/                          # 技术文档
│   └── excalidraw-drawing-guide.md # ⭐ 白板绘图核心机制（必读）
├── prds/                          # 产品需求文档
├── src/                           # 前端应用源码
│   ├── main.tsx                   # 应用入口
│   ├── App.tsx                    # 根组件（路由配置）
│   ├── pages/
│   │   └── BoardAntd.tsx          # 白板主页面
│   ├── components/
│   │   ├── Auth/
│   │   │   └── LoginModalAntd.tsx # 登录弹窗
│   │   ├── Chat/
│   │   │   └── ChatPanelAntd.tsx  # AI 聊天面板
│   │   └── Whiteboard.tsx         # Excalidraw 集成组件
│   ├── hooks/
│   │   ├── useAuth.tsx            # 认证状态管理（Context API）
│   │   └── useChat.ts             # 聊天功能
│   ├── services/
│   │   ├── api.ts                 # 基础 API 封装
│   │   └── auth.ts                # 认证 API（短信、登录）
│   ├── types/
│   │   ├── auth.ts                # 认证类型
│   │   ├── chat.ts                # 聊天类型
│   │   ├── api.ts                 # API 响应类型
│   │   └── diagram.ts             # 图表类型（SimplifiedDiagram）
│   └── utils/
│       └── diagramConverter.ts    # 图表格式转换器
├── public/                        # 静态资源
├── package.json                   # 项目配置
└── vite.config.ts                 # Vite 构建配置
```

---

## 关键实现细节

### AI 图表生成流程
```
用户在聊天面板输入需求
  ↓
发送到 /intent API（判断是否为绘图请求）
  ↓
如果是绘图请求 → 调用 /draw API
  ↓
AI 返回 SimplifiedDiagram JSON
  {
    type: "architecture",
    title: "App 架构图",
    nodes: [{id, label, type, color}, ...],
    connections: [{from, to, label}, ...]
  }
  ↓
diagramConverter.convertDiagramToExcalidraw()
  - 自动布局（网格布局，150px 间距）
  - 颜色映射（6 种预定义颜色）
  - 生成 Excalidraw 元素（形状、文字、箭头）
  - 自动补全必需字段
  ↓
whiteboard.addAIGeneratedDiagram(elements)
  ↓
Excalidraw updateScene() 渲染到白板
```

### 页面布局架构
```
┌─────────────────────────────────────────────┐
│ Header (h-16)                               │
│  [Logo] AI白板  [AI生成] [登录] [主题]      │
├─────────────────────────────────────────────┤
│ Main Content (flex-1)                       │
│  ┌──────────────────┬────────────────────┐ │
│  │                  │                    │ │
│  │  Canvas Area     │  AI Panel          │ │
│  │  (flex-1)        │  (可调整宽度)      │ │
│  │                  │  280px-600px       │ │
│  │  Excalidraw      │  - 标题栏 (h-14)   │ │
│  │                  │  - 消息列表        │ │
│  │                  │  - 输入框          │ │
│  │                  │                    │ │
│  └──────────────────┴────────────────────┘ │
│       ↑ 可拖动分隔条（resize handle）       │
└─────────────────────────────────────────────┘
```

---

## 快速参考

### Ant Design Form 表单模板
```tsx
<Form
  form={form}
  onFinish={handleSubmit}
  layout="vertical"
>
  <Form.Item
    label="字段标签"
    name="fieldName"
    rules={[{ required: true, message: '请输入...' }]}
  >
    <Input placeholder="请输入..." />
  </Form.Item>

  <Form.Item>
    <Button type="primary" htmlType="submit" block>
      提交
    </Button>
  </Form.Item>
</Form>
```

### Ant Design X 聊天界面模板
```tsx
<Bubble.List
  items={messages.map(msg => ({
    key: msg.id,
    role: msg.role,
    content: msg.content,
    variant: msg.role === 'user' ? 'filled' : 'outlined',
    placement: msg.role === 'user' ? 'end' : 'start',
    avatar: <Avatar icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />} />,
  }))}
/>

<Sender
  value={inputValue}
  onChange={setInputValue}
  onSubmit={handleSend}
  placeholder="输入你的需求..."
/>
```

---

## 网络代理配置（如需访问外网）

```bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7890
```

详见：[开发环境配置](./.claude/context/dev-environment.md)

---

**最后更新**: 2026-02-03
**维护者**: Claude Code
**版本**: 3.0.0
