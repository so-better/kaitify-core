import { KNode } from '../../model';
import { Extension } from '../Extension';
/**
 * 插入链接方法入参类型
 */
export type SetLinkOptionType = {
    href: string;
    text?: string;
    newOpen?: boolean;
};
/**
 * 更新链接方法入参类型
 */
export type UpdateLinkOptionType = {
    href: string;
    newOpen?: boolean;
};
declare module '../../model' {
    interface EditorCommandsType {
        getLink?: () => KNode | null;
        hasLink?: () => boolean;
        setLink?: (options: SetLinkOptionType) => Promise<void>;
        updateLink?: (options: UpdateLinkOptionType) => Promise<void>;
        unsetLink?: () => Promise<void>;
    }
}
export declare const LinkExtension: Extension;
