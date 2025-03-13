import { event as DapEvent, element as DapElement } from 'dap-util'
import { Editor, KNode, KNodeMarksType } from '@/model'
import { getSelectionBlockNodes } from '@/model/config/function'
import { Extension } from '../Extension'
import './style.less'

declare module '../../model' {
  interface EditorCommandsType {
    /**
     * 获取光标所在的待办节点，如果光标不在一个待办节点内，返回null
     */
    getTask?: () => KNode | null
    /**
     * 判断光标范围内是否有待办节点
     */
    hasTask?: () => boolean
    /**
     * 光标范围内是否都是待办节点
     */
    allTask?: () => boolean
    /**
     * 设置待办
     */
    setTask?: () => Promise<void>
    /**
     * 取消待办
     */
    unsetTask?: () => Promise<void>
  }
}

/**
 * 块节点转为待办
 */
const toTask = (editor: Editor, node: KNode) => {
  if (!node.isBlock()) {
    return
  }
  //是固定的块节点或者内嵌套的块节点
  if (node.fixed || node.nested) {
    //创建待办节点
    const taskNode = KNode.create({
      type: 'block',
      tag: 'div',
      marks: {
        'kaitify-task': 'undo'
      },
      children: []
    })
    //将块节点的子节点给待办节点
    node.children!.forEach((item, index) => {
      editor.addNode(item, taskNode, index)
    })
    //清空原来的块节点
    node.children = []
    //将待办节点添加到块节点下
    taskNode.parent = node
    node.children = [taskNode]
  }
  //非固定块节点
  else {
    editor.toParagraph(node)
    node.tag = 'div'
    node.marks = {
      'kaitify-task': 'undo'
    }
  }
}

/**
 * 编辑器点击切换待办状态
 */
const toggleTaskStatus = function (editor: Editor) {
  DapEvent.off(editor.$el!, `click.task`)
  DapEvent.on(editor.$el!, `click.task`, e => {
    //不可编辑状态下无法切换
    if (!editor.isEditable()) {
      return
    }
    const event = e as MouseEvent
    const elm = event.target as HTMLElement
    if (elm === editor.$el) {
      return
    }
    const node = editor.findNode(elm)
    const matchNode = node.getMatchNode({
      tag: 'div',
      marks: {
        'kaitify-task': true
      }
    })
    //点击的元素是待办
    if (matchNode) {
      const dom = editor.findDom(matchNode)
      const rect = DapElement.getElementBounding(dom)
      //在复选框范围内
      if (event.clientX >= Math.abs(rect.left) && event.clientX <= Math.abs(rect.left + 15) && event.clientY >= Math.abs(rect.top + 3) && event.clientY <= Math.abs(rect.top + 3 + 15)) {
        if (matchNode.marks!['kaitify-task'] == 'undo') {
          matchNode.marks!['kaitify-task'] = 'done'
        } else {
          matchNode.marks!['kaitify-task'] = 'undo'
        }
        editor.setSelectionAfter(matchNode, 'all')
        editor.updateView()
      }
    }
  })
}

export const TaskExtension = () =>
  Extension.create({
    name: 'task',
    pasteKeepMarks(node) {
      const marks: KNodeMarksType = {}
      if (
        node.isMatch({
          tag: 'div',
          marks: {
            'kaitify-task': true
          }
        })
      ) {
        marks['kaitify-task'] = node.marks!['kaitify-task']
      }
      return marks
    },
    afterUpdateView() {
      //切换待办状态
      toggleTaskStatus(this)
    },
    onInsertParagraph(node) {
      if (
        node.isMatch({
          tag: 'div',
          marks: {
            'kaitify-task': true
          }
        })
      ) {
        node.marks!['kaitify-task'] = 'undo'
      }
    },
    formatRules: [
      //待办列表必须是块节点
      ({ node }) => {
        if (
          node.isMatch({
            tag: 'div',
            marks: {
              'kaitify-task': true
            }
          })
        ) {
          node.type = 'block'
        }
      }
    ],
    addCommands() {
      const getTask = () => {
        return this.getMatchNodeBySelection({
          tag: 'div',
          marks: {
            'kaitify-task': true
          }
        })
      }

      const hasTask = () => {
        return this.isSelectionNodesSomeMatch({
          tag: 'div',
          marks: {
            'kaitify-task': true
          }
        })
      }

      const allTask = () => {
        return this.isSelectionNodesAllMatch({
          tag: 'div',
          marks: {
            'kaitify-task': true
          }
        })
      }

      const setTask = async () => {
        if (allTask()) {
          return
        }
        //起点和终点在一起
        if (this.selection.collapsed()) {
          const blockNode = this.selection.start!.node.getBlock()
          toTask(this, blockNode)
        }
        //起点和终点不在一起
        else {
          const blockNodes = getSelectionBlockNodes.apply(this)
          blockNodes.forEach(item => {
            toTask(this, item)
          })
        }
        await this.updateView()
      }

      const unsetTask = async () => {
        if (!allTask()) {
          return
        }
        //起点和终点在一起
        if (this.selection.collapsed()) {
          const matchNode = this.selection.start!.node.getMatchNode({
            tag: 'div',
            marks: {
              'kaitify-task': true
            }
          })
          if (matchNode) this.toParagraph(matchNode)
        }
        //起点和终点不在一起
        else {
          const blockNodes = getSelectionBlockNodes.apply(this)
          blockNodes.forEach(item => {
            const matchNode = item.getMatchNode({
              tag: 'div',
              marks: {
                'kaitify-task': true
              }
            })
            if (matchNode) this.toParagraph(matchNode)
          })
        }
        await this.updateView()
      }

      return {
        getTask,
        hasTask,
        allTask,
        setTask,
        unsetTask
      }
    }
  })
