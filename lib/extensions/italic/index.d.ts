import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        isItalic?: () => boolean;
        setItalic?: () => Promise<void>;
        unsetItalic?: () => Promise<void>;
    }
}
export declare const ItalicExtension: Extension;
