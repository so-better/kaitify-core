import interact from 'interactjs'
import { event as DapEvent, data as DapData } from 'dap-util'
import { Editor, KNode, KNodeMarksType, KNodeStylesType } from '@/model'
import { Extension } from '../Extension'
import { deleteProperty } from '@/tools'
import { VIDEO_NODE_TAG } from './element'
import './style.less'

/**
 * 插入视频方法入参类型
 */
export type SetVideoOptionType = {
	src: string
	width?: string
	autoplay?: boolean
}

/**
 * 更新视频方法入参类型
 */
export type UpdateVideoOptionType = {
	controls?: boolean
	muted?: boolean
	loop?: boolean
}

declare module '../../model' {
	interface EditorCommandsType {
		/**
		 * 获取光标所在的视频，如果光标不在一个视频内，返回null
		 */
		getVideo?: () => KNode | null
		/**
		 * 判断光标范围内是否有视频
		 */
		hasVideo?: () => boolean
		/**
		 * 插入视频
		 */
		setVideo?: (options: SetVideoOptionType) => Promise<void>
		/**
		 * 更新视频
		 */
		updateVideo?: (options: UpdateVideoOptionType) => Promise<void>
	}
}

/**
 * 设置视频拖拽改变大小
 */
const handleResizable = (editor: Editor) => {
	if (DapData.get(editor.$el!, 'kaitify-video-interact-init')) {
		return
	}
	DapData.set(editor.$el!, 'kaitify-video-interact-init', true)
	interact(`.kaitify ${VIDEO_NODE_TAG} video`, { context: editor.$el }).unset()
	interact(`.kaitify ${VIDEO_NODE_TAG} video`, { context: editor.$el }).resizable({
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
		//保持视频的宽高比
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
				//获取视频节点
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
				//获取视频节点
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
 * 视频获取焦点设置（使用默认选中样式，但是视频本身在点击时是无法获取聚焦的，所以只需要使它聚焦即可）
 */
const handleFoucs = (editor: Editor) => {
	DapEvent.off(editor.$el!, 'click.video')
	DapEvent.on(editor.$el!, 'click.video', async e => {
		const event = e as MouseEvent
		const elm = event.target as HTMLElement
		if (elm === editor.$el) {
			return
		}
		let node = null
		try {
			node = editor.findNode(elm)
		} catch (_) {
			return
		}
		const matchNode = node.getMatchNode({
			tag: VIDEO_NODE_TAG
		})
		//视频节点不存在或者编辑器不可编辑
		if (!matchNode || !editor.isEditable()) {
			return
		}
		editor.setSelectionBefore(matchNode, 'start')
		editor.setSelectionAfter(matchNode, 'end')
		editor.updateRealSelection()
	})
}

export const VideoExtension = () =>
	Extension.create({
		name: 'video',
		extraKeepTags: [VIDEO_NODE_TAG, 'video'],
		onPasteKeepStyles(node) {
			const styles: KNodeStylesType = {}
			if (node.isMatch({ tag: VIDEO_NODE_TAG }) && node.hasStyles()) {
				styles['width'] = node.styles!['width'] || 'auto'
			}
			if (node.isMatch({ tag: 'video' }) && node.hasStyles()) {
				styles['width'] = node.styles!['width'] || 'auto'
			}
			return styles
		},
		onPasteKeepMarks(node) {
			const marks: KNodeMarksType = {}
			if (node.isMatch({ tag: VIDEO_NODE_TAG }) && node.hasMarks()) {
				if (node.marks!.hasOwnProperty('data-src')) marks['data-src'] = node.marks!['data-src']
				if (node.marks!.hasOwnProperty('data-autoplay')) marks['data-autoplay'] = node.marks!['data-autoplay']
				if (node.marks!.hasOwnProperty('data-loop')) marks['data-loop'] = node.marks!['data-loop']
				if (node.marks!.hasOwnProperty('data-muted')) marks['data-muted'] = node.marks!['data-muted']
				if (node.marks!.hasOwnProperty('data-controls')) marks['data-controls'] = node.marks!['data-controls']
			}
			if (node.isMatch({ tag: 'video' }) && node.hasMarks()) {
				if (node.marks!.hasOwnProperty('src')) marks['src'] = node.marks!['src']
				if (node.marks!.hasOwnProperty('autoplay')) marks['autoplay'] = node.marks!['autoplay']
				if (node.marks!.hasOwnProperty('loop')) marks['loop'] = node.marks!['loop']
				if (node.marks!.hasOwnProperty('muted')) marks['muted'] = node.marks!['muted']
				if (node.marks!.hasOwnProperty('controls')) marks['controls'] = node.marks!['controls']
			}
			return marks
		},
		onDomParseNode(node) {
			if (node.isMatch({ tag: VIDEO_NODE_TAG })) {
				node.type = 'closed'
				node.children = undefined
			}
			if (node.isMatch({ tag: 'video' })) {
				node.type = 'closed'
				node.tag = VIDEO_NODE_TAG
				node.children = undefined
				if (node.hasMarks()) {
					if (node.marks!['src']) {
						node.marks!['data-src'] = node.marks!['src']
						node.marks = deleteProperty(node.marks, 'src')
					}
					if (node.marks!['autoplay']) {
						node.marks!['data-autoplay'] = node.marks!['autoplay']
						node.marks = deleteProperty(node.marks, 'autoplay')
					}
					if (node.marks!['loop']) {
						node.marks!['data-loop'] = node.marks!['loop']
						node.marks = deleteProperty(node.marks, 'loop')
					}
					if (node.marks!['muted']) {
						node.marks!['data-muted'] = node.marks!['muted']
						node.marks = deleteProperty(node.marks, 'muted')
					}
					if (node.marks!['controls']) {
						node.marks!['data-controls'] = node.marks!['controls']
						node.marks = deleteProperty(node.marks, 'controls')
					}
				}
			}
			return node
		},
		formatRules: [
			({ node }) => {
				if (node.isMatch({ tag: VIDEO_NODE_TAG })) {
					node.type = 'closed'
					node.children = undefined
				}
				if (node.isMatch({ tag: 'video' })) {
					node.type = 'closed'
					node.tag = VIDEO_NODE_TAG
					node.children = undefined
					if (node.hasMarks()) {
						if (node.marks!['src']) {
							node.marks!['data-src'] = node.marks!['src']
							node.marks = deleteProperty(node.marks, 'src')
						}
						if (node.marks!['autoplay']) {
							node.marks!['data-autoplay'] = node.marks!['autoplay']
							node.marks = deleteProperty(node.marks, 'autoplay')
						}
						if (node.marks!['loop']) {
							node.marks!['data-loop'] = node.marks!['loop']
							node.marks = deleteProperty(node.marks, 'loop')
						}
						if (node.marks!['muted']) {
							node.marks!['data-muted'] = node.marks!['muted']
							node.marks = deleteProperty(node.marks, 'muted')
						}
						if (node.marks!['controls']) {
							node.marks!['data-controls'] = node.marks!['controls']
							node.marks = deleteProperty(node.marks, 'controls')
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
			const getVideo = () => {
				return this.getClosedNodeBySelection({ tag: VIDEO_NODE_TAG })
			}

			const hasVideo = () => {
				return this.hasClosedNodeBySelection({ tag: VIDEO_NODE_TAG })
			}

			const setVideo = async (options: SetVideoOptionType) => {
				if (!this.selection.focused()) {
					return
				}
				if (!options.src) {
					return
				}
				const marks: KNodeMarksType = {
					'data-src': options.src
				}
				if (options.autoplay) {
					marks['data-autoplay'] = 'autoplay'
					marks['data-muted'] = 'muted'
				}
				const videoNode = KNode.create({
					type: 'closed',
					tag: VIDEO_NODE_TAG,
					marks,
					styles: {
						width: options.width || 'auto'
					}
				})
				this.insertNode(videoNode)
				await this.updateView()
			}

			const updateVideo = async (options: UpdateVideoOptionType) => {
				if (!this.selection.focused()) {
					return
				}
				if (typeof options.controls != 'boolean' && typeof options.muted != 'boolean' && typeof options.loop != 'boolean') {
					return
				}
				const videoNode = getVideo()
				if (!videoNode) {
					return
				}
				if (typeof options.controls == 'boolean') {
					if (options.controls) {
						videoNode.marks!['data-controls'] = 'controls'
					} else {
						videoNode.marks = deleteProperty(videoNode.marks!, 'data-controls')
					}
				}
				if (typeof options.loop == 'boolean') {
					if (options.loop) {
						videoNode.marks!['data-loop'] = 'loop'
					} else {
						videoNode.marks = deleteProperty(videoNode.marks!, 'data-loop')
					}
				}
				if (typeof options.muted == 'boolean') {
					if (options.muted) {
						videoNode.marks!['data-muted'] = 'muted'
					} else {
						videoNode.marks = deleteProperty(videoNode.marks!, 'data-muted')
					}
				}
				await this.updateView()
			}

			return { getVideo, hasVideo, setVideo, updateVideo }
		}
	})
