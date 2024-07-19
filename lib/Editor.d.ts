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
    /**
     * 编辑器容器
     */
    $el: HTMLElement;
    /**
     * 是否禁用
     */
    disabled: boolean;
    /**
     * 编辑器的值
     */
    value: string;
    /**
     * 自定义渲染规则
     */
    renderRules: ((element: AlexElement) => void)[];
    /**
     * 是否允许复制
     */
    allowCopy: boolean;
    /**
     * 是否允许粘贴
     */
    allowPaste: boolean;
    /**
     * 是否允许剪切
     */
    allowCut: boolean;
    /**
     * 是否允许粘贴html
     */
    allowPasteHtml: boolean;
    /**
     * 自定义纯文本粘贴方法
     */
    customTextPaste: ((text: string) => void | Promise<void>) | null;
    /**
     * 自定义html粘贴方法
     */
    customHtmlPaste: ((AlexElements: AlexElement[], html: string) => void | Promise<void>) | null;
    /**
     * 自定义图片粘贴方法
     */
    customImagePaste: ((file: File) => void | Promise<void>) | null;
    /**
     * 自定义视频粘贴方法
     */
    customVideoPaste: ((file: File) => void | Promise<void>) | null;
    /**
     * 自定义文件粘贴方法（除图片视频外）
     */
    customFilePaste: ((file: File) => void | Promise<void>) | null;
    /**
     * 自定义处理不可编辑元素合并的逻辑
     */
    customMerge: ((mergeElement: AlexElement, targetElement: AlexElement) => void | Promise<void>) | null;
    /**
     * 自定义dom转为非文本元素的后续处理逻辑
     */
    customParseNode: ((el: AlexElement) => AlexElement) | null;
    /**
     * dom转为非文本元素时需要额外保留的标签数组
     */
    extraKeepTags: string[];
    /**
     * 历史记录
     */
    history: AlexHistory;
    /**
     * 存放元素的数组
     */
    stack: AlexElement[];
    /**
     * 光标虚拟对象
     */
    range: AlexRange | null;
    /**
     * 编辑器唯一id
     */
    __guid: number;
    /**
     * 事件集合
     */
    __events: {
        [key: string]: ((...args: any) => void)[];
    };
    /**
     * 缓存的前一个stack
     */
    __oldStack: AlexElement[];
    /**
     * 是否正在输入中文
     */
    __isInputChinese: boolean;
    /**
     * 是否内部修改真实光标引起selctionChange事件
     */
    __innerSelectionChange: boolean;
    /**
     * 取消中文输入标识的延时器
     */
    __chineseInputTimer: any;
    /**
     * dom新增监听器
     */
    __domObserver: MutationObserver | null;
    /**
     * 需要移除的非法dom数组
     */
    __illegalDoms: Node[];
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
     * 格式化并渲染编辑器
     * @param unPushHistory 是否不加入历史记录
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
     * 监听事件
     * @param eventName
     * @param eventHandle
     */
    on(eventName: string, eventHandle: (...args: any) => void): void;
    /**
     * 取消对事件的监听
     * @param eventName
     */
    off(eventName: string, eventHandle?: (...args: any) => void): void;
    /**
     * 销毁编辑器的方法
     */
    destroy(): void;
}
