import { Editor } from '@/model'
import { event as DapEvent } from 'dap-util'

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
   * 绑定事件
   */
  bindEvents() {
    const eventMap = DapEvent.get(this)
    //绑定点击事件
    if (!eventMap || !eventMap['click.attachment']) {
      DapEvent.on(this, 'click.attachment', async () => {
        //可编辑状态下点击选中附件
        if (this.editor?.isEditable()) {
          this.editor.updateRealSelection()
        }
        //不可编辑状态下，点击下载附件
        else {
          const url = this.getAttribute('data-url') as string
          const text = this.getAttribute('data-text') as string
          //使用fetch读取文件地址
          const res = await fetch(url, {
            method: 'GET'
          })
          //获取blob数据
          const blob = await res.blob()
          //创建a标签进行下载
          const a = document.createElement('a')
          a.setAttribute('target', '_blank')
          a.setAttribute('href', URL.createObjectURL(blob))
          a.setAttribute('download', text)
          a.click()
        }
      })
    }
  }

  /**
   * dom挂载，首次渲染，设置事件
   */
  connectedCallback() {
    this.innerHTML = `<span is-icon></span><span is-text></span>`
    this.querySelector('span[is-icon]')!.setAttribute('style', `background-image:url(${this.getAttribute('data-icon')})`)
    this.querySelector('span[is-text]')!.textContent = this.getAttribute('data-text')
    this.bindEvents()
  }

  /**
   * dom卸载，解除事件
   */
  disconnectedCallback() {
    DapEvent.off(this, 'click.attachment')
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

customElements.define('kaitify-attachment', AttachmentElement)
