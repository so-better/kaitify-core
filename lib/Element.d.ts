import { ObjectType } from './core/tool';

/**
 * 元素类型
 */
export type AlexElementType = 'block' | 'inblock' | 'inline' | 'text' | 'closed';
/**
 * 创建元素的入参类型
 */
export type AlexElementCreateConfigType = {
    type: AlexElementType;
    parsedom?: string | null;
    marks?: ObjectType | null;
    styles?: ObjectType | null;
    children?: AlexElementCreateConfigType[] | null;
    textcontent?: string | null;
    behavior?: 'default' | 'block';
    namespace?: string | null;
    locked?: boolean;
};
/**
 * 编辑器元素对象
 */
export declare class AlexElement {
    key: number;
    type: AlexElementType;
    parsedom: string | null;
    marks: ObjectType | null;
    styles: ObjectType | null;
    textContent: string | null;
    children: AlexElement[] | null;
    parent: AlexElement | null;
    behavior: 'default' | 'block';
    namespace: string | null;
    locked: boolean;
    elm: HTMLElement | null;
    constructor(type: AlexElementType, parsedom: string | null, marks: ObjectType | null, styles: ObjectType | null, textContent: string | null);
    /**
     * 是否根级块元素
     * @returns
     */
    isBlock(): boolean;
    /**
     * 是否内部块元素
     * @returns
     */
    isInblock(): boolean;
    /**
     * 是否行内元素
     * @returns
     */
    isInline(): boolean;
    /**
     * 是否自闭合元素
     * @returns
     */
    isClosed(): boolean;
    /**
     * 是否文本元素
     * @returns
     */
    isText(): boolean;
    /**
     * 是否换行符
     * @returns
     */
    isBreak(): boolean;
    /**
     * 是否空元素
     * @returns
     */
    isEmpty(): boolean;
    /**
     * 是否零宽度无断空白元素
     * @returns
     */
    isSpaceText(): boolean;
    /**
     * 获取不可编辑的元素，如果是null，说明元素是可编辑的
     * @returns
     */
    getUneditableElement(): AlexElement | null;
    /**
     * 比较当前元素和另一个元素是否相等
     * @param element
     * @returns
     */
    isEqual(element: AlexElement): boolean;
    /**
     * 判断当前元素是否包含另一个元素
     * @param element
     * @returns
     */
    isContains(element: AlexElement): boolean;
    /**
     * 判断当前元素的子元素数组是否只包含换行符
     * @returns
     */
    isOnlyHasBreak(): boolean;
    /**
     * 判断当前元素是否在拥有代码块样式的块内（包括自身）
     * @returns
     */
    isPreStyle(): boolean;
    /**
     * 是否含有标记
     * @returns
     */
    hasMarks(): boolean;
    /**
     * 是否含有样式
     * @returns
     */
    hasStyles(): boolean;
    /**
     * 是否有子元素
     * @returns
     */
    hasChildren(): boolean;
    /**
     * 判断当前元素与另一个元素是否有包含关系
     * @param element
     * @returns
     */
    hasContains(element: AlexElement): boolean;
    /**
     * 克隆当前元素
     * @param deep 为true表示深度克隆，即克隆子元素，否则只会克隆自身
     * @returns
     */
    clone(deep?: boolean | undefined): AlexElement;
    /**
     * 将当前元素转换成根级块元素
     * @returns
     */
    convertToBlock(): void;
    /**
     * 设置为空元素
     * @returns
     */
    toEmpty(): void;
    /**
     * 获取所在根级块元素
     * @returns
     */
    getBlock(): AlexElement;
    /**
     * 获取所在内部块元素
     * @returns
     */
    getInblock(): AlexElement | null;
    /**
     * 获取所在行内元素
     * @returns
     */
    getInline(): AlexElement | null;
    /**
     * 比较当前元素和另一个元素的styles是否一致
     * @param element
     * @returns
     */
    isEqualStyles(element: AlexElement): boolean;
    /**
     * 比较当前元素和另一个元素的marks是否一致
     * @param element
     * @returns
     */
    isEqualMarks(element: AlexElement): boolean;
    /**
     * 如果当前元素是文本元素或者自闭合元素，判断它是不是指定元素的后代所有文本元素和自闭合元素中的第一个
     * @param element
     * @returns
     */
    isFirst(element: AlexElement): boolean;
    /**
     * 如果当前元素是文本元素或者自闭合元素，判断它是不是指定元素的后代所有文本元素和自闭合元素中的最后一个
     * @param element
     * @returns
     */
    isLast(element: AlexElement): boolean;
    /**
     * 将元素渲染成真实的node并挂载在元素的elm属性上
     */
    __render(): void;
    /**
     * 完全复制元素，包括key也复制
     */
    __fullClone(): AlexElement;
    /**
     * 判断参数是否为AlexElement元素
     * @param val
     * @returns
     */
    static isElement(val: any): boolean;
    /**
     * 扁平化处理元素数组
     * @param elements
     * @returns
     */
    static flatElements(elements: AlexElement[]): AlexElement[];
    /**
     * 创建一个空白文本元素并返回
     * @returns
     */
    static getSpaceElement(): AlexElement;
    /**
     * 创建元素的快捷方法
     * @param elementConfig
     * @returns
     */
    static create(elementConfig: AlexElementCreateConfigType): AlexElement;
    /**
     * 定义默认的根级块元素标签
     */
    static BLOCK_NODE: string;
    /**
     * 定义默认的文本元素标签
     */
    static TEXT_NODE: string;
    /**
     * 定义不显示的元素标签
     */
    static VOID_NODES: string[];
    /**
     * 定义需要置空的元素标签
     */
    static EMPTY_NODES: string[];
}
