import { KNode, KNodeStylesType } from '../../model'
import { deleteProperty } from '../../tools'
import { Extension } from '../Extension'
import { getSelectionBlockNodes } from '../../model/config/function'

declare module '../../model' {
	interface EditorCommandsType {
		isLineHeight?: (val: string | number) => boolean
		setLineHeight?: (val: string | number) => Promise<void>
		unsetLineHeight?: (val: string | number) => Promise<void>
	}
}

/**
 * 删除指定块节点及以上块节点的行高样式
 */
const clearLineHeight = (blockNode: KNode, val: string | number) => {
	const matchNode = blockNode.getMatchNode({ styles: { lineHeight: val } })
	if (matchNode) {
		matchNode.styles = deleteProperty(matchNode.styles!, 'lineHeight')
		clearLineHeight(matchNode, val)
	}
}

export const LineHeightExtension = Extension.create({
	name: 'lineHeight',
	pasteKeepStyles(node) {
		const styles: KNodeStylesType = {}
		if (node.isBlock() && node.hasStyles()) {
			if (node.styles!.hasOwnProperty('lineHeight')) styles.lineHeight = node.styles!.lineHeight
		}
		return styles
	},
	addCommands() {
		/**
		 * 光标所在的块节点是否都是符合的行高
		 */
		const isLineHeight = (val: string | number) => {
			if (!this.selection.focused()) {
				return false
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const block = this.selection.start!.node.getBlock()
				return !!block.getMatchNode({ styles: { lineHeight: val } })
			}
			//起点和终点不在一起
			const blockNodes = getSelectionBlockNodes.apply(this)
			return blockNodes.every(item => {
				return !!item.getMatchNode({ styles: { lineHeight: val } })
			})
		}

		/**
		 * 设置行高
		 */
		const setLineHeight = async (val: string | number) => {
			if (isLineHeight(val)) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const blockNode = this.selection.start!.node.getBlock()
				const styles: KNodeStylesType = blockNode.hasStyles() ? blockNode.styles! : {}
				blockNode.styles = {
					...styles,
					lineHeight: val
				}
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					const styles: KNodeStylesType = item.hasStyles() ? item.styles! : {}
					item.styles = {
						...styles,
						lineHeight: val
					}
				})
			}
			await this.updateView()
		}

		/**
		 * 取消行高
		 */
		const unsetLineHeight = async (val: string | number) => {
			if (!isLineHeight(val)) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const blockNode = this.selection.start!.node.getBlock()
				clearLineHeight(blockNode, val)
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					clearLineHeight(item, val)
				})
			}
			await this.updateView()
		}

		return {
			isLineHeight,
			setLineHeight,
			unsetLineHeight
		}
	}
})
