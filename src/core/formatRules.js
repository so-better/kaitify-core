import AlexElement from '../Element'
import { cloneData } from './tool'

/**
 * 将子元素中的根级块元素转为内部块元素或者行内元素（根级块元素只能在stack下）
 */
export const handleNotStackBlock = function (element) {
	if (element.hasChildren()) {
		//子元素数组中过滤掉空元素
		const children = element.children.filter(el => {
			return !el.isEmpty()
		})
		//获取子元素中的根级块元素
		const blocks = children.filter(el => {
			return el.isBlock()
		})
		//对子元素中的根级块元素进行转换
		blocks.forEach(el => {
			//如果元素自身是inline，那么子元素转为inline，否则转为内部块元素
			el.type = element.type == 'inline' ? 'inline' : 'inblock'
		})
	}
}

/**
 * 内部块元素与其他元素不能同时存在于父元素的子元素数组中
 */
export const handleInblockWithOther = function (element) {
	if (element.hasChildren()) {
		//子元素数组中过滤掉空元素
		const children = element.children.filter(el => {
			return !el.isEmpty()
		})
		//是否全部都是内部块元素
		let allIsBlock = children.every(el => {
			return el.isInblock()
		})
		//不全部是内部块元素，则内部块元素转为行内元素
		if (!allIsBlock) {
			children.forEach(el => {
				if (el.isInblock()) {
					el.type = 'inline'
				}
			})
		}
	}
}

/**
 * 行内元素的子元素不能是内部块元素
 */
export const handleInlineChildrenNotInblock = function (element) {
	//如果行内元素有子元素
	if (element.isInline() && element.hasChildren()) {
		//子元素数组中过滤掉空元素
		const children = element.children.filter(el => {
			return !el.isEmpty()
		})
		//子元素中的内部块元素
		const inblocks = children.filter(el => {
			return el.isInblock()
		})
		//对子元素中的内部块元素进行转换为行内元素
		inblocks.forEach(el => {
			if (el.isInblock()) {
				el.type = 'inline'
			}
		})
	}
}

/**
 * 换行符清除规则（虚拟光标可能更新）
 */
export const breakFormat = function (element) {
	if (element.hasChildren()) {
		//子元素数组中过滤掉空元素
		const children = element.children.filter(el => {
			return !el.isEmpty()
		})
		//是否全是换行符
		const allIsBreak = children.every(el => {
			return el.isBreak()
		})
		//如果全是换行符则只保留第一个
		if (allIsBreak && children.length) {
			//第一个换行符
			const breakEl = children[0]
			//如果起点在该元素里，则移动到第一个换行符上
			if (this.range && element.isContains(this.range.anchor.element)) {
				this.range.anchor.moveToStart(breakEl)
			}
			//如果终点在该元素里，则移动到第一个换行符上
			if (this.range && element.isContains(this.range.focus.element)) {
				this.range.focus.moveToStart(breakEl)
			}
			element.children = [breakEl]
		}
		//既有换行符也有其他元素则把换行符元素都置为空元素
		else {
			element.children.forEach(el => {
				if (el.isBreak()) {
					el.toEmpty()
				}
			})
		}
	}
}

/**
 * 兄弟元素合并策略（虚拟光标可能更新）
 */
export const mergeWithBrotherElement = function (element) {
	//判断两个元素是否可以合并
	const canMerge = (pel, nel) => {
		if (pel.isEmpty() || nel.isEmpty()) {
			return true
		}
		if (pel.isText() && nel.isText()) {
			return pel.isEqualStyles(nel) && pel.isEqualMarks(nel)
		}
		if (pel.isInline() && nel.isInline()) {
			return pel.parsedom == nel.parsedom && pel.isEqualMarks(nel) && pel.isEqualStyles(nel)
		}
		return false
	}
	//两个元素的合并方法
	const merge = (pel, nel) => {
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
				const index = nel.parent.children.findIndex(item => {
					return nel.isEqual(item)
				})
				nel.parent.children.splice(index, 1)
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
				const index = pel.parent.children.findIndex(item => {
					return pel.isEqual(item)
				})
				pel.parent.children.splice(index, 1)
			}
		}
		//文本元素合并
		else if (pel.isText()) {
			//起点在后一个元素上，则将起点设置到前一个元素上
			if (this.range && nel.isEqual(this.range.anchor.element)) {
				this.range.anchor.element = pel
				this.range.anchor.offset = pel.textContent.length + this.range.anchor.offset
			}
			//终点在后一个元素上，则将终点设置到前一个元素上
			if (this.range && nel.isEqual(this.range.focus.element)) {
				this.range.focus.element = pel
				this.range.focus.offset = pel.textContent.length + this.range.focus.offset
			}
			//将后一个元素的内容给前一个元素
			pel.textContent += nel.textContent
			//删除被合并的元素
			const index = nel.parent.children.findIndex(item => {
				return nel.isEqual(item)
			})
			nel.parent.children.splice(index, 1)
		}
		//行内元素合并
		else if (pel.isInline()) {
			pel.children.push(...nel.children)
			pel.children.forEach(item => {
				item.parent = pel
			})
			//继续对子元素执行合并
			mergeElement(pel)
			//删除被合并的元素
			const index = nel.parent.children.findIndex(item => {
				return nel.isEqual(item)
			})
			nel.parent.children.splice(index, 1)
		}
	}
	//元素合并操作
	const mergeElement = ele => {
		//存在子元素并且子元素数量大于1
		if (ele.hasChildren() && ele.children.length > 1) {
			let index = 0
			while (index <= ele.children.length - 2) {
				if (canMerge(ele.children[index], ele.children[index + 1])) {
					merge(ele.children[index], ele.children[index + 1])
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
 */
export const mergeWithParentElement = function (element) {
	//判断两个元素是否可以合并
	const canMerge = (parent, child) => {
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
	const merge = (parent, child) => {
		//子元素是文本元素，父元素与之标签名相同
		if (child.isText()) {
			parent.type = 'text'
			parent.parsedom = null
			//如果子元素有标记
			if (child.hasMarks()) {
				if (parent.hasMarks()) {
					Object.assign(parent.marks, cloneData(child.marks))
				} else {
					parent.marks = cloneData(child.marks)
				}
			}
			//如果子元素有样式
			if (child.hasStyles()) {
				if (parent.hasStyles()) {
					Object.assign(parent.styles, cloneData(child.styles))
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
					Object.assign(parent.marks, cloneData(child.marks))
				} else {
					parent.marks = cloneData(child.marks)
				}
			}
			//如果子元素有样式
			if (child.hasStyles()) {
				if (parent.hasStyles()) {
					Object.assign(parent.styles, cloneData(child.styles))
				} else {
					parent.styles = cloneData(child.styles)
				}
			}
			if (child.hasChildren()) {
				parent.children = [...child.children]
				parent.children.forEach(item => {
					item.parent = parent
				})
			}
		}
	}
	//存在子元素并且子元素只有一个且父子元素可以合并
	if (element.hasChildren() && element.children.length == 1 && canMerge(element, element.children[0])) {
		merge(element, element.children[0])
	}
}
