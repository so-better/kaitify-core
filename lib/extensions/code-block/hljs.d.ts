/**
 * 支持的语言列表
 */
export declare const HljsLanguages: readonly ["plaintext", "json", "javascript", "java", "typescript", "python", "php", "css", "less", "scss", "html", "markdown", "objectivec", "swift", "dart", "nginx", "http", "go", "ruby", "c", "cpp", "csharp", "sql", "shell", "r", "kotlin", "rust"];
/**
 * 语言类型
 */
export type HljsLanguageType = (typeof HljsLanguages)[number];
/**
 * 获取经过hljs处理的html元素
 */
export declare const getHljsHtml: (code: string, language: string) => string;
