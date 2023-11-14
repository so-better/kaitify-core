import Dap from 'dap-util'
/**
 * 获取node元素的属性集合
 */
export const getAttributes = node => {
	let o = {}
	const length = node.attributes.length
	for (let i = 0; i < length; i++) {
		const attribute = node.attributes[i]
		//匹配事件、样式外的属性
		if (!/(^on)|(^style$)|(^contenteditable$)|(^face$)/g.test(attribute.nodeName)) {
			o[attribute.nodeName] = attribute.nodeValue
		}
	}

	return o
}

/**
 * 获取node元素的样式集合
 */
export const getStyles = node => {
	let o = {}
	if (node.getAttribute('style')) {
		const styles = node.getAttribute('style')
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
}

/**
 * 生成唯一的key
 */
export const createUniqueKey = () => {
	//获取唯一id
	let key = Dap.data.get(window, 'data-alex-editor-key') || 0
	key++
	Dap.data.set(window, 'data-alex-editor-key', key)
	return key
}

/**
 * 生成唯一的guid
 */
export const createGuid = () => {
	//获取唯一id
	let key = Dap.data.get(window, 'data-alex-editor-guid') || 0
	key++
	Dap.data.set(window, 'data-alex-editor-guid', key)
	return key
}

/**
 * 判断字符串是否零宽度无断空白字符
 */
export const isSpaceText = val => {
	return /^[\uFEFF]+$/g.test(val)
}

/**
 * 深拷贝函数
 */
export const cloneData = data => {
	if (Dap.common.isObject(data) || Array.isArray(data)) {
		return JSON.parse(JSON.stringify(data))
	}
	return data
}

/**
 * 判断某个node是否包含另一个node
 */
export const isContains = (parentNode, childNode) => {
	if (childNode.nodeType == 3) {
		return Dap.element.isContains(parentNode, childNode.parentNode)
	}
	return Dap.element.isContains(parentNode, childNode)
}

/**
 * blob对象转base64字符串
 */
export const blobToBase64 = blob => {
	return new Promise(resolve => {
		const fileReader = new FileReader()
		fileReader.onload = e => {
			resolve(e.target.result)
		}
		fileReader.readAsDataURL(blob)
	})
}

/**
 * 判断是否可以使用Clipboard
 */
export const canUseClipboard = () => {
	if (!window.ClipboardItem) {
		console.warn("window.ClipboardItem must be obtained in a secure environment, such as localhost, 127.0.0.1, or https, so the editor's copy, paste, and cut functions cannot be used")
		return false
	}
	if (!navigator.clipboard) {
		console.warn("navigator.clipboard must be obtained in a secure environment, such as localhost, 127.0.0.1, or https, so the editor's copy, paste, and cut functions cannot be used")
		return false
	}
	return true
}

/**
 * 初始化编辑器dom
 */
export const initEditorNode = node => {
	//判断是否字符串，如果是字符串按照选择器来寻找元素
	if (typeof node == 'string' && node) {
		node = document.body.querySelector(node)
	}
	//如何node不是元素则抛出异常
	if (!Dap.element.isElement(node)) {
		throw new Error('You must specify a dom container to initialize the editor')
	}
	//如果已经初始化过了则抛出异常
	if (Dap.data.get(node, 'data-alex-editor-init')) {
		throw new Error('The element node has been initialized to the editor')
	}
	//添加初始化的标记
	Dap.data.set(node, 'data-alex-editor-init', true)

	return node
}

/**
 * 格式化编辑器的options参数
 */
export const initEditorOptions = options => {
	let opts = {
		//是否禁用
		disabled: false,
		//自定义渲染规则
		renderRules: [],
		//编辑器的默认html值
		value: '',
		//是否允许复制
		allowCopy: true,
		//是否允许粘贴
		allowPaste: true,
		//是否允许剪切
		allowCut: true,
		//是否允许粘贴html
		allowPasteHtml: false,
		//自定义纯文本粘贴方法
		customTextPaste: null,
		//自定义html粘贴方法
		customHtmlPaste: null,
		//自定义图片粘贴方法
		customImagePaste: null,
		//自定义视频粘贴方法
		customVideoPaste: null
	}
	if (Dap.common.isObject(options)) {
		if (typeof options.disabled == 'boolean') {
			opts.disabled = options.disabled
		}
		if (Array.isArray(options.renderRules)) {
			opts.renderRules = options.renderRules
		}
		if (typeof options.value == 'string' && options.value) {
			opts.value = options.value
		}
		if (typeof options.allowCopy == 'boolean') {
			opts.allowCopy = options.allowCopy
		}
		if (typeof options.allowPaste == 'boolean') {
			opts.allowPaste = options.allowPaste
		}
		if (typeof options.allowCut == 'boolean') {
			opts.allowCut = options.allowCut
		}
		if (typeof options.allowPasteHtml == 'boolean') {
			opts.allowPasteHtml = options.allowPasteHtml
		}
		if (typeof options.customTextPaste == 'function') {
			opts.customTextPaste = options.customTextPaste
		}
		if (typeof options.customHtmlPaste == 'function') {
			opts.customHtmlPaste = options.customHtmlPaste
		}
		if (typeof options.customImagePaste == 'function') {
			opts.customImagePaste = options.customImagePaste
		}
		if (typeof options.customVideoPaste == 'function') {
			opts.customVideoPaste = options.customVideoPaste
		}
	}
	return opts
}
