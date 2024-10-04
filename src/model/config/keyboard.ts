import { platform } from 'dap-util'

/**
 * 键盘是否执行撤销操作
 */
export const isUndo = function (e: KeyboardEvent) {
	const { Mac } = platform.os()
	if (Mac) {
		return e.key.toLocaleLowerCase() == 'z' && e.metaKey && !e.shiftKey && !e.altKey && !e.ctrlKey
	}
	return e.key.toLocaleLowerCase() == 'z' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey
}

/**
 * 键盘是否执行重做操作
 */
export const isRedo = function (e: KeyboardEvent) {
	const { Mac } = platform.os()
	if (Mac) {
		return e.key.toLocaleLowerCase() == 'z' && e.metaKey && e.shiftKey && !e.altKey && !e.ctrlKey
	}
	return e.key.toLocaleLowerCase() == 'y' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey
}

/**
 * 键盘是否执行增加缩进操作
 */
export const isIncreaseIndent = function (e: KeyboardEvent) {
	return e.key.toLocaleLowerCase() == 'tab' && !e.metaKey && !e.shiftKey && !e.altKey && !e.ctrlKey
}

/**
 * 键盘是否执行减少缩进操作
 */
export const isDecreaseIndent = function (e: KeyboardEvent) {
	return e.key.toLocaleLowerCase() == 'tab' && !e.metaKey && e.shiftKey && !e.altKey && !e.ctrlKey
}
