import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        isColor?: (val: string) => boolean;
        setColor?: (val: string) => Promise<void>;
        unsetColor?: (val: string) => Promise<void>;
    }
}
export declare const ColorExtension: Extension;
