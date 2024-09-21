import { Editor } from '../Editor';
import { KNode } from '../KNode';
/**
 * 格式化函数类型
 */
export type RuleFunctionType = (opts: {
    editor: Editor;
    node: KNode;
}) => void;
/**
 * 处理子节点中的块节点，如果父节点是行内节点则将块节点转为行内节点，如果块节点和其他节点并存亦将块节点转为行内节点
 */
export declare const formatBlockInChildren: RuleFunctionType;
/**
 * 处理子节点中的占位符，如果占位符和其他节点共存则删除占位符，如果只存在占位符则将多个占位符合并为一个（光标可能会更新）
 */
export declare const formatPlaceholderMerge: RuleFunctionType;
/**
 * 兄弟节点合并策略（光标可能会更新）
 */
export declare const formatSiblingNodesMerge: RuleFunctionType;
/**
 * 父子节点合并策略（光标可能会更新）
 */
export declare const formatParentNodeMerge: RuleFunctionType;
/**
 * 将文本节点内连续的零宽度无断空白字符合并（光标可能会更新）
 */
export declare const formatZeroWidthTextMerge: RuleFunctionType;
