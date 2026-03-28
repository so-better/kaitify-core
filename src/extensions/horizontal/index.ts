import { Editor, KNode } from '@/model'
import { Extension } from '../Extension'
import { HORIZONTAL_NODE_TAG } from './element'
import './style.less'

declare module '../../model' {
	interface EditorCommandsType {
		/**
		 * 获取光标所在的水平线节点
		 */
		getHorizontal?: () => KNode | null
		/**
		 * 判断光标范围内是否有水平线节点
		 */
		hasHorizontal?: () => boolean
		/**
		 * 设置水平线
		 */
		setHorizontal?: () => Promise<void>
	}
}

/**
 * 水平线选中样式设置（水平线本身在被光标选择时是无样式的，所以只需要加选中样式即可）
 */
const handleSelected = (editor: Editor) => {
	// 先清除所有水平线的选中状态
	editor.$el!.querySelectorAll(`${HORIZONTAL_NODE_TAG} > span`).forEach(el => {
		el.removeAttribute('is-selected')
	})
	if (!editor.selection.focused()) return
	const flag = editor.commands.hasHorizontal?.()
	if (flag) {
		const doms = editor
			.getFocusNodesBySelection('closed')
			.filter(item => item.isMatch({ tag: HORIZONTAL_NODE_TAG }))
			.map(item => editor.findDom(item))
		doms.forEach(dom => dom.querySelector('span')?.setAttribute('is-selected', ''))
	}
}

export const HorizontalExtension = () =>
	Extension.create({
		name: 'horizontal',
		extraKeepTags: [HORIZONTAL_NODE_TAG, 'hr'],
		onDomParseNode(node) {
			if (node.isMatch({ tag: HORIZONTAL_NODE_TAG })) {
				node.type = 'closed'
				node.children = undefined
			}
			if (node.isMatch({ tag: 'hr' })) {
				node.tag = HORIZONTAL_NODE_TAG
				node.type = 'closed'
				node.children = undefined
			}
			return node
		},
		formatRules: [
			({ node }) => {
				if (node.isMatch({ tag: HORIZONTAL_NODE_TAG })) {
					node.type = 'closed'
					node.children = undefined
				}
				if (node.isMatch({ tag: 'hr' })) {
					node.tag = HORIZONTAL_NODE_TAG
					node.type = 'closed'
					node.children = undefined
				}
			}
		],
		onSelectionUpdate() {
			handleSelected(this)
		},
		addCommands() {
			const getHorizontal = () => {
				if (!this.selection.focused() || this.selection.collapsed()) {
					return null
				}
				const startNode = this.selection.start!.node
				const endNode = this.selection.end!.node
				const startOffset = this.selection.start!.offset
				const endOffset = this.selection.end!.offset
				if (startNode.isEqual(endNode) && startNode.isMatch({ tag: HORIZONTAL_NODE_TAG }) && startOffset == 0 && endOffset == 1) {
					return startNode
				}
				return null
			}

			const hasHorizontal = () => {
				if (!this.selection.focused() || this.selection.collapsed()) {
					return false
				}
				const startNode = this.selection.start!.node
				const endNode = this.selection.end!.node
				const startOffset = this.selection.start!.offset
				const endOffset = this.selection.end!.offset
				// 起点从水平线头部开始
				if (startNode.isMatch({ tag: HORIZONTAL_NODE_TAG }) && startOffset === 0) {
					return true
				}
				// 终点到水平线尾部结束
				if (endNode.isMatch({ tag: HORIZONTAL_NODE_TAG }) && endOffset === 1) {
					return true
				}
				// 选区中间完整包含的水平线（排除边界节点）
				return this.getFocusNodesBySelection('all')
					.filter(n => !n.isEqual(startNode) && !n.isEqual(endNode))
					.some(n => n.isMatch({ tag: HORIZONTAL_NODE_TAG }))
			}

			const setHorizontal = async () => {
				const node = KNode.create({
					type: 'closed',
					tag: HORIZONTAL_NODE_TAG
				})
				this.insertNode(node)
				await this.updateView()
			}

			return {
				getHorizontal,
				hasHorizontal,
				setHorizontal
			}
		}
	})
