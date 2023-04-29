const dataName = '_alex-editor-datas'
export default {
	//获取属性集合
	getAttributes(el) {
		let o = {}
		for (let attribute of el.attributes) {
			//匹配事件、样式和标记外的属性
			if (!/^on/g.test(attribute.nodeName) && attribute.nodeName != 'style' && attribute.nodeName != 'data-alex-editor-element') {
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
	//是否对象
	isObject(val) {
		if (typeof val === 'object' && val) {
			return true
		}
		return false
	},
	//是否空对象
	isEmptyObject(obj) {
		if (this.isObject(obj)) {
			return Object.keys(obj).length == 0
		}
		return false
	},
	//判断元素节点包含关系
	isContains(parentNode, childNode) {
		if (parentNode === childNode) {
			return true
		}
		//如果浏览器支持contains
		if (parentNode.contains) {
			return parentNode.contains(childNode)
		}
		//火狐支持
		if (parentNode.compareDocumentPosition) {
			return !!(parentNode.compareDocumentPosition(childNode) & 16)
		}
	},
	//是否dom元素
	isElement(el) {
		return el && el.nodeType === 1 && el instanceof Node
	},
	//是否window
	isWindow(data) {
		if (data && data.constructor && data.constructor.name) {
			return data.constructor.name == 'Window'
		}
		return false
	},
	//生成唯一key
	getUniqueKey() {
		//获取唯一id
		let key = this.getData(window, 'data-alex-editor-element') || 0
		key++
		this.setData(window, 'data-alex-editor-element', key)
		return key
	},
	//移除指定数据
	removeData(el, key) {
		if (!this.isElement(el) && !this.isWindow(el)) {
			throw new TypeError('The first argument must be an element')
		}
		let data = el[dataName] || {}
		//未指定参数,删除全部
		if (key === undefined || key === null || key === '') {
			el[dataName] = {}
		} else {
			delete data[key]
			el[dataName] = data
		}
	},
	//判断是否含有指定数据
	hasData(el, key) {
		if (!this.isElement(el) && !this.isWindow(el)) {
			throw new TypeError('The first argument must be an element')
		}
		if (key === undefined || key === null || key === '') {
			throw new TypeError('The second parameter must be a unique key')
		}
		let data = el[dataName] || {}
		return data.hasOwnProperty(key)
	},
	//获取元素指定数据
	getData(el, key) {
		if (!this.isElement(el) && !this.isWindow(el)) {
			throw new TypeError('The first argument must be an element')
		}
		let data = el[dataName] || {}
		//未指定参数,返回全部
		if (key === undefined || key === null || key === '') {
			return data
		} else {
			return data[key]
		}
	},
	//获取元素指定数据
	setData(el, key, value) {
		if (!this.isElement(el) && !this.isWindow(el)) {
			throw new TypeError('The first argument must be an element')
		}
		if (key === undefined || key === null || key === '') {
			throw new TypeError('The second parameter must be a unique key')
		}
		let data = el[dataName] || {}
		data[key] = value
		el[dataName] = data
	}
}
