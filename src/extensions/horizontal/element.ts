export const HORIZONTAL_NODE_TAG = 'kaitify-horizontal'

class HorizontalElement extends HTMLElement {
  constructor() {
    super()
  }

  /**
   * dom挂载，首次渲染，设置事件
   */
  connectedCallback() {
    this.innerHTML = `<hr />`
  }
}

customElements.define(HORIZONTAL_NODE_TAG, HorizontalElement)
