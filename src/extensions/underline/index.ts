import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		isUnderline?: () => boolean
		setUnderline?: () => Promise<void>
		unsetUnderline?: () => Promise<void>
	}
}

export const UnderlineExtension = Extension.create({
	name: 'underline',
	addCommands() {
		/**
		 * 光标所在文本是否下划线
		 */
		const isUnderline = () => {
			return this.commands.isTextStyle!('textDecoration', 'underline') || this.commands.isTextStyle!('textDecorationLine', 'underline')
		}
		/**
		 * 设置下划线
		 */
		const setUnderline = async () => {
			if (isUnderline()) {
				return
			}
			await this.commands.setTextStyle!({
				textDecorationLine: 'underline'
			})
		}
		/**
		 * 取消下划线
		 */
		const unsetUnderline = async () => {
			if (!isUnderline()) {
				return
			}
			await this.commands.removeTextStyle!(['textDecoration', 'textDecorationLine'])
		}

		return {
			isUnderline,
			setUnderline,
			unsetUnderline
		}
	}
})
