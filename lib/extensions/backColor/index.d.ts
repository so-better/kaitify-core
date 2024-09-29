import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        isBackColor?: (val: string) => boolean;
        setBackColor?: (val: string) => Promise<void>;
        unsetBackColor?: (val: string) => Promise<void>;
    }
}
export declare const BackColorExtension: Extension;
