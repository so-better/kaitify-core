import { event as DapEvent } from 'dap-util'
import { Editor, KNode, KNodeMarksType } from '@/model'
import { Extension } from '../Extension'
import { ATTACHMENT_NODE_TAG } from './element'
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

/**
 * 点击事件
 */
const handleClick = (editor: Editor) => {
  DapEvent.off(editor.$el!, 'click.attachment')
  DapEvent.on(editor.$el!, 'click.attachment', async e => {
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
    const matchNode = node.getMatchNode({
      tag: ATTACHMENT_NODE_TAG
    })
    //节点不存在
    if (!matchNode) {
      return
    }
    //设置光标到节点两侧
    editor.setSelectionBefore(matchNode, 'start')
    editor.setSelectionAfter(matchNode, 'end')
    editor.updateRealSelection()
    //不可编辑状态下，进行下载操作
    if (!editor.isEditable()) {
      const url = matchNode.marks!['data-url'] as string
      const text = matchNode.marks!['data-text'] as string
      //使用fetch读取文件地址
      const res = await fetch(url, { method: 'GET' })
      //获取blob数据
      const blob = await res.blob()
      //创建a标签进行下载
      const a = document.createElement('a')
      a.setAttribute('target', '_blank')
      a.setAttribute('href', URL.createObjectURL(blob))
      a.setAttribute('download', text)
      a.click()
    }
  })
}

/**
 * 选择样式设置
 */
const handleSelected = (editor: Editor) => {
  // 先清除所有附件的选中状态
  editor.$el!.querySelectorAll(`${ATTACHMENT_NODE_TAG} > span`).forEach(el => {
    el.removeAttribute('is-selected')
  })
  if (!editor.selection.focused()) return
  const flag = editor.commands.hasAttachment?.()
  if (flag) {
    const doms = editor
      .getFocusNodesBySelection('closed')
      .filter(item => item.isMatch({ tag: ATTACHMENT_NODE_TAG }))
      .map(item => editor.findDom(item))
    doms.forEach(dom => dom.querySelector('span')?.setAttribute('is-selected', ''))
  }
}

export const AttachmentExtension = (props?: AttachmentExtensionPropsType) =>
  Extension.create({
    name: 'attachment',
    extraKeepTags: [ATTACHMENT_NODE_TAG],
    onPasteKeepMarks(node) {
      const marks: KNodeMarksType = {}
      if (node.isMatch({ tag: ATTACHMENT_NODE_TAG }) && node.hasMarks()) {
        if (node.marks!.hasOwnProperty('data-url')) marks['data-url'] = node.marks!['data-url']
        if (node.marks!.hasOwnProperty('data-text')) marks['data-text'] = node.marks!['data-text']
        if (node.marks!.hasOwnProperty('data-icon')) marks['data-icon'] = node.marks!['data-icon']
      }
      return marks
    },
    onDomParseNode(node) {
      // 必须是闭合节点
      if (node.isMatch({ tag: ATTACHMENT_NODE_TAG })) {
        node.type = 'closed'
        node.children = undefined
      }
      // 兼容老格式：<span kaitify-attachment="url" contenteditable="false"><span>filename</span></span>
      if (node.isMatch({ tag: 'span', marks: { [ATTACHMENT_NODE_TAG]: true } })) {
        const url = node.marks![ATTACHMENT_NODE_TAG] as string
        // 从子节点提取文件名
        const text = KNode.flat(node.children ?? [])
          .filter(n => n.isText())
          .map(n => n.textContent)
          .join('')
        const icon = node.styles?.backgroundImage?.match(/url\(["']?(.*?)["']?\)/)?.[1]!
        // 改造成新的闭合节点格式
        node.type = 'closed'
        node.tag = ATTACHMENT_NODE_TAG
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
            tag: ATTACHMENT_NODE_TAG
          })
        ) {
          //必须是闭合节点
          node.type = 'closed'
          node.children = undefined
        }
      }
    ],
    onAfterUpdateView() {
      handleClick(this)
    },
    onSelectionUpdate() {
      handleSelected(this)
    },
    addCommands() {
      const getAttachment = () => {
        return this.getClosedNodeBySelection({ tag: ATTACHMENT_NODE_TAG })
      }

      const hasAttachment = () => {
        return this.hasClosedNodeBySelection({ tag: ATTACHMENT_NODE_TAG })
      }

      const setAttachment = async (options: SetAttachmentOptionType) => {
        if (!this.selection.focused()) {
          return
        }
        if (!options.url || !options.text) {
          return
        }
        const node = KNode.create({
          type: 'closed',
          tag: ATTACHMENT_NODE_TAG,
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
        const node = getAttachment()
        if (!node) {
          return
        }
        //更新url
        if (options.url) {
          node.marks!['data-url'] = options.url
        }
        //更新text
        if (options.text) {
          node.marks!['data-text'] = options.text
        }
        //更新icon
        if (options.icon) {
          node.marks!['data-icon'] = options.icon
        }
        //更新视图
        await this.updateView()
      }

      const getAttachmentInfo = () => {
        if (!this.selection.focused()) {
          return null
        }
        const node = getAttachment()
        if (!node) {
          return null
        }
        const url = node.marks!['data-url'] as string
        const text = node.marks!['data-text'] as string
        const icon = node.marks!['data-icon'] as string
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
