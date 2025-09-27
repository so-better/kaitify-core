import { KNodeStylesType } from '@/model'
import { splitNodeToNodes } from '@/model/config/function'
import { Extension } from '../Extension'

declare module '../../model' {
  interface EditorCommandsType {
    /**
     * 光标所在文本是否上标
     */
    isSuperscript?: () => boolean
    /**
     * 设置上标
     */
    setSuperscript?: () => Promise<void>
    /**
     * 取消上标
     */
    unsetSuperscript?: () => Promise<void>
  }
}

export const SuperscriptExtension = () =>
  Extension.create({
    name: 'superscript',
    onPasteKeepStyles(node) {
      const styles: KNodeStylesType = {}
      if (node.isText() && node.hasStyles()) {
        if (node.styles!.hasOwnProperty('verticalAlign')) styles.verticalAlign = node.styles!.verticalAlign
      }
      return styles
    },
    extraKeepTags: ['sup'],
    onDomParseNode(node) {
      if (node.isMatch({ tag: 'sup' })) {
        node.type = 'inline'
      }
      return node
    },
    formatRules: [
      ({ editor, node }) => {
        if (!node.isEmpty() && node.isMatch({ tag: 'sup' })) {
          const styles: KNodeStylesType = node.styles || {}
          node.styles = {
            ...styles,
            verticalAlign: 'super'
          }
          node.tag = editor.textRenderTag
          splitNodeToNodes.apply(editor, [node])
        }
      }
    ],
    addCommands() {
      const isSuperscript = () => {
        return this.commands.isTextStyle!('verticalAlign', 'super')
      }

      const setSuperscript = async () => {
        if (isSuperscript()) {
          return
        }
        await this.commands.setTextStyle!({
          verticalAlign: 'super'
        })
      }

      const unsetSuperscript = async () => {
        if (!isSuperscript()) {
          return
        }
        await this.commands.removeTextStyle!(['verticalAlign'])
      }

      return {
        isSuperscript,
        setSuperscript,
        unsetSuperscript
      }
    }
  })
