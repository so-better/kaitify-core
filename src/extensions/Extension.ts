import { Editor, KNode, KNodeMarksType, KNodeStylesType, RuleFunctionType } from '../model'

/**
 * 插件的指令方法类型
 */
export type ExtensionCommandType = {
	[name: string]: (...args: any[]) => void
}

/**
 * 创建插件的入参类型
 */
export type ExtensionCreateOptionType = {
	/**
	 * 插件名称
	 */
	name: string
	/**
	 * 额外保留的标签
	 */
	extraKeepTags?: string[]
	/**
	 * 自定义格式化规则
	 */
	formatRule?: RuleFunctionType
	/**
	 * 自定义dom转为非文本节点的后续处理
	 */
	domParseNodeCallback?: (this: Editor, node: KNode) => KNode
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
	 * 额外保留的标签
	 */
	extraKeepTags: string[] = []
	/**
	 * 自定义格式化规则
	 */
	formatRule?: RuleFunctionType
	/**
	 * 自定义dom转为非文本节点的后续处理
	 */
	domParseNodeCallback?: (this: Editor, node: KNode) => KNode
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

	constructor(name: string) {
		this.name = name
	}

	/**
	 * 创建插件
	 */
	static create(options: ExtensionCreateOptionType) {
		const extension = new Extension(options.name)
		if (options.extraKeepTags) extension.extraKeepTags = options.extraKeepTags
		if (options.formatRule) extension.formatRule = options.formatRule
		if (options.domParseNodeCallback) extension.domParseNodeCallback = options.domParseNodeCallback
		if (options.pasteKeepMarks) extension.pasteKeepMarks = options.pasteKeepMarks
		if (options.pasteKeepStyles) extension.pasteKeepStyles = options.pasteKeepStyles
		if (options.afterUpdateView) extension.afterUpdateView = options.afterUpdateView
		return extension
	}
}
