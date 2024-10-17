import interact from 'interactjs'
import { event as DapEvent, element as DapElement } from 'dap-util'
import { Editor, KNode, KNodeMarksType, KNodeStylesType } from '@/model'
import { Extension } from '../Extension'
import './style.less'

/**
 * 插入图片方法入参类型
 */
type SetImageOptionType = {
	src: string
	alt?: string
	width?: string
}

declare module '../../model' {
	interface EditorCommandsType {
		getImage?: () => KNode | null
		hasImage?: () => boolean
		setImage?: (options: SetImageOptionType) => Promise<void>
	}
}

/**
 * 获取最大宽度
 */
const getMaxWidth = (element: HTMLElement): number => {
	const parentElement = element.parentElement!
	let maxWidth = DapElement.width(parentElement)
	if (!maxWidth) {
		maxWidth = getMaxWidth(parentElement)
	}
	return maxWidth
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
	const parentWidth = getMaxWidth(el)
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
				//更新视图
				editor.updateView()
			}
		}
	})
}

export const ImageExtension = Extension.create({
	name: 'image',
	extraKeepTags: ['img'],
	domParseNodeCallback(node) {
		if (node.isMatch({ tag: 'img' })) {
			node.type = 'closed'
		}
		return node
	},
	pasteKeepMarks(node) {
		const marks: KNodeMarksType = {}
		if (node.isMatch({ tag: 'img' }) && node.hasMarks()) {
			if (node.marks!.hasOwnProperty('alt')) marks['alt'] = node.marks!['alt']
			if (node.marks!.hasOwnProperty('src')) marks['src'] = node.marks!['src']
		}
		return marks
	},
	pasteKeepStyles(node) {
		const styles: KNodeStylesType = {}
		if (node.isMatch({ tag: 'img' }) && node.hasStyles()) {
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
		 * 获取光标所在的图片，如果光标不在一张图片内，返回null
		 */
		const getImage = () => {
			return this.getMatchNodeBySelection({
				tag: 'img'
			})
		}

		/**
		 * 判断光标范围内是否有图片
		 */
		const hasImage = () => {
			return this.isSelectionNodesSomeMatch({
				tag: 'img'
			})
		}

		/**
		 * 插入图片
		 */
		const setImage = async ({ src, alt, width }: SetImageOptionType) => {
			if (!this.selection.focused()) {
				return
			}
			if (!src) {
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

		return { getImage, hasImage, setImage }
	}
})
