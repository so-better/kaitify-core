import { KNode } from './KNode';
import { Selection } from './Selection';
import { History } from './History';
import { RuleFunctionType } from './config/format-rules';
/**
 * 编辑器获取光标范围内节点数据的类型
 */
export type EditorSelectedType = {
    node: KNode;
    offset: number[] | false;
};
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
     * 自定义节点数组格式化规则
     */
    formatRules?: RuleFunctionType[];
    /**
     * 自定义dom转为非文本节点的后续处理
     */
    domParseNodeCallback?: (this: Editor, node: KNode) => KNode;
    /**
     * 合并块节点之前触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
     */
    onMergeBlockNode?: (this: Editor, node: KNode, target: KNode) => boolean;
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
     * 编辑器粘贴除了图片和视频以外的文件时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
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
     * 编辑器创建完成后触发的回调，在这里你可以增加额外的处理
     */
    onCreated?: (this: Editor) => void;
};
/**
 * 编辑器核心类
 */
export declare class Editor {
    /**
     * 编辑器的真实dom
     */
    $el?: HTMLElement;
    /**
     * 是否允许复制
     */
    allowCopy: boolean;
    /**
     * 是否允许粘贴
     */
    allowPaste: boolean;
    /**
     * 是否允许剪切
     */
    allowCut: boolean;
    /**
     * 是否允许粘贴html
     */
    allowPasteHtml: boolean;
    /**
     * 编辑器内渲染文本节点的真实标签
     */
    textRenderTag: string;
    /**
     * 编辑内渲染默认块级节点的真实标签，即段落标签
     */
    blockRenderTag: string;
    /**
     * 编辑器内定义不显示的标签
     */
    voidRenderTags: string[];
    /**
     * 编辑器内定义需要置空的标签
     */
    emptyRenderTags: string[];
    /**
     * 编辑器内额外保留的标签
     */
    extraKeepTags: string[];
    /**
     * 编辑器的节点数组格式化规则
     */
    formatRules: RuleFunctionType[];
    /**
     * 自定义dom转为非文本节点的后续处理
     */
    domParseNodeCallback?: (this: Editor, node: KNode) => KNode;
    /**
     * 合并块节点之前触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
     */
    onMergeBlockNode?: (this: Editor, node: KNode, target: KNode) => boolean;
    /**
     * 视图渲染时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要自定义渲染视图
     */
    onUpdateView?: (this: Editor, init: boolean) => boolean | Promise<boolean>;
    /**
     * 编辑器粘贴纯文本时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
     */
    onPasteText?: (text: string) => boolean | Promise<boolean>;
    /**
     * 编辑器粘贴html内容时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
     */
    onPasteHtml?: (nodes: KNode[], html: string) => boolean | Promise<boolean>;
    /**
     * 编辑器粘贴图片时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
     */
    onPasteImage?: (file: File) => boolean | Promise<boolean>;
    /**
     * 编辑器粘贴视频时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
     */
    onPasteVideo?: (file: File) => boolean | Promise<boolean>;
    /**
     * 编辑器粘贴除了图片和视频以外的文件时触发，需要自定义处理
     */
    onPasteFile?: (file: File) => void | Promise<void>;
    /**
     * 编辑器内容改变触发
     */
    onChange?: (this: Editor, newVal: string, oldVal: string) => void;
    /**
     * 编辑器光标发生变化
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
     * 唯一id
     */
    guid: number;
    /**
     * 虚拟光标
     */
    selection: Selection;
    /**
     * 历史记录
     */
    history: History;
    /**
     * 节点数组
     */
    stackNodes: KNode[];
    /**
     * 旧节点数组
     */
    oldStackNodes: KNode[];
    /**
     * 是否在输入中文
     */
    isComposition: boolean;
    /**
     * 是否编辑器内部渲染真实光标引起selctionChange事件
     */
    internalCauseSelectionChange: boolean;
    /**
     * dom监听
     */
    domObserver: MutationObserver | null;
    /**
     * 根据dom查找到编辑内的对应节点
     */
    findNode(dom: HTMLElement): KNode;
    /**
     * 根据编辑器内的node查找真实dom
     */
    findDom(node: KNode): HTMLElement;
    /**
     * 设置编辑器是否可编辑
     */
    setEditable(editable: boolean): void;
    /**
     * 判断编辑器是否可编辑
     */
    isEditable(): boolean;
    /**
     * 初始化校验编辑器的节点数组，如果编辑器的节点数组为空或者都是空节点，则初始化创建一个只有占位符的段落
     */
    checkNodes(): void;
    /**
     * 将编辑器内的某个非块级节点转为默认块级节点
     */
    convertToBlock(node: KNode): void;
    /**
     * dom转KNode
     */
    domParseNode(dom: Node): KNode;
    /**
     * html转KNode
     */
    htmlParseNode(html: string): KNode[];
    /**
     * 判断节点是否根级块节点，如果该节点在根部但不是块节点返回false
     */
    isRootBlock(node: KNode): boolean;
    /**
     * 获取指定节点所在的根级块节点，如果该节点没有加入到编辑器内那么会返回null
     */
    getRootBlock(node: KNode): KNode | null;
    /**
     * 将后一个块节点与前一个块节点合并
     */
    mergeBlock(node: KNode, target: KNode): void;
    /**
     * 将指定节点添加到某个节点的子节点数组里
     */
    addNode(node: KNode, parentNode: KNode, index?: number | undefined): void;
    /**
     * 将指定节点添加到某个节点前面
     */
    addNodeBefore(node: KNode, target: KNode): void;
    /**
     * 将指定节点添加到某个节点后面
     */
    addNodeAfter(node: KNode, target: KNode): void;
    /**
     * 获取某个节点内的最后一个可以设置光标点的节点
     */
    getLastSelectionNodeInChildren(node: KNode): KNode | null;
    /**
     * 获取某个节点内的第一个可以设置光标点的节点
     */
    getFirstSelectionNodeInChildren(node: KNode): KNode | null;
    /**
     * 查找指定节点之前可以设置为光标点的非空节点
     */
    getPreviousSelectionNode(node: KNode): KNode | null;
    /**
     * 查找指定节点之后可以设置为光标点的非空节点
     */
    getNextSelectionNode(node: KNode): KNode | null;
    /**
     * 设置光标到指定节点头部，如果没有指定节点则设置光标到编辑器头部，start表示只设置起点，end表示只设置终点，all表示起点和终点都设置
     */
    setSelectionBefore(node?: KNode, type?: 'all' | 'start' | 'end' | undefined): void;
    /**
     * 设置光标到指定节点的末尾，如果没有指定节点则设置光标到编辑器末尾，start表示只设置起点，end表示只设置终点，all表示起点和终点都设置
     */
    setSelectionAfter(node?: KNode, type?: 'all' | 'start' | 'end' | undefined): void;
    /**
     * 更新指定光标到离当前光标点最近的节点上，start表示只更新起点，end表示只更新终点，all表示起点和终点都更新
     */
    updateSelectionRecently(type?: 'all' | 'start' | 'end' | undefined): void;
    /**
     * 判断光标是否在某个节点内，start表示只判断起点，end表示只判断终点，all表示起点和终点都判断
     */
    isSelectionInNode(node: KNode, type?: 'all' | 'start' | 'end' | undefined): boolean | undefined;
    /**
     * 判断编辑器内的指定节点是否可以进行合并操作，parent表示和父节点进行合并，sibling表示和相邻节点进行合并，如果可以返回合并的对象节点
     */
    getAllowMergeNode(node: KNode, type: 'parent' | 'prevSibling' | 'nextSibling'): KNode | null;
    /**
     * 对编辑器内的某个节点执行合并操作，parent表示和父节点进行合并，sibling表示和相邻节点进行合并（可能会更新光标）
     */
    applyMergeNode(node: KNode, type: 'parent' | 'prevSibling' | 'nextSibling'): void;
    /**
     * 对编辑器内的某个节点使用指定规则进行格式化
     */
    formatNode(node: KNode, rule: RuleFunctionType, receiver: KNode[]): void;
    /**
     * 获取光标选区内的节点
     */
    getSelectedNodes(): EditorSelectedType[];
    /**
     * 清空固定块节点的内容
     */
    emptyFixedBlock(node: KNode): void;
    /**
     * 向选区插入文本
     */
    insertText(text: string): void;
    /**
     * 向选区进行换行
     */
    insertParagraph(): void;
    /**
     * 向选区插入节点，cover为true表示当向某个只有占位符的非固定块节点被插入另一个非固定块节点时是否覆盖此节点，而不是直接插入进去
     */
    insertNode(node: KNode, cover?: boolean | undefined): void;
    /**
     * 对选区进行删除
     */
    delete(): void;
    /**
     * 更新编辑器视图
     */
    updateView(unPushHistory?: boolean | undefined): Promise<void>;
    /**
     * 根据selection更新编辑器真实光标
     */
    updateRealSelection(): Promise<void>;
    /**
     * 根据真实光标更新selection，返回布尔值表示是否更新成功
     */
    updateSelection(): boolean;
    /**
     * 如果编辑器内有滚动条，滚动编辑器到光标可视范围
     */
    scrollViewToSelection(): void;
    /**
     * 撤销
     */
    undo(): void;
    /**
     * 重做
     */
    redo(): void;
    /**
     * 销毁编辑器的方法
     */
    destroy(): void;
    /**
     * 配置编辑器，返回创建的编辑器
     */
    static configure(options: EditorConfigureOptionType): Promise<Editor>;
}
