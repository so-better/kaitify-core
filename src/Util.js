const dataName = '_alex-editor-datas'
let Util = {
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
	//是否dom元素，text表示是否考虑文本元素
	isElement(el, text) {
		if (text) {
			return el && (el.nodeType === 1 || el.nodeType === 3) && el instanceof Node
		}
		return el && el.nodeType === 1 && el instanceof Node
	},
	//是否window
	isWindow(data) {
		if (data && data.constructor && data.constructor.name) {
			return data.constructor.name == 'Window'
		}
		return false
	},
	//移除指定数据
	removeData(el, key) {
		if (!(el instanceof Document) && !this.isElement(el, true) && !this.isWindow(el)) {
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
		if (!(el instanceof Document) && !this.isElement(el, true) && !this.isWindow(el)) {
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
		if (!(el instanceof Document) && !this.isElement(el, true) && !this.isWindow(el)) {
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
		if (!(el instanceof Document) && !this.isElement(el, true) && !this.isWindow(el)) {
			throw new TypeError('The first argument must be an element')
		}
		if (key === undefined || key === null || key === '') {
			throw new TypeError('The second parameter must be a unique key')
		}
		let data = el[dataName] || {}
		data[key] = value
		el[dataName] = data
	},
	//生成唯一key
	getUniqueKey() {
		//获取唯一id
		let key = this.getData(window, 'data-alex-editor-key') || 0
		key++
		this.setData(window, 'data-alex-editor-key', key)
		return key
	}
}
//解析绑定事件名称字符串
const parseEventName = eventName => {
	//先以空格划分
	let eventNames = eventName.split(/[\s]+/g)
	let result = []
	eventNames.forEach(name => {
		let arr = name.split('.')
		let obj = {
			eventName: arr[0]
		}
		if (arr.length > 1) {
			obj.guid = arr[1]
		}
		result.push(obj)
	})
	return result
}
//更新事件对象，移除空的元素
const updateEvents = events => {
	let obj = {}
	let keys = Object.keys(events)
	keys.forEach(key => {
		if (events[key]) {
			obj[key] = events[key]
		}
	})
	return obj
}
//给元素添加单个事件
const bindSingleListener = (el, eventName, guid, fn, options) => {
	//获取该元素上的事件对象
	let events = Util.getData(el, 'data-alex-editor-events') || {}
	//如果没有设定guid
	if (!guid) {
		//从该元素上拿到记录的guid值
		guid = Util.getData(el, 'data-alex-editor-guid') || 0
		//更新guid
		Util.setData(el, 'data-alex-editor-guid', guid + 1)
	}
	//更改guid，结合事件名称作为存储的key值
	guid = eventName + '_' + guid
	//先判断是否已经含有同guid且同类型事件，有则移除
	if (events[guid] && events[guid].type == eventName) {
		el.removeEventListener(eventName, events[guid].fn, events[guid].options)
	}
	//添加事件
	el.addEventListener(eventName, fn, options)
	//添加到events对象里，并更新到节点上
	events[guid] = {
		type: eventName,
		fn: fn,
		options: options
	}
	Util.setData(el, 'data-alex-editor-events', events)
}
//移除元素的单个事件
const unbindSingleListener = (el, eventName, guid) => {
	let events = dataUtil.get(el, 'data-alex-editor-events') || {}
	let keys = Object.keys(events)
	let length = keys.length
	for (let i = 0; i < length; i++) {
		let key = keys[i]
		if (events[key].type == eventName) {
			//如果guid存在则移除该修饰符指定的事件，否则移除全部该类型事件
			if (guid) {
				if (key == eventName + '_' + guid) {
					el.removeEventListener(events[key].type, events[key].fn, events[key].options)
					events[key] = undefined
				}
			} else {
				el.removeEventListener(events[key].type, events[key].fn, events[key].options)
				events[key] = undefined
			}
		}
	}
	//更新events
	events = updateEvents(events)
	Util.setData(el, 'data-alex-editor-events', events)
}
export default {
	...Util,
	/**
	 * 绑定事件
	 * @param {Object} el 元素节点
	 * @param {Object} eventName 事件名称
	 * @param {Object} fn 函数
	 * @param {Object} options 参数
	 */
	on(el, eventName, fn, options) {
		//参数el校验
		if (!(el instanceof Document) && !Util.isElement(el) && !Util.isWindow(el)) {
			throw new TypeError('The first argument must be an element node')
		}
		//参数eventName校验
		if (!eventName || typeof eventName != 'string') {
			throw new TypeError('The second argument must be a string')
		}
		//参数fn校验
		if (!fn || typeof fn != 'function') {
			throw new TypeError('The third argument must be a function')
		}
		//参数options校验
		if (!Util.isObject(options)) {
			options = {}
		}
		//解析eventName，获取事件数组以及guid标志
		const result = parseEventName(eventName)
		//批量添加事件
		result.forEach(res => {
			bindSingleListener(el, res.eventName, res.guid, fn.bind(el), options)
		})
	},

	/**
	 * 事件解绑
	 * @param {Object} el 元素节点
	 * @param {Object} eventName 事件名称
	 */
	off(el, eventName) {
		//参数el校验
		if (!(el instanceof Document) && !Util.isElement(el) && !Util.isWindow(el)) {
			throw new TypeError('The first argument must be an element node')
		}
		let events = Util.getData(el, 'data-alex-editor-events')
		if (!events) {
			return
		}
		//事件名称不存在，则移除该元素的全部事件
		if (!eventName) {
			let keys = Object.keys(events)
			let length = keys.length
			for (let i = 0; i < length; i++) {
				let key = keys[i]
				el.removeEventListener(events[key].type, events[key].fn, events[key].options)
			}
			Util.removeData(el, 'data-alex-editor-eventss')
			Util.removeData(el, 'data-alex-editor-guid')
			return
		}
		//解析eventName，获取事件数组以及guid标志
		const result = parseEventName(eventName)
		result.forEach(res => {
			unbindSingleListener(el, res.eventName, res.guid)
		})
	}
}
