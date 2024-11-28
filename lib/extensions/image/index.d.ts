import { KNode } from '../../model';
import { Extension } from '../Extension';
/**
 * 插入图片方法入参类型
 */
export type SetImageOptionType = {
    src: string;
    alt?: string;
    width?: string;
};
/**
 * 更新图片方法入参类型
 */
export type UpdateImageOptionType = {
    src?: string;
    alt?: string;
};
declare module '../../model' {
    interface EditorCommandsType {
        getImage?: () => KNode | null;
        hasImage?: () => boolean;
        setImage?: (options: SetImageOptionType) => Promise<void>;
        updateImage?: (options: UpdateImageOptionType) => Promise<void>;
    }
}
export declare const ImageExtension: () => Extension;
