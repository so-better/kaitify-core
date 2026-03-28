import interact from 'interactjs'
import { event as DapEvent, data as DapData } from 'dap-util'
import { Editor, KNode, KNodeMarksType, KNodeStylesType } from '@/model'
import { deleteProperty } from '@/tools'
import { IMAGE_NODE_TAG } from './element'
import { Extension } from '../Extension'
import './style.less'

/**
 * 插入图片方法入参类型
 */
export type SetImageOptionType = {
	src: string
	alt?: string
	width?: string
}

/**
 * 更新图片方法入参类型
 */
export type UpdateImageOptionType = {
	src?: string
	alt?: string
}

declare module '../../model' {
	interface EditorCommandsType {
		/**
		 * 获取光标所在的图片，如果光标不在一张图片内，返回null
		 */
		getImage?: () => KNode | null
		/**
		 * 判断光标范围内是否有图片
		 */
		hasImage?: () => boolean
		/**
		 * 插入图片
		 */
		setImage?: (options: SetImageOptionType) => Promise<void>
		/**
		 * 更新图片
		 */
		updateImage?: (options: UpdateImageOptionType) => Promise<void>
	}
}

/**
 * 设置图片拖拽改变大小
 */
const handleResizable = (editor: Editor) => {
	if (DapData.get(editor.$el!, 'kaitify-image-interact-init')) {
		return
	}
	DapData.set(editor.$el!, 'kaitify-image-interact-init', true)
	interact(`.kaitify ${IMAGE_NODE_TAG} img`, { context: editor.$el }).unset()
	interact(`.kaitify ${IMAGE_NODE_TAG} img`, { context: editor.$el }).resizable({
		//是否启用
		enabled: true,
		//指定可以调整大小的边缘
		edges: { left: false, right: true, bottom: false, top: false },
		//设置可拖拽区域宽度
		margin: 5,
		//设置鼠标样式
		cursorChecker() {
			return editor.isEditable() ? 'ew-resize' : 'default'
		},
		//启用惯性效果
		inertia: false,
		//调整大小时的自动滚动功能
		autoScroll: true,
		//保持图片的宽高比
		preserveAspectRatio: true,
		//水平调整
		axis: 'x',
		//事件
		listeners: {
			start(event) {
				//不可编辑状态下不能拖拽
				if (!editor.isEditable()) {
					event.interaction.stop()
					return
				}
				//取消dom监听
				editor.removeDomObserve()
				//禁用dragstart
				DapEvent.on(event.target, 'dragstart', e => e.preventDefault())
				//获取图片节点
				const node = editor.findNode(event.target)
				//暂存
				DapData.set(event.target, 'node', node)
			},
			//拖拽
			move(event) {
				//获取宽度
				const { width } = event.rect
				//设置dom的宽度
				event.target.parentElement.style.width = `${width}px`
			},
			//结束拖拽
			end(event) {
				//恢复dragstart
				DapEvent.off(event.target, 'dragstart')
				//获取宽度
				const { width } = event.rect
				//设置百分比宽度
				const percentWidth = Number(((width / event.target.parentElement.parentElement.offsetWidth) * 100).toFixed(2))
				//获取图片节点
				const node = DapData.get<KNode>(event.target, 'node')
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

/**
 * 图片获取焦点设置（使用默认选中样式，但是图片本身在点击时是无法获取聚焦的，所以只需要使它聚焦即可）
 */
const handleFoucs = (editor: Editor) => {
	DapEvent.off(editor.$el!, 'click.image')
	DapEvent.on(editor.$el!, 'click.image', async e => {
		const event = e as MouseEvent
		const elm = event.target as HTMLElement
		if (elm === editor.$el) {
			return
		}
		const node = editor.findNode(elm)
		const matchNode = node.getMatchNode({
			tag: IMAGE_NODE_TAG
		})
		//图片节点不存在或者编辑器不可编辑
		if (!matchNode || !editor.isEditable()) {
			return
		}
		editor.setSelectionBefore(matchNode, 'start')
		editor.setSelectionAfter(matchNode, 'end')
		editor.updateRealSelection()
	})
}

export const ImageExtension = () =>
	Extension.create({
		name: 'image',
		extraKeepTags: [IMAGE_NODE_TAG, 'img'],
		onPasteKeepStyles(node) {
			const styles: KNodeStylesType = {}
			if (node.isMatch({ tag: IMAGE_NODE_TAG }) && node.hasStyles()) {
				styles['width'] = node.styles!['width'] || 'auto'
			}
			if (node.isMatch({ tag: 'img' }) && node.hasStyles()) {
				styles['width'] = node.styles!['width'] || 'auto'
			}
			return styles
		},
		onPasteKeepMarks(node) {
			const marks: KNodeMarksType = {}
			if (node.isMatch({ tag: IMAGE_NODE_TAG }) && node.hasMarks()) {
				if (node.marks!.hasOwnProperty('data-src')) marks['data-src'] = node.marks!['data-src']
				if (node.marks!.hasOwnProperty('data-alt')) marks['data-alt'] = node.marks!['data-alt']
			}
			if (node.isMatch({ tag: 'img' }) && node.hasMarks()) {
				if (node.marks!.hasOwnProperty('src')) marks['src'] = node.marks!['src']
				if (node.marks!.hasOwnProperty('alt')) marks['alt'] = node.marks!['alt']
			}
			return marks
		},
		onDomParseNode(node) {
			if (node.isMatch({ tag: IMAGE_NODE_TAG })) {
				node.type = 'closed'
				node.children = undefined
			}
			if (node.isMatch({ tag: 'img' })) {
				node.type = 'closed'
				node.tag = IMAGE_NODE_TAG
				node.children = undefined
				if (node.hasMarks()) {
					if (node.marks!['src']) {
						node.marks!['data-src'] = node.marks!['src']
						node.marks = deleteProperty(node.marks, 'src')
					}
					if (node.marks!['alt']) {
						node.marks!['data-alt'] = node.marks!['alt']
						node.marks = deleteProperty(node.marks, 'alt')
					}
				}
			}
			return node
		},
		formatRules: [
			({ node }) => {
				if (node.isMatch({ tag: IMAGE_NODE_TAG })) {
					node.type = 'closed'
					node.children = undefined
				}
				if (node.isMatch({ tag: 'img' })) {
					node.type = 'closed'
					node.tag = IMAGE_NODE_TAG
					node.children = undefined
					if (node.hasMarks()) {
						if (node.marks!['src']) {
							node.marks!['data-src'] = node.marks!['src']
							node.marks = deleteProperty(node.marks, 'src')
						}
						if (node.marks!['alt']) {
							node.marks!['data-alt'] = node.marks!['alt']
							node.marks = deleteProperty(node.marks, 'alt')
						}
					}
				}
			}
		],
		onAfterUpdateView() {
			handleResizable(this)
			handleFoucs(this)
		},
		addCommands() {
			const getImage = () => {
				return this.getClosedNodeBySelection({ tag: IMAGE_NODE_TAG })
			}

			const hasImage = () => {
				return this.hasClosedNodeBySelection({ tag: IMAGE_NODE_TAG })
			}

			const setImage = async (options: SetImageOptionType) => {
				if (!this.selection.focused()) {
					return
				}
				if (!options.src) {
					return
				}
				const node = KNode.create({
					type: 'closed',
					tag: IMAGE_NODE_TAG,
					marks: {
						'data-src': options.src,
						'data-alt': options.alt || ''
					},
					styles: {
						width: options.width || 'auto'
					}
				})
				this.insertNode(node)
				this.setSelectionAfter(node)
				await this.updateView()
			}

			const updateImage = async (options: UpdateImageOptionType) => {
				if (!this.selection.focused()) {
					return
				}
				if (options.src === undefined && options.alt === undefined) {
					return
				}
				const node = getImage()
				if (!node) {
					return
				}
				//更新url
				if (options.src !== undefined) {
					node.marks!['data-src'] = options.src
				}
				//更新alt
				if (options.alt !== undefined) {
					node.marks!['data-alt'] = options.alt
				}
				await this.updateView()
			}

			return { getImage, hasImage, setImage, updateImage }
		}
	})
