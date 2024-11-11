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
    [name: string]: ((...args: any[]) => any | void) | undefined;
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
     * 剪切板同时存在文件和html/text时，是否优先粘贴文件
     */
    priorityPasteFiles?: boolean;
    /**
     * 自定义编辑器内渲染文本节点的真实标签
     */
    textRenderTag?: string;
    /**
     * 自定义编辑内渲染默认块级节点的真实标签，即段落标签
     */
    blockRenderTag?: string;
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
     * 换行时触发，参数为换行操作后光标所在的块节点
     */
    onInsertParagraph?: (this: Editor, node: KNode) => void;
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
     * 视图更新前回调方法
     */
    beforeUpdateView?: (this: Editor) => void;
    /**
     * 视图更新后回调方法
     */
    afterUpdateView?: (this: Editor) => void;
    /**
     * 在删除和换行操作中块节点节点从其父节点中抽离出去成为与父节点同级的节点后触发，如果返回true则表示继续使用默认逻辑，会将该节点转为段落，返回false则不走默认逻辑，需要自定义处理
     */
    onDetachMentBlockFromParentCallback?: (this: Editor, node: KNode) => boolean;
    /**
     * 编辑器updateView执行时，通过比对新旧节点数组获取需要格式化的节点，在这些节点被格式化前，触发此方法，回调参数即当前需要被格式化的节点，该方法返回一个节点，返回的节点将会被格式化，如果你不需要任何特殊处理，返回入参提供的节点即可
     */
    beforePatchNodeToFormat?: (this: Editor, node: KNode) => KNode;
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
     * 编辑器内容只有一个段落时的默认文本
     */
    placeholder?: string;
    /**
     * 是否深色模式
     */
    dark?: boolean;
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
     * 剪切板同时存在文件和html/text时，是否优先粘贴文件【初始化后可以修改】
     */
    priorityPasteFiles: boolean;
    /**
     * 编辑器内渲染文本节点的真实标签【初始化后不建议修改】
     */
    textRenderTag: string;
    /**
     * 编辑内渲染默认块级节点的真实标签，即段落标签【初始化后不建议修改】
     */
    blockRenderTag: string;
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
     * 换行时触发，参数为换行操作后光标所在的块节点
     */
    onInsertParagraph?: (this: Editor, node: KNode) => void;
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
     * 视图更新前回调方法【初始化后不可修改】
     */
    beforeUpdateView?: (this: Editor) => void;
    /**
     * 视图更新后回调方法【初始化后不可修改】
     */
    afterUpdateView?: (this: Editor) => void;
    /**
     * 在删除和换行操作中块节点节点从其父节点中抽离出去成为与父节点同级的节点后触发，如果返回true则表示继续使用默认逻辑，会将该节点转为段落，返回false则不走默认逻辑，需要自定义处理【初始化后不可修改】
     */
    onDetachMentBlockFromParentCallback?: (this: Editor, node: KNode) => boolean;
    /**
     * 编辑器updateView执行时，通过比对新旧节点数组获取需要格式化的节点，在这些节点被格式化前，触发此方法，回调参数即当前需要被格式化的节点，该方法返回一个节点，返回的节点将会被格式化，如果你不需要任何特殊处理，返回入参提供的节点即可【初始化后不可修改】
     */
    beforePatchNodeToFormat?: (this: Editor, node: KNode) => KNode;
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
     * 命令集合【不可修改】
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
     * 是否用户操作的删除行为，如果是用户操作的删除行为，则在处理不可编辑的节点是会删除该节点，如果是API调用的删除方法则走正常的删除逻辑【不可修改】
     */
    isUserDelection: boolean;
    /**
     * dom监听【不可修改】
     */
    domObserver: MutationObserver | null;
    /**
     * 如果编辑器内有滚动条，滚动编辑器到光标可视范围
     */
    scrollViewToSelection(): void;
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
     * 设置编辑器是否深色模式
     */
    setDark(dark: boolean): void;
    /**
     * 是否深色模式
     */
    isDark(): boolean;
    /**
     * dom转KNode
     */
    domParseNode(dom: Node): KNode;
    /**
     * html转KNode
     */
    htmlParseNode(html: string): KNode[];
    /**
     * 将指定节点所在的块节点转为段落
     */
    toParagraph(node: KNode): void;
    /**
     * 指定的块节点是否是一个段落
     */
    isParagraph(node: KNode): boolean;
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
     * 获取某个节点内的最后一个可以设置光标点的节点，包括自身
     */
    getLastSelectionNodeInChildren(node: KNode): KNode | null;
    /**
     * 获取某个节点内的第一个可以设置光标点的节点，包括自身
     */
    getFirstSelectionNodeInChildren(node: KNode): KNode | null;
    /**
     * 查找指定节点之前可以设置为光标点的非空节点，不包括自身
     */
    getPreviousSelectionNode(node: KNode): KNode | null;
    /**
     * 查找指定节点之后可以设置为光标点的非空节点，不包括自身
     */
    getNextSelectionNode(node: KNode): KNode | null;
    /**
     * 设置光标到指定节点内部的起始处，如果没有指定节点则设置光标到编辑器起始处，start表示只设置起点，end表示只设置终点，all表示起点和终点都设置
     */
    setSelectionBefore(node?: KNode, type?: 'all' | 'start' | 'end' | undefined): void;
    /**
     * 设置光标到指定节点内部的末尾处，如果没有指定节点则设置光标到编辑器末尾处，start表示只设置起点，end表示只设置终点，all表示起点和终点都设置
     */
    setSelectionAfter(node?: KNode, type?: 'all' | 'start' | 'end' | undefined): void;
    /**
     * 更新指定光标到离当前光标点最近的节点上，start表示只更新起点，end表示只更新终点，all表示起点和终点都更新，不包括当前光标所在节点
     */
    updateSelectionRecently(type?: 'all' | 'start' | 'end' | undefined): void;
    /**
     * 判断光标是否在某个节点内，start表示只判断起点，end表示只判断终点，all表示起点和终点都判断
     */
    isSelectionInNode(node: KNode, type?: 'all' | 'start' | 'end' | undefined): boolean | undefined;
    /**
     * 获取光标选区内的节点数据
     */
    getSelectedNodes(): EditorSelectedType[];
    /**
     * 判断光标范围内的可聚焦节点是否全都在同一个符合条件节点内，如果是返回那个符合条件的节点，否则返回null
     */
    getMatchNodeBySelection(options: KNodeMatchOptionType): KNode | null;
    /**
     * 判断光标范围内的可聚焦节点是否全都在符合条件的（不一定是同一个）节点内
     */
    isSelectionNodesAllMatch(options: KNodeMatchOptionType): boolean;
    /**
     * 判断光标范围内是否有可聚焦节点在符合条件的节点内
     */
    isSelectionNodesSomeMatch(options: KNodeMatchOptionType): boolean;
    /**
     * 获取所有在光标范围内的可聚焦节点，该方法拿到的可聚焦节点（文本）可能部分区域不在光标范围内
     */
    getFocusNodesBySelection(type?: 'all' | 'closed' | 'text' | undefined): KNode[];
    /**
     * 获取所有在光标范围内的可聚焦节点，该方法可能会切割部分文本节点，摒弃其不在光标范围内的部分，所以也可能会更新光标的位置
     */
    getFocusSplitNodesBySelection(type?: 'all' | 'closed' | 'text' | undefined): KNode[];
    /**
     * 向选区插入文本
     */
    insertText(text: string): void;
    /**
     * 向选区进行换行，如果所在块节点只有占位符并且块节点不是段落则会转为段落
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
    updateView(updateRealSelection?: boolean | undefined, unPushHistory?: boolean | undefined): Promise<void>;
    /**
     * 根据selection更新编辑器真实光标
     */
    updateRealSelection(): Promise<void>;
    /**
     * 重新渲染编辑器视图，不会触发onChange
     */
    review(value: string): Promise<void>;
    /**
     * 销毁编辑器的方法
     */
    destroy(): void;
    /**
     * 获取编辑器的纯文本内容
     */
    getText(): string;
    /**
     * 配置编辑器，返回创建的编辑器
     */
    static configure(options: EditorConfigureOptionType): Promise<Editor>;
}
