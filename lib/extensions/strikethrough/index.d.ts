import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 光标所在文本是否删除线
         */
        isStrikethrough?: () => boolean;
        /**
         * 设置删除线
         */
        setStrikethrough?: () => Promise<void>;
        /**
         * 取消删除线
         */
        unsetStrikethrough?: () => Promise<void>;
    }
}
export declare const StrikethroughExtension: () => Extension;
