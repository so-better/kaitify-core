import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        isFontSize?: (value: string) => boolean;
        setFontSize?: (value: string) => Promise<void>;
        unsetFontSize?: (value: string) => Promise<void>;
    }
}
export declare const FontSizeExtension: () => Extension;
