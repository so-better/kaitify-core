import { KNode } from '../../model';
import { Extension } from '../Extension';
export type OrderedListType = 'decimal' | 'lower-alpha' | 'upper-alpha' | 'lower-roman' | 'upper-roman' | 'lower-greek' | 'cjk-ideographic';
export type UnorderListType = 'disc' | 'circle' | 'square';
export type ListOptionsType = {
    ordered?: boolean;
    listType?: OrderedListType | UnorderListType;
};
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 获取光标所在的有序列表或者无序列表，如果光标不在一个有序列表或者无序列表内，返回null
         */
        getList?: (options: ListOptionsType) => KNode | null;
        /**
         * 判断光标范围内是否有有序列表或者无序列表
         */
        hasList?: (options: ListOptionsType) => boolean;
        /**
         * 判断光标范围内是否都是有序列表或者无序列表
         */
        allList?: (options: ListOptionsType) => boolean;
        /**
         * 设置有序列表或者无序列表
         */
        setList?: (options: ListOptionsType) => Promise<void>;
        /**
         * 取消有序列表或者无序列表
         */
        unsetList?: (options: ListOptionsType) => Promise<void>;
        /**
         * 是否可以生成内嵌列表
         */
        canCreateInnerList?: () => {
            node: KNode;
            previousNode: KNode;
        } | null;
        /**
         * 根据当前光标所在的li节点生成一个内嵌列表
         */
        createInnerList?: () => Promise<void>;
    }
}
export declare const ListExtension: () => Extension;
