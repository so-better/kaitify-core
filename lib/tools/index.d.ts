import { KNodeMarksType, KNodeStylesType } from '../model/KNode';
/**
 * 用于KNode生成唯一的key
 */
export declare const createUniqueKey: () => number;
/**
 * 用于编辑器生成唯一的guid
 */
export declare const createGuid: () => number;
/**
 * 判断字符串是否零宽度无断空白字符
 */
export declare const isZeroWidthText: (val: string) => boolean;
/**
 * 获取一个零宽度无断空白字符
 */
export declare const getZeroWidthText: () => string;
/**
 * 驼峰转中划线
 */
export declare const camelToKebab: (val: string) => string;
/**
 * 中划线转驼峰
 */
export declare const kebabToCamel: (val: string) => string;
/**
 * 获取dom元素的属性集合
 */
export declare const getDomAttributes: (dom: HTMLElement) => KNodeMarksType;
/**
 * 获取dom元素的样式集合
 */
export declare const getDomStyles: (dom: HTMLElement) => KNodeStylesType;
/**
 * 初始化编辑器dom
 */
export declare const initEditorDom: (dom: HTMLElement | string) => HTMLElement;
/**
 * 判断某个dom是否包含另一个dom
 */
export declare const isContains: (parent: Node, child: Node) => boolean;
/**
 * 延迟指定时间
 */
export declare const delay: (num?: number | undefined) => Promise<void>;
