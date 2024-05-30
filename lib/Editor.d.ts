import { AlexElement, AlexElementType } from './Element';
import { AlexRange } from './Range';
import { AlexPoint } from './Point';
import { AlexHistory } from './History';
import { EditorOptionsType, ObjectType } from './core/tool';

/**
 * 光标选区返回的结果数据项类型
 */
export type AlexElementRangeType = {
    element: AlexElement;
    offset: number[] | false;
};
/**
 * 光标选区返回的结果类型
 */
export type AlexElementsRangeType = {
    list: AlexElementRangeType[];
    flatList: AlexElementRangeType[];
};
/**
 * AlexElement元素构造类型
 */
export type AlexElementConfigType = {
    type: AlexElementType;
    parsedom: string;
    marks: ObjectType;
    styles: ObjectType;
    behavior: 'default' | 'block';
    namespace: string | null;
};
export declare class AlexEditor {
    $el: HTMLElement;
    disabled: boolean;
    value: string;
    renderRules: ((element: AlexElement) => void)[];
    allowCopy: boolean;
    allowPaste: boolean;
    allowCut: boolean;
    allowPasteHtml: boolean;
    customTextPaste: ((text: string) => void | Promise<void>) | null;
    customHtmlPaste: ((AlexElements: AlexElement[], html: string) => void | Promise<void>) | null;
    customImagePaste: ((file: File) => void | Promise<void>) | null;
    customVideoPaste: ((file: File) => void | Promise<void>) | null;
    customFilePaste: ((file: File) => void | Promise<void>) | null;
    customMerge: ((mergeElement: AlexElement, targetElement: AlexElement) => void | Promise<void>) | null;
    customParseNode: ((el: AlexElement) => AlexElement) | null;
    extraKeepTags: string[];
    history: AlexHistory;
    stack: AlexElement[];
    range: AlexRange | null;
    __guid: number;
    __events: ObjectType;
    __firstRender: boolean;
    __isInputChinese: boolean;
    __innerSelectionChange: boolean;
    __chineseInputTimer: any;
    constructor(node: HTMLElement | string, opts: EditorOptionsType);
    /**
     * 初始化设置默认的range
     */
    initRange(): void;
    /**
     * 根据光标进行删除操作
     * @returns
     */
    delete(): void;
    /**
     * 根据光标位置向编辑器内插入文本
     * @param data
     * @returns
     */
    insertText(data: string): void;
    /**
     * 在光标处换行
     * @returns
     */
    insertParagraph(): void;
    /**
     * 根据光标插入元素
     * @param ele 插入的元素
     * @param cover 所在根级块或者内部块元素只有换行符时是否覆盖此元素
     * @returns
     */
    insertElement(ele: AlexElement, cover?: boolean | undefined): void;
    /**
     * 格式化stack
     */
    formatElementStack(): void;
    /**
     * 渲染编辑器dom内容
     * @param unPushHistory 为false表示加入历史记录
     */
    domRender(unPushHistory?: boolean | undefined): void;
    /**
     * 根据range来设置真实的光标
     * @returns
     */
    rangeRender(): Promise<void>;
    /**
     * 将html转为元素
     * @param html
     * @returns
     */
    parseHtml(html: string): AlexElement[];
    /**
     * 将node转为元素
     * @param node
     * @returns
     */
    parseNode(node: HTMLElement): AlexElement;
    /**
     * 将指定元素与另一个元素进行合并（仅限内部块元素和根级块元素）
     * @param ele
     * @param previousEle
     */
    merge(ele: AlexElement, previousEle: AlexElement): void;
    /**
     * 根据key查询元素
     * @param key
     * @returns
     */
    getElementByKey(key: number): AlexElement | null;
    /**
     * 获取指定元素的前一个兄弟元素（会跳过空元素）
     * @param ele
     * @returns
     */
    getPreviousElement(ele: AlexElement): AlexElement | null;
    /**
     * 获取指定元素的后一个兄弟元素（会跳过空元素）
     * @param ele
     * @returns
     */
    getNextElement(ele: AlexElement): AlexElement | null;
    /**
     * 向上查询可以设置焦点的元素（会跳过空元素）
     * @param point
     * @returns
     */
    getPreviousElementOfPoint(point: AlexPoint): AlexElement | null;
    /**
     * 向下查找可以设置焦点的元素（会跳过空元素）
     * @param point
     * @returns
     */
    getNextElementOfPoint(point: AlexPoint): AlexElement | null;
    /**
     * 获取选区之间的元素
     * @returns
     */
    getElementsByRange(): AlexElementsRangeType;
    /**
     * 将指定元素添加到父元素的子元素数组中
     * @param childEle
     * @param parentEle
     * @param index
     */
    addElementTo(childEle: AlexElement, parentEle: AlexElement, index?: number | undefined): void;
    /**
     * 将指定元素添加到另一个元素前面
     * @param newEle
     * @param targetEle
     */
    addElementBefore(newEle: AlexElement, targetEle: AlexElement): void;
    /**
     * 将指定元素添加到另一个元素后面
     * @param newEle
     * @param targetEle
     */
    addElementAfter(newEle: AlexElement, targetEle: AlexElement): void;
    /**
     * 将虚拟光标设置到指定元素开始处
     * @param element
     * @returns
     */
    collapseToStart(element?: AlexElement): void;
    /**
     * 将虚拟光标设置到指定元素最后
     * @param element
     * @returns
     */
    collapseToEnd(element?: AlexElement): void;
    /**
     * 禁用编辑器
     */
    setDisabled(): void;
    /**
     * 启用编辑器
     */
    setEnabled(): void;
    /**
     * 触发自定义事件
     * @param eventName
     * @param value
     * @returns
     */
    emit(eventName: string, ...value: any): boolean;
    /**
     * 监听自定义事件
     * @param eventName
     * @param eventHandle
     */
    on(eventName: string, eventHandle: (...args: any) => void): void;
    /**
     * 销毁编辑器的方法
     */
    destroy(): void;
}
