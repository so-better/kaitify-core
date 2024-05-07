import { AlexElement } from './Element';
import { AlexRange } from './Range';
import { AlexPoint } from './Point';
import { AlexHistory } from './History';
import { EditorOptionsType, ObjectType } from './core/tool';
export type AlexElementRangeType = {
    element: AlexElement;
    offset: number[] | false;
};
export type AlexElementsRangeType = {
    list: AlexElementRangeType[];
    flatList: AlexElementRangeType[];
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
     */
    delete(): void;
    /**
     * 根据光标位置向编辑器内插入文本
     */
    insertText(data: string): void;
    /**
     * 在光标处换行
     */
    insertParagraph(): void;
    /**
     * 根据光标插入元素
     * cover表示所在根级块或者内部块元素只有换行符时是否覆盖此元素
     */
    insertElement(ele: AlexElement, cover?: boolean | undefined): void;
    /**
     * 格式化stack
     */
    formatElementStack(): void;
    /**
     * 渲染编辑器dom内容
     * unPushHistory为false表示加入历史记录
     */
    domRender(unPushHistory?: boolean | undefined): void;
    /**
     * 根据range来设置真实的光标
     */
    rangeRender(): void;
    /**
     * 将html转为元素
     */
    parseHtml(html: string): AlexElement[];
    /**
     * 将node转为元素
     */
    parseNode(node: HTMLElement): AlexElement;
    /**
     * 将指定元素与另一个元素进行合并（仅限内部块元素和根级块元素）
     */
    merge(ele: AlexElement, previousEle: AlexElement): void;
    /**
     * 根据key查询元素
     */
    getElementByKey(key: number): AlexElement | null;
    /**
     * 获取指定元素的前一个兄弟元素（会跳过空元素）
     */
    getPreviousElement(ele: AlexElement): AlexElement | null;
    /**
     * 获取指定元素的后一个兄弟元素（会跳过空元素）
     */
    getNextElement(ele: AlexElement): AlexElement | null;
    /**
     * 向上查询可以设置焦点的元素（会跳过空元素）
     */
    getPreviousElementOfPoint(point: AlexPoint): AlexElement | null;
    /**
     * 向下查找可以设置焦点的元素（会跳过空元素）
     */
    getNextElementOfPoint(point: AlexPoint): AlexElement | null;
    /**
     * 获取选区之间的元素，flat参数表示是否返回扁平化的数据
     */
    getElementsByRange(): AlexElementsRangeType;
    /**
     * 将指定元素添加到父元素的子元素数组中
     */
    addElementTo(childEle: AlexElement, parentEle: AlexElement, index?: number | undefined): void;
    /**
     * 将指定元素添加到另一个元素前面
     */
    addElementBefore(newEle: AlexElement, targetEle: AlexElement): void;
    /**
     * 将指定元素添加到另一个元素后面
     */
    addElementAfter(newEle: AlexElement, targetEle: AlexElement): void;
    /**
     * 将虚拟光标设置到指定元素开始处
     */
    collapseToStart(element?: AlexElement): void;
    /**
     * 将虚拟光标设置到指定元素最后
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
     */
    emit(eventName: string, ...value: any): boolean;
    /**
     * 监听自定义事件
     */
    on(eventName: string, eventHandle: (...args: any) => void): void;
    /**
     * 销毁编辑器的方法
     */
    destroy(): void;
}
