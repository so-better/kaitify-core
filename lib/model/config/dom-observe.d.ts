import { Editor } from '../Editor';

/**
 * 移除对编辑器的dom监听
 */
export declare const removeDomObserve: (editor: Editor) => void;
/**
 * 设置对编辑器的dom监听，主要解决非法dom插入问题
 */
export declare const setDomObserve: (editor: Editor) => void;
