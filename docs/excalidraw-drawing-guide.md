# Excalidraw 绘图机制深度解析

> 基于 Excalidraw 源码分析的完整绘图指南
> 源码版本：Excalidraw v0.18.0
> 文档日期：2026-01-23

---

## 目录

1. [核心类型定义](#核心类型定义)
2. [文字元素详解](#文字元素详解)
3. [容器绑定机制](#容器绑定机制)
4. [元素创建最佳实践](#元素创建最佳实践)
5. [常见问题与解决方案](#常见问题与解决方案)
6. [完整示例代码](#完整示例代码)

---

## 核心类型定义

### ExcalidrawTextElement 接口

```typescript
export type ExcalidrawTextElement = _ExcalidrawElementBase &
  Readonly<{
    type: "text";
    fontSize: number;
    fontFamily: FontFamilyValues;  // 1, 2, 3, 4, 5
    text: string;
    textAlign: TextAlign;  // "left" | "center" | "right"
    verticalAlign: VerticalAlign;  // "top" | "middle" | "bottom"
    containerId: ExcalidrawGenericElement["id"] | null;
    originalText: string;  // ← 必需字段！
    autoResize: boolean;   // ← 必需字段！
    lineHeight: number & { _brand: "unitlessLineHeight" };  // ← 必需字段！
  }>;
```

### 关键字段说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `lineHeight` | `number` | ✅ | 无单位行高（如 1.25），根据 fontFamily 确定 |
| `originalText` | `string` | ✅ | 原始文本，用于换行计算和编辑 |
| `autoResize` | `boolean` | ✅ | 是否自动调整大小，容器内文本通常为 `true` |
| `containerId` | `string \| null` | ❌ | 绑定的容器 ID（矩形、椭圆、菱形等） |
| `verticalAlign` | `string` | ❌ | 容器内垂直对齐，使用 `"middle"` 居中 |

---

## 文字元素详解

### 1. lineHeight 字段

**重要性**：`lineHeight` 是文字元素的**必需字段**，缺失会导致渲染失败。

#### 不同字体的行高值

```typescript
// 来自 Excalidraw 源码：font-metadata.ts
const FONT_METADATA = {
  [FONT_FAMILY.Excalifont]: {  // fontFamily: 1
    metrics: { lineHeight: 1.25 }
  },
  [FONT_FAMILY.Nunito]: {      // fontFamily: 2
    metrics: { lineHeight: 1.25 }
  },
  [FONT_FAMILY.Cascadia]: {    // fontFamily: 3
    metrics: { lineHeight: 1.2 }
  },
  [FONT_FAMILY.Assistant]: {   // fontFamily: 4
    metrics: { lineHeight: 1.2 }
  },
  [FONT_FAMILY.Liberteen]: {   // fontFamily: 5
    metrics: { lineHeight: 1.25 }
  },
};
```

#### 如何使用

```typescript
// 方案1：硬编码（适用于固定字体）
const textElement = {
  // ...
  fontFamily: 1,
  lineHeight: 1.25 as any,  // fontFamily 1 对应的行高
};

// 方案2：使用 Excalidraw 工具函数（推荐）
import { getLineHeight } from '@excalidraw/common';

const lineHeight = getLineHeight(fontFamily);
```

### 2. originalText 字段

**作用**：
- 保存未处理的原始文本
- 用于文本编辑时恢复
- 用于文本换行和测量计算

**设置方式**：
```typescript
const textElement = {
  text: "用户\n服务",
  originalText: "用户\n服务",  // 通常与 text 相同
};
```

### 3. autoResize 字段

**作用**：
- `true`：文本宽度自动适应内容（默认行为）
- `false`：文本宽度固定，内容换行

**使用场景**：
```typescript
// 独立文本（不绑定容器）
const independentText = {
  autoResize: true,  // 自动调整
  containerId: null,
};

// 容器内文本
const containerText = {
  autoResize: true,  // 容器内文本通常也是 true
  containerId: shapeId,
};
```

---

## 容器绑定机制

### 什么是容器绑定？

容器绑定允许文字元素"附着"在形状元素（矩形、椭圆、菱形）上，当形状移动或缩放时，文字会自动跟随。

### 双向绑定关系

```
┌──────────────────┐
│  Rectangle       │
│  boundElements:  │ ──┐
│  [{ type: "text",│   │
│     id: "text1" }]   │  双向引用
└──────────────────┘   │
                       │
┌──────────────────┐   │
│  Text            │   │
│  containerId:    │ ──┘
│  "rectangle1"    │
└──────────────────┘
```

### 正确实现步骤

#### 步骤 1：创建容器元素

```typescript
const shapeId = generateId();
const shapeElement = {
  id: shapeId,
  type: 'rectangle',  // 或 'ellipse', 'diamond'
  x: 100,
  y: 100,
  width: 200,
  height: 100,
  strokeColor: '#1971c2',
  backgroundColor: 'rgba(25, 113, 194, 0.2)',
  fillStyle: 'solid',
  boundElements: null,  // 稍后设置
  // ... 其他字段
};
```

#### 步骤 2：创建文字元素并设置 containerId

```typescript
const textElement = {
  id: generateId(),
  type: 'text',
  x: 110,  // 相对于容器的位置
  y: 140,
  width: 180,
  height: 20,
  text: '用户服务',
  fontSize: 16,
  fontFamily: 1,
  textAlign: 'center',
  verticalAlign: 'middle',
  containerId: shapeId,  // ← 绑定到容器
  originalText: '用户服务',
  lineHeight: 1.25 as any,
  autoResize: true,
  // ... 其他字段
};
```

#### 步骤 3：更新容器的 boundElements

```typescript
shapeElement.boundElements = [
  { type: 'text', id: textElement.id }
];
```

### 完整示例

```typescript
function createTextContainer(label: string) {
  const shapeId = generateId();

  // 1. 创建容器
  const shape = {
    id: shapeId,
    type: 'rectangle',
    x: 100,
    y: 100,
    width: 200,
    height: 100,
    // ... 其他字段
  };

  // 2. 创建文字
  const text = {
    id: generateId(),
    type: 'text',
    text: label,
    containerId: shapeId,
    originalText: label,
    lineHeight: 1.25 as any,
    autoResize: true,
    // ... 其他字段
  };

  // 3. 建立双向绑定
  shape.boundElements = [{ type: 'text', id: text.id }];

  return [shape, text];
}
```

---

## 元素创建最佳实践

### 1. 使用官方元素创建函数（推荐）

```typescript
import { newElement, newTextElement } from '@excalidraw/element';
import { getLineHeight } from '@excalidraw/common';

// 创建形状
const shape = newElement({
  type: 'rectangle',
  x: 100,
  y: 100,
  width: 200,
  height: 100,
  strokeColor: '#1971c2',
  backgroundColor: 'rgba(25, 113, 194, 0.2)',
  fillStyle: 'solid',
});

// 创建文字（自动处理 lineHeight 等字段）
const text = newTextElement({
  text: '用户服务',
  x: 200,  // 中心点
  y: 150,
  fontSize: 16,
  fontFamily: 1,
  textAlign: 'center',
  verticalAlign: 'middle',
  containerId: shape.id,
  lineHeight: getLineHeight(1),  // 自动获取正确的行高
  autoResize: true,
});

// 更新绑定
shape.boundElements = [{ type: 'text', id: text.id }];
```

### 2. 手动创建元素（当无法使用官方包时）

#### 必需字段清单

```typescript
const textElement = {
  // ===== 基础字段 =====
  id: generateId(),
  type: 'text',
  x: number,
  y: number,
  width: number,
  height: number,

  // ===== 文字特有字段 =====
  text: string,
  fontSize: number,
  fontFamily: 1 | 2 | 3 | 4 | 5,
  textAlign: 'left' | 'center' | 'right',
  verticalAlign: 'top' | 'middle' | 'bottom',

  // ===== 必需字段（容易遗漏）=====
  lineHeight: 1.25 as any,  // ← 必须！
  originalText: string,     // ← 必须！
  autoResize: true,         // ← 必须！
  containerId: string | null,

  // ===== 样式字段 =====
  strokeColor: string,
  backgroundColor: string,
  fillStyle: 'solid' | 'hachure' | 'cross-hatch',

  // ===== 通用字段 =====
  angle: 0,
  opacity: 100,
  strokeWidth: 2,
  strokeStyle: 'solid' | 'dashed' | 'dotted',
  roughness: 1,
  seed: Math.floor(Math.random() * 2147483647),
  version: 1,
  versionNonce: Math.floor(Math.random() * 2147483647),
  isDeleted: false,
  groupIds: [],
  frameId: null,
  roundness: null,
  boundElements: null,
  updated: Date.now(),
  link: null,
  locked: false,
};
```

### 3. 坐标计算

#### 文字居中在容器内

```typescript
function calculateTextPosition(
  container: { x: number; y: number; width: number; height: number },
  text: { width: number; height: number }
) {
  return {
    x: container.x + (container.width - text.width) / 2,
    y: container.y + (container.height - text.height) / 2,
  };
}

// 使用
const textPos = calculateTextPosition(
  { x: 100, y: 100, width: 200, height: 100 },
  { width: 180, height: 20 }
);
// 结果: { x: 110, y: 140 }
```

#### 文字高度计算

```typescript
function calculateTextHeight(
  text: string,
  fontSize: number,
  lineHeight: number
): number {
  const lines = text.split('\n');
  return fontSize * lineHeight * lines.length;
}

// 使用
const textHeight = calculateTextHeight('用户\n服务', 16, 1.25);
// 结果: 40 (16 * 1.25 * 2)
```

---

## 常见问题与解决方案

### 问题 1：文字不显示

**症状**：形状元素正常显示，但文字不可见，刷新页面后文字出现。

**原因**：缺少 `lineHeight`、`originalText` 或 `autoResize` 必需字段。

**解决方案**：
```typescript
const textElement = {
  // ... 其他字段
  lineHeight: 1.25 as any,  // ← 添加
  originalText: node.label,  // ← 添加
  autoResize: true,          // ← 添加
};
```

### 问题 2：文字位置错误

**症状**：文字偏移、不居中、超出容器范围。

**原因**：
1. 坐标计算错误（x 应该是左边缘，不是中心点）
2. 没有考虑 textAlign 和 verticalAlign
3. 高度计算错误

**解决方案**：
```typescript
// ❌ 错误：x 使用中心点
x: containerX + containerWidth / 2,

// ✅ 正确：x 使用左边缘 + 居中偏移
x: containerX + (containerWidth - textWidth) / 2,

// 或者使用左边距 + textAlign: 'center'
x: containerX + 10,  // 左边距
textAlign: 'center',  // 文字在可用宽度内居中
```

### 问题 3：容器和文字不同步移动

**症状**：移动形状时，文字没有跟随。

**原因**：没有正确设置 `containerId` 和 `boundElements` 的双向绑定。

**解决方案**：
```typescript
// 1. 文字元素设置 containerId
textElement.containerId = shapeElement.id;

// 2. 容器元素设置 boundElements
shapeElement.boundElements = [
  { type: 'text', id: textElement.id }
];
```

### 问题 4：Excalidraw 报错 "Unimplemented type"

**症状**：控制台错误 `Error: Unimplemented type cylinder/hexagon/cloud`

**原因**：使用了 Excalidraw 不支持的形状类型。

**支持的类型**：
- ✅ `rectangle` (矩形)
- ✅ `ellipse` (椭圆)
- ✅ `diamond` (菱形)
- ✅ `arrow` (箭头)
- ✅ `line` (线)
- ✅ `text` (文字)
- ❌ `cylinder` (不支持)
- ❌ `hexagon` (不支持)
- ❌ `cloud` (不支持)

**解决方案**：映射到支持的类型
```typescript
function mapShapeType(type: string) {
  switch (type) {
    case 'cylinder': return 'ellipse';  // 数据库 → 椭圆
    case 'hexagon': return 'diamond';   // 中间件 → 菱形
    case 'cloud': return 'ellipse';     // 云服务 → 椭圆
    default: return 'rectangle';
  }
}
```

---

## 完整示例代码

### 示例 1：创建带文字的矩形

```typescript
import type { SimplifiedDiagram } from '@/types/diagram';

function createRectangleWithText(
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  color: string
) {
  const generateId = () => `ai-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  // 1. 创建矩形
  const shapeId = generateId();
  const shape = {
    id: shapeId,
    type: 'rectangle',
    x,
    y,
    width,
    height,
    strokeColor: color,
    backgroundColor: color + '33',  // 20% 透明度
    fillStyle: 'solid' as const,
    strokeWidth: 2,
    strokeStyle: 'solid' as const,
    roughness: 1,
    opacity: 100,
    angle: 0,
    seed: Math.floor(Math.random() * 2147483647),
    version: 1,
    versionNonce: Math.floor(Math.random() * 2147483647),
    isDeleted: false,
    groupIds: [],
    frameId: null,
    roundness: { type: 3 },  // 圆角
    boundElements: null as any,  // 稍后设置
    updated: Date.now(),
    link: null,
    locked: false,
  };

  // 2. 计算文字尺寸
  const fontSize = 16;
  const lineHeight = 1.25;
  const lines = label.split('\n');
  const textHeight = fontSize * lineHeight * lines.length;
  const textWidth = width - 20;  // 左右各留10px边距

  // 3. 创建文字元素
  const textId = generateId();
  const text = {
    id: textId,
    type: 'text',
    x: x + 10,  // 左边距
    y: y + (height - textHeight) / 2,  // 垂直居中
    width: textWidth,
    height: textHeight,
    text: label,
    fontSize,
    fontFamily: 1,
    textAlign: 'center' as const,
    verticalAlign: 'middle' as const,
    strokeColor: '#000000',
    backgroundColor: 'transparent',
    fillStyle: 'solid' as const,
    containerId: shapeId,  // ← 绑定到矩形
    originalText: label,   // ← 必需
    lineHeight: lineHeight as any,  // ← 必需
    autoResize: true,      // ← 必需
    strokeWidth: 2,
    strokeStyle: 'solid' as const,
    roughness: 1,
    opacity: 100,
    angle: 0,
    seed: Math.floor(Math.random() * 2147483647),
    version: 1,
    versionNonce: Math.floor(Math.random() * 2147483647),
    isDeleted: false,
    groupIds: [],
    frameId: null,
    roundness: null,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
  };

  // 4. 建立双向绑定
  shape.boundElements = [{ type: 'text', id: textId }];

  return [shape, text];
}

// 使用示例
const [rectangle, text] = createRectangleWithText(
  100,  // x
  100,  // y
  200,  // width
  100,  // height
  '用户服务',
  '#1971c2'
);

// 添加到 Excalidraw
excalidrawAPI.updateScene({
  elements: [
    ...excalidrawAPI.getSceneElements(),
    rectangle,
    text,
  ],
});
```

### 示例 2：创建箭头连接

```typescript
function createArrowWithLabel(
  fromNode: { x: number; y: number; width: number; height: number },
  toNode: { x: number; y: number; width: number; height: number },
  label?: string
) {
  const generateId = () => `ai-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  // 1. 计算连接点（智能选择最佳边）
  const fromCenterX = fromNode.x + fromNode.width / 2;
  const fromCenterY = fromNode.y + fromNode.height / 2;
  const toCenterX = toNode.x + toNode.width / 2;
  const toCenterY = toNode.y + toNode.height / 2;

  const dx = toCenterX - fromCenterX;
  const dy = toCenterY - fromCenterY;

  let startX, startY, endX, endY;

  if (Math.abs(dx) > Math.abs(dy)) {
    // 水平连接
    if (dx > 0) {
      startX = fromNode.x + fromNode.width;
      startY = fromCenterY;
      endX = toNode.x;
      endY = toCenterY;
    } else {
      startX = fromNode.x;
      startY = fromCenterY;
      endX = toNode.x + toNode.width;
      endY = toCenterY;
    }
  } else {
    // 垂直连接
    if (dy > 0) {
      startX = fromCenterX;
      startY = fromNode.y + fromNode.height;
      endX = toCenterX;
      endY = toNode.y;
    } else {
      startX = fromCenterX;
      startY = fromNode.y;
      endX = toCenterX;
      endY = toNode.y + toNode.height;
    }
  }

  // 2. 创建箭头
  const arrow = {
    id: generateId(),
    type: 'arrow',
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY,
    points: [
      [0, 0],
      [endX - startX, endY - startY],
    ],
    strokeColor: '#000000',
    backgroundColor: 'transparent',
    fillStyle: 'solid' as const,
    startBinding: null,
    endBinding: null,
    startArrowhead: null,
    endArrowhead: 'arrow' as const,
    strokeWidth: 2,
    strokeStyle: 'solid' as const,
    roughness: 1,
    opacity: 100,
    angle: 0,
    seed: Math.floor(Math.random() * 2147483647),
    version: 1,
    versionNonce: Math.floor(Math.random() * 2147483647),
    isDeleted: false,
    groupIds: [],
    frameId: null,
    roundness: null,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
  };

  const elements = [arrow];

  // 3. 如果有标签，创建文字元素
  if (label) {
    const midX = startX + (endX - startX) / 2;
    const midY = startY + (endY - startY) / 2;
    const fontSize = 12;
    const lineHeight = 1.25;
    const textHeight = fontSize * lineHeight;

    const text = {
      id: generateId(),
      type: 'text',
      x: midX - 30,
      y: midY - textHeight / 2,
      width: 60,
      height: textHeight,
      text: label,
      fontSize,
      fontFamily: 1,
      textAlign: 'center' as const,
      verticalAlign: 'middle' as const,
      strokeColor: '#495057',
      backgroundColor: '#ffffff',
      fillStyle: 'solid' as const,
      containerId: null,  // 独立文字
      originalText: label,
      lineHeight: lineHeight as any,
      autoResize: true,
      strokeWidth: 2,
      strokeStyle: 'solid' as const,
      roughness: 1,
      opacity: 100,
      angle: 0,
      seed: Math.floor(Math.random() * 2147483647),
      version: 1,
      versionNonce: Math.floor(Math.random() * 2147483647),
      isDeleted: false,
      groupIds: [],
      frameId: null,
      roundness: null,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
    };

    elements.push(text);
  }

  return elements;
}

// 使用示例
const arrowElements = createArrowWithLabel(
  { x: 100, y: 100, width: 200, height: 100 },  // from
  { x: 400, y: 100, width: 200, height: 100 },  // to
  'HTTP'  // label
);
```

---

## 调试技巧

### 1. 检查文字元素字段

在浏览器控制台执行：

```javascript
// 获取所有文字元素
const textElements = window.excalidrawAPI
  .getSceneElements()
  .filter(el => el.type === 'text');

// 检查必需字段
textElements.forEach(el => {
  console.log({
    id: el.id,
    text: el.text,
    hasLineHeight: !!el.lineHeight,
    lineHeight: el.lineHeight,
    hasOriginalText: !!el.originalText,
    hasAutoResize: el.autoResize !== undefined,
    containerId: el.containerId,
  });
});

// 检查是否有缺失字段
const missingFields = textElements.filter(
  el => !el.lineHeight || !el.originalText || el.autoResize === undefined
);
console.log('缺失必需字段的元素:', missingFields);
```

### 2. 检查容器绑定

```javascript
// 获取所有容器元素
const containers = window.excalidrawAPI
  .getSceneElements()
  .filter(el => ['rectangle', 'ellipse', 'diamond'].includes(el.type));

// 检查绑定关系
containers.forEach(container => {
  const boundTexts = container.boundElements?.filter(b => b.type === 'text') || [];
  console.log({
    containerId: container.id,
    containerType: container.type,
    boundTextCount: boundTexts.length,
    boundTextIds: boundTexts.map(b => b.id),
  });

  // 验证反向引用
  boundTexts.forEach(bound => {
    const text = window.excalidrawAPI
      .getSceneElements()
      .find(el => el.id === bound.id);

    if (text && text.containerId !== container.id) {
      console.error('绑定不一致！', {
        textId: text.id,
        textContainerId: text.containerId,
        expectedContainerId: container.id,
      });
    }
  });
});
```

### 3. 手动修复元素

```javascript
// 修复缺失 lineHeight 的文字元素
const textElements = window.excalidrawAPI
  .getSceneElements()
  .filter(el => el.type === 'text' && !el.lineHeight);

if (textElements.length > 0) {
  const fixedElements = window.excalidrawAPI
    .getSceneElements()
    .map(el => {
      if (el.type === 'text' && !el.lineHeight) {
        return {
          ...el,
          lineHeight: 1.25,
          originalText: el.originalText || el.text,
          autoResize: el.autoResize ?? true,
        };
      }
      return el;
    });

  window.excalidrawAPI.updateScene({ elements: fixedElements });
  console.log(`✅ 修复了 ${textElements.length} 个文字元素`);
}
```

---

## 参考资源

- **Excalidraw 官方仓库**: https://github.com/excalidraw/excalidraw
- **类型定义**: `packages/excalidraw/element/types.ts`
- **元素创建**: `packages/excalidraw/element/newElement.ts`
- **字体元数据**: `packages/common/font-metadata.ts`
- **测试案例**: `packages/excalidraw/tests/` 目录

---

## 更新日志

| 日期 | 版本 | 更新内容 |
|------|------|----------|
| 2026-01-23 | 1.0.0 | 初始版本，基于 Excalidraw v0.18.0 源码分析 |

---

**文档维护者**: AI 白板团队
**最后更新**: 2026-01-23
