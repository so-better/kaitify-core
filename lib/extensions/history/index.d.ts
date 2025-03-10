import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 是否可以撤销
         */
        canUndo?: () => boolean;
        /**
         * 是否可以重做
         */
        canRedo?: () => boolean;
        /**
         * 撤销
         */
        undo?: () => Promise<void>;
        /**
         * 重做
         */
        redo?: () => Promise<void>;
    }
}
export declare const HistoryExtension: () => Extension;
