import interact from 'interactjs'
import { event as DapEvent, data as DapData } from 'dap-util'
import { Editor, KNode, KNodeMarksType, KNodeStylesType } from '@/model'
import { deleteProperty } from '@/tools'
import { Image_NODE_TAG } from './element'
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
  if (DapData.get(editor.$el!, 'image-interact-init')) {
    return
  }
  DapData.set(editor.$el!, 'image-interact-init', true)
  interact(`.kaitify ${Image_NODE_TAG}`, { context: editor.$el }).unset()
  interact(`.kaitify ${Image_NODE_TAG}`, { context: editor.$el }).resizable({
    //是否启用
    enabled: true,
    //指定可以调整大小的边缘
    edges: { left: false, right: true, bottom: false, top: false },
    //设置可拖拽区域宽度
    margin: 5,
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
        event.target.style.width = `${width}px`
      },
      //结束拖拽
      end(event) {
        //恢复dragstart
        DapEvent.off(event.target, 'dragstart')
        //获取宽度
        const { width } = event.rect
        //设置百分比宽度
        const percentWidth = Number(((width / event.target.parentElement.offsetWidth) * 100).toFixed(2))
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
 * 图片选中样式设置
 */
const handleSelected = (editor: Editor) => {
  editor.removeDomObserve()
  // 先清除所有图片的选中状态
  editor.$el!.querySelectorAll(`${Image_NODE_TAG} > img`).forEach(el => {
    el.removeAttribute('is-selected')
  })
  if (!editor.selection.focused()) return
  const flag = editor.commands.hasImage?.()
  if (flag) {
    const doms = editor
      .getFocusNodesBySelection('closed')
      .filter(item => item.isMatch({ tag: Image_NODE_TAG }))
      .map(item => editor.findDom(item))
    doms.forEach(dom => dom.querySelector('img')?.setAttribute('is-selected', ''))
  }
  editor.setDomObserve()
}

export const ImageExtension = () =>
  Extension.create({
    name: 'image',
    extraKeepTags: [Image_NODE_TAG, 'img'],
    onPasteKeepStyles(node) {
      const styles: KNodeStylesType = {}
      if (node.isMatch({ tag: Image_NODE_TAG }) && node.hasStyles()) {
        styles['width'] = node.styles!['width'] || 'auto'
      }
      if (node.isMatch({ tag: 'img' }) && node.hasStyles()) {
        styles['width'] = node.styles!['width'] || 'auto'
      }
      return styles
    },
    onPasteKeepMarks(node) {
      const marks: KNodeMarksType = {}
      if (node.isMatch({ tag: Image_NODE_TAG }) && node.hasMarks()) {
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
      if (node.isMatch({ tag: Image_NODE_TAG })) {
        node.type = 'closed'
        node.children = undefined
      }
      if (node.isMatch({ tag: 'img' })) {
        node.type = 'closed'
        node.tag = Image_NODE_TAG
        node.children = undefined
        if (node.hasMarks()) {
          node.marks!['data-src'] = node.marks!['src']
          node.marks!['data-alt'] = node.marks!['alt']
          node.marks = deleteProperty(node.marks, 'src')
          node.marks = deleteProperty(node.marks, 'alt')
        }
      }
      return node
    },
    formatRules: [
      ({ node }) => {
        if (node.isMatch({ tag: Image_NODE_TAG })) {
          node.type = 'closed'
          node.children = undefined
        }
        if (node.isMatch({ tag: 'img' })) {
          node.type = 'closed'
          node.tag = Image_NODE_TAG
          node.children = undefined
          if (node.hasMarks()) {
            node.marks!['data-src'] = node.marks!['src']
            node.marks!['data-alt'] = node.marks!['alt']
            node.marks = deleteProperty(node.marks, 'src')
            node.marks = deleteProperty(node.marks, 'alt')
          }
        }
      }
    ],
    onAfterUpdateView() {
      handleResizable(this)
    },
    onSelectionUpdate() {
      handleSelected(this)
    },
    addCommands() {
      const getImage = () => {
        if (!this.selection.focused() || this.selection.collapsed()) {
          return null
        }
        const startNode = this.selection.start!.node
        const endNode = this.selection.end!.node
        const startOffset = this.selection.start!.offset
        const endOffset = this.selection.end!.offset
        if (startNode.isEqual(endNode) && startNode.isMatch({ tag: Image_NODE_TAG }) && startOffset == 0 && endOffset == 1) {
          return startNode
        }
        return null
      }

      const hasImage = () => {
        if (!this.selection.focused() || this.selection.collapsed()) {
          return false
        }
        const startNode = this.selection.start!.node
        const endNode = this.selection.end!.node
        const startOffset = this.selection.start!.offset
        const endOffset = this.selection.end!.offset
        // 起点从图片头部开始
        if (startNode.isMatch({ tag: Image_NODE_TAG }) && startOffset === 0) {
          return true
        }
        // 终点到图片尾部结束
        if (endNode.isMatch({ tag: Image_NODE_TAG }) && endOffset === 1) {
          return true
        }
        // 选区中间完整包含的图片（排除边界节点）
        return this.getFocusNodesBySelection('all')
          .filter(n => !n.isEqual(startNode) && !n.isEqual(endNode))
          .some(n => n.isMatch({ tag: Image_NODE_TAG }))
      }

      const setImage = async (options: SetImageOptionType) => {
        if (!this.selection.focused()) {
          return
        }
        if (!options.src) {
          return
        }
        const imageNode = KNode.create({
          type: 'closed',
          tag: Image_NODE_TAG,
          marks: {
            'data-src': options.src,
            'data-alt': options.alt || ''
          },
          styles: {
            width: options.width || 'auto'
          }
        })
        this.insertNode(imageNode)
        this.setSelectionAfter(imageNode)
        await this.updateView()
      }

      const updateImage = async (options: UpdateImageOptionType) => {
        if (!this.selection.focused()) {
          return
        }
        if (options.src === undefined && options.alt === undefined) {
          return
        }
        const imageNode = getImage()
        if (!imageNode) {
          return
        }
        //更新url
        if (options.src !== undefined) {
          imageNode.marks!['data-src'] = options.src
        }
        //更新alt
        if (options.alt !== undefined) {
          imageNode.marks!['data-alt'] = options.alt
        }
        await this.updateView()
      }

      return { getImage, hasImage, setImage, updateImage }
    }
  })
