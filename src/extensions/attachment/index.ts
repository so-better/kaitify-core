import { event as DapEvent } from 'dap-util'
import { KNode, KNodeMarksType, KNodeStylesType } from '@/model'
import { Extension } from '../Extension'
import defaultIcon from './icon.svg'
import './style.less'

type SetAttachmentConfigType = {
	url: string
	text: string
	icon?: string
}

declare module '@/model' {
	interface EditorCommandsType {
		getAttachment?: () => KNode | null
		hasAttachment?: () => boolean
		setAttachment?: (options: SetAttachmentConfigType) => Promise<void>
	}
}

/**
 * 下载附件
 */
const downloadAttachment = (element: HTMLElement) => {
	DapEvent.off(element, 'click')
	DapEvent.on(element, 'click', async event => {
		const el = event.currentTarget as HTMLElement
		//获取文件地址
		const url = el.getAttribute('kaitify-attachment')!
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
		a.setAttribute('download', el.innerText)
		a.click()
	})
}

export const AttachmentExtension = Extension.create({
	name: 'attachment',
	pasteKeepStyles(node) {
		const styles: KNodeStylesType = {}
		if (node.isMatch({ tag: 'span', marks: { 'kaitify-attachment': true } })) {
			styles.backgroundImage = node.styles!.backgroundImage
		}
		return styles
	},
	pasteKeepMarks(node) {
		const marks: KNodeMarksType = {}
		if (node.isMatch({ tag: 'span', marks: { 'kaitify-attachment': true } })) {
			marks['kaitify-attachment'] = node.marks!['kaitify-attachment']
		}
		return marks
	},
	domParseNodeCallback(node) {
		if (node.isMatch({ tag: 'span', marks: { 'kaitify-attachment': true } })) {
			//锁定节点
			node.locked = true
			//设为行内
			node.type = 'inline'
			//处理子孙节点
			KNode.flat(node.children!).forEach(item => {
				//锁定节点
				item.locked = true
				//非文本节点
				if (!item.isText()) {
					//有子节点转为行内
					if (item.hasChildren()) {
						item.type = 'inline'
					}
					//无子节点转为闭合
					else {
						item.type = 'closed'
					}
				}
			})
		}
		return node
	},
	formatRules: [
		({ editor, node }) => {
			//两侧设置空白元素
			if (
				!node.isEmpty() &&
				node.isMatch({
					tag: 'span',
					marks: {
						'kaitify-attachment': true
					}
				})
			) {
				const previousNode = node.getPrevious(node.parent ? node.parent!.children! : editor.stackNodes)
				const nextNode = node.getNext(node.parent ? node.parent!.children! : editor.stackNodes)
				//前一个节点不存在或者不是零宽度空白文本节点
				if (!previousNode || !previousNode.isZeroWidthText()) {
					const zeroWidthText = KNode.createZeroWidthText()
					editor.addNodeBefore(zeroWidthText, node)
				}
				//后一个节点不存在或者不是零宽度空白文本节点
				if (!nextNode || !nextNode.isZeroWidthText()) {
					const zeroWidthText = KNode.createZeroWidthText()
					editor.addNodeAfter(zeroWidthText, node)
				}
				//重置光标
				if (editor.isSelectionInNode(node, 'start')) {
					const newTextNode = node.getNext(node.parent ? node.parent!.children! : editor.stackNodes)
					if (newTextNode) editor.setSelectionBefore(newTextNode, 'start')
				}
				if (editor.isSelectionInNode(node, 'end')) {
					const newTextNode = node.getNext(node.parent ? node.parent!.children! : editor.stackNodes)
					if (newTextNode) editor.setSelectionBefore(newTextNode, 'end')
				}
			}
		}
	],
	afterUpdateView() {
		//编辑器可编辑状态下不设置
		if (this.isEditable()) {
			return
		}
		const elements = this.$el!.querySelectorAll('span[kaitify-attachment]')
		elements.forEach(el => {
			//下载附件
			downloadAttachment(el as HTMLElement)
		})
	},
	addCommands() {
		/**
		 * 获取光标所在的附件节点，如果光标不在一个附件节点内，返回null
		 */
		const getAttachment = () => {
			return this.getMatchNodeBySelection({
				tag: 'span',
				marks: {
					'kaitify-attachment': true
				}
			})
		}

		/**
		 * 判断光标范围内是否有附件节点
		 */
		const hasAttachment = () => {
			return this.isSelectionNodesSomeMatch({
				tag: 'span',
				marks: {
					'kaitify-attachment': true
				}
			})
		}

		/**
		 * 插入附件
		 */
		const setAttachment = async ({ url, text, icon }: SetAttachmentConfigType) => {
			if (!!getAttachment()) {
				return
			}
			//设置html内容
			const html = `<span kaitify-attachment="${url}" contenteditable="false" style="background-image:url(${icon || defaultIcon})"><span>${text}</span></span>`
			//html内容转为节点数组
			const nodes = this.htmlParseNode(html)
			//插入节点
			this.insertNode(nodes[0])
			//更新视图
			await this.updateView()
		}

		return {
			getAttachment,
			hasAttachment,
			setAttachment
		}
	}
})
