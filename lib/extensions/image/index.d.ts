import { KNode } from '../../model';
import { Extension } from '../Extension';

/**
 * 插入图片方法入参类型
 */
type SetImageOptionType = {
    src: string;
    alt?: string;
    width?: string;
};
declare module '../../model' {
    interface EditorCommandsType {
        getImage?: () => KNode | null;
        hasImage?: () => boolean;
        setImage?: (options: SetImageOptionType) => Promise<void>;
    }
}
export declare const ImageExtension: Extension;
export {};
