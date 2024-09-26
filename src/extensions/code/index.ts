import { KNode } from '../../model'
import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		getCode?: () => KNode | null
		hasCode?: () => boolean
		allCode?: () => boolean
		setCode?: () => Promise<void>
		unsetCode?: () => Promise<void>
	}
}

export const CodeExtension = Extension.create({
	name: 'code',
	addCommands() {
		/**
		 * 获取光标所在的行内代码，如果光标不在一个行内代码内，返回null
		 */
		const getCode = () => {
			return this.getMatchNodeBySelection({
				tag: 'code'
			})
		}

		/**
		 * 判断光标范围内是否有行内代码
		 */
		const hasCode = () => {
			return this.isSelectionNodesSomeMatch({
				tag: 'code'
			})
		}

		/**
		 * 光标范围内是否都是行内代码
		 */
		const allCode = () => {
			return this.isSelectionNodesAllMatch({
				tag: 'code'
			})
		}

		/**
		 * 设置行内代码
		 */
		const setCode = async () => {
			const focusNodes = this.getTextNodesBySelection()
			focusNodes.forEach(item => {})
		}

		/**
		 * 取消行内代码
		 */
		const unsetCode = async () => {}

		return {
			getCode,
			hasCode,
			allCode,
			setCode,
			unsetCode
		}
	}
})
