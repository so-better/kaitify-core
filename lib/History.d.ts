import { AlexElement } from './Element';
import { AlexRange } from './Range';

/**
 * 历史记录数据项类型
 */
export type AlexHistoryRecordsItemType = {
    stack: AlexElement[];
    range: AlexRange | null;
};
/**
 * 历史记录结果类型
 */
export type AlexHistoryResultType = {
    stack: AlexElement[];
    range: AlexRange | null;
    current: number;
};
export declare class AlexHistory {
    /**
     * 存放历史记录的堆栈
     */
    records: AlexHistoryRecordsItemType[];
    /**
     * 记录当前展示的stack的序列
     */
    current: number;
    /**
     * 入栈
     * @param stack
     * @param range
     */
    push(stack: AlexElement[], range?: AlexRange | null): void;
    /**
     * 获取
     * @param type
     * @returns
     */
    get(type: -1 | 1): AlexHistoryResultType | null;
    /**
     * 更新当前历史记录的range
     * @param range
     */
    updateCurrentRange(range: AlexRange): void;
    /**
     * 克隆range
     * @param newStack
     * @param range
     * @returns
     */
    __cloneRange(newStack: AlexElement[], range?: AlexRange | null): AlexRange | null;
}
