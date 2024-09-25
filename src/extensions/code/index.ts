import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		isCode?: () => boolean
		setCode?: () => Promise<void>
		unsetCode?: () => Promise<void>
	}
}

export const CodeExtension = Extension.create({
	name: 'code',
	addCommands() {
		/**
		 * 光标所在文本是否在行内代码内
		 */
		const isCode = () => {
			if (!this.selection.focused()) {
				return false
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
			}
			return false
		}
		/**
		 * 设置代码
		 */
		const setCode = async () => {
			if (isCode()) {
				return
			}
		}
		/**
		 * 取消代码
		 */
		const unsetCode = async () => {
			if (!isCode()) {
				return
			}
		}

		return {
			isCode,
			setCode,
			unsetCode
		}
	}
})
