import { Extension } from '../Extension';
declare module '../../model' {
    interface EditorCommandsType {
        isSubscript?: () => boolean;
        setSubscript?: () => Promise<void>;
        unsetSubscript?: () => Promise<void>;
    }
}
export declare const SubscriptExtension: Extension;
