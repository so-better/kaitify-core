import { Extension } from '../Extension';

declare module '../../model' {
    interface EditorCommandsType {
        isFontFamily?: (val: string) => boolean;
        setFontFamily?: (val: string) => Promise<void>;
        unsetFontFamily?: (val: string) => Promise<void>;
    }
}
export declare const FontFamilyExtension: Extension;
