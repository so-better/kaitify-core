import Dap from 'dap-util'
export default {
	//获取属性集合
	getAttributes(el) {
		let o = {}
		const length = el.attributes.length
		for (let i = 0; i < length; i++) {
			const attribute = el.attributes[i]
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
			const styles = el.getAttribute('style')
			let i = 0
			let start = 0
			let splitStyles = []
			while (i < styles.length) {
				if (styles[i] == ';' && styles.substring(i + 1, i + 8) != 'base64,') {
					splitStyles.push(styles.substring(start, i))
					start = i + 1
				}
				//到最后了，并且最后没有分号
				if (i == styles.length - 1 && start < i) {
					splitStyles.push(styles.substring(start, i))
				}
				i++
			}
			splitStyles.forEach(style => {
				const index = style.indexOf(':')
				const property = style.substring(0, index).trim()
				const value = style.substring(index + 1).trim()
				o[property] = value
			})
		}
		return o
	},
	//生成唯一key
	createUniqueKey() {
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
		//获取唯一id
		let key = Dap.data.get(window, 'data-alex-editor-guid') || 0
		key++
		Dap.data.set(window, 'data-alex-editor-guid', key)
		return key
	}
}
