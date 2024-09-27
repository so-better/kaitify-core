import { Editor } from '../Editor'

/**
 * 判断是否合法dom
 */
const isLegalDom = (editor: Editor, dom: Node) => {
	let legal = true
	//文本元素
	if (dom.nodeType == 3) {
		//存在父元素并且父元素只有这么一个子元素
		if (dom.parentNode && dom.parentNode.childNodes.length == 1) {
			try {
				//查找父元素对应的节点
				const node = editor.findNode(dom.parentNode as HTMLElement)
				if (!node.isText()) {
					legal = false
				}
			} catch (error) {
				legal = false
			}
		} else {
			legal = false
		}
	} else if (dom.nodeType == 1) {
		//非文本元素
		try {
			//查找该元素对应的节点
			editor.findNode(dom as HTMLElement)
		} catch (error) {
			legal = false
		}
	}
	return legal
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
 */
export const setDomObserve = (editor: Editor) => {
	if (!window.MutationObserver) {
		console.warn('The current browser does not support MutationObserver')
	}
	removeDomObserve(editor)
	editor.domObserver = new MutationObserver(mutationList => {
		//中文输入的情况下不处理
		if (editor.isComposition) {
			return
		}
		//是否发生更新
		let hasUpdate = false
		//非法dom数组
		const illegalDoms: Node[] = []
		//遍历
		for (let i = 0; i < mutationList.length; i++) {
			const mutationRecord = mutationList[i]
			//文本变更
			if (mutationRecord.type == 'characterData') {
				//父元素
				const parentElement = mutationRecord.target.parentNode! as HTMLElement
				//获取对应的节点
				const parentNode = editor.findNode(parentElement)
				//是文本节点且文本不一致
				if (parentNode.isText() && parentNode.textContent != mutationRecord.target.textContent) {
					const textContent = parentNode.textContent || ''
					//更新文本内容
					parentNode.textContent = mutationRecord.target.textContent || ''
					//更新光标
					if (editor.isSelectionInNode(parentNode)) {
						editor.updateSelection()
					}
					//这里先取消dom监听
					removeDomObserve(editor)
					//移除非法的文本
					mutationRecord.target.textContent = textContent
					//重新设置dom监听
					setDomObserve(editor)
					//更新标识
					hasUpdate = true
				}
				//不是文本节点
				else if (!parentNode.isText()) {
					//子元素在父元素中的位置
					const index = Array.from(parentElement.childNodes).findIndex(item => item === mutationRecord.target)
					//将子元素转为节点
					const node = editor.domParseNode(mutationRecord.target)
					//添加到编辑器内
					parentNode.children!.splice(index, 0, node)
					node.parent = parentNode
					//删除非法dom
					illegalDoms.push(mutationRecord.target)
					//重置光标到节点后
					if (editor.selection.focused()) {
						editor.setSelectionAfter(node, 'all')
					}
					//更新标识
					hasUpdate = true
				}
			}
			//子元素变更
			else if (mutationRecord.type == 'childList') {
				//新增元素中存在非法的元素
				const elements = Array.from(mutationRecord.addedNodes).filter(item => !isLegalDom(editor, item))
				if (elements.length > 0) {
					//非法元素的父元素
					const parentElement = mutationRecord.target as HTMLElement
					//父元素是编辑器容器
					if (parentElement === editor.$el!) {
						elements.forEach(el => {
							//子元素在父元素中的位置
							const index = Array.from(parentElement.childNodes).findIndex(item => item === el)
							//将子元素转为节点
							const node = editor.domParseNode(el)
							//添加到编辑器内
							editor.stackNodes.splice(index, 0, node)
							//删除非法dom
							illegalDoms.push(el)
							//重置光标到节点后
							if (editor.selection.focused()) {
								editor.setSelectionAfter(node, 'all')
							}
							//更新标识
							hasUpdate = true
						})
					}
					//不是编辑器容器的情况
					else {
						//获取父元素对应的node
						const parentNode = editor.findNode(parentElement)
						elements.forEach(el => {
							//子元素在父元素中的位置
							const index = Array.from(parentElement.childNodes).findIndex(item => item === el)
							//将子元素转为节点
							const node = editor.domParseNode(el)
							//添加到编辑器内
							if (parentNode.hasChildren()) {
								parentNode.children!.splice(index, 0, node)
								node.parent = parentNode
							} else {
								parentNode.parent!.children!.splice(index, 0, node)
								node.parent = parentNode.parent!
							}
							//删除非法dom
							illegalDoms.push(el)
							//重置光标到节点后
							if (editor.selection.focused()) {
								editor.setSelectionAfter(node, 'all')
							}
							//更新标识
							hasUpdate = true
						})
					}
				}
			}
		}
		//有dom变化
		if (hasUpdate) {
			//删除非法dom
			illegalDoms.forEach(item => {
				item.parentNode?.removeChild(item)
			})
			//更新视图
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
