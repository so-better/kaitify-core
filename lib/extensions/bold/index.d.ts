import { Extension } from '../Extension';

declare module '../../model' {
    interface EditorCommandsType {
        isBold?: () => boolean;
        setBold?: () => Promise<void>;
        unsetBold?: () => Promise<void>;
    }
}
export declare const BoldExtension: Extension;
