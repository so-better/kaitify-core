import { KNode, KNodeMarksType } from '../../model'
import { Extension } from '../Extension'
import './style.less'

declare module '../../model' {
	interface EditorCommandsType {
		getTable?: () => KNode | null
		hasTable?: () => boolean
		setTable?: () => Promise<void>
		unsetTable?: () => Promise<void>
	}
}

export const TableExtension = Extension.create({
	name: 'table',
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
		//表格结构格式化
		({ editor, node }) => {
			//表格
			if (node.isMatch({ tag: 'table' })) {
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
