import { file as DapFile } from 'dap-util'
import { Editor } from '../Editor'
import { isUndo, isRedo } from './keyboard'
import { KNode } from '../KNode'
import { delay } from '../../tools'

/**
 * 粘贴处理
 */
const handlerForPasteDrop = async (editor: Editor, dataTransfer: DataTransfer) => {
	//html内容
	const html = dataTransfer.getData('text/html')
	//文本内容
	const text = dataTransfer.getData('text/plain')
	//文件数组
	const files = dataTransfer.files
	//有html内容并且允许粘贴html
	if (html && editor.allowPasteHtml) {
		//将html转为节点数组
		const nodes = editor.htmlParseNode(html).filter(item => {
			return !item.isEmpty()
		})
		//是否走默认逻辑
		const useDefault = typeof editor.onPasteHtml == 'function' ? await editor.onPasteHtml.apply(editor, [nodes, html]) : true
		//走默认逻辑
		if (useDefault) {
			editor.insertNode(nodes[0])
			for (let i = nodes.length - 1; i >= 1; i--) {
				editor.addNodeAfter(nodes[i], nodes[0])
			}
			editor.setSelectionAfter(nodes[nodes.length - 1], 'all')
		}
	}
	//有文本内容
	else if (text) {
		//是否走默认逻辑
		const useDefault = typeof editor.onPasteText == 'function' ? await editor.onPasteText.apply(editor, [text]) : true
		//走默认逻辑
		if (useDefault) {
			editor.insertText(text)
		}
	}
	//有文件
	else if (files.length) {
		const length = files.length
		for (let i = 0; i < length; i++) {
			//图片粘贴
			if (files[i].type.startsWith('image/')) {
				//是否走默认逻辑
				const useDefault = typeof editor.onPasteImage == 'function' ? await editor.onPasteImage.apply(editor, [files[i]]) : true
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
					editor.insertNode(image)
				}
			}
			//视频粘贴
			else if (files[i].type.startsWith('video/')) {
				//是否走默认逻辑
				const useDefault = typeof editor.onPasteVideo == 'function' ? await editor.onPasteVideo.apply(editor, [files[i]]) : true
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
					editor.insertNode(video)
				}
			}
			//其他文件粘贴
			else if (typeof editor.onPasteFile == 'function') {
				editor.onPasteFile.apply(editor, [files[i]])
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
			await handlerForPasteDrop(this, event.dataTransfer)
			this.updateView()
		}
	}
	//拖入
	else if (event.inputType == 'insertFromDrop') {
		//延迟是因为光标这时候还没有更新，需要等待光标更新了
		await delay()
		//存在粘贴数据且允许粘贴
		if (event.dataTransfer && this.allowPaste) {
			await handlerForPasteDrop(this, event.dataTransfer)
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
			this.undo()
		}
		//重做
		else if (isRedo(event)) {
			event.preventDefault()
			this.redo()
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
