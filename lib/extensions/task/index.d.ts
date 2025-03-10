import { KNode } from '../../model';
import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 获取光标所在的待办节点，如果光标不在一个待办节点内，返回null
         */
        getTask?: () => KNode | null;
        /**
         * 判断光标范围内是否有待办节点
         */
        hasTask?: () => boolean;
        /**
         * 光标范围内是否都是待办节点
         */
        allTask?: () => boolean;
        /**
         * 设置待办
         */
        setTask?: () => Promise<void>;
        /**
         * 取消待办
         */
        unsetTask?: () => Promise<void>;
    }
}
export declare const TaskExtension: () => Extension;
