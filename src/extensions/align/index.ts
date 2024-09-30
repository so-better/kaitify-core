import { KNode, KNodeStylesType } from '../../model'
import { deleteProperty } from '../../tools'
import { Extension } from '../Extension'
import { getSelectionBlockNodes } from '../../model/config/function'

type AlignValueType = 'left' | 'right' | 'center' | 'justify'

declare module '../../model' {
	interface EditorCommandsType {
		isAlign?: (val: AlignValueType) => boolean
		setAlign?: (val: AlignValueType) => Promise<void>
		unsetAlign?: (val: AlignValueType) => Promise<void>
	}
}

/**
 * 删除指定块节点及以上块节点的对齐方式
 */
const clearAlign = (blockNode: KNode, val: AlignValueType) => {
	const matchNode = blockNode.getMatchNode({ styles: { textAlign: val } })
	if (matchNode) {
		matchNode.styles = deleteProperty(matchNode.styles!, 'textAlign')
		clearAlign(matchNode, val)
	}
}

export const AlignExtension = Extension.create({
	name: 'align',
	pasteKeepStyles(node) {
		const styles: KNodeStylesType = {}
		if (node.isBlock() && node.hasStyles()) {
			if (node.styles!.hasOwnProperty('textAlign')) styles.textAlign = node.styles!.textAlign
		}
		return styles
	},
	addCommands() {
		/**
		 * 光标所在的块节点是否都是符合的对齐方式
		 */
		const isAlign = (val: AlignValueType) => {
			if (!this.selection.focused()) {
				return false
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const block = this.selection.start!.node.getBlock()
				return !!block.getMatchNode({ styles: { textAlign: val } })
			}
			//起点和终点不在一起
			const blockNodes = getSelectionBlockNodes.apply(this)
			return blockNodes.every(item => {
				return !!item.getMatchNode({ styles: { textAlign: val } })
			})
		}

		/**
		 * 设置对齐方式
		 */
		const setAlign = async (val: AlignValueType) => {
			if (isAlign(val)) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const blockNode = this.selection.start!.node.getBlock()
				const styles: KNodeStylesType = blockNode.hasStyles() ? blockNode.styles! : {}
				blockNode.styles = {
					...styles,
					textAlign: val
				}
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					const styles: KNodeStylesType = item.hasStyles() ? item.styles! : {}
					item.styles = {
						...styles,
						textAlign: val
					}
				})
			}
			await this.updateView()
		}

		/**
		 * 取消对齐方式
		 */
		const unsetAlign = async (val: AlignValueType) => {
			if (!isAlign(val)) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const blockNode = this.selection.start!.node.getBlock()
				clearAlign(blockNode, val)
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					clearAlign(item, val)
				})
			}
			await this.updateView()
		}

		return {
			isAlign,
			setAlign,
			unsetAlign
		}
	}
})
