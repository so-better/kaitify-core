import { KNodeStylesType } from '@/model'
import { getSelectionBlockNodes } from '@/model/config/function'
import { isOnlyTab, isTabWithShift } from '@/tools'
import { Extension } from '../Extension'

declare module '../../model' {
  interface EditorCommandsType {
    /**
     * 是否可以使用缩进
     */
    canUseIndent?: () => boolean
    /**
     * 增加缩进
     */
    setIncreaseIndent?: () => Promise<void>
    /**
     * 减少缩进
     */
    setDecreaseIndent?: () => Promise<void>
  }
}

export const IndentExtension = () =>
  Extension.create({
    name: 'indent',
    onPasteKeepStyles(node) {
      const styles: KNodeStylesType = {}
      if (node.isBlock() && node.hasStyles()) {
        if (node.styles!.hasOwnProperty('textIndent')) styles.textIndent = node.styles!.textIndent
      }
      return styles
    },
    onKeydown(event) {
      if (isOnlyTab(event) && this.commands.canUseIndent?.()) {
        event.preventDefault()
        this.commands.setIncreaseIndent?.()
      }
      if (isTabWithShift(event) && this.commands.canUseIndent?.()) {
        event.preventDefault()
        this.commands.setDecreaseIndent?.()
      }
    },
    addCommands() {
      const canUseIndent = () => {
        //光标范围内有代码块则不能使用缩进
        if (this.commands.hasCodeBlock?.()) {
          return false
        }
        //光标范围内可以生成内嵌列表则不能使用缩进
        if (!!this.commands.canCreateInnerList?.()) {
          return false
        }
        return true
      }

      const setIncreaseIndent = async () => {
        //起点和终点在一起
        if (this.selection.collapsed()) {
          const blockNode = this.selection.start!.node.getBlock()
          const styles: KNodeStylesType = blockNode.hasStyles() ? blockNode.styles! : {}
          let oldVal = 0
          if (styles.textIndent && typeof styles.textIndent == 'string' && styles.textIndent.endsWith('em')) {
            oldVal = parseFloat(styles.textIndent)
          }
          blockNode.styles = {
            ...styles,
            textIndent: `${oldVal + 2}em`
          }
        }
        //起点和终点不在一起
        else {
          const blockNodes = getSelectionBlockNodes.apply(this)
          blockNodes.forEach(item => {
            const styles: KNodeStylesType = item.hasStyles() ? item.styles! : {}
            let oldVal = 0
            if (styles.textIndent && typeof styles.textIndent == 'string' && styles.textIndent.endsWith('em')) {
              oldVal = parseFloat(styles.textIndent)
            }
            item.styles = {
              ...styles,
              textIndent: `${oldVal + 2}em`
            }
          })
        }
        await this.updateView()
      }

      const setDecreaseIndent = async () => {
        //起点和终点在一起
        if (this.selection.collapsed()) {
          const blockNode = this.selection.start!.node.getBlock()
          const styles: KNodeStylesType = blockNode.hasStyles() ? blockNode.styles! : {}
          let oldVal = 0
          if (styles.textIndent && typeof styles.textIndent == 'string' && styles.textIndent.endsWith('em')) {
            oldVal = parseFloat(styles.textIndent)
          }
          blockNode.styles = {
            ...styles,
            textIndent: `${oldVal - 2 > 0 ? oldVal - 2 : 0}em`
          }
        }
        //起点和终点不在一起
        else {
          const blockNodes = getSelectionBlockNodes.apply(this)
          blockNodes.forEach(item => {
            const styles: KNodeStylesType = item.hasStyles() ? item.styles! : {}
            let oldVal = 0
            if (styles.textIndent && typeof styles.textIndent == 'string' && styles.textIndent.endsWith('em')) {
              oldVal = parseFloat(styles.textIndent)
            }
            item.styles = {
              ...styles,
              textIndent: `${oldVal - 2 > 0 ? oldVal - 2 : 0}em`
            }
          })
        }
        await this.updateView()
      }

      return {
        canUseIndent,
        setDecreaseIndent,
        setIncreaseIndent
      }
    }
  })
