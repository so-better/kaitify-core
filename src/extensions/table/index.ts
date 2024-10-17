import { KNode, KNodeMarksType, KNodeStylesType } from '@/model'
import { Extension } from '../Extension'
import './style.less'

type TableCellsMergeDirection = 'left' | 'top' | 'right' | 'bottom'

declare module '../../model' {
	interface EditorCommandsType {
		getTable?: () => KNode | null
		hasTable?: () => boolean
		canMergeCells?: (direction: TableCellsMergeDirection) => boolean
		setTable?: ({ rows, columns }: { rows: number, columns: number }) => Promise<void>
		unsetTable?: () => Promise<void>
		mergeCell?: (direction: TableCellsMergeDirection) => Promise<void>
		addRow?: (direction: 'up' | 'down') => Promise<void>
		deleteRow?: () => Promise<void>
		addColumn?: (direction: 'left' | 'right') => Promise<void>
		deleteColumn?: () => Promise<void>
	}
}

/**
 * 是否隐藏单元格
 */
const isHideCell = (cell: KNode) => {
	return cell.hasStyles() && cell.styles!.display == 'none'
}
/**
 * 创建一个隐藏的单元格
 */
const createHideCellNode = () => {
	return KNode.create({
		type: 'block',
		tag: 'td',
		nested: true,
		fixed: true,
		styles: {
			display: 'none'
		},
		children: [
			{
				type: 'closed',
				tag: 'br'
			}
		]
	})
}
/**
 * 获取单元格节点实际所占的行数和列数
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
 * 获取单元格节点后面有几个隐藏单元格
 */
const getHideCellCountAfter = (cell: KNode) => {
	let count = 0
	const nextCell = cell.getNext(cell.parent!.children!)
	if (nextCell && isHideCell(nextCell)) {
		count += getHideCellCountAfter(nextCell) + 1
	}
	return count
}
/**
 * 获取单元格指定方向的非隐藏单元格
 */
const getTargetNotHideCell = (cell: KNode, direction: TableCellsMergeDirection) => {
	if (direction == 'right') {
		const nextCell = cell.getNext(cell.parent!.children!)
		if (nextCell) {
			if (isHideCell(nextCell)) {
				return getTargetNotHideCell(nextCell, direction)
			}
			return nextCell
		}
	}
	else if (direction == 'left') {
		const previousCell = cell.getPrevious(cell.parent!.children!)
		if (previousCell) {
			if (isHideCell(previousCell)) {
				return getTargetNotHideCell(previousCell, direction)
			}
			return previousCell
		}
	}
	else if (direction == 'top') {
		const row = cell.parent!
		const index = row.children!.findIndex(item => item.isEqual(cell))
		const previousRow = row.getPrevious(row.parent!.children!)
		if (previousRow) {
			const previousCell = previousRow.children![index]
			if (previousCell) {
				if (isHideCell(previousCell)) {
					return getTargetNotHideCell(previousCell, direction)
				}
				return previousCell
			}
		}
	}
	else if (direction == 'bottom') {
		const row = cell.parent!
		const index = row.children!.findIndex(item => item.isEqual(cell))
		const nextRow = row.getNext(row.parent!.children!)
		if (nextRow) {
			const nextCell = nextRow.children![index]
			if (nextCell) {
				if (isHideCell(nextCell)) {
					return getTargetNotHideCell(nextCell, direction)
				}
				return nextCell
			}
		}
	}
	return null
}
/**
 * 设置单元格隐藏
 */
const setCellToHide = (cell: KNode) => {
	if (isHideCell(cell)) {
		return
	}
	if (cell.hasStyles()) {
		cell.styles!.display = 'none'
	} else {
		cell.styles = { display: 'none' }
	}
}
/**
 * 合并两个单元格
 */
const mergeTwoCell = (c1: KNode, c2: KNode, direction: TableCellsMergeDirection) => {
	const c1Size = getCellSize(c1)
	const c2Size = getCellSize(c2)
	const children = c2.children!.map(item => {
		item.parent = c1
		return item
	})
	if (direction == 'left') {
		c1.children = [...children!, ...c1.children!]
		if (c1.hasMarks()) {
			c1.marks!['colspan'] = c1Size.colCount + c2Size.colCount
		} else {
			c1.marks = {
				colspan: c1Size.colCount + c2Size.colCount
			}
		}
	}
	else if (direction == 'right') {
		c1.children = [...c1.children!, ...children!]
		if (c1.hasMarks()) {
			c1.marks!['colspan'] = c1Size.colCount + c2Size.colCount
		} else {
			c1.marks = {
				colspan: c1Size.colCount + c2Size.colCount
			}
		}
	}
	else if (direction == 'top') {
		c1.children = [...children!, ...c1.children!]
		if (c1.hasMarks()) {
			c1.marks!['rowspan'] = c1Size.rowCount + c2Size.rowCount
		} else {
			c1.marks = {
				rowspan: c1Size.rowCount + c2Size.rowCount
			}
		}
	}
	else if (direction == 'bottom') {
		c1.children = [...c1.children!, ...children!]
		if (c1.hasMarks()) {
			c1.marks!['rowspan'] = c1Size.rowCount + c2Size.rowCount
		} else {
			c1.marks = {
				rowspan: c1Size.rowCount + c2Size.rowCount
			}
		}
	}
	const placeholderNode = KNode.createPlaceholder()
	c2.children = [placeholderNode]
	placeholderNode.parent = c2
	setCellToHide(c2)
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
	pasteKeepStyles(node) {
		const styles: KNodeStylesType = {}
		//表格单元格保留display样式
		if (node.isMatch({ tag: 'td' }) || node.isMatch({ tag: 'th' })) {
			if (node.styles!.hasOwnProperty('display')) styles.display = node.styles!.display
		}
		return styles
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
		//针对跨行跨列的单元格，增加隐藏单元格
		({ editor, node }) => {
			if (node.isMatch({ tag: 'table' })) {
				const rows = node.children!
				let currentRowIndex = 0
				//遍历行
				while (currentRowIndex < rows.length) {
					//当前行
					const currentRow = rows[currentRowIndex]
					let currentColIndex = 0
					//遍历每行的单元格
					while (currentColIndex < currentRow.children!.length) {
						//当前单元格
						const currentCell = currentRow.children![currentColIndex]
						//是隐藏单元格，跳过处理
						if (isHideCell(currentCell)) {
							currentColIndex++
							continue
						}
						//获取单元格的跨行和跨列数
						const { rowCount, colCount } = getCellSize(currentCell)
						//跨列
						if (colCount > 1) {
							const count = getHideCellCountAfter(currentCell)
							//补充隐藏单元格：补充的数量 = 跨列数-1-已经有的隐藏单元格数量
							for (let i = colCount - 1 - count; i > 0; i--) {
								const cell = createHideCellNode()
								editor.addNodeAfter(cell, currentCell)
							}
						}
						//跨行
						if (rowCount > 1) {
							//遍历后面受影响的行
							for (let i = currentRowIndex + 1; i < currentRowIndex + rowCount; i++) {
								//下一行
								const nextRow = rows[i]
								//下一行不存在则跳过
								if (!nextRow) {
									continue
								}
								//处理下一行的对应列，可能是多列，因为可能跨行的同时也跨列，所以使用for循环处理
								for (let j = currentColIndex; j < currentColIndex + colCount; j++) {
									//获取对应的单元格
									const nextCell = nextRow.children![j]
									//单元格不存在，需要补充隐藏的单元格
									if (!nextCell) {
										const hideCell = createHideCellNode()
										editor.addNode(hideCell, nextRow, j)
									}
									//单元格非隐藏，则添加隐藏的单元格到它前面
									else if (!isHideCell(nextCell)) {
										const hideCell = createHideCellNode()
										editor.addNodeBefore(hideCell, nextCell)
									}
								}
							}
						}
						currentColIndex++
					}
					currentRowIndex++
				}
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
			if (cell && !isHideCell(cell)) {
				//获取指定的合并的单元格
				const targetCell = getTargetNotHideCell(cell, direction)
				//单元格存在
				if (targetCell) {
					if (direction == 'right' || direction == 'left') {
						const rows = cell.parent!.parent!.children!.filter(row => row.children!.some(n => !isHideCell(n)))
						if (rows.length == 1) {
							return true
						}
						return getCellSize(targetCell).rowCount == getCellSize(cell).rowCount
					}
					if (direction == 'top' || direction == 'bottom') {
						const rows = cell.parent!.parent!.children!.filter(row => row.children!.some(n => !isHideCell(n)))
						const onlyOneCell = rows.every(row => row.children!.filter(item => !isHideCell(item)).length == 1)
						if (onlyOneCell) {
							return true
						}
						return getCellSize(targetCell).colCount == getCellSize(cell).colCount
					}
				}
			}
			return false
		}

		/**
		 * 插入表格
		 */
		const setTable = async ({ rows, columns }: { rows: number, columns: number }) => {
			if (!!getTable()) {
				return
			}
			const tableNode = KNode.create({
				type: 'block',
				tag: 'table',
				children: []
			})
			for (let i = 0; i < rows; i++) {
				const rowNode = KNode.create({
					type: 'block',
					tag: 'tr',
					nested: true,
					fixed: true,
					children: []
				})
				for (let j = 0; j < columns; j++) {
					const cellNode = KNode.create({
						type: 'block',
						tag: 'td',
						nested: true,
						fixed: true,
						children: [{
							type: 'closed',
							tag: 'br'
						}]
					})
					this.addNode(cellNode, rowNode, rowNode.children!.length)
				}
				this.addNode(rowNode, tableNode, tableNode.children!.length)
			}
			this.insertNode(tableNode)
			this.setSelectionBefore(tableNode, 'all')
			await this.updateView()
		}

		/**
		 * 取消表格
		 */
		const unsetTable = async () => {
			const tableNode = getTable()
			if (!tableNode) {
				return
			}
			tableNode.toEmpty()
			await this.updateView()
		}

		/**
		 * 合并单元格
		 */
		const mergeCell = async (direction: TableCellsMergeDirection) => {
			if (!canMergeCells(direction)) {
				return
			}
			//光标所在的单元格
			const cell = this.getMatchNodeBySelection({ tag: 'td' })!
			//目标单元格
			const targetCell = getTargetNotHideCell(cell, direction)!
			//进行合并
			mergeTwoCell(cell, targetCell, direction)
			//视图更新
			await this.updateView()
		}

		/**
		 * 添加行
		 */
		const addRow = async (direction: 'up' | 'down') => {
			const cell = this.getMatchNodeBySelection({ tag: 'td' })
			//光标在某个单元格内
			if (cell) {
				const row = cell.parent!
				const newRow = KNode.create({
					type: 'block',
					tag: 'tr',
					nested: true,
					fixed: true,
					children: []
				})
				// 这里建列数有问题？？？？？
				for (let i = 0; i < row.children!.length; i++) {
					const newCell = KNode.create({
						type: 'block',
						tag: 'td',
						nested: true,
						fixed: true,
						children: [{
							type: 'closed',
							tag: 'br'
						}]
					})
					this.addNode(newCell, newRow, newRow.children!.length)
				}
				//向上插入行
				if (direction == 'up') {

				}
				//向下插入行
				else {
					const { rowCount } = getCellSize(cell)
					let i = 1
					let current: KNode = row
					while (i < rowCount) {
						const nextRow = current!.getNext(row.parent!.children!)
						if (!nextRow) {
							break
						}
						current = nextRow
						i++
					}
					this.addNodeAfter(newRow, current)
				}
				await this.updateView()
			}
		}

		return {
			getTable,
			hasTable,
			canMergeCells,
			setTable,
			unsetTable,
			mergeCell,
			addRow
		}
	}
})
