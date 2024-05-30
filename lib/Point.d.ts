import { AlexElement } from './Element';

export declare class AlexPoint {
    /**
     * 虚拟光标对应的元素
     */
    element: AlexElement;
    /**
     * 虚拟光标在元素中的偏移值
     */
    offset: number;
    constructor(element: AlexElement, offset: number);
    /**
     * 是否Point类型数据
     * @param val
     * @returns
     */
    static isPoint(val: any): boolean;
    /**
     * 两个点是否相等
     * @param point
     * @returns
     */
    isEqual(point: AlexPoint): boolean;
    /**
     * 移动到到指定元素最后
     * @param element
     */
    moveToEnd(element: AlexElement): void;
    /**
     * 移动到指定元素最前
     * @param element
     */
    moveToStart(element: AlexElement): void;
}
