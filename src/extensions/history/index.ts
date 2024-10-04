import { Extension } from '../Extension'
import { isUndo, isRedo } from '../../model/config/keyboard'

declare module '../../model' {
	interface EditorCommandsType {
		canUndo?: () => boolean
		canRedo?: () => boolean
		undo?: () => Promise<void>
		redo?: () => Promise<void>
	}
}

export const HistoryExtension = Extension.create({
	name: 'history',
	onKeydown(event) {
		//撤销
		if (isUndo(event)) {
			event.preventDefault()
			this.commands.undo?.()
		}
		//重做
		else if (isRedo(event)) {
			event.preventDefault()
			this.commands.redo?.()
		}
	},
	addCommands() {
		/**
		 * 是否可以撤销，如果可以撤销返回对应的历史记录
		 */
		const canUndo = () => {
			return this.history.records.length > 1
		}

		/**
		 * 是否可以重做，如果可以重做返回对应的历史记录
		 */
		const canRedo = () => {
			return this.history.redoRecords.length > 0
		}

		/**
		 * 撤销
		 */
		const undo = async () => {
			const record = this.history.setUndo()
			if (record) {
				this.stackNodes = record.nodes
				this.selection = record.selection
				await this.updateView(true, true)
			}
		}

		/**
		 * 重做
		 */
		const redo = async () => {
			const record = this.history.setRedo()
			if (record) {
				this.stackNodes = record.nodes
				this.selection = record.selection
				await this.updateView(true, true)
			}
		}

		return {
			canUndo,
			canRedo,
			redo,
			undo
		}
	}
})
