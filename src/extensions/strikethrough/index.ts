import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		isStrikethrough?: () => boolean
		setStrikethrough?: () => void
		unsetStrikethrough?: () => void
	}
}

export const StrikethroughExtension = Extension.create({
	name: 'Strikethrough',
	addCommands() {
		/**
		 * 光标所在文本是否删除线
		 */
		const isStrikethrough = () => {
			return this.commands.isTextStyle!('textDecoration', 'line-through') || this.commands.isTextStyle!('textDecorationLine', 'line-through')
		}
		/**
		 * 设置删除线
		 */
		const setStrikethrough = () => {
			if (isStrikethrough()) {
				return
			}
			this.commands.setTextStyle!({
				textDecorationLine: 'line-through'
			})
		}
		/**
		 * 取消删除线
		 */
		const unsetStrikethrough = () => {
			if (!isStrikethrough()) {
				return
			}
			this.commands.removeTextStyle!(['textDecorationLine'])
		}

		return {
			isStrikethrough,
			unsetStrikethrough,
			setStrikethrough
		}
	}
})
