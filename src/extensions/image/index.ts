import interact from 'interactjs'
import { event as DapEvent, element as DapElement } from 'dap-util'
import { Editor, KNodeMarksType, KNodeStylesType } from '../../model'
import { Extension } from '../Extension'

/**
 * 设置图片拖拽
 */
const imageResizable = (editor: Editor, el: HTMLImageElement) => {
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
				//查找对应的节点
				const node = editor.findNode(event.target)
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

export const imageExtension = Extension.create({
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
		images.forEach(el => imageResizable(this, el))
	},
	setCommands() {
		return {
			setImage: () => {
				console.log(1)
			}
		}
	}
})
