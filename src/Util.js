import Dap from 'dap-util'
export default {
	//获取属性集合
	getAttributes(el) {
		let o = {}
		for (let attribute of el.attributes) {
			//匹配事件、样式外的属性
			if (!/(^on)|(^style$)|(^contenteditable$)/g.test(attribute.nodeName)) {
				o[attribute.nodeName] = attribute.nodeValue
			}
		}
		return o
	},
	//获取样式集合
	getStyles(el) {
		let o = {}
		if (el.getAttribute('style')) {
			const styles = el
				.getAttribute('style')
				.split(';')
				.filter(item => {
					return item
				})
			for (let style of styles) {
				const res = style.split(':')
				const key = res[0].trim()
				const val = res[1].trim()
				o[key] = val
			}
		}

		return o
	},
	//生成唯一key
	getUniqueKey() {
		//获取唯一id
		let key = Dap.data.get(window, 'data-alex-editor-key') || 0
		key++
		Dap.data.set(window, 'data-alex-editor-key', key)
		return key
	},
	//是否零宽度无断空白字符
	isSpaceText(val) {
		return /^[\uFEFF]+$/g.test(val)
	},
	//深拷贝
	clone(data) {
		if (Dap.common.isObject(data) || Array.isArray(data)) {
			return JSON.parse(JSON.stringify(data))
		}
		return data
	},
	//是否包含
	isContains(parent, target) {
		if (target.nodeType == 3) {
			return Dap.element.isContains(parent, target.parentNode)
		}
		return Dap.element.isContains(parent, target)
	},
	//blob转base64字符串
	blobToBase64(blob) {
		return new Promise(resolve => {
			const fileReader = new FileReader()
			fileReader.onload = e => {
				resolve(e.target.result)
			}
			fileReader.readAsDataURL(blob)
		})
	},
	//生成唯一值
	createGuid() {
		//获取当前guid，不存在则从0开始
		let guid = Dap.data.get(document.documentElement, 'mvi-editor-guid') || 0
		guid++
		Dap.data.set(document.body, 'mvi-editor-guid', guid)
		return guid
	}
}
