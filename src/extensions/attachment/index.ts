import { KNode, KNodeMarksType } from '@/model'
import { Extension } from '../Extension'
import './element'
import defaultIcon from './icon.svg?raw'
import './style.less'

/**
 * 设置附件的参数类型
 */
export type SetAttachmentOptionType = {
  url: string
  text: string
  icon?: string
}

/**
 * 更新附件的参数类型
 */
export type UpdateAttachmentOptionType = {
  url?: string
  text?: string
  icon?: string
}

/**
 * 附件扩展入参类型
 */
export type AttachmentExtensionPropsType = {
  icon: string
}

declare module '../../model' {
  interface EditorCommandsType {
    /**
     * 获取光标所在的附件节点
     */
    getAttachment?: () => KNode | null
    /**
     * 判断光标范围内是否有附件节点
     */
    hasAttachment?: () => boolean
    /**
     * 插入附件
     */
    setAttachment?: (options: SetAttachmentOptionType) => Promise<void>
    /**
     * 更新附件
     */
    updateAttachment?: (options: UpdateAttachmentOptionType) => Promise<void>
    /**
     * 获取附件信息
     */
    getAttachmentInfo?: () => { url: string; text: string; icon: string } | null
  }
}

/**
 * 默认的附件图标地址
 */
const DEFAULT_ICON_URL = `data:image/svg+xml;base64,${btoa(defaultIcon)}`

export const AttachmentExtension = (props?: AttachmentExtensionPropsType) =>
  Extension.create({
    name: 'attachment',
    extraKeepTags: ['kaitify-attachment'],
    onPasteKeepMarks(node) {
      const marks: KNodeMarksType = {}
      if (node.isMatch({ tag: 'kaitify-attachment' }) && node.hasMarks()) {
        marks['data-url'] = node.marks!['data-url']
        marks['data-text'] = node.marks!['data-text']
        marks['data-icon'] = node.marks!['data-icon']
      }
      return marks
    },
    onDomParseNode(node) {
      // 必须是闭合节点
      if (node.isMatch({ tag: 'kaitify-attachment' })) {
        node.type = 'closed'
        node.children = undefined
      }
      // 兼容老格式：<span kaitify-attachment="url" contenteditable="false"><span>filename</span></span>
      if (node.isMatch({ tag: 'span', marks: { 'kaitify-attachment': true } })) {
        const url = node.marks!['kaitify-attachment'] as string
        // 从子节点提取文件名
        const text = KNode.flat(node.children ?? [])
          .filter(n => n.isText())
          .map(n => n.textContent)
          .join('')
        const icon = node.styles?.backgroundImage?.match(/url\(["']?(.*?)["']?\)/)?.[1]!
        // 改造成新的闭合节点格式
        node.type = 'closed'
        node.tag = 'kaitify-attachment'
        node.children = undefined
        node.marks = { 'data-url': url, 'data-text': text, 'data-icon': icon }
        node.styles = {}
      }
      return node
    },
    formatRules: [
      ({ node }) => {
        if (
          node.isMatch({
            tag: 'kaitify-attachment'
          })
        ) {
          //必须是闭合节点
          node.type = 'closed'
        }
      }
    ],
    addCommands() {
      const getAttachment = () => {
        if (!this.selection.focused() || this.selection.collapsed()) {
          return null
        }
        const startNode = this.selection.start!.node
        const endNode = this.selection.end!.node
        const startOffset = this.selection.start!.offset
        const endOffset = this.selection.end!.offset
        if (startNode.isEqual(endNode) && startNode.isMatch({ tag: 'kaitify-attachment' }) && startOffset == 0 && endOffset == 1) {
          return startNode
        }
        return null
      }

      const hasAttachment = () => {
        if (!this.selection.focused() || this.selection.collapsed()) {
          return false
        }
        const startNode = this.selection.start!.node
        const endNode = this.selection.end!.node
        const startOffset = this.selection.start!.offset
        const endOffset = this.selection.end!.offset
        // 起点从附件头部开始
        if (startNode.isMatch({ tag: 'kaitify-attachment' }) && startOffset === 0) {
          return true
        }
        // 终点到附件尾部结束
        if (endNode.isMatch({ tag: 'kaitify-attachment' }) && endOffset === 1) {
          return true
        }
        // 选区中间完整包含的附件（排除边界节点）
        return this.getFocusNodesBySelection('all')
          .filter(n => !n.isEqual(startNode) && !n.isEqual(endNode))
          .some(n => n.isMatch({ tag: 'kaitify-attachment' }))
      }

      const setAttachment = async (options: SetAttachmentOptionType) => {
        if (!this.selection.focused() || hasAttachment()) {
          return
        }
        if (!options.url || !options.text) {
          return
        }
        const node = KNode.create({
          type: 'closed',
          tag: 'kaitify-attachment',
          marks: {
            'data-url': options.url,
            'data-text': options.text,
            'data-icon': options.icon || props?.icon || DEFAULT_ICON_URL
          }
        })
        //插入节点
        this.insertNode(node)
        //更新视图
        await this.updateView()
      }

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
          attachmentNode.marks!['data-url'] = options.url
        }
        //更新text
        if (options.text) {
          attachmentNode.marks!['data-text'] = options.text
        }
        //更新icon
        if (options.icon) {
          attachmentNode.marks!['data-icon'] = options.icon
        }
        //更新视图
        await this.updateView()
      }

      const getAttachmentInfo = () => {
        if (!this.selection.focused()) {
          return null
        }
        const attachmentNode = getAttachment()
        if (!attachmentNode) {
          return null
        }
        const url = attachmentNode.marks!['data-url'] as string
        const text = attachmentNode.marks!['data-text'] as string
        const icon = attachmentNode.marks!['data-icon'] as string
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
