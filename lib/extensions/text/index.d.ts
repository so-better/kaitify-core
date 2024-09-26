import { KNodeMarksType, KNodeStylesType } from '../../model';
import { Extension } from '../Extension';

declare module '../../model' {
    interface EditorCommandsType {
        setTextStyle?: (styles: KNodeStylesType) => Promise<void>;
        setTextMark?: (marks: KNodeMarksType) => Promise<void>;
        removeTextStyle?: (styleNames?: string[]) => Promise<void>;
        removeTextMark?: (markNames?: string[]) => Promise<void>;
        isTextStyle?: (styleName: string, styleValue?: string | number) => boolean;
        isTextMark?: (markName: string, markValue?: string | number) => boolean;
    }
}
export declare const TextExtension: Extension;
