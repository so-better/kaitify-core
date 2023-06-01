var __defProp = Object.defineProperty;
var __defNormalProp = (obj2, key, value) => key in obj2 ? __defProp(obj2, key, { enumerable: true, configurable: true, writable: true, value }) : obj2[key] = value;
var __publicField = (obj2, key, value) => {
  __defNormalProp(obj2, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const number = {
  /**
   * 数字格式化
   * @param {Number} num
   */
  formatNumber(num) {
    if (this.isNumber(num)) {
      return num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
    } else {
      return num;
    }
  },
  /**
   * 判断是否数字
   * @param {Object} num
   */
  isNumber(num) {
    if (typeof num == "number" && !isNaN(num)) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 多个数的加法运算
   */
  add(...values) {
    return values.reduce((num, value) => {
      let r1 = 0;
      let r2 = 0;
      let m = 0;
      try {
        r1 = num.toString().split(".")[1].length;
      } catch (e) {
      }
      try {
        r2 = value.toString().split(".")[1].length;
      } catch (e) {
      }
      m = Math.pow(10, Math.max(r1, r2));
      return (num * m + value * m) / m;
    });
  },
  /**
   * 多个数的减法运算
   */
  subtract(...values) {
    return values.reduce((num, value) => {
      let r1 = 0;
      let r2 = 0;
      let m = 0;
      try {
        r1 = num.toString().split(".")[1].length;
      } catch (e) {
      }
      try {
        r2 = value.toString().split(".")[1].length;
      } catch (e) {
      }
      m = Math.pow(10, Math.max(r1, r2));
      return (num * m - value * m) / m;
    });
  },
  /**
   * 多个数的乘法运算
   */
  mutiply(...values) {
    return values.reduce((num, value) => {
      let m = 0;
      let s1 = num.toString();
      let s2 = value.toString();
      try {
        m += s1.split(".")[1].length;
      } catch (e) {
      }
      try {
        m += s2.split(".")[1].length;
      } catch (e) {
      }
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    });
  },
  /**
   * 多个数的除法运算
   */
  divide(...values) {
    return values.reduce((num, value) => {
      let t1 = 0;
      let t2 = 0;
      let s1 = num.toString();
      let s2 = value.toString();
      try {
        t1 = s1.split(".")[1].length;
      } catch (e) {
      }
      try {
        t2 = s2.split(".")[1].length;
      } catch (e) {
      }
      s1 = Number(s1.replace(".", ""));
      s2 = Number(s2.replace(".", ""));
      return s1 / s2 * Math.pow(10, t2 - t1);
    });
  }
};
const string = {
  /**
   * 向指定位置插入字符串
   * @param {Object} original 原始字符串
   * @param {Object} str 插入的字符串
   * @param {Object} index 插入的位置
   */
  insert(original, str, index) {
    if (!original || typeof original != "string") {
      throw new TypeError("The first argument must be a string");
    }
    if (typeof str != "string") {
      throw new TypeError("The second argument must be a string");
    }
    if (!number.isNumber(index)) {
      throw new TypeError("The third argument must be a number");
    }
    if (index < 0) {
      throw new Error("The third argument cannot be less than 0");
    }
    return original.substring(0, index) + str + original.substring(index, original.length);
  },
  /**
   * 删除指定位置的字符串
   * @param {Object} original 原始字符串
   * @param {Object} index 删除的位置序列
   * @param {Object} num 删除的字符串长度
   */
  delete(original, index, num) {
    if (!original || typeof original != "string") {
      throw new TypeError("The first argument must be a string");
    }
    if (!number.isNumber(index)) {
      throw new TypeError("The second argument must be a number");
    }
    if (index < 0) {
      throw new Error("The second argument cannot be less than 0");
    }
    if (!number.isNumber(num)) {
      throw new TypeError("The third argument must be a number");
    }
    if (num < 0) {
      throw new Error("The third argument cannot be less than 0");
    }
    return original.substring(0, index) + original.substring(index + num, original.length);
  },
  /**
   * 替换指定位置的字符串
   * @param {Object} original 原始字符串
   * @param {Object} start 开始位置
   * @param {Object} end 结束位置
   * @param {Object} str 替换的字符串
   */
  replace(original, start, end, str) {
    if (!original || typeof original != "string") {
      throw new TypeError("The first argument must be a string");
    }
    if (!number.isNumber(start)) {
      throw new TypeError("The second argument must be a number");
    }
    if (start < 0) {
      throw new Error("The second argument cannot be less than 0");
    }
    if (!number.isNumber(end)) {
      throw new TypeError("The third argument must be a number");
    }
    if (end < 0) {
      throw new Error("The third argument cannot be less than 0");
    }
    if (typeof str != "string") {
      throw new TypeError("The fourth argument must be a string");
    }
    return original.substring(0, start) + str + original.substring(end, original.length);
  },
  /**
   * 去除字符串空格
   * @param {Object} str
   * @param {Object} global 为true时去除所有空格，否则只去除两边空格
   */
  trim(str, global) {
    if (typeof str != "string") {
      throw new TypeError("The first argument must be a string");
    }
    let result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (global) {
      result = result.replace(/\s/g, "");
    }
    return result;
  }
};
const element = {
  /**
   * 判断是否是Window对象
   * @param {Object} data 入参
   */
  isWindow(data2) {
    return data2 && data2 instanceof Window;
  },
  /**
   * 获取元素距离指定祖先元素左侧/顶部/底部/右侧的距离
   * @param {Object} el 元素
   * @param {Object} root 父元素或者祖先元素，未指定则为document.body
   */
  getElementPoint(el, root) {
    if (!this.isElement(el)) {
      throw new TypeError("The first argument must be an element");
    }
    if (!this.isElement(root)) {
      root = document.body;
    }
    if (!this.isContains(root, el)) {
      throw new Error("The second argument and the first argument have no hierarchical relationship");
    }
    let obj2 = el;
    let offsetTop = 0;
    let offsetLeft = 0;
    while (this.isElement(el) && this.isContains(root, el) && root !== el) {
      offsetTop += el.offsetTop;
      offsetLeft += el.offsetLeft;
      el = el.offsetParent;
    }
    let offsetRight = root.offsetWidth - offsetLeft - obj2.offsetWidth;
    let offsetBottom = root.offsetHeight - offsetTop - obj2.offsetHeight;
    return {
      top: offsetTop,
      left: offsetLeft,
      right: offsetRight,
      bottom: offsetBottom
    };
  },
  /**
   * 判断某个节点是否包含指定节点，包含相等关系和父子关系
   * @param {Object} parentNode 父节点或祖先节点
   * @param {Object} childNode 子节点
   */
  isContains(parentNode, childNode) {
    if (!this.isElement(parentNode)) {
      throw new TypeError("The first argument must be an element");
    }
    if (!this.isElement(childNode, true)) {
      throw new TypeError("The second argument must be an element");
    }
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
  /**
   * 判断某个节点是否是指定节点的父节点
   * @param {Object} parentNode 父节点
   * @param {Object} childNode 子节点
   */
  isParentNode(parentNode, childNode) {
    if (!this.isElement(parentNode)) {
      throw new TypeError("The first argument must be an element");
    }
    if (!this.isElement(childNode, true)) {
      throw new TypeError("The second argument must be an element");
    }
    if (parentNode === childNode) {
      return false;
    }
    return childNode.parentNode === parentNode;
  },
  /**
   * 查找某个节点下指定选择器的子元素
   * @param {Object} el 元素节点
   * @param {Object} selector 支持多选择器，等同于querySelectorAll的参数
   */
  children(el, selector) {
    if (!this.isElement(el)) {
      throw new TypeError("The first argument must be an element");
    }
    if (selector && typeof selector != "string") {
      throw new TypeError("The second argument must be a string");
    }
    const res = el.querySelectorAll(selector || "*");
    return [...res].filter((ele) => {
      return ele.parentNode === el;
    });
  },
  /**
   * 查找某个节点下指定选择器的兄弟节点
   * @param {Object} el 元素节点
   * @param {Object} selector 取值等同于queryselectorAll的参数，支持多选择器
   */
  siblings(el, selector) {
    if (!this.isElement(el)) {
      throw new TypeError("The first argument must be an element");
    }
    if (selector && typeof selector != "string") {
      throw new TypeError("The second argument must be a string");
    }
    if (!el.parentNode) {
      return [];
    }
    const res = el.parentNode.querySelectorAll(selector || "*");
    return [...res].filter((ele) => {
      return ele.parentNode === el.parentNode && ele != el;
    });
  },
  /**
   * rem与px单位转换
   * @param {Object} num rem数值
   */
  rem2px(num) {
    if (!number.isNumber(num)) {
      throw new TypeError("The argument must be a number");
    }
    let fs = this.getCssStyle(document.documentElement, "font-size");
    return number.mutiply(num, parseFloat(fs));
  },
  /**
   * rem与px单位转换
   * @param {Object} num px数值
   */
  px2rem(num) {
    if (!number.isNumber(num)) {
      throw new TypeError("The argument must be a number");
    }
    let fs = this.getCssStyle(document.documentElement, "font-size");
    return number.divide(num, parseFloat(fs));
  },
  /**
   * 获取元素的内容宽度，内容宽度不包括border和padding
   * @param {Object} el 支持css选择器字符串，未指定则表示document.body
   */
  width(el) {
    if (typeof el == "string" && el) {
      el = document.body.querySelector(el);
    }
    if (!this.isElement(el)) {
      el = document.body;
    }
    let clientWidth = el.clientWidth;
    let paddingLeft_width = parseFloat(this.getCssStyle(el, "padding-left"));
    let paddingRight_width = parseFloat(this.getCssStyle(el, "padding-right"));
    return number.subtract(clientWidth, paddingLeft_width, paddingRight_width);
  },
  /**
   * 获取元素的内容高度，内容高度不包括border和padding
   * @param {Object} el 支持css选择器字符串 未指定则表示document.body
   */
  height(el) {
    if (typeof el == "string" && el) {
      el = document.body.querySelector(el);
    }
    if (!this.isElement(el)) {
      el = document.body;
    }
    let clientHeight = el.clientHeight;
    let paddingTop_height = parseFloat(this.getCssStyle(el, "padding-top"));
    let paddingBottom_height = parseFloat(this.getCssStyle(el, "padding-bottom"));
    return number.subtract(clientHeight, paddingTop_height, paddingBottom_height);
  },
  /**
   * 移除class
   * @param {Object} el 元素节点
   * @param {Object} className 支持多类,以空格划分
   */
  removeClass(el, className) {
    if (!this.isElement(el)) {
      throw new TypeError("The first argument must be an element");
    }
    if (!className || typeof className != "string") {
      throw new TypeError("The second argument must be a string");
    }
    let classList = el.classList;
    let classArray = string.trim(className).split(/\s+/);
    classArray.forEach((item, index) => {
      classList.remove(item);
    });
  },
  /**
   * 添加class
   * @param {Object} el 元素节点
   * @param {Object} className 支持多类,以空格划分
   */
  addClass(el, className) {
    if (!this.isElement(el)) {
      throw new TypeError("The first argument must be an element");
    }
    if (!className || typeof className != "string") {
      throw new TypeError("The second argument must be a string");
    }
    let classList = el.classList;
    let classArray = string.trim(className).split(/\s+/);
    classArray.forEach((item, index) => {
      classList.add(item);
    });
  },
  /**
   * 判断指定元素是否含有指定类名
   * @param {Object} el 元素节点
   * @param {Object} className 支持多类,以空格划分
   */
  hasClass(el, className) {
    if (!this.isElement(el)) {
      throw new TypeError("The first argument must be an element");
    }
    if (!className || typeof className != "string") {
      throw new TypeError("The second argument must be a string");
    }
    let classList = el.classList;
    let classArray = string.trim(className).split(/\s+/);
    return classArray.every((item, index) => {
      return classList.contains(item);
    });
  },
  /**
   * 监听元素滚动到顶部或者底部
   * @param {Object} el 支持css选择器字符串 未指定则为窗口滚动
   * @param {Object} callback 回调函数
   */
  scrollTopBottomTrigger(el, callback) {
    if (typeof el == "string" && el) {
      el = document.body.querySelector(el);
    }
    let scrollEle = window;
    if (this.isElement(el) && el != document.body && el != document.documentElement) {
      scrollEle = el;
    }
    if (typeof el == "function") {
      callback = el;
    }
    let flag = true;
    scrollEle.addEventListener("scroll", (e) => {
      if (this.getScrollTop(scrollEle) <= 0) {
        let options = {
          state: "top",
          target: scrollEle
        };
        if (!flag) {
          return;
        }
        if (typeof callback == "function") {
          flag = false;
          callback(options);
        }
      } else {
        let options = {
          state: "bottom",
          target: scrollEle
        };
        let height = 0;
        if (scrollEle == window) {
          height = window.innerHeight;
        } else {
          height = scrollEle.clientHeight;
        }
        if (number.add(this.getScrollTop(scrollEle), height) + 1 >= this.getScrollHeight(scrollEle) && height != this.getScrollHeight(scrollEle)) {
          if (!flag) {
            return;
          }
          if (typeof callback == "function") {
            flag = false;
            callback(options);
          }
        } else {
          flag = true;
        }
      }
    });
  },
  /**
   * 获取文档或元素的总宽度
   * @param {Object} el 支持css选择器字符串 未指定则表示整个页面文档
   */
  getScrollWidth(el) {
    if (typeof el == "string" && el) {
      el = document.body.querySelector(el);
    }
    let scrollWidth = 0;
    if (this.isElement(el) && el != document.documentElement && el != document.body) {
      scrollWidth = el.scrollWidth;
    } else {
      if (document.documentElement.scrollWidth == 0 || document.body.scrollWidth == 0) {
        scrollWidth = document.documentElement.scrollWidth || document.body.scrollWidth;
      } else {
        scrollWidth = document.documentElement.scrollWidth > document.body.scrollWidth ? document.documentElement.scrollWidth : document.body.scrollWidth;
      }
    }
    return scrollWidth;
  },
  /**
   * 获取文档或者元素的总高度
   * @param {Object} el 支持css选择器字符串 未指定则表示整个页面文档
   */
  getScrollHeight(el) {
    if (typeof el == "string" && el) {
      el = document.body.querySelector(el);
    }
    let scrollHeight = 0;
    if (this.isElement(el) && el != document.documentElement && el != document.body) {
      scrollHeight = el.scrollHeight;
    } else {
      if (document.documentElement.scrollHeight == 0 || document.body.scrollHeight == 0) {
        scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      } else {
        scrollHeight = document.documentElement.scrollHeight > document.body.scrollHeight ? document.documentElement.scrollHeight : document.body.scrollHeight;
      }
    }
    return scrollHeight;
  },
  /**
   * 设置滚动条在Y轴上的距离
   * @param {Object} options {el,number,time} el支持css选择器字符串 未指定则为窗口滚动
   */
  setScrollTop(options) {
    let isWindow = false;
    let el = options.el;
    if (typeof el == "string" && el) {
      el = document.body.querySelector(el);
    }
    let number$1 = options.number || 0;
    let time = options.time || 0;
    if (!this.isElement(el) || el == document.body || el == document.documentElement || el == window) {
      isWindow = true;
    }
    return new Promise((resolve, reject) => {
      if (time <= 0) {
        if (isWindow) {
          document.documentElement.scrollTop = document.body.scrollTop = number$1;
        } else {
          el.scrollTop = number$1;
        }
        resolve();
      } else {
        let spacingTime = 10;
        let spacingIndex = number.divide(time, spacingTime);
        let nowTop = this.getScrollTop(el);
        let everTop = number.divide(number.subtract(number$1, nowTop), spacingIndex);
        let scrollTimer = setInterval(() => {
          if (spacingIndex > 0) {
            spacingIndex--;
            if (isWindow) {
              document.documentElement.scrollTop = document.body.scrollTop = nowTop = number.add(nowTop, everTop);
            } else {
              el.scrollTop = nowTop = number.add(nowTop, everTop);
            }
          } else {
            clearInterval(scrollTimer);
            resolve();
          }
        }, spacingTime);
      }
    });
  },
  /**
   * 获取滚动条在Y轴上滚动的距离
   * @param {Object} el 支持css选择器字符串 未指定则为窗口滚动
   */
  getScrollTop(el) {
    if (typeof el == "string" && el) {
      el = document.body.querySelector(el);
    }
    let scrollTop = 0;
    if (this.isElement(el) && el != document.body && el != document.documentElement && el != window) {
      scrollTop = el.scrollTop;
    } else {
      if (document.documentElement.scrollTop == 0 || document.body.scrollTop == 0) {
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      } else {
        scrollTop = document.documentElement.scrollTop > document.body.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
      }
    }
    return scrollTop;
  },
  /**
   * 获取滚动条在X轴上滚动的距离
   * @param {Object} el 支持css选择器字符串 未指定则为窗口滚动
   */
  getScrollLeft(el) {
    if (typeof el == "string" && el) {
      el = document.body.querySelector(el);
    }
    let scrollLeft = 0;
    if (this.isElement(el) && el != document.body && el != document.documentElement && el != window) {
      scrollLeft = el.scrollLeft;
    } else {
      if (document.documentElement.scrollLeft == 0 || document.body.scrollLeft == 0) {
        scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
      } else {
        scrollLeft = document.documentElement.scrollLeft > document.body.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft;
      }
    }
    return scrollLeft;
  },
  /**
   * 设置滚动条在X轴上的距离
   * @param {Object} options {el,number,time} el支持css选择器字符串 未指定则为窗口滚动
   */
  setScrollLeft(options) {
    let isWindow = false;
    let el = options.el;
    if (typeof el == "string" && el) {
      el = document.body.querySelector(el);
    }
    let number$1 = options.number || 0;
    let time = options.time || 0;
    if (!this.isElement(el) || el == document.body || el == document.documentElement || el == window) {
      isWindow = true;
    }
    return new Promise((resolve, reject) => {
      if (time <= 0) {
        if (isWindow) {
          document.documentElement.scrollLeft = document.body.scrollLeft = number$1;
        } else {
          el.scrollLeft = number$1;
        }
        resolve();
      } else {
        let spacingTime = 10;
        let spacingIndex = number.divide(time, spacingTime);
        let nowLeft = this.getScrollLeft(el);
        let everLeft = number.divide(number.subtract(number$1, nowLeft), spacingIndex);
        let scrollTimer = setInterval(() => {
          if (spacingIndex > 0) {
            spacingIndex--;
            if (isWindow) {
              document.documentElement.scrollLeft = document.body.scrollLeft = nowLeft = number.add(nowLeft, everLeft);
            } else {
              el.scrollLeft = nowLeft = number.add(nowLeft, everLeft);
            }
          } else {
            clearInterval(scrollTimer);
            resolve();
          }
        }, spacingTime);
      }
    });
  },
  /**
   * 获取元素指定样式
   * @param {Object} el 元素
   * @param {Object} cssName 样式名称
   */
  getCssStyle(el, cssName) {
    if (!this.isElement(el)) {
      throw new TypeError("The first argument must be an element");
    }
    if (!cssName || typeof cssName != "string") {
      throw new TypeError("The second argument must be a string");
    }
    let cssText = "";
    if (document.defaultView && document.defaultView.getComputedStyle) {
      cssText = document.defaultView.getComputedStyle(el)[cssName];
    } else {
      cssText = el.currentStyle[cssName];
    }
    return cssText;
  },
  /**
   * 判断字符串属于哪种选择器
   * @param {Object} selector
   */
  getCssSelector(selector) {
    if (!selector || typeof selector != "string") {
      throw new TypeError("The argument must be a selector string");
    }
    if (/^#{1}/.test(selector)) {
      return {
        type: "id",
        value: selector.substr(1)
      };
    }
    if (/^\./.test(selector)) {
      return {
        type: "class",
        value: selector.substr(1)
      };
    }
    if (/^\[(.+)\]$/.test(selector)) {
      let type = "attribute";
      let value = "";
      let attribute = string.trim(selector, true).substring(1, string.trim(selector, true).length - 1);
      let arry = attribute.split("=");
      if (arry.length == 1) {
        value = arry[0];
      }
      if (arry.length == 2) {
        value = {
          attributeName: arry[0],
          attributeValue: arry[1].replace(/\'/g, "").replace(/\"/g, "")
          //去除属性值的单引号或者双引号
        };
      }
      return {
        type,
        value
      };
    }
    return {
      type: "tag",
      value: selector
    };
  },
  /**
   * 获取元素距离可视窗口的位置
   * @param {Object} el 支持css选择器字符串 未指定则为document.body
   */
  getElementBounding(el) {
    if (typeof el == "string" && el) {
      el = document.body.querySelector(el);
    }
    if (!this.isElement(el)) {
      el = document.body;
    }
    let point = el.getBoundingClientRect();
    let top = point.top;
    let bottom = number.subtract(document.documentElement.clientHeight || window.innerHeight, point.bottom);
    let left = point.left;
    let right = number.subtract(document.documentElement.clientWidth || window.innerWidth, point.right);
    return {
      top,
      bottom,
      left,
      right
    };
  },
  /**
   * 判断是否是元素节点
   * @param {Object} el
   */
  isElement(el) {
    return el && el instanceof Node && el.nodeType === 1;
  },
  /**
   * 字符串转dom
   * @param {Object} str
   */
  string2dom(str, parentTag = "div") {
    if (!str || typeof str != "string") {
      throw new TypeError("The argument must be an HTML string");
    }
    let parentEle = document.createElement(parentTag);
    parentEle.innerHTML = str;
    if (parentEle.children.length == 1) {
      return parentEle.children[0];
    } else {
      return parentEle.children;
    }
  }
};
const dataName = "_dap-datas";
const data = {
  /**
   * 移除指定数据
   * @param {Object} el
   * @param {Object} key
   */
  remove(el, key) {
    if (!(el instanceof Document) && !element.isElement(el) && !element.isWindow(el)) {
      throw new TypeError("The first argument must be an element node or window or document");
    }
    let data2 = el[dataName] || {};
    if (key === void 0 || key === null || key === "") {
      el[dataName] = {};
    } else {
      delete data2[key];
      el[dataName] = data2;
    }
  },
  /**
   * 判断是否含有指定数据
   * @param {Object} el
   * @param {Object} key
   */
  has(el, key) {
    if (!(el instanceof Document) && !element.isElement(el) && !element.isWindow(el)) {
      throw new TypeError("The first argument must be an element node or window or document");
    }
    if (key === void 0 || key === null || key === "") {
      throw new TypeError("The second parameter must be a unique key");
    }
    let data2 = el[dataName] || {};
    return data2.hasOwnProperty(key);
  },
  /**
   * 获取元素指定数据
   * @param {Object} el
   * @param {Object} key
   */
  get(el, key) {
    if (!(el instanceof Document) && !element.isElement(el) && !element.isWindow(el)) {
      throw new TypeError("The first argument must be an element node or window or document");
    }
    let data2 = el[dataName] || {};
    if (key === void 0 || key === null || key === "") {
      return data2;
    } else {
      return data2[key];
    }
  },
  /**
   * 获取元素指定数据
   * @param {Object} el
   * @param {Object} key
   * @param {Object} value
   */
  set(el, key, value) {
    if (!(el instanceof Document) && !element.isElement(el) && !element.isWindow(el)) {
      throw new TypeError("The first argument must be an element node or window or document");
    }
    if (key === void 0 || key === null || key === "") {
      throw new TypeError("The second parameter must be a unique key");
    }
    let data2 = el[dataName] || {};
    data2[key] = value;
    el[dataName] = data2;
  }
};
const common = {
  /**
   * 常用判断
   * @param {Object} text 要判断的字符串
   * @param {Object} params 判断的类型字符串
   */
  matchingText(text, params) {
    if (!text || typeof text != "string") {
      throw new TypeError("The first argument must be a string");
    }
    if (!params || typeof params != "string") {
      throw new TypeError("The second argument must be a string");
    }
    let reg = null;
    if (params == "Chinese") {
      reg = /^[\u4e00-\u9fa5]+$/;
    }
    if (params == "chinese") {
      reg = /[\u4e00-\u9fa5]/;
    }
    if (params == "email") {
      reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    }
    if (params == "userName") {
      reg = /^[a-zA-Z0-9_]{4,16}$/;
    }
    if (params == "int+") {
      reg = /^\d+$/;
    }
    if (params == "int-") {
      reg = /^-\d+$/;
    }
    if (params == "int") {
      reg = /^-?\d+$/;
    }
    if (params == "pos") {
      reg = /^\d*\.?\d+$/;
    }
    if (params == "neg") {
      reg = /^-\d*\.?\d+$/;
    }
    if (params == "number") {
      reg = /^-?\d*\.?\d+$/;
    }
    if (params == "phone") {
      reg = /^1[0-9]\d{9}$/;
    }
    if (params == "idCard") {
      reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    }
    if (params == "url") {
      reg = /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    }
    if (params == "IPv4") {
      reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    }
    if (params == "hex") {
      reg = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    }
    if (params == "date") {
      let reg1 = /^((\d{4})(-)(\d{2})(-)(\d{2}))$/;
      let reg2 = /^(\d{4})(\/)(\d{2})(\/)(\d{2})$/;
      let reg3 = /^(\d{4})(\.)(\d{2})(\.)(\d{2})$/;
      let reg4 = /^(\d{4})(年)(\d{2})(月)(\d{2})(日)$/;
      return reg1.test(text) || reg2.test(text) || reg3.test(text) || reg4.test(text);
    }
    if (params == "time") {
      reg = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
    }
    if (params == "QQ") {
      reg = /^[1-9][0-9]{4,10}$/;
    }
    if (params == "weixin") {
      reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;
    }
    if (params == "plate") {
      reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
    }
    if (!reg) {
      throw new Error("The second parameter is out of scope");
    }
    return reg.test(text);
  },
  /**
   * 根据参数名获取地址栏参数值
   * @param {Object} name
   */
  getUrlParams(name) {
    if (!name || typeof name != "string") {
      throw new TypeError("The argument must be a string");
    }
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let search = window.location.search.substr(1);
    if (!search) {
      let arr = window.location.hash.split("?");
      if (arr.length == 2) {
        search = arr[1];
      }
    }
    let r = search.match(reg);
    if (r) {
      return decodeURIComponent(r[2]);
    }
    return null;
  },
  /**
   * 判断是否空对象
   * @param {Object} obj
   */
  isEmptyObject(obj2) {
    if (this.isObject(obj2)) {
      if (Object.keys(obj2).length == 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  /**
   * 判断两个参数是否相等
   * @param {Object} a
   * @param {Object} b
   */
  equal(a, b) {
    if (typeof a !== typeof b) {
      return false;
    }
    if (this.isObject(a) && this.isObject(b)) {
      a = Object.assign({}, a);
      b = Object.assign({}, b);
      let aProps = Object.getOwnPropertyNames(a);
      let bProps = Object.getOwnPropertyNames(b);
      if (aProps.length != bProps.length) {
        return false;
      }
      let length = aProps.length;
      for (let i = 0; i < length; i++) {
        let propName = aProps[i];
        let propA = a[propName];
        let propB = b[propName];
        if (this.isObject(propA)) {
          if (this.equal(propA, propB)) {
            return true;
          } else {
            return false;
          }
        } else if (propA !== propB) {
          return false;
        }
      }
      return true;
    } else {
      return a === b;
    }
  },
  /**
   * 是否对象
   * @param {Object} val
   */
  isObject(val) {
    if (typeof val === "object" && val) {
      return true;
    }
    return false;
  },
  /**
   * 文本复制
   * @param {Object} text
   */
  copyText(text) {
    if (!text || typeof text != "string") {
      throw new TypeError("No text to copy is defined");
    }
    let el = element.string2dom('<input type="text" />');
    document.body.appendChild(el);
    el.value = text;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
};
const parseEventName = (eventName) => {
  let eventNames = eventName.split(/[\s]+/g);
  let result = [];
  eventNames.forEach((name) => {
    let arr = name.split(".");
    let obj2 = {
      eventName: arr[0]
    };
    if (arr.length > 1) {
      obj2.guid = arr[1];
    }
    result.push(obj2);
  });
  return result;
};
const updateEvents = (events) => {
  let obj2 = {};
  let keys = Object.keys(events);
  keys.forEach((key) => {
    if (events[key]) {
      obj2[key] = events[key];
    }
  });
  return obj2;
};
const bindSingleListener = (el, eventName, guid, fn, options) => {
  let events = data.get(el, "dap-defined-events") || {};
  if (!guid) {
    guid = data.get(el, "dap-event-guid") || 0;
    data.set(el, "dap-event-guid", guid + 1);
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
  data.set(el, "dap-defined-events", events);
};
const unbindSingleListener = (el, eventName, guid) => {
  let events = data.get(el, "dap-defined-events") || {};
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
  data.set(el, "dap-defined-events", events);
};
const event = {
  /**
   * 绑定事件
   * @param {Object} el 元素节点
   * @param {Object} eventName 事件名称
   * @param {Object} fn 函数
   * @param {Object} options 参数
   */
  on(el, eventName, fn, options) {
    if (!(el instanceof Document) && !element.isElement(el) && !element.isWindow(el)) {
      throw new TypeError("The first argument must be an element node or window or document");
    }
    if (!eventName || typeof eventName != "string") {
      throw new TypeError("The second argument must be a string");
    }
    if (!fn || typeof fn != "function") {
      throw new TypeError("The third argument must be a function");
    }
    if (!common.isObject(options)) {
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
    if (!(el instanceof Document) && !element.isElement(el) && !element.isWindow(el)) {
      throw new TypeError("The first argument must be an element node or window or document");
    }
    let events = data.get(el, "dap-defined-events");
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
      data.remove(el, "dap-defined-events");
      data.remove(el, "dap-event-guid");
      return;
    }
    const result = parseEventName(eventName);
    result.forEach((res) => {
      unbindSingleListener(el, res.eventName, res.guid);
    });
  }
};
const date = {
  /**
   * 获取前N个月的日期，包含本月
   * @param {Object} date 指定日期，默认为今日
   * @param {Object} num 指定个数，默认为1
   */
  getPrevMonths(date2, num) {
    if (!date2 || !(date2 instanceof Date)) {
      date2 = /* @__PURE__ */ new Date();
    }
    if (!number.isNumber(num)) {
      num = 1;
    }
    let dateArray = [date2];
    for (let i = 0; i < num - 1; i++) {
      let y = date2.getFullYear();
      let m = date2.getMonth();
      if (m == 0) {
        m = 12;
        y--;
      }
      let d = /* @__PURE__ */ new Date();
      d.setMonth(m - 1);
      d.setFullYear(y);
      dateArray.push(d);
      date2 = d;
    }
    return dateArray;
  },
  /**
   * 获取后N个月的日期，包含本月
   * @param {Object} date 指定日期，默认为今日
   * @param {Object} num 指定个数，默认为1
   */
  getNextMonths(date2, num) {
    if (!date2 || !(date2 instanceof Date)) {
      date2 = /* @__PURE__ */ new Date();
    }
    if (!number.isNumber(num)) {
      num = 1;
    }
    let dateArray = [date2];
    for (let i = 0; i < num - 1; i++) {
      let y = date2.getFullYear();
      let m = date2.getMonth();
      if (m == 11) {
        m = -1;
        y++;
      }
      let d = /* @__PURE__ */ new Date();
      d.setMonth(m + 1);
      d.setFullYear(y);
      dateArray.push(d);
      date2 = d;
    }
    return dateArray;
  },
  /**
   * 获取指定天数后的日期
   * @param {Object} date 指定日期，默认为今日
   * @param {Object} num 指定天数，默认为1
   */
  getDateAfter(date2, num) {
    if (!date2 || !(date2 instanceof Date)) {
      date2 = /* @__PURE__ */ new Date();
    }
    if (!number.isNumber(num)) {
      num = 1;
    }
    return new Date(date2.getTime() + num * 24 * 60 * 60 * 1e3);
  },
  /**
   * 获取指定天数前的日期
   * @param {Object} date 指定日期，默认为今日
   * @param {Object} num 指定天数，默认为1
   */
  getDateBefore(date2, num) {
    if (!date2 || !(date2 instanceof Date)) {
      date2 = /* @__PURE__ */ new Date();
    }
    if (!number.isNumber(num)) {
      num = 1;
    }
    return new Date(date2.getTime() - num * 24 * 60 * 60 * 1e3);
  },
  /**
   * 获取某个月的天数
   * @param {Object} years
   * @param {Object} month
   */
  getDays(year, month) {
    if (!number.isNumber(year)) {
      throw new TypeError("The first parameter must be a number representing the year");
    }
    if (!number.isNumber(month)) {
      throw new TypeError("The second argument must be a number representing the month");
    }
    year = parseInt(year);
    month = parseInt(month);
    let d = new Date(year, month, 0);
    return d.getDate();
  }
};
const color = {
  /**
   * rgb转hsv值
   * @param {Object} rgb rgb值，数组
   */
  rgb2hsv(rgb) {
    if (!Array.isArray(rgb) || rgb.length != 3) {
      throw new TypeError("Invalid argument");
    }
    let h = 0;
    let s = 0;
    let v = 0;
    let r = rgb[0] >= 255 ? 255 : rgb[0];
    let g = rgb[1] >= 255 ? 255 : rgb[1];
    let b = rgb[2] >= 255 ? 255 : rgb[2];
    r = r <= 0 ? 0 : r;
    g = g <= 0 ? 0 : g;
    b = b <= 0 ? 0 : b;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    v = max / 255;
    if (max === 0) {
      s = 0;
    } else {
      s = 1 - min / max;
    }
    if (max === min) {
      h = 0;
    } else if (max === r && g >= b) {
      h = 60 * ((g - b) / (max - min)) + 0;
    } else if (max === r && g < b) {
      h = 60 * ((g - b) / (max - min)) + 360;
    } else if (max === g) {
      h = 60 * ((b - r) / (max - min)) + 120;
    } else if (max === b) {
      h = 60 * ((r - g) / (max - min)) + 240;
    }
    h = parseInt(h);
    s = parseInt(s * 100);
    v = parseInt(v * 100);
    return [h, s, v];
  },
  /**
   * hsv格式值转rgb值
   * @param {Object} hsv hsv值，数组
   */
  hsv2rgb(hsv) {
    if (!Array.isArray(hsv) || hsv.length != 3) {
      throw new TypeError("Invalid argument");
    }
    let h = hsv[0] >= 360 || hsv[0] <= 0 ? 0 : hsv[0];
    let s = hsv[1] >= 100 ? 100 : hsv[1];
    s = s <= 0 ? 0 : s;
    let v = hsv[2] >= 100 ? 100 : hsv[2];
    v = v <= 0 ? 0 : v;
    s = s / 100;
    v = v / 100;
    let r = 0;
    let g = 0;
    let b = 0;
    let i = parseInt(h / 60 % 6);
    let f = h / 60 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    switch (i) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }
    r = parseInt(r * 255);
    g = parseInt(g * 255);
    b = parseInt(b * 255);
    return [r, g, b];
  },
  /**
   * rgb值转十六进制
   * @param {Array} rgb rgb值，数组
   */
  rgb2hex(rgb) {
    if (!Array.isArray(rgb) || rgb.length != 3) {
      throw new TypeError("Invalid argument");
    }
    let r = rgb[0];
    let g = rgb[1];
    let b = rgb[2];
    let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
  },
  /**
   * 十六进制颜色转rgb
   * @param {String} hex 十六进制颜色值
   */
  hex2rgb(hex) {
    if (!hex || typeof hex != "string") {
      throw new TypeError("The argument must be a string");
    }
    let color2 = hex.toLowerCase();
    if (!common.matchingText(color2, "hex")) {
      throw new TypeError("The argument must be a hexadecimal color value");
    }
    if (color2.length === 4) {
      let colorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        colorNew += color2.slice(i, i + 1).concat(color2.slice(i, i + 1));
      }
      color2 = colorNew;
    }
    let colorChange = [];
    for (let i = 1; i < 7; i += 2) {
      colorChange.push(parseInt("0x" + color2.slice(i, i + 2)));
    }
    return colorChange;
  }
};
const file = {
  /**
   * 根据文件获取可预览的图片路径
   * @param {Object} file
   */
  getImageUrl(file2) {
    if (!file2 || !(file2 instanceof File)) {
      throw new TypeError("The argument must be a File object");
    }
    return window.URL.createObjectURL(file2);
  },
  /**
   * 将JS的file对象转为BASE64位字符串，通过then方法回调,参数为base64字符串
   * @param {Object} file
   */
  dataFileToBase64(file2) {
    return new Promise((resolve, reject) => {
      if (!file2 || !(file2 instanceof File)) {
        reject(new TypeError("The argument must be a File object"));
      }
      let reader = new FileReader();
      reader.readAsDataURL(file2);
      reader.onloadend = () => {
        let dataURL = reader.result;
        resolve(dataURL);
      };
    });
  },
  /**
   * 将base64位格式文件转换为file对象
   * @param {Object} base64String base64位格式字符串
   * @param {Object} fileName 转换后的文件名字，包含后缀
   */
  dataBase64toFile(base64String, fileName) {
    if (!base64String || typeof base64String != "string") {
      throw new TypeError("The first argument must be a string");
    }
    if (!fileName || typeof fileName != "string") {
      throw new TypeError("The second argument must be a string");
    }
    let arr = base64String.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, {
      type: mime
    });
  }
};
const platform = {
  //设备语言类型
  language() {
    return window.navigator.browserLanguage || window.navigator.language;
  },
  /**
   * 获取设备类型
   */
  device() {
    const userAgent = window.navigator.userAgent;
    return {
      PC: !userAgent.match(/AppleWebKit.*Mobile.*/),
      //是否移动终端
      Mobile: !!userAgent.match(/AppleWebKit.*Mobile.*/),
      //是否iPhone
      iPhone: userAgent.includes("iPhone"),
      //是否手机
      Phone: userAgent.includes("Android") && /(?:Mobile)/.test(userAgent) || userAgent.includes("iPhone") || /(?:Windows Phone)/.test(userAgent),
      //是否iPad
      iPad: userAgent.includes("iPad"),
      //是否平板电脑
      Tablet: userAgent.includes("iPad") || userAgent.includes("Android") && !/(?:Mobile)/.test(userAgent) || userAgent.includes("Firefox") && /(?:Tablet)/.test(userAgent),
      //windows手机
      WindowsPhone: /(?:Windows Phone)/.test(userAgent)
    };
  },
  /**
   * 获取浏览器类型
   */
  browser() {
    const userAgent = window.navigator.userAgent;
    return {
      //是否edge浏览器
      Edge: !!userAgent.match(/Edg\/([\d.]+)/),
      //是否微信内置浏览器
      weixin: userAgent.includes("MicroMessenger"),
      //是否QQ内置浏览器
      QQ: userAgent.includes("QQ"),
      //是否QQ浏览器
      QQBrowser: userAgent.includes("MQQBrowser"),
      //是否UC浏览器
      UC: userAgent.includes("UCBrowser"),
      //是否谷歌浏览器
      Chrome: userAgent.includes("Chrome"),
      //是否火狐浏览器
      Firefox: userAgent.includes("Firefox"),
      //是否搜狗浏览器
      sougou: userAgent.toLocaleLowerCase().includes("se 2.x") || userAgent.toLocaleLowerCase().includes("metasr") || userAgent.toLocaleLowerCase().includes("sogou"),
      //是否safari浏览器
      Safari: userAgent.includes("Safari") && !userAgent.includes("Chrome")
    };
  },
  /**
   * 获取浏览器内核
   */
  browserKernel() {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes("Presto")) {
      return "opera";
    } else if (userAgent.includes("AppleWebKit")) {
      return "webkit";
    } else if (userAgent.includes("Gecko") && !userAgent.includes("KHTML")) {
      return "gecko";
    }
    return "";
  },
  /**
   * 获取操作系统数据
   */
  os() {
    const userAgent = window.navigator.userAgent;
    return {
      //是否Windows系统
      Windows: userAgent.includes("Windows"),
      //x64/x32
      Windows_CPU: function() {
        if (userAgent.toLocaleLowerCase().includes("win64") || userAgent.toLocaleLowerCase().includes("wow64")) {
          return "x64";
        } else if (userAgent.toLocaleLowerCase().includes("win32") || userAgent.toLocaleLowerCase().includes("wow32")) {
          return "x32";
        }
        return "";
      }(),
      //Windows版本
      Windows_Version: function() {
        if (userAgent.includes("Windows NT 6.1") || userAgent.includes("Windows 7")) {
          return "Win7";
        } else if (userAgent.includes("Windows NT 6.3") || userAgent.includes("Windows NT 6.2") || userAgent.includes("Windows NT 8")) {
          return "Win8";
        } else if (userAgent.includes("Windows NT 10") || userAgent.includes("Windows NT 6.4")) {
          return "Win10";
        }
        return "";
      }(),
      //是否Mac
      Mac: userAgent.includes("Macintosh"),
      //Mac版本
      Mac_Version: function() {
        if (userAgent.includes("Macintosh")) {
          const matches = userAgent.match(/Mac OS X ([^\s]+)\)/);
          if (matches && matches[1]) {
            return matches[1].split(/_|\./).join(".");
          }
        }
        return "";
      }(),
      //是否ios系统
      ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      //ios系统版本
      ios_Version: function() {
        if (!!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
          const matches = userAgent.match(/CPU.+OS ([^\s]+) like Mac OS X/);
          if (matches && matches[1]) {
            return matches[1].split(/_|\./).join(".");
          }
        }
        return "";
      }(),
      //是否Android系统
      Android: userAgent.includes("Android"),
      //Android系统版本
      Android_Version: function() {
        const matches = userAgent.match(/Android ([^\s]+);/);
        if (matches && matches[1]) {
          return matches[1].split(/_|\./).join(".");
        }
        return "";
      }(),
      //是否Linux系统
      Linux: userAgent.includes("Linux"),
      //是否鸿蒙系统
      HarmonyOS: userAgent.includes("HarmonyOS"),
      //是否Ubuntu系统
      Ubuntu: userAgent.includes("Ubuntu")
    };
  }
};
const speech = {
  /**
   * 将文字加入语音播报队列
   * @param {Object} text
   */
  start(text, params) {
    if (!window.SpeechSynthesisUtterance || !window.speechSynthesis) {
      throw new Error("The current browser does not support this syntax");
    }
    let defaultParams = {
      //话语的音调(0-2，值越大越尖锐,越低越低沉)
      pitch: 0.8,
      //说话的速度(0-10，值越大语速越快,越小语速越慢)
      rate: 1,
      //说话的音量：0-1
      volume: 1,
      //播放开始事件
      start: function() {
      },
      //播放结束事件
      end: function() {
      },
      //播放暂停事件
      pause: function() {
      },
      //播放恢复事件
      resume: function() {
      },
      //播放出错事件
      error: function() {
      }
    };
    if (!common.isObject(params)) {
      params = {};
    }
    if (number.isNumber(params.pitch)) {
      defaultParams.pitch = params.pitch;
    }
    if (number.isNumber(params.rate)) {
      defaultParams.rate = params.rate;
    }
    if (number.isNumber(params.volume)) {
      defaultParams.volume = params.volume;
    }
    if (typeof params.start == "function") {
      defaultParams.start = params.start;
    }
    if (typeof params.end == "function") {
      defaultParams.end = params.end;
    }
    if (typeof params.pause == "function") {
      defaultParams.pause = params.pause;
    }
    if (typeof params.resume == "function") {
      defaultParams.resume = params.resume;
    }
    if (typeof params.error == "function") {
      defaultParams.error = params.error;
    }
    const speech2 = new SpeechSynthesisUtterance();
    speech2.text = text;
    speech2.pitch = defaultParams.pitch;
    speech2.rate = defaultParams.rate;
    speech2.volume = defaultParams.volume;
    speech2.lang = "zh-CN";
    speech2.onstart = (event2) => {
      defaultParams.start.apply(speech2, [
        event2,
        {
          text,
          pitch: defaultParams.pitch,
          rate: defaultParams.rate,
          volume: defaultParams.volume
        }
      ]);
    };
    speech2.onend = (event2) => {
      defaultParams.end.apply(speech2, [
        event2,
        {
          text,
          pitch: defaultParams.pitch,
          rate: defaultParams.rate,
          volume: defaultParams.volume
        }
      ]);
    };
    speech2.onpause = (event2) => {
      defaultParams.pause.apply(speech2, [
        event2,
        {
          text,
          pitch: defaultParams.pitch,
          rate: defaultParams.rate,
          volume: defaultParams.volume
        }
      ]);
    };
    speech2.onresume = (event2) => {
      defaultParams.resume.apply(speech2, [
        event2,
        {
          text,
          pitch: defaultParams.pitch,
          rate: defaultParams.rate,
          volume: defaultParams.volume
        }
      ]);
    };
    speech2.onerror = (event2) => {
      defaultParams.error.apply(speech2, [
        event2,
        {
          text,
          pitch: defaultParams.pitch,
          rate: defaultParams.rate,
          volume: defaultParams.volume
        }
      ]);
    };
    window.speechSynthesis.speak(speech2);
  },
  /**
   * 停止播报，停止所有播报队列里面的语音
   */
  stop() {
    if (!window.SpeechSynthesisUtterance || !window.speechSynthesis) {
      throw new Error("The current browser does not support this syntax");
    }
    window.speechSynthesis.cancel();
  },
  /**
   * 暂停播报
   */
  pause() {
    if (!window.SpeechSynthesisUtterance || !window.speechSynthesis) {
      throw new Error("The current browser does not support this syntax");
    }
    window.speechSynthesis.pause();
  },
  /**
   * 恢复暂停的播报
   */
  resume() {
    if (!window.SpeechSynthesisUtterance || !window.speechSynthesis) {
      throw new Error("The current browser does not support this syntax");
    }
    window.speechSynthesis.resume();
  }
};
const obj = { number, data, element, event, common, date, color, file, string, platform, speech };
const Util = {
  //获取属性集合
  getAttributes(el) {
    let o = {};
    for (let attribute of el.attributes) {
      if (!/(^on)|(^style$)/g.test(attribute.nodeName)) {
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
  //生成唯一key
  getUniqueKey() {
    let key = obj.data.get(window, "data-alex-editor-key") || 0;
    key++;
    obj.data.set(window, "data-alex-editor-key", key);
    return key;
  },
  //是否零宽度无断空白字符
  isSpaceText(val) {
    return /^[\uFEFF]+$/g.test(val);
  },
  //深拷贝
  clone(data2) {
    if (obj.common.isObject(data2) || Array.isArray(data2)) {
      return JSON.parse(JSON.stringify(data2));
    }
    return data2;
  }
};
const _AlexElement = class {
  constructor(type, parsedom, marks, styles, textContent) {
    this.key = Util.getUniqueKey();
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
  //是否空元素
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
  //是否零宽度无断空白元素
  isSpaceText() {
    return this.isText() && !this.isEmpty() && Util.isSpaceText(this.textContent);
  }
  //是否根元素
  isRoot() {
    return !this.parent;
  }
  //判断两个Element是否相等
  isEqual(element2) {
    if (!_AlexElement.isElement(element2)) {
      return false;
    }
    return this.key == element2.key;
  }
  //是否包含指定节点
  isContains(element2) {
    if (this.isEqual(element2)) {
      return true;
    }
    if (element2.isRoot()) {
      return false;
    }
    return this.isContains(element2.parent);
  }
  //判断是否只包含换行符
  isOnlyHasBreak() {
    if (this.hasChildren()) {
      return this.children.every((item) => {
        return item.isBreak() || item.isEmpty();
      });
    }
    return false;
  }
  //是否代码块样式
  isPreStyle() {
    if (!this.isBlock()) {
      return false;
    }
    if (this.parsedom == "pre") {
      return true;
    }
    return this.hasStyles() && (this.styles["white-space"] == "pre" || this.styles["white-space"] == "pre-wrap");
  }
  //判断两个元素是否有包含关系
  hasContains(element2) {
    if (!_AlexElement.isElement(element2)) {
      return false;
    }
    return this.isContains(element2) || element2.isContains(this);
  }
  //是否含有标记
  hasMarks() {
    if (!this.marks) {
      return false;
    }
    if (obj.common.isObject) {
      return !obj.common.isEmptyObject(this.marks);
    }
    return false;
  }
  //是否含有样式
  hasStyles() {
    if (!this.styles) {
      return false;
    }
    if (obj.common.isObject(this.styles)) {
      return !obj.common.isEmptyObject(this.styles);
    }
    return false;
  }
  //是否有子元素
  hasChildren() {
    if (this.isClosed() || this.isText()) {
      return false;
    }
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
    let el = new _AlexElement(this.type, this.parsedom, Util.clone(this.marks), Util.clone(this.styles), this.textContent);
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
    let element2 = this.clone();
    this.type = "block";
    this.parsedom = _AlexElement.PARAGRAPH_NODE;
    this.marks = null;
    this.styles = null;
    this.textContent = null;
    this.children = [element2];
    element2.parent = this;
  }
  //设置为空元素
  toEmpty() {
    if (this.isEmpty()) {
      return;
    }
    if (this.isText()) {
      this.textContent = null;
    } else if (this.isClosed()) {
      this.type = "inline";
      this.parsedom = "span";
      this.children = null;
    } else if (this.isBlock() || this.isInline()) {
      this.children = null;
    }
  }
  //获取所在块元素
  getBlock() {
    if (this.isBlock()) {
      return this;
    }
    return this.parent.getBlock();
  }
  //获取所在行内元素
  getInline() {
    if (this.isInline()) {
      return this;
    }
    if (this.isRoot()) {
      return null;
    }
    return this.parent.getInline();
  }
  //比较两个元素样式是否一致
  isEqualStyles(element2) {
    if (!this.hasStyles() && !element2.hasStyles()) {
      return true;
    }
    if (this.hasStyles() && element2.hasStyles() && obj.common.equal(this.styles, element2.styles)) {
      return true;
    }
    return false;
  }
  //比较两个元素属性是否一致
  isEqualMarks(element2) {
    if (!this.hasMarks() && !element2.hasMarks()) {
      return true;
    }
    if (this.hasMarks() && element2.hasMarks() && obj.common.equal(this.marks, element2.marks)) {
      return true;
    }
    return false;
  }
  //渲染成真实dom
  _renderElement() {
    let el = null;
    if (this.isText()) {
      el = document.createElement(_AlexElement.TEXT_NODE);
      el.innerHTML = this.textContent;
    } else {
      el = document.createElement(this.parsedom);
      if (this.hasChildren()) {
        for (let child of this.children) {
          child._renderElement();
          el.appendChild(child._elm);
        }
      }
    }
    if (this.hasMarks()) {
      for (let key in this.marks) {
        el.setAttribute(key, this.marks[key]);
      }
    }
    if (this.hasStyles()) {
      for (let key in this.styles) {
        el.style.setProperty(key, this.styles[key]);
      }
    }
    obj.data.set(el, "data-alex-editor-key", this.key);
    this._elm = el;
  }
  //判断是否该类型数据
  static isElement(val) {
    return val instanceof _AlexElement;
  }
  //扁平化处理元素数组
  static flatElements(elements) {
    const flat = (arr) => {
      let result = [];
      arr.forEach((element2) => {
        if (_AlexElement.isElement(element2)) {
          result.push(element2);
          if (element2.hasChildren()) {
            let arr2 = flat(element2.children);
            result = [...result, ...arr2];
          }
        }
      });
      return result;
    };
    return flat(elements);
  }
  //获取一个空白字符元素，用来占位防止行内元素没有内容被删除
  static getSpaceElement() {
    return new _AlexElement("text", null, null, null, "\uFEFF");
  }
};
let AlexElement = _AlexElement;
//定义段落标签
__publicField(AlexElement, "PARAGRAPH_NODE", "p");
//定义文本标签
__publicField(AlexElement, "TEXT_NODE", "span");
class AlexPoint {
  constructor(element2, offset) {
    this.element = element2;
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
  moveToEnd(element2) {
    if (!AlexElement.isElement(element2)) {
      throw new Error("The argument must be an AlexElement instance");
    }
    if (element2.isEmpty()) {
      throw new Error("The argument cannot be an empty element");
    }
    if (element2.isText()) {
      this.element = element2;
      this.offset = element2.textContent.length;
    } else if (element2.isClosed()) {
      this.element = element2;
      this.offset = 1;
    } else if (element2.hasChildren()) {
      const flatElements = AlexElement.flatElements(element2.children).filter((el) => {
        return !el.isEmpty();
      });
      const length = flatElements.length;
      this.moveToEnd(flatElements[length - 1]);
    }
  }
  //移动到指定元素最前
  moveToStart(element2) {
    if (!AlexElement.isElement(element2)) {
      throw new Error("The argument must be an AlexElement instance");
    }
    if (element2.isEmpty()) {
      throw new Error("The argument cannot be an empty element");
    }
    if (element2.isText()) {
      this.element = element2;
      this.offset = 0;
    } else if (element2.isClosed()) {
      this.element = element2;
      this.offset = 0;
    } else if (element2.hasChildren()) {
      const flatElements = AlexElement.flatElements(element2.children).filter((el) => {
        return !el.isEmpty();
      });
      this.moveToStart(flatElements[0]);
    }
  }
}
class AlexRange {
  constructor(anchor, focus) {
    this.anchor = anchor;
    this.focus = focus;
  }
}
class AlexHistory {
  constructor() {
    this.records = [];
    this.current = -1;
  }
  //入栈
  push(stack, range) {
    if (this.current < this.records.length - 1) {
      this.records.length = this.current + 1;
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
    this.records.push({
      stack: newStack,
      range: newRange
    });
    this.current += 1;
  }
  //撤销
  get(type) {
    if (type == -1) {
      if (this.current <= 0) {
        return null;
      }
      this.current -= 1;
    } else if (type == 1) {
      if (this.current >= this.records.length - 1) {
        return null;
      }
      this.current += 1;
    }
    const { stack, range } = this.records[this.current];
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
  _cloneElement(element2) {
    const el = new AlexElement(element2.type, element2.parsedom, Util.clone(element2.marks), Util.clone(element2.styles), element2.textContent);
    el.key = element2.key;
    if (element2.hasChildren()) {
      element2.children.forEach((child) => {
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
const { Mac } = obj.platform.os();
const Keyboard = {
  //撤销
  Undo(e) {
    if (Mac) {
      return e.keyCode == 90 && e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
    }
    return e.keyCode == 90 && e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey;
  },
  //重做
  Redo(e) {
    if (Mac) {
      return e.keyCode == 90 && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey;
    }
    return e.keyCode == 89 && e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey;
  }
};
const ElementToStyle = {
  b: {
    "font-weight": "bold"
  },
  strong: {
    "font-weight": "bold"
  },
  sup: {
    "vertical-align": "super"
  },
  sub: {
    "vertical-align": "sub"
  },
  i: {
    "font-style": "italic"
  },
  u: {
    "text-decoration-line": "underline"
  },
  del: {
    "text-decoration-line": "line-through"
  }
};
class AlexEditor {
  constructor(el, options) {
    //格式化函数数组
    __publicField(this, "__formatUnchangeableRules", [
      //元素自身规范
      (element2) => {
        if (element2.parsedom) {
          if (["br", "img", "video"].includes(element2.parsedom)) {
            element2.type = "closed";
            element2.children = null;
          } else if (["span", "a", "label", "code"].includes(element2.parsedom)) {
            element2.type = "inline";
          } else if (["input", "textarea", "select", "script", "style", "html", "body", "meta", "link", "head", "title"].includes(element2.parsedom)) {
            element2.toEmpty();
          } else if (ElementToStyle[element2.parsedom]) {
            const styles = ElementToStyle[element2.parsedom];
            element2.type = "inline";
            element2.parsedom = "span";
            if (element2.hasStyles()) {
              Object.assign(element2.styles, Util.clone(styles));
            } else {
              element2.styles = Util.clone(styles);
            }
          }
        }
      },
      //其他类型元素与block元素在同一父元素下不能共存
      (element2) => {
        if (element2.hasChildren()) {
          let hasBlock = element2.children.some((el) => {
            return !el.isEmpty() && el.isBlock();
          });
          if (hasBlock) {
            element2.children.forEach((el) => {
              if (!el.isEmpty() && !el.isBlock()) {
                el.convertToBlock();
              }
            });
          }
        }
      },
      //换行符清除规则
      (element2) => {
        if (element2.hasChildren()) {
          if (element2.isBlock()) {
            const children = element2.children.filter((el) => {
              return !el.isEmpty();
            });
            let hasBreak = children.some((el) => {
              return el.isBreak();
            });
            let hasOther = children.some((el) => {
              return !el.isBreak();
            });
            if (hasBreak && hasOther) {
              element2.children = element2.children.map((el) => {
                if (el.isBreak()) {
                  el.toEmpty();
                }
                return el;
              });
            } else if (hasBreak && children.length > 1) {
              element2.children = element2.children.map((el, index) => {
                if (el.isBreak() && index > 0) {
                  el.toEmpty();
                }
                return el;
              });
            }
          } else if (element2.isInline()) {
            element2.children.map((el) => {
              if (el.isBreak()) {
                el.toEmpty();
              }
            });
          }
        }
      },
      //兄弟元素合并策略（如果光标在子元素中可能会重新设置）
      (element2) => {
        const mergeElement = (ele) => {
          const canMerge = (pel, nel) => {
            if (pel.isEmpty() || nel.isEmpty()) {
              return true;
            }
            if (pel.isText() && nel.isText()) {
              return pel.isEqualStyles(nel) && pel.isEqualMarks(nel);
            }
            if (pel.isInline() && nel.isInline()) {
              return pel.parsedom == nel.parsedom && pel.isEqualMarks(nel) && pel.isEqualStyles(nel);
            }
            return false;
          };
          const merge = (pel, nel) => {
            if (pel.isEmpty() || nel.isEmpty()) {
              if (nel.isEmpty()) {
                if (this.range && nel.hasContains(this.range.anchor.element)) {
                  this.range.anchor.moveToEnd(pel);
                }
                if (this.range && nel.hasContains(this.range.focus.element)) {
                  this.range.focus.moveToEnd(pel);
                }
                const index = nel.parent.children.findIndex((item) => {
                  return nel.isEqual(item);
                });
                nel.parent.children.splice(index, 1);
              } else if (pel.isEmpty()) {
                if (this.range && this.range.anchor.element.isEqual(pel)) {
                  this.range.anchor.moveToStart(nel);
                }
                if (this.range && this.range.focus.element.isEqual(pel)) {
                  this.range.focus.moveToStart(nel);
                }
                const index = pel.parent.children.findIndex((item) => {
                  return pel.isEqual(item);
                });
                pel.parent.children.splice(index, 1);
              }
            } else if (pel.isText()) {
              if (this.range && this.range.anchor.element.isEqual(nel)) {
                this.range.anchor.element = pel;
                this.range.anchor.offset = pel.textContent.length + this.range.anchor.offset;
              }
              if (this.range && this.range.focus.element.isEqual(nel)) {
                this.range.focus.element = pel;
                this.range.focus.offset = pel.textContent.length + this.range.focus.offset;
              }
              if (!pel.textContent) {
                pel.textContent = "";
              }
              if (!nel.textContent) {
                nel.textContent = "";
              }
              pel.textContent += nel.textContent;
              const index = nel.parent.children.findIndex((item) => {
                return nel.isEqual(item);
              });
              nel.parent.children.splice(index, 1);
            } else if (pel.isInline()) {
              if (!pel.hasChildren()) {
                pel.children = [];
              }
              if (!nel.hasChildren()) {
                nel.children = [];
              }
              pel.children.push(...nel.children);
              pel.children.forEach((item) => {
                item.parent = pel;
              });
              mergeElement(pel);
              const index = nel.parent.children.findIndex((item) => {
                return nel.isEqual(item);
              });
              nel.parent.children.splice(index, 1);
            }
          };
          if (ele.hasChildren() && ele.children.length > 1) {
            let index = 0;
            while (index <= ele.children.length - 2) {
              if (canMerge(ele.children[index], ele.children[index + 1])) {
                merge(ele.children[index], ele.children[index + 1]);
              } else {
                index++;
              }
            }
          }
        };
        mergeElement(element2);
      },
      //子元素和父元素合并策略
      (element2) => {
        const canMerge = (parent, child) => {
          if (child.isText() && parent.isInline()) {
            return parent.parsedom == AlexElement.TEXT_NODE;
          }
          if (parent.isInline() && child.isInline() || parent.isBlock() && child.isBlock()) {
            return parent.parsedom == child.parsedom;
          }
          return false;
        };
        const merge = (parent, child) => {
          if (child.isText()) {
            parent.type = "text";
            parent.parsedom = null;
            if (child.hasMarks()) {
              if (parent.hasMarks()) {
                Object.assign(parent.marks, Util.clone(child.marks));
              } else {
                parent.marks = Util.clone(child.marks);
              }
            }
            if (child.hasStyles()) {
              if (parent.hasStyles()) {
                Object.assign(parent.styles, Util.clone(child.styles));
              } else {
                parent.styles = Util.clone(child.styles);
              }
            }
            parent.textContent = child.textContent;
            parent.children = null;
          } else {
            if (child.hasMarks()) {
              if (parent.hasMarks()) {
                Object.assign(parent.marks, Util.clone(child.marks));
              } else {
                parent.marks = Util.clone(child.marks);
              }
            }
            if (child.hasStyles()) {
              if (parent.hasStyles()) {
                Object.assign(parent.styles, Util.clone(child.styles));
              } else {
                parent.styles = Util.clone(child.styles);
              }
            }
            parent.children = [...child.children];
            parent.children.forEach((item) => {
              item.parent = parent;
            });
          }
        };
        if (element2.hasChildren() && element2.children.length == 1 && canMerge(element2, element2.children[0])) {
          merge(element2, element2.children[0]);
        }
      },
      //自定义元素格式化规则
      (element2) => {
        if (typeof this.renderRules == "function") {
          this.renderRules.apply(this, [element2]);
        }
      },
      //光标所在元素为空元素的情况下重新设置光标
      (element2) => {
        if (element2.isEmpty()) {
          if (this.range && this.range.anchor.element.isEqual(element2)) {
            this.__setRecentlyPoint(this.range.anchor);
          }
          if (this.range && this.range.focus.element.isEqual(element2)) {
            this.__setRecentlyPoint(this.range.focus);
          }
        }
      }
    ]);
    if (typeof el == "string" && el) {
      el = document.body.querySelector(el);
    }
    if (!obj.element.isElement(el)) {
      throw new Error("You must specify a dom container to initialize the editor");
    }
    if (obj.data.get(el, "data-alex-editor-init")) {
      throw new Error("The element node has been initialized to the editor");
    }
    obj.data.set(el, "data-alex-editor-init", true);
    options = this.__formatOptions(options);
    this.$el = el;
    this.disabled = options.disabled;
    this.value = options.value;
    this.renderRules = options.renderRules;
    this.htmlPaste = options.htmlPaste;
    this.range = null;
    this.history = new AlexHistory();
    this._events = {};
    this._oldValue = options.value;
    this._isInputChinese = false;
    this.stack = this.parseHtml(this.value);
    this.formatElementStack();
    this.stack.length == 0 ? this.__initStack() : null;
    this.__initRange();
    this.domRender();
    this.disabled ? this.setDisabled() : this.setEnabled();
    obj.event.on(document, "selectionchange.alex_editor", this.__handleSelectionChange.bind(this));
    obj.event.on(this.$el, "beforeinput.alex_editor", this.__handleBeforeInput.bind(this));
    obj.event.on(this.$el, "compositionstart.alex_editor compositionupdate.alex_editor compositionend.alex_editor", this.__handleChineseInput.bind(this));
    obj.event.on(this.$el, "keydown.alex_editor", this.__handleKeydown.bind(this));
    obj.event.on(this.$el, "cut.alex_editor", this.__handleCut.bind(this));
    obj.event.on(this.$el, "paste.alex_editor", this.__handlePaste.bind(this));
    obj.event.on(this.$el, "drop.alex_editor", this.__handleNodesChange.bind(this));
    obj.event.on(this.$el, "focus.alex_editor", () => {
      this.emit("focus", this.value);
    });
    obj.event.on(this.$el, "blur.alex_editor", () => {
      this.emit("blur", this.value);
    });
  }
  //格式化options参数
  __formatOptions(options) {
    let opts = {
      disabled: false,
      renderRules: null,
      htmlPaste: false,
      value: "<p><br></p>"
    };
    if (obj.common.isObject(options)) {
      if (typeof options.disabled == "boolean") {
        opts.disabled = options.disabled;
      }
      if (typeof options.renderRules == "function") {
        opts.renderRules = options.renderRules;
      }
      if (typeof options.value == "string" && options.value) {
        opts.value = options.value;
      }
      if (typeof options.htmlPaste == "boolean") {
        opts.htmlPaste = options.htmlPaste;
      }
    }
    return opts;
  }
  //初始化stack
  __initStack() {
    const ele = new AlexElement("block", AlexElement.PARAGRAPH_NODE, null, null, null);
    const breakEle = new AlexElement("closed", "br", null, null, null);
    this.addElementTo(breakEle, ele);
    this.stack = [ele];
  }
  //初始设置range
  __initRange() {
    const lastElement = this.stack[this.stack.length - 1];
    const anchor = new AlexPoint(lastElement, 0);
    const focus = new AlexPoint(lastElement, 0);
    this.range = new AlexRange(anchor, focus);
    this.range.anchor.moveToEnd(lastElement);
    this.range.focus.moveToEnd(lastElement);
  }
  //起始和结束点都在一个元素内的删除方法
  __deleteInSameElement() {
    if (!this.range.anchor.element.isEqual(this.range.focus.element)) {
      return;
    }
    if (this.range.anchor.offset == 0 && this.range.focus.offset == 0) {
      return;
    }
    const previousElement = this.getPreviousElementOfPoint(this.range.anchor);
    const nextElement = this.getNextElementOfPoint(this.range.anchor);
    const anchorBlock = this.range.anchor.element.getBlock();
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
          this.addElementTo(breakEl, anchorBlock);
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
      } else if (this.range.anchor.element.isSpaceText()) {
        this.range.anchor.offset = 0;
        this.range.focus.offset = this.range.anchor.element.textContent.length;
        this.delete();
      } else if (this.range.anchor.offset > 0 && Util.isSpaceText(this.range.anchor.element.textContent[this.range.anchor.offset - 1])) {
        this.delete();
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
          this.addElementTo(breakEl, anchorBlock);
          this.range.anchor.moveToEnd(breakEl);
          this.range.focus.moveToEnd(breakEl);
        }
      } else {
        if (previousElement && anchorBlock.isContains(previousElement)) {
          this.range.anchor.moveToEnd(previousElement);
          this.range.focus.moveToEnd(previousElement);
        } else if (nextElement && anchorBlock.isContains(nextElement)) {
          this.range.anchor.moveToStart(nextElement);
          this.range.focus.moveToStart(nextElement);
        }
        if (this.range.anchor.element.isText()) {
          if (this.range.anchor.element.isSpaceText()) {
            this.range.anchor.offset = 0;
            this.range.focus.offset = this.range.anchor.element.textContent.length;
            this.delete();
          } else if (this.range.anchor.offset > 0 && Util.isSpaceText(this.range.anchor.element.textContent[this.range.anchor.offset - 1])) {
            this.delete();
          }
        }
      }
    }
  }
  //监听selection改变
  __handleSelectionChange() {
    if (this.disabled) {
      return;
    }
    if (this._isInputChinese) {
      return;
    }
    const selection = window.getSelection();
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      let anchorNode = range.startContainer;
      let focusNode = range.endContainer;
      if (range.startContainer.nodeType == 3) {
        anchorNode = range.startContainer.parentNode;
      }
      if (range.endContainer.nodeType == 3) {
        focusNode = range.endContainer.parentNode;
      }
      if (anchorNode.isEqualNode(this.$el) || focusNode.isEqualNode(this.$el)) {
        return;
      }
      if (obj.element.isContains(this.$el, anchorNode) && obj.element.isContains(this.$el, focusNode)) {
        const anchorKey = obj.data.get(anchorNode, "data-alex-editor-key");
        const focusKey = obj.data.get(focusNode, "data-alex-editor-key");
        const anchorEle = this.getElementByKey(anchorKey);
        const focusEle = this.getElementByKey(focusKey);
        const anchor = new AlexPoint(anchorEle, range.startOffset);
        const focus = new AlexPoint(focusEle, range.endOffset);
        this.range = new AlexRange(anchor, focus);
        this.emit("rangeUpdate", this.range);
      }
    }
  }
  //监听beforeinput
  __handleBeforeInput(e) {
    if (this.disabled) {
      return;
    }
    if (e.inputType == "insertFromPaste" || e.inputType == "deleteByCut" || e.inputType == "deleteByDrag" || e.inputType == "insertFromDrop" || e.inputType == "insertCompositionText") {
      return;
    }
    e.preventDefault();
    if (e.inputType == "insertText") {
      if (e.data) {
        this.insertText(e.data);
        this.formatElementStack();
        this.domRender();
        this.rangeRender();
      }
      return;
    }
    if (e.inputType == "insertParagraph" || e.inputType == "insertLineBreak") {
      this.insertParagraph();
      this.formatElementStack();
      this.domRender();
      this.rangeRender();
      return;
    }
    if (e.inputType == "deleteContentBackward") {
      this.delete();
      this.formatElementStack();
      this.domRender();
      this.rangeRender();
      return;
    }
  }
  //监听中文输入
  __handleChineseInput(e) {
    if (this.disabled) {
      return;
    }
    e.preventDefault();
    if (e.type == "compositionstart") {
      this._isInputChinese = true;
    }
    if (e.type == "compositionend") {
      this._isInputChinese = false;
      if (e.data) {
        this.insertText(e.data);
        this.formatElementStack();
        this.domRender();
        this.rangeRender();
      }
    }
  }
  //监听键盘按下
  __handleKeydown(e) {
    if (this.disabled) {
      return;
    }
    if (Keyboard.Undo(e)) {
      e.preventDefault();
      const historyRecord = this.history.get(-1);
      if (historyRecord) {
        this.stack = historyRecord.stack;
        this.range = historyRecord.range;
        this.formatElementStack();
        this.domRender(true);
        this.rangeRender();
      }
    } else if (Keyboard.Redo(e)) {
      e.preventDefault();
      const historyRecord = this.history.get(1);
      if (historyRecord) {
        this.stack = historyRecord.stack;
        this.range = historyRecord.range;
        this.formatElementStack();
        this.domRender(true);
        this.rangeRender();
      }
    }
  }
  //监听粘贴事件
  __handlePaste(e) {
    if (this.disabled) {
      return;
    }
    const files = e.clipboardData.files;
    if (files.length) {
      e.preventDefault();
      if (!this.emit("pasteFile", files)) {
        let parseImageFn = [];
        Array.from(files).forEach((file2) => {
          if (file2.type && /^((image\/)|(video\/))/g.test(file2.type)) {
            parseImageFn.push(obj.file.dataFileToBase64(file2));
          }
        });
        Promise.all(parseImageFn).then((urls) => {
          urls.forEach((url, index) => {
            let el = null;
            if (/^(data:video\/)/g.test(url)) {
              const marks = {
                src: url,
                autoplay: true,
                muted: true,
                controls: true
              };
              const styles = {
                width: "auto",
                "max-width": "100%"
              };
              el = new AlexElement("closed", "video", marks, styles, null);
            } else {
              const marks = {
                src: url
              };
              const styles = {
                width: "auto",
                "max-width": "100%"
              };
              el = new AlexElement("closed", "img", marks, styles, null);
            }
            this.insertElement(el);
            this.formatElementStack();
            this.domRender(index < urls.length - 1);
            this.rangeRender();
          });
        });
      }
    } else if (!this.htmlPaste) {
      e.preventDefault();
      const data2 = e.clipboardData.getData("text/plain");
      if (data2) {
        this.insertText(data2);
        this.formatElementStack();
        this.domRender();
        this.rangeRender();
      }
    } else {
      let element2 = null;
      const end = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1;
      if (this.range.focus.offset == end) {
        const nextElement = this.getNextElementOfPoint(this.range.focus);
        if (nextElement) {
          element2 = nextElement;
        }
      } else {
        element2 = this.range.focus.element;
      }
      const elements = AlexElement.flatElements(this.stack);
      const index = elements.findIndex((item) => {
        return element2 && item.isEqual(element2);
      });
      const lastLength = elements.length - 1 - index;
      setTimeout(() => {
        this.stack = this.parseHtml(this.$el.innerHTML);
        this.formatElementStack();
        const flatElements = AlexElement.flatElements(this.stack);
        if (index > -1) {
          const newIndex = flatElements.length - 1 - lastLength;
          this.range.anchor.moveToStart(flatElements[newIndex]);
          this.range.focus.moveToStart(flatElements[newIndex]);
          const previousElement = this.getPreviousElementOfPoint(this.range.anchor);
          if (previousElement) {
            this.range.anchor.moveToEnd(previousElement);
            this.range.focus.moveToEnd(previousElement);
          }
        } else {
          this.range.anchor.moveToEnd(flatElements[flatElements.length - 1]);
          this.range.focus.moveToEnd(flatElements[flatElements.length - 1]);
        }
        this.domRender();
        this.rangeRender();
      }, 0);
    }
  }
  //监听剪切事件
  __handleCut(e) {
    if (this.disabled) {
      return;
    }
    setTimeout(() => {
      this.delete();
      this.formatElementStack();
      this.domRender();
      this.rangeRender();
    }, 0);
  }
  //解决编辑器内元素节点与stack数据不符的情况，进行数据纠正
  __handleNodesChange() {
    setTimeout(() => {
      this.stack = this.parseHtml(this.$el.innerHTML);
      this.formatElementStack();
      const flatElements = AlexElement.flatElements(this.stack);
      this.range.anchor.moveToEnd(flatElements[flatElements.length - 1]);
      this.range.focus.moveToEnd(flatElements[flatElements.length - 1]);
      this.domRender();
      this.rangeRender();
    }, 0);
  }
  //更新焦点的元素为最近的可设置光标的元素
  __setRecentlyPoint(point) {
    const previousElement = this.getPreviousElementOfPoint(point);
    const nextElement = this.getNextElementOfPoint(point);
    const block = point.element.getBlock();
    if (previousElement && block.isContains(previousElement)) {
      point.moveToEnd(previousElement);
    } else if (nextElement && block.isContains(nextElement)) {
      point.moveToStart(nextElement);
    } else if (previousElement) {
      point.moveToEnd(previousElement);
    } else {
      point.moveToStart(nextElement);
    }
  }
  //格式化单个元素
  formatElement(ele) {
    if (!AlexElement.isElement(ele)) {
      throw new Error("The argument must be an AlexElement instance");
    }
    const format = (element2, fn) => {
      if (element2.hasChildren()) {
        let index = 0;
        while (index < element2.children.length) {
          let el = element2.children[index];
          format(el, fn);
          const newIndex = element2.children.findIndex((item) => {
            return el.isEqual(item);
          });
          index = newIndex + 1;
        }
      }
      fn(element2);
    };
    const removeEmptyElement = (element2) => {
      if (element2.hasChildren()) {
        element2.children.forEach((item) => {
          if (!item.isEmpty()) {
            removeEmptyElement(item);
          }
        });
        element2.children = element2.children.filter((item) => {
          return !item.isEmpty();
        });
      }
    };
    this.__formatUnchangeableRules.forEach((fn) => {
      format(ele, fn);
    });
    removeEmptyElement(ele);
  }
  //格式化stack
  formatElementStack() {
    let index = 0;
    while (index < this.stack.length) {
      const el = this.stack[index];
      if (!el.isBlock()) {
        el.convertToBlock();
      }
      this.formatElement(el);
      const newIndex = this.stack.findIndex((item) => {
        return el.isEqual(item);
      });
      index = newIndex + 1;
    }
    this.stack = this.stack.filter((ele) => {
      return !ele.isEmpty();
    });
  }
  //根据光标位置删除编辑器内容
  delete() {
    if (this.range.anchor.isEqual(this.range.focus)) {
      const previousElement = this.getPreviousElementOfPoint(this.range.anchor);
      const anchorBlock = this.range.anchor.element.getBlock();
      if (this.range.anchor.offset == 0) {
        if (previousElement) {
          if (anchorBlock.isContains(previousElement)) {
            this.range.anchor.moveToEnd(previousElement);
            this.range.focus.moveToEnd(previousElement);
            this.__deleteInSameElement();
          } else {
            this.mergeBlockElement(anchorBlock);
            this.range.anchor.moveToEnd(previousElement);
            this.range.focus.moveToEnd(previousElement);
          }
        }
      } else {
        this.__deleteInSameElement();
      }
    } else {
      if (this.range.anchor.element.isEqual(this.range.focus.element)) {
        this.__deleteInSameElement();
      } else {
        const rangeElements = this.getElementsByRange(false, false);
        rangeElements.forEach((el) => {
          el.toEmpty();
        });
        const focusBlock = this.range.focus.element.getBlock();
        let hasMerge = !focusBlock.hasContains(this.range.anchor.element);
        if (this.range.focus.offset > 0) {
          let anchorElement = this.range.anchor.element;
          let anchorOffset = this.range.anchor.offset;
          this.range.anchor.element = this.range.focus.element;
          this.range.anchor.offset = 0;
          this.__deleteInSameElement();
          this.range.anchor.element = anchorElement;
          this.range.anchor.offset = anchorOffset;
        }
        const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1;
        if (this.range.anchor.offset < endOffset) {
          this.range.focus.element = this.range.anchor.element;
          this.range.focus.offset = endOffset;
          this.__deleteInSameElement();
        }
        if (hasMerge) {
          this.mergeBlockElement(focusBlock);
        }
      }
    }
  }
  //在光标处换行
  insertParagraph() {
    if (this.range.anchor.isEqual(this.range.focus)) {
      const previousElement = this.getPreviousElementOfPoint(this.range.anchor);
      const nextElement = this.getNextElementOfPoint(this.range.anchor);
      const anchorBlock = this.range.anchor.element.getBlock();
      const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1;
      if (anchorBlock.isPreStyle()) {
        if (this.range.anchor.element.isBreak()) {
          this.insertText("\n\n");
          this.range.anchor.offset -= 1;
          this.range.focus.offset -= 1;
        } else if (this.range.anchor.offset == endOffset && !(nextElement && anchorBlock.isContains(nextElement))) {
          if (this.range.anchor.element.isText() && this.range.anchor.element.textContent[this.range.anchor.offset - 1] == "\n") {
            this.insertText("\n");
          } else {
            this.insertText("\n\n");
            this.range.anchor.offset -= 1;
            this.range.focus.offset -= 1;
          }
        } else {
          this.insertText("\n");
        }
      } else {
        if (this.range.anchor.offset == 0 && !(previousElement && anchorBlock.isContains(previousElement))) {
          const paragraph = new AlexElement("block", anchorBlock.parsedom, Util.clone(anchorBlock.marks), Util.clone(anchorBlock.styles), null);
          const breakEle = new AlexElement("closed", "br", null, null, null);
          this.addElementTo(breakEle, paragraph);
          this.addElementBefore(paragraph, anchorBlock);
          this.range.anchor.moveToStart(anchorBlock);
          this.range.focus.moveToStart(anchorBlock);
        } else if (this.range.anchor.offset == endOffset && !(nextElement && anchorBlock.isContains(nextElement))) {
          const paragraph = new AlexElement("block", anchorBlock.parsedom, Util.clone(anchorBlock.marks), Util.clone(anchorBlock.styles), null);
          const breakEle = new AlexElement("closed", "br", null, null, null);
          this.addElementTo(breakEle, paragraph);
          this.addElementAfter(paragraph, anchorBlock);
          this.range.anchor.moveToStart(paragraph);
          this.range.focus.moveToStart(paragraph);
        } else {
          const block = this.range.anchor.element.getBlock();
          const newBlock = block.clone(true);
          this.addElementAfter(newBlock, block);
          const elements = AlexElement.flatElements(block.children);
          const index = elements.findIndex((item) => {
            return this.range.anchor.element.isEqual(item);
          });
          this.range.focus.moveToEnd(block);
          this.delete();
          const newElements = AlexElement.flatElements(newBlock.children);
          this.range.focus.element = newElements[index];
          this.range.focus.offset = this.range.anchor.offset;
          this.range.anchor.moveToStart(newBlock);
          this.delete();
        }
      }
    } else {
      this.delete();
      this.insertParagraph();
    }
  }
  //根据光标位置向编辑器内插入文本
  insertText(data2) {
    if (!data2 || typeof data2 != "string") {
      throw new Error("The argument must be a string");
    }
    if (this.range.anchor.isEqual(this.range.focus)) {
      if (!this.range.anchor.element.getBlock().isPreStyle()) {
        data2 = data2.replace(/\s+/g, () => {
          const span = document.createElement("span");
          span.innerHTML = "&nbsp;";
          return span.innerText;
        });
      }
      if (this.range.anchor.element.isText()) {
        let val = this.range.anchor.element.textContent;
        this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset) + data2 + val.substring(this.range.anchor.offset);
        this.range.anchor.offset = this.range.anchor.offset + data2.length;
        this.range.focus.offset = this.range.anchor.offset;
      } else {
        const textEl = new AlexElement("text", null, null, null, data2);
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
      this.insertText(data2);
    }
  }
  //根据光标插入元素
  insertElement(ele) {
    if (!AlexElement.isElement(ele)) {
      throw new Error("The argument must be an AlexElement instance");
    }
    if (ele.isEmpty()) {
      return;
    }
    if (this.range.anchor.isEqual(this.range.focus)) {
      if (ele.isBlock()) {
        const previousElement = this.getPreviousElementOfPoint(this.range.anchor);
        const nextElement = this.getNextElementOfPoint(this.range.anchor);
        const anchorBlock = this.range.anchor.element.getBlock();
        const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1;
        if (anchorBlock.isOnlyHasBreak()) {
          this.addElementBefore(ele, anchorBlock);
          this.mergeBlockElement(anchorBlock);
        } else if (this.range.anchor.offset == 0 && !(previousElement && anchorBlock.isContains(previousElement))) {
          this.addElementBefore(ele, anchorBlock);
        } else if (this.range.anchor.offset == endOffset && !(nextElement && anchorBlock.isContains(nextElement))) {
          this.addElementAfter(ele, anchorBlock);
        } else {
          const block = this.range.anchor.element.getBlock();
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
          let newText = this.range.anchor.element.clone();
          this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset);
          newText.textContent = val.substring(this.range.anchor.offset);
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
  //渲染编辑器dom内容
  domRender(unPushHistory = false) {
    this.$el.innerHTML = "";
    this.stack.forEach((element2) => {
      element2._renderElement();
      this.$el.appendChild(element2._elm);
    });
    this._oldValue = this.value;
    this.value = this.$el.innerHTML;
    if (this._oldValue != this.value) {
      this.emit("change", this.value, this._oldValue);
      if (!unPushHistory) {
        this.history.push(this.stack, this.range);
      }
    }
  }
  //根据anchor和focus来设置真实的光标
  rangeRender() {
    const handler = (point) => {
      let node = null;
      let offset = null;
      if (point.element.isClosed()) {
        node = point.element.parent._elm;
        const index = point.element.parent.children.findIndex((item) => {
          return point.element.isEqual(item);
        });
        if (point.offset == 0 || point.element.isBreak()) {
          offset = index;
        } else {
          offset = index + 1;
        }
      } else {
        node = point.element._elm.childNodes[0];
        offset = point.offset;
      }
      return { node, offset };
    };
    const anchorResult = handler(this.range.anchor);
    const focusResult = handler(this.range.focus);
    const selection = window.getSelection();
    selection.removeAllRanges();
    const range = document.createRange();
    range.setStart(anchorResult.node, anchorResult.offset);
    range.setEnd(focusResult.node, focusResult.offset);
    selection.addRange(range);
    this.emit("rangeUpdate", this.range);
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
      const element2 = this.parseNode(el);
      elements.push(element2);
    });
    return elements;
  }
  //将dom节点转为元素
  parseNode(node) {
    if (!(node instanceof Node)) {
      throw new Error("The argument must be an node");
    }
    if (!(node.nodeType == 1 || node.nodeType == 3)) {
      throw new Error("The argument must be an element node or text node");
    }
    if (node.nodeType == 3) {
      return new AlexElement("text", null, null, null, node.nodeValue);
    }
    const marks = Util.getAttributes(node);
    const styles = Util.getStyles(node);
    const parsedom = node.nodeName.toLocaleLowerCase();
    let element2 = new AlexElement("block", parsedom, marks, styles, null);
    Array.from(node.childNodes).forEach((childNode) => {
      if (childNode.nodeType == 1 || childNode.nodeType == 3) {
        const childEle = this.parseNode(childNode);
        childEle.parent = element2;
        if (element2.hasChildren()) {
          element2.children.push(childEle);
        } else {
          element2.children = [childEle];
        }
      }
    });
    return element2;
  }
  //将指定元素添加到父元素的子元素数组中
  addElementTo(childEle, parentEle, index = 0) {
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
  //将指定元素从元素数组中移除
  removeElement(ele) {
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
      ele.parent = null;
    }
  }
  //根据key查询元素
  getElementByKey(key) {
    if (!key) {
      throw new Error("You need to specify a key to do the query");
    }
    const searchFn = (elements) => {
      let element2 = null;
      for (let el of elements) {
        if (el.key == key) {
          element2 = el;
          break;
        }
        if (el.hasChildren()) {
          element2 = searchFn(el.children);
          if (element2) {
            break;
          }
        }
      }
      return element2;
    };
    return searchFn(this.stack);
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
  //向上查询可以设置焦点的元素
  getPreviousElementOfPoint(point) {
    if (!AlexPoint.isPoint(point)) {
      throw new Error("The argument must be an AlexPoint instance");
    }
    const flatElements = AlexElement.flatElements(this.stack);
    const fn = (element2) => {
      const index = flatElements.findIndex((item) => {
        return element2.isEqual(item);
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
    const fn = (element2) => {
      const index = flatElements.findIndex((item) => {
        return element2.isEqual(item);
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
  //获取选区之间的元素
  getElementsByRange(includes = false, flat = false) {
    if (this.range.anchor.isEqual(this.range.focus)) {
      return [];
    }
    let elements = [];
    if (this.range.anchor.element.isEqual(this.range.focus.element)) {
      if (includes) {
        if (this.range.anchor.element.isText()) {
          if (this.range.anchor.offset == 0 && this.range.focus.offset == this.range.anchor.element.textContent.length) {
            elements = [this.range.anchor.element];
          } else if (this.range.anchor.offset == 0) {
            let val = this.range.anchor.element.textContent;
            let newFocus = this.range.anchor.element.clone();
            this.range.anchor.element.textContent = val.substring(0, this.range.focus.offset);
            newFocus.textContent = val.substring(this.range.focus.offset);
            this.addElementAfter(newFocus, this.range.anchor.element);
            elements = [this.range.anchor.element];
          } else if (this.range.focus.offset == this.range.anchor.element.textContent.length) {
            let newFocus = this.range.anchor.element.clone();
            let val = this.range.anchor.element.textContent;
            this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset);
            newFocus.textContent = val.substring(this.range.anchor.offset);
            this.addElementAfter(newFocus, this.range.anchor.element);
            elements = [newFocus];
            this.range.anchor.moveToStart(newFocus);
            this.range.focus.moveToEnd(newFocus);
          } else {
            let newEl = this.range.anchor.element.clone();
            let newFocus = this.range.anchor.element.clone();
            let val = this.range.anchor.element.textContent;
            this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset);
            newEl.textContent = val.substring(this.range.anchor.offset, this.range.focus.offset);
            newFocus.textContent = val.substring(this.range.focus.offset);
            this.addElementAfter(newEl, this.range.anchor.element);
            this.addElementAfter(newFocus, newEl);
            this.range.anchor.moveToStart(newEl);
            this.range.focus.moveToEnd(newEl);
            elements = [newEl];
          }
        } else {
          elements = [this.range.anchor.element];
        }
      }
    } else {
      const flatElements = AlexElement.flatElements(this.stack);
      const anchorIndex = flatElements.findIndex((item) => {
        return this.range.anchor.element.isEqual(item);
      });
      const focusIndex = flatElements.findIndex((item) => {
        return this.range.focus.element.isEqual(item);
      });
      for (let i2 = anchorIndex + 1; i2 < focusIndex; i2++) {
        if (!flatElements[i2].hasContains(this.range.anchor.element) && !flatElements[i2].hasContains(this.range.focus.element)) {
          elements.push(flatElements[i2]);
        }
      }
      if (includes) {
        if (this.range.anchor.element.isText()) {
          if (this.range.anchor.offset == 0) {
            elements.unshift(this.range.anchor.element);
          } else if (this.range.anchor.offset < this.range.anchor.element.textContent.length) {
            let newEl = this.range.anchor.element.clone();
            let val = this.range.anchor.element.textContent;
            this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset);
            newEl.textContent = val.substring(this.range.anchor.offset);
            this.addElementAfter(newEl, this.range.anchor.element);
            elements.unshift(newEl);
            this.range.anchor.moveToStart(newEl);
          }
        } else if (this.range.anchor.offset == 0) {
          elements.unshift(this.range.anchor.element);
        }
        if (this.range.focus.element.isText()) {
          if (this.range.focus.offset == this.range.focus.element.textContent.length) {
            elements.push(this.range.focus.element);
          } else if (this.range.focus.offset > 0) {
            let newEl = this.range.focus.element.clone();
            let val = this.range.focus.element.textContent;
            this.range.focus.element.textContent = val.substring(0, this.range.focus.offset);
            newEl.textContent = val.substring(this.range.focus.offset);
            this.addElementAfter(newEl, this.range.focus.element);
            elements.push(this.range.focus.element);
          }
        } else if (this.range.focus.offset == 1) {
          elements.push(this.range.focus.element);
        }
      }
    }
    let i = 0;
    while (i < elements.length) {
      if (elements[i].isRoot()) {
        i++;
      } else {
        let has = elements.some((item) => {
          return item.isEqual(elements[i].parent);
        });
        if (has) {
          i++;
        } else {
          let allIn = elements[i].parent.children.every((item) => {
            return elements.some((e) => {
              return e.isEqual(item);
            });
          });
          if (allIn) {
            const index = elements.findIndex((item) => {
              return item.isEqual(elements[i]);
            });
            elements.splice(index, 0, elements[i].parent);
          } else {
            i++;
          }
        }
      }
    }
    if (flat) {
      return elements;
    }
    let notFlatElements = [];
    elements.forEach((el) => {
      if (el.isRoot()) {
        notFlatElements.push(el);
      } else {
        const isIn = elements.some((item) => {
          return item.isEqual(el.parent);
        });
        if (!isIn) {
          notFlatElements.push(el);
        }
      }
    });
    return notFlatElements;
  }
  //将虚拟光标设置到指定元素开始处
  collapseToStart(element2) {
    if (this.disabled) {
      return;
    }
    if (AlexElement.isElement(element2)) {
      this.range.anchor.moveToStart(element2);
      this.range.focus.moveToStart(element2);
    } else {
      const flatElements = AlexElement.flatElements(this.stack);
      this.range.anchor.moveToStart(flatElements[0]);
      this.range.focus.moveToStart(flatElements[0]);
    }
  }
  //将虚拟光标设置到指定元素最后
  collapseToEnd(element2) {
    if (this.disabled) {
      return;
    }
    if (AlexElement.isElement(element2)) {
      this.range.anchor.moveToEnd(element2);
      this.range.focus.moveToEnd(element2);
    } else {
      const flatElements = AlexElement.flatElements(this.stack);
      const length = flatElements.length;
      this.range.anchor.moveToEnd(flatElements[length - 1]);
      this.range.focus.moveToEnd(flatElements[length - 1]);
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
  //设置文本元素的样式
  setTextStyle(styles) {
    if (!obj.common.isObject(styles)) {
      throw new Error("The argument must be an object");
    }
    if (this.range.anchor.isEqual(this.range.focus)) {
      if (this.range.anchor.element.isSpaceText()) {
        if (this.range.anchor.element.hasStyles()) {
          Object.assign(this.range.anchor.element.styles, Util.clone(styles));
        } else {
          this.range.anchor.element.styles = Util.clone(styles);
        }
      } else if (this.range.anchor.element.isText()) {
        const el = AlexElement.getSpaceElement();
        el.styles = Util.clone(this.range.anchor.element.styles);
        el.marks = Util.clone(this.range.anchor.element.marks);
        if (el.hasStyles()) {
          Object.assign(el.styles, Util.clone(styles));
        } else {
          el.styles = Util.clone(styles);
        }
        this.insertElement(el);
      } else {
        const el = AlexElement.getSpaceElement();
        el.styles = Util.clone(styles);
        this.insertElement(el);
      }
    } else {
      const elements = this.getElementsByRange(true, true);
      elements.forEach((el) => {
        if (el.isText()) {
          if (el.hasStyles()) {
            Object.assign(el.styles, Util.clone(styles));
          } else {
            el.styles = Util.clone(styles);
          }
        }
      });
    }
  }
  //移除文本元素的样式
  removeTextStyle(styleNames) {
    const removeFn = (el) => {
      if (Array.isArray(styleNames)) {
        if (el.hasStyles()) {
          let styles = {};
          for (let key in el.styles) {
            if (!styleNames.includes(key)) {
              styles[key] = el.styles[key];
            }
          }
          el.styles = styles;
        }
      } else {
        el.styles = null;
      }
    };
    if (this.range.anchor.isEqual(this.range.focus)) {
      if (this.range.anchor.element.isSpaceText()) {
        removeFn(this.range.anchor.element);
      } else if (this.range.anchor.element.isText()) {
        const el = AlexElement.getSpaceElement();
        el.styles = Util.clone(this.range.anchor.element.styles);
        el.marks = Util.clone(this.range.anchor.element.marks);
        removeFn(el);
        this.insertElement(el);
      }
    } else {
      const elements = this.getElementsByRange(true, true);
      elements.forEach((el) => {
        if (el.isText()) {
          removeFn(el);
        }
      });
    }
  }
  //查询虚拟光标包含的文本元素是否具有某个样式
  queryTextStyle(name, value) {
    if (!name) {
      throw new Error("The first argument cannot be null");
    }
    if (this.range.anchor.isEqual(this.range.focus)) {
      if (this.range.anchor.element.isText() && this.range.anchor.element.hasStyles()) {
        if (value == null || value == void 0) {
          return this.range.anchor.element.styles.hasOwnProperty(name);
        }
        return this.range.anchor.element.styles[name] == value;
      }
      return false;
    }
    const elements = this.getElementsByRange(true, true).filter((el) => {
      return el.isText();
    });
    if (elements.length == 0) {
      return false;
    }
    let flag = elements.every((el) => {
      if (el.hasStyles()) {
        if (value == null || value == void 0) {
          return el.styles.hasOwnProperty(name);
        }
        return el.styles[name] == value;
      }
      return false;
    });
    this.formatElementStack();
    return flag;
  }
  //设置文本元素的标记
  setTextMark(marks) {
    if (!obj.common.isObject(marks)) {
      throw new Error("The argument must be an object");
    }
    if (this.range.anchor.isEqual(this.range.focus)) {
      if (this.range.anchor.element.isSpaceText()) {
        if (this.range.anchor.element.hasMarks()) {
          Object.assign(this.range.anchor.element.marks, Util.clone(marks));
        } else {
          this.range.anchor.element.marks = Util.clone(marks);
        }
      } else if (this.range.anchor.element.isText()) {
        const el = AlexElement.getSpaceElement();
        el.styles = Util.clone(this.range.anchor.element.styles);
        el.marks = Util.clone(this.range.anchor.element.marks);
        if (el.hasMarks()) {
          Object.assign(el.marks, Util.clone(marks));
        } else {
          el.marks = Util.clone(marks);
        }
        this.insertElement(el);
      } else {
        const el = AlexElement.getSpaceElement();
        el.marks = Util.clone(marks);
        this.insertElement(el);
      }
    } else {
      const elements = this.getElementsByRange(true, true);
      elements.forEach((el) => {
        if (el.isText()) {
          if (el.hasMarks()) {
            Object.assign(el.marks, Util.clone(marks));
          } else {
            el.marks = Util.clone(marks);
          }
        }
      });
    }
  }
  //移除文本元素的标记
  removeTextMark(markNames) {
    const removeFn = (el) => {
      if (Array.isArray(markNames)) {
        if (el.hasMarks()) {
          let marks = {};
          for (let key in el.marks) {
            if (!markNames.includes(key)) {
              marks[key] = el.marks[key];
            }
          }
          el.marks = marks;
        }
      } else {
        el.marks = null;
      }
    };
    if (this.range.anchor.isEqual(this.range.focus)) {
      if (this.range.anchor.element.isSpaceText()) {
        removeFn(this.range.anchor.element);
      } else if (this.range.anchor.element.isText()) {
        const el = AlexElement.getSpaceElement();
        el.styles = Util.clone(this.range.anchor.element.styles);
        el.marks = Util.clone(this.range.anchor.element.marks);
        removeFn(el);
        this.insertElement(el);
      }
    } else {
      const elements = this.getElementsByRange(true, true);
      elements.forEach((el) => {
        if (el.isText()) {
          removeFn(el);
        }
      });
    }
  }
  //查询选区内的文本元素是否具有某个标记
  queryTextMark(name, value) {
    if (!name) {
      throw new Error("The first argument cannot be null");
    }
    if (this.range.anchor.isEqual(this.range.focus)) {
      if (this.range.anchor.element.isText() && this.range.anchor.element.hasMarks()) {
        if (value == null || value == void 0) {
          return this.range.anchor.element.marks.hasOwnProperty(name);
        }
        return this.range.anchor.element.marks[name] == value;
      }
      return false;
    }
    const elements = this.getElementsByRange(true, true).filter((el) => {
      return el.isText();
    });
    if (elements.length == 0) {
      return false;
    }
    let flag = elements.every((el) => {
      if (el.hasMarks()) {
        if (value == null || value == void 0) {
          return el.marks.hasOwnProperty(name);
        }
        return el.marks[name] == value;
      }
      return false;
    });
    this.formatElementStack();
    return flag;
  }
  //触发自定义事件
  emit(eventName, ...value) {
    if (Array.isArray(this._events[eventName])) {
      this._events[eventName].forEach((fn) => {
        fn.apply(this, [...value]);
      });
      return true;
    }
    return false;
  }
  //监听自定义事件
  on(eventName, eventHandle) {
    if (!this._events[eventName]) {
      this._events[eventName] = [];
    }
    this._events[eventName].push(eventHandle);
  }
  //销毁编辑器的方法
  destroy() {
    this.setDisabled();
    obj.event.off(document, "selectionchange.alex_editor");
    obj.event.off(this.$el, "beforeinput.alex_editor compositionstart.alex_editor compositionupdate.alex_editor compositionend.alex_editor keydown.alex_editor cut.alex_editor paste.alex_editor drop.alex_editor focus.alex_editor blur.alex_editor");
  }
}
export {
  AlexEditor,
  AlexElement,
  AlexEditor as default
};
