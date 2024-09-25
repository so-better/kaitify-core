import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		isSubscript?: () => boolean
		setSubscript?: () => Promise<void>
		unsetSubscript?: () => Promise<void>
	}
}

export const SubscriptExtension = Extension.create({
	name: 'subscript',
	addCommands() {
		/**
		 * 光标所在文本是否下标
		 */
		const isSubscript = () => {
			return this.commands.isTextStyle!('verticalAlign', 'sub')
		}
		/**
		 * 设置下标
		 */
		const setSubscript = async () => {
			if (isSubscript()) {
				return
			}
			await this.commands.setTextStyle!({
				verticalAlign: 'sub'
			})
		}
		/**
		 * 取消下标
		 */
		const unsetSubscript = async () => {
			if (!isSubscript()) {
				return
			}
			await this.commands.removeTextStyle!(['verticalAlign'])
		}

		return {
			isSubscript,
			setSubscript,
			unsetSubscript
		}
	}
})
