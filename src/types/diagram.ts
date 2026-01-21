/**
 * 简化的图表格式 - 用于 AI 生成
 * 这是大模型需要输出的格式
 */

export interface DiagramNode {
  id: string
  label: string
  type?: 'rectangle' | 'ellipse' | 'diamond'
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray'
}

export interface DiagramConnection {
  from: string
  to: string
  label?: string
}

export interface SimplifiedDiagram {
  type: 'architecture' | 'flowchart' | 'sequence'
  title?: string
  nodes: DiagramNode[]
  connections: DiagramConnection[]
}
