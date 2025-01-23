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
        getList?: (options: ListOptionsType) => KNode | null;
        hasList?: (options: ListOptionsType) => boolean;
        allList?: (options: ListOptionsType) => boolean;
        setList?: (options: ListOptionsType) => Promise<void>;
        unsetList?: (options: ListOptionsType) => Promise<void>;
        canCreateInnerList?: () => {
            node: KNode;
            previousNode: KNode;
        } | null;
        createInnerList?: () => Promise<void>;
    }
}
export declare const ListExtension: () => Extension;
