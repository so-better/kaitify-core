<template>
  <div class="container">
    <div class="left">
      <fieldset>
        <legend>自定义操作</legend>
        <div class="toolbar">
          <button>当前编辑器内容字数：{{ count }}</button>
          <button @click="insertNode">插入节点</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>编辑器设置</legend>
        <div class="toolbar">
          <button @click="editor?.setEditable(!editor.isEditable())">启用/禁用编辑功能</button>
          <button @click="editor && (editor.allowCopy = !editor.allowCopy)">启用/禁用复制功能</button>
          <button @click="editor && (editor.allowCut = !editor.allowCut)">启用/禁用剪切功能</button>
          <button @click="editor && (editor.allowPaste = !editor.allowPaste)">启用/禁用粘贴功能</button>
          <button @click="editor && (editor.allowPasteHtml = !editor.allowPasteHtml)">启用/禁用粘贴HTML功能</button>
          <button @click="editor && (editor.priorityPasteFiles = !editor.priorityPasteFiles)">启用/禁用文件粘贴优先</button>
          <button @click="editor?.commands.undo!()">撤销</button>
          <button @click="editor?.commands.redo!()">重做</button>
          <button @click="editor?.setDark(true)">深色模式</button>
          <button @click="editor?.setDark(false)">浅色模式</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>对齐方式</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setAlign!('left')">左对齐</button>
          <button @click="editor?.commands.setAlign!('right')">右对齐</button>
          <button @click="editor?.commands.setAlign!('center')">居中对齐</button>
          <button @click="editor?.commands.setAlign!('justify')">两端对齐</button>
          <button @click="editor?.commands.unsetAlign!('left')">取消左对齐</button>
          <button @click="editor?.commands.unsetAlign!('right')">取消右对齐</button>
          <button @click="editor?.commands.unsetAlign!('center')">取消居中对齐</button>
          <button @click="editor?.commands.unsetAlign!('justify')">取消两端对齐</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>行高</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setLineHeight!(3)">设置3行高</button>
          <button @click="editor?.commands.unsetLineHeight!(3)">取消3行高</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>链接</legend>
        <div class="toolbar">
          <button
            @click="editor?.commands.setLink!({ href: 'https://www.baidu.com', newOpen: true, text: '百度一下，你就知道' })">插入链接</button>
          <button @click="editor?.commands.unsetLink!()">取消链接</button>
          <button @click="editor?.commands.updateLink!({ href: 'https://www.so-better.cn' })">更新链接</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>缩进</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setIncreaseIndent!()">增加缩进</button>
          <button @click="editor?.commands.setDecreaseIndent!()">减少缩进</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>列表</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setList!({ ordered: true, listType: 'decimal' })">插入有序列表1</button>
          <button @click="editor?.commands.setList!({ ordered: true, listType: 'cjk-ideographic' })">插入有序列表2</button>
          <button @click="editor?.commands.setList!({ ordered: true, listType: 'lower-alpha' })">插入有序列表3</button>
          <button @click="editor?.commands.setList!({ ordered: true, listType: 'lower-greek' })">插入有序列表4</button>
          <button @click="editor?.commands.setList!({ ordered: true, listType: 'lower-roman' })">插入有序列表5</button>
          <button @click="editor?.commands.setList!({ ordered: true, listType: 'upper-alpha' })">插入有序列表6</button>
          <button @click="editor?.commands.setList!({ ordered: true, listType: 'upper-roman' })">插入有序列表6</button>
          <button @click="editor?.commands.setList!({ ordered: false, listType: 'disc' })">插入无序列表1</button>
          <button @click="editor?.commands.setList!({ ordered: false, listType: 'circle' })">插入无序列表2</button>
          <button @click="editor?.commands.setList!({ ordered: false, listType: 'square' })">插入无序列表3</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>待办列表</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setTask!()">插入待办</button>
          <button @click="editor?.commands.unsetTask!()">取消待办</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>背景色</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setBackColor!('#f30')">设置#f30背景色</button>
          <button @click="editor?.commands.unsetBackColor!('#f30')">取消设置#f30背景色</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>字体颜色</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setColor!('#f30')">设置#f30字体颜色</button>
          <button @click="editor?.commands.unsetColor!('#f30')">取消设置#f30字体颜色</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>加粗</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setBold!()">设置加粗</button>
          <button @click="editor?.commands.unsetBold!()">取消加粗</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>删除线</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setStrikethrough!()">设置删除线</button>
          <button @click="editor?.commands.unsetStrikethrough!()">取消删除线</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>下划线</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setUnderline!()">设置下划线</button>
          <button @click="editor?.commands.unsetUnderline!()">取消下划线</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>上标</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setSuperscript!()">设置上标</button>
          <button @click="editor?.commands.unsetSuperscript!()">取消上标</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>下标</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setSubscript!()">设置下标</button>
          <button @click="editor?.commands.unsetSubscript!()">取消下标</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>斜体</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setItalic!()">设置斜体</button>
          <button @click="editor?.commands.unsetItalic!()">取消斜体</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>字体</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setFontFamily!('楷体-简,楷体')">设置楷体字体</button>
          <button @click="editor?.commands.unsetFontFamily!('楷体-简,楷体')">取消设置楷体字体</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>字号</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setFontSize!('28px')">设置28px字号</button>
          <button @click="editor?.commands.unsetFontSize!('28px')">取消设置28px字号</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>行内代码</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setCode!()">设置行内代码</button>
          <button @click="editor?.commands.unsetCode!()">取消行内代码</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>图片</legend>
        <div class="toolbar">
          <button
            @click="editor?.commands.setImage!({ src: 'https://bpic.588ku.com/back_origin_min_pic/24/07/20/e9c6eadf8dd571483c69372b7c21aaa5.jpg!/fh/333/quality/95/unsharp/true/compress/true', alt: '图片加载失败', width: '200px' })">插入图片</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>视频</legend>
        <div class="toolbar">
          <button
            @click="editor?.commands.setVideo!({ src: 'https://bpic.588ku.com/video_listen/588ku_preview/24/04/01/09/49/06/video660a12925fe74.mp4', width: '200px', autoplay: true })">插入视频</button>
          <button @click="editor?.commands.updateVideo!({ controls: true, loop: true })">更新视频</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>代码块</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setCodeBlock!()">插入代码块</button>
          <button @click="editor?.commands.unsetCodeBlock!()">取消代码块</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>标题</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setHeading!(1)">标题1</button>
          <button @click="editor?.commands.setHeading!(2)">标题2</button>
          <button @click="editor?.commands.setHeading!(3)">标题3</button>
          <button @click="editor?.commands.setHeading!(4)">标题4</button>
          <button @click="editor?.commands.setHeading!(5)">标题5</button>
          <button @click="editor?.commands.setHeading!(6)">标题6</button>
          <button @click="editor?.commands.unsetHeading!(1)">取消标题1</button>
          <button @click="editor?.commands.unsetHeading!(2)">取消标题2</button>
          <button @click="editor?.commands.unsetHeading!(3)">取消标题3</button>
          <button @click="editor?.commands.unsetHeading!(4)">取消标题4</button>
          <button @click="editor?.commands.unsetHeading!(5)">取消标题5</button>
          <button @click="editor?.commands.unsetHeading!(6)">取消标题6</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>引用</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setBlockquote!()">插入引用</button>
          <button @click="editor?.commands.unsetBlockquote!()">取消引用</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>水平线</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setHorizontal!()">插入水平线</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>附件</legend>
        <div class="toolbar">
          <button
            @click="editor?.commands.setAttachment!({ 'url': 'https://www.so-better.cn/static/attachments/QM6cgjq8GPzY1_c2Ol1GIS68.jpg', 'text': '附件图片' })">上传附件</button>
          <button @click="editor?.commands.updateAttachment!({ 'url': '#', 'text': '附件2' })">更新附件</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>Katex数学公式</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setMath!('\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}')">插入数学公式1</button>
          <button @click="editor?.commands.setMath!('x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}')">插入数学公式2</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>表格</legend>
        <div class="toolbar">
          <button @click="editor?.commands.setTable!({ rows: 5, columns: 5 })">插入 5 x 5 表格</button>
          <button @click="editor?.commands.unsetTable!()">删除表格</button>
          <button @click="editor?.commands.addColumn!('right')">向右插入列</button>
          <button @click="editor?.commands.addColumn!('left')">向左插入列</button>
          <button @click="editor?.commands.addRow!('top')">向上插入行</button>
          <button @click="editor?.commands.addRow!('bottom')">向下插入行</button>
          <button @click="editor?.commands.mergeCell!('left')">向左合并单元格</button>
          <button @click="editor?.commands.mergeCell!('right')">向右合并单元格</button>
          <button @click="editor?.commands.mergeCell!('top')">向上合并单元格</button>
          <button @click="editor?.commands.mergeCell!('bottom')">向下合并单元格</button>
          <button @click="editor?.commands.deleteRow!()">删除行</button>
          <button @click="editor?.commands.deleteColumn!()">删除列</button>
        </div>
      </fieldset>
    </div>
    <div class="right">
      <div id="editor" style="height: 100%;"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Editor, KNode, AttachmentExtension } from '../src'
import { content } from "./content"

const count = ref<number>(0)
const editor = ref<Editor | null>(null)

onMounted(async () => {
  editor.value = await Editor.configure({
    value: '<ol><li>一级分类1<ol><li>二级分类1<ol><li>三级分类1</li><li>三级分类2</li><li>三级分类3</li></ol></li><li>二级分类2</li></ol></li><li>一级分类2</li></ol>',
    extensions: [AttachmentExtension({ icon: 'https://www.so-better.cn/static/attachments/h9PNcA0uJkWOZx971URJzLvn.jpg' })],
    el: '#editor',
    editable: true,
    allowPasteHtml: true,
    placeholder: '请输入内容...',
    afterUpdateView() {
      count.value = this.getContent().trim().length
    },
  })
})

const insertNode = () => {
  editor.value!.selection.start!.node.getRootBlock().children = []
  editor.value?.updateView()
}
</script>
<style lang="less">
html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  outline: none;
}

#app {
  height: 100%;
  overflow-y: auto;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 100%;

  .left,
  .right {
    display: block;
    width: 60%;
    position: relative;
    height: 100%;
    padding: 10px;
  }

  .left {
    overflow: auto;
    width: 40%;

    .toolbar {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;

      button {
        margin: 5px;
      }
    }
  }
}
</style>
