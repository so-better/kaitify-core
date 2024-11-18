//引入基本样式
import './css/var.less'
import './css/style.less'
//基本数据结构
export * from './model'
//插件
export { Extension } from './extensions'
export type { ExtensionCreateOptionType, AlignValueType, HeadingLevelType, SetLinkOptionType, SetImageOptionType, SetVideoOptionType, UpdateLinkOptionType, SetAttachmentConfigType, UpdateAttachmentConfigType, TableCellsMergeDirectionType } from './extensions'
//视图渲染
export * from './view'
