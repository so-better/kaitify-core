import interact from 'interactjs'
import { event as DapEvent, element as DapElement } from 'dap-util'
import { Editor, KNode, KNodeMarksType, KNodeStylesType } from '../../model'
import { Extension } from '../Extension'

/**
 * 插入视频方法入参类型
 */
type SetVideoOptionType = {
	src: string
	width?: string
	controls?: boolean
	autoplay?: boolean
	muted?: boolean
	loop?: boolean
}

declare module '../../model' {
	interface EditorCommandsType {
		getVideo?: () => KNode | null
		hasVideo?: () => boolean
		setVideo?: (options: SetVideoOptionType) => Promise<void>
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
 * 设置视频选中
 */
const videoFocus = (editor: Editor, el: HTMLVideoElement, node: KNode) => {
	DapEvent.off(el, 'click')
	DapEvent.on(el, 'click', () => {
		editor.setSelectionBefore(node, 'start')
		editor.setSelectionAfter(node, 'end')
		editor.updateRealSelection()
	})
}
/**
 * 设置视频拖拽
 */
const videoResizable = (editor: Editor, el: HTMLVideoElement, node: KNode) => {
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
		//保持视频的宽高比
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

export const VideoExtension = Extension.create({
	name: 'video',
	pasteKeepMarks(node) {
		const marks: KNodeMarksType = {}
		if (node.isMatch({ tag: 'video' }) && node.hasMarks()) {
			if (node.marks!.hasOwnProperty('src')) marks['src'] = node.marks!['src']
			if (node.marks!.hasOwnProperty('autoplay')) marks['autoplay'] = node.marks!['autoplay']
			if (node.marks!.hasOwnProperty('loop')) marks['loop'] = node.marks!['loop']
			if (node.marks!.hasOwnProperty('muted')) marks['muted'] = node.marks!['muted']
			if (node.marks!.hasOwnProperty('controls')) marks['controls'] = node.marks!['controls']
		}
		return marks
	},
	pasteKeepStyles(node) {
		const styles: KNodeStylesType = {}
		if (node.isMatch({ tag: 'video' }) && node.hasStyles()) {
			styles['width'] = node.styles!['width'] || 'auto'
		}
		return styles
	},
	formatRules: [
		({ editor, node }) => {
			if (node.isMatch({ tag: 'video' })) {
				const previousNode = node.getPrevious(node.parent ? node.parent!.children! : editor.stackNodes)
				const nextNode = node.getNext(node.parent ? node.parent!.children! : editor.stackNodes)
				//前一个节点不存在或者不是零宽度空白文本节点
				if (!previousNode || !previousNode.isZeroWidthText()) {
					const zeroWidthText = KNode.createZeroWidthText()
					editor.addNodeBefore(zeroWidthText, node)
				}
				//后一个节点不存在或者不是零宽度空白文本节点
				if (!nextNode || !nextNode.isZeroWidthText()) {
					const zeroWidthText = KNode.createZeroWidthText()
					editor.addNodeAfter(zeroWidthText, node)
				}
			}
		}
	],
	afterUpdateView() {
		//编辑器不可编辑状态下不设置
		if (!this.isEditable()) {
			return
		}
		const videos = this.$el!.querySelectorAll('video')
		videos.forEach(el => {
			//查找对应的节点
			const node = this.findNode(el)
			//视频选中
			videoFocus(this, el, node)
			//视频拖拽改变大小
			videoResizable(this, el, node)
		})
	},
	addCommands() {
		/**
		 * 获取光标所在的视频，如果光标不在一个视频内，返回null
		 */
		const getVideo = () => {
			return this.getMatchNodeBySelection({
				tag: 'video'
			})
		}
		/**
		 * 判断光标范围内是否有视频
		 */
		const hasVideo = () => {
			return this.isSelectionNodesSomeMatch({
				tag: 'video'
			})
		}
		/**
		 * 插入视频
		 */
		const setVideo = async ({ src, width, controls, loop, muted, autoplay }: SetVideoOptionType) => {
			if (!this.selection.focused()) {
				return
			}
			if (!src) {
				return
			}
			const marks: KNodeMarksType = {
				src
			}
			if (controls) marks['controls'] = 'controls'
			if (loop) marks['loop'] = 'loop'
			if (muted) marks['muted'] = 'muted'
			if (autoplay) marks['autoplay'] = 'autoplay'
			const videoNode = KNode.create({
				type: 'closed',
				tag: 'video',
				marks: marks,
				styles: {
					width: width || 'auto'
				}
			})
			this.insertNode(videoNode)
			this.setSelectionAfter(videoNode)
			await this.updateView()
		}
		return { getVideo, hasVideo, setVideo }
	}
})
