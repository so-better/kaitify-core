import { KNodeStylesType } from '@/model'
import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		isColor?: (value: string) => boolean
		setColor?: (value: string) => Promise<void>
		unsetColor?: (value: string) => Promise<void>
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
		const isColor = (value: string) => {
			return this.commands.isTextStyle!('color', value)
		}
		/**
		 * 设置颜色
		 */
		const setColor = async (value: string) => {
			if (isColor(value)) {
				return
			}
			await this.commands.setTextStyle!({
				color: value
			})
		}
		/**
		 * 取消颜色
		 */
		const unsetColor = async (value: string) => {
			if (!isColor(value)) {
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
