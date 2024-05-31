import { AlexElement } from '../Element';
import { AlexPoint } from '../Point';

/**
 * 定义一个对象集合的类型
 */
export type ObjectType = {
    [key: string]: any | null;
};
export type EditorOptionsType = {
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 自定义渲染规则
     */
    renderRules?: ((element: AlexElement) => void)[];
    /**
     * 编辑器的默认html值
     */
    value?: string;
    /**
     * 是否允许复制
     */
    allowCopy?: boolean;
    /**
     * 是否允许粘贴
     */
    allowPaste?: boolean;
    /**
     * 是否允许剪切
     */
    allowCut?: boolean;
    /**
     * 是否允许粘贴html
     */
    allowPasteHtml?: boolean;
    /**
     * 自定义纯文本粘贴方法
     */
    customTextPaste?: ((text: string) => void | Promise<void>) | null;
    /**
     * 自定义html粘贴方法
     */
    customHtmlPaste?: ((AlexElements: AlexElement[], html: string) => void | Promise<void>) | null;
    /**
     * 自定义图片粘贴方法
     */
    customImagePaste?: ((file: File) => void | Promise<void>) | null;
    /**
     * 自定义视频粘贴方法
     */
    customVideoPaste?: ((file: File) => void | Promise<void>) | null;
    /**
     * 自定义文件粘贴方法
     */
    customFilePaste?: ((file: File) => void | Promise<void>) | null;
    /**
     * 自定义处理不可编辑元素合并的逻辑
     */
    customMerge?: ((mergeElement: AlexElement, targetElement: AlexElement) => void | Promise<void>) | null;
    /**
     * 自定义dom转为非文本元素的后续处理逻辑
     */
    customParseNode?: ((el: AlexElement) => AlexElement) | null;
    /**
     * dom转为非文本元素时需要额外保留处理的标签数组
     */
    extraKeepTags?: string[];
};
/***
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
