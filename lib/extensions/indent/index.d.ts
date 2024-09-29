import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        isIndent?: (val: string) => boolean;
        setIndent?: (val: string) => Promise<void>;
        unsetIndent?: (val: string) => Promise<void>;
    }
}
export declare const IndentExtension: Extension;
