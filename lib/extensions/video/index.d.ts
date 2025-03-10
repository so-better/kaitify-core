import { KNode } from '../../model';
import { Extension } from '../Extension';
/**
 * 插入视频方法入参类型
 */
export type SetVideoOptionType = {
    src: string;
    width?: string;
    autoplay?: boolean;
};
/**
 * 更新视频方法入参类型
 */
export type UpdateVideoOptionType = {
    controls?: boolean;
    muted?: boolean;
    loop?: boolean;
};
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 获取光标所在的视频，如果光标不在一个视频内，返回null
         */
        getVideo?: () => KNode | null;
        /**
         * 判断光标范围内是否有视频
         */
        hasVideo?: () => boolean;
        /**
         * 插入视频
         */
        setVideo?: (options: SetVideoOptionType) => Promise<void>;
        /**
         * 更新视频
         */
        updateVideo?: (options: UpdateVideoOptionType) => Promise<void>;
    }
}
export declare const VideoExtension: () => Extension;
