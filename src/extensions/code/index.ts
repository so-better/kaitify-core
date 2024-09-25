import { KNode } from '../../model'
import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		inCode?: () => boolean
		includesCode?: () => boolean
		setCode?: () => Promise<void>
		unsetCode?: () => Promise<void>
	}
}

export const CodeExtension = Extension.create({
	name: 'code',
	addCommands() {
		/**
		 * 光标是否在同一个行内代码内
		 */
		const inCode = () => {
			return !!this.getMatchNodeBySelection({
				tag: 'code'
			})
		}

		/**
		 * 光标范围内是否包含行内代码
		 */
		const includesCode = () => {
			return this.isSelectionIncludesMatchNode({
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
			if (inCode()) {
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
				this.setSelectionAfter(zeroWidthText)
			}
			//存在选区
			else {
				this.getSplitedTextNodesBySelection().forEach(item => {
					const newText = item.clone(true)
					item.type = 'inline'
					item.textContent = undefined
					item.tag = 'code'
					item.styles = {}
					item.marks = {}
					item.children = [newText]
					newText.parent = item
					if (this.isSelectionInNode(item, 'start')) {
						this.selection.start!.node = newText
					}
					if (this.isSelectionInNode(item, 'end')) {
						this.selection.end!.node = newText
					}
				})
			}
			await this.updateView()
		}
		/**
		 * 取消代码
		 */
		const unsetCode = async () => {}

		return {
			inCode,
			includesCode,
			setCode,
			unsetCode
		}
	}
})
