import { KNodeStylesType } from '@/model'
import { Extension } from '../Extension'

declare module '@/model' {
	interface EditorCommandsType {
		isFontSize?: (val: string) => boolean
		setFontSize?: (val: string) => Promise<void>
		unsetFontSize?: (val: string) => Promise<void>
	}
}

export const FontSizeExtension = Extension.create({
	name: 'fontSize',
	pasteKeepStyles(node) {
		const styles: KNodeStylesType = {}
		if (node.isText() && node.hasStyles()) {
			if (node.styles!.hasOwnProperty('fontSize')) styles.fontSize = node.styles!.fontSize
		}
		return styles
	},
	addCommands() {
		/**
		 * 光标所在文本的字号大小是否与入参一致
		 */
		const isFontSize = (val: string) => {
			return this.commands.isTextStyle!('fontSize', val)
		}
		/**
		 * 设置字号
		 */
		const setFontSize = async (val: string) => {
			if (isFontSize(val)) {
				return
			}
			await this.commands.setTextStyle!({
				fontSize: val
			})
		}
		/**
		 * 取消字号
		 */
		const unsetFontSize = async (val: string) => {
			if (!isFontSize(val)) {
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
