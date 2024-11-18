import { KNode } from './KNode';
/**
 * 光标点位类型，node仅支持文本节点和闭合节点
 */
export type SelectionPointType = {
    node: KNode;
    offset: number;
};
/**
 * 光标选区
 */
export declare class Selection {
    /**
     * 起点
     */
    start?: SelectionPointType;
    /**
     * 终点
     */
    end?: SelectionPointType;
    /**
     * 是否已经初始化设置光标位置
     */
    focused(): boolean;
    /**
     * 光标是否折叠
     */
    collapsed(): boolean;
    /**
     * 判断两个selection是否相同
     */
    isEqual(selection: Selection): boolean;
    /**
     * 完全克隆selection
     */
    clone(): Selection;
}
