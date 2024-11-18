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

  /**
   * 判断两个selection是否相同
   */
  isEqual(selection: Selection) {
    if (this.focused() && selection.focused()) {
      const startEqual = this.start!.node.isEqual(selection.start!.node) && this.start!.offset == selection.start!.offset
      const endEqual = this.end!.node.isEqual(selection.end!.node) && this.end!.offset == selection.end!.offset
      return startEqual && endEqual
    }
    return false
  }

  /**
   * 完全克隆selection
   */
  clone() {
    const selection = new Selection()
    if (this.focused()) {
      selection.start = {
        node: this.start!.node,
        offset: this.start!.offset
      }
      selection.end = {
        node: this.end!.node,
        offset: this.end!.offset
      }
    }
    return selection
  }
}
