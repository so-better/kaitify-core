import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 光标所在文本是否加粗
         */
        isBold?: () => boolean;
        /**
         * 设置加粗
         */
        setBold?: () => Promise<void>;
        /**
         * 取消加粗
         */
        unsetBold?: () => Promise<void>;
    }
}
export declare const BoldExtension: () => Extension;
