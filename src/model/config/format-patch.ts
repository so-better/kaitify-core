import { KNode } from '../KNode'

/**
 * 节点数组比对结果类型
 */
export type NodePatchResultType = {
	/**
	 * 差异类型：insert：插入节点；remove：移除节点；update：节点更新；replace：节点被替换；move：节点同级位置移动；empty：空节点
	 */
	type: 'insert' | 'remove' | 'update' | 'replace' | 'move' | 'empty'
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
 * 对新旧两个节点数组进行比对
 */
export const patchNodes = (newNodes: KNode[], oldNodes: (KNode | null)[]) => {
	//比对结果数组
	let result: NodePatchResultType[] = []
	if (newNodes.length && oldNodes.length) {
		//起点新指针
		let newStartIndex = 0
		//起点旧指针
		let oldStartIndex = 0
		//终点新指针
		let newEndIndex = newNodes.length - 1
		//终点旧指针
		let oldEndIndex = oldNodes.length - 1
		//遍历
		while (newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex) {
			//起点旧指针对应的节点不存在则跳过，说明该节点已被处理
			if (!oldNodes[oldStartIndex]) {
				oldStartIndex++
			}
			//终点旧指针对应的节点不存在则跳过，说明该节点已被处理
			else if (!oldNodes[oldEndIndex]) {
				oldEndIndex--
			}
			//如果起点新指针对应的节点与起点旧指针对应的节点key一致，则进行比对
			else if (newNodes[newStartIndex].key == oldNodes[oldStartIndex]!.key) {
				result.push(...patchNode(newNodes[newStartIndex], oldNodes[oldStartIndex]!))
				newStartIndex++
				oldStartIndex++
			}
			//终点新指针对应的节点与终点旧指针对应的节点，如果key一致，则进行比对
			else if (newNodes[newEndIndex].key == oldNodes[oldEndIndex]!.key) {
				result.push(...patchNode(newNodes[newEndIndex], oldNodes[oldEndIndex]!))
				newEndIndex--
				oldEndIndex--
			}
			//起点新指针对应的节点与终点旧指针对应的节点，如果key一致，说明进行了移动
			else if (newNodes[newStartIndex].key == oldNodes[oldEndIndex]!.key) {
				result.push(
					{
						type: 'move',
						newNode: newNodes[newStartIndex],
						oldNode: oldNodes[oldEndIndex]
					},
					...patchNode(newNodes[newStartIndex], oldNodes[oldEndIndex]!)
				)
				newStartIndex++
				oldEndIndex--
			}
			//终点新指针对应的节点与起点旧指针对应的节点，如果key一致，则进行比对
			else if (newNodes[newEndIndex].key == oldNodes[oldStartIndex]!.key) {
				result.push(
					{
						type: 'move',
						newNode: newNodes[newEndIndex],
						oldNode: oldNodes[oldStartIndex]
					},
					...patchNode(newNodes[newEndIndex], oldNodes[oldStartIndex]!)
				)
				newEndIndex--
				oldStartIndex++
			}
			//其他情况，判断是移动还是新增
			else {
				//在旧数组里查找新节点同key节点
				let idxInOld = oldNodes.findIndex(item => item && item.key === newNodes[newStartIndex].key)
				//存在同key节点
				if (idxInOld >= 0) {
					result.push(
						{
							type: 'move',
							newNode: newNodes[newStartIndex],
							oldNode: oldNodes[idxInOld]
						},
						...patchNode(newNodes[newStartIndex], oldNodes[idxInOld]!)
					)
					//此时将节点置为null表示节点已处理过
					oldNodes[idxInOld] = null
				}
				//不存在同key的节点
				else {
					result.push({
						type: 'insert',
						newNode: newNodes[newStartIndex],
						oldNode: null
					})
				}
				newStartIndex++
			}

			//旧指针遍历结束
			if (oldStartIndex > oldEndIndex) {
				//新指针还没结束，则剩下的都是新插入的节点，进行处理
				for (; newStartIndex <= newEndIndex; newStartIndex++) {
					result.push({
						type: 'insert',
						newNode: newNodes[newStartIndex],
						oldNode: null
					})
				}
			}
			//新指针遍历结束
			else if (newStartIndex > newEndIndex) {
				//旧指针还没结束，则是需要移除的，进行处理
				for (; oldStartIndex <= oldEndIndex; oldStartIndex++) {
					if (oldNodes[oldStartIndex]) {
						result.push({
							type: 'remove',
							oldNode: oldNodes[oldStartIndex],
							newNode: null
						})
					}
				}
			}
		}
	} else if (newNodes.length) {
		result = newNodes.map(item => {
			return {
				type: 'insert',
				newNode: item,
				oldNode: null
			}
		})
	} else if (oldNodes.length) {
		result = oldNodes.map(item => {
			return {
				type: 'remove',
				oldNode: item,
				newNode: null
			}
		})
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
			type: 'empty',
			oldNode,
			newNode
		})
	}
	//type和locked、fixed变更
	else if (newNode.type != oldNode.type || newNode.locked != oldNode.locked || newNode.fixed != oldNode.fixed) {
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
		//节点的marks变更
		if (!newNode.isEqualMarks(oldNode)) {
			result.push({
				type: 'update',
				newNode,
				oldNode,
				update: 'marks'
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
		//子节点
		if (newNode.hasChildren() && oldNode.hasChildren()) {
			result.push(...patchNodes(newNode.children!, oldNode.children!))
		}
	}

	return result
}
