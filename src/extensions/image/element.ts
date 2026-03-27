export const Image_NODE_TAG = 'kaitify-image'

class ImageElement extends HTMLElement {
  constructor() {
    super()
  }

  /**
   * dom挂载，首次渲染
   */
  connectedCallback() {
    this.innerHTML = `<img />`
    const img = this.querySelector('img')!
    img.src = this.getAttribute('data-src') ?? ''
    img.alt = this.getAttribute('data-alt') ?? ''
  }

  /**
   * 属性更新时更新内容
   */
  attributeChangedCallback(name: string, _: string, newValue: string) {
    const img = this.querySelector('img')
    if (!img) return
    if (name === 'data-src') img.src = newValue ?? ''
    if (name === 'data-alt') img.alt = newValue ?? ''
  }

  static get observedAttributes() {
    return ['data-src', 'data-alt']
  }
}

customElements.define(Image_NODE_TAG, ImageElement)
