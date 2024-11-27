import { KNodeStylesType } from '@/model'
import { splitNodeToNodes } from '@/model/config/function'
import { Extension } from '../Extension'

declare module '../../model' {
  interface EditorCommandsType {
    isItalic?: () => boolean
    setItalic?: () => Promise<void>
    unsetItalic?: () => Promise<void>
  }
}

export const ItalicExtension = () =>
  Extension.create({
    name: 'italic',
    pasteKeepStyles(node) {
      const styles: KNodeStylesType = {}
      if (node.isText() && node.hasStyles()) {
        if (node.styles!.hasOwnProperty('fontStyle')) styles.fontStyle = node.styles!.fontStyle
      }
      return styles
    },
    extraKeepTags: ['i'],
    domParseNodeCallback(node) {
      if (node.isMatch({ tag: 'i' })) {
        node.type = 'inline'
      }
      return node
    },
    formatRules: [
      ({ editor, node }) => {
        if (!node.isEmpty() && node.isMatch({ tag: 'i' })) {
          const styles: KNodeStylesType = node.styles || {}
          node.styles = {
            ...styles,
            fontStyle: 'italic'
          }
          node.tag = editor.textRenderTag
          splitNodeToNodes.apply(editor, [node])
        }
      }
    ],
    addCommands() {
      /**
       * 光标所在文本是否斜体
       */
      const isItalic = () => {
        return this.commands.isTextStyle!('fontStyle', 'italic')
      }
      /**
       * 设置斜体
       */
      const setItalic = async () => {
        if (isItalic()) {
          return
        }
        await this.commands.setTextStyle!({
          fontStyle: 'italic'
        })
      }
      /**
       * 取消斜体
       */
      const unsetItalic = async () => {
        if (!isItalic()) {
          return
        }
        await this.commands.removeTextStyle!(['fontStyle'])
      }

      return {
        isItalic,
        setItalic,
        unsetItalic
      }
    }
  })
