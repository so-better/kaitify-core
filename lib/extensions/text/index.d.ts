import { KNodeMarksType, KNodeStylesType } from '../../model';
import { Extension } from '../Extension';

declare module '../../model' {
    interface EditorCommandsType {
        isTextStyle?: (styleName: string, styleValue?: string | number) => boolean;
        isTextMark?: (markName: string, markValue?: string | number) => boolean;
        setTextStyle?: (styles: KNodeStylesType, updateView?: boolean) => Promise<void>;
        setTextMark?: (marks: KNodeMarksType, updateView?: boolean) => Promise<void>;
        removeTextStyle?: (styleNames?: string[], updateView?: boolean) => Promise<void>;
        removeTextMark?: (markNames?: string[], updateView?: boolean) => Promise<void>;
        clearFormat?: () => Promise<void>;
    }
}
export declare const TextExtension: Extension;
