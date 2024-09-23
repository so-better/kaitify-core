import { common as DapCommon } from 'dap-util'
import { Editor, EditorSelectedType, KNode, KNodeMarksType, KNodeStylesType } from '../model'

/**
 * 获取子孙节点中的文本节点
 */
const getChildrenTextNode = (editor: Editor, nodes: KNode[]): KNode[] => {
	const textNodes: KNode[] = []
	nodes.forEach(node => {
		if (node.isText()) {
			textNodes.push(node)
		} else if (node.hasChildren()) {
			textNodes.push(...getChildrenTextNode(editor, node.children!))
		}
	})
	return textNodes
}

/**
 * 根据选区结果获取所有的文本节点，该方法可能会分割文本节点，更新光标位置
 */
const getSelectedTextNode = (editor: Editor, selectedResult: EditorSelectedType[]) => {
	const length = selectedResult.length
	const textNodes: KNode[] = []
	let i = 0
	while (i < length) {
		const item = selectedResult[i]
		//文本节点
		if (item.node.isText()) {
			//选择部分文本
			if (item.offset) {
				const textContent = item.node.textContent!
				//选中了文本的前半段
				if (item.offset[0] == 0) {
					const newTextNode = item.node.clone(true)
					editor.addNodeAfter(newTextNode, item.node)
					item.node.textContent = textContent.substring(0, item.offset[1])
					newTextNode.textContent = textContent.substring(item.offset[1])
					textNodes.push(item.node)
				}
				//选中了文本的后半段
				else if (item.offset[1] == textContent.length) {
					const newTextNode = item.node.clone(true)
					editor.addNodeBefore(newTextNode, item.node)
					newTextNode.textContent = textContent.substring(0, item.offset[0])
					item.node.textContent = textContent.substring(item.offset[0])
					textNodes.push(item.node)
				}
				//选中文本中间部分
				else {
					const newBeforeTextNode = item.node.clone(true)
					const newAfterTextNode = item.node.clone(true)
					editor.addNodeBefore(newBeforeTextNode, item.node)
					editor.addNodeAfter(newAfterTextNode, item.node)
					newBeforeTextNode.textContent = textContent.substring(0, item.offset[0])
					item.node.textContent = textContent.substring(item.offset[0], item.offset[1])
					newAfterTextNode.textContent = textContent.substring(item.offset[1])
					textNodes.push(item.node)
				}
				//重置光标位置
				if (editor.isSelectionInNode(item.node, 'start')) {
					editor.setSelectionBefore(item.node, 'start')
				}
				if (editor.isSelectionInNode(item.node, 'end')) {
					editor.setSelectionAfter(item.node, 'end')
				}
			}
			//选择整个文本
			else {
				textNodes.push(item.node)
			}
		}
		//非文本节点存在子节点数组
		else if (item.node.hasChildren()) {
			textNodes.push(...getChildrenTextNode(editor, item.node.children!))
		}
		i++
	}
	return textNodes
}

/**
 * 根据选区结果获取所有的文本节点，不进行切割，该方法拿到的节点数组只能用来做判断
 */
const getSelectedNodesWithoutSplit = (editor: Editor, selectedResult: EditorSelectedType[]) => {
	const length = selectedResult.length
	const textNodes: KNode[] = []
	let i = 0
	while (i < length) {
		const item = selectedResult[i]
		//文本节点
		if (item.node.isText()) {
			textNodes.push(item.node)
		}
		//非文本节点存在子节点数组
		else if (item.node.hasChildren()) {
			textNodes.push(...getChildrenTextNode(editor, item.node.children!))
		}
		i++
	}
	return textNodes
}

/**
 * 移除单个文本节点的样式
 */
const removeTextNodeStyles = (node: KNode, styleNames?: string[]) => {
	//删除指定样式
	if (styleNames && node.hasStyles()) {
		const styles: KNodeStylesType = {}
		Object.keys(node.styles!).forEach(key => {
			if (!styleNames.includes(key)) {
				styles[key] = node.styles![key]
			}
		})
		node.styles = styles
	}
	//删除所有的样式
	else {
		node.styles = {}
	}
}

/**
 * 移除单个文本节点的标记
 */
const removeTextNodeMarks = (node: KNode, markNames?: string[]) => {
	//删除指定标记
	if (markNames && node.hasMarks()) {
		const marks: KNodeMarksType = {}
		Object.keys(node.marks!).forEach(key => {
			if (!markNames.includes(key)) {
				marks[key] = node.marks![key]
			}
		})
		node.marks = marks
	}
	//删除所有的标记
	else {
		node.marks = {}
	}
}

/**
 * 判断单个文本节点是否拥有某个样式
 */
const isTextNodeStyle = (node: KNode, styleName: string, styleValue?: string | number) => {
	if (node.hasStyles()) {
		if (styleValue) {
			return node.styles![styleName] == styleValue
		}
		return node.styles!.hasOwnProperty(styleName)
	}
	return false
}

/**
 * 判断单个文本节点是否拥有某个标记
 */
const isTextNodeMark = (node: KNode, markName: string, markValue?: string | number) => {
	if (node.hasMarks()) {
		if (markValue) {
			return node.marks![markName] == markValue
		}
		return node.marks!.hasOwnProperty(markName)
	}
	return false
}

/**
 * 设置光标所在文本样式
 */
export const setTextStyle = (editor: Editor, styles: KNodeStylesType) => {
	if (!editor.selection.focused()) {
		return
	}
	//起点和终点在一起
	if (editor.selection.collapsed()) {
		const node = editor.selection.start!.node
		//空白文本节点直接设置样式
		if (node.isZeroWidthText()) {
			if (node.hasStyles()) {
				Object.assign(node.styles!, DapCommon.clone(styles))
			} else {
				node.styles = DapCommon.clone(styles)
			}
		}
		//文本节点
		else if (node.isText()) {
			//新建一个空白文本节点
			const newTextNode = KNode.createZeroWidthText()
			//继承文本节点的样式和标记
			newTextNode.styles = DapCommon.clone(node.styles)
			newTextNode.marks = DapCommon.clone(node.marks)
			//设置样式
			if (newTextNode.hasStyles()) {
				Object.assign(newTextNode.styles!, DapCommon.clone(styles))
			} else {
				newTextNode.styles = DapCommon.clone(styles)
			}
			//插入空白文本节点
			editor.insertNode(newTextNode)
		}
		//闭合节点
		else {
			//新建一个空白文本节点
			const newTextNode = KNode.createZeroWidthText()
			//设置样式
			newTextNode.styles = DapCommon.clone(styles)
			//插入空白文本节点
			editor.insertNode(newTextNode)
		}
	}
	//存在选区
	else {
		const selectedResult = editor.getSelectedNodes()
		getSelectedTextNode(editor, selectedResult).forEach(item => {
			if (item.hasStyles()) {
				item.styles = { ...item.styles, ...styles }
			} else {
				item.styles = { ...styles }
			}
		})
	}
}

/**
 * 设置光标所在文本标记
 */
export const setTextMark = (editor: Editor, marks: KNodeMarksType) => {
	if (!editor.selection.focused()) {
		return
	}
	//起点和终点在一起
	if (editor.selection.collapsed()) {
		const node = editor.selection.start!.node
		//空白文本节点直接设置标记
		if (node.isZeroWidthText()) {
			if (node.hasMarks()) {
				Object.assign(node.marks!, DapCommon.clone(marks))
			} else {
				node.marks = DapCommon.clone(marks)
			}
		}
		//文本节点
		else if (node.isText()) {
			//新建一个空白文本节点
			const newTextNode = KNode.createZeroWidthText()
			//继承文本节点的样式和标记
			newTextNode.styles = DapCommon.clone(node.styles)
			newTextNode.marks = DapCommon.clone(node.marks)
			//设置标记
			if (newTextNode.hasMarks()) {
				Object.assign(newTextNode.marks!, DapCommon.clone(marks))
			} else {
				newTextNode.marks = DapCommon.clone(marks)
			}
			//插入空白文本节点
			editor.insertNode(newTextNode)
		}
		//闭合节点
		else {
			//新建一个空白文本节点
			const newTextNode = KNode.createZeroWidthText()
			//设置样式
			newTextNode.marks = DapCommon.clone(marks)
			//插入空白文本节点
			editor.insertNode(newTextNode)
		}
	}
	//存在选区
	else {
		const selectedResult = editor.getSelectedNodes()
		getSelectedTextNode(editor, selectedResult).forEach(item => {
			if (item.hasMarks()) {
				item.marks = { ...item.marks, ...marks }
			} else {
				item.marks = { ...marks }
			}
		})
	}
}

/**
 * 移除光标所在文本样式
 */
export const removeTextStyle = (editor: Editor, styleNames?: string[]) => {
	if (!editor.selection.focused()) {
		return
	}
	//起点和终点在一起
	if (editor.selection.collapsed()) {
		const node = editor.selection.start!.node
		//空白文本节点直接移除样式
		if (node.isZeroWidthText()) {
			removeTextNodeStyles(node, styleNames)
		}
		//文本节点则新建一个空白文本节点
		else if (node.isText()) {
			const newTextNode = KNode.createZeroWidthText()
			//继承文本节点的样式和标记
			newTextNode.styles = DapCommon.clone(node.styles)
			newTextNode.marks = DapCommon.clone(node.marks)
			//移除样式
			removeTextNodeStyles(newTextNode, styleNames)
			//插入
			editor.insertNode(newTextNode)
		}
	}
	//存在选区
	else {
		const selectedResult = editor.getSelectedNodes()
		getSelectedTextNode(editor, selectedResult).forEach(item => {
			removeTextNodeStyles(item, styleNames)
		})
	}
}

/**
 * 移除光标所在文本标记
 */
export const removeTextMark = (editor: Editor, markNames?: string[]) => {
	if (!editor.selection.focused()) {
		return
	}
	//起点和终点在一起
	if (editor.selection.collapsed()) {
		const node = editor.selection.start!.node
		//空白文本节点直接移除标记
		if (node.isZeroWidthText()) {
			removeTextNodeMarks(node, markNames)
		}
		//文本节点则新建一个空白文本节点
		else if (node.isText()) {
			const newTextNode = KNode.createZeroWidthText()
			//继承文本节点的样式和标记
			newTextNode.styles = DapCommon.clone(node.styles)
			newTextNode.marks = DapCommon.clone(node.marks)
			//移除标记
			removeTextNodeMarks(newTextNode, markNames)
			//插入
			editor.insertNode(newTextNode)
		}
	}
	//存在选区
	else {
		const selectedResult = editor.getSelectedNodes()
		getSelectedTextNode(editor, selectedResult).forEach(item => {
			removeTextNodeMarks(item, markNames)
		})
	}
}

/**
 * 判断光标所在文本是否具有某个样式
 */
export const isTextStyle = (editor: Editor, styleName: string, styleValue?: string | number) => {
	if (!editor.selection.focused()) {
		return false
	}
	//起点和终点在一起
	if (editor.selection.collapsed()) {
		const node = editor.selection.start!.node
		//文本节点
		if (node.isText()) {
			return isTextNodeStyle(node, styleName, styleValue)
		}
		return false
	}
	//存在选区
	const selectedResult = editor.getSelectedNodes()
	return getSelectedNodesWithoutSplit(editor, selectedResult).every(item => isTextNodeStyle(item, styleName, styleValue))
}

/**
 * 判断光标所在文本是否具有某个标记
 */
export const isTextMark = (editor: Editor, markName: string, markValue?: string | number) => {
	if (!editor.selection.focused()) {
		return false
	}
	//起点和终点在一起
	if (editor.selection.collapsed()) {
		const node = editor.selection.start!.node
		//文本节点
		if (node.isText()) {
			return isTextNodeMark(node, markName, markValue)
		}
		return false
	}
	//存在选区
	const selectedResult = editor.getSelectedNodes()
	return getSelectedNodesWithoutSplit(editor, selectedResult).every(item => isTextNodeMark(item, markName, markValue))
}
