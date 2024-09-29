import { KNode, KNodeStylesType } from '../../model'
import { Extension } from '../Extension'

type AlignValueType = 'left' | 'right' | 'center' | 'justify'

declare module '../../model' {
	interface EditorCommandsType {
		getAlign?: (val: AlignValueType) => KNode | null
		isAlign?: (val: AlignValueType) => boolean
		setAlign?: (val: AlignValueType) => Promise<void>
		unsetAlign?: (val: AlignValueType) => Promise<void>
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
		 * 获取光标所在的拥有符合的对齐方式的块节点，如果光标不在同一个块节点内，返回null
		 */
		const getAlign = (val: AlignValueType) => {
			if (!this.selection.focused()) {
				return null
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const block = this.selection.start!.node.getBlock()
				return block.getMatchNode({ styles: { textAlign: val } })
			}
			//起点和终点不在一起
			const blockNodes = this.getSelectedNodes().map(item => item.node.getBlock())
			const matchNode = blockNodes[0].getMatchNode({ styles: { textAlign: val } })
			if (matchNode && blockNodes.every(item => matchNode.isContains(item))) {
				return matchNode
			}
			return null
		}

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
			const blockNodes = this.getSelectedNodes().map(item => item.node.getBlock())
			return blockNodes.every(item => {
				return item.getMatchNode({ styles: { textAlign: val } })
			})
		}

		/**
		 * 设置对齐方式
		 */
		const setAlign = async (val: AlignValueType) => {}

		/**
		 * 取消对齐方式
		 */
		const unsetAlign = async (val: AlignValueType) => {}

		return {
			getAlign,
			isAlign,
			setAlign,
			unsetAlign
		}
	}
})
