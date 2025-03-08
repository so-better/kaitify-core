import { event as DapEvent } from 'dap-util'
import { Editor, KNode, KNodeMarksType, KNodeStylesType } from '@/model'
import { Extension } from '../Extension'
import defaultIcon from './icon.svg?raw'
import './style.less'

export type SetAttachmentOptionType = {
  url: string
  text: string
  icon?: string
}

export type UpdateAttachmentOptionType = {
  url?: string
  text?: string
  icon?: string
}

export type AttachmentExtensionPropsType = {
  icon: string
}

declare module '../../model' {
  interface EditorCommandsType {
    getAttachment?: () => KNode | null
    hasAttachment?: () => boolean
    setAttachment?: (options: SetAttachmentOptionType) => Promise<void>
    updateAttachment?: (options: UpdateAttachmentOptionType) => Promise<void>
    getAttachmentInfo?: () => { url: string; text: string; icon: string } | null
  }
}

/**
 * 下载附件
 */
const downloadAttachment = (editor: Editor) => {
  DapEvent.off(editor.$el!, 'click.attachment')
  DapEvent.on(editor.$el!, 'click.attachment', async e => {
    //可编辑状态下无法下载
    if (editor.isEditable()) {
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
        'kaitify-attachment': true
      }
    })
    //点击的是附件
    if (matchNode) {
      //获取文件地址
      const url = matchNode.marks!['kaitify-attachment'] as string
      //使用fetch读取文件地址
      const res = await fetch(url, {
        method: 'GET'
      })
      //获取blob数据
      const blob = await res.blob()
      //创建a标签进行下载
      const a = document.createElement('a')
      a.setAttribute('target', '_blank')
      a.setAttribute('href', URL.createObjectURL(blob))
      a.setAttribute(
        'download',
        matchNode.children!.reduce((val, item) => {
          return val + item.textContent
        }, '')
      )
      a.click()
    }
  })
}

export const AttachmentExtension = (props?: AttachmentExtensionPropsType) =>
  Extension.create({
    name: 'attachment',
    pasteKeepStyles(node) {
      const styles: KNodeStylesType = {}
      if (node.isMatch({ tag: 'span', marks: { 'kaitify-attachment': true } })) {
        styles.backgroundImage = node.styles!.backgroundImage
      }
      return styles
    },
    pasteKeepMarks(node) {
      const marks: KNodeMarksType = {}
      if (node.isMatch({ tag: 'span', marks: { 'kaitify-attachment': true } })) {
        marks['kaitify-attachment'] = node.marks!['kaitify-attachment']
      }
      return marks
    },
    domParseNodeCallback(node) {
      if (node.isMatch({ tag: 'span', marks: { 'kaitify-attachment': true } })) {
        //锁定节点
        node.locked = true
        //设为行内
        node.type = 'inline'
        //处理子孙节点
        KNode.flat(node.children!).forEach(item => {
          //锁定节点
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
    formatRules: [
      ({ editor, node }) => {
        if (
          !node.isEmpty() &&
          node.isMatch({
            tag: 'span',
            marks: {
              'kaitify-attachment': true
            }
          })
        ) {
          //附件节点必须是锁定的
          node.locked = true
          //附件节点必须行内
          node.type = 'inline'
          //保持子孙节点的类型
          KNode.flat(node.children!).forEach(item => {
            //锁定节点
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
      //下载附件
      downloadAttachment(this)
    },
    addCommands() {
      /**
       * 获取光标所在的附件节点，如果光标不在一个附件节点内，返回null
       */
      const getAttachment = () => {
        return this.getMatchNodeBySelection({
          tag: 'span',
          marks: {
            'kaitify-attachment': true
          }
        })
      }

      /**
       * 判断光标范围内是否有附件节点
       */
      const hasAttachment = () => {
        return this.isSelectionNodesSomeMatch({
          tag: 'span',
          marks: {
            'kaitify-attachment': true
          }
        })
      }

      /**
       * 插入附件
       */
      const setAttachment = async (options: SetAttachmentOptionType) => {
        if (!this.selection.focused() || hasAttachment()) {
          return
        }
        if (!options.url || !options.text) {
          return
        }
        const defaultIconBase64 = `data:image/svg+xml;base64,${btoa(defaultIcon)}`
        //设置html内容
        const html = `<span kaitify-attachment="${options.url}" contenteditable="false" style="background-image:url(${options.icon || props?.icon || defaultIconBase64})"><span>${options.text}</span></span>`
        //html内容转为节点数组
        const nodes = this.htmlParseNode(html)
        //插入节点
        this.insertNode(nodes[0])
        //更新视图
        await this.updateView()
      }

      /**
       * 更新附件
       */
      const updateAttachment = async (options: UpdateAttachmentOptionType) => {
        if (!this.selection.focused()) {
          return
        }
        if (!options.url && !options.text && !options.icon) {
          return
        }
        const attachmentNode = getAttachment()
        if (!attachmentNode) {
          return
        }
        //更新url
        if (options.url) {
          attachmentNode.marks!['kaitify-attachment'] = options.url
        }
        //更新text
        if (options.text) {
          const textNode = KNode.create({
            type: 'text',
            textContent: options.text
          })
          textNode.parent = attachmentNode
          attachmentNode.children = [textNode]
        }
        if (options.icon) {
          attachmentNode.styles!['backgroundImage'] = `url(${options.icon})`
        }
        //更新视图
        await this.updateView()
      }

      /**
       * 获取附件信息
       */
      const getAttachmentInfo = () => {
        if (!this.selection.focused()) {
          return null
        }
        const attachmentNode = getAttachment()
        if (!attachmentNode) {
          return null
        }
        const url = attachmentNode.marks!['kaitify-attachment'] as string
        const text = attachmentNode.children!.reduce((val, item) => {
          return val + item.textContent
        }, '')
        const icon = attachmentNode.styles!['backgroundImage']!.match(/url\(["']?(.*?)["']?\)/)?.[1]!
        return { url, text, icon }
      }

      return {
        getAttachment,
        hasAttachment,
        setAttachment,
        updateAttachment,
        getAttachmentInfo
      }
    }
  })
