import Dap from 'dap-util'
//是否mac系统
const { Mac } = Dap.platform.os()

/**
 * 键盘是否执行撤销操作
 */
export const isUndo = function (e) {
	if (Mac) {
		return e.keyCode == 90 && e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
	}
	return e.keyCode == 90 && e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
}

/**
 * 键盘是否执行重做操作
 */
export const isRedo = function (e) {
	if (Mac) {
		return e.keyCode == 90 && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey
	}
	return e.keyCode == 89 && e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
}
