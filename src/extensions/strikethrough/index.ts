import { KNodeStylesType } from '@/model'
import { splitNodeToNodes } from '@/model/config/function'
import { Extension } from '../Extension'

declare module '../../model' {
  interface EditorCommandsType {
    /**
     * 光标所在文本是否删除线
     */
    isStrikethrough?: () => boolean
    /**
     * 设置删除线
     */
    setStrikethrough?: () => Promise<void>
    /**
     * 取消删除线
     */
    unsetStrikethrough?: () => Promise<void>
  }
}

export const StrikethroughExtension = () =>
  Extension.create({
    name: 'strikethrough',
    pasteKeepStyles(node) {
      const styles: KNodeStylesType = {}
      if (node.isText() && node.hasStyles()) {
        if (node.styles!.hasOwnProperty('textDecoration')) styles.textDecoration = node.styles!.textDecoration
        if (node.styles!.hasOwnProperty('textDecorationLine')) styles.textDecorationLine = node.styles!.textDecorationLine
      }
      return styles
    },
    extraKeepTags: ['del'],
    domParseNodeCallback(node) {
      if (node.isMatch({ tag: 'del' })) {
        node.type = 'inline'
      }
      return node
    },
    formatRules: [
      ({ editor, node }) => {
        if (!node.isEmpty() && node.isMatch({ tag: 'del' })) {
          const styles: KNodeStylesType = node.styles || {}
          node.styles = {
            ...styles,
            textDecorationLine: 'line-through'
          }
          node.tag = editor.textRenderTag
          splitNodeToNodes.apply(editor, [node])
        }
      }
    ],
    addCommands() {
      const isStrikethrough = () => {
        return this.commands.isTextStyle!('textDecoration', 'line-through') || this.commands.isTextStyle!('textDecorationLine', 'line-through')
      }

      const setStrikethrough = async () => {
        if (isStrikethrough()) {
          return
        }
        await this.commands.setTextStyle!({
          textDecorationLine: 'line-through'
        })
      }

      const unsetStrikethrough = async () => {
        if (!isStrikethrough()) {
          return
        }
        await this.commands.removeTextStyle!(['textDecoration', 'textDecorationLine'])
      }

      return {
        isStrikethrough,
        setStrikethrough,
        unsetStrikethrough
      }
    }
  })
