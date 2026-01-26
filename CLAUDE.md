# AI 白板项目 - Claude Code 协作指南

> 该文件由 Claude Code 自动加载，包含项目核心信息和设计规范。

## 快速导航

### 重要：Ant Design 版本说明
**当前版本**：项目已全面迁移到 Ant Design + Ant Design X，提供企业级 UI 组件和 AI 场景专用组件。

**核心文档（按顺序阅读）**：
1. [Ant Design 官方文档](https://ant.design/) - 组件库完整文档
2. [Ant Design X 官方文档](https://x.ant.design/) - AI 组件库文档
3. [Ant Design 版本说明](./antd/README-NEW-VERSION.md) - 项目迁移记录和技术细节
4. [开发流程规范](./.claude/context/development-workflow.md) - 开发检查清单

---

## 项目上下文

### 项目简介
- **项目名称**: AI 白板 ([aibaiban.com](https://aibaiban.com/))
- **项目定位**: AI 驱动的在线协作白板工具
- **当前阶段**: 前端框架已完成，正在实现 AI 功能

### 技术栈
- **前端框架**: React 19.2.3 + TypeScript 5.9.3 + Vite 7.3.1
- **样式系统**: Tailwind CSS v4 + Ant Design 6.2.1 + Ant Design X 2.1.3
- **白板框架**: Excalidraw 0.18.0
- **构建工具**: npm 10.28.0
- **路由**: React Router 7.12.0

### 核心文档
- [项目概述](./.claude/context/project-overview.md)
- [技术栈详情](./.claude/context/tech-stack.md)
- [架构设计](./.claude/context/architecture.md)
- [产品需求](./prds/README.md)
- [Excalidraw 绘图指南](./docs/excalidraw-drawing-guide.md) ⭐ 必读：白板绘图核心机制
- [Ant Design 版本说明](./antd/README-NEW-VERSION.md) ⭐ 必读：组件使用和技术细节

---

## UI 开发规范 (重要)

### 开发新组件时的必读顺序
1. ✅ [Ant Design 官方文档](https://ant.design/) - 查看组件用法和 API
2. ✅ [Ant Design X 官方文档](https://x.ant.design/) - AI 组件（如有需要）
3. ✅ [Ant Design 版本说明](./antd/README-NEW-VERSION.md) - 查看项目已用组件和最佳实践
4. ✅ [开发流程](./.claude/context/development-workflow.md) - 遵循检查清单

### Ant Design 组件速查

#### 常用基础组件
| 组件 | 用途 | 项目中的使用 |
|------|------|------------|
| `ConfigProvider` | 全局配置（主题、语言） | BoardAntd - 主题切换 |
| `Modal` | 对话框 | LoginModalAntd - 登录弹窗 |
| `Form` | 表单管理 | LoginModalAntd - 表单验证 |
| `Input` | 输入框 | LoginModalAntd - 手机号/验证码 |
| `Button` | 按钮 | 所有组件 |
| `Dropdown` | 下拉菜单 | BoardAntd - 用户菜单、主题切换 |
| `Avatar` | 头像 | BoardAntd、ChatPanelAntd |
| `Alert` | 警告提示 | LoginModalAntd - 错误提示 |
| `Spin` | 加载指示器 | BoardAntd - 白板加载 |

#### Ant Design X AI 组件
| 组件 | 用途 | 项目中的使用 |
|------|------|------------|
| `XProvider` | 全局 AI 组件配置 | BoardAntd |
| `Bubble.List` | 消息列表 | ChatPanelAntd - 聊天消息展示 |
| `Sender` | AI 输入框 | ChatPanelAntd - 用户输入 |

### 主题配置

项目使用 ConfigProvider 管理主题：

```tsx
<ConfigProvider
  locale={zhCN}
  theme={{
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1677ff',  // 主色调
      borderRadius: 8,          // 圆角
      fontSize: 14,             // 字号
    },
  }}
>
  <XProvider>
    {/* 应用内容 */}
  </XProvider>
</ConfigProvider>
```

### 可访问性要点
- ✅ 所有交互元素都有明确的 aria-label
- ✅ 键盘导航支持（Tab 顺序合理）
- ✅ 焦点状态清晰可见
- ✅ 错误消息添加 `role="alert"`

---

## 项目组织结构

```
.claude/                       # Claude Code 协作记录
  ├── context/                # 项目上下文文档
  │   ├── project-overview.md # 项目概述
  │   ├── tech-stack.md       # 技术栈详情
  │   ├── architecture.md     # 架构设计
  │   └── development-workflow.md # 开发流程和规范
  ├── decisions/              # 架构决策记录 (ADR)
  └── sessions/               # 开发会话记录

antd/                          # Ant Design 版本相关文档
  ├── README-NEW-VERSION.md   # 版本说明 ⭐ 必读
  ├── ant-design-architecture-analysis.md # 架构分析
  ├── antd-x-guide.md         # Ant Design X 组件指南
  └── migration-analysis.md   # 迁移可行性分析

docs/                          # 技术文档
  ├── excalidraw-drawing-guide.md ⭐ 必读：白板绘图核心机制
  ├── Excalidraw集成方案.md   # 白板集成方案
  ├── 前端渲染方案选型.md      # 技术选型文档
  └── ...其他技术文档

prds/                          # 产品需求文档
  ├── README.md               # PRD 索引
  ├── 产品概述.md
  └── ...其他 PRD

src/                           # 前端应用源码
  ├── components/             # React 组件
  │   ├── Auth/              # 认证组件（登录模态框）
  │   ├── Chat/              # 聊天面板组件
  │   └── Whiteboard.tsx     # 白板核心组件
  ├── pages/                  # 页面组件
  │   └── BoardAntd.tsx      # 白板主页面
  ├── hooks/                  # 自定义 Hooks
  │   ├── useAuth.tsx        # 认证状态管理
  │   └── useChat.ts         # 聊天功能
  ├── services/               # API 服务层
  │   ├── api.ts             # 基础 API 封装
  │   └── auth.ts            # 认证 API
  ├── types/                  # TypeScript 类型定义
  │   ├── auth.ts            # 认证类型
  │   ├── chat.ts            # 聊天类型
  │   ├── api.ts             # API 响应类型
  │   └── diagram.ts         # 图表类型（SimplifiedDiagram）
  └── utils/                  # 工具函数
      └── diagramConverter.ts # 图表格式转换器

public/                        # 静态资源
package.json                   # 项目配置
vite.config.ts                # Vite 构建配置
```

---

## 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器 (http://localhost:5173)

# 构建
npm run build        # 生产构建

# 代码检查
npm run lint         # 代码检查（待配置）
npm run test         # 单元测试（待配置）

# Git
git status           # 查看状态
git add .            # 暂存所有更改
git commit -m "type: description"  # 遵循 Conventional Commits
git log --oneline -5 # 查看最近 5 条提交记录
```

---

## 开发流程规范

### UI 组件开发流程
1. ✅ **查看 Ant Design 文档**：https://ant.design/
2. ✅ **参考项目现有代码**：查看 `antd/README-NEW-VERSION.md` 中的示例
3. ✅ **编写代码**：遵循项目规范
4. ✅ **测试组件**：视觉检查 + 键盘导航 + 响应式

### 文档同步规则
**每次项目有实质性更新时，必须同步更新相关文档**。详见：[开发流程规范](./.claude/context/development-workflow.md#文档同步规则-重要)

### Excalidraw 白板开发 ⭐
**重要**：开发白板相关功能时，必须先阅读 [Excalidraw 绘图指南](./docs/excalidraw-drawing-guide.md)

**核心要点**：
1. **文字元素必需字段**：
   ```typescript
   {
     lineHeight: 1.25 as any,    // ← 必须！fontFamily 1 对应的行高
     originalText: text,         // ← 必须！原始文本
     autoResize: true,           // ← 必须！自动调整大小
   }
   ```

2. **容器绑定**（文字跟随形状）：
   ```typescript
   // 文字绑定到容器
   textElement.containerId = shapeId;

   // 容器引用文字
   shapeElement.boundElements = [{ type: 'text', id: textId }];
   ```

3. **支持的形状类型**：
   - ✅ rectangle、ellipse、diamond
   - ❌ cylinder、hexagon、cloud（需映射到支持的类型）

完整文档：[docs/excalidraw-drawing-guide.md](./docs/excalidraw-drawing-guide.md)

### 不要主动启动后台任务
- ❌ 不要主动运行 `npm run dev`
- ❌ 不要使用 `run_in_background: true`
- ✅ 只在用户明确要求时才启动服务

---

## 重要提醒

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

### 网络代理（如需访问外网）
```bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7890
```

详见：[开发环境配置](./.claude/context/dev-environment.md)

---

## 项目特定的 Slash Commands

项目中已配置以下自定义命令（如果可用）：
- `/init` - 初始化 CLAUDE.md 文档
- `/pr-comments` - 获取 GitHub PR 评论
- `/review` - 审查 PR
- `/security-review` - 安全审查

---

## 快速参考卡片

### 标准 Ant Design Form 表单
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

### 标准 Ant Design X 聊天界面
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

**最后更新**: 2026-01-26
**维护者**: Claude Code
**版本**: 2.0.0 (Ant Design 版本)
