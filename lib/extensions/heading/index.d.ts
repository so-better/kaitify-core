import { KNode } from '../../model';
import { Extension } from '../Extension';
export type HeadingLevelType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 获取光标所在的标题，如果光标不在一个标题内，返回null
         */
        getHeading?: (level: HeadingLevelType) => KNode | null;
        /**
         * 判断光标范围内是否有标题
         */
        hasHeading?: (level: HeadingLevelType) => boolean;
        /**
         * 光标范围内是否都是标题
         */
        allHeading?: (level: HeadingLevelType) => boolean;
        /**
         * 设置标题
         */
        setHeading?: (level: HeadingLevelType) => Promise<void>;
        /**
         * 取消标题
         */
        unsetHeading?: (level: HeadingLevelType) => Promise<void>;
    }
}
export declare const HeadingExtension: () => Extension;
