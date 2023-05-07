class AlexHistory {
	constructor() {
		//存放历史记录的堆栈
		this.stacks = []
		//记录当前展示的stack的序列
		this.index = -1
	}

	//入栈
	push(stack) {
		//如果不是最后一个说明执行过撤销操作，并且没有入栈过，此时需要把后面的给删除掉
		if (this.index < this.stacks.length - 1) {
			this.stacks.length = this.index + 1
		}
		this.stacks.push(stack)
		this.index += 1
		console.log(this.stacks)
	}

	//撤销
	get(type) {
		//撤销
		if (type == -1) {
			//已经是第一个了，无法再撤销
			if (this.index <= 0) {
				return null
			}
			//回退1
			this.index -= 1
		}
		//重做
		else if (type == 1) {
			//如果是最后一个了，无法重做
			if (this.index >= this.stacks.length - 1) {
				return null
			}
			//前进1
			this.index += 1
		}
		return this.stacks[this.index]
	}
}

export default AlexHistory
