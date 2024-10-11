import { KNodeStylesType } from '@/model'
import { splitNodeToNodes } from '@/model/config/function'
import { Extension } from '../Extension'

declare module '@/model' {
	interface EditorCommandsType {
		isSuperscript?: () => boolean
		setSuperscript?: () => Promise<void>
		unsetSuperscript?: () => Promise<void>
	}
}

export const SuperscriptExtension = Extension.create({
	name: 'superscript',
	pasteKeepStyles(node) {
		const styles: KNodeStylesType = {}
		if (node.isText() && node.hasStyles()) {
			if (node.styles!.hasOwnProperty('verticalAlign')) styles.verticalAlign = node.styles!.verticalAlign
		}
		return styles
	},
	extraKeepTags: ['sup'],
	domParseNodeCallback(node) {
		if (node.isMatch({ tag: 'sup' })) {
			node.type = 'inline'
		}
		return node
	},
	formatRules: [
		({ editor, node }) => {
			if (!node.isEmpty() && node.isMatch({ tag: 'sup' })) {
				const styles: KNodeStylesType = node.styles || {}
				node.styles = {
					...styles,
					verticalAlign: 'super'
				}
				node.tag = editor.textRenderTag
				splitNodeToNodes.apply(editor, [node])
			}
		}
	],
	addCommands() {
		/**
		 * 光标所在文本是否上标
		 */
		const isSuperscript = () => {
			return this.commands.isTextStyle!('verticalAlign', 'super')
		}
		/**
		 * 设置上标
		 */
		const setSuperscript = async () => {
			if (isSuperscript()) {
				return
			}
			await this.commands.setTextStyle!({
				verticalAlign: 'super'
			})
		}
		/**
		 * 取消上标
		 */
		const unsetSuperscript = async () => {
			if (!isSuperscript()) {
				return
			}
			await this.commands.removeTextStyle!(['verticalAlign'])
		}

		return {
			isSuperscript,
			setSuperscript,
			unsetSuperscript
		}
	}
})
