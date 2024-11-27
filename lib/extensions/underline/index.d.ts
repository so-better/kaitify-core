import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        isUnderline?: () => boolean;
        setUnderline?: () => Promise<void>;
        unsetUnderline?: () => Promise<void>;
    }
}
export declare const UnderlineExtension: () => Extension;
