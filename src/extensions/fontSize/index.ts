import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		isActiveFontSize?: (val: string) => boolean
		setFontSize?: (val: string) => Promise<void>
		unsetFontSize?: (val: string) => Promise<void>
	}
}

export const FontSizeExtension = Extension.create({
	name: 'fontSize',
	addCommands() {
		/**
		 * 光标所在文本的字号大小是否与入参一致
		 */
		const isActiveFontSize = (val: string) => {
			return this.commands.isTextStyle!('fontSize', val)
		}
		/**
		 * 设置字号
		 */
		const setFontSize = async (val: string) => {
			if (isActiveFontSize(val)) {
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
			if (!isActiveFontSize(val)) {
				return
			}
			await this.commands.removeTextStyle!(['fontSize'])
		}

		return {
			isActiveFontSize,
			setFontSize,
			unsetFontSize
		}
	}
})
