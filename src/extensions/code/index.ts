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
		//行内代码里只能有文本节点和闭合节点
		if (node.tag == 'code' && node.hasChildren()) {
			node.children!.forEach(item => {})
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
				const focusNodes = this.getFocusSplitNodesBySelection('all')
				const length = focusNodes.length
				for (let i = 0; i < length; i++) {
					const node = focusNodes[i]
					const isExsitInCode = !!node.getMatchNode({
						tag: 'code'
					})
					//该节点已经在行内代码内跳过本次循环
					if (isExsitInCode) {
						continue
					}
					//复制该节点
					const newNode = node.clone(true)
					//节点改为行内代码
					node.type = 'inline'
					node.tag = 'code'
					node.marks = {}
					node.styles = {}
					node.textContent = undefined
					node.children = [newNode]
					newNode.parent = node
					//重置光标位置
					if (this.isSelectionInNode(node, 'start')) {
						this.selection.start!.node = newNode
					}
					if (this.isSelectionInNode(node, 'end')) {
						this.selection.end!.node = newNode
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
					//获取选区内的可聚焦节点并遍历
					this.getFocusSplitNodesBySelection('all').forEach((item, i) => {
						//获取可聚焦节点在父节点中的位置
						const index = codeNode.children!.findIndex(n => n.isEqual(item))
						//从父节点中移除
						codeNode.children!.splice(index, 1)
						//加入到新的行内代码里
						this.addNode(item, newCodeNode, i)
					})
					//新的行内代码插入到当前行内代码前面
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
					//获取选区内的可聚焦节点
					const focusNodes = this.getFocusSplitNodesBySelection('all')
					//获取选区内第一个可聚焦节点在行内代码中的序列
					const firstIndex = startCodeNode.children!.findIndex(item => item.isEqual(focusNodes[0]))
					//获取选区内最后一个可聚焦节点在行内代码中的序列
					const lastIndex = startCodeNode.children!.findIndex(item => item.isEqual(focusNodes[focusNodes.length - 1]))
					//行内代码的子节点数量
					const length = startCodeNode.children!.length
					//是第一个可聚焦节点和最后一个可聚焦节点，说明选区是整个行内代码
					if (firstIndex == 0 && lastIndex == length - 1) {
						startCodeNode.children!.forEach(item => {
							this.addNodeBefore(item, startCodeNode)
						})
						startCodeNode.children = []
					}
					//是第一个可聚焦节点
					else if (firstIndex == 0 && lastIndex == 0) {
						const node = startCodeNode.children![0]
						startCodeNode.children!.splice(0, 1)
						this.addNodeBefore(node, startCodeNode)
					}
					//是最后一个可聚焦节点
					else if (firstIndex == length - 1 && lastIndex == length - 1) {
						const node = startCodeNode.children![length - 1]
						startCodeNode.children!.splice(length - 1, 1)
						this.addNodeAfter(node, startCodeNode)
					}
					//是同一个可聚焦节点但是在中间位置
					else if (firstIndex == lastIndex) {
						//获取该可聚焦节点
						const node = startCodeNode.children![firstIndex]
						//创建新的行内节点
						const newCodeNode = KNode.create({ type: 'inline', tag: 'code' })
						//将选区前的行内节点部份给新的行内节点
						startCodeNode.children!.splice(0, firstIndex).forEach((item, index) => {
							this.addNode(item, newCodeNode, index)
						})
						//将新的行内代码节点插入到原行内代码节点前
						this.addNodeBefore(newCodeNode, startCodeNode)
						//将选区内的节点插入到原来的行内节点前面
						this.addNodeBefore(node, startCodeNode)
						//从原来的行内代码中移出该节点
						startCodeNode.children!.splice(0, 1)
					}
					//不是同一个可聚焦节点
					else {
						//创建新的行内节点
						const newCodeNode = KNode.create({ type: 'inline', tag: 'code' })
						//将选区前的行内节点部份给新的行内节点
						startCodeNode.children!.splice(0, firstIndex).forEach((item, index) => {
							this.addNode(item, newCodeNode, index)
						})
						//将新的行内代码节点插入到原行内代码节点前
						this.addNodeBefore(newCodeNode, startCodeNode)
						//将选区内的节点插入到原行内节点的前面
						focusNodes.forEach(item => {
							this.addNodeBefore(item, startCodeNode)
						})
						startCodeNode.children!.splice(0, lastIndex - firstIndex + 1)
					}
				}
				//起点和终点不在一个行内代码里
				else {
					// todo
					// 光标范围内是多个行内代码
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
