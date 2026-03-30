export const TASK_CHECKBOX_NODE_TAG = 'kaitify-task-checkbox'

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

if (!customElements.get(TASK_CHECKBOX_NODE_TAG)) {
  customElements.define(TASK_CHECKBOX_NODE_TAG, TaskCheckboxElement)
}
