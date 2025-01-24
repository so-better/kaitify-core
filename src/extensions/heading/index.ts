import { Editor, KNode } from '@/model'
import { getSelectionBlockNodes } from '@/model/config/function'
import { Extension } from '../Extension'
import './style.less'

export type HeadingLevelType = 0 | 1 | 2 | 3 | 4 | 5 | 6

declare module '../../model' {
  interface EditorCommandsType {
    getHeading?: (level: HeadingLevelType) => KNode | null
    hasHeading?: (level: HeadingLevelType) => boolean
    allHeading?: (level: HeadingLevelType) => boolean
    setHeading?: (level: HeadingLevelType) => Promise<void>
    unsetHeading?: (level: HeadingLevelType) => Promise<void>
  }
}

/**
 * 块节点转为标题
 */
const toHeading = (editor: Editor, node: KNode, level: HeadingLevelType) => {
  if (!node.isBlock()) {
    return
  }
  const headingLevelMap = {
    0: editor.blockRenderTag,
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6'
  }
  //是固定的块节点或者内嵌套的块节点
  if (node.fixed || node.nested) {
    //创建标题节点
    const headingNode = KNode.create({
      type: 'block',
      tag: headingLevelMap[level],
      children: []
    })
    //将块节点的子节点给标题节点
    node.children!.forEach((item, index) => {
      editor.addNode(item, headingNode, index)
    })
    //将标题节点添加到块节点下
    headingNode.parent = node
    node.children = [headingNode]
  }
  //非固定块节点
  else {
    editor.toParagraph(node)
    node.tag = headingLevelMap[level]
  }
}

export const HeadingExtension = () =>
  Extension.create({
    name: 'heading',
    extraKeepTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    domParseNodeCallback(node) {
      if (node.isMatch({ tag: 'h1' }) || node.isMatch({ tag: 'h2' }) || node.isMatch({ tag: 'h3' }) || node.isMatch({ tag: 'h4' }) || node.isMatch({ tag: 'h5' }) || node.isMatch({ tag: 'h6' })) {
        node.type = 'block'
      }
      return node
    },
    formatRules: [
      ({ node }) => {
        if (node.isMatch({ tag: 'h1' }) || node.isMatch({ tag: 'h2' }) || node.isMatch({ tag: 'h3' }) || node.isMatch({ tag: 'h4' }) || node.isMatch({ tag: 'h5' }) || node.isMatch({ tag: 'h6' })) {
          node.type = 'block'
        }
      }
    ],
    addCommands() {
      const headingLevelMap = {
        0: this.blockRenderTag,
        1: 'h1',
        2: 'h2',
        3: 'h3',
        4: 'h4',
        5: 'h5',
        6: 'h6'
      }

      /**
       * 获取光标所在的标题，如果光标不在一个标题内，返回null
       */
      const getHeading = (level: HeadingLevelType) => {
        return this.getMatchNodeBySelection({
          tag: headingLevelMap[level]
        })
      }

      /**
       * 判断光标范围内是否有标题
       */
      const hasHeading = (level: HeadingLevelType) => {
        return this.isSelectionNodesSomeMatch({
          tag: headingLevelMap[level]
        })
      }

      /**
       * 光标范围内是否都是标题
       */
      const allHeading = (level: HeadingLevelType) => {
        return this.isSelectionNodesAllMatch({
          tag: headingLevelMap[level]
        })
      }

      /**
       * 设置标题
       */
      const setHeading = async (level: HeadingLevelType) => {
        if (allHeading(level)) {
          return
        }
        //起点和终点在一起
        if (this.selection.collapsed()) {
          const blockNode = this.selection.start!.node.getBlock()
          toHeading(this, blockNode, level)
        }
        //起点和终点不在一起
        else {
          const blockNodes = getSelectionBlockNodes.apply(this)
          blockNodes.forEach(item => {
            toHeading(this, item, level)
          })
        }
        await this.updateView()
      }

      /**
       * 取消标题
       */
      const unsetHeading = async (level: HeadingLevelType) => {
        if (!allHeading(level)) {
          return
        }
        //起点和终点在一起
        if (this.selection.collapsed()) {
          const matchNode = this.selection.start!.node.getMatchNode({ tag: headingLevelMap[level] })
          if (matchNode) this.toParagraph(matchNode)
        }
        //起点和终点不在一起
        else {
          const blockNodes = getSelectionBlockNodes.apply(this)
          blockNodes.forEach(item => {
            const matchNode = item.getMatchNode({ tag: headingLevelMap[level] })
            if (matchNode) this.toParagraph(matchNode)
          })
        }
        await this.updateView()
      }

      return {
        getHeading,
        hasHeading,
        allHeading,
        setHeading,
        unsetHeading
      }
    }
  })
