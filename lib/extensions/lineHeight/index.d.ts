import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        isLineHeight?: (val: string | number) => boolean;
        setLineHeight?: (val: string | number) => Promise<void>;
        unsetLineHeight?: (val: string | number) => Promise<void>;
    }
}
export declare const LineHeightExtension: Extension;
