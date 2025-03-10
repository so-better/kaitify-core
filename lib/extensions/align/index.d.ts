import { Extension } from '../Extension';
export type AlignValueType = 'left' | 'right' | 'center' | 'justify';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 光标所在的块节点是否都是符合的对齐方式
         */
        isAlign?: (value: AlignValueType) => boolean;
        /**
         * 设置对齐方式
         */
        setAlign?: (value: AlignValueType) => Promise<void>;
        /**
         * 取消对齐方式
         */
        unsetAlign?: (value: AlignValueType) => Promise<void>;
    }
}
export declare const AlignExtension: () => Extension;
