import { KNode } from '@/model'
import { Extension } from '../Extension'
import './style.less'

declare module '@/model' {
	interface EditorCommandsType {
		setHorizontal?: () => Promise<void>
	}
}

export const HorizontalExtension = Extension.create({
	name: 'horizontal',
	extraKeepTags: ['hr'],
	domParseNodeCallback(node) {
		if (node.isMatch({ tag: 'hr' })) {
			node.type = 'closed'
		}
		return node
	},
	addCommands() {
		/**
		 * 设置分隔线
		 */
		const setHorizontal = async () => {
			const node = KNode.create({
				type: 'closed',
				tag: 'hr'
			})
			this.insertNode(node)
			await this.updateView()
		}

		return {
			setHorizontal
		}
	}
})
