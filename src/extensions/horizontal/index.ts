import { Editor, KNode } from '@/model'
import { Extension } from '../Extension'
import { event as DapEvent } from 'dap-util'
import './style.less'

declare module '../../model' {
  interface EditorCommandsType {
    /**
     * 设置分隔线
     */
    setHorizontal?: () => Promise<void>
  }
}

/**
 * 水平线点击设置
 */
const horizontalFocus = (editor: Editor) => {
  DapEvent.off(editor.$el!, 'click.horizontal_focus')
  DapEvent.on(editor.$el!, 'click.horizontal_focus', e => {
    //编辑器不可编辑状态下不设置
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
      tag: 'hr'
    })
    if (matchNode) {
      const nextSelectionNode = editor.getNextSelectionNode(matchNode)
      const previousSelectionNode = editor.getPreviousSelectionNode(matchNode)
      if (nextSelectionNode) {
        editor.setSelectionBefore(nextSelectionNode, 'all')
        editor.updateRealSelection()
      } else if (previousSelectionNode) {
        editor.setSelectionAfter(previousSelectionNode, 'all')
        editor.updateRealSelection()
      }
    }
  })
}

export const HorizontalExtension = () =>
  Extension.create({
    name: 'horizontal',
    extraKeepTags: ['hr'],
    domParseNodeCallback(node) {
      if (node.isMatch({ tag: 'hr' })) {
        node.type = 'closed'
      }
      return node
    },
    formatRules: [
      ({ editor, node }) => {
        if (node.isMatch({ tag: 'hr' })) {
          //设置闭合
          node.type = 'closed'
          //设置不可编辑
          if (node.hasMarks()) {
            node.marks!['contenteditable'] = 'false'
          } else {
            node.marks = {
              contenteditable: 'false'
            }
          }
          //两侧设置空白元素
          const previousNode = node.getPrevious(node.parent ? node.parent!.children! : editor.stackNodes)
          const nextNode = node.getNext(node.parent ? node.parent!.children! : editor.stackNodes)
          //前一个节点不存在或者不是零宽度空白文本节点
          if (!previousNode || !previousNode.isZeroWidthText()) {
            const zeroWidthText = KNode.createZeroWidthText()
            editor.addNodeBefore(zeroWidthText, node)
          }
          //后一个节点不存在或者不是零宽度空白文本节点
          if (!nextNode || !nextNode.isZeroWidthText()) {
            const zeroWidthText = KNode.createZeroWidthText()
            editor.addNodeAfter(zeroWidthText, node)
          }
          //重置光标
          if (editor.isSelectionInTargetNode(node, 'start')) {
            //如果起点位置在该水平线内的开始处
            if (editor.selection.start && editor.selection.start.offset === 0) {
              const newTextNode = node.getPrevious(node.parent ? node.parent!.children! : editor.stackNodes)
              if (newTextNode) editor.setSelectionAfter(newTextNode, 'start')
            }
            //不在开始处，则说明在末尾处
            else {
              const newTextNode = node.getNext(node.parent ? node.parent!.children! : editor.stackNodes)
              if (newTextNode) editor.setSelectionBefore(newTextNode, 'start')
            }
          }
          if (editor.isSelectionInTargetNode(node, 'end')) {
            //如果终点位置在该水平线内的开始处
            if (editor.selection.end && editor.selection.end.offset === 0) {
              const newTextNode = node.getPrevious(node.parent ? node.parent!.children! : editor.stackNodes)
              if (newTextNode) editor.setSelectionAfter(newTextNode, 'end')
            }
            //不在开始处，则说明在末尾处
            else {
              const newTextNode = node.getNext(node.parent ? node.parent!.children! : editor.stackNodes)
              if (newTextNode) editor.setSelectionBefore(newTextNode, 'end')
            }
          }
        }
      }
    ],
    afterUpdateView() {
      horizontalFocus(this)
    },
    addCommands() {
      const setHorizontal = async () => {
        const node = KNode.create({
          type: 'closed',
          tag: 'hr',
          marks: {
            contenteditable: 'false'
          }
        })
        this.insertNode(node)
        await this.updateView()
      }

      return {
        setHorizontal
      }
    }
  })
