import { KNodeStylesType } from '@/model'
import { Extension } from '../Extension'

declare module '@/model' {
	interface EditorCommandsType {
		isFontSize?: (value: string) => boolean
		setFontSize?: (value: string) => Promise<void>
		unsetFontSize?: (value: string) => Promise<void>
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
		const isFontSize = (value: string) => {
			return this.commands.isTextStyle!('fontSize', value)
		}
		/**
		 * 设置字号
		 */
		const setFontSize = async (value: string) => {
			if (isFontSize(value)) {
				return
			}
			await this.commands.setTextStyle!({
				fontSize: value
			})
		}
		/**
		 * 取消字号
		 */
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
