import { KNode, KNodeMarksType, KNodeStylesType } from '../../model/KNode';
/**
 * 节点数组比对结果类型
 */
type NodePatchResultType = {
    /**
     * 差异类型：insert：插入节点；remove：移除节点；update：节点更新；replace：节点被替换；move：节点同级位置移动
     */
    type: 'insert' | 'remove' | 'update' | 'replace' | 'move';
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
 * mark比对结果类型
 */
export type MarkPatchResultType = {
    /**
     * 新增和更新的标记
     */
    addMarks: KNodeMarksType;
    /**
     * 移除的标记
     */
    removeMarks: KNodeMarksType;
};
/**
 * style比对结果类型
 */
export type StylePatchResultType = {
    /**
     * 新增和更新的样式
     */
    addStyles: KNodeStylesType;
    /**
     * 移除的样式
     */
    removeStyles: KNodeStylesType;
};
/**
 * 获取两个节点上不相同的marks
 */
export declare const getDifferentMarks: (newNode: KNode, oldNode: KNode) => MarkPatchResultType;
/**
 * 获取两个节点上不相同的styles
 */
export declare const getDifferentStyles: (newNode: KNode, oldNode: KNode) => StylePatchResultType;
/**
 * 对新旧两个节点数组进行比对
 */
export declare const patchNodes: (newNodes: KNode[], oldNodes: (KNode | null)[]) => NodePatchResultType[];
/**
 * 对新旧两个节点进行比对
 */
export declare const patchNode: (newNode: KNode, oldNode: KNode) => NodePatchResultType[];
export {};
