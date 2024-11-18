import { KNode } from '../../model';
import { Extension } from '../Extension';
export type SetAttachmentConfigType = {
    url: string;
    text: string;
    icon?: string;
};
export type UpdateAttachmentConfigType = {
    url?: string;
    text?: string;
};
declare module '../../model' {
    interface EditorCommandsType {
        getAttachment?: () => KNode | null;
        hasAttachment?: () => boolean;
        setAttachment?: (options: SetAttachmentConfigType) => Promise<void>;
        updateAttachment?: (options: UpdateAttachmentConfigType) => Promise<void>;
        getAttachmentInfo?: () => {
            url: string;
            text: string;
        } | null;
    }
}
export declare const AttachmentExtension: Extension;
