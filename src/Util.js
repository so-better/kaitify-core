import Dap from 'dap-util'
export default {
	//获取属性集合
	getAttributes(el) {
		let o = {}
		for (let attribute of el.attributes) {
			//匹配事件、样式外的属性
			if (!/^on/g.test(attribute.nodeName) && attribute.nodeName != 'style') {
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
	flatNodes(nodes) {
		const flat = arr => {
			let result = []
			arr.forEach(node => {
				if (Dap.element.isElement(node, true)) {
					result.push(node)
					const childNodes = Array.from(node.childNodes)
					if (childNodes.length) {
						let arr = flat(childNodes)
						result = [...result, ...arr]
					}
				}
			})
			return result
		}
		return flat(nodes)
	}
}
