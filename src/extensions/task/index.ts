import { event as DapEvent } from 'dap-util'
import { Editor, KNode, KNodeMarksType } from '@/model'
import { getSelectionBlockNodes } from '@/model/config/function'
import { Extension } from '../Extension'
import { getZeroWidthText } from '@/tools'
import { TASK_CHECKBOX_NODE_TAG } from './element'
import './style.less'

declare module '../../model' {
  interface EditorCommandsType {
    /**
     * 获取光标所在的待办节点，如果光标不在一个待办节点内，返回null
     */
    getTask?: () => KNode | null
    /**
     * 判断光标范围内是否有待办节点
     */
    hasTask?: () => boolean
    /**
     * 光标范围内是否都是待办节点
     */
    allTask?: () => boolean
    /**
     * 设置待办
     */
    setTask?: () => Promise<void>
    /**
     * 取消待办
     */
    unsetTask?: () => Promise<void>
  }
}

/**
 * 创建待办节点
 */
const createTaskNode = () => {
  return KNode.create({
    type: 'block',
    tag: 'div',
    marks: {
      'kaitify-task': 'undo'
    },
    children: []
  })
}

/**
 * 创建TaskSpan节点
 */
const createTaskSpanNode = () => {
  return KNode.create({
    type: 'inline',
    tag: 'span',
    locked: true,
    marks: {
      'kaitify-task-span': ''
    },
    children: [
      {
        type: 'text',
        textContent: getZeroWidthText()
      }
    ]
  })
}

/**
 * 创建TaskCheckbox节点
 */
const createTaskCheckboxNode = () => {
  return KNode.create({
    type: 'closed',
    tag: TASK_CHECKBOX_NODE_TAG,
    void: true
  })
}

/**
 * 块节点转为待办
 */
const toTask = (editor: Editor, node: KNode) => {
  if (!node.isBlock()) {
    return
  }
  //是固定的块节点或者内嵌套的块节点
  if (node.fixed || node.nested) {
    //创建待办节点
    const taskNode = createTaskNode()
    //创建taskSpan和taskCheckbox节点
    const taskSpanNode = createTaskSpanNode()
    const taskCheckboxNode = createTaskCheckboxNode()
    taskNode.children = [taskSpanNode, taskCheckboxNode]
    taskSpanNode.parent = taskNode
    taskCheckboxNode.parent = taskNode
    //将块节点的子节点给待办节点
    node.children!.forEach((item, index) => {
      editor.addNode(item, taskSpanNode, index)
    })
    //将待办节点添加到块节点下
    taskNode.parent = node
    node.children = [taskNode]
  }
  //非固定块节点
  else {
    //转为段落
    editor.toParagraph(node)
    //创建taskSpan和taskCheckbox节点
    const taskSpanNode = createTaskSpanNode()
    const taskCheckboxNode = createTaskCheckboxNode()
    //将块节点的子节点给待办节点
    node.children!.forEach((item, index) => {
      editor.addNode(item, taskSpanNode, index)
    })
    //转为待办节点
    node.tag = 'div'
    node.marks = {
      'kaitify-task': 'undo'
    }
    //将taskSpan和taskCheckbox加入到待办节点
    node.children = [taskSpanNode, taskCheckboxNode]
    taskSpanNode.parent = node
    taskCheckboxNode.parent = node
  }
}

/**
 * 复选框点击处理
 */
const handleCheckboxToggle = function (editor: Editor) {
  DapEvent.off(editor.$el!, `click.task`)
  DapEvent.on(editor.$el!, `click.task`, e => {
    //不可编辑状态下无法点击
    if (!editor.isEditable()) {
      return
    }
    const event = e as MouseEvent
    const elm = event.target as HTMLElement
    if (elm === editor.$el) {
      return
    }
    let node = null
    try {
      node = editor.findNode(elm)
    } catch (_) {
      return
    }
    const taskCheckboxNode = node.getMatchNode({
      tag: TASK_CHECKBOX_NODE_TAG
    })
    const taskNode = taskCheckboxNode?.getMatchNode({
      tag: 'div',
      marks: {
        'kaitify-task': true
      }
    })
    //点击的是复选框
    if (taskCheckboxNode && taskNode) {
      if (taskNode.marks!['kaitify-task'] == 'undo') {
        taskNode.marks!['kaitify-task'] = 'done'
      } else {
        taskNode.marks!['kaitify-task'] = 'undo'
      }
      editor.setSelectionAfter(taskCheckboxNode.parent, 'all')
      editor.updateView()
    }
  })
}

/**
 * 调整复选框与顶部的距离，使其与内容第一行垂直居中
 */
const resizeCheckboxTop = (editor: Editor) => {
  editor.$el!.querySelectorAll<HTMLElement>('div[kaitify-task]').forEach(taskDom => {
    const checkboxDom = taskDom.querySelector<HTMLElement>('kaitify-task-checkbox')
    const spanDom = taskDom.querySelector<HTMLElement>('span[kaitify-task-span]')
    if (!checkboxDom || !spanDom) return
    const range = document.createRange()
    range.selectNodeContents(spanDom)
    const rects = range.getClientRects()
    if (!rects.length) return
    // 第一行内可能有多个 rect（如零宽字符 + 正文），取最大高度
    const firstTop = rects[0].top
    let firstLineHeight = 0
    for (const rect of rects) {
      if (rect.top - firstTop > 2) break
      firstLineHeight = Math.max(firstLineHeight, rect.height)
    }
    checkboxDom.querySelector<HTMLElement>('span')!.style.marginTop = `${(firstLineHeight - checkboxDom.offsetHeight) / 2}px`
  })
}

export const TaskExtension = () =>
  Extension.create({
    name: 'task',
    extraKeepTags: [TASK_CHECKBOX_NODE_TAG],
    onDomParseNode(node) {
      if (
        node.isMatch({
          tag: 'div',
          marks: {
            'kaitify-task': true
          }
        })
      ) {
        node.type = 'block'
      }
      if (node.isMatch({ tag: 'span', marks: { 'kaitify-task-span': true } })) {
        node.type = 'inline'
        node.locked = true
      }
      if (node.isMatch({ tag: TASK_CHECKBOX_NODE_TAG })) {
        node.type = 'closed'
        node.void = true
        node.children = undefined
      }
      return node
    },
    onPasteKeepMarks(node) {
      const marks: KNodeMarksType = {}
      if (
        node.isMatch({
          tag: 'div',
          marks: {
            'kaitify-task': true
          }
        })
      ) {
        marks['kaitify-task'] = node.marks!['kaitify-task']
      }
      if (node.isMatch({ tag: 'span' }) && node.hasMarks() && node.marks!.hasOwnProperty('kaitify-task-span')) {
        marks['kaitify-task-span'] = node.marks!['kaitify-task-span']
      }
      return marks
    },
    onAfterUpdateView() {
      handleCheckboxToggle(this)
      resizeCheckboxTop(this)
    },
    formatRules: [
      //待办相关的节点类型设置
      ({ node }) => {
        if (
          node.isMatch({
            tag: 'div',
            marks: {
              'kaitify-task': true
            }
          })
        ) {
          node.type = 'block'
        }
        if (node.isMatch({ tag: 'span', marks: { 'kaitify-task-span': true } })) {
          node.type = 'inline'
          node.locked = true
        }
        if (node.isMatch({ tag: TASK_CHECKBOX_NODE_TAG })) {
          node.type = 'closed'
          node.void = true
          node.children = undefined
        }
      },
      //待办结构处理
      ({ editor, node }) => {
        if (
          node.isMatch({
            tag: 'div',
            marks: {
              'kaitify-task': true
            }
          })
        ) {
          //存在子节点
          if (node.hasChildren()) {
            let taskSpanNode = node.children!.find(item => item.isMatch({ tag: 'span', marks: { 'kaitify-task-span': true } }))
            let taskCheckboxNode = node.children!.find(item => item.isMatch({ tag: TASK_CHECKBOX_NODE_TAG }))
            if (!taskSpanNode) taskSpanNode = createTaskSpanNode()
            if (!taskCheckboxNode) taskCheckboxNode = createTaskCheckboxNode()
            const otherChildren = node.children!.filter(item => !item.isEqual(taskSpanNode) && !item.isEqual(taskCheckboxNode))
            //将非taskSpan和taskCheckbox的子节点添加到taskSpan中去
            otherChildren.forEach(item => {
              editor.addNode(item, taskSpanNode, taskSpanNode.children?.length)
            })
            node.children = [taskSpanNode, taskCheckboxNode]
            taskSpanNode.parent = node
            taskCheckboxNode.parent = node
          }
          //不存在子节点
          else {
            const taskSpanNode = createTaskSpanNode()
            const taskCheckboxNode = createTaskCheckboxNode()
            node.children = [taskSpanNode, taskCheckboxNode]
            taskSpanNode.parent = node
            taskCheckboxNode.parent = node
          }
        }
        if (node.isMatch({ tag: TASK_CHECKBOX_NODE_TAG })) {
          if (
            !node.getMatchNode({
              tag: 'div',
              marks: {
                'kaitify-task': true
              }
            })
          ) {
            node.toEmpty()
          }
        }
      }
    ],
    onInsertParagraph(node) {
      if (
        node.isMatch({
          tag: 'div',
          marks: {
            'kaitify-task': true
          }
        })
      ) {
        node.marks!['kaitify-task'] = 'undo'
      }
    },
    onDeleteComplete() {
      const taskNode = this.selection.start!.node.getMatchNode({
        tag: 'div',
        marks: {
          'kaitify-task': true
        }
      })
      if (taskNode) {
        const taskSpanNode = taskNode.children!.find(item => item.isMatch({ tag: 'span', marks: { 'kaitify-task-span': true } }))
        if (taskSpanNode && taskSpanNode.getFocusNodes('all').every(item => item.isEmpty())) {
          const zeroWidthText = KNode.createZeroWidthText()
          zeroWidthText.parent = taskSpanNode
          taskSpanNode.children = [zeroWidthText]
          this.setSelectionAfter(zeroWidthText, 'start')
        }
      }
    },
    addCommands() {
      const getTask = () => {
        return this.getMatchNodeBySelection({
          tag: 'div',
          marks: {
            'kaitify-task': true
          }
        })
      }

      const hasTask = () => {
        return this.isSelectionNodesSomeMatch({
          tag: 'div',
          marks: {
            'kaitify-task': true
          }
        })
      }

      const allTask = () => {
        return this.isSelectionNodesAllMatch({
          tag: 'div',
          marks: {
            'kaitify-task': true
          }
        })
      }

      const setTask = async () => {
        if (allTask()) {
          return
        }
        //起点和终点在一起
        if (this.selection.collapsed()) {
          const blockNode = this.selection.start!.node.getBlock()
          toTask(this, blockNode)
        }
        //起点和终点不在一起
        else {
          const blockNodes = getSelectionBlockNodes.apply(this)
          blockNodes.forEach(item => {
            toTask(this, item)
          })
        }
        await this.updateView()
      }

      const unsetTask = async () => {
        if (!allTask()) {
          return
        }
        //起点和终点在一起
        if (this.selection.collapsed()) {
          const matchNode = this.selection.start!.node.getMatchNode({
            tag: 'div',
            marks: {
              'kaitify-task': true
            }
          })
          if (matchNode) this.toParagraph(matchNode)
        }
        //起点和终点不在一起
        else {
          const blockNodes = getSelectionBlockNodes.apply(this)
          blockNodes.forEach(item => {
            const matchNode = item.getMatchNode({
              tag: 'div',
              marks: {
                'kaitify-task': true
              }
            })
            if (matchNode) this.toParagraph(matchNode)
          })
        }
        await this.updateView()
      }

      return {
        getTask,
        hasTask,
        allTask,
        setTask,
        unsetTask
      }
    }
  })
