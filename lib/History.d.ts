import { AlexElement } from './Element';
import { AlexRange } from './Range';
export type AlexHistoryRecordsItemType = {
    stack: AlexElement[];
    range: AlexRange | null;
};
export type AlexHistoryResultType = {
    stack: AlexElement[];
    range: AlexRange | null;
    current: number;
};
export declare class AlexHistory {
    records: AlexHistoryRecordsItemType[];
    current: number;
    /**
     * 入栈
     */
    push(stack: AlexElement[], range?: AlexRange | null): void;
    /**
     * 获取
     */
    get(type: -1 | 1): AlexHistoryResultType | null;
    /**
     * 更新当前历史记录的range
     */
    updateCurrentRange(range: AlexRange): void;
    /**
     * 克隆range
     */
    __cloneRange(newStack: AlexElement[], range?: AlexRange | null): AlexRange | null;
}
