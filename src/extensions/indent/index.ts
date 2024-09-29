import { KNode, KNodeStylesType } from '../../model'
import { deleteProperty } from '../../tools'
import { Extension } from '../Extension'
import { getSelectionBlockNodes } from '../../model/config/function'

declare module '../../model' {
	interface EditorCommandsType {
		isIndent?: (val: string) => boolean
		setIndent?: (val: string) => Promise<void>
		unsetIndent?: (val: string) => Promise<void>
	}
}

/**
 * 删除指定块节点及以上块节点的行高样式
 */
const clearIndent = (blockNode: KNode, val: string) => {
	const matchNode = blockNode.getMatchNode({ styles: { textIndent: val } })
	if (matchNode) {
		matchNode.styles = deleteProperty(matchNode.styles!, 'textIndent')
		clearIndent(matchNode, val)
	}
}

export const IndentExtension = Extension.create({
	name: 'indent',
	pasteKeepStyles(node) {
		const styles: KNodeStylesType = {}
		if (node.isBlock() && node.hasStyles()) {
			if (node.styles!.hasOwnProperty('textIndent')) styles.textIndent = node.styles!.textIndent
		}
		return styles
	},
	addCommands() {
		/**
		 * 光标所在的块节点是否都是符合的缩进值
		 */
		const isIndent = (val: string) => {
			if (!this.selection.focused()) {
				return false
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const block = this.selection.start!.node.getBlock()
				return !!block.getMatchNode({ styles: { textIndent: val } })
			}
			//起点和终点不在一起
			const blockNodes = getSelectionBlockNodes.apply(this)
			return blockNodes.every(item => {
				return item.getMatchNode({ styles: { textIndent: val } })
			})
		}

		/**
		 * 设置缩进
		 */
		const setIndent = async (val: string) => {
			if (isIndent(val)) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const blockNode = this.selection.start!.node.getBlock()
				const styles: KNodeStylesType = blockNode.hasStyles() ? blockNode.styles! : {}
				blockNode.styles = {
					...styles,
					textIndent: val
				}
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					const styles: KNodeStylesType = item.hasStyles() ? item.styles! : {}
					item.styles = {
						...styles,
						textIndent: val
					}
				})
			}
			await this.updateView()
		}

		/**
		 * 取消缩进
		 */
		const unsetIndent = async (val: string) => {
			if (!isIndent(val)) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const blockNode = this.selection.start!.node.getBlock()
				clearIndent(blockNode, val)
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					clearIndent(item, val)
				})
			}
			await this.updateView()
		}

		return {
			isIndent,
			setIndent,
			unsetIndent
		}
	}
})
