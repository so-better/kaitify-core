import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 光标所在文本是否下标
         */
        isSubscript?: () => boolean;
        /**
         * 设置下标
         */
        setSubscript?: () => Promise<void>;
        /**
         * 取消下标
         */
        unsetSubscript?: () => Promise<void>;
    }
}
export declare const SubscriptExtension: () => Extension;
