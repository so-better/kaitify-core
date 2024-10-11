import { KNode, KNodeMarksType } from '@/model'
import { Extension } from '../Extension'
import './style.less'

declare module '@/model' {
	interface EditorCommandsType {
		getTable?: () => KNode | null
		hasTable?: () => boolean
		setTable?: () => Promise<void>
		unsetTable?: () => Promise<void>
	}
}

/**
 * 获取表格真实列数和行数
 */
const getTableSize = (rows: KNode[]) => {}

export const TableExtension = Extension.create({
	name: 'table',
	voidRenderTags: ['colgroup', 'col'],
	extraKeepTags: ['table', 'tfoot', 'tbody', 'thead', 'tr', 'th', 'td', 'col'],
	domParseNodeCallback(node) {
		if (node.isMatch({ tag: 'table' })) {
			node.type = 'block'
		}
		if (node.isMatch({ tag: 'tfoot' }) || node.isMatch({ tag: 'tbody' }) || node.isMatch({ tag: 'thead' }) || node.isMatch({ tag: 'tr' }) || node.isMatch({ tag: 'th' }) || node.isMatch({ tag: 'td' }) || node.isMatch({ tag: 'colgroup' })) {
			node.type = 'block'
			node.fixed = true
			node.nested = true
		}
		if (node.isMatch({ tag: 'col' })) {
			node.type = 'closed'
		}
		return node
	},
	pasteKeepMarks(node) {
		const marks: KNodeMarksType = {}
		//表格列宽属性保留
		if (node.isMatch({ tag: 'col' })) {
			if (node.marks!.hasOwnProperty('width')) marks['width'] = node.marks!['width']
		}
		//表格单元格rowspan和colspan属性保留
		if (node.isMatch({ tag: 'td' }) || node.isMatch({ tag: 'th' })) {
			if (node.marks!.hasOwnProperty('rowspan')) marks['rowspan'] = node.marks!['rowspan']
			if (node.marks!.hasOwnProperty('colspan')) marks['colspan'] = node.marks!['colspan']
		}
		return marks
	},
	formatRules: [
		//thead、tbody、tfoot去除
		({ editor, node }) => {
			if (node.isMatch({ tag: 'thead' }) || node.isMatch({ tag: 'tbody' }) || node.isMatch({ tag: 'tfoot' })) {
				node.children!.forEach(item => {
					editor.addNodeBefore(item, node)
				})
				node.children = []
			}
		},
		//th转td
		({ node }) => {
			if (node.isMatch({ tag: 'th' })) {
				node.tag = 'td'
			}
		},
		//表格结构格式化
		({ node }) => {
			//表格
			if (node.isMatch({ tag: 'table' })) {
				const rows = KNode.flat(node.children!).filter(item => item.isMatch({ tag: 'tr' }))
			}
		}
	],
	addCommands() {
		/**
		 * 获取光标所在的表格节点，如果光标不在一个表格节点内，返回null
		 */
		const getTable = () => {
			return this.getMatchNodeBySelection({
				tag: 'table'
			})
		}

		/**
		 * 判断光标范围内是否有表格节点
		 */
		const hasTable = () => {
			return this.isSelectionNodesSomeMatch({
				tag: 'table'
			})
		}

		/**
		 * 插入表格
		 */
		const setTable = async () => {}

		/**
		 * 取消表格
		 */
		const unsetTable = async () => {}

		return {
			getTable,
			hasTable,
			setTable,
			unsetTable
		}
	}
})
