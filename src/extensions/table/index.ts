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

type TableCellsMergeDirection = 'left' | 'top' | 'right' | 'bottom'

/**
 * 获取td节点的rowspan和colspan数量
 */
const getCellSize = (cell: KNode) => {
	let rowCount = 1
	let colCount = 1
	if (cell.hasMarks()) {
		if (cell.marks!['rowspan']) rowCount = Number(cell.marks!['rowspan']) || 1
		if (cell.marks!['colspan']) colCount = Number(cell.marks!['colspan']) || 1
	}
	return { rowCount, colCount }
}

/**
 * 获取表格的真实列数据
 */
const getTableSize = (rows: KNode[]) => {
	let maxColCount = 0
	for (let i = 0; i < rows.length; i++) {
		let colCount = 0
		const row = rows[i]
		for (let j = 0; j < row.children!.length; j++) {
			const cellSize = getCellSize(row.children![j])
			colCount += cellSize.colCount
		}
		maxColCount = Math.max(maxColCount, colCount)
	}
	return { rowCount: rows.length, colCount: maxColCount }
}

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
		({ editor, node }) => {
			//表格
			if (node.isMatch({ tag: 'table' })) {
				const rows = KNode.flat(node.children!).filter(item => item.isMatch({ tag: 'tr' }))
				//const { rowCount, colCount } = getTableSize(rows)
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
		 * 是否可以合并单元格
		 */
		const canMergeCells = (direction: TableCellsMergeDirection) => {
			if (!this.selection.focused()) {
				return false
			}
			//光标所在的单元格
			const cell = this.getMatchNodeBySelection({ tag: 'td' })
			//光标在一个单元格内
			if (cell) {
				//向右合并
				if (direction == 'right') {
					//获取后一个单元格
					const nextCell = cell.getNext(cell.parent!.children!)
					//存在后一个单元格
					if (nextCell) {
						return
					}
					return false
				}
				//向左合并
				if (direction == 'left') {

				}
				//向上合并
				if (direction == 'top') {

				}
				//向下合并
				if (direction == 'bottom') {

				}
			}
			return false
		}

		/**
		 * 插入表格
		 */
		const setTable = async () => { }

		/**
		 * 取消表格
		 */
		const unsetTable = async () => { }

		return {
			getTable,
			hasTable,
			setTable,
			unsetTable
		}
	}
})
