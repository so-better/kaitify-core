import { KNodeStylesType } from '@/model'
import { splitNodeToNodes } from '@/model/config/function'
import { Extension } from '../Extension'

declare module '@/model' {
	interface EditorCommandsType {
		isUnderline?: () => boolean
		setUnderline?: () => Promise<void>
		unsetUnderline?: () => Promise<void>
	}
}

export const UnderlineExtension = Extension.create({
	name: 'underline',
	pasteKeepStyles(node) {
		const styles: KNodeStylesType = {}
		if (node.isText() && node.hasStyles()) {
			if (node.styles!.hasOwnProperty('textDecoration')) styles.textDecoration = node.styles!.textDecoration
			if (node.styles!.hasOwnProperty('textDecorationLine')) styles.textDecorationLine = node.styles!.textDecorationLine
		}
		return styles
	},
	extraKeepTags: ['u'],
	domParseNodeCallback(node) {
		if (node.isMatch({ tag: 'u' })) {
			node.type = 'inline'
		}
		return node
	},
	formatRules: [
		({ editor, node }) => {
			if (!node.isEmpty() && node.isMatch({ tag: 'u' })) {
				const styles: KNodeStylesType = node.styles || {}
				node.styles = {
					...styles,
					textDecorationLine: 'underline'
				}
				node.tag = editor.textRenderTag
				splitNodeToNodes.apply(editor, [node])
			}
		}
	],
	addCommands() {
		/**
		 * 光标所在文本是否下划线
		 */
		const isUnderline = () => {
			return this.commands.isTextStyle!('textDecoration', 'underline') || this.commands.isTextStyle!('textDecorationLine', 'underline')
		}
		/**
		 * 设置下划线
		 */
		const setUnderline = async () => {
			if (isUnderline()) {
				return
			}
			await this.commands.setTextStyle!({
				textDecorationLine: 'underline'
			})
		}
		/**
		 * 取消下划线
		 */
		const unsetUnderline = async () => {
			if (!isUnderline()) {
				return
			}
			await this.commands.removeTextStyle!(['textDecoration', 'textDecorationLine'])
		}

		return {
			isUnderline,
			setUnderline,
			unsetUnderline
		}
	}
})
