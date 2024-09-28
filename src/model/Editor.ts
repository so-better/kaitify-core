import { common as DapCommon, event as DapEvent, element as DapElement } from 'dap-util'
import { KNode, KNodeCreateOptionType, KNodeMarksType, KNodeMatchOptionType, KNodeStylesType } from './KNode'
import { createGuid, delay, getDomAttributes, getDomStyles, initEditorDom, isContains, isZeroWidthText } from '../tools'
import { blockParse, inlineParse, closedParse } from './config/dom-parse'
import { Selection } from './Selection'
import { History } from './History'
import { formatInlineParseText, formatBlockInChildren, formatSiblingNodesMerge, formatPlaceholderMerge, formatZeroWidthTextMerge, RuleFunctionType, formatParentNodeMerge } from './config/format-rules'
import { patchNodes } from './config/format-patch'
import { onBeforeInput, onBlur, onComposition, onCopy, onFocus, onKeyboard, onSelectionChange } from './config/event-handler'
import { removeDomObserve, setDomObserve } from './config/dom-observe'
import { Extension, HistoryExtension, ImageExtension, TextExtension, BoldExtension, ItalicExtension, StrikethroughExtension, UnderlineExtension, SuperscriptExtension, SubscriptExtension, CodeExtension, FontSizeExtension, VideoExtension } from '../extensions'
import { NODE_MARK } from '../view'
import { defaultUpdateView } from '../view/js-render'
import { FontFamilyExtension } from '../extensions/fontFamily'

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
	[name: string]: ((...args: any[]) => void) | undefined
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
	 * 自定义编辑器内渲染文本节点的真实标签
	 */
	textRenderTag?: string
	/**
	 * 自定义编辑内渲染默认块级节点的真实标签，即段落标签
	 */
	blockRenderTag?: string
	/**
	 * 自定义编辑器内定义不显示的标签
	 */
	voidRenderTags?: string[]
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
	 * 插入段落时触发
	 */
	onInsertParagraph?: (this: Editor, blockNode: KNode, previousBlockNode: KNode) => void
	/**
	 * 光标在编辑器起始位置执行删除时触发
	 */
	onDeleteInStart?: (this: Editor, blockNode: KNode) => void
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
	 * 视图更新后回调方法
	 */
	afterUpdateView?: (this: Editor) => void

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
	 * 是否使用默认css样式
	 */
	useDefaultCSS?: boolean
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
	 * 编辑器内渲染文本节点的真实标签【初始化后不建议修改】
	 */
	textRenderTag: string = 'span'
	/**
	 * 编辑内渲染默认块级节点的真实标签，即段落标签【初始化后不建议修改】
	 */
	blockRenderTag: string = 'p'
	/**
	 * 编辑器内定义不显示的标签【初始化后不建议修改】
	 */
	voidRenderTags: string[] = ['colgroup', 'col']
	/**
	 * 编辑器内定义需要置空的标签【初始化后不建议修改】
	 */
	emptyRenderTags: string[] = ['meta', 'link', 'style', 'script', 'title', 'base', 'noscript', 'template', 'annotation']
	/**
	 * 编辑器内额外保留的标签【初始化后不建议修改】
	 */
	extraKeepTags: string[] = []
	/**
	 * 插件数组【初始化后不可修改】
	 */
	extensions: Extension[] = [ImageExtension, VideoExtension, TextExtension, HistoryExtension, BoldExtension, ItalicExtension, StrikethroughExtension, UnderlineExtension, SuperscriptExtension, SubscriptExtension, CodeExtension, FontSizeExtension, FontFamilyExtension]
	/**
	 * 编辑器的节点数组格式化规则【初始化后不可修改】
	 */
	formatRules: RuleFunctionType[] = [formatBlockInChildren, formatInlineParseText, formatPlaceholderMerge, formatZeroWidthTextMerge, formatSiblingNodesMerge, formatParentNodeMerge]
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
	 * 插入段落时触发【初始化后不可修改】
	 */
	onInsertParagraph?: (this: Editor, blockNode: KNode, previousBlockNode: KNode) => void
	/**
	 * 光标在编辑器起始位置执行删除时触发【初始化后不可修改】
	 */
	onDeleteInStart?: (this: Editor, blockNode: KNode) => void
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
	 * 视图更新后回调方法【初始化后不可修改】
	 */
	afterUpdateView?: (this: Editor) => void

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
	 * 命令集合
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
	 * dom监听【不可修改】
	 */
	domObserver: MutationObserver | null = null

	/**
	 * 将后一个块节点与前一个块节点合并
	 */
	mergeBlock(node: KNode, target: KNode) {
		//不是块节点则不处理
		if (!node.isBlock() || !target.isBlock()) {
			return
		}
		//空节点不处理
		if (node.isEmpty() || target.isEmpty()) {
			return
		}
		const uneditableNode = target.getUneditable()
		if (uneditableNode) {
			uneditableNode.toEmpty()
		} else {
			const nodes = target.children!.map(item => {
				item.parent = node
				return item
			})
			node.children!.push(...nodes)
			target.children = []
		}
	}

	/**
	 * 判断编辑器内的指定节点是否可以进行合并操作，parent表示和父节点进行合并，sibling表示和相邻节点进行合并，如果可以返回合并的对象节点
	 */
	getAllowMergeNode(node: KNode, type: 'parent' | 'prevSibling' | 'nextSibling') {
		//排除空节点
		if (node.isEmpty()) {
			return null
		}
		//排除没有父节点的节点
		if (!node.parent) {
			return null
		}
		//排除锁定的节点
		if (node.locked) {
			return null
		}
		//与前一个兄弟节点合并
		if (type == 'prevSibling') {
			const previousNode = node.getPrevious(node.parent.children!)
			//没有兄弟节点
			if (!previousNode) {
				return null
			}
			//文本节点
			if (node.isText()) {
				//可以和前一个节点合并
				if (previousNode.isText() && previousNode.isEqualMarks(node) && previousNode.isEqualStyles(node)) {
					return previousNode
				}
				return null
			}
			//行内节点
			if (node.isInline()) {
				//可以和前一个节点合并
				if (previousNode.isInline() && previousNode.tag == node.tag && previousNode.isEqualMarks(node) && previousNode.isEqualStyles(node)) {
					return previousNode
				}
				return null
			}
			return null
		}
		//与后一个兄弟节点合并
		if (type == 'nextSibling') {
			const nextNode = node.getNext(node.parent.children!)
			//没有兄弟节点
			if (!nextNode) {
				return null
			}
			//文本节点
			if (node.isText()) {
				//可以和后一个节点合并
				if (nextNode.isText() && nextNode.isEqualMarks(node) && nextNode.isEqualStyles(node)) {
					return nextNode
				}
				return null
			}
			//行内节点
			if (node.isInline()) {
				//可以和后一个节点合并
				if (nextNode.isInline() && nextNode.tag == node.tag && nextNode.isEqualMarks(node) && nextNode.isEqualStyles(node)) {
					return nextNode
				}
				return null
			}
			return null
		}
		//父子节点合并
		if (type == 'parent') {
			//父节点不止一个子节点
			if (node.parent!.children!.length > 1) {
				return null
			}
			//文本节点
			if (node.isText()) {
				//父节点是行内节点，并且渲染标签是文本标签
				if (node.parent!.isInline() && node.parent!.tag == this.textRenderTag) {
					return node.parent!
				}
				return null
			}
			//行内节点和块节点，如果渲染标签一致并且类型一致
			if (node.type == node.parent!.type && node.tag == node.parent!.tag) {
				return node.parent!
			}
			return null
		}
		return null
	}

	/**
	 * 对编辑器内的某个节点执行合并操作，parent表示和父节点进行合并，sibling表示和相邻节点进行合并（可能会更新光标）
	 */
	applyMergeNode(node: KNode, type: 'parent' | 'prevSibling' | 'nextSibling') {
		//合并的对象节点
		const targetNode = this.getAllowMergeNode(node, type)
		if (!targetNode) {
			return
		}
		//和前一个兄弟节点合并
		if (type == 'prevSibling') {
			//文本节点
			if (node.isText()) {
				//起点在前一个节点上
				if (this.isSelectionInNode(targetNode, 'start')) {
					this.selection.start!.node = node
				}
				//终点在前一个节点上
				if (this.isSelectionInNode(targetNode, 'end')) {
					this.selection.end!.node = node
				}
				//将前一个节点的文本内容给后一个节点
				node.textContent = targetNode.textContent! + node.textContent!
				//删除被合并的节点
				const index = targetNode.parent!.children!.findIndex(item => {
					return targetNode.isEqual(item)
				})
				targetNode.parent!.children!.splice(index, 1)
			}
			//行内节点
			else if (node.isInline()) {
				//合并前一个节点的子节点数组
				node.children = [...targetNode.children!, ...node.children!].map(item => {
					item.parent = node
					return item
				})
				//删除被合并的节点
				const index = targetNode.parent!.children!.findIndex(item => {
					return targetNode.isEqual(item)
				})
				targetNode.parent!.children!.splice(index, 1)
				//继续对子节点进行合并
				if (node.hasChildren() && node.children!.length > 1) {
					let index = 0
					//因为父子节点的合并操作会导致children没有，此时判断一下hasChildren
					while (node.hasChildren() && index <= node.children!.length - 2) {
						const newTargetNode = this.getAllowMergeNode(node.children![index], 'nextSibling')
						if (newTargetNode) {
							this.applyMergeNode(node.children![index], 'nextSibling')
							//子节点合并后可能只有一个子节点了，此时进行父子节点合并操作
							if (node.hasChildren() && node.children!.length == 1) {
								this.applyMergeNode(node.children![0], 'parent')
							}
							continue
						}
						index++
					}
				}
			}
		}
		//和后一个节点合并
		if (type == 'nextSibling') {
			//文本节点
			if (node.isText()) {
				//起点在后一个节点上
				if (this.isSelectionInNode(targetNode, 'start')) {
					this.selection.start!.node = node
					this.selection.start!.offset = node.textContent!.length + this.selection.start!.offset
				}
				//终点在后一个节点上
				if (this.isSelectionInNode(targetNode, 'end')) {
					this.selection.end!.node = node
					this.selection.end!.offset = node.textContent!.length + this.selection.end!.offset
				}
				//将后一个节点的文本内容给前一个节点
				node.textContent! += targetNode.textContent!
				//删除被合并的节点
				const index = targetNode.parent!.children!.findIndex(item => {
					return targetNode.isEqual(item)
				})
				targetNode.parent!.children!.splice(index, 1)
			}
			//行内节点
			else if (node.isInline()) {
				//合并后一个节点的子节点数组
				node.children = [...node.children!, ...targetNode.children!].map(item => {
					item.parent = node
					return item
				})
				//删除被合并的节点
				const index = targetNode.parent!.children!.findIndex(item => {
					return targetNode.isEqual(item)
				})
				targetNode.parent!.children!.splice(index, 1)
				//继续对子节点进行合并
				if (node.hasChildren() && node.children!.length > 1) {
					let index = 0
					//因为父子节点的合并操作会导致children没有，此时判断一下hasChildren
					while (node.hasChildren() && index <= node.children!.length - 2) {
						const newTargetNode = this.getAllowMergeNode(node.children![index], 'nextSibling')
						if (newTargetNode) {
							this.applyMergeNode(node.children![index], 'nextSibling')
							//子节点合并后可能只有一个子节点了，此时进行父子节点合并操作
							if (node.hasChildren() && node.children!.length == 1) {
								this.applyMergeNode(node.children![0], 'parent')
							}
							continue
						}
						index++
					}
				}
			}
		}
		//父子节点合并
		if (type == 'parent') {
			//文本节点
			if (node.isText()) {
				targetNode.type = 'text'
				targetNode.tag = undefined
				//如果子节点有标记
				if (node.hasMarks()) {
					if (targetNode.hasMarks()) {
						Object.assign(targetNode.marks!, DapCommon.clone(node.marks!))
					} else {
						targetNode.marks = DapCommon.clone(node.marks!)
					}
				}
				//如果子节点有样式
				if (node.hasStyles()) {
					if (targetNode.hasStyles()) {
						Object.assign(targetNode.styles!, DapCommon.clone(node.styles!))
					} else {
						targetNode.styles = DapCommon.clone(node.styles!)
					}
				}
				targetNode.textContent = node.textContent
				targetNode.children = undefined
				//如果起点在子节点上则更新到父节点上
				if (this.isSelectionInNode(node, 'start')) {
					this.selection.start!.node = targetNode
				}
				//如果终点在子节点上则更新到父节点上
				if (this.isSelectionInNode(node, 'end')) {
					this.selection.end!.node = targetNode
				}
			}
			//行内节点或者块节点
			else {
				//如果子节点有标记
				if (node.hasMarks()) {
					if (targetNode.hasMarks()) {
						Object.assign(targetNode.marks!, DapCommon.clone(node.marks))
					} else {
						targetNode.marks = DapCommon.clone(node.marks)
					}
				}
				//如果子节点有样式
				if (node.hasStyles()) {
					if (targetNode.hasStyles()) {
						Object.assign(targetNode.styles!, DapCommon.clone(node.styles))
					} else {
						targetNode.styles = DapCommon.clone(node.styles)
					}
				}
				//如果子节点也有子节点
				if (node.hasChildren()) {
					targetNode.children = [...node.children!]
					targetNode.children.forEach(item => {
						item.parent = targetNode
					})
				}
				//子节点与父节点合并后再对父节点进行处理
				if (targetNode.hasChildren() && targetNode.children!.length == 1) {
					//再次父子节点进行合并
					if (this.getAllowMergeNode(targetNode.children![0], 'parent')) {
						this.applyMergeNode(targetNode.children![0], 'parent')
						//父子节点合并后，可能父节点需要再和兄弟节点进行合并
						if (this.getAllowMergeNode(targetNode, 'prevSibling')) {
							this.applyMergeNode(targetNode, 'prevSibling')
						} else if (this.getAllowMergeNode(targetNode, 'nextSibling')) {
							this.applyMergeNode(targetNode, 'nextSibling')
						}
					}
				}
			}
		}
	}

	/**
	 * 对节点数组使用指定规则进行格式化
	 */
	formatNodes(rule: RuleFunctionType, nodes: KNode[]) {
		let i = 0
		while (i < nodes.length) {
			const node = nodes[i]
			//空节点直接删除并且跳过本次循环
			if (node.isEmpty()) {
				if (this.isSelectionInNode(node, 'start')) {
					this.updateSelectionRecently('start')
				}
				if (this.isSelectionInNode(node, 'end')) {
					this.updateSelectionRecently('end')
				}
				nodes.splice(i, 1)
				continue
			}
			//对节点使用该规则进行格式化
			rule({ editor: this, node })
			//格式化后变成空节点，进行删除，并且跳过本次循环
			if (node.isEmpty()) {
				if (this.isSelectionInNode(node, 'start')) {
					this.updateSelectionRecently('start')
				}
				if (this.isSelectionInNode(node, 'end')) {
					this.updateSelectionRecently('end')
				}
				//因为在格式化过程中可能会改变节点在数组中的序列位置，所以重新获取序列
				const index = nodes.findIndex(item => item.isEqual(node))
				nodes.splice(index, 1)
				continue
			}
			//如果当前节点不是块节点，但是却是在根部，则转为块节点
			if (!node.isBlock() && this.stackNodes === nodes) {
				this.convertToBlock(node)
			}
			//对子节点进行格式化
			if (node.hasChildren()) {
				this.formatNodes(rule, node.children!)
			}
			//子节点格式化后变成空节点，需要删除该节点，并且跳过本次循环
			if (node.isEmpty()) {
				if (this.isSelectionInNode(node, 'start')) {
					this.updateSelectionRecently('start')
				}
				if (this.isSelectionInNode(node, 'end')) {
					this.updateSelectionRecently('end')
				}
				//因为在格式化过程中可能会改变节点在数组中的序列位置，所以重新获取序列
				const index = nodes.findIndex(item => item.isEqual(node))
				nodes.splice(index, 1)
				continue
			}
			i++
		}
	}

	/**
	 * 清空固定块节点的内容
	 */
	emptyFixedBlock(node: KNode) {
		if (!node.isBlock()) {
			return
		}
		if (node.hasChildren()) {
			node.children!.forEach(item => {
				//如果是固定的块节点
				if (item.isBlock() && item.fixed) {
					this.emptyFixedBlock(item)
				}
				//其他情况下
				else {
					item.toEmpty()
					if (item.parent!.isEmpty()) {
						const placeholderNode = KNode.createPlaceholder()
						this.addNode(placeholderNode, item.parent!)
					}
				}
			})
		}
	}

	/**
	 * 注册插件
	 */
	registerExtension(extension: Extension) {
		//是否已注册
		if (extension.registered) return
		//设置已注册
		extension.registered = true

		if (extension.extraKeepTags) {
			this.extraKeepTags = [...extension.extraKeepTags, ...this.extraKeepTags]
		}
		if (extension.domParseNodeCallback) {
			const fn = this.domParseNodeCallback
			this.domParseNodeCallback = (node: KNode) => {
				node = extension.domParseNodeCallback!.apply(this, [node])
				if (fn) node = fn.apply(this, [node])
				return node
			}
		}
		if (extension.formatRule) {
			this.formatRules = [extension.formatRule, ...this.formatRules]
		}
		if (extension.pasteKeepMarks) {
			const fn = this.pasteKeepMarks
			this.pasteKeepMarks = (node: KNode) => {
				const marks = extension.pasteKeepMarks!.apply(this, [node])
				if (fn) Object.assign(marks, fn.apply(this, [node]))
				return marks
			}
		}
		if (extension.pasteKeepStyles) {
			const fn = this.pasteKeepStyles
			this.pasteKeepStyles = (node: KNode) => {
				const styles = extension.pasteKeepStyles!.apply(this, [node])
				if (fn) Object.assign(styles, fn.apply(this, [node]))
				return styles
			}
		}
		if (extension.afterUpdateView) {
			const fn = this.afterUpdateView
			this.afterUpdateView = () => {
				extension.afterUpdateView!.apply(this)
				if (fn) fn.apply(this)
			}
		}
		if (extension.addCommands) {
			const commands = extension.addCommands.apply(this)
			this.commands = { ...this.commands, ...commands }
		}
	}

	/**
	 * 根据真实光标更新selection，返回布尔值表示是否更新成功
	 */
	updateSelection() {
		if (!this.$el) {
			return false
		}
		const realSelection = window.getSelection()
		if (realSelection && realSelection.rangeCount) {
			const range = realSelection.getRangeAt(0)
			//光标在编辑器内
			if (isContains(this.$el!, range.startContainer) && isContains(this.$el!, range.endContainer)) {
				//如果光标起点是文本
				if (range.startContainer.nodeType == 3) {
					this.selection.start = {
						node: this.findNode(range.startContainer.parentNode as HTMLElement),
						offset: range.startOffset
					}
				}
				//如果光标起点是元素
				else if (range.startContainer.nodeType == 1) {
					const childDoms = Array.from(range.startContainer.childNodes)
					//存在子元素
					if (childDoms.length) {
						const dom = childDoms[range.startOffset] ? childDoms[range.startOffset] : childDoms[range.startOffset - 1]
						//元素
						if (dom.nodeType == 1) {
							if (childDoms[range.startOffset]) {
								this.setSelectionBefore(this.findNode(dom as HTMLElement), 'start')
							} else {
								this.setSelectionAfter(this.findNode(dom as HTMLElement), 'start')
							}
						}
						//文本
						else if (dom.nodeType == 3) {
							this.selection.start = {
								node: this.findNode(dom.parentNode as HTMLElement),
								offset: childDoms[range.startOffset] ? 0 : dom.textContent!.length
							}
						}
					}
					//没有子元素，应当是闭合节点
					else {
						this.selection.start = {
							node: this.findNode(range.startContainer as HTMLElement),
							offset: 0
						}
					}
				}
				//如果光标终点是文本
				if (range.endContainer.nodeType == 3) {
					this.selection.end = {
						node: this.findNode(range.endContainer.parentNode as HTMLElement),
						offset: range.endOffset
					}
				}
				//如果光标终点是元素
				else if (range.endContainer.nodeType == 1) {
					const childDoms = Array.from(range.endContainer.childNodes)
					//存在子元素
					if (childDoms.length) {
						const dom = childDoms[range.endOffset] ? childDoms[range.endOffset] : childDoms[range.endOffset - 1]
						//元素
						if (dom.nodeType == 1) {
							if (childDoms[range.endOffset]) {
								this.setSelectionBefore(this.findNode(dom as HTMLElement), 'end')
							} else {
								this.setSelectionAfter(this.findNode(dom as HTMLElement), 'end')
							}
						}
						//文本
						else if (dom.nodeType == 3) {
							this.selection.end = {
								node: this.findNode(dom.parentNode as HTMLElement),
								offset: childDoms[range.endOffset] ? 0 : dom.textContent!.length
							}
						}
					}
					//没有子元素，应当是闭合节点
					else {
						this.selection.end = {
							node: this.findNode(range.endContainer as HTMLElement),
							offset: 1
						}
					}
				}
				//如果起点和终点是相邻的两个节点并且位置紧邻
				const nextNode = this.getNextSelectionNode(this.selection.start!.node)
				if (nextNode && nextNode.isEqual(this.selection.end!.node) && this.selection.start!.offset == (this.selection.start!.node.isText() ? this.selection.start!.node.textContent!.length : 1) && this.selection.end!.offset == 0) {
					this.selection.end!.node = this.selection.start!.node
					this.selection.end!.offset = this.selection.start!.offset
				}
				return true
			}
		}
		return false
	}

	/**
	 * 【API】如果编辑器内有滚动条，滚动编辑器到光标可视范围
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
	 * 【API】根据dom查找到编辑内的对应节点
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
	 * 【API】根据编辑器内的node查找真实dom
	 */
	findDom(node: KNode) {
		const dom = this.$el!.querySelector(`[${NODE_MARK}="${node.key}"]`)
		if (!dom) {
			throw new Error(`Unexpected error occurred: the dom was not found in the editor`)
		}
		return dom as HTMLElement
	}

	/**
	 * 【API】设置编辑器是否可编辑
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
	 * 【API】判断编辑器是否可编辑
	 */
	isEditable() {
		return this.$el?.getAttribute('contenteditable') == 'true'
	}

	/**
	 * 【API】初始化校验编辑器的节点数组，如果编辑器的节点数组为空或者都是空节点，则初始化创建一个只有占位符的段落
	 */
	checkNodes() {
		const nodes = this.stackNodes.filter(item => {
			return !item.isEmpty() && !this.voidRenderTags.includes(item.tag!)
		})
		if (nodes.length == 0) {
			const node = KNode.create({
				type: 'block',
				tag: this.blockRenderTag
			})
			const placeholder = KNode.createPlaceholder()
			this.addNode(placeholder, node)
			this.stackNodes = [node]
			if (this.selection.focused()) {
				this.setSelectionBefore(placeholder)
			}
		}
	}

	/**
	 * 【API】将编辑器内的某个非块级节点转为默认块级节点
	 */
	convertToBlock(node: KNode) {
		if (node.isBlock()) {
			return
		}
		const newNode = node.clone(true)
		//该节点是文本节点和闭合节点，处理光标问题
		if (node.isText() || node.isClosed()) {
			if (this.isSelectionInNode(node, 'start')) {
				this.selection.start!.node = newNode
			}
			if (this.isSelectionInNode(node, 'end')) {
				this.selection.end!.node = newNode
			}
		}
		node.type = 'block'
		node.tag = this.blockRenderTag
		node.marks = undefined
		node.styles = undefined
		node.textContent = undefined
		node.children = [newNode]
		newNode.parent = node
	}

	/**
	 * 【API】dom转KNode
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
		if (this.voidRenderTags.includes(tag)) {
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
		//默认配置
		const block = blockParse.find(item => item.tag == tag)
		const inline = inlineParse.find(item => item.tag == tag)
		const closed = closedParse.find(item => item.tag == tag)
		//构造参数
		const config: KNodeCreateOptionType = {
			type: 'inline',
			tag,
			marks,
			styles,
			namespace: namespace || ''
		}
		//默认的块节点
		if (block) {
			config.type = 'block'
			config.children = []
			if (block.parse) config.tag = this.blockRenderTag
			if (block.fixed) config.fixed = block.fixed
		}
		//默认的行内节点
		else if (inline) {
			config.type = 'inline'
			config.children = []
			if (inline.parse) config.tag = this.textRenderTag
		}
		//默认的自闭合节点
		else if (closed) {
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
	 * 【API】html转KNode
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
	 * 【API】将指定节点添加到某个节点的子节点数组里
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
	 * 【API】将指定节点添加到某个节点前面
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
	 * 【API】将指定节点添加到某个节点后面
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
	 * 【API】获取某个节点内的最后一个可以设置光标点的节点
	 */
	getLastSelectionNodeInChildren(node: KNode): KNode | null {
		//空节点
		if (node.isEmpty()) {
			return null
		}
		//子节点是不可见节点
		if (node.tag && this.voidRenderTags.includes(node.tag)) {
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
	 * 【API】获取某个节点内的第一个可以设置光标点的节点
	 */
	getFirstSelectionNodeInChildren(node: KNode): KNode | null {
		//空节点
		if (node.isEmpty()) {
			return null
		}
		//子节点是不可见节点
		if (node.tag && this.voidRenderTags.includes(node.tag)) {
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
	 * 【API】查找指定节点之前可以设置为光标点的非空节点
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
			if (previousNode.tag && this.voidRenderTags.includes(previousNode.tag)) {
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
	 * 【API】查找指定节点之后可以设置为光标点的非空节点
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
			if (nextNode.tag && this.voidRenderTags.includes(nextNode.tag)) {
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
	 * 【API】设置光标到指定节点头部，如果没有指定节点则设置光标到编辑器头部，start表示只设置起点，end表示只设置终点，all表示起点和终点都设置
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
	 * 【API】设置光标到指定节点的末尾，如果没有指定节点则设置光标到编辑器末尾，start表示只设置起点，end表示只设置终点，all表示起点和终点都设置
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
	 * 【API】更新指定光标到离当前光标点最近的节点上，start表示只更新起点，end表示只更新终点，all表示起点和终点都更新
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
	 * 【API】判断光标是否在某个节点内，start表示只判断起点，end表示只判断终点，all表示起点和终点都判断
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
	 * 【API】获取光标选区内的节点
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
	 * 【API】判断光标范围内的可聚焦节点是否全都在同一个符合条件节点内，如果是返回那个符合条件的节点，否则返回null
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
	 * 【API】判断光标范围内的可聚焦节点是否全都在符合条件的节点内（不一定是同一个节点）
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
	 * 【API】判断光标范围内是否有可聚焦节点在符合条件的节点内
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
	 * 【API】获取所有在光标范围内的可聚焦节点，该方法拿到的可聚焦节点（文本）可能部分区域不在光标范围内
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
	 * 【API】获取所有在光标范围内的可聚焦节点，该方法可能会切割部分文本节点，摒弃其不在光标范围内的部分，所以也可能会更新光标的位置
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
	 * 【API】向选区插入文本
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
	 * 【API】向选区进行换行，如果所在块节点只有占位符并且块节点不是段落则会转为段落
	 */
	insertParagraph() {
		if (!this.selection.focused()) {
			return
		}
		//起点和终点在一起
		if (this.selection.collapsed()) {
			//光标所在节点
			const node = this.selection.start!.node
			//光标在节点里的偏移值
			const offset = this.selection.start!.offset
			//光标所在块节点
			const blockNode = node.getBlock()
			//获取块节点内第一个可以设置光标的节点
			const firstSelectionNode = this.getFirstSelectionNodeInChildren(blockNode)!
			//获取块节点内最后一个可以设置光标的节点
			const lastSelectionNode = this.getLastSelectionNodeInChildren(blockNode)!
			//如果在代码块样式内
			if (node.isInCodeBlockStyle()) {
				this.insertText('\n')
				const zeroWidthText = KNode.createZeroWidthText()
				this.insertNode(zeroWidthText)
				this.setSelectionAfter(zeroWidthText, 'all')
				if (typeof this.onInsertParagraph == 'function') {
					this.onInsertParagraph.apply(this, [blockNode, blockNode])
				}
			}
			//在非代码块样式内，且不是固定的块节点
			else if (!blockNode.fixed) {
				//光标在块节点的起始处
				if (firstSelectionNode.isEqual(node) && offset == 0) {
					//如果块节点只有占位符并且块节点不是段落
					if (blockNode.allIsPlaceholder() && blockNode.tag != this.blockRenderTag) {
						//列表项元素特殊处理
						if (blockNode.tag == 'li' && blockNode.parent && ['ol', 'ul'].includes(blockNode.parent.tag!)) {
							//列表节点
							const listNode = blockNode.parent
							//获取该块节点在列表节点中的位置
							const index = listNode.children!.findIndex(item => item.isEqual(blockNode))
							//该块节点在列表节点第一个
							if (index == 0) {
								//将块节点移到列表节点之前
								listNode.children!.splice(index, 1)
								this.addNodeBefore(blockNode, listNode)
							}
							//该块节点在列表节点的最后一个
							else if (index == listNode.children!.length - 1) {
								//将块节点移到列表节点之后
								listNode.children!.splice(index, 1)
								this.addNodeAfter(blockNode, listNode)
							}
							//该块节点在列表节点中间
							else {
								//克隆父节点
								const newParent = blockNode.parent.clone(false)
								//获取父节点的子节点数组
								const listItems = listNode.children!
								//重新设置父节点的子节点
								listNode.children! = listItems.slice(0, index)
								//设置克隆的父节点的子节点
								newParent.children = listItems.slice(index + 1)
								//将块节点移动到父节点后
								this.addNodeAfter(blockNode, listNode)
								//将克隆的父节点添加到块节点后
								this.addNodeAfter(newParent, blockNode)
							}
						}
						//转为段落
						blockNode.tag = this.blockRenderTag
						blockNode.marks = {}
						blockNode.styles = {}
					}
					//其他情况下正常换行
					else {
						const newBlockNode = blockNode.clone(false)
						const placeholderNode = KNode.createPlaceholder()
						this.addNode(placeholderNode, newBlockNode)
						this.addNodeBefore(newBlockNode, blockNode)
						if (typeof this.onInsertParagraph == 'function') {
							this.onInsertParagraph.apply(this, [blockNode, newBlockNode])
						}
					}
				}
				//光标在块节点的末尾处
				else if (lastSelectionNode.isEqual(node) && offset == (node.isText() ? node.textContent!.length : 1)) {
					//如果块节点只有占位符并且块节点不是段落
					if (blockNode.allIsPlaceholder() && blockNode.tag != this.blockRenderTag) {
						//列表项元素特殊处理
						if (blockNode.tag == 'li' && blockNode.parent && ['ol', 'ul'].includes(blockNode.parent.tag!)) {
							//列表节点
							const listNode = blockNode.parent
							//获取该块节点在列表节点中的位置
							const index = listNode.children!.findIndex(item => item.isEqual(blockNode))
							//该块节点在列表节点第一个
							if (index == 0) {
								//将块节点移到列表节点之前
								listNode.children!.splice(index, 1)
								this.addNodeBefore(blockNode, listNode)
							}
							//该块节点在列表节点的最后一个
							else if (index == listNode.children!.length - 1) {
								//将块节点移到列表节点之后
								listNode.children!.splice(index, 1)
								this.addNodeAfter(blockNode, listNode)
							}
							//该块节点在列表节点中间
							else {
								//克隆父节点
								const newParent = blockNode.parent.clone(false)
								//获取父节点的子节点数组
								const listItems = listNode.children!
								//重新设置父节点的子节点
								listNode.children! = listItems.slice(0, index)
								//设置克隆的父节点的子节点
								newParent.children = listItems.slice(index + 1)
								//将块节点移动到父节点后
								this.addNodeAfter(blockNode, listNode)
								//将克隆的父节点添加到块节点后
								this.addNodeAfter(newParent, blockNode)
							}
						}
						blockNode.tag = this.blockRenderTag
						blockNode.marks = {}
						blockNode.styles = {}
					}
					//其他情况下正常换行
					else {
						const newBlockNode = blockNode.clone(false)
						const placeholderNode = KNode.createPlaceholder()
						this.addNode(placeholderNode, newBlockNode)
						this.addNodeAfter(newBlockNode, blockNode)
						this.setSelectionBefore(placeholderNode)
						if (typeof this.onInsertParagraph == 'function') {
							this.onInsertParagraph.apply(this, [newBlockNode, blockNode])
						}
					}
				}
				//光标在块节点的中间
				else {
					//如果块节点只有占位符并且块节点不是段落
					if (blockNode.allIsPlaceholder() && blockNode.tag != this.blockRenderTag) {
						//列表项元素特殊处理
						if (blockNode.tag == 'li' && blockNode.parent && ['ol', 'ul'].includes(blockNode.parent.tag!)) {
							//列表节点
							const listNode = blockNode.parent
							//获取该块节点在列表节点中的位置
							const index = listNode.children!.findIndex(item => item.isEqual(blockNode))
							//该块节点在列表节点第一个
							if (index == 0) {
								//将块节点移到列表节点之前
								listNode.children!.splice(index, 1)
								this.addNodeBefore(blockNode, listNode)
							}
							//该块节点在列表节点的最后一个
							else if (index == listNode.children!.length - 1) {
								//将块节点移到列表节点之后
								listNode.children!.splice(index, 1)
								this.addNodeAfter(blockNode, listNode)
							}
							//该块节点在列表节点中间
							else {
								//克隆父节点
								const newParent = blockNode.parent.clone(false)
								//获取父节点的子节点数组
								const listItems = listNode.children!
								//重新设置父节点的子节点
								listNode.children! = listItems.slice(0, index)
								//设置克隆的父节点的子节点
								newParent.children = listItems.slice(index + 1)
								//将块节点移动到父节点后
								this.addNodeAfter(blockNode, listNode)
								//将克隆的父节点添加到块节点后
								this.addNodeAfter(newParent, blockNode)
							}
						}
						blockNode.tag = this.blockRenderTag
						blockNode.marks = {}
						blockNode.styles = {}
					}
					//其他情况下正常换行
					else {
						//创建新的块节点
						const newBlockNode = blockNode.clone(true)
						//插入到光标所在块节点之后
						this.addNodeAfter(newBlockNode, blockNode)
						//记录光标所在节点在块节点中的序列
						const index = KNode.flat(blockNode.children!).findIndex(item => {
							return this.selection.start!.node.isEqual(item)
						})
						//记录光标的偏移值
						const offset = this.selection.start!.offset
						//将光标终点移动到块节点最后
						this.setSelectionAfter(lastSelectionNode, 'end')
						//删除原块节点光标所在位置后面的部分
						this.delete()
						//将光标起点移动到新块节点的起始处
						this.setSelectionBefore(newBlockNode, 'start')
						//将光标终点移动到新块节点中与老块节点对应的位置
						this.selection.end!.node = KNode.flat(newBlockNode.children!)[index]
						this.selection.end!.offset = offset
						//删除新块节点光标所在位置前面的部分
						this.delete()
						if (typeof this.onInsertParagraph == 'function') {
							this.onInsertParagraph.apply(this, [newBlockNode, blockNode])
						}
					}
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
	 * 【API】向选区插入节点，cover为true表示当向某个只有占位符的非固定块节点被插入另一个非固定块节点时是否覆盖此节点，而不是直接插入进去
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
	 * 【API】对选区进行删除
	 */
	delete() {
		if (!this.selection.focused()) {
			return
		}
		//起点和终点在一起
		if (this.selection.collapsed()) {
			const node = this.selection.start!.node
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
						this.mergeBlock(previousBlock, blockNode)
					}
				}
				//前一个可设置光标的节点不存在，说明在编辑器开始处
				else if (typeof this.onDeleteInStart == 'function') {
					this.onDeleteInStart.apply(this, [blockNode])
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
					//块节点不是空，说明块内前面有可以设为光标的节点，则将光标移动到它后面
					else {
						this.setSelectionAfter(previousSelectionNode!, 'all')
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
								if (typeof this.onDeleteInStart == 'function') {
									this.onDeleteInStart.apply(this, [blockNode])
								}
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
		//起点和终点不在一起
		else {
			//获取选区内的节点信息
			const result = this.getSelectedNodes().filter(item => {
				//批量删除时需要过滤掉那些不显示的节点
				return !this.voidRenderTags.includes(item.node.tag!)
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
						this.emptyFixedBlock(node)
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
				//起点所在块节点为空，创建占位符
				if (endBlockNode.isEmpty()) {
					const placeholder = KNode.createPlaceholder()
					this.addNode(placeholder, endBlockNode)
					this.setSelectionBefore(placeholder, 'end')
				}
				//不是固定的块节点
				if (!endBlockNode.fixed) {
					this.mergeBlock(startBlockNode, endBlockNode)
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
	 * 【API】更新编辑器视图
	 */
	async updateView(unPushHistory: boolean | undefined = false) {
		if (!this.$el) {
			return
		}
		//克隆旧节点数组，防止在patch过程中旧节点数组中存在null，影响后续的视图更新
		const oldStackNodes = this.oldStackNodes.map(item => item.fullClone())
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
			//最终判断是否有需要格式化的节点进行格式化
			if (node) {
				this.formatRules.forEach(rule => {
					this.formatNodes(rule, node.parent ? node.parent.children! : this.stackNodes)
				})
			}
		})
		//判断节点数组是否为空进行初始化
		this.checkNodes()
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
		await this.updateRealSelection()
		//视图更新后回调
		if (typeof this.afterUpdateView == 'function') this.afterUpdateView.apply(this)
	}

	/**
	 * 【API】根据selection更新编辑器真实光标
	 */
	async updateRealSelection() {
		const realSelection = window.getSelection()
		if (!realSelection) {
			return
		}
		if (this.selection.focused()) {
			this.internalCauseSelectionChange = true
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
			realSelection.removeAllRanges()
			realSelection.addRange(range)
		} else {
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
	 * 【API】销毁编辑器的方法
	 */
	destroy() {
		//去除可编辑效果
		this.setEditable(false)
		//移除相关监听事件
		DapEvent.off(document, `selectionchange.kaitify_${this.guid}`)
		DapEvent.off(this.$el!, 'beforeinput.kaitify compositionstart.kaitify compositionupdate.kaitify compositionend.kaitify keydown.kaitify keyup.kaitify copy.kaitify focus.kaitify blur.kaitify')
	}

	/**
	 * 【API】配置编辑器，返回创建的编辑器
	 */
	static async configure(options: EditorConfigureOptionType) {
		//创建编辑器
		const editor = new Editor()
		//初始化编辑器dom
		editor.$el = initEditorDom(options.el)
		//初始化设置编辑器样式
		if (options.useDefaultCSS !== false) editor.$el.className = 'Kaitify'
		//初始化内部属性
		if (typeof options.allowCopy == 'boolean') editor.allowCopy = options.allowCopy
		if (typeof options.allowCut == 'boolean') editor.allowCut = options.allowCut
		if (typeof options.allowPaste == 'boolean') editor.allowPaste = options.allowPaste
		if (typeof options.allowPasteHtml == 'boolean') editor.allowPasteHtml = options.allowPasteHtml
		if (options.textRenderTag) editor.textRenderTag = options.textRenderTag
		if (options.blockRenderTag) editor.blockRenderTag = options.blockRenderTag
		if (options.voidRenderTags) editor.voidRenderTags = options.voidRenderTags
		if (options.emptyRenderTags) editor.emptyRenderTags = options.emptyRenderTags
		if (options.extraKeepTags) editor.extraKeepTags = options.extraKeepTags
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
		if (options.onDeleteInStart) editor.onDeleteInStart = options.onDeleteInStart
		if (options.onDeleteComplete) editor.onDeleteComplete = options.onDeleteComplete
		if (options.onKeydown) editor.onKeydown = options.onKeydown
		if (options.onKeyup) editor.onKeyup = options.onKeyup
		if (options.onFocus) editor.onFocus = options.onFocus
		if (options.onBlur) editor.onBlur = options.onBlur
		if (options.pasteKeepMarks) editor.pasteKeepMarks = options.pasteKeepMarks
		if (options.pasteKeepStyles) editor.pasteKeepStyles = options.pasteKeepStyles
		if (options.afterUpdateView) editor.afterUpdateView = options.afterUpdateView
		//注册插件
		editor.extensions.forEach(item => editor.registerExtension(item))
		//设置编辑器是否可编辑
		editor.setEditable(typeof options.editable == 'boolean' ? options.editable : true)
		//根据value设置节点数组
		editor.stackNodes = editor.htmlParseNode(options.value || '')
		//将节点数组进行格式化
		editor.formatRules.forEach(rule => {
			editor.formatNodes(rule, editor.stackNodes)
		})
		//初始化检查节点数组
		editor.checkNodes()
		//进行视图的渲染
		const useDefault = typeof editor.onUpdateView == 'function' ? await editor.onUpdateView.apply(editor, [true]) : true
		//使用默认逻辑
		if (useDefault) {
			defaultUpdateView.apply(editor, [true])
		}
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
		//返回编辑器实例
		return editor
	}
}
