import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 设置分隔线
         */
        setHorizontal?: () => Promise<void>;
    }
}
export declare const HorizontalExtension: () => Extension;
