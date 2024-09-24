import { file as DapFile } from 'dap-util'
import { Editor } from '../Editor'
import { isUndo, isRedo } from './keyboard'
import { KNode, KNodeMarksType, KNodeStylesType } from '../KNode'
import { delay } from '../../tools'

/**
 * 粘贴时对非文本节点的标记和样式的保留处理
 */
const handlerForPasteKeepMarksAndStyles = function (this: Editor, nodes: KNode[]) {
	//不是文本
	nodes.forEach(node => {
		//不是文本节点
		if (!node.isText()) {
			const marks: KNodeMarksType = {}
			const styles: KNodeStylesType = {}
			//处理需要保留的标记
			if (node.hasMarks()) {
				//contenteditable属性保留
				if (node.marks!['contenteditable']) {
					marks['contenteditable'] = node.marks!['contenteditable']
				}
				//name属性保留
				if (node.marks!['name']) {
					marks['name'] = node.marks!['name']
				}
				//disabled属性保留
				if (node.marks!['disabled']) {
					marks['disabled'] = node.marks!['disabled']
				}
				//视频的autoplay属性保留
				if (node.tag == 'video' && node.marks!['autoplay']) {
					marks['autoplay'] = node.marks!['autoplay']
				}
				//视频的loop属性保留
				if (node.tag == 'video' && node.marks!['loop']) {
					marks['loop'] = node.marks!['loop']
				}
				//视频的muted属性保留
				if (node.tag == 'video' && node.marks!['muted']) {
					marks['muted'] = node.marks!['muted']
				}
				//视频的controls属性保留
				if (node.tag == 'video' && node.marks!['controls']) {
					marks['controls'] = node.marks!['controls']
				}
				//链接的href属性保留
				if (node.tag == 'a' && node.marks!['href']) {
					marks['href'] = node.marks!['href']
				}
				//链接的target属性保留
				if (node.tag == 'a' && node.marks!['target']) {
					marks['target'] = node.marks!['target']
				}
				//表格列宽属性保留
				if (node.tag == 'col' && node.marks!['width']) {
					marks['width'] = node.marks!['width']
				}
				//表格单元格colspan属性保留
				if (['td', 'th'].includes(node.tag!) && node.marks!['colspan']) {
					marks['colspan'] = node.marks!['colspan']
				}
				//表格单元格rowspan属性保留
				if (['td', 'th'].includes(node.tag!) && node.marks!['rowspan']) {
					marks['rowspan'] = node.marks!['rowspan']
				}
				//表格单元格被合并属性保留
				if (['td', 'th'].includes(node.tag!) && node.marks!['data-editify-merged']) {
					marks['data-editify-merged'] = node.marks!['data-editify-merged']
				}
			}
			//处理需要保留的样式
			if (node.hasStyles()) {
				//块元素保留text-indent样式
				if (node.isBlock() && node.styles!['text-indent']) {
					styles['text-indent'] = node.styles!['text-indent']
				}
				//块元素保留text-align样式
				if (node.isBlock() && node.styles!['text-align']) {
					styles['text-align'] = node.styles!['text-align']
				}
				//块元素保留line-height样式
				if (node.isBlock() && node.styles!['line-height']) {
					styles['line-height'] = node.styles!['line-height']
				}
			}
			//自定义标记保留
			if (typeof this.pasteKeepMarks == 'function') {
				const extendMarks = this.pasteKeepMarks.apply(this, [node])
				Object.assign(marks, extendMarks)
			}
			//自定义样式保留
			if (typeof this.pasteKeepStyles == 'function') {
				const extendStyles = this.pasteKeepStyles.apply(this, [node])
				Object.assign(styles, extendStyles)
			}
			//将处理后的样式和标记给节点
			node.marks = marks
			node.styles = styles
			//处理子节点
			if (node.hasChildren()) {
				handlerForPasteKeepMarksAndStyles.apply(this, [node.children!])
			}
		}
	})
}

/**
 * 粘贴处理
 */
const handlerForPasteDrop = async function (this: Editor, dataTransfer: DataTransfer) {
	//html内容
	const html = dataTransfer.getData('text/html')
	//文本内容
	const text = dataTransfer.getData('text/plain')
	//文件数组
	const files = dataTransfer.files
	//有html内容并且允许粘贴html
	if (html && this.allowPasteHtml) {
		//将html转为节点数组
		const nodes = this.htmlParseNode(html).filter(item => {
			return !item.isEmpty()
		})
		//粘贴时对非文本节点的标记和样式的保留处理
		handlerForPasteKeepMarksAndStyles.apply(this, [nodes])
		//是否走默认逻辑
		const useDefault = typeof this.onPasteHtml == 'function' ? await this.onPasteHtml.apply(this, [nodes, html]) : true
		//走默认逻辑
		if (useDefault) {
			this.insertNode(nodes[0])
			for (let i = nodes.length - 1; i >= 1; i--) {
				this.addNodeAfter(nodes[i], nodes[0])
			}
			this.setSelectionAfter(nodes[nodes.length - 1], 'all')
		}
	}
	//有文本内容
	else if (text) {
		//是否走默认逻辑
		const useDefault = typeof this.onPasteText == 'function' ? await this.onPasteText.apply(this, [text]) : true
		//走默认逻辑
		if (useDefault) {
			this.insertText(text)
		}
	}
	//有文件
	else if (files.length) {
		const length = files.length
		for (let i = 0; i < length; i++) {
			//图片粘贴
			if (files[i].type.startsWith('image/')) {
				//是否走默认逻辑
				const useDefault = typeof this.onPasteImage == 'function' ? await this.onPasteImage.apply(this, [files[i]]) : true
				//走默认逻辑
				if (useDefault) {
					const url = await DapFile.dataFileToBase64(files[i])
					const image = KNode.create({
						type: 'closed',
						tag: 'img',
						marks: {
							src: url,
							alt: files[i].name || ''
						}
					})
					this.insertNode(image)
				}
			}
			//视频粘贴
			else if (files[i].type.startsWith('video/')) {
				//是否走默认逻辑
				const useDefault = typeof this.onPasteVideo == 'function' ? await this.onPasteVideo.apply(this, [files[i]]) : true
				//走默认逻辑
				if (useDefault) {
					const url = await DapFile.dataFileToBase64(files[i])
					const video = KNode.create({
						type: 'closed',
						tag: 'video',
						marks: {
							src: url,
							alt: files[i].name || ''
						}
					})
					this.insertNode(video)
				}
			}
			//其他文件粘贴
			else if (typeof this.onPasteFile == 'function') {
				this.onPasteFile.apply(this, [files[i]])
			}
		}
	}
}

/**
 * 监听selection
 */
export const onSelectionChange = function (this: Editor) {
	if (!this.$el) {
		return
	}
	//正在输入中文
	if (this.isComposition) {
		return
	}
	//内部修改触发
	if (this.internalCauseSelectionChange) {
		return
	}
	//更新selection
	const flag = this.updateSelection()
	//没有更新成功
	if (!flag) {
		return
	}
	//更新记录的selection
	this.history.updateSelection(this.selection)
	//触发事件
	if (typeof this.onSelectionUpdate == 'function') {
		this.onSelectionUpdate.apply(this, [this.selection])
	}
}

/**
 * 监听beforeinput
 */
export const onBeforeInput = async function (this: Editor, e: Event) {
	const event = e as InputEvent
	//中文输入相关保持默认行为
	if (event.inputType === 'insertCompositionText' || event.inputType === 'insertFromComposition') {
		return
	}
	//禁用系统默认行为
	event.preventDefault()
	//不可编辑
	if (!this.isEditable()) {
		return
	}
	//光标没有聚焦
	if (!this.selection.focused()) {
		return
	}
	//插入文本
	if (event.inputType == 'insertText' && event.data) {
		this.insertText(event.data!)
		this.updateView()
	}
	//删除内容
	else if (event.inputType == 'deleteContentBackward' || event.inputType == 'deleteByCut' || event.inputType == 'deleteByDrag') {
		this.delete()
		this.updateView()
	}
	//插入段落
	else if (event.inputType == 'insertParagraph' || event.inputType == 'insertLineBreak') {
		this.insertParagraph()
		this.updateView()
	}
	//粘贴
	else if (event.inputType == 'insertFromPaste') {
		//存在粘贴数据且允许粘贴
		if (event.dataTransfer && this.allowPaste) {
			await handlerForPasteDrop.apply(this, [event.dataTransfer])
			this.updateView()
		}
	}
	//拖入
	else if (event.inputType == 'insertFromDrop') {
		//延迟是因为光标这时候还没有更新，需要等待光标更新了
		await delay()
		//存在粘贴数据且允许粘贴
		if (event.dataTransfer && this.allowPaste) {
			await handlerForPasteDrop.apply(this, [event.dataTransfer])
			this.updateView()
		}
	}
}

/**
 * 监听中文输入
 */
export const onComposition = async function (this: Editor, e: Event) {
	const event = e as InputEvent
	//不可编辑
	if (!this.isEditable()) {
		return
	}
	//开始输入中文
	if (event.type == 'compositionstart') {
		//改变标识
		this.isComposition = true
	}
	//输入中文结束后
	else if (event.type == 'compositionend') {
		//获取真实光标
		const realSelection = window.getSelection()!
		const range = realSelection.getRangeAt(0)
		//获取真实光标所在的真实dom，一定是文本
		const element = range.endContainer
		//父元素
		const parentElement = element.parentNode! as HTMLElement
		//获取对应的节点
		const parentNode = this.findNode(parentElement)
		//是文本节点且文本不一致
		if (parentNode.isText() && parentNode.textContent != element.textContent) {
			const textContent = parentNode.textContent || ''
			//更新文本内容
			parentNode.textContent = element.textContent || ''
			//更新光标
			if (this.isSelectionInNode(parentNode)) {
				this.updateSelection()
			}
			//移除非法的文本
			element.textContent = textContent
			//更新视图
			await this.updateView()
		}
		//不是文本节点
		else if (!parentNode.isText()) {
			//子元素在父元素中的位置
			const index = Array.from(parentElement.childNodes).findIndex(item => item.isEqualNode(element))
			//将子元素转为节点
			const node = this.domParseNode(element)
			//添加到编辑器内
			parentNode.children!.splice(index, 0, node)
			node.parent = parentNode
			//删除非法dom
			parentElement.removeChild(element)
			//重置光标到节点后
			if (this.selection.focused()) {
				this.setSelectionAfter(node, 'all')
			}
			//更新视图
			await this.updateView()
		}
		//改变标识
		this.isComposition = false
	}
}

/**
 * 监听键盘事件
 */
export const onKeyboard = function (this: Editor, e: Event) {
	if (this.isComposition) {
		return
	}
	const event = e as KeyboardEvent
	//键盘按下
	if (event.type == 'keydown') {
		//不可编辑
		if (!this.isEditable()) {
			return
		}
		//撤销
		if (isUndo(event)) {
			event.preventDefault()
			this.commands.undo?.()
		}
		//重做
		else if (isRedo(event)) {
			event.preventDefault()
			this.commands.redo?.()
		}
		//触发keydown
		if (typeof this.onKeydown == 'function') {
			this.onKeydown.apply(this, [event])
		}
	}
	//键盘松开
	else if (event.type == 'keyup') {
		//不可编辑
		if (!this.isEditable()) {
			return
		}
		//触发keyup
		if (typeof this.onKeyup == 'function') {
			this.onKeyup.apply(this, [event])
		}
	}
}

/**
 * 监听编辑器获取焦点
 */
export const onFocus = function (this: Editor, e: Event) {
	//不可编辑
	if (!this.isEditable()) {
		return
	}
	if (typeof this.onFocus == 'function') {
		this.onFocus.apply(this, [e as FocusEvent])
	}
}

/**
 * 监听编辑器失去焦点
 */
export const onBlur = function (this: Editor, e: Event) {
	//不可编辑
	if (!this.isEditable()) {
		return
	}
	if (typeof this.onBlur == 'function') {
		this.onBlur.apply(this, [e as FocusEvent])
	}
}
/**
 * 监听编辑器复制
 */
export const onCopy = async function (this: Editor, e: Event) {
	const event = e as ClipboardEvent
	if (!this.allowCopy) {
		event.preventDefault()
	}
}
