import { Editor } from '../Editor';
import { KNode } from '../KNode';
/**
 * 格式化函数类型
 */
export type RuleFunctionType = (state: {
    editor: Editor;
    node: KNode;
}) => void;
/**
 * 针对节点自身：将带有 contenteditable="false" 标记的节点统一转为闭合节点，并移除该标记（渲染时由框架统一添加）
 */
export declare const formatContenteditableToClosed: RuleFunctionType;
/**
 * 针对节点自身：处理块节点的标签，部分块节点需要转为默认块节点标签
 */
export declare const formatBlockTagParse: RuleFunctionType;
/**
 * 针对子节点中的块节点：
 * 1. 子节点中含有块节点则该节点转为块节点；
 * 2. 子节点中含有块节点，则其他节点也转为块节点
 */
export declare const formatBlockInChildren: RuleFunctionType;
/**
 * 针对节点的子节点数组：处理子节点中的占位符，如果占位符和其他节点共存则删除占位符，如果只存在占位符则将多个占位符合并为一个（光标可能会更新）
 */
export declare const formatPlaceholderMerge: RuleFunctionType;
/**
 * 针对节点自身：
 * 1. 统一将文本节点内的\r\n换成\n，解决Windows兼容问题
 * 2. 统一将文本节点内的&nbsp;（\u00A0）换成普通空格
 * 3. 统一将文本节点内的零宽度无断空格换成零宽度空格（\uFEFF -> \u200B）
 * 4. 统一将文本节点内的\n后面加上零宽度空白字符
 */
export declare const formatLineBreakSpaceText: RuleFunctionType;
/**
 * 针对节点自身：将文本节点内连续的零宽度空白字符合并（光标可能会更新）
 */
export declare const formatZeroWidthTextMerge: RuleFunctionType;
/**
 * 针对节点的子节点数组：兄弟节点合并策略（光标可能会更新）
 */
export declare const formatSiblingNodesMerge: RuleFunctionType;
/**
 * 针对节点的子节点数组：父子节点合并策略（光标可能会更新）
 */
export declare const formatParentNodeMerge: RuleFunctionType;
