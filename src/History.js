import AlexElement from './Element'
import AlexPoint from './Point'
import AlexRange from './Range'

class AlexHistory {
	constructor() {
		//存放历史记录的堆栈
		this.records = []
		//记录当前展示的stack的序列
		this.current = -1
	}

	/**
	 * 入栈
	 */
	push(stack, range) {
		//如果不是最后一个说明执行过撤销操作，并且没有入栈过，此时需要把后面的给删除掉
		if (this.current < this.records.length - 1) {
			this.records.length = this.current + 1
		}
		//生成一个新的stack
		const newStack = stack.map(ele => {
			return ele.__fullClone()
		})
		//生成一个新的range
		const newRange = this.__cloneRange(newStack, range)
		//推入栈中
		this.records.push({
			stack: newStack,
			range: newRange
		})
		this.current += 1
	}

	/**
	 * 获取
	 */
	get(type) {
		let current = this.current
		//撤销
		if (type == -1) {
			//已经是第一个了，无法再撤销
			if (current <= 0) {
				return null
			}
			//回退1
			current -= 1
		}
		//重做
		else if (type == 1) {
			//如果是最后一个了，无法重做
			if (current >= this.records.length - 1) {
				return null
			}
			//前进1
			current += 1
		}
		//获取栈中的stack和range
		const { stack, range } = this.records[current]
		//创建新的stack
		const newStack = stack.map(ele => {
			return ele.__fullClone()
		})
		//创建新的range
		const newRange = this.__cloneRange(newStack, range)
		//返回给编辑器
		return {
			current: current,
			stack: newStack,
			range: newRange
		}
	}

	/**
	 * 更新当前历史记录的range
	 */
	updateCurrentRange(range) {
		const records = this.records[this.current]
		const newRange = this.__cloneRange(records.stack, range)
		this.records[this.current].range = newRange
	}

	/**
	 * 克隆range
	 */
	__cloneRange(newStack, range) {
		//如果range存在
		if (range) {
			//查找新stack中anchor对应的元素
			const anchorElement = AlexElement.flatElements(newStack).find(ele => {
				return ele.key == range.anchor.element.key
			})
			//查找新stack中focus对应的元素
			const focusElement = AlexElement.flatElements(newStack).find(ele => {
				return ele.key == range.focus.element.key
			})
			if (anchorElement && focusElement) {
				//创建新的anchor
				const anchor = new AlexPoint(anchorElement, range.anchor.offset)
				//创建新的focus
				const focus = new AlexPoint(focusElement, range.focus.offset)
				//创建新的range
				return new AlexRange(anchor, focus)
			}
		}
		return null
	}
}

export default AlexHistory
