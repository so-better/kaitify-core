import { Extension } from '../Extension';

declare module '../../model' {
    interface EditorCommandsType {
        isColor?: (value: string) => boolean;
        setColor?: (value: string) => Promise<void>;
        unsetColor?: (value: string) => Promise<void>;
    }
}
export declare const ColorExtension: Extension;
