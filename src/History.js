import AlexElement from './Element'
import AlexPoint from './Point'
import AlexRange from './Range'
import Util from './Util'

class AlexHistory {
	constructor() {
		//存放历史记录的堆栈
		this.records = []
		//记录当前展示的stack的序列
		this.current = -1
	}

	//入栈
	push(stack, range) {
		//如果不是最后一个说明执行过撤销操作，并且没有入栈过，此时需要把后面的给删除掉
		if (this.current < this.records.length - 1) {
			this.records.length = this.current + 1
		}
		//生成一个新的stack
		const newStack = stack.map(ele => {
			return this._cloneElement(ele)
		})
		//查找新stack中anchor对应的元素
		const anchorElement = AlexElement.flatElements(newStack).find(ele => {
			return ele.key == range.anchor.element.key
		})
		//查找新stack中focus对应的元素
		const focusElement = AlexElement.flatElements(newStack).find(ele => {
			return ele.key == range.focus.element.key
		})
		//创建新的anchor
		const anchor = new AlexPoint(anchorElement, range.anchor.offset)
		//创建新的focus
		const focus = new AlexPoint(focusElement, range.focus.offset)
		//创建新的range
		const newRange = new AlexRange(anchor, focus)
		//推入栈中
		this.records.push({
			stack: newStack,
			range: newRange
		})
		this.current += 1
	}

	//撤销
	get(type) {
		//撤销
		if (type == -1) {
			//已经是第一个了，无法再撤销
			if (this.current <= 0) {
				return null
			}
			//回退1
			this.current -= 1
		}
		//重做
		else if (type == 1) {
			//如果是最后一个了，无法重做
			if (this.current >= this.records.length - 1) {
				return null
			}
			//前进1
			this.current += 1
		}
		//获取栈中的stack和range
		const { stack, range } = this.records[this.current]
		//创建新的stack
		const newStack = stack.map(ele => {
			return this._cloneElement(ele)
		})
		//查找新stack中anchor对应的元素
		const anchorElement = AlexElement.flatElements(newStack).find(ele => {
			return ele.key == range.anchor.element.key
		})
		//查找新stack中focus对应的元素
		const focusElement = AlexElement.flatElements(newStack).find(ele => {
			return ele.key == range.focus.element.key
		})
		//创建新的anchor
		const anchor = new AlexPoint(anchorElement, range.anchor.offset)
		//创建新的focus
		const focus = new AlexPoint(focusElement, range.focus.offset)
		//创建新的range
		const newRange = new AlexRange(anchor, focus)
		//返回给编辑器
		return {
			stack: newStack,
			range: newRange
		}
	}

	//复制元素，包括key也复制
	_cloneElement(element) {
		const el = new AlexElement(element.type, element.parsedom, Util.clone(element.marks), Util.clone(element.styles), element.textContent)
		el.key = element.key
		if (element.hasChildren()) {
			element.children.forEach(child => {
				let clonedChild = this._cloneElement(child)
				if (el.hasChildren()) {
					el.children.push(clonedChild)
				} else {
					el.children = [clonedChild]
				}
				clonedChild.parent = el
			})
		}
		return el
	}
}

export default AlexHistory
