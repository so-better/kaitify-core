import { Editor, Extension, KNode, KNodeMarksType } from '../src'

class MyComponent extends HTMLElement {
  constructor() {
    super()
  }

  render() {
    this.contentEditable = 'false'
    this.innerHTML = `<span>${this.getAttribute('url') || '未知地址'}</span>`
  }

  connectedCallback() {
    console.log('挂载', this)
    this.render()
  }

  disconnectedCallback() {
    console.log('移出', this)
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log('属性发生变化', name, oldValue, newValue)
    if (name === 'url') {
      this.render()
    }
  }

  static get observedAttributes() {
    return ['url']
  }
}

customElements.define('my-component', MyComponent)

export const MyComponentExtension = Extension.create({
  name: 'my-component',
  extraKeepTags: ['my-component'],
  onDomParseNode(node: KNode) {
    if (
      node.isMatch({
        tag: 'my-component'
      })
    ) {
      node.type = 'closed'
      node.children = undefined
    }
    return node
  },
  onPasteKeepMarks(node: KNode) {
    const marks: KNodeMarksType = {}
    if (
      node.isMatch({
        tag: 'my-component'
      })
    ) {
      marks['url'] = node.marks?.['url'] || ''
    }
    return marks
  },
  formatRules: [
    ({ node }: { editor: Editor; node: KNode }) => {
      if (
        node.isMatch({
          tag: 'my-component'
        })
      ) {
        node.type = 'closed'
        node.children = undefined
      }
    }
  ]
})
