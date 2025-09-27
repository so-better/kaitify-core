import interact from 'interactjs'
import { event as DapEvent, data as DapData } from 'dap-util'
import { Editor, KNode, KNodeMarksType, KNodeStylesType } from '@/model'
import { Extension } from '../Extension'
import './style.less'
import { deleteProperty } from '@/tools'

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
 * 设置图片选中
 */
const imageFocus = (editor: Editor) => {
  DapEvent.off(editor.$el!, 'click.image_focus')
  DapEvent.on(editor.$el!, 'click.image_focus', e => {
    //编辑器不可编辑状态下不设置
    if (!editor.isEditable()) {
      return
    }
    const event = e as MouseEvent
    const elm = event.target as HTMLElement
    if (elm === editor.$el) {
      return
    }
    const node = editor.findNode(elm)
    const matchNode = node.getMatchNode({
      tag: 'img'
    })
    if (matchNode) {
      editor.setSelectionBefore(matchNode, 'start')
      editor.setSelectionAfter(matchNode, 'end')
      editor.updateRealSelection()
    }
  })
}
/**
 * 设置图片拖拽
 */
const imageResizable = (editor: Editor) => {
  //设置拖拽改变大小的功能
  interact('.kaitify img').unset()
  interact('.kaitify img').resizable({
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

export const ImageExtension = () =>
  Extension.create({
    name: 'image',
    extraKeepTags: ['img'],
    onDomParseNode(node) {
      if (node.isMatch({ tag: 'img' })) {
        node.type = 'closed'
      }
      return node
    },
    formatRules: [
      ({ node }) => {
        if (node.isMatch({ tag: 'img' })) {
          node.type = 'closed'
        }
      }
    ],
    onPasteKeepMarks(node) {
      const marks: KNodeMarksType = {}
      if (node.isMatch({ tag: 'img' }) && node.hasMarks()) {
        if (node.marks!.hasOwnProperty('alt')) marks['alt'] = node.marks!['alt']
        if (node.marks!.hasOwnProperty('src')) marks['src'] = node.marks!['src']
      }
      return marks
    },
    onPasteKeepStyles(node) {
      const styles: KNodeStylesType = {}
      if (node.isMatch({ tag: 'img' }) && node.hasStyles()) {
        styles['width'] = node.styles!['width'] || 'auto'
      }
      return styles
    },
    onAfterUpdateView() {
      //图片选中
      imageFocus(this)
      //图片拖拽改变大小
      imageResizable(this)
    },
    addCommands() {
      const getImage = () => {
        return this.getMatchNodeBySelection({
          tag: 'img'
        })
      }

      const hasImage = () => {
        return this.isSelectionNodesSomeMatch({
          tag: 'img'
        })
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
          tag: 'img',
          marks: {
            src: options.src,
            alt: options.alt || ''
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
        if (!options.src && !options.alt) {
          return
        }
        const imageNode = getImage()
        if (!imageNode) {
          return
        }
        //更新url
        if (options.src) {
          imageNode.marks!.src = options.src
        }
        //更新alt
        if (options.alt) {
          imageNode.marks!.alt = options.alt
        } else {
          imageNode.marks = deleteProperty(imageNode.marks!, 'alt')
        }
        await this.updateView()
      }

      return { getImage, hasImage, setImage, updateImage }
    }
  })
