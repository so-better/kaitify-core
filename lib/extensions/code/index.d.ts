import { KNode } from '../../model';
import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        getCode?: () => KNode | null;
        hasCode?: () => boolean;
        allCode?: () => boolean;
        setCode?: () => Promise<void>;
        unsetCode?: () => Promise<void>;
    }
}
export declare const CodeExtension: () => Extension;
