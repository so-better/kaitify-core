import { KNode } from '../../model';
import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 获取光标所在的水平线节点
         */
        getHorizontal?: () => KNode | null;
        /**
         * 判断光标范围内是否有水平线节点
         */
        hasHorizontal?: () => boolean;
        /**
         * 设置水平线
         */
        setHorizontal?: () => Promise<void>;
    }
}
export declare const HorizontalExtension: () => Extension;
