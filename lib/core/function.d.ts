import { AlexElement } from '../Element';
import { AlexPoint } from '../Point';
import { AlexEditor, AlexElementRangeType } from '../Editor';

/**
 * 获取选区内的元素转为html和text塞入剪切板并返回
 * @param this
 * @param data
 * @param result
 * @returns
 */
export declare const setClipboardData: (this: AlexEditor, data: DataTransfer, result: AlexElementRangeType[]) => {
    html: string;
    text: string;
};
/**
 * 粘贴具体处理方法
 * @param this
 * @param html
 * @param text
 * @param files
 */
export declare const doPaste: (this: AlexEditor, html: string, text: string, files: FileList) => Promise<void>;
/**
 * 对非法dom进行删除
 * @param this
 */
export declare const removeIllegalDoms: (this: AlexEditor) => void;
/**
 * 对编辑器dom元素进行监听，获取非法dom
 * @param this
 */
export declare const setEditorDomObserve: (this: AlexEditor) => void;
/**
 * 移除对编辑器的dom监听
 * @param this
 */
export declare const removeEditorDomObserve: (this: AlexEditor) => void;
/**
 * 初始化校验stack
 * @param this
 */
export declare const checkStack: (this: AlexEditor) => void;
/**
 * 更新焦点的元素为最近的可设置光标的元素
 * @param this
 * @param point
 */
export declare const setRecentlyPoint: (this: AlexEditor, point: AlexPoint) => void;
/**
 * 清空默认行为的内部块元素
 * @param this
 * @param element
 * @returns
 */
export declare const emptyDefaultBehaviorInblock: (this: AlexEditor, element: AlexElement) => void;
/**
 * 判断焦点是否在可视范围内，如果不在则进行设置
 * @param this
 */
export declare const setRangeInVisible: (this: AlexEditor) => void;
/**
 * 判断stack是否为空，为空则进行初始化
 * @param this
 */
export declare const handleStackEmpty: (this: AlexEditor) => void;
/**
 * 对元素数组使用某个方法进行格式化
 * @param this editor实例
 * @param element 格式化对象元素
 * @param fn 格式化函数
 * @param receiver 源数组
 */
export declare const formatElement: (this: AlexEditor, element: AlexElement, fn: (el: AlexElement) => void, receiver: AlexElement[]) => void;
