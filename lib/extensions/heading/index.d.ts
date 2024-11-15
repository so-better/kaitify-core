import { KNode } from '../../model';
import { Extension } from '../Extension';
export type HeadingLevelType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
declare module '../../model' {
    interface EditorCommandsType {
        getHeading?: (level: HeadingLevelType) => KNode | null;
        hasHeading?: (level: HeadingLevelType) => boolean;
        allHeading?: (level: HeadingLevelType) => boolean;
        setHeading?: (level: HeadingLevelType) => Promise<void>;
        unsetHeading?: (level: HeadingLevelType) => Promise<void>;
    }
}
export declare const HeadingExtension: Extension;
