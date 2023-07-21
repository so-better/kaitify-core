import Dap from 'dap-util'
//是否mac系统
const { Mac } = Dap.platform.os()
export default {
	//撤销
	Undo(e) {
		if (Mac) {
			return e.keyCode == 90 && e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
		}
		return e.keyCode == 90 && e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
	},
	//重做
	Redo(e) {
		if (Mac) {
			return e.keyCode == 90 && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey
		}
		return e.keyCode == 89 && e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
	},
	//增加缩进
	Indent(e) {
		return e.keyCode == 9 && !e.metaKey && !e.shiftKey && !e.ctrlKey && !e.altKey
	},
	//减少缩进
	Outdent(e) {
		return e.keyCode == 9 && !e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey
	}
}
