import { KNodeStylesType } from '@/model'
import { splitNodeToNodes } from '@/model/config/function'
import { Extension } from '../Extension'

declare module '../../model' {
  interface EditorCommandsType {
    /**
     * 光标所在文本是否下标
     */
    isSubscript?: () => boolean
    /**
     * 设置下标
     */
    setSubscript?: () => Promise<void>
    /**
     * 取消下标
     */
    unsetSubscript?: () => Promise<void>
  }
}

export const SubscriptExtension = () =>
  Extension.create({
    name: 'subscript',
    pasteKeepStyles(node) {
      const styles: KNodeStylesType = {}
      if (node.isText() && node.hasStyles()) {
        if (node.styles!.hasOwnProperty('verticalAlign')) styles.verticalAlign = node.styles!.verticalAlign
      }
      return styles
    },
    extraKeepTags: ['sub'],
    domParseNodeCallback(node) {
      if (node.isMatch({ tag: 'sub' })) {
        node.type = 'inline'
      }
      return node
    },
    formatRules: [
      ({ editor, node }) => {
        if (!node.isEmpty() && node.isMatch({ tag: 'sub' })) {
          const styles: KNodeStylesType = node.styles || {}
          node.styles = {
            ...styles,
            verticalAlign: 'sub'
          }
          node.tag = editor.textRenderTag
          splitNodeToNodes.apply(editor, [node])
        }
      }
    ],
    addCommands() {
      const isSubscript = () => {
        return this.commands.isTextStyle!('verticalAlign', 'sub')
      }

      const setSubscript = async () => {
        if (isSubscript()) {
          return
        }
        await this.commands.setTextStyle!({
          verticalAlign: 'sub'
        })
      }

      const unsetSubscript = async () => {
        if (!isSubscript()) {
          return
        }
        await this.commands.removeTextStyle!(['verticalAlign'])
      }

      return {
        isSubscript,
        setSubscript,
        unsetSubscript
      }
    }
  })
