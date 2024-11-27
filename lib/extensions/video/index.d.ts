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
        getVideo?: () => KNode | null;
        hasVideo?: () => boolean;
        setVideo?: (options: SetVideoOptionType) => Promise<void>;
        updateVideo?: (options: UpdateVideoOptionType) => Promise<void>;
    }
}
export declare const VideoExtension: () => Extension;
