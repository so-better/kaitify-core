import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		isItalic?: () => boolean
		setItalic?: () => Promise<void>
		unsetItalic?: () => Promise<void>
	}
}

export const ItalicExtension = Extension.create({
	name: 'italic',
	addCommands() {
		/**
		 * 光标所在文本是否斜体
		 */
		const isItalic = () => {
			return this.commands.isTextStyle!('fontStyle', 'italic')
		}
		/**
		 * 设置斜体
		 */
		const setItalic = async () => {
			if (isItalic()) {
				return
			}
			await this.commands.setTextStyle!({
				fontStyle: 'italic'
			})
		}
		/**
		 * 取消斜体
		 */
		const unsetItalic = async () => {
			if (!isItalic()) {
				return
			}
			await this.commands.removeTextStyle!(['fontStyle'])
		}

		return {
			isItalic,
			setItalic,
			unsetItalic
		}
	}
})
