import interact from 'interactjs'
import { event as DapEvent, data as DapData } from 'dap-util'
import { Editor, KNode, KNodeMarksType, KNodeStylesType } from '@/model'
import { Extension } from '../Extension'
import './style.less'
import { deleteProperty } from '@/tools'

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
    getVideo?: () => KNode | null
    hasVideo?: () => boolean
    setVideo?: (options: SetVideoOptionType) => Promise<void>
    updateVideo?: (options: UpdateVideoOptionType) => Promise<void>
  }
}

/**
 * 设置视频选中
 */
const videoFocus = (editor: Editor) => {
  DapEvent.off(editor.$el!, 'click.video_focus')
  DapEvent.on(editor.$el!, 'click.video_focus', e => {
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
      tag: 'video'
    })
    if (matchNode) {
      editor.setSelectionBefore(matchNode, 'start')
      editor.setSelectionAfter(matchNode, 'end')
      editor.updateRealSelection()
    }
  })
}
/**
 * 设置视频拖拽
 */
const videoResizable = (editor: Editor) => {
  //设置拖拽改变大小的功能
  interact('.Kaitify video').unset()
  interact('.Kaitify video').resizable({
    //是否启用
    enabled: true,
    //指定可以调整大小的边缘
    edges: { left: false, right: true, bottom: false, top: false },
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
      //开始拖拽
      start(event) {
        //不可编辑状态下不能拖拽
        if (!editor.isEditable()) {
          event.interaction.stop()
          return
        }
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
        //获取视频节点
        const node = DapData.get(event.target, 'node')
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
  extraKeepTags: ['video'],
  domParseNodeCallback(node) {
    if (node.isMatch({ tag: 'video' })) {
      node.type = 'closed'
    }
    return node
  },
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
        //视频必须是闭合节点
        node.type = 'closed'
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
    //视频选中
    videoFocus(this)
    //视频拖拽改变大小
    videoResizable(this)
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
    const setVideo = async (options: SetVideoOptionType) => {
      if (!this.selection.focused()) {
        return
      }
      if (!options.src) {
        return
      }
      const marks: KNodeMarksType = {
        src: options.src
      }
      if (options.autoplay) {
        marks['autoplay'] = 'autoplay'
        marks['muted'] = 'muted'
      }
      const videoNode = KNode.create({
        type: 'closed',
        tag: 'video',
        marks,
        styles: {
          width: options.width || 'auto'
        }
      })
      this.insertNode(videoNode)
      this.setSelectionAfter(videoNode)
      await this.updateView()
    }

    /**
     * 更新视频
     */
    const updateVideo = async (options: UpdateVideoOptionType) => {
      if (!this.selection.focused()) {
        return
      }
      const videoNode = getVideo()
      if (!videoNode) {
        return
      }
      if (options.controls) {
        videoNode.marks!['controls'] = 'controls'
      } else {
        videoNode.marks = deleteProperty(videoNode.marks!, 'controls')
      }
      if (options.loop) {
        videoNode.marks!['loop'] = 'loop'
      } else {
        videoNode.marks = deleteProperty(videoNode.marks!, 'loop')
      }
      if (options.muted) {
        videoNode.marks!['muted'] = 'muted'
      } else {
        videoNode.marks = deleteProperty(videoNode.marks!, 'muted')
      }
      await this.updateView()
    }

    return { getVideo, hasVideo, setVideo, updateVideo }
  }
})
