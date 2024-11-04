import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        isLineHeight?: (value: string | number) => boolean;
        setLineHeight?: (value: string | number) => Promise<void>;
        unsetLineHeight?: (value: string | number) => Promise<void>;
    }
}
export declare const LineHeightExtension: Extension;
