export const HORIZONTAL_NODE_TAG = 'kaitify-horizontal'

class HorizontalElement extends HTMLElement {
  constructor() {
    super()
  }

  /**
   * dom挂载，首次渲染
   */
  connectedCallback() {
    this.innerHTML = `<span><hr /></span>`
  }
}

if (customElements.get(HORIZONTAL_NODE_TAG)) {
  customElements.define(HORIZONTAL_NODE_TAG, HorizontalElement)
}
