export const IMAGE_NODE_TAG = 'kaitify-image'

class ImageElement extends HTMLElement {
  constructor() {
    super()
  }

  /**
   * dom挂载，首次渲染
   */
  connectedCallback() {
    this.innerHTML = `<span is-indicator></span><img />`
    const image = this.querySelector('img')!
    const src = this.getAttribute('data-src')
    const alt = this.getAttribute('data-alt')
    if (src) {
      image.setAttribute('src', src)
    }
    if (alt) {
      image.setAttribute('alt', alt)
    }
  }

  /**
   * 属性更新时更新内容
   */
  attributeChangedCallback(name: string, _: string, newValue: string) {
    const image = this.querySelector('img')
    if (!image) return
    if (name === 'data-src') {
      if (newValue) {
        image.setAttribute('src', newValue)
      } else {
        image.removeAttribute('src')
      }
    }
    if (name === 'data-alt') {
      if (newValue) {
        image.setAttribute('alt', newValue)
      } else {
        image.removeAttribute('alt')
      }
    }
  }

  static get observedAttributes() {
    return ['data-src', 'data-alt']
  }
}

customElements.define(IMAGE_NODE_TAG, ImageElement)
