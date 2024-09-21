import { Editor } from '../../model/Editor';
import { KNode, KNodeMarksType, KNodeStylesType } from '../../model/KNode';
/**
 * 渲染参数类型
 */
export type KNodeRenderOptionsType = {
    tag: string;
    attrs: KNodeMarksType;
    styles: KNodeStylesType;
    namespace?: string;
    textContent?: string;
    children?: KNodeRenderOptionsType[];
};
/**
 * 节点渲染成dom后在dom上生成的一个特殊标记名称，它的值是节点的key值
 */
export declare const NODE_MARK = "data-kaitify-node";
/**
 * 获取节点的渲染参数
 */
export declare const getNodeRenderOptions: (editor: Editor, node: KNode) => KNodeRenderOptionsType;
