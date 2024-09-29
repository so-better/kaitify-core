import { KNodeMarksType, KNodeStylesType, splitNodeToNodes } from '../../model'
import { deleteProperty } from '../../tools'
import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		isFontFamily?: (val: string) => boolean
		setFontFamily?: (val: string) => Promise<void>
		unsetFontFamily?: (val: string) => Promise<void>
	}
}

export const FontFamilyExtension = Extension.create({
	name: 'fontFamily',
	formatRule({ editor, node }) {
		if (!node.isEmpty() && node.isMatch({ tag: 'font' })) {
			const marks: KNodeMarksType = node.marks || {}
			const styles: KNodeStylesType = node.styles || {}
			node.styles = {
				...styles,
				fontFamily: (marks.face as string) || ''
			}
			node.marks = deleteProperty(marks, 'face')
			node.tag = editor.textRenderTag
			splitNodeToNodes(editor, node)
		}
	},
	addCommands() {
		/**
		 * 光标所在文本的字体是否与入参一致
		 */
		const isFontFamily = (val: string) => {
			return this.commands.isTextStyle!('fontFamily', val)
		}
		/**
		 * 设置字体
		 */
		const setFontFamily = async (val: string) => {
			if (isFontFamily(val)) {
				return
			}
			await this.commands.setTextStyle!({
				fontFamily: val
			})
		}
		/**
		 * 取消字体
		 */
		const unsetFontFamily = async (val: string) => {
			if (!isFontFamily(val)) {
				return
			}
			await this.commands.removeTextStyle!(['fontFamily'])
		}

		return {
			isFontFamily,
			setFontFamily,
			unsetFontFamily
		}
	}
})
