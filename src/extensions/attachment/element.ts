import { Editor } from '@/model'

export const ATTACHMENT_NODE_TAG = 'kaitify-attachment'

class AttachmentElement extends HTMLElement {
  constructor() {
    super()
  }

  /**
   * 获取编辑器元素
   */
  get editor(): Editor | null {
    let el: HTMLElement | null = this.parentElement
    while (el) {
      if (Editor.instanceMap.has(el)) return Editor.instanceMap.get(el)!
      el = el.parentElement
    }
    return null
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
