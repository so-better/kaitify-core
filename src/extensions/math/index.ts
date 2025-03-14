import KaTex from 'katex'
import { common as DapCommon, event as DapEvent } from 'dap-util'
import { Editor, KNode, KNodeMarksType, KNodeStylesType } from '@/model'
import { Extension } from '../Extension'
import 'katex/dist/katex.css'
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
 * 设置数学公式选中
 */
const mathFocus = (editor: Editor) => {
  DapEvent.off(editor.$el!, 'click.math_focus')
  DapEvent.on(editor.$el!, 'click.math_focus', e => {
    //编辑器不可编辑状态下不设置
    if (!editor.isEditable()) {
      return
    }
    const event = e as MouseEvent
    const elm = event.target as HTMLElement
    if (elm === editor.$el) {
      return
    }
    const node = editor.findNode(elm)
    const matchNode = node.getMatchNode({
      tag: 'span',
      marks: {
        'kaitify-math': true
      }
    })
    if (matchNode) {
      editor.setSelectionBefore(matchNode, 'start')
      editor.setSelectionAfter(matchNode, 'end')
      editor.updateRealSelection()
    }
  })
}

export const MathExtension = () =>
  Extension.create({
    name: 'math',
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
    beforePatchNodeToFormat(node) {
      const mathNode = node.getMatchNode({
        tag: 'span',
        marks: {
          'kaitify-math': true
        }
      })
      if (mathNode) {
        return mathNode
      }
      return node
    },
    formatRules: [
      ({ editor, node }) => {
        if (
          !node.isEmpty() &&
          node.isMatch({
            tag: 'span',
            marks: {
              'kaitify-math': true
            }
          })
        ) {
          //公式节点必须锁定
          node.locked = true
          //公式节点必须是行内
          node.type = 'inline'
          //保持对子孙节点的处理
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
          //没有不可编辑标记的话需要设置
          if (node.marks!['contenteditable'] != 'false') {
            node.marks!['contenteditable'] = 'false'
          }
          //两侧设置空白元素
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
          if (editor.isSelectionInTargetNode(node, 'start')) {
            const newTextNode = node.getNext(node.parent ? node.parent!.children! : editor.stackNodes)
            if (newTextNode) editor.setSelectionBefore(newTextNode, 'start')
          }
          if (editor.isSelectionInTargetNode(node, 'end')) {
            const newTextNode = node.getNext(node.parent ? node.parent!.children! : editor.stackNodes)
            if (newTextNode) editor.setSelectionBefore(newTextNode, 'end')
          }
        }
      }
    ],
    afterUpdateView() {
      mathFocus(this)
    },
    addCommands() {
      const getMath = () => {
        return this.getMatchNodeBySelection({
          tag: 'span',
          marks: {
            'kaitify-math': true
          }
        })
      }

      const hasMath = () => {
        return this.isSelectionNodesSomeMatch({
          tag: 'span',
          marks: {
            'kaitify-math': true
          }
        })
      }

      const setMath = async (value: string) => {
        if (!value || !this.selection.focused() || hasMath()) {
          return
        }
        const mathHtml = KaTex.renderToString(value, {
          output: 'html',
          throwOnError: true
        })
        //设置最终的html内容
        const html = `<span kaitify-math="${value}" contenteditable="false">${mathHtml}</span>`
        //html内容转为节点数组
        const nodes = this.htmlParseNode(html)
        //插入节点
        this.insertNode(nodes[0])
        await this.updateView()
      }

      const updateMath = async (value: string) => {
        if (!value || !this.selection.focused()) {
          return
        }
        const mathNode = getMath()
        if (!mathNode) {
          return
        }
        const mathHtml = KaTex.renderToString(value, {
          output: 'html',
          throwOnError: true
        })
        //设置最终的html内容
        const html = `<span kaitify-math="${value}" contenteditable="false">${mathHtml}</span>`
        //html内容转为节点数组
        const nodes = this.htmlParseNode(html)
        //替换掉原来的数学公式
        nodes[0].parent = mathNode.parent
        const index = mathNode.parent ? mathNode.parent.children!.findIndex(item => item.isEqual(mathNode)) : this.stackNodes.findIndex(item => item.isEqual(mathNode))
        mathNode.parent ? mathNode.parent.children!.splice(index, 1, nodes[0]) : this.stackNodes.splice(index, 1, nodes[0])
        this.setSelectionAfter(nodes[0])
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
