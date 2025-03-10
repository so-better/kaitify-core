import { KNodeStylesType } from '@/model'
import { Extension } from '../Extension'

declare module '../../model' {
  interface EditorCommandsType {
    /**
     * 光标所在文本的背景颜色是否与入参一致
     */
    isBackColor?: (value: string) => boolean
    /**
     * 设置背景颜色
     */
    setBackColor?: (value: string) => Promise<void>
    /**
     * 取消背景颜色
     */
    unsetBackColor?: (value: string) => Promise<void>
  }
}

export const BackColorExtension = () =>
  Extension.create({
    name: 'backColor',
    pasteKeepStyles(node) {
      const styles: KNodeStylesType = {}
      if (node.isText() && node.hasStyles()) {
        if (node.styles!.hasOwnProperty('backgroundColor')) styles.backgroundColor = node.styles!.backgroundColor
      }
      return styles
    },
    addCommands() {
      const isBackColor = (value: string) => {
        return this.commands.isTextStyle!('backgroundColor', value) || this.commands.isTextStyle!('background', value)
      }

      const setBackColor = async (value: string) => {
        if (isBackColor(value)) {
          return
        }
        await this.commands.setTextStyle!({
          backgroundColor: value
        })
      }

      const unsetBackColor = async (value: string) => {
        if (!isBackColor(value)) {
          return
        }
        await this.commands.removeTextStyle!(['backgroundColor', 'background'])
      }

      return {
        isBackColor,
        setBackColor,
        unsetBackColor
      }
    }
  })
