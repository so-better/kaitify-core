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
 * 创建节点的入参类型
 */
export type KNodeCreateOptionType = {
    /**
     * 节点类型
     */
    type: KNodeType;
    /**
     * 节点对应的dom标签
     */
    tag?: string;
    /**
     * 节点标记集合
     */
    marks?: KNodeMarksType;
    /**
     * 节点样式集合
     */
    styles?: KNodeStylesType;
    /**
     * 节点命名空间
     */
    namespace?: string;
    /**
     * 节点文本内容
     */
    textContent?: string;
    /**
     * 是否锁定节点：
     * 针对块节点，在符合合并条件的情况下不允许编辑器将其与父节点或者子节点进行合并；
     * 针对行内节点，在符合合并条件的情况下是否允许编辑器将其与相邻节点或者父节点或者子节点进行合并；
     * 针对文本节点，在符合合并的条件下是否允许编辑器将其与相邻节点或者父节点进行合并。
     */
    locked?: boolean;
    /**
     * 是否为固定块节点，值为true时：当光标在节点起始处或者光标在节点内只有占位符时，执行删除操作不会删除此节点，会再次创建一个占位符进行处理；当光标在节点内且节点不是代码块样式，不会进行换行
     */
    fixed?: boolean;
    /**
     * 子节点数组
     */
    children?: KNodeCreateOptionType[];
};
/**
 * 创建零宽度无断空白文本节点的入参类型
 */
export type ZeroWidthTextKNodeCreateOptionType = {
    /**
     * 节点标记集合
     */
    marks?: KNodeMarksType;
    /**
     * 节点样式集合
     */
    styles?: KNodeStylesType;
    /**
     * 节点命名空间
     */
    namespace?: string;
    /**
     * 是否锁定节点：
     * 针对块节点，在符合合并条件的情况下不允许编辑器将其与父节点或者子节点进行合并；
     * 针对行内节点，在符合合并条件的情况下是否允许编辑器将其与相邻节点或者父节点或者子节点进行合并；
     * 针对文本节点，在符合合并的条件下是否允许编辑器将其与相邻节点或者父节点进行合并。
     */
    locked?: boolean;
};
/**
 * 基本节点
 */
export declare class KNode {
    /**
     * 唯一key
     */
    key: number;
    /**
     * 类型
     */
    type?: KNodeType;
    /**
     * 渲染标签
     */
    tag?: string;
    /**
     * 文本值
     */
    textContent?: string;
    /**
     * 标记集合
     */
    marks?: KNodeMarksType;
    /**
     * 样式集合
     */
    styles?: KNodeStylesType;
    /**
     * 是否锁定节点
     * 针对块节点，在符合合并条件的情况下不允许编辑器将其与父节点或者子节点进行合并
     * 针对行内节点，在符合合并条件的情况下是否允许编辑器将其与相邻节点或者父节点或者子节点进行合并
     * 针对文本节点，在符合合并的条件下是否允许编辑器将其与相邻节点或者父节点进行合并
     */
    locked: boolean;
    /**
     * 是否为固定块节点，值为true时：当光标在节点起始处或者光标在节点内只有占位符时，执行删除操作不会删除此节点，会再次创建一个占位符进行处理；当光标在节点内且节点不是代码块样式，不会进行换行
     */
    fixed: boolean;
    /**
     * 命名空间
     */
    namespace?: string;
    /**
     * 子节点数组
     */
    children?: KNode[];
    /**
     * 父节点
     */
    parent?: KNode;
    /**
     * 是否块节点
     */
    isBlock(): boolean;
    /**
     * 是否行内节点
     */
    isInline(): boolean;
    /**
     * 是否闭合节点
     */
    isClosed(): boolean;
    /**
     * 是否文本节点
     */
    isText(): boolean;
    /**
     * 获取所在块级节点
     */
    getBlock(): KNode;
    /**
     * 获取所在行内节点
     */
    getInline(): KNode | null;
    /**
     * 是否有子节点
     */
    hasChildren(): boolean;
    /**
     * 是否空节点
     */
    isEmpty(): boolean;
    /**
     * 是否零宽度无断空白文本节点
     */
    isZeroWidthText(): boolean;
    /**
     * 是否占位符
     */
    isPlaceholder(): boolean;
    /**
     * 是否含有标记
     */
    hasMarks(): boolean;
    /**
     * 是否含有样式
     */
    hasStyles(): boolean;
    /**
     * 判断节点是否不可编辑的，如果是返回设置不可编辑的那个节点，否则返回null
     */
    isUneditable(): KNode | null;
    /**
     * 当前节点是否只包含占位符
     */
    allIsPlaceholder(): boolean | 0;
    /**
     * 设置为空节点
     */
    toEmpty(): void;
    /**
     * 比较当前节点和另一个节点的styles是否一致
     
     */
    isEqualStyles(node: KNode): boolean;
    /**
     * 比较当前节点和另一个节点的marks是否一致
     
     */
    isEqualMarks(node: KNode): boolean;
    /**
     * 判断当前节点是否在拥有代码块样式的块级节点内（包括自身）
     */
    isInCodeBlockStyle(): boolean;
    /**
     * 判断当前节点是否与另一个节点相同
     
     */
    isEqual(node: KNode): boolean;
    /**
     * 判断当前节点是否包含指定节点
     */
    isContains(node: KNode): boolean;
    /**
     * 复制节点，deep 为true表示深度复制，即复制子节点，否则只会复制自身
     */
    clone: (deep?: boolean | undefined) => KNode;
    /**
     * 完全复制节点，涵盖每个属性
     */
    fullClone(): KNode;
    /**
     * 如果当前节点是文本节点或者闭合节点，则判断是不是指定节点后代中所有文本节点和闭合节点中的第一个
     */
    firstTextClosedInNode: (node: KNode) => boolean;
    /**
     * 如果当前节点是文本节点或者闭合节点，则判断是不是指定节点后代中所有文本节点和闭合节点中的最后一个
     */
    lastTextClosedInNode(node: KNode): boolean;
    /**
     * 获取当前节点在某个节点数组中的前一个非空节点
     */
    getPrevious(nodes: KNode[]): KNode | null;
    /**
     * 获取当前节点在某个节点数组中的后一个非空节点
     */
    getNext(nodes: KNode[]): KNode | null;
    /**
     * 创建节点
     */
    static create(options: KNodeCreateOptionType): KNode;
    /**
     * 创建零宽度无断空白文本节点
     */
    static createZeroWidthText(options?: ZeroWidthTextKNodeCreateOptionType): KNode;
    /**
     * 创建占位符
     */
    static createPlaceholder(): KNode;
    /**
     * 判断参数是否节点
     */
    static isKNode(val: any): boolean;
    /**
     * 将某个节点数组扁平化处理后返回
     */
    static flat(nodes: KNode[]): KNode[];
    /**
     * 在指定的节点数组中根据key查找节点
     */
    static searchByKey(key: string | number, nodes: KNode[]): KNode | null;
}
