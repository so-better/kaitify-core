import KaTex from 'katex'
import { common as DapCommon } from 'dap-util'
import { KNode, KNodeMarksType, KNodeStylesType } from '@/model'
import { Extension } from '../Extension'
import './style.less'

declare module '../../model' {
	interface EditorCommandsType {
		getMath?: () => KNode | null
		hasMath?: () => boolean
		setMath?: (value: string) => Promise<void>
	}
}

export const MathExtension = Extension.create({
	name: 'math',
	extraKeepTags: ['math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac', 'msqrt', 'mroot', 'munder', 'mover', 'munderover', 'mtable', 'mtr', 'mtd', 'mtext', 'mspace', 'mmultiscripts', 'menclose', 'mglyph', 'maction', 'maligngroup', 'malignmark', 'mprescripts', 'none', 'mpadded', 'ms', 'mphantom', 'mstyle', 'merror', 'mscarries', 'mscarry', 'msline', 'msgroup', 'msrow', 'mscolumn', 'mstack', 'mlongdiv', 'mlabeledtr', 'mlabeledmultiscripts', 'semantics', 'msubsup'],
	domParseNodeCallback(node) {
		if (
			node.isMatch({
				tag: 'span',
				marks: {
					'kaitify-math': true
				}
			})
		) {
			//锁定节点防止合并
			node.locked = true
			//设为行内
			node.type = 'inline'
			//处理子孙节点
			KNode.flat(node.children!).forEach(item => {
				//锁定节点防止合并
				item.locked = true
				//非文本节点
				if (!item.isText()) {
					//有子节点转为行内
					if (item.hasChildren()) {
						item.type = 'inline'
					}
					//无子节点转为闭合
					else {
						item.type = 'closed'
					}
				}
			})
		}
		return node
	},
	pasteKeepMarks(node) {
		const marks: KNodeMarksType = {}
		//数学公式内的标记全部保留
		if (
			!!node.getMatchNode({
				tag: 'span',
				marks: {
					'kaitify-math': true
				}
			})
		) {
			Object.assign(marks, DapCommon.clone(node.marks!))
		}
		return marks
	},
	pasteKeepStyles(node) {
		const styles: KNodeStylesType = {}
		//数学公式内的样式全部保留
		if (
			!!node.getMatchNode({
				tag: 'span',
				marks: {
					'kaitify-math': true
				}
			})
		) {
			Object.assign(styles, DapCommon.clone(node.styles!))
		}
		return styles
	},
	formatRules: [
		({ editor, node }) => {
			//两侧设置空白元素
			if (
				!node.isEmpty() &&
				node.isMatch({
					tag: 'span',
					marks: {
						'kaitify-math': true
					}
				})
			) {
				const previousNode = node.getPrevious(node.parent ? node.parent!.children! : editor.stackNodes)
				const nextNode = node.getNext(node.parent ? node.parent!.children! : editor.stackNodes)
				//前一个节点不存在或者不是零宽度空白文本节点
				if (!previousNode || !previousNode.isZeroWidthText()) {
					const zeroWidthText = KNode.createZeroWidthText()
					editor.addNodeBefore(zeroWidthText, node)
				}
				//后一个节点不存在或者不是零宽度空白文本节点
				if (!nextNode || !nextNode.isZeroWidthText()) {
					const zeroWidthText = KNode.createZeroWidthText()
					editor.addNodeAfter(zeroWidthText, node)
				}
				//重置光标
				if (editor.isSelectionInNode(node, 'start')) {
					const newTextNode = node.getNext(node.parent ? node.parent!.children! : editor.stackNodes)
					if (newTextNode) editor.setSelectionBefore(newTextNode, 'start')
				}
				if (editor.isSelectionInNode(node, 'end')) {
					const newTextNode = node.getNext(node.parent ? node.parent!.children! : editor.stackNodes)
					if (newTextNode) editor.setSelectionBefore(newTextNode, 'end')
				}
			}
		}
	],
	addCommands() {
		/**
		 * 获取光标所在的数学公式节点，如果光标不在一个数学公式节点内，返回null
		 */
		const getMath = () => {
			return this.getMatchNodeBySelection({
				tag: 'span',
				marks: {
					'kaitify-math': true
				}
			})
		}

		/**
		 * 判断光标范围内是否有数学公式节点
		 */
		const hasMath = () => {
			return this.isSelectionNodesSomeMatch({
				tag: 'span',
				marks: {
					'kaitify-math': true
				}
			})
		}

		/**
		 * 插入数学公式
		 */
		const setMath = async (value: string) => {
			if (!!getMath()) {
				return
			}
			const mathml = KaTex.renderToString(value, {
				output: 'mathml',
				throwOnError: true
			})
			//设置最终的html内容
			const html = `<span kaitify-math="${value}" contenteditable="false">${mathml}</span>`
			//html内容转为节点数组
			const nodes = this.htmlParseNode(html)
			//插入节点
			this.insertNode(nodes[0])
			await this.updateView()
		}

		return {
			getMath,
			hasMath,
			setMath
		}
	}
})
