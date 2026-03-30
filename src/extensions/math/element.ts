import KaTex from 'katex'
import 'katex/dist/katex.css'
export const MATH_NODE_TAG = 'kaitify-math'

class MathElement extends HTMLElement {
  constructor() {
    super()
  }

  /**
   * dom挂载，首次渲染
   */
  connectedCallback() {
    this.innerHTML = `<span>${KaTex.renderToString(this.getAttribute('data-value') ?? '', {
      output: 'html',
      throwOnError: false
    })}</span>`
  }

  /**
   * 属性更新时更新内容
   */
  attributeChangedCallback(name: string, _: string, newValue: string) {
    if (name === 'data-value') {
      this.innerHTML = `<span>${KaTex.renderToString(newValue, {
        output: 'html',
        throwOnError: false
      })}</span>`
    }
  }

  static get observedAttributes() {
    return ['data-value']
  }
}

if (!customElements.get(MATH_NODE_TAG)) {
  customElements.define(MATH_NODE_TAG, MathElement)
}
