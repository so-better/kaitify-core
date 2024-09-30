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
	/**
	 * 如果为true则表示会将该dom转为块节点后设置为内嵌套状态
	 */
	nested?: boolean
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
	 */
	parse?: boolean
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
		tag: 'li',
		nested: true
	},
	{
		tag: 'tfoot',
		fixed: true,
		nested: true
	},
	{
		tag: 'tbody',
		fixed: true,
		nested: true
	},
	{
		tag: 'thead',
		fixed: true,
		nested: true
	},
	{
		tag: 'tr',
		fixed: true,
		nested: true
	},
	{
		tag: 'th',
		fixed: true,
		nested: true
	},
	{
		tag: 'td',
		fixed: true,
		nested: true
	},
	{
		tag: 'colgroup',
		fixed: true,
		nested: true
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
		tag: 'b'
	},
	{
		tag: 'strong'
	},
	{
		tag: 'sup'
	},
	{
		tag: 'sub'
	},
	{
		tag: 'i'
	},
	{
		tag: 'u'
	},
	{
		tag: 'del'
	},
	{
		tag: 'font'
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
