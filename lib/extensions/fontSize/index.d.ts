import { Extension } from '../Extension';

declare module '../../model' {
    interface EditorCommandsType {
        isFontSize?: (val: string) => boolean;
        setFontSize?: (val: string) => Promise<void>;
        unsetFontSize?: (val: string) => Promise<void>;
    }
}
export declare const FontSizeExtension: Extension;
