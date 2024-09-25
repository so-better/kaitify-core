import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		isStrikethrough?: () => boolean
		setStrikethrough?: () => Promise<void>
		unsetStrikethrough?: () => Promise<void>
	}
}

export const StrikethroughExtension = Extension.create({
	name: 'strikethrough',
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
		const setStrikethrough = async () => {
			if (isStrikethrough()) {
				return
			}
			await this.commands.setTextStyle!({
				textDecorationLine: 'line-through'
			})
		}
		/**
		 * 取消删除线
		 */
		const unsetStrikethrough = async () => {
			if (!isStrikethrough()) {
				return
			}
			await this.commands.removeTextStyle!(['textDecoration', 'textDecorationLine'])
		}

		return {
			isStrikethrough,
			setStrikethrough,
			unsetStrikethrough
		}
	}
})
