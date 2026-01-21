import type { SimplifiedDiagram } from '@/types/diagram'

/**
 * 颜色映射
 */
const COLOR_MAP = {
  blue: '#1971c2',
  green: '#2f9e44',
  purple: '#9c36b5',
  orange: '#f76707',
  red: '#e03131',
  gray: '#495057',
}

/**
 * 获取颜色（支持透明度）
 */
function getColor(colorName: string, alpha: number = 1): string {
  const hex = COLOR_MAP[colorName as keyof typeof COLOR_MAP] || COLOR_MAP.blue
  if (alpha === 1) return hex

  // 转换为 rgba
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `ai-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * 创建 Excalidraw 元素的公共字段
 */
function createBaseElement() {
  return {
    seed: Math.floor(Math.random() * 2147483647),
    version: 1,
    versionNonce: Math.floor(Math.random() * 2147483647),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    angle: 0,
    strokeWidth: 2,
    strokeStyle: 'solid' as const,
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: null,
  }
}

/**
 * 转换简化格式为 Excalidraw 格式
 */
export function convertDiagramToExcalidraw(diagram: SimplifiedDiagram): any[] {
  const elements: any[] = []
  const nodePositions: Record<string, { x: number; y: number; width: number; height: number }> = {}

  // 布局参数
  const NODE_WIDTH = 200
  const NODE_HEIGHT = 100
  const HORIZONTAL_SPACING = 150
  const VERTICAL_SPACING = 150
  const START_X = 100
  const START_Y = 100

  // 1. 计算节点布局（简单网格布局）
  const cols = Math.ceil(Math.sqrt(diagram.nodes.length))

  diagram.nodes.forEach((node, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)
    const x = START_X + col * (NODE_WIDTH + HORIZONTAL_SPACING)
    const y = START_Y + row * (NODE_HEIGHT + VERTICAL_SPACING)

    nodePositions[node.id] = { x, y, width: NODE_WIDTH, height: NODE_HEIGHT }

    // 创建形状元素
    const shapeType = node.type || 'rectangle'
    const color = node.color || 'blue'

    const shapeElement = {
      id: generateId(),
      type: shapeType,
      x,
      y,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      strokeColor: getColor(color),
      backgroundColor: getColor(color, 0.2),
      fillStyle: 'solid' as const,
      ...createBaseElement(),
    }

    // 矩形需要圆角
    if (shapeType === 'rectangle') {
      ;(shapeElement as any).roundness = { type: 3 }
    }

    elements.push(shapeElement)

    // 创建文字标签
    const lines = node.label.split('\n')
    const fontSize = 16
    const lineHeight = 20
    const textHeight = lines.length * lineHeight

    const textElement = {
      id: generateId(),
      type: 'text',
      x: x + NODE_WIDTH / 2,
      y: y + NODE_HEIGHT / 2 - textHeight / 2,
      width: NODE_WIDTH - 20,
      height: textHeight,
      text: node.label,
      fontSize,
      fontFamily: 1,
      textAlign: 'center' as const,
      verticalAlign: 'top' as const,
      strokeColor: '#000000',
      backgroundColor: 'transparent',
      fillStyle: 'solid' as const,
      ...createBaseElement(),
    }

    elements.push(textElement)
  })

  // 2. 创建连接线
  diagram.connections.forEach((conn) => {
    const fromNode = nodePositions[conn.from]
    const toNode = nodePositions[conn.to]

    if (!fromNode || !toNode) {
      console.warn(`Connection skipped: ${conn.from} -> ${conn.to} (node not found)`)
      return
    }

    // 计算箭头起点和终点
    const startX = fromNode.x + fromNode.width
    const startY = fromNode.y + fromNode.height / 2
    const endX = toNode.x
    const endY = toNode.y + toNode.height / 2

    const arrowElement = {
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
      ...createBaseElement(),
    }

    elements.push(arrowElement)

    // 如果有标签，添加文字
    if (conn.label) {
      const midX = startX + (endX - startX) / 2
      const midY = startY + (endY - startY) / 2

      const labelElement = {
        id: generateId(),
        type: 'text',
        x: midX - 30,
        y: midY - 20,
        width: 60,
        height: 20,
        text: conn.label,
        fontSize: 14,
        fontFamily: 1,
        textAlign: 'center' as const,
        verticalAlign: 'middle' as const,
        strokeColor: '#000000',
        backgroundColor: '#ffffff',
        fillStyle: 'solid' as const,
        ...createBaseElement(),
      }

      elements.push(labelElement)
    }
  })

  return elements
}
