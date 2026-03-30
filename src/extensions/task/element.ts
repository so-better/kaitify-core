export const TASK_CHECKBOX_NODE_TAG = 'kaitify-task-checkbox'

if (typeof HTMLElement !== 'undefined' && !customElements.get(TASK_CHECKBOX_NODE_TAG)) {
  class TaskCheckboxElement extends HTMLElement {
    constructor() {
      super()
    }

    /**
     * dom挂载，首次渲染
     */
    connectedCallback() {
      this.innerHTML = `<span></span>`
    }
  }

  customElements.define(TASK_CHECKBOX_NODE_TAG, TaskCheckboxElement)
}
