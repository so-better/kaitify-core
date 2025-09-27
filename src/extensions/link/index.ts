import { KNode, KNodeMarksType } from '@/model'
import { splitNodeToNodes } from '@/model/config/function'
import { Extension } from '../Extension'
import './style.less'
import { deleteProperty } from '@/tools'

/**
 * 插入链接方法入参类型
 */
export type SetLinkOptionType = {
  href: string
  text?: string
  newOpen?: boolean
}

/**
 * 更新链接方法入参类型
 */
export type UpdateLinkOptionType = {
  href?: string
  newOpen?: boolean
}

declare module '../../model' {
  interface EditorCommandsType {
    /**
     * 获取光标所在的链接，如果光标不在一个链接内，返回null
     */
    getLink?: () => KNode | null
    /**
     * 判断光标范围内是否有链接
     */
    hasLink?: () => boolean
    /**
     * 设置连接
     */
    setLink?: (options: SetLinkOptionType) => Promise<void>
    /**
     * 更新链接
     */
    updateLink?: (options: UpdateLinkOptionType) => Promise<void>
    /**
     * 取消链接
     */
    unsetLink?: () => Promise<void>
  }
}

export const LinkExtension = () =>
  Extension.create({
    name: 'link',
    extraKeepTags: ['a'],
    onDomParseNode(node) {
      if (node.isMatch({ tag: 'a' })) {
        node.type = 'inline'
      }
      return node
    },
    onPasteKeepMarks(node) {
      const marks: KNodeMarksType = {}
      if (node.isMatch({ tag: 'a' }) && node.hasMarks()) {
        if (node.marks!.hasOwnProperty('href')) marks['href'] = node.marks!['href']
        if (node.marks!.hasOwnProperty('target')) marks['target'] = node.marks!['target']
      }
      return marks
    },
    formatRules: [
      ({ editor, node }) => {
        //链接只能是行内节点且只能有文本节点和闭合节点
        if (node.isMatch({ tag: 'a' }) && node.hasChildren()) {
          node.type = 'inline'
          node.children!.forEach(item => {
            splitNodeToNodes.apply(editor, [item])
          })
        }
      }
    ],
    addCommands() {
      const getLink = () => {
        return this.getMatchNodeBySelection({ tag: 'a' })
      }

      const hasLink = () => {
        return this.isSelectionNodesSomeMatch({
          tag: 'a'
        })
      }

      const setLink = async (options: SetLinkOptionType) => {
        if (!this.selection.focused() || hasLink()) {
          return
        }
        if (!options.href) {
          return
        }
        //起点和终点在一起
        if (this.selection.collapsed()) {
          if (!options.text) {
            return
          }
          const marks: KNodeMarksType = {
            href: options.href
          }
          if (options.newOpen) {
            marks.target = '_blank'
          }
          const linkNode = KNode.create({
            type: 'inline',
            tag: 'a',
            marks,
            children: [
              {
                type: 'text',
                textContent: options.text
              }
            ]
          })
          this.insertNode(linkNode)
        }
        //起点和终点不在一起
        else {
          const marks: KNodeMarksType = {
            href: options.href
          }
          if (options.newOpen) {
            marks.target = '_blank'
          }
          const linkNode = KNode.create({
            type: 'inline',
            tag: 'a',
            marks,
            children: []
          })
          this.getFocusSplitNodesBySelection('all').forEach((item, index) => {
            const newNode = item.clone(true)
            this.addNode(newNode, linkNode, index)
          })
          this.insertNode(linkNode)
        }
        await this.updateView()
      }

      const updateLink = async (options: UpdateLinkOptionType) => {
        if (!this.selection.focused()) {
          return
        }
        if (!options.href && typeof options.newOpen != 'boolean') {
          return
        }
        const linkNode = getLink()
        if (!linkNode) {
          return
        }
        if (options.href) {
          linkNode.marks!.href = options.href
        }
        if (typeof options.newOpen == 'boolean') {
          if (options.newOpen) {
            linkNode.marks!.target = '_blank'
          } else {
            linkNode.marks = deleteProperty(linkNode.marks!, 'target')
          }
        }
        await this.updateView()
      }

      const unsetLink = async () => {
        if (!this.selection.focused()) {
          return
        }
        const linkNode = getLink()
        if (!linkNode) {
          return
        }
        linkNode.children!.forEach(item => {
          this.addNodeBefore(item, linkNode)
        })
        linkNode.children = []
        await this.updateView()
      }

      return { getLink, hasLink, setLink, updateLink, unsetLink }
    }
  })
