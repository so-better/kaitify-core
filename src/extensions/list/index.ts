import { Editor, KNode, KNodeStylesType } from '@/model'
import { getSelectionBlockNodes } from '@/model/config/function'
import { Extension } from '../Extension'
import './style.less'

export type OrderedListType = 'decimal' | 'lower-alpha' | 'upper-alpha' | 'lower-roman' | 'upper-roman' | 'lower-greek' | 'cjk-ideographic'

export type UnorderListType = 'disc' | 'circle' | 'square'

export type ListOptionsType = {
  ordered?: boolean
  listType?: OrderedListType | UnorderListType
}

declare module '../../model' {
  interface EditorCommandsType {
    getList?: (options: ListOptionsType) => KNode | null
    hasList?: (options: ListOptionsType) => boolean
    allList?: (options: ListOptionsType) => boolean
    setList?: (options: ListOptionsType) => Promise<void>
    unsetList?: (options: ListOptionsType) => Promise<void>
  }
}

/**
 * 块节点转为列表
 */
const toList = (editor: Editor, node: KNode, ordered?: boolean, listType?: OrderedListType | UnorderListType) => {
  if (!node.isBlock()) {
    return
  }
  //是列表项节点
  if (node.isMatch({ tag: 'li' })) {
    //如果是和当前要转的列表类型一致则不处理
    if (listType) {
      if (node.parent!.isMatch({ tag: ordered ? 'ol' : 'ul', styles: { listStyleType: listType } })) {
        return
      }
    } else {
      if (node.parent!.isMatch({ tag: ordered ? 'ol' : 'ul' })) {
        return
      }
    }

    //获取列表节点
    const listNode = node.parent!
    //获取当前块节点在列表项节点里的序列
    const index = listNode.children!.findIndex(item => item.isEqual(node))
    //复制当前块节点
    const newNode = node.clone(false)
    //将块节点的子节点都给复制的块节点
    node.children!.forEach((item, index) => {
      editor.addNode(item, newNode, index)
    })
    node.children = []
    //创建新的列表节点
    const newListNode = KNode.create({
      type: 'block',
      tag: ordered ? 'ol' : 'ul',
      children: []
    })
    if (listType) {
      newListNode.styles = {
        listStyleType: listType
      }
    }
    //将复制的块节点给新的列表节点
    editor.addNode(newNode, newListNode)
    //该列表项节点是原列表节点的第一个子节点
    if (index == 0) {
      editor.addNodeBefore(newListNode, listNode)
    }
    //该列表项节点是原列表节点的最后一个子节点
    else if (index == listNode.children!.length - 1) {
      editor.addNodeAfter(newListNode, listNode)
    }
    //该列表项节点在原列表节点的中间
    else {
      //复制原列表节点
      const sList = listNode.clone(false)
      //截取原节点的前半部分数据给复制的列表节点
      const sListItems = listNode.children!.splice(0, index)
      sListItems.forEach((item, index) => {
        editor.addNode(item, sList, index)
      })
      editor.addNodeBefore(newListNode, listNode)
      editor.addNodeBefore(sList, newListNode)
    }
  }
  //是固定的块节点或者内嵌套的块节点
  else if (node.fixed || node.nested) {
    //创建列表节点
    const listNode = KNode.create({
      type: 'block',
      tag: ordered ? 'ol' : 'ul',
      children: [
        {
          type: 'block',
          tag: 'li',
          nested: true,
          children: []
        }
      ]
    })
    if (listType) {
      listNode.styles = {
        listStyleType: listType
      }
    }
    //将块节点的子节点给列表节点的列表项节点
    node.children!.forEach((item, index) => {
      editor.addNode(item, listNode.children![0], index)
    })
    //将列表节点添加到块节点下
    listNode.parent = node
    node.children = [listNode]
  }
  //非固定块节点
  else {
    //将块节点转为列表节点
    editor.toParagraph(node)
    node.tag = ordered ? 'ol' : 'ul'
    if (listType) {
      node.styles = {
        listStyleType: listType
      }
    }
    //创建列表项节点
    const listItem = KNode.create({
      type: 'block',
      tag: 'li',
      nested: true
    })
    //将列表节点的子节点都给列表项节点
    node.children!.forEach((item, index) => {
      editor.addNode(item, listItem, index)
    })
    //将列表项节点作为列表节点的子节点
    node.children = [listItem]
    listItem.parent = node
  }
}

/**
 * 取消当前列表项块节点的列表设置
 */
const ListItemToParagraph = (editor: Editor, node: KNode) => {
  if (!node.isBlock()) {
    return
  }
  if (!node.isMatch({ tag: 'li' })) {
    return
  }
  //获取列表节点
  const listNode = node.parent!
  //列表项在列表节点中的序列
  const index = listNode.children!.findIndex(item => item.isEqual(node))
  //在列表节点的第一个位置
  if (index == 0) {
    editor.addNodeBefore(node, listNode)
    listNode.children!.splice(index, 1)
  }
  //在列表节点的最后一个位置
  else if (index == listNode.children!.length - 1) {
    editor.addNodeAfter(node, listNode)
    listNode.children!.splice(index, 1)
  }
  //在列表节点的中间位置
  else {
    //复制原列表节点
    const sList = listNode.clone(false)
    //截取原节点的前半部分数据给复制的列表节点
    const sListItems = listNode.children!.splice(0, index)
    sListItems.forEach((item, index) => {
      editor.addNode(item, sList, index)
    })
    editor.addNodeBefore(node, listNode)
    listNode.children!.splice(0, 1)
    editor.addNodeBefore(sList, node)
  }
  editor.toParagraph(node)
}

/**
 * 节点合并处理
 */
const listMergeHandler = ({ editor, node }: { editor: Editor; node: KNode }) => {
  //节点是有序列表
  if (node.isMatch({ tag: 'ol' })) {
    //前一个兄弟节点
    const previousNode = node.getPrevious(node.parent ? node.parent.children! : editor.stackNodes)
    //前一个兄弟节点是有序列表则将当前节点的子节点都给前一个节点
    if (previousNode && previousNode.isMatch({ tag: 'ol' }) && previousNode.isEqualMarks(node) && previousNode.isEqualStyles(node)) {
      const nodes = node.children!.map(item => {
        item.parent = previousNode
        return item
      })
      previousNode.children!.push(...nodes)
      node.children = []
      const nextNode = node.getNext(node.parent ? node.parent.children! : editor.stackNodes)
      //如果此时后一个节点存在
      if (nextNode) {
        listMergeHandler({ editor, node: nextNode })
      }
    }
  }
  //节点是无序列表
  if (node.isMatch({ tag: 'ul' })) {
    //前一个兄弟节点
    const previousNode = node.getPrevious(node.parent ? node.parent.children! : editor.stackNodes)
    //前一个兄弟节点是无序列表则将当前节点的子节点都给前一个节点
    if (previousNode && previousNode.isMatch({ tag: 'ul' }) && previousNode.isEqualMarks(node) && previousNode.isEqualStyles(node)) {
      const nodes = node.children!.map(item => {
        item.parent = previousNode
        return item
      })
      previousNode.children!.push(...nodes)
      node.children = []
      const nextNode = node.getNext(node.parent ? node.parent.children! : editor.stackNodes)
      //如果此时后一个节点存在
      if (nextNode) {
        listMergeHandler({ editor, node: nextNode })
      }
    }
  }
}

export const ListExtension = () =>
  Extension.create({
    name: 'list',
    extraKeepTags: ['ul', 'ol', 'li'],
    domParseNodeCallback(node) {
      if (node.isMatch({ tag: 'ul' }) || node.isMatch({ tag: 'ol' })) {
        node.type = 'block'
      }
      if (node.isMatch({ tag: 'li' })) {
        node.type = 'block'
        node.nested = true
      }
      return node
    },
    formatRules: [
      //列表处理
      ({ node }) => {
        if (node.isMatch({ tag: 'ol' }) || node.isMatch({ tag: 'ul' })) {
          //必须是块节点
          node.type = 'block'
        }
      },
      //列表项处理
      ({ editor, node }) => {
        if (node.isMatch({ tag: 'li' })) {
          //必须是内嵌块节点
          node.type = 'block'
          node.nested = true
          //如果li节点无父节点或者父节点不是有序列表也不是无序列表，则默认加入到无序列表中
          if (!node.parent || !(node.parent.isMatch({ tag: 'ol' }) || node.parent.isMatch({ tag: 'ul' }))) {
            //设为内嵌块节点
            node.nested = true
            //创建列表节点
            const listNode = KNode.create({
              type: 'block',
              tag: 'ul'
            })
            //获取父节点
            const parentNode = node.parent
            //在父节点中的位置序列
            const index = parentNode ? parentNode.children!.findIndex(item => item.isEqual(node)) : editor.stackNodes.findIndex(item => item.isEqual(node))
            //从父节点中移除
            parentNode ? parentNode.children!.splice(index, 1, listNode) : editor.stackNodes.splice(index, 1, listNode)
            //加入到列表节点中
            editor.addNode(node, listNode)
          }
        }
      },
      //列表合并处理
      listMergeHandler
    ],
    pasteKeepStyles(node) {
      const styles: KNodeStylesType = {}
      //保留序标类型样式
      if ((node.isMatch({ tag: 'ol' }) || node.isMatch({ tag: 'ul' })) && node.hasStyles()) {
        if (node.styles!.hasOwnProperty('listStyleType')) styles.listStyleType = node.styles!['listStyleType']
      }
      return styles
    },
    onDetachMentBlockFromParentCallback(node) {
      //父节点存在并且是列表节点
      if (node.parent && (node.parent.isMatch({ tag: 'ol' }) || node.parent.isMatch({ tag: 'ul' }))) {
        //将该节点转为列表项节点
        node.tag = 'li'
        node.marks = {}
        node.styles = {}
        node.fixed = false
        node.nested = true
        node.locked = false
        node.namespace = ''
        return false
      }
      return true
    },
    addCommands() {
      /**
       * 获取光标所在的有序列表或者无序列表，如果光标不在一个有序列表或者无序列表内，返回null
       */
      const getList = (options: ListOptionsType) => {
        if (options.listType) {
          return this.getMatchNodeBySelection({
            tag: options.ordered ? 'ol' : 'ul',
            styles: {
              listStyleType: options.listType
            }
          })
        }
        return this.getMatchNodeBySelection({ tag: options.ordered ? 'ol' : 'ul' })
      }

      /**
       * 判断光标范围内是否有有序列表或者无序列表
       */
      const hasList = (options: ListOptionsType) => {
        if (options.listType) {
          return this.isSelectionNodesSomeMatch({
            tag: options.ordered ? 'ol' : 'ul',
            styles: {
              listStyleType: options.listType
            }
          })
        }
        return this.isSelectionNodesSomeMatch({ tag: options.ordered ? 'ol' : 'ul' })
      }

      /**
       * 判断光标范围内是否都是有序列表或者无序列表
       */
      const allList = (options: ListOptionsType) => {
        if (options.listType) {
          return this.isSelectionNodesAllMatch({
            tag: options.ordered ? 'ol' : 'ul',
            styles: {
              listStyleType: options.listType
            }
          })
        }
        return this.isSelectionNodesAllMatch({ tag: options.ordered ? 'ol' : 'ul' })
      }

      /**
       * 设置有序列表或者无序列表
       */
      const setList = async (options: ListOptionsType) => {
        if (allList(options)) {
          return
        }
        //起点和终点在一起
        if (this.selection.collapsed()) {
          const blockNode = this.selection.start!.node.getBlock()
          toList(this, blockNode, options.ordered, options.listType)
        }
        //起点和终点不在一起
        else {
          const blockNodes = getSelectionBlockNodes.apply(this)
          blockNodes.forEach(item => {
            toList(this, item, options.ordered, options.listType)
          })
        }
        await this.updateView()
      }

      /**
       * 取消有序列表或者无序列表
       */
      const unsetList = async (options: ListOptionsType) => {
        if (!allList(options)) {
          return
        }
        //起点和终点在一起
        if (this.selection.collapsed()) {
          const blockNode = this.selection.start!.node.getBlock()
          const matchNode = blockNode.getMatchNode({ tag: 'li' })
          if (matchNode) ListItemToParagraph(this, matchNode)
        }
        //起点和终点不在一起
        else {
          const blockNodes = getSelectionBlockNodes.apply(this)
          blockNodes.forEach(item => {
            const matchNode = item.getMatchNode({ tag: 'li' })
            if (matchNode) ListItemToParagraph(this, matchNode)
          })
        }
        await this.updateView()
      }

      return {
        getList,
        hasList,
        allList,
        setList,
        unsetList
      }
    }
  })
