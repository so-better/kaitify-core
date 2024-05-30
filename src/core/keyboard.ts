import { platform } from 'dap-util'
//是否mac系统
const { Mac } = platform.os()

/**
 * 键盘是否执行撤销操作
 * @param e
 * @returns
 */
export const isUndo = function (e: KeyboardEvent) {
	if (Mac) {
		return e.key == 'z' && e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
	}
	return e.key == 'z' && e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
}

/**
 * 键盘是否执行重做操作
 * @param e
 * @returns
 */
export const isRedo = function (e: KeyboardEvent) {
	if (Mac) {
		return e.key == 'z' && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey
	}
	return e.key == 'z' && e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
}
