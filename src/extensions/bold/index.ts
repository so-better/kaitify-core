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
			return this.commands.isTextStyle!('fontWeight', 'bold') || this.commands.isTextStyle!('fontWeight', '700')
		}
		/**
		 * 设置加粗
		 */
		const setBold = () => {
			if (isBold()) {
				return
			}
			this.commands.setTextStyle!({
				fontWeight: 'bold'
			})
		}
		/**
		 * 取消加粗
		 */
		const unsetBold = () => {
			if (!isBold()) {
				return
			}
			this.commands.removeTextStyle!(['fontWeight'])
		}

		return {
			isBold,
			setBold,
			unsetBold
		}
	}
})
