import { Extension } from '../Extension';

declare module '../../model' {
    interface EditorCommandsType {
        isSuperscript?: () => boolean;
        setSuperscript?: () => Promise<void>;
        unsetSuperscript?: () => Promise<void>;
    }
}
export declare const SuperscriptExtension: Extension;
