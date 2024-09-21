var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
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
    }
    return false;
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
      return Number(s1.replace(".", "")) / Number(s2.replace(".", "")) * Math.pow(10, t2 - t1);
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
   * @param {Object} str 原始字符串
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
   * 获取元素距离某个定位祖先元素左侧/顶部/底部/右侧的距离
   * @param {Object} el 元素
   * @param {Object} root 定位父元素或者祖先元素，未指定则为document.body
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
   * 判断某个元素是否包含指定元素，包含相等关系和父子关系
   * @param {Object} parentNode 父元素或祖先元素
   * @param {Object} childNode 子元素
   */
  isContains(parentNode, childNode) {
    if (!this.isElement(parentNode)) {
      throw new TypeError("The first argument must be an element");
    }
    if (!this.isElement(childNode)) {
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
    return false;
  },
  /**
   * 判断某个元素是否是指定元素的父元素
   * @param {Object} parentNode 父元素
   * @param {Object} childNode 子元素
   */
  isParentNode(parentNode, childNode) {
    if (!this.isElement(parentNode)) {
      throw new TypeError("The first argument must be an element");
    }
    if (!this.isElement(childNode)) {
      throw new TypeError("The second argument must be an element");
    }
    if (parentNode === childNode) {
      return false;
    }
    return childNode.parentNode === parentNode;
  },
  /**
   * 查找某个元素下指定选择器的子元素
   * @param {Object} el 元素
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
   * 查找某个元素下指定选择器的兄弟元素
   * @param {Object} el 元素
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
   * @param {Object} el 元素
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
    classArray.forEach((item) => {
      classList.remove(item);
    });
  },
  /**
   * 添加class
   * @param {Object} el 元素
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
    classArray.forEach((item) => {
      classList.add(item);
    });
  },
  /**
   * 判断指定元素是否含有指定类名
   * @param {Object} el 元素
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
    return classArray.every((item) => {
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
    scrollEle.addEventListener("scroll", () => {
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
    return new Promise((resolve) => {
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
    return new Promise((resolve) => {
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
   * 判断是否是元素
   * @param {Object} el
   */
  isElement(el) {
    return el && el instanceof Node && el.nodeType === 1;
  },
  /**
   * 字符串转dom
   * @param {Object} html
   */
  string2dom(html) {
    if (!html || typeof html != "string") {
      throw new TypeError("The argument must be an HTML string");
    }
    const template = document.createElement("template");
    template.innerHTML = html;
    if (template.content.children.length == 1) {
      return template.content.children[0];
    } else {
      return Array.from(template.content.children);
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
   * 设置元素指定数据
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
   * @param {Object} param 判断的类型字符串
   */
  matchingText(text, param) {
    if (!text || typeof text != "string") {
      throw new TypeError("The first argument must be a string");
    }
    if (!param || typeof param != "string") {
      throw new TypeError("The second argument must be a string");
    }
    let reg = null;
    if (param == "Chinese") {
      reg = /^[\u4e00-\u9fa5]+$/;
    }
    if (param == "chinese") {
      reg = /[\u4e00-\u9fa5]/;
    }
    if (param == "email") {
      reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    }
    if (param == "username") {
      reg = /^[a-zA-Z0-9_]{4,16}$/;
    }
    if (param == "int+") {
      reg = /^\d+$/;
    }
    if (param == "int-") {
      reg = /^-\d+$/;
    }
    if (param == "int") {
      reg = /^-?\d+$/;
    }
    if (param == "pos") {
      reg = /^\d*\.?\d+$/;
    }
    if (param == "neg") {
      reg = /^-\d*\.?\d+$/;
    }
    if (param == "number") {
      reg = /^-?\d*\.?\d+$/;
    }
    if (param == "phone") {
      reg = /^1[0-9]\d{9}$/;
    }
    if (param == "idCard") {
      reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    }
    if (param == "url") {
      reg = /^(https?|ftp):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/;
    }
    if (param == "IPv4") {
      reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    }
    if (param == "hex") {
      reg = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    }
    if (param == "rgb") {
      reg = /^rgb\((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d),\s?(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d),\s?(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\)$/;
    }
    if (param == "rgba") {
      reg = /^rgba\((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d),\s?(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d),\s?(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d),\s?(0?\.\d|1(\.0)?|0)\)$/;
    }
    if (param == "QQ") {
      reg = /^[1-9][0-9]{4,10}$/;
    }
    if (param == "weixin") {
      reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;
    }
    if (param == "plate") {
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
      }
      return false;
    }
    return false;
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
      let aProps = Object.getOwnPropertyNames(a);
      let bProps = Object.getOwnPropertyNames(b);
      if (aProps.length != bProps.length) {
        return false;
      }
      let length = aProps.length;
      let isEqual = true;
      for (let i = 0; i < length; i++) {
        let propName = aProps[i];
        let propA = a[propName];
        let propB = b[propName];
        if (!this.equal(propA, propB)) {
          isEqual = false;
          break;
        }
      }
      return isEqual;
    }
    return a === b;
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
    if (!navigator.clipboard) {
      throw new Error("navigator.clipboard must be obtained in a secure environment, such as localhost, 127.0.0.1, or https, so the method won't work");
    }
    return navigator.clipboard.writeText(text);
  },
  /**
   * 深度克隆
   * @param {Object} data
   */
  clone(data2) {
    if (this.isObject(data2)) {
      if (Array.isArray(data2)) {
        return data2.map((item) => {
          return this.clone(item);
        });
      }
      let newData = {};
      for (let key in data2) {
        newData[key] = this.clone(data2[key]);
      }
      return newData;
    }
    return data2;
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
  guid = eventName + "." + guid;
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
        if (key == eventName + "." + guid) {
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
  },
  /**
   * 获取绑定的所有事件
   * @param {*} el
   */
  get(el) {
    if (!(el instanceof Document) && !element.isElement(el) && !element.isWindow(el)) {
      throw new TypeError("The first argument must be an element node or window or document");
    }
    let events = data.get(el, "dap-defined-events");
    if (!events) {
      return;
    }
    return events;
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
  },
  /**
   * 图片压缩方法
   * @param {*} file 需要压缩的图片File文件
   * @param {*} opts 压缩参数
   */
  compressImage(file2, opts) {
    const options = {
      //压缩图片的宽，单位px，如果不设置默认为原图宽
      width: void 0,
      //压缩图片质量，默认为原图的0.8
      quality: 0.8,
      //图片类型，jpeg或者webp，默认为jpeg
      mimeType: "jpeg",
      //压缩后的最大值，单位kb，默认为0表示不设置此值
      maxSize: 0,
      //小于该大小的图片不进行压缩，单位kb，默认为0表示任何图片都要压缩
      minSize: 0
    };
    if (common.isObject(opts)) {
      if (number.isNumber(opts.width)) {
        options.width = opts.width;
      }
      if (number.isNumber(opts.quality) && opts.quality >= 0 && opts.quality <= 1) {
        options.quality = opts.quality;
      }
      if (opts.mimeType == "jpeg" || opts.mimeType == "webp") {
        options.mimeType = opts.mimeType;
      }
      if (number.isNumber(opts.maxSize)) {
        options.maxSize = opts.maxSize;
      }
      if (number.isNumber(opts.minSize)) {
        options.minSize = opts.minSize;
      }
    }
    const createFile = (canvas, fileName, quality) => {
      let url = canvas.toDataURL("image/" + options.mimeType, quality);
      let file22 = this.dataBase64toFile(url, fileName);
      if (options.maxSize > 0 && file22.size > options.maxSize * 1024) {
        quality = quality <= 0 ? 0 : Number((quality - 0.01).toFixed(2));
        const res = createFile(canvas, fileName, quality);
        url = res.url;
        file22 = res.file;
        quality = res.quality;
      }
      return {
        file: file22,
        url,
        quality
      };
    };
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file2);
      reader.onload = () => {
        let url = reader.result;
        let img = new Image();
        img.src = url;
        img.onload = () => {
          if (options.minSize > 0 && file2.size <= options.minSize * 1024) {
            resolve({
              file: file2,
              url,
              quality: 1,
              width: img.width,
              height: img.height
            });
            return;
          }
          let canvas = document.createElement("canvas");
          let context = canvas.getContext("2d");
          canvas.width = options.width || img.width;
          canvas.height = options.width ? options.width / (img.width / img.height) : img.height;
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          let index = file2.name.lastIndexOf(".");
          const fileName = file2.name.substring(0, index) + "." + options.mimeType;
          let res = createFile(canvas, fileName, options.quality);
          resolve({
            ...res,
            width: canvas.width,
            height: canvas.height
          });
        };
        img.onerror = () => {
          reject(new Error("Failed to load image file"));
        };
      };
      reader.onerror = () => {
        reject(new Error("Failed to load image file"));
      };
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
        }
        if (userAgent.includes("Windows NT 6.3") || userAgent.includes("Windows NT 6.2") || userAgent.includes("Windows NT 8")) {
          return "Win8";
        }
        if (userAgent.includes("Windows NT 10") || userAgent.includes("Windows NT 6.4")) {
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
const NODE_MARK = "data-kaitify-node";
const getNodeRenderOptions = (editor, node) => {
  if (node.isText()) {
    return {
      tag: editor.textRenderTag,
      namespace: node.namespace,
      attrs: node.hasMarks() ? common.clone({ ...node.marks, [NODE_MARK]: node.key }) : { [NODE_MARK]: node.key },
      styles: node.hasStyles() ? common.clone(node.styles) : {},
      textContent: node.textContent
    };
  }
  return {
    tag: node.tag,
    namespace: node.namespace,
    attrs: node.hasMarks() ? common.clone({ ...node.marks, [NODE_MARK]: node.key }) : { [NODE_MARK]: node.key },
    styles: node.hasStyles() ? common.clone(node.styles) : {},
    children: node.hasChildren() ? node.children.map((item) => getNodeRenderOptions(editor, item)) : []
  };
};
const createUniqueKey = () => {
  let key = data.get(window, "data-kaitify-knode-key") || 0;
  key++;
  data.set(window, "data-kaitify-knode-key", key);
  return key;
};
const createGuid = function() {
  let key = data.get(window, "data-kaitify-guid") || 0;
  key++;
  data.set(window, "data-kaitify-guid", key);
  return key;
};
const isZeroWidthText = (val) => {
  return /^[\uFEFF]+$/g.test(val);
};
const getZeroWidthText = () => {
  return "\uFEFF";
};
const camelToKebab = (val) => {
  return val.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};
const kebabToCamel = (val) => {
  return val.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};
const getDomAttributes = (dom) => {
  let o = {};
  const length = dom.attributes.length;
  for (let i = 0; i < length; i++) {
    const attribute = dom.attributes[i];
    const regExp = new RegExp(`(^on)|(^style$)|(^face$)|(^${NODE_MARK}$)`, "g");
    if (!regExp.test(attribute.nodeName)) {
      o[attribute.nodeName] = attribute.nodeValue || "";
    }
  }
  return o;
};
const getDomStyles = (dom) => {
  let o = {};
  const styles = dom.getAttribute("style");
  if (styles) {
    let i = 0;
    let start = 0;
    let splitStyles = [];
    while (i < styles.length) {
      if (styles[i] == ";" && styles.substring(i + 1, i + 8) != "base64,") {
        splitStyles.push(styles.substring(start, i));
        start = i + 1;
      }
      if (i == styles.length - 1 && start < i + 1) {
        splitStyles.push(styles.substring(start, i + 1));
      }
      i++;
    }
    splitStyles.forEach((style) => {
      const index = style.indexOf(":");
      const property = style.substring(0, index).trim();
      const value = style.substring(index + 1).trim();
      o[kebabToCamel(property)] = value;
    });
  }
  return o;
};
const initEditorDom = (dom) => {
  if (typeof dom == "string" && dom) {
    dom = document.body.querySelector(dom);
  }
  dom = dom;
  if (!element.isElement(dom)) {
    throw new Error("You must specify a dom container to initialize the editor");
  }
  if (data.get(dom, "data-kaitify-init")) {
    throw new Error("The element node has been initialized to the editor");
  }
  data.set(dom, "data-kaitify-init", true);
  return dom;
};
const isContains = (parent, child) => {
  if (child.nodeType == 3) {
    return element.isContains(parent, child.parentNode);
  }
  return element.isContains(parent, child);
};
const delay = (num = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, num);
  });
};
class KNode {
  constructor() {
    /**
     * 唯一key
     */
    __publicField(this, "key", createUniqueKey());
    /**
     * 类型
     */
    __publicField(this, "type");
    /**
     * 渲染标签
     */
    __publicField(this, "tag");
    /**
     * 文本值
     */
    __publicField(this, "textContent");
    /**
     * 标记集合
     */
    __publicField(this, "marks");
    /**
     * 样式集合
     */
    __publicField(this, "styles");
    /**
     * 是否锁定节点
     * 针对块节点，在符合合并条件的情况下不允许编辑器将其与父节点或者子节点进行合并
     * 针对行内节点，在符合合并条件的情况下是否允许编辑器将其与相邻节点或者父节点或者子节点进行合并
     * 针对文本节点，在符合合并的条件下是否允许编辑器将其与相邻节点或者父节点进行合并
     */
    __publicField(this, "locked", false);
    /**
     * 是否为固定块节点，值为true时：当光标在节点起始处或者光标在节点内只有占位符时，执行删除操作不会删除此节点，会再次创建一个占位符进行处理；当光标在节点内且节点不是代码块样式，不会进行换行
     */
    __publicField(this, "fixed", false);
    /**
     * 命名空间
     */
    __publicField(this, "namespace");
    /**
     * 子节点数组
     */
    __publicField(this, "children");
    /**
     * 父节点
     */
    __publicField(this, "parent");
    /**
     * 复制节点，deep 为true表示深度复制，即复制子节点，否则只会复制自身
     */
    __publicField(this, "clone", (deep = true) => {
      const newNode = KNode.create({
        type: this.type,
        tag: this.tag,
        marks: common.clone(this.marks),
        styles: common.clone(this.styles),
        namespace: this.namespace,
        textContent: this.textContent,
        locked: this.locked,
        fixed: this.fixed
      });
      if (deep && this.hasChildren()) {
        this.children.forEach((child) => {
          const newChild = child.clone(deep);
          if (newNode.hasChildren()) {
            newNode.children.push(newChild);
          } else {
            newNode.children = [newChild];
          }
          newChild.parent = newNode;
        });
      }
      return newNode;
    });
    /**
     * 如果当前节点是文本节点或者闭合节点，则判断是不是指定节点后代中所有文本节点和闭合节点中的第一个
     */
    __publicField(this, "firstTextClosedInNode", (node) => {
      if (!this.isText() && !this.isClosed()) {
        return false;
      }
      if (this.isEqual(node)) {
        return false;
      }
      if (node.isContains(this)) {
        const nodes = KNode.flat(node.children).filter((item) => item.isText() || item.isClosed());
        return this.isEqual(nodes[0]);
      }
      return false;
    });
  }
  /**
   * 是否块节点
   */
  isBlock() {
    return this.type == "block";
  }
  /**
   * 是否行内节点
   */
  isInline() {
    return this.type == "inline";
  }
  /**
   * 是否闭合节点
   */
  isClosed() {
    return this.type == "closed";
  }
  /**
   * 是否文本节点
   */
  isText() {
    return this.type == "text";
  }
  /**
   * 获取所在块级节点
   */
  getBlock() {
    if (this.isBlock()) {
      return this;
    }
    return this.parent.getBlock();
  }
  /**
   * 获取所在行内节点
   */
  getInline() {
    if (this.isInline()) {
      return this;
    }
    if (!this.parent) {
      return null;
    }
    return this.parent.getInline();
  }
  /**
   * 是否有子节点
   */
  hasChildren() {
    if (this.isText() || this.isClosed()) {
      return false;
    }
    return Array.isArray(this.children) && !!this.children.length;
  }
  /**
   * 是否空节点
   */
  isEmpty() {
    if (this.isText()) {
      return !this.textContent;
    }
    if (this.isInline() || this.isBlock()) {
      return !this.hasChildren() || this.children.every((item) => {
        return item.isEmpty();
      });
    }
    return false;
  }
  /**
   * 是否零宽度无断空白文本节点
   */
  isZeroWidthText() {
    return this.isText() && !this.isEmpty() && isZeroWidthText(this.textContent);
  }
  /**
   * 是否占位符
   */
  isPlaceholder() {
    return this.isClosed() && this.tag == "br";
  }
  /**
   * 是否含有标记
   */
  hasMarks() {
    if (!this.marks) {
      return false;
    }
    if (common.isObject(this.marks)) {
      return !common.isEmptyObject(this.marks);
    }
    return false;
  }
  /**
   * 是否含有样式
   */
  hasStyles() {
    if (!this.styles) {
      return false;
    }
    if (common.isObject(this.styles)) {
      return !common.isEmptyObject(this.styles);
    }
    return false;
  }
  /**
   * 判断节点是否不可编辑的，如果是返回设置不可编辑的那个节点，否则返回null
   */
  isUneditable() {
    if (this.hasMarks() && this.marks["contenteditable"] == "false") {
      return this;
    }
    if (!this.parent) {
      return null;
    }
    return this.parent.isUneditable();
  }
  /**
   * 当前节点是否只包含占位符
   */
  allIsPlaceholder() {
    if (this.hasChildren()) {
      const nodes = this.children.filter((item) => !item.isEmpty());
      return nodes.length && nodes.every((el) => el.isPlaceholder());
    }
    return false;
  }
  /**
   * 设置为空节点
   */
  toEmpty() {
    if (this.isEmpty()) {
      return;
    }
    if (this.isText()) {
      this.textContent = void 0;
      return;
    }
    if (this.isClosed()) {
      this.type = "text";
      this.textContent = void 0;
      return;
    }
    if (this.hasChildren()) {
      this.children.forEach((item) => {
        item.toEmpty();
      });
    }
  }
  /**
   * 比较当前节点和另一个节点的styles是否一致
   
   */
  isEqualStyles(node) {
    if (!this.hasStyles() && !node.hasStyles()) {
      return true;
    }
    if (this.hasStyles() && node.hasStyles() && common.equal(this.styles, node.styles)) {
      return true;
    }
    return false;
  }
  /**
   * 比较当前节点和另一个节点的marks是否一致
   
   */
  isEqualMarks(node) {
    if (!this.hasMarks() && !node.hasMarks()) {
      return true;
    }
    if (this.hasMarks() && node.hasMarks() && common.equal(this.marks, node.marks)) {
      return true;
    }
    return false;
  }
  /**
   * 判断当前节点是否在拥有代码块样式的块级节点内（包括自身）
   */
  isInCodeBlockStyle() {
    const block = this.getBlock();
    if (block.tag == "pre") {
      return true;
    }
    const whiteSpace = block.hasStyles() ? block.styles.whiteSpace || "" : "";
    if (["pre", "pre-wrap"].includes(whiteSpace)) {
      return true;
    }
    return block.parent ? block.parent.isInCodeBlockStyle() : false;
  }
  /**
   * 判断当前节点是否与另一个节点相同
   
   */
  isEqual(node) {
    if (!KNode.isKNode(node)) {
      return false;
    }
    return this.key == node.key;
  }
  /**
   * 判断当前节点是否包含指定节点
   */
  isContains(node) {
    if (this.isEqual(node)) {
      return true;
    }
    if (this.isClosed() || this.isText()) {
      return false;
    }
    if (!node.parent) {
      return false;
    }
    return this.isContains(node.parent);
  }
  /**
   * 完全复制节点，涵盖每个属性
   */
  fullClone() {
    const newNode = KNode.create({
      type: this.type,
      tag: this.tag,
      marks: common.clone(this.marks),
      styles: common.clone(this.styles),
      namespace: this.namespace,
      textContent: this.textContent,
      locked: this.locked,
      fixed: this.fixed
    });
    newNode.key = this.key;
    if (this.hasChildren()) {
      this.children.forEach((child) => {
        const newChild = child.fullClone();
        if (newNode.hasChildren()) {
          newNode.children.push(newChild);
        } else {
          newNode.children = [newChild];
        }
        newChild.parent = newNode;
      });
    }
    return newNode;
  }
  /**
   * 如果当前节点是文本节点或者闭合节点，则判断是不是指定节点后代中所有文本节点和闭合节点中的最后一个
   */
  lastTextClosedInNode(node) {
    if (!this.isText() && !this.isClosed()) {
      return false;
    }
    if (this.isEqual(node)) {
      return false;
    }
    if (node.isContains(this)) {
      const nodes = KNode.flat(node.children).filter((item) => item.isText() || item.isClosed());
      return this.isEqual(nodes[nodes.length - 1]);
    }
    return false;
  }
  /**
   * 获取当前节点在某个节点数组中的前一个非空节点
   */
  getPrevious(nodes) {
    const index = nodes.findIndex((item) => item.isEqual(this));
    if (index <= 0) {
      return null;
    }
    const previousNode = nodes[index - 1];
    if (previousNode.isEmpty()) {
      return index - 1 == 0 ? null : previousNode.getPrevious(nodes);
    }
    return previousNode;
  }
  /**
   * 获取当前节点在某个节点数组中的后一个非空节点
   */
  getNext(nodes) {
    const index = nodes.findIndex((item) => item.isEqual(this));
    if (index < 0 || index == nodes.length - 1) {
      return null;
    }
    const nextNode = nodes[index + 1];
    if (nextNode.isEmpty()) {
      return index + 1 == nodes.length - 1 ? null : nextNode.getNext(nodes);
    }
    return nextNode;
  }
  /**
   * 创建节点
   */
  static create(options) {
    var _a;
    const knode = new KNode();
    knode.type = options.type;
    knode.tag = options.tag;
    knode.textContent = options.textContent;
    knode.fixed = options.fixed || false;
    knode.locked = options.locked || false;
    knode.marks = common.clone(options.marks);
    knode.styles = common.clone(options.styles);
    knode.namespace = options.namespace;
    knode.children = (_a = options.children) == null ? void 0 : _a.map((item) => {
      const childNode = KNode.create(item);
      childNode.parent = knode;
      return childNode;
    });
    return knode;
  }
  /**
   * 创建零宽度无断空白文本节点
   */
  static createZeroWidthText(options) {
    return KNode.create({
      type: "text",
      textContent: getZeroWidthText(),
      marks: options == null ? void 0 : options.marks,
      styles: options == null ? void 0 : options.styles,
      namespace: options == null ? void 0 : options.namespace,
      locked: options == null ? void 0 : options.locked
    });
  }
  /**
   * 创建占位符
   */
  static createPlaceholder() {
    return KNode.create({
      type: "closed",
      tag: "br"
    });
  }
  /**
   * 判断参数是否节点
   */
  static isKNode(val) {
    return val instanceof KNode;
  }
  /**
   * 将某个节点数组扁平化处理后返回
   */
  static flat(nodes) {
    const newNodes = [];
    const length = nodes.length;
    for (let i = 0; i < length; i++) {
      newNodes.push(nodes[i]);
      if (nodes[i].hasChildren()) {
        const childResult = KNode.flat(nodes[i].children);
        newNodes.push(...childResult);
      }
    }
    return newNodes;
  }
  /**
   * 在指定的节点数组中根据key查找节点
   */
  static searchByKey(key, nodes) {
    let node = null;
    const length = nodes.length;
    for (let i = 0; i < length; i++) {
      const item = nodes[i];
      if (item && item.key == Number(key)) {
        node = item;
        break;
      }
      if (item && item.hasChildren()) {
        const n = KNode.searchByKey(key, item.children);
        if (n) {
          node = n;
          break;
        }
      }
    }
    return node;
  }
}
const blockParse = [
  {
    tag: "p"
  },
  {
    tag: "div"
  },
  {
    tag: "table"
  },
  {
    tag: "ul"
  },
  {
    tag: "ol"
  },
  {
    tag: "h1"
  },
  {
    tag: "h2"
  },
  {
    tag: "h3"
  },
  {
    tag: "h4"
  },
  {
    tag: "h5"
  },
  {
    tag: "h6"
  },
  {
    tag: "blockquote"
  },
  {
    tag: "pre"
  },
  {
    tag: "address",
    parse: true
  },
  {
    tag: "article",
    parse: true
  },
  {
    tag: "aside",
    parse: true
  },
  {
    tag: "nav",
    parse: true
  },
  {
    tag: "section",
    parse: true
  },
  {
    tag: "li"
  },
  {
    tag: "tfoot",
    fixed: true
  },
  {
    tag: "tbody",
    fixed: true
  },
  {
    tag: "thead",
    fixed: true
  },
  {
    tag: "tr",
    fixed: true
  },
  {
    tag: "th",
    fixed: true
  },
  {
    tag: "td",
    fixed: true
  },
  {
    tag: "colgroup",
    fixed: true
  }
];
const inlineParse = [
  {
    tag: "span"
  },
  {
    tag: "a"
  },
  {
    tag: "label"
  },
  {
    tag: "code"
  },
  {
    tag: "b",
    parse: {
      fontWeight: "bold"
    }
  },
  {
    tag: "strong",
    parse: {
      fontWeight: "bold"
    }
  },
  {
    tag: "sup",
    parse: {
      verticalAlign: "super"
    }
  },
  {
    tag: "sub",
    parse: {
      verticalAlign: "sub"
    }
  },
  {
    tag: "i",
    parse: {
      fontStyle: "italic"
    }
  },
  {
    tag: "u",
    parse: {
      textDecorationLine: "underline"
    }
  },
  {
    tag: "del",
    parse: {
      textDecorationLine: "line-through"
    }
  },
  {
    tag: "abbr",
    parse: true
  },
  {
    tag: "acronym",
    parse: true
  },
  {
    tag: "bdo",
    parse: true
  },
  {
    tag: "font",
    parse: {
      fontFamily: (element2) => {
        return element2.getAttribute("face") || "";
      }
    }
  }
];
const closedParse = [
  {
    tag: "br"
  },
  {
    tag: "col"
  },
  {
    tag: "img"
  },
  {
    tag: "hr"
  },
  {
    tag: "video"
  },
  {
    tag: "audio"
  }
];
class Selection {
  constructor() {
    /**
     * 起点
     */
    __publicField(this, "start");
    /**
     * 终点
     */
    __publicField(this, "end");
  }
  /**
   * 是否已经初始化设置光标位置
   */
  focused() {
    return !!this.start && !!this.end;
  }
  /**
   * 光标是否折叠
   */
  collapsed() {
    if (!this.focused()) {
      return false;
    }
    return this.start.node.isEqual(this.end.node) && this.start.offset == this.end.offset;
  }
}
class History {
  constructor() {
    /**
     * 存放历史记录的堆栈
     */
    __publicField(this, "records", []);
    /**
     * 存放撤销记录的堆栈
     */
    __publicField(this, "redoRecords", []);
  }
  /**
   * 复制selection
   */
  cloneSelection(newNodes, selection) {
    const newSelection = new Selection();
    if (selection.focused()) {
      const startNode = KNode.searchByKey(selection.start.node.key, newNodes);
      const endNode = KNode.searchByKey(selection.end.node.key, newNodes);
      if (startNode && endNode) {
        newSelection.start = {
          node: startNode,
          offset: selection.start.offset
        };
        newSelection.end = {
          node: endNode,
          offset: selection.end.offset
        };
      }
    }
    return newSelection;
  }
  /**
   * 保存新的记录
   */
  setState(nodes, selection) {
    const newNodes = nodes.map((item) => item.fullClone());
    const newSelection = this.cloneSelection(newNodes, selection);
    this.records.push({
      nodes: newNodes,
      selection: newSelection
    });
    this.redoRecords = [];
  }
  /**
   * 撤销操作：返回上一个历史记录
   */
  setUndo() {
    if (this.records.length > 1) {
      const record = this.records.pop();
      this.redoRecords.push(record);
      const lastRecord = this.records[this.records.length - 1];
      const newNodes = lastRecord.nodes.map((item) => item.fullClone());
      const newSelection = this.cloneSelection(newNodes, lastRecord.selection);
      return {
        nodes: newNodes,
        selection: newSelection
      };
    }
    return null;
  }
  /**
   * 重做操作：返回下一个历史记录
   */
  setRedo() {
    if (this.redoRecords.length > 0) {
      const record = this.redoRecords.pop();
      this.records.push(record);
      const newNodes = record.nodes.map((item) => item.fullClone());
      const newSelection = this.cloneSelection(newNodes, record.selection);
      return {
        nodes: newNodes,
        selection: newSelection
      };
    }
    return null;
  }
  /**
   * 更新当前记录的编辑的光标
   */
  updateSelection(selection) {
    const record = this.records[this.records.length - 1];
    const newSelection = this.cloneSelection(record.nodes, selection);
    this.records[this.records.length - 1].selection = newSelection;
  }
}
const formatBlockInChildren = ({ node }) => {
  if (node.hasChildren() && !node.isEmpty()) {
    const nodes = node.children.filter((item) => {
      return !item.isEmpty();
    });
    const blockNodes = nodes.filter((item) => {
      return item.isBlock();
    });
    if (blockNodes.length && (node.isInline() || blockNodes.length != nodes.length)) {
      blockNodes.forEach((item) => {
        item.type = "inline";
      });
    }
  }
};
const formatPlaceholderMerge = ({ editor, node }) => {
  if (node.hasChildren()) {
    const children = node.children.filter((item) => {
      return !item.isEmpty();
    });
    const placeholderNodes = children.filter((item) => {
      return item.isPlaceholder();
    });
    if (node.isInline() && placeholderNodes.length) {
      placeholderNodes.forEach((item) => {
        item.toEmpty();
      });
    } else if (children.length > 1 && placeholderNodes.length == children.length) {
      if (editor.selection.focused()) {
        if (node.isContains(editor.selection.start.node)) {
          editor.setSelectionBefore(placeholderNodes[0], "start");
        }
        if (node.isContains(editor.selection.end.node)) {
          editor.setSelectionBefore(placeholderNodes[0], "end");
        }
      }
      node.children = [placeholderNodes[0]];
    } else if (children.length > 1 && placeholderNodes.length) {
      placeholderNodes.forEach((item) => {
        item.toEmpty();
      });
    }
  }
};
const formatSiblingNodesMerge = ({ editor, node }) => {
  if ((node.isBlock() || node.isInline()) && node.hasChildren() && node.children.length > 1) {
    let index = 0;
    while (node.hasChildren() && index <= node.children.length - 2) {
      const newTargetNode = editor.getAllowMergeNode(node.children[index], "nextSibling");
      if (newTargetNode) {
        editor.applyMergeNode(node.children[index], "nextSibling");
        if (node.hasChildren() && node.children.length == 1) {
          editor.applyMergeNode(node.children[0], "parent");
        }
        continue;
      }
      index++;
    }
  }
};
const formatParentNodeMerge = ({ editor, node }) => {
  if ((node.isBlock() || node.isInline()) && node.hasChildren() && node.children.length == 1) {
    if (editor.getAllowMergeNode(node.children[0], "parent")) {
      editor.applyMergeNode(node.children[0], "parent");
      if (editor.getAllowMergeNode(node, "prevSibling")) {
        editor.applyMergeNode(node, "prevSibling");
      } else if (editor.getAllowMergeNode(node, "nextSibling")) {
        editor.applyMergeNode(node, "nextSibling");
      }
    }
  }
};
const formatZeroWidthTextMerge = ({ editor, node }) => {
  if (node.isText() && !node.isEmpty() && node.textContent.split("").some((item) => isZeroWidthText(item))) {
    let val = node.textContent;
    let i = 0;
    while (i < val.length) {
      const chart = val.charAt(i);
      if (i > 0 && isZeroWidthText(chart) && isZeroWidthText(val.charAt(i - 1))) {
        if (editor.isSelectionInNode(node, "start") && editor.selection.start.offset >= i + 1) {
          editor.selection.start.offset -= 1;
        }
        if (editor.isSelectionInNode(node, "end") && editor.selection.end.offset >= i + 1) {
          editor.selection.end.offset -= 1;
        }
        val = string.delete(val, i, 1);
        continue;
      }
      i++;
    }
    node.textContent = val;
  }
};
const patchNodes$1 = (newNodes, oldNodes) => {
  let result = [];
  if (newNodes.length && oldNodes.length) {
    let newStartIndex = 0;
    let oldStartIndex = 0;
    let newEndIndex = newNodes.length - 1;
    let oldEndIndex = oldNodes.length - 1;
    while (newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex) {
      if (!oldNodes[oldStartIndex]) {
        oldStartIndex++;
      } else if (!oldNodes[oldEndIndex]) {
        oldEndIndex--;
      } else if (newNodes[newStartIndex].key == oldNodes[oldStartIndex].key) {
        result.push(...patchNode$1(newNodes[newStartIndex], oldNodes[oldStartIndex]));
        newStartIndex++;
        oldStartIndex++;
      } else if (newNodes[newEndIndex].key == oldNodes[oldEndIndex].key) {
        result.push(...patchNode$1(newNodes[newEndIndex], oldNodes[oldEndIndex]));
        newEndIndex--;
        oldEndIndex--;
      } else if (newNodes[newStartIndex].key == oldNodes[oldEndIndex].key) {
        result.push(
          {
            type: "move",
            newNode: newNodes[newStartIndex],
            oldNode: oldNodes[oldEndIndex]
          },
          ...patchNode$1(newNodes[newStartIndex], oldNodes[oldEndIndex])
        );
        newStartIndex++;
        oldEndIndex--;
      } else if (newNodes[newEndIndex].key == oldNodes[oldStartIndex].key) {
        result.push(
          {
            type: "move",
            newNode: newNodes[newEndIndex],
            oldNode: oldNodes[oldStartIndex]
          },
          ...patchNode$1(newNodes[newEndIndex], oldNodes[oldStartIndex])
        );
        newEndIndex--;
        oldStartIndex++;
      } else {
        let idxInOld = oldNodes.findIndex((item) => item && item.key === newNodes[newStartIndex].key);
        if (idxInOld >= 0) {
          result.push(
            {
              type: "move",
              newNode: newNodes[newStartIndex],
              oldNode: oldNodes[idxInOld]
            },
            ...patchNode$1(newNodes[newStartIndex], oldNodes[idxInOld])
          );
          oldNodes[idxInOld] = null;
        } else {
          result.push({
            type: "insert",
            newNode: newNodes[newStartIndex],
            oldNode: null
          });
        }
        newStartIndex++;
      }
      if (oldStartIndex > oldEndIndex) {
        for (; newStartIndex <= newEndIndex; newStartIndex++) {
          result.push({
            type: "insert",
            newNode: newNodes[newStartIndex],
            oldNode: null
          });
        }
      } else if (newStartIndex > newEndIndex) {
        for (; oldStartIndex <= oldEndIndex; oldStartIndex++) {
          if (oldNodes[oldStartIndex]) {
            result.push({
              type: "remove",
              oldNode: oldNodes[oldStartIndex],
              newNode: null
            });
          }
        }
      }
    }
  } else if (newNodes.length) {
    result = newNodes.map((item) => {
      return {
        type: "insert",
        newNode: item,
        oldNode: null
      };
    });
  } else if (oldNodes.length) {
    result = oldNodes.map((item) => {
      return {
        type: "remove",
        oldNode: item,
        newNode: null
      };
    });
  }
  return result;
};
const patchNode$1 = (newNode, oldNode) => {
  const result = [];
  if (newNode.isEmpty() || oldNode.isEmpty()) {
    result.push({
      type: "empty",
      oldNode,
      newNode
    });
  } else if (newNode.type != oldNode.type || newNode.locked != oldNode.locked || newNode.fixed != oldNode.fixed) {
    result.push({
      type: "replace",
      newNode,
      oldNode
    });
  } else if (!newNode.isText() && newNode.tag != oldNode.tag) {
    result.push({
      type: "replace",
      newNode,
      oldNode
    });
  } else if (newNode.hasChildren() && !oldNode.hasChildren()) {
    result.push({
      type: "replace",
      newNode,
      oldNode
    });
  } else if (oldNode.hasChildren() && !newNode.hasChildren()) {
    result.push({
      type: "replace",
      newNode,
      oldNode
    });
  } else {
    if (newNode.isText() && newNode.textContent != oldNode.textContent) {
      result.push({
        type: "update",
        oldNode,
        newNode,
        update: "textContent"
      });
    }
    if (!newNode.isEqualMarks(oldNode)) {
      result.push({
        type: "update",
        newNode,
        oldNode,
        update: "marks"
      });
    }
    if (!newNode.isEqualStyles(oldNode)) {
      result.push({
        type: "update",
        newNode,
        oldNode,
        update: "styles"
      });
    }
    if (newNode.hasChildren() && oldNode.hasChildren()) {
      result.push(...patchNodes$1(newNode.children, oldNode.children));
    }
  }
  return result;
};
const isUndo = function(e) {
  const { Mac } = platform.os();
  if (Mac) {
    return e.key.toLocaleLowerCase() == "z" && e.metaKey && !e.shiftKey && !e.altKey && !e.ctrlKey;
  }
  return e.key.toLocaleLowerCase() == "z" && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey;
};
const isRedo = function(e) {
  const { Mac } = platform.os();
  if (Mac) {
    return e.key.toLocaleLowerCase() == "z" && e.metaKey && e.shiftKey && !e.altKey && !e.ctrlKey;
  }
  return e.key.toLocaleLowerCase() == "y" && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey;
};
const handlerForPasteDrop = async (editor, dataTransfer) => {
  const html = dataTransfer.getData("text/html");
  const text = dataTransfer.getData("text/plain");
  const files = dataTransfer.files;
  if (html && editor.allowPasteHtml) {
    const nodes = editor.htmlParseNode(html).filter((item) => {
      return !item.isEmpty();
    });
    const useDefault = typeof editor.onPasteHtml == "function" ? await editor.onPasteHtml.apply(editor, [nodes, html]) : true;
    if (useDefault) {
      editor.insertNode(nodes[0]);
      for (let i = nodes.length - 1; i >= 1; i--) {
        editor.addNodeAfter(nodes[i], nodes[0]);
      }
      editor.setSelectionAfter(nodes[nodes.length - 1], "all");
    }
  } else if (text) {
    const useDefault = typeof editor.onPasteText == "function" ? await editor.onPasteText.apply(editor, [text]) : true;
    if (useDefault) {
      editor.insertText(text);
    }
  } else if (files.length) {
    const length = files.length;
    for (let i = 0; i < length; i++) {
      if (files[i].type.startsWith("image/")) {
        const useDefault = typeof editor.onPasteImage == "function" ? await editor.onPasteImage.apply(editor, [files[i]]) : true;
        if (useDefault) {
          const url = await file.dataFileToBase64(files[i]);
          const image = KNode.create({
            type: "closed",
            tag: "img",
            marks: {
              src: url,
              alt: files[i].name || ""
            }
          });
          editor.insertNode(image);
        }
      } else if (files[i].type.startsWith("video/")) {
        const useDefault = typeof editor.onPasteVideo == "function" ? await editor.onPasteVideo.apply(editor, [files[i]]) : true;
        if (useDefault) {
          const url = await file.dataFileToBase64(files[i]);
          const video = KNode.create({
            type: "closed",
            tag: "video",
            marks: {
              src: url,
              alt: files[i].name || ""
            }
          });
          editor.insertNode(video);
        }
      } else if (typeof editor.onPasteFile == "function") {
        editor.onPasteFile.apply(editor, [files[i]]);
      }
    }
  }
};
const onSelectionChange = function() {
  if (!this.$el) {
    return;
  }
  if (this.isComposition) {
    return;
  }
  if (this.internalCauseSelectionChange) {
    return;
  }
  const flag = this.updateSelection();
  if (!flag) {
    return;
  }
  this.history.updateSelection(this.selection);
  if (typeof this.onSelectionUpdate == "function") {
    this.onSelectionUpdate.apply(this, [this.selection]);
  }
};
const onBeforeInput = async function(e) {
  const event2 = e;
  if (event2.inputType === "insertCompositionText" || event2.inputType === "insertFromComposition") {
    return;
  }
  event2.preventDefault();
  if (!this.isEditable()) {
    return;
  }
  if (!this.selection.focused()) {
    return;
  }
  if (event2.inputType == "insertText" && event2.data) {
    this.insertText(event2.data);
    this.updateView();
  } else if (event2.inputType == "deleteContentBackward" || event2.inputType == "deleteByCut" || event2.inputType == "deleteByDrag") {
    this.delete();
    this.updateView();
  } else if (event2.inputType == "insertParagraph" || event2.inputType == "insertLineBreak") {
    this.insertParagraph();
    this.updateView();
  } else if (event2.inputType == "insertFromPaste") {
    if (event2.dataTransfer && this.allowPaste) {
      await handlerForPasteDrop(this, event2.dataTransfer);
      this.updateView();
    }
  } else if (event2.inputType == "insertFromDrop") {
    await delay();
    if (event2.dataTransfer && this.allowPaste) {
      await handlerForPasteDrop(this, event2.dataTransfer);
      this.updateView();
    }
  }
};
const onComposition = async function(e) {
  const event2 = e;
  if (!this.isEditable()) {
    return;
  }
  if (event2.type == "compositionstart") {
    this.isComposition = true;
  } else if (event2.type == "compositionend") {
    const realSelection = window.getSelection();
    const range = realSelection.getRangeAt(0);
    const element2 = range.endContainer;
    const parentElement = element2.parentNode;
    const parentNode = this.findNode(parentElement);
    if (parentNode.isText() && parentNode.textContent != element2.textContent) {
      const textContent = parentNode.textContent || "";
      parentNode.textContent = element2.textContent || "";
      if (this.isSelectionInNode(parentNode)) {
        this.updateSelection();
      }
      element2.textContent = textContent;
      await this.updateView();
    } else if (!parentNode.isText()) {
      const index = Array.from(parentElement.childNodes).findIndex((item) => item.isEqualNode(element2));
      const node = this.domParseNode(element2);
      parentNode.children.splice(index, 0, node);
      node.parent = parentNode;
      parentElement.removeChild(element2);
      if (this.selection.focused()) {
        this.setSelectionAfter(node, "all");
      }
      await this.updateView();
    }
    this.isComposition = false;
  }
};
const onKeyboard = function(e) {
  if (this.isComposition) {
    return;
  }
  const event2 = e;
  if (event2.type == "keydown") {
    if (!this.isEditable()) {
      return;
    }
    if (isUndo(event2)) {
      event2.preventDefault();
      this.undo();
    } else if (isRedo(event2)) {
      event2.preventDefault();
      this.redo();
    }
    if (typeof this.onKeydown == "function") {
      this.onKeydown.apply(this, [event2]);
    }
  } else if (event2.type == "keyup") {
    if (!this.isEditable()) {
      return;
    }
    if (typeof this.onKeyup == "function") {
      this.onKeyup.apply(this, [event2]);
    }
  }
};
const onFocus = function(e) {
  if (!this.isEditable()) {
    return;
  }
  if (typeof this.onFocus == "function") {
    this.onFocus.apply(this, [e]);
  }
};
const onBlur = function(e) {
  if (!this.isEditable()) {
    return;
  }
  if (typeof this.onBlur == "function") {
    this.onBlur.apply(this, [e]);
  }
};
const onCopy = async function(e) {
  const event2 = e;
  if (!this.allowCopy) {
    event2.preventDefault();
  }
};
const isLegalDom = (editor, dom) => {
  let legal = true;
  if (dom.nodeType == 3) {
    if (dom.parentNode && dom.parentNode.childNodes.length == 1) {
      try {
        const node = editor.findNode(dom.parentNode);
        if (!node.isText()) {
          legal = false;
        }
      } catch (error) {
        legal = false;
      }
    } else {
      legal = false;
    }
  } else if (dom.nodeType == 1) {
    try {
      editor.findNode(dom);
    } catch (error) {
      legal = false;
    }
  }
  return legal;
};
const removeDomObserve = (editor) => {
  if (editor.domObserver) {
    editor.domObserver.disconnect();
    editor.domObserver = null;
  }
};
const setDomObserve = (editor) => {
  if (!window.MutationObserver) {
    console.warn("The current browser does not support MutationObserver");
  }
  removeDomObserve(editor);
  editor.domObserver = new MutationObserver((mutationList) => {
    if (editor.isComposition) {
      return;
    }
    let hasUpdate = false;
    const illegalDoms = [];
    for (let i = 0; i < mutationList.length; i++) {
      const mutationRecord = mutationList[i];
      if (mutationRecord.type == "characterData") {
        const parentElement = mutationRecord.target.parentNode;
        const parentNode = editor.findNode(parentElement);
        if (parentNode.isText() && parentNode.textContent != mutationRecord.target.textContent) {
          const textContent = parentNode.textContent || "";
          parentNode.textContent = mutationRecord.target.textContent || "";
          if (editor.isSelectionInNode(parentNode)) {
            editor.updateSelection();
          }
          removeDomObserve(editor);
          mutationRecord.target.textContent = textContent;
          setDomObserve(editor);
          hasUpdate = true;
        } else if (!parentNode.isText()) {
          const index = Array.from(parentElement.childNodes).findIndex((item) => item.isEqualNode(mutationRecord.target));
          const node = editor.domParseNode(mutationRecord.target);
          parentNode.children.splice(index, 0, node);
          node.parent = parentNode;
          illegalDoms.push(mutationRecord.target);
          if (editor.selection.focused()) {
            editor.setSelectionAfter(node, "all");
          }
          hasUpdate = true;
        }
      } else if (mutationRecord.type == "childList") {
        const elements = Array.from(mutationRecord.addedNodes).filter((item) => !isLegalDom(editor, item));
        if (elements.length > 0) {
          const parentElement = mutationRecord.target;
          if (parentElement.isEqualNode(editor.$el)) {
            elements.forEach((el) => {
              const index = Array.from(parentElement.childNodes).findIndex((item) => item.isEqualNode(el));
              const node = editor.domParseNode(el);
              editor.stackNodes.splice(index, 0, node);
              illegalDoms.push(el);
              if (editor.selection.focused()) {
                editor.setSelectionAfter(node, "all");
              }
              hasUpdate = true;
            });
          } else {
            const parentNode = editor.findNode(parentElement);
            elements.forEach((el) => {
              const index = Array.from(parentElement.childNodes).findIndex((item) => item.isEqualNode(el));
              const node = editor.domParseNode(el);
              if (parentNode.hasChildren()) {
                parentNode.children.splice(index, 0, node);
                node.parent = parentNode;
              } else {
                parentNode.parent.children.splice(index, 0, node);
                node.parent = parentNode.parent;
              }
              illegalDoms.push(el);
              if (editor.selection.focused()) {
                editor.setSelectionAfter(node, "all");
              }
              hasUpdate = true;
            });
          }
        }
      }
    }
    if (hasUpdate) {
      illegalDoms.forEach((item) => {
        item.parentNode.removeChild(item);
      });
      editor.updateView();
    }
  });
  editor.domObserver.observe(editor.$el, {
    attributes: false,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true
  });
};
const getDifferentMarks = (newNode, oldNode) => {
  const addMarks = {};
  const removeMarks = {};
  if (newNode.hasMarks()) {
    Object.keys(newNode.marks).forEach((mark) => {
      if (oldNode.hasMarks() && oldNode.marks.hasOwnProperty(mark) && oldNode.marks[mark] === newNode.marks[mark]) {
        return;
      }
      addMarks[mark] = newNode.marks[mark];
    });
  }
  if (oldNode.hasMarks()) {
    Object.keys(oldNode.marks).forEach((mark) => {
      if (newNode.hasMarks() && newNode.marks.hasOwnProperty(mark)) {
        return;
      }
      removeMarks[mark] = oldNode.marks[mark];
    });
  }
  return { addMarks, removeMarks };
};
const getDifferentStyles = (newNode, oldNode) => {
  const addStyles = {};
  const removeStyles = {};
  if (newNode.hasStyles()) {
    Object.keys(newNode.styles).forEach((style) => {
      if (oldNode.hasStyles() && oldNode.styles.hasOwnProperty(style) && oldNode.styles[style] === newNode.styles[style]) {
        return;
      }
      addStyles[style] = newNode.styles[style];
    });
  }
  if (oldNode.hasStyles()) {
    Object.keys(oldNode.styles).forEach((style) => {
      if (newNode.hasStyles() && newNode.styles.hasOwnProperty(style)) {
        return;
      }
      removeStyles[style] = oldNode.styles[style];
    });
  }
  return { addStyles, removeStyles };
};
const patchNodes = (newNodes, oldNodes) => {
  let result = [];
  if (newNodes.length && oldNodes.length) {
    let newStartIndex = 0;
    let oldStartIndex = 0;
    let newEndIndex = newNodes.length - 1;
    let oldEndIndex = oldNodes.length - 1;
    while (newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex) {
      if (!oldNodes[oldStartIndex]) {
        oldStartIndex++;
      } else if (!oldNodes[oldEndIndex]) {
        oldEndIndex--;
      } else if (newNodes[newStartIndex].key == oldNodes[oldStartIndex].key) {
        result.push(...patchNode(newNodes[newStartIndex], oldNodes[oldStartIndex]));
        newStartIndex++;
        oldStartIndex++;
      } else if (newNodes[newEndIndex].key == oldNodes[oldEndIndex].key) {
        result.push(...patchNode(newNodes[newEndIndex], oldNodes[oldEndIndex]));
        newEndIndex--;
        oldEndIndex--;
      } else if (newNodes[newStartIndex].key == oldNodes[oldEndIndex].key) {
        result.push(
          {
            type: "move",
            newNode: newNodes[newStartIndex],
            oldNode: oldNodes[oldEndIndex]
          },
          ...patchNode(newNodes[newStartIndex], oldNodes[oldEndIndex])
        );
        newStartIndex++;
        oldEndIndex--;
      } else if (newNodes[newEndIndex].key == oldNodes[oldStartIndex].key) {
        result.push(
          {
            type: "move",
            newNode: newNodes[newEndIndex],
            oldNode: oldNodes[oldStartIndex]
          },
          ...patchNode(newNodes[newEndIndex], oldNodes[oldStartIndex])
        );
        newEndIndex--;
        oldStartIndex++;
      } else {
        let idxInOld = oldNodes.findIndex((item) => item && item.key === newNodes[newStartIndex].key);
        if (idxInOld >= 0) {
          result.push(
            {
              type: "move",
              newNode: newNodes[newStartIndex],
              oldNode: oldNodes[idxInOld]
            },
            ...patchNode(newNodes[newStartIndex], oldNodes[idxInOld])
          );
          oldNodes[idxInOld] = null;
        } else {
          result.push({
            type: "insert",
            newNode: newNodes[newStartIndex],
            oldNode: null
          });
        }
        newStartIndex++;
      }
      if (oldStartIndex > oldEndIndex) {
        for (; newStartIndex <= newEndIndex; newStartIndex++) {
          result.push({
            type: "insert",
            newNode: newNodes[newStartIndex],
            oldNode: null
          });
        }
      } else if (newStartIndex > newEndIndex) {
        for (; oldStartIndex <= oldEndIndex; oldStartIndex++) {
          if (oldNodes[oldStartIndex]) {
            result.push({
              type: "remove",
              oldNode: oldNodes[oldStartIndex],
              newNode: null
            });
          }
        }
      }
    }
  } else if (newNodes.length) {
    result = newNodes.map((item) => {
      return {
        type: "insert",
        newNode: item,
        oldNode: null
      };
    });
  } else if (oldNodes.length) {
    result = oldNodes.map((item) => {
      return {
        type: "remove",
        oldNode: item,
        newNode: null
      };
    });
  }
  return result;
};
const patchNode = (newNode, oldNode) => {
  const result = [];
  if (newNode.namespace != oldNode.namespace) {
    result.push({
      type: "replace",
      newNode,
      oldNode
    });
  } else if (!newNode.isText() && newNode.tag != oldNode.tag) {
    result.push({
      type: "replace",
      newNode,
      oldNode
    });
  } else if (newNode.hasChildren() && !oldNode.hasChildren()) {
    result.push({
      type: "replace",
      newNode,
      oldNode
    });
  } else if (oldNode.hasChildren() && !newNode.hasChildren()) {
    result.push({
      type: "replace",
      newNode,
      oldNode
    });
  } else {
    if (newNode.isText() && newNode.textContent != oldNode.textContent) {
      result.push({
        type: "update",
        oldNode,
        newNode,
        update: "textContent"
      });
    }
    if (!newNode.isEqualStyles(oldNode)) {
      result.push({
        type: "update",
        newNode,
        oldNode,
        update: "styles"
      });
    }
    if (!newNode.isEqualMarks(oldNode)) {
      result.push({
        type: "update",
        newNode,
        oldNode,
        update: "marks"
      });
    }
    if (newNode.hasChildren() && oldNode.hasChildren()) {
      result.push(...patchNodes(newNode.children, oldNode.children));
    }
  }
  return result;
};
const renderNode = (editor, opts) => {
  const element2 = opts.namespace ? document.createElementNS(opts.namespace, opts.tag) : document.createElement(opts.tag);
  if (opts.textContent) {
    element2.textContent = opts.textContent;
  }
  if (opts.children && opts.children.length) {
    element2.append(...opts.children.map((item) => renderNode(editor, item)));
  }
  Object.keys(opts.attrs).forEach((attr) => {
    if (!/(^on)|(^style$)|(^face$)/g.test(attr)) {
      element2.setAttribute(attr, `${opts.attrs[attr]}`);
    }
  });
  Object.keys(opts.styles).forEach((style) => {
    element2.style.setProperty(camelToKebab(style), `${opts.styles[style]}`);
  });
  return element2;
};
const defaultUpdateViewFunction = function(init) {
  if (!this.$el) {
    return;
  }
  if (init) {
    const fragment = document.createDocumentFragment();
    this.stackNodes.forEach((node) => {
      const options = getNodeRenderOptions(this, node);
      const element2 = renderNode(this, options);
      fragment.appendChild(element2);
    });
    this.$el.innerHTML = "";
    this.$el.appendChild(fragment);
  } else {
    patchNodes(this.stackNodes, this.oldStackNodes).forEach((item) => {
      if (item.type == "insert") {
        const options = getNodeRenderOptions(this, item.newNode);
        const newDom = renderNode(this, options);
        const parentNode = item.newNode.parent;
        const previousNode = item.newNode.getPrevious(parentNode ? parentNode.children : this.stackNodes);
        const parentDom = parentNode ? this.findDom(parentNode) : this.$el;
        if (previousNode) {
          const previousDom = this.findDom(previousNode);
          previousDom.nextElementSibling ? parentDom.insertBefore(newDom, previousDom.nextElementSibling) : parentDom.appendChild(newDom);
        } else {
          parentDom.firstElementChild ? parentDom.insertBefore(newDom, parentDom.firstElementChild) : parentDom.appendChild(newDom);
        }
      } else if (item.type == "remove") {
        try {
          this.findDom(item.oldNode).remove();
        } catch (error) {
        }
      } else if (item.type == "update") {
        const dom = this.findDom(item.newNode);
        if (item.update == "textContent") {
          dom.textContent = item.newNode.textContent || "";
        } else if (item.update == "styles") {
          const { addStyles, removeStyles } = getDifferentStyles(item.newNode, item.oldNode);
          for (let key in removeStyles) {
            dom.style.removeProperty(key);
          }
          for (let key in addStyles) {
            dom.style.setProperty(key, `${addStyles[key]}`);
          }
        } else if (item.update == "marks") {
          const { addMarks, removeMarks } = getDifferentMarks(item.newNode, item.oldNode);
          for (let key in removeMarks) {
            dom.removeAttribute(key);
          }
          for (let key in addMarks) {
            if (!/(^on)|(^style$)|(^face$)/g.test(key)) {
              dom.setAttribute(key, `${addMarks[key]}`);
            }
          }
        }
      } else if (item.type == "replace") {
        const options = getNodeRenderOptions(this, item.newNode);
        const newDom = renderNode(this, options);
        const oldDom = this.findDom(item.oldNode);
        const parentDom = item.oldNode.parent ? this.findDom(item.oldNode.parent) : this.$el;
        parentDom.insertBefore(newDom, oldDom);
        oldDom.remove();
      } else if (item.type == "move") {
        const dom = this.findDom(item.newNode);
        const parentNode = item.newNode.parent;
        const previousNode = item.newNode.getPrevious(parentNode ? parentNode.children : this.stackNodes);
        const parentDom = parentNode ? this.findDom(parentNode) : this.$el;
        if (previousNode) {
          const previousDom = this.findDom(previousNode);
          previousDom.nextElementSibling ? parentDom.insertBefore(dom, previousDom.nextElementSibling) : parentDom.appendChild(dom);
        } else {
          parentDom.firstElementChild ? parentDom.insertBefore(dom, parentDom.firstElementChild) : parentDom.appendChild(dom);
        }
      }
    });
  }
};
class Editor {
  constructor() {
    /**
     * 编辑器的真实dom
     */
    __publicField(this, "$el");
    /**
     * 是否允许复制
     */
    __publicField(this, "allowCopy", true);
    /**
     * 是否允许粘贴
     */
    __publicField(this, "allowPaste", true);
    /**
     * 是否允许剪切
     */
    __publicField(this, "allowCut", true);
    /**
     * 是否允许粘贴html
     */
    __publicField(this, "allowPasteHtml", false);
    /**
     * 编辑器内渲染文本节点的真实标签
     */
    __publicField(this, "textRenderTag", "span");
    /**
     * 编辑内渲染默认块级节点的真实标签，即段落标签
     */
    __publicField(this, "blockRenderTag", "p");
    /**
     * 编辑器内定义不显示的标签
     */
    __publicField(this, "voidRenderTags", ["colgroup", "col"]);
    /**
     * 编辑器内定义需要置空的标签
     */
    __publicField(this, "emptyRenderTags", ["meta", "link", "style", "script", "title", "base", "noscript", "template", "annotation"]);
    /**
     * 编辑器内额外保留的标签
     */
    __publicField(this, "extraKeepTags", []);
    /**
     * 编辑器的节点数组格式化规则
     */
    __publicField(this, "formatRules", [formatBlockInChildren, formatPlaceholderMerge, formatSiblingNodesMerge, formatParentNodeMerge, formatZeroWidthTextMerge]);
    /**
     * 自定义dom转为非文本节点的后续处理
     */
    __publicField(this, "domParseNodeCallback");
    /**
     * 合并块节点之前触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
     */
    __publicField(this, "onMergeBlockNode");
    /**
     * 视图渲染时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要自定义渲染视图
     */
    __publicField(this, "onUpdateView");
    /**
     * 编辑器粘贴纯文本时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
     */
    __publicField(this, "onPasteText");
    /**
     * 编辑器粘贴html内容时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
     */
    __publicField(this, "onPasteHtml");
    /**
     * 编辑器粘贴图片时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
     */
    __publicField(this, "onPasteImage");
    /**
     * 编辑器粘贴视频时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理
     */
    __publicField(this, "onPasteVideo");
    /**
     * 编辑器粘贴除了图片和视频以外的文件时触发，需要自定义处理
     */
    __publicField(this, "onPasteFile");
    /**
     * 编辑器内容改变触发
     */
    __publicField(this, "onChange");
    /**
     * 编辑器光标发生变化
     */
    __publicField(this, "onSelectionUpdate");
    /**
     * 插入段落时触发
     */
    __publicField(this, "onInsertParagraph");
    /**
     * 光标在编辑器起始位置执行删除时触发
     */
    __publicField(this, "onDeleteInStart");
    /**
     * 完成删除时触发
     */
    __publicField(this, "onDeleteComplete");
    /**
     * 光标在编辑器内时键盘按下触发
     */
    __publicField(this, "onKeydown");
    /**
     * 光标在编辑器内时键盘松开触发
     */
    __publicField(this, "onKeyup");
    /**
     * 编辑器聚焦时触发
     */
    __publicField(this, "onFocus");
    /**
     * 编辑器失焦时触发
     */
    __publicField(this, "onBlur");
    /*---------------------下面的属性都是不属于创建编辑器的参数---------------------------*/
    /**
     * 唯一id
     */
    __publicField(this, "guid", createGuid());
    /**
     * 虚拟光标
     */
    __publicField(this, "selection", new Selection());
    /**
     * 历史记录
     */
    __publicField(this, "history", new History());
    /**
     * 节点数组
     */
    __publicField(this, "stackNodes", []);
    /**
     * 旧节点数组
     */
    __publicField(this, "oldStackNodes", []);
    /**
     * 是否在输入中文
     */
    __publicField(this, "isComposition", false);
    /**
     * 是否编辑器内部渲染真实光标引起selctionChange事件
     */
    __publicField(this, "internalCauseSelectionChange", false);
    /**
     * dom监听
     */
    __publicField(this, "domObserver", null);
  }
  /**
   * 根据dom查找到编辑内的对应节点
   */
  findNode(dom) {
    if (!isContains(this.$el, dom)) {
      throw new Error(`The dom should be in the editor area, but what you provide is not`);
    }
    const key = dom.getAttribute(NODE_MARK);
    if (!key) {
      throw new Error(`The dom generated by editor should all have a ${NODE_MARK} attribute, but your dom does not. Check for "updateView" related issues`);
    }
    const node = KNode.searchByKey(key, this.stackNodes);
    if (!node) {
      throw new Error(`Unexpected error occurred: the knode was not found in the editor`);
    }
    return node;
  }
  /**
   * 根据编辑器内的node查找真实dom
   */
  findDom(node) {
    let tag = node.tag;
    if (node.isText()) {
      tag = this.textRenderTag;
    }
    const dom = this.$el.querySelector(`${tag}[${NODE_MARK}="${node.key}"]`);
    if (!dom) {
      throw new Error(`Unexpected error occurred: the dom was not found in the editor`);
    }
    return dom;
  }
  /**
   * 设置编辑器是否可编辑
   */
  setEditable(editable) {
    var _a, _b;
    if (editable) {
      (_a = this.$el) == null ? void 0 : _a.setAttribute("contenteditable", "true");
    } else {
      (_b = this.$el) == null ? void 0 : _b.removeAttribute("contenteditable");
    }
  }
  /**
   * 判断编辑器是否可编辑
   */
  isEditable() {
    var _a;
    return ((_a = this.$el) == null ? void 0 : _a.getAttribute("contenteditable")) == "true";
  }
  /**
   * 初始化校验编辑器的节点数组，如果编辑器的节点数组为空或者都是空节点，则初始化创建一个只有占位符的段落
   */
  checkNodes() {
    const nodes = KNode.flat(this.stackNodes).filter((item) => {
      return !item.isEmpty() && !this.voidRenderTags.includes(item.tag);
    });
    if (nodes.length == 0) {
      const node = KNode.create({
        type: "block",
        tag: this.blockRenderTag
      });
      const placeholder = KNode.createPlaceholder();
      this.addNode(placeholder, node);
      this.stackNodes = [node];
      if (this.selection.focused()) {
        this.setSelectionBefore(placeholder);
      }
    }
  }
  /**
   * 将编辑器内的某个非块级节点转为默认块级节点
   */
  convertToBlock(node) {
    if (node.isBlock()) {
      return;
    }
    const newNode = node.clone(true);
    if (node.isText() || node.isClosed()) {
      if (this.isSelectionInNode(node, "start")) {
        this.selection.start.node = newNode;
      }
      if (this.isSelectionInNode(node, "end")) {
        this.selection.end.node = newNode;
      }
    }
    node.type = "block";
    node.tag = this.blockRenderTag;
    node.marks = void 0;
    node.styles = void 0;
    node.textContent = void 0;
    node.children = [newNode];
    newNode.parent = node;
  }
  /**
   * dom转KNode
   */
  domParseNode(dom) {
    if (dom.nodeType != 1 && dom.nodeType != 3) {
      throw new Error("The argument must be an element node or text node");
    }
    if (dom.nodeType == 3) {
      return KNode.create({
        type: "text",
        textContent: dom.textContent || ""
      });
    }
    const marks = getDomAttributes(dom);
    const styles = getDomStyles(dom);
    const tag = dom.nodeName.toLocaleLowerCase();
    const namespace = dom.namespaceURI;
    if (this.voidRenderTags.includes(tag)) {
      return KNode.create({
        type: "text"
      });
    }
    if (tag == this.textRenderTag && dom.childNodes.length && Array.from(dom.childNodes).every((childNode) => childNode.nodeType == 3)) {
      return KNode.create({
        type: "text",
        marks,
        styles,
        textContent: dom.textContent || ""
      });
    }
    const block = blockParse.find((item) => item.tag == tag);
    const inline = inlineParse.find((item) => item.tag == tag);
    const closed = closedParse.find((item) => item.tag == tag);
    const config = {
      type: "inline",
      tag,
      marks,
      styles,
      namespace: namespace || ""
    };
    if (block) {
      config.type = "block";
      config.children = [];
      if (block.parse) {
        config.tag = this.blockRenderTag;
      }
      if (block.fixed) {
        config.fixed = block.fixed;
      }
    } else if (inline) {
      config.type = "inline";
      config.children = [];
      if (inline.parse) {
        config.tag = this.textRenderTag;
        if (common.isObject(inline.parse)) {
          const inlineParse2 = inline.parse;
          for (let key in inlineParse2) {
            if (typeof inlineParse2[key] == "function") {
              config.styles[key] = inlineParse2[key].apply(this, [dom]);
            } else {
              config.styles[key] = inlineParse2[key];
            }
          }
        }
      }
    } else if (closed) {
      config.type = "closed";
    } else if (!this.extraKeepTags.includes(tag)) {
      config.type = "inline";
      config.tag = this.textRenderTag;
      config.namespace = "";
      config.children = [];
    }
    let node = KNode.create(config);
    if (!closed) {
      Array.from(dom.childNodes).forEach((child) => {
        if (child.nodeType == 1 || child.nodeType == 3) {
          const childNode = this.domParseNode(child);
          childNode.parent = node;
          if (node.hasChildren()) {
            node.children.push(childNode);
          } else {
            node.children = [childNode];
          }
        }
      });
    }
    if (typeof this.domParseNodeCallback == "function") {
      node = this.domParseNodeCallback.apply(this, [node]);
    }
    return node;
  }
  /**
   * html转KNode
   */
  htmlParseNode(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    const nodes = [];
    template.content.childNodes.forEach((item) => {
      if (item.nodeType == 1 || item.nodeType == 3) {
        const node = this.domParseNode(item);
        nodes.push(node);
      }
    });
    return nodes;
  }
  /**
   * 判断节点是否根级块节点，如果该节点在根部但不是块节点返回false
   */
  isRootBlock(node) {
    const index = this.stackNodes.findIndex((item) => item.isEqual(node));
    if (index > -1) {
      return node.isBlock();
    }
    return false;
  }
  /**
   * 获取指定节点所在的根级块节点，如果该节点没有加入到编辑器内那么会返回null
   */
  getRootBlock(node) {
    const index = this.stackNodes.findIndex((item) => item.isEqual(node));
    if (index > -1) {
      return node.isBlock() ? node : null;
    }
    if (!node.parent) {
      return null;
    }
    return this.getRootBlock(node.parent);
  }
  /**
   * 将后一个块节点与前一个块节点合并
   */
  mergeBlock(node, target) {
    if (!node.isBlock() || !target.isBlock()) {
      return;
    }
    if (node.isEmpty() || target.isEmpty()) {
      return;
    }
    const useDefault = typeof this.onMergeBlockNode == "function" ? this.onMergeBlockNode.apply(this, [node, target]) : true;
    if (useDefault) {
      const nodes = target.children.map((item) => {
        item.parent = node;
        return item;
      });
      node.children.push(...nodes);
      target.children = [];
    }
  }
  /**
   * 将指定节点添加到某个节点的子节点数组里
   */
  addNode(node, parentNode, index = 0) {
    if (node.isEmpty()) {
      return;
    }
    if (parentNode.isText() || parentNode.isClosed()) {
      return;
    }
    if (!parentNode.hasChildren()) {
      parentNode.children = [];
    }
    if (index >= parentNode.children.length) {
      parentNode.children.push(node);
    } else {
      parentNode.children.splice(index, 0, node);
    }
    node.parent = parentNode;
  }
  /**
   * 将指定节点添加到某个节点前面
   */
  addNodeBefore(node, target) {
    if (target.parent) {
      const index = target.parent.children.findIndex((item) => {
        return target.isEqual(item);
      });
      this.addNode(node, target.parent, index);
    } else {
      const index = this.stackNodes.findIndex((item) => {
        return target.isEqual(item);
      });
      this.stackNodes.splice(index, 0, node);
      node.parent = void 0;
    }
  }
  /**
   * 将指定节点添加到某个节点后面
   */
  addNodeAfter(node, target) {
    if (target.parent) {
      const index = target.parent.children.findIndex((item) => {
        return target.isEqual(item);
      });
      this.addNode(node, target.parent, index + 1);
    } else {
      const index = this.stackNodes.findIndex((item) => {
        return target.isEqual(item);
      });
      this.stackNodes.splice(index + 1, 0, node);
      node.parent = void 0;
    }
  }
  /**
   * 获取某个节点内的最后一个可以设置光标点的节点
   */
  getLastSelectionNodeInChildren(node) {
    if (node.isEmpty()) {
      return null;
    }
    if (node.tag && this.voidRenderTags.includes(node.tag)) {
      return null;
    }
    if (node.isText() || node.isClosed()) {
      return node;
    }
    let selectionNode = null;
    const length = node.children.length;
    for (let i = length - 1; i >= 0; i--) {
      const child = node.children[i];
      selectionNode = this.getLastSelectionNodeInChildren(child);
      if (selectionNode) {
        break;
      }
    }
    return selectionNode;
  }
  /**
   * 获取某个节点内的第一个可以设置光标点的节点
   */
  getFirstSelectionNodeInChildren(node) {
    if (node.isEmpty()) {
      return null;
    }
    if (node.tag && this.voidRenderTags.includes(node.tag)) {
      return null;
    }
    if (node.isText() || node.isClosed()) {
      return node;
    }
    let selectionNode = null;
    const length = node.children.length;
    for (let i = 0; i < length; i++) {
      const child = node.children[i];
      selectionNode = this.getFirstSelectionNodeInChildren(child);
      if (selectionNode) {
        break;
      }
    }
    return selectionNode;
  }
  /**
   * 查找指定节点之前可以设置为光标点的非空节点
   */
  getPreviousSelectionNode(node) {
    const nodes = node.parent ? node.parent.children : this.stackNodes;
    const previousNode = node.getPrevious(nodes);
    if (previousNode) {
      if (previousNode.isEmpty()) {
        return this.getPreviousSelectionNode(previousNode);
      }
      if (previousNode.tag && this.voidRenderTags.includes(previousNode.tag)) {
        return this.getPreviousSelectionNode(previousNode);
      }
      if (previousNode.isText() || previousNode.isClosed()) {
        return previousNode;
      }
      return this.getLastSelectionNodeInChildren(previousNode);
    }
    return node.parent ? this.getPreviousSelectionNode(node.parent) : null;
  }
  /**
   * 查找指定节点之后可以设置为光标点的非空节点
   */
  getNextSelectionNode(node) {
    const nodes = node.parent ? node.parent.children : this.stackNodes;
    const nextNode = node.getNext(nodes);
    if (nextNode) {
      if (nextNode.isEmpty()) {
        return this.getNextSelectionNode(nextNode);
      }
      if (nextNode.tag && this.voidRenderTags.includes(nextNode.tag)) {
        return this.getNextSelectionNode(nextNode);
      }
      if (nextNode.isText() || nextNode.isClosed()) {
        return nextNode;
      }
      return this.getFirstSelectionNodeInChildren(nextNode);
    }
    return node.parent ? this.getNextSelectionNode(node.parent) : null;
  }
  /**
   * 设置光标到指定节点头部，如果没有指定节点则设置光标到编辑器头部，start表示只设置起点，end表示只设置终点，all表示起点和终点都设置
   */
  setSelectionBefore(node, type = "all") {
    if (node) {
      const selectionNode = this.getFirstSelectionNodeInChildren(node);
      if (selectionNode) {
        if (type == "start" || type == "all") {
          this.selection.start = {
            node: selectionNode,
            offset: 0
          };
        }
        if (type == "end" || type == "all") {
          this.selection.end = {
            node: selectionNode,
            offset: 0
          };
        }
      }
    } else {
      const firstNode = this.stackNodes[0];
      let selectionNode = this.getFirstSelectionNodeInChildren(firstNode);
      if (!selectionNode)
        selectionNode = this.getNextSelectionNode(firstNode);
      if (selectionNode) {
        if (type == "start" || type == "all") {
          this.selection.start = {
            node: selectionNode,
            offset: 0
          };
        }
        if (type == "end" || type == "all") {
          this.selection.end = {
            node: selectionNode,
            offset: 0
          };
        }
      }
    }
  }
  /**
   * 设置光标到指定节点的末尾，如果没有指定节点则设置光标到编辑器末尾，start表示只设置起点，end表示只设置终点，all表示起点和终点都设置
   */
  setSelectionAfter(node, type = "all") {
    if (node) {
      const selectionNode = this.getLastSelectionNodeInChildren(node);
      if (selectionNode) {
        if (type == "start" || type == "all") {
          this.selection.start = {
            node: selectionNode,
            offset: selectionNode.isText() ? selectionNode.textContent.length : 1
          };
        }
        if (type == "end" || type == "all") {
          this.selection.end = {
            node: selectionNode,
            offset: selectionNode.isText() ? selectionNode.textContent.length : 1
          };
        }
      }
    } else {
      const lastNode = this.stackNodes[this.stackNodes.length - 1];
      let selectionNode = this.getLastSelectionNodeInChildren(lastNode);
      if (!selectionNode)
        selectionNode = this.getPreviousSelectionNode(lastNode);
      if (selectionNode) {
        if (type == "start" || type == "all") {
          this.selection.start = {
            node: selectionNode,
            offset: selectionNode.isText() ? selectionNode.textContent.length : 1
          };
        }
        if (type == "end" || type == "all") {
          this.selection.end = {
            node: selectionNode,
            offset: selectionNode.isText() ? selectionNode.textContent.length : 1
          };
        }
      }
    }
  }
  /**
   * 更新指定光标到离当前光标点最近的节点上，start表示只更新起点，end表示只更新终点，all表示起点和终点都更新
   */
  updateSelectionRecently(type = "all") {
    if (!this.selection.focused()) {
      return;
    }
    if (type == "start" || type == "all") {
      const previousNode = this.getPreviousSelectionNode(this.selection.start.node);
      const nextNode = this.getNextSelectionNode(this.selection.start.node);
      const blockNode = this.selection.start.node.getBlock();
      if (previousNode && blockNode.isContains(previousNode)) {
        this.selection.start.node = previousNode;
        this.selection.start.offset = previousNode.isText() ? previousNode.textContent.length : 1;
      } else if (nextNode && blockNode.isContains(nextNode)) {
        this.selection.start.node = nextNode;
        this.selection.start.offset = 0;
      } else if (previousNode) {
        this.selection.start.node = previousNode;
        this.selection.start.offset = previousNode.isText() ? previousNode.textContent.length : 1;
      } else if (nextNode) {
        this.selection.start.node = nextNode;
        this.selection.start.offset = 0;
      }
    }
    if (type == "end" || type == "all") {
      const previousNode = this.getPreviousSelectionNode(this.selection.end.node);
      const nextNode = this.getNextSelectionNode(this.selection.end.node);
      const blockNode = this.selection.end.node.getBlock();
      if (previousNode && blockNode.isContains(previousNode)) {
        this.selection.end.node = previousNode;
        this.selection.end.offset = previousNode.isText() ? previousNode.textContent.length : 1;
      } else if (nextNode && blockNode.isContains(nextNode)) {
        this.selection.end.node = nextNode;
        this.selection.end.offset = 0;
      } else if (previousNode) {
        this.selection.end.node = previousNode;
        this.selection.end.offset = previousNode.isText() ? previousNode.textContent.length : 1;
      } else if (nextNode) {
        this.selection.end.node = nextNode;
        this.selection.end.offset = 0;
      }
    }
  }
  /**
   * 判断光标是否在某个节点内，start表示只判断起点，end表示只判断终点，all表示起点和终点都判断
   */
  isSelectionInNode(node, type = "all") {
    if (!this.selection.focused()) {
      return false;
    }
    if (type == "start") {
      return node.isContains(this.selection.start.node);
    }
    if (type == "end") {
      return node.isContains(this.selection.end.node);
    }
    if (type == "all") {
      return node.isContains(this.selection.start.node) && node.isContains(this.selection.end.node);
    }
  }
  /**
   * 判断编辑器内的指定节点是否可以进行合并操作，parent表示和父节点进行合并，sibling表示和相邻节点进行合并，如果可以返回合并的对象节点
   */
  getAllowMergeNode(node, type) {
    if (node.isEmpty()) {
      return null;
    }
    if (!node.parent) {
      return null;
    }
    if (node.locked) {
      return null;
    }
    if (type == "prevSibling") {
      const previousNode = node.getPrevious(node.parent.children);
      if (!previousNode) {
        return null;
      }
      if (node.isText()) {
        if (previousNode.isText() && previousNode.isEqualMarks(node) && previousNode.isEqualStyles(node)) {
          return previousNode;
        }
        return null;
      }
      if (node.isInline()) {
        if (previousNode.isInline() && previousNode.tag == node.tag && previousNode.isEqualMarks(node) && previousNode.isEqualStyles(node)) {
          return previousNode;
        }
        return null;
      }
      return null;
    }
    if (type == "nextSibling") {
      const nextNode = node.getNext(node.parent.children);
      if (!nextNode) {
        return null;
      }
      if (node.isText()) {
        if (nextNode.isText() && nextNode.isEqualMarks(node) && nextNode.isEqualStyles(node)) {
          return nextNode;
        }
        return null;
      }
      if (node.isInline()) {
        if (nextNode.isInline() && nextNode.tag == node.tag && nextNode.isEqualMarks(node) && nextNode.isEqualStyles(node)) {
          return nextNode;
        }
        return null;
      }
      return null;
    }
    if (type == "parent") {
      if (node.parent.children.length > 1) {
        return null;
      }
      if (node.isText()) {
        if (node.parent.isInline() && node.parent.tag == this.textRenderTag) {
          return node.parent;
        }
        return null;
      }
      if (node.type == node.parent.type && node.tag == node.parent.tag) {
        return node.parent;
      }
      return null;
    }
    return null;
  }
  /**
   * 对编辑器内的某个节点执行合并操作，parent表示和父节点进行合并，sibling表示和相邻节点进行合并（可能会更新光标）
   */
  applyMergeNode(node, type) {
    const targetNode = this.getAllowMergeNode(node, type);
    if (!targetNode) {
      return;
    }
    if (type == "prevSibling") {
      if (node.isText()) {
        if (this.isSelectionInNode(targetNode, "start")) {
          this.selection.start.node = node;
        }
        if (this.isSelectionInNode(targetNode, "end")) {
          this.selection.end.node = node;
        }
        node.textContent = targetNode.textContent + node.textContent;
        const index = targetNode.parent.children.findIndex((item) => {
          return targetNode.isEqual(item);
        });
        targetNode.parent.children.splice(index, 1);
      } else if (node.isInline()) {
        node.children = [...targetNode.children, ...node.children].map((item) => {
          item.parent = node;
          return item;
        });
        const index = targetNode.parent.children.findIndex((item) => {
          return targetNode.isEqual(item);
        });
        targetNode.parent.children.splice(index, 1);
        if (node.hasChildren() && node.children.length > 1) {
          let index2 = 0;
          while (node.hasChildren() && index2 <= node.children.length - 2) {
            const newTargetNode = this.getAllowMergeNode(node.children[index2], "nextSibling");
            if (newTargetNode) {
              this.applyMergeNode(node.children[index2], "nextSibling");
              if (node.hasChildren() && node.children.length == 1) {
                this.applyMergeNode(node.children[0], "parent");
              }
              continue;
            }
            index2++;
          }
        }
      }
    }
    if (type == "nextSibling") {
      if (node.isText()) {
        if (this.isSelectionInNode(targetNode, "start")) {
          this.selection.start.node = node;
          this.selection.start.offset = node.textContent.length + this.selection.start.offset;
        }
        if (this.isSelectionInNode(targetNode, "end")) {
          this.selection.end.node = node;
          this.selection.end.offset = node.textContent.length + this.selection.end.offset;
        }
        node.textContent += targetNode.textContent;
        const index = targetNode.parent.children.findIndex((item) => {
          return targetNode.isEqual(item);
        });
        targetNode.parent.children.splice(index, 1);
      } else if (node.isInline()) {
        node.children = [...node.children, ...targetNode.children].map((item) => {
          item.parent = node;
          return item;
        });
        const index = targetNode.parent.children.findIndex((item) => {
          return targetNode.isEqual(item);
        });
        targetNode.parent.children.splice(index, 1);
        if (node.hasChildren() && node.children.length > 1) {
          let index2 = 0;
          while (node.hasChildren() && index2 <= node.children.length - 2) {
            const newTargetNode = this.getAllowMergeNode(node.children[index2], "nextSibling");
            if (newTargetNode) {
              this.applyMergeNode(node.children[index2], "nextSibling");
              if (node.hasChildren() && node.children.length == 1) {
                this.applyMergeNode(node.children[0], "parent");
              }
              continue;
            }
            index2++;
          }
        }
      }
    }
    if (type == "parent") {
      if (node.isText()) {
        targetNode.type = "text";
        targetNode.tag = void 0;
        if (node.hasMarks()) {
          if (targetNode.hasMarks()) {
            Object.assign(targetNode.marks, common.clone(node.marks));
          } else {
            targetNode.marks = common.clone(node.marks);
          }
        }
        if (node.hasStyles()) {
          if (targetNode.hasStyles()) {
            Object.assign(targetNode.styles, common.clone(node.styles));
          } else {
            targetNode.styles = common.clone(node.styles);
          }
        }
        targetNode.textContent = targetNode.textContent;
        targetNode.children = void 0;
        if (this.isSelectionInNode(node, "start")) {
          this.selection.start.node = targetNode;
        }
        if (this.isSelectionInNode(node, "end")) {
          this.selection.end.node = targetNode;
        }
      } else {
        if (node.hasMarks()) {
          if (targetNode.hasMarks()) {
            Object.assign(targetNode.marks, common.clone(node.marks));
          } else {
            targetNode.marks = common.clone(node.marks);
          }
        }
        if (node.hasStyles()) {
          if (targetNode.hasStyles()) {
            Object.assign(targetNode.styles, common.clone(node.styles));
          } else {
            targetNode.styles = common.clone(node.styles);
          }
        }
        if (node.hasChildren()) {
          targetNode.children = [...node.children];
          targetNode.children.forEach((item) => {
            item.parent = targetNode;
          });
        }
        if (targetNode.hasChildren() && targetNode.children.length == 1) {
          if (this.getAllowMergeNode(targetNode.children[0], "parent")) {
            this.applyMergeNode(targetNode.children[0], "parent");
            if (this.getAllowMergeNode(targetNode, "prevSibling")) {
              this.applyMergeNode(targetNode, "prevSibling");
            } else if (this.getAllowMergeNode(targetNode, "nextSibling")) {
              this.applyMergeNode(targetNode, "nextSibling");
            }
          }
        }
      }
    }
  }
  /**
   * 对编辑器内的某个节点使用指定规则进行格式化
   */
  formatNode(node, rule, receiver) {
    const index = receiver.findIndex((item) => item.isEqual(node));
    if (index < 0) {
      return;
    }
    if (node.isEmpty()) {
      if (this.isSelectionInNode(node, "start")) {
        this.updateSelectionRecently("start");
      }
      if (this.isSelectionInNode(node, "end")) {
        this.updateSelectionRecently("end");
      }
      receiver.splice(index, 1);
      return;
    }
    rule({ editor: this, node });
    if (node.isEmpty()) {
      if (this.isSelectionInNode(node, "start")) {
        this.updateSelectionRecently("start");
      }
      if (this.isSelectionInNode(node, "end")) {
        this.updateSelectionRecently("end");
      }
      const findIndex = receiver.findIndex((item) => item.isEqual(node));
      receiver.splice(findIndex, 1);
      return;
    }
    if (!node.isBlock() && receiver === this.stackNodes) {
      this.convertToBlock(node);
    }
    if (node.hasChildren()) {
      node.children.forEach((child) => {
        this.formatNode(child, rule, node.children);
      });
    }
    if (node.isEmpty()) {
      if (this.isSelectionInNode(node, "start")) {
        this.updateSelectionRecently("start");
      }
      if (this.isSelectionInNode(node, "end")) {
        this.updateSelectionRecently("end");
      }
      const findIndex = receiver.findIndex((item) => item.isEqual(node));
      receiver.splice(findIndex, 1);
    }
  }
  /**
   * 获取光标选区内的节点
   */
  getSelectedNodes() {
    if (!this.selection.focused() || this.selection.collapsed()) {
      return [];
    }
    const startNode = this.selection.start.node;
    const endNode = this.selection.end.node;
    const startOffset = this.selection.start.offset;
    const endOffset = this.selection.end.offset;
    if (startNode.isEqual(endNode)) {
      if (startNode.isClosed()) {
        return [
          {
            node: startNode,
            offset: false
          }
        ];
      }
      return [
        {
          node: startNode,
          offset: startOffset == 0 && endOffset == startNode.textContent.length ? false : [startOffset, endOffset]
        }
      ];
    }
    const result = [];
    let node = startNode;
    while (true) {
      if (node.isEqual(startNode)) {
        if (startOffset == 0) {
          result.push({
            node,
            offset: false
          });
        } else if (node.isText() && startOffset < node.textContent.length) {
          result.push({
            node,
            offset: [startOffset, node.textContent.length]
          });
        }
      } else if (node.isEqual(endNode)) {
        if (endOffset == (node.isText() ? node.textContent.length : 1)) {
          result.push({
            node,
            offset: false
          });
        } else if (node.isText() && endOffset > 0) {
          result.push({
            node,
            offset: [0, endOffset]
          });
        }
        break;
      } else {
        if (node.isContains(endNode)) {
          const lastSelectionNode = this.getLastSelectionNodeInChildren(node);
          if (endNode.isEqual(lastSelectionNode) && endOffset == (endNode.isText() ? endNode.textContent.length : 1)) {
            result.push({
              node,
              offset: false
            });
            break;
          }
          node = node.children[0];
          continue;
        }
        result.push({
          node,
          offset: false
        });
      }
      let tempNode = node;
      let nextNode = null;
      while (true) {
        nextNode = tempNode.getNext(tempNode.parent ? tempNode.parent.children : this.stackNodes);
        if (nextNode || !tempNode.parent) {
          break;
        }
        tempNode = tempNode.parent;
      }
      if (nextNode) {
        node = nextNode;
        continue;
      }
      break;
    }
    return result;
  }
  /**
   * 清空固定块节点的内容
   */
  emptyFixedBlock(node) {
    if (!node.isBlock()) {
      return;
    }
    if (node.hasChildren()) {
      node.children.forEach((item) => {
        if (item.isBlock() && item.fixed) {
          this.emptyFixedBlock(item);
        } else {
          item.toEmpty();
          if (item.parent.isEmpty()) {
            const placeholderNode = KNode.createPlaceholder();
            this.addNode(placeholderNode, item.parent);
          }
        }
      });
    }
  }
  /**
   * 向选区插入文本
   */
  insertText(text) {
    if (!text) {
      return;
    }
    if (!this.selection.focused()) {
      return;
    }
    text = text.replace(/\r\n/g, "\n");
    if (this.selection.collapsed()) {
      const node = this.selection.start.node;
      const offset = this.selection.start.offset;
      if (!node.isInCodeBlockStyle()) {
        text = text.replace(/\s/g, () => {
          const span = document.createElement("span");
          span.innerHTML = "&nbsp;";
          return span.innerText;
        });
      }
      if (node.isText()) {
        node.textContent = node.textContent.substring(0, offset) + text + node.textContent.substring(offset);
        this.selection.start.offset = this.selection.end.offset = this.selection.start.offset + text.length;
      } else {
        const textNode = KNode.create({
          type: "text",
          textContent: text
        });
        offset == 0 ? this.addNodeBefore(textNode, node) : this.addNodeAfter(textNode, node);
        this.setSelectionAfter(textNode);
      }
    } else {
      this.delete();
      this.insertText(text);
    }
  }
  /**
   * 向选区进行换行
   */
  insertParagraph() {
    if (!this.selection.focused()) {
      return;
    }
    if (this.selection.collapsed()) {
      const node = this.selection.start.node;
      const offset = this.selection.start.offset;
      const blockNode = node.getBlock();
      const firstSelectionNode = this.getFirstSelectionNodeInChildren(blockNode);
      const lastSelectionNode = this.getLastSelectionNodeInChildren(blockNode);
      if (node.isInCodeBlockStyle()) {
        this.insertText("\n");
        const zeroWidthText = KNode.createZeroWidthText();
        this.insertNode(zeroWidthText);
        this.setSelectionAfter(zeroWidthText, "all");
        if (typeof this.onInsertParagraph == "function") {
          this.onInsertParagraph.apply(this, [blockNode, blockNode]);
        }
      } else if (!blockNode.fixed) {
        if (firstSelectionNode.isEqual(node) && offset == 0) {
          const newBlockNode = blockNode.clone(false);
          const placeholderNode = KNode.createPlaceholder();
          this.addNode(placeholderNode, newBlockNode);
          this.addNodeBefore(newBlockNode, blockNode);
          if (typeof this.onInsertParagraph == "function") {
            this.onInsertParagraph.apply(this, [blockNode, newBlockNode]);
          }
        } else if (lastSelectionNode.isEqual(node) && offset == (node.isText() ? node.textContent.length : 1)) {
          const newBlockNode = blockNode.clone(false);
          const placeholderNode = KNode.createPlaceholder();
          this.addNode(placeholderNode, newBlockNode);
          this.addNodeAfter(newBlockNode, blockNode);
          this.setSelectionBefore(placeholderNode);
          if (typeof this.onInsertParagraph == "function") {
            this.onInsertParagraph.apply(this, [newBlockNode, blockNode]);
          }
        } else {
          const newBlockNode = blockNode.clone(true);
          this.addNodeAfter(newBlockNode, blockNode);
          const index = KNode.flat(blockNode.children).findIndex((item) => {
            return this.selection.start.node.isEqual(item);
          });
          const offset2 = this.selection.start.offset;
          this.setSelectionAfter(lastSelectionNode, "end");
          this.delete();
          this.setSelectionBefore(newBlockNode, "start");
          this.selection.end.node = KNode.flat(newBlockNode.children)[index];
          this.selection.end.offset = offset2;
          this.delete();
          if (typeof this.onInsertParagraph == "function") {
            this.onInsertParagraph.apply(this, [newBlockNode, blockNode]);
          }
        }
      }
    } else {
      this.delete();
      this.insertParagraph();
    }
  }
  /**
   * 向选区插入节点，cover为true表示当向某个只有占位符的非固定块节点被插入另一个非固定块节点时是否覆盖此节点，而不是直接插入进去
   */
  insertNode(node, cover = false) {
    if (!this.selection.focused()) {
      return;
    }
    if (node.isEmpty()) {
      return;
    }
    if (this.selection.collapsed()) {
      const selectionNode = this.selection.start.node;
      const offset = this.selection.start.offset;
      const blockNode = selectionNode.getBlock();
      const firstSelectionNode = this.getFirstSelectionNodeInChildren(blockNode);
      const lastSelectionNode = this.getLastSelectionNodeInChildren(blockNode);
      if (!blockNode.fixed && node.isBlock() && !node.fixed) {
        if (blockNode.allIsPlaceholder() && cover) {
          this.addNodeBefore(node, blockNode);
          blockNode.toEmpty();
        } else if (firstSelectionNode.isEqual(selectionNode) && offset == 0) {
          this.addNodeBefore(node, blockNode);
        } else if (lastSelectionNode.isEqual(selectionNode) && offset == (selectionNode.isText() ? selectionNode.textContent.length : 1)) {
          this.addNodeAfter(node, blockNode);
        } else {
          this.insertParagraph();
          const newBlockNode = this.selection.start.node.getBlock();
          this.addNodeBefore(node, newBlockNode);
        }
      } else {
        if (offset == 0) {
          this.addNodeBefore(node, selectionNode);
        } else if (offset == (selectionNode.isText() ? selectionNode.textContent.length : 1)) {
          this.addNodeAfter(node, selectionNode);
        } else {
          const val = selectionNode.textContent;
          const newTextNode = selectionNode.clone();
          selectionNode.textContent = val.substring(0, offset);
          newTextNode.textContent = val.substring(offset);
          this.addNodeAfter(newTextNode, selectionNode);
          this.addNodeBefore(node, newTextNode);
        }
      }
      this.setSelectionAfter(node, "all");
    } else {
      this.delete();
      this.insertNode(node, cover);
    }
  }
  /**
   * 对选区进行删除
   */
  delete() {
    if (!this.selection.focused()) {
      return;
    }
    if (this.selection.collapsed()) {
      const node = this.selection.start.node;
      const offset = this.selection.start.offset;
      const previousSelectionNode = this.getPreviousSelectionNode(node);
      const blockNode = node.getBlock();
      if (offset == 0) {
        if (previousSelectionNode) {
          const previousBlock = previousSelectionNode.getBlock();
          if (previousBlock.isEqual(blockNode)) {
            this.setSelectionAfter(previousSelectionNode, "all");
            this.delete();
            return;
          } else if (!blockNode.fixed) {
            this.mergeBlock(previousBlock, blockNode);
          }
        } else if (typeof this.onDeleteInStart == "function") {
          this.onDeleteInStart.apply(this, [blockNode]);
        }
      } else {
        if (node.isZeroWidthText()) {
          node.toEmpty();
          if (blockNode.isEmpty()) {
            const placeholderNode = KNode.createPlaceholder();
            this.addNode(placeholderNode, blockNode);
            this.setSelectionBefore(placeholderNode);
          } else {
            this.setSelectionAfter(previousSelectionNode, "all");
          }
          this.delete();
          return;
        } else if (node.isText()) {
          const deleteChart = node.textContent.substring(offset - 1, offset);
          node.textContent = node.textContent.substring(0, offset - 1) + node.textContent.substring(offset);
          this.selection.start.offset = offset - 1;
          this.selection.end.offset = offset - 1;
          if (isZeroWidthText(deleteChart)) {
            this.delete();
            return;
          }
          if (blockNode.isEmpty()) {
            const placeholderNode = KNode.createPlaceholder();
            this.addNode(placeholderNode, blockNode);
            this.setSelectionBefore(placeholderNode);
          }
        } else if (node.isClosed()) {
          const isPlaceholder = node.isPlaceholder();
          node.toEmpty();
          if (blockNode.isEmpty()) {
            if (isPlaceholder) {
              if (blockNode.fixed) {
                const placeholderNode = KNode.createPlaceholder();
                this.addNode(placeholderNode, blockNode);
                this.setSelectionBefore(placeholderNode);
              } else if (!blockNode.fixed && !previousSelectionNode) {
                const placeholderNode = KNode.createPlaceholder();
                this.addNode(placeholderNode, blockNode);
                this.setSelectionBefore(placeholderNode);
                if (typeof this.onDeleteInStart == "function") {
                  this.onDeleteInStart.apply(this, [blockNode]);
                }
              }
            } else {
              const placeholderNode = KNode.createPlaceholder();
              this.addNode(placeholderNode, blockNode);
              this.setSelectionBefore(placeholderNode);
            }
          }
        }
      }
    } else {
      const result = this.getSelectedNodes().filter((item) => {
        return !this.voidRenderTags.includes(item.node.tag);
      });
      const startBlockNode = this.selection.start.node.getBlock();
      const endBlockNode = this.selection.end.node.getBlock();
      result.forEach((item) => {
        const { node, offset } = item;
        if (offset) {
          node.textContent = node.textContent.substring(0, offset[0]) + node.textContent.substring(offset[1]);
        } else {
          if (node.isBlock() && node.fixed) {
            this.emptyFixedBlock(node);
          } else {
            node.toEmpty();
          }
        }
      });
      if (startBlockNode.isEqual(endBlockNode)) {
        if (startBlockNode.isEmpty()) {
          const placeholder = KNode.createPlaceholder();
          this.addNode(placeholder, startBlockNode);
          this.setSelectionBefore(placeholder);
        }
      } else {
        if (startBlockNode.isEmpty()) {
          const placeholder = KNode.createPlaceholder();
          this.addNode(placeholder, startBlockNode);
          this.setSelectionBefore(placeholder, "start");
        }
        if (endBlockNode.isEmpty()) {
          const placeholder = KNode.createPlaceholder();
          this.addNode(placeholder, endBlockNode);
          this.setSelectionBefore(placeholder, "end");
        }
        if (!endBlockNode.fixed) {
          this.mergeBlock(startBlockNode, endBlockNode);
        }
      }
    }
    if (this.selection.start.node.isEmpty()) {
      this.updateSelectionRecently("start");
    }
    this.selection.end.node = this.selection.start.node;
    this.selection.end.offset = this.selection.start.offset;
    if (typeof this.onDeleteComplete == "function") {
      this.onDeleteComplete.apply(this);
    }
  }
  /**
   * 更新编辑器视图
   */
  async updateView(unPushHistory = false) {
    if (!this.$el) {
      return;
    }
    patchNodes$1(this.stackNodes, this.oldStackNodes).forEach((item) => {
      let node = null;
      if (item.newNode) {
        node = item.newNode.parent ? item.newNode.parent : item.newNode;
      } else if (item.oldNode && item.oldNode.parent) {
        const parentNode = KNode.searchByKey(item.oldNode.parent.key, this.stackNodes);
        node = parentNode ? parentNode : null;
      }
      if (node) {
        this.formatRules.forEach((rule) => {
          this.formatNode(node, rule, node.parent ? node.parent.children : this.stackNodes);
        });
      }
    });
    this.checkNodes();
    const oldHtml = this.$el.innerHTML;
    const useDefault = typeof this.onUpdateView == "function" ? await this.onUpdateView.apply(this, [false]) : true;
    if (useDefault) {
      defaultUpdateViewFunction.apply(this, [false]);
    }
    const newHtml = this.$el.innerHTML;
    if (oldHtml != newHtml) {
      if (typeof this.onChange == "function") {
        this.onChange.apply(this, [newHtml, oldHtml]);
      }
      if (!unPushHistory) {
        this.history.setState(this.stackNodes, this.selection);
      }
    }
    this.oldStackNodes = this.stackNodes.map((item) => item.fullClone());
    await this.updateRealSelection();
  }
  /**
   * 根据selection更新编辑器真实光标
   */
  async updateRealSelection() {
    const realSelection = window.getSelection();
    if (!realSelection) {
      return;
    }
    if (this.selection.focused()) {
      this.internalCauseSelectionChange = true;
      const range = document.createRange();
      const startDom = this.findDom(this.selection.start.node);
      const endDom = this.findDom(this.selection.end.node);
      if (this.selection.start.node.isText()) {
        range.setStart(startDom.childNodes[0], this.selection.start.offset);
      } else if (this.selection.start.node.isClosed()) {
        const index = this.selection.start.node.parent.children.findIndex((item) => this.selection.start.node.isEqual(item));
        range.setStart(startDom.parentNode, this.selection.start.offset + index);
      }
      if (this.selection.end.node.isText()) {
        range.setEnd(endDom.childNodes[0], this.selection.end.offset);
      } else if (this.selection.end.node.isClosed()) {
        const index = this.selection.end.node.parent.children.findIndex((item) => this.selection.end.node.isEqual(item));
        range.setEnd(endDom.parentNode, this.selection.end.offset + index);
      }
      realSelection.removeAllRanges();
      realSelection.addRange(range);
    } else {
      realSelection.removeAllRanges();
    }
    await delay();
    this.internalCauseSelectionChange = false;
    this.scrollViewToSelection();
    this.history.updateSelection(this.selection);
    if (typeof this.onSelectionUpdate == "function") {
      this.onSelectionUpdate.apply(this, [this.selection]);
    }
  }
  /**
   * 根据真实光标更新selection，返回布尔值表示是否更新成功
   */
  updateSelection() {
    if (!this.$el) {
      return false;
    }
    const realSelection = window.getSelection();
    if (realSelection && realSelection.rangeCount) {
      const range = realSelection.getRangeAt(0);
      if (isContains(this.$el, range.startContainer) && isContains(this.$el, range.endContainer)) {
        if (range.startContainer.nodeType == 3) {
          this.selection.start = {
            node: this.findNode(range.startContainer.parentNode),
            offset: range.startOffset
          };
        } else if (range.startContainer.nodeType == 1) {
          const childDoms = Array.from(range.startContainer.childNodes);
          if (childDoms.length) {
            const dom = childDoms[range.startOffset] ? childDoms[range.startOffset] : childDoms[range.startOffset - 1];
            if (dom.nodeType == 1) {
              if (childDoms[range.startOffset]) {
                this.setSelectionBefore(this.findNode(dom), "start");
              } else {
                this.setSelectionAfter(this.findNode(dom), "start");
              }
            } else if (dom.nodeType == 3) {
              this.selection.start = {
                node: this.findNode(dom.parentNode),
                offset: childDoms[range.startOffset] ? 0 : dom.textContent.length
              };
            }
          } else {
            this.selection.start = {
              node: this.findNode(range.startContainer),
              offset: 0
            };
          }
        }
        if (range.endContainer.nodeType == 3) {
          this.selection.end = {
            node: this.findNode(range.endContainer.parentNode),
            offset: range.endOffset
          };
        } else if (range.endContainer.nodeType == 1) {
          const childDoms = Array.from(range.endContainer.childNodes);
          if (childDoms.length) {
            const dom = childDoms[range.endOffset] ? childDoms[range.endOffset] : childDoms[range.endOffset - 1];
            if (dom.nodeType == 1) {
              if (childDoms[range.endOffset]) {
                this.setSelectionBefore(this.findNode(dom), "end");
              } else {
                this.setSelectionAfter(this.findNode(dom), "end");
              }
            } else if (dom.nodeType == 3) {
              this.selection.end = {
                node: this.findNode(dom.parentNode),
                offset: childDoms[range.endOffset] ? 0 : dom.textContent.length
              };
            }
          } else {
            this.selection.end = {
              node: this.findNode(range.endContainer),
              offset: 1
            };
          }
        }
        return true;
      }
    }
    return false;
  }
  /**
   * 如果编辑器内有滚动条，滚动编辑器到光标可视范围
   */
  scrollViewToSelection() {
    if (this.selection.focused()) {
      const focusDom = this.findDom(this.selection.end.node);
      const scrollFunction = async (scrollEl) => {
        const scrollHeight = element.getScrollHeight(scrollEl);
        const scrollWidth = element.getScrollWidth(scrollEl);
        if (scrollEl.clientHeight < scrollHeight || scrollEl.clientWidth < scrollWidth) {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);
          const rects = range.getClientRects();
          let target = range;
          if (rects.length == 0) {
            target = focusDom;
          }
          const childRect = target.getBoundingClientRect();
          const parentRect = scrollEl.getBoundingClientRect();
          if (scrollEl.clientHeight < scrollHeight) {
            if (childRect.top < parentRect.top) {
              await element.setScrollTop({
                el: scrollEl,
                number: 0
              });
              const tempChildRect = target.getBoundingClientRect();
              const tempParentRect = scrollEl.getBoundingClientRect();
              element.setScrollTop({
                el: scrollEl,
                number: tempChildRect.top - tempParentRect.top
              });
            } else if (childRect.bottom > parentRect.bottom) {
              await element.setScrollTop({
                el: scrollEl,
                number: 0
              });
              const tempChildRect = target.getBoundingClientRect();
              const tempParentRect = scrollEl.getBoundingClientRect();
              element.setScrollTop({
                el: scrollEl,
                number: tempChildRect.bottom - tempParentRect.bottom
              });
            }
          }
          if (scrollEl.clientWidth < scrollWidth) {
            if (childRect.left < parentRect.left) {
              await element.setScrollLeft({
                el: scrollEl,
                number: 0
              });
              const tempChildRect = target.getBoundingClientRect();
              const tempParentRect = scrollEl.getBoundingClientRect();
              element.setScrollLeft({
                el: scrollEl,
                number: tempChildRect.left - tempParentRect.left + 20
              });
            } else if (childRect.right > parentRect.right) {
              await element.setScrollLeft({
                el: scrollEl,
                number: 0
              });
              const tempChildRect = target.getBoundingClientRect();
              const tempParentRect = scrollEl.getBoundingClientRect();
              element.setScrollLeft({
                el: scrollEl,
                number: tempChildRect.right - tempParentRect.right + 20
              });
            }
          }
        }
      };
      let dom = focusDom;
      while (element.isElement(dom) && dom != document.documentElement) {
        scrollFunction(dom);
        dom = dom.parentNode;
      }
    }
  }
  /**
   * 撤销
   */
  undo() {
    const record = this.history.setUndo();
    if (record) {
      this.stackNodes = record.nodes;
      this.selection = record.selection;
      this.updateView(true);
    }
  }
  /**
   * 重做
   */
  redo() {
    const record = this.history.setRedo();
    if (record) {
      this.stackNodes = record.nodes;
      this.selection = record.selection;
      this.updateView(true);
    }
  }
  /**
   * 销毁编辑器的方法
   */
  destroy() {
    this.setEditable(false);
    event.off(document, `selectionchange.kaitify_${this.guid}`);
    event.off(this.$el, "beforeinput.kaitify compositionstart.kaitify compositionupdate.kaitify compositionend.kaitify keydown.kaitify keyup.kaitify copy.kaitify focus.kaitify blur.kaitify");
  }
  /**
   * 配置编辑器，返回创建的编辑器
   */
  static async configure(options) {
    const editor = new Editor();
    editor.$el = initEditorDom(options.el);
    if (typeof options.allowCopy == "boolean")
      editor.allowCopy = options.allowCopy;
    if (typeof options.allowCut == "boolean")
      editor.allowCut = options.allowCut;
    if (typeof options.allowPaste == "boolean")
      editor.allowPaste = options.allowPaste;
    if (typeof options.allowPasteHtml == "boolean")
      editor.allowPasteHtml = options.allowPasteHtml;
    if (options.textRenderTag)
      editor.textRenderTag = options.textRenderTag;
    if (options.blockRenderTag)
      editor.blockRenderTag = options.blockRenderTag;
    if (options.voidRenderTags)
      editor.voidRenderTags = options.voidRenderTags;
    if (options.emptyRenderTags)
      editor.emptyRenderTags = options.emptyRenderTags;
    if (options.extraKeepTags)
      editor.extraKeepTags = options.extraKeepTags;
    if (options.formatRules)
      editor.formatRules = [...editor.formatRules, ...options.formatRules];
    if (options.domParseNodeCallback)
      editor.domParseNodeCallback = options.domParseNodeCallback;
    if (options.onMergeBlockNode)
      editor.onMergeBlockNode = options.onMergeBlockNode;
    if (options.onUpdateView)
      editor.onUpdateView = options.onUpdateView;
    if (options.onPasteText)
      editor.onPasteText = options.onPasteText;
    if (options.onPasteHtml)
      editor.onPasteHtml = options.onPasteHtml;
    if (options.onPasteImage)
      editor.onPasteImage = options.onPasteImage;
    if (options.onPasteVideo)
      editor.onPasteVideo = options.onPasteVideo;
    if (options.onPasteFile)
      editor.onPasteFile = options.onPasteFile;
    if (options.onChange)
      editor.onChange = options.onChange;
    if (options.onSelectionUpdate)
      editor.onSelectionUpdate = options.onSelectionUpdate;
    if (options.onInsertParagraph)
      editor.onInsertParagraph = options.onInsertParagraph;
    if (options.onDeleteInStart)
      editor.onDeleteInStart = options.onDeleteInStart;
    if (options.onDeleteComplete)
      editor.onDeleteComplete = options.onDeleteComplete;
    if (options.onKeydown)
      editor.onKeydown = options.onKeydown;
    if (options.onKeyup)
      editor.onKeyup = options.onKeyup;
    if (options.onFocus)
      editor.onFocus = options.onFocus;
    if (options.onBlur)
      editor.onBlur = options.onBlur;
    editor.setEditable(typeof options.editable == "boolean" ? options.editable : true);
    editor.stackNodes = editor.htmlParseNode(options.value || "");
    editor.stackNodes.forEach((node) => {
      editor.formatRules.forEach((rule) => {
        editor.formatNode(node, rule, editor.stackNodes);
      });
    });
    editor.checkNodes();
    const useDefault = typeof editor.onUpdateView == "function" ? await editor.onUpdateView.apply(editor, [true]) : true;
    if (useDefault) {
      defaultUpdateViewFunction.apply(editor, [true]);
    }
    editor.history.setState(editor.stackNodes, editor.selection);
    editor.oldStackNodes = editor.stackNodes.map((item) => item.fullClone());
    if (options.autofocus) {
      editor.setSelectionAfter();
      await editor.updateRealSelection();
    }
    setDomObserve(editor);
    event.on(document, `selectionchange.kaitify_${editor.guid}`, onSelectionChange.bind(editor));
    event.on(editor.$el, "beforeinput.kaitify", onBeforeInput.bind(editor));
    event.on(editor.$el, "compositionstart.kaitify compositionupdate.kaitify compositionend.kaitify", onComposition.bind(editor));
    event.on(editor.$el, "keydown.kaitify keyup.kaitify", onKeyboard.bind(editor));
    event.on(editor.$el, "focus.kaitify", onFocus.bind(editor));
    event.on(editor.$el, "blur.kaitify", onBlur.bind(editor));
    event.on(editor.$el, "copy.kaitify", onCopy.bind(editor));
    if (options.onCreated)
      options.onCreated.apply(editor);
    return editor;
  }
}
export {
  Editor,
  History,
  KNode,
  NODE_MARK,
  Selection,
  getNodeRenderOptions
};
