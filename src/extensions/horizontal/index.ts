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
				return this.getClosedNodeBySelection({ tag: HORIZONTAL_NODE_TAG })
			}

			const hasHorizontal = () => {
				return this.hasClosedNodeBySelection({ tag: HORIZONTAL_NODE_TAG })
			}

			const setHorizontal = async () => {
				if (!this.selection.focused()) {
					return
				}
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
