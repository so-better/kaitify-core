import interact from 'interactjs'
import { element as DapElement, event as DapEvent, data as DapData } from 'dap-util'
import { Editor, KNode, KNodeCreateOptionType, KNodeMarksType, KNodeStylesType } from '@/model'
import { Extension } from '../Extension'
import './style.less'

export type TableCellsMergeDirectionType = 'left' | 'top' | 'right' | 'bottom'

declare module '../../model' {
  interface EditorCommandsType {
    getTable?: () => KNode | null
    hasTable?: () => boolean
    canMergeTableCells?: (direction: TableCellsMergeDirectionType) => boolean
    setTable?: ({ rows, columns }: { rows: number; columns: number }) => Promise<void>
    unsetTable?: () => Promise<void>
    mergeTableCell?: (direction: TableCellsMergeDirectionType) => Promise<void>
    addTableRow?: (direction: 'top' | 'bottom') => Promise<void>
    deleteTableRow?: () => Promise<void>
    addTableColumn?: (direction: 'left' | 'right') => Promise<void>
    deleteTableColumn?: () => Promise<void>
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
    void: true,
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
 * 获取单元格节点的rowspan和colspan
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
 * 获取表格正确的行数和列数
 */
const getTableSize = (rows: KNode[]) => {
  //表格实际列数
  let colCount = 0
  //遍历每一行
  for (let i = 0; i < rows.length; i++) {
    //当前行
    const currentRow = rows[i]
    //当前行的列数组
    const cells = currentRow.children!
    //当前行的实际列数
    let currentColCount = 0
    //遍历这一行的单元格
    for (let j = 0; j < cells.length; j++) {
      //当前单元格
      const currentCell = cells[j]
      //跳过隐藏单元格
      if (isHideCell(currentCell)) {
        continue
      }
      //获取单元格的大小
      const cellSize = getCellSize(currentCell)
      //当前行的实际列数是所有单元格的列数累加
      currentColCount += cellSize.colCount
    }
    //总列数是所有行的实际列数最大的那个值
    if (currentColCount > colCount) {
      colCount = currentColCount
    }
  }
  return { rowCount: rows.length, colCount }
}
/**
 * 过滤表格中的隐藏单元格
 */
const filterHideCells = (rows: KNode[]) => {
  let rowIndex = 0
  while (rowIndex < rows.length) {
    const currentRow = rows[rowIndex]
    let colIndex = 0
    while (colIndex < currentRow.children!.length) {
      const currentCell = currentRow.children![colIndex]
      //如果是隐藏单元格，则去除，跳过本次循环
      if (isHideCell(currentCell)) {
        currentRow.children!.splice(colIndex, 1)
        continue
      }
      colIndex++
    }
    rowIndex++
  }
}
/**
 * 给表格重新设置隐藏单元格
 */
const resetTableHideCells = (editor: Editor, rows: KNode[]) => {
  let rowIndex = 0
  while (rowIndex < rows.length) {
    const currentRow = rows[rowIndex]
    let cellIndex = 0
    while (cellIndex < currentRow.children!.length) {
      const currentCell = currentRow.children![cellIndex]
      //跳过隐藏单元格
      if (isHideCell(currentCell)) {
        cellIndex++
        continue
      }
      //获取单元格的跨行和跨列数
      const { rowCount, colCount } = getCellSize(currentCell)
      //跨列
      if (colCount > 1) {
        for (let i = colCount - 1; i > 0; i--) {
          const cell = createHideCellNode()
          editor.addNodeAfter(cell, currentCell)
        }
      }
      //跨行
      if (rowCount > 1) {
        //遍历后面受影响的行
        for (let i = rowIndex + 1; i < rowIndex + rowCount; i++) {
          //下一行
          const nextRow = rows[i]
          //下一行不存在则跳过
          if (!nextRow) {
            continue
          }
          //处理下一行的对应列，可能是多列，因为可能跨行的同时也跨列，所以使用for循环处理
          for (let j = cellIndex; j < cellIndex + colCount; j++) {
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
      cellIndex++
    }
    rowIndex++
  }
}
/**
 * 获取单元格指定方向的最近的一个非隐藏单元格
 */
const getTargetNotHideCell = (cell: KNode, direction: TableCellsMergeDirectionType) => {
  if (direction == 'right') {
    const nextCell = cell.getNext(cell.parent!.children!)
    if (nextCell) {
      if (isHideCell(nextCell)) {
        return getTargetNotHideCell(nextCell, direction)
      }
      return nextCell
    }
  } else if (direction == 'left') {
    const previousCell = cell.getPrevious(cell.parent!.children!)
    if (previousCell) {
      if (isHideCell(previousCell)) {
        return getTargetNotHideCell(previousCell, direction)
      }
      return previousCell
    }
  } else if (direction == 'top') {
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
  } else if (direction == 'bottom') {
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
 * 针对新行，判断是否需要隐藏部分单元格
 */
const hideCellWhereInCross = (newRow: KNode) => {
  const rows = newRow.parent!.children!
  const newRowIndex = rows.findIndex(item => item.isEqual(newRow))
  for (let i = 0; i < newRow.children!.length; i++) {
    //新行的单元格
    const cell = newRow.children![i]
    //跳过已经隐藏的单元格
    if (isHideCell(cell)) {
      continue
    }
    //获取上面的最近的一个非隐藏单元格
    const targetCell = getTargetNotHideCell(cell, 'top')
    if (targetCell) {
      const { rowCount, colCount } = getCellSize(targetCell)
      const rowIndex = rows.findIndex(item => item.isEqual(targetCell.parent!))
      const colIndex = targetCell.parent!.children!.findIndex(item => item.isEqual(targetCell))
      //该列在跨行的单元格范围内
      if (rowIndex + rowCount - 1 >= newRowIndex) {
        //需要考虑这个跨行的单元格是否跨列，所以采用循环遍历
        for (let j = colIndex; j < colIndex + colCount; j++) {
          setCellToHide(newRow.children![j])
        }
      }
    }
  }
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
  if (cell.hasMarks()) {
    const marks: KNodeMarksType = {}
    Object.keys(cell.marks!).forEach(markName => {
      if (markName != 'rowspan' && markName != 'colspan') {
        marks[markName] = cell.marks![markName]
      }
    })
    cell.marks = { ...marks }
  }
  cell.void = true
  const placeholderNode = KNode.createPlaceholder()
  cell.children = [placeholderNode]
  placeholderNode.parent = cell
}
/**
 * 隐藏的单元格恢复显示
 */
const setCellNotHide = (cell: KNode) => {
  if (!isHideCell(cell)) {
    return
  }
  const styles: KNodeStylesType = {}
  Object.keys(cell.styles!).forEach(styleName => {
    if (styleName != 'display') {
      styles[styleName] = cell.styles![styleName]
    }
  })
  cell.styles = { ...styles }
  cell.void = false
  const placeholderNode = KNode.createPlaceholder()
  cell.children = [placeholderNode]
  placeholderNode.parent = cell
}
/**
 * 合并两个单元格
 */
const mergeTwoCell = (cell: KNode, targetCell: KNode, direction: TableCellsMergeDirectionType) => {
  const cellSize = getCellSize(cell)
  const targetCellSize = getCellSize(targetCell)
  if (direction == 'left') {
    const children = cell.children!.map(item => {
      item.parent = targetCell
      return item
    })
    targetCell.children = [...targetCell.children!, ...children]
    if (targetCell.hasMarks()) {
      targetCell.marks!['colspan'] = targetCellSize.colCount + cellSize.colCount
    } else {
      targetCell.marks = {
        colspan: targetCellSize.colCount + cellSize.colCount
      }
    }
    setCellToHide(cell)
  } else if (direction == 'right') {
    const children = targetCell.children!.map(item => {
      item.parent = cell
      return item
    })
    cell.children = [...cell.children!, ...children]
    if (cell.hasMarks()) {
      cell.marks!['colspan'] = cellSize.colCount + targetCellSize.colCount
    } else {
      cell.marks = {
        colspan: cellSize.colCount + targetCellSize.colCount
      }
    }
    setCellToHide(targetCell)
  } else if (direction == 'top') {
    const children = cell.children!.map(item => {
      item.parent = targetCell
      return item
    })
    targetCell.children = [...targetCell.children!, ...children!]
    if (targetCell.hasMarks()) {
      targetCell.marks!['rowspan'] = targetCellSize.rowCount + cellSize.rowCount
    } else {
      targetCell.marks = {
        rowspan: targetCellSize.rowCount + cellSize.rowCount
      }
    }
    setCellToHide(cell)
  } else if (direction == 'bottom') {
    const children = targetCell.children!.map(item => {
      item.parent = cell
      return item
    })
    cell.children = [...cell.children!, ...children]
    if (cell.hasMarks()) {
      cell.marks!['rowspan'] = cellSize.rowCount + targetCellSize.rowCount
    } else {
      cell.marks = {
        rowspan: cellSize.rowCount + targetCellSize.rowCount
      }
    }
    setCellToHide(targetCell)
  }
}
/**
 * 获取最大宽度
 */
const getMaxWidth = (element: HTMLElement): number => {
  const parentElement = element.parentElement!
  let maxWidth = DapElement.width(parentElement)
  if (!maxWidth) {
    maxWidth = getMaxWidth(parentElement)
  }
  return maxWidth
}
/**
 * 设置表格拖拽改变列宽
 */
const tableResizable = (editor: Editor) => {
  //设置拖拽改变大小的功能
  interact('.kaitify table td').unset()
  interact('.kaitify table td').resizable({
    //是否启用
    enabled: true,
    //指定可以调整大小的边缘
    edges: { left: false, right: true, bottom: false, top: false },
    //设置鼠标样式
    cursorChecker(_action, _interactable, element, _interacting) {
      return editor.isEditable() && element.nextElementSibling ? 'ew-resize' : 'default'
    },
    //启用惯性效果
    inertia: false,
    //调整大小时的自动滚动功能
    autoScroll: true,
    //保持宽高比
    preserveAspectRatio: true,
    //水平调整
    axis: 'x',
    //事件
    listeners: {
      //开始拖拽
      start(event) {
        //最后一列不能拖拽、不可编辑状态下不能拖拽
        if (!event.target.nextElementSibling || !editor.isEditable()) {
          event.interaction.stop()
          return
        }
        //禁用dragstart
        DapEvent.on(event.target, 'dragstart', e => e.preventDefault())
        //获取单元格节点
        const node = editor.findNode(event.target)
        //获取单元格在父节点中的序列
        const index = node.parent!.children!.findIndex(item => item.isEqual(node))
        //获取单元格所在的表格
        const table = node.getMatchNode({ tag: 'table' })!
        //获取表格的colgroup节点
        const colgroup = table.children!.find(item => item.isMatch({ tag: 'colgroup' }))!
        //获取对应的col节点
        const col = colgroup.children![index]
        //获取对应的真实dom
        const colDom = editor.findDom(col)
        //暂存
        DapData.set(event.target, 'col', col)
        DapData.set(event.target, 'colDom', colDom)
      },
      //拖拽
      move(event) {
        //获取宽度
        const { width } = event.rect
        //获取暂存的col元素
        const colDom = DapData.get<HTMLElement>(event.target, 'colDom')
        //设置宽度
        colDom.setAttribute('width', `${width}px`)
      },
      //结束拖拽
      end(event) {
        //恢复dragstart
        DapEvent.off(event.target, 'dragstart')
        //获取宽度
        const { width } = event.rect
        //设置百分比宽度
        const percentWidth = Number(((width / event.target.parentElement.offsetWidth) * 100).toFixed(2))
        //获取暂存的col节点
        const col = DapData.get<KNode>(event.target, 'col')
        //设置节点的styles
        if (col.hasStyles()) {
          col.marks!.width = `${percentWidth}%`
        } else {
          col.marks = {
            width: `${percentWidth}%`
          }
        }
        //更新视图
        editor.updateView()
      }
    }
  })
}

export const TableExtension = () =>
  Extension.create({
    name: 'table',
    extraKeepTags: ['table', 'tfoot', 'tbody', 'thead', 'tr', 'th', 'td', 'col', 'colgroup'],
    domParseNodeCallback(node) {
      if (node.isMatch({ tag: 'table' })) {
        node.type = 'block'
      }
      if (node.isMatch({ tag: 'tfoot' }) || node.isMatch({ tag: 'tbody' }) || node.isMatch({ tag: 'thead' }) || node.isMatch({ tag: 'tr' })) {
        node.type = 'block'
        node.fixed = true
        node.nested = true
      }
      if (node.isMatch({ tag: 'th' }) || node.isMatch({ tag: 'td' })) {
        node.type = 'block'
        node.fixed = true
        node.nested = true
        if (isHideCell(node)) {
          node.void = true
        }
      }
      if (node.isMatch({ tag: 'colgroup' })) {
        node.type = 'block'
        node.fixed = true
        node.nested = true
        node.void = true
      }
      if (node.isMatch({ tag: 'col' })) {
        node.type = 'closed'
        node.void = true
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
      //表格单元格rowspan和colspan属性保留
      if (node.isMatch({ tag: 'td' }) || node.isMatch({ tag: 'th' })) {
        if (node.marks!.hasOwnProperty('rowspan')) marks['rowspan'] = node.marks!['rowspan']
        if (node.marks!.hasOwnProperty('colspan')) marks['colspan'] = node.marks!['colspan']
      }
      return marks
    },
    formatRules: [
      //表格相关节点类型设置
      ({ node }) => {
        if (node.isMatch({ tag: 'table' })) {
          node.type = 'block'
        }
        if (node.isMatch({ tag: 'tfoot' }) || node.isMatch({ tag: 'tbody' }) || node.isMatch({ tag: 'thead' }) || node.isMatch({ tag: 'tr' })) {
          node.type = 'block'
          node.fixed = true
          node.nested = true
        }
        if (node.isMatch({ tag: 'th' }) || node.isMatch({ tag: 'td' })) {
          node.type = 'block'
          node.fixed = true
          node.nested = true
          if (isHideCell(node)) {
            node.void = true
          }
        }
        if (node.isMatch({ tag: 'colgroup' })) {
          node.type = 'block'
          node.fixed = true
          node.nested = true
          node.void = true
        }
        if (node.isMatch({ tag: 'col' })) {
          node.type = 'closed'
          node.void = true
        }
      },
      //表格结构改造
      ({ editor, node }) => {
        if (node.isMatch({ tag: 'table' })) {
          //获取表格下所有的节点
          const nodes = KNode.flat(node.children!)
          //获取tbody节点
          let tbody = nodes.find(item => item.isMatch({ tag: 'tbody' }))
          //如果tbody节点不存在，则创建该节点
          if (!tbody) {
            tbody = KNode.create({
              type: 'block',
              tag: 'tbody',
              nested: true,
              fixed: true,
              children: []
            })
          }
          //获取所有的表格行节点并设置为tbody的子节点
          const rows = nodes
            .filter(item => item.isMatch({ tag: 'tr' }))
            .map(item => {
              item.parent = tbody
              //过滤非法的子节点
              if (item.hasChildren()) {
                item.children = item.children!.filter(it => it.isMatch({ tag: 'td' }) || it.isMatch({ tag: 'th' }))
              }
              return item
            })
          tbody.children = [...rows]
          //获取表格列数
          const { colCount } = getTableSize(rows)
          //获取colgroup节点
          let colgroup = nodes.find(item => item.isMatch({ tag: 'colgroup' }))
          //colgroup节点存在
          if (colgroup) {
            //过滤非法的子节点
            colgroup.children = colgroup.children!.filter(item => item.isMatch({ tag: 'col' }))
            //遍历每个col节点
            colgroup.children!.forEach(col => {
              //没有标记
              if (!col.hasMarks()) {
                col.marks = {
                  width: 'auto'
                }
              }
              //没有width标记
              else if (!col.marks!['width']) {
                col.marks!['width'] = 'auto'
              }
            })
            //对缺少的col元素进行补全
            const length = colgroup.children!.length
            for (let i = 0; i < colCount - length; i++) {
              const col = KNode.create({
                type: 'closed',
                tag: 'col',
                marks: {
                  width: 'auto'
                },
                void: true
              })
              editor.addNode(col, colgroup, colgroup.children!.length)
            }
          }
          //colgroup节点不存在，则创建该节点
          else {
            const children: KNodeCreateOptionType[] = []
            for (let i = colCount - 1; i >= 0; i--) {
              children.push({
                type: 'closed',
                tag: 'col',
                marks: {
                  width: 'auto'
                },
                void: true
              })
            }
            colgroup = KNode.create({
              type: 'block',
              tag: 'colgroup',
              fixed: true,
              nested: true,
              void: true,
              children: children
            })
          }
          //将colgroup和tbody设为表格的子节点
          node.children = [colgroup, tbody]
          colgroup.parent = node
          tbody.parent = node
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
          //所有行
          const rows = node.children!.find(item => item.isMatch({ tag: 'tbody' }))!.children!
          //过滤表格中的隐藏单元格
          filterHideCells(rows)
          //重新设置表格的隐藏单元格
          resetTableHideCells(editor, rows)
        }
      }
    ],
    afterUpdateView() {
      //表格拖拽改变列宽
      tableResizable(this)
    },
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
      const canMergeTableCells = (direction: TableCellsMergeDirectionType) => {
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
            if (direction == 'left' || direction == 'right') {
              const rows = cell.parent!.parent!.children!.filter(row => row.children!.some(n => !isHideCell(n)))
              //只有一行
              if (rows.length == 1) {
                return true
              }
              const targetIndex = targetCell.parent!.children!.findIndex(item => item.isEqual(targetCell))
              const cellIndex = cell.parent!.children!.findIndex(item => item.isEqual(cell))
              if (direction == 'left') {
                const size = getCellSize(targetCell)
                //这两个单元格不相邻，也就是中间有隐藏的单元格并且隐藏单元格是跨行单元格的
                if (cellIndex - targetIndex > size.colCount) {
                  return false
                }
              }
              if (direction == 'right') {
                const size = getCellSize(cell)
                //这两个单元格不相邻，也就是中间有隐藏的单元格并且隐藏单元格是跨行单元格的
                if (targetIndex - cellIndex > size.colCount) {
                  return false
                }
              }
              return getCellSize(targetCell).rowCount == getCellSize(cell).rowCount
            }
            if (direction == 'top' || direction == 'bottom') {
              const totalRows = cell.parent!.parent!.children!
              const rows = totalRows.filter(row => row.children!.some(n => !isHideCell(n)))
              const onlyOneCell = rows.every(row => row.children!.filter(item => !isHideCell(item)).length == 1)
              //只有一列
              if (onlyOneCell) {
                return true
              }
              const targetIndex = totalRows.findIndex(item => item.isEqual(targetCell.parent!))
              const cellIndex = totalRows.findIndex(item => item.isEqual(cell.parent!))
              if (direction == 'top') {
                const size = getCellSize(targetCell)
                //这两个单元格不相邻，也就是中间有隐藏的单元格并且隐藏单元格是跨列单元格的
                if (cellIndex - targetIndex > size.rowCount) {
                  return false
                }
              }
              if (direction == 'bottom') {
                const size = getCellSize(cell)
                //这两个单元格不相邻，也就是中间有隐藏的单元格并且隐藏单元格是跨列单元格的
                if (targetIndex - cellIndex > size.rowCount) {
                  return false
                }
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
      const setTable = async (options: { rows: number; columns: number }) => {
        if (!this.selection.focused() || hasTable()) {
          return
        }
        const rowNodes: KNodeCreateOptionType[] = []
        const colNodes: KNodeCreateOptionType[] = []
        for (let i = 0; i < options.rows; i++) {
          const cellNodes: KNodeCreateOptionType[] = []
          for (let j = 0; j < options.columns; j++) {
            cellNodes.push({
              type: 'block',
              tag: 'td',
              nested: true,
              fixed: true,
              children: [
                {
                  type: 'block',
                  tag: this.blockRenderTag,
                  children: [
                    {
                      type: 'closed',
                      tag: 'br'
                    }
                  ]
                }
              ]
            })
          }
          rowNodes.push({
            type: 'block',
            tag: 'tr',
            nested: true,
            fixed: true,
            children: cellNodes
          })
        }
        for (let i = 0; i < options.columns; i++) {
          colNodes.push({
            type: 'closed',
            tag: 'col',
            marks: {
              width: 'auto'
            },
            void: true
          })
        }
        const tableNode = KNode.create({
          type: 'block',
          tag: 'table',
          children: [
            {
              type: 'block',
              tag: 'colgroup',
              fixed: true,
              nested: true,
              void: true,
              children: colNodes
            },
            {
              type: 'block',
              tag: 'tbody',
              fixed: true,
              nested: true,
              children: rowNodes
            }
          ]
        })
        this.insertNode(tableNode, true)
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
      const mergeTableCell = async (direction: TableCellsMergeDirectionType) => {
        if (!canMergeTableCells(direction)) {
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
      const addTableRow = async (direction: 'top' | 'bottom') => {
        const cell = this.getMatchNodeBySelection({ tag: 'td' })
        //光标在某个非隐藏的单元格内
        if (cell && !isHideCell(cell)) {
          const row = cell.parent!
          const rows = row.parent!.children!
          const tableSize = getTableSize(rows)
          const newRow = KNode.create({
            type: 'block',
            tag: 'tr',
            nested: true,
            fixed: true,
            children: []
          })
          for (let i = 0; i < tableSize.colCount; i++) {
            const newCell = KNode.create({
              type: 'block',
              tag: 'td',
              nested: true,
              fixed: true,
              children: [
                {
                  type: 'closed',
                  tag: 'br'
                }
              ]
            })
            this.addNode(newCell, newRow, newRow.children!.length)
          }
          //上面插入一行
          if (direction == 'top') {
            this.addNodeBefore(newRow, row)
          }
          //下面插入一行
          else {
            //获取单元格尺寸
            const cellSize = getCellSize(cell)
            let index = 1
            let targetRow = row
            //处理单元格跨行的情况，获取目标行
            while (cellSize.rowCount > 1 && index < cellSize.rowCount) {
              const nextRow = targetRow.getNext(rows)
              if (!nextRow) {
                break
              }
              targetRow = nextRow
              index++
            }
            //在目标行后插入新行
            this.addNodeAfter(newRow, targetRow)
            //针对新行，判断是否需要隐藏部分单元格
            hideCellWhereInCross(newRow)
          }
          this.setSelectionBefore(newRow, 'all')
        }
        await this.updateView()
      }

      /**
       * 删除行
       */
      const deleteTableRow = async () => {
        const cell = this.getMatchNodeBySelection({ tag: 'td' })
        //光标在某个非隐藏的单元格内
        if (cell && !isHideCell(cell)) {
          //所在行
          const row = cell.parent!
          //表格全部行
          const rows = row.parent!.children!
          //表格节点
          const table = row.parent!.parent!
          //只有一行，删除表格
          if (rows.length == 1) {
            table.toEmpty()
          }
          //正常删除
          else {
            //上一行
            const previousRow = row.getPrevious(rows)
            //下一行
            const nextRow = row.getNext(rows)
            //当前行的序列
            const rowIndex = rows.findIndex(item => item.isEqual(row))
            //遍历该行的每一个单元格
            row.children!.forEach((currentCell, index) => {
              //获取单元格尺寸
              const cellSize = getCellSize(currentCell)
              //是隐藏单元格
              if (isHideCell(currentCell)) {
                //获取上方最近的非隐藏单元格
                const upCell = getTargetNotHideCell(currentCell, 'top')
                //存在非隐藏单元格
                if (upCell) {
                  //获取非隐藏单元格所在行在所有行中的序列
                  const upIndex = rows.findIndex(item => item.isEqual(upCell.parent!))
                  //获取非隐藏单元格的大小
                  const { rowCount } = getCellSize(upCell)
                  //当前隐藏单元格被上方非隐藏单元格所覆盖
                  if (rowIndex - upIndex < rowCount) {
                    upCell.marks!['rowspan'] = rowCount - 1
                  }
                }
              }
              //是跨行单元格并且下一行存在
              else if (cellSize.rowCount > 1 && nextRow) {
                let i = index
                while (i < index + cellSize.colCount) {
                  //获取下一行对应的单元格
                  const nextRowCell = nextRow.children![i]
                  if (isHideCell(nextRowCell)) {
                    setCellNotHide(nextRowCell)
                    if (nextRowCell.hasMarks()) {
                      nextRowCell.marks!['rowspan'] = cellSize.rowCount - 1
                    } else {
                      nextRowCell.marks = {
                        rowspan: cellSize.rowCount - 1
                      }
                    }
                  }
                  i++
                }
              }
            })
            if (previousRow) {
              this.setSelectionAfter(previousRow, 'all')
            } else if (nextRow) {
              this.setSelectionBefore(nextRow, 'all')
            }
            row.toEmpty()
          }
          await this.updateView()
        }
      }

      /**
       * 添加列
       */
      const addTableColumn = async (direction: 'left' | 'right') => {
        const cell = this.getMatchNodeBySelection({ tag: 'td' })
        //光标在某个非隐藏的单元格内
        if (cell && !isHideCell(cell)) {
          const row = cell.parent!
          const tbody = row.parent!
          const table = tbody.parent!
          const rows = tbody.children!
          //单元格在行中的序列
          let cellIndex = -1
          //左侧插入列
          if (direction == 'left') {
            cellIndex = row.children!.findIndex(item => {
              return item.isEqual(cell)
            })
          }
          //右侧插入列
          if (direction == 'right') {
            //获取单元格尺寸
            const cellSize = getCellSize(cell)
            let index = 1
            let targetCell = cell
            //处理单元格跨列的情况，获取目标列
            while (cellSize.colCount > 1 && index < cellSize.colCount) {
              const nextCell = targetCell.getNext(row.children!)
              if (!nextCell) {
                break
              }
              targetCell = nextCell
              index++
            }
            cellIndex = row.children!.findIndex(item => {
              return item.isEqual(targetCell)
            })
          }
          rows!.forEach(item => {
            const newCell = KNode.create({
              type: 'block',
              tag: 'td',
              fixed: true,
              nested: true,
              children: [
                {
                  type: 'closed',
                  tag: 'br'
                }
              ]
            })
            this.addNode(newCell, item, direction == 'left' ? cellIndex : cellIndex + 1)
            if (item.isEqual(row)) {
              this.setSelectionBefore(newCell, 'all')
            }
          })
          //插入col
          const colgroup = table.children!.find(item => item.isMatch({ tag: 'colgroup' }))!
          const col = KNode.create({
            type: 'closed',
            tag: 'col',
            marks: {
              width: 'auto'
            },
            void: true
          })
          this.addNode(col, colgroup, direction == 'left' ? cellIndex : cellIndex + 1)
          await this.updateView()
        }
      }

      /**
       * 删除列
       */
      const deleteTableColumn = async () => {
        const cell = this.getMatchNodeBySelection({ tag: 'td' })
        //光标在某个非隐藏的单元格内
        if (cell && !isHideCell(cell)) {
          //所在行
          const row = cell.parent!
          //表格全部行
          const rows = row.parent!.children!
          //表格节点
          const table = row.parent!.parent!
          //光标所在行只有一个单元格则删除表格
          if (row.children!.length == 1) {
            table.toEmpty()
          }
          //正常删除
          else {
            //前一个单元格
            const previousCell = cell.getPrevious(row.children!)
            //后一个单元格
            const nextCell = cell.getNext(row.children!)
            //光标所在的单元格在行中的序列
            const cellIndex = row.children!.findIndex(item => {
              return item.isEqual(cell)
            })
            //遍历所有的行
            rows.forEach((item, index) => {
              //当前行对应序列的单元格
              const currentCell = item.children![cellIndex]
              //获取对应单元格的大小
              const cellSize = getCellSize(currentCell)
              //是隐藏的单元格
              if (isHideCell(currentCell)) {
                //获取左侧最近的非隐藏单元格
                const leftCell = getTargetNotHideCell(currentCell, 'left')
                //左侧存在非隐藏单元格
                if (leftCell) {
                  //获取单元格的序列
                  const leftIndex = item.children!.findIndex(n => n.isEqual(leftCell))
                  //获取单元格的大小
                  const { colCount } = getCellSize(leftCell)
                  //当前隐藏单元格被左侧非隐藏单元格所覆盖
                  if (cellIndex - leftIndex < colCount) {
                    leftCell.marks!['colspan'] = colCount - 1
                  }
                }
              }
              //是跨列的单元格
              else if (cellSize.colCount > 1) {
                let i = index
                while (i < index + cellSize.rowCount) {
                  //获取每一行对应单元格的下一个单元格
                  const nextCell = rows[i].children![cellIndex].getNext(rows[i].children!)
                  if (nextCell && isHideCell(nextCell)) {
                    setCellNotHide(nextCell)
                    if (nextCell.hasMarks()) {
                      nextCell.marks!['colspan'] = cellSize.colCount - 1
                    } else {
                      nextCell.marks = {
                        colspan: cellSize.colCount - 1
                      }
                    }
                  }
                  i++
                }
              }
              currentCell.toEmpty()
            })
            //删除col
            const colgroup = table.children!.find(item => item.isMatch({ tag: 'colgroup' }))!
            colgroup.children![cellIndex].toEmpty()
            //重置光标
            if (previousCell) {
              this.setSelectionAfter(previousCell, 'all')
            } else if (nextCell) {
              this.setSelectionBefore(nextCell, 'all')
            }
          }
          //渲染
          await this.updateView()
        }
      }

      return {
        getTable,
        hasTable,
        canMergeTableCells,
        setTable,
        unsetTable,
        mergeTableCell,
        addTableRow,
        deleteTableRow,
        addTableColumn,
        deleteTableColumn
      }
    }
  })
