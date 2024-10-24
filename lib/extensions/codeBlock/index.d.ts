import { KNode } from '../../model';
import { Extension } from '../Extension';
import { HljsLanguageType } from './hljs';
import './style.less';
declare module '../../model' {
    interface EditorCommandsType {
        getCodeBlock?: () => KNode | null;
        hasCodeBlock?: () => boolean;
        allCodeBlock?: () => boolean;
        setCodeBlock?: () => Promise<void>;
        unsetCodeBlock?: () => Promise<void>;
        updateCodeBlockLanguage?: (language: HljsLanguageType) => Promise<void>;
    }
}
export declare const CodeBlockExtension: Extension;
