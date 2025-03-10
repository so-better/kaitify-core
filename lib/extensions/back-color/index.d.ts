import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 光标所在文本的背景颜色是否与入参一致
         */
        isBackColor?: (value: string) => boolean;
        /**
         * 设置背景颜色
         */
        setBackColor?: (value: string) => Promise<void>;
        /**
         * 取消背景颜色
         */
        unsetBackColor?: (value: string) => Promise<void>;
    }
}
export declare const BackColorExtension: () => Extension;
