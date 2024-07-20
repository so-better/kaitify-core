import { AlexElement } from './Element';
import { AlexRange } from './Range';
/**
 * 历史记录数据类型
 */
export type AlexHistoryRecordType = {
    stack: AlexElement[];
    range: AlexRange | null;
};
export declare class AlexHistory {
    /**
     * 存放历史记录的堆栈
     */
    records: AlexHistoryRecordType[];
    /**
     * 存放撤销记录的堆栈
     */
    redoRecords: AlexHistoryRecordType[];
    /**
     * 保存记录
     * @param stack
     * @param range
     */
    push(stack: AlexElement[], range: AlexRange | null): void;
    /**
     * 撤销操作
     */
    undo(): AlexHistoryRecordType | null;
    /**
     * 重做操作
     */
    redo(): AlexHistoryRecordType | null;
    /**
     * 更新光标
     * @param range
     */
    updateRange(range: AlexRange): void;
    /**
     * 克隆range
     * @param newStack
     * @param range
     * @returns
     */
    cloneRange(newStack: AlexElement[], range: AlexRange | null): AlexRange | null;
}
