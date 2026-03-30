export const VIDEO_NODE_TAG = 'kaitify-video'

if (typeof HTMLElement !== 'undefined' && !customElements.get(VIDEO_NODE_TAG)) {
  class VideoElement extends HTMLElement {
    constructor() {
      super()
    }

    /**
     * dom挂载，首次渲染
     */
    connectedCallback() {
      this.innerHTML = `<span is-indicator></span><video />`
      const video = this.querySelector('video')!
      const src = this.getAttribute('data-src')
      const autoplay = this.getAttribute('data-autoplay')
      const controls = this.getAttribute('data-controls')
      const muted = this.getAttribute('data-muted')
      const loop = this.getAttribute('data-loop')
      if (src) {
        video.setAttribute('src', src)
      }
      if (autoplay) {
        video.setAttribute('autoplay', autoplay)
      }
      if (controls) {
        video.setAttribute('controls', controls)
      }
      if (muted) {
        video.setAttribute('muted', muted)
      }
      if (loop) {
        video.setAttribute('loop', loop)
      }
    }

    /**
     * 属性更新时更新内容
     */
    attributeChangedCallback(name: string, _: string, newValue: string) {
      const video = this.querySelector('video')
      if (!video) return
      if (name === 'data-src') {
        if (newValue) {
          video.setAttribute('src', newValue)
        } else {
          video.removeAttribute('src')
        }
      }
      if (name === 'data-autoplay') {
        if (newValue) {
          video.setAttribute('autoplay', newValue)
        } else {
          video.removeAttribute('autoplay')
        }
      }
      if (name === 'data-controls') {
        if (newValue) {
          video.setAttribute('controls', newValue)
        } else {
          video.removeAttribute('controls')
        }
      }
      if (name === 'data-muted') {
        if (newValue) {
          video.setAttribute('muted', newValue)
        } else {
          video.removeAttribute('muted')
        }
      }
      if (name === 'data-loop') {
        if (newValue) {
          video.setAttribute('loop', newValue)
        } else {
          video.removeAttribute('loop')
        }
      }
    }

    static get observedAttributes() {
      return ['data-src', 'data-autoplay', 'data-controls', 'data-muted', 'data-loop']
    }
  }

  customElements.define(VIDEO_NODE_TAG, VideoElement)
}
