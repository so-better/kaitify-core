import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 光标所在文本的颜色是否与入参一致
         */
        isColor?: (value: string) => boolean;
        /**
         * 设置颜色
         */
        setColor?: (value: string) => Promise<void>;
        /**
         * 取消颜色
         */
        unsetColor?: (value: string) => Promise<void>;
    }
}
export declare const ColorExtension: () => Extension;
