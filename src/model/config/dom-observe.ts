import { NODE_MARK } from '@/view'
import { Editor } from '../Editor'
import { KNode } from '../KNode'

/**
 * 更新数据类型
 */
type ObserverUpdateDataType = {
  elm: Node
  type: 'add' | 'remove' | 'update'
}

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
    //需要更新的数据
    const updateRecords: ObserverUpdateDataType[] = []
    //遍历
    for (let i = 0; i < mutationList.length; i++) {
      const mutationRecord = mutationList[i]
      //文本变更和属性变更
      if (mutationRecord.type == 'characterData') {
        //更新数据里不存在则加入
        if (!updateRecords.find(item => item.type === 'update' && item.elm === mutationRecord.target)) {
          updateRecords.push({
            type: 'update',
            elm: mutationRecord.target
          })
        }
      }
      //属性变更
      else if (mutationRecord.type == 'attributes') {
        //不是编辑器容器的属性变更且更新数据里不存在则加入
        if (mutationRecord.target != editor.$el && !updateRecords.find(item => item.type === 'update' && item.elm === mutationRecord.target)) {
          updateRecords.push({
            type: 'update',
            elm: mutationRecord.target
          })
        }
      }
      //子元素变更
      else if (mutationRecord.type == 'childList') {
        //新增子元素
        if (mutationRecord.addedNodes.length > 0) {
          mutationRecord.addedNodes.forEach(addNode => {
            //更新数据里不存在则加入
            if (!updateRecords.find(item => item.type === 'add' && item.elm === addNode)) {
              updateRecords.push({
                type: 'add',
                elm: addNode
              })
            }
          })
        }
        //删除子元素
        if (mutationRecord.removedNodes.length > 0) {
          mutationRecord.removedNodes.forEach(removedNode => {
            const recordIndex = updateRecords.findIndex(item => item.type === 'add' && item.elm === removedNode)
            //更新数据里有个同元素的新增记录则二者抵消，都不加入到更新数据里
            if (recordIndex > -1) {
              //移除同元素的新增记录
              updateRecords.splice(recordIndex, 1)
            }
            //更新数据里没有同元素的更新记录则加入到更新数据里
            else if (!updateRecords.find(item => item.type === 'remove' && item.elm === removedNode)) {
              updateRecords.push({
                type: 'remove',
                elm: removedNode
              })
            }
          })
        }
      }
    }
    if (updateRecords.length > 0) {
      updateRecords.forEach(record => {
        //重新生成新节点替代旧节点
        if (record.type === 'update') {
          //获取dom
          const elm = (record.elm.nodeType === 3 ? record.elm.parentNode! : record.elm) as HTMLElement
          const nodeKey = elm.getAttribute(NODE_MARK)
          //根据dom查找到旧节点
          const node = nodeKey ? KNode.searchByKey(nodeKey, editor.stackNodes) : null
          if (node) {
            //根据dom生成新的节点
            const newNode = editor.domParseNode(elm)
            //新节点添加到旧节点后
            editor.addNodeAfter(newNode, node)
            //如果光标起点在旧节点中则设置到新节点最后
            if (editor.isSelectionInTargetNode(node, 'start')) {
              editor.setSelectionAfter(newNode, 'start')
            }
            //如果光标终点在旧节点中则设置到新节点最后
            if (editor.isSelectionInTargetNode(node, 'end')) {
              editor.setSelectionAfter(newNode, 'end')
            }
            //获取旧节点的位置
            const index = (node.parent ? node.parent.children! : editor.stackNodes).findIndex(item => item.isEqual(node))
            //删除旧节点
            ;(node.parent ? node.parent.children! : editor.stackNodes).splice(index, 1)
          }
        }
        //添加新节点
        else if (record.type === 'add') {
          //type=update的元素包含该新加的元素则不处理了，因为update时已经处理了
          if (updateRecords.some(item => item.type === 'update' && (item.elm.nodeType === 3 ? item.elm.parentNode! : item.elm).contains(record.elm))) {
            return
          }
          //dom的父元素
          const parentElement = record.elm.parentNode as HTMLElement
          //dom在父元素中的序列
          const index = Array.from(parentElement.childNodes).findIndex(item => item === record.elm)
          //根据dom生成新的节点
          const node = editor.domParseNode(record.elm)
          //如果dom的父元素是编辑器容器，则加入到编辑器根部
          if (parentElement === editor.$el) {
            editor.stackNodes.splice(index, 0, node)
          }
          //如果dom的父元素不是编辑器容器，则加入到父节点对应位置中
          else {
            const nodeKey = parentElement.getAttribute(NODE_MARK)
            const parentNode = nodeKey ? KNode.searchByKey(nodeKey, editor.stackNodes) : null
            //找到父节点，将新节点加入到父节点中
            if (parentNode) editor.addNode(node, parentNode, index)
          }
          //删除dom
          parentElement.removeChild(record.elm)
        }
        //删除节点
        else if (record.type === 'remove') {
          //type=update的元素包含该移除的元素则不处理了，因为update时已经处理了
          if (updateRecords.some(item => item.type === 'update' && (item.elm.nodeType === 3 ? item.elm.parentNode! : item.elm).contains(record.elm))) {
            return
          }
          //获取dom
          const elm = (record.elm.nodeType === 3 ? record.elm.parentNode! : record.elm) as HTMLElement
          const nodeKey = elm.getAttribute(NODE_MARK)
          const node = nodeKey ? KNode.searchByKey(nodeKey, editor.stackNodes) : null
          //是合法的dom被删除，找到该节点
          if (node) {
            //起点是否在旧节点内
            const startInNode = editor.isSelectionInTargetNode(node, 'start')
            //终点是否在旧节点内
            const endInNode = editor.isSelectionInTargetNode(node, 'end')
            //置空节点
            node.toEmpty()
            //如果起点在旧节点内，则更新到最近位置
            if (startInNode) {
              editor.updateSelectionRecently('start')
            }
            //如果终点在旧节点内，则更新到最近位置
            if (endInNode) {
              editor.updateSelectionRecently('end')
            }
          }
        }
      })
      editor.updateView()
    }
  })
  editor.domObserver.observe(editor.$el!, {
    attributes: true,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true
  })
}
