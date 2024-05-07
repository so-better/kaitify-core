import { ObjectType } from './tool'

export type NodeBlockParseType = {
	parsedom: string
	parse?: boolean
}

export type NodeClosedParseType = {
	parsedom: string
}

export type NodeInblockParseType = {
	parsedom: string
	block?: boolean
}

export type NodeInlineParseType = {
	parsedom: string
	parse?: boolean | ObjectType
}

/**
 * 在将node转为AlexElement数据时默认的根级块元素
 * 如果有parse属性且为true则表示会将该node转为AlexElement.BLOCK_NODE
 */
export const blockParse: NodeBlockParseType[] = [
	{
		parsedom: 'p'
	},
	{
		parsedom: 'div'
	},
	{
		parsedom: 'table'
	},
	{
		parsedom: 'ul'
	},
	{
		parsedom: 'ol'
	},
	{
		parsedom: 'h1'
	},
	{
		parsedom: 'h2'
	},
	{
		parsedom: 'h3'
	},
	{
		parsedom: 'h4'
	},
	{
		parsedom: 'h5'
	},
	{
		parsedom: 'h6'
	},
	{
		parsedom: 'blockquote'
	},
	{
		parsedom: 'pre'
	},
	{
		parsedom: 'address',
		parse: true
	},
	{
		parsedom: 'article',
		parse: true
	},
	{
		parsedom: 'aside',
		parse: true
	},
	{
		parsedom: 'nav',
		parse: true
	},
	{
		parsedom: 'section',
		parse: true
	}
]

/**
 * 在将node转为AlexElement数据时默认的自闭合元素
 */
export const closedParse: NodeClosedParseType[] = [
	{
		parsedom: 'br'
	},
	{
		parsedom: 'col'
	},
	{
		parsedom: 'img'
	},
	{
		parsedom: 'hr'
	},
	{
		parsedom: 'video'
	},
	{
		parsedom: 'audio'
	}
]

/**
 * 在将node转为AlexElement数据时默认的内部块元素
 * 如果有block属性且为true，则表示该node转换后的内部块元素的behavior是"block"而不是默认的"default"
 */
export const inblockParse: NodeInblockParseType[] = [
	{
		parsedom: 'li',
		block: true
	},
	{
		parsedom: 'tfoot'
	},
	{
		parsedom: 'tbody'
	},
	{
		parsedom: 'thead'
	},
	{
		parsedom: 'tr'
	},
	{
		parsedom: 'th'
	},
	{
		parsedom: 'td'
	},
	{
		parsedom: 'colgroup'
	}
]

/**
 * 在将node转为AlexElement数据时默认的行内元素
 * 如果有parse属性且为true表示会将该node转为AlexElement.TEXT_NODE
 * 如果有parse属性且是对象值的话则表示不仅会将该node转为AlexElement.TEXT_NODE，而且会设置固定的style样式
 * 如果parse是对象值，对象的value支持函数，会在将node转为AlexElement时自动执行该函数获取结果，在该函数内this指向AlexEditor实例对象，参数是当前node元素
 */
export const inlineParse: NodeInlineParseType[] = [
	{
		parsedom: 'span'
	},
	{
		parsedom: 'a'
	},
	{
		parsedom: 'label'
	},
	{
		parsedom: 'code'
	},
	{
		parsedom: 'b',
		parse: {
			'font-weight': 'bold'
		}
	},
	{
		parsedom: 'strong',
		parse: {
			'font-weight': 'bold'
		}
	},
	{
		parsedom: 'sup',
		parse: {
			'vertical-align': 'super'
		}
	},
	{
		parsedom: 'sub',
		parse: {
			'vertical-align': 'sub'
		}
	},
	{
		parsedom: 'i',
		parse: {
			'font-style': 'italic'
		}
	},
	{
		parsedom: 'u',
		parse: {
			'text-decoration-line': 'underline'
		}
	},
	{
		parsedom: 'del',
		parse: {
			'text-decoration-line': 'line-through'
		}
	},
	{
		parsedom: 'abbr',
		parse: true
	},
	{
		parsedom: 'acronym',
		parse: true
	},
	{
		parsedom: 'bdo',
		parse: true
	},
	{
		parsedom: 'font',
		parse: {
			'font-family': (node: HTMLElement) => {
				return node.getAttribute('face') || ''
			}
		}
	}
]
