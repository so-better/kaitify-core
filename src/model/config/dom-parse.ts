import { KNodeStylesType } from '../KNode'

/**
 * 块节点的转换类型
 */
export type BlockParseType = {
	/**
	 * dom标签
	 */
	tag: string
	/**
	 * 如果为true则表示会将该dom转为编辑器配置的默认块节点
	 */
	parse?: boolean
	/**
	 * 如果为true则表示会将该dom转为块节点后设置为固定状态
	 */
	fixed?: boolean
}
/**
 * 行内节点的转换类型
 */
export type InlineParseType = {
	/**
	 * dom标签
	 */
	tag: string
	/**
	 * 如果是true表示会将该dom转为编辑器配置的默认行内节点
	 * 如果是对象值的话则表示不仅会将该dom转为编辑器配置的默认行内节点，而且会设置固定的style样式，对象的value支持函数，会在将dom转为编辑器配置的默认行内节点时自动执行该函数获取结果，该函数参数分别是编辑器实例和dom
	 */
	parse?: boolean | KNodeStylesType | { [style: string]: string | number | ((element: HTMLElement) => string | number) }
}
/**
 * 闭合节点的转换类型
 */
export type ClosedParseType = {
	/**
	 * dom标签
	 */
	tag: string
}
/**
 * 定义需要转为块节点的dom
 */
export const blockParse: BlockParseType[] = [
	{
		tag: 'p'
	},
	{
		tag: 'div'
	},
	{
		tag: 'table'
	},
	{
		tag: 'ul'
	},
	{
		tag: 'ol'
	},
	{
		tag: 'h1'
	},
	{
		tag: 'h2'
	},
	{
		tag: 'h3'
	},
	{
		tag: 'h4'
	},
	{
		tag: 'h5'
	},
	{
		tag: 'h6'
	},
	{
		tag: 'blockquote'
	},
	{
		tag: 'pre'
	},
	{
		tag: 'address',
		parse: true
	},
	{
		tag: 'article',
		parse: true
	},
	{
		tag: 'aside',
		parse: true
	},
	{
		tag: 'nav',
		parse: true
	},
	{
		tag: 'section',
		parse: true
	},
	{
		tag: 'li'
	},
	{
		tag: 'tfoot',
		fixed: true
	},
	{
		tag: 'tbody',
		fixed: true
	},
	{
		tag: 'thead',
		fixed: true
	},
	{
		tag: 'tr',
		fixed: true
	},
	{
		tag: 'th',
		fixed: true
	},
	{
		tag: 'td',
		fixed: true
	},
	{
		tag: 'colgroup',
		fixed: true
	}
]
/**
 * 定义需要转为行内节点的dom
 */
export const inlineParse: InlineParseType[] = [
	{
		tag: 'span'
	},
	{
		tag: 'a'
	},
	{
		tag: 'label'
	},
	{
		tag: 'code'
	},
	{
		tag: 'b',
		parse: {
			fontWeight: 'bold'
		}
	},
	{
		tag: 'strong',
		parse: {
			fontWeight: 'bold'
		}
	},
	{
		tag: 'sup',
		parse: {
			verticalAlign: 'super'
		}
	},
	{
		tag: 'sub',
		parse: {
			verticalAlign: 'sub'
		}
	},
	{
		tag: 'i',
		parse: {
			fontStyle: 'italic'
		}
	},
	{
		tag: 'u',
		parse: {
			textDecorationLine: 'underline'
		}
	},
	{
		tag: 'del',
		parse: {
			textDecorationLine: 'line-through'
		}
	},
	{
		tag: 'abbr',
		parse: true
	},
	{
		tag: 'acronym',
		parse: true
	},
	{
		tag: 'bdo',
		parse: true
	},
	{
		tag: 'font',
		parse: {
			fontFamily: (element: HTMLElement) => {
				return element.getAttribute('face') || ''
			}
		}
	}
]
/**
 * 定义需要转为闭合节点的dom
 */
export const closedParse: ClosedParseType[] = [
	{
		tag: 'br'
	},
	{
		tag: 'col'
	},
	{
		tag: 'img'
	},
	{
		tag: 'hr'
	},
	{
		tag: 'video'
	},
	{
		tag: 'audio'
	}
]
