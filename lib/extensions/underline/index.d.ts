import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 光标所在文本是否下划线
         */
        isUnderline?: () => boolean;
        /**
         * 设置下划线
         */
        setUnderline?: () => Promise<void>;
        /**
         * 取消下划线
         */
        unsetUnderline?: () => Promise<void>;
    }
}
export declare const UnderlineExtension: () => Extension;
