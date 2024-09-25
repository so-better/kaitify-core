import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		isBold?: () => boolean
		setBold?: () => Promise<void>
		unsetBold?: () => Promise<void>
	}
}

export const BoldExtension = Extension.create({
	name: 'bold',
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
		const setBold = async () => {
			if (isBold()) {
				return
			}
			await this.commands.setTextStyle!({
				fontWeight: 'bold'
			})
		}
		/**
		 * 取消加粗
		 */
		const unsetBold = async () => {
			if (!isBold()) {
				return
			}
			await this.commands.removeTextStyle!(['fontWeight'])
		}

		return {
			isBold,
			setBold,
			unsetBold
		}
	}
})
