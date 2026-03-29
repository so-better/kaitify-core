import { event as DapEvent } from 'dap-util'
import { Editor, KNode } from '@/model'
import { Extension } from '../Extension'
import { HORIZONTAL_NODE_TAG } from './element'
import './style.less'

declare module '../../model' {
  interface EditorCommandsType {
    /**
     * 获取光标所在的水平线节点
     */
    getHorizontal?: () => KNode | null
    /**
     * 判断光标范围内是否有水平线节点
     */
    hasHorizontal?: () => boolean
    /**
     * 设置水平线
     */
    setHorizontal?: () => Promise<void>
  }
}

/**
 * 点击事件
 */
const handleClick = (editor: Editor) => {
  DapEvent.off(editor.$el!, 'click.horizontal')
  DapEvent.on(editor.$el!, 'click.horizontal', e => {
    const event = e as MouseEvent
    const elm = event.target as HTMLElement
    if (elm === editor.$el) {
      return
    }
    let node = null
    try {
      node = editor.findNode(elm)
    } catch (_) {
      return
    }
    const matchNode = node.getMatchNode({
      tag: HORIZONTAL_NODE_TAG
    })
    //节点不存在
    if (!matchNode) {
      return
    }
    //设置光标到节点两侧
    editor.setSelectionBefore(matchNode, 'start')
    editor.setSelectionAfter(matchNode, 'end')
    editor.updateRealSelection()
  })
}

/**
 * 选中样式设置
 */
const handleSelected = (editor: Editor) => {
  // 先清除所有水平线的选中状态
  editor.$el!.querySelectorAll(`${HORIZONTAL_NODE_TAG} > span`).forEach(el => {
    el.removeAttribute('is-selected')
  })
  if (!editor.selection.focused()) return
  const flag = editor.commands.hasHorizontal?.()
  if (flag) {
    const doms = editor
      .getFocusNodesBySelection('closed')
      .filter(item => item.isMatch({ tag: HORIZONTAL_NODE_TAG }))
      .map(item => editor.findDom(item))
    doms.forEach(dom => dom.querySelector('span')?.setAttribute('is-selected', ''))
  }
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
      handleClick(this)
    },
    onSelectionUpdate() {
      handleSelected(this)
    },
    addCommands() {
      const getHorizontal = () => {
        return this.getClosedNodeBySelection({ tag: HORIZONTAL_NODE_TAG })
      }

      const hasHorizontal = () => {
        return this.hasClosedNodeBySelection({ tag: HORIZONTAL_NODE_TAG })
      }

      const setHorizontal = async () => {
        if (!this.selection.focused()) {
          return
        }
        const node = KNode.create({
          type: 'closed',
          tag: HORIZONTAL_NODE_TAG
        })
        this.insertNode(node)
        await this.updateView()
      }

      return {
        getHorizontal,
        hasHorizontal,
        setHorizontal
      }
    }
  })
