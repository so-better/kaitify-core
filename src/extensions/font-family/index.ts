import { KNodeMarksType, KNodeStylesType } from '@/model'
import { splitNodeToNodes } from '@/model/config/function'
import { deleteProperty } from '@/tools'
import { Extension } from '../Extension'

declare module '../../model' {
  interface EditorCommandsType {
    isFontFamily?: (value: string) => boolean
    setFontFamily?: (value: string) => Promise<void>
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
      /**
       * 光标所在文本的字体是否与入参一致
       */
      const isFontFamily = (value: string) => {
        return this.commands.isTextStyle!('fontFamily', value)
      }
      /**
       * 设置字体
       */
      const setFontFamily = async (value: string) => {
        if (isFontFamily(value)) {
          return
        }
        await this.commands.setTextStyle!({
          fontFamily: value
        })
      }
      /**
       * 取消字体
       */
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
