import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        isStrikethrough?: () => boolean;
        setStrikethrough?: () => Promise<void>;
        unsetStrikethrough?: () => Promise<void>;
    }
}
export declare const StrikethroughExtension: () => Extension;
