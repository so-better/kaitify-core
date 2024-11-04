import { KNode } from './KNode';
import { Selection } from './Selection';
/**
 * 历史记录的record类型
 */
export type HistoryRecordType = {
    nodes: KNode[];
    selection: Selection;
};
/**
 * 历史记录
 */
export declare class History {
    /**
     * 存放历史记录的堆栈
     */
    records: HistoryRecordType[];
    /**
     * 存放撤销记录的堆栈
     */
    redoRecords: HistoryRecordType[];
    /**
     * 复制selection
     */
    cloneSelection(newNodes: KNode[], selection: Selection): Selection;
    /**
     * 保存新的记录
     */
    setState(nodes: KNode[], selection: Selection): void;
    /**
     * 撤销操作：返回上一个历史记录
     */
    setUndo(): HistoryRecordType | null;
    /**
     * 重做操作：返回下一个历史记录
     */
    setRedo(): HistoryRecordType | null;
    /**
     * 更新当前记录的编辑的光标
     */
    updateSelection(selection: Selection): void;
}
