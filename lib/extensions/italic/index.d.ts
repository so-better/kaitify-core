import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 光标所在文本是否斜体
         */
        isItalic?: () => boolean;
        /**
         * 设置斜体
         */
        setItalic?: () => Promise<void>;
        /**
         * 取消斜体
         */
        unsetItalic?: () => Promise<void>;
    }
}
export declare const ItalicExtension: () => Extension;
