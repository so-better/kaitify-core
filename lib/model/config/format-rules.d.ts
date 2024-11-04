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
 * 针对节点自身：处理块节点的标签，部分块节点需要转为默认块节点标签
 */
export declare const fomratBlockTagParse: RuleFunctionType;
/**
 * 针对子节点中的块节点：行内节点的子节点中含有块节点则该节点转为块节点；子节点中的其他节点也转为块节点
 */
export declare const formatBlockInChildren: RuleFunctionType;
/**
 * 针对节点自身：处理不可编辑的非块级节点：在两侧添加零宽度无断空白字符 & 重置不可编辑节点内的光标位置
 */
export declare const formatUneditableNoodes: RuleFunctionType;
/**
 * 针对节点的子节点数组：处理子节点中的占位符，如果占位符和其他节点共存则删除占位符，如果只存在占位符则将多个占位符合并为一个（光标可能会更新）
 */
export declare const formatPlaceholderMerge: RuleFunctionType;
/**
 * 针对节点自身：将文本节点内连续的零宽度无断空白字符合并（光标可能会更新）
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
