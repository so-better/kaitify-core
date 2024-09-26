import { KNode } from '../../model'
import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		getCode?: () => KNode | null
		hasCode?: () => boolean
		allCode?: () => boolean
		setCode?: () => Promise<void>
		unsetCode?: () => Promise<void>
	}
}

export const CodeExtension = Extension.create({
	name: 'code',
	formatRule({ editor, node }) {
		//行内代码里只能有文本节点
		if (node.tag == 'code' && node.hasChildren()) {
		}
	},
	addCommands() {
		/**
		 * 获取光标所在的行内代码，如果光标不在一个行内代码内，返回null
		 */
		const getCode = () => {
			return this.getMatchNodeBySelection({
				tag: 'code'
			})
		}

		/**
		 * 判断光标范围内是否有行内代码
		 */
		const hasCode = () => {
			return this.isSelectionNodesSomeMatch({
				tag: 'code'
			})
		}

		/**
		 * 光标范围内是否都是行内代码
		 */
		const allCode = () => {
			return this.isSelectionNodesAllMatch({
				tag: 'code'
			})
		}

		/**
		 * 设置行内代码
		 */
		const setCode = async () => {
			if (!this.selection.focused()) {
				return
			}
			if (allCode()) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const codeNode = KNode.create({
					type: 'inline',
					tag: 'code'
				})
				const zeroWidthText = KNode.createZeroWidthText()
				this.addNode(zeroWidthText, codeNode)
				this.insertNode(codeNode)
				this.setSelectionAfter(zeroWidthText, 'all')
			}
			//起点和终点不在一起
			else {
				const textNodes = this.getFocusSplitNodesBySelection('text')
				const length = textNodes.length
				for (let i = 0; i < length; i++) {
					const node = textNodes[i]
					const isExsitInCode = !!node.getMatchNode({
						tag: 'code'
					})
					//该节点已经在行内代码内跳过本次循环
					if (isExsitInCode) {
						continue
					}
					//复制该节点
					const newTexNode = node.clone(true)
					//节点改为行内代码
					node.type = 'inline'
					node.tag = 'code'
					node.marks = {}
					node.styles = {}
					node.textContent = undefined
					node.children = [newTexNode]
					newTexNode.parent = node
					//重置光标位置
					if (this.isSelectionInNode(node, 'start')) {
						this.selection.start!.node = newTexNode
					}
					if (this.isSelectionInNode(node, 'end')) {
						this.selection.end!.node = newTexNode
					}
				}
			}
			await this.updateView()
		}

		/**
		 * 取消行内代码
		 */
		const unsetCode = async () => {
			if (!this.selection.focused()) {
				return
			}
			if (!allCode()) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				//光标所在节点
				const node = this.selection.start!.node
				//光标偏移值
				const offset = this.selection.start!.offset
				//光标所在的行内代码节点
				const codeNode = node.getMatchNode({
					tag: 'code'
				})!
				//行内代码内第一个可设置光标的节点
				const firstSelectionNode = this.getFirstSelectionNodeInChildren(codeNode)!
				//行内代码内最后一个可设置光标的节点
				const lastSelectionNode = this.getLastSelectionNodeInChildren(codeNode)!
				//光标在行内代码起点处
				if (firstSelectionNode.isEqual(node) && offset == 0) {
					const zeroWidthText = KNode.createZeroWidthText()
					this.addNodeBefore(zeroWidthText, codeNode)
					this.setSelectionAfter(zeroWidthText)
				}
				//光标在行内代码的末尾处
				else if (lastSelectionNode.isEqual(node) && offset == (node.isText() ? node.textContent!.length : 1)) {
					const zeroWidthText = KNode.createZeroWidthText()
					this.addNodeAfter(zeroWidthText, codeNode)
					this.setSelectionAfter(zeroWidthText)
				}
				//光标在行内代码的中间
				else {
					//将光标的起点移动到行内代码的起始处
					this.setSelectionBefore(firstSelectionNode, 'start')
					//创建新的行内代码
					const newCodeNode = KNode.create({
						type: 'inline',
						tag: 'code'
					})
					//获取选区内的文本节点并遍历
					this.getFocusSplitNodesBySelection('text').forEach((item, i) => {
						//获取文本节点在父节点中的位置
						const index = item.parent!.children!.findIndex(n => n.isEqual(item))
						//从父节点中移除
						item.parent!.children!.splice(index, 1)
						//加入到新的行内代码里
						this.addNode(item, newCodeNode, i)
					})
					//新的行内代码加入到当前行内代码前面
					this.addNodeBefore(newCodeNode, codeNode)
					//创建一个空白文本节点
					const zeroWidthText = KNode.createZeroWidthText()
					//加入到当前行内代码前面
					this.addNodeBefore(zeroWidthText, codeNode)
					//重置光标位置
					this.setSelectionAfter(zeroWidthText, 'all')
				}
			}
			//起点和终点不在一起
			else {
				const startNode = this.selection.start!.node
				const endNode = this.selection.end!.node
				const startCodeNode = startNode.getMatchNode({ tag: 'code' })!
				const endCodeNode = endNode.getMatchNode({ tag: 'code' })!
				//起点和终点在一个行内代码内
				if (startCodeNode.isEqual(endCodeNode)) {
					//获取选区内的文本节点
					const textNodes = this.getFocusSplitNodesBySelection('text')
					//获取选区内第一个文本节点的序列
					const firstIndex = startCodeNode.children!.findIndex(item => item.isEqual(textNodes[0]))
					//获取选区内最后一个文本节点的序列
					const lastIndex = startCodeNode.children!.findIndex(item => item.isEqual(textNodes[textNodes.length - 1]))
					//创建新的行内节点
					const newCodeNode = KNode.create({ type: 'inline', tag: 'code' })
					//将选区前的行内节点部份给新的行内节点
					startCodeNode.children!.splice(0, firstIndex).forEach((item, index) => {
						this.addNode(item, newCodeNode, index)
					})
					//将新的行内代码节点插入到原行内代码节点前
					this.addNodeBefore(newCodeNode, startCodeNode)
					//将选区内文本节点抽出并插入到原行内代码节点前
					debugger
					startCodeNode.children!.splice(0, lastIndex - firstIndex)
					textNodes.forEach((item, index) => {
						if (index == 0) {
							this.addNodeBefore(item, startCodeNode)
						} else {
							this.addNodeAfter(item, textNodes[0])
						}
					})
				}
				//起点和终点不在一个行内代码里
				else {
				}
			}
			await this.updateView()
		}

		return {
			getCode,
			hasCode,
			allCode,
			setCode,
			unsetCode
		}
	}
})
