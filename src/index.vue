<script setup name="alex-editor">
import { onBeforeUnmount, onMounted } from 'vue'
import AlexElement from './Element'
import AlexPoint from './Point'
import AlexRange from './Range'
import Util from './Util'
import propsValue from './Props'

//定义属性
let props = defineProps(propsValue)

//定义事件
let emits = defineEmits(['update:modelValue'])

//编辑器的dom元素
let $el = ref(null)

//定义range
let range = null

//是否正在输入中文
let isInputChinese = false

//将html内容存转为AlexElement数据结构并存放到堆栈中
AlexElement.elementStack = AlexElement.parseHtml(props.modelValue, props.renderRules)
//对堆栈中的数据进行格式化
AlexElement.formatElements()

//函数：渲染编辑器dom内容，同时更新modelValue的值
const renderEditor = function () {
	$el.value.innerHTML = ''
	AlexElement.elementStack.forEach(element => {
		let elm = element.renderElement()
		$el.value.appendChild(elm)
	})
	emits('update:modelValue', $el.value.innerHTML)
}
//函数：初始化设置range
const initRange = function () {
	const firstElement = AlexElement.elementStack[0].getRealNode($el.value)
	const anchor = new AlexPoint(firstElement, 0)
	const focus = new AlexPoint(firstElement, 0)
	range = new AlexRange($el.value, anchor, focus)
}
//函数：监听selection改变
const selectionChange = function () {
	//如果是中文输入则不更新range
	if (isInputChinese) {
		return
	}
	const $range = window.getSelection().getRangeAt(0)
	//如果选区是在编辑器内更新alexRange
	if ($range && Util.isContains($el.value, $range.startContainer) && Util.isContains($el.value, $range.endContainer)) {
		const anchor = new AlexPoint($range.startContainer, $range.startOffset)
		const focus = new AlexPoint($range.endContainer, $range.endOffset)
		range = new AlexRange($el.value, anchor, focus)
	}
}
//函数：监听输入内容
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
	}
	//格式化
	AlexElement.formatElements()
	//渲染编辑器
	renderEditor()
	//设置光标
	range.setCursor()
}
//函数：监听中文输入
const chineseInputHandler = function (type, e) {
	e.preventDefault()
	if (type == 'start') {
		isInputChinese = true
	}
	if (type == 'end') {
		isInputChinese = false
		//在中文输入结束后插入数据
		range.insertText(e.data)
		//格式化
		AlexElement.formatElements()
		//渲染编辑器
		renderEditor()
		//设置光标
		range.setCursor()
	}
}

//钩子函数：组件渲染后
onMounted(() => {
	//初始化渲染编辑器内容
	renderEditor()
	//初始化设置range
	initRange()
	//如果设置了自动获取焦点将光标定位到文档最后
	if (props.autofocus) {
		range.collapseToEnd()
	}
	//设置selection的监听更新range
	document.addEventListener('selectionchange', selectionChange)
})
//钩子函数：组件卸载前
onBeforeUnmount(() => {
	//移除对selection的监听
	document.removeEventListener('selectionchange', selectionChange)
})

//对外暴露的函数和属性
defineExpose({
	//获取range
	getCurrentRange: () => {
		return range
	},
	//重新渲染编辑器
	reRender: () => {
		AlexElement.formatElements()
		renderEditor()
		range.setCursor()
	}
})
</script>
<template>
	<div ref="$el" @beforeinput="beforeInput" @compositionstart="chineseInputHandler('start', $event)" @compositionupdate="chineseInputHandler('update', $event)" @compositionend="chineseInputHandler('end', $event)" :contenteditable="!disabled"></div>
</template>
<style lang="less"></style>
