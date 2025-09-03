import { Editor, KNode } from '@/model'
import { getSelectionBlockNodes } from '@/model/config/function'
import { Extension } from '../Extension'
import './style.less'

declare module '../../model' {
  interface EditorCommandsType {
    /**
     * 获取光标所在的引用节点，如果光标不在一个引用节点内，返回null
     */
    getBlockquote?: () => KNode | null
    /**
     * 判断光标范围内是否有引用节点
     */
    hasBlockquote?: () => boolean
    /**
     * 光标范围内是否都是引用节点
     */
    allBlockquote?: () => boolean
    /**
     * 设置引用
     */
    setBlockquote?: () => Promise<void>
    /**
     * 取消引用
     */
    unsetBlockquote?: () => Promise<void>
  }
}

/**
 * 块节点转为引用
 */
const toBlockquote = (editor: Editor, node: KNode) => {
  if (!node.isBlock()) {
    return
  }
  //子节点非块节点
  const notBlock = !node.children![0].isBlock()
  //是固定的块节点或者内嵌套的块节点
  if (node.fixed || node.nested) {
    //创建引用节点
    const blockquoteNode = KNode.create({
      type: 'block',
      tag: 'blockquote',
      children: []
    })
    //子节点无块节点
    if (notBlock) {
      //创建一个段落节点
      const paragraph = KNode.create({
        type: 'block',
        tag: editor.blockRenderTag,
        children: []
      })
      //将块节点的子节点给段落节点
      node.children!.forEach((item, index) => {
        editor.addNode(item, paragraph, index)
      })
      //将段落节点加入到引用节点
      editor.addNode(paragraph, blockquoteNode)
    }
    //子节点有块节点
    else {
      //将块节点的子节点给引用节点
      node.children!.forEach((item, index) => {
        editor.addNode(item, blockquoteNode, index)
      })
    }
    //将引用节点添加到块节点下
    blockquoteNode.parent = node
    node.children = [blockquoteNode]
  }
  //非固定块节点
  else {
    editor.toParagraph(node)
    node.tag = 'blockquote'
    //子节点无块节点
    if (notBlock) {
      //创建一个段落节点
      const paragraph = KNode.create({
        type: 'block',
        tag: editor.blockRenderTag,
        children: []
      })
      //将引用节点的子节点给段落节点
      node.children!.forEach((item, index) => {
        editor.addNode(item, paragraph, index)
      })
      //将段落节点加入到引用节点
      paragraph.parent = node
      node.children = [paragraph]
    }
  }
}

export const BlockquoteExtension = () =>
  Extension.create({
    name: 'blockquote',
    extraKeepTags: ['blockquote'],
    domParseNodeCallback(node) {
      if (node.isMatch({ tag: 'blockquote' })) {
        node.type = 'block'
      }
      return node
    },
    formatRules: [
      ({ node }) => {
        if (node.isMatch({ tag: 'blockquote' })) {
          node.type = 'block'
        }
      }
    ],
    addCommands() {
      const getBlockquote = () => {
        return this.getMatchNodeBySelection({
          tag: 'blockquote'
        })
      }

      const hasBlockquote = () => {
        return this.isSelectionNodesSomeMatch({
          tag: 'blockquote'
        })
      }

      const allBlockquote = () => {
        return this.isSelectionNodesAllMatch({
          tag: 'blockquote'
        })
      }

      const setBlockquote = async () => {
        if (allBlockquote()) {
          return
        }
        //起点和终点在一起
        if (this.selection.collapsed()) {
          const blockNode = this.selection.start!.node.getBlock()
          toBlockquote(this, blockNode)
        }
        //起点和终点不在一起
        else {
          const blockNodes = getSelectionBlockNodes.apply(this)
          blockNodes.forEach(item => {
            toBlockquote(this, item)
          })
        }
        await this.updateView()
      }

      const unsetBlockquote = async () => {
        if (!allBlockquote()) {
          return
        }
        //起点和终点在一起
        if (this.selection.collapsed()) {
          const matchNode = this.selection.start!.node.getMatchNode({ tag: 'blockquote' })
          if (matchNode) this.toParagraph(matchNode)
        }
        //起点和终点不在一起
        else {
          const blockNodes = getSelectionBlockNodes.apply(this)
          blockNodes.forEach(item => {
            const matchNode = item.getMatchNode({ tag: 'blockquote' })
            if (matchNode) this.toParagraph(matchNode)
          })
        }
        await this.updateView()
      }

      return {
        getBlockquote,
        hasBlockquote,
        allBlockquote,
        setBlockquote,
        unsetBlockquote
      }
    }
  })
