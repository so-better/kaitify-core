import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        setIncreaseIndent?: () => Promise<void>;
        setDecreaseIndent?: () => Promise<void>;
    }
}
export declare const IndentExtension: () => Extension;
