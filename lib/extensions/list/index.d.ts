import { KNode } from '../../model';
import { Extension } from '../Extension';
type ListType = 'disc' | 'circle' | 'square' | 'decimal' | 'lower-alpha' | 'upper-alpha' | 'lower-roman' | 'upper-roman' | 'lower-greek' | 'cjk-ideographic';
declare module '../../model' {
    interface EditorCommandsType {
        getList?: (ordered: boolean) => KNode | null;
        hasList?: (ordered: boolean) => boolean;
        allList?: (ordered: boolean) => boolean;
        setList?: (ordered: boolean) => Promise<void>;
        unsetList?: (ordered: boolean) => Promise<void>;
        updateListType?: ({ listType, ordered }: {
            listType: ListType;
            ordered?: boolean;
        }) => Promise<void>;
    }
}
export declare const ListExtension: Extension;
export {};
