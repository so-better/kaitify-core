import { KNode } from '../../model';
import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 获取光标所在的行内代码，如果光标不在一个行内代码内，返回null
         */
        getCode?: () => KNode | null;
        /**
         * 判断光标范围内是否有行内代码
         */
        hasCode?: () => boolean;
        /**
         * 光标范围内是否都是行内代码
         */
        allCode?: () => boolean;
        /**
         * 设置行内代码
         */
        setCode?: () => Promise<void>;
        /**
         * 取消行内代码
         */
        unsetCode?: () => Promise<void>;
    }
}
export declare const CodeExtension: () => Extension;
