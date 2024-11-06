import { Editor } from '../Editor';

/**
 * 监听selection
 */
export declare const onSelectionChange: (this: Editor) => Promise<void>;
/**
 * 监听beforeinput
 */
export declare const onBeforeInput: (this: Editor, e: Event) => Promise<void>;
/**
 * 监听中文输入
 */
export declare const onComposition: (this: Editor, e: Event) => Promise<void>;
/**
 * 监听键盘事件
 */
export declare const onKeyboard: (this: Editor, e: Event) => void;
/**
 * 监听编辑器获取焦点
 */
export declare const onFocus: (this: Editor, e: Event) => void;
/**
 * 监听编辑器失去焦点
 */
export declare const onBlur: (this: Editor, e: Event) => void;
/**
 * 监听编辑器复制
 */
export declare const onCopy: (this: Editor, e: Event) => void;
/**
 * 监听编辑器剪切
 */
export declare const onCut: (this: Editor, e: Event) => void;
