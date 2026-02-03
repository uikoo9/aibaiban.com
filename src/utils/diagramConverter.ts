import type { SimplifiedDiagram, ConnectionRouting } from '@/types/diagram'

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
  yellow: '#ffd43b',
  pink: '#e64980',
  black: '#000000',
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
 * 根据边和比例计算节点边缘上的坐标点
 * @param node 节点信息（x, y, width, height）
 * @param side 边（top/right/bottom/left）
 * @param ratio 位置比例（0.0-1.0），默认 0.5（中点）
 */
function getPointOnSide(
  node: { x: number; y: number; width: number; height: number },
  side: 'top' | 'right' | 'bottom' | 'left',
  ratio: number = 0.5
): { x: number; y: number } {
  // 确保 ratio 在 0-1 范围内
  ratio = Math.max(0, Math.min(1, ratio))

  switch (side) {
    case 'top':
      return {
        x: node.x + node.width * ratio,
        y: node.y,
      }
    case 'right':
      return {
        x: node.x + node.width,
        y: node.y + node.height * ratio,
      }
    case 'bottom':
      return {
        x: node.x + node.width * ratio,
        y: node.y + node.height,
      }
    case 'left':
      return {
        x: node.x,
        y: node.y + node.height * ratio,
      }
  }
}

/**
 * ⭐ 改进版：根据 routing 配置计算连接点
 * 如果提供了 routing，使用精确的 exitSide/entrySide 和 ratio
 * 否则使用自动算法（根据节点相对位置）
 */
function calculateConnectionPoints(
  fromNode: { x: number; y: number; width: number; height: number },
  toNode: { x: number; y: number; width: number; height: number },
  routing?: ConnectionRouting
): { startX: number; startY: number; endX: number; endY: number } {
  // 如果提供了 routing 配置，使用精确路由
  if (routing?.exitSide && routing?.entrySide) {
    const exitRatio = routing.exitRatio ?? 0.5  // 默认中点
    const entryRatio = routing.entryRatio ?? 0.5

    const startPoint = getPointOnSide(fromNode, routing.exitSide, exitRatio)
    const endPoint = getPointOnSide(toNode, routing.entrySide, entryRatio)

    console.log(
      `[Routing] Using custom routing: ${routing.exitSide}(${exitRatio}) → ${routing.entrySide}(${entryRatio})`
    )

    return {
      startX: startPoint.x,
      startY: startPoint.y,
      endX: endPoint.x,
      endY: endPoint.y,
    }
  }

  // 否则使用自动算法（保留原有逻辑）
  const fromCenterX = fromNode.x + fromNode.width / 2
  const fromCenterY = fromNode.y + fromNode.height / 2
  const toCenterX = toNode.x + toNode.width / 2
  const toCenterY = toNode.y + toNode.height / 2

  const dx = toCenterX - fromCenterX
  const dy = toCenterY - fromCenterY

  let startX: number, startY: number, endX: number, endY: number

  // 根据相对位置选择连接点
  if (Math.abs(dx) > Math.abs(dy)) {
    // 水平方向距离更大 → 从左右边连接
    if (dx > 0) {
      // toNode 在 fromNode 右边
      startX = fromNode.x + fromNode.width  // 从右边出发
      startY = fromCenterY
      endX = toNode.x  // 到达左边
      endY = toCenterY
    } else {
      // toNode 在 fromNode 左边
      startX = fromNode.x  // 从左边出发
      startY = fromCenterY
      endX = toNode.x + toNode.width  // 到达右边
      endY = toCenterY
    }
  } else {
    // 垂直方向距离更大 → 从上下边连接
    if (dy > 0) {
      // toNode 在 fromNode 下方
      startX = fromCenterX
      startY = fromNode.y + fromNode.height  // 从底边出发
      endX = toCenterX
      endY = toNode.y  // 到达顶边
    } else {
      // toNode 在 fromNode 上方
      startX = fromCenterX
      startY = fromNode.y  // 从顶边出发
      endX = toCenterX
      endY = toNode.y + toNode.height  // 到达底边
    }
  }

  return { startX, startY, endX, endY }
}

/**
 * 将 SimplifiedDiagram 中的形状类型映射到 Excalidraw 支持的类型
 * Excalidraw 只支持：rectangle, ellipse, diamond, arrow, line, text
 */
function mapShapeType(type?: string): 'rectangle' | 'ellipse' | 'diamond' {
  switch (type) {
    case 'rectangle':
      return 'rectangle'
    case 'ellipse':
      return 'ellipse'
    case 'diamond':
      return 'diamond'
    case 'cylinder':
      // 圆柱体（数据库）→ 椭圆
      return 'ellipse'
    case 'hexagon':
      // 六边形（处理器/中间件）→ 菱形
      return 'diamond'
    case 'cloud':
      // 云形（云服务）→ 椭圆
      return 'ellipse'
    default:
      return 'rectangle'
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

  // 1. 计算节点布局
  const cols = Math.ceil(Math.sqrt(diagram.nodes.length))

  diagram.nodes.forEach((node, index) => {
    // 优先使用 AI 返回的坐标，否则使用网格布局
    let x: number
    let y: number
    let width: number
    let height: number

    if (node.x !== undefined && node.y !== undefined) {
      // 使用 AI 提供的坐标
      x = node.x
      y = node.y
      width = node.width || NODE_WIDTH
      height = node.height || NODE_HEIGHT
    } else {
      // 自动布局：网格排列
      const col = index % cols
      const row = Math.floor(index / cols)
      x = START_X + col * (NODE_WIDTH + HORIZONTAL_SPACING)
      y = START_Y + row * (NODE_HEIGHT + VERTICAL_SPACING)
      width = NODE_WIDTH
      height = NODE_HEIGHT
    }

    nodePositions[node.id] = { x, y, width, height }

    // 创建形状元素
    const originalType = node.type || 'rectangle'
    const shapeType = mapShapeType(originalType)
    const color = node.color || 'blue'

    console.log(`节点 ${node.id}: ${originalType} → ${shapeType}`)

    const shapeId = generateId()
    const shapeElement = {
      id: shapeId,
      type: shapeType,
      x,
      y,
      width,
      height,
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

    // 创建文字标签（绑定到形状容器）
    const lines = node.label.split('\n')
    const fontSize = 16
    const lineHeight = 1.25  // Excalidraw 必需字段：fontFamily 1 对应的行高
    const textLineHeight = fontSize * lineHeight * lines.length
    const textWidth = width - 20  // 留出左右边距

    // 文字元素坐标：相对于形状居中
    const textElement = {
      id: generateId(),
      type: 'text',
      x: x + 10,  // 左边距10px
      y: y + height / 2 - textLineHeight / 2,
      width: textWidth,
      height: textLineHeight,
      text: node.label,
      fontSize,
      fontFamily: 1,
      textAlign: 'center' as const,
      verticalAlign: 'middle' as const,  // 容器内文本应该用 middle
      strokeColor: '#000000',
      backgroundColor: 'transparent',
      fillStyle: 'solid' as const,
      containerId: shapeId,  // 绑定到形状容器
      originalText: node.label,
      lineHeight: lineHeight as any,  // ← 关键修复：必需字段！
      autoResize: true,  // ← 关键修复：必需字段！
      ...createBaseElement(),
    }

    // 更新形状的 boundElements，告诉它包含这个文字
    ;(shapeElement as any).boundElements = [{ type: 'text', id: textElement.id }]

    elements.push(textElement)
  })

  // 2. 创建连接线（⭐ 改进：支持 routing）
  diagram.connections.forEach((conn) => {
    const fromNode = nodePositions[conn.from]
    const toNode = nodePositions[conn.to]

    if (!fromNode || !toNode) {
      console.warn(`Connection skipped: ${conn.from} -> ${conn.to} (node not found)`)
      return
    }

    // ⭐ 使用 routing 配置计算连接点
    const { startX, startY, endX, endY } = calculateConnectionPoints(fromNode, toNode, conn.routing)

    // 处理 waypoints（中间路径点）
    let points: number[][]
    if (conn.routing?.waypoints && conn.routing.waypoints.length > 0) {
      // 有中间路径点：[起点, 路径点1, 路径点2, ..., 终点]
      points = [
        [0, 0],  // 起点（相对于 startX, startY）
        ...conn.routing.waypoints.map(wp => [wp.x - startX, wp.y - startY]),
        [endX - startX, endY - startY],  // 终点（相对坐标）
      ]
      console.log(`[Routing] Using ${conn.routing.waypoints.length} waypoints`)
    } else {
      // 无中间路径点：直线连接
      points = [
        [0, 0],
        [endX - startX, endY - startY],
      ]
    }

    // 处理连线样式
    const strokeStyle = conn.style === 'dashed' ? 'dashed'
                      : conn.style === 'dotted' ? 'dotted'
                      : 'solid'

    const arrowElement = {
      id: generateId(),
      type: conn.type === 'line' ? 'line' : 'arrow',  // 支持 line 类型（无箭头）
      x: startX,
      y: startY,
      width: endX - startX,
      height: endY - startY,
      points,
      strokeColor: '#000000',
      backgroundColor: 'transparent',
      fillStyle: 'solid' as const,
      strokeStyle: strokeStyle as 'solid' | 'dashed' | 'dotted',  // ⭐ 支持虚线/点线
      startBinding: null,
      endBinding: null,
      startArrowhead: null,
      endArrowhead: conn.type === 'line' ? null : 'arrow' as const,  // line 类型无箭头
      ...createBaseElement(),
    }

    elements.push(arrowElement)

    // 如果有标签，添加文字
    if (conn.label) {
      // 标签放在中点（如果有 waypoints，放在第一个路径点附近）
      let labelX: number, labelY: number
      if (conn.routing?.waypoints && conn.routing.waypoints.length > 0) {
        const midWaypoint = conn.routing.waypoints[Math.floor(conn.routing.waypoints.length / 2)]
        labelX = midWaypoint.x
        labelY = midWaypoint.y
      } else {
        labelX = startX + (endX - startX) / 2
        labelY = startY + (endY - startY) / 2
      }

      const labelFontSize = 12
      const labelLineHeight = 1.25

      const labelElement = {
        id: generateId(),
        type: 'text',
        x: labelX - 30,
        y: labelY - labelFontSize * labelLineHeight / 2,
        width: 60,
        height: labelFontSize * labelLineHeight,
        text: conn.label,
        fontSize: labelFontSize,
        fontFamily: 1,
        textAlign: 'center' as const,
        verticalAlign: 'middle' as const,
        strokeColor: '#495057',
        backgroundColor: '#ffffff',
        fillStyle: 'solid' as const,
        containerId: null,  // 独立文字，不绑定到箭头
        originalText: conn.label,  // ← 必需字段
        lineHeight: labelLineHeight as any,  // ← 必需字段
        autoResize: true,  // ← 必需字段
        ...createBaseElement(),
      }

      elements.push(labelElement)
    }
  })

  return elements
}
