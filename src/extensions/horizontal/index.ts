import { event as DapEvent } from 'dap-util'
import { Editor, KNode } from '@/model'
import { Extension } from '../Extension'
import { HORIZONTAL_NODE_TAG } from './element'
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
const handleHorizontalClick = (editor: Editor) => {
  DapEvent.off(editor.$el!, 'click.horizontal')
  DapEvent.on(editor.$el!, 'click.horizontal', e => {
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
      tag: HORIZONTAL_NODE_TAG
    })
    if (matchNode) {
      editor.updateRealSelection()
    }
  })
}

export const HorizontalExtension = () =>
  Extension.create({
    name: 'horizontal',
    extraKeepTags: [HORIZONTAL_NODE_TAG, 'hr'],
    onDomParseNode(node) {
      if (node.isMatch({ tag: HORIZONTAL_NODE_TAG })) {
        node.type = 'closed'
        node.children = undefined
      }
      if (node.isMatch({ tag: 'hr' })) {
        node.tag = HORIZONTAL_NODE_TAG
        node.type = 'closed'
        node.children = undefined
      }
      return node
    },
    formatRules: [
      ({ node }) => {
        if (node.isMatch({ tag: HORIZONTAL_NODE_TAG })) {
          node.type = 'closed'
          node.children = undefined
        }
        if (node.isMatch({ tag: 'hr' })) {
          node.tag = HORIZONTAL_NODE_TAG
          node.type = 'closed'
          node.children = undefined
        }
      }
    ],
    onAfterUpdateView() {
      handleHorizontalClick(this)
    },
    addCommands() {
      const setHorizontal = async () => {
        const node = KNode.create({
          type: 'closed',
          tag: HORIZONTAL_NODE_TAG
        })
        this.insertNode(node)
        await this.updateView()
      }

      return {
        setHorizontal
      }
    }
  })
