import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		isBold?: () => boolean
		setBold?: () => void
		unsetBold?: () => void
	}
}

export const BoldExtension = Extension.create({
	name: 'Bold',
	addCommands() {
		/**
		 * 光标所在文本是否加粗
		 */
		const isBold = () => {
			return this.commands.isTextStyle!('font-weight', 'bold') || this.commands.isTextStyle!('font-weight', '700')
		}
		/**
		 * 加粗
		 */
		const setBold = () => {
			this.commands.setTextStyle!({
				'font-weight': 'bold'
			})
		}
		/**
		 * 取消加粗
		 */
		const unsetBold = () => {
			this.commands.removeTextStyle!(['font-weight'])
		}

		return {
			isBold,
			setBold,
			unsetBold
		}
	}
})
