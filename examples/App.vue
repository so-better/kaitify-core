<template>
    <div style="padding: 20px">
        <div id="toolbar">
            <sup>333</sup>
            <button @click="onClick1">插入图片</button>
            <button @click="onClick2">删除图片</button>
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
    editor.value!.commands.canMergeCells!('top')
}

const onClick2 = () => {
    editor.value!.commands.allCodeBlock!() ? editor.value!.commands.unsetCodeBlock!() : editor.value!.commands.setCodeBlock!()
}

onMounted(async () => {
    editor.value = await Editor.configure({
        value: content,
        el: '#editor',
        editable: true,
        allowPasteHtml: true,
        placeholder: '请输入内容...',
    })
    console.log(editor.value!.stackNodes);

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

    button+button {
        margin-left: 10px;
    }
}

button+button {
    margin-left: 10px;
}
</style>
