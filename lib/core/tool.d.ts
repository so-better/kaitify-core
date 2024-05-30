import { AlexElement } from '../Element';
import { AlexPoint } from '../Point';

export type ObjectType = {
    [key: string]: any | null;
};
export type EditorOptionsType = {
    disabled?: boolean;
    renderRules?: ((element: AlexElement) => void)[];
    value?: string;
    allowCopy?: boolean;
    allowPaste?: boolean;
    allowCut?: boolean;
    allowPasteHtml?: boolean;
    customTextPaste?: ((text: string) => void | Promise<void>) | null;
    customHtmlPaste?: ((AlexElements: AlexElement[], html: string) => void | Promise<void>) | null;
    customImagePaste?: ((file: File) => void | Promise<void>) | null;
    customVideoPaste?: ((file: File) => void | Promise<void>) | null;
    customFilePaste?: ((file: File) => void | Promise<void>) | null;
    customMerge?: ((mergeElement: AlexElement, targetElement: AlexElement) => void | Promise<void>) | null;
    customParseNode?: ((el: AlexElement) => AlexElement) | null;
    extraKeepTags?: string[];
};
/**
 * 获取node元素的属性集合
 */
export declare const getAttributes: (node: HTMLElement) => ObjectType;
/**
 * 获取node元素的样式集合
 */
export declare const getStyles: (node: HTMLElement) => ObjectType;
/**
 * 生成唯一的key
 */
export declare const createUniqueKey: () => number;
/**
 * 生成唯一的guid
 */
export declare const createGuid: () => number;
/**
 * 判断字符串是否零宽度无断空白字符
 */
export declare const isSpaceText: (val: string) => boolean;
/**
 * 深拷贝函数
 */
export declare const cloneData: (data: any) => any;
/**
 * 判断某个node是否包含另一个node
 */
export declare const isContains: (parentNode: HTMLElement, childNode: HTMLElement) => boolean;
/**
 * 初始化编辑器dom
 */
export declare const initEditorNode: (node: HTMLElement | string) => HTMLElement;
/**
 * 格式化编辑器的options参数
 */
export declare const initEditorOptions: (options: EditorOptionsType) => EditorOptionsType;
/**
 * 获取以目标元素为子孙元素中文本元素或者自闭合元素排列第一的元素的最高级元素
 */
export declare const getHighestByFirst: (point: AlexPoint) => AlexElement;
