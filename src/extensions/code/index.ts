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
				//光标所在的行内代码节点
				const codeNode = node.getMatchNode({
					tag: 'code'
				})!
				//光标偏移值
				const offset = this.selection.start!.offset
				//行内代码内第一个可设置光标的节点
				const firstSelectionNode = this.getFirstSelectionNodeInChildren(codeNode)
				//行内代码内最后一个可设置光标的节点
				const lastSelectionNode = this.getLastSelectionNodeInChildren(codeNode)
				//光标在行内代码起点处
				if (firstSelectionNode && firstSelectionNode.isEqual(node) && offset == 0) {
					const zeroWidthText = KNode.createZeroWidthText()
					this.addNodeBefore(zeroWidthText, codeNode)
					this.setSelectionAfter(zeroWidthText)
				}
				//光标在行内代码的末尾处
				else if (lastSelectionNode && lastSelectionNode.isEqual(node) && offset == (node.isText() ? node.textContent!.length : 1)) {
					const zeroWidthText = KNode.createZeroWidthText()
					this.addNodeAfter(zeroWidthText, codeNode)
					this.setSelectionAfter(zeroWidthText)
				}
			}
			//起点和终点不在一起
			else {
				// to do
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
