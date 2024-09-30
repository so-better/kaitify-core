import { KNode } from '../../model'
import { getSelectionBlockNodes } from '../../model/config/function'
import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		getBlockquote?: () => KNode | null
		hasBlockquote?: () => boolean
		allBlockquote?: () => boolean
		setBlockquote?: () => Promise<void>
		unsetBlockquote?: () => Promise<void>
	}
}

/**
 * 块节点转为引用
 */
const toBlockquote = (node: KNode) => {
	node.tag = 'blockquote'
	node.marks = {}
	node.styles = {}
}

export const BlockquoteExtension = Extension.create({
	name: 'blockquote',
	addCommands() {
		/**
		 * 获取光标所在的引用节点，如果光标不在一个引用节点内，返回null
		 */
		const getBlockquote = () => {
			return this.getMatchNodeBySelection({
				tag: 'blockquote'
			})
		}

		/**
		 * 判断光标范围内是否有引用节点
		 */
		const hasBlockquote = () => {
			return this.isSelectionNodesSomeMatch({
				tag: 'blockquote'
			})
		}

		/**
		 * 光标范围内是否都是引用节点
		 */
		const allBlockquote = () => {
			return this.isSelectionNodesAllMatch({
				tag: 'blockquote'
			})
		}

		/**
		 * 设置引用
		 */
		const setBlockquote = async () => {
			if (allBlockquote()) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const node = KNode.create({
					type: 'block',
					tag: 'blockquote',
					children: [{ type: 'closed', tag: 'br' }]
				})
				this.insertNode(node)
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					toBlockquote(item)
				})
			}
			await this.updateView()
		}

		/**
		 * 取消引用
		 */
		const unsetBlockquote = async () => {
			if (!allBlockquote()) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const node = this.selection.start!.node.getMatchNode({ tag: 'blockquote' })
				if (node) this.toParagraph(node)
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					this.toParagraph(item)
				})
			}
			await this.updateView()
		}

		return {
			getBlockquote,
			hasBlockquote,
			allBlockquote,
			setBlockquote,
			unsetBlockquote
		}
	}
})
