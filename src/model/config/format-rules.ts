import { string as DapString } from 'dap-util'
import { isZeroWidthText } from '@/tools'
import { Editor } from '../Editor'
import { KNode } from '../KNode'
import { applyMergeNode, convertToBlock, getAllowMergeNode } from './function'

/**
 * 格式化函数类型
 */
export type RuleFunctionType = (state: { editor: Editor; node: KNode }) => void

/**
 * 针对节点自身：处理块节点的标签，部分块节点需要转为默认块节点标签
 */
export const fomratBlockTagParse: RuleFunctionType = ({ editor, node }) => {
	if (node.isMatch({ tag: 'address' }) || node.isMatch({ tag: 'article' }) || node.isMatch({ tag: 'aside' }) || node.isMatch({ tag: 'nav' }) || node.isMatch({ tag: 'section' })) {
		editor.toParagraph(node)
	}
}

/**
 * 针对子节点中的块节点：行内节点的子节点中含有块节点则该节点转为块节点；子节点中的其他节点也转为块节点
 */
export const formatBlockInChildren: RuleFunctionType = ({ editor, node }) => {
	//当前节点存在子节点
	if (node.hasChildren() && !node.isEmpty()) {
		//子节点中存在非空的块节点
		const hasBlock = node.children!.some(item => item.isBlock() && !item.isEmpty())
		if (hasBlock) {
			//将子节点中的非空非块节点转为块节点
			node.children!.forEach(item => {
				if (!item.isEmpty() && !item.isBlock()) {
					convertToBlock.apply(editor, [item])
				}
			})
			if (!node.isBlock()) {
				convertToBlock.apply(editor, [node])
			}
		}
	}
}

/**
 * 针对节点自身：处理不可编辑的非块级节点：在两侧添加零宽度无断空白字符 & 重置不可编辑节点内的光标位置
 */
export const formatUneditableNoodes: RuleFunctionType = ({ editor, node }) => {
	const uneditableNode = node.getUneditable()
	if (uneditableNode && !uneditableNode.isEmpty() && !uneditableNode.isBlock()) {
		const previousNode = uneditableNode.getPrevious(uneditableNode.parent ? uneditableNode.parent!.children! : editor.stackNodes)
		const nextNode = node.getNext(uneditableNode.parent ? uneditableNode.parent!.children! : editor.stackNodes)
		//前一个节点不存在或者不是零宽度空白文本节点
		if (!previousNode || !previousNode.isZeroWidthText()) {
			const zeroWidthText = KNode.createZeroWidthText()
			editor.addNodeBefore(zeroWidthText, uneditableNode)
		}
		//后一个节点不存在或者不是零宽度空白文本节点
		if (!nextNode || !nextNode.isZeroWidthText()) {
			const zeroWidthText = KNode.createZeroWidthText()
			editor.addNodeAfter(zeroWidthText, uneditableNode)
		}
		//是用户操作的删除行为，则需要更新光标位置
		if (editor.isUserDelection) {
			//起点和终点都在不可编辑的节点里
			if (editor.isSelectionInNode(uneditableNode, 'all')) {
				const previousSelectionNode = editor.getPreviousSelectionNode(uneditableNode)!
				const nexteSelectionNode = editor.getNextSelectionNode(uneditableNode)!
				//起点和终点在一起
				if (editor.selection.collapsed()) {
					//如果光标在不可编辑节点的最前面，则移动到前一个可设置光标的节点的后面
					const firstNode = editor.getFirstSelectionNode(uneditableNode)!
					if (firstNode.isEqual(editor.selection.start!.node) && editor.selection.start!.offset == 0) {
						editor.setSelectionAfter(previousSelectionNode, 'all')
					}
					//否则一律设置到后一个可设置光标的节点的前面
					else {
						editor.setSelectionBefore(nexteSelectionNode, 'all')
					}
				}
				//起点和终点不在一起，则选中该不可编辑的节点
				else {
					editor.setSelectionAfter(previousSelectionNode, 'start')
					editor.setSelectionBefore(nexteSelectionNode, 'end')
				}
			}
			//起点在不可编辑的节点里，则更新起点位置
			else if (editor.isSelectionInNode(uneditableNode, 'start')) {
				const nexteSelectionNode = editor.getNextSelectionNode(uneditableNode)!
				editor.setSelectionBefore(nexteSelectionNode, 'start')
			}
			//终点在不可编辑的节点里，则更新终点位置
			else if (editor.isSelectionInNode(uneditableNode, 'end')) {
				const previousSelectionNode = editor.getPreviousSelectionNode(uneditableNode)!
				editor.setSelectionAfter(previousSelectionNode, 'end')
			}
		}
	}
}

/**
 * 针对节点的子节点数组：处理子节点中的占位符，如果占位符和其他节点共存则删除占位符，如果只存在占位符则将多个占位符合并为一个（光标可能会更新）
 */
export const formatPlaceholderMerge: RuleFunctionType = ({ editor, node }) => {
	//当前节点存在子节点
	if (node.hasChildren()) {
		//过滤子节点中的空节点
		const children = node.children!.filter(item => {
			return !item.isEmpty()
		})
		//子节点数组中的占位符节点
		const placeholderNodes = children.filter(item => {
			return item.isPlaceholder()
		})
		//占位符节点在行内节点中则清除
		if (node.isInline() && !!placeholderNodes.length) {
			placeholderNodes.forEach(item => {
				item.toEmpty()
			})
		}
		//子节点数量大于1并且都是占位符，则只保留第一个
		else if (children.length > 1 && placeholderNodes.length == children.length) {
			//光标聚焦情况下
			if (editor.selection.focused()) {
				//如果起点在该节点里，则移动到第一个占位符上
				if (node.isContains(editor.selection.start!.node)) {
					editor.setSelectionBefore(placeholderNodes[0], 'start')
				}
				//如果终点在该节点里，则移动到第一个占位符上
				if (node.isContains(editor.selection.end!.node)) {
					editor.setSelectionBefore(placeholderNodes[0], 'end')
				}
			}
			node.children = [placeholderNodes[0]]
		}
		//子节点数量大于1并且有占位符也有其他节点则把占位符节点都置为空节点
		else if (children.length > 1 && !!placeholderNodes.length) {
			placeholderNodes.forEach(item => {
				item.toEmpty()
			})
		}
	}
}

/**
 * 针对节点自身：将文本节点内连续的零宽度无断空白字符合并（光标可能会更新）
 */
export const formatZeroWidthTextMerge: RuleFunctionType = ({ editor, node }) => {
	//非空文本节点存在空白字符
	if (node.isText() && !node.isEmpty() && node.textContent!.split('').some(item => isZeroWidthText(item))) {
		let val = node.textContent!
		let i = 0
		while (i < val.length) {
			//获取当前字符串
			const chart = val.charAt(i)
			//如果当前字符是空白字符并且前一个字符也是空白字符
			if (i > 0 && isZeroWidthText(chart) && isZeroWidthText(val.charAt(i - 1))) {
				//如果起点在节点上并且起点在当前这个空白字符上或者后面
				if (editor.isSelectionInNode(node, 'start') && editor.selection.start!.offset >= i + 1) {
					editor.selection.start!.offset -= 1
				}
				//如果终点在节点上并且终点在当前这个空白字符上或者后面
				if (editor.isSelectionInNode(node, 'end') && editor.selection.end!.offset >= i + 1) {
					editor.selection.end!.offset -= 1
				}
				//删除空白字符
				val = DapString.delete(val, i, 1)
				//跳过后续
				continue
			}
			i++
		}
		node.textContent = val
	}
}

/**
 * 针对节点的子节点数组：兄弟节点合并策略（光标可能会更新）
 */
export const formatSiblingNodesMerge: RuleFunctionType = ({ editor, node }) => {
	//有子节点并且子节点数大于1
	if ((node.isBlock() || node.isInline()) && node.hasChildren() && node.children!.length > 1) {
		let index = 0
		//因为父子节点的合并操作会导致children没有，此时判断一下hasChildren
		while (node.hasChildren() && index <= node.children!.length - 2) {
			const newTargetNode = getAllowMergeNode.apply(editor, [node.children![index], 'nextSibling'])
			if (newTargetNode) {
				//兄弟节点合并
				applyMergeNode.apply(editor, [node.children![index], 'nextSibling'])
				//合并完成后执行合并空白文本
				formatZeroWidthTextMerge({ editor, node: node.children![index] })
				//子节点合并后可能只有一个子节点了，此时进行父子节点合并操作
				if (node.hasChildren() && node.children!.length == 1) {
					applyMergeNode.apply(editor, [node.children![0], 'parent'])
				}
				continue
			}
			index++
		}
	}
}

/**
 * 针对节点的子节点数组：父子节点合并策略（光标可能会更新）
 */
export const formatParentNodeMerge: RuleFunctionType = ({ editor, node }) => {
	//只有一个子节点
	if ((node.isBlock() || node.isInline()) && node.hasChildren() && node.children!.length == 1) {
		//父子节点进行合并
		if (getAllowMergeNode.apply(editor, [node.children![0], 'parent'])) {
			applyMergeNode.apply(editor, [node.children![0], 'parent'])
			//父子节点合并后，可能父节点需要再和兄弟节点进行合并
			if (getAllowMergeNode.apply(editor, [node, 'prevSibling'])) {
				applyMergeNode.apply(editor, [node, 'prevSibling'])
			} else if (getAllowMergeNode.apply(editor, [node, 'nextSibling'])) {
				applyMergeNode.apply(editor, [node, 'nextSibling'])
			}
		}
	}
}
