import { KNode } from '../../model';
import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 获取光标所在的数学公式节点，如果光标不在一个数学公式节点内，返回null
         */
        getMath?: () => KNode | null;
        /**
         * 判断光标范围内是否有数学公式节点
         */
        hasMath?: () => boolean;
        /**
         * 插入数学公式
         */
        setMath?: (value: string) => Promise<void>;
        /**
         * 更新数学公式
         */
        updateMath?: (value: string) => Promise<void>;
    }
}
export declare const MathExtension: () => Extension;
