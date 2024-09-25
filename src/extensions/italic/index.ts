import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		isItalic?: () => boolean
		setItalic?: () => void
		unsetItalic?: () => void
	}
}

export const ItalicExtension = Extension.create({
	name: 'Italic',
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
		const setItalic = () => {
			if (isItalic()) {
				return
			}
			this.commands.setTextStyle!({
				fontStyle: 'italic'
			})
		}
		/**
		 * 取消斜体
		 */
		const unsetItalic = () => {
			if (!isItalic()) {
				return
			}
			this.commands.removeTextStyle!(['fontStyle'])
		}

		return {
			isItalic,
			unsetItalic,
			setItalic
		}
	}
})
