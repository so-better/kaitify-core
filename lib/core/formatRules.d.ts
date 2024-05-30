import { AlexEditor } from '../Editor';
import { AlexElement } from '../Element';

/**
 * 将子元素中的根级块元素转为内部块元素或者行内元素（根级块元素只能在stack下）
 * @param this
 * @param element
 */
export declare const handleNotStackBlock: (this: AlexEditor, element: AlexElement) => void;
/**
 * 内部块元素与其他元素不能同时存在于父元素的子元素数组中
 * @param this
 * @param element
 */
export declare const handleInblockWithOther: (this: AlexEditor, element: AlexElement) => void;
/**
 * 行内元素的子元素不能是内部块元素
 * @param this
 * @param element
 */
export declare const handleInlineChildrenNotInblock: (this: AlexEditor, element: AlexElement) => void;
/**
 * 换行符清除规则（虚拟光标可能更新）
 * @param this
 * @param element
 */
export declare const breakFormat: (this: AlexEditor, element: AlexElement) => void;
/**
 * 兄弟元素合并策略（虚拟光标可能更新）
 * @param this
 * @param element
 */
export declare const mergeWithBrotherElement: (this: AlexEditor, element: AlexElement) => void;
/**
 * 父子元素合并策略（虚拟光标可能更新）
 * @param this
 * @param element
 */
export declare const mergeWithParentElement: (this: AlexEditor, element: AlexElement) => void;
/**
 * 将文本元素内的空白元素合一
 * @param this
 * @param element
 */
export declare const mergeWithSpaceTextElement: (this: AlexEditor, element: AlexElement) => void;
