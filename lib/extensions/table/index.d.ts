import { KNode } from '../../model';
import { Extension } from '../Extension';
export type TableCellsMergeDirectionType = 'left' | 'top' | 'right' | 'bottom';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 获取光标所在的表格节点，如果光标不在一个表格节点内，返回null
         */
        getTable?: () => KNode | null;
        /**
         * 判断光标范围内是否有表格节点
         */
        hasTable?: () => boolean;
        /**
         * 是否可以合并单元格
         */
        canMergeTableCells?: (direction: TableCellsMergeDirectionType) => boolean;
        /**
         * 插入表格
         */
        setTable?: ({ rows, columns }: {
            rows: number;
            columns: number;
        }) => Promise<void>;
        /**
         * 取消表格
         */
        unsetTable?: () => Promise<void>;
        /**
         * 合并单元格
         */
        mergeTableCell?: (direction: TableCellsMergeDirectionType) => Promise<void>;
        /**
         * 添加行
         */
        addTableRow?: (direction: 'top' | 'bottom') => Promise<void>;
        /**
         * 删除行
         */
        deleteTableRow?: () => Promise<void>;
        /**
         * 添加列
         */
        addTableColumn?: (direction: 'left' | 'right') => Promise<void>;
        /**
         * 删除列
         */
        deleteTableColumn?: () => Promise<void>;
    }
}
export declare const TableExtension: () => Extension;
