# Ant Design X 组件库完整指南

> **代码库位置**: `/Users/vincent/Desktop/presence/x`
> **版本**: 基于最新主分支
> **文档日期**: 2026-01-23

---

## 📖 目录

1. [项目概述](#项目概述)
2. [RICH 设计范式](#rich-设计范式)
3. [包结构](#包结构)
4. [核心组件详解](#核心组件详解)
5. [使用示例](#使用示例)
6. [与当前项目对比](#与当前项目对比)
7. [迁移建议](#迁移建议)

---

## 项目概述

**Ant Design X** 是蚂蚁集团推出的专为 **AI 界面**设计的 React 组件库，基于 **RICH 交互范式**，为 AI 驱动的用户界面提供企业级解决方案。

### 核心特性

- 🌈 **企业级 AI 产品最佳实践**：基于 RICH 交互范式
- 🧩 **灵活的原子组件**：覆盖大部分 AI 场景
- ✨ **流式友好的 Markdown 渲染器**：支持公式、代码高亮、Mermaid 图表
- 🚀 **开箱即用的模型/代理集成**：轻松连接 OpenAI 兼容服务
- ⚡️ **高效的大模型数据流管理**：提供便捷的数据流管理
- 📦 **丰富的模板支持**：多种模板快速开发
- 🛡 **完整 TypeScript 支持**

### 与 Ant Design 的关系

- **依赖 Ant Design 5/6**：使用 antd 的基础组件和主题系统
- **扩展而非替代**：专注 AI 场景的高级组件
- **无缝集成**：���与 antd 组件混用

---

## RICH 设计范式

**RICH** 是 Ant Design X 的核心设计理论，取代传统的 WIMP（窗口、图标、菜单、指针）模式，专为 AI 时代设计：

### R - Role（角色）

AI 扮演特定角色/人设，匹配用户期望，确保交互顺畅。

**示例**：
- 技术助手
- 客服代表
- 创作伙伴

### I - Intention（意图）

AI 理解并响应用户意图，自动规划和执行任务。

**示例**：
- "帮我生成一个架构图" → AI 自动分析并创建图表
- "总结这篇文章" → AI 理解并生成摘要

### C - Conversation（对话）

通过对话细化模糊的用户意图。

**示例**：
- 用户："我想做个图"
- AI："您想做什么类型的图？流程图、架构图还是思维导图？"

### H - Hybrid UI（混合界面）

统一界面中集成多种交互模式（对话式 + 图形化）。

**示例**：
- 聊天框 + 白板
- 对话 + 表单
- 文本 + 可视化控件

---

## 包结构

### 1. @ant-design/x（主组件库）

核心 UI 组件，涵盖 AI 界面的各个交互阶段。

```bash
npm install @ant-design/x
```

**包含组件**：
- Bubble（消息气泡）
- Sender（发送框）
- Conversations（对话历史）
- Prompts（提示词）
- Welcome（欢迎页）
- Attachments（附件）
- ThoughtChain（思维链）
- Think（思考指示器）
- Sources（信息源）
- Actions（操作按钮）
- 等等...

### 2. @ant-design/x-sdk（数据流管理）

处理 AI 模型的数据流，提供便捷的 API。

```bash
npm install @ant-design/x-sdk
```

**功能**：
- `XRequest` - 处理流式 API 响应
- 数据流解析和事件管理
- 模型/代理集成支持
- 支持 OpenAI 兼容模型

### 3. @ant-design/x-markdown（Markdown 渲染）

流式友好、高性能的 Markdown 渲染器。

```bash
npm install @ant-design/x-markdown
```

**特性**：
- 基于 `marked` 解析器
- 流式渲染（渐进式增强）
- 代码语法高亮
- LaTeX 公式（支持流式）
- Mermaid 图表
- GFM（GitHub 风格 Markdown）
- 可自定义组件
- 丰富的插件系统

---

## 核心组件详解

### 1. Bubble（消息气泡）

**用途**：显示对话消息，支持丰富格式。

#### 主要 Props

```typescript
interface BubbleProps {
  // 内容
  content: ReactNode;

  // 位置：'start'（左）或 'end'（右）
  placement?: 'start' | 'end';

  // 变体：填充、描边、阴影、无边框
  variant?: 'filled' | 'outlined' | 'shadow' | 'borderless';

  // 形状：默认、圆角、切角
  shape?: 'default' | 'round' | 'corner';

  // 状态
  status?: 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';

  // 打字动画
  typing?: boolean | { step?: number; interval?: number };

  // 流式渲染
  streaming?: boolean;

  // 可编辑
  editable?: boolean;

  // 插槽
  avatar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  extra?: ReactNode;

  // 回调
  onTyping?: () => void;
  onTypingComplete?: () => void;
  onEditConfirm?: (value: string) => void;
  onEditCancel?: () => void;
}
```

#### 子组件

```tsx
// 消息列表
<Bubble.List
  items={[
    { key: '1', content: 'Hello!', role: 'user' },
    { key: '2', content: 'Hi!', role: 'ai' }
  ]}
  role={{
    user: { placement: 'end', variant: 'filled' },
    ai: { placement: 'start', typing: true }
  }}
/>

// 系统消息
<Bubble.System content="系统通知" />

// 分隔符
<Bubble.Divider>2026-01-23</Bubble.Divider>
```

#### 使用示例

```tsx
import { Bubble } from '@ant-design/x';

// 基础用法
<Bubble
  content="你好！我是 AI 助手。"
  placement="start"
  avatar={<Avatar>AI</Avatar>}
/>

// 打字效果
<Bubble
  content="正在思考..."
  typing={{ step: 5, interval: 100 }}
  onTypingComplete={() => console.log('完成')}
/>

// 流式渲染
<Bubble
  content={streamingText}
  streaming
/>
```

---

### 2. Sender（发送框）

**用途**：用户输入和消息提交界面。

#### 主要 Props

```typescript
interface SenderProps {
  // 值（受控）
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;

  // 提交
  onSubmit?: (value: string) => void;
  submitType?: 'enter' | 'shiftEnter';

  // 状态
  loading?: boolean;
  readOnly?: boolean;
  disabled?: boolean;

  // 文本区域
  placeholder?: string;
  autoSize?: boolean | { minRows?: number; maxRows?: number };

  // 语音输入
  allowSpeech?: boolean;
  onSpeechStart?: () => void;
  onSpeechEnd?: (text: string) => void;

  // 文件处理
  onPaste?: (event: ClipboardEvent) => void;
  onPasteFile?: (files: File[]) => void;

  // 插槽
  prefix?: ReactNode;
  suffix?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;

  // 附件
  attachments?: AttachmentsProps;
}
```

#### 子组件

```tsx
// 头部
<Sender.Header>
  <div>当前对话</div>
</Sender.Header>

// 模式切换
<Sender.Switch
  options={[
    { label: '智能', value: 'smart' },
    { label: '精确', value: 'precise' }
  ]}
/>
```

#### 使用示例

```tsx
import { Sender } from '@ant-design/x';

<Sender
  placeholder="输入消息..."
  autoSize={{ minRows: 1, maxRows: 4 }}
  loading={isLoading}
  onSubmit={(value) => {
    console.log('提交:', value);
  }}
  prefix={<Icon type="smile" />}
  suffix={
    <Button type="primary" icon={<SendOutlined />} />
  }
  attachments={{
    items: files,
    onRemove: (file) => handleRemove(file)
  }}
/>
```

---

### 3. Conversations（对话历史）

**用途**：管理和导航对话历史（侧边栏）。

#### 主要 Props

```typescript
interface ConversationsProps {
  // 对话列表
  items: ConversationItem[];

  // 选中项
  activeKey?: string;
  defaultActiveKey?: string;
  onActiveChange?: (key: string) => void;

  // 分组
  groupable?: boolean;
  defaultCollapsedKeys?: string[];
  onCollapse?: (keys: string[]) => void;

  // 菜单
  menu?: (item: ConversationItem) => MenuItems;
  onMenuClick?: (key: string, item: ConversationItem) => void;

  // 快捷键
  shortcuts?: Record<string, string>;
}

interface ConversationItem {
  key: string;
  label: ReactNode;
  group?: string;
  disabled?: boolean;
  icon?: ReactNode;
  timestamp?: number;
}
```

#### 子组件

```tsx
// 新建对话按钮
<Conversations.Creation
  onClick={() => createNewChat()}
>
  + 新对话
</Conversations.Creation>
```

#### 使用示例

```tsx
import { Conversations } from '@ant-design/x';

<Conversations
  items={[
    { key: '1', label: '关于项目的讨论', timestamp: Date.now() },
    { key: '2', label: '代码审查', group: '工作' },
    { key: '3', label: '周末计划', group: '生活' }
  ]}
  activeKey="1"
  groupable
  menu={(item) => [
    { key: 'rename', label: '重命名' },
    { key: 'delete', label: '删除', danger: true }
  ]}
  onMenuClick={(action, item) => {
    if (action === 'delete') {
      console.log('删除', item.key);
    }
  }}
/>
```

---

### 4. Prompts（提示词/快速开始）

**用途**：显示 AI 能力建议或快速任务模板。

#### 主要 Props

```typescript
interface PromptsProps {
  // 提示列表
  items: PromptItem[];

  // 布局
  direction?: 'horizontal' | 'vertical';
  wrap?: boolean;

  // 选择
  onSelect?: (item: PromptItem) => void;

  // 动画
  animation?: 'fadeIn' | 'fadeInLeft';
}

interface PromptItem {
  key: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  children?: PromptItem[]; // 嵌套子提示
}
```

#### 使用示例

```tsx
import { Prompts } from '@ant-design/x';

<Prompts
  direction="vertical"
  wrap
  items={[
    {
      key: '1',
      icon: <FileTextOutlined />,
      label: '生成流程图',
      description: '根据描述自动生成流程图'
    },
    {
      key: '2',
      icon: <BulbOutlined />,
      label: '头脑风暴',
      description: '帮你发散思维，产生新想法'
    },
    {
      key: '3',
      icon: <CodeOutlined />,
      label: '代码审查',
      description: '检查代码质量和最佳实践',
      children: [
        { key: '3-1', label: 'JavaScript' },
        { key: '3-2', label: 'Python' }
      ]
    }
  ]}
  onSelect={(item) => {
    console.log('选择:', item.label);
  }}
  animation="fadeIn"
/>
```

---

### 5. Welcome（欢迎页）

**用途**：空状态/初始加载页面。

#### 主要 Props

```typescript
interface WelcomeProps {
  // 变体
  variant?: 'filled' | 'borderless';

  // 内容
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
}
```

#### 使用示例

```tsx
import { Welcome } from '@ant-design/x';

<Welcome
  icon={<RobotOutlined style={{ fontSize: 64 }} />}
  title="欢迎使用 AI 白板"
  description="我可以帮你生成流程图、架构图、思维导图等"
  extra={
    <Space>
      <Button type="primary">开始使用</Button>
      <Button>查看示例</Button>
    </Space>
  }
/>
```

---

### 6. Attachments（附件上传）

**用途**：处理文件上传和显示文件列表。

#### 主要 Props

```typescript
interface AttachmentsProps {
  // 文件列表
  items?: AttachmentItem[];

  // 上传
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  onUpload?: (file: File) => Promise<AttachmentItem>;
  onRemove?: (item: AttachmentItem) => void;

  // 拖拽
  droppable?: boolean;

  // 占位符
  placeholder?: ReactNode | ((props: { upload: Function }) => ReactNode);

  // 样式
  maxCount?: number;
  disabled?: boolean;
}

interface AttachmentItem {
  uid: string;
  name: string;
  url?: string;
  status?: 'uploading' | 'done' | 'error';
  percent?: number;
}
```

#### 使用示例

```tsx
import { Attachments } from '@ant-design/x';

<Attachments
  items={files}
  droppable
  maxCount={5}
  beforeUpload={(file) => {
    if (file.size > 10 * 1024 * 1024) {
      message.error('文件大小不能超过 10MB');
      return false;
    }
    return true;
  }}
  onUpload={async (file) => {
    const url = await uploadToServer(file);
    return {
      uid: generateId(),
      name: file.name,
      url,
      status: 'done'
    };
  }}
  onRemove={(item) => {
    setFiles(files.filter(f => f.uid !== item.uid));
  }}
  placeholder={({ upload }) => (
    <Button icon={<PaperClipOutlined />} onClick={upload}>
      添加附件
    </Button>
  )}
/>
```

---

### 7. ThoughtChain（思维链）

**用途**：显示 AI 推理/思考过程的步骤链。

#### 主要 Props

```typescript
interface ThoughtChainProps {
  // 步骤列表
  items: ThoughtItem[];

  // 状态
  status?: 'pending' | 'success' | 'error';

  // 连接线
  connector?: 'solid' | 'dashed' | 'dotted' | false;

  // 动画
  blink?: boolean;

  // 折叠
  collapsible?: boolean;
}

interface ThoughtItem {
  key: string;
  title: ReactNode;
  description?: ReactNode;
  status?: 'pending' | 'processing' | 'success' | 'error';
  icon?: ReactNode;
}
```

#### 使用示例

```tsx
import { ThoughtChain } from '@ant-design/x';

<ThoughtChain
  items={[
    {
      key: '1',
      title: '分析用户需求',
      description: '理解用户想要生成架构图',
      status: 'success'
    },
    {
      key: '2',
      title: '规划系统模块',
      description: '确定前端、后端、数据库等模块',
      status: 'processing'
    },
    {
      key: '3',
      title: '生成图表代码',
      status: 'pending'
    }
  ]}
  connector="dashed"
  collapsible
/>
```

---

### 8. Think（思考指示器）

**用途**：显示 AI 正在思考/处理中。

#### 主要 Props

```typescript
interface ThinkProps {
  // 标题
  title?: ReactNode;

  // 加载动画
  loading?: boolean;

  // 图标
  icon?: ReactNode;

  // 闪烁效果
  blink?: boolean;

  // 折叠
  collapsible?: boolean;
}
```

#### 使用示例

```tsx
import { Think } from '@ant-design/x';

<Think
  title="正在思考最佳方案..."
  loading
  blink
/>
```

---

### 9. Sources（信息源引用）

**用途**：显示参考来源、引用或知识库链接。

#### 主要 Props

```typescript
interface SourcesProps {
  // 来源列表
  items: SourceItem[];

  // 显示模式
  mode?: 'carousel' | 'list';

  // 展示方式
  display?: 'inline' | 'popover';

  // 回调
  onClick?: (item: SourceItem) => void;

  // 折叠
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

interface SourceItem {
  key: string;
  title: ReactNode;
  url?: string;
  description?: ReactNode;
  icon?: ReactNode;
}
```

#### 使用示例

```tsx
import { Sources } from '@ant-design/x';

<Sources
  mode="carousel"
  items={[
    {
      key: '1',
      title: 'React 官方文档',
      url: 'https://react.dev',
      description: 'React 最新特性介绍'
    },
    {
      key: '2',
      title: 'MDN Web Docs',
      url: 'https://developer.mozilla.org',
      description: 'JavaScript 标准参考'
    }
  ]}
  onClick={(item) => {
    window.open(item.url, '_blank');
  }}
/>
```

---

### 10. Actions（操作按钮）

**用途**：上下文相关的操作工具栏。

#### 子组件

```tsx
// 复制按钮
<Actions.Copy
  content="要复制的内容"
  onCopy={() => message.success('已复制')}
/>

// 音频播放
<Actions.Audio
  url="https://example.com/audio.mp3"
/>

// 反馈按钮
<Actions.Feedback
  options={[
    { label: '很有帮助', value: 'good' },
    { label: '不太准确', value: 'bad' }
  ]}
  onFeedback={(value) => console.log(value)}
/>
```

#### 使用示例

```tsx
import { Actions } from '@ant-design/x';

<Actions
  items={[
    <Actions.Copy key="copy" content={messageContent} />,
    <Actions.Audio key="audio" url={audioUrl} />,
    <Actions.Feedback key="feedback" onFeedback={handleFeedback} />
  ]}
  animation="fadeIn"
/>
```

---

## XProvider（全局配置）

**用途**：为所有 X 组件提供全局配置和主题。

### 配置项

```typescript
interface XProviderProps {
  // 主题
  theme?: {
    token?: {
      // 颜色
      colorPrimary?: string;
      colorBgContainer?: string;
      // 圆角
      borderRadius?: number;
      // 等等...
    };
    algorithm?: Theme['algorithm'];
  };

  // 语言
  locale?: Locale;

  // 方向
  direction?: 'ltr' | 'rtl';

  // 组件覆盖
  components?: {
    bubble?: BubbleProps;
    sender?: SenderProps;
    conversations?: ConversationsProps;
    // ... 所有组件
  };
}
```

### 使用示例

```tsx
import { XProvider } from '@ant-design/x';
import zhCN from '@ant-design/x/locale/zh_CN';

<XProvider
  theme={{
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 8
    }
  }}
  locale={zhCN}
  components={{
    bubble: {
      variant: 'filled',
      shape: 'round'
    },
    sender: {
      autoSize: { minRows: 2, maxRows: 6 }
    }
  }}
>
  <App />
</XProvider>
```

---

## 使用示例

### 完整聊天界面

```tsx
import React, { useState } from 'react';
import {
  XProvider,
  Bubble,
  Sender,
  Conversations,
  Prompts,
  Welcome,
  ThoughtChain,
  Attachments
} from '@ant-design/x';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (value) => {
    const userMsg = {
      key: Date.now(),
      content: value,
      role: 'user',
      placement: 'end'
    };

    setMessages([...messages, userMsg]);
    setIsLoading(true);

    // 调用 AI API
    const response = await callAI(value);

    const aiMsg = {
      key: Date.now() + 1,
      content: response,
      role: 'ai',
      placement: 'start',
      typing: true
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <XProvider>
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* 左侧边栏 */}
        <div style={{ width: 280, borderRight: '1px solid #f0f0f0' }}>
          <Conversations
            items={conversations}
            activeKey={activeId}
            onActiveChange={setActiveId}
          />
        </div>

        {/* 主聊天区 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 消息列表 */}
          <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
            {messages.length === 0 ? (
              <Welcome
                title="开始对话"
                description="我可以帮你生成图表、回答问题"
                extra={
                  <Prompts
                    items={[
                      { key: '1', label: '生成架构图' },
                      { key: '2', label: '代码审查' }
                    ]}
                    onSelect={(item) => handleSend(item.label)}
                  />
                }
              />
            ) : (
              <Bubble.List
                items={messages}
                role={{
                  user: { placement: 'end', variant: 'filled' },
                  ai: { placement: 'start', variant: 'shadow' }
                }}
              />
            )}
          </div>

          {/* 输入框 */}
          <div style={{ borderTop: '1px solid #f0f0f0', padding: 16 }}>
            <Sender
              loading={isLoading}
              onSubmit={handleSend}
              placeholder="输入消息..."
              attachments={{
                items: files,
                onRemove: handleRemoveFile
              }}
            />
          </div>
        </div>
      </div>
    </XProvider>
  );
};
```

---

## 与当前项目对比

### 当前项目（AI 白板）

| 维度 | 当前实现 | Ant Design X |
|------|----------|--------------|
| **UI 框架** | DaisyUI 5 + Tailwind CSS | Ant Design 5/6 |
| **聊天组件** | 自定义 ChatPanel + MessageBubble | Bubble + Bubble.List（更成熟） |
| **发送框** | 自定义 + Lucide 图标 | Sender（功能更丰富） |
| **对话历史** | 暂无 | Conversations（完整实现） |
| **提示词** | 快捷按钮（btn-xs btn-outline） | Prompts（专业组件） |
| **附件上传** | 暂无 | Attachments（完整支持） |
| **思考过程** | Loading 状态 | ThoughtChain + Think（细粒度） |
| **Markdown** | 基础渲染 | @ant-design/x-markdown（流式支持） |
| **主题系统** | DaisyUI 32 个主题 | Ant Design 主题定制 |
| **TypeScript** | ✅ 完整支持 | ✅ 完整支持 |
| **流式渲染** | 手动实现 | ✅ 内置支持 |
| **可访问性** | 基础实现 | ✅ 企业级标准 |

### 功能对比

#### 当前有但 X 没有
- ❌ Excalidraw 白板集成
- ❌ 拖动调整聊天面板宽度
- ❌ 32 个预设主题

#### X 有但当前没有
- ✅ **Conversations** - 对话历史管理
- ✅ **Prompts** - 专业的提示词组件
- ✅ **Attachments** - 完整的附件系统
- ✅ **ThoughtChain** - 思维链展示
- ✅ **Sources** - 信息源引用
- ✅ **流式渲染** - 内置流式支持
- ✅ **@ant-design/x-sdk** - 数据流管理
- ✅ **成熟的生态** - 企业级支持

---

## 迁移建议

### 方案 1：渐进式迁移（推荐）

保留现有 Excalidraw 白板，仅迁移聊天部分：

```tsx
// 当前架构
<div className="flex">
  <Whiteboard /> {/* 保留 */}
  <ChatPanel />  {/* 替换为 Ant Design X */}
</div>

// 迁移后
<div className="flex">
  <Whiteboard />
  <XProvider>
    <div>
      <Bubble.List items={messages} />
      <Sender onSubmit={handleSend} />
    </div>
  </XProvider>
</div>
```

**优点**：
- 风险低
- 功能不中断
- 可以逐步迁移

**步骤**：
1. 安装 `@ant-design/x` 和 `antd`
2. 替换 `ChatPanel` → `Bubble.List`
3. 替换发送框 → `Sender`
4. 添加 `Conversations` 侧边栏
5. 集成 `Prompts` 快捷提示
6. 使用 `@ant-design/x-sdk` 优化数据流

### 方案 2：完全迁移

将 DaisyUI 替换为 Ant Design：

**优点**：
- 统一设计语言
- 企业级组件生态
- 更好的 TypeScript 支持
- 成熟的主题系统

**缺点**：
- 工作量较大
- 需要调整所有 UI 组件
- 可能需要重新设计

**步骤**：
1. 移除 DaisyUI 和 Tailwind CSS
2. 安装 Ant Design 和 @ant-design/x
3. 重写所有 UI 组件
4. 迁移主题配置
5. 调整样式和布局

### 方案 3：混合使用

保留 DaisyUI，仅在 AI 聊天区使用 Ant Design X：

```tsx
<div className="h-screen flex">
  {/* DaisyUI 区域 */}
  <div className="flex-1 bg-base-200">
    <Whiteboard />
  </div>

  {/* Ant Design X 区域 */}
  <ConfigProvider theme={{ ... }}>
    <XProvider>
      <div className="w-96 border-l">
        <Bubble.List items={messages} />
        <Sender onSubmit={handleSend} />
      </div>
    </XProvider>
  </ConfigProvider>
</div>
```

**优点**：
- 快速获得 X 的优势
- 保留现有投入
- 样式隔离

**缺点**：
- 两套设计语言
- 包体积增加
- 主题不统一

### 推荐实施路径

**阶段 1：评估和准备（1-2 天）**
- 搭建 Ant Design X Demo
- 对比组件功能
- 评估迁移成本
- 确定迁移方案

**阶段 2：核心组件迁移（3-5 天）**
- 替换 ChatPanel → Bubble.List
- 替换发送框 → Sender
- 集成流式渲染
- 测试核心功能

**阶段 3：增强功能（2-3 天）**
- 添加 Conversations 侧边栏
- 集成 Prompts 快捷提示
- 添加 Attachments 附件支持
- 优化用户体验

**阶段 4：优化和完善（1-2 天）**
- 性能优化
- 样式调整
- 主题定制
- 文档更新

**总计**：约 7-12 天完成渐进式迁移

---

## 核心代码示例

### 1. 基础聊天界面

```tsx
import { Bubble, Sender, XProvider } from '@ant-design/x';

function ChatInterface() {
  const [messages, setMessages] = useState([]);

  return (
    <XProvider>
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-auto p-4">
          <Bubble.List
            items={messages}
            role={{
              user: { placement: 'end', variant: 'filled' },
              ai: { placement: 'start', typing: true }
            }}
          />
        </div>

        <div className="border-t p-4">
          <Sender
            onSubmit={(value) => {
              setMessages([...messages, {
                key: Date.now(),
                content: value,
                role: 'user'
              }]);
            }}
          />
        </div>
      </div>
    </XProvider>
  );
}
```

### 2. 带侧边栏的完整界面

```tsx
import { Conversations, Bubble, Sender, XProvider } from '@ant-design/x';

function FullInterface() {
  const [activeChat, setActiveChat] = useState('1');
  const [conversations, setConversations] = useState([
    { key: '1', label: '今天的讨论' },
    { key: '2', label: '项目规划' }
  ]);

  return (
    <XProvider>
      <div className="flex h-screen">
        {/* 侧边栏 */}
        <div className="w-64 border-r">
          <Conversations
            items={conversations}
            activeKey={activeChat}
            onActiveChange={setActiveChat}
          >
            <Conversations.Creation onClick={() => createNewChat()}>
              + 新对话
            </Conversations.Creation>
          </Conversations>
        </div>

        {/* 主聊天区 */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto p-4">
            <Bubble.List items={messages} />
          </div>
          <div className="border-t p-4">
            <Sender onSubmit={handleSend} />
          </div>
        </div>
      </div>
    </XProvider>
  );
}
```

### 3. 流式渲染 + 思维链

```tsx
import { Bubble, ThoughtChain, Sender } from '@ant-design/x';

function StreamingChat() {
  const [currentMessage, setCurrentMessage] = useState('');
  const [thoughtSteps, setThoughtSteps] = useState([]);

  const handleSend = async (value) => {
    // 显示思维链
    setThoughtSteps([
      { key: '1', title: '理解问题', status: 'processing' }
    ]);

    // 流式接收响应
    const stream = await callAIStream(value);

    for await (const chunk of stream) {
      setCurrentMessage(prev => prev + chunk);
    }

    setThoughtSteps(prev => [
      ...prev,
      { key: '2', title: '生成回答', status: 'success' }
    ]);
  };

  return (
    <div>
      <ThoughtChain items={thoughtSteps} />

      <Bubble
        content={currentMessage}
        streaming
        placement="start"
      />

      <Sender onSubmit={handleSend} />
    </div>
  );
}
```

---

## 技术栈

- **React** 18+
- **Ant Design** 5.21.1+ / 6.1.1+
- **TypeScript** 5+
- **@ant-design/cssinjs** - CSS-in-JS 主题系统
- **@rc-component/*** - 底层工具组件
- **Mermaid** 11.12.1 - 图表渲染
- **react-syntax-highlighter** 16.1.0 - 代码高亮

---

## 参考资源

### 官方文档
- **官网**: https://x.ant.design
- **GitHub**: https://github.com/ant-design/x
- **组件概览**: https://x.ant.design/components/overview
- **模板示例**: https://x.ant.design/docs/playground/independent

### 学习资源
- **Discussions**: https://github.com/ant-design/x/discussions
- **Issues**: https://github.com/ant-design/x/issues
- **知乎专栏**: https://www.zhihu.com/column/c_1564262000561106944

### NPM 包
- `@ant-design/x` - 主组件库
- `@ant-design/x-sdk` - 数据流管理
- `@ant-design/x-markdown` - Markdown 渲染器

---

## 总结

Ant Design X 是一个**成熟、专业、功能丰富**的 AI 界面组件库，特别适合：

✅ **企业级 AI 应用**
- 完整的 TypeScript 支持
- 丰富的组件生态
- 成熟的主题系统
- 企业级可访问性

✅ **快速开发**
- 开箱即用的组件
- 丰富的示例和模板
- 流式渲染内置支持
- SDK 简化数据流管理

✅ **高质量 UI**
- 基于 RICH 设计范式
- 遵循企业级最佳实践
- 细粒度的样式定制
- 流畅的动画效果

对于 **AI 白板项目**，建议采用**渐进式迁移**方案：
1. 保留 Excalidraw 白板（核心功能）
2. 替换聊天组件为 Ant Design X
3. 逐步增强功能（对话历史、附件、思维链）
4. 评估后决定是否全面迁移

---

**文档生成日期**: 2026-01-23
**代码库版本**: 最新主分支
**维护者**: Claude Code
