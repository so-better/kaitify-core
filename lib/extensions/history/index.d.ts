import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        canUndo?: () => boolean;
        canRedo?: () => boolean;
        undo?: () => Promise<void>;
        redo?: () => Promise<void>;
    }
}
export declare const HistoryExtension: Extension;
