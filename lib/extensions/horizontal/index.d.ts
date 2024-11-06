import { Extension } from '../Extension';

declare module '../../model' {
    interface EditorCommandsType {
        setHorizontal?: () => Promise<void>;
    }
}
export declare const HorizontalExtension: Extension;
