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
        /**
         * 获取光标所在的附件节点，如果光标不在一个附件节点内，返回null
         */
        getAttachment?: () => KNode | null;
        /**
         * 判断光标范围内是否有附件节点
         */
        hasAttachment?: () => boolean;
        /**
         * 插入附件
         */
        setAttachment?: (options: SetAttachmentOptionType) => Promise<void>;
        /**
         * 更新附件
         */
        updateAttachment?: (options: UpdateAttachmentOptionType) => Promise<void>;
        /**
         * 获取附件信息
         */
        getAttachmentInfo?: () => {
            url: string;
            text: string;
            icon: string;
        } | null;
    }
}
export declare const AttachmentExtension: (props?: AttachmentExtensionPropsType) => Extension;
