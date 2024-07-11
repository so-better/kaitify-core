import { AlexEditor } from '../Editor'
import { AlexElement } from '../Element'
import { cloneData, isSpaceText } from './tool'
import { string as DapString } from 'dap-util'

/**
 * 将子元素中的根级块元素转为内部块元素或者行内元素（根级块元素只能在stack下）
 * @param this
 * @param element
 */
export const handleNotStackBlock = function (this: AlexEditor, element: AlexElement) {
	if (element.hasChildren()) {
		//获取子元素中的根级块元素
		const blocks: AlexElement[] = element.children!.filter(el => {
			return !el.isEmpty() && el.isBlock()
		})
		//对子元素中的根级块元素进行转换
		blocks.forEach(el => {
			//如果元素自身是inline，那么子元素转为inline，否则转为内部块元素
			el.type = element.type == 'inline' ? 'inline' : 'inblock'
			//对于根级块转为内部块的元素，设置行为值为'block'
			if (el.type == 'inblock') {
				el.behavior = 'block'
			}
		})
	}
}

/**
 * 内部块元素与其他元素不能同时存在于父元素的子元素数组中
 * @param this
 * @param element
 */
export const handleInblockWithOther = function (this: AlexEditor, element: AlexElement) {
	if (element.hasChildren()) {
		//子元素数组中非空元素
		const children = element.children!.filter(el => {
			return !el.isEmpty()
		})
		//子元素中的内部块元素
		const inblocks = children.filter(el => {
			return el.isInblock()
		})
		//子元素中存在内部块元素但不全部是内部块元素，则内部块元素转为行内元素
		if (inblocks.length && inblocks.length != children.length) {
			inblocks.forEach(el => {
				el.type = 'inline'
			})
		}
	}
}

/**
 * 行内元素的子元素不能是内部块元素
 * @param this
 * @param element
 */
export const handleInlineChildrenNotInblock = function (this: AlexEditor, element: AlexElement) {
	//如果行内元素有子元素
	if (element.isInline() && element.hasChildren()) {
		//元素中的内部块元素
		const inblocks = element.children!.filter(el => {
			return !el.isEmpty() && el.isInblock()
		})
		//对子元素中的内部块元素进行转换为行内元素
		inblocks.forEach(el => {
			el.type = 'inline'
		})
	}
}

/**
 * 换行符清除规则（虚拟光标可能更新）
 * @param this
 * @param element
 */
export const breakFormat = function (this: AlexEditor, element: AlexElement) {
	//如果元素有子元素
	if (element.hasChildren()) {
		//子元素数组中过滤掉空元素
		const children = element.children!.filter(el => {
			return !el.isEmpty()
		})
		//子元素数组中的换行符元素
		const breaks = children.filter(el => {
			return el.isBreak()
		})
		//如果子元素数量大于1并且都是换行符，则只保留第一个
		if (children.length > 1 && breaks.length == children.length) {
			//如果起点在该元素里，则移动到第一个换行符上
			if (this.range && element.isContains(this.range.anchor.element)) {
				this.range.anchor.moveToStart(breaks[0])
			}
			//如果终点在该元素里，则移动到第一个换行符上
			if (this.range && element.isContains(this.range.focus.element)) {
				this.range.focus.moveToStart(breaks[0])
			}
			element.children = [breaks[0]]
		}
		//子元素数量大于1并且有换行符也有其他元素则把换行符元素都置为空元素
		else if (children.length > 1 && breaks.length) {
			breaks.forEach(el => {
				el.toEmpty()
			})
		}
	}
}

/**
 * 兄弟元素合并策略（虚拟光标可能更新）
 * @param this
 * @param element
 */
export const mergeWithBrotherElement = function (this: AlexEditor, element: AlexElement) {
	//判断两个元素是否可以合并
	const canMerge = (pel: AlexElement, nel: AlexElement) => {
		//如果元素锁住，则无法进行合并
		if (pel.locked || nel.locked) {
			return false
		}
		//都是空元素，可以合并
		if (pel.isEmpty() || nel.isEmpty()) {
			return true
		}
		//都是文本元素的话如果样式和标记相同则可以合并
		if (pel.isText() && nel.isText()) {
			return pel.isEqualStyles(nel) && pel.isEqualMarks(nel)
		}
		//都是行内元素的话，如果标签相同，并且样式和标记相同则可以合并
		if (pel.isInline() && nel.isInline()) {
			return pel.parsedom == nel.parsedom && pel.isEqualMarks(nel) && pel.isEqualStyles(nel)
		}
		return false
	}
	//两个元素的合并方法
	const merge = (pel: AlexElement, nel: AlexElement) => {
		//存在空元素
		if (pel.isEmpty() || nel.isEmpty()) {
			//后一个元素是空元素
			if (nel.isEmpty()) {
				//起点在后一个元素上，则直接将起点设置到前一个元素上
				if (this.range && nel.isContains(this.range.anchor.element)) {
					if (pel.isEmpty()) {
						this.range.anchor.element = pel
						this.range.anchor.offset = 0
					} else {
						this.range.anchor.moveToEnd(pel)
					}
				}
				//终点在后一个元素上，则直接将终点设置到前一个元素上
				if (this.range && nel.isContains(this.range.focus.element)) {
					if (pel.isEmpty()) {
						this.range.focus.element = pel
						this.range.focus.offset = 0
					} else {
						this.range.focus.moveToEnd(pel)
					}
				}
				//删除被合并的元素
				const index = nel.parent!.children!.findIndex(item => {
					return nel.isEqual(item)
				})
				nel.parent!.children!.splice(index, 1)
			}
			//前一个元素是空元素
			else if (pel.isEmpty()) {
				//起点在前一个元素上，则直接将起点设置到后一个元素上
				if (this.range && pel.isContains(this.range.anchor.element)) {
					if (nel.isEmpty()) {
						this.range.anchor.element = nel
						this.range.anchor.offset = 0
					} else {
						this.range.anchor.moveToStart(nel)
					}
				}
				//终点在前一个元素上，则直接将终点设置到后一个元素上
				if (this.range && pel.isContains(this.range.focus.element)) {
					if (nel.isEmpty()) {
						this.range.focus.element = nel
						this.range.focus.offset = 0
					} else {
						this.range.focus.moveToStart(nel)
					}
				}
				//删除被合并的元素
				const index = pel.parent!.children!.findIndex(item => {
					return pel.isEqual(item)
				})
				pel.parent!.children!.splice(index, 1)
			}
		}
		//文本元素合并
		else if (pel.isText()) {
			//起点在后一个元素上，则将起点设置到前一个元素上
			if (this.range && nel.isEqual(this.range.anchor.element)) {
				this.range.anchor.element = pel
				this.range.anchor.offset = pel.textContent!.length + this.range.anchor.offset
			}
			//终点在后一个元素上，则将终点设置到前一个元素上
			if (this.range && nel.isEqual(this.range.focus.element)) {
				this.range.focus.element = pel
				this.range.focus.offset = pel.textContent!.length + this.range.focus.offset
			}
			//将后一个元素的内容给前一个元素
			pel.textContent! += nel.textContent!
			//删除被合并的元素
			const index = nel.parent!.children!.findIndex(item => {
				return nel.isEqual(item)
			})
			nel.parent!.children!.splice(index, 1)
		}
		//行内元素合并
		else if (pel.isInline()) {
			pel.children!.push(...nel.children!)
			pel.children!.forEach(item => {
				item.parent = pel
			})
			//继续对子元素执行合并
			mergeElement(pel)
			//删除被合并的元素
			const index = nel.parent!.children!.findIndex(item => {
				return nel.isEqual(item)
			})
			nel.parent!.children!.splice(index, 1)
		}
	}
	//元素合并操作
	const mergeElement = (ele: AlexElement) => {
		//存在子元素并且子元素数量大于1
		if (ele.hasChildren() && ele.children!.length > 1) {
			let index = 0
			while (index <= ele.children!.length - 2) {
				if (canMerge(ele.children![index]!, ele.children![index + 1]!)) {
					merge(ele.children![index]!, ele.children![index + 1]!)
					continue
				}
				index++
			}
		}
	}
	mergeElement(element)
}

/**
 * 父子元素合并策略（虚拟光标可能更新）
 * @param this
 * @param element
 */
export const mergeWithParentElement = function (this: AlexEditor, element: AlexElement) {
	//判断两个元素是否可以合并
	const canMerge = (parent: AlexElement, child: AlexElement) => {
		//父元素或者子元素锁住则无法合并
		if (parent.locked || child.locked) {
			return false
		}
		//子元素是文本元素，父元素是标签等于文本标签的行内元素
		if (child.isText() && parent.isInline()) {
			return parent.parsedom == AlexElement.TEXT_NODE
		}
		//子元素和父元素的类型相同且标签名相同
		if ((parent.isInline() && child.isInline()) || (parent.isInblock() && child.isInblock())) {
			return parent.parsedom == child.parsedom
		}
		return false
	}
	//两个元素的合并方法
	const merge = (parent: AlexElement, child: AlexElement) => {
		//子元素是文本元素，父元素与之标签名相同
		if (child.isText()) {
			parent.type = 'text'
			parent.parsedom = null
			//如果子元素有标记
			if (child.hasMarks()) {
				if (parent.hasMarks()) {
					Object.assign(parent.marks!, cloneData(child.marks))
				} else {
					parent.marks = cloneData(child.marks)
				}
			}
			//如果子元素有样式
			if (child.hasStyles()) {
				if (parent.hasStyles()) {
					Object.assign(parent.styles!, cloneData(child.styles))
				} else {
					parent.styles = cloneData(child.styles)
				}
			}
			parent.textContent = child.textContent
			parent.children = null
			//如果起点在子元素上则更新到父元素上
			if (this.range && child.isContains(this.range.anchor.element)) {
				this.range.anchor.element = parent
			}
			//如果终点在子元素上则更新到父元素上
			if (this.range && child.isContains(this.range.focus.element)) {
				this.range.focus.element = parent
			}
		}
		//子元素是行内元素或者内部块元素
		else {
			//如果子元素有标记
			if (child.hasMarks()) {
				if (parent.hasMarks()) {
					Object.assign(parent.marks!, cloneData(child.marks))
				} else {
					parent.marks = cloneData(child.marks)
				}
			}
			//如果子元素有样式
			if (child.hasStyles()) {
				if (parent.hasStyles()) {
					Object.assign(parent.styles!, cloneData(child.styles))
				} else {
					parent.styles = cloneData(child.styles)
				}
			}
			//如果子元素也有子元素
			if (child.hasChildren()) {
				parent.children = [...child.children!]
				parent.children.forEach(item => {
					item.parent = parent
				})
			}
			//子元素与父元素合并和再对父元素进行处理
			mergeElement(parent)
		}
	}
	const mergeElement = (ele: AlexElement) => {
		//存在子元素并且子元素只有一个且父子元素可以合并
		if (ele.hasChildren() && ele.children!.length == 1 && ele.children![0] && canMerge(ele, ele.children![0])) {
			merge(ele, ele.children![0])
		}
	}
	mergeElement(element)
}

/**
 * 将文本元素内的空白元素合一
 * @param this
 * @param element
 */
export const mergeWithSpaceTextElement = function (this: AlexEditor, element: AlexElement) {
	//如果是非空的文本元素并且文本中有空白字符的
	if (element.isText() && !element.isEmpty() && element.textContent!.split('').some(item => isSpaceText(item))) {
		let val = element.textContent!
		let i = 0
		while (i < val.length) {
			//获取当前字符串
			const chart = val.charAt(i)
			//如果当前字符是空白字符并且前一个字符也是空白字符
			if (isSpaceText(chart) && i > 0 && isSpaceText(val.charAt(i - 1))) {
				//如果起点在元素上并且起点在当前这个空白字符上
				if (this.range && this.range.anchor.element.isEqual(element) && this.range.anchor.offset >= i + 1) {
					this.range.anchor.offset -= 1
				}
				//如果终点在元素上并且终点在当前这个空白字符上
				if (this.range && this.range.focus.element.isEqual(element) && this.range.focus.offset >= i + 1) {
					this.range.focus.offset -= 1
				}
				//删除空白字符
				val = DapString.delete(val, i, 1)
			} else {
				i++
			}
		}
		element.textContent = val
	}
}
