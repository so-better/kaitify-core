import { Extension } from '../Extension';

declare module '../../model' {
    interface EditorCommandsType {
        isFontFamily?: (value: string) => boolean;
        setFontFamily?: (value: string) => Promise<void>;
        unsetFontFamily?: (value: string) => Promise<void>;
    }
}
export declare const FontFamilyExtension: Extension;
