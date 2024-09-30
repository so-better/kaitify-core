import { KNode } from '../../model'
import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		setHorizontal?: () => Promise<void>
	}
}

export const HorizontalExtension = Extension.create({
	name: 'horizontal',
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
