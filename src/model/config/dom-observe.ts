import { Editor } from '../Editor'
import { KNode } from '../KNode'

/**
 * 移除对编辑器的dom监听
 */
export const removeDomObserve = (editor: Editor) => {
  if (editor.domObserver) {
    editor.domObserver.disconnect()
    editor.domObserver = null
  }
}

/**
 * 设置对编辑器的dom监听，主要解决非法dom插入问题
 * 中文输入和updateView时不会启用dom监听
 */
export const setDomObserve = (editor: Editor) => {
  if (!window.MutationObserver) {
    console.warn('The current browser does not support MutationObserver')
    return
  }
  removeDomObserve(editor)
  editor.domObserver = new MutationObserver(mutationList => {
    //中文输入的情况下不处理
    if (editor.isComposition) {
      return
    }
    //需要更新的节点数据
    const needUpdateData: { node: KNode; elm: HTMLElement }[] = []
    //遍历
    for (let i = 0; i < mutationList.length; i++) {
      const mutationRecord = mutationList[i]
      //文本变更
      if (mutationRecord.type == 'characterData') {
        //文本元素的父元素
        const elm = mutationRecord.target.parentElement!
        //获取对应的节点
        const node = editor.findNode(elm)
        //判断是否已经在needUpdateData里
        const fResult = needUpdateData.find(item => item.node.isEqual(node))
        //加入needUpdateData
        if (!fResult) {
          needUpdateData.push({
            elm,
            node
          })
        }
      }
      //子元素变更
      else if (mutationRecord.type == 'childList') {
        //新增子元素
        if (mutationRecord.addedNodes.length > 0) {
          mutationRecord.addedNodes.forEach(addNode => {
            const elm = (addNode.parentElement || mutationRecord.target) as HTMLElement
            if (elm === editor.$el) {
              console.log('编辑器需要更新----------------------')
            } else {
              const node = editor.findNode(elm)
              const fResult = needUpdateData.find(item => item.node.isEqual(node))
              if (!fResult) {
                needUpdateData.push({
                  elm,
                  node
                })
              }
            }
          })
        }
      }
    }
    if (needUpdateData.length > 0) {
      for (let i = 0; i < needUpdateData.length; i++) {
        const { node, elm } = needUpdateData[i]
        if (needUpdateData.some(item => item.node.isContains(node) && !item.node.isEqual(node))) {
          continue
        }
        const newNode = editor.domParseNode(elm)
        //加入到节点中
        editor.addNodeAfter(newNode, node)
        //更新光标
        if (editor.isSelectionInTargetNode(node)) {
          editor.setSelectionAfter(newNode, 'all')
        }
        //移除旧节点
        const index = (node.parent ? node.parent.children! : editor.stackNodes).findIndex(item => item.isEqual(node))
        ;(node.parent ? node.parent.children! : editor.stackNodes).splice(index, 1)
      }
      editor.updateView()
    }
  })
  editor.domObserver.observe(editor.$el!, {
    attributes: false,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true
  })
}
