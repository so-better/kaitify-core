/**
 * 在将node转为AlexElement数据时默认的行内元素
 */
export default [
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
		parse: true
	}
]
