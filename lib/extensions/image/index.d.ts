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
        /**
         * 获取光标所在的图片，如果光标不在一张图片内，返回null
         */
        getImage?: () => KNode | null;
        /**
         * 判断光标范围内是否有图片
         */
        hasImage?: () => boolean;
        /**
         * 插入图片
         */
        setImage?: (options: SetImageOptionType) => Promise<void>;
        /**
         * 更新图片
         */
        updateImage?: (options: UpdateImageOptionType) => Promise<void>;
    }
}
export declare const ImageExtension: () => Extension;
