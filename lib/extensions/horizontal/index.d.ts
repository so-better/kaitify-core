import { Extension } from '../Extension';
import './style.less';
declare module '../../model' {
    interface EditorCommandsType {
        setHorizontal?: () => Promise<void>;
    }
}
export declare const HorizontalExtension: Extension;
