import { AlexElement } from '../Element';
import { AlexPoint } from '../Point';
import { AlexEditor } from '../Editor';
/**
 * 初始化校验stack
 */
export declare const checkStack: (this: AlexEditor) => void;
/**
 * 更新焦点的元素为最近的可设置光标的元素
 */
export declare const setRecentlyPoint: (this: AlexEditor, point: AlexPoint) => void;
/**
 * 清空默认行为的内部块元素
 */
export declare const emptyDefaultBehaviorInblock: (this: AlexEditor, element: AlexElement) => void;
/**
 * 判断焦点是否在可视范围内，如果不在则进行设置
 */
export declare const setRangeInVisible: (this: AlexEditor) => void;
/**
 * 判断stack是否为空，为空则进行初始化
 */
export declare const handleStackEmpty: (this: AlexEditor) => void;
/**
 * 监听selection改变
 */
export declare const handleSelectionChange: (this: AlexEditor) => void;
/**
 * 监听beforeinput
 */
export declare const handleBeforeInput: (this: AlexEditor, e: Event) => void;
/**
 * 监听中文输入
 */
export declare const handleChineseInput: (this: AlexEditor, e: Event) => void;
/**
 * 监听键盘按下
 */
export declare const handleKeydown: (this: AlexEditor, e: Event) => void;
/**
 * 监听编辑器复制
 */
export declare const handleCopy: (this: AlexEditor, e: Event) => Promise<void>;
/**
 * 监听编辑器剪切
 */
export declare const handleCut: (this: AlexEditor, e: Event) => Promise<void>;
/**
 * 监听编辑器粘贴
 */
export declare const handlePaste: (this: AlexEditor, e: Event) => Promise<void>;
/**
 * 监听编辑器拖拽和拖放
 */
export declare const handleDragDrop: (this: AlexEditor, e: Event) => Promise<void>;
/**
 * 监听编辑器获取焦点
 */
export declare const handleFocus: (this: AlexEditor) => void;
/**
 * 监听编辑器失去焦点
 */
export declare const handleBlur: (this: AlexEditor) => void;
