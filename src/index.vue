<script setup name="alex-editor">
import { onBeforeUnmount, onMounted, watch } from 'vue'
import AlexElement from './Element'
import AlexPoint from './Point'
import AlexRange from './Range'
import Util from './Util'
import _props from './Props'

//定义属性
let props = defineProps(_props)
//定义事件
defineEmits(['update:modelValue'])

//编辑器的dom元素
let el = ref(null)
//定义range
let range = null
//将html内容存转为AlexElement数据结构并存放到堆栈中
AlexElement.elementStack = AlexElement.parseHtml(props.modelValue, props.renderRules)
//进行格式化
AlexElement.formatElements()

//渲染编辑器dom内容
const renderEditor = function () {
	el.value.innerHTML = ''
	AlexElement.elementStack.forEach(element => {
		let elm = element.renderElement()
		el.value.appendChild(elm)
	})
}
//初始化设置range
const initRange = function () {
	const firstElement = AlexElement.elementStack[0].getRealNode(el.value)
	const anchor = new AlexPoint(firstElement, 0)
	const focus = new AlexPoint(firstElement, 0)
	range = new AlexRange(el.value, anchor, focus)
}
//定义监听selection改变的方法
const selectionChange = function () {
	const $range = window.getSelection().getRangeAt(0)
	//如果选区是在编辑器内更新alexRange
	if ($range && Util.isContains(el.value, $range.startContainer) && Util.isContains(el.value, $range.endContainer)) {
		const anchor = new AlexPoint($range.startContainer, $range.startOffset)
		const focus = new AlexPoint($range.endContainer, $range.endOffset)
		range = new AlexRange(el.value, anchor, focus)
	}
}
onMounted(() => {
	renderEditor()
	if (props.autofocus) {
		if (!range) {
			initRange()
		}
		range.collapseToEnd()
	}
	document.addEventListener('selectionchange', selectionChange)
})
onBeforeUnmount(() => {
	document.removeEventListener('selectionchange', selectionChange)
})
//输入内容之前
const beforeInput = function (e) {
	e.preventDefault()
	//输入
	if (e.inputType == 'insertText') {
		range.insert(e.data)
	}
	//删除
	else if (e.inputType == 'deleteContentBackward') {
		range.delete()
	}
	//换行
	else if (e.inputType == 'insertParagraph') {
	}
	AlexElement.formatElements()
	renderEditor()
	range.setCusor()
}
//中文输入结束
const compositionend = function (e) {
	e.preventDefault()
	console.log(e.data)
}
</script>
<template>
	<div ref="el" @beforeinput="beforeInput" @compositionend="compositionend" :contenteditable="!disabled"></div>
</template>
<style lang="less"></style>
