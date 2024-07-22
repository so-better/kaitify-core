import { AlexElement } from './Element'
import { AlexPoint } from './Point'
import { AlexRange } from './Range'
import { getElementByKey } from './core/tool'

/**
 * 历史记录数据类型
 */
export type AlexHistoryRecordType = {
	stack: AlexElement[]
	range: AlexRange | null
}

export class AlexHistory {
	/**
	 * 存放历史记录的堆栈
	 */
	private records: AlexHistoryRecordType[] = []
	/**
	 * 存放撤销记录的堆栈
	 */
	private redoRecords: AlexHistoryRecordType[] = []

	/**
	 * 克隆range
	 * @param newStack
	 * @param range
	 * @returns
	 */
	private cloneRange(newStack: AlexElement[], range: AlexRange | null) {
		//如果range存在
		if (range) {
			//查找新stack中anchor对应的元素
			const anchorElement = getElementByKey(range.anchor.element.key, newStack)
			//查找新stack中focus对应的元素
			const focusElement = getElementByKey(range.focus.element.key, newStack)
			//如果都存在
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

	/**
	 * 保存新的记录
	 * @param stack
	 * @param range
	 */
	setState(stack: AlexElement[], range: AlexRange | null) {
		const newStack = stack.map(el => el.__fullClone())
		const newRange = this.cloneRange(newStack, range)
		this.records.push({
			stack: stack.map(el => el.__fullClone()),
			range: newRange
		})
		//每次保存新状态时清空重做堆栈
		this.redoRecords = []
	}

	/**
	 * 撤销操作：返回上一个历史记录
	 */
	undo(): AlexHistoryRecordType | null {
		//存在的历史记录大于1则表示可以进行撤销操作
		if (this.records.length > 1) {
			//取出最近的历史记录
			const record = this.records.pop()!
			//将这个历史记录加入到撤销记录数组中
			this.redoRecords.push(record)
			//再次获取历史记录数组中的最近的一个
			const lastRecord = this.records[this.records.length - 1]
			const newStack = lastRecord.stack.map(el => el.__fullClone())
			const newRange = this.cloneRange(newStack, lastRecord.range)
			return {
				stack: newStack,
				range: newRange
			}
		}
		//没有历史记录则返回null
		return null
	}

	/**
	 * 重做操作：返回下一个历史记录
	 */
	redo(): AlexHistoryRecordType | null {
		//如果存在撤销记录
		if (this.redoRecords.length > 0) {
			//取出最近的一个撤销记录
			const record = this.redoRecords.pop()!
			//将撤销记录加入历史记录中
			this.records.push(record)
			//返回取出的这个撤销记录，即最近的一个历史记录
			const newStack = record.stack.map(el => el.__fullClone())
			const newRange = this.cloneRange(newStack, record.range)
			return {
				stack: newStack,
				range: newRange
			}
		}
		return null
	}

	/**
	 * 更新光标
	 * @param range
	 */
	updateRange(range: AlexRange) {
		const record = this.records[this.records.length - 1]
		const newRange = this.cloneRange(record.stack, range)
		this.records[this.records.length - 1].range = newRange
	}
}
