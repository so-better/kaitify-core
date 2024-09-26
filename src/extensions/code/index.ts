import { NODE_CODE_MARK } from '../../tools'
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
	formatRule: ({ editor, node }) => {
		if (node.tag == 'code') {
			node.tag = editor.textRenderTag
			if (node.hasMarks()) {
				node.marks![NODE_CODE_MARK] = 'true'
			} else {
				node.marks = {
					[NODE_CODE_MARK]: 'true'
				}
			}
		}
	},
	addCommands() {
		/**
		 * 光标所在文本是否行内代码
		 */
		const isCode = () => {
			return this.commands.isTextMark!(NODE_CODE_MARK)
		}
		/**
		 * 设置行内代码
		 */
		const setCode = async () => {
			if (isCode()) {
				return
			}
			await this.commands.setTextMark!({
				[NODE_CODE_MARK]: 'true'
			})
		}
		/**
		 * 取消行内代码
		 */
		const unsetCode = async () => {
			if (!isCode()) {
				return
			}
			await this.commands.removeTextMark!([NODE_CODE_MARK])
		}

		return {
			isCode,
			setCode,
			unsetCode
		}
	}
})
