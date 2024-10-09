import { event as DapEvent, element as DapElement } from 'dap-util'
import { Editor, KNode, KNodeMarksType } from '../../model'
import { getSelectionBlockNodes } from '../../model/config/function'
import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		getTask?: () => KNode | null
		hasTask?: () => boolean
		allTask?: () => boolean
		setTask?: () => Promise<void>
		unsetTask?: () => Promise<void>
	}
}

/**
 * 块节点转为待办
 */
const toTask = (editor: Editor, node: KNode) => {
	if (!node.isBlock()) {
		return
	}
	//是固定的块节点或者内嵌套的块节点
	if (node.fixed || node.nested) {
		//克隆块节点
		const newNode = node.clone(false)
		//创建待办节点
		const taskNode = KNode.create({
			type: 'block',
			tag: 'div',
			marks: {
				'kaitify-task': 'undo'
			},
			children: []
		})
		//将原来块节点的子节点给待办节点
		node.children!.forEach((item, index) => {
			editor.addNode(item, taskNode, index)
		})
		//清空原来的块节点
		node.children = []
		//将待办节点添加到新块节点下
		taskNode.parent = newNode
		newNode.children = [taskNode]
		//将新块节点代替原来的块节点
		editor.addNodeBefore(newNode, node)
	}
	//非固定块节点
	else {
		editor.toParagraph(node)
		node.tag = 'div'
		node.marks = {
			'kaitify-task': 'undo'
		}
	}
}

/**
 * 编辑器点击切换待办状态
 */
const handlerForTaskCheck = function (this: Editor, e: Event) {
	const event = e as MouseEvent
	const elm = event.target as HTMLElement
	if (elm === this.$el) {
		return
	}
	const node = this.findNode(elm)
	//点击的元素是待办
	if (
		node.getMatchNode({
			tag: 'div',
			marks: {
				'kaitify-task': true
			}
		})
	) {
		const rect = DapElement.getElementBounding(elm)
		//在复选框范围内
		if (event.pageX >= Math.abs(rect.left) && event.pageX <= Math.abs(rect.left + 16) && event.pageY >= Math.abs(rect.top + elm.offsetHeight / 2 - 8) && event.pageY <= Math.abs(rect.top + elm.offsetHeight / 2 + 8)) {
			if (node.marks!['kaitify-task'] == 'undo') {
				node.marks!['kaitify-task'] = 'done'
			} else {
				node.marks!['kaitify-task'] = 'undo'
			}
			this.setSelectionAfter(node, 'all')
			this.updateView()
		}
	}
}

export const TaskExtension = Extension.create({
	name: 'task',
	pasteKeepMarks(node) {
		const marks: KNodeMarksType = {}
		if (node.marks!.hasOwnProperty('kaitify-task')) marks['kaitify-task'] = node.marks!['kaitify-task']
		return marks
	},
	afterUpdateView() {
		if (!this.isEditable()) {
			return
		}
		DapEvent.off(this.$el!, `click.task`)
		DapEvent.on(this.$el!, `click.task`, handlerForTaskCheck.bind(this))
	},
	onInsertParagraph(node) {
		if (
			node.isMatch({
				tag: 'div',
				marks: {
					'kaitify-task': true
				}
			})
		) {
			node.marks!['kaitify-task'] = 'undo'
		}
	},
	addCommands() {
		/**
		 * 获取光标所在的待办节点，如果光标不在一个待办节点内，返回null
		 */
		const getTask = () => {
			return this.getMatchNodeBySelection({
				tag: 'div',
				marks: {
					'kaitify-task': true
				}
			})
		}

		/**
		 * 判断光标范围内是否有待办节点
		 */
		const hasTask = () => {
			return this.isSelectionNodesSomeMatch({
				tag: 'div',
				marks: {
					'kaitify-task': true
				}
			})
		}

		/**
		 * 光标范围内是否都是待办节点
		 */
		const allTask = () => {
			return this.isSelectionNodesAllMatch({
				tag: 'div',
				marks: {
					'kaitify-task': true
				}
			})
		}

		/**
		 * 设置待办
		 */
		const setTask = async () => {
			if (allTask()) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const blockNode = this.selection.start!.node.getBlock()
				toTask(this, blockNode)
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					toTask(this, item)
				})
			}
			await this.updateView()
		}

		/**
		 * 取消待办
		 */
		const unsetTask = async () => {
			if (!allTask()) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const matchNode = this.selection.start!.node.getMatchNode({
					tag: 'div',
					marks: {
						'kaitify-task': true
					}
				})
				if (matchNode) this.toParagraph(matchNode)
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					const matchNode = item.getMatchNode({
						tag: 'div',
						marks: {
							'kaitify-task': true
						}
					})
					if (matchNode) this.toParagraph(matchNode)
				})
			}
			await this.updateView()
		}

		return {
			getTask,
			hasTask,
			allTask,
			setTask,
			unsetTask
		}
	}
})
