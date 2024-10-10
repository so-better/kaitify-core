import KaTex from 'katex'
import { common as DapCommon } from 'dap-util'
import { KNode, KNodeMarksType, KNodeStylesType } from '../../model'
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
	domParseNodeCallback(node) {
		if (
			node.isMatch({
				tag: 'span',
				marks: {
					'kaitify-math': true
				}
			})
		) {
			KNode.flat(node.children!).forEach(item => {
				//锁定节点防止合并
				item.locked = true
				//没有子节点的非文本节点设为闭合节点
				if (!item.isText() && !item.hasChildren()) {
					item.type = 'closed'
				}
			})
		}
		return node
	},
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
