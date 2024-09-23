import interact from 'interactjs'
import { KNodeMarksType, KNodeStylesType } from '../../model'
import { Extension } from '../Extension'

/**
 * 设置图片拖拽
 */
const imageResizable = (el: HTMLImageElement) => {
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
			//拖拽改变大小时触发
			move(event) {
				const { width } = event.rect
				event.target.style.width = `${width}px`
			},
			end(event) {
				console.log(event)
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
	formatRule({ node }) {
		if (node.tag == 'img' && node.isClosed()) {
			const styles: KNodeStylesType = {
				display: 'inline-flex',
				maxWidth: '100%',
				position: 'relative'
			}
			if (node.hasStyles()) {
				node.styles = { ...node.styles, ...styles }
			} else {
				node.styles = { ...styles }
			}
		}
	},
	afterUpdateView() {
		const images = this.$el!.querySelectorAll('img')
		images.forEach(el => imageResizable(el))
	},
	commands() {
		return {
			setImage: () => {}
		}
	}
})
