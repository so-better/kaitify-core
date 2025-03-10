import { KNode } from '../../model';
import { Extension } from '../Extension';
import { HljsLanguageType } from './hljs';
declare module '../../model' {
    interface EditorCommandsType {
        /**
         * 获取光标所在的代码块节点，如果光标不在一个代码块节点内，返回null
         */
        getCodeBlock?: () => KNode | null;
        /**
         * 判断光标范围内是否有代码块节点
         */
        hasCodeBlock?: () => boolean;
        /**
         * 光标范围内是否都是代码块节点
         */
        allCodeBlock?: () => boolean;
        /**
         * 设置代码块
         */
        setCodeBlock?: () => Promise<void>;
        /**
         * 取消代码块
         */
        unsetCodeBlock?: () => Promise<void>;
        /**
         * 更新光标所在代码块的语言类型
         */
        updateCodeBlockLanguage?: (language: HljsLanguageType) => Promise<void>;
    }
}
export declare const CodeBlockExtension: () => Extension;
export * from './hljs';
