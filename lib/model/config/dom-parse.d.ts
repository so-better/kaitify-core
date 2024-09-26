/**
 * 块节点的转换类型
 */
export type BlockParseType = {
    /**
     * dom标签
     */
    tag: string;
    /**
     * 如果为true则表示会将该dom转为编辑器配置的默认块节点
     */
    parse?: boolean;
    /**
     * 如果为true则表示会将该dom转为块节点后设置为固定状态
     */
    fixed?: boolean;
};
/**
 * 行内节点的转换类型
 */
export type InlineParseType = {
    /**
     * dom标签
     */
    tag: string;
    /**
     * 如果是true表示会将该dom转为编辑器配置的默认行内节点
     */
    parse?: boolean;
};
/**
 * 闭合节点的转换类型
 */
export type ClosedParseType = {
    /**
     * dom标签
     */
    tag: string;
};
/**
 * 定义需要转为块节点的dom
 */
export declare const blockParse: BlockParseType[];
/**
 * 定义需要转为行内节点的dom
 */
export declare const inlineParse: InlineParseType[];
/**
 * 定义需要转为闭合节点的dom
 */
export declare const closedParse: ClosedParseType[];
