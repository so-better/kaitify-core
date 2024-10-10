import { Editor, KNode } from '../../model'
import { getSelectionBlockNodes } from '../../model/config/function'
import { Extension } from '../Extension'
import './style.less'

type HeadingLevelType = 0 | 1 | 2 | 3 | 4 | 5 | 6

const headingLevelMap = {
	0: 'p',
	1: 'h1',
	2: 'h2',
	3: 'h3',
	4: 'h4',
	5: 'h5',
	6: 'h6'
}

declare module '../../model' {
	interface EditorCommandsType {
		getHeading?: ({ level }: { level: HeadingLevelType }) => KNode | null
		hasHeading?: ({ level }: { level: HeadingLevelType }) => boolean
		allHeading?: ({ level }: { level: HeadingLevelType }) => boolean
		setHeading?: ({ level }: { level: HeadingLevelType }) => Promise<void>
		unsetHeading?: ({ level }: { level: HeadingLevelType }) => Promise<void>
	}
}

/**
 * 块节点转为标题
 */
const toHeading = (editor: Editor, node: KNode, level: HeadingLevelType) => {
	if (!node.isBlock()) {
		return
	}
	//是固定的块节点或者内嵌套的块节点
	if (node.fixed || node.nested) {
		//克隆块节点
		const newNode = node.clone(false)
		//创建标题节点
		const headingNode = KNode.create({
			type: 'block',
			tag: headingLevelMap[level],
			children: []
		})
		//将原来块节点的子节点给标题节点
		node.children!.forEach((item, index) => {
			editor.addNode(item, headingNode, index)
		})
		//清空原来的块节点
		node.children = []
		//将标题节点添加到新块节点下
		headingNode.parent = newNode
		newNode.children = [headingNode]
		//将新块节点代替原来的块节点
		editor.addNodeBefore(newNode, node)
	}
	//非固定块节点
	else {
		editor.toParagraph(node)
		node.tag = headingLevelMap[level]
	}
}

export const HeadingExtension = Extension.create({
	name: 'heading',
	addCommands() {
		/**
		 * 获取光标所在的标题，如果光标不在一个标题内，返回null
		 */
		const getHeading = ({ level }: { level: HeadingLevelType }) => {
			return this.getMatchNodeBySelection({
				tag: headingLevelMap[level]
			})
		}

		/**
		 * 判断光标范围内是否有标题
		 */
		const hasHeading = ({ level }: { level: HeadingLevelType }) => {
			return this.isSelectionNodesSomeMatch({
				tag: headingLevelMap[level]
			})
		}

		/**
		 * 光标范围内是否都是标题
		 */
		const allHeading = ({ level }: { level: HeadingLevelType }) => {
			return this.isSelectionNodesAllMatch({
				tag: headingLevelMap[level]
			})
		}

		/**
		 * 设置标题
		 */
		const setHeading = async ({ level }: { level: HeadingLevelType }) => {
			if (allHeading({ level })) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const blockNode = this.selection.start!.node.getBlock()
				toHeading(this, blockNode, level)
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					toHeading(this, item, level)
				})
			}
			await this.updateView()
		}

		/**
		 * 取消标题
		 */
		const unsetHeading = async ({ level }: { level: HeadingLevelType }) => {
			if (!allHeading({ level })) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const matchNode = this.selection.start!.node.getMatchNode({ tag: headingLevelMap[level] })
				if (matchNode) this.toParagraph(matchNode)
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					const matchNode = item.getMatchNode({ tag: headingLevelMap[level] })
					if (matchNode) this.toParagraph(matchNode)
				})
			}
			await this.updateView()
		}

		return {
			getHeading,
			hasHeading,
			allHeading,
			setHeading,
			unsetHeading
		}
	}
})
