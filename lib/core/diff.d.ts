import { AlexElement } from '../Element';
import { ObjectType } from './tool';

/**
 * patch结果类型
 */
export type patchResultType = {
    type: 'insert' | 'remove' | 'update' | 'replace' | 'move' | 'empty';
    newElement?: AlexElement;
    oldElement?: AlexElement;
    update?: 'textContent' | 'styles' | 'marks';
};
/**
 * 对新旧两个元素数组进行比对
 * @param newElements
 * @param oldElements
 * @param forRender 是否为了渲染dom，如果是true则差异是为了渲染dom，否则差异是为了格式化
 * @returns
 */
export declare const patch: (newElements: AlexElement[], oldElements: (AlexElement | undefined)[], forRender: boolean) => patchResultType[];
/**
 * 对key相同的元素进行比对
 * @param newElement
 * @param oldElement
 * @param forRender 是否为了渲染dom
 * @returns
 */
export declare const patchElement: (newElement: AlexElement, oldElement: AlexElement, forRender: boolean) => patchResultType[];
/**
 * 获取不同的styles
 * @param newElement
 * @param oldElement
 * @returns
 */
export declare const getDifferentStyles: (newElement: AlexElement, oldElement: AlexElement) => {
    setStyles: ObjectType;
    removeStyles: ObjectType;
};
/**
 * 获取不同的marks
 * @param newElement
 * @param oldElement
 * @returns
 */
export declare const getDifferentMarks: (newElement: AlexElement, oldElement: AlexElement) => {
    setMarks: ObjectType;
    removeMarks: ObjectType;
};
