import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 光标所在的块节点是否都是符合的行高
         */
        isLineHeight?: (value: string | number) => boolean;
        /**
         * 设置行高
         */
        setLineHeight?: (value: string | number) => Promise<void>;
        /**
         * 取消行高
         */
        unsetLineHeight?: (value: string | number) => Promise<void>;
    }
}
export declare const LineHeightExtension: () => Extension;
