import { ObjectType } from './core/tool';
export type AlexElementType = 'block' | 'inblock' | 'inline' | 'text' | 'closed';
export type AlexElementConfigType = {
    type: AlexElementType;
    parsedom: string;
    marks: ObjectType;
    styles: ObjectType;
    behavior: 'default' | 'block';
    namespace: string | null;
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
    behavior?: 'default' | 'block';
    namespace: string | null;
    elm: HTMLElement | null;
    constructor(type: AlexElementType, parsedom: string | null, marks: ObjectType | null, styles: ObjectType | null, textContent: string | null);
    /**
     * 是否根级块元素
     */
    isBlock(): boolean;
    /**
     * 是否内部块元素
     */
    isInblock(): boolean;
    /**
     * 是否行内元素
     */
    isInline(): boolean;
    /**
     * 是否自闭合元素
     */
    isClosed(): boolean;
    /**
     * 是否文本元素
     */
    isText(): boolean;
    /**
     * 是否换行符
     */
    isBreak(): boolean;
    /**
     * 是否空元素
     */
    isEmpty(): boolean;
    /**
     * 是否零宽度无断空白元素
     */
    isSpaceText(): boolean;
    /**
     * 获取设置不可编辑的元素，如果是null，说明元素是可编辑的
     */
    getUneditableElement(): AlexElement | null;
    /**
     * 比较当前元素和另一个元素是否相等
     */
    isEqual(element: AlexElement): boolean;
    /**
     * 判断当前元素是否包含另一个元素
     */
    isContains(element: AlexElement): boolean;
    /**
     * 判断当前元素的子元素数组是否只包含换行符
     */
    isOnlyHasBreak(): boolean;
    /**
     * 判断当前元素是否在拥有代码块样式的块内（包括自身）
     */
    isPreStyle(): boolean;
    /**
     * 是否含有标记
     */
    hasMarks(): boolean;
    /**
     * 是否含有样式
     */
    hasStyles(): boolean;
    /**
     * 是否有子元素
     */
    hasChildren(): boolean;
    /**
     * 判断当前元素与另一个元素是否有包含关系
     */
    hasContains(element: AlexElement): boolean;
    /**
     * 克隆当前元素
     * deep为true表示深度克隆，即克隆子元素，否则只会克隆自身
     */
    clone(deep?: boolean | undefined): AlexElement;
    /**
     * 将当前元素转换成根级块元素
     */
    convertToBlock(): void;
    /**
     * 设置为空元素
     */
    toEmpty(): void;
    /**
     * 获取所在根级块元素
     */
    getBlock(): AlexElement;
    /**
     * 获取所在内部块元素
     */
    getInblock(): AlexElement | null;
    /**
     * 获取所在行内元素
     */
    getInline(): AlexElement | null;
    /**
     * 比较当前元素和另一个元素的styles是否一致
     */
    isEqualStyles(element: AlexElement): boolean;
    /**
     * 比较当前元素和另一个元素的marks是否一致
     */
    isEqualMarks(element: AlexElement): boolean;
    /**
     * 如果当前元素是文本元素或者自闭合元素，判断它是不是指定元素的后代所有文本元素和自闭合元素中的第一个
     */
    isFirst(element: AlexElement): boolean;
    /**
     * 如果当前元素是文本元素或者自闭合元素，判断它是不是指定元素的后代所有文本元素和自闭合元素中的最后一个
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
     */
    static isElement(val: any): boolean;
    /**
     * 扁平化处理元素数组
     */
    static flatElements(elements: AlexElement[]): AlexElement[];
    /**
     * 创建一个空白文本元素并返回
     */
    static getSpaceElement(): AlexElement;
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
}
