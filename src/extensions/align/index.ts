import { KNode, KNodeStylesType } from '@/model'
import { deleteProperty } from '@/tools'
import { Extension } from '../Extension'
import { getSelectionBlockNodes } from '@/model/config/function'

type AlignValueType = 'left' | 'right' | 'center' | 'justify'

declare module '@/model' {
	interface EditorCommandsType {
		isAlign?: (value: AlignValueType) => boolean
		setAlign?: (value: AlignValueType) => Promise<void>
		unsetAlign?: (value: AlignValueType) => Promise<void>
	}
}

/**
 * 删除指定块节点及以上块节点的对齐方式
 */
const clearAlign = (blockNode: KNode, value: AlignValueType) => {
	const matchNode = blockNode.getMatchNode({ styles: { textAlign: value } })
	if (matchNode) {
		matchNode.styles = deleteProperty(matchNode.styles!, 'textAlign')
		clearAlign(matchNode, value)
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
		const isAlign = (value: AlignValueType) => {
			if (!this.selection.focused()) {
				return false
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const block = this.selection.start!.node.getBlock()
				return !!block.getMatchNode({ styles: { textAlign: value } })
			}
			//起点和终点不在一起
			const blockNodes = getSelectionBlockNodes.apply(this)
			return blockNodes.every(item => {
				return !!item.getMatchNode({ styles: { textAlign: value } })
			})
		}

		/**
		 * 设置对齐方式
		 */
		const setAlign = async (value: AlignValueType) => {
			if (isAlign(value)) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const blockNode = this.selection.start!.node.getBlock()
				const styles: KNodeStylesType = blockNode.hasStyles() ? blockNode.styles! : {}
				blockNode.styles = {
					...styles,
					textAlign: value
				}
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					const styles: KNodeStylesType = item.hasStyles() ? item.styles! : {}
					item.styles = {
						...styles,
						textAlign: value
					}
				})
			}
			await this.updateView()
		}

		/**
		 * 取消对齐方式
		 */
		const unsetAlign = async (value: AlignValueType) => {
			if (!isAlign(value)) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const blockNode = this.selection.start!.node.getBlock()
				clearAlign(blockNode, value)
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					clearAlign(item, value)
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
