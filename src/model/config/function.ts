//这里放的都是和编辑器相关的方法，但是不想对外暴露的

import { Editor } from '../Editor'
import { KNode } from '../KNode'

/**
 * 获取选区内的可聚焦节点所在的块节点数组
 */
export const getSelectionBlockNodes = (editor: Editor) => {
	const focusNodes = editor.getFocusNodesBySelection('all')
	const blockNodes: KNode[] = []
	focusNodes.forEach(item => {
		const blockNode = item.getBlock()
		if (!blockNodes.some(node => node.isEqual(blockNode))) {
			blockNodes.push(blockNode)
		}
	})
	return blockNodes
}

/**
 * 打散指定的节点，将其分裂成多个节点，如果子孙节点还有子节点则继续打散
 */
export const splitNodeToNodes = (editor: Editor, node: KNode) => {
	if (node.hasChildren()) {
		node.children!.forEach(item => {
			if (!item.isClosed()) {
				item.marks = { ...(item.marks || {}), ...(node.marks || {}) }
				item.styles = { ...(item.styles || {}), ...(node.styles || {}) }
			}
			editor.addNodeBefore(item, node)
			splitNodeToNodes(editor, item)
		})
		node.children = []
	}
}
