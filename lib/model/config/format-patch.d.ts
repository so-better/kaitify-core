import { KNode } from '../KNode';

/**
 * 这里的比对结果仅进行格式化处理，只需要判断节点是否变化
 */
/**
 * 节点数组比对结果类型
 */
export type NodePatchResultType = {
    /**
     * 新节点
     */
    newNode: KNode | null;
    /**
     * 旧节点
     */
    oldNode: KNode | null;
};
/**
 * 对新旧两个节点数组进行比对
 */
export declare const patchNodes: (newNodes: KNode[], oldNodes: (KNode | null)[]) => NodePatchResultType[];
/**
 * 对新旧两个节点进行比对
 */
export declare const patchNode: (newNode: KNode, oldNode: KNode) => NodePatchResultType[];
