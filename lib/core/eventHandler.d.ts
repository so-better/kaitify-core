import { AlexEditor } from '../Editor';
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
