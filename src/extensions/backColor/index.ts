import { KNodeStylesType } from '@/model'
import { Extension } from '../Extension'

declare module '@/model' {
	interface EditorCommandsType {
		isBackColor?: (val: string) => boolean
		setBackColor?: (val: string) => Promise<void>
		unsetBackColor?: (val: string) => Promise<void>
	}
}

export const BackColorExtension = Extension.create({
	name: 'backColor',
	pasteKeepStyles(node) {
		const styles: KNodeStylesType = {}
		if (node.isText() && node.hasStyles()) {
			if (node.styles!.hasOwnProperty('backgroundColor')) styles.backgroundColor = node.styles!.backgroundColor
		}
		return styles
	},
	addCommands() {
		/**
		 * 光标所在文本的背景颜色是否与入参一致
		 */
		const isBackColor = (val: string) => {
			return this.commands.isTextStyle!('background-color', val) || this.commands.isTextStyle!('background', val)
		}
		/**
		 * 设置背景颜色
		 */
		const setBackColor = async (val: string) => {
			if (isBackColor(val)) {
				return
			}
			await this.commands.setTextStyle!({
				backgroundColor: val
			})
		}
		/**
		 * 取消背景颜色
		 */
		const unsetBackColor = async (val: string) => {
			if (!isBackColor(val)) {
				return
			}
			await this.commands.removeTextStyle!(['backgroundColor'])
		}

		return {
			isBackColor,
			setBackColor,
			unsetBackColor
		}
	}
})
