import { KNode } from '../../model';
import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 获取光标所在的引用节点，如果光标不在一个引用节点内，返回null
         */
        getBlockquote?: () => KNode | null;
        /**
         * 判断光标范围内是否有引用节点
         */
        hasBlockquote?: () => boolean;
        /**
         * 光标范围内是否都是引用节点
         */
        allBlockquote?: () => boolean;
        /**
         * 设置引用
         */
        setBlockquote?: () => Promise<void>;
        /**
         * 取消引用
         */
        unsetBlockquote?: () => Promise<void>;
    }
}
export declare const BlockquoteExtension: () => Extension;
