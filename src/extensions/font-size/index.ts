import { KNodeStylesType } from '@/model'
import { Extension } from '../Extension'

declare module '../../model' {
  interface EditorCommandsType {
    /**
     * 光标所在文本的字号大小是否与入参一致
     */
    isFontSize?: (value: string) => boolean
    /**
     * 设置字号
     */
    setFontSize?: (value: string) => Promise<void>
    /**
     * 取消字号
     */
    unsetFontSize?: (value: string) => Promise<void>
  }
}

export const FontSizeExtension = () =>
  Extension.create({
    name: 'fontSize',
    pasteKeepStyles(node) {
      const styles: KNodeStylesType = {}
      if (node.isText() && node.hasStyles()) {
        if (node.styles!.hasOwnProperty('fontSize')) styles.fontSize = node.styles!.fontSize
      }
      return styles
    },
    addCommands() {
      const isFontSize = (value: string) => {
        return this.commands.isTextStyle!('fontSize', value)
      }

      const setFontSize = async (value: string) => {
        if (isFontSize(value)) {
          return
        }
        await this.commands.setTextStyle!({
          fontSize: value
        })
      }

      const unsetFontSize = async (value: string) => {
        if (!isFontSize(value)) {
          return
        }
        await this.commands.removeTextStyle!(['fontSize'])
      }

      return {
        isFontSize,
        setFontSize,
        unsetFontSize
      }
    }
  })
