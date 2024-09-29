import { KNodeStylesType } from '../../model'
import { splitNodeToNodes } from '../../model/config/function'
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
	formatRule({ editor, node }) {
		if (!node.isEmpty() && node.isMatch({ tag: 'del' })) {
			const styles: KNodeStylesType = node.styles || {}
			node.styles = {
				...styles,
				textDecorationLine: 'line-through'
			}
			node.tag = editor.textRenderTag
			splitNodeToNodes.apply(editor, [node])
		}
	},
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
