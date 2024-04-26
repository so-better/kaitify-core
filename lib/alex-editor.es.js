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
   * @param {Object} str
   */
  string2dom(str, parentTag) {
    if (!str || typeof str != "string") {
      throw new TypeError("The argument must be an HTML string");
    }
    let parentEle = document.createElement(parentTag || "div");
    parentEle.innerHTML = str;
    if (parentEle.children.length == 1) {
      return parentEle.children[0];
    } else {
      return Array.from(parentEle.children);
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
const getAttributes = function(node) {
  let o = {};
  const length = node.attributes.length;
  for (let i = 0; i < length; i++) {
    const attribute = node.attributes[i];
    if (!/(^on)|(^style$)|(^face$)/g.test(attribute.nodeName)) {
      o[attribute.nodeName] = attribute.nodeValue;
    }
  }
  return o;
};
const getStyles = function(node) {
  let o = {};
  const styles = node.getAttribute("style");
  if (styles) {
    let i = 0;
    let start = 0;
    let splitStyles = [];
    while (i < styles.length) {
      if (styles[i] == ";" && styles.substring(i + 1, i + 8) != "base64,") {
        splitStyles.push(styles.substring(start, i));
        start = i + 1;
      }
      if (i == styles.length - 1 && start < i) {
        splitStyles.push(styles.substring(start, i));
      }
      i++;
    }
    splitStyles.forEach((style) => {
      const index = style.indexOf(":");
      const property = style.substring(0, index).trim();
      const value = style.substring(index + 1).trim();
      o[property] = value;
    });
  }
  return o;
};
const createUniqueKey = function() {
  let key = data.get(window, "data-alex-editor-key") || 0;
  key++;
  data.set(window, "data-alex-editor-key", key);
  return key;
};
const createGuid = function() {
  let key = data.get(window, "data-alex-editor-guid") || 0;
  key++;
  data.set(window, "data-alex-editor-guid", key);
  return key;
};
const isSpaceText = function(val) {
  return /^[\uFEFF]+$/g.test(val);
};
const cloneData = function(data2) {
  if (common.isObject(data2) || Array.isArray(data2)) {
    return JSON.parse(JSON.stringify(data2));
  }
  return data2;
};
const isContains = function(parentNode, childNode) {
  if (childNode.nodeType == 3) {
    return element.isContains(parentNode, childNode.parentNode);
  }
  return element.isContains(parentNode, childNode);
};
const canUseClipboard = function() {
  if (!window.ClipboardItem) {
    console.warn("window.ClipboardItem must be obtained in a secure environment, such as localhost, 127.0.0.1, or https, so the editor's copy, paste, and cut functions cannot be used");
    return false;
  }
  if (!navigator.clipboard) {
    console.warn("navigator.clipboard must be obtained in a secure environment, such as localhost, 127.0.0.1, or https, so the editor's copy, paste, and cut functions cannot be used");
    return false;
  }
  return true;
};
const initEditorNode = function(node) {
  if (typeof node == "string" && node) {
    node = document.body.querySelector(node);
  }
  if (!element.isElement(node)) {
    throw new Error("You must specify a dom container to initialize the editor");
  }
  if (data.get(node, "data-alex-editor-init")) {
    throw new Error("The element node has been initialized to the editor");
  }
  data.set(node, "data-alex-editor-init", true);
  return node;
};
const initEditorOptions = function(options) {
  let opts = {
    disabled: false,
    renderRules: [],
    value: "",
    allowCopy: true,
    allowPaste: true,
    allowCut: true,
    allowPasteHtml: false,
    customTextPaste: null,
    customHtmlPaste: null,
    customImagePaste: null,
    customVideoPaste: null,
    customFilePaste: null,
    customMerge: null,
    customParseNode: null
  };
  if (common.isObject(options)) {
    if (typeof options.disabled == "boolean") {
      opts.disabled = options.disabled;
    }
    if (Array.isArray(options.renderRules)) {
      opts.renderRules = options.renderRules;
    }
    if (typeof options.value == "string" && options.value) {
      opts.value = options.value;
    }
    if (typeof options.allowCopy == "boolean") {
      opts.allowCopy = options.allowCopy;
    }
    if (typeof options.allowPaste == "boolean") {
      opts.allowPaste = options.allowPaste;
    }
    if (typeof options.allowCut == "boolean") {
      opts.allowCut = options.allowCut;
    }
    if (typeof options.allowPasteHtml == "boolean") {
      opts.allowPasteHtml = options.allowPasteHtml;
    }
    if (typeof options.customTextPaste == "function") {
      opts.customTextPaste = options.customTextPaste;
    }
    if (typeof options.customHtmlPaste == "function") {
      opts.customHtmlPaste = options.customHtmlPaste;
    }
    if (typeof options.customImagePaste == "function") {
      opts.customImagePaste = options.customImagePaste;
    }
    if (typeof options.customVideoPaste == "function") {
      opts.customVideoPaste = options.customVideoPaste;
    }
    if (typeof options.customFilePaste == "function") {
      opts.customFilePaste = options.customFilePaste;
    }
    if (typeof options.customMerge == "function") {
      opts.customMerge = options.customMerge;
    }
    if (typeof options.customParseNode == "function") {
      opts.customParseNode = options.customParseNode;
    }
  }
  return opts;
};
const getHighestByFirst = function(point) {
  let temp = point.element;
  while (temp.parent) {
    const isFirst = point.element.isFirst(temp.parent);
    if (!isFirst) {
      break;
    }
    temp = temp.parent;
  }
  return temp;
};
const _AlexElement = class _AlexElement {
  constructor(type, parsedom, marks, styles, textContent) {
    //key值
    __publicField(this, "key", createUniqueKey());
    //类型
    __publicField(this, "type");
    //真实节点名称
    __publicField(this, "parsedom");
    //标记集合
    __publicField(this, "marks");
    //样式集合
    __publicField(this, "styles");
    //文本值
    __publicField(this, "textContent");
    //子元素
    __publicField(this, "children", null);
    //父元素
    __publicField(this, "parent", null);
    //定义内部块元素的行为
    __publicField(this, "behavior", "default");
    //真实node
    __publicField(this, "elm", null);
    this.type = type;
    this.parsedom = parsedom;
    this.marks = marks;
    this.styles = styles;
    this.textContent = textContent;
  }
  /**
   * 是否根级块元素
   */
  isBlock() {
    return this.type == "block";
  }
  /**
   * 是否内部块元素
   */
  isInblock() {
    return this.type == "inblock";
  }
  /**
   * 是否行内元素
   */
  isInline() {
    return this.type == "inline";
  }
  /**
   * 是否自闭合元素
   */
  isClosed() {
    return this.type == "closed";
  }
  /**
   * 是否文本元素
   */
  isText() {
    return this.type == "text";
  }
  /**
   * 是否换行符
   */
  isBreak() {
    return this.isClosed() && this.parsedom == "br";
  }
  /**
   * 是否空元素
   */
  isEmpty() {
    if (this.isText()) {
      return !this.textContent;
    }
    if (this.isBlock() || this.isInblock() || this.isInline()) {
      if (!this.hasChildren()) {
        return true;
      }
      const allEmpty = this.children.every((el) => {
        return el.isEmpty();
      });
      return allEmpty;
    }
    return false;
  }
  /**
   * 是否零宽度无断空白元素
   */
  isSpaceText() {
    return this.isText() && !this.isEmpty() && isSpaceText(this.textContent);
  }
  /**
   * 获取设置不可编辑的元素，如果是null，说明元素是可编辑的
   */
  getUneditableElement() {
    if (this.hasMarks() && this.marks["contenteditable"] == "false") {
      return this;
    }
    if (this.isBlock()) {
      return null;
    }
    return this.parent.getUneditableElement();
  }
  /**
   * 比较当前元素和另一个元素是否相等
   */
  isEqual(element2) {
    if (!_AlexElement.isElement(element2)) {
      return false;
    }
    return this.key == element2.key;
  }
  /**
   * 判断当前元素是否包含另一个元素
   */
  isContains(element2) {
    if (this.isEqual(element2)) {
      return true;
    }
    if (element2.isBlock()) {
      return false;
    }
    return this.isContains(element2.parent);
  }
  /**
   * 判断当前元素的子元素数组是否只包含换行符
   */
  isOnlyHasBreak() {
    if (this.hasChildren()) {
      const hasBreak = this.children.some((item) => {
        return item.isBreak();
      });
      const isAll = this.children.every((item) => {
        return item.isBreak() || item.isEmpty();
      });
      return hasBreak && isAll;
    }
    return false;
  }
  /**
   * 判断当前元素是否在拥有代码块样式的块内（包括自身）
   */
  isPreStyle() {
    const block = this.getBlock();
    const inblock = this.getInblock();
    if (inblock) {
      if (inblock.parsedom == "pre") {
        return true;
      }
      if (inblock.hasStyles() && (inblock.styles["white-space"] == "pre" || inblock.styles["white-space"] == "pre-wrap")) {
        return true;
      }
      return inblock.parent.isPreStyle();
    } else {
      if (block.parsedom == "pre") {
        return true;
      }
      if (block.hasStyles() && (block.styles["white-space"] == "pre" || block.styles["white-space"] == "pre-wrap")) {
        return true;
      }
      return false;
    }
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
   * 是否有子元素
   */
  hasChildren() {
    if (this.isClosed() || this.isText()) {
      return false;
    }
    if (Array.isArray(this.children)) {
      return !!this.children.length;
    }
    return false;
  }
  /**
   * 判断当前元素与另一个元素是否有包含关系
   */
  hasContains(element2) {
    return this.isContains(element2) || element2.isContains(this);
  }
  /**
   * 克隆当前元素
   * deep为true表示深度克隆，即克隆子元素，否则只会克隆自身
   */
  clone(deep = true) {
    if (typeof deep != "boolean") {
      throw new Error("The parameter must be a Boolean");
    }
    let el = new _AlexElement(this.type, this.parsedom, cloneData(this.marks), cloneData(this.styles), this.textContent);
    el.behavior = this.behavior;
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
  /**
   * 将当前元素转换成根级块元素
   */
  convertToBlock() {
    if (this.isBlock()) {
      return;
    }
    let element2 = this.clone();
    this.type = "block";
    this.parsedom = _AlexElement.BLOCK_NODE;
    this.marks = null;
    this.styles = null;
    this.textContent = null;
    this.children = [element2];
    element2.parent = this;
  }
  /**
   * 设置为空元素
   */
  toEmpty() {
    if (this.isEmpty()) {
      return;
    }
    if (this.isText()) {
      this.marks = null;
      this.styles = null;
      this.textContent = null;
      this.elm = null;
      return;
    }
    if (this.isClosed()) {
      this.type = "text";
      this.parsedom = null;
      this.marks = null;
      this.styles = null;
      this.textContent = null;
      this.elm = null;
      return;
    }
    if (this.hasChildren()) {
      this.children.forEach((el) => {
        el.toEmpty();
      });
    }
  }
  /**
   * 获取所在根级块元素
   */
  getBlock() {
    if (this.isBlock()) {
      return this;
    }
    return this.parent.getBlock();
  }
  /**
   * 获取所在内部块元素
   */
  getInblock() {
    if (this.isInblock()) {
      return this;
    }
    if (this.isBlock()) {
      return null;
    }
    return this.parent.getInblock();
  }
  /**
   * 获取所在行内元素
   */
  getInline() {
    if (this.isInline()) {
      return this;
    }
    if (this.isBlock()) {
      return null;
    }
    return this.parent.getInline();
  }
  /**
   * 比较当前元素和另一个元素的styles是否一致
   */
  isEqualStyles(element2) {
    if (!this.hasStyles() && !element2.hasStyles()) {
      return true;
    }
    if (this.hasStyles() && element2.hasStyles() && common.equal(this.styles, element2.styles)) {
      return true;
    }
    return false;
  }
  /**
   * 比较当前元素和另一个元素的marks是否一致
   */
  isEqualMarks(element2) {
    if (!this.hasMarks() && !element2.hasMarks()) {
      return true;
    }
    if (this.hasMarks() && element2.hasMarks() && common.equal(this.marks, element2.marks)) {
      return true;
    }
    return false;
  }
  /**
   * 如果当前元素是文本元素或者自闭合元素，判断它是不是指定元素的后代所有文本元素和自闭合元素中的第一个
   */
  isFirst(element2) {
    if (!this.isText() && !this.isClosed()) {
      return false;
    }
    if (element2.isEqual(this)) {
      return false;
    }
    if (element2.isContains(this)) {
      const elements = _AlexElement.flatElements(element2.children).filter((el) => {
        return el.isText() || el.isClosed();
      });
      return this.isEqual(elements[0]);
    }
    return false;
  }
  /**
   * 如果当前元素是文本元素或者自闭合元素，判断它是不是指定元素的后代所有文本元素和自闭合元素中的最后一个
   */
  isLast(element2) {
    if (!this.isText() && !this.isClosed()) {
      return false;
    }
    if (element2.isEqual(this)) {
      return false;
    }
    if (element2.isContains(this)) {
      const elements = _AlexElement.flatElements(element2.children).filter((el) => {
        return el.isText() || el.isClosed();
      });
      const length = elements.length;
      return this.isEqual(elements[length - 1]);
    }
    return false;
  }
  /**
   * 将元素渲染成真实的node并挂载在元素的elm属性上
   */
  __render() {
    let el = null;
    if (this.isText()) {
      el = document.createElement(_AlexElement.TEXT_NODE);
      const text = document.createTextNode(this.textContent);
      el.appendChild(text);
    } else {
      el = document.createElement(this.parsedom);
      if (this.hasChildren()) {
        this.children.forEach((child) => {
          child.__render();
          el.appendChild(child.elm);
        });
      }
    }
    if (this.hasMarks()) {
      Object.keys(this.marks).forEach((key) => {
        if (!/(^on)|(^style$)|(^face$)/g.test(key)) {
          el.setAttribute(key, this.marks[key]);
        }
      });
    }
    if (this.hasStyles()) {
      Object.keys(this.styles).forEach((key) => {
        el.style.setProperty(key, this.styles[key]);
      });
    }
    data.set(el, "data-alex-editor-key", this.key);
    this.elm = el;
  }
  /**
   * 完全复制元素，包括key也复制
   */
  __fullClone() {
    let el = new _AlexElement(this.type, this.parsedom, cloneData(this.marks), cloneData(this.styles), this.textContent);
    el.behavior = this.behavior;
    el.key = this.key;
    el.elm = this.elm;
    if (this.hasChildren()) {
      this.children.forEach((child) => {
        let clonedChild = child.__fullClone();
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
  /**
   * 判断参数是否为AlexElement元素
   */
  static isElement(val) {
    return val instanceof _AlexElement;
  }
  /**
   * 扁平化处理元素数组
   */
  static flatElements(elements) {
    const fn = (arr) => {
      let result = [];
      const length = arr.length;
      for (let i = 0; i < length; i++) {
        if (arr[i]) {
          result.push(arr[i]);
          if (arr[i].hasChildren()) {
            const childResult = fn(arr[i].children);
            result.push(...childResult);
          }
        }
      }
      return result;
    };
    return fn(elements);
  }
  /**
   * 创建一个空白文本元素并返回
   */
  static getSpaceElement() {
    return new _AlexElement("text", null, null, null, "\uFEFF");
  }
};
/**
 * 定义默认的根级块元素标签
 */
__publicField(_AlexElement, "BLOCK_NODE", "p");
/**
 * 定义默认的文本元素标签
 */
__publicField(_AlexElement, "TEXT_NODE", "span");
/**
 * 定义不显示的元素标签
 */
__publicField(_AlexElement, "VOID_NODES", ["colgroup", "col"]);
let AlexElement = _AlexElement;
class AlexRange {
  constructor(anchor, focus) {
    __publicField(this, "anchor");
    __publicField(this, "focus");
    this.anchor = anchor;
    this.focus = focus;
  }
}
class AlexPoint {
  constructor(element2, offset) {
    //虚拟光标对应的元素
    __publicField(this, "element");
    //虚拟光标在元素中的偏移值
    __publicField(this, "offset");
    this.element = element2;
    this.offset = offset;
    if (this.element.isText() || this.element.isClosed()) {
      if (AlexElement.VOID_NODES.includes(this.element.parsedom)) {
        throw new Error("Invisible element cannot be set as focal point");
      }
      return;
    }
    if (this.offset == 0) {
      this.moveToStart(this.element);
    } else {
      this.moveToEnd(this.element);
    }
  }
  /**
   * 是否Point类型数据
   */
  static isPoint(val) {
    return val instanceof AlexPoint;
  }
  /**
   * 两个点是否相等
   */
  isEqual(point) {
    if (!AlexPoint.isPoint(point)) {
      return false;
    }
    return this.element.isEqual(point.element) && this.offset == point.offset;
  }
  /**
   * 移动到到指定元素最后
   */
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
      if (AlexElement.VOID_NODES.includes(element2.parsedom)) {
        throw new Error("Invisible element cannot be set as focal point");
      }
      this.element = element2;
      this.offset = 1;
    } else if (element2.hasChildren()) {
      const flatElements = AlexElement.flatElements(element2.children).filter((el) => {
        return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom);
      });
      const length = flatElements.length;
      if (length == 0) {
        throw new Error("There is no element to set the focus");
      }
      this.moveToEnd(flatElements[length - 1]);
    }
  }
  /**
   * 移动到指定元素最前
   */
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
      if (AlexElement.VOID_NODES.includes(element2.parsedom)) {
        throw new Error("Invisible element cannot be set as focal point");
      }
      this.element = element2;
      this.offset = 0;
    } else if (element2.hasChildren()) {
      const flatElements = AlexElement.flatElements(element2.children).filter((el) => {
        return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom);
      });
      if (flatElements.length == 0) {
        throw new Error("There is no element to set the focus");
      }
      this.moveToStart(flatElements[0]);
    }
  }
}
class AlexHistory {
  constructor() {
    //存放历史记录的堆栈
    __publicField(this, "records", []);
    //记录当前展示的stack的序列
    __publicField(this, "current", -1);
  }
  /**
   * 入栈
   */
  push(stack, range) {
    if (this.current < this.records.length - 1) {
      this.records.length = this.current + 1;
    }
    const newStack = stack.map((ele) => {
      return ele.__fullClone();
    });
    const newRange = this.__cloneRange(newStack, range);
    this.records.push({
      stack: newStack,
      range: newRange
    });
    this.current += 1;
  }
  /**
   * 获取
   */
  get(type) {
    let current = this.current;
    if (type == -1) {
      if (current <= 0) {
        return null;
      }
      current -= 1;
    } else if (type == 1) {
      if (current >= this.records.length - 1) {
        return null;
      }
      current += 1;
    }
    const { stack, range } = this.records[current];
    const newStack = stack.map((ele) => {
      return ele.__fullClone();
    });
    const newRange = this.__cloneRange(newStack, range);
    return {
      current,
      stack: newStack,
      range: newRange
    };
  }
  /**
   * 更新当前历史记录的range
   */
  updateCurrentRange(range) {
    const records = this.records[this.current];
    const newRange = this.__cloneRange(records.stack, range);
    this.records[this.current].range = newRange;
  }
  /**
   * 克隆range
   */
  __cloneRange(newStack, range) {
    if (range) {
      const anchorElement = AlexElement.flatElements(newStack).find((ele) => {
        return ele.key == range.anchor.element.key;
      });
      const focusElement = AlexElement.flatElements(newStack).find((ele) => {
        return ele.key == range.focus.element.key;
      });
      if (anchorElement && focusElement) {
        const anchor = new AlexPoint(anchorElement, range.anchor.offset);
        const focus = new AlexPoint(focusElement, range.focus.offset);
        return new AlexRange(anchor, focus);
      }
    }
    return null;
  }
}
const blockParse = [
  {
    parsedom: "p"
  },
  {
    parsedom: "div"
  },
  {
    parsedom: "table"
  },
  {
    parsedom: "ul"
  },
  {
    parsedom: "ol"
  },
  {
    parsedom: "h1"
  },
  {
    parsedom: "h2"
  },
  {
    parsedom: "h3"
  },
  {
    parsedom: "h4"
  },
  {
    parsedom: "h5"
  },
  {
    parsedom: "h6"
  },
  {
    parsedom: "blockquote"
  },
  {
    parsedom: "pre"
  },
  {
    parsedom: "address",
    parse: true
  },
  {
    parsedom: "article",
    parse: true
  },
  {
    parsedom: "aside",
    parse: true
  },
  {
    parsedom: "nav",
    parse: true
  },
  {
    parsedom: "section",
    parse: true
  }
];
const closedParse = [
  {
    parsedom: "br"
  },
  {
    parsedom: "col"
  },
  {
    parsedom: "img"
  },
  {
    parsedom: "hr"
  },
  {
    parsedom: "video"
  },
  {
    parsedom: "audio"
  },
  {
    parsedom: "svg"
  },
  {
    parsedom: "canvas"
  }
];
const inblockParse = [
  {
    parsedom: "li",
    block: true
  },
  {
    parsedom: "tfoot"
  },
  {
    parsedom: "tbody"
  },
  {
    parsedom: "thead"
  },
  {
    parsedom: "tr"
  },
  {
    parsedom: "th"
  },
  {
    parsedom: "td"
  },
  {
    parsedom: "colgroup"
  }
];
const inlineParse = [
  {
    parsedom: "span"
  },
  {
    parsedom: "a"
  },
  {
    parsedom: "label"
  },
  {
    parsedom: "code"
  },
  {
    parsedom: "b",
    parse: {
      "font-weight": "bold"
    }
  },
  {
    parsedom: "strong",
    parse: {
      "font-weight": "bold"
    }
  },
  {
    parsedom: "sup",
    parse: {
      "vertical-align": "super"
    }
  },
  {
    parsedom: "sub",
    parse: {
      "vertical-align": "sub"
    }
  },
  {
    parsedom: "i",
    parse: {
      "font-style": "italic"
    }
  },
  {
    parsedom: "u",
    parse: {
      "text-decoration-line": "underline"
    }
  },
  {
    parsedom: "del",
    parse: {
      "text-decoration-line": "line-through"
    }
  },
  {
    parsedom: "abbr",
    parse: true
  },
  {
    parsedom: "acronym",
    parse: true
  },
  {
    parsedom: "bdo",
    parse: true
  },
  {
    parsedom: "font",
    parse: {
      "font-family": (node) => {
        return node.getAttribute("face") || "";
      }
    }
  }
];
const handleNotStackBlock = function(element2) {
  if (element2.hasChildren()) {
    const blocks = element2.children.filter((el) => {
      return !el.isEmpty() && el.isBlock();
    });
    blocks.forEach((el) => {
      el.type = element2.type == "inline" ? "inline" : "inblock";
      if (el.type == "inblock") {
        el.behavior = "block";
      }
    });
  }
};
const handleInblockWithOther = function(element2) {
  if (element2.hasChildren()) {
    const children = element2.children.filter((el) => {
      return !el.isEmpty();
    });
    const inblocks = children.filter((el) => {
      return el.isInblock();
    });
    if (inblocks.length && inblocks.length != children.length) {
      inblocks.forEach((el) => {
        el.type = "inline";
      });
    }
  }
};
const handleInlineChildrenNotInblock = function(element2) {
  if (element2.isInline() && element2.hasChildren()) {
    const inblocks = element2.children.filter((el) => {
      return !el.isEmpty() && el.isInblock();
    });
    inblocks.forEach((el) => {
      el.type = "inline";
    });
  }
};
const breakFormat = function(element2) {
  if (element2.hasChildren()) {
    const children = element2.children.filter((el) => {
      return !el.isEmpty();
    });
    const breaks = children.filter((el) => {
      return el.isBreak();
    });
    if (breaks.length && breaks.length == children.length) {
      if (this.range && element2.isContains(this.range.anchor.element)) {
        this.range.anchor.moveToStart(breaks[0]);
      }
      if (this.range && element2.isContains(this.range.focus.element)) {
        this.range.focus.moveToStart(breaks[0]);
      }
      element2.children = [breaks[0]];
    } else if (breaks.length) {
      breaks.forEach((el) => {
        el.toEmpty();
      });
    }
  }
};
const mergeWithBrotherElement = function(element2) {
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
        if (this.range && nel.isContains(this.range.anchor.element)) {
          if (pel.isEmpty()) {
            this.range.anchor.element = pel;
            this.range.anchor.offset = 0;
          } else {
            this.range.anchor.moveToEnd(pel);
          }
        }
        if (this.range && nel.isContains(this.range.focus.element)) {
          if (pel.isEmpty()) {
            this.range.focus.element = pel;
            this.range.focus.offset = 0;
          } else {
            this.range.focus.moveToEnd(pel);
          }
        }
        const index = nel.parent.children.findIndex((item) => {
          return nel.isEqual(item);
        });
        nel.parent.children.splice(index, 1);
      } else if (pel.isEmpty()) {
        if (this.range && pel.isContains(this.range.anchor.element)) {
          if (nel.isEmpty()) {
            this.range.anchor.element = nel;
            this.range.anchor.offset = 0;
          } else {
            this.range.anchor.moveToStart(nel);
          }
        }
        if (this.range && pel.isContains(this.range.focus.element)) {
          if (nel.isEmpty()) {
            this.range.focus.element = nel;
            this.range.focus.offset = 0;
          } else {
            this.range.focus.moveToStart(nel);
          }
        }
        const index = pel.parent.children.findIndex((item) => {
          return pel.isEqual(item);
        });
        pel.parent.children.splice(index, 1);
      }
    } else if (pel.isText()) {
      if (this.range && nel.isEqual(this.range.anchor.element)) {
        this.range.anchor.element = pel;
        this.range.anchor.offset = pel.textContent.length + this.range.anchor.offset;
      }
      if (this.range && nel.isEqual(this.range.focus.element)) {
        this.range.focus.element = pel;
        this.range.focus.offset = pel.textContent.length + this.range.focus.offset;
      }
      pel.textContent += nel.textContent;
      const index = nel.parent.children.findIndex((item) => {
        return nel.isEqual(item);
      });
      nel.parent.children.splice(index, 1);
    } else if (pel.isInline()) {
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
  const mergeElement = (ele) => {
    if (ele.hasChildren() && ele.children.length > 1) {
      let index = 0;
      while (index <= ele.children.length - 2) {
        if (canMerge(ele.children[index], ele.children[index + 1])) {
          merge(ele.children[index], ele.children[index + 1]);
          continue;
        }
        index++;
      }
    }
  };
  mergeElement(element2);
};
const mergeWithParentElement = function(element2) {
  const canMerge = (parent, child) => {
    if (child.isText() && parent.isInline()) {
      return parent.parsedom == AlexElement.TEXT_NODE;
    }
    if (parent.isInline() && child.isInline() || parent.isInblock() && child.isInblock()) {
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
          Object.assign(parent.marks, cloneData(child.marks));
        } else {
          parent.marks = cloneData(child.marks);
        }
      }
      if (child.hasStyles()) {
        if (parent.hasStyles()) {
          Object.assign(parent.styles, cloneData(child.styles));
        } else {
          parent.styles = cloneData(child.styles);
        }
      }
      parent.textContent = child.textContent;
      parent.children = null;
      if (this.range && child.isContains(this.range.anchor.element)) {
        this.range.anchor.element = parent;
      }
      if (this.range && child.isContains(this.range.focus.element)) {
        this.range.focus.element = parent;
      }
    } else {
      if (child.hasMarks()) {
        if (parent.hasMarks()) {
          Object.assign(parent.marks, cloneData(child.marks));
        } else {
          parent.marks = cloneData(child.marks);
        }
      }
      if (child.hasStyles()) {
        if (parent.hasStyles()) {
          Object.assign(parent.styles, cloneData(child.styles));
        } else {
          parent.styles = cloneData(child.styles);
        }
      }
      if (child.hasChildren()) {
        parent.children = [...child.children];
        parent.children.forEach((item) => {
          item.parent = parent;
        });
      }
      mergeElement(parent);
    }
  };
  const mergeElement = (ele) => {
    if (ele.hasChildren() && ele.children.length == 1 && ele.children[0] && canMerge(ele, ele.children[0])) {
      merge(ele, ele.children[0]);
    }
  };
  mergeElement(element2);
};
const mergeWithSpaceTextElement = function(element2) {
  if (element2.isText()) {
    element2.textContent = element2.textContent.replace(/[\uFEFF]+/, "\uFEFF");
  }
};
const { Mac } = platform.os();
const isUndo = function(e) {
  if (Mac) {
    return e.key == "z" && e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  }
  return e.key == "z" && e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey;
};
const isRedo = function(e) {
  if (Mac) {
    return e.key == "z" && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey;
  }
  return e.key == "z" && e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey;
};
const checkStack = function() {
  const elements = AlexElement.flatElements(this.stack).filter((el) => {
    return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom);
  });
  if (elements.length == 0) {
    const ele = new AlexElement("block", AlexElement.BLOCK_NODE, null, null, null);
    const breakEle = new AlexElement("closed", "br", null, null, null);
    this.addElementTo(breakEle, ele);
    this.stack = [ele];
  }
};
const setRecentlyPoint = function(point) {
  const previousElement = this.getPreviousElementOfPoint(point);
  const nextElement = this.getNextElementOfPoint(point);
  const block = point.element.getBlock();
  const inblock = point.element.getInblock();
  if (previousElement && !AlexElement.VOID_NODES.includes(previousElement.parsedom) && inblock && inblock.isContains(previousElement)) {
    point.moveToEnd(previousElement);
  } else if (nextElement && !AlexElement.VOID_NODES.includes(nextElement.parsedom) && inblock && inblock.isContains(nextElement)) {
    point.moveToStart(nextElement);
  } else if (previousElement && !AlexElement.VOID_NODES.includes(previousElement.parsedom) && block.isContains(previousElement)) {
    point.moveToEnd(previousElement);
  } else if (nextElement && !AlexElement.VOID_NODES.includes(nextElement.parsedom) && block.isContains(nextElement)) {
    point.moveToStart(nextElement);
  } else if (previousElement && !AlexElement.VOID_NODES.includes(previousElement.parsedom)) {
    point.moveToEnd(previousElement);
  } else if (nextElement && !AlexElement.VOID_NODES.includes(nextElement.parsedom)) {
    point.moveToStart(nextElement);
  }
};
const emptyDefaultBehaviorInblock = function(element2) {
  if (!element2.isInblock()) {
    return;
  }
  if (element2.behavior != "default") {
    return;
  }
  if (element2.hasChildren()) {
    element2.children.forEach((item) => {
      if (item.isInblock()) {
        emptyDefaultBehaviorInblock.apply(this, [item]);
      } else {
        item.toEmpty();
        if (item.parent.isEmpty()) {
          const breakEl = new AlexElement("closed", "br", null, null, null);
          this.addElementTo(breakEl, item.parent);
        }
      }
    });
  }
};
const setRangeInVisible = function() {
  const fn = async (root) => {
    const scrollHeight = element.getScrollHeight(root);
    const scrollWidth = element.getScrollWidth(root);
    if (root.clientHeight < scrollHeight || root.clientWidth < scrollWidth) {
      const selection = window.getSelection();
      if (selection.rangeCount == 0) {
        return;
      }
      const range = selection.getRangeAt(0);
      const rects = range.getClientRects();
      let target = range;
      if (rects.length == 0) {
        target = this.range.focus.element.elm;
      }
      const childRect = target.getBoundingClientRect();
      const parentRect = root.getBoundingClientRect();
      if (root.clientHeight < scrollHeight) {
        if (childRect.top < parentRect.top) {
          await element.setScrollTop({
            el: root,
            number: 0
          });
          const tempChildRect = target.getBoundingClientRect();
          const tempParentRect = root.getBoundingClientRect();
          element.setScrollTop({
            el: root,
            number: tempChildRect.top - tempParentRect.top
          });
        } else if (childRect.bottom > parentRect.bottom) {
          await element.setScrollTop({
            el: root,
            number: 0
          });
          const tempChildRect = target.getBoundingClientRect();
          const tempParentRect = root.getBoundingClientRect();
          element.setScrollTop({
            el: root,
            number: tempChildRect.bottom - tempParentRect.bottom
          });
        }
      }
      if (root.clientWidth < scrollWidth) {
        if (childRect.left < parentRect.left) {
          await element.setScrollLeft({
            el: root,
            number: 0
          });
          const tempChildRect = target.getBoundingClientRect();
          const tempParentRect = root.getBoundingClientRect();
          element.setScrollLeft({
            el: root,
            number: tempChildRect.left - tempParentRect.left + 20
          });
        } else if (childRect.right > parentRect.right) {
          await element.setScrollLeft({
            el: root,
            number: 0
          });
          const tempChildRect = target.getBoundingClientRect();
          const tempParentRect = root.getBoundingClientRect();
          element.setScrollLeft({
            el: root,
            number: tempChildRect.right - tempParentRect.right + 20
          });
        }
      }
    }
  };
  if (this.range && this.range.focus.element.elm) {
    let root = this.range.focus.element.elm;
    while (element.isElement(root) && root != document.documentElement) {
      fn(root);
      root = root.parentNode;
    }
  }
};
const handleStackEmpty = function() {
  const elements = AlexElement.flatElements(this.stack).filter((el) => {
    return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom);
  });
  if (elements.length == 0) {
    const ele = new AlexElement("block", AlexElement.BLOCK_NODE, null, null, null);
    const breakEle = new AlexElement("closed", "br", null, null, null);
    this.addElementTo(breakEle, ele);
    this.stack = [ele];
    if (this.range) {
      this.range.anchor.moveToStart(breakEle);
      this.range.focus.moveToStart(breakEle);
    }
  }
};
const handleSelectionChange = function() {
  if (this.__isInputChinese) {
    return;
  }
  if (this.__innerSelectionChange) {
    return;
  }
  const selection = window.getSelection();
  if (selection && selection.rangeCount) {
    const range = selection.getRangeAt(0);
    if (isContains(this.$el, range.startContainer) && isContains(this.$el, range.endContainer)) {
      let anchorNode = null;
      let focusNode = null;
      let anchorOffset = null;
      let focusOffset = null;
      if (range.startContainer.nodeType == 3) {
        anchorNode = range.startContainer.parentNode;
        anchorOffset = range.startOffset;
      } else if (range.startContainer.nodeType == 1) {
        const childNodes = Array.from(range.startContainer.childNodes);
        if (childNodes.length) {
          anchorNode = childNodes[range.startOffset] ? childNodes[range.startOffset] : childNodes[range.startOffset - 1];
          anchorOffset = childNodes[range.startOffset] ? 0 : 1;
          if (anchorNode.nodeType == 3) {
            anchorOffset = anchorOffset == 0 ? 0 : anchorNode.textContent.length;
            anchorNode = anchorNode.parentNode;
          }
        } else {
          anchorNode = range.startContainer;
          anchorOffset = 0;
        }
      }
      if (range.endContainer.nodeType == 3) {
        focusNode = range.endContainer.parentNode;
        focusOffset = range.endOffset;
      } else if (range.endContainer.nodeType == 1) {
        const childNodes = Array.from(range.endContainer.childNodes);
        if (childNodes.length) {
          focusNode = childNodes[range.endOffset] ? childNodes[range.endOffset] : childNodes[range.endOffset - 1];
          focusOffset = childNodes[range.endOffset] ? 0 : 1;
          if (focusNode.nodeType == 3) {
            focusOffset = focusOffset == 0 ? 0 : focusNode.textContent.length;
            focusNode = focusNode.parentNode;
          }
        } else {
          focusNode = range.endContainer;
          focusOffset = 1;
        }
      }
      const anchorKey = data.get(anchorNode, "data-alex-editor-key");
      const focusKey = data.get(focusNode, "data-alex-editor-key");
      const anchorEle = this.getElementByKey(anchorKey);
      const focusEle = this.getElementByKey(focusKey);
      const anchor = new AlexPoint(anchorEle, anchorOffset);
      const focus = new AlexPoint(focusEle, focusOffset);
      if (this.range) {
        this.range.anchor = anchor;
        this.range.focus = focus;
      } else {
        this.range = new AlexRange(anchor, focus);
      }
      this.history.updateCurrentRange(this.range);
      this.emit("rangeUpdate", this.range);
    }
  }
};
const handleBeforeInput = function(e) {
  if (this.disabled) {
    return;
  }
  if (e.inputType == "deleteByCut" || e.inputType == "insertFromPaste" || e.inputType == "deleteByDrag" || e.inputType == "insertFromDrop") {
    return;
  }
  e.preventDefault();
  if (e.inputType == "insertText" && e.data) {
    this.insertText(e.data);
    this.formatElementStack();
    this.domRender();
    this.rangeRender();
  } else if (e.inputType == "insertParagraph" || e.inputType == "insertLineBreak") {
    this.insertParagraph();
    this.formatElementStack();
    this.domRender();
    this.rangeRender();
  } else if (e.inputType == "deleteContentBackward") {
    this.delete();
    this.formatElementStack();
    this.domRender();
    this.rangeRender();
  }
};
const handleChineseInput = function(e) {
  if (this.disabled) {
    return;
  }
  e.preventDefault();
  if (e.type == "compositionstart") {
    if (this.__chineseInputTimer) {
      clearTimeout(this.__chineseInputTimer);
      this.__chineseInputTimer = null;
    }
    this.__isInputChinese = true;
  } else if (e.type == "compositionend") {
    if (e.data) {
      this.insertText(e.data);
      this.formatElementStack();
      this.domRender();
      this.rangeRender();
    }
    this.__chineseInputTimer = setTimeout(() => {
      this.__isInputChinese = false;
    }, 0);
  }
};
const handleKeydown = function(e) {
  if (this.disabled) {
    return;
  }
  if (this.__isInputChinese) {
    return;
  }
  if (isUndo(e)) {
    e.preventDefault();
    const historyRecord = this.history.get(-1);
    if (historyRecord) {
      this.history.current = historyRecord.current;
      this.stack = historyRecord.stack;
      this.range = historyRecord.range;
      this.formatElementStack();
      this.domRender(true);
      this.rangeRender();
    }
  } else if (isRedo(e)) {
    e.preventDefault();
    const historyRecord = this.history.get(1);
    if (historyRecord) {
      this.history.current = historyRecord.current;
      this.stack = historyRecord.stack;
      this.range = historyRecord.range;
      this.formatElementStack();
      this.domRender(true);
      this.rangeRender();
    }
  }
};
const handleCopy = async function(e) {
  e.preventDefault();
  await this.copy();
};
const handleCut = async function(e) {
  e.preventDefault();
  const result = await this.cut();
  if (result && !this.disabled) {
    this.formatElementStack();
    this.domRender();
    this.rangeRender();
  }
};
const doPaste = async function(html, text, files) {
  if (html) {
    if (this.allowPasteHtml) {
      const elements = this.parseHtml(html).filter((el) => {
        return !el.isEmpty();
      });
      if (typeof this.customHtmlPaste == "function") {
        await this.customHtmlPaste.apply(this, [elements, html]);
      } else {
        for (let i = 0; i < elements.length; i++) {
          this.insertElement(elements[i], false);
        }
        this.emit("pasteHtml", elements, html);
      }
    } else if (text) {
      if (typeof this.customTextPaste == "function") {
        await this.customTextPaste.apply(this, [text]);
      } else {
        this.insertText(text);
        this.emit("pasteText", text);
      }
    }
  } else {
    if (text) {
      if (typeof this.customTextPaste == "function") {
        await this.customTextPaste.apply(this, [text]);
      } else {
        this.insertText(text);
        this.emit("pasteText", text);
      }
    } else {
      let length = files.length;
      for (let i = 0; i < length; i++) {
        if (files[i].type.startsWith("image/")) {
          if (typeof this.customImagePaste == "function") {
            await this.customImagePaste.apply(this, [files[i]]);
          } else {
            const url = await file.dataFileToBase64(files[i]);
            const image = new AlexElement(
              "closed",
              "img",
              {
                src: url
              },
              null,
              null
            );
            this.insertElement(image);
            this.emit("pasteImage", url);
          }
        } else if (files[i].type.startsWith("video/")) {
          if (typeof this.customVideoPaste == "function") {
            await this.customVideoPaste.apply(this, [files[i]]);
          } else {
            const url = await file.dataFileToBase64(files[i]);
            const video = new AlexElement(
              "closed",
              "video",
              {
                src: url
              },
              null,
              null
            );
            this.insertElement(video);
            this.emit("pasteVideo", url);
          }
        } else {
          if (typeof this.customFilePaste == "function") {
            await this.customFilePaste.apply(this, [files[i]]);
          }
        }
      }
    }
  }
};
const handlePaste = async function(e) {
  e.preventDefault();
  if (this.disabled) {
    return;
  }
  if (!this.range) {
    return;
  }
  if (!this.allowPaste) {
    return;
  }
  const event2 = e;
  if (event2.clipboardData) {
    const html = event2.clipboardData.getData("text/html");
    const text = event2.clipboardData.getData("text/plain");
    const files = event2.clipboardData.files;
    await doPaste.apply(this, [html, text, files]);
    this.formatElementStack();
    this.domRender();
    this.rangeRender();
  }
};
const handleDragDrop = async function(e) {
  e.preventDefault();
  if (e.type == "drop") {
    if (this.disabled) {
      return;
    }
    if (!this.range) {
      return;
    }
    if (!this.allowPaste) {
      return;
    }
    const event2 = e;
    if (event2.dataTransfer) {
      const html = event2.dataTransfer.getData("text/html");
      const text = event2.dataTransfer.getData("text/plain");
      const files = event2.dataTransfer.files;
      await doPaste.apply(this, [html, text, files]);
      this.formatElementStack();
      this.domRender();
      this.rangeRender();
    }
  }
};
const handleFocus = function() {
  if (this.disabled) {
    return;
  }
  this.emit("focus", this.value);
};
const handleBlur = function() {
  if (this.disabled) {
    return;
  }
  this.emit("blur", this.value);
};
class AlexEditor {
  constructor(node, opts) {
    //编辑器容器
    __publicField(this, "$el");
    //是否禁用
    __publicField(this, "disabled");
    //编辑器的值
    __publicField(this, "value");
    //自定义渲染规则
    __publicField(this, "renderRules");
    //是否允许复制
    __publicField(this, "allowCopy");
    //是否允许粘贴
    __publicField(this, "allowPaste");
    //是否允许剪切
    __publicField(this, "allowCut");
    //是否允许粘贴html
    __publicField(this, "allowPasteHtml");
    //自定义纯文本粘贴方法
    __publicField(this, "customTextPaste");
    //自定义html粘贴方法
    __publicField(this, "customHtmlPaste");
    //自定义图片粘贴方法
    __publicField(this, "customImagePaste");
    //自定义视频粘贴方法
    __publicField(this, "customVideoPaste");
    //自定义文件粘贴方法（除图片视频外）
    __publicField(this, "customFilePaste");
    //自定义处理不可编辑元素合并的逻辑
    __publicField(this, "customMerge");
    //自定义dom转为非文本元素的后续处理逻辑
    __publicField(this, "customParseNode");
    //复制粘贴语法是否能够使用
    __publicField(this, "useClipboard", canUseClipboard());
    //创建历史记录
    __publicField(this, "history", new AlexHistory());
    //存放元素的数组
    __publicField(this, "stack");
    //光标虚拟对象
    __publicField(this, "range", null);
    //编辑器唯一id
    __publicField(this, "__guid", createGuid());
    //事件集合
    __publicField(this, "__events", {});
    //是否第一次渲染
    __publicField(this, "__firstRender", true);
    //是否正在输入中文
    __publicField(this, "__isInputChinese", false);
    //是否内部修改真实光标引起selctionChange事件
    __publicField(this, "__innerSelectionChange", false);
    //取消中文输入标识的延时器
    __publicField(this, "__chineseInputTimer", null);
    this.$el = initEditorNode(node);
    const options = initEditorOptions(opts);
    this.disabled = options.disabled;
    this.value = options.value;
    this.renderRules = options.renderRules;
    this.allowCopy = options.allowCopy;
    this.allowPaste = options.allowPaste;
    this.allowCut = options.allowCut;
    this.allowPasteHtml = options.allowPasteHtml;
    this.customTextPaste = options.customTextPaste;
    this.customHtmlPaste = options.customHtmlPaste;
    this.customImagePaste = options.customImagePaste;
    this.customVideoPaste = options.customVideoPaste;
    this.customFilePaste = options.customFilePaste;
    this.customMerge = options.customMerge;
    this.customParseNode = options.customParseNode;
    this.stack = this.parseHtml(this.value);
    checkStack.apply(this);
    this.disabled ? this.setDisabled() : this.setEnabled();
    event.on(document, `selectionchange.alex_editor_${this.__guid}`, handleSelectionChange.bind(this));
    event.on(this.$el, "beforeinput.alex_editor", handleBeforeInput.bind(this));
    event.on(this.$el, "compositionstart.alex_editor compositionupdate.alex_editor compositionend.alex_editor", handleChineseInput.bind(this));
    event.on(this.$el, "keydown.alex_editor", handleKeydown.bind(this));
    event.on(this.$el, "cut.alex_editor", handleCut.bind(this));
    event.on(this.$el, "paste.alex_editor", handlePaste.bind(this));
    event.on(this.$el, "copy.alex_editor", handleCopy.bind(this));
    event.on(this.$el, "dragstart.alex_editor drop.alex_editor", handleDragDrop.bind(this));
    event.on(this.$el, "focus.alex_editor", handleFocus.bind(this));
    event.on(this.$el, "blur.alex_editor", handleBlur.bind(this));
  }
  /**
   * 初始化range
   */
  initRange() {
    const elements = AlexElement.flatElements(this.stack).filter((el) => {
      return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom);
    });
    const firstElement = elements[0];
    const anchor = new AlexPoint(firstElement, 0);
    const focus = new AlexPoint(firstElement, 0);
    this.range = new AlexRange(anchor, focus);
  }
  /**
   * 根据光标执行复制操作
   * isCut表示是否在执行剪切操作，默认为false，这个参数仅在内部使用
   */
  async copy(isCut = false) {
    if (!this.useClipboard) {
      return;
    }
    if (!this.range) {
      return;
    }
    if (!this.allowCopy) {
      return;
    }
    let result = this.getElementsByRange().list;
    if (result.length == 0) {
      return;
    }
    let html = "";
    let text = "";
    result.forEach((item) => {
      const newEl = item.element.clone();
      if (item.offset) {
        newEl.textContent = newEl.textContent.substring(item.offset[0], item.offset[1]);
      }
      newEl.__render();
      html += newEl.elm.outerHTML;
      text += newEl.elm.innerText;
    });
    const clipboardItem = new window.ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([text], { type: "text/plain" })
    });
    await navigator.clipboard.write([clipboardItem]);
    if (!isCut) {
      this.emit("copy", text, html);
    }
    return { text, html };
  }
  /**
   * 根据光标进行剪切操作
   */
  async cut() {
    if (!this.useClipboard) {
      return;
    }
    if (!this.range) {
      return;
    }
    if (!this.allowCut) {
      return;
    }
    const result = await this.copy(true);
    if (result) {
      if (!this.disabled) {
        this.delete();
      }
      this.emit("cut", result.text, result.html);
    }
    return result;
  }
  /**
   * 根据光标进行删除操作
   */
  delete() {
    if (this.disabled) {
      return;
    }
    if (!this.range) {
      return;
    }
    if (this.range.anchor.isEqual(this.range.focus)) {
      const previousElement = this.getPreviousElementOfPoint(this.range.anchor);
      const block = this.range.anchor.element.getBlock();
      const inblock = this.range.anchor.element.getInblock();
      if (inblock) {
        if (this.range.anchor.offset == 0) {
          if (previousElement) {
            if (inblock.isContains(previousElement)) {
              this.range.anchor.moveToEnd(previousElement);
              this.range.focus.moveToEnd(previousElement);
              this.delete();
              return;
            } else if (inblock.behavior == "block") {
              const previousBlock = previousElement.getBlock();
              const previousInblock = previousElement.getInblock();
              if (previousInblock) {
                if (previousInblock.behavior == "block") {
                  this.merge(inblock, previousInblock);
                }
              } else {
                this.merge(inblock, previousBlock);
              }
            }
          } else {
            this.emit("deleteInStart", inblock);
          }
        } else {
          if (this.range.anchor.element.isSpaceText()) {
            this.range.anchor.element.toEmpty();
            if (inblock.isEmpty()) {
              const breakEl = new AlexElement("closed", "br", null, null, null);
              this.addElementTo(breakEl, inblock);
              this.range.anchor.moveToStart(breakEl);
              this.range.focus.moveToStart(breakEl);
            } else {
              this.range.anchor.offset = 0;
              this.range.focus.offset = 0;
              this.delete();
              return;
            }
          } else if (this.range.anchor.element.isText()) {
            const val = this.range.anchor.element.textContent;
            this.range.anchor.offset -= 1;
            const isSpace = isSpaceText(val[this.range.anchor.offset]);
            this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset) + val.substring(this.range.focus.offset);
            this.range.focus.offset = this.range.anchor.offset;
            if (isSpace) {
              this.delete();
              return;
            }
            if (inblock.isEmpty()) {
              const breakEl = new AlexElement("closed", "br", null, null, null);
              this.addElementTo(breakEl, inblock);
              this.range.anchor.moveToStart(breakEl);
              this.range.focus.moveToStart(breakEl);
            }
          } else {
            const isBreak = this.range.anchor.element.isBreak();
            this.range.anchor.element.toEmpty();
            if (inblock.isEmpty()) {
              if (!isBreak || inblock.behavior == "default") {
                const breakEl = new AlexElement("closed", "br", null, null, null);
                this.addElementTo(breakEl, inblock);
                this.range.anchor.moveToStart(breakEl);
                this.range.focus.moveToStart(breakEl);
              } else if (!previousElement) {
                const breakEl = new AlexElement("closed", "br", null, null, null);
                this.addElementTo(breakEl, inblock);
                this.range.anchor.moveToStart(breakEl);
                this.range.focus.moveToStart(breakEl);
              }
            }
          }
        }
      } else {
        if (this.range.anchor.offset == 0) {
          if (previousElement) {
            if (block.isContains(previousElement)) {
              this.range.anchor.moveToEnd(previousElement);
              this.range.focus.moveToEnd(previousElement);
              this.delete();
              return;
            } else {
              const previousInblock = previousElement.getInblock();
              const previousBlock = previousElement.getBlock();
              if (previousInblock) {
                if (previousInblock.behavior == "block") {
                  this.merge(block, previousInblock);
                }
              } else {
                this.merge(block, previousBlock);
              }
            }
          } else {
            this.emit("deleteInStart", block);
          }
        } else {
          if (this.range.anchor.element.isSpaceText()) {
            this.range.anchor.element.toEmpty();
            if (block.isEmpty()) {
              const breakEl = new AlexElement("closed", "br", null, null, null);
              this.addElementTo(breakEl, block);
              this.range.anchor.moveToStart(breakEl);
              this.range.focus.moveToStart(breakEl);
            } else {
              this.range.anchor.offset = 0;
              this.range.focus.offset = 0;
              this.delete();
              return;
            }
          } else if (this.range.anchor.element.isText()) {
            const val = this.range.anchor.element.textContent;
            this.range.anchor.offset -= 1;
            const isSpace = isSpaceText(val[this.range.anchor.offset]);
            this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset) + val.substring(this.range.focus.offset);
            this.range.focus.offset = this.range.anchor.offset;
            if (isSpace) {
              this.delete();
              return;
            }
            if (block.isEmpty()) {
              const breakEl = new AlexElement("closed", "br", null, null, null);
              this.addElementTo(breakEl, block);
              this.range.anchor.moveToStart(breakEl);
              this.range.focus.moveToStart(breakEl);
            }
          } else {
            const isBreak = this.range.anchor.element.isBreak();
            this.range.anchor.element.toEmpty();
            if (block.isEmpty()) {
              if (!isBreak || !previousElement) {
                const breakEl = new AlexElement("closed", "br", null, null, null);
                this.addElementTo(breakEl, block);
                this.range.anchor.moveToStart(breakEl);
                this.range.focus.moveToStart(breakEl);
              }
            }
          }
        }
      }
    } else {
      const result = this.getElementsByRange().list.filter((item) => {
        return !AlexElement.VOID_NODES.includes(item.element.parsedom);
      });
      const anchorInblock = this.range.anchor.element.getInblock();
      const focusInblock = this.range.focus.element.getInblock();
      const anchorBlock = this.range.anchor.element.getBlock();
      const focusBlock = this.range.focus.element.getBlock();
      if (anchorInblock && focusInblock && anchorInblock.isEqual(focusInblock)) {
        result.forEach((item) => {
          if (item.offset) {
            item.element.textContent = item.element.textContent.substring(0, item.offset[0]) + item.element.textContent.substring(item.offset[1]);
          } else {
            item.element.toEmpty();
          }
          if (anchorInblock.isEmpty()) {
            const breakEl = new AlexElement("closed", "br", null, null, null);
            this.addElementTo(breakEl, anchorInblock);
          }
        });
      } else if (anchorInblock && focusInblock) {
        result.forEach((item) => {
          if (item.offset) {
            item.element.textContent = item.element.textContent.substring(0, item.offset[0]) + item.element.textContent.substring(item.offset[1]);
          } else {
            if (item.element.isInblock() && item.element.behavior == "default") {
              emptyDefaultBehaviorInblock.apply(this, [item.element]);
            } else {
              item.element.toEmpty();
              if (item.element.parent && (item.element.parent.isInblock() || item.element.parent.isBlock()) && item.element.parent.isEmpty()) {
                const breakEl = new AlexElement("closed", "br", null, null, null);
                this.addElementTo(breakEl, item.element.parent);
              }
            }
          }
        });
        if (anchorInblock.behavior == "block" && focusInblock.behavior == "block") {
          this.merge(focusInblock, anchorInblock);
        }
      } else if (anchorInblock) {
        result.forEach((item) => {
          if (item.offset) {
            item.element.textContent = item.element.textContent.substring(0, item.offset[0]) + item.element.textContent.substring(item.offset[1]);
          } else {
            if (item.element.isInblock() && item.element.behavior == "default") {
              emptyDefaultBehaviorInblock.apply(this, [item.element]);
            } else {
              item.element.toEmpty();
              if (item.element.parent && (item.element.parent.isInblock() || item.element.parent.isBlock()) && item.element.parent.isEmpty()) {
                const breakEl = new AlexElement("closed", "br", null, null, null);
                this.addElementTo(breakEl, item.element.parent);
              }
            }
          }
        });
        if (anchorInblock.behavior == "block") {
          this.merge(focusBlock, anchorInblock);
        }
      } else if (focusInblock) {
        result.forEach((item) => {
          if (item.offset) {
            item.element.textContent = item.element.textContent.substring(0, item.offset[0]) + item.element.textContent.substring(item.offset[1]);
          } else {
            if (item.element.isInblock() && item.element.behavior == "default") {
              emptyDefaultBehaviorInblock.apply(this, [item.element]);
            } else {
              item.element.toEmpty();
              if (item.element.parent && (item.element.parent.isInblock() || item.element.parent.isBlock()) && item.element.parent.isEmpty()) {
                const breakEl = new AlexElement("closed", "br", null, null, null);
                this.addElementTo(breakEl, item.element.parent);
              }
            }
          }
        });
        if (focusInblock.behavior == "block") {
          this.merge(focusInblock, anchorBlock);
        }
      } else if (anchorBlock.isEqual(focusBlock)) {
        result.forEach((item) => {
          if (item.offset) {
            item.element.textContent = item.element.textContent.substring(0, item.offset[0]) + item.element.textContent.substring(item.offset[1]);
          } else {
            item.element.toEmpty();
          }
          if (anchorBlock.isEmpty()) {
            const breakEl = new AlexElement("closed", "br", null, null, null);
            this.addElementTo(breakEl, anchorBlock);
          }
        });
      } else {
        result.forEach((item) => {
          if (item.offset) {
            item.element.textContent = item.element.textContent.substring(0, item.offset[0]) + item.element.textContent.substring(item.offset[1]);
          } else {
            if (item.element.isInblock() && item.element.behavior == "default") {
              emptyDefaultBehaviorInblock.apply(this, [item.element]);
            } else {
              item.element.toEmpty();
              if (item.element.parent && (item.element.parent.isInblock() || item.element.parent.isBlock()) && item.element.parent.isEmpty()) {
                const breakEl = new AlexElement("closed", "br", null, null, null);
                this.addElementTo(breakEl, item.element.parent);
              }
            }
          }
        });
        this.merge(focusBlock, anchorBlock);
      }
    }
    if (this.range.anchor.element.isEmpty()) {
      setRecentlyPoint.apply(this, [this.range.anchor]);
    }
    this.range.focus.element = this.range.anchor.element;
    this.range.focus.offset = this.range.anchor.offset;
    handleStackEmpty.apply(this);
    this.emit("deleteComplete");
  }
  /**
   * 根据光标位置向编辑器内插入文本
   */
  insertText(data2) {
    if (this.disabled) {
      return;
    }
    if (!this.range) {
      return;
    }
    if (!data2 || typeof data2 != "string") {
      throw new Error("The argument must be a string");
    }
    if (this.range.anchor.isEqual(this.range.focus)) {
      if (!this.range.anchor.element.isPreStyle()) {
        data2 = data2.replace(/\s/g, () => {
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
  /**
   * 在光标处换行
   */
  insertParagraph() {
    if (this.disabled) {
      return;
    }
    if (!this.range) {
      return;
    }
    if (this.range.anchor.isEqual(this.range.focus)) {
      const previousElement = this.getPreviousElementOfPoint(this.range.anchor);
      const nextElement = this.getNextElementOfPoint(this.range.anchor);
      const block = this.range.anchor.element.getBlock();
      const inblock = this.range.anchor.element.getInblock();
      const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1;
      if (inblock) {
        if (this.range.anchor.element.isPreStyle()) {
          this.insertText("\n");
          const text = AlexElement.getSpaceElement();
          this.insertElement(text);
          this.range.anchor.moveToEnd(text);
          this.range.focus.moveToEnd(text);
          this.emit("insertParagraph", inblock, inblock);
        } else if (inblock.behavior == "block") {
          if (this.range.anchor.offset == 0 && !(previousElement && inblock.isContains(previousElement))) {
            const paragraph = inblock.clone(false);
            const breakEle = new AlexElement("closed", "br", null, null, null);
            this.addElementTo(breakEle, paragraph);
            this.addElementBefore(paragraph, inblock);
            this.emit("insertParagraph", inblock, paragraph);
          } else if (this.range.anchor.offset == endOffset && !(nextElement && inblock.isContains(nextElement))) {
            const paragraph = inblock.clone(false);
            const breakEle = new AlexElement("closed", "br", null, null, null);
            this.addElementTo(breakEle, paragraph);
            this.addElementAfter(paragraph, inblock);
            this.range.anchor.moveToStart(breakEle);
            this.range.focus.moveToStart(breakEle);
            this.emit("insertParagraph", paragraph, inblock);
          } else {
            const newInblock = inblock.clone();
            this.addElementAfter(newInblock, inblock);
            const elements = AlexElement.flatElements(inblock.children);
            const index = elements.findIndex((item) => {
              return this.range.anchor.element.isEqual(item);
            });
            this.range.focus.moveToEnd(inblock);
            this.delete();
            const newElements = AlexElement.flatElements(newInblock.children);
            this.range.focus.element = newElements[index];
            this.range.focus.offset = this.range.anchor.offset;
            this.range.anchor.moveToStart(newInblock);
            this.delete();
            this.emit("insertParagraph", newInblock, inblock);
          }
        }
      } else {
        if (this.range.anchor.element.isPreStyle()) {
          this.insertText("\n");
          const text = AlexElement.getSpaceElement();
          this.insertElement(text);
          this.range.anchor.moveToEnd(text);
          this.range.focus.moveToEnd(text);
          this.emit("insertParagraph", block, block);
        } else {
          if (this.range.anchor.offset == 0 && !(previousElement && block.isContains(previousElement))) {
            const paragraph = block.clone(false);
            const breakEle = new AlexElement("closed", "br", null, null, null);
            this.addElementTo(breakEle, paragraph);
            this.addElementBefore(paragraph, block);
            this.emit("insertParagraph", block, paragraph);
          } else if (this.range.anchor.offset == endOffset && !(nextElement && block.isContains(nextElement))) {
            const paragraph = block.clone(false);
            const breakEle = new AlexElement("closed", "br", null, null, null);
            this.addElementTo(breakEle, paragraph);
            this.addElementAfter(paragraph, block);
            this.range.anchor.moveToStart(breakEle);
            this.range.focus.moveToStart(breakEle);
            this.emit("insertParagraph", paragraph, block);
          } else {
            const newBlock = block.clone();
            this.addElementAfter(newBlock, block);
            const elements = AlexElement.flatElements(block.children);
            const index = elements.findIndex((item) => {
              return this.range.anchor.element.isEqual(item);
            });
            const offset = this.range.anchor.offset;
            this.range.focus.moveToEnd(block);
            this.delete();
            const newElements = AlexElement.flatElements(newBlock.children);
            this.range.focus.element = newElements[index];
            this.range.focus.offset = offset;
            this.range.anchor.moveToStart(newBlock);
            this.delete();
            this.emit("insertParagraph", newBlock, block);
          }
        }
      }
    } else {
      this.delete();
      this.insertParagraph();
    }
  }
  /**
   * 根据光标插入元素
   * cover表示所在根级块或者内部块元素只有换行符时是否覆盖此元素
   */
  insertElement(ele, cover = true) {
    if (this.disabled) {
      return;
    }
    if (!this.range) {
      return;
    }
    if (!AlexElement.isElement(ele)) {
      throw new Error("The argument must be an AlexElement instance");
    }
    if (ele.isEmpty()) {
      return;
    }
    if (this.range.anchor.isEqual(this.range.focus)) {
      const previousElement = this.getPreviousElementOfPoint(this.range.anchor);
      const nextElement = this.getNextElementOfPoint(this.range.anchor);
      const block = this.range.anchor.element.getBlock();
      const inblock = this.range.anchor.element.getInblock();
      const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1;
      if (ele.isInblock() && ele.behavior == "block" && inblock && inblock.behavior == "block") {
        if (inblock.isOnlyHasBreak() && cover) {
          this.addElementBefore(ele, inblock);
          inblock.toEmpty();
        } else if (this.range.anchor.offset == 0 && !(previousElement && inblock.isContains(previousElement))) {
          this.addElementBefore(ele, inblock);
        } else if (this.range.anchor.offset == endOffset && !(nextElement && inblock.isContains(nextElement))) {
          this.addElementAfter(ele, inblock);
        } else {
          const newInblock = inblock.clone();
          this.addElementAfter(newInblock, inblock);
          this.range.focus.moveToEnd(inblock);
          this.delete();
          const elements = AlexElement.flatElements(inblock.children);
          const index = elements.findIndex((item) => {
            return this.range.anchor.element.isEqual(item);
          });
          const newElements = AlexElement.flatElements(newInblock.children);
          this.range.focus.element = newElements[index];
          this.range.focus.offset = this.range.anchor.offset;
          this.range.anchor.moveToStart(newInblock);
          this.delete();
          this.addElementBefore(ele, newInblock);
        }
      } else if (ele.isInblock() && inblock) {
        if (inblock.isOnlyHasBreak()) {
          this.addElementTo(ele, inblock, 0);
        } else if (this.range.anchor.offset == 0 && !(previousElement && inblock.isContains(previousElement))) {
          this.addElementTo(ele, inblock, 0);
        } else if (this.range.anchor.offset == endOffset && !(nextElement && inblock.isContains(nextElement))) {
          this.addElementTo(ele, inblock, inblock.children.length);
        } else {
          const newInblock = inblock.clone();
          this.addElementAfter(newInblock, inblock);
          this.range.focus.moveToEnd(inblock);
          this.delete();
          const elements = AlexElement.flatElements(inblock.children);
          const index = elements.findIndex((item) => {
            return this.range.anchor.element.isEqual(item);
          });
          const newElements = AlexElement.flatElements(newInblock.children);
          this.range.focus.element = newElements[index];
          this.range.focus.offset = this.range.anchor.offset;
          this.range.anchor.moveToStart(newInblock);
          this.delete();
          this.addElementTo(ele, newInblock);
          this.merge(newInblock, inblock);
        }
      } else if (ele.isInblock()) {
        if (block.isOnlyHasBreak()) {
          this.addElementTo(ele, block, 0);
        } else if (this.range.anchor.offset == 0 && !(previousElement && block.isContains(previousElement))) {
          this.addElementTo(ele, block, 0);
        } else if (this.range.anchor.offset == endOffset && !(nextElement && block.isContains(nextElement))) {
          this.addElementTo(ele, block, block.children.length);
        } else {
          const newBlock = block.clone();
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
          this.addElementTo(ele, newBlock);
          this.merge(newBlock, block);
        }
      } else if (ele.isBlock()) {
        if (block.isOnlyHasBreak() && cover) {
          this.addElementBefore(ele, block);
          block.toEmpty();
        } else if (this.range.anchor.offset == 0 && !(previousElement && block.isContains(previousElement))) {
          this.addElementBefore(ele, block);
        } else if (this.range.anchor.offset == endOffset && !(nextElement && block.isContains(nextElement))) {
          this.addElementAfter(ele, block);
        } else {
          const newBlock = block.clone();
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
      this.insertElement(ele, cover);
    }
  }
  /**
   * 格式化stack
   */
  formatElementStack() {
    const format = (elements, fn, isStack) => {
      if (typeof isStack != "boolean") {
        isStack = false;
      }
      let index = 0;
      while (index < elements.length) {
        if (!elements[index]) {
          elements.splice(index, 1);
          continue;
        }
        if (elements[index].isEmpty()) {
          if (this.range && elements[index].isContains(this.range.anchor.element)) {
            setRecentlyPoint.apply(this, [this.range.anchor]);
          }
          if (this.range && elements[index].isContains(this.range.focus.element)) {
            setRecentlyPoint.apply(this, [this.range.focus]);
          }
          elements.splice(index, 1);
          continue;
        }
        fn.apply(this, [elements[index]]);
        if (elements[index].isEmpty()) {
          if (this.range && elements[index].isContains(this.range.anchor.element)) {
            setRecentlyPoint.apply(this, [this.range.anchor]);
          }
          if (this.range && elements[index].isContains(this.range.focus.element)) {
            setRecentlyPoint.apply(this, [this.range.focus]);
          }
          elements.splice(index, 1);
          continue;
        }
        if (!elements[index].isBlock() && isStack) {
          elements[index].convertToBlock();
        }
        if (elements[index].hasChildren()) {
          format(elements[index].children, fn);
        }
        if (elements[index].isEmpty()) {
          if (this.range && elements[index].isContains(this.range.anchor.element)) {
            setRecentlyPoint.apply(this, [this.range.anchor]);
          }
          if (this.range && elements[index].isContains(this.range.focus.element)) {
            setRecentlyPoint.apply(this, [this.range.focus]);
          }
          elements.splice(index, 1);
          continue;
        }
        index++;
      }
    };
    let renderRules = this.renderRules.filter((fn) => {
      return typeof fn == "function";
    });
    [handleNotStackBlock, handleInblockWithOther, handleInlineChildrenNotInblock, breakFormat, mergeWithParentElement, mergeWithBrotherElement, mergeWithParentElement, mergeWithSpaceTextElement, ...renderRules].forEach((fn) => {
      format(this.stack, fn, true);
    });
    handleStackEmpty.apply(this);
  }
  /**
   * 渲染编辑器dom内容
   * unPushHistory为false表示加入历史记录
   */
  domRender(unPushHistory = false) {
    this.emit("beforeRender");
    const fragment = document.createDocumentFragment();
    this.stack.forEach((element2) => {
      element2.__render();
      fragment.appendChild(element2.elm);
    });
    this.$el.innerHTML = "";
    this.$el.appendChild(fragment);
    const oldValue = this.value;
    this.value = this.$el.innerHTML;
    if (this.__firstRender || oldValue != this.value) {
      if (!this.__firstRender) {
        this.emit("change", this.value, oldValue);
      }
      if (!unPushHistory) {
        this.history.push(this.stack, this.range);
      }
    }
    if (this.__firstRender) {
      this.__firstRender = false;
    }
    this.emit("afterRender");
  }
  /**
   * 根据range来设置真实的光标
   */
  rangeRender() {
    if (this.disabled) {
      return;
    }
    if (this.range) {
      const handler = (point) => {
        let node = null;
        let offset = null;
        if (point.element.isText()) {
          node = point.element.elm.childNodes[0];
          offset = point.offset;
        } else {
          node = point.element.parent.elm;
          const index = point.element.parent.children.findIndex((item) => {
            return point.element.isEqual(item);
          });
          offset = point.offset + index;
        }
        return { node, offset };
      };
      this.__innerSelectionChange = true;
      const anchorResult = handler(this.range.anchor);
      const focusResult = handler(this.range.focus);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        const range = document.createRange();
        range.setStart(anchorResult.node, anchorResult.offset);
        range.setEnd(focusResult.node, focusResult.offset);
        selection.addRange(range);
      }
    } else {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    }
    setTimeout(() => {
      setRangeInVisible.apply(this);
      this.__innerSelectionChange = false;
      this.history.updateCurrentRange(this.range);
      this.emit("rangeUpdate", this.range);
    }, 0);
  }
  /**
   * 将html转为元素
   */
  parseHtml(html) {
    if (!html) {
      throw new Error("You need to give an html content to convert");
    }
    const node = document.createElement("div");
    node.innerHTML = html;
    let elements = [];
    Array.from(node.childNodes).forEach((el) => {
      if (el.nodeType == 1 || el.nodeType == 3) {
        const element2 = this.parseNode(el);
        elements.push(element2);
      }
    });
    return elements;
  }
  /**
   * 将node转为元素
   */
  parseNode(node) {
    if (!(node instanceof Node)) {
      throw new Error("The argument must be an node");
    }
    if (!(node.nodeType == 1 || node.nodeType == 3)) {
      throw new Error("The argument must be an element node or text node");
    }
    if (node.nodeType == 3) {
      return new AlexElement("text", null, null, null, node.textContent);
    }
    const marks = getAttributes(node);
    const styles = getStyles(node);
    const parsedom = node.nodeName.toLocaleLowerCase();
    if (parsedom == "style" || parsedom == "meta" || parsedom == "script" || parsedom == "link") {
      return new AlexElement("text", null, null, null, null);
    }
    const block = blockParse.find((item) => item.parsedom == parsedom);
    const inblock = inblockParse.find((item) => item.parsedom == parsedom);
    const inline = inlineParse.find((item) => item.parsedom == parsedom);
    const closed = closedParse.find((item) => item.parsedom == parsedom);
    let element2 = null;
    let config = {
      type: "inblock",
      parsedom,
      marks,
      styles,
      behavior: "default"
    };
    if (block) {
      config.type = "block";
      if (block.parse) {
        config.parsedom = AlexElement.BLOCK_NODE;
      }
    } else if (inblock) {
      config.type = "inblock";
      if (inblock.block) {
        config.behavior = "block";
      }
    } else if (inline) {
      config.type = "inline";
      if (inline.parse) {
        config.parsedom = AlexElement.TEXT_NODE;
        if (common.isObject(inline.parse)) {
          for (let key in inline.parse) {
            if (typeof inline.parse[key] == "function") {
              config.styles[key] = inline.parse[key].apply(this, [node]);
            } else {
              config.styles[key] = inline.parse[key];
            }
          }
        }
      }
    } else if (closed) {
      config.type = "closed";
    } else {
      config.type = "inline";
      config.parsedom = "span";
    }
    element2 = new AlexElement(config.type, config.parsedom, config.marks, config.styles, null);
    element2.behavior = config.behavior;
    if (!closed) {
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
    }
    if (typeof this.customParseNode == "function") {
      element2 = this.customParseNode.apply(this, [element2]);
    }
    return element2;
  }
  /**
   * 将指定元素与另一个元素进行合并（仅限内部块元素和根级块元素）
   */
  merge(ele, previousEle) {
    if (!AlexElement.isElement(ele)) {
      throw new Error("The first argument must be an AlexElement instance");
    }
    if (!AlexElement.isElement(previousEle)) {
      throw new Error("The second argument must be an AlexElement instance");
    }
    if (!ele.isBlock() && !ele.isInblock() || !previousEle.isBlock() && !previousEle.isInblock()) {
      throw new Error('Elements that are not "block" or "inblock" cannot be merged');
    }
    if (typeof this.customMerge == "function") {
      this.customMerge.apply(this, [ele, previousEle]);
    } else {
      previousEle.children.push(...ele.children);
      previousEle.children.forEach((item) => {
        item.parent = previousEle;
      });
      ele.children = null;
    }
  }
  /**
   * 根据key查询元素
   */
  getElementByKey(key) {
    if (!key) {
      throw new Error("You need to specify a key to do the query");
    }
    const fn = (elements) => {
      let element2 = null;
      const length = elements.length;
      for (let i = 0; i < length; i++) {
        const item = elements[i];
        if (item && item.key === key) {
          element2 = item;
          break;
        }
        if (item && item.hasChildren()) {
          const el = fn(item.children);
          if (el) {
            element2 = el;
            break;
          }
        }
      }
      return element2;
    };
    return fn(this.stack);
  }
  /**
   * 获取指定元素的前一个兄弟元素（会跳过空元素）
   */
  getPreviousElement(ele) {
    if (!AlexElement.isElement(ele)) {
      throw new Error("The argument must be an AlexElement instance");
    }
    if (ele.isBlock()) {
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
  /**
   * 获取指定元素的后一个兄弟元素（会跳过空元素）
   */
  getNextElement(ele) {
    if (!AlexElement.isElement(ele)) {
      throw new Error("The argument must be an AlexElement instance");
    }
    if (ele.isBlock()) {
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
  /**
   * 向上查询可以设置焦点的元素（会跳过空元素）
   */
  getPreviousElementOfPoint(point) {
    if (!AlexPoint.isPoint(point)) {
      throw new Error("The argument must be an AlexPoint instance");
    }
    const fnChild = (children) => {
      let el = null;
      const length = children.length;
      for (let i = length - 1; i >= 0; i--) {
        const child = children[i];
        if (child.isEmpty()) {
          continue;
        }
        if (child.isText() || child.isClosed()) {
          el = child;
          break;
        }
        el = fnChild(child.children);
        if (el) {
          break;
        }
      }
      return el;
    };
    const fn = (element2) => {
      const previousElement = this.getPreviousElement(element2);
      if (previousElement) {
        if (previousElement.isEmpty()) {
          return fn(previousElement);
        }
        if (previousElement.isText() || previousElement.isClosed()) {
          return previousElement;
        }
        return fnChild(previousElement.children);
      }
      if (element2.parent) {
        return fn(element2.parent);
      }
      return null;
    };
    return fn(point.element);
  }
  /**
   * 向下查找可以设置焦点的元素（会跳过空元素）
   */
  getNextElementOfPoint(point) {
    if (!AlexPoint.isPoint(point)) {
      throw new Error("The argument must be an AlexPoint instance");
    }
    const fnChild = (children) => {
      let el = null;
      const length = children.length;
      for (let i = 0; i < length; i++) {
        const child = children[i];
        if (child.isEmpty()) {
          continue;
        }
        if (child.isText() || child.isClosed()) {
          el = child;
          break;
        }
        el = fnChild(child.children);
        if (el) {
          break;
        }
      }
      return el;
    };
    const fn = (element2) => {
      const nextElement = this.getNextElement(element2);
      if (nextElement) {
        if (nextElement.isEmpty()) {
          return fn(nextElement);
        }
        if (nextElement.isText() || nextElement.isClosed()) {
          return nextElement;
        }
        return fnChild(nextElement.children);
      }
      if (element2.parent) {
        return fn(element2.parent);
      }
      return null;
    };
    return fn(point.element);
  }
  /**
   * 获取选区之间的元素，flat参数表示是否返回扁平化的数据
   */
  getElementsByRange() {
    if (!this.range) {
      return {
        list: [],
        flatList: []
      };
    }
    if (this.range.anchor.isEqual(this.range.focus)) {
      return {
        list: [],
        flatList: []
      };
    }
    if (this.range.anchor.element.isEqual(this.range.focus.element)) {
      const isCover = this.range.anchor.offset == 0 && this.range.focus.offset == (this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1);
      return {
        list: [
          {
            element: this.range.anchor.element,
            offset: isCover ? false : [this.range.anchor.offset, this.range.focus.offset]
          }
        ],
        flatList: [
          {
            element: this.range.anchor.element,
            offset: isCover ? false : [this.range.anchor.offset, this.range.focus.offset]
          }
        ]
      };
    }
    const getFlatList = () => {
      let flatList = [];
      const anchorInStart = this.range.anchor.offset == 0;
      const focusInEnd = this.range.focus.offset == (this.range.focus.element.isText() ? this.range.focus.element.textContent.length : 1);
      const anchorBlock = this.range.anchor.element.getBlock();
      const focusBlock = this.range.focus.element.getBlock();
      const anchorBlockIndex = this.stack.findIndex((el) => anchorBlock.isEqual(el));
      const focusBlockIndex = this.stack.findIndex((el) => focusBlock.isEqual(el));
      let elements = AlexElement.flatElements(this.stack.slice(anchorBlockIndex, focusBlockIndex + 1));
      const firstElement = getHighestByFirst(this.range.anchor);
      const startIndex = elements.findIndex((el) => el.isEqual(firstElement ? firstElement : this.range.anchor.element));
      const endIndex = elements.findIndex((el) => el.isEqual(this.range.focus.element));
      if (startIndex > 0 || endIndex < elements.length - 1) {
        elements = elements.slice(startIndex, endIndex + 1);
      }
      const length = elements.length;
      for (let i = 0; i < length; i++) {
        if (this.range.anchor.element.isEqual(elements[i])) {
          if (anchorInStart) {
            flatList.push({
              element: this.range.anchor.element,
              offset: false
            });
          } else if (this.range.anchor.element.isText() && this.range.anchor.offset < this.range.anchor.element.textContent.length) {
            flatList.push({
              element: this.range.anchor.element,
              offset: [this.range.anchor.offset, this.range.anchor.element.textContent.length]
            });
          }
        } else if (elements[i].isContains(this.range.anchor.element)) {
          const isFirst = this.range.anchor.element.isFirst(elements[i]);
          const hasFocus = elements[i].isContains(this.range.focus.element);
          const isLast = this.range.focus.element.isLast(elements[i]);
          if (anchorInStart && isFirst && hasFocus && isLast && focusInEnd) {
            flatList.push({
              element: elements[i],
              offset: false
            });
          } else if (anchorInStart && isFirst && !hasFocus) {
            flatList.push({
              element: elements[i],
              offset: false
            });
          }
        } else if (this.range.focus.element.isEqual(elements[i])) {
          if (focusInEnd) {
            flatList.push({
              element: this.range.focus.element,
              offset: false
            });
          } else if (this.range.focus.offset > 0) {
            flatList.push({
              element: this.range.focus.element,
              offset: [0, this.range.focus.offset]
            });
          }
        } else if (elements[i].isContains(this.range.focus.element)) {
          const isLast = this.range.focus.element.isLast(elements[i]);
          if (isLast && focusInEnd) {
            flatList.push({
              element: elements[i],
              offset: false
            });
          }
        } else {
          flatList.push({
            element: elements[i],
            offset: false
          });
        }
      }
      return flatList;
    };
    const getList = (flatList) => {
      let list = [];
      let blockElements = [];
      let notBlockElements = [];
      const length = flatList.length;
      for (let i = 0; i < length; i++) {
        if (flatList[i].element.isBlock()) {
          list.push(flatList[i]);
          blockElements.push(flatList[i].element);
        } else {
          const block = flatList[i].element.getBlock();
          let hasBlock = false;
          const blockLength = blockElements.length;
          for (let j = blockLength - 1; j >= 0; j--) {
            if (blockElements[j].isEqual(block)) {
              hasBlock = true;
              break;
            }
          }
          if (!hasBlock) {
            const isInclude = notBlockElements.some((el) => el.isContains(flatList[i].element));
            if (!isInclude) {
              list.push(flatList[i]);
              if (flatList[i].element.isInblock() || flatList[i].element.isInline()) {
                notBlockElements.push(flatList[i].element);
              }
            }
          }
        }
      }
      return list;
    };
    const flatListArr = getFlatList();
    const listArr = getList(flatListArr);
    return {
      list: listArr,
      flatList: flatListArr
    };
  }
  /**
   * 将指定元素添加到父元素的子元素数组中
   */
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
  /**
   * 将指定元素添加到另一个元素前面
   */
  addElementBefore(newEle, targetEle) {
    if (!AlexElement.isElement(newEle)) {
      throw new Error("The first argument must be an AlexElement instance");
    }
    if (!AlexElement.isElement(targetEle)) {
      throw new Error("The second argument must be an AlexElement instance");
    }
    if (targetEle.isBlock()) {
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
  /**
   * 将指定元素添加到另一个元素后面
   */
  addElementAfter(newEle, targetEle) {
    if (!AlexElement.isElement(newEle)) {
      throw new Error("The first argument must be an AlexElement instance");
    }
    if (!AlexElement.isElement(targetEle)) {
      throw new Error("The second argument must be an AlexElement instance");
    }
    if (targetEle.isBlock()) {
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
  /**
   * 将虚拟光标设置到指定元素开始处
   */
  collapseToStart(element2) {
    if (this.disabled) {
      return;
    }
    let rangeIsNull = false;
    if (!this.range) {
      this.initRange();
      rangeIsNull = true;
    }
    if (AlexElement.isElement(element2)) {
      this.range.anchor.moveToStart(element2);
      this.range.focus.moveToStart(element2);
    } else {
      const flatElements = AlexElement.flatElements(this.stack).filter((el) => {
        return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom);
      });
      if (flatElements.length == 0) {
        throw new Error("There is no element to set the focus");
      }
      this.range.anchor.moveToStart(flatElements[0]);
      this.range.focus.moveToStart(flatElements[0]);
    }
    if (rangeIsNull) {
      this.history.updateCurrentRange(this.range);
    }
  }
  /**
   * 将虚拟光标设置到指定元素最后
   */
  collapseToEnd(element2) {
    if (this.disabled) {
      return;
    }
    let rangeIsNull = false;
    if (!this.range) {
      this.initRange();
      rangeIsNull = true;
    }
    if (AlexElement.isElement(element2)) {
      this.range.anchor.moveToEnd(element2);
      this.range.focus.moveToEnd(element2);
    } else {
      const flatElements = AlexElement.flatElements(this.stack).filter((el) => {
        return !el.isEmpty() && !AlexElement.VOID_NODES.includes(el.parsedom);
      });
      const length = flatElements.length;
      if (length == 0) {
        throw new Error("There is no element to set the focus");
      }
      this.range.anchor.moveToEnd(flatElements[length - 1]);
      this.range.focus.moveToEnd(flatElements[length - 1]);
    }
    if (rangeIsNull) {
      this.history.updateCurrentRange(this.range);
    }
  }
  /**
   * 禁用编辑器
   */
  setDisabled() {
    this.disabled = true;
    this.$el.removeAttribute("contenteditable");
  }
  /**
   * 启用编辑器
   */
  setEnabled() {
    this.disabled = false;
    this.$el.setAttribute("contenteditable", "true");
  }
  /**
   * 触发自定义事件
   */
  emit(eventName, ...value) {
    if (Array.isArray(this.__events[eventName])) {
      this.__events[eventName].forEach((fn) => {
        fn.apply(this, [...value]);
      });
      return true;
    }
    return false;
  }
  /**
   * 监听自定义事件
   */
  on(eventName, eventHandle) {
    if (!this.__events[eventName]) {
      this.__events[eventName] = [];
    }
    this.__events[eventName].push(eventHandle);
  }
  /**
   * 销毁编辑器的方法
   */
  destroy() {
    this.setDisabled();
    event.off(document, `selectionchange.alex_editor_${this.__guid}`);
    event.off(this.$el, "beforeinput.alex_editor compositionstart.alex_editor compositionupdate.alex_editor compositionend.alex_editor keydown.alex_editor cut.alex_editor paste.alex_editor copy.alex_editor dragstart.alex_editor drop.alex_editor focus.alex_editor blur.alex_editor");
  }
}
export {
  AlexEditor,
  AlexElement,
  AlexHistory,
  AlexPoint,
  AlexRange,
  AlexEditor as default
};
