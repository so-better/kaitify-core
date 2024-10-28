<template>
  <div style="padding: 20px">
    <div id="toolbar">
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
    <div id="editor" style="height: 400px;" </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Editor, KNode } from '../src'
import { content } from "./content"
const editor = ref<Editor | null>(null)

const onClick1 = () => {
  //editor.value!.commands.setMath!('\\lim_{n \\to \\infty} \\sum_{k=1}^{n} \\frac{1}{k^2} + \\int_0^1 \\frac{1}{x^2 + 1} \\, dx = \\frac{\\pi^2}{6} + \\frac{\\pi}{2}')
  editor.value!.commands.addColumn!('right')
}

const onClick2 = () => {
  editor.value!.commands.deleteColumn!()
}

onMounted(async () => {
  editor.value = await Editor.configure({
    value: content,
    el: '#editor',
    editable: true,
    allowPasteHtml: true,
    placeholder: '请输入内容...'
  })
  console.log(editor.value!.stackNodes)

})
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

.mvi-text-bold {
  font-size: 40px;
}

#app {
  height: 100%;
  overflow-y: auto;
}

#toolbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 20px;

  button {
    margin: 5px;
  }
}

button+button {
  margin-left: 10px;
}
</style>
