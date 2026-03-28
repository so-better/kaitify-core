import { Editor, KNode, KNodeMarksType } from '@/model'
import { Extension } from '../Extension'
import { MATH_NODE_TAG } from './element'
import './style.less'

declare module '../../model' {
	interface EditorCommandsType {
		/**
		 * 获取光标所在的数学公式节点，如果光标不在一个数学公式节点内，返回null
		 */
		getMath?: () => KNode | null
		/**
		 * 判断光标范围内是否有数学公式节点
		 */
		hasMath?: () => boolean
		/**
		 * 插入数学公式
		 */
		setMath?: (value: string) => Promise<void>
		/**
		 * 更新数学公式
		 */
		updateMath?: (value: string) => Promise<void>
	}
}

/**
 * 数学公式选中样式设置（禁用默认选中样式，另外重新设置））
 */
const handleSelected = (editor: Editor) => {
	// 先清除所有水平线的选中状态
	editor.$el!.querySelectorAll(`${MATH_NODE_TAG} > span`).forEach(el => {
		el.removeAttribute('is-selected')
	})
	if (!editor.selection.focused()) return
	const flag = editor.commands.hasMath?.()
	if (flag) {
		const doms = editor
			.getFocusNodesBySelection('closed')
			.filter(item => item.isMatch({ tag: MATH_NODE_TAG }))
			.map(item => editor.findDom(item))
		doms.forEach(dom => dom.querySelector('span')?.setAttribute('is-selected', ''))
	}
}

export const MathExtension = () =>
	Extension.create({
		name: 'math',
		extraKeepTags: [MATH_NODE_TAG],
		onPasteKeepMarks(node) {
			const marks: KNodeMarksType = {}
			if (node.isMatch({ tag: MATH_NODE_TAG }) && node.hasMarks()) {
				if (node.marks!.hasOwnProperty('data-value')) marks['data-value'] = node.marks!['data-value']
			}
			return marks
		},
		onDomParseNode(node) {
			// 必须是闭合节点
			if (node.isMatch({ tag: MATH_NODE_TAG })) {
				node.type = 'closed'
				node.children = undefined
			}
			// 兼容老格式：<span kaitify-math="xxxxxxx" contenteditable="false">...</span>
			if (node.isMatch({ tag: 'span', marks: { [MATH_NODE_TAG]: true } })) {
				const value = node.marks![MATH_NODE_TAG] as string
				// 改造成新的闭合节点格式
				node.type = 'closed'
				node.tag = MATH_NODE_TAG
				node.children = undefined
				node.marks = { 'data-value': value }
				node.styles = {}
			}
			return node
		},
		formatRules: [
			({ node }) => {
				if (
					node.isMatch({
						tag: MATH_NODE_TAG
					})
				) {
					//必须是闭合节点
					node.type = 'closed'
					node.children = undefined
				}
			}
		],
		onSelectionUpdate() {
			handleSelected(this)
		},
		addCommands() {
			const getMath = () => {
				return this.getClosedNodeBySelection({ tag: MATH_NODE_TAG })
			}

			const hasMath = () => {
				return this.hasClosedNodeBySelection({ tag: MATH_NODE_TAG })
			}

			const setMath = async (value: string) => {
				if (!value || !this.selection.focused()) {
					return
				}
				const node = KNode.create({
					type: 'closed',
					tag: MATH_NODE_TAG,
					marks: {
						'data-value': value
					}
				})
				//插入节点
				this.insertNode(node)
				//更新视图
				await this.updateView()
			}

			const updateMath = async (value: string) => {
				if (!value || !this.selection.focused()) {
					return
				}
				const node = getMath()
				if (!node) {
					return
				}
				//更新value
				node.marks!['data-value'] = value
				//更新视图
				await this.updateView()
			}

			return {
				getMath,
				hasMath,
				setMath,
				updateMath
			}
		}
	})
