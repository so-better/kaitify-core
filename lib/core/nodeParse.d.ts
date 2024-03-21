import { ObjectType } from './tool';
export type NodeBlockParseType = {
    parsedom: string;
    parse?: boolean;
};
export type NodeClosedParseType = {
    parsedom: string;
};
export type NodeInblockParseType = {
    parsedom: string;
    block?: boolean;
};
export type NodeInlineParseType = {
    parsedom: string;
    parse?: boolean | ObjectType;
};
/**
 * 在将node转为AlexElement数据时默认的根级块元素
 * 如果有parse属性且为true则表示会将该node转为AlexElement.BLOCK_NODE
 */
export declare const blockParse: NodeBlockParseType[];
/**
 * 在将node转为AlexElement数据时默认的自闭合元素
 */
export declare const closedParse: NodeClosedParseType[];
/**
 * 在将node转为AlexElement数据时默认的内部块元素
 * 如果有block属性且为true，则表示该node转换后的内部块元素的behavior是"block"而不是默认的"default"
 */
export declare const inblockParse: NodeInblockParseType[];
/**
 * 在将node转为AlexElement数据时默认的行内元素
 * 如果有parse属性且为true表示会将该node转为AlexElement.TEXT_NODE
 * 如果有parse属性且是对象值的话则表示不仅会将该node转为AlexElement.TEXT_NODE，而且会设置固定的style样式
 * 如果parse是对象值，对象的value支持函数，会在将node转为AlexElement时自动执行该函数获取结果，在该函数内this指向AlexEditor实例对象，参数是当前node元素
 */
export declare const inlineParse: NodeInlineParseType[];
