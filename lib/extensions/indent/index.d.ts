import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 是否可以使用缩进
         */
        canUseIndent?: () => boolean;
        /**
         * 增加缩进
         */
        setIncreaseIndent?: () => Promise<void>;
        /**
         * 减少缩进
         */
        setDecreaseIndent?: () => Promise<void>;
    }
}
export declare const IndentExtension: () => Extension;
