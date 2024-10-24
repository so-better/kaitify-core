import { KNode } from '../../model';
import { Extension } from '../Extension';
import './style.less';
type SetAttachmentConfigType = {
    url: string;
    text: string;
    icon?: string;
};
declare module '../../model' {
    interface EditorCommandsType {
        getAttachment?: () => KNode | null;
        hasAttachment?: () => boolean;
        setAttachment?: (options: SetAttachmentConfigType) => Promise<void>;
    }
}
export declare const AttachmentExtension: Extension;
export {};
