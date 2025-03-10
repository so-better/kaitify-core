import { KNodeMarksType, KNodeStylesType } from '../../model';
import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 判断光标所在文本是否具有某个样式
         */
        isTextStyle?: (styleName: string, styleValue?: string | number) => boolean;
        /**
         * 判断光标所在文本是否具有某个标记
         */
        isTextMark?: (markName: string, markValue?: string | number) => boolean;
        /**
         * 设置光标所在文本样式
         */
        setTextStyle?: (styles: KNodeStylesType, updateView?: boolean) => Promise<void>;
        /**
         * 设置光标所在文本标记
         */
        setTextMark?: (marks: KNodeMarksType, updateView?: boolean) => Promise<void>;
        /**
         * 移除光标所在文本样式
         */
        removeTextStyle?: (styleNames?: string[], updateView?: boolean) => Promise<void>;
        /**
         * 移除光标所在文本标记
         */
        removeTextMark?: (markNames?: string[], updateView?: boolean) => Promise<void>;
        /**
         * 清除格式
         */
        clearFormat?: () => Promise<void>;
    }
}
export declare const TextExtension: () => Extension;
