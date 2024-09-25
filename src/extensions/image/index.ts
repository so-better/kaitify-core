import interact from 'interactjs'
import { event as DapEvent, element as DapElement } from 'dap-util'
import { Editor, EditorSelectedType, KNode, KNodeMarksType, KNodeStylesType } from '../../model'
import { Extension } from '../Extension'

declare module '../../model' {
	interface EditorCommandsType {
		canSetImage?: () => boolean
		inImage?: () => boolean
		includeImage?: () => boolean
		setImage?: (options: SetImageOptionsType) => Promise<void>
	}
}

/**
 * 插入图片方法入参类型
 */
type SetImageOptionsType = {
	src: string
	alt?: string
	width?: string
}

/**
 * 判断子孙节点中是否含有图片节点
 */
const isChildrenHasImageNode = (editor: Editor, nodes: KNode[]): boolean => {
	const length = nodes.length
	let hasImage = false
	let i = 0
	while (i < length) {
		if (nodes[i].isClosed() && nodes[i].tag == 'img') {
			hasImage = true
			break
		} else if (nodes[i].hasChildren()) {
			hasImage = isChildrenHasImageNode(editor, nodes[i].children!)
			if (hasImage) {
				break
			}
		}
		i++
	}
	return hasImage
}

/**
 * 根据选区结果判断是否含有图片
 */
const isSelectedHasImageNode = (editor: Editor, selectedResult: EditorSelectedType[]) => {
	const length = selectedResult.length
	let hasImage = false
	let i = 0
	while (i < length) {
		const item = selectedResult[i]
		//图片节点
		if (item.node.isClosed() && item.node.tag == 'img') {
			hasImage = true
			break
		}
		//存在子节点数组
		else if (item.node.hasChildren()) {
			hasImage = isChildrenHasImageNode(editor, item.node.children!)
			if (hasImage) {
				break
			}
		}
		i++
	}
	return hasImage
}

/**
 * 设置图片选中
 */
const imageFocus = (editor: Editor, el: HTMLImageElement, node: KNode) => {
	DapEvent.off(el, 'click')
	DapEvent.on(el, 'click', () => {
		editor.setSelectionBefore(node, 'start')
		editor.setSelectionAfter(node, 'end')
		editor.updateRealSelection()
	})
}
/**
 * 设置图片拖拽
 */
const imageResizable = (editor: Editor, el: HTMLImageElement, node: KNode) => {
	//获取父元素宽度
	const parentWidth = DapElement.width(el.parentElement!)
	//设置拖拽改变大小的功能
	interact(el).unset()
	interact(el).resizable({
		//是否启用
		enabled: true,
		//指定可以调整大小的边缘
		edges: { left: false, right: true, bottom: false, top: false },
		//启用惯性效果
		inertia: false,
		//调整大小时的自动滚动功能
		autoScroll: true,
		//保持图片的宽高比
		preserveAspectRatio: true,
		//水平调整
		axis: 'x',
		listeners: {
			start(event) {
				//禁用dragstart
				DapEvent.on(event.target, 'dragstart', e => e.preventDefault())
			},
			//拖拽
			move(event) {
				//获取宽度
				let { width } = event.rect
				//设置最小宽度
				if (width < 50) width = 50
				//设置最大宽度
				if (width >= parentWidth) width = parentWidth
				//设置dom的宽度
				event.target.style.width = `${width}px`
			},
			//结束拖拽
			end(event) {
				//恢复dragstart
				DapEvent.off(event.target, 'dragstart')
				//获取宽度
				let { width } = event.rect
				//设置最小宽度
				if (width < 50) width = 50
				//设置最大宽度
				if (width >= parentWidth) width = parentWidth
				//设置百分比宽度
				const percentWidth = Number(((width / parentWidth) * 100).toFixed(2))
				//设置节点的styles
				if (node.hasStyles()) {
					node.styles!.width = `${percentWidth}%`
				} else {
					node.styles = {
						width: `${percentWidth}%`
					}
				}
				//将光标定位到节点后
				editor.setSelectionAfter(node)
				//更新视图
				editor.updateView()
			}
		}
	})
}

export const ImageExtension = Extension.create({
	name: 'image',
	pasteKeepMarks(node) {
		const marks: KNodeMarksType = {}
		if (node.tag == 'img' && node.hasMarks()) {
			marks['alt'] = node.marks!['alt'] || ''
			marks['src'] = node.marks!['src'] || ''
		}
		return marks
	},
	pasteKeepStyles(node) {
		const styles: KNodeStylesType = {}
		if (node.tag == 'img' && node.hasStyles()) {
			styles['width'] = node.styles!['width'] || 'auto'
		}
		return styles
	},
	afterUpdateView() {
		//编辑器不可编辑状态下不设置
		if (!this.isEditable()) {
			return
		}
		const images = this.$el!.querySelectorAll('img')
		images.forEach(el => {
			//查找对应的节点
			const node = this.findNode(el)
			//图片选中
			imageFocus(this, el, node)
			//图片拖拽改变大小
			imageResizable(this, el, node)
		})
	},
	addCommands() {
		/**
		 * 是否可以插入图片
		 */
		const canSetImage = () => {
			if (!this.selection.focused()) {
				return false
			}
			const node = this.selection.start!.node
			if (node.isInCodeBlockStyle()) {
				return false
			}
			return true
		}
		/**
		 * 插入图片
		 */
		const setImage = async ({ src, alt, width }: SetImageOptionsType) => {
			if (!src) {
				return
			}
			if (!canSetImage()) {
				return
			}
			const imageNode = KNode.create({
				type: 'closed',
				tag: 'img',
				marks: {
					src,
					alt: alt || ''
				},
				styles: {
					width: width || 'auto'
				}
			})
			this.insertNode(imageNode)
			this.setSelectionAfter(imageNode)
			await this.updateView()
		}
		/**
		 * 光标是否都在图片上
		 */
		const inImage = () => {
			if (!this.selection.focused()) {
				return false
			}
			return this.selection.start!.node.isEqual(this.selection.end!.node) && this.selection.start!.node.tag == 'img'
		}

		/**
		 * 光标范围内是否包含图片
		 */
		const includeImage = () => {
			if (!this.selection.focused()) {
				return false
			}
			if (this.selection.collapsed()) {
				return this.selection.start!.node.tag == 'img'
			}
			const selectedResult = this.getSelectedNodes()
			return isSelectedHasImageNode(this, selectedResult)
		}

		return { canSetImage, inImage, includeImage, setImage }
	}
})
