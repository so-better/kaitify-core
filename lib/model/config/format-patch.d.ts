import { KNode } from '../KNode';
/**
 * 节点数组比对结果类型
 */
export type NodePatchResultType = {
    /**
     * 差异类型：insert：插入节点；remove：移除节点；update：节点更新；replace：节点被替换；move：节点同级位置移动；empty：空节点
     */
    type: 'insert' | 'remove' | 'update' | 'replace' | 'move' | 'empty';
    /**
     * 新节点
     */
    newNode: KNode | null;
    /**
     * 旧节点
     */
    oldNode: KNode | null;
    /**
     * 更新的字段
     */
    update?: 'textContent' | 'styles' | 'marks';
};
/**
 * 对新旧两个节点数组进行比对
 */
export declare const patchNodes: (newNodes: KNode[], oldNodes: (KNode | null)[]) => NodePatchResultType[];
/**
 * 对新旧两个节点进行比对
 */
export declare const patchNode: (newNode: KNode, oldNode: KNode) => NodePatchResultType[];
