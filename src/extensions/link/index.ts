import { KNode, KNodeMarksType } from '../../model'
import { splitNodeToNodes } from '../../tools'
import { Extension } from '../Extension'

/**
 * 插入链接方法入参类型
 */
type SetLinkOptionType = {
	href: string
	text?: string
	newOpen?: boolean
}

/**
 * 更新链接方法入参类型
 */
type UpdateLinkOptionType = {
	href?: string
	newOpen?: boolean
}

declare module '../../model' {
	interface EditorCommandsType {
		getLink?: () => KNode | null
		hasLink?: () => boolean
		setLink?: (options: SetLinkOptionType) => Promise<void>
		updateLink?: (options: UpdateLinkOptionType) => Promise<void>
		unsetLink?: () => Promise<void>
	}
}

export const LinkExtension = Extension.create({
	name: 'link',
	pasteKeepMarks(node) {
		const marks: KNodeMarksType = {}
		if (node.isMatch({ tag: 'a' }) && node.hasMarks()) {
			if (node.marks!.hasOwnProperty('href')) marks['href'] = node.marks!['href']
			if (node.marks!.hasOwnProperty('target')) marks['target'] = node.marks!['target']
		}
		return marks
	},
	formatRule({ editor, node }) {
		//链接里只能有文本节点和闭合节点
		if (node.isMatch({ tag: 'a' }) && node.hasChildren()) {
			node.children!.forEach(item => {
				splitNodeToNodes(editor, item)
			})
		}
	},
	addCommands() {
		/**
		 * 获取光标所在的链接，如果光标不在一个链接内，返回null
		 */
		const getLink = () => {
			return this.getMatchNodeBySelection({ tag: 'a' })
		}

		/**
		 * 判断光标范围内是否有链接
		 */
		const hasLink = () => {
			return this.isSelectionNodesSomeMatch({
				tag: 'a'
			})
		}

		/**
		 * 设置连接
		 */
		const setLink = async (options: SetLinkOptionType) => {
			if (!this.selection.focused()) {
				return
			}
			if (!options.href) {
				return
			}
			//起点和终点在一起
			if (this.selection.collapsed()) {
				if (!options.text) {
					return
				}
				const marks: KNodeMarksType = {
					href: options.href
				}
				if (options.newOpen) {
					marks.target = '_blank'
				}
				const linkNode = KNode.create({
					type: 'inline',
					tag: 'a',
					marks,
					children: [
						{
							type: 'text',
							textContent: options.text
						}
					]
				})
				this.insertNode(linkNode)
			}
			//起点和终点不在一起
			else {
				const marks: KNodeMarksType = {
					href: options.href
				}
				if (options.newOpen) {
					marks.target = '_blank'
				}
				const linkNode = KNode.create({
					type: 'inline',
					tag: 'a',
					marks,
					children: []
				})
				this.getFocusSplitNodesBySelection('all').forEach((item, index) => {
					const newNode = item.clone(true)
					this.addNode(newNode, linkNode, index)
				})
				this.insertNode(linkNode)
			}
			await this.updateView()
		}

		/**
		 * 更新链接
		 */
		const updateLink = async (options: UpdateLinkOptionType) => {
			if (!this.selection.focused()) {
				return
			}
			const linkNode = getLink()
			if (!linkNode) {
				return
			}
			const marks: KNodeMarksType = {}
			if (options.href) {
				marks.href = options.href
			}
			if (options.newOpen) {
				marks.target = '_blank'
			}
			linkNode.marks = { ...linkNode.marks!, ...marks }
			await this.updateView()
		}

		/**
		 * 取消链接
		 */
		const unsetLink = async () => {
			if (!this.selection.focused()) {
				return
			}
			const linkNode = getLink()
			if (!linkNode) {
				return
			}
			linkNode.children!.forEach(item => {
				this.addNodeBefore(item, linkNode)
			})
			linkNode.children = []
			await this.updateView()
		}

		return { getLink, hasLink, setLink, updateLink, unsetLink }
	}
})
