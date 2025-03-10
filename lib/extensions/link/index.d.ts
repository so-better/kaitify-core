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
    href?: string;
    newOpen?: boolean;
};
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 获取光标所在的链接，如果光标不在一个链接内，返回null
         */
        getLink?: () => KNode | null;
        /**
         * 判断光标范围内是否有链接
         */
        hasLink?: () => boolean;
        /**
         * 设置连接
         */
        setLink?: (options: SetLinkOptionType) => Promise<void>;
        /**
         * 更新链接
         */
        updateLink?: (options: UpdateLinkOptionType) => Promise<void>;
        /**
         * 取消链接
         */
        unsetLink?: () => Promise<void>;
    }
}
export declare const LinkExtension: () => Extension;
