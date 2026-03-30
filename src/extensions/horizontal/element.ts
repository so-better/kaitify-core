export const HORIZONTAL_NODE_TAG = 'kaitify-horizontal'

if (typeof HTMLElement !== 'undefined' && !customElements.get(HORIZONTAL_NODE_TAG)) {
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

  customElements.define(HORIZONTAL_NODE_TAG, HorizontalElement)
}
