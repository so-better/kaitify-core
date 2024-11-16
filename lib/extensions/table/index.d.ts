import { KNode } from '../../model';
import { Extension } from '../Extension';
export type TableCellsMergeDirectionType = 'left' | 'top' | 'right' | 'bottom';
declare module '../../model' {
    interface EditorCommandsType {
        getTable?: () => KNode | null;
        hasTable?: () => boolean;
        canMergeTableCells?: (direction: TableCellsMergeDirectionType) => boolean;
        setTable?: ({ rows, columns }: {
            rows: number;
            columns: number;
        }) => Promise<void>;
        unsetTable?: () => Promise<void>;
        mergeTableCell?: (direction: TableCellsMergeDirectionType) => Promise<void>;
        addTableRow?: (direction: 'top' | 'bottom') => Promise<void>;
        deleteTableRow?: () => Promise<void>;
        addTableColumn?: (direction: 'left' | 'right') => Promise<void>;
        deleteTableColumn?: () => Promise<void>;
    }
}
export declare const TableExtension: Extension;
