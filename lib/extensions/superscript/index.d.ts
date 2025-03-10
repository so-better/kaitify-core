import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 光标所在文本是否上标
         */
        isSuperscript?: () => boolean;
        /**
         * 设置上标
         */
        setSuperscript?: () => Promise<void>;
        /**
         * 取消上标
         */
        unsetSuperscript?: () => Promise<void>;
    }
}
export declare const SuperscriptExtension: () => Extension;
