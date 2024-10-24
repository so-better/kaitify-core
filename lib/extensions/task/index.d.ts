import { KNode } from '../../model';
import { Extension } from '../Extension';
import './style.less';
declare module '../../model' {
    interface EditorCommandsType {
        getTask?: () => KNode | null;
        hasTask?: () => boolean;
        allTask?: () => boolean;
        setTask?: () => Promise<void>;
        unsetTask?: () => Promise<void>;
    }
}
export declare const TaskExtension: Extension;
