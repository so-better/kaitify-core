import { KNodeStylesType } from '@/model'
import { splitNodeToNodes } from '@/model/config/function'
import { Extension } from '../Extension'

declare module '../../model' {
  interface EditorCommandsType {
    isBold?: () => boolean
    setBold?: () => Promise<void>
    unsetBold?: () => Promise<void>
  }
}

export const BoldExtension = () =>
  Extension.create({
    name: 'bold',
    extraKeepTags: ['b', 'strong'],
    domParseNodeCallback(node) {
      if (node.isMatch({ tag: 'b' }) || node.isMatch({ tag: 'strong' })) {
        node.type = 'inline'
      }
      return node
    },
    pasteKeepStyles(node) {
      const styles: KNodeStylesType = {}
      if (node.isText() && node.hasStyles()) {
        if (node.styles!.hasOwnProperty('fontWeight')) styles.fontWeight = node.styles!.fontWeight
      }
      return styles
    },
    formatRules: [
      ({ editor, node }) => {
        if (!node.isEmpty() && (node.isMatch({ tag: 'b' }) || node.isMatch({ tag: 'strong' }))) {
          const styles: KNodeStylesType = node.styles || {}
          node.styles = {
            ...styles,
            fontWeight: 'bold'
          }
          node.tag = editor.textRenderTag
          splitNodeToNodes.apply(editor, [node])
        }
      }
    ],
    addCommands() {
      /**
       * 光标所在文本是否加粗
       */
      const isBold = () => {
        return this.commands.isTextStyle!('fontWeight', 'bold') || this.commands.isTextStyle!('fontWeight', '700')
      }
      /**
       * 设置加粗
       */
      const setBold = async () => {
        if (isBold()) {
          return
        }
        await this.commands.setTextStyle!({
          fontWeight: 'bold'
        })
      }
      /**
       * 取消加粗
       */
      const unsetBold = async () => {
        if (!isBold()) {
          return
        }
        await this.commands.removeTextStyle!(['fontWeight'])
      }

      return {
        isBold,
        setBold,
        unsetBold
      }
    }
  })
