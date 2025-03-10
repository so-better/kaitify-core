import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 光标所在文本的字体是否与入参一致
         */
        isFontFamily?: (value: string) => boolean;
        /**
         * 设置字体
         */
        setFontFamily?: (value: string) => Promise<void>;
        /**
         * 取消字体
         */
        unsetFontFamily?: (value: string) => Promise<void>;
    }
}
export declare const FontFamilyExtension: () => Extension;
