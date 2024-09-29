import { KNodeStylesType } from '../../model'
import { Extension } from '../Extension'

export const BlockExtension = Extension.create({
	name: 'block',
	//块节点粘贴时保留的样式
	pasteKeepStyles(node) {
		const styles: KNodeStylesType = {}
		if (node.isBlock() && node.hasStyles()) {
			if (node.styles!.hasOwnProperty('textIndent')) styles.textIndent = node.styles!.textIndent
			if (node.styles!.hasOwnProperty('textAlign')) styles.textAlign = node.styles!.textAlign
			if (node.styles!.hasOwnProperty('lineHeight')) styles.lineHeight = node.styles!.lineHeight
		}
		return styles
	},
	//处理子节点中的块节点
	//父节点是行内节点则将块节点转为行内节点
	//块节点和其他节点并存亦将块节点转为行内节点
	formatRule({ node }) {
		//当前节点存在子节点
		if (node.hasChildren() && !node.isEmpty()) {
			//过滤子节点中的空节点和占位符（因为占位符会在存在其他节点时清除，所以不考虑）
			const nodes = node.children!.filter(item => {
				return !item.isEmpty() && !item.isPlaceholder()
			})
			//获取子节点中的块节点
			const blockNodes = nodes.filter(item => {
				return item.isBlock()
			})
			//存在块节点时如果当前节点是行内节点 或者 子节点中存在其他节点
			if (blockNodes.length && (node.isInline() || blockNodes.length != nodes.length)) {
				//将块节点转为行内节点
				blockNodes.forEach(item => {
					item.type = 'inline'
				})
			}
		}
	}
})
