import { AlexElement } from '../Element'
import { ObjectType } from './tool'

/**
 * patch结果类型
 */
export type patchResultType = {
	//insert：元素新插入；remove：元素移除；update：元素更新；replace：元素替换；move元素移动；empty：空元素
	type: 'insert' | 'remove' | 'update' | 'replace' | 'move' | 'empty'
	//新元素
	newElement?: AlexElement
	//旧元素
	oldElement?: AlexElement
	//更新元素时具体更新哪个字段
	update?: 'textContent' | 'styles' | 'marks'
}

/**
 * 对新旧两个元素数组进行比对
 * @param newElements
 * @param oldElements
 * @param forRender 是否为了渲染dom，如果是true则差异是为了渲染dom，否则差异是为了格式化
 * @returns
 */
export const patch = (newElements: AlexElement[], oldElements: (AlexElement | undefined)[], forRender: boolean) => {
	//比对结果集
	let result: patchResultType[] = []
	if (newElements.length && oldElements.length) {
		//起点新指针
		let newStartIndex = 0
		//起点旧指针
		let oldStartIndex = 0
		//终点新指针
		let newEndIndex = newElements.length - 1
		//终点旧指针
		let oldEndIndex = oldElements.length - 1
		//遍历
		while (newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex) {
			//起点旧指针对应的元素不存在则跳过此此遍历，说明该元素已被处理
			if (!oldElements[oldStartIndex]) {
				oldStartIndex++
			}
			//终点旧指针对应的元素不存在则跳过此次宾利，说明该元素已被处理
			else if (!oldElements[oldEndIndex]) {
				oldEndIndex--
			}
			//起点新指针对应的元素与起点旧指针对应的元素，如果key一致，则进行比对
			else if (newElements[newStartIndex].key == oldElements[oldStartIndex]!.key) {
				result.push(...patchElement(newElements[newStartIndex], oldElements[oldStartIndex]!, forRender))
				newStartIndex++
				oldStartIndex++
			}
			//终点新指针对应的元素与终点旧指针对应的元素，如果key一致，则进行比对
			else if (newElements[newEndIndex].key == oldElements[oldEndIndex]!.key) {
				result.push(...patchElement(newElements[newEndIndex], oldElements[oldEndIndex]!, forRender))
				newEndIndex--
				oldEndIndex--
			}
			//起点新指针对应的元素与终点旧指针对应的元素，如果key一致，说明进行了移动
			else if (newElements[newStartIndex].key == oldElements[oldEndIndex]!.key) {
				result.push(
					{
						type: 'move',
						newElement: newElements[newStartIndex],
						oldElement: oldElements[oldEndIndex]
					},
					...patchElement(newElements[newStartIndex], oldElements[oldEndIndex]!, forRender)
				)
				newStartIndex++
				oldEndIndex--
			}
			//终点新指针对应的元素与起点旧指针对应的元素，如果key一致，则进行比对
			else if (newElements[newEndIndex].key == oldElements[oldStartIndex]!.key) {
				result.push(
					{
						type: 'move',
						newElement: newElements[newEndIndex],
						oldElement: oldElements[oldStartIndex]
					},
					...patchElement(newElements[newEndIndex], oldElements[oldStartIndex]!, forRender)
				)
				newEndIndex--
				oldStartIndex++
			}
			//其他情况，判断是移动还是新增
			else {
				//在旧数组里查找新元素同key元素
				let idxInOld = oldElements.findIndex(el => el && el.key === newElements[newStartIndex].key)
				//存在同key元素
				if (idxInOld >= 0) {
					result.push(
						{
							type: 'move',
							newElement: newElements[newStartIndex],
							oldElement: oldElements[idxInOld]
						},
						...patchElement(newElements[newStartIndex], oldElements[idxInOld]!, forRender)
					)
					//此时将元素置为undefined表示元素已处理过
					oldElements[idxInOld] = undefined
				} else {
					result.push({
						type: 'insert',
						newElement: newElements[newStartIndex]
					})
				}
				newStartIndex++
			}

			//旧指针遍历结束
			if (oldStartIndex > oldEndIndex) {
				//新指针还没结束，则剩下的都是新插入的元素，进行处理
				for (; newStartIndex <= newEndIndex; newStartIndex++) {
					result.push({
						type: 'insert',
						newElement: newElements[newStartIndex]
					})
				}
			}
			//新指针遍历结束
			else if (newStartIndex > newEndIndex) {
				//旧指针还没结束，则是需要移除的，进行处理
				for (; oldStartIndex <= oldEndIndex; oldStartIndex++) {
					if (oldElements[oldStartIndex]) {
						result.push({
							type: 'remove',
							oldElement: oldElements[oldStartIndex]
						})
					}
				}
			}
		}
	} else if (newElements.length) {
		result = newElements.map(el => {
			return {
				type: 'insert',
				newElement: el
			}
		})
	} else if (oldElements.length) {
		result = oldElements.map(el => {
			return {
				type: 'remove',
				oldElement: el
			}
		})
	}
	return result
}

/**
 * 对key相同的元素进行比对
 * @param newElement
 * @param oldElement
 * @param forRender 是否为了渲染dom
 * @returns
 */
export const patchElement = (newElement: AlexElement, oldElement: AlexElement, forRender: boolean): patchResultType[] => {
	//比对结果集
	const result: patchResultType[] = []
	//如果是为了dom渲染不可能存在空元素
	if (!forRender && (newElement.isEmpty() || oldElement.isEmpty())) {
		result.push({
			type: 'empty',
			oldElement: oldElement,
			newElement: newElement
		})
	}
	//type、locked变化只是影响格式化
	else if (!forRender && (newElement.type != oldElement.type || newElement.locked != oldElement.locked)) {
		result.push({
			type: 'replace',
			oldElement: oldElement,
			newElement: newElement
		})
	}
	//namespace的变化只是影响dom渲染
	else if (forRender && newElement.namespace != oldElement.namespace) {
		result.push({
			type: 'replace',
			oldElement: oldElement,
			newElement: newElement
		})
	}
	//非文本元素parsedom的变化
	else if (!newElement.isText() && newElement.parsedom != oldElement.parsedom) {
		result.push({
			type: 'replace',
			oldElement: oldElement,
			newElement: newElement
		})
	}
	//内部块元素的behavior的变化只影响格式化
	else if (!forRender && newElement.isInblock() && newElement.behavior != oldElement.behavior) {
		result.push({
			type: 'replace',
			oldElement: oldElement,
			newElement: newElement
		})
	}
	//新元素有子元素而旧元素无子元素
	else if (newElement.hasChildren() && !oldElement.hasChildren()) {
		result.push({
			type: 'replace',
			oldElement: oldElement,
			newElement: newElement
		})
	}
	//旧元素有子元素而新元素无子元素
	else if (oldElement.hasChildren() && !newElement.hasChildren()) {
		result.push({
			type: 'replace',
			oldElement: oldElement,
			newElement: newElement
		})
	}
	//以下是更新元素的情况
	else {
		//文本元素的textContent有变化
		if (newElement.isText() && newElement.textContent != oldElement.textContent) {
			result.push({
				type: 'update',
				oldElement: oldElement,
				newElement: newElement,
				update: 'textContent'
			})
		}
		//元素的styles有变化
		if (!newElement.isEqualStyles(oldElement)) {
			result.push({
				type: 'update',
				oldElement: oldElement,
				newElement: newElement,
				update: 'styles'
			})
		}
		//元素的marks有变化
		if (!newElement.isEqualMarks(oldElement)) {
			result.push({
				type: 'update',
				oldElement: oldElement,
				newElement: newElement,
				update: 'marks'
			})
		}
		//子元素
		if (newElement.hasChildren() && oldElement.hasChildren()) {
			result.push(...patch(newElement.children!, oldElement.children!, forRender))
		}
	}

	return result
}

/**
 * 获取不同的styles
 * @param newElement
 * @param oldElement
 * @returns
 */
export const getDifferentStyles = (newElement: AlexElement, oldElement: AlexElement) => {
	const setStyles: ObjectType = {}
	const removeStyles: ObjectType = {}
	if (newElement.hasStyles()) {
		Object.keys(newElement.styles!).forEach(key => {
			if (oldElement.hasStyles() && oldElement.styles!.hasOwnProperty(key) && oldElement.styles![key] === newElement.styles![key]) {
				return
			}
			setStyles[key] = newElement.styles![key]
		})
	}
	if (oldElement.hasStyles()) {
		Object.keys(oldElement.styles!).forEach(key => {
			if (newElement.hasStyles() && newElement.styles!.hasOwnProperty(key)) {
				return
			}
			removeStyles[key] = oldElement.styles![key]
		})
	}
	return { setStyles, removeStyles }
}

/**
 * 获取不同的marks
 * @param newElement
 * @param oldElement
 * @returns
 */
export const getDifferentMarks = (newElement: AlexElement, oldElement: AlexElement) => {
	const setMarks: ObjectType = {}
	const removeMarks: ObjectType = {}
	if (newElement.hasMarks()) {
		Object.keys(newElement.marks!).forEach(key => {
			if (oldElement.hasMarks() && oldElement.marks!.hasOwnProperty(key) && oldElement.marks![key] === newElement.marks![key]) {
				return
			}
			setMarks[key] = newElement.marks![key]
		})
	}
	if (oldElement.hasMarks()) {
		Object.keys(oldElement.marks!).forEach(key => {
			if (newElement.hasMarks() && newElement.marks!.hasOwnProperty(key)) {
				return
			}
			removeMarks[key] = oldElement.marks![key]
		})
	}
	return { setMarks, removeMarks }
}
