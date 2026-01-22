/**
 * 简化的图表格式 - 用于 AI 生成
 * 这是大模型需要输出的格式
 */

export interface DiagramNode {
  id: string
  label: string
  type?: 'rectangle' | 'ellipse' | 'diamond' | 'hexagon' | 'cylinder' | 'cloud'
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray' | 'yellow' | 'pink' | 'black'
  // 可选的位置和尺寸（不指定则自动布局）
  x?: number
  y?: number
  width?: number
  height?: number
}

export interface DiagramConnection {
  from: string
  to: string
  label?: string
  type?: 'arrow' | 'line'  // arrow: 带箭头, line: 直线
  style?: 'solid' | 'dashed' | 'dotted'  // 线条样式
}

/**
 * 独立的文本标注
 */
export interface TextAnnotation {
  id: string
  text: string
  x?: number
  y?: number
  fontSize?: number
  color?: string
}

/**
 * 分组框架（用于组织和分组元素）
 */
export interface Frame {
  id: string
  label?: string
  children: string[]  // 包含的节点 id
  color?: string
  x?: number
  y?: number
  width?: number
  height?: number
}

/**
 * 图片元素
 */
export interface ImageElement {
  id: string
  imageUrl: string
  alt?: string
  x?: number
  y?: number
  width?: number
  height?: number
}

/**
 * 手绘路径元素
 */
export interface FreedrawElement {
  id: string
  points: Array<[number, number]>  // 路径点坐标
  color?: string
  strokeWidth?: number
}

/**
 * 成功响应：图表数据
 */
export interface SimplifiedDiagram {
  type: 'architecture' | 'flowchart' | 'sequence' | 'custom'
  title?: string

  // 基础节点
  nodes: DiagramNode[]

  // 连接关系
  connections: DiagramConnection[]

  // 独立文本标注（可选）
  annotations?: TextAnnotation[]

  // 分组框架（可选）
  frames?: Frame[]

  // 图片元素（可选）
  images?: ImageElement[]

  // 手绘元素（可选）
  freedraws?: FreedrawElement[]
}

/**
 * 错误响应：非绘图需求或其他错误
 */
export interface DiagramError {
  type: 'error'
  error: 'NON_DRAWING_REQUEST' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR'
  message: string
}

/**
 * AI 响应的联合类型
 */
export type AIResponse = SimplifiedDiagram | DiagramError

/**
 * 类型守卫：判断是否为错误响应
 */
export function isErrorResponse(response: AIResponse): response is DiagramError {
  return response.type === 'error'
}

/**
 * 类型守卫：判断是否为图表响应
 */
export function isDiagramResponse(response: AIResponse): response is SimplifiedDiagram {
  return response.type !== 'error'
}
