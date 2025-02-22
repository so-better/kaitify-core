import { KNode } from '../../model';
import { Extension } from '../Extension';
export type SetAttachmentOptionType = {
    url: string;
    text: string;
    icon?: string;
};
export type UpdateAttachmentOptionType = {
    url?: string;
    text?: string;
    icon?: string;
};
export type AttachmentExtensionPropsType = {
    icon: string;
};
declare module '../../model' {
    interface EditorCommandsType {
        getAttachment?: () => KNode | null;
        hasAttachment?: () => boolean;
        setAttachment?: (options: SetAttachmentOptionType) => Promise<void>;
        updateAttachment?: (options: UpdateAttachmentOptionType) => Promise<void>;
        getAttachmentInfo?: () => {
            url: string;
            text: string;
            icon: string;
        } | null;
    }
}
export declare const AttachmentExtension: (props?: AttachmentExtensionPropsType) => Extension;
