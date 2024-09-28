import { string as DapString } from 'dap-util'
import { isZeroWidthText } from '../../tools'
import { Editor } from '../Editor'
import { KNode, KNodeMarksType, KNodeStylesType } from '../KNode'

/**
 * 格式化函数类型
 */
export type RuleFunctionType = (opts: { editor: Editor; node: KNode }) => void

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

/**
 * 处理子节点中的块节点，如果父节点是行内节点则将块节点转为行内节点，如果块节点和其他节点并存亦将块节点转为行内节点
 */
export const formatBlockInChildren: RuleFunctionType = ({ node }) => {
	//当前节点存在子节点
	if (node.hasChildren() && !node.isEmpty()) {
		//过滤子节点中的空节点和占位符（因为占位符会在存在其他节点时清除，所以不考虑）
		const nodes = node.children!.filter(item => {
			return !item.isEmpty() && !item.isPlaceholder()
		})
		//获取子节点中的块节点
		const blockNodes = nodes.filter(item => {
			return item.isBlock()
		})
		//存在块节点时如果当前节点是行内节点 或者 子节点中存在其他节点
		if (blockNodes.length && (node.isInline() || blockNodes.length != nodes.length)) {
			//将块节点转为行内节点
			blockNodes.forEach(item => {
				item.type = 'inline'
			})
		}
	}
}

/**
 * 处理一些需要转为文本节点的特殊节点
 */
export const formatInlineParseText: RuleFunctionType = ({ editor, node }) => {
	if (!node.isEmpty() && node.tag && ['b', 'strong', 'sup', 'sub', 'i', 'u', 'del', 'font'].includes(node.tag)) {
		//针对这些特殊的节点设置对应的样式
		const styles: KNodeStylesType = node.styles || {}
		const marks: KNodeMarksType = node.marks || {}
		switch (node.tag) {
			case 'b':
			case 'strong':
				node.styles = {
					...styles,
					fontWeight: 'bold'
				}
				break
			case 'sup':
				node.styles = {
					...styles,
					verticalAlign: 'super'
				}
				break
			case 'sub':
				node.styles = {
					...styles,
					verticalAlign: 'sub'
				}
				break
			case 'i':
				node.styles = {
					...styles,
					fontStyle: 'italic'
				}
				break
			case 'u':
				node.styles = {
					...styles,
					textDecorationLine: 'underline'
				}
				break
			case 'del':
				node.styles = {
					...styles,
					textDecorationLine: 'line-through'
				}
				break
			case 'font':
				node.styles = {
					...styles,
					fontFamily: (marks.face as string) || ''
				}
				delete marks.face
				node.marks = marks
				break
		}
		//将节点标签转为默认的文本标签
		node.tag = editor.textRenderTag
		//有子节点的节点进行拆分
		splitNodeToNodes(editor, node)
	}
}

/**
 * 处理不可编辑的非块级节点：在两侧添加零宽度无断空白字符
 */
export const formatUneditableNoodes: RuleFunctionType = ({ editor, node }) => {
	const uneditableNode = node.getUneditable()
	if (uneditableNode && !uneditableNode.isEmpty()) {
		//非块节点处理
		if (!uneditableNode.isBlock()) {
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
			//起点在不可编辑的节点里，则更新起点位置
			if (editor.isSelectionInNode(uneditableNode, 'start')) {
				editor.updateSelectionRecently('start')
			}
			//终点在不可编辑的节点里，则更新终点位置
			if (editor.isSelectionInNode(uneditableNode, 'end')) {
				editor.updateSelectionRecently('end')
			}
		}
	}
}

/**
 * 处理子节点中的占位符，如果占位符和其他节点共存则删除占位符，如果只存在占位符则将多个占位符合并为一个（光标可能会更新）
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
		if (node.isInline() && placeholderNodes.length) {
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
		else if (children.length > 1 && placeholderNodes.length) {
			placeholderNodes.forEach(item => {
				item.toEmpty()
			})
		}
	}
}

/**
 * 将文本节点内连续的零宽度无断空白字符合并（光标可能会更新）
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
 * 兄弟节点合并策略（光标可能会更新）
 */
export const formatSiblingNodesMerge: RuleFunctionType = ({ editor, node }) => {
	//有子节点并且子节点数大于1
	if ((node.isBlock() || node.isInline()) && node.hasChildren() && node.children!.length > 1) {
		let index = 0
		//因为父子节点的合并操作会导致children没有，此时判断一下hasChildren
		while (node.hasChildren() && index <= node.children!.length - 2) {
			const newTargetNode = editor.getAllowMergeNode(node.children![index], 'nextSibling')
			if (newTargetNode) {
				editor.applyMergeNode(node.children![index], 'nextSibling')
				//子节点合并后可能只有一个子节点了，此时进行父子节点合并操作
				if (node.hasChildren() && node.children!.length == 1) {
					editor.applyMergeNode(node.children![0], 'parent')
				}
				continue
			}
			index++
		}
	}
}

/**
 * 父子节点合并策略（光标可能会更新）
 */
export const formatParentNodeMerge: RuleFunctionType = ({ editor, node }) => {
	//只有一个子节点
	if ((node.isBlock() || node.isInline()) && node.hasChildren() && node.children!.length == 1) {
		//父子节点进行合并
		if (editor.getAllowMergeNode(node.children![0], 'parent')) {
			editor.applyMergeNode(node.children![0], 'parent')
			//父子节点合并后，可能父节点需要再和兄弟节点进行合并
			if (editor.getAllowMergeNode(node, 'prevSibling')) {
				editor.applyMergeNode(node, 'prevSibling')
			} else if (editor.getAllowMergeNode(node, 'nextSibling')) {
				editor.applyMergeNode(node, 'nextSibling')
			}
		}
	}
}
