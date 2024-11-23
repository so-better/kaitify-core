import { KNode } from '../../model';
import { Extension } from '../Extension';
import { HljsLanguageType } from './hljs';
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
export * from './hljs';
