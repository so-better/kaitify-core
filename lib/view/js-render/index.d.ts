import { Editor } from '../../model';
import { KNodeRenderOptionType } from '../index';

/**
 * 渲染单个节点
 */
export declare const renderNode: (editor: Editor, opts: KNodeRenderOptionType) => HTMLElement;
/**
 * 默认的原生js渲染编辑器视图层
 */
export declare const defaultUpdateView: (this: Editor, init: boolean) => void;
