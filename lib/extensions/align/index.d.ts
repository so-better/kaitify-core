import { Extension } from '../Extension';
export type AlignValueType = 'left' | 'right' | 'center' | 'justify';
declare module '../../model' {
    interface EditorCommandsType {
        isAlign?: (value: AlignValueType) => boolean;
        setAlign?: (value: AlignValueType) => Promise<void>;
        unsetAlign?: (value: AlignValueType) => Promise<void>;
    }
}
export declare const AlignExtension: () => Extension;
