import { KNode } from '../KNode'
/**
 * 这里的比对结果仅进行格式化处理，只需要判断节点是否变化
 */

/**
 * 节点数组比对结果类型
 */
export type NodePatchResultType = {
	/**
	 * 新节点
	 */
	newNode: KNode | null
	/**
	 * 旧节点
	 */
	oldNode: KNode | null
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
				oldNode,
				newNode: null
			})) as NodePatchResultType[]
	}
	//新节点全部插入
	if (oldNodes.length === 0) {
		return newNodes.map(newNode => ({
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
			result.push({
				newNode: newStartNode,
				oldNode: oldEndNode
			})
			newStartIndex++
			oldEndIndex--
		}
		//新终点和旧起点匹配，说明节点被移动
		else if (newEndNode.key == oldStartNode!.key) {
			result.push({
				newNode: newEndNode,
				oldNode: oldStartNode
			})
			newEndIndex--
			oldStartIndex++
		}
		//其他情况
		else {
			//查找新起点节点在旧节点数组中的位置
			const idxInOld = oldKeyMap.get(newStartNode.key)
			if (idxInOld !== undefined) {
				//说明找到了同key节点，进行移动
				result.push({
					newNode: newStartNode,
					oldNode: oldNodes[idxInOld]
				})
				//标记节点已处理
				oldNodes[idxInOld] = null
			} else {
				//没有找到相同 key，则是新插入的节点
				result.push({
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
			newNode: newNodes[newStartIndex],
			oldNode: null
		})
		newStartIndex++
	}
	//处理剩余的旧节点（全部为移除）
	while (oldStartIndex <= oldEndIndex) {
		if (oldNodes[oldStartIndex]) {
			result.push({
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
	//空节点
	if (newNode.isEmpty() || oldNode.isEmpty()) {
		result.push({
			oldNode,
			newNode
		})
	}
	//type和locked、fixed、nested变更
	else if (newNode.type != oldNode.type || newNode.locked != oldNode.locked || newNode.fixed != oldNode.fixed || newNode.nested != oldNode.nested) {
		result.push({
			newNode,
			oldNode
		})
	}
	//非文本节点的tag变化
	else if (!newNode.isText() && newNode.tag != oldNode.tag) {
		result.push({
			newNode,
			oldNode
		})
	}
	//新节点有子节点而旧节点没有
	else if (newNode.hasChildren() && !oldNode.hasChildren()) {
		result.push({
			newNode,
			oldNode
		})
	}
	//旧节点有子节点而新节点没有
	else if (oldNode.hasChildren() && !newNode.hasChildren()) {
		result.push({
			newNode,
			oldNode
		})
	}
	//以下是更新节点的情况
	else {
		//文本节点的textContent变更
		if (newNode.isText() && newNode.textContent != oldNode.textContent) {
			result.push({
				oldNode,
				newNode
			})
		}
		//节点的marks变更
		else if (!newNode.isEqualMarks(oldNode)) {
			result.push({
				newNode,
				oldNode
			})
		}
		//节点的styles变更
		else if (!newNode.isEqualStyles(oldNode)) {
			result.push({
				newNode,
				oldNode
			})
		}
		//子节点
		else if (newNode.hasChildren() && oldNode.hasChildren()) {
			result.push(...patchNodes(newNode.children!, oldNode.children!))
		}
	}

	return result
}
