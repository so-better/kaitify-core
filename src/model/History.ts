import { KNode } from './KNode'
import { Selection } from './Selection'
/**
 * 历史记录的record类型
 */
export type HistoryRecordType = {
  nodes: KNode[]
  selection: Selection
}
/**
 * 历史记录
 */
export class History {
  /**
   * 存放历史记录的堆栈
   */
  records: HistoryRecordType[] = []
  /**
   * 存放撤销记录的堆栈
   */
  redoRecords: HistoryRecordType[] = []

  /**
   * 复制selection
   */
  cloneSelection(newNodes: KNode[], selection: Selection) {
    const newSelection = new Selection()
    //如果存在选区
    if (selection.focused()) {
      //查找新的节点数组中start对应的节点
      const startNode = KNode.searchByKey(selection.start!.node.key, newNodes)
      //查找新的节点数组中end对应的节点
      const endNode = KNode.searchByKey(selection.end!.node.key, newNodes)
      //如果都存在
      if (startNode && endNode) {
        newSelection.start = {
          node: startNode,
          offset: selection.start!.offset
        }
        newSelection.end = {
          node: endNode,
          offset: selection.end!.offset
        }
      }
    }
    return newSelection
  }

  /**
   * 保存新的记录
   */
  setState(nodes: KNode[], selection: Selection) {
    const newNodes = nodes.map(item => item.fullClone())
    const newSelection = this.cloneSelection(newNodes, selection)
    this.records.push({
      nodes: newNodes,
      selection: newSelection
    })
    //每次保存新状态时清空撤销记录的堆栈
    this.redoRecords = []
  }

  /**
   * 撤销操作：返回上一个历史记录
   */
  setUndo(): HistoryRecordType | null {
    //存在的历史记录大于1则表示可以进行撤销操作
    if (this.records.length > 1) {
      //取出最近的历史记录
      const record = this.records.pop()!
      //将这个历史记录加入到撤销记录数组中
      this.redoRecords.push(record)
      //再次获取历史记录数组中的最近的一个
      const lastRecord = this.records[this.records.length - 1]
      const newNodes = lastRecord.nodes.map(item => item.fullClone())
      const newSelection = this.cloneSelection(newNodes, lastRecord.selection)
      return {
        nodes: newNodes,
        selection: newSelection
      }
    }
    //没有历史记录则返回null
    return null
  }

  /**
   * 重做操作：返回下一个历史记录
   */
  setRedo(): HistoryRecordType | null {
    //如果存在撤销记录
    if (this.redoRecords.length > 0) {
      //取出最近的一个撤销记录
      const record = this.redoRecords.pop()!
      //将撤销记录加入历史记录中
      this.records.push(record)
      //返回取出的这个撤销记录，即最近的一个历史记录
      const newNodes = record.nodes.map(item => item.fullClone())
      const newSelection = this.cloneSelection(newNodes, record.selection)
      return {
        nodes: newNodes,
        selection: newSelection
      }
    }
    return null
  }

  /**
   * 更新当前记录的编辑器的光标
   */
  updateSelection(selection: Selection) {
    const record = this.records[this.records.length - 1]
    const newSelection = this.cloneSelection(record.nodes, selection)
    this.records[this.records.length - 1].selection = newSelection
  }
}
