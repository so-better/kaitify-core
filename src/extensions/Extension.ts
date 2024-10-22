import { Editor, EditorCommandsType, KNode, KNodeMarksType, KNodeStylesType, RuleFunctionType, Selection } from '@/model'

/**
 * 创建插件的入参类型
 */
export type ExtensionCreateOptionType = {
	/**
	 * 插件名称
	 */
	name: string
	/**
	 * 置空的标签
	 */
	emptyRenderTags?: string[]
	/**
	 * 额外保留的标签
	 */
	extraKeepTags?: string[]
	/**
	 * 自定义格式化规则
	 */
	formatRules?: RuleFunctionType[]
	/**
	 * 自定义dom转为非文本节点的后续处理
	 */
	domParseNodeCallback?: (this: Editor, node: KNode) => KNode
	/**
	 * 光标变化回调
	 */
	onSelectionUpdate?: (this: Editor, selection: Selection) => void
	/**
	 * 插入段落时回调
	 */
	onInsertParagraph?: (this: Editor, node: KNode) => void
	/**
	 * 完成删除回调
	 */
	onDeleteComplete?: (this: Editor) => void
	/**
	 * 光标在编辑器内时键盘按下回调
	 */
	onKeydown?: (this: Editor, event: KeyboardEvent) => void
	/**
	 * 光标在编辑器内时键盘松开回调
	 */
	onKeyup?: (this: Editor, event: KeyboardEvent) => void
	/**
	 * 编辑器聚焦时回调
	 */
	onFocus?: (this: Editor, event: FocusEvent) => void
	/**
	 * 编辑器失焦时回调
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
	 * 视图更新后回调
	 */
	afterUpdateView?: (this: Editor) => void
	/**
	 * 在删除和换行操作中块节点节点从其父节点中抽离出去成为与父节点同级的节点后触发
	 */
	onDetachMentBlockFromParentCallback?: (this: Editor, node: KNode) => boolean

	/**
	 * 自定义命令
	 */
	addCommands?: (this: Editor) => EditorCommandsType
}

/**
 * 插件
 */
export class Extension {
	/**
	 * 插件名称
	 */
	name: string
	/**
	 * 是否已注册
	 */
	registered: boolean = false
	/**
	 * 置空的标签
	 */
	emptyRenderTags: string[] = []
	/**
	 * 额外保留的标签
	 */
	extraKeepTags: string[] = []
	/**
	 * 自定义格式化规则
	 */
	formatRules: RuleFunctionType[] = []
	/**
	 * 自定义dom转为非文本节点的后续处理
	 */
	domParseNodeCallback?: (this: Editor, node: KNode) => KNode
	/**
	 * 光标变化回调
	 */
	onSelectionUpdate?: (this: Editor, selection: Selection) => void
	/**
	 * 插入段落时回调
	 */
	onInsertParagraph?: (this: Editor, node: KNode) => void
	/**
	 * 完成删除回调
	 */
	onDeleteComplete?: (this: Editor) => void
	/**
	 * 光标在编辑器内时键盘按下回调
	 */
	onKeydown?: (this: Editor, event: KeyboardEvent) => void
	/**
	 * 光标在编辑器内时键盘松开回调
	 */
	onKeyup?: (this: Editor, event: KeyboardEvent) => void
	/**
	 * 编辑器聚焦时回调
	 */
	onFocus?: (this: Editor, event: FocusEvent) => void
	/**
	 * 编辑器失焦时回调
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
	 * 视图更新后回调
	 */
	afterUpdateView?: (this: Editor) => void
	/**
	 * 在删除和换行操作中块节点节点从其父节点中抽离出去成为与父节点同级的节点后触发
	 */
	onDetachMentBlockFromParentCallback?: (this: Editor, node: KNode) => boolean
	/**
	 * 自定义命令
	 */
	addCommands?: (this: Editor) => EditorCommandsType

	constructor(name: string) {
		this.name = name
	}

	/**
	 * 创建插件
	 */
	static create(options: ExtensionCreateOptionType) {
		const extension = new Extension(options.name)
		if (options.emptyRenderTags) extension.emptyRenderTags = options.emptyRenderTags
		if (options.extraKeepTags) extension.extraKeepTags = options.extraKeepTags
		if (options.formatRules) extension.formatRules = options.formatRules
		if (options.domParseNodeCallback) extension.domParseNodeCallback = options.domParseNodeCallback
		if (options.onSelectionUpdate) extension.onSelectionUpdate = options.onSelectionUpdate
		if (options.onInsertParagraph) extension.onInsertParagraph = options.onInsertParagraph
		if (options.onDeleteComplete) extension.onDeleteComplete = options.onDeleteComplete
		if (options.onKeydown) extension.onKeydown = options.onKeydown
		if (options.onKeyup) extension.onKeyup = options.onKeyup
		if (options.onFocus) extension.onFocus = options.onFocus
		if (options.onBlur) extension.onBlur = options.onBlur
		if (options.pasteKeepMarks) extension.pasteKeepMarks = options.pasteKeepMarks
		if (options.pasteKeepStyles) extension.pasteKeepStyles = options.pasteKeepStyles
		if (options.afterUpdateView) extension.afterUpdateView = options.afterUpdateView
		if (options.onDetachMentBlockFromParentCallback) extension.onDetachMentBlockFromParentCallback = options.onDetachMentBlockFromParentCallback
		if (options.addCommands) extension.addCommands = options.addCommands
		return extension
	}
}
