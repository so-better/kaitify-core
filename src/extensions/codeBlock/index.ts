import { Editor, KNode, KNodeMarksType } from '../../model'
import { getSelectionBlockNodes } from '../../model/config/function'
import { Extension } from '../Extension'
import { getHljsHtml, HljsLanguages, HljsLanguageType } from './hljs'

declare module '../../model' {
	interface EditorCommandsType {
		getCodeBlock?: () => KNode | null
		hasCodeBlock?: () => boolean
		allCodeBlock?: () => boolean
		setCodeBlock?: () => Promise<void>
		unsetCodeBlock?: () => Promise<void>
		updateCodeBlockLanguage?: ({ language }: { language?: HljsLanguageType }) => Promise<void>
	}
}

/**
 * 块节点转为代码块
 */
const toCodeBlock = (editor: Editor, node: KNode) => {
	if (!node.isBlock()) {
		return
	}
	//是固定的块节点或者内嵌套的块节点
	if (node.fixed || node.nested) {
		//克隆块节点
		const newNode = node.clone(false)
		//创建代码块节点
		const codeBlockNode = KNode.create({
			type: 'block',
			tag: 'pre',
			children: []
		})
		//将原来块节点的子节点给代码块节点
		node.children!.forEach((item, index) => {
			editor.addNode(item, codeBlockNode, index)
		})
		//清空原来的块节点
		node.children = []
		//将代码块节点添加到新块节点下
		codeBlockNode.parent = newNode
		newNode.children = [codeBlockNode]
		//将新块节点代替原来的块节点
		editor.addNodeBefore(newNode, node)
	}
	//非固定块节点
	else {
		editor.toParagraph(node)
		node.tag = 'pre'
	}
}

/**
 * 更新代码块内的光标位置
 */
const updateSelection = (editor: Editor, node: KNode, textNodes: KNode[], newNodes: KNode[]) => {
	if (!editor.selection.focused()) {
		return
	}
	//如果光标的起点在代码块内对光标的起点进行重新定位
	if (editor.isSelectionInNode(node, 'start')) {
		//获取起点所在文本节点的在所有文本节点中的序列
		const startIndex = textNodes.findIndex(n => editor.selection.start!.node.isEqual(n))
		//起点在整个代码内容中的位置
		const offset = textNodes.filter((_n, i) => i < startIndex).reduce((total, item) => total + item.textContent!.length, 0) + editor.selection.start!.offset
		//获取代码块下新的子孙节点中全部的文本节点
		const newTextNodes = KNode.flat(newNodes).filter(n => n.isText() && !n.isEmpty())
		let i = 0
		let index = 0
		//遍历
		while (i < newTextNodes.length) {
			let newIndex = index + newTextNodes[i].textContent!.length
			if (offset >= index && offset <= newIndex) {
				editor.selection.start!.node = newTextNodes[i]
				editor.selection.start!.offset = offset - index
				break
			}
			i++
			index = newIndex
		}
	}
	//如果光标的终点在代码块内对光标的终点进行重新定位
	if (editor.isSelectionInNode(node, 'end')) {
		//获取终点所在文本节点的在所有文本节点中的序列
		const endIndex = textNodes.findIndex(n => editor.selection.end!.node.isEqual(n))
		//终点在整个代码内容中的位置
		const offset = textNodes.filter((_n, i) => i < endIndex).reduce((total, item) => total + item.textContent!.length, 0) + editor.selection.end!.offset
		//获取全部的新文本节点
		const newTextNodes = KNode.flat(newNodes).filter(n => n.isText() && !n.isEmpty())
		let i = 0
		let index = 0
		//遍历
		while (i < newTextNodes.length) {
			let newIndex = index + newTextNodes[i].textContent!.length
			if (offset >= index && offset <= newIndex) {
				editor.selection.end!.node = newTextNodes[i]
				editor.selection.end!.offset = offset - index
				break
			}
			i++
			index = newIndex
		}
	}
}

export const CodeBlockExtension = Extension.create({
	name: 'codeBlock',
	pasteKeepMarks(node) {
		const marks: KNodeMarksType = {}
		if (node.isMatch({ tag: 'pre' }) && node.hasMarks()) {
			if (node.marks!.hasOwnProperty('kaitify-hljs')) marks['kaitify-hljs'] = node.marks!['kaitify-hljs']
		}
		return marks
	},
	formatRules: [
		//代码块高亮处理
		({ editor, node }) => {
			if (node.isMatch({ tag: 'pre' }) && node.hasChildren()) {
				let language = (node.marks?.['kaitify-hljs'] || '') as string
				//语言存在但不是列表内的
				if (language && !HljsLanguages.some(item => item == language)) {
					language = ''
				}
				//获取代码块内的所有文本节点
				const textNodes = KNode.flat(node.children!).filter(node => node.isText() && !node.isEmpty())
				//获取代码块内的代码文本值
				const textContent = textNodes.reduce((val, item) => {
					return val + item.textContent
				}, '')
				//将文本节点的内容转为经过hljs处理的内容
				const html = getHljsHtml(textContent, language)
				if (html) {
					//将经过hljs处理的内容转为节点数组
					const nodes = editor.htmlParseNode(html)
					//将新的文本节点全部加入到代码块的子节点数组中
					node.children = nodes.map(item => {
						item.parent = node
						return item
					})
					//更新光标位置
					updateSelection(editor, node, textNodes, nodes)
				} else {
					const selectionStartInNode = editor.isSelectionInNode(node, 'start')
					const selectionEndInNode = editor.isSelectionInNode(node, 'end')
					const placeholderNode = KNode.createPlaceholder()
					node.children = [placeholderNode]
					placeholderNode.parent = node
					if (selectionStartInNode) {
						editor.setSelectionBefore(placeholderNode, 'start')
					}
					if (selectionEndInNode) {
						editor.setSelectionBefore(placeholderNode, 'end')
					}
				}
			}
		}
	],
	addCommands() {
		/**
		 * 获取光标所在的代码块节点，如果光标不在一个代码块节点内，返回null
		 */
		const getCodeBlock = () => {
			return this.getMatchNodeBySelection({
				tag: 'pre'
			})
		}

		/**
		 * 判断光标范围内是否有代码块节点
		 */
		const hasCodeBlock = () => {
			return this.isSelectionNodesSomeMatch({
				tag: 'pre'
			})
		}

		/**
		 * 光标范围内是否都是代码块节点
		 */
		const allCodeBlock = () => {
			return this.isSelectionNodesAllMatch({
				tag: 'pre'
			})
		}

		/**
		 * 设置代码块
		 */
		const setCodeBlock = async () => {
			if (allCodeBlock()) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const blockNode = this.selection.start!.node.getBlock()
				toCodeBlock(this, blockNode)
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					toCodeBlock(this, item)
				})
			}
			await this.updateView()
		}

		/**
		 * 取消代码块
		 */
		const unsetCodeBlock = async () => {
			if (!allCodeBlock()) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const matchNode = this.selection.start!.node.getMatchNode({ tag: 'pre' })
				if (matchNode) this.toParagraph(matchNode)
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					const matchNode = item.getMatchNode({ tag: 'pre' })
					if (matchNode) this.toParagraph(matchNode)
				})
			}
			await this.updateView()
		}

		/**
		 * 更新语言类型
		 */
		const updateCodeBlockLanguage = async ({ language }: { language?: HljsLanguageType }) => {
			//不存在代码块
			if (!hasCodeBlock()) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const blockNode = this.selection.start!.node.getBlock()
				const matchNode = blockNode.getMatchNode({ tag: 'pre' })
				if (matchNode) {
					if (matchNode.hasMarks()) {
						matchNode.marks!['kaitify-hljs'] = language || ''
					} else {
						matchNode.marks = {
							'kaitify-hljs': language || ''
						}
					}
				}
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					const matchNode = item.getMatchNode({ tag: 'pre' })
					if (matchNode) {
						if (matchNode.hasMarks()) {
							matchNode.marks!['kaitify-hljs'] = language || ''
						} else {
							matchNode.marks = {
								'kaitify-hljs': language || ''
							}
						}
					}
				})
			}
			await this.updateView()
		}

		return {
			getCodeBlock,
			hasCodeBlock,
			allCodeBlock,
			setCodeBlock,
			unsetCodeBlock,
			updateCodeBlockLanguage
		}
	}
})