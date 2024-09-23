import { Extension } from '../Extension'

export const imageExtension = Extension.create({
	name: 'image',
	domParseNodeCallback(node) {
		return node
	},
	//formatRule({ editor, node }) {},
	pasteKeepMarks(node) {
		return {}
	},
	pasteKeepStyles(node) {
		return {}
	},
	commands() {
		return {
			setImage: () => {}
		}
	}
})
