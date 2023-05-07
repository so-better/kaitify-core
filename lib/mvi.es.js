var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const dataName = "_alex-editor-datas";
let Util = {
  //获取属性集合
  getAttributes(el) {
    let o = {};
    for (let attribute of el.attributes) {
      if (!/^on/g.test(attribute.nodeName) && attribute.nodeName != "style") {
        o[attribute.nodeName] = attribute.nodeValue;
      }
    }
    return o;
  },
  //获取样式集合
  getStyles(el) {
    let o = {};
    if (el.getAttribute("style")) {
      const styles = el.getAttribute("style").split(";").filter((item) => {
        return item;
      });
      for (let style of styles) {
        const res = style.split(":");
        const key = res[0].trim();
        const val = res[1].trim();
        o[key] = val;
      }
    }
    return o;
  },
  //是否对象
  isObject(val) {
    if (typeof val === "object" && val) {
      return true;
    }
    return false;
  },
  //是否空对象
  isEmptyObject(obj) {
    if (this.isObject(obj)) {
      return Object.keys(obj).length == 0;
    }
    return false;
  },
  //判断元素节点包含关系
  isContains(parentNode, childNode) {
    if (parentNode === childNode) {
      return true;
    }
    if (parentNode.contains) {
      return parentNode.contains(childNode);
    }
    if (parentNode.compareDocumentPosition) {
      return !!(parentNode.compareDocumentPosition(childNode) & 16);
    }
  },
  //是否dom元素，text表示是否考虑文本元素
  isElement(el, text) {
    if (text) {
      return el && (el.nodeType === 1 || el.nodeType === 3) && el instanceof Node;
    }
    return el && el.nodeType === 1 && el instanceof Node;
  },
  //是否window
  isWindow(data) {
    if (data && data.constructor && data.constructor.name) {
      return data.constructor.name == "Window";
    }
    return false;
  },
  //移除指定数据
  removeData(el, key) {
    if (!(el instanceof Document) && !this.isElement(el, true) && !this.isWindow(el)) {
      throw new TypeError("The first argument must be an element");
    }
    let data = el[dataName] || {};
    if (key === void 0 || key === null || key === "") {
      el[dataName] = {};
    } else {
      delete data[key];
      el[dataName] = data;
    }
  },
  //判断是否含有指定数据
  hasData(el, key) {
    if (!(el instanceof Document) && !this.isElement(el, true) && !this.isWindow(el)) {
      throw new TypeError("The first argument must be an element");
    }
    if (key === void 0 || key === null || key === "") {
      throw new TypeError("The second parameter must be a unique key");
    }
    let data = el[dataName] || {};
    return data.hasOwnProperty(key);
  },
  //获取元素指定数据
  getData(el, key) {
    if (!(el instanceof Document) && !this.isElement(el, true) && !this.isWindow(el)) {
      throw new TypeError("The first argument must be an element");
    }
    let data = el[dataName] || {};
    if (key === void 0 || key === null || key === "") {
      return data;
    } else {
      return data[key];
    }
  },
  //获取元素指定数据
  setData(el, key, value) {
    if (!(el instanceof Document) && !this.isElement(el, true) && !this.isWindow(el)) {
      throw new TypeError("The first argument must be an element");
    }
    if (key === void 0 || key === null || key === "") {
      throw new TypeError("The second parameter must be a unique key");
    }
    let data = el[dataName] || {};
    data[key] = value;
    el[dataName] = data;
  },
  //生成唯一key
  getUniqueKey() {
    let key = this.getData(window, "data-alex-editor-key") || 0;
    key++;
    this.setData(window, "data-alex-editor-key", key);
    return key;
  }
};
const parseEventName = (eventName) => {
  let eventNames = eventName.split(/[\s]+/g);
  let result = [];
  eventNames.forEach((name) => {
    let arr = name.split(".");
    let obj = {
      eventName: arr[0]
    };
    if (arr.length > 1) {
      obj.guid = arr[1];
    }
    result.push(obj);
  });
  return result;
};
const updateEvents = (events) => {
  let obj = {};
  let keys = Object.keys(events);
  keys.forEach((key) => {
    if (events[key]) {
      obj[key] = events[key];
    }
  });
  return obj;
};
const bindSingleListener = (el, eventName, guid, fn, options) => {
  let events = Util.getData(el, "data-alex-editor-events") || {};
  if (!guid) {
    guid = Util.getData(el, "data-alex-editor-guid") || 0;
    Util.setData(el, "data-alex-editor-guid", guid + 1);
  }
  guid = eventName + "_" + guid;
  if (events[guid] && events[guid].type == eventName) {
    el.removeEventListener(eventName, events[guid].fn, events[guid].options);
  }
  el.addEventListener(eventName, fn, options);
  events[guid] = {
    type: eventName,
    fn,
    options
  };
  Util.setData(el, "data-alex-editor-events", events);
};
const unbindSingleListener = (el, eventName, guid) => {
  let events = dataUtil.get(el, "data-alex-editor-events") || {};
  let keys = Object.keys(events);
  let length = keys.length;
  for (let i = 0; i < length; i++) {
    let key = keys[i];
    if (events[key].type == eventName) {
      if (guid) {
        if (key == eventName + "_" + guid) {
          el.removeEventListener(events[key].type, events[key].fn, events[key].options);
          events[key] = void 0;
        }
      } else {
        el.removeEventListener(events[key].type, events[key].fn, events[key].options);
        events[key] = void 0;
      }
    }
  }
  events = updateEvents(events);
  Util.setData(el, "data-alex-editor-events", events);
};
const Util$1 = {
  ...Util,
  /**
   * 绑定事件
   * @param {Object} el 元素节点
   * @param {Object} eventName 事件名称
   * @param {Object} fn 函数
   * @param {Object} options 参数
   */
  on(el, eventName, fn, options) {
    if (!(el instanceof Document) && !Util.isElement(el) && !Util.isWindow(el)) {
      throw new TypeError("The first argument must be an element node");
    }
    if (!eventName || typeof eventName != "string") {
      throw new TypeError("The second argument must be a string");
    }
    if (!fn || typeof fn != "function") {
      throw new TypeError("The third argument must be a function");
    }
    if (!Util.isObject(options)) {
      options = {};
    }
    const result = parseEventName(eventName);
    result.forEach((res) => {
      bindSingleListener(el, res.eventName, res.guid, fn.bind(el), options);
    });
  },
  /**
   * 事件解绑
   * @param {Object} el 元素节点
   * @param {Object} eventName 事件名称
   */
  off(el, eventName) {
    if (!(el instanceof Document) && !Util.isElement(el) && !Util.isWindow(el)) {
      throw new TypeError("The first argument must be an element node");
    }
    let events = Util.getData(el, "data-alex-editor-events");
    if (!events) {
      return;
    }
    if (!eventName) {
      let keys = Object.keys(events);
      let length = keys.length;
      for (let i = 0; i < length; i++) {
        let key = keys[i];
        el.removeEventListener(events[key].type, events[key].fn, events[key].options);
      }
      Util.removeData(el, "data-alex-editor-eventss");
      Util.removeData(el, "data-alex-editor-guid");
      return;
    }
    const result = parseEventName(eventName);
    result.forEach((res) => {
      unbindSingleListener(el, res.eventName, res.guid);
    });
  }
};
const _AlexElement = class {
  constructor(type, parsedom, marks, styles, textContent) {
    this.key = Util$1.getUniqueKey();
    this.type = type;
    this.parsedom = parsedom;
    this.marks = marks;
    this.styles = styles;
    this.textContent = textContent;
    this.children = null;
    this.parent = null;
    this._elm = null;
  }
  //是否文本
  isText() {
    return this.type == "text";
  }
  //是否块
  isBlock() {
    return this.type == "block";
  }
  //是否行内
  isInline() {
    return this.type == "inline";
  }
  //是否闭合
  isClosed() {
    return this.type == "closed";
  }
  //是否换行符
  isBreak() {
    return this.isClosed() && this.parsedom == "br";
  }
  //是否空
  isEmpty() {
    if (this.isText() && !this.textContent) {
      return true;
    }
    if (this.isInline() || this.isBlock()) {
      if (!this.hasChildren()) {
        return true;
      }
      const allEmpty = this.children.every((el) => {
        return !el || el.isEmpty();
      });
      return allEmpty;
    }
    return false;
  }
  //是否根元素
  isRoot() {
    return !this.parent;
  }
  //是否包含指定节点
  isContains(element) {
    if (this.isEqual(element)) {
      return true;
    }
    if (element.isRoot()) {
      return false;
    }
    return this.isContains(element.parent);
  }
  //判断两个Element是否相等
  isEqual(element) {
    if (!_AlexElement.isElement(element)) {
      return false;
    }
    return this.key == element.key;
  }
  //判断两个元素是否有包含关系
  hasContains(element) {
    if (!_AlexElement.isElement(element)) {
      return false;
    }
    return this.isContains(element) || element.isContains(this);
  }
  //是否含有标记
  hasMarks() {
    if (!this.marks) {
      return false;
    }
    if (Util$1.isObject) {
      return !Util$1.isEmptyObject(this.marks);
    }
    return false;
  }
  //是否含有样式
  hasStyles() {
    if (!this.styles) {
      return false;
    }
    if (Util$1.isObject) {
      return !Util$1.isEmptyObject(this.styles);
    }
    return false;
  }
  //是否有子元素
  hasChildren() {
    if (Array.isArray(this.children)) {
      return !!this.children.length;
    }
    return false;
  }
  //克隆当前元素,deep为true表示深度克隆
  clone(deep = true) {
    if (typeof deep != "boolean") {
      throw new Error("The parameter must be a Boolean");
    }
    let el = new _AlexElement(this.type, this.parsedom, this.marks, this.styles, this.textContent);
    if (deep && this.hasChildren()) {
      this.children.forEach((child) => {
        let clonedChild = child.clone(deep);
        if (el.hasChildren()) {
          el.children.push(clonedChild);
        } else {
          el.children = [clonedChild];
        }
        clonedChild.parent = el;
      });
    }
    return el;
  }
  //转换成block元素
  convertToBlock() {
    if (this.isBlock()) {
      throw new Error('This element is already of type "block"');
    }
    let element = this.clone(true);
    if (this.isText()) {
      this.textContent = null;
    }
    this.type = "block";
    this.parsedom = _AlexElement.paragraph;
    this.marks = null;
    this.styles = null;
    this.children = [element];
    element.parent = this;
  }
  //渲染成真实dom
  _renderElement() {
    let el = null;
    if (this.isText()) {
      el = document.createTextNode(this.textContent);
    } else {
      el = document.createElement(this.parsedom);
      if (this.hasMarks()) {
        for (let key in this.marks) {
          if (!/^on/g.test(key) && key != "style") {
            el.setAttribute(key, this.marks[key]);
          }
        }
      }
      if (this.hasStyles()) {
        for (let key in this.styles) {
          el.style.setProperty(key, this.styles[key]);
        }
      }
      if (this.hasChildren()) {
        for (let child of this.children) {
          let childElm = child._renderElement();
          el.appendChild(childElm);
        }
      }
    }
    Util$1.setData(el, "data-alex-editor-key", this.key);
    this._elm = el;
    return el;
  }
  //判断是否该类型数据
  static isElement(val) {
    return val instanceof _AlexElement;
  }
  //扁平化处理元素数组
  static flatElements(elements) {
    const flat = (arr) => {
      let result = [];
      arr.forEach((element) => {
        result.push(element);
        if (element.hasChildren()) {
          let arr2 = flat(element.children);
          result = [...result, ...arr2];
        }
      });
      return result;
    };
    return flat(elements);
  }
  //内部定义的转换规则，可以被renderRules属性覆盖
  static _renderRules(element) {
    switch (element.parsedom) {
      case "br":
        element.type = "closed";
        element.children = null;
        break;
      case "span":
        element.type = "inline";
        break;
      case "img":
        element.type = "closed";
        element.children = null;
        break;
    }
    return element;
  }
};
let AlexElement = _AlexElement;
//定义段落标签
__publicField(AlexElement, "paragraph", "p");
//校验函数数组，用于格式化
__publicField(AlexElement, "_formatUnchangeableRules", [
  //移除节点规则
  function(element) {
    if (element.isEmpty()) {
      element = null;
    }
    return element;
  },
  //子元素中换行符和非换行符元素不可同时存在
  function(element) {
    if (element.hasChildren()) {
      let hasBreak = element.children.some((el) => {
        if (el) {
          return el.isBreak();
        }
        return false;
      });
      let hasOther = element.children.some((el) => {
        if (el) {
          return !el.isBreak();
        }
        return false;
      });
      if (hasBreak && hasOther) {
        element.children = element.children.map((el) => {
          if (el && el.isBreak()) {
            return null;
          }
          return el;
        });
      } else if (hasBreak && element.children.length > 1) {
        element.children = [element.children[0]];
      }
    }
    return element;
  },
  //同级元素如果存在block，则其他元素也必须是block
  function(element) {
    if (element.hasChildren()) {
      let hasBlock = element.children.some((el) => {
        if (el) {
          return el.isBlock();
        }
        return false;
      });
      if (hasBlock) {
        element.children.forEach((el) => {
          if (el && !el.isBlock()) {
            el.convertToBlock();
          }
        });
      }
    }
    return element;
  }
]);
class AlexPoint {
  constructor(element, offset) {
    this.element = element;
    this.offset = offset;
    this._init();
  }
  //初始化
  _init() {
    if (this.element.isText()) {
      return;
    }
    if (this.element.hasChildren()) {
      if (this.element.children[this.offset]) {
        this.element = this.element.children[this.offset];
        this.offset = 0;
      } else {
        this.element = this.element.children[this.offset - 1];
        this.offset = 1;
      }
    }
  }
  //是否Point类型数据
  static isPoint(val) {
    return val instanceof AlexPoint;
  }
  //两个点是否相等
  isEqual(point) {
    if (!AlexPoint.isPoint(point)) {
      return false;
    }
    return this.element.isEqual(point.element) && this.offset == point.offset;
  }
  //移动到到指定元素最后
  moveToEnd(element) {
    if (!AlexElement.isElement(element)) {
      return;
    }
    if (element.isEmpty()) {
      return;
    }
    if (element.isText()) {
      this.element = element;
      this.offset = element.textContent.length;
    } else if (element.isClosed()) {
      this.element = element;
      this.offset = 1;
    } else if (element.hasChildren()) {
      const flatElements = AlexElement.flatElements(element.children).filter((el) => {
        return !el.isEmpty();
      });
      const length = flatElements.length;
      this.moveToEnd(flatElements[length - 1]);
    }
  }
  //移动到指定元素最前
  moveToStart(element) {
    if (!AlexElement.isElement(element)) {
      return;
    }
    if (element.isEmpty()) {
      return;
    }
    if (element.isText()) {
      this.element = element;
      this.offset = 0;
    } else if (element.isClosed()) {
      this.element = element;
      this.offset = 0;
    } else if (element.hasChildren()) {
      const flatElements = AlexElement.flatElements(element.children).filter((el) => {
        return !el.isEmpty();
      });
      this.moveToStart(flatElements[0]);
    }
  }
  //获取该点所在的块元素
  getBlock() {
    const fn = (element) => {
      if (element.isBlock()) {
        return element;
      }
      return fn(element.parent);
    };
    return fn(this.element);
  }
  //获取该点所在的行内元素
  getInline() {
    const fn = (element) => {
      if (element.isInline()) {
        return element;
      }
      if (element.isRoot()) {
        return null;
      }
      return fn(element.parent);
    };
    return fn(this.element);
  }
}
class AlexRange {
  constructor(anchor, focus) {
    this.anchor = anchor;
    this.focus = focus;
  }
  //根据anchor和focus来设置真实的光标
  setCursor() {
    let anchorNode = null;
    let anchorOffset = null;
    let focusNode = null;
    let focusOffset = null;
    if (this.anchor.element.isClosed()) {
      anchorNode = this.anchor.element.parent._elm;
      const index = this.anchor.element.parent.children.findIndex((item) => {
        return this.anchor.element.isEqual(item);
      });
      anchorOffset = this.anchor.offset == 1 ? index + 1 : index;
    } else {
      anchorNode = this.anchor.element._elm;
      anchorOffset = this.anchor.offset;
    }
    if (this.focus.element.isClosed()) {
      focusNode = this.focus.element.parent._elm;
      const index = this.focus.element.parent.children.findIndex((item) => {
        return this.focus.element.isEqual(item);
      });
      focusOffset = this.focus.offset == 1 ? index + 1 : index;
    } else {
      focusNode = this.focus.element._elm;
      focusOffset = this.focus.offset;
    }
    const selection = window.getSelection();
    selection.removeAllRanges();
    const range = document.createRange();
    range.setStart(anchorNode, anchorOffset);
    range.setEnd(focusNode, focusOffset);
    selection.addRange(range);
  }
}
class AlexHistory {
  constructor() {
    this.stacks = [];
    this.index = -1;
  }
  //入栈
  push(stack, range) {
    if (this.index < this.stacks.length - 1) {
      this.stacks.length = this.index + 1;
    }
    const newStack = stack.map((ele) => {
      return this._cloneElement(ele);
    });
    const anchorElement = AlexElement.flatElements(newStack).find((ele) => {
      return ele.key == range.anchor.element.key;
    });
    const focusElement = AlexElement.flatElements(newStack).find((ele) => {
      return ele.key == range.focus.element.key;
    });
    const anchor = new AlexPoint(anchorElement, range.anchor.offset);
    const focus = new AlexPoint(focusElement, range.focus.offset);
    const newRange = new AlexRange(anchor, focus);
    this.stacks.push({
      stack: newStack,
      range: newRange
    });
    this.index += 1;
  }
  //撤销
  get(type) {
    if (type == -1) {
      if (this.index <= 0) {
        return null;
      }
      this.index -= 1;
    } else if (type == 1) {
      if (this.index >= this.stacks.length - 1) {
        return null;
      }
      this.index += 1;
    }
    const { stack, range } = this.stacks[this.index];
    const newStack = stack.map((ele) => {
      return this._cloneElement(ele);
    });
    const anchorElement = AlexElement.flatElements(newStack).find((ele) => {
      return ele.key == range.anchor.element.key;
    });
    const focusElement = AlexElement.flatElements(newStack).find((ele) => {
      return ele.key == range.focus.element.key;
    });
    const anchor = new AlexPoint(anchorElement, range.anchor.offset);
    const focus = new AlexPoint(focusElement, range.focus.offset);
    const newRange = new AlexRange(anchor, focus);
    return {
      stack: newStack,
      range: newRange
    };
  }
  //复制元素，包括key也复制
  _cloneElement(element) {
    const el = new AlexElement(element.type, element.parsedom, element.marks, element.styles, element.textContent);
    el.key = element.key;
    if (element.hasChildren()) {
      element.children.forEach((child) => {
        let clonedChild = this._cloneElement(child);
        if (el.hasChildren()) {
          el.children.push(clonedChild);
        } else {
          el.children = [clonedChild];
        }
        clonedChild.parent = el;
      });
    }
    return el;
  }
}
class AlexEditor {
  constructor(el, options) {
    if (!Util$1.isElement(el)) {
      throw new Error("You must specify a dom container to initialize the editor");
    }
    options = this._formatOptions(options);
    this.$el = el;
    this.autofocus = options.autofocus;
    this.disabled = options.disabled;
    this.value = options.value;
    this.renderRules = options.renderRules;
    this.onChange = options.onChange;
    this.range = null;
    this._isInputChinese = false;
    this._oldValue = options.value;
    this.stack = this.parseHtml(this.value);
    this.history = new AlexHistory();
    this.formatElements();
    if (this.stack.length == 0) {
      const ele = new AlexElement("block", AlexElement.paragraph, null, null, null);
      const breakEle = new AlexElement("closed", "br", null, null, null);
      this.addElementTo(breakEle, ele, 0);
      this.stack = [ele];
    }
    this._initRange();
    this.domRender();
    if (this.disabled) {
      this.setDisabled();
    } else {
      this.setEnabled();
      if (this.autofocus) {
        this.collapseToEnd();
      }
    }
    Util$1.on(document, "selectionchange", this._selectionChange.bind(this));
    Util$1.on(this.$el, "beforeinput", this._beforeInput.bind(this));
    Util$1.on(this.$el, "compositionstart compositionupdate compositionend", this._chineseInputHandler.bind(this));
    Util$1.on(this.$el, "keydown", this._keyboardDown.bind(this));
  }
  //格式化options参数
  _formatOptions(options) {
    let opts = {
      disabled: false,
      autofocus: false,
      renderRules: null,
      value: "<p><br></p>",
      onChange: null
    };
    if (Util$1.isObject(options)) {
      if (typeof options.autofocus == "boolean") {
        opts.autofocus = options.autofocus;
      }
      if (typeof options.disabled == "boolean") {
        opts.disabled = options.disabled;
      }
      if (typeof options.renderRules == "function") {
        opts.renderRules = options.renderRules;
      }
      if (typeof options.value == "string" && options.value) {
        opts.value = options.value;
      }
      if (typeof options.onChange == "function") {
        opts.onChange = options.onChange;
      }
    }
    return opts;
  }
  //初始设置range
  _initRange() {
    const firstElement = this.stack[0];
    const anchor = new AlexPoint(firstElement, 0);
    const focus = new AlexPoint(firstElement, 0);
    this.range = new AlexRange(anchor, focus);
  }
  //起始和结束点都在一个元素内的删除方法
  _deleteInSameElement() {
    if (!this.range.anchor.element.isEqual(this.range.focus.element)) {
      return;
    }
    if (this.range.anchor.offset == 0 && this.range.focus.offset == 0) {
      return;
    }
    const previousElement = this.getPreviousElementOfPoint(this.range.anchor);
    const nextElement = this.getNextElementOfPoint(this.range.anchor);
    const anchorBlock = this.range.anchor.getBlock();
    const anchorInline = this.range.anchor.getInline();
    if (this.range.anchor.element.isText()) {
      const val = this.range.anchor.element.textContent;
      const startOffset = this.range.anchor.offset == this.range.focus.offset ? this.range.anchor.offset - 1 : this.range.anchor.offset;
      const endOffset = this.range.focus.offset;
      this.range.anchor.element.textContent = val.substring(0, startOffset) + val.substring(endOffset);
      if (this.range.anchor.offset == this.range.focus.offset) {
        this.range.anchor.offset -= 1;
      }
      this.range.focus.element = this.range.anchor.element;
      this.range.focus.offset = this.range.anchor.offset;
      if (this.range.anchor.element.isEmpty()) {
        if (anchorBlock.isEmpty()) {
          const breakEl = new AlexElement("closed", "br", null, null, null);
          this.addElementTo(breakEl, anchorBlock, 0);
          this.range.anchor.moveToEnd(breakEl);
          this.range.focus.moveToEnd(breakEl);
        } else {
          if (previousElement && anchorBlock.isContains(previousElement)) {
            this.range.anchor.moveToEnd(previousElement);
            this.range.focus.moveToEnd(previousElement);
          } else if (nextElement && anchorBlock.isContains(nextElement)) {
            this.range.anchor.moveToStart(nextElement);
            this.range.focus.moveToStart(nextElement);
          }
        }
      }
    } else {
      const index = this.range.anchor.element.parent.children.findIndex((el) => {
        return this.range.anchor.element.isEqual(el);
      });
      this.range.anchor.element.parent.children.splice(index, 1);
      if (anchorBlock.isEmpty()) {
        if (this.range.anchor.element.isBreak() && previousElement) {
          this.range.anchor.moveToEnd(previousElement);
          this.range.focus.moveToEnd(previousElement);
        } else {
          const breakEl = new AlexElement("closed", "br", null, null, null);
          this.addElementTo(breakEl, anchorBlock, 0);
          this.range.anchor.moveToEnd(breakEl);
          this.range.focus.moveToEnd(breakEl);
        }
      } else {
        const isBreak = this.range.anchor.element.isBreak();
        if (previousElement && anchorBlock.isContains(previousElement)) {
          this.range.anchor.moveToEnd(previousElement);
          this.range.focus.moveToEnd(previousElement);
        } else if (nextElement && anchorBlock.isContains(nextElement)) {
          this.range.anchor.moveToStart(nextElement);
          this.range.focus.moveToStart(nextElement);
        }
        if (anchorInline && anchorInline.isEmpty() && isBreak) {
          this.delete();
        }
      }
    }
  }
  //监听selection改变
  _selectionChange() {
    if (this.disabled) {
      return;
    }
    if (this._isInputChinese) {
      return;
    }
    const selection = window.getSelection();
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      if (Util$1.isContains(this.$el, range.startContainer) && Util$1.isContains(this.$el, range.endContainer)) {
        const anchorKey = Util$1.getData(range.startContainer, "data-alex-editor-key");
        const focusKey = Util$1.getData(range.endContainer, "data-alex-editor-key");
        const anchorEle = this.getElementByKey(anchorKey);
        const focusEle = this.getElementByKey(focusKey);
        const anchor = new AlexPoint(anchorEle, range.startOffset);
        const focus = new AlexPoint(focusEle, range.endOffset);
        this.range = new AlexRange(anchor, focus);
      }
    }
  }
  //监听beforeinput
  _beforeInput(e) {
    e.preventDefault();
    if (e.inputType == "insertCompositionText") {
      return;
    }
    switch (e.inputType) {
      case "insertText":
        this.insertText(e.data);
        break;
      case "deleteContentBackward":
        this.delete();
        break;
      case "insertParagraph":
        this.insertParagraph();
        break;
      case "insertFromPaste":
        let pasteText = e.dataTransfer.getData("text/html");
        let pasteFiles = e.dataTransfer.files;
        console.log(pasteText);
        console.log(pasteFiles);
        break;
      case "deleteByCut":
        this.delete();
        break;
      default:
        console.log("beforeInput没有监听到的inputType", e.inputType);
    }
    this.formatElements();
    this.domRender();
    this.range.setCursor();
  }
  //监听中文输入
  _chineseInputHandler(e) {
    e.preventDefault();
    if (e.type == "compositionstart") {
      this._isInputChinese = true;
    }
    if (e.type == "compositionend") {
      this._isInputChinese = false;
      this.insertText(e.data);
      this.formatElements();
      this.domRender();
      this.range.setCursor();
    }
  }
  //监听键盘按下
  _keyboardDown(e) {
    switch (e.keyCode) {
      case 9:
        e.preventDefault();
        console.log("Tab键按下");
        break;
    }
  }
  //规范stack
  formatElements() {
    const format = (ele) => {
      if (ele.hasChildren()) {
        ele.children = ele.children.map(format);
      }
      AlexElement._formatUnchangeableRules.forEach((fn) => {
        if (ele) {
          ele = fn(ele);
        }
      });
      return ele;
    };
    const removeNull = (ele) => {
      if (ele) {
        if (ele.hasChildren()) {
          ele.children.forEach((item) => {
            if (item) {
              item = removeNull(item);
            }
          });
          ele.children = ele.children.filter((item) => {
            return !!item;
          });
        }
      }
      return ele;
    };
    this.stack = this.stack.map((ele) => {
      if (!ele.isBlock()) {
        ele.convertToBlock();
      }
      ele = format(ele);
      ele = removeNull(ele);
      return ele;
    }).filter((ele) => {
      return !!ele;
    });
  }
  //渲染编辑器dom内容
  domRender(unPushHistory = false) {
    this.$el.innerHTML = "";
    this.stack.forEach((element) => {
      let elm = element._renderElement();
      this.$el.appendChild(elm);
    });
    this._oldValue = this.value;
    this.value = this.$el.innerHTML;
    if (this._oldValue != this.value) {
      if (typeof this.onChange == "function") {
        this.onChange.apply(this, [this.value, this._oldValue]);
      }
      if (!unPushHistory) {
        this.history.push(this.stack, this.range);
      }
    }
  }
  //禁用编辑器
  setDisabled() {
    this.disabled = true;
    this.$el.removeAttribute("contenteditable");
  }
  //启用编辑器
  setEnabled() {
    this.disabled = false;
    this.$el.setAttribute("contenteditable", true);
  }
  //获取指定元素的前一个兄弟元素
  getPreviousElement(ele) {
    if (!AlexElement.isElement(ele)) {
      throw new Error("The argument must be an AlexElement instance");
    }
    if (ele.isRoot()) {
      const index = this.stack.findIndex((item) => {
        return ele.isEqual(item);
      });
      if (index <= 0) {
        return null;
      }
      if (this.stack[index - 1].isEmpty()) {
        return this.getPreviousElement(this.stack[index - 1]);
      }
      return this.stack[index - 1];
    } else {
      const index = ele.parent.children.findIndex((item) => {
        return ele.isEqual(item);
      });
      if (index <= 0) {
        return null;
      }
      if (ele.parent.children[index - 1].isEmpty()) {
        return this.getPreviousElement(ele.parent.children[index - 1]);
      }
      return ele.parent.children[index - 1];
    }
  }
  //获取指定元素的后一个兄弟元素
  getNextElement(ele) {
    if (!AlexElement.isElement(ele)) {
      throw new Error("The argument must be an AlexElement instance");
    }
    if (ele.isRoot()) {
      const index = this.stack.findIndex((item) => {
        return ele.isEqual(item);
      });
      if (index >= this.stack.length - 1) {
        return null;
      }
      if (this.stack[index + 1].isEmpty()) {
        return this.getNextElement(this.stack[index + 1]);
      }
      return this.stack[index + 1];
    } else {
      const index = ele.parent.children.findIndex((item) => {
        return ele.isEqual(item);
      });
      if (index >= ele.parent.children.length - 1) {
        return null;
      }
      if (ele.parent.children[index + 1].isEmpty()) {
        return this.getNextElement(ele.parent.children[index + 1]);
      }
      return ele.parent.children[index + 1];
    }
  }
  //将指定元素添加到父元素的子元素数组中
  addElementTo(childEle, parentEle, index) {
    if (!AlexElement.isElement(childEle)) {
      throw new Error("The first argument must be an AlexElement instance");
    }
    if (!AlexElement.isElement(parentEle)) {
      throw new Error("The second argument must be an AlexElement instance");
    }
    if (typeof index != "number" || isNaN(index) || index < 0) {
      throw new Error("The third argument must be an integer not less than 0");
    }
    if (parentEle.isClosed() || parentEle.isText()) {
      throw new Error('Elements of type "closed" and "text" cannot have children');
    }
    if (childEle.isBlock() && !parentEle.isBlock()) {
      throw new Error("A block element cannot be added to an element that is not a block");
    }
    if (parentEle.hasChildren()) {
      if (index >= parentEle.children.length) {
        parentEle.children.push(childEle);
      } else {
        parentEle.children.splice(index, 0, childEle);
      }
    } else {
      parentEle.children = [childEle];
    }
    childEle.parent = parentEle;
  }
  //将指定元素添加到另一个元素前面
  addElementBefore(newEle, targetEle) {
    if (!AlexElement.isElement(newEle)) {
      throw new Error("The first argument must be an AlexElement instance");
    }
    if (!AlexElement.isElement(targetEle)) {
      throw new Error("The second argument must be an AlexElement instance");
    }
    if (targetEle.isRoot()) {
      const index = this.stack.findIndex((item) => {
        return targetEle.isEqual(item);
      });
      this.stack.splice(index, 0, newEle);
      newEle.parent = null;
    } else {
      const index = targetEle.parent.children.findIndex((item) => {
        return targetEle.isEqual(item);
      });
      this.addElementTo(newEle, targetEle.parent, index);
    }
  }
  //将指定元素添加到另一个元素后面
  addElementAfter(newEle, targetEle) {
    if (!AlexElement.isElement(newEle)) {
      throw new Error("The first argument must be an AlexElement instance");
    }
    if (!AlexElement.isElement(targetEle)) {
      throw new Error("The second argument must be an AlexElement instance");
    }
    if (targetEle.isRoot()) {
      const index = this.stack.findIndex((item) => {
        return targetEle.isEqual(item);
      });
      if (index >= this.stack.length - 1) {
        this.stack.push(newEle);
      } else {
        this.stack.splice(index + 1, 0, newEle);
      }
      newEle.parent = null;
    } else {
      const index = targetEle.parent.children.findIndex((item) => {
        return targetEle.isEqual(item);
      });
      this.addElementTo(newEle, targetEle.parent, index + 1);
    }
  }
  //将指定的块元素与其之前的一个块元素进行合并
  mergeBlockElement(ele) {
    if (!AlexElement.isElement(ele)) {
      throw new Error("The argument must be an AlexElement instance");
    }
    if (!ele.isBlock()) {
      throw new Error('Elements that are not "block" cannot be merged');
    }
    const previousElement = this.getPreviousElement(ele);
    if (previousElement) {
      previousElement.children.push(...ele.children);
      previousElement.children.forEach((item) => {
        item.parent = previousElement;
      });
      if (ele.isRoot()) {
        const index = this.stack.findIndex((item) => {
          return ele.isEqual(item);
        });
        this.stack.splice(index, 1);
      } else {
        const index = ele.parent.children.findIndex((item) => {
          return ele.isEqual(item);
        });
        ele.parent.children.splice(index, 1);
      }
    } else if (!ele.isRoot()) {
      ele.parent.children.push(...ele.children);
      ele.parent.children.forEach((item) => {
        item.parent = ele.parent;
      });
      const index = ele.parent.children.findIndex((item) => {
        return ele.isEqual(item);
      });
      ele.parent.children.splice(index, 1);
    }
  }
  //根据key查询元素
  getElementByKey(key) {
    if (!key) {
      throw new Error("You need to specify a key to do the query");
    }
    const searchFn = (elements) => {
      let element = null;
      for (let el of elements) {
        if (el.key == key) {
          element = el;
          break;
        }
        if (el.hasChildren()) {
          element = searchFn(el.children);
          if (element) {
            break;
          }
        }
      }
      return element;
    };
    return searchFn(this.stack);
  }
  //将节点转为元素
  parseNode(node) {
    if (!node) {
      throw new Error("You need to give a node to convert");
    }
    if (!Util$1.isElement(node, true)) {
      return null;
    }
    if (node.nodeType == 3) {
      let element = new AlexElement("text", null, null, null, node.nodeValue);
      element = AlexElement._renderRules(element);
      if (typeof this.renderRules == "function") {
        element = this.renderRules(element);
      }
      return element;
    } else {
      const marks = Util$1.getAttributes(node);
      const styles = Util$1.getStyles(node);
      let element = new AlexElement("block", node.nodeName.toLocaleLowerCase(), marks, styles, null);
      element = AlexElement._renderRules(element);
      if (typeof this.renderRules == "function") {
        element = this.renderRules(element);
      }
      Array.from(node.childNodes).forEach((childNode) => {
        const childEle = this.parseNode(childNode);
        if (childEle) {
          childEle.parent = element;
          if (element.hasChildren()) {
            element.children.push(childEle);
          } else {
            element.children = [childEle];
          }
        }
      });
      return element;
    }
  }
  //将html转为元素
  parseHtml(html) {
    if (!html) {
      throw new Error("You need to give an html content to convert");
    }
    const node = document.createElement("div");
    node.innerHTML = html;
    let elements = [];
    Array.from(node.childNodes).forEach((el) => {
      const element = this.parseNode(el);
      elements.push(element);
    });
    return elements;
  }
  //向上查询可以设置焦点的元素
  getPreviousElementOfPoint(point) {
    if (!AlexPoint.isPoint(point)) {
      throw new Error("The argument must be an AlexPoint instance");
    }
    const flatElements = AlexElement.flatElements(this.stack);
    const fn = (element) => {
      const index = flatElements.findIndex((item) => {
        return element.isEqual(item);
      });
      if (index <= 0) {
        return null;
      }
      let ele = flatElements[index - 1];
      if ((ele.isText() || ele.isClosed()) && !ele.isEmpty()) {
        return ele;
      }
      return fn(ele);
    };
    return fn(point.element);
  }
  //向下查找可以设置焦点的元素
  getNextElementOfPoint(point) {
    if (!AlexPoint.isPoint(point)) {
      throw new Error("The argument must be an AlexPoint instance");
    }
    const flatElements = AlexElement.flatElements(this.stack);
    const fn = (element) => {
      const index = flatElements.findIndex((item) => {
        return element.isEqual(item);
      });
      if (index == flatElements.length - 1) {
        return null;
      }
      let ele = flatElements[index + 1];
      if ((ele.isText() || ele.isClosed()) && !ele.isEmpty()) {
        return ele;
      }
      return fn(ele);
    };
    return fn(point.element);
  }
  //获取选区之间的元素
  getElementsByRange() {
    if (this.range.anchor.isEqual(this.range.focus)) {
      return [];
    }
    let elements = [];
    if (this.range.anchor.element.isEqual(this.range.focus.element)) {
      if (this.range.anchor.element.isText()) {
        let val = this.range.anchor.element.textContent;
        this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset);
        let newEl = new AlexElement("text", null, null, null, val.substring(this.range.anchor.offset, this.range.focus.offset));
        this.addElementAfter(newEl, this.range.anchor.element);
        let newFocus = new AlexElement("text", null, null, null, val.substring(this.range.focus.offset));
        this.addElementAfter(newFocus, newEl);
        this.range.anchor.moveToStart(newEl);
        this.range.focus.moveToEnd(newEl);
        elements = [newEl];
      } else {
        elements = [this.range.anchor.element];
      }
    } else {
      const flatElements = AlexElement.flatElements(this.stack);
      const anchorIndex = flatElements.findIndex((item) => {
        return this.range.anchor.element.isEqual(item);
      });
      const focusIndex = flatElements.findIndex((item) => {
        return this.range.focus.element.isEqual(item);
      });
      for (let i = anchorIndex + 1; i < focusIndex; i++) {
        if (!flatElements[i].hasContains(this.range.anchor.element) && !flatElements[i].hasContains(this.range.focus.element)) {
          elements.push(flatElements[i]);
        }
      }
      if (this.range.anchor.element.isText()) {
        let val = this.range.anchor.element.textContent;
        this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset);
        let newEl = new AlexElement("text", null, null, null, val.substring(this.range.anchor.offset));
        this.addElementAfter(newEl, this.range.anchor.element);
        elements.unshift(newEl);
      } else if (this.range.anchor.offset == 0) {
        elements.unshift(this.range.anchor.element);
      }
      if (this.range.focus.element.isText()) {
        let val = this.range.focus.element.textContent;
        this.range.focus.element.textContent = val.substring(0, this.range.focus.offset);
        let newEl = new AlexElement("text", null, null, null, val.substring(this.range.focus.offset));
        this.addElementAfter(newEl, this.range.focus.element);
        elements.push(this.range.focus.element);
      } else {
        elements.push(this.range.focus.element);
      }
    }
    return elements;
  }
  //根据光标位置删除编辑器内容
  delete() {
    if (this.range.anchor.isEqual(this.range.focus)) {
      const previousElement = this.getPreviousElementOfPoint(this.range.anchor);
      const anchorBlock = this.range.anchor.getBlock();
      if (this.range.anchor.offset == 0) {
        if (previousElement) {
          if (anchorBlock.isContains(previousElement)) {
            this.range.anchor.moveToEnd(previousElement);
            this.range.focus.moveToEnd(previousElement);
            this._deleteInSameElement();
          } else {
            this.mergeBlockElement(anchorBlock);
            this.range.anchor.moveToEnd(previousElement);
            this.range.focus.moveToEnd(previousElement);
          }
        }
      } else {
        this._deleteInSameElement();
      }
    } else {
      if (this.range.anchor.element.isEqual(this.range.focus.element)) {
        this._deleteInSameElement();
      } else {
        const flatElements = AlexElement.flatElements(this.stack);
        const anchorIndex = flatElements.findIndex((item) => {
          return this.range.anchor.element.isEqual(item);
        });
        const focusIndex = flatElements.findIndex((item) => {
          return this.range.focus.element.isEqual(item);
        });
        let rangeElements = [];
        for (let i = anchorIndex + 1; i < focusIndex; i++) {
          if (!flatElements[i].hasContains(this.range.anchor.element) && !flatElements[i].hasContains(this.range.focus.element)) {
            rangeElements.push(flatElements[i]);
          }
        }
        rangeElements.forEach((el) => {
          if (el.isText()) {
            el.textContent = "";
          } else if (el.isClosed()) {
            const index = el.parent.children.findIndex((item) => {
              return el.isEqual(item);
            });
            el.parent.children.splice(index, 1);
          }
          if (el.hasChildren()) {
            el.children = [];
          }
        });
        const focusBlock = this.range.focus.getBlock();
        let hasMerge = !focusBlock.hasContains(this.range.anchor.element);
        let focsuElement = this.range.focus.element;
        let focusOffset = this.range.focus.offset;
        let anchorElement = this.range.anchor.element;
        let anchorOffset = this.range.anchor.offset;
        this.range.anchor.element = focsuElement;
        this.range.anchor.offset = 0;
        this._deleteInSameElement();
        this.range.anchor.element = anchorElement;
        this.range.anchor.offset = anchorOffset;
        this.range.focus.element = focsuElement;
        this.range.focus.offset = focusOffset;
        this.range.focus.element = anchorElement;
        this.range.focus.offset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1;
        this._deleteInSameElement();
        if (hasMerge) {
          this.mergeBlockElement(focusBlock);
        }
      }
    }
  }
  //根据光标位置向编辑器内插入文本
  insertText(data) {
    if (!data || typeof data != "string") {
      throw new Error("The argument must be a string");
    }
    data = data.replace(/\s+/g, () => {
      const span = document.createElement("span");
      span.innerHTML = "&nbsp;";
      return span.innerText;
    });
    if (this.range.anchor.isEqual(this.range.focus)) {
      if (this.range.anchor.element.isText()) {
        let val = this.range.anchor.element.textContent;
        this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset) + data + val.substring(this.range.anchor.offset);
        this.range.anchor.offset = this.range.anchor.offset + data.length;
        this.range.focus.offset = this.range.anchor.offset;
      } else {
        const textEl = new AlexElement("text", null, null, null, data);
        if (this.range.anchor.offset == 0) {
          this.addElementBefore(textEl, this.range.anchor.element);
        } else {
          this.addElementAfter(textEl, this.range.anchor.element);
        }
        this.range.anchor.moveToEnd(textEl);
        this.range.focus.moveToEnd(textEl);
      }
    } else {
      this.delete();
      this.insertText(data);
    }
  }
  //在光标处换行
  insertParagraph() {
    if (this.range.anchor.isEqual(this.range.focus)) {
      const previousElement = this.getPreviousElementOfPoint(this.range.anchor);
      const nextElement = this.getNextElementOfPoint(this.range.anchor);
      const anchorBlock = this.range.anchor.getBlock();
      const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1;
      if (this.range.anchor.offset == 0 && !(previousElement && anchorBlock.isContains(previousElement))) {
        const paragraph = new AlexElement("block", anchorBlock.parsedom, null, null, null);
        const breakEle = new AlexElement("closed", "br", null, null, null);
        this.addElementTo(breakEle, paragraph, 0);
        this.addElementBefore(paragraph, anchorBlock);
        this.range.anchor.moveToStart(anchorBlock);
        this.range.focus.moveToStart(anchorBlock);
      } else if (this.range.anchor.offset == endOffset && !(nextElement && anchorBlock.isContains(nextElement))) {
        const paragraph = new AlexElement("block", anchorBlock.parsedom, null, null, null);
        const breakEle = new AlexElement("closed", "br", null, null, null);
        this.addElementTo(breakEle, paragraph, 0);
        this.addElementAfter(paragraph, anchorBlock);
        this.range.anchor.moveToStart(paragraph);
        this.range.focus.moveToStart(paragraph);
      } else {
        const block = this.range.anchor.getBlock();
        const newBlock = block.clone(true);
        this.addElementAfter(newBlock, block);
        this.range.focus.moveToEnd(block);
        this.delete();
        const elements = AlexElement.flatElements(block.children);
        const index = elements.findIndex((item) => {
          return this.range.anchor.element.isEqual(item);
        });
        const newElements = AlexElement.flatElements(newBlock.children);
        this.range.focus.element = newElements[index];
        this.range.focus.offset = this.range.anchor.offset;
        this.range.anchor.moveToStart(newBlock);
        this.delete();
      }
    } else {
      this.delete();
      this.insertParagraph();
    }
  }
  //将真实的光标设置到指定元素开始
  collapseToStart(element) {
    if (AlexElement.isElement(element)) {
      this.range.anchor.moveToStart(element);
      this.range.focus.moveToStart(element);
      this.range.setCursor();
    } else {
      const flatElements = AlexElement.flatElements(this.stack);
      this.collapseToStart(flatElements[0]);
    }
  }
  //将真实的光标设置到指定元素最后
  collapseToEnd(element) {
    if (AlexElement.isElement(element)) {
      this.range.anchor.moveToEnd(element);
      this.range.focus.moveToEnd(element);
      this.range.setCursor();
    } else {
      const flatElements = AlexElement.flatElements(this.stack);
      const length = flatElements.length;
      this.collapseToEnd(flatElements[length - 1]);
    }
  }
  //根据光标设置css样式
  setStyle(styleObject) {
    if (!Util$1.isObject) {
      throw new Error("The argument must be an object");
    }
    const elements = this.getElementsByRange();
    elements.forEach((el) => {
      if (el.isText()) {
        let cloneEl = el.clone();
        el.type = "inline";
        el.parsedom = "span";
        el.textContent = null;
        for (let key in styleObject) {
          if (!el.hasStyles()) {
            el.styles = {};
          }
          el.styles[key] = styleObject[key];
        }
        this.addElementTo(cloneEl, el, 0);
      }
    });
    this.range.anchor.moveToStart(elements[0]);
    this.range.focus.moveToEnd(elements[elements.length - 1]);
  }
  //根据光标插入元素
  insertElement(ele) {
    if (!AlexElement.isElement(ele)) {
      throw new Error("The argument must be an AlexElement instance");
    }
    if (this.range.anchor.isEqual(this.range.focus)) {
      if (ele.isBlock()) {
        const previousElement = this.getPreviousElementOfPoint(this.range.anchor);
        const nextElement = this.getNextElementOfPoint(this.range.anchor);
        const anchorBlock = this.range.anchor.getBlock();
        const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1;
        if (this.range.anchor.offset == 0 && !(previousElement && anchorBlock.isContains(previousElement))) {
          this.addElementBefore(ele, anchorBlock);
        } else if (this.range.anchor.offset == endOffset && !(nextElement && anchorBlock.isContains(nextElement))) {
          this.addElementAfter(ele, anchorBlock);
        } else {
          const block = this.range.anchor.getBlock();
          const newBlock = block.clone(true);
          this.addElementAfter(newBlock, block);
          this.range.focus.moveToEnd(block);
          this.delete();
          const elements = AlexElement.flatElements(block.children);
          const index = elements.findIndex((item) => {
            return this.range.anchor.element.isEqual(item);
          });
          const newElements = AlexElement.flatElements(newBlock.children);
          this.range.focus.element = newElements[index];
          this.range.focus.offset = this.range.anchor.offset;
          this.range.anchor.moveToStart(newBlock);
          this.delete();
          this.addElementBefore(ele, newBlock);
        }
      } else {
        if (this.range.anchor.element.isText()) {
          let val = this.range.anchor.element.textContent;
          this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset);
          let newText = new AlexElement("text", null, null, null, val.substring(this.range.anchor.offset));
          this.addElementAfter(newText, this.range.anchor.element);
          this.addElementBefore(ele, newText);
        } else {
          if (this.range.anchor.offset == 0) {
            this.addElementBefore(ele, this.range.anchor.element);
          } else {
            this.addElementAfter(ele, this.range.anchor.element);
          }
        }
      }
      this.range.anchor.moveToEnd(ele);
      this.range.focus.moveToEnd(ele);
    } else {
      this.delete();
      this.insertElement(ele);
    }
  }
}
export {
  AlexEditor,
  AlexElement,
  AlexEditor as default
};
