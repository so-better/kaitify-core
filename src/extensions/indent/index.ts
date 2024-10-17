import { KNodeStylesType } from '@/model'
import { getSelectionBlockNodes } from '@/model/config/function'
import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		setIncreaseIndent?: () => Promise<void>
		setDecreaseIndent?: () => Promise<void>
	}
}

/**
 * 键盘是否执行增加缩进操作
 */
const isIncreaseIndent = function (e: KeyboardEvent) {
	return e.key.toLocaleLowerCase() == 'tab' && !e.metaKey && !e.shiftKey && !e.altKey && !e.ctrlKey
}

/**
 * 键盘是否执行减少缩进操作
 */
const isDecreaseIndent = function (e: KeyboardEvent) {
	return e.key.toLocaleLowerCase() == 'tab' && !e.metaKey && e.shiftKey && !e.altKey && !e.ctrlKey
}

export const IndentExtension = Extension.create({
	name: 'indent',
	pasteKeepStyles(node) {
		const styles: KNodeStylesType = {}
		if (node.isBlock() && node.hasStyles()) {
			if (node.styles!.hasOwnProperty('textIndent')) styles.textIndent = node.styles!.textIndent
		}
		return styles
	},
	onKeydown(event) {
		//增加缩进
		if (isIncreaseIndent(event)) {
			event.preventDefault()
			this.commands.setIncreaseIndent?.()
		}
		//减少缩进
		else if (isDecreaseIndent(event)) {
			event.preventDefault()
			this.commands.setDecreaseIndent?.()
		}
	},
	addCommands() {
		/**
		 * 增加缩进
		 */
		const setIncreaseIndent = async () => {
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const blockNode = this.selection.start!.node.getBlock()
				const styles: KNodeStylesType = blockNode.hasStyles() ? blockNode.styles! : {}
				let oldVal = 0
				if (styles.textIndent && typeof styles.textIndent == 'string' && styles.textIndent.endsWith('em')) {
					oldVal = parseFloat(styles.textIndent)
				}
				blockNode.styles = {
					...styles,
					textIndent: `${oldVal + 2}em`
				}
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					const styles: KNodeStylesType = item.hasStyles() ? item.styles! : {}
					let oldVal = 0
					if (styles.textIndent && typeof styles.textIndent == 'string' && styles.textIndent.endsWith('em')) {
						oldVal = parseFloat(styles.textIndent)
					}
					item.styles = {
						...styles,
						textIndent: `${oldVal + 2}em`
					}
				})
			}
			await this.updateView()
		}

		/**
		 * 减少缩进
		 */
		const setDecreaseIndent = async () => {
			//起点和终点在一起
			if (this.selection.collapsed()) {
				const blockNode = this.selection.start!.node.getBlock()
				const styles: KNodeStylesType = blockNode.hasStyles() ? blockNode.styles! : {}
				let oldVal = 0
				if (styles.textIndent && typeof styles.textIndent == 'string' && styles.textIndent.endsWith('em')) {
					oldVal = parseFloat(styles.textIndent)
				}
				blockNode.styles = {
					...styles,
					textIndent: `${oldVal - 2 > 0 ? oldVal - 2 : 0}em`
				}
			}
			//起点和终点不在一起
			else {
				const blockNodes = getSelectionBlockNodes.apply(this)
				blockNodes.forEach(item => {
					const styles: KNodeStylesType = item.hasStyles() ? item.styles! : {}
					let oldVal = 0
					if (styles.textIndent && typeof styles.textIndent == 'string' && styles.textIndent.endsWith('em')) {
						oldVal = parseFloat(styles.textIndent)
					}
					item.styles = {
						...styles,
						textIndent: `${oldVal - 2 > 0 ? oldVal - 2 : 0}em`
					}
				})
			}
			await this.updateView()
		}

		return {
			setDecreaseIndent,
			setIncreaseIndent
		}
	}
})
