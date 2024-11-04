import { event as DapEvent, element as DapElement } from 'dap-util'
import { KNode, KNodeCreateOptionType, KNodeMarksType, KNodeMatchOptionType, KNodeStylesType } from './KNode'
import { createGuid, delay, getDomAttributes, getDomStyles, initEditorDom, isContains, isZeroWidthText } from '../tools'
import { Selection } from './Selection'
import { History } from './History'
import { formatSiblingNodesMerge, formatPlaceholderMerge, formatZeroWidthTextMerge, RuleFunctionType, formatParentNodeMerge, formatUneditableNoodes, formatBlockInChildren, fomratBlockTagParse } from './config/format-rules'
import { patchNodes } from './config/format-patch'
import { onBeforeInput, onBlur, onComposition, onCopy, onCut, onFocus, onKeyboard, onSelectionChange } from './config/event-handler'
import { removeDomObserve, setDomObserve } from './config/dom-observe'
import { Extension, HistoryExtension, ImageExtension, TextExtension, BoldExtension, ItalicExtension, StrikethroughExtension, UnderlineExtension, SuperscriptExtension, SubscriptExtension, CodeExtension, FontSizeExtension, VideoExtension, FontFamilyExtension, ColorExtension, BackColorExtension, LinkExtension, AlignExtension, LineHeightExtension, IndentExtension, HorizontalExtension, BlockquoteExtension, HeadingExtension, ListExtension, TaskExtension, MathExtension, CodeBlockExtension, AttachmentExtension, TableExtension } from '@/extensions'
import { NODE_MARK } from '@/view'
import { defaultUpdateView } from '@/view/js-render'
import { checkNodes, emptyFixedBlock, formatNodes, handlerForNormalInsertParagraph, mergeBlock, redressSelection, registerExtension, removeBlockFromParentToSameLevel, setPlaceholder } from './config/function'

/**
 * 编辑器获取光标范围内节点数据的类型
 */
export type EditorSelectedType = {
	node: KNode
	offset: number[] | false
}

/**
 * 编辑器命令集合类型
 */
export interface EditorCommandsType {
	[name: string]: ((...args: any[]) => any | void) | undefined
}

/**
 * 编辑器配置入参类型
 */
export type EditorConfigureOptionType = {
	/**
	 * 编辑器渲染的dom或者选择器
	 */
	el: HTMLElement | string
	/**
	 * 是否允许复制
	 */
	allowCopy?: boolean
	/**
	 * 是否允许粘贴
	 */
	allowPaste?: boolean
	/**
	 * 是否允许剪切
	 */
	allowCut?: boolean
	/**
	 * 是否允许粘贴html
	 */
	allowPasteHtml?: boolean
	/**
	 * 剪切板同时存在文件和html/text时，是否优先粘贴文件
	 */
	priorityPasteFiles?: boolean
	/**
	 * 自定义编辑器内渲染文本节点的真实标签
	 */
	textRenderTag?: string
	/**
	 * 自定义编辑内渲染默认块级节点的真实标签，即段落标签
	 */
	blockRenderTag?: string
	/**
	 * 自定义编辑器内定义需要置空的标签
	 */
	emptyRenderTags?: string[]
	/**
	 * 自定义编辑器内额外保留的标签
	 */
	extraKeepTags?: string[]
	/**
	 * 自定义插件数组
	 */
	extensions?: Extension[]
	/**
	 * 自定义节点数组格式化规则
	 */
	formatRules?: RuleFunctionType[]
	/**
	 * 自定义dom转为非文本节点的后续处理
	 */
	domParseNodeCallback?: (this: Editor, node: KNode) => KNode
	/**
	 * 视图渲染时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要自定义渲染视图
	 */
	onUpdateView?: (this: Editor, init: boolean) => boolean | Promise<boolean>
	/**
	 * 编辑器粘贴纯文本时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
	 */
	onPasteText?: (this: Editor, text: string) => boolean | Promise<boolean>
	/**
	 * 编辑器粘贴html内容时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
	 */
	onPasteHtml?: (this: Editor, nodes: KNode[], html: string) => boolean | Promise<boolean>
	/**
	 * 编辑器粘贴图片时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
	 */
	onPasteImage?: (this: Editor, file: File) => boolean | Promise<boolean>
	/**
	 * 编辑器粘贴视频时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
	 */
	onPasteVideo?: (this: Editor, file: File) => boolean | Promise<boolean>
	/**
	 * 编辑器粘贴除了图片和视频以外的文件时触发，需要自定义处理
	 */
	onPasteFile?: (this: Editor, file: File) => void | Promise<void>
	/**
	 * 编辑器内容改变触发
	 */
	onChange?: (this: Editor, newVal: string, oldVal: string) => void
	/**
	 * 编辑器光标发生变化触发
	 */
	onSelectionUpdate?: (this: Editor, selection: Selection) => void
	/**
	 * 换行时触发，换行操作后光标所在的块节点
	 */
	onInsertParagraph?: (this: Editor, node: KNode) => void
	/**
	 * 完成删除时触发
	 */
	onDeleteComplete?: (this: Editor) => void
	/**
	 * 光标在编辑器内时键盘按下触发
	 */
	onKeydown?: (this: Editor, event: KeyboardEvent) => void
	/**
	 * 光标在编辑器内时键盘松开触发
	 */
	onKeyup?: (this: Editor, event: KeyboardEvent) => void
	/**
	 * 编辑器聚焦时触发
	 */
	onFocus?: (this: Editor, event: FocusEvent) => void
	/**
	 * 编辑器失焦时触发
	 */
	onBlur?: (this: Editor, event: FocusEvent) => void
	/**
	 * 节点粘贴保留标记的自定义方法
	 */
	pasteKeepMarks?: (this: Editor, node: KNode) => KNodeMarksType
	/**
	 * 节点粘贴保留样式的自定义方法
	 */
	pasteKeepStyles?: (this: Editor, node: KNode) => KNodeStylesType
	/**
	 * 视图更新前回调方法
	 */
	beforeUpdateView?: (this: Editor) => void
	/**
	 * 视图更新后回调方法
	 */
	afterUpdateView?: (this: Editor) => void
	/**
	 * 在删除和换行操作中块节点节点从其父节点中抽离出去成为与父节点同级的节点后触发，如果返回true则表示继续使用默认逻辑，会将该节点转为段落，返回false则不走默认逻辑，需要自定义处理
	 */
	onDetachMentBlockFromParentCallback?: (this: Editor, node: KNode) => boolean
	/**
	 * 编辑器updateView执行时，通过比对新旧节点数组获取需要格式化的节点，在这些节点被格式化前，触发此方法，回调参数即当前需要被格式化的节点，该方法返回一个节点，返回的节点将会被格式化，如果你不需要任何特殊处理，返回入参提供的节点即可
	 */
	beforePatchNodeToFormat?: (this: Editor, node: KNode) => KNode

	/*--------------------------以下不作为编辑器内部属性-------------------------------*/

	/**
	 * 编辑器的初始默认值
	 */
	value: string
	/**
	 * 编辑器初始是否可编辑，默认true
	 */
	editable?: boolean
	/**
	 * 是否自动聚焦
	 */
	autofocus?: boolean
	/**
	 * 编辑器内容只有一个段落时的默认文本
	 */
	placeholder?: string
	/**
	 * 是否深色模式
	 */
	dark?: boolean
}

/**
 * 编辑器核心类
 */
export class Editor {
	/**
	 * 编辑器的真实dom【初始化后不可修改】
	 */
	$el?: HTMLElement
	/**
	 * 是否允许复制【初始化后可以修改】
	 */
	allowCopy: boolean = true
	/**
	 * 是否允许粘贴【初始化后可以修改】
	 */
	allowPaste: boolean = true
	/**
	 * 是否允许剪切【初始化后可以修改】
	 */
	allowCut: boolean = true
	/**
	 * 是否允许粘贴html【初始化后可以修改】
	 */
	allowPasteHtml: boolean = false
	/**
	 * 剪切板同时存在文件和html/text时，是否优先粘贴文件【初始化后可以修改】
	 */
	priorityPasteFiles: boolean = false
	/**
	 * 编辑器内渲染文本节点的真实标签【初始化后不建议修改】
	 */
	textRenderTag: string = 'span'
	/**
	 * 编辑内渲染默认块级节点的真实标签，即段落标签【初始化后不建议修改】
	 */
	blockRenderTag: string = 'p'
	/**
	 * 编辑器内定义需要置空的标签【初始化后不建议修改】
	 */
	emptyRenderTags: string[] = ['meta', 'link', 'style', 'script', 'title', 'base', 'noscript', 'template', 'annotation', 'input', 'form', 'button']
	/**
	 * 编辑器内额外保留的标签【初始化后不建议修改】
	 */
	extraKeepTags: string[] = []
	/**
	 * 插件数组【初始化后不可修改】
	 */
	extensions: Extension[] = [TextExtension, ImageExtension, VideoExtension, HistoryExtension, BoldExtension, ItalicExtension, StrikethroughExtension, UnderlineExtension, SuperscriptExtension, SubscriptExtension, CodeExtension, FontSizeExtension, FontFamilyExtension, ColorExtension, BackColorExtension, LinkExtension, AlignExtension, LineHeightExtension, IndentExtension, HorizontalExtension, BlockquoteExtension, HeadingExtension, ListExtension, TaskExtension, MathExtension, CodeBlockExtension, AttachmentExtension, TableExtension]
	/**
	 * 编辑器的节点数组格式化规则【初始化后不可修改】
	 */
	formatRules: RuleFunctionType[] = [fomratBlockTagParse, formatBlockInChildren, formatUneditableNoodes, formatPlaceholderMerge, formatZeroWidthTextMerge, formatSiblingNodesMerge, formatParentNodeMerge]
	/**
	 * 自定义dom转为非文本节点的后续处理【初始化后不可修改】
	 */
	domParseNodeCallback?: (this: Editor, node: KNode) => KNode
	/**
	 * 视图渲染时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要自定义渲染视图【初始化后不可修改】
	 */
	onUpdateView?: (this: Editor, init: boolean) => boolean | Promise<boolean>
	/**
	 * 编辑器粘贴纯文本时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理【初始化后不可修改】
	 */
	onPasteText?: (this: Editor, text: string) => boolean | Promise<boolean>
	/**
	 * 编辑器粘贴html内容时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理【初始化后不可修改】
	 */
	onPasteHtml?: (this: Editor, nodes: KNode[], html: string) => boolean | Promise<boolean>
	/**
	 * 编辑器粘贴图片时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理【初始化后不可修改】
	 */
	onPasteImage?: (this: Editor, file: File) => boolean | Promise<boolean>
	/**
	 * 编辑器粘贴视频时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理【初始化后不可修改】
	 */
	onPasteVideo?: (this: Editor, file: File) => boolean | Promise<boolean>
	/**
	 * 编辑器粘贴除了图片和视频以外的文件时触发，需要自定义处理【初始化后不可修改】
	 */
	onPasteFile?: (this: Editor, file: File) => void | Promise<void>
	/**
	 * 编辑器内容改变触发【初始化后不可修改】
	 */
	onChange?: (this: Editor, newVal: string, oldVal: string) => void
	/**
	 * 编辑器光标发生变化【初始化后不可修改】
	 */
	onSelectionUpdate?: (this: Editor, selection: Selection) => void
	/**
	 * 换行时触发，换行操作后光标所在的块节点
	 */
	onInsertParagraph?: (this: Editor, node: KNode) => void
	/**
	 * 完成删除时触发【初始化后不可修改】
	 */
	onDeleteComplete?: (this: Editor) => void
	/**
	 * 光标在编辑器内时键盘按下触发【初始化后不可修改】
	 */
	onKeydown?: (this: Editor, event: KeyboardEvent) => void
	/**
	 * 光标在编辑器内时键盘松开触发【初始化后不可修改】
	 */
	onKeyup?: (this: Editor, event: KeyboardEvent) => void
	/**
	 * 编辑器聚焦时触发【初始化后不可修改】
	 */
	onFocus?: (this: Editor, event: FocusEvent) => void
	/**
	 * 编辑器失焦时触发【初始化后不可修改】
	 */
	onBlur?: (this: Editor, event: FocusEvent) => void
	/**
	 * 节点粘贴保留标记的自定义方法【初始化后不可修改】
	 */
	pasteKeepMarks?: (this: Editor, node: KNode) => KNodeMarksType
	/**
	 * 节点粘贴保留样式的自定义方法【初始化后不可修改】
	 */
	pasteKeepStyles?: (this: Editor, node: KNode) => KNodeStylesType
	/**
	 * 视图更新前回调方法【初始化后不可修改】
	 */
	beforeUpdateView?: (this: Editor) => void
	/**
	 * 视图更新后回调方法【初始化后不可修改】
	 */
	afterUpdateView?: (this: Editor) => void
	/**
	 * 在删除和换行操作中块节点节点从其父节点中抽离出去成为与父节点同级的节点后触发，如果返回true则表示继续使用默认逻辑，会将该节点转为段落，返回false则不走默认逻辑，需要自定义处理【初始化后不可修改】
	 */
	onDetachMentBlockFromParentCallback?: (this: Editor, node: KNode) => boolean
	/**
	 * 编辑器updateView执行时，通过比对新旧节点数组获取需要格式化的节点，在这些节点被格式化前，触发此方法，回调参数即当前需要被格式化的节点，该方法返回一个节点，返回的节点将会被格式化，如果你不需要任何特殊处理，返回入参提供的节点即可【初始化后不可修改】
	 */
	beforePatchNodeToFormat?: (this: Editor, node: KNode) => KNode

	/*---------------------下面的属性都是不属于创建编辑器的参数---------------------------*/

	/**
	 * 唯一id【不可修改】
	 */
	guid: number = createGuid()
	/**
	 * 虚拟光标【不建议修改】
	 */
	selection: Selection = new Selection()
	/**
	 * 历史记录【不建议修改】
	 */
	history: History = new History()
	/**
	 * 命令集合【不可修改】
	 */
	commands: EditorCommandsType = {}
	/**
	 * 节点数组【不建议修改】
	 */
	stackNodes: KNode[] = []
	/**
	 * 旧节点数组【不可修改】
	 */
	oldStackNodes: KNode[] = []
	/**
	 * 是否在输入中文【不可修改】
	 */
	isComposition: boolean = false
	/**
	 * 是否编辑器内部渲染真实光标引起selctionChange事件【不可修改】
	 */
	internalCauseSelectionChange: boolean = false
	/**
	 * 是否用户操作的删除行为，如果是用户操作的删除行为，则在处理不可编辑的节点是会删除该节点，如果是API调用的删除方法则走正常的删除逻辑【不可修改】
	 */
	isUserDelection: boolean = false
	/**
	 * dom监听【不可修改】
	 */
	domObserver: MutationObserver | null = null

	/**
	 * 如果编辑器内有滚动条，滚动编辑器到光标可视范围
	 */
	scrollViewToSelection() {
		if (this.selection.focused()) {
			const focusDom = this.findDom(this.selection.end!.node)
			const scrollFunction = async (scrollEl: HTMLElement) => {
				const scrollHeight = DapElement.getScrollHeight(scrollEl)
				const scrollWidth = DapElement.getScrollWidth(scrollEl)
				//存在横向或者垂直滚动条
				if (scrollEl.clientHeight < scrollHeight || scrollEl.clientWidth < scrollWidth) {
					const selection = window.getSelection()!
					const range = selection.getRangeAt(0)
					const rects = range.getClientRects()
					let target: Range | HTMLElement = range
					if (rects.length == 0) {
						target = focusDom
					}
					const childRect = target.getBoundingClientRect()
					const parentRect = scrollEl.getBoundingClientRect()
					//存在垂直滚动条
					if (scrollEl.clientHeight < scrollHeight) {
						//如果光标所在节点不在视图内则滚动到视图内
						if (childRect.top < parentRect.top) {
							await DapElement.setScrollTop({
								el: scrollEl,
								number: 0
							})
							const tempChildRect = target.getBoundingClientRect()
							const tempParentRect = scrollEl.getBoundingClientRect()
							DapElement.setScrollTop({
								el: scrollEl,
								number: tempChildRect.top - tempParentRect.top
							})
						} else if (childRect.bottom > parentRect.bottom) {
							await DapElement.setScrollTop({
								el: scrollEl,
								number: 0
							})
							const tempChildRect = target.getBoundingClientRect()
							const tempParentRect = scrollEl.getBoundingClientRect()
							DapElement.setScrollTop({
								el: scrollEl,
								number: tempChildRect.bottom - tempParentRect.bottom
							})
						}
					}
					//存在横向滚动条
					if (scrollEl.clientWidth < scrollWidth) {
						//如果光标所在节点不在视图内则滚动到视图内
						if (childRect.left < parentRect.left) {
							await DapElement.setScrollLeft({
								el: scrollEl,
								number: 0
							})
							const tempChildRect = target.getBoundingClientRect()
							const tempParentRect = scrollEl.getBoundingClientRect()
							DapElement.setScrollLeft({
								el: scrollEl,
								number: tempChildRect.left - tempParentRect.left + 20
							})
						} else if (childRect.right > parentRect.right) {
							await DapElement.setScrollLeft({
								el: scrollEl,
								number: 0
							})
							const tempChildRect = target.getBoundingClientRect()
							const tempParentRect = scrollEl.getBoundingClientRect()
							DapElement.setScrollLeft({
								el: scrollEl,
								number: tempChildRect.right - tempParentRect.right + 20
							})
						}
					}
				}
			}
			let dom = focusDom
			while (DapElement.isElement(dom) && dom != document.documentElement) {
				scrollFunction(dom)
				dom = dom.parentNode as HTMLElement
			}
		}
	}

	/**
	 * 根据dom查找到编辑内的对应节点
	 */
	findNode(dom: HTMLElement) {
		if (!isContains(this.$el!, dom)) {
			throw new Error(`The dom should be in the editor area, but what you provide is not`)
		}
		const key = dom.getAttribute(NODE_MARK)
		if (!key) {
			throw new Error(`The dom generated by editor should all have a ${NODE_MARK} attribute, but your dom does not. Check for "updateView" related issues`)
		}
		const node = KNode.searchByKey(key, this.stackNodes)
		if (!node) {
			throw new Error(`Unexpected error occurred: the knode was not found in the editor`)
		}
		return node
	}

	/**
	 * 根据编辑器内的node查找真实dom
	 */
	findDom(node: KNode) {
		let dom: HTMLElement | null = null
		//获取所有的符合选择器的元素
		const doms = this.$el!.querySelectorAll(`[${NODE_MARK}="${node.key}"]`)
		//如果没有则抛出异常
		if (doms.length == 0) {
			throw new Error(`Unexpected error occurred: the dom was not found in the editor`)
		}
		//查找父元素匹配的元素
		const el = Array.from(doms).find(item => (node.parent ? item.parentElement && item.parentElement.getAttribute(`${NODE_MARK}`) == `${node.parent.key}` : item.parentElement === this.$el))
		//不存在则抛出异常
		if (!el) {
			throw new Error(`Unexpected error occurred: the dom was not found in the editor`)
		}
		dom = el as HTMLEmbedElement
		return dom as HTMLElement
	}

	/**
	 * 设置编辑器是否可编辑
	 */
	setEditable(editable: boolean) {
		if (editable) {
			this.$el?.setAttribute('contenteditable', 'true')
		} else {
			this.$el?.removeAttribute('contenteditable')
		}
		this.$el?.setAttribute('spellcheck', 'false')
	}

	/**
	 * 判断编辑器是否可编辑
	 */
	isEditable() {
		return this.$el?.getAttribute('contenteditable') == 'true'
	}

	/**
	 * 设置编辑器是否深色模式
	 */
	setDark(dark: boolean) {
		if (dark) {
			document.documentElement.setAttribute('kaitify-dark', '')
		} else {
			document.documentElement.removeAttribute('kaitify-dark')
		}
	}

	/**
	 * 是否深色模式
	 */
	isDark() {
		return document.documentElement.hasAttribute('kaitify-dark')
	}

	/**
	 * dom转KNode
	 */
	domParseNode(dom: Node) {
		if (dom.nodeType != 1 && dom.nodeType != 3) {
			throw new Error('The argument must be an element node or text node')
		}
		//文本节点
		if (dom.nodeType == 3) {
			return KNode.create({
				type: 'text',
				textContent: dom.textContent || ''
			})
		}
		//元素节点
		const marks = getDomAttributes(dom as HTMLElement) //标记
		const styles = getDomStyles(dom as HTMLElement) //样式
		const tag = dom.nodeName.toLocaleLowerCase() //标签名称
		const namespace = (dom as HTMLElement).namespaceURI //命名空间
		//如果是需要置为空的标签返回空文本节点
		if (this.emptyRenderTags.includes(tag)) {
			return KNode.create({
				type: 'text'
			})
		}
		//如果是默认的文本节点标签并且内部只有文本，则返回文本节点
		if (tag == this.textRenderTag && dom.childNodes.length && Array.from(dom.childNodes).every(childNode => childNode.nodeType == 3)) {
			return KNode.create({
				type: 'text',
				marks,
				styles,
				textContent: dom.textContent || ''
			})
		}
		//构造参数
		const config: KNodeCreateOptionType = {
			type: 'inline',
			tag,
			marks,
			styles,
			namespace: namespace || ''
		}
		//默认的块节点
		if (['p', 'div', 'address', 'article', 'aside', 'nav', 'section'].includes(tag)) {
			config.type = 'block'
			config.children = []
		}
		//默认的行内节点
		else if (['span', 'label'].includes(tag)) {
			config.type = 'inline'
			config.children = []
		}
		//默认的自闭合节点
		else if (['br'].includes(tag)) {
			config.type = 'closed'
		}
		//其余元素如果不在extraKeepTags范围内则默认转为行内的默认文本节点标签
		else if (!this.extraKeepTags.includes(tag)) {
			config.type = 'inline'
			config.tag = this.textRenderTag
			config.namespace = ''
			config.children = []
		}
		let node = KNode.create(config)
		//如果不是闭合节点则设置子节点
		if (!closed) {
			Array.from(dom.childNodes).forEach(child => {
				if (child.nodeType == 1 || child.nodeType == 3) {
					const childNode = this.domParseNode(child)
					childNode.parent = node
					if (node.hasChildren()) {
						node.children!.push(childNode)
					} else {
						node.children = [childNode]
					}
				}
			})
		}
		//转换后的回调处理，在这里可以自定义处理节点
		if (typeof this.domParseNodeCallback == 'function') {
			node = this.domParseNodeCallback.apply(this, [node])
		}
		return node
	}

	/**
	 * html转KNode
	 */
	htmlParseNode(html: string) {
		const template = document.createElement('template')
		template.innerHTML = html
		const nodes: KNode[] = []
		template.content.childNodes.forEach(item => {
			if (item.nodeType == 1 || item.nodeType == 3) {
				const node = this.domParseNode(item)
				nodes.push(node)
			}
		})
		return nodes
	}

	/**
	 * 将指定节点所在的块节点转为段落
	 */
	toParagraph(node: KNode) {
		if (!node.isBlock()) {
			node = node.getBlock()
		}
		node.tag = this.blockRenderTag
		node.marks = {}
		node.styles = {}
		node.fixed = false
		node.nested = false
		node.locked = false
		node.namespace = ''
	}

	/**
	 * 指定的块节点是否是一个段落
	 */
	isParagraph(node: KNode) {
		if (!node.isBlock()) {
			return false
		}
		return node.isMatch({ tag: this.blockRenderTag }) && !node.hasMarks() && !node.hasStyles()
	}

	/**
	 * 将指定节点添加到某个节点的子节点数组里
	 */
	addNode(node: KNode, parentNode: KNode, index: number | undefined = 0) {
		//排除空节点
		if (node.isEmpty()) {
			return
		}
		//父节点不能是文本节点或者闭合节点
		if (parentNode.isText() || parentNode.isClosed()) {
			return
		}
		//不存在子节点，初始为空数组
		if (!parentNode.hasChildren()) {
			parentNode.children = []
		}
		if (index >= parentNode.children!.length) {
			parentNode.children!.push(node)
		} else {
			parentNode.children!.splice(index, 0, node)
		}
		node.parent = parentNode
	}

	/**
	 * 将指定节点添加到某个节点前面
	 */
	addNodeBefore(node: KNode, target: KNode) {
		if (target.parent) {
			const index = target.parent!.children!.findIndex(item => {
				return target.isEqual(item)
			})
			this.addNode(node, target.parent!, index)
		} else {
			const index = this.stackNodes.findIndex(item => {
				return target.isEqual(item)
			})
			this.stackNodes.splice(index, 0, node)
			node.parent = undefined
		}
	}

	/**
	 * 将指定节点添加到某个节点后面
	 */
	addNodeAfter(node: KNode, target: KNode) {
		if (target.parent) {
			const index = target.parent!.children!.findIndex(item => {
				return target.isEqual(item)
			})
			this.addNode(node, target.parent!, index + 1)
		} else {
			const index = this.stackNodes.findIndex(item => {
				return target.isEqual(item)
			})
			this.stackNodes.splice(index + 1, 0, node)
			node.parent = undefined
		}
	}

	/**
	 * 获取某个节点内的最后一个可以设置光标点的节点，包括自身
	 */
	getLastSelectionNodeInChildren(node: KNode): KNode | null {
		//空节点
		if (node.isEmpty()) {
			return null
		}
		//子节点是不可见节点
		if (node.void) {
			return null
		}
		//文本节点和闭合节点返回自身
		if (node.isText() || node.isClosed()) {
			return node
		}
		let selectionNode = null
		const length = node.children!.length
		//遍历子节点
		for (let i = length - 1; i >= 0; i--) {
			const child = node.children![i]
			selectionNode = this.getLastSelectionNodeInChildren(child)
			//这里如果在子节点中找到了可以设置光标点的节点，一定要break直接终止for循环的执行
			if (selectionNode) {
				break
			}
		}
		return selectionNode
	}

	/**
	 * 获取某个节点内的第一个可以设置光标点的节点，包括自身
	 */
	getFirstSelectionNodeInChildren(node: KNode): KNode | null {
		//空节点
		if (node.isEmpty()) {
			return null
		}
		//子节点是不可见节点
		if (node.void) {
			return null
		}
		//文本节点和闭合节点返回自身
		if (node.isText() || node.isClosed()) {
			return node
		}
		let selectionNode = null
		const length = node.children!.length
		//遍历子节点
		for (let i = 0; i < length; i++) {
			const child = node.children![i]
			selectionNode = this.getFirstSelectionNodeInChildren(child)
			//这里如果在子节点中找到了可以设置光标点的节点，一定要break直接终止for循环的执行
			if (selectionNode) {
				break
			}
		}
		return selectionNode
	}

	/**
	 * 查找指定节点之前可以设置为光标点的非空节点，不包括自身
	 */
	getPreviousSelectionNode(node: KNode): KNode | null {
		const nodes = node.parent ? node.parent.children! : this.stackNodes
		//获取前一个节点
		const previousNode = node.getPrevious(nodes)
		//前一个节点存在
		if (previousNode) {
			//是空节点，则跳过继续向前
			if (previousNode.isEmpty()) {
				return this.getPreviousSelectionNode(previousNode)
			}
			//是不可见节点，则跳过继续向前
			if (previousNode.void) {
				return this.getPreviousSelectionNode(previousNode)
			}
			//是文本节点或者闭合节点
			if (previousNode.isText() || previousNode.isClosed()) {
				return previousNode
			}
			//其他节点：查找子节点中的最后一个可以设置光标点的节点
			return this.getLastSelectionNodeInChildren(previousNode)
		}
		//前一个节点不存在的情况，说明该节点是节点数组中的第一个节点
		return node.parent ? this.getPreviousSelectionNode(node.parent) : null
	}

	/**
	 * 查找指定节点之后可以设置为光标点的非空节点，不包括自身
	 */
	getNextSelectionNode(node: KNode): KNode | null {
		const nodes = node.parent ? node.parent.children! : this.stackNodes
		//获取后一个节点
		const nextNode = node.getNext(nodes)
		//后一个节点存在
		if (nextNode) {
			//是空节点，则跳过继续向后
			if (nextNode.isEmpty()) {
				return this.getNextSelectionNode(nextNode)
			}
			//是不可见节点，则跳过继续向后
			if (nextNode.void) {
				return this.getNextSelectionNode(nextNode)
			}
			//是文本节点或者闭合节点
			if (nextNode.isText() || nextNode.isClosed()) {
				return nextNode
			}
			//其他节点：查找子节点中的第一个可以设置光标点的节点
			return this.getFirstSelectionNodeInChildren(nextNode)
		}
		//后一个节点不存在的情况，说明该节点是节点数组中的最后一个节点
		return node.parent ? this.getNextSelectionNode(node.parent) : null
	}

	/**
	 * 设置光标到指定节点内部的起始处，如果没有指定节点则设置光标到编辑器起始处，start表示只设置起点，end表示只设置终点，all表示起点和终点都设置
	 */
	setSelectionBefore(node?: KNode, type: 'all' | 'start' | 'end' | undefined = 'all') {
		//指定到某个节点
		if (node) {
			const selectionNode = this.getFirstSelectionNodeInChildren(node)
			if (selectionNode) {
				if (type == 'start' || type == 'all') {
					this.selection.start = {
						node: selectionNode,
						offset: 0
					}
				}
				if (type == 'end' || type == 'all') {
					this.selection.end = {
						node: selectionNode,
						offset: 0
					}
				}
			}
		}
		//指定到文档前面
		else {
			//获取第一个节点
			const firstNode = this.stackNodes[0]
			//获取firstNode中的第一个可以设置光标点的节点
			let selectionNode = this.getFirstSelectionNodeInChildren(firstNode)
			//如果firstNode不能设置光标点，则向后查询
			if (!selectionNode) selectionNode = this.getNextSelectionNode(firstNode)
			//如果firstNode可以设置光标点
			if (selectionNode) {
				if (type == 'start' || type == 'all') {
					this.selection.start = {
						node: selectionNode,
						offset: 0
					}
				}
				if (type == 'end' || type == 'all') {
					this.selection.end = {
						node: selectionNode,
						offset: 0
					}
				}
			}
		}
	}

	/**
	 * 设置光标到指定节点内部的末尾处，如果没有指定节点则设置光标到编辑器末尾处，start表示只设置起点，end表示只设置终点，all表示起点和终点都设置
	 */
	setSelectionAfter(node?: KNode, type: 'all' | 'start' | 'end' | undefined = 'all') {
		//指定到某个节点
		if (node) {
			const selectionNode = this.getLastSelectionNodeInChildren(node)
			if (selectionNode) {
				if (type == 'start' || type == 'all') {
					this.selection.start = {
						node: selectionNode,
						offset: selectionNode.isText() ? selectionNode.textContent!.length : 1
					}
				}
				if (type == 'end' || type == 'all') {
					this.selection.end = {
						node: selectionNode,
						offset: selectionNode.isText() ? selectionNode.textContent!.length : 1
					}
				}
			}
		}
		//指定到文档前面
		else {
			//获取最后一个节点
			const lastNode = this.stackNodes[this.stackNodes.length - 1]
			//获取lastNode中的最后一个可以设置光标点的节点
			let selectionNode = this.getLastSelectionNodeInChildren(lastNode)
			//如果lastNode不能设置光标点，则向前查询
			if (!selectionNode) selectionNode = this.getPreviousSelectionNode(lastNode)
			//如果lastNode可以设置光标点
			if (selectionNode) {
				if (type == 'start' || type == 'all') {
					this.selection.start = {
						node: selectionNode,
						offset: selectionNode.isText() ? selectionNode.textContent!.length : 1
					}
				}
				if (type == 'end' || type == 'all') {
					this.selection.end = {
						node: selectionNode,
						offset: selectionNode.isText() ? selectionNode.textContent!.length : 1
					}
				}
			}
		}
	}

	/**
	 * 更新指定光标到离当前光标点最近的节点上，start表示只更新起点，end表示只更新终点，all表示起点和终点都更新，不包括当前光标所在节点
	 */
	updateSelectionRecently(type: 'all' | 'start' | 'end' | undefined = 'all') {
		if (!this.selection.focused()) {
			return
		}
		if (type == 'start' || type == 'all') {
			const previousNode = this.getPreviousSelectionNode(this.selection.start!.node)
			const nextNode = this.getNextSelectionNode(this.selection.start!.node)
			const blockNode = this.selection.start!.node.getBlock()
			if (previousNode && blockNode.isContains(previousNode)) {
				this.selection.start!.node = previousNode
				this.selection.start!.offset = previousNode.isText() ? previousNode.textContent!.length : 1
			} else if (nextNode && blockNode.isContains(nextNode)) {
				this.selection.start!.node = nextNode
				this.selection.start!.offset = 0
			} else if (previousNode) {
				this.selection.start!.node = previousNode
				this.selection.start!.offset = previousNode.isText() ? previousNode.textContent!.length : 1
			} else if (nextNode) {
				this.selection.start!.node = nextNode
				this.selection.start!.offset = 0
			}
		}
		if (type == 'end' || type == 'all') {
			const previousNode = this.getPreviousSelectionNode(this.selection.end!.node)
			const nextNode = this.getNextSelectionNode(this.selection.end!.node)
			const blockNode = this.selection.end!.node.getBlock()
			if (previousNode && blockNode.isContains(previousNode)) {
				this.selection.end!.node = previousNode
				this.selection.end!.offset = previousNode.isText() ? previousNode.textContent!.length : 1
			} else if (nextNode && blockNode.isContains(nextNode)) {
				this.selection.end!.node = nextNode
				this.selection.end!.offset = 0
			} else if (previousNode) {
				this.selection.end!.node = previousNode
				this.selection.end!.offset = previousNode.isText() ? previousNode.textContent!.length : 1
			} else if (nextNode) {
				this.selection.end!.node = nextNode
				this.selection.end!.offset = 0
			}
		}
	}

	/**
	 * 判断光标是否在某个节点内，start表示只判断起点，end表示只判断终点，all表示起点和终点都判断
	 */
	isSelectionInNode(node: KNode, type: 'all' | 'start' | 'end' | undefined = 'all') {
		//没有初始化设置光标
		if (!this.selection.focused()) {
			return false
		}
		if (type == 'start') {
			return node.isContains(this.selection.start!.node)
		}
		if (type == 'end') {
			return node.isContains(this.selection.end!.node)
		}
		if (type == 'all') {
			return node.isContains(this.selection.start!.node) && node.isContains(this.selection.end!.node)
		}
	}

	/**
	 * 获取光标选区内的节点数据
	 */
	getSelectedNodes(): EditorSelectedType[] {
		//没有聚焦或者没有选区
		if (!this.selection.focused() || this.selection.collapsed()) {
			return []
		}
		const startNode = this.selection.start!.node
		const endNode = this.selection.end!.node
		const startOffset = this.selection.start!.offset
		const endOffset = this.selection.end!.offset

		//起点和终点在一个节点内
		if (startNode.isEqual(endNode)) {
			//闭合节点
			if (startNode.isClosed()) {
				return [
					{
						node: startNode,
						offset: false
					}
				]
			}
			//文本节点
			return [
				{
					node: startNode,
					offset: startOffset == 0 && endOffset == startNode.textContent!.length ? false : [startOffset, endOffset]
				}
			]
		}

		//起点和终点不在一个节点内时
		const result: EditorSelectedType[] = []
		let node = startNode
		//遍历到终点所在节点时，循环结束
		while (true) {
			//是起点所在节点
			if (node.isEqual(startNode)) {
				if (startOffset == 0) {
					result.push({
						node: node,
						offset: false
					})
				} else if (node.isText() && startOffset < node.textContent!.length) {
					result.push({
						node: node,
						offset: [startOffset, node.textContent!.length]
					})
				}
			}
			//是终点所在节点
			else if (node.isEqual(endNode)) {
				if (endOffset == (node.isText() ? node.textContent!.length : 1)) {
					result.push({
						node: node,
						offset: false
					})
				} else if (node.isText() && endOffset > 0) {
					result.push({
						node: node,
						offset: [0, endOffset]
					})
				}
				break
			}
			//不是起点和终点所在节点
			else {
				//包含终点
				if (node.isContains(endNode)) {
					//获取该节点最后一个可以设置光标的节点
					const lastSelectionNode = this.getLastSelectionNodeInChildren(node)!
					//如果终点所在节点是它最后一个可以设置光标的节点，并且光标在末尾处
					if (endNode.isEqual(lastSelectionNode) && endOffset == (endNode.isText() ? endNode.textContent!.length : 1)) {
						result.push({
							node,
							offset: false
						})
						break
					}
					//只有部分在选区内，处理子节点
					node = node.children![0]
					continue
				}
				//不包含终点，则说明节点完全在选区内
				result.push({
					node: node,
					offset: false
				})
			}
			//下一个节点
			let tempNode: KNode = node
			let nextNode: KNode | null = null
			while (true) {
				//获取下一个节点
				nextNode = tempNode.getNext(tempNode.parent ? tempNode.parent!.children! : this.stackNodes)
				if (nextNode || !tempNode.parent) {
					break
				}
				tempNode = tempNode.parent
			}
			if (nextNode) {
				node = nextNode
				continue
			}
			break
		}
		return result
	}

	/**
	 * 判断光标范围内的可聚焦节点是否全都在同一个符合条件节点内，如果是返回那个符合条件的节点，否则返回null
	 */
	getMatchNodeBySelection(options: KNodeMatchOptionType) {
		//没有聚焦
		if (!this.selection.focused()) {
			return null
		}
		//起点和终点在一起
		if (this.selection.collapsed()) {
			return this.selection.start!.node.getMatchNode(options)
		}
		//起点和终点不在一起的情况，获取所有可聚焦的节点
		const nodes = this.getFocusNodesBySelection('all')
		if (nodes.length == 0) {
			return null
		}
		//获取第一个可聚焦节点所在的符合条件的节点
		const matchNode = nodes[0].getMatchNode(options)
		//如果后续每个可聚焦节点都在该节点内，返回该节点
		if (matchNode && nodes.every(item => matchNode.isContains(item))) {
			return matchNode
		}
		return null
	}

	/**
	 * 判断光标范围内的可聚焦节点是否全都在符合条件的（不一定是同一个）节点内
	 */
	isSelectionNodesAllMatch(options: KNodeMatchOptionType) {
		//没有聚焦
		if (!this.selection.focused()) {
			return false
		}
		//起点和终点在一起
		if (this.selection.collapsed()) {
			return !!this.selection.start!.node.getMatchNode(options)
		}
		//起点和终点不在一起的情况，获取所有可聚焦的节点进行判断
		const focusNodes = this.getFocusNodesBySelection('all')
		if (focusNodes.length == 0) {
			return false
		}
		return focusNodes.every(item => !!item.getMatchNode(options))
	}

	/**
	 * 判断光标范围内是否有可聚焦节点在符合条件的节点内
	 */
	isSelectionNodesSomeMatch(options: KNodeMatchOptionType) {
		//没有聚焦
		if (!this.selection.focused()) {
			return false
		}
		//起点和终点在一起
		if (this.selection.collapsed()) {
			return !!this.selection.start!.node.getMatchNode(options)
		}
		//起点和终点不在一起的情况，获取所有可聚焦的节点进行判断
		const focusNodes = this.getFocusNodesBySelection('all')
		if (focusNodes.length == 0) {
			return false
		}
		return focusNodes.some(item => !!item.getMatchNode(options))
	}

	/**
	 * 获取所有在光标范围内的可聚焦节点，该方法拿到的可聚焦节点（文本）可能部分区域不在光标范围内
	 */
	getFocusNodesBySelection(type: 'all' | 'closed' | 'text' | undefined = 'all') {
		if (!this.selection.focused() || this.selection.collapsed()) {
			return []
		}
		const nodes: KNode[] = []
		this.getSelectedNodes().forEach(item => {
			nodes.push(...item.node.getFocusNodes(type))
		})
		return nodes
	}

	/**
	 * 获取所有在光标范围内的可聚焦节点，该方法可能会切割部分文本节点，摒弃其不在光标范围内的部分，所以也可能会更新光标的位置
	 */
	getFocusSplitNodesBySelection(type: 'all' | 'closed' | 'text' | undefined = 'all') {
		if (!this.selection.focused() || this.selection.collapsed()) {
			return []
		}
		const nodes: KNode[] = []
		this.getSelectedNodes().forEach(item => {
			//文本节点
			if (item.node.isText() && (type == 'all' || type == 'text')) {
				//选择部分文本
				if (item.offset) {
					const textContent = item.node.textContent!
					//选中了文本的前半段
					if (item.offset[0] == 0) {
						const newTextNode = item.node.clone(true)
						this.addNodeAfter(newTextNode, item.node)
						item.node.textContent = textContent.substring(0, item.offset[1])
						newTextNode.textContent = textContent.substring(item.offset[1])
						nodes.push(item.node)
					}
					//选中了文本的后半段
					else if (item.offset[1] == textContent.length) {
						const newTextNode = item.node.clone(true)
						this.addNodeBefore(newTextNode, item.node)
						newTextNode.textContent = textContent.substring(0, item.offset[0])
						item.node.textContent = textContent.substring(item.offset[0])
						nodes.push(item.node)
					}
					//选中文本中间部分
					else {
						const newBeforeTextNode = item.node.clone(true)
						const newAfterTextNode = item.node.clone(true)
						this.addNodeBefore(newBeforeTextNode, item.node)
						this.addNodeAfter(newAfterTextNode, item.node)
						newBeforeTextNode.textContent = textContent.substring(0, item.offset[0])
						item.node.textContent = textContent.substring(item.offset[0], item.offset[1])
						newAfterTextNode.textContent = textContent.substring(item.offset[1])
						nodes.push(item.node)
					}
					//重置光标位置
					if (this.isSelectionInNode(item.node, 'start')) {
						this.setSelectionBefore(item.node, 'start')
					}
					if (this.isSelectionInNode(item.node, 'end')) {
						this.setSelectionAfter(item.node, 'end')
					}
				}
				//选择整个文本
				else {
					nodes.push(item.node)
				}
			}
			//闭合节点
			else if (item.node.isClosed() && (type == 'all' || type == 'closed')) {
				nodes.push(item.node)
			}
			//非文本节点存在子节点数组
			else if (item.node.hasChildren()) {
				nodes.push(...item.node.getFocusNodes(type))
			}
		})
		return nodes
	}

	/**
	 * 向选区插入文本
	 */
	insertText(text: string) {
		if (!text) {
			return
		}
		if (!this.selection.focused()) {
			return
		}
		//统一将\r\n换成\n，解决Windows兼容问题
		text = text.replace(/\r\n/g, '\n')
		//起点和终点在一个位置
		if (this.selection.collapsed()) {
			const node = this.selection.start!.node
			const offset = this.selection.start!.offset
			//不是在拥有代码块样式的块级节点内，则将空格转换成&nbsp;
			if (!node.isInCodeBlockStyle()) {
				text = text.replace(/\s/g, () => {
					const span = document.createElement('span')
					span.innerHTML = '&nbsp;'
					return span.innerText
				})
			}
			//光标所在节点是文本节点
			if (node.isText()) {
				node.textContent = node.textContent!.substring(0, offset) + text + node.textContent!.substring(offset)
				this.selection.start!.offset = this.selection.end!.offset = this.selection.start!.offset + text.length
			}
			//光标所在节点是闭合节点
			else {
				const textNode = KNode.create({
					type: 'text',
					textContent: text
				})
				offset == 0 ? this.addNodeBefore(textNode, node) : this.addNodeAfter(textNode, node)
				this.setSelectionAfter(textNode)
			}
		}
		//起点和终点不在一个位置，即存在选区
		else {
			this.delete()
			this.insertText(text)
		}
	}

	/**
	 * 向选区进行换行，如果所在块节点只有占位符并且块节点不是段落则会转为段落
	 */
	insertParagraph() {
		if (!this.selection.focused()) {
			return
		}
		//起点和终点在一起
		if (this.selection.collapsed()) {
			//光标所在节点
			const node = this.selection.start!.node
			//光标所在块节点
			const blockNode = node.getBlock()
			//如果在代码块样式内
			if (node.isInCodeBlockStyle()) {
				this.insertText('\n')
				const zeroWidthText = KNode.createZeroWidthText()
				this.insertNode(zeroWidthText)
				this.setSelectionAfter(zeroWidthText, 'all')
				if (typeof this.onInsertParagraph == 'function') {
					this.onInsertParagraph.apply(this, [blockNode])
				}
			}
			//在非代码块样式内，且不是固定的块节点
			else if (!blockNode.fixed) {
				//块节点只有占位符，并且存在父节点，且父节点不是固定块节点
				if (blockNode.allIsPlaceholder() && blockNode.parent && !blockNode.parent.fixed) {
					//将块节点从父节点中抽离到父节点同级
					removeBlockFromParentToSameLevel.apply(this, [blockNode])
					//是否走默认逻辑
					const useDefault = typeof this.onDetachMentBlockFromParentCallback == 'function' ? this.onDetachMentBlockFromParentCallback.apply(this, [blockNode]) : true
					//走默认逻辑，将非段落的块节点转为段落
					if (useDefault && !this.isParagraph(blockNode)) {
						this.toParagraph(blockNode)
					}
					//触发换行事件
					if (typeof this.onInsertParagraph == 'function') {
						this.onInsertParagraph.apply(this, [blockNode])
					}
				}
				//块节点只有占位符，并且不存在父节点，且不是段落
				else if (blockNode.allIsPlaceholder() && !blockNode.parent && !this.isParagraph(blockNode)) {
					//转为段落
					this.toParagraph(blockNode)
					//触发换行事件
					if (typeof this.onInsertParagraph == 'function') {
						this.onInsertParagraph.apply(this, [blockNode])
					}
				}
				//其他情况正常换行
				else {
					handlerForNormalInsertParagraph.apply(this)
				}
			}
		}
		//起点和终点不在一起
		else {
			this.delete()
			this.insertParagraph()
		}
	}

	/**
	 * 向选区插入节点，cover为true表示当向某个只有占位符的非固定块节点被插入另一个非固定块节点时是否覆盖此节点，而不是直接插入进去
	 */
	insertNode(node: KNode, cover: boolean | undefined = false) {
		//未聚焦不处理
		if (!this.selection.focused()) {
			return
		}
		//空节点不处理
		if (node.isEmpty()) {
			return
		}
		//起点和终点在一起
		if (this.selection.collapsed()) {
			//光标所在节点
			const selectionNode = this.selection.start!.node
			//光标偏移值
			const offset = this.selection.start!.offset
			//光标所在节点的块节点
			const blockNode = selectionNode.getBlock()
			//块节点的第一个可设光标的节点
			const firstSelectionNode = this.getFirstSelectionNodeInChildren(blockNode)!
			//块节点的最后一个可设光标的节点
			const lastSelectionNode = this.getLastSelectionNodeInChildren(blockNode)!
			//光标所在块节点是非固定块节点，插入的也是非固定块节点
			if (!blockNode.fixed && node.isBlock() && !node.fixed) {
				//光标在代码块样式内则将该节点转为行内节点后重新执行插入
				if (selectionNode.isInCodeBlockStyle()) {
					node.type = 'inline'
					this.insertNode(node, cover)
					return
				}
				//光标所在块节点只有换行符且cover为true，则替换当前块节点
				if (blockNode.allIsPlaceholder() && cover) {
					this.addNodeBefore(node, blockNode)
					blockNode.toEmpty()
				}
				//光标在块节点的起始处，则在块节点之前插入
				else if (firstSelectionNode.isEqual(selectionNode) && offset == 0) {
					this.addNodeBefore(node, blockNode)
				}
				//光标在块节点的末尾处，则在块节点之后插入
				else if (lastSelectionNode.isEqual(selectionNode) && offset == (selectionNode.isText() ? selectionNode.textContent!.length : 1)) {
					this.addNodeAfter(node, blockNode)
				}
				//光标在块节点的中间部分则需要分割
				else {
					//执行换行
					this.insertParagraph()
					//获取换行后光标位置所在的块节点
					const newBlockNode = this.selection.start!.node.getBlock()
					//在新的块节点之前插入
					this.addNodeBefore(node, newBlockNode)
				}
			}
			//其他情况
			else {
				//光标在文本节点或者闭合节点的起始处
				if (offset == 0) {
					this.addNodeBefore(node, selectionNode)
				}
				//光标在文本节点或者闭合节点的末尾处
				else if (offset == (selectionNode.isText() ? selectionNode.textContent!.length : 1)) {
					this.addNodeAfter(node, selectionNode)
				}
				//光标在文本节点内
				else {
					const val = selectionNode.textContent!
					const newTextNode = selectionNode.clone()
					selectionNode.textContent = val.substring(0, offset)
					newTextNode.textContent = val.substring(offset)
					this.addNodeAfter(newTextNode, selectionNode)
					this.addNodeBefore(node, newTextNode)
				}
			}
			//重置光标
			this.setSelectionAfter(node, 'all')
		}
		//起点和终点不在一起
		else {
			this.delete()
			this.insertNode(node, cover)
		}
	}

	/**
	 * 对选区进行删除
	 */
	delete() {
		if (!this.selection.focused()) {
			return
		}
		//起点和终点在一起
		if (this.selection.collapsed()) {
			const node = this.selection.start!.node
			const uneditableNode = node.getUneditable()
			//是用户操作的删除行为并且在不可编辑的节点里，则直接删除该不可编辑的节点
			if (this.isUserDelection && uneditableNode) {
				uneditableNode.toEmpty()
			}
			//否则走正常删除逻辑
			else {
				const offset = this.selection.start!.offset
				//前一个可设置光标的节点
				const previousSelectionNode = this.getPreviousSelectionNode(node)
				//光标所在的块节点
				const blockNode = node.getBlock()
				//光标在节点的起始处
				if (offset == 0) {
					//前一个可设置光标的节点存在
					if (previousSelectionNode) {
						//获取前一个可设置光标的节点所在的块节点
						const previousBlock = previousSelectionNode.getBlock()
						//前一个可设置光标的节点和光标所在节点都属于一个块节点，则表示当前光标所在节点不是块节点的起始处，则将光标移动到前一个可设置光标的节点的末尾处再执行一次删除
						if (previousBlock.isEqual(blockNode)) {
							this.setSelectionAfter(previousSelectionNode, 'all')
							this.delete()
							return
						}
						//光标在块节点的开始处并且块节点不是固定的
						else if (!blockNode.fixed) {
							//块节点的父节点存在，且父节点不包含前一个可设置光标的节点所在的块节点（块节点在父节点的第一个），且父节点不是固定的
							if (blockNode.parent && !blockNode.parent.isContains(previousBlock) && !blockNode.parent.fixed) {
								//将块节点从父节点中抽离到父节点同级
								removeBlockFromParentToSameLevel.apply(this, [blockNode])
								//是否走默认逻辑
								const useDefault = typeof this.onDetachMentBlockFromParentCallback == 'function' ? this.onDetachMentBlockFromParentCallback.apply(this, [blockNode]) : true
								//走默认逻辑，将非段落的块节点转为段落
								if (useDefault && !this.isParagraph(blockNode)) {
									this.toParagraph(blockNode)
								}
							}
							//块节点不存在父节点，或者父节点包含前一个可设置光标的节点所在的块节点（块节点不是父节点的第一个）
							else if (!blockNode.parent || blockNode.parent.isContains(previousBlock)) {
								mergeBlock.apply(this, [previousBlock, blockNode])
							}
						}
						//是固定的块节点就不用处理
					}
					//光标在编辑器开始处
					else {
						//光标所在的块节点存在非固定的父节点
						if (blockNode.parent && !blockNode.parent.fixed) {
							//将块节点从父节点中抽离到父节点同级
							removeBlockFromParentToSameLevel.apply(this, [blockNode])
							//是否走默认逻辑
							const useDefault = typeof this.onDetachMentBlockFromParentCallback == 'function' ? this.onDetachMentBlockFromParentCallback.apply(this, [blockNode]) : true
							//走默认逻辑，将非段落的块节点转为段落
							if (useDefault && !this.isParagraph(blockNode)) {
								this.toParagraph(blockNode)
							}
						}
						//光标所在的块节点非段落节点，且非固定块节点，且不存在父节点
						else if (!this.isParagraph(blockNode) && !blockNode.fixed && !blockNode.parent) {
							//转为段落
							this.toParagraph(blockNode)
						}
					}
				}
				//光标在所在节点的内部
				else {
					//在空白文本节点内
					if (node.isZeroWidthText()) {
						//置空节点
						node.toEmpty()
						//在清除空白文本节点后判断块节点是否为空，是则建立占位符
						if (blockNode.isEmpty()) {
							const placeholderNode = KNode.createPlaceholder()
							this.addNode(placeholderNode, blockNode)
							this.setSelectionBefore(placeholderNode)
						}
						//块节点不是空，将光标移动到该节点前面
						else {
							this.selection.start!.node = this.selection.end!.node = node
							this.selection.start!.offset = this.selection.end!.offset = 0
						}
						//再执行一次删除
						this.delete()
						return
					}
					//在文本节点内
					else if (node.isText()) {
						//获取删除的字符
						const deleteChart = node.textContent!.substring(offset - 1, offset)
						//进行删除
						node.textContent = node.textContent!.substring(0, offset - 1) + node.textContent!.substring(offset)
						//更新光标到删除后的位置
						this.selection.start!.offset = offset - 1
						this.selection.end!.offset = offset - 1
						//删除的是空白字符，再次删除
						if (isZeroWidthText(deleteChart)) {
							this.delete()
							return
						}
						//块节点为空，创建占位符
						if (blockNode.isEmpty()) {
							const placeholderNode = KNode.createPlaceholder()
							this.addNode(placeholderNode, blockNode)
							this.setSelectionBefore(placeholderNode)
						}
					}
					//在闭合节点内
					else if (node.isClosed()) {
						//是否占位符
						const isPlaceholder = node.isPlaceholder()
						//删除闭合节点
						node.toEmpty()
						//块节点为空
						if (blockNode.isEmpty()) {
							//删除的是占位符
							if (isPlaceholder) {
								//块节点是固定状态的，则创建占位符；
								if (blockNode.fixed) {
									const placeholderNode = KNode.createPlaceholder()
									this.addNode(placeholderNode, blockNode)
									this.setSelectionBefore(placeholderNode)
								}
								//块节点不是固定状态的，且前一个可获取光标的节点不存在则说明光标在编辑器起始处，创建占位符
								else if (!blockNode.fixed && !previousSelectionNode) {
									const placeholderNode = KNode.createPlaceholder()
									this.addNode(placeholderNode, blockNode)
									this.setSelectionBefore(placeholderNode)
									//转为段落
									blockNode.tag = this.blockRenderTag
									blockNode.marks = {}
									blockNode.styles = {}
								}
								//其余情况就是块节点被删除，光标自动更新到附近位置
							}
							//删除的不是占位符
							else {
								const placeholderNode = KNode.createPlaceholder()
								this.addNode(placeholderNode, blockNode)
								this.setSelectionBefore(placeholderNode)
							}
						}
					}
				}
			}
		}
		//起点和终点不在一起
		else {
			//获取选区内的节点信息
			const result = this.getSelectedNodes().filter(item => {
				//批量删除时需要过滤掉那些不显示的节点
				return !item.node.void
			})
			//起点所在块节点
			const startBlockNode = this.selection.start!.node.getBlock()
			//终点所在块节点
			const endBlockNode = this.selection.end!.node.getBlock()
			result.forEach(item => {
				const { node, offset } = item
				//是数组的情况，说明node是文本节点，需要进行裁剪
				if (offset) {
					node.textContent = node.textContent!.substring(0, offset[0]) + node.textContent!.substring(offset[1])
				}
				//说明节点都在选区内
				else {
					//固定状态的块节点，进行清空处理
					if (node.isBlock() && node.fixed) {
						emptyFixedBlock.apply(this, [node])
					}
					//其他节点置空进行删除
					else {
						node.toEmpty()
					}
				}
			})
			//起点和终点在同一个块节点下
			if (startBlockNode.isEqual(endBlockNode)) {
				//块节点为空创建占位符
				if (startBlockNode.isEmpty()) {
					const placeholder = KNode.createPlaceholder()
					this.addNode(placeholder, startBlockNode)
					this.setSelectionBefore(placeholder)
				}
			}
			//起点和终点不在一个块节点的情况下，需要考虑块节点合并
			else {
				//起点所在块节点为空，创建占位符
				if (startBlockNode.isEmpty()) {
					const placeholder = KNode.createPlaceholder()
					this.addNode(placeholder, startBlockNode)
					this.setSelectionBefore(placeholder, 'start')
				}
				//终点所在块节点为空，创建占位符
				if (endBlockNode.isEmpty()) {
					const placeholder = KNode.createPlaceholder()
					this.addNode(placeholder, endBlockNode)
					this.setSelectionBefore(placeholder, 'end')
				}
				//不是固定的块节点
				if (!endBlockNode.fixed) {
					mergeBlock.apply(this, [startBlockNode, endBlockNode])
				}
			}
		}
		//如果起点所在节点为空则更新起点
		if (this.selection.start!.node.isEmpty()) {
			this.updateSelectionRecently('start')
		}
		//合并起点和终点
		this.selection.end!.node = this.selection.start!.node
		this.selection.end!.offset = this.selection.start!.offset
		//触发事件
		if (typeof this.onDeleteComplete == 'function') {
			this.onDeleteComplete.apply(this)
		}
	}

	/**
	 * 更新编辑器视图
	 */
	async updateView(updateRealSelection: boolean | undefined = true, unPushHistory: boolean | undefined = false) {
		if (!this.$el) {
			return
		}
		//视图更新前回调
		if (typeof this.beforeUpdateView == 'function') this.beforeUpdateView.apply(this)
		//克隆旧节点数组，防止在patch过程中旧节点数组中存在null，影响后续的视图更新
		const oldStackNodes = this.oldStackNodes.map(item => item.fullClone())
		//这里存放格式化过的节点数组，后续进行判断避免重复格式化造成资源浪费和性能问题
		const hasUpdateNodes: KNode[] = []
		const t1 = Date.now()
		//对编辑器的新旧节点数组进行比对，遍历比对的结果进行动态格式化
		patchNodes(this.stackNodes, oldStackNodes).forEach(item => {
			//需要进行格式化的节点
			let node: KNode | null = null
			//有新节点表示insert、update、replace、move和empty
			if (item.newNode) {
				//优先从父节点开始格式化
				node = item.newNode.parent ? item.newNode.parent : item.newNode
			}
			//没有新节点但是有旧节点，表示remove，如果是根级块节点remove就不用处理，非根级块节点需要对新数组中的父节点进行格式化
			else if (item.oldNode && item.oldNode.parent) {
				//获取新节点数组中的父节点
				const parentNode = KNode.searchByKey(item.oldNode.parent.key, this.stackNodes)
				//如果存在对父节点进行格式化
				node = parentNode ? parentNode : null
			}
			//是否有需要格式化的节点
			if (node) {
				//针对需要格式化的节点存在一些特殊处理
				if (typeof this.beforePatchNodeToFormat == 'function') {
					node = this.beforePatchNodeToFormat.apply(this, [node])
				}
				//判断该节点数组是否格式化过
				const hasUpdate = hasUpdateNodes.some(item => {
					//已经在hasUpdateNodes数组里了，说明格式化过了
					if (item.isContains(node!)) {
						return true
					}
					//需要格式化的节点有父节点，并且hasUpdateNodes也存在同父节点的节点
					if (node!.parent && item.parent && item.parent.isContains(node!.parent)) {
						return true
					}
					//其他情况说明没有格式化过
					return false
				})
				//没有格式化过则进行格式化
				if (!hasUpdate) {
					//加入到已经格式化的节点数组里
					hasUpdateNodes.push(node)
					console.log('格式化的节点', node)
					//格式化
					this.formatRules.forEach(rule => {
						const nodes = node!.parent ? node!.parent.children! : [node!]
						const sourceNodes = node!.parent ? node!.parent.children! : this.stackNodes
						formatNodes.apply(this, [rule, nodes, sourceNodes])
					})
				}
			}
		})
		console.log(`动态格式化节点耗时：${Date.now() - t1}ms`)
		//判断节点数组是否为空进行初始化
		checkNodes.apply(this)
		//设置placeholder
		setPlaceholder.apply(this)
		//旧的html值
		const oldHtml = this.$el.innerHTML
		//视图更新之前取消dom监听，以免干扰更新dom
		removeDomObserve(this)
		//此处进行视图的更新
		const useDefault = typeof this.onUpdateView == 'function' ? await this.onUpdateView.apply(this, [false]) : true
		//使用默认逻辑
		useDefault && defaultUpdateView.apply(this, [false])
		//视图更新完毕后重新设置dom监听
		setDomObserve(this)
		//新的html值
		const newHtml = this.$el.innerHTML
		//html值发生变化
		if (oldHtml != newHtml) {
			if (typeof this.onChange == 'function') {
				this.onChange.apply(this, [newHtml, oldHtml])
			}
			//如果unPushHistory为false，则加入历史记录
			if (!unPushHistory) {
				this.history.setState(this.stackNodes, this.selection)
			}
		}
		//更新旧节点数组
		this.oldStackNodes = this.stackNodes.map(item => item.fullClone())
		//此处进行光标的渲染
		if (updateRealSelection) await this.updateRealSelection()
		//视图更新后回调
		if (typeof this.afterUpdateView == 'function') this.afterUpdateView.apply(this)
	}

	/**
	 * 根据selection更新编辑器真实光标
	 */
	async updateRealSelection() {
		const realSelection = window.getSelection()
		if (!realSelection) {
			return
		}
		this.internalCauseSelectionChange = true
		//聚焦情况下
		if (this.selection.focused()) {
			//先进行纠正
			redressSelection.apply(this)
			//更新真实光标
			const range = document.createRange()
			const startDom = this.findDom(this.selection.start!.node)
			const endDom = this.findDom(this.selection.end!.node)
			//起点所在节点是文本节点
			if (this.selection.start!.node.isText()) {
				range.setStart(startDom.childNodes[0], this.selection.start!.offset)
			}
			//起点所在节点是闭合节点
			else if (this.selection.start!.node.isClosed()) {
				const index = this.selection.start!.node.parent!.children!.findIndex(item => this.selection.start!.node.isEqual(item))
				range.setStart(startDom.parentNode!, this.selection.start!.offset + index)
			}
			//终点所在节点是文本节点
			if (this.selection.end!.node.isText()) {
				range.setEnd(endDom.childNodes[0], this.selection.end!.offset)
			}
			//终点所在节点是闭合节点
			else if (this.selection.end!.node.isClosed()) {
				const index = this.selection.end!.node.parent!.children!.findIndex(item => this.selection.end!.node.isEqual(item))
				range.setEnd(endDom.parentNode!, this.selection.end!.offset + index)
			}
			//设置真实光标
			realSelection.removeAllRanges()
			realSelection.addRange(range)
		}
		//没有聚焦
		else {
			realSelection.removeAllRanges()
		}
		await delay()
		this.internalCauseSelectionChange = false
		this.scrollViewToSelection()
		this.history.updateSelection(this.selection)
		if (typeof this.onSelectionUpdate == 'function') {
			this.onSelectionUpdate.apply(this, [this.selection])
		}
	}

	/**
	 * 销毁编辑器的方法
	 */
	destroy() {
		//去除可编辑效果
		this.setEditable(false)
		//移除相关监听事件
		DapEvent.off(document, `selectionchange.kaitify_${this.guid}`)
		DapEvent.off(this.$el!, 'beforeinput.kaitify compositionstart.kaitify compositionupdate.kaitify compositionend.kaitify keydown.kaitify keyup.kaitify copy.kaitify focus.kaitify blur.kaitify')
	}

	/**
	 * 获取编辑器的纯文本内容
	 */
	getText() {
		if (!this.$el) {
			return ''
		}
		return this.$el.innerText
	}

	/**
	 * 配置编辑器，返回创建的编辑器
	 */
	static async configure(options: EditorConfigureOptionType) {
		//创建编辑器
		const editor = new Editor()
		//初始化编辑器dom
		editor.$el = initEditorDom(options.el)
		//初始化设置编辑器样式
		editor.$el.classList.add('Kaitify')
		//设置是否深色模式
		if (options.dark) editor.setDark(options.dark)
		//初始化设置编辑器默认提示文本
		if (options.placeholder) editor.$el.setAttribute('kaitify-placeholder', options.placeholder)
		//初始化内部属性
		if (typeof options.allowCopy == 'boolean') editor.allowCopy = options.allowCopy
		if (typeof options.allowCut == 'boolean') editor.allowCut = options.allowCut
		if (typeof options.allowPaste == 'boolean') editor.allowPaste = options.allowPaste
		if (typeof options.allowPasteHtml == 'boolean') editor.allowPasteHtml = options.allowPasteHtml
		if (typeof options.priorityPasteFiles == 'boolean') editor.priorityPasteFiles = options.priorityPasteFiles
		if (options.textRenderTag) editor.textRenderTag = options.textRenderTag
		if (options.blockRenderTag) editor.blockRenderTag = options.blockRenderTag
		if (options.emptyRenderTags) editor.emptyRenderTags = [...editor.emptyRenderTags, ...options.emptyRenderTags]
		if (options.extraKeepTags) editor.extraKeepTags = [...editor.extraKeepTags, ...options.extraKeepTags]
		if (options.extensions) editor.extensions = [...editor.extensions, ...options.extensions]
		if (options.formatRules) editor.formatRules = [...options.formatRules, ...editor.formatRules]
		if (options.domParseNodeCallback) editor.domParseNodeCallback = options.domParseNodeCallback
		if (options.onUpdateView) editor.onUpdateView = options.onUpdateView
		if (options.onPasteText) editor.onPasteText = options.onPasteText
		if (options.onPasteHtml) editor.onPasteHtml = options.onPasteHtml
		if (options.onPasteImage) editor.onPasteImage = options.onPasteImage
		if (options.onPasteVideo) editor.onPasteVideo = options.onPasteVideo
		if (options.onPasteFile) editor.onPasteFile = options.onPasteFile
		if (options.onChange) editor.onChange = options.onChange
		if (options.onSelectionUpdate) editor.onSelectionUpdate = options.onSelectionUpdate
		if (options.onInsertParagraph) editor.onInsertParagraph = options.onInsertParagraph
		if (options.onDeleteComplete) editor.onDeleteComplete = options.onDeleteComplete
		if (options.onKeydown) editor.onKeydown = options.onKeydown
		if (options.onKeyup) editor.onKeyup = options.onKeyup
		if (options.onFocus) editor.onFocus = options.onFocus
		if (options.onBlur) editor.onBlur = options.onBlur
		if (options.pasteKeepMarks) editor.pasteKeepMarks = options.pasteKeepMarks
		if (options.pasteKeepStyles) editor.pasteKeepStyles = options.pasteKeepStyles
		if (options.beforeUpdateView) editor.beforeUpdateView = options.beforeUpdateView
		if (options.afterUpdateView) editor.afterUpdateView = options.afterUpdateView
		if (options.onDetachMentBlockFromParentCallback) editor.onDetachMentBlockFromParentCallback = options.onDetachMentBlockFromParentCallback
		if (options.beforePatchNodeToFormat) editor.beforePatchNodeToFormat = options.beforePatchNodeToFormat
		//注册插件
		editor.extensions.forEach(item => registerExtension.apply(editor, [item]))
		//设置编辑器是否可编辑
		editor.setEditable(typeof options.editable == 'boolean' ? options.editable : true)
		//视图更新前回调
		if (typeof editor.beforeUpdateView == 'function') editor.beforeUpdateView.apply(editor)
		//根据value设置节点数组
		editor.stackNodes = editor.htmlParseNode(options.value || '')
		//将节点数组进行格式化
		editor.formatRules.forEach(rule => {
			formatNodes.apply(editor, [rule, editor.stackNodes, editor.stackNodes])
		})
		//初始化检查节点数组
		checkNodes.apply(editor)
		//设置placeholder
		setPlaceholder.apply(editor)
		//进行视图的渲染
		const useDefault = typeof editor.onUpdateView == 'function' ? await editor.onUpdateView.apply(editor, [true]) : true
		//使用默认逻辑
		if (useDefault) defaultUpdateView.apply(editor, [true])
		//初始设置历史记录
		editor.history.setState(editor.stackNodes, editor.selection)
		//更新旧节点数组
		editor.oldStackNodes = editor.stackNodes.map(item => item.fullClone())
		//自动聚焦
		if (options.autofocus) {
			editor.setSelectionAfter()
			await editor.updateRealSelection()
		}
		//视图更新后回调
		if (typeof editor.afterUpdateView == 'function') editor.afterUpdateView.apply(editor)
		//设置dom监听
		setDomObserve(editor)
		//监听js selection更新Selection
		DapEvent.on(document, `selectionchange.kaitify_${editor.guid}`, onSelectionChange.bind(editor))
		//监听内容输入
		DapEvent.on(editor.$el, 'beforeinput.kaitify', onBeforeInput.bind(editor))
		//监听中文输入
		DapEvent.on(editor.$el, 'compositionstart.kaitify compositionupdate.kaitify compositionend.kaitify', onComposition.bind(editor))
		//监听键盘事件
		DapEvent.on(editor.$el, 'keydown.kaitify keyup.kaitify', onKeyboard.bind(editor))
		//监听编辑器获取焦点
		DapEvent.on(editor.$el, 'focus.kaitify', onFocus.bind(editor))
		//监听编辑器失去焦点
		DapEvent.on(editor.$el, 'blur.kaitify', onBlur.bind(editor))
		//监听编辑器复制
		DapEvent.on(editor.$el, 'copy.kaitify', onCopy.bind(editor))
		//监听编辑器剪切
		DapEvent.on(editor.$el, 'cut.kaitify', onCut.bind(editor))
		//返回编辑器实例
		return editor
	}
}
