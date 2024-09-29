import { Extension } from '../Extension';
type AlignValueType = 'left' | 'right' | 'center' | 'justify';
declare module '../../model' {
    interface EditorCommandsType {
        isAlign?: (val: AlignValueType) => boolean;
        setAlign?: (val: AlignValueType) => Promise<void>;
        unsetAlign?: (val: AlignValueType) => Promise<void>;
    }
}
export declare const AlignExtension: Extension;
export {};
