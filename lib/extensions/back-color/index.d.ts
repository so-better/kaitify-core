import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        isBackColor?: (value: string) => boolean;
        setBackColor?: (value: string) => Promise<void>;
        unsetBackColor?: (value: string) => Promise<void>;
    }
}
export declare const BackColorExtension: () => Extension;
