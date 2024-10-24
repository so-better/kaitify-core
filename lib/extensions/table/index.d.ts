import { KNode } from '../../model';
import { Extension } from '../Extension';
import './style.less';
type TableCellsMergeDirection = 'left' | 'top' | 'right' | 'bottom';
declare module '../../model' {
    interface EditorCommandsType {
        getTable?: () => KNode | null;
        hasTable?: () => boolean;
        canMergeCells?: (direction: TableCellsMergeDirection) => boolean;
        setTable?: ({ rows, columns }: {
            rows: number;
            columns: number;
        }) => Promise<void>;
        unsetTable?: () => Promise<void>;
        mergeCell?: (direction: TableCellsMergeDirection) => Promise<void>;
        addRow?: (direction: 'top' | 'bottom') => Promise<void>;
        deleteRow?: () => Promise<void>;
        addColumn?: (direction: 'left' | 'right') => Promise<void>;
        deleteColumn?: () => Promise<void>;
    }
}
export declare const TableExtension: Extension;
export {};
