import { KNodeMarksType, KNodeStylesType } from '@/model'
import { splitNodeToNodes } from '@/model/config/function'
import { deleteProperty } from '@/tools'
import { Extension } from '../Extension'

declare module '../../model' {
  interface EditorCommandsType {
    /**
     * 光标所在文本的字体是否与入参一致
     */
    isFontFamily?: (value: string) => boolean
    /**
     * 设置字体
     */
    setFontFamily?: (value: string) => Promise<void>
    /**
     * 取消字体
     */
    unsetFontFamily?: (value: string) => Promise<void>
  }
}

export const FontFamilyExtension = () =>
  Extension.create({
    name: 'fontFamily',
    pasteKeepStyles(node) {
      const styles: KNodeStylesType = {}
      if (node.isText() && node.hasStyles()) {
        if (node.styles!.hasOwnProperty('fontFamily')) styles.fontFamily = node.styles!.fontFamily
      }
      return styles
    },
    extraKeepTags: ['font'],
    domParseNodeCallback(node) {
      if (node.isMatch({ tag: 'font' })) {
        node.type = 'inline'
      }
      return node
    },
    formatRules: [
      ({ editor, node }) => {
        if (!node.isEmpty() && node.isMatch({ tag: 'font' })) {
          const marks: KNodeMarksType = node.marks || {}
          const styles: KNodeStylesType = node.styles || {}
          node.styles = {
            ...styles,
            fontFamily: (marks.face as string) || ''
          }
          node.marks = deleteProperty(marks, 'face')
          node.tag = editor.textRenderTag
          splitNodeToNodes.apply(editor, [node])
        }
      }
    ],
    addCommands() {
      const isFontFamily = (value: string) => {
        return this.commands.isTextStyle!('fontFamily', value)
      }

      const setFontFamily = async (value: string) => {
        if (isFontFamily(value)) {
          return
        }
        await this.commands.setTextStyle!({
          fontFamily: value
        })
      }

      const unsetFontFamily = async (value: string) => {
        if (!isFontFamily(value)) {
          return
        }
        await this.commands.removeTextStyle!(['fontFamily'])
      }

      return {
        isFontFamily,
        setFontFamily,
        unsetFontFamily
      }
    }
  })
