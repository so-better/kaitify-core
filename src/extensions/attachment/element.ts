export const ATTACHMENT_NODE_TAG = 'kaitify-attachment'

class AttachmentElement extends HTMLElement {
  constructor() {
    super()
  }

  /**
   * dom挂载，首次渲染
   */
  connectedCallback() {
    this.innerHTML = `<span is-icon></span><span is-text></span>`
    this.querySelector('span[is-icon]')!.setAttribute('style', `background-image:url(${this.getAttribute('data-icon')})`)
    this.querySelector('span[is-text]')!.textContent = this.getAttribute('data-text')
  }

  /**
   * 属性更新时更新内容
   */
  attributeChangedCallback(name: string, _: string, newValue: string) {
    if (name == 'data-icon') {
      const icon = this.querySelector('span[is-icon]')
      if (icon) (icon as HTMLElement).style.backgroundImage = `url(${newValue})`
    } else if (name == 'data-text') {
      const text = this.querySelector('span[is-text]')
      if (text) text.textContent = newValue
    }
  }

  static get observedAttributes() {
    return ['data-text', 'data-icon']
  }
}

customElements.define(ATTACHMENT_NODE_TAG, AttachmentElement)
