<script setup name="alex-editor">
import { onBeforeUnmount, onMounted } from 'vue'
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
//是否正在输入中文
let isInputChinese = false
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
	//如果是中文输入则不更新range
	if (isInputChinese) {
		return
	}
	const $range = window.getSelection().getRangeAt(0)
	//如果选区是在编辑器内更新alexRange
	if ($range && Util.isContains(el.value, $range.startContainer) && Util.isContains(el.value, $range.endContainer)) {
		const anchor = new AlexPoint($range.startContainer, $range.startOffset)
		const focus = new AlexPoint($range.endContainer, $range.endOffset)
		range = new AlexRange(el.value, anchor, focus)
	}
}

onMounted(() => {
	//初始化渲染编辑器内容
	renderEditor()
	//初始化设置range
	initRange()
	//如果设置了自动获取焦点
	if (props.autofocus) {
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
	//如果输入中文，则不更新编辑器
	if (e.inputType == 'insertCompositionText') {
		return
	}
	switch (e.inputType) {
		//输入操作
		case 'insertText':
			range.insertText(e.data)
			break
		//删出操作
		case 'deleteContentBackward':
			range.delete()
			break
		//插入段落
		case 'insertParagraph':
			range.insertParagraph(props.renderRules)
			break
		default:
			break
	}
	AlexElement.formatElements()
	renderEditor()
	range.setCursor()
}
//中文输入结束
const chineseInputHandler = function (type, e) {
	e.preventDefault()
	if (type == 'start') {
		isInputChinese = true
	}
	if (type == 'end') {
		isInputChinese = false
		range.insertText(e.data)
		AlexElement.formatElements()
		renderEditor()
		range.setCursor()
	}
}

//中文输入开始
</script>
<template>
	<div ref="el" @beforeinput="beforeInput" @compositionstart="chineseInputHandler('start', $event)" @compositionupdate="chineseInputHandler('update', $event)" @compositionend="chineseInputHandler('end', $event)" :contenteditable="!disabled"></div>
</template>
<style lang="less"></style>
