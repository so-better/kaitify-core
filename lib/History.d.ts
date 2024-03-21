import { AlexElement } from './Element';
import { AlexRange } from './Range';
export type AlexHistoryRecordsItemType = {
    stack: (AlexElement | null)[];
    range: AlexRange | null;
};
export type AlexHistoryResultType = {
    stack: (AlexElement | null)[];
    range: AlexRange | null;
    current: number;
};
export declare class AlexHistory {
    records: AlexHistoryRecordsItemType[];
    current: number;
    constructor();
    /**
     * 入栈
     */
    push(stack: (AlexElement | null)[], range?: AlexRange | null): void;
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
    __cloneRange(newStack: (AlexElement | null)[], range?: AlexRange | null): AlexRange | null;
}
