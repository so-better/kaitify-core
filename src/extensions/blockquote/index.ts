import { Editor, KNode } from '../../model'
import { getSelectionBlockNodes } from '../../model/config/function'
import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		getBlockquote?: () => KNode | null
		hasBlockquote?: () => boolean
		allBlockquote?: () => boolean
		setBlockquote?: () => Promise<void>
		unsetBlockquote?: () => Promise<void>
	}
}

/**
 * 块节点转为引用
 */
const toBlockquote = (editor: Editor, node: KNode) => {
	if (!node.isBlock()) {
		return
	}
	//是固定的块节点或者内嵌套的块节点
	if (node.fixed || node.nested) {
		//克隆块节点
		const newNode = node.clone(false)
		//创建引用节点
		const blockquoteNode = KNode.create({
			type: 'block',
			tag: 'blockquote',
			children: []
		})
		//将原来块节点的子节点给引用节点
		node.children!.forEach((item, index) => {
			editor.addNode(item, blockquoteNode, index)
		})
		//清空原来的块节点
		node.children = []
		//将引用节点添加到新块节点下
		blockquoteNode.parent = newNode
		newNode.children = [blockquoteNode]
		//将新块节点代替原来的块节点
		editor.addNodeBefore(newNode, node)
	}
	//非固定块节点
	else {
		node.tag = 'blockquote'
		node.marks = {}
		node.styles = {}
	}
}

export const BlockquoteExtension = Extension.create({
	name: 'blockquote',
	addCommands() {
		/**
		 * 获取光标所在的引用节点，如果光标不在一个引用节点内，返回null
		 */
		const getBlockquote = () => {
			return this.getMatchNodeBySelection({
				tag: 'blockquote'
			})
		}

		/**
		 * 判断光标范围内是否有引用节点
		 */
		const hasBlockquote = () => {
			return this.isSelectionNodesSomeMatch({
				tag: 'blockquote'
			})
		}

		/**
		 * 光标范围内是否都是引用节点
		 */
		const allBlockquote = () => {
			return this.isSelectionNodesAllMatch({
				tag: 'blockquote'
			})
		}

		/**
		 * 设置引用
		 */
		const setBlockquote = async () => {
			if (allBlockquote()) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const blockNode = this.selection.start!.node.getBlock()
				toBlockquote(this, blockNode)
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(blockNode => {
					toBlockquote(this, blockNode)
				})
			}
			await this.updateView()
		}

		/**
		 * 取消引用
		 */
		const unsetBlockquote = async () => {
			if (!allBlockquote()) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const matchNode = this.selection.start!.node.getMatchNode({ tag: 'blockquote' })
				if (matchNode) this.toParagraph(matchNode)
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					const matchNode = item.getMatchNode({ tag: 'blockquote' })
					if (matchNode) this.toParagraph(matchNode)
				})
			}
			await this.updateView()
		}

		return {
			getBlockquote,
			hasBlockquote,
			allBlockquote,
			setBlockquote,
			unsetBlockquote
		}
	}
})
