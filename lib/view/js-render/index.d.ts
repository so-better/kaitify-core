import { Editor } from '../../model/Editor';
import { KNodeRenderOptionsType } from '../core';
/**
 * 渲染单个节点
 */
export declare const renderNode: (editor: Editor, opts: KNodeRenderOptionsType) => HTMLElement;
/**
 * 默认的原生js渲染编辑器视图层
 */
export declare const defaultUpdateViewFunction: (this: Editor, init: boolean) => void;
