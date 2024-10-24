import { KNode } from '../../model';
import { Extension } from '../Extension';
import './style.less';
declare module '../../model' {
    interface EditorCommandsType {
        getMath?: () => KNode | null;
        hasMath?: () => boolean;
        setMath?: (value: string) => Promise<void>;
    }
}
export declare const MathExtension: Extension;
