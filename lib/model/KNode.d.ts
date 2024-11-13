import * as CSS from 'csstype';
/**
 * 节点类型
 */
export type KNodeType = 'text' | 'closed' | 'inline' | 'block';
/**
 * 标记集合类型
 */
export type KNodeMarksType = {
    [mark: string]: string | number;
};
/**
 * 样式集合类型
 */
export type KNodeStylesType = CSS.Properties<string | number> & {
    [style: string]: string | number;
};
/**
 * 节点匹配入参类型
 */
export type KNodeMatchOptionType = {
    tag?: string;
    marks?: KNodeMarksType | {
        [mark: string]: boolean;
    };
    styles?: KNodeStylesType | {
        [style: string]: boolean;
    };
};
/**
 * 创建节点的入参类型
 */
export type KNodeCreateOptionType = {
    type: KNodeType;
    tag?: string;
    marks?: KNodeMarksType;
    styles?: KNodeStylesType;
    namespace?: string;
    textContent?: string;
    locked?: boolean;
    fixed?: boolean;
    nested?: boolean;
    void?: boolean;
    children?: KNodeCreateOptionType[];
};
/**
 * 创建零宽度无断空白文本节点的入参类型
 */
export type ZeroWidthTextKNodeCreateOptionType = {
    marks?: KNodeMarksType;
    styles?: KNodeStylesType;
    namespace?: string;
    locked?: boolean;
};
/**
 * 基本节点
 */
export declare class KNode {
    /**
     * 唯一key【不可修改】
     */
    key: number;
    /**
     * 类型【可以修改】
     */
    type?: KNodeType;
    /**
     * 渲染标签【可以修改】
     */
    tag?: string;
    /**
     * 文本值【可以修改】
     */
    textContent?: string;
    /**
     * 标记集合【可以修改】
     */
    marks?: KNodeMarksType;
    /**
     * 样式集合，样式名称请使用驼峰写法，虽然在渲染时兼容处理了中划线格式的样式名称，但是在其他地方可能会出现问题并且编辑器内部在样式相关的判断都是以驼峰写法为主【可以修改】
     */
    styles?: KNodeStylesType;
    /**
     * 是否锁定节点【可以修改】：
     * 针对块节点，在符合合并条件的情况下是否允许编辑器将其与父节点或者子节点进行合并；
     * 针对行内节点，在符合合并条件的情况下是否允许编辑器将其与相邻节点或者父节点或者子节点进行合并；
     * 针对文本节点，在符合合并的条件下是否允许编辑器将其与相邻节点或者父节点进行合并。
     */
    locked: boolean;
    /**
     * 是否为固定块节点，值为true时：当光标在节点起始处或者光标在节点内只有占位符时，执行删除操作不会删除此节点，会再次创建一个占位符进行处理；当光标在节点内且节点不是代码块样式，不会进行换行【可以修改】
     */
    fixed: boolean;
    /**
     * 是否为固定格式的内嵌块节点，如li、tr、td等【可以修改】
     */
    nested: boolean;
    /**
     * 是否为不可见节点，意味着此类节点在编辑器内视图内无法看到
     */
    void?: boolean;
    /**
     * 命名空间【可以修改】
     */
    namespace?: string;
    /**
     * 子节点数组【可以修改】
     */
    children?: KNode[];
    /**
     * 父节点【可以修改】
     */
    parent?: KNode;
    /**
     * 【API】是否块节点
     */
    isBlock(): boolean;
    /**
     * 【API】是否行内节点
     */
    isInline(): boolean;
    /**
     * 【API】是否闭合节点
     */
    isClosed(): boolean;
    /**
     * 【API】是否文本节点
     */
    isText(): boolean;
    /**
     * 【API】获取所在的根级块节点
     */
    getRootBlock(): KNode;
    /**
     * 【API】获取所在块级节点
     */
    getBlock(): KNode;
    /**
     * 【API】获取所在行内节点
     */
    getInline(): KNode | null;
    /**
     * 【API】是否有子节点
     */
    hasChildren(): boolean;
    /**
     * 【API】是否空节点
     */
    isEmpty(): boolean;
    /**
     * 【API】是否零宽度无断空白文本节点
     */
    isZeroWidthText(): boolean;
    /**
     * 【API】是否占位符
     */
    isPlaceholder(): boolean;
    /**
     * 【API】是否含有标记
     */
    hasMarks(): boolean;
    /**
     * 【API】是否含有样式
     */
    hasStyles(): boolean;
    /**
     * 【API】判断节点是否不可编辑的，如果是返回设置不可编辑的那个节点，否则返回null
     */
    getUneditable(): KNode | null;
    /**
     * 【API】当前节点是否只包含占位符
     */
    allIsPlaceholder(): boolean;
    /**
     * 【API】设置为空节点
     */
    toEmpty(): void;
    /**
     * 【API】比较当前节点和另一个节点的styles是否一致
     */
    isEqualStyles(node: KNode): boolean;
    /**
     * 【API】比较当前节点和另一个节点的marks是否一致
     */
    isEqualMarks(node: KNode): boolean;
    /**
     * 【API】判断当前节点是否在拥有代码块样式的块级节点内（包括自身）
     */
    isInCodeBlockStyle(): boolean;
    /**
     * 【API】判断当前节点是否与另一个节点相同
     */
    isEqual(node: KNode): boolean;
    /**
     * 【API】判断当前节点是否包含指定节点
     */
    isContains(node: KNode): boolean;
    /**
     * 【API】复制节点，deep 为true表示深度复制，即复制子节点，否则只会复制自身
     */
    clone: (deep?: boolean | undefined) => KNode;
    /**
     * 完全复制节点，涵盖每个属性
     */
    fullClone(): KNode;
    /**
     * 【API】如果当前节点是文本节点或者闭合节点，则判断是不是指定节点后代中所有文本节点和闭合节点中的第一个
     */
    firstTextClosedInNode: (node: KNode) => boolean;
    /**
     * 【API】如果当前节点是文本节点或者闭合节点，则判断是不是指定节点后代中所有文本节点和闭合节点中的最后一个
     */
    lastTextClosedInNode(node: KNode): boolean;
    /**
     * 【API】获取当前节点在某个节点数组中的前一个非空节点
     */
    getPrevious(nodes: KNode[]): KNode | null;
    /**
     * 【API】获取当前节点在某个节点数组中的后一个非空节点
     */
    getNext(nodes: KNode[]): KNode | null;
    /**
     * 【API】判断当前节点是否符合指定的条件，marks和styles参数中的属性值可以是true表示只判断是否拥有该标记或者样式，而不关心是什么值
     */
    isMatch(options: KNodeMatchOptionType): boolean;
    /**
     * 【API】判断当前节点是否存在于符合条件的节点内，包含自身，如果是返回符合条件的节点，否则返回null
     */
    getMatchNode(options: KNodeMatchOptionType): KNode | null;
    /**
     * 【API】获取当前节点下的所有可聚焦的节点，如果自身符合也会包括在内，type是all获取闭合节点和文本节点，type是closed获取闭合节点，type是text获取文本节点
     */
    getFocusNodes: (type?: "all" | "closed" | "text" | undefined) => KNode[];
    /**
     * 【API】创建节点
     */
    static create(options: KNodeCreateOptionType): KNode;
    /**
     * 【API】创建零宽度无断空白文本节点
     */
    static createZeroWidthText(options?: ZeroWidthTextKNodeCreateOptionType): KNode;
    /**
     * 【API】创建占位符
     */
    static createPlaceholder(): KNode;
    /**
     * 【API】判断参数是否节点
     */
    static isKNode(val: any): val is KNode;
    /**
     * 【API】将某个节点数组扁平化处理后返回
     */
    static flat(nodes: KNode[]): KNode[];
    /**
     * 【API】在指定的节点数组中根据key查找节点
     */
    static searchByKey(key: string | number, nodes: KNode[]): KNode | null;
}
