export default {
	//编辑器的值
	modelValue: {
		type: String,
		default: '<p><br></p>'
	},
	//是否禁用
	disabled: {
		type: Boolean,
		default: false
	},
	//渲染html为AlexElement的规则
	renderRules: {
		type: Function
	},
	//是否自动获取焦点
	autofocus: {
		type: Boolean,
		default: false
	}
}
