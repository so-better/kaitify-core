import { string as DapString } from 'dap-util'
import { getZeroWidthText, isZeroWidthText } from '@/tools'
import { Editor } from '../Editor'
import { KNode } from '../KNode'
import { applyMergeNode, convertToBlock, getAllowMergeNode } from './function'

/**
 * 格式化函数类型
 */
export type RuleFunctionType = (state: { editor: Editor; node: KNode }) => void

/**
 * 针对节点自身：处理块节点的标签，部分块节点需要转为默认块节点标签
 */
export const fomratBlockTagParse: RuleFunctionType = ({ editor, node }) => {
  if (node.isMatch({ tag: 'address' }) || node.isMatch({ tag: 'article' }) || node.isMatch({ tag: 'aside' }) || node.isMatch({ tag: 'nav' }) || node.isMatch({ tag: 'section' })) {
    editor.toParagraph(node)
  }
}

/**
 * 针对子节点中的块节点：
 * 1. 子节点中含有块节点则该节点转为块节点；
 * 2. 子节点中含有块节点，则其他节点也转为块节点
 */
export const formatBlockInChildren: RuleFunctionType = ({ editor, node }) => {
  //当前节点存在子节点
  if (node.hasChildren() && !node.isEmpty()) {
    //子节点中存在非空的块节点
    const hasNonEmptyBlock = node.children!.some(item => item.isBlock() && !item.isEmpty())
    if (hasNonEmptyBlock) {
      //将子节点中的非空非块节点转为块节点
      node.children!.forEach(item => {
        if (!item.isEmpty() && !item.isBlock()) {
          convertToBlock.apply(editor, [item])
        }
      })
      if (!node.isBlock()) {
        convertToBlock.apply(editor, [node])
      }
    }
  }
}


/**
 * 针对节点的子节点数组：处理子节点中的占位符，如果占位符和其他节点共存则删除占位符，如果只存在占位符则将多个占位符合并为一个（光标可能会更新）
 */
export const formatPlaceholderMerge: RuleFunctionType = ({ editor, node }) => {
  //当前节点存在子节点
  if (node.hasChildren()) {
    //过滤子节点中的空节点
    const children = node.children!.filter(item => {
      return !item.isEmpty()
    })
    //子节点数组中的占位符节点
    const placeholderNodes = children.filter(item => {
      return item.isPlaceholder()
    })
    //占位符节点在行内节点中则清除
    if (node.isInline() && !!placeholderNodes.length) {
      placeholderNodes.forEach(item => {
        item.toEmpty()
      })
    }
    //子节点数量大于1并且都是占位符，则只保留第一个
    else if (children.length > 1 && placeholderNodes.length == children.length) {
      //光标聚焦情况下
      if (editor.selection.focused()) {
        //如果起点在该节点里，则移动到第一个占位符上
        if (node.isContains(editor.selection.start!.node)) {
          editor.setSelectionBefore(placeholderNodes[0], 'start')
        }
        //如果终点在该节点里，则移动到第一个占位符上
        if (node.isContains(editor.selection.end!.node)) {
          editor.setSelectionBefore(placeholderNodes[0], 'end')
        }
      }
      node.children = [placeholderNodes[0]]
    }
    //子节点数量大于1并且有占位符也有其他节点则把占位符节点都置为空节点
    else if (children.length > 1 && !!placeholderNodes.length) {
      placeholderNodes.forEach(item => {
        item.toEmpty()
      })
    }
  }
}

/**
 * 针对节点自身：
 * 1. 统一将文本节点内的\r\n换成\n，解决Windows兼容问题
 * 2. 统一将文本节点内的&nbsp;（\u00A0）换成普通空格
 * 3. 统一将文本节点内的零宽度无断空格换成零宽度空格（\uFEFF -> \u200B）
 * 4. 统一将文本节点内的\n后面加上零宽度空白字符
 */
export const formatLineBreakSpaceText: RuleFunctionType = ({ editor, node }) => {
  if (node.isText() && !node.isEmpty()) {
    const originalText = node.textContent!
    //先执行1/2/3点的替换逻辑
    node.textContent = originalText
      .replace(/\r\n/g, '\n')
      .replace(/\u00A0/g, ' ')
      .replace(/\uFEFF/g, getZeroWidthText())
    //步骤1中 \r\n -> \n 会导致文本长度缩短，需要同步修正光标 offset
    if (editor.selection.focused()) {
      if (editor.selection.start!.node.isEqual(node)) {
        //统计 offset 之前有多少个 \r\n，每个使 offset 减1
        const preText = originalText.slice(0, editor.selection.start!.offset)
        const crlfCount = (preText.match(/\r\n/g) || []).length
        editor.selection.start!.offset -= crlfCount
      }
      if (editor.selection.end!.node.isEqual(node)) {
        const preText = originalText.slice(0, editor.selection.end!.offset)
        const crlfCount = (preText.match(/\r\n/g) || []).length
        editor.selection.end!.offset -= crlfCount
      }
    }
    //第4点替换之前先判断起点和终点前面有几个\n\u200B
    let startPrevNumber = 0
    let endPrevNumber = 0
    const regExp = new RegExp(`\\n(?!${getZeroWidthText()})`, 'g')
    if (editor.selection.focused()) {
      if (editor.selection.start!.node.isEqual(node)) {
        const preText = editor.selection.start!.offset > 0 ? node.textContent!.slice(0, editor.selection.start!.offset) : ''
        startPrevNumber = (preText.match(regExp) || []).length
      }
      if (editor.selection.end!.node.isEqual(node)) {
        const preText = editor.selection.end!.offset > 0 ? node.textContent!.slice(0, editor.selection.end!.offset) : ''
        endPrevNumber = (preText.match(regExp) || []).length
      }
    }
    //执行第4点的替换逻辑：给\n后面加上零宽度空白字符
    node.textContent = node.textContent!.replace(/\n/g, (chart, index) => {
      const nextChart = node.textContent![index + 1]
      if (!nextChart || !isZeroWidthText(nextChart)) {
        chart = chart + getZeroWidthText()
      }
      return chart
    })
    //起点前面有几个\n\u200B则往后移动对应单位
    if (startPrevNumber > 0) {
      editor.selection.start!.offset += startPrevNumber
    }
    //终点前面有几个\n\u200B则往后移动对应单位
    if (endPrevNumber > 0) {
      editor.selection.end!.offset += endPrevNumber
    }
  }
}

/**
 * 针对节点自身：将文本节点内连续的零宽度空白字符合并（光标可能会更新）
 */
export const formatZeroWidthTextMerge: RuleFunctionType = ({ editor, node }) => {
  //非空文本节点存在空白字符
  if (node.isText() && !node.isEmpty() && node.textContent!.split('').some(item => isZeroWidthText(item))) {
    let val = node.textContent!
    let i = 0
    while (i < val.length) {
      //获取当前字符串
      const chart = val.charAt(i)
      //如果当前字符是空白字符并且前一个字符也是空白字符
      if (i > 0 && isZeroWidthText(chart) && isZeroWidthText(val.charAt(i - 1))) {
        //如果起点在节点上并且起点在当前这个空白字符上或者后面
        if (editor.isSelectionInTargetNode(node, 'start') && editor.selection.start!.offset >= i + 1) {
          editor.selection.start!.offset -= 1
        }
        //如果终点在节点上并且终点在当前这个空白字符上或者后面
        if (editor.isSelectionInTargetNode(node, 'end') && editor.selection.end!.offset >= i + 1) {
          editor.selection.end!.offset -= 1
        }
        //删除空白字符
        val = DapString.delete(val, i, 1)
        //跳过后续
        continue
      }
      i++
    }
    node.textContent = val
  }
}

/**
 * 针对节点的子节点数组：兄弟节点合并策略（光标可能会更新）
 */
export const formatSiblingNodesMerge: RuleFunctionType = ({ editor, node }) => {
  //有子节点并且子节点数大于1
  if ((node.isBlock() || node.isInline()) && node.hasChildren() && node.children!.length > 1) {
    let index = 0
    //因为父子节点的合并操作会导致children没有，此时判断一下hasChildren
    while (node.hasChildren() && index <= node.children!.length - 2) {
      const newTargetNode = getAllowMergeNode.apply(editor, [node.children![index], 'nextSibling'])
      if (newTargetNode) {
        //兄弟节点合并
        applyMergeNode.apply(editor, [node.children![index], 'nextSibling'])
        //合并完成后执行合并空白文本
        formatZeroWidthTextMerge({ editor, node: node.children![index] })
        //子节点合并后可能只有一个子节点了，此时进行父子节点合并操作
        if (node.hasChildren() && node.children!.length == 1) {
          applyMergeNode.apply(editor, [node.children![0], 'parent'])
        }
        continue
      }
      index++
    }
  }
}

/**
 * 针对节点的子节点数组：父子节点合并策略（光标可能会更新）
 */
export const formatParentNodeMerge: RuleFunctionType = ({ editor, node }) => {
  //只有一个子节点
  if ((node.isBlock() || node.isInline()) && node.hasChildren() && node.children!.length == 1) {
    //父子节点进行合并
    if (getAllowMergeNode.apply(editor, [node.children![0], 'parent'])) {
      applyMergeNode.apply(editor, [node.children![0], 'parent'])
      //父子节点合并后，可能父节点需要再和兄弟节点进行合并
      if (getAllowMergeNode.apply(editor, [node, 'prevSibling'])) {
        applyMergeNode.apply(editor, [node, 'prevSibling'])
      } else if (getAllowMergeNode.apply(editor, [node, 'nextSibling'])) {
        applyMergeNode.apply(editor, [node, 'nextSibling'])
      }
    }
  }
}
