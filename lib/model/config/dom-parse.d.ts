import { KNodeStylesType } from '../KNode';
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
     * 如果是对象值的话则表示不仅会将该dom转为编辑器配置的默认行内节点，而且会设置固定的style样式，对象的value支持函数，会在将dom转为编辑器配置的默认行内节点时自动执行该函数获取结果，该函数参数分别是编辑器实例和dom
     */
    parse?: boolean | KNodeStylesType | {
        [style: string]: string | number | ((element: HTMLElement) => string | number);
    };
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
