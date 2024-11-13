import { KNode } from '../../model';
import { Extension } from '../Extension';
export type TableCellsMergeDirectionType = 'left' | 'top' | 'right' | 'bottom';
declare module '../../model' {
    interface EditorCommandsType {
        getTable?: () => KNode | null;
        hasTable?: () => boolean;
        canMergeCells?: (direction: TableCellsMergeDirectionType) => boolean;
        setTable?: ({ rows, columns }: {
            rows: number;
            columns: number;
        }) => Promise<void>;
        unsetTable?: () => Promise<void>;
        mergeCell?: (direction: TableCellsMergeDirectionType) => Promise<void>;
        addRow?: (direction: 'top' | 'bottom') => Promise<void>;
        deleteRow?: () => Promise<void>;
        addColumn?: (direction: 'left' | 'right') => Promise<void>;
        deleteColumn?: () => Promise<void>;
    }
}
export declare const TableExtension: Extension;
