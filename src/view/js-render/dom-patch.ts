import { KNode, KNodeMarksType, KNodeStylesType } from '@/model'

/**
 * 节点数组比对结果类型
 */
type NodePatchResultType = {
	/**
	 * 差异类型：insert：插入节点；remove：移除节点；update：节点更新；replace：节点被替换；move：节点同级位置移动
	 */
	type: 'insert' | 'remove' | 'update' | 'replace' | 'move'
	/**
	 * 新节点
	 */
	newNode: KNode | null
	/**
	 * 旧节点
	 */
	oldNode: KNode | null
	/**
	 * 更新的字段
	 */
	update?: 'textContent' | 'styles' | 'marks'
}

/**
 * mark比对结果类型
 */
export type MarkPatchResultType = {
	/**
	 * 新增和更新的标记
	 */
	addMarks: KNodeMarksType
	/**
	 * 移除的标记
	 */
	removeMarks: KNodeMarksType
}

/**
 * style比对结果类型
 */
export type StylePatchResultType = {
	/**
	 * 新增和更新的样式
	 */
	addStyles: KNodeStylesType
	/**
	 * 移除的样式
	 */
	removeStyles: KNodeStylesType
}

/**
 * 获取两个节点上不相同的marks
 */
export const getDifferentMarks = (newNode: KNode, oldNode: KNode): MarkPatchResultType => {
	//新增的标记
	const addMarks: KNodeMarksType = {}
	//移除的标记
	const removeMarks: KNodeMarksType = {}

	if (newNode.hasMarks()) {
		Object.keys(newNode.marks!).forEach(mark => {
			if (oldNode.hasMarks() && oldNode.marks!.hasOwnProperty(mark) && oldNode.marks![mark] === newNode.marks![mark]) {
				return
			}
			addMarks[mark] = newNode.marks![mark]
		})
	}
	if (oldNode.hasMarks()) {
		Object.keys(oldNode.marks!).forEach(mark => {
			if (newNode.hasMarks() && newNode.marks!.hasOwnProperty(mark)) {
				return
			}
			removeMarks[mark] = oldNode.marks![mark]
		})
	}
	return { addMarks, removeMarks }
}

/**
 * 获取两个节点上不相同的styles
 */
export const getDifferentStyles = (newNode: KNode, oldNode: KNode): StylePatchResultType => {
	//新增的样式
	const addStyles: KNodeStylesType = {}
	//移除的样式
	const removeStyles: KNodeStylesType = {}

	if (newNode.hasStyles()) {
		Object.keys(newNode.styles!).forEach(style => {
			if (oldNode.hasStyles() && oldNode.styles!.hasOwnProperty(style) && oldNode.styles![style] === newNode.styles![style]) {
				return
			}
			addStyles[style] = newNode.styles![style]
		})
	}
	if (oldNode.hasStyles()) {
		Object.keys(oldNode.styles!).forEach(style => {
			if (newNode.hasStyles() && newNode.styles!.hasOwnProperty(style)) {
				return
			}
			removeStyles[style] = oldNode.styles![style]
		})
	}
	return { addStyles, removeStyles }
}

/**
 * 对新旧两个节点数组进行比对
 */
export const patchNodes = (newNodes: KNode[], oldNodes: (KNode | null)[]) => {
	//两个数组都为空，无需操作
	if (newNodes.length == 0 && oldNodes.length == 0) {
		return []
	}
	//旧节点全部移除
	if (newNodes.length === 0) {
		return oldNodes
			.filter(node => !node)
			.map(oldNode => ({
				type: 'remove',
				oldNode,
				newNode: null
			})) as NodePatchResultType[]
	}
	//新节点全部插入
	if (oldNodes.length === 0) {
		return newNodes.map(newNode => ({
			type: 'insert',
			newNode,
			oldNode: null
		})) as NodePatchResultType[]
	}
	//比对结果数组
	const result: NodePatchResultType[] = []
	// 创建一个 Map 存储旧节点 key 对应的索引，提升查找效率
	const oldKeyMap = new Map<number, number>()
	oldNodes.forEach((node, index) => {
		if (node) {
			oldKeyMap.set(node.key, index)
		}
	})
	// 双端遍历
	let newStartIndex = 0
	let oldStartIndex = 0
	let newEndIndex = newNodes.length - 1
	let oldEndIndex = oldNodes.length - 1
	while (newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex) {
		const newStartNode = newNodes[newStartIndex]
		const oldStartNode = oldNodes[oldStartIndex]
		const newEndNode = newNodes[newEndIndex]
		const oldEndNode = oldNodes[oldEndIndex]
		//跳过已被处理的旧节点
		if (!oldStartNode) {
			oldStartIndex++
		}
		//跳过已被处理的旧节点
		else if (!oldEndNode) {
			oldEndIndex--
		}
		//起始节点 key 匹配，进行比对
		else if (newStartNode.key == oldStartNode!.key) {
			result.push(...patchNode(newStartNode, oldStartNode!))
			newStartIndex++
			oldStartIndex++
		}
		//终点节点 key 匹配，进行比对
		else if (newEndNode.key == oldEndNode!.key) {
			result.push(...patchNode(newEndNode, oldEndNode!))
			newEndIndex--
			oldEndIndex--
		}
		//新起点和旧终点匹配，说明节点被移动
		else if (newStartNode.key == oldEndNode!.key) {
			result.push(
				{
					type: 'move',
					newNode: newStartNode,
					oldNode: oldEndNode
				},
				...patchNode(newStartNode, oldEndNode!)
			)
			newStartIndex++
			oldEndIndex--
		}
		//新终点和旧起点匹配，说明节点被移动
		else if (newEndNode.key == oldStartNode!.key) {
			result.push(
				{
					type: 'move',
					newNode: newEndNode,
					oldNode: oldStartNode
				},
				...patchNode(newEndNode, oldStartNode!)
			)
			newEndIndex--
			oldStartIndex++
		}
		//其他情况
		else {
			//查找新起点节点在旧节点数组中的位置
			const idxInOld = oldKeyMap.get(newStartNode.key)
			if (idxInOld !== undefined) {
				//说明找到了同key节点，进行移动
				result.push(
					{
						type: 'move',
						newNode: newStartNode,
						oldNode: oldNodes[idxInOld]
					},
					...patchNode(newStartNode, oldNodes[idxInOld]!)
				)
				//标记节点已处理
				oldNodes[idxInOld] = null
			} else {
				//没有找到相同 key，则是新插入的节点
				result.push({
					type: 'insert',
					newNode: newStartNode,
					oldNode: null
				})
			}
			newStartIndex++
		}
	}
	//处理剩余的新节点（全部为插入）
	while (newStartIndex <= newEndIndex) {
		result.push({
			type: 'insert',
			newNode: newNodes[newStartIndex],
			oldNode: null
		})
		newStartIndex++
	}
	//处理剩余的旧节点（全部为移除）
	while (oldStartIndex <= oldEndIndex) {
		if (oldNodes[oldStartIndex]) {
			result.push({
				type: 'remove',
				oldNode: oldNodes[oldStartIndex]!,
				newNode: null
			})
		}
		oldStartIndex++
	}
	return result
}

/**
 * 对新旧两个节点进行比对
 */
export const patchNode = (newNode: KNode, oldNode: KNode) => {
	//比对结果数组
	const result: NodePatchResultType[] = []
	//namespace变更
	if (newNode.namespace != oldNode.namespace) {
		result.push({
			type: 'replace',
			newNode,
			oldNode
		})
	}
	//非文本节点的tag变化
	else if (!newNode.isText() && newNode.tag != oldNode.tag) {
		result.push({
			type: 'replace',
			newNode,
			oldNode
		})
	}
	//新节点有子节点而旧节点没有
	else if (newNode.hasChildren() && !oldNode.hasChildren()) {
		result.push({
			type: 'replace',
			newNode,
			oldNode
		})
	}
	//旧节点有子节点而新节点没有
	else if (oldNode.hasChildren() && !newNode.hasChildren()) {
		result.push({
			type: 'replace',
			newNode,
			oldNode
		})
	}
	//以下是更新节点的情况
	else {
		//文本节点的textContent变更
		if (newNode.isText() && newNode.textContent != oldNode.textContent) {
			result.push({
				type: 'update',
				oldNode,
				newNode,
				update: 'textContent'
			})
		}
		//节点的styles变更
		if (!newNode.isEqualStyles(oldNode)) {
			result.push({
				type: 'update',
				newNode,
				oldNode,
				update: 'styles'
			})
		}
		//节点的marks变更
		if (!newNode.isEqualMarks(oldNode)) {
			result.push({
				type: 'update',
				newNode,
				oldNode,
				update: 'marks'
			})
		}
		//子节点
		if (newNode.hasChildren() && oldNode.hasChildren()) {
			result.push(...patchNodes(newNode.children!, oldNode.children!))
		}
	}

	return result
}
