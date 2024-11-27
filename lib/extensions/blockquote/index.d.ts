import { KNode } from '../../model';
import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        getBlockquote?: () => KNode | null;
        hasBlockquote?: () => boolean;
        allBlockquote?: () => boolean;
        setBlockquote?: () => Promise<void>;
        unsetBlockquote?: () => Promise<void>;
    }
}
export declare const BlockquoteExtension: () => Extension;
