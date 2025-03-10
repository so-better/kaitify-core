import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 光标所在文本的字号大小是否与入参一致
         */
        isFontSize?: (value: string) => boolean;
        /**
         * 设置字号
         */
        setFontSize?: (value: string) => Promise<void>;
        /**
         * 取消字号
         */
        unsetFontSize?: (value: string) => Promise<void>;
    }
}
export declare const FontSizeExtension: () => Extension;
