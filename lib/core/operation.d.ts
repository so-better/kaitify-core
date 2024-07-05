import { AlexElement } from '../Element';
import { AlexPoint } from '../Point';
import { AlexEditor } from '../Editor';

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
 * 监听selection改变
 * @param this
 * @returns
 */
export declare const handleSelectionChange: (this: AlexEditor) => void;
/**
 * 监听beforeinput
 * @param this
 * @param e
 * @returns
 */
export declare const handleBeforeInput: (this: AlexEditor, e: Event) => void;
/**
 * 监听中文输入
 * @param this
 * @param e
 * @returns
 */
export declare const handleChineseInput: (this: AlexEditor, e: Event) => void;
/**
 * 监听键盘事件
 * @param this
 * @param e
 * @returns
 */
export declare const handleKeyboard: (this: AlexEditor, e: Event) => void;
/**
 * 监听编辑器复制
 * @param this
 * @param e
 * @returns
 */
export declare const handleCopy: (this: AlexEditor, e: Event) => Promise<void>;
/**
 * 监听编辑器剪切
 * @param this
 * @param e
 * @returns
 */
export declare const handleCut: (this: AlexEditor, e: Event) => Promise<void>;
/**
 * 监听编辑器粘贴
 * @param this
 * @param e
 * @returns
 */
export declare const handlePaste: (this: AlexEditor, e: Event) => Promise<void>;
/**
 * 监听编辑器拖拽和拖放
 * @param this
 * @param e
 * @returns
 */
export declare const handleDragDrop: (this: AlexEditor, e: Event) => Promise<void>;
/**
 * 监听编辑器获取焦点
 * @param this
 * @param e
 * @returns
 */
export declare const handleFocus: (this: AlexEditor, e: Event) => void;
/**
 * 监听编辑器失去焦点
 * @param this
 * @param e
 * @returns
 */
export declare const handleBlur: (this: AlexEditor, e: Event) => void;
/**
 * domRender期间通过比对新旧stack进行节点动态更新
 * @param this
 * @param newStack
 * @param oldStack
 */
export declare const diffUpdate: (this: AlexEditor, newElements: AlexElement[], oldElements: AlexElement[]) => void;
