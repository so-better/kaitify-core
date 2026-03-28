import { event as DapEvent } from 'dap-util'
import { Editor, KNode, KNodeMarksType } from '@/model'
import { Extension } from '../Extension'
import { ATTACHMENT_NODE_TAG } from './element'
import defaultIcon from './icon.svg?raw'
import './style.less'

/**
 * 设置附件的参数类型
 */
export type SetAttachmentOptionType = {
	url: string
	text: string
	icon?: string
}

/**
 * 更新附件的参数类型
 */
export type UpdateAttachmentOptionType = {
	url?: string
	text?: string
	icon?: string
}

/**
 * 附件扩展入参类型
 */
export type AttachmentExtensionPropsType = {
	icon: string
}

declare module '../../model' {
	interface EditorCommandsType {
		/**
		 * 获取光标所在的附件节点
		 */
		getAttachment?: () => KNode | null
		/**
		 * 判断光标范围内是否有附件节点
		 */
		hasAttachment?: () => boolean
		/**
		 * 插入附件
		 */
		setAttachment?: (options: SetAttachmentOptionType) => Promise<void>
		/**
		 * 更新附件
		 */
		updateAttachment?: (options: UpdateAttachmentOptionType) => Promise<void>
		/**
		 * 获取附件信息
		 */
		getAttachmentInfo?: () => { url: string; text: string; icon: string } | null
	}
}

/**
 * 默认的附件图标地址
 */
const DEFAULT_ICON_URL = `data:image/svg+xml;base64,${btoa(defaultIcon)}`

/**
 * 附件点击事件
 */
const handleClick = (editor: Editor) => {
	DapEvent.off(editor.$el!, 'click.attachment')
	DapEvent.on(editor.$el!, 'click.attachment', async e => {
		const event = e as MouseEvent
		const elm = event.target as HTMLElement
		if (elm === editor.$el) {
			return
		}
		const node = editor.findNode(elm)
		const matchNode = node.getMatchNode({
			tag: ATTACHMENT_NODE_TAG
		})
		//附件节点不存在
		if (!matchNode) {
			return
		}
		//编辑器在可编辑器状态下
		if (editor.isEditable()) {
			//附件本身在被光标选择时是有选中样式的，所以只需要更新真实光标使其可以呈现选中效果即可
			editor.setSelectionBefore(matchNode, 'start')
			editor.setSelectionAfter(matchNode, 'end')
			editor.updateRealSelection()
		}
		//编辑器在不可编辑器状态下
		else {
			const url = matchNode.marks!['data-url'] as string
			const text = matchNode.marks!['data-text'] as string
			//使用fetch读取文件地址
			const res = await fetch(url, {
				method: 'GET'
			})
			//获取blob数据
			const blob = await res.blob()
			//创建a标签进行下载
			const a = document.createElement('a')
			a.setAttribute('target', '_blank')
			a.setAttribute('href', URL.createObjectURL(blob))
			a.setAttribute('download', text)
			a.click()
		}
	})
}

export const AttachmentExtension = (props?: AttachmentExtensionPropsType) =>
	Extension.create({
		name: 'attachment',
		extraKeepTags: [ATTACHMENT_NODE_TAG],
		onPasteKeepMarks(node) {
			const marks: KNodeMarksType = {}
			if (node.isMatch({ tag: ATTACHMENT_NODE_TAG }) && node.hasMarks()) {
				if (node.marks!.hasOwnProperty('data-url')) marks['data-url'] = node.marks!['data-url']
				if (node.marks!.hasOwnProperty('data-text')) marks['data-text'] = node.marks!['data-text']
				if (node.marks!.hasOwnProperty('data-icon')) marks['data-icon'] = node.marks!['data-icon']
			}
			return marks
		},
		onDomParseNode(node) {
			// 必须是闭合节点
			if (node.isMatch({ tag: ATTACHMENT_NODE_TAG })) {
				node.type = 'closed'
				node.children = undefined
			}
			// 兼容老格式：<span kaitify-attachment="url" contenteditable="false"><span>filename</span></span>
			if (node.isMatch({ tag: 'span', marks: { [ATTACHMENT_NODE_TAG]: true } })) {
				const url = node.marks![ATTACHMENT_NODE_TAG] as string
				// 从子节点提取文件名
				const text = KNode.flat(node.children ?? [])
					.filter(n => n.isText())
					.map(n => n.textContent)
					.join('')
				const icon = node.styles?.backgroundImage?.match(/url\(["']?(.*?)["']?\)/)?.[1]!
				// 改造成新的闭合节点格式
				node.type = 'closed'
				node.tag = ATTACHMENT_NODE_TAG
				node.children = undefined
				node.marks = { 'data-url': url, 'data-text': text, 'data-icon': icon }
				node.styles = {}
			}
			return node
		},
		formatRules: [
			({ node }) => {
				if (
					node.isMatch({
						tag: ATTACHMENT_NODE_TAG
					})
				) {
					//必须是闭合节点
					node.type = 'closed'
					node.children = undefined
				}
			}
		],
		onAfterUpdateView() {
			handleClick(this)
		},
		addCommands() {
			const getAttachment = () => {
				if (!this.selection.focused() || this.selection.collapsed()) {
					return null
				}
				const startNode = this.selection.start!.node
				const endNode = this.selection.end!.node
				const startOffset = this.selection.start!.offset
				const endOffset = this.selection.end!.offset
				if (startNode.isEqual(endNode) && startNode.isMatch({ tag: ATTACHMENT_NODE_TAG }) && startOffset == 0 && endOffset == 1) {
					return startNode
				}
				return null
			}

			const hasAttachment = () => {
				if (!this.selection.focused() || this.selection.collapsed()) {
					return false
				}
				const startNode = this.selection.start!.node
				const endNode = this.selection.end!.node
				const startOffset = this.selection.start!.offset
				const endOffset = this.selection.end!.offset
				// 起点从附件头部开始
				if (startNode.isMatch({ tag: ATTACHMENT_NODE_TAG }) && startOffset === 0) {
					return true
				}
				// 终点到附件尾部结束
				if (endNode.isMatch({ tag: ATTACHMENT_NODE_TAG }) && endOffset === 1) {
					return true
				}
				// 选区中间完整包含的附件（排除边界节点）
				return this.getFocusNodesBySelection('all')
					.filter(n => !n.isEqual(startNode) && !n.isEqual(endNode))
					.some(n => n.isMatch({ tag: ATTACHMENT_NODE_TAG }))
			}

			const setAttachment = async (options: SetAttachmentOptionType) => {
				if (!this.selection.focused() || hasAttachment()) {
					return
				}
				if (!options.url || !options.text) {
					return
				}
				const node = KNode.create({
					type: 'closed',
					tag: ATTACHMENT_NODE_TAG,
					marks: {
						'data-url': options.url,
						'data-text': options.text,
						'data-icon': options.icon || props?.icon || DEFAULT_ICON_URL
					}
				})
				//插入节点
				this.insertNode(node)
				//更新视图
				await this.updateView()
			}

			const updateAttachment = async (options: UpdateAttachmentOptionType) => {
				if (!this.selection.focused()) {
					return
				}
				if (!options.url && !options.text && !options.icon) {
					return
				}
				const attachmentNode = getAttachment()
				if (!attachmentNode) {
					return
				}
				//更新url
				if (options.url) {
					attachmentNode.marks!['data-url'] = options.url
				}
				//更新text
				if (options.text) {
					attachmentNode.marks!['data-text'] = options.text
				}
				//更新icon
				if (options.icon) {
					attachmentNode.marks!['data-icon'] = options.icon
				}
				//更新视图
				await this.updateView()
			}

			const getAttachmentInfo = () => {
				if (!this.selection.focused()) {
					return null
				}
				const attachmentNode = getAttachment()
				if (!attachmentNode) {
					return null
				}
				const url = attachmentNode.marks!['data-url'] as string
				const text = attachmentNode.marks!['data-text'] as string
				const icon = attachmentNode.marks!['data-icon'] as string
				return { url, text, icon }
			}

			return {
				getAttachment,
				hasAttachment,
				setAttachment,
				updateAttachment,
				getAttachmentInfo
			}
		}
	})
