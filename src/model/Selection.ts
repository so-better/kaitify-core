import { KNode } from './KNode'
/**
 * 光标点位类型，node仅支持文本节点和闭合节点
 */
export type SelectionPointType = {
  node: KNode
  offset: number
}

/**
 * 光标选区
 */
export class Selection {
  /**
   * 起点
   */
  start?: SelectionPointType
  /**
   * 终点
   */
  end?: SelectionPointType

  /**
   * 是否已经初始化设置光标位置
   */
  focused() {
    return !!this.start && !!this.end
  }

  /**
   * 光标是否折叠
   */
  collapsed() {
    if (!this.focused()) {
      return false
    }
    return this.start!.node.isEqual(this.end!.node) && this.start!.offset == this.end!.offset
  }
}
