import { KNodeStylesType } from '@/model'
import { Extension } from '../Extension'

declare module '@/model' {
	interface EditorCommandsType {
		isColor?: (val: string) => boolean
		setColor?: (val: string) => Promise<void>
		unsetColor?: (val: string) => Promise<void>
	}
}

export const ColorExtension = Extension.create({
	name: 'color',
	pasteKeepStyles(node) {
		const styles: KNodeStylesType = {}
		if (node.isText() && node.hasStyles()) {
			if (node.styles!.hasOwnProperty('color')) styles.color = node.styles!.color
		}
		return styles
	},
	addCommands() {
		/**
		 * 光标所在文本的颜色是否与入参一致
		 */
		const isColor = (val: string) => {
			return this.commands.isTextStyle!('color', val)
		}
		/**
		 * 设置颜色
		 */
		const setColor = async (val: string) => {
			if (isColor(val)) {
				return
			}
			await this.commands.setTextStyle!({
				color: val
			})
		}
		/**
		 * 取消颜色
		 */
		const unsetColor = async (val: string) => {
			if (!isColor(val)) {
				return
			}
			await this.commands.removeTextStyle!(['color'])
		}

		return {
			isColor,
			setColor,
			unsetColor
		}
	}
})
