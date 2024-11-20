import { KNode } from '../../model';
import { Extension } from '../Extension';
export type OrderedListType = 'decimal' | 'lower-alpha' | 'upper-alpha' | 'lower-roman' | 'upper-roman' | 'lower-greek' | 'cjk-ideographic';
export type UnorderListType = 'disc' | 'circle' | 'square';
declare module '../../model' {
    interface EditorCommandsType {
        getList?: (ordered: boolean) => KNode | null;
        hasList?: (ordered: boolean) => boolean;
        allList?: (ordered: boolean) => boolean;
        setList?: (ordered: boolean) => Promise<void>;
        unsetList?: (ordered: boolean) => Promise<void>;
        updateListType?: ({ listType, ordered }: {
            listType: OrderedListType | UnorderListType;
            ordered?: boolean;
        }) => Promise<void>;
    }
}
export declare const ListExtension: Extension;
