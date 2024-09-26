import { KNode, KNodeMarksType, KNodeMatchOptionType, KNodeStylesType } from './KNode';
import { Selection } from './Selection';
import { History } from './History';
import { RuleFunctionType } from './config/format-rules';
import { Extension } from '../extensions';

/**
 * 编辑器获取光标范围内节点数据的类型
 */
export type EditorSelectedType = {
    node: KNode;
    offset: number[] | false;
};
/**
 * 编辑器命令集合类型
 */
export interface EditorCommandsType {
    [name: string]: ((...args: any[]) => void) | undefined;
}
/**
 * 编辑器配置入参类型
 */
export type EditorConfigureOptionType = {
    /**
     * 编辑器渲染的dom或者选择器
     */
    el: HTMLElement | string;
    /**
     * 是否允许复制
     */
    allowCopy?: boolean;
    /**
     * 是否允许粘贴
     */
    allowPaste?: boolean;
    /**
     * 是否允许剪切
     */
    allowCut?: boolean;
    /**
     * 是否允许粘贴html
     */
    allowPasteHtml?: boolean;
    /**
     * 自定义编辑器内渲染文本节点的真实标签
     */
    textRenderTag?: string;
    /**
     * 自定义编辑内渲染默认块级节点的真实标签，即段落标签
     */
    blockRenderTag?: string;
    /**
     * 自定义编辑器内定义不显示的标签
     */
    voidRenderTags?: string[];
    /**
     * 自定义编辑器内定义需要置空的标签
     */
    emptyRenderTags?: string[];
    /**
     * 自定义编辑器内额外保留的标签
     */
    extraKeepTags?: string[];
    /**
     * 自定义插件数组
     */
    extensions?: Extension[];
    /**
     * 自定义节点数组格式化规则
     */
    formatRules?: RuleFunctionType[];
    /**
     * 自定义dom转为非文本节点的后续处理
     */
    domParseNodeCallback?: (this: Editor, node: KNode) => KNode;
    /**
     * 视图渲染时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要自定义渲染视图
     */
    onUpdateView?: (this: Editor, init: boolean) => boolean | Promise<boolean>;
    /**
     * 编辑器粘贴纯文本时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
     */
    onPasteText?: (this: Editor, text: string) => boolean | Promise<boolean>;
    /**
     * 编辑器粘贴html内容时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
     */
    onPasteHtml?: (this: Editor, nodes: KNode[], html: string) => boolean | Promise<boolean>;
    /**
     * 编辑器粘贴图片时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
     */
    onPasteImage?: (this: Editor, file: File) => boolean | Promise<boolean>;
    /**
     * 编辑器粘贴视频时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
     */
    onPasteVideo?: (this: Editor, file: File) => boolean | Promise<boolean>;
    /**
     * 编辑器粘贴除了图片和视频以外的文件时触发，需要自定义处理
     */
    onPasteFile?: (this: Editor, file: File) => void | Promise<void>;
    /**
     * 编辑器内容改变触发
     */
    onChange?: (this: Editor, newVal: string, oldVal: string) => void;
    /**
     * 编辑器光标发生变化触发
     */
    onSelectionUpdate?: (this: Editor, selection: Selection) => void;
    /**
     * 插入段落时触发
     */
    onInsertParagraph?: (this: Editor, blockNode: KNode, previousBlockNode: KNode) => void;
    /**
     * 光标在编辑器起始位置执行删除时触发
     */
    onDeleteInStart?: (this: Editor, blockNode: KNode) => void;
    /**
     * 完成删除时触发
     */
    onDeleteComplete?: (this: Editor) => void;
    /**
     * 光标在编辑器内时键盘按下触发
     */
    onKeydown?: (this: Editor, event: KeyboardEvent) => void;
    /**
     * 光标在编辑器内时键盘松开触发
     */
    onKeyup?: (this: Editor, event: KeyboardEvent) => void;
    /**
     * 编辑器聚焦时触发
     */
    onFocus?: (this: Editor, event: FocusEvent) => void;
    /**
     * 编辑器失焦时触发
     */
    onBlur?: (this: Editor, event: FocusEvent) => void;
    /**
     * 节点粘贴保留标记的自定义方法
     */
    pasteKeepMarks?: (this: Editor, node: KNode) => KNodeMarksType;
    /**
     * 节点粘贴保留样式的自定义方法
     */
    pasteKeepStyles?: (this: Editor, node: KNode) => KNodeStylesType;
    /**
     * 视图更新后回调方法
     */
    afterUpdateView?: (this: Editor) => void;
    /**
     * 编辑器的初始默认值
     */
    value: string;
    /**
     * 编辑器初始是否可编辑，默认true
     */
    editable?: boolean;
    /**
     * 是否自动聚焦
     */
    autofocus?: boolean;
    /**
     * 是否使用默认css样式
     */
    useDefaultCSS?: boolean;
};
/**
 * 编辑器核心类
 */
export declare class Editor {
    /**
     * 编辑器的真实dom【初始化后不可修改】
     */
    $el?: HTMLElement;
    /**
     * 是否允许复制【初始化后可以修改】
     */
    allowCopy: boolean;
    /**
     * 是否允许粘贴【初始化后可以修改】
     */
    allowPaste: boolean;
    /**
     * 是否允许剪切【初始化后可以修改】
     */
    allowCut: boolean;
    /**
     * 是否允许粘贴html【初始化后可以修改】
     */
    allowPasteHtml: boolean;
    /**
     * 编辑器内渲染文本节点的真实标签【初始化后不建议修改】
     */
    textRenderTag: string;
    /**
     * 编辑内渲染默认块级节点的真实标签，即段落标签【初始化后不建议修改】
     */
    blockRenderTag: string;
    /**
     * 编辑器内定义不显示的标签【初始化后不建议修改】
     */
    voidRenderTags: string[];
    /**
     * 编辑器内定义需要置空的标签【初始化后不建议修改】
     */
    emptyRenderTags: string[];
    /**
     * 编辑器内额外保留的标签【初始化后不建议修改】
     */
    extraKeepTags: string[];
    /**
     * 插件数组【初始化后不可修改】
     */
    extensions: Extension[];
    /**
     * 编辑器的节点数组格式化规则【初始化后不可修改】
     */
    formatRules: RuleFunctionType[];
    /**
     * 自定义dom转为非文本节点的后续处理【初始化后不可修改】
     */
    domParseNodeCallback?: (this: Editor, node: KNode) => KNode;
    /**
     * 视图渲染时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要自定义渲染视图【初始化后不可修改】
     */
    onUpdateView?: (this: Editor, init: boolean) => boolean | Promise<boolean>;
    /**
     * 编辑器粘贴纯文本时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理【初始化后不可修改】
     */
    onPasteText?: (this: Editor, text: string) => boolean | Promise<boolean>;
    /**
     * 编辑器粘贴html内容时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理【初始化后不可修改】
     */
    onPasteHtml?: (this: Editor, nodes: KNode[], html: string) => boolean | Promise<boolean>;
    /**
     * 编辑器粘贴图片时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理【初始化后不可修改】
     */
    onPasteImage?: (this: Editor, file: File) => boolean | Promise<boolean>;
    /**
     * 编辑器粘贴视频时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理【初始化后不可修改】
     */
    onPasteVideo?: (this: Editor, file: File) => boolean | Promise<boolean>;
    /**
     * 编辑器粘贴除了图片和视频以外的文件时触发，需要自定义处理【初始化后不可修改】
     */
    onPasteFile?: (this: Editor, file: File) => void | Promise<void>;
    /**
     * 编辑器内容改变触发【初始化后不可修改】
     */
    onChange?: (this: Editor, newVal: string, oldVal: string) => void;
    /**
     * 编辑器光标发生变化【初始化后不可修改】
     */
    onSelectionUpdate?: (this: Editor, selection: Selection) => void;
    /**
     * 插入段落时触发【初始化后不可修改】
     */
    onInsertParagraph?: (this: Editor, blockNode: KNode, previousBlockNode: KNode) => void;
    /**
     * 光标在编辑器起始位置执行删除时触发【初始化后不可修改】
     */
    onDeleteInStart?: (this: Editor, blockNode: KNode) => void;
    /**
     * 完成删除时触发【初始化后不可修改】
     */
    onDeleteComplete?: (this: Editor) => void;
    /**
     * 光标在编辑器内时键盘按下触发【初始化后不可修改】
     */
    onKeydown?: (this: Editor, event: KeyboardEvent) => void;
    /**
     * 光标在编辑器内时键盘松开触发【初始化后不可修改】
     */
    onKeyup?: (this: Editor, event: KeyboardEvent) => void;
    /**
     * 编辑器聚焦时触发【初始化后不可修改】
     */
    onFocus?: (this: Editor, event: FocusEvent) => void;
    /**
     * 编辑器失焦时触发【初始化后不可修改】
     */
    onBlur?: (this: Editor, event: FocusEvent) => void;
    /**
     * 节点粘贴保留标记的自定义方法【初始化后不可修改】
     */
    pasteKeepMarks?: (this: Editor, node: KNode) => KNodeMarksType;
    /**
     * 节点粘贴保留样式的自定义方法【初始化后不可修改】
     */
    pasteKeepStyles?: (this: Editor, node: KNode) => KNodeStylesType;
    /**
     * 视图更新后回调方法【初始化后不可修改】
     */
    afterUpdateView?: (this: Editor) => void;
    /**
     * 唯一id【不可修改】
     */
    guid: number;
    /**
     * 虚拟光标【不建议修改】
     */
    selection: Selection;
    /**
     * 历史记录【不建议修改】
     */
    history: History;
    /**
     * 命令集合
     */
    commands: EditorCommandsType;
    /**
     * 节点数组【不建议修改】
     */
    stackNodes: KNode[];
    /**
     * 旧节点数组【不可修改】
     */
    oldStackNodes: KNode[];
    /**
     * 是否在输入中文【不可修改】
     */
    isComposition: boolean;
    /**
     * 是否编辑器内部渲染真实光标引起selctionChange事件【不可修改】
     */
    internalCauseSelectionChange: boolean;
    /**
     * dom监听【不可修改】
     */
    domObserver: MutationObserver | null;
    /**
     * 将后一个块节点与前一个块节点合并
     */
    mergeBlock(node: KNode, target: KNode): void;
    /**
     * 判断编辑器内的指定节点是否可以进行合并操作，parent表示和父节点进行合并，sibling表示和相邻节点进行合并，如果可以返回合并的对象节点
     */
    getAllowMergeNode(node: KNode, type: 'parent' | 'prevSibling' | 'nextSibling'): KNode | null;
    /**
     * 对编辑器内的某个节点执行合并操作，parent表示和父节点进行合并，sibling表示和相邻节点进行合并（可能会更新光标）
     */
    applyMergeNode(node: KNode, type: 'parent' | 'prevSibling' | 'nextSibling'): void;
    /**
     * 对节点数组使用指定规则进行格式化
     */
    formatNodes(rule: RuleFunctionType, nodes: KNode[]): void;
    /**
     * 清空固定块节点的内容
     */
    emptyFixedBlock(node: KNode): void;
    /**
     * 注册插件
     */
    registerExtension(extension: Extension): void;
    /**
     * 【API】如果编辑器内有滚动条，滚动编辑器到光标可视范围
     */
    scrollViewToSelection(): void;
    /**
     * 【API】根据dom查找到编辑内的对应节点
     */
    findNode(dom: HTMLElement): KNode;
    /**
     * 【API】根据编辑器内的node查找真实dom
     */
    findDom(node: KNode): HTMLElement;
    /**
     * 【API】设置编辑器是否可编辑
     */
    setEditable(editable: boolean): void;
    /**
     * 【API】判断编辑器是否可编辑
     */
    isEditable(): boolean;
    /**
     * 【API】初始化校验编辑器的节点数组，如果编辑器的节点数组为空或者都是空节点，则初始化创建一个只有占位符的段落
     */
    checkNodes(): void;
    /**
     * 【API】将编辑器内的某个非块级节点转为默认块级节点
     */
    convertToBlock(node: KNode): void;
    /**
     * 【API】dom转KNode
     */
    domParseNode(dom: Node): KNode;
    /**
     * 【API】html转KNode
     */
    htmlParseNode(html: string): KNode[];
    /**
     * 【API】将指定节点添加到某个节点的子节点数组里
     */
    addNode(node: KNode, parentNode: KNode, index?: number | undefined): void;
    /**
     * 【API】将指定节点添加到某个节点前面
     */
    addNodeBefore(node: KNode, target: KNode): void;
    /**
     * 【API】将指定节点添加到某个节点后面
     */
    addNodeAfter(node: KNode, target: KNode): void;
    /**
     * 【API】获取某个节点内的最后一个可以设置光标点的节点
     */
    getLastSelectionNodeInChildren(node: KNode): KNode | null;
    /**
     * 【API】获取某个节点内的第一个可以设置光标点的节点
     */
    getFirstSelectionNodeInChildren(node: KNode): KNode | null;
    /**
     * 【API】查找指定节点之前可以设置为光标点的非空节点
     */
    getPreviousSelectionNode(node: KNode): KNode | null;
    /**
     * 【API】查找指定节点之后可以设置为光标点的非空节点
     */
    getNextSelectionNode(node: KNode): KNode | null;
    /**
     * 【API】设置光标到指定节点头部，如果没有指定节点则设置光标到编辑器头部，start表示只设置起点，end表示只设置终点，all表示起点和终点都设置
     */
    setSelectionBefore(node?: KNode, type?: 'all' | 'start' | 'end' | undefined): void;
    /**
     * 【API】设置光标到指定节点的末尾，如果没有指定节点则设置光标到编辑器末尾，start表示只设置起点，end表示只设置终点，all表示起点和终点都设置
     */
    setSelectionAfter(node?: KNode, type?: 'all' | 'start' | 'end' | undefined): void;
    /**
     * 【API】更新指定光标到离当前光标点最近的节点上，start表示只更新起点，end表示只更新终点，all表示起点和终点都更新
     */
    updateSelectionRecently(type?: 'all' | 'start' | 'end' | undefined): void;
    /**
     * 【API】判断光标是否在某个节点内，start表示只判断起点，end表示只判断终点，all表示起点和终点都判断
     */
    isSelectionInNode(node: KNode, type?: 'all' | 'start' | 'end' | undefined): boolean | undefined;
    /**
     * 【API】获取光标选区内的节点
     */
    getSelectedNodes(): EditorSelectedType[];
    /**
     * 【API】判断光标范围内的可聚焦节点是否全都在同一个符合条件节点内，如果是返回那个符合条件的节点，否则返回null
     */
    getMatchNodeBySelection(options: KNodeMatchOptionType): KNode | null;
    /**
     * 【API】判断光标范围内的可聚焦节点是否全都在符合条件的节点内（不一定是同一个节点）
     */
    isSelectionNodesAllMatch(options: KNodeMatchOptionType): boolean;
    /**
     * 【API】判断光标范围内是否有可聚焦节点在符合条件的节点内
     */
    isSelectionNodesSomeMatch(options: KNodeMatchOptionType): boolean;
    /**
     * 【API】获取所有在光标范围内的可聚焦节点，该方法拿到的可聚焦节点（文本）可能部分区域不在光标范围内
     */
    getFocusNodesBySelection(type?: 'all' | 'closed' | 'text' | undefined): KNode[];
    /**
     * 【API】向选区插入文本
     */
    insertText(text: string): void;
    /**
     * 【API】向选区进行换行
     */
    insertParagraph(): void;
    /**
     * 【API】向选区插入节点，cover为true表示当向某个只有占位符的非固定块节点被插入另一个非固定块节点时是否覆盖此节点，而不是直接插入进去
     */
    insertNode(node: KNode, cover?: boolean | undefined): void;
    /**
     * 【API】对选区进行删除
     */
    delete(): void;
    /**
     * 【API】更新编辑器视图
     */
    updateView(unPushHistory?: boolean | undefined): Promise<void>;
    /**
     * 【API】根据selection更新编辑器真实光标
     */
    updateRealSelection(): Promise<void>;
    /**
     * 【API】根据真实光标更新selection，返回布尔值表示是否更新成功
     */
    updateSelection(): boolean;
    /**
     * 【API】销毁编辑器的方法
     */
    destroy(): void;
    /**
     * 【API】配置编辑器，返回创建的编辑器
     */
    static configure(options: EditorConfigureOptionType): Promise<Editor>;
}
