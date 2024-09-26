var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
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
  trim(str, global2) {
    if (typeof str != "string") {
      throw new TypeError("The first argument must be a string");
    }
    let result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (global2) {
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
    const regExp = new RegExp(`(^on)|(^style$)|(^${NODE_MARK}$)`, "g");
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
     * 唯一key【不可修改】
     */
    __publicField(this, "key", createUniqueKey());
    /**
     * 类型【可以修改】
     */
    __publicField(this, "type");
    /**
     * 渲染标签【可以修改】
     */
    __publicField(this, "tag");
    /**
     * 文本值【可以修改】
     */
    __publicField(this, "textContent");
    /**
     * 标记集合【可以修改】
     */
    __publicField(this, "marks");
    /**
     * 样式集合，样式名称请使用驼峰写法，虽然在渲染时兼容处理了中划线格式的样式名称，但是在其他地方可能会出现问题并且编辑器内部在样式相关的判断都是以驼峰写法为主【可以修改】
     */
    __publicField(this, "styles");
    /**
     * 是否锁定节点【可以修改】
     * 针对块节点，在符合合并条件的情况下不允许编辑器将其与父节点或者子节点进行合并
     * 针对行内节点，在符合合并条件的情况下是否允许编辑器将其与相邻节点或者父节点或者子节点进行合并
     * 针对文本节点，在符合合并的条件下是否允许编辑器将其与相邻节点或者父节点进行合并
     */
    __publicField(this, "locked", false);
    /**
     * 是否为固定块节点，值为true时：当光标在节点起始处或者光标在节点内只有占位符时，执行删除操作不会删除此节点，会再次创建一个占位符进行处理；当光标在节点内且节点不是代码块样式，不会进行换行【可以修改】
     */
    __publicField(this, "fixed", false);
    /**
     * 命名空间【可以修改】
     */
    __publicField(this, "namespace");
    /**
     * 子节点数组【可以修改】
     */
    __publicField(this, "children");
    /**
     * 父节点【可以修改】
     */
    __publicField(this, "parent");
    /**
     * 【API】复制节点，deep 为true表示深度复制，即复制子节点，否则只会复制自身
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
     * 【API】如果当前节点是文本节点或者闭合节点，则判断是不是指定节点后代中所有文本节点和闭合节点中的第一个
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
    /**
     * 【API】获取当前节点下的所有可聚焦的节点，如果自身符合也会包括在内，type是all获取闭合节点和文本节点，type是closed获取闭合节点，type是text获取文本节点
     */
    __publicField(this, "getFocusNodes", (type = "all") => {
      const nodes = [];
      if (this.isClosed() && (type == "all" || type == "closed")) {
        nodes.push(this);
      }
      if (this.isText() && (type == "all" || type == "text")) {
        nodes.push(this);
      }
      if (this.hasChildren()) {
        this.children.forEach((item) => {
          nodes.push(...item.getFocusNodes(type));
        });
      }
      return nodes;
    });
  }
  /**
   * 【API】是否块节点
   */
  isBlock() {
    return this.type == "block";
  }
  /**
   * 【API】是否行内节点
   */
  isInline() {
    return this.type == "inline";
  }
  /**
   * 【API】是否闭合节点
   */
  isClosed() {
    return this.type == "closed";
  }
  /**
   * 【API】是否文本节点
   */
  isText() {
    return this.type == "text";
  }
  /**
   * 【API】获取所在块级节点
   */
  getBlock() {
    if (this.isBlock()) {
      return this;
    }
    return this.parent.getBlock();
  }
  /**
   * 【API】获取所在行内节点
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
   * 【API】是否有子节点
   */
  hasChildren() {
    if (this.isText() || this.isClosed()) {
      return false;
    }
    return Array.isArray(this.children) && !!this.children.length;
  }
  /**
   * 【API】是否空节点
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
   * 【API】是否零宽度无断空白文本节点
   */
  isZeroWidthText() {
    return this.isText() && !this.isEmpty() && isZeroWidthText(this.textContent);
  }
  /**
   * 【API】是否占位符
   */
  isPlaceholder() {
    return this.isClosed() && this.tag == "br";
  }
  /**
   * 【API】是否含有标记
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
   * 【API】是否含有样式
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
   * 【API】判断节点是否不可编辑的，如果是返回设置不可编辑的那个节点，否则返回null
   */
  getUneditable() {
    if (this.hasMarks() && this.marks["contenteditable"] == "false") {
      return this;
    }
    if (!this.parent) {
      return null;
    }
    return this.parent.getUneditable();
  }
  /**
   * 【API】当前节点是否只包含占位符
   */
  allIsPlaceholder() {
    if (this.hasChildren()) {
      const nodes = this.children.filter((item) => !item.isEmpty());
      return nodes.length && nodes.every((el) => el.isPlaceholder());
    }
    return false;
  }
  /**
   * 【API】设置为空节点
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
   * 【API】比较当前节点和另一个节点的styles是否一致
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
   * 【API】比较当前节点和另一个节点的marks是否一致
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
   * 【API】判断当前节点是否在拥有代码块样式的块级节点内（包括自身）
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
   * 【API】判断当前节点是否与另一个节点相同
   */
  isEqual(node) {
    if (!KNode.isKNode(node)) {
      return false;
    }
    return this.key == node.key;
  }
  /**
   * 【API】判断当前节点是否包含指定节点
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
   * 【API】如果当前节点是文本节点或者闭合节点，则判断是不是指定节点后代中所有文本节点和闭合节点中的最后一个
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
   * 【API】获取当前节点在某个节点数组中的前一个非空节点
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
   * 【API】获取当前节点在某个节点数组中的后一个非空节点
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
   * 【API】判断当前节点是否符合指定的条件，marks和styles参数中的属性值可以是true表示只判断是否拥有该标记或者样式，而不关心是什么值
   */
  isMatch(options) {
    if (options.tag && (this.isText() || options.tag != this.tag)) {
      return false;
    }
    if (options.marks) {
      const hasMarks = Object.keys(options.marks).every((key) => {
        if (this.hasMarks()) {
          if (options.marks[key] === true) {
            return this.marks.hasOwnProperty(key);
          }
          return this.marks[key] == options.marks[key];
        }
        return false;
      });
      if (!hasMarks) {
        return false;
      }
    }
    if (options.styles) {
      const hasStyles = Object.keys(options.styles).every((key) => {
        if (this.hasStyles()) {
          if (options.styles[key] === true) {
            return this.styles.hasOwnProperty(key);
          }
          return this.styles[key] == options.styles[key];
        }
        return false;
      });
      if (!hasStyles) {
        return false;
      }
    }
    return true;
  }
  /**
   * 【API】判断当前节点是否存在于符合条件的节点内，包含自身，如果是返回符合条件的节点，否则返回null
   */
  getMatchNode(options) {
    if (this.isMatch(options)) {
      return this;
    }
    if (this.parent) {
      return this.parent.getMatchNode(options);
    }
    return null;
  }
  /**
   * 【API】创建节点
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
   * 【API】创建零宽度无断空白文本节点
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
   * 【API】创建占位符
   */
  static createPlaceholder() {
    return KNode.create({
      type: "closed",
      tag: "br"
    });
  }
  /**
   * 【API】判断参数是否节点
   */
  static isKNode(val) {
    return val instanceof KNode;
  }
  /**
   * 【API】将某个节点数组扁平化处理后返回
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
   * 【API】在指定的节点数组中根据key查找节点
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
    tag: "b"
  },
  {
    tag: "strong"
  },
  {
    tag: "sup"
  },
  {
    tag: "sub"
  },
  {
    tag: "i"
  },
  {
    tag: "u"
  },
  {
    tag: "del"
  },
  {
    tag: "font"
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
const splitInlineParseNode = (editor, node) => {
  if (node.hasChildren()) {
    node.children.forEach((item) => {
      if (!item.isClosed()) {
        item.marks = { ...item.marks || {}, ...node.marks || {} };
        item.styles = { ...item.styles || {}, ...node.styles || {} };
      }
      editor.addNodeBefore(item, node);
      splitInlineParseNode(editor, item);
    });
    node.children = [];
  }
};
const formatBlockInChildren = ({ node }) => {
  if (node.hasChildren() && !node.isEmpty()) {
    const nodes = node.children.filter((item) => {
      return !item.isEmpty() && !item.isPlaceholder();
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
const formatInlineParseText = ({ editor, node }) => {
  if (!node.isEmpty() && node.tag && ["b", "strong", "sup", "sub", "i", "u", "del", "font"].includes(node.tag)) {
    const styles = node.styles || {};
    const marks = node.marks || {};
    switch (node.tag) {
      case "b":
      case "strong":
        node.styles = {
          ...styles,
          fontWeight: "bold"
        };
        break;
      case "sup":
        node.styles = {
          ...styles,
          verticalAlign: "super"
        };
        break;
      case "sub":
        node.styles = {
          ...styles,
          verticalAlign: "sub"
        };
        break;
      case "i":
        node.styles = {
          ...styles,
          fontStyle: "italic"
        };
        break;
      case "u":
        node.styles = {
          ...styles,
          textDecorationLine: "underline"
        };
        break;
      case "del":
        node.styles = {
          ...styles,
          textDecorationLine: "line-through"
        };
        break;
      case "font":
        node.styles = {
          ...styles,
          fontFamily: marks.face || ""
        };
        delete marks.face;
        node.marks = marks;
        break;
    }
    node.tag = editor.textRenderTag;
    splitInlineParseNode(editor, node);
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
const handlerForPasteKeepMarksAndStyles = function(nodes) {
  nodes.forEach((node) => {
    if (!node.isText()) {
      const marks = {};
      const styles = {};
      if (node.hasMarks()) {
        if (node.marks["contenteditable"]) {
          marks["contenteditable"] = node.marks["contenteditable"];
        }
        if (node.marks["name"]) {
          marks["name"] = node.marks["name"];
        }
        if (node.marks["disabled"]) {
          marks["disabled"] = node.marks["disabled"];
        }
        if (node.tag == "video" && node.marks["autoplay"]) {
          marks["autoplay"] = node.marks["autoplay"];
        }
        if (node.tag == "video" && node.marks["loop"]) {
          marks["loop"] = node.marks["loop"];
        }
        if (node.tag == "video" && node.marks["muted"]) {
          marks["muted"] = node.marks["muted"];
        }
        if (node.tag == "video" && node.marks["controls"]) {
          marks["controls"] = node.marks["controls"];
        }
        if (node.tag == "a" && node.marks["href"]) {
          marks["href"] = node.marks["href"];
        }
        if (node.tag == "a" && node.marks["target"]) {
          marks["target"] = node.marks["target"];
        }
        if (node.tag == "col" && node.marks["width"]) {
          marks["width"] = node.marks["width"];
        }
        if (["td", "th"].includes(node.tag) && node.marks["colspan"]) {
          marks["colspan"] = node.marks["colspan"];
        }
        if (["td", "th"].includes(node.tag) && node.marks["rowspan"]) {
          marks["rowspan"] = node.marks["rowspan"];
        }
      }
      if (node.hasStyles()) {
        if (node.isBlock() && node.styles.textIndent) {
          styles.textIndent = node.styles.textIndent;
        }
        if (node.isBlock() && node.styles.textAlign) {
          styles.textAlign = node.styles.textAlign;
        }
        if (node.isBlock() && node.styles.lineHeight) {
          styles.lineHeight = node.styles.lineHeight;
        }
      }
      if (typeof this.pasteKeepMarks == "function") {
        const extendMarks = this.pasteKeepMarks.apply(this, [node]);
        Object.assign(marks, extendMarks);
      }
      if (typeof this.pasteKeepStyles == "function") {
        const extendStyles = this.pasteKeepStyles.apply(this, [node]);
        Object.assign(styles, extendStyles);
      }
      node.marks = marks;
      node.styles = styles;
      if (node.hasChildren()) {
        handlerForPasteKeepMarksAndStyles.apply(this, [node.children]);
      }
    }
  });
};
const handlerForPasteDrop = async function(dataTransfer) {
  const html = dataTransfer.getData("text/html");
  const text = dataTransfer.getData("text/plain");
  const files = dataTransfer.files;
  if (html && this.allowPasteHtml) {
    const nodes = this.htmlParseNode(html).filter((item) => {
      return !item.isEmpty();
    });
    handlerForPasteKeepMarksAndStyles.apply(this, [nodes]);
    const useDefault = typeof this.onPasteHtml == "function" ? await this.onPasteHtml.apply(this, [nodes, html]) : true;
    if (useDefault) {
      this.insertNode(nodes[0]);
      for (let i = nodes.length - 1; i >= 1; i--) {
        this.addNodeAfter(nodes[i], nodes[0]);
      }
      this.setSelectionAfter(nodes[nodes.length - 1], "all");
    }
  } else if (text) {
    const useDefault = typeof this.onPasteText == "function" ? await this.onPasteText.apply(this, [text]) : true;
    if (useDefault) {
      this.insertText(text);
    }
  } else if (files.length) {
    const length = files.length;
    for (let i = 0; i < length; i++) {
      if (files[i].type.startsWith("image/")) {
        const useDefault = typeof this.onPasteImage == "function" ? await this.onPasteImage.apply(this, [files[i]]) : true;
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
          this.insertNode(image);
        }
      } else if (files[i].type.startsWith("video/")) {
        const useDefault = typeof this.onPasteVideo == "function" ? await this.onPasteVideo.apply(this, [files[i]]) : true;
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
          this.insertNode(video);
        }
      } else if (typeof this.onPasteFile == "function") {
        this.onPasteFile.apply(this, [files[i]]);
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
      await handlerForPasteDrop.apply(this, [event2.dataTransfer]);
      this.updateView();
    }
  } else if (event2.inputType == "insertFromDrop") {
    await delay();
    if (event2.dataTransfer && this.allowPaste) {
      await handlerForPasteDrop.apply(this, [event2.dataTransfer]);
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
  var _a, _b, _c, _d;
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
      (_b = (_a = this.commands).undo) == null ? void 0 : _b.call(_a);
    } else if (isRedo(event2)) {
      event2.preventDefault();
      (_d = (_c = this.commands).redo) == null ? void 0 : _d.call(_c);
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
class Extension {
  constructor(name) {
    /**
     * 插件名称
     */
    __publicField(this, "name");
    /**
     * 是否已注册
     */
    __publicField(this, "registered", false);
    /**
     * 额外保留的标签
     */
    __publicField(this, "extraKeepTags", []);
    /**
     * 自定义格式化规则
     */
    __publicField(this, "formatRule");
    /**
     * 自定义dom转为非文本节点的后续处理
     */
    __publicField(this, "domParseNodeCallback");
    /**
     * 节点粘贴保留标记的自定义方法
     */
    __publicField(this, "pasteKeepMarks");
    /**
     * 节点粘贴保留样式的自定义方法
     */
    __publicField(this, "pasteKeepStyles");
    /**
     * 视图更新后回调
     */
    __publicField(this, "afterUpdateView");
    /**
     * 自定义命令
     */
    __publicField(this, "addCommands");
    this.name = name;
  }
  /**
   * 创建插件
   */
  static create(options) {
    const extension = new Extension(options.name);
    if (options.extraKeepTags) extension.extraKeepTags = options.extraKeepTags;
    if (options.formatRule) extension.formatRule = options.formatRule;
    if (options.domParseNodeCallback) extension.domParseNodeCallback = options.domParseNodeCallback;
    if (options.pasteKeepMarks) extension.pasteKeepMarks = options.pasteKeepMarks;
    if (options.pasteKeepStyles) extension.pasteKeepStyles = options.pasteKeepStyles;
    if (options.afterUpdateView) extension.afterUpdateView = options.afterUpdateView;
    if (options.addCommands) extension.addCommands = options.addCommands;
    return extension;
  }
}
const removeTextNodeMarks = (node, markNames) => {
  if (markNames && node.hasMarks()) {
    const marks = {};
    Object.keys(node.marks).forEach((key) => {
      if (!markNames.includes(key)) {
        marks[key] = node.marks[key];
      }
    });
    node.marks = marks;
  } else {
    node.marks = {};
  }
};
const removeTextNodeStyles = (node, styleNames) => {
  if (styleNames && node.hasStyles()) {
    const styles = {};
    Object.keys(node.styles).forEach((key) => {
      if (!styleNames.includes(key)) {
        styles[key] = node.styles[key];
      }
    });
    node.styles = styles;
  } else {
    node.styles = {};
  }
};
const isTextNodeMark = (node, markName, markValue) => {
  if (node.hasMarks()) {
    if (markValue) {
      return node.marks[markName] == markValue;
    }
    return node.marks.hasOwnProperty(markName);
  }
  return false;
};
const isTextNodeStyle = (node, styleName, styleValue) => {
  if (node.hasStyles()) {
    if (styleValue) {
      return node.styles[styleName] == styleValue;
    }
    return node.styles.hasOwnProperty(styleName);
  }
  return false;
};
const getTextNodesBySelection = (editor) => {
  if (!editor.selection.focused() || editor.selection.collapsed()) {
    return [];
  }
  const textNodes = [];
  editor.getSelectedNodes().forEach((item) => {
    if (item.node.isText()) {
      if (item.offset) {
        const textContent = item.node.textContent;
        if (item.offset[0] == 0) {
          const newTextNode = item.node.clone(true);
          editor.addNodeAfter(newTextNode, item.node);
          item.node.textContent = textContent.substring(0, item.offset[1]);
          newTextNode.textContent = textContent.substring(item.offset[1]);
          textNodes.push(item.node);
        } else if (item.offset[1] == textContent.length) {
          const newTextNode = item.node.clone(true);
          editor.addNodeBefore(newTextNode, item.node);
          newTextNode.textContent = textContent.substring(0, item.offset[0]);
          item.node.textContent = textContent.substring(item.offset[0]);
          textNodes.push(item.node);
        } else {
          const newBeforeTextNode = item.node.clone(true);
          const newAfterTextNode = item.node.clone(true);
          editor.addNodeBefore(newBeforeTextNode, item.node);
          editor.addNodeAfter(newAfterTextNode, item.node);
          newBeforeTextNode.textContent = textContent.substring(0, item.offset[0]);
          item.node.textContent = textContent.substring(item.offset[0], item.offset[1]);
          newAfterTextNode.textContent = textContent.substring(item.offset[1]);
          textNodes.push(item.node);
        }
        if (editor.isSelectionInNode(item.node, "start")) {
          editor.setSelectionBefore(item.node, "start");
        }
        if (editor.isSelectionInNode(item.node, "end")) {
          editor.setSelectionAfter(item.node, "end");
        }
      } else {
        textNodes.push(item.node);
      }
    } else if (item.node.hasChildren()) {
      textNodes.push(...item.node.getFocusNodes("text"));
    }
  });
  return textNodes;
};
const TextExtension = Extension.create({
  name: "text",
  addCommands() {
    const isTextStyle = (styleName, styleValue) => {
      if (!this.selection.focused()) {
        return false;
      }
      if (this.selection.collapsed()) {
        const node = this.selection.start.node;
        if (node.isText()) {
          return isTextNodeStyle(node, styleName, styleValue);
        }
        return false;
      }
      return this.getFocusNodesBySelection("text").every((item) => isTextNodeStyle(item, styleName, styleValue));
    };
    const isTextMark = (markName, markValue) => {
      if (!this.selection.focused()) {
        return false;
      }
      if (this.selection.collapsed()) {
        const node = this.selection.start.node;
        if (node.isText()) {
          return isTextNodeMark(node, markName, markValue);
        }
        return false;
      }
      return this.getFocusNodesBySelection("text").every((item) => isTextNodeMark(item, markName, markValue));
    };
    const setTextStyle = async (styles) => {
      if (!this.selection.focused()) {
        return;
      }
      if (this.selection.collapsed()) {
        const node = this.selection.start.node;
        if (node.isZeroWidthText()) {
          if (node.hasStyles()) {
            Object.assign(node.styles, common.clone(styles));
          } else {
            node.styles = common.clone(styles);
          }
        } else if (node.isText()) {
          const newTextNode = KNode.createZeroWidthText();
          newTextNode.styles = common.clone(node.styles);
          newTextNode.marks = common.clone(node.marks);
          if (newTextNode.hasStyles()) {
            Object.assign(newTextNode.styles, common.clone(styles));
          } else {
            newTextNode.styles = common.clone(styles);
          }
          this.insertNode(newTextNode);
        } else {
          const newTextNode = KNode.createZeroWidthText();
          newTextNode.styles = common.clone(styles);
          this.insertNode(newTextNode);
        }
      } else {
        getTextNodesBySelection(this).forEach((item) => {
          if (item.hasStyles()) {
            item.styles = { ...item.styles, ...styles };
          } else {
            item.styles = { ...styles };
          }
        });
      }
      await this.updateView();
    };
    const setTextMark = async (marks) => {
      if (!this.selection.focused()) {
        return;
      }
      if (this.selection.collapsed()) {
        const node = this.selection.start.node;
        if (node.isZeroWidthText()) {
          if (node.hasMarks()) {
            Object.assign(node.marks, common.clone(marks));
          } else {
            node.marks = common.clone(marks);
          }
        } else if (node.isText()) {
          const newTextNode = KNode.createZeroWidthText();
          newTextNode.styles = common.clone(node.styles);
          newTextNode.marks = common.clone(node.marks);
          if (newTextNode.hasMarks()) {
            Object.assign(newTextNode.marks, common.clone(marks));
          } else {
            newTextNode.marks = common.clone(marks);
          }
          this.insertNode(newTextNode);
        } else {
          const newTextNode = KNode.createZeroWidthText();
          newTextNode.marks = common.clone(marks);
          this.insertNode(newTextNode);
        }
      } else {
        getTextNodesBySelection(this).forEach((item) => {
          if (item.hasMarks()) {
            item.marks = { ...item.marks, ...marks };
          } else {
            item.marks = { ...marks };
          }
        });
      }
      await this.updateView();
    };
    const removeTextStyle = async (styleNames) => {
      if (!this.selection.focused()) {
        return;
      }
      if (this.selection.collapsed()) {
        const node = this.selection.start.node;
        if (node.isZeroWidthText()) {
          removeTextNodeStyles(node, styleNames);
        } else if (node.isText()) {
          const newTextNode = KNode.createZeroWidthText();
          newTextNode.styles = common.clone(node.styles);
          newTextNode.marks = common.clone(node.marks);
          removeTextNodeStyles(newTextNode, styleNames);
          this.insertNode(newTextNode);
        }
      } else {
        getTextNodesBySelection(this).forEach((item) => {
          removeTextNodeStyles(item, styleNames);
        });
      }
      await this.updateView();
    };
    const removeTextMark = async (markNames) => {
      if (!this.selection.focused()) {
        return;
      }
      if (this.selection.collapsed()) {
        const node = this.selection.start.node;
        if (node.isZeroWidthText()) {
          removeTextNodeMarks(node, markNames);
        } else if (node.isText()) {
          const newTextNode = KNode.createZeroWidthText();
          newTextNode.styles = common.clone(node.styles);
          newTextNode.marks = common.clone(node.marks);
          removeTextNodeMarks(newTextNode, markNames);
          this.insertNode(newTextNode);
        }
      } else {
        getTextNodesBySelection(this).forEach((item) => {
          removeTextNodeMarks(item, markNames);
        });
      }
      await this.updateView();
    };
    return {
      isTextStyle,
      isTextMark,
      setTextStyle,
      setTextMark,
      removeTextStyle,
      removeTextMark
    };
  }
});
const HistoryExtension = Extension.create({
  name: "history",
  addCommands() {
    const canUndo = () => {
      return this.history.records.length > 1;
    };
    const canRedo = () => {
      return this.history.redoRecords.length > 0;
    };
    const undo = async () => {
      const record = this.history.setUndo();
      if (record) {
        this.stackNodes = record.nodes;
        this.selection = record.selection;
        await this.updateView(true);
      }
    };
    const redo = async () => {
      const record = this.history.setRedo();
      if (record) {
        this.stackNodes = record.nodes;
        this.selection = record.selection;
        await this.updateView(true);
      }
    };
    return {
      canUndo,
      canRedo,
      redo,
      undo
    };
  }
});
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var interact_min = { exports: {} };
interact_min.exports;
(function(module, exports) {
  !function(t, e) {
    module.exports = e();
  }(commonjsGlobal, function() {
    function t(t2, e2) {
      var n2 = Object.keys(t2);
      if (Object.getOwnPropertySymbols) {
        var r2 = Object.getOwnPropertySymbols(t2);
        e2 && (r2 = r2.filter(function(e3) {
          return Object.getOwnPropertyDescriptor(t2, e3).enumerable;
        })), n2.push.apply(n2, r2);
      }
      return n2;
    }
    function e(e2) {
      for (var n2 = 1; n2 < arguments.length; n2++) {
        var r2 = null != arguments[n2] ? arguments[n2] : {};
        n2 % 2 ? t(Object(r2), true).forEach(function(t2) {
          a(e2, t2, r2[t2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(r2)) : t(Object(r2)).forEach(function(t2) {
          Object.defineProperty(e2, t2, Object.getOwnPropertyDescriptor(r2, t2));
        });
      }
      return e2;
    }
    function n(t2) {
      return n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t3) {
        return typeof t3;
      } : function(t3) {
        return t3 && "function" == typeof Symbol && t3.constructor === Symbol && t3 !== Symbol.prototype ? "symbol" : typeof t3;
      }, n(t2);
    }
    function r(t2, e2) {
      if (!(t2 instanceof e2)) throw new TypeError("Cannot call a class as a function");
    }
    function i(t2, e2) {
      for (var n2 = 0; n2 < e2.length; n2++) {
        var r2 = e2[n2];
        r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(t2, d(r2.key), r2);
      }
    }
    function o(t2, e2, n2) {
      return e2 && i(t2.prototype, e2), Object.defineProperty(t2, "prototype", { writable: false }), t2;
    }
    function a(t2, e2, n2) {
      return (e2 = d(e2)) in t2 ? Object.defineProperty(t2, e2, { value: n2, enumerable: true, configurable: true, writable: true }) : t2[e2] = n2, t2;
    }
    function s(t2, e2) {
      if ("function" != typeof e2 && null !== e2) throw new TypeError("Super expression must either be null or a function");
      t2.prototype = Object.create(e2 && e2.prototype, { constructor: { value: t2, writable: true, configurable: true } }), Object.defineProperty(t2, "prototype", { writable: false }), e2 && l(t2, e2);
    }
    function c(t2) {
      return c = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t3) {
        return t3.__proto__ || Object.getPrototypeOf(t3);
      }, c(t2);
    }
    function l(t2, e2) {
      return l = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t3, e3) {
        return t3.__proto__ = e3, t3;
      }, l(t2, e2);
    }
    function u(t2) {
      if (void 0 === t2) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return t2;
    }
    function p(t2) {
      var e2 = function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if ("function" == typeof Proxy) return true;
        try {
          return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          })), true;
        } catch (t3) {
          return false;
        }
      }();
      return function() {
        var n2, r2 = c(t2);
        if (e2) {
          var i2 = c(this).constructor;
          n2 = Reflect.construct(r2, arguments, i2);
        } else n2 = r2.apply(this, arguments);
        return function(t3, e3) {
          if (e3 && ("object" == typeof e3 || "function" == typeof e3)) return e3;
          if (void 0 !== e3) throw new TypeError("Derived constructors may only return object or undefined");
          return u(t3);
        }(this, n2);
      };
    }
    function f() {
      return f = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function(t2, e2, n2) {
        var r2 = function(t3, e3) {
          for (; !Object.prototype.hasOwnProperty.call(t3, e3) && null !== (t3 = c(t3)); ) ;
          return t3;
        }(t2, e2);
        if (r2) {
          var i2 = Object.getOwnPropertyDescriptor(r2, e2);
          return i2.get ? i2.get.call(arguments.length < 3 ? t2 : n2) : i2.value;
        }
      }, f.apply(this, arguments);
    }
    function d(t2) {
      var e2 = function(t3, e3) {
        if ("object" != typeof t3 || null === t3) return t3;
        var n2 = t3[Symbol.toPrimitive];
        if (void 0 !== n2) {
          var r2 = n2.call(t3, e3);
          if ("object" != typeof r2) return r2;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return String(t3);
      }(t2, "string");
      return "symbol" == typeof e2 ? e2 : e2 + "";
    }
    var h = function(t2) {
      return !(!t2 || !t2.Window) && t2 instanceof t2.Window;
    }, v = void 0, g = void 0;
    function m(t2) {
      v = t2;
      var e2 = t2.document.createTextNode("");
      e2.ownerDocument !== t2.document && "function" == typeof t2.wrap && t2.wrap(e2) === e2 && (t2 = t2.wrap(t2)), g = t2;
    }
    function y(t2) {
      return h(t2) ? t2 : (t2.ownerDocument || t2).defaultView || g.window;
    }
    "undefined" != typeof window && window && m(window);
    var b = function(t2) {
      return !!t2 && "object" === n(t2);
    }, x = function(t2) {
      return "function" == typeof t2;
    }, w = { window: function(t2) {
      return t2 === g || h(t2);
    }, docFrag: function(t2) {
      return b(t2) && 11 === t2.nodeType;
    }, object: b, func: x, number: function(t2) {
      return "number" == typeof t2;
    }, bool: function(t2) {
      return "boolean" == typeof t2;
    }, string: function(t2) {
      return "string" == typeof t2;
    }, element: function(t2) {
      if (!t2 || "object" !== n(t2)) return false;
      var e2 = y(t2) || g;
      return /object|function/.test("undefined" == typeof Element ? "undefined" : n(Element)) ? t2 instanceof Element || t2 instanceof e2.Element : 1 === t2.nodeType && "string" == typeof t2.nodeName;
    }, plainObject: function(t2) {
      return b(t2) && !!t2.constructor && /function Object\b/.test(t2.constructor.toString());
    }, array: function(t2) {
      return b(t2) && void 0 !== t2.length && x(t2.splice);
    } };
    function E(t2) {
      var e2 = t2.interaction;
      if ("drag" === e2.prepared.name) {
        var n2 = e2.prepared.axis;
        "x" === n2 ? (e2.coords.cur.page.y = e2.coords.start.page.y, e2.coords.cur.client.y = e2.coords.start.client.y, e2.coords.velocity.client.y = 0, e2.coords.velocity.page.y = 0) : "y" === n2 && (e2.coords.cur.page.x = e2.coords.start.page.x, e2.coords.cur.client.x = e2.coords.start.client.x, e2.coords.velocity.client.x = 0, e2.coords.velocity.page.x = 0);
      }
    }
    function T(t2) {
      var e2 = t2.iEvent, n2 = t2.interaction;
      if ("drag" === n2.prepared.name) {
        var r2 = n2.prepared.axis;
        if ("x" === r2 || "y" === r2) {
          var i2 = "x" === r2 ? "y" : "x";
          e2.page[i2] = n2.coords.start.page[i2], e2.client[i2] = n2.coords.start.client[i2], e2.delta[i2] = 0;
        }
      }
    }
    var S = { id: "actions/drag", install: function(t2) {
      var e2 = t2.actions, n2 = t2.Interactable, r2 = t2.defaults;
      n2.prototype.draggable = S.draggable, e2.map.drag = S, e2.methodDict.drag = "draggable", r2.actions.drag = S.defaults;
    }, listeners: { "interactions:before-action-move": E, "interactions:action-resume": E, "interactions:action-move": T, "auto-start:check": function(t2) {
      var e2 = t2.interaction, n2 = t2.interactable, r2 = t2.buttons, i2 = n2.options.drag;
      if (i2 && i2.enabled && (!e2.pointerIsDown || !/mouse|pointer/.test(e2.pointerType) || 0 != (r2 & n2.options.drag.mouseButtons))) return t2.action = { name: "drag", axis: "start" === i2.lockAxis ? i2.startAxis : i2.lockAxis }, false;
    } }, draggable: function(t2) {
      return w.object(t2) ? (this.options.drag.enabled = false !== t2.enabled, this.setPerAction("drag", t2), this.setOnEvents("drag", t2), /^(xy|x|y|start)$/.test(t2.lockAxis) && (this.options.drag.lockAxis = t2.lockAxis), /^(xy|x|y)$/.test(t2.startAxis) && (this.options.drag.startAxis = t2.startAxis), this) : w.bool(t2) ? (this.options.drag.enabled = t2, this) : this.options.drag;
    }, beforeMove: E, move: T, defaults: { startAxis: "xy", lockAxis: "xy" }, getCursor: function() {
      return "move";
    }, filterEventType: function(t2) {
      return 0 === t2.search("drag");
    } }, _ = S, P = { init: function(t2) {
      var e2 = t2;
      P.document = e2.document, P.DocumentFragment = e2.DocumentFragment || O, P.SVGElement = e2.SVGElement || O, P.SVGSVGElement = e2.SVGSVGElement || O, P.SVGElementInstance = e2.SVGElementInstance || O, P.Element = e2.Element || O, P.HTMLElement = e2.HTMLElement || P.Element, P.Event = e2.Event, P.Touch = e2.Touch || O, P.PointerEvent = e2.PointerEvent || e2.MSPointerEvent;
    }, document: null, DocumentFragment: null, SVGElement: null, SVGSVGElement: null, SVGElementInstance: null, Element: null, HTMLElement: null, Event: null, Touch: null, PointerEvent: null };
    function O() {
    }
    var k = P;
    var D = { init: function(t2) {
      var e2 = k.Element, n2 = t2.navigator || {};
      D.supportsTouch = "ontouchstart" in t2 || w.func(t2.DocumentTouch) && k.document instanceof t2.DocumentTouch, D.supportsPointerEvent = false !== n2.pointerEnabled && !!k.PointerEvent, D.isIOS = /iP(hone|od|ad)/.test(n2.platform), D.isIOS7 = /iP(hone|od|ad)/.test(n2.platform) && /OS 7[^\d]/.test(n2.appVersion), D.isIe9 = /MSIE 9/.test(n2.userAgent), D.isOperaMobile = "Opera" === n2.appName && D.supportsTouch && /Presto/.test(n2.userAgent), D.prefixedMatchesSelector = "matches" in e2.prototype ? "matches" : "webkitMatchesSelector" in e2.prototype ? "webkitMatchesSelector" : "mozMatchesSelector" in e2.prototype ? "mozMatchesSelector" : "oMatchesSelector" in e2.prototype ? "oMatchesSelector" : "msMatchesSelector", D.pEventTypes = D.supportsPointerEvent ? k.PointerEvent === t2.MSPointerEvent ? { up: "MSPointerUp", down: "MSPointerDown", over: "mouseover", out: "mouseout", move: "MSPointerMove", cancel: "MSPointerCancel" } : { up: "pointerup", down: "pointerdown", over: "pointerover", out: "pointerout", move: "pointermove", cancel: "pointercancel" } : null, D.wheelEvent = k.document && "onmousewheel" in k.document ? "mousewheel" : "wheel";
    }, supportsTouch: null, supportsPointerEvent: null, isIOS7: null, isIOS: null, isIe9: null, isOperaMobile: null, prefixedMatchesSelector: null, pEventTypes: null, wheelEvent: null };
    var I = D;
    function M(t2, e2) {
      if (t2.contains) return t2.contains(e2);
      for (; e2; ) {
        if (e2 === t2) return true;
        e2 = e2.parentNode;
      }
      return false;
    }
    function z(t2, e2) {
      for (; w.element(t2); ) {
        if (R(t2, e2)) return t2;
        t2 = A(t2);
      }
      return null;
    }
    function A(t2) {
      var e2 = t2.parentNode;
      if (w.docFrag(e2)) {
        for (; (e2 = e2.host) && w.docFrag(e2); ) ;
        return e2;
      }
      return e2;
    }
    function R(t2, e2) {
      return g !== v && (e2 = e2.replace(/\/deep\//g, " ")), t2[I.prefixedMatchesSelector](e2);
    }
    var C = function(t2) {
      return t2.parentNode || t2.host;
    };
    function j(t2, e2) {
      for (var n2, r2 = [], i2 = t2; (n2 = C(i2)) && i2 !== e2 && n2 !== i2.ownerDocument; ) r2.unshift(i2), i2 = n2;
      return r2;
    }
    function F(t2, e2, n2) {
      for (; w.element(t2); ) {
        if (R(t2, e2)) return true;
        if ((t2 = A(t2)) === n2) return R(t2, e2);
      }
      return false;
    }
    function X(t2) {
      return t2.correspondingUseElement || t2;
    }
    function Y(t2) {
      var e2 = t2 instanceof k.SVGElement ? t2.getBoundingClientRect() : t2.getClientRects()[0];
      return e2 && { left: e2.left, right: e2.right, top: e2.top, bottom: e2.bottom, width: e2.width || e2.right - e2.left, height: e2.height || e2.bottom - e2.top };
    }
    function L(t2) {
      var e2, n2 = Y(t2);
      if (!I.isIOS7 && n2) {
        var r2 = { x: (e2 = (e2 = y(t2)) || g).scrollX || e2.document.documentElement.scrollLeft, y: e2.scrollY || e2.document.documentElement.scrollTop };
        n2.left += r2.x, n2.right += r2.x, n2.top += r2.y, n2.bottom += r2.y;
      }
      return n2;
    }
    function q(t2) {
      for (var e2 = []; t2; ) e2.push(t2), t2 = A(t2);
      return e2;
    }
    function B(t2) {
      return !!w.string(t2) && (k.document.querySelector(t2), true);
    }
    function V(t2, e2) {
      for (var n2 in e2) t2[n2] = e2[n2];
      return t2;
    }
    function W(t2, e2, n2) {
      return "parent" === t2 ? A(n2) : "self" === t2 ? e2.getRect(n2) : z(n2, t2);
    }
    function G(t2, e2, n2, r2) {
      var i2 = t2;
      return w.string(i2) ? i2 = W(i2, e2, n2) : w.func(i2) && (i2 = i2.apply(void 0, r2)), w.element(i2) && (i2 = L(i2)), i2;
    }
    function N(t2) {
      return t2 && { x: "x" in t2 ? t2.x : t2.left, y: "y" in t2 ? t2.y : t2.top };
    }
    function U(t2) {
      return !t2 || "x" in t2 && "y" in t2 || ((t2 = V({}, t2)).x = t2.left || 0, t2.y = t2.top || 0, t2.width = t2.width || (t2.right || 0) - t2.x, t2.height = t2.height || (t2.bottom || 0) - t2.y), t2;
    }
    function H(t2, e2, n2) {
      t2.left && (e2.left += n2.x), t2.right && (e2.right += n2.x), t2.top && (e2.top += n2.y), t2.bottom && (e2.bottom += n2.y), e2.width = e2.right - e2.left, e2.height = e2.bottom - e2.top;
    }
    function K(t2, e2, n2) {
      var r2 = n2 && t2.options[n2];
      return N(G(r2 && r2.origin || t2.options.origin, t2, e2, [t2 && e2])) || { x: 0, y: 0 };
    }
    function $(t2, e2) {
      var n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function(t3) {
        return true;
      }, r2 = arguments.length > 3 ? arguments[3] : void 0;
      if (r2 = r2 || {}, w.string(t2) && -1 !== t2.search(" ") && (t2 = J(t2)), w.array(t2)) return t2.forEach(function(t3) {
        return $(t3, e2, n2, r2);
      }), r2;
      if (w.object(t2) && (e2 = t2, t2 = ""), w.func(e2) && n2(t2)) r2[t2] = r2[t2] || [], r2[t2].push(e2);
      else if (w.array(e2)) for (var i2 = 0, o2 = e2; i2 < o2.length; i2++) {
        var a2 = o2[i2];
        $(t2, a2, n2, r2);
      }
      else if (w.object(e2)) for (var s2 in e2) {
        $(J(s2).map(function(e3) {
          return "".concat(t2).concat(e3);
        }), e2[s2], n2, r2);
      }
      return r2;
    }
    function J(t2) {
      return t2.trim().split(/ +/);
    }
    var Q = function(t2, e2) {
      return Math.sqrt(t2 * t2 + e2 * e2);
    }, Z = ["webkit", "moz"];
    function tt(t2, e2) {
      t2.__set || (t2.__set = {});
      var n2 = function(n3) {
        if (Z.some(function(t3) {
          return 0 === n3.indexOf(t3);
        })) return 1;
        "function" != typeof t2[n3] && "__set" !== n3 && Object.defineProperty(t2, n3, { get: function() {
          return n3 in t2.__set ? t2.__set[n3] : t2.__set[n3] = e2[n3];
        }, set: function(e3) {
          t2.__set[n3] = e3;
        }, configurable: true });
      };
      for (var r2 in e2) n2(r2);
      return t2;
    }
    function et(t2, e2) {
      t2.page = t2.page || {}, t2.page.x = e2.page.x, t2.page.y = e2.page.y, t2.client = t2.client || {}, t2.client.x = e2.client.x, t2.client.y = e2.client.y, t2.timeStamp = e2.timeStamp;
    }
    function nt(t2) {
      t2.page.x = 0, t2.page.y = 0, t2.client.x = 0, t2.client.y = 0;
    }
    function rt(t2) {
      return t2 instanceof k.Event || t2 instanceof k.Touch;
    }
    function it(t2, e2, n2) {
      return t2 = t2 || "page", (n2 = n2 || {}).x = e2[t2 + "X"], n2.y = e2[t2 + "Y"], n2;
    }
    function ot(t2, e2) {
      return e2 = e2 || { x: 0, y: 0 }, I.isOperaMobile && rt(t2) ? (it("screen", t2, e2), e2.x += window.scrollX, e2.y += window.scrollY) : it("page", t2, e2), e2;
    }
    function at(t2) {
      return w.number(t2.pointerId) ? t2.pointerId : t2.identifier;
    }
    function st(t2, e2, n2) {
      var r2 = e2.length > 1 ? lt(e2) : e2[0];
      ot(r2, t2.page), function(t3, e3) {
        e3 = e3 || {}, I.isOperaMobile && rt(t3) ? it("screen", t3, e3) : it("client", t3, e3);
      }(r2, t2.client), t2.timeStamp = n2;
    }
    function ct(t2) {
      var e2 = [];
      return w.array(t2) ? (e2[0] = t2[0], e2[1] = t2[1]) : "touchend" === t2.type ? 1 === t2.touches.length ? (e2[0] = t2.touches[0], e2[1] = t2.changedTouches[0]) : 0 === t2.touches.length && (e2[0] = t2.changedTouches[0], e2[1] = t2.changedTouches[1]) : (e2[0] = t2.touches[0], e2[1] = t2.touches[1]), e2;
    }
    function lt(t2) {
      for (var e2 = { pageX: 0, pageY: 0, clientX: 0, clientY: 0, screenX: 0, screenY: 0 }, n2 = 0; n2 < t2.length; n2++) {
        var r2 = t2[n2];
        for (var i2 in e2) e2[i2] += r2[i2];
      }
      for (var o2 in e2) e2[o2] /= t2.length;
      return e2;
    }
    function ut(t2) {
      if (!t2.length) return null;
      var e2 = ct(t2), n2 = Math.min(e2[0].pageX, e2[1].pageX), r2 = Math.min(e2[0].pageY, e2[1].pageY), i2 = Math.max(e2[0].pageX, e2[1].pageX), o2 = Math.max(e2[0].pageY, e2[1].pageY);
      return { x: n2, y: r2, left: n2, top: r2, right: i2, bottom: o2, width: i2 - n2, height: o2 - r2 };
    }
    function pt(t2, e2) {
      var n2 = e2 + "X", r2 = e2 + "Y", i2 = ct(t2), o2 = i2[0][n2] - i2[1][n2], a2 = i2[0][r2] - i2[1][r2];
      return Q(o2, a2);
    }
    function ft(t2, e2) {
      var n2 = e2 + "X", r2 = e2 + "Y", i2 = ct(t2), o2 = i2[1][n2] - i2[0][n2], a2 = i2[1][r2] - i2[0][r2];
      return 180 * Math.atan2(a2, o2) / Math.PI;
    }
    function dt(t2) {
      return w.string(t2.pointerType) ? t2.pointerType : w.number(t2.pointerType) ? [void 0, void 0, "touch", "pen", "mouse"][t2.pointerType] : /touch/.test(t2.type || "") || t2 instanceof k.Touch ? "touch" : "mouse";
    }
    function ht(t2) {
      var e2 = w.func(t2.composedPath) ? t2.composedPath() : t2.path;
      return [X(e2 ? e2[0] : t2.target), X(t2.currentTarget)];
    }
    var vt = function() {
      function t2(e2) {
        r(this, t2), this.immediatePropagationStopped = false, this.propagationStopped = false, this._interaction = e2;
      }
      return o(t2, [{ key: "preventDefault", value: function() {
      } }, { key: "stopPropagation", value: function() {
        this.propagationStopped = true;
      } }, { key: "stopImmediatePropagation", value: function() {
        this.immediatePropagationStopped = this.propagationStopped = true;
      } }]), t2;
    }();
    Object.defineProperty(vt.prototype, "interaction", { get: function() {
      return this._interaction._proxy;
    }, set: function() {
    } });
    var gt = function(t2, e2) {
      for (var n2 = 0; n2 < e2.length; n2++) {
        var r2 = e2[n2];
        t2.push(r2);
      }
      return t2;
    }, mt = function(t2) {
      return gt([], t2);
    }, yt = function(t2, e2) {
      for (var n2 = 0; n2 < t2.length; n2++) if (e2(t2[n2], n2, t2)) return n2;
      return -1;
    }, bt = function(t2, e2) {
      return t2[yt(t2, e2)];
    }, xt = function(t2) {
      s(n2, t2);
      var e2 = p(n2);
      function n2(t3, i2, o2) {
        var a2;
        r(this, n2), (a2 = e2.call(this, i2._interaction)).dropzone = void 0, a2.dragEvent = void 0, a2.relatedTarget = void 0, a2.draggable = void 0, a2.propagationStopped = false, a2.immediatePropagationStopped = false;
        var s2 = "dragleave" === o2 ? t3.prev : t3.cur, c2 = s2.element, l2 = s2.dropzone;
        return a2.type = o2, a2.target = c2, a2.currentTarget = c2, a2.dropzone = l2, a2.dragEvent = i2, a2.relatedTarget = i2.target, a2.draggable = i2.interactable, a2.timeStamp = i2.timeStamp, a2;
      }
      return o(n2, [{ key: "reject", value: function() {
        var t3 = this, e3 = this._interaction.dropState;
        if ("dropactivate" === this.type || this.dropzone && e3.cur.dropzone === this.dropzone && e3.cur.element === this.target) if (e3.prev.dropzone = this.dropzone, e3.prev.element = this.target, e3.rejected = true, e3.events.enter = null, this.stopImmediatePropagation(), "dropactivate" === this.type) {
          var r2 = e3.activeDrops, i2 = yt(r2, function(e4) {
            var n3 = e4.dropzone, r3 = e4.element;
            return n3 === t3.dropzone && r3 === t3.target;
          });
          e3.activeDrops.splice(i2, 1);
          var o2 = new n2(e3, this.dragEvent, "dropdeactivate");
          o2.dropzone = this.dropzone, o2.target = this.target, this.dropzone.fire(o2);
        } else this.dropzone.fire(new n2(e3, this.dragEvent, "dragleave"));
      } }, { key: "preventDefault", value: function() {
      } }, { key: "stopPropagation", value: function() {
        this.propagationStopped = true;
      } }, { key: "stopImmediatePropagation", value: function() {
        this.immediatePropagationStopped = this.propagationStopped = true;
      } }]), n2;
    }(vt);
    function wt(t2, e2) {
      for (var n2 = 0, r2 = t2.slice(); n2 < r2.length; n2++) {
        var i2 = r2[n2], o2 = i2.dropzone, a2 = i2.element;
        e2.dropzone = o2, e2.target = a2, o2.fire(e2), e2.propagationStopped = e2.immediatePropagationStopped = false;
      }
    }
    function Et(t2, e2) {
      for (var n2 = function(t3, e3) {
        for (var n3 = [], r3 = 0, i3 = t3.interactables.list; r3 < i3.length; r3++) {
          var o2 = i3[r3];
          if (o2.options.drop.enabled) {
            var a2 = o2.options.drop.accept;
            if (!(w.element(a2) && a2 !== e3 || w.string(a2) && !R(e3, a2) || w.func(a2) && !a2({ dropzone: o2, draggableElement: e3 }))) for (var s2 = 0, c2 = o2.getAllElements(); s2 < c2.length; s2++) {
              var l2 = c2[s2];
              l2 !== e3 && n3.push({ dropzone: o2, element: l2, rect: o2.getRect(l2) });
            }
          }
        }
        return n3;
      }(t2, e2), r2 = 0; r2 < n2.length; r2++) {
        var i2 = n2[r2];
        i2.rect = i2.dropzone.getRect(i2.element);
      }
      return n2;
    }
    function Tt(t2, e2, n2) {
      for (var r2 = t2.dropState, i2 = t2.interactable, o2 = t2.element, a2 = [], s2 = 0, c2 = r2.activeDrops; s2 < c2.length; s2++) {
        var l2 = c2[s2], u2 = l2.dropzone, p2 = l2.element, f2 = l2.rect, d2 = u2.dropCheck(e2, n2, i2, o2, p2, f2);
        a2.push(d2 ? p2 : null);
      }
      var h2 = function(t3) {
        for (var e3, n3, r3, i3 = [], o3 = 0; o3 < t3.length; o3++) {
          var a3 = t3[o3], s3 = t3[e3];
          if (a3 && o3 !== e3) if (s3) {
            var c3 = C(a3), l3 = C(s3);
            if (c3 !== a3.ownerDocument) if (l3 !== a3.ownerDocument) if (c3 !== l3) {
              i3 = i3.length ? i3 : j(s3);
              var u3 = void 0;
              if (s3 instanceof k.HTMLElement && a3 instanceof k.SVGElement && !(a3 instanceof k.SVGSVGElement)) {
                if (a3 === l3) continue;
                u3 = a3.ownerSVGElement;
              } else u3 = a3;
              for (var p3 = j(u3, s3.ownerDocument), f3 = 0; p3[f3] && p3[f3] === i3[f3]; ) f3++;
              var d3 = [p3[f3 - 1], p3[f3], i3[f3]];
              if (d3[0]) for (var h3 = d3[0].lastChild; h3; ) {
                if (h3 === d3[1]) {
                  e3 = o3, i3 = p3;
                  break;
                }
                if (h3 === d3[2]) break;
                h3 = h3.previousSibling;
              }
            } else r3 = s3, (parseInt(y(n3 = a3).getComputedStyle(n3).zIndex, 10) || 0) >= (parseInt(y(r3).getComputedStyle(r3).zIndex, 10) || 0) && (e3 = o3);
            else e3 = o3;
          } else e3 = o3;
        }
        return e3;
      }(a2);
      return r2.activeDrops[h2] || null;
    }
    function St(t2, e2, n2) {
      var r2 = t2.dropState, i2 = { enter: null, leave: null, activate: null, deactivate: null, move: null, drop: null };
      return "dragstart" === n2.type && (i2.activate = new xt(r2, n2, "dropactivate"), i2.activate.target = null, i2.activate.dropzone = null), "dragend" === n2.type && (i2.deactivate = new xt(r2, n2, "dropdeactivate"), i2.deactivate.target = null, i2.deactivate.dropzone = null), r2.rejected || (r2.cur.element !== r2.prev.element && (r2.prev.dropzone && (i2.leave = new xt(r2, n2, "dragleave"), n2.dragLeave = i2.leave.target = r2.prev.element, n2.prevDropzone = i2.leave.dropzone = r2.prev.dropzone), r2.cur.dropzone && (i2.enter = new xt(r2, n2, "dragenter"), n2.dragEnter = r2.cur.element, n2.dropzone = r2.cur.dropzone)), "dragend" === n2.type && r2.cur.dropzone && (i2.drop = new xt(r2, n2, "drop"), n2.dropzone = r2.cur.dropzone, n2.relatedTarget = r2.cur.element), "dragmove" === n2.type && r2.cur.dropzone && (i2.move = new xt(r2, n2, "dropmove"), n2.dropzone = r2.cur.dropzone)), i2;
    }
    function _t(t2, e2) {
      var n2 = t2.dropState, r2 = n2.activeDrops, i2 = n2.cur, o2 = n2.prev;
      e2.leave && o2.dropzone.fire(e2.leave), e2.enter && i2.dropzone.fire(e2.enter), e2.move && i2.dropzone.fire(e2.move), e2.drop && i2.dropzone.fire(e2.drop), e2.deactivate && wt(r2, e2.deactivate), n2.prev.dropzone = i2.dropzone, n2.prev.element = i2.element;
    }
    function Pt(t2, e2) {
      var n2 = t2.interaction, r2 = t2.iEvent, i2 = t2.event;
      if ("dragmove" === r2.type || "dragend" === r2.type) {
        var o2 = n2.dropState;
        e2.dynamicDrop && (o2.activeDrops = Et(e2, n2.element));
        var a2 = r2, s2 = Tt(n2, a2, i2);
        o2.rejected = o2.rejected && !!s2 && s2.dropzone === o2.cur.dropzone && s2.element === o2.cur.element, o2.cur.dropzone = s2 && s2.dropzone, o2.cur.element = s2 && s2.element, o2.events = St(n2, 0, a2);
      }
    }
    var Ot = { id: "actions/drop", install: function(t2) {
      var e2 = t2.actions, n2 = t2.interactStatic, r2 = t2.Interactable, i2 = t2.defaults;
      t2.usePlugin(_), r2.prototype.dropzone = function(t3) {
        return function(t4, e3) {
          if (w.object(e3)) {
            if (t4.options.drop.enabled = false !== e3.enabled, e3.listeners) {
              var n3 = $(e3.listeners), r3 = Object.keys(n3).reduce(function(t5, e4) {
                return t5[/^(enter|leave)/.test(e4) ? "drag".concat(e4) : /^(activate|deactivate|move)/.test(e4) ? "drop".concat(e4) : e4] = n3[e4], t5;
              }, {}), i3 = t4.options.drop.listeners;
              i3 && t4.off(i3), t4.on(r3), t4.options.drop.listeners = r3;
            }
            return w.func(e3.ondrop) && t4.on("drop", e3.ondrop), w.func(e3.ondropactivate) && t4.on("dropactivate", e3.ondropactivate), w.func(e3.ondropdeactivate) && t4.on("dropdeactivate", e3.ondropdeactivate), w.func(e3.ondragenter) && t4.on("dragenter", e3.ondragenter), w.func(e3.ondragleave) && t4.on("dragleave", e3.ondragleave), w.func(e3.ondropmove) && t4.on("dropmove", e3.ondropmove), /^(pointer|center)$/.test(e3.overlap) ? t4.options.drop.overlap = e3.overlap : w.number(e3.overlap) && (t4.options.drop.overlap = Math.max(Math.min(1, e3.overlap), 0)), "accept" in e3 && (t4.options.drop.accept = e3.accept), "checker" in e3 && (t4.options.drop.checker = e3.checker), t4;
          }
          if (w.bool(e3)) return t4.options.drop.enabled = e3, t4;
          return t4.options.drop;
        }(this, t3);
      }, r2.prototype.dropCheck = function(t3, e3, n3, r3, i3, o2) {
        return function(t4, e4, n4, r4, i4, o3, a2) {
          var s2 = false;
          if (!(a2 = a2 || t4.getRect(o3))) return !!t4.options.drop.checker && t4.options.drop.checker(e4, n4, s2, t4, o3, r4, i4);
          var c2 = t4.options.drop.overlap;
          if ("pointer" === c2) {
            var l2 = K(r4, i4, "drag"), u2 = ot(e4);
            u2.x += l2.x, u2.y += l2.y;
            var p2 = u2.x > a2.left && u2.x < a2.right, f2 = u2.y > a2.top && u2.y < a2.bottom;
            s2 = p2 && f2;
          }
          var d2 = r4.getRect(i4);
          if (d2 && "center" === c2) {
            var h2 = d2.left + d2.width / 2, v2 = d2.top + d2.height / 2;
            s2 = h2 >= a2.left && h2 <= a2.right && v2 >= a2.top && v2 <= a2.bottom;
          }
          if (d2 && w.number(c2)) {
            s2 = Math.max(0, Math.min(a2.right, d2.right) - Math.max(a2.left, d2.left)) * Math.max(0, Math.min(a2.bottom, d2.bottom) - Math.max(a2.top, d2.top)) / (d2.width * d2.height) >= c2;
          }
          t4.options.drop.checker && (s2 = t4.options.drop.checker(e4, n4, s2, t4, o3, r4, i4));
          return s2;
        }(this, t3, e3, n3, r3, i3, o2);
      }, n2.dynamicDrop = function(e3) {
        return w.bool(e3) ? (t2.dynamicDrop = e3, n2) : t2.dynamicDrop;
      }, V(e2.phaselessTypes, { dragenter: true, dragleave: true, dropactivate: true, dropdeactivate: true, dropmove: true, drop: true }), e2.methodDict.drop = "dropzone", t2.dynamicDrop = false, i2.actions.drop = Ot.defaults;
    }, listeners: { "interactions:before-action-start": function(t2) {
      var e2 = t2.interaction;
      "drag" === e2.prepared.name && (e2.dropState = { cur: { dropzone: null, element: null }, prev: { dropzone: null, element: null }, rejected: null, events: null, activeDrops: [] });
    }, "interactions:after-action-start": function(t2, e2) {
      var n2 = t2.interaction, r2 = (t2.event, t2.iEvent);
      if ("drag" === n2.prepared.name) {
        var i2 = n2.dropState;
        i2.activeDrops = [], i2.events = {}, i2.activeDrops = Et(e2, n2.element), i2.events = St(n2, 0, r2), i2.events.activate && (wt(i2.activeDrops, i2.events.activate), e2.fire("actions/drop:start", { interaction: n2, dragEvent: r2 }));
      }
    }, "interactions:action-move": Pt, "interactions:after-action-move": function(t2, e2) {
      var n2 = t2.interaction, r2 = t2.iEvent;
      if ("drag" === n2.prepared.name) {
        var i2 = n2.dropState;
        _t(n2, i2.events), e2.fire("actions/drop:move", { interaction: n2, dragEvent: r2 }), i2.events = {};
      }
    }, "interactions:action-end": function(t2, e2) {
      if ("drag" === t2.interaction.prepared.name) {
        var n2 = t2.interaction, r2 = t2.iEvent;
        Pt(t2, e2), _t(n2, n2.dropState.events), e2.fire("actions/drop:end", { interaction: n2, dragEvent: r2 });
      }
    }, "interactions:stop": function(t2) {
      var e2 = t2.interaction;
      if ("drag" === e2.prepared.name) {
        var n2 = e2.dropState;
        n2 && (n2.activeDrops = null, n2.events = null, n2.cur.dropzone = null, n2.cur.element = null, n2.prev.dropzone = null, n2.prev.element = null, n2.rejected = false);
      }
    } }, getActiveDrops: Et, getDrop: Tt, getDropEvents: St, fireDropEvents: _t, filterEventType: function(t2) {
      return 0 === t2.search("drag") || 0 === t2.search("drop");
    }, defaults: { enabled: false, accept: null, overlap: "pointer" } }, kt = Ot;
    function Dt(t2) {
      var e2 = t2.interaction, n2 = t2.iEvent, r2 = t2.phase;
      if ("gesture" === e2.prepared.name) {
        var i2 = e2.pointers.map(function(t3) {
          return t3.pointer;
        }), o2 = "start" === r2, a2 = "end" === r2, s2 = e2.interactable.options.deltaSource;
        if (n2.touches = [i2[0], i2[1]], o2) n2.distance = pt(i2, s2), n2.box = ut(i2), n2.scale = 1, n2.ds = 0, n2.angle = ft(i2, s2), n2.da = 0, e2.gesture.startDistance = n2.distance, e2.gesture.startAngle = n2.angle;
        else if (a2 || e2.pointers.length < 2) {
          var c2 = e2.prevEvent;
          n2.distance = c2.distance, n2.box = c2.box, n2.scale = c2.scale, n2.ds = 0, n2.angle = c2.angle, n2.da = 0;
        } else n2.distance = pt(i2, s2), n2.box = ut(i2), n2.scale = n2.distance / e2.gesture.startDistance, n2.angle = ft(i2, s2), n2.ds = n2.scale - e2.gesture.scale, n2.da = n2.angle - e2.gesture.angle;
        e2.gesture.distance = n2.distance, e2.gesture.angle = n2.angle, w.number(n2.scale) && n2.scale !== 1 / 0 && !isNaN(n2.scale) && (e2.gesture.scale = n2.scale);
      }
    }
    var It = { id: "actions/gesture", before: ["actions/drag", "actions/resize"], install: function(t2) {
      var e2 = t2.actions, n2 = t2.Interactable, r2 = t2.defaults;
      n2.prototype.gesturable = function(t3) {
        return w.object(t3) ? (this.options.gesture.enabled = false !== t3.enabled, this.setPerAction("gesture", t3), this.setOnEvents("gesture", t3), this) : w.bool(t3) ? (this.options.gesture.enabled = t3, this) : this.options.gesture;
      }, e2.map.gesture = It, e2.methodDict.gesture = "gesturable", r2.actions.gesture = It.defaults;
    }, listeners: { "interactions:action-start": Dt, "interactions:action-move": Dt, "interactions:action-end": Dt, "interactions:new": function(t2) {
      t2.interaction.gesture = { angle: 0, distance: 0, scale: 1, startAngle: 0, startDistance: 0 };
    }, "auto-start:check": function(t2) {
      if (!(t2.interaction.pointers.length < 2)) {
        var e2 = t2.interactable.options.gesture;
        if (e2 && e2.enabled) return t2.action = { name: "gesture" }, false;
      }
    } }, defaults: {}, getCursor: function() {
      return "";
    }, filterEventType: function(t2) {
      return 0 === t2.search("gesture");
    } }, Mt = It;
    function zt(t2, e2, n2, r2, i2, o2, a2) {
      if (!e2) return false;
      if (true === e2) {
        var s2 = w.number(o2.width) ? o2.width : o2.right - o2.left, c2 = w.number(o2.height) ? o2.height : o2.bottom - o2.top;
        if (a2 = Math.min(a2, Math.abs(("left" === t2 || "right" === t2 ? s2 : c2) / 2)), s2 < 0 && ("left" === t2 ? t2 = "right" : "right" === t2 && (t2 = "left")), c2 < 0 && ("top" === t2 ? t2 = "bottom" : "bottom" === t2 && (t2 = "top")), "left" === t2) {
          var l2 = s2 >= 0 ? o2.left : o2.right;
          return n2.x < l2 + a2;
        }
        if ("top" === t2) {
          var u2 = c2 >= 0 ? o2.top : o2.bottom;
          return n2.y < u2 + a2;
        }
        if ("right" === t2) return n2.x > (s2 >= 0 ? o2.right : o2.left) - a2;
        if ("bottom" === t2) return n2.y > (c2 >= 0 ? o2.bottom : o2.top) - a2;
      }
      return !!w.element(r2) && (w.element(e2) ? e2 === r2 : F(r2, e2, i2));
    }
    function At(t2) {
      var e2 = t2.iEvent, n2 = t2.interaction;
      if ("resize" === n2.prepared.name && n2.resizeAxes) {
        var r2 = e2;
        n2.interactable.options.resize.square ? ("y" === n2.resizeAxes ? r2.delta.x = r2.delta.y : r2.delta.y = r2.delta.x, r2.axes = "xy") : (r2.axes = n2.resizeAxes, "x" === n2.resizeAxes ? r2.delta.y = 0 : "y" === n2.resizeAxes && (r2.delta.x = 0));
      }
    }
    var Rt, Ct, jt = { id: "actions/resize", before: ["actions/drag"], install: function(t2) {
      var e2 = t2.actions, n2 = t2.browser, r2 = t2.Interactable, i2 = t2.defaults;
      jt.cursors = function(t3) {
        return t3.isIe9 ? { x: "e-resize", y: "s-resize", xy: "se-resize", top: "n-resize", left: "w-resize", bottom: "s-resize", right: "e-resize", topleft: "se-resize", bottomright: "se-resize", topright: "ne-resize", bottomleft: "ne-resize" } : { x: "ew-resize", y: "ns-resize", xy: "nwse-resize", top: "ns-resize", left: "ew-resize", bottom: "ns-resize", right: "ew-resize", topleft: "nwse-resize", bottomright: "nwse-resize", topright: "nesw-resize", bottomleft: "nesw-resize" };
      }(n2), jt.defaultMargin = n2.supportsTouch || n2.supportsPointerEvent ? 20 : 10, r2.prototype.resizable = function(e3) {
        return function(t3, e4, n3) {
          if (w.object(e4)) return t3.options.resize.enabled = false !== e4.enabled, t3.setPerAction("resize", e4), t3.setOnEvents("resize", e4), w.string(e4.axis) && /^x$|^y$|^xy$/.test(e4.axis) ? t3.options.resize.axis = e4.axis : null === e4.axis && (t3.options.resize.axis = n3.defaults.actions.resize.axis), w.bool(e4.preserveAspectRatio) ? t3.options.resize.preserveAspectRatio = e4.preserveAspectRatio : w.bool(e4.square) && (t3.options.resize.square = e4.square), t3;
          if (w.bool(e4)) return t3.options.resize.enabled = e4, t3;
          return t3.options.resize;
        }(this, e3, t2);
      }, e2.map.resize = jt, e2.methodDict.resize = "resizable", i2.actions.resize = jt.defaults;
    }, listeners: { "interactions:new": function(t2) {
      t2.interaction.resizeAxes = "xy";
    }, "interactions:action-start": function(t2) {
      !function(t3) {
        var e2 = t3.iEvent, n2 = t3.interaction;
        if ("resize" === n2.prepared.name && n2.prepared.edges) {
          var r2 = e2, i2 = n2.rect;
          n2._rects = { start: V({}, i2), corrected: V({}, i2), previous: V({}, i2), delta: { left: 0, right: 0, width: 0, top: 0, bottom: 0, height: 0 } }, r2.edges = n2.prepared.edges, r2.rect = n2._rects.corrected, r2.deltaRect = n2._rects.delta;
        }
      }(t2), At(t2);
    }, "interactions:action-move": function(t2) {
      !function(t3) {
        var e2 = t3.iEvent, n2 = t3.interaction;
        if ("resize" === n2.prepared.name && n2.prepared.edges) {
          var r2 = e2, i2 = n2.interactable.options.resize.invert, o2 = "reposition" === i2 || "negate" === i2, a2 = n2.rect, s2 = n2._rects, c2 = s2.start, l2 = s2.corrected, u2 = s2.delta, p2 = s2.previous;
          if (V(p2, l2), o2) {
            if (V(l2, a2), "reposition" === i2) {
              if (l2.top > l2.bottom) {
                var f2 = l2.top;
                l2.top = l2.bottom, l2.bottom = f2;
              }
              if (l2.left > l2.right) {
                var d2 = l2.left;
                l2.left = l2.right, l2.right = d2;
              }
            }
          } else l2.top = Math.min(a2.top, c2.bottom), l2.bottom = Math.max(a2.bottom, c2.top), l2.left = Math.min(a2.left, c2.right), l2.right = Math.max(a2.right, c2.left);
          for (var h2 in l2.width = l2.right - l2.left, l2.height = l2.bottom - l2.top, l2) u2[h2] = l2[h2] - p2[h2];
          r2.edges = n2.prepared.edges, r2.rect = l2, r2.deltaRect = u2;
        }
      }(t2), At(t2);
    }, "interactions:action-end": function(t2) {
      var e2 = t2.iEvent, n2 = t2.interaction;
      if ("resize" === n2.prepared.name && n2.prepared.edges) {
        var r2 = e2;
        r2.edges = n2.prepared.edges, r2.rect = n2._rects.corrected, r2.deltaRect = n2._rects.delta;
      }
    }, "auto-start:check": function(t2) {
      var e2 = t2.interaction, n2 = t2.interactable, r2 = t2.element, i2 = t2.rect, o2 = t2.buttons;
      if (i2) {
        var a2 = V({}, e2.coords.cur.page), s2 = n2.options.resize;
        if (s2 && s2.enabled && (!e2.pointerIsDown || !/mouse|pointer/.test(e2.pointerType) || 0 != (o2 & s2.mouseButtons))) {
          if (w.object(s2.edges)) {
            var c2 = { left: false, right: false, top: false, bottom: false };
            for (var l2 in c2) c2[l2] = zt(l2, s2.edges[l2], a2, e2._latestPointer.eventTarget, r2, i2, s2.margin || jt.defaultMargin);
            c2.left = c2.left && !c2.right, c2.top = c2.top && !c2.bottom, (c2.left || c2.right || c2.top || c2.bottom) && (t2.action = { name: "resize", edges: c2 });
          } else {
            var u2 = "y" !== s2.axis && a2.x > i2.right - jt.defaultMargin, p2 = "x" !== s2.axis && a2.y > i2.bottom - jt.defaultMargin;
            (u2 || p2) && (t2.action = { name: "resize", axes: (u2 ? "x" : "") + (p2 ? "y" : "") });
          }
          return !t2.action && void 0;
        }
      }
    } }, defaults: { square: false, preserveAspectRatio: false, axis: "xy", margin: NaN, edges: null, invert: "none" }, cursors: null, getCursor: function(t2) {
      var e2 = t2.edges, n2 = t2.axis, r2 = t2.name, i2 = jt.cursors, o2 = null;
      if (n2) o2 = i2[r2 + n2];
      else if (e2) {
        for (var a2 = "", s2 = 0, c2 = ["top", "bottom", "left", "right"]; s2 < c2.length; s2++) {
          var l2 = c2[s2];
          e2[l2] && (a2 += l2);
        }
        o2 = i2[a2];
      }
      return o2;
    }, filterEventType: function(t2) {
      return 0 === t2.search("resize");
    }, defaultMargin: null }, Ft = jt, Xt = { id: "actions", install: function(t2) {
      t2.usePlugin(Mt), t2.usePlugin(Ft), t2.usePlugin(_), t2.usePlugin(kt);
    } }, Yt = 0;
    var Lt = { request: function(t2) {
      return Rt(t2);
    }, cancel: function(t2) {
      return Ct(t2);
    }, init: function(t2) {
      if (Rt = t2.requestAnimationFrame, Ct = t2.cancelAnimationFrame, !Rt) for (var e2 = ["ms", "moz", "webkit", "o"], n2 = 0; n2 < e2.length; n2++) {
        var r2 = e2[n2];
        Rt = t2["".concat(r2, "RequestAnimationFrame")], Ct = t2["".concat(r2, "CancelAnimationFrame")] || t2["".concat(r2, "CancelRequestAnimationFrame")];
      }
      Rt = Rt && Rt.bind(t2), Ct = Ct && Ct.bind(t2), Rt || (Rt = function(e3) {
        var n3 = Date.now(), r3 = Math.max(0, 16 - (n3 - Yt)), i2 = t2.setTimeout(function() {
          e3(n3 + r3);
        }, r3);
        return Yt = n3 + r3, i2;
      }, Ct = function(t3) {
        return clearTimeout(t3);
      });
    } };
    var qt = { defaults: { enabled: false, margin: 60, container: null, speed: 300 }, now: Date.now, interaction: null, i: 0, x: 0, y: 0, isScrolling: false, prevTime: 0, margin: 0, speed: 0, start: function(t2) {
      qt.isScrolling = true, Lt.cancel(qt.i), t2.autoScroll = qt, qt.interaction = t2, qt.prevTime = qt.now(), qt.i = Lt.request(qt.scroll);
    }, stop: function() {
      qt.isScrolling = false, qt.interaction && (qt.interaction.autoScroll = null), Lt.cancel(qt.i);
    }, scroll: function() {
      var t2 = qt.interaction, e2 = t2.interactable, n2 = t2.element, r2 = t2.prepared.name, i2 = e2.options[r2].autoScroll, o2 = Bt(i2.container, e2, n2), a2 = qt.now(), s2 = (a2 - qt.prevTime) / 1e3, c2 = i2.speed * s2;
      if (c2 >= 1) {
        var l2 = { x: qt.x * c2, y: qt.y * c2 };
        if (l2.x || l2.y) {
          var u2 = Vt(o2);
          w.window(o2) ? o2.scrollBy(l2.x, l2.y) : o2 && (o2.scrollLeft += l2.x, o2.scrollTop += l2.y);
          var p2 = Vt(o2), f2 = { x: p2.x - u2.x, y: p2.y - u2.y };
          (f2.x || f2.y) && e2.fire({ type: "autoscroll", target: n2, interactable: e2, delta: f2, interaction: t2, container: o2 });
        }
        qt.prevTime = a2;
      }
      qt.isScrolling && (Lt.cancel(qt.i), qt.i = Lt.request(qt.scroll));
    }, check: function(t2, e2) {
      var n2;
      return null == (n2 = t2.options[e2].autoScroll) ? void 0 : n2.enabled;
    }, onInteractionMove: function(t2) {
      var e2 = t2.interaction, n2 = t2.pointer;
      if (e2.interacting() && qt.check(e2.interactable, e2.prepared.name)) if (e2.simulation) qt.x = qt.y = 0;
      else {
        var r2, i2, o2, a2, s2 = e2.interactable, c2 = e2.element, l2 = e2.prepared.name, u2 = s2.options[l2].autoScroll, p2 = Bt(u2.container, s2, c2);
        if (w.window(p2)) a2 = n2.clientX < qt.margin, r2 = n2.clientY < qt.margin, i2 = n2.clientX > p2.innerWidth - qt.margin, o2 = n2.clientY > p2.innerHeight - qt.margin;
        else {
          var f2 = Y(p2);
          a2 = n2.clientX < f2.left + qt.margin, r2 = n2.clientY < f2.top + qt.margin, i2 = n2.clientX > f2.right - qt.margin, o2 = n2.clientY > f2.bottom - qt.margin;
        }
        qt.x = i2 ? 1 : a2 ? -1 : 0, qt.y = o2 ? 1 : r2 ? -1 : 0, qt.isScrolling || (qt.margin = u2.margin, qt.speed = u2.speed, qt.start(e2));
      }
    } };
    function Bt(t2, e2, n2) {
      return (w.string(t2) ? W(t2, e2, n2) : t2) || y(n2);
    }
    function Vt(t2) {
      return w.window(t2) && (t2 = window.document.body), { x: t2.scrollLeft, y: t2.scrollTop };
    }
    var Wt = { id: "auto-scroll", install: function(t2) {
      var e2 = t2.defaults, n2 = t2.actions;
      t2.autoScroll = qt, qt.now = function() {
        return t2.now();
      }, n2.phaselessTypes.autoscroll = true, e2.perAction.autoScroll = qt.defaults;
    }, listeners: { "interactions:new": function(t2) {
      t2.interaction.autoScroll = null;
    }, "interactions:destroy": function(t2) {
      t2.interaction.autoScroll = null, qt.stop(), qt.interaction && (qt.interaction = null);
    }, "interactions:stop": qt.stop, "interactions:action-move": function(t2) {
      return qt.onInteractionMove(t2);
    } } }, Gt = Wt;
    function Nt(t2, e2) {
      var n2 = false;
      return function() {
        return n2 || (g.console.warn(e2), n2 = true), t2.apply(this, arguments);
      };
    }
    function Ut(t2, e2) {
      return t2.name = e2.name, t2.axis = e2.axis, t2.edges = e2.edges, t2;
    }
    function Ht(t2) {
      return w.bool(t2) ? (this.options.styleCursor = t2, this) : null === t2 ? (delete this.options.styleCursor, this) : this.options.styleCursor;
    }
    function Kt(t2) {
      return w.func(t2) ? (this.options.actionChecker = t2, this) : null === t2 ? (delete this.options.actionChecker, this) : this.options.actionChecker;
    }
    var $t = { id: "auto-start/interactableMethods", install: function(t2) {
      var e2 = t2.Interactable;
      e2.prototype.getAction = function(e3, n2, r2, i2) {
        var o2 = function(t3, e4, n3, r3, i3) {
          var o3 = t3.getRect(r3), a2 = e4.buttons || { 0: 1, 1: 4, 3: 8, 4: 16 }[e4.button], s2 = { action: null, interactable: t3, interaction: n3, element: r3, rect: o3, buttons: a2 };
          return i3.fire("auto-start:check", s2), s2.action;
        }(this, n2, r2, i2, t2);
        return this.options.actionChecker ? this.options.actionChecker(e3, n2, o2, this, i2, r2) : o2;
      }, e2.prototype.ignoreFrom = Nt(function(t3) {
        return this._backCompatOption("ignoreFrom", t3);
      }, "Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue})."), e2.prototype.allowFrom = Nt(function(t3) {
        return this._backCompatOption("allowFrom", t3);
      }, "Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue})."), e2.prototype.actionChecker = Kt, e2.prototype.styleCursor = Ht;
    } };
    function Jt(t2, e2, n2, r2, i2) {
      return e2.testIgnoreAllow(e2.options[t2.name], n2, r2) && e2.options[t2.name].enabled && ee(e2, n2, t2, i2) ? t2 : null;
    }
    function Qt(t2, e2, n2, r2, i2, o2, a2) {
      for (var s2 = 0, c2 = r2.length; s2 < c2; s2++) {
        var l2 = r2[s2], u2 = i2[s2], p2 = l2.getAction(e2, n2, t2, u2);
        if (p2) {
          var f2 = Jt(p2, l2, u2, o2, a2);
          if (f2) return { action: f2, interactable: l2, element: u2 };
        }
      }
      return { action: null, interactable: null, element: null };
    }
    function Zt(t2, e2, n2, r2, i2) {
      var o2 = [], a2 = [], s2 = r2;
      function c2(t3) {
        o2.push(t3), a2.push(s2);
      }
      for (; w.element(s2); ) {
        o2 = [], a2 = [], i2.interactables.forEachMatch(s2, c2);
        var l2 = Qt(t2, e2, n2, o2, a2, r2, i2);
        if (l2.action && !l2.interactable.options[l2.action.name].manualStart) return l2;
        s2 = A(s2);
      }
      return { action: null, interactable: null, element: null };
    }
    function te(t2, e2, n2) {
      var r2 = e2.action, i2 = e2.interactable, o2 = e2.element;
      r2 = r2 || { name: null }, t2.interactable = i2, t2.element = o2, Ut(t2.prepared, r2), t2.rect = i2 && r2.name ? i2.getRect(o2) : null, ie(t2, n2), n2.fire("autoStart:prepared", { interaction: t2 });
    }
    function ee(t2, e2, n2, r2) {
      var i2 = t2.options, o2 = i2[n2.name].max, a2 = i2[n2.name].maxPerElement, s2 = r2.autoStart.maxInteractions, c2 = 0, l2 = 0, u2 = 0;
      if (!(o2 && a2 && s2)) return false;
      for (var p2 = 0, f2 = r2.interactions.list; p2 < f2.length; p2++) {
        var d2 = f2[p2], h2 = d2.prepared.name;
        if (d2.interacting()) {
          if (++c2 >= s2) return false;
          if (d2.interactable === t2) {
            if ((l2 += h2 === n2.name ? 1 : 0) >= o2) return false;
            if (d2.element === e2 && (u2++, h2 === n2.name && u2 >= a2)) return false;
          }
        }
      }
      return s2 > 0;
    }
    function ne(t2, e2) {
      return w.number(t2) ? (e2.autoStart.maxInteractions = t2, this) : e2.autoStart.maxInteractions;
    }
    function re(t2, e2, n2) {
      var r2 = n2.autoStart.cursorElement;
      r2 && r2 !== t2 && (r2.style.cursor = ""), t2.ownerDocument.documentElement.style.cursor = e2, t2.style.cursor = e2, n2.autoStart.cursorElement = e2 ? t2 : null;
    }
    function ie(t2, e2) {
      var n2 = t2.interactable, r2 = t2.element, i2 = t2.prepared;
      if ("mouse" === t2.pointerType && n2 && n2.options.styleCursor) {
        var o2 = "";
        if (i2.name) {
          var a2 = n2.options[i2.name].cursorChecker;
          o2 = w.func(a2) ? a2(i2, n2, r2, t2._interacting) : e2.actions.map[i2.name].getCursor(i2);
        }
        re(t2.element, o2 || "", e2);
      } else e2.autoStart.cursorElement && re(e2.autoStart.cursorElement, "", e2);
    }
    var oe = { id: "auto-start/base", before: ["actions"], install: function(t2) {
      var e2 = t2.interactStatic, n2 = t2.defaults;
      t2.usePlugin($t), n2.base.actionChecker = null, n2.base.styleCursor = true, V(n2.perAction, { manualStart: false, max: 1 / 0, maxPerElement: 1, allowFrom: null, ignoreFrom: null, mouseButtons: 1 }), e2.maxInteractions = function(e3) {
        return ne(e3, t2);
      }, t2.autoStart = { maxInteractions: 1 / 0, withinInteractionLimit: ee, cursorElement: null };
    }, listeners: { "interactions:down": function(t2, e2) {
      var n2 = t2.interaction, r2 = t2.pointer, i2 = t2.event, o2 = t2.eventTarget;
      n2.interacting() || te(n2, Zt(n2, r2, i2, o2, e2), e2);
    }, "interactions:move": function(t2, e2) {
      !function(t3, e3) {
        var n2 = t3.interaction, r2 = t3.pointer, i2 = t3.event, o2 = t3.eventTarget;
        "mouse" !== n2.pointerType || n2.pointerIsDown || n2.interacting() || te(n2, Zt(n2, r2, i2, o2, e3), e3);
      }(t2, e2), function(t3, e3) {
        var n2 = t3.interaction;
        if (n2.pointerIsDown && !n2.interacting() && n2.pointerWasMoved && n2.prepared.name) {
          e3.fire("autoStart:before-start", t3);
          var r2 = n2.interactable, i2 = n2.prepared.name;
          i2 && r2 && (r2.options[i2].manualStart || !ee(r2, n2.element, n2.prepared, e3) ? n2.stop() : (n2.start(n2.prepared, r2, n2.element), ie(n2, e3)));
        }
      }(t2, e2);
    }, "interactions:stop": function(t2, e2) {
      var n2 = t2.interaction, r2 = n2.interactable;
      r2 && r2.options.styleCursor && re(n2.element, "", e2);
    } }, maxInteractions: ne, withinInteractionLimit: ee, validateAction: Jt }, ae = oe;
    var se = { id: "auto-start/dragAxis", listeners: { "autoStart:before-start": function(t2, e2) {
      var n2 = t2.interaction, r2 = t2.eventTarget, i2 = t2.dx, o2 = t2.dy;
      if ("drag" === n2.prepared.name) {
        var a2 = Math.abs(i2), s2 = Math.abs(o2), c2 = n2.interactable.options.drag, l2 = c2.startAxis, u2 = a2 > s2 ? "x" : a2 < s2 ? "y" : "xy";
        if (n2.prepared.axis = "start" === c2.lockAxis ? u2[0] : c2.lockAxis, "xy" !== u2 && "xy" !== l2 && l2 !== u2) {
          n2.prepared.name = null;
          for (var p2 = r2, f2 = function(t3) {
            if (t3 !== n2.interactable) {
              var i3 = n2.interactable.options.drag;
              if (!i3.manualStart && t3.testIgnoreAllow(i3, p2, r2)) {
                var o3 = t3.getAction(n2.downPointer, n2.downEvent, n2, p2);
                if (o3 && "drag" === o3.name && function(t4, e3) {
                  if (!e3) return false;
                  var n3 = e3.options.drag.startAxis;
                  return "xy" === t4 || "xy" === n3 || n3 === t4;
                }(u2, t3) && ae.validateAction(o3, t3, p2, r2, e2)) return t3;
              }
            }
          }; w.element(p2); ) {
            var d2 = e2.interactables.forEachMatch(p2, f2);
            if (d2) {
              n2.prepared.name = "drag", n2.interactable = d2, n2.element = p2;
              break;
            }
            p2 = A(p2);
          }
        }
      }
    } } };
    function ce(t2) {
      var e2 = t2.prepared && t2.prepared.name;
      if (!e2) return null;
      var n2 = t2.interactable.options;
      return n2[e2].hold || n2[e2].delay;
    }
    var le = { id: "auto-start/hold", install: function(t2) {
      var e2 = t2.defaults;
      t2.usePlugin(ae), e2.perAction.hold = 0, e2.perAction.delay = 0;
    }, listeners: { "interactions:new": function(t2) {
      t2.interaction.autoStartHoldTimer = null;
    }, "autoStart:prepared": function(t2) {
      var e2 = t2.interaction, n2 = ce(e2);
      n2 > 0 && (e2.autoStartHoldTimer = setTimeout(function() {
        e2.start(e2.prepared, e2.interactable, e2.element);
      }, n2));
    }, "interactions:move": function(t2) {
      var e2 = t2.interaction, n2 = t2.duplicate;
      e2.autoStartHoldTimer && e2.pointerWasMoved && !n2 && (clearTimeout(e2.autoStartHoldTimer), e2.autoStartHoldTimer = null);
    }, "autoStart:before-start": function(t2) {
      var e2 = t2.interaction;
      ce(e2) > 0 && (e2.prepared.name = null);
    } }, getHoldDuration: ce }, ue = le, pe = { id: "auto-start", install: function(t2) {
      t2.usePlugin(ae), t2.usePlugin(ue), t2.usePlugin(se);
    } }, fe = function(t2) {
      return /^(always|never|auto)$/.test(t2) ? (this.options.preventDefault = t2, this) : w.bool(t2) ? (this.options.preventDefault = t2 ? "always" : "never", this) : this.options.preventDefault;
    };
    function de(t2) {
      var e2 = t2.interaction, n2 = t2.event;
      e2.interactable && e2.interactable.checkAndPreventDefault(n2);
    }
    var he = { id: "core/interactablePreventDefault", install: function(t2) {
      var e2 = t2.Interactable;
      e2.prototype.preventDefault = fe, e2.prototype.checkAndPreventDefault = function(e3) {
        return function(t3, e4, n2) {
          var r2 = t3.options.preventDefault;
          if ("never" !== r2) if ("always" !== r2) {
            if (e4.events.supportsPassive && /^touch(start|move)$/.test(n2.type)) {
              var i2 = y(n2.target).document, o2 = e4.getDocOptions(i2);
              if (!o2 || !o2.events || false !== o2.events.passive) return;
            }
            /^(mouse|pointer|touch)*(down|start)/i.test(n2.type) || w.element(n2.target) && R(n2.target, "input,select,textarea,[contenteditable=true],[contenteditable=true] *") || n2.preventDefault();
          } else n2.preventDefault();
        }(this, t2, e3);
      }, t2.interactions.docEvents.push({ type: "dragstart", listener: function(e3) {
        for (var n2 = 0, r2 = t2.interactions.list; n2 < r2.length; n2++) {
          var i2 = r2[n2];
          if (i2.element && (i2.element === e3.target || M(i2.element, e3.target))) return void i2.interactable.checkAndPreventDefault(e3);
        }
      } });
    }, listeners: ["down", "move", "up", "cancel"].reduce(function(t2, e2) {
      return t2["interactions:".concat(e2)] = de, t2;
    }, {}) };
    function ve(t2, e2) {
      if (e2.phaselessTypes[t2]) return true;
      for (var n2 in e2.map) if (0 === t2.indexOf(n2) && t2.substr(n2.length) in e2.phases) return true;
      return false;
    }
    function ge(t2) {
      var e2 = {};
      for (var n2 in t2) {
        var r2 = t2[n2];
        w.plainObject(r2) ? e2[n2] = ge(r2) : w.array(r2) ? e2[n2] = mt(r2) : e2[n2] = r2;
      }
      return e2;
    }
    var me = function() {
      function t2(e2) {
        r(this, t2), this.states = [], this.startOffset = { left: 0, right: 0, top: 0, bottom: 0 }, this.startDelta = void 0, this.result = void 0, this.endResult = void 0, this.startEdges = void 0, this.edges = void 0, this.interaction = void 0, this.interaction = e2, this.result = ye(), this.edges = { left: false, right: false, top: false, bottom: false };
      }
      return o(t2, [{ key: "start", value: function(t3, e2) {
        var n2, r2, i2 = t3.phase, o2 = this.interaction, a2 = function(t4) {
          var e3 = t4.interactable.options[t4.prepared.name], n3 = e3.modifiers;
          if (n3 && n3.length) return n3;
          return ["snap", "snapSize", "snapEdges", "restrict", "restrictEdges", "restrictSize"].map(function(t5) {
            var n4 = e3[t5];
            return n4 && n4.enabled && { options: n4, methods: n4._methods };
          }).filter(function(t5) {
            return !!t5;
          });
        }(o2);
        this.prepareStates(a2), this.startEdges = V({}, o2.edges), this.edges = V({}, this.startEdges), this.startOffset = (n2 = o2.rect, r2 = e2, n2 ? { left: r2.x - n2.left, top: r2.y - n2.top, right: n2.right - r2.x, bottom: n2.bottom - r2.y } : { left: 0, top: 0, right: 0, bottom: 0 }), this.startDelta = { x: 0, y: 0 };
        var s2 = this.fillArg({ phase: i2, pageCoords: e2, preEnd: false });
        return this.result = ye(), this.startAll(s2), this.result = this.setAll(s2);
      } }, { key: "fillArg", value: function(t3) {
        var e2 = this.interaction;
        return t3.interaction = e2, t3.interactable = e2.interactable, t3.element = e2.element, t3.rect || (t3.rect = e2.rect), t3.edges || (t3.edges = this.startEdges), t3.startOffset = this.startOffset, t3;
      } }, { key: "startAll", value: function(t3) {
        for (var e2 = 0, n2 = this.states; e2 < n2.length; e2++) {
          var r2 = n2[e2];
          r2.methods.start && (t3.state = r2, r2.methods.start(t3));
        }
      } }, { key: "setAll", value: function(t3) {
        var e2 = t3.phase, n2 = t3.preEnd, r2 = t3.skipModifiers, i2 = t3.rect, o2 = t3.edges;
        t3.coords = V({}, t3.pageCoords), t3.rect = V({}, i2), t3.edges = V({}, o2);
        for (var a2 = r2 ? this.states.slice(r2) : this.states, s2 = ye(t3.coords, t3.rect), c2 = 0; c2 < a2.length; c2++) {
          var l2, u2 = a2[c2], p2 = u2.options, f2 = V({}, t3.coords), d2 = null;
          null != (l2 = u2.methods) && l2.set && this.shouldDo(p2, n2, e2) && (t3.state = u2, d2 = u2.methods.set(t3), H(t3.edges, t3.rect, { x: t3.coords.x - f2.x, y: t3.coords.y - f2.y })), s2.eventProps.push(d2);
        }
        V(this.edges, t3.edges), s2.delta.x = t3.coords.x - t3.pageCoords.x, s2.delta.y = t3.coords.y - t3.pageCoords.y, s2.rectDelta.left = t3.rect.left - i2.left, s2.rectDelta.right = t3.rect.right - i2.right, s2.rectDelta.top = t3.rect.top - i2.top, s2.rectDelta.bottom = t3.rect.bottom - i2.bottom;
        var h2 = this.result.coords, v2 = this.result.rect;
        if (h2 && v2) {
          var g2 = s2.rect.left !== v2.left || s2.rect.right !== v2.right || s2.rect.top !== v2.top || s2.rect.bottom !== v2.bottom;
          s2.changed = g2 || h2.x !== s2.coords.x || h2.y !== s2.coords.y;
        }
        return s2;
      } }, { key: "applyToInteraction", value: function(t3) {
        var e2 = this.interaction, n2 = t3.phase, r2 = e2.coords.cur, i2 = e2.coords.start, o2 = this.result, a2 = this.startDelta, s2 = o2.delta;
        "start" === n2 && V(this.startDelta, o2.delta);
        for (var c2 = 0, l2 = [[i2, a2], [r2, s2]]; c2 < l2.length; c2++) {
          var u2 = l2[c2], p2 = u2[0], f2 = u2[1];
          p2.page.x += f2.x, p2.page.y += f2.y, p2.client.x += f2.x, p2.client.y += f2.y;
        }
        var d2 = this.result.rectDelta, h2 = t3.rect || e2.rect;
        h2.left += d2.left, h2.right += d2.right, h2.top += d2.top, h2.bottom += d2.bottom, h2.width = h2.right - h2.left, h2.height = h2.bottom - h2.top;
      } }, { key: "setAndApply", value: function(t3) {
        var e2 = this.interaction, n2 = t3.phase, r2 = t3.preEnd, i2 = t3.skipModifiers, o2 = this.setAll(this.fillArg({ preEnd: r2, phase: n2, pageCoords: t3.modifiedCoords || e2.coords.cur.page }));
        if (this.result = o2, !o2.changed && (!i2 || i2 < this.states.length) && e2.interacting()) return false;
        if (t3.modifiedCoords) {
          var a2 = e2.coords.cur.page, s2 = { x: t3.modifiedCoords.x - a2.x, y: t3.modifiedCoords.y - a2.y };
          o2.coords.x += s2.x, o2.coords.y += s2.y, o2.delta.x += s2.x, o2.delta.y += s2.y;
        }
        this.applyToInteraction(t3);
      } }, { key: "beforeEnd", value: function(t3) {
        var e2 = t3.interaction, n2 = t3.event, r2 = this.states;
        if (r2 && r2.length) {
          for (var i2 = false, o2 = 0; o2 < r2.length; o2++) {
            var a2 = r2[o2];
            t3.state = a2;
            var s2 = a2.options, c2 = a2.methods, l2 = c2.beforeEnd && c2.beforeEnd(t3);
            if (l2) return this.endResult = l2, false;
            i2 = i2 || !i2 && this.shouldDo(s2, true, t3.phase, true);
          }
          i2 && e2.move({ event: n2, preEnd: true });
        }
      } }, { key: "stop", value: function(t3) {
        var e2 = t3.interaction;
        if (this.states && this.states.length) {
          var n2 = V({ states: this.states, interactable: e2.interactable, element: e2.element, rect: null }, t3);
          this.fillArg(n2);
          for (var r2 = 0, i2 = this.states; r2 < i2.length; r2++) {
            var o2 = i2[r2];
            n2.state = o2, o2.methods.stop && o2.methods.stop(n2);
          }
          this.states = null, this.endResult = null;
        }
      } }, { key: "prepareStates", value: function(t3) {
        this.states = [];
        for (var e2 = 0; e2 < t3.length; e2++) {
          var n2 = t3[e2], r2 = n2.options, i2 = n2.methods, o2 = n2.name;
          this.states.push({ options: r2, methods: i2, index: e2, name: o2 });
        }
        return this.states;
      } }, { key: "restoreInteractionCoords", value: function(t3) {
        var e2 = t3.interaction, n2 = e2.coords, r2 = e2.rect, i2 = e2.modification;
        if (i2.result) {
          for (var o2 = i2.startDelta, a2 = i2.result, s2 = a2.delta, c2 = a2.rectDelta, l2 = 0, u2 = [[n2.start, o2], [n2.cur, s2]]; l2 < u2.length; l2++) {
            var p2 = u2[l2], f2 = p2[0], d2 = p2[1];
            f2.page.x -= d2.x, f2.page.y -= d2.y, f2.client.x -= d2.x, f2.client.y -= d2.y;
          }
          r2.left -= c2.left, r2.right -= c2.right, r2.top -= c2.top, r2.bottom -= c2.bottom;
        }
      } }, { key: "shouldDo", value: function(t3, e2, n2, r2) {
        return !(!t3 || false === t3.enabled || r2 && !t3.endOnly || t3.endOnly && !e2 || "start" === n2 && !t3.setStart);
      } }, { key: "copyFrom", value: function(t3) {
        this.startOffset = t3.startOffset, this.startDelta = t3.startDelta, this.startEdges = t3.startEdges, this.edges = t3.edges, this.states = t3.states.map(function(t4) {
          return ge(t4);
        }), this.result = ye(V({}, t3.result.coords), V({}, t3.result.rect));
      } }, { key: "destroy", value: function() {
        for (var t3 in this) this[t3] = null;
      } }]), t2;
    }();
    function ye(t2, e2) {
      return { rect: e2, coords: t2, delta: { x: 0, y: 0 }, rectDelta: { left: 0, right: 0, top: 0, bottom: 0 }, eventProps: [], changed: true };
    }
    function be(t2, e2) {
      var n2 = t2.defaults, r2 = { start: t2.start, set: t2.set, beforeEnd: t2.beforeEnd, stop: t2.stop }, i2 = function(t3) {
        var i3 = t3 || {};
        for (var o2 in i3.enabled = false !== i3.enabled, n2) o2 in i3 || (i3[o2] = n2[o2]);
        var a2 = { options: i3, methods: r2, name: e2, enable: function() {
          return i3.enabled = true, a2;
        }, disable: function() {
          return i3.enabled = false, a2;
        } };
        return a2;
      };
      return e2 && "string" == typeof e2 && (i2._defaults = n2, i2._methods = r2), i2;
    }
    function xe(t2) {
      var e2 = t2.iEvent, n2 = t2.interaction.modification.result;
      n2 && (e2.modifiers = n2.eventProps);
    }
    var we = { id: "modifiers/base", before: ["actions"], install: function(t2) {
      t2.defaults.perAction.modifiers = [];
    }, listeners: { "interactions:new": function(t2) {
      var e2 = t2.interaction;
      e2.modification = new me(e2);
    }, "interactions:before-action-start": function(t2) {
      var e2 = t2.interaction, n2 = t2.interaction.modification;
      n2.start(t2, e2.coords.start.page), e2.edges = n2.edges, n2.applyToInteraction(t2);
    }, "interactions:before-action-move": function(t2) {
      var e2 = t2.interaction, n2 = e2.modification, r2 = n2.setAndApply(t2);
      return e2.edges = n2.edges, r2;
    }, "interactions:before-action-end": function(t2) {
      var e2 = t2.interaction, n2 = e2.modification, r2 = n2.beforeEnd(t2);
      return e2.edges = n2.startEdges, r2;
    }, "interactions:action-start": xe, "interactions:action-move": xe, "interactions:action-end": xe, "interactions:after-action-start": function(t2) {
      return t2.interaction.modification.restoreInteractionCoords(t2);
    }, "interactions:after-action-move": function(t2) {
      return t2.interaction.modification.restoreInteractionCoords(t2);
    }, "interactions:stop": function(t2) {
      return t2.interaction.modification.stop(t2);
    } } }, Ee = we, Te = { base: { preventDefault: "auto", deltaSource: "page" }, perAction: { enabled: false, origin: { x: 0, y: 0 } }, actions: {} }, Se = function(t2) {
      s(n2, t2);
      var e2 = p(n2);
      function n2(t3, i2, o2, a2, s2, c2, l2) {
        var p2;
        r(this, n2), (p2 = e2.call(this, t3)).relatedTarget = null, p2.screenX = void 0, p2.screenY = void 0, p2.button = void 0, p2.buttons = void 0, p2.ctrlKey = void 0, p2.shiftKey = void 0, p2.altKey = void 0, p2.metaKey = void 0, p2.page = void 0, p2.client = void 0, p2.delta = void 0, p2.rect = void 0, p2.x0 = void 0, p2.y0 = void 0, p2.t0 = void 0, p2.dt = void 0, p2.duration = void 0, p2.clientX0 = void 0, p2.clientY0 = void 0, p2.velocity = void 0, p2.speed = void 0, p2.swipe = void 0, p2.axes = void 0, p2.preEnd = void 0, s2 = s2 || t3.element;
        var f2 = t3.interactable, d2 = (f2 && f2.options || Te).deltaSource, h2 = K(f2, s2, o2), v2 = "start" === a2, g2 = "end" === a2, m2 = v2 ? u(p2) : t3.prevEvent, y2 = v2 ? t3.coords.start : g2 ? { page: m2.page, client: m2.client, timeStamp: t3.coords.cur.timeStamp } : t3.coords.cur;
        return p2.page = V({}, y2.page), p2.client = V({}, y2.client), p2.rect = V({}, t3.rect), p2.timeStamp = y2.timeStamp, g2 || (p2.page.x -= h2.x, p2.page.y -= h2.y, p2.client.x -= h2.x, p2.client.y -= h2.y), p2.ctrlKey = i2.ctrlKey, p2.altKey = i2.altKey, p2.shiftKey = i2.shiftKey, p2.metaKey = i2.metaKey, p2.button = i2.button, p2.buttons = i2.buttons, p2.target = s2, p2.currentTarget = s2, p2.preEnd = c2, p2.type = l2 || o2 + (a2 || ""), p2.interactable = f2, p2.t0 = v2 ? t3.pointers[t3.pointers.length - 1].downTime : m2.t0, p2.x0 = t3.coords.start.page.x - h2.x, p2.y0 = t3.coords.start.page.y - h2.y, p2.clientX0 = t3.coords.start.client.x - h2.x, p2.clientY0 = t3.coords.start.client.y - h2.y, p2.delta = v2 || g2 ? { x: 0, y: 0 } : { x: p2[d2].x - m2[d2].x, y: p2[d2].y - m2[d2].y }, p2.dt = t3.coords.delta.timeStamp, p2.duration = p2.timeStamp - p2.t0, p2.velocity = V({}, t3.coords.velocity[d2]), p2.speed = Q(p2.velocity.x, p2.velocity.y), p2.swipe = g2 || "inertiastart" === a2 ? p2.getSwipe() : null, p2;
      }
      return o(n2, [{ key: "getSwipe", value: function() {
        var t3 = this._interaction;
        if (t3.prevEvent.speed < 600 || this.timeStamp - t3.prevEvent.timeStamp > 150) return null;
        var e3 = 180 * Math.atan2(t3.prevEvent.velocityY, t3.prevEvent.velocityX) / Math.PI;
        e3 < 0 && (e3 += 360);
        var n3 = 112.5 <= e3 && e3 < 247.5, r2 = 202.5 <= e3 && e3 < 337.5;
        return { up: r2, down: !r2 && 22.5 <= e3 && e3 < 157.5, left: n3, right: !n3 && (292.5 <= e3 || e3 < 67.5), angle: e3, speed: t3.prevEvent.speed, velocity: { x: t3.prevEvent.velocityX, y: t3.prevEvent.velocityY } };
      } }, { key: "preventDefault", value: function() {
      } }, { key: "stopImmediatePropagation", value: function() {
        this.immediatePropagationStopped = this.propagationStopped = true;
      } }, { key: "stopPropagation", value: function() {
        this.propagationStopped = true;
      } }]), n2;
    }(vt);
    Object.defineProperties(Se.prototype, { pageX: { get: function() {
      return this.page.x;
    }, set: function(t2) {
      this.page.x = t2;
    } }, pageY: { get: function() {
      return this.page.y;
    }, set: function(t2) {
      this.page.y = t2;
    } }, clientX: { get: function() {
      return this.client.x;
    }, set: function(t2) {
      this.client.x = t2;
    } }, clientY: { get: function() {
      return this.client.y;
    }, set: function(t2) {
      this.client.y = t2;
    } }, dx: { get: function() {
      return this.delta.x;
    }, set: function(t2) {
      this.delta.x = t2;
    } }, dy: { get: function() {
      return this.delta.y;
    }, set: function(t2) {
      this.delta.y = t2;
    } }, velocityX: { get: function() {
      return this.velocity.x;
    }, set: function(t2) {
      this.velocity.x = t2;
    } }, velocityY: { get: function() {
      return this.velocity.y;
    }, set: function(t2) {
      this.velocity.y = t2;
    } } });
    var _e = o(function t2(e2, n2, i2, o2, a2) {
      r(this, t2), this.id = void 0, this.pointer = void 0, this.event = void 0, this.downTime = void 0, this.downTarget = void 0, this.id = e2, this.pointer = n2, this.event = i2, this.downTime = o2, this.downTarget = a2;
    }), Pe = function(t2) {
      return t2.interactable = "", t2.element = "", t2.prepared = "", t2.pointerIsDown = "", t2.pointerWasMoved = "", t2._proxy = "", t2;
    }({}), Oe = function(t2) {
      return t2.start = "", t2.move = "", t2.end = "", t2.stop = "", t2.interacting = "", t2;
    }({}), ke = 0, De = function() {
      function t2(e2) {
        var n2 = this, i2 = e2.pointerType, o2 = e2.scopeFire;
        r(this, t2), this.interactable = null, this.element = null, this.rect = null, this._rects = void 0, this.edges = null, this._scopeFire = void 0, this.prepared = { name: null, axis: null, edges: null }, this.pointerType = void 0, this.pointers = [], this.downEvent = null, this.downPointer = {}, this._latestPointer = { pointer: null, event: null, eventTarget: null }, this.prevEvent = null, this.pointerIsDown = false, this.pointerWasMoved = false, this._interacting = false, this._ending = false, this._stopped = true, this._proxy = void 0, this.simulation = null, this.doMove = Nt(function(t3) {
          this.move(t3);
        }, "The interaction.doMove() method has been renamed to interaction.move()"), this.coords = { start: { page: { x: 0, y: 0 }, client: { x: 0, y: 0 }, timeStamp: 0 }, prev: { page: { x: 0, y: 0 }, client: { x: 0, y: 0 }, timeStamp: 0 }, cur: { page: { x: 0, y: 0 }, client: { x: 0, y: 0 }, timeStamp: 0 }, delta: { page: { x: 0, y: 0 }, client: { x: 0, y: 0 }, timeStamp: 0 }, velocity: { page: { x: 0, y: 0 }, client: { x: 0, y: 0 }, timeStamp: 0 } }, this._id = ke++, this._scopeFire = o2, this.pointerType = i2;
        var a2 = this;
        this._proxy = {};
        var s2 = function(t3) {
          Object.defineProperty(n2._proxy, t3, { get: function() {
            return a2[t3];
          } });
        };
        for (var c2 in Pe) s2(c2);
        var l2 = function(t3) {
          Object.defineProperty(n2._proxy, t3, { value: function() {
            return a2[t3].apply(a2, arguments);
          } });
        };
        for (var u2 in Oe) l2(u2);
        this._scopeFire("interactions:new", { interaction: this });
      }
      return o(t2, [{ key: "pointerMoveTolerance", get: function() {
        return 1;
      } }, { key: "pointerDown", value: function(t3, e2, n2) {
        var r2 = this.updatePointer(t3, e2, n2, true), i2 = this.pointers[r2];
        this._scopeFire("interactions:down", { pointer: t3, event: e2, eventTarget: n2, pointerIndex: r2, pointerInfo: i2, type: "down", interaction: this });
      } }, { key: "start", value: function(t3, e2, n2) {
        return !(this.interacting() || !this.pointerIsDown || this.pointers.length < ("gesture" === t3.name ? 2 : 1) || !e2.options[t3.name].enabled) && (Ut(this.prepared, t3), this.interactable = e2, this.element = n2, this.rect = e2.getRect(n2), this.edges = this.prepared.edges ? V({}, this.prepared.edges) : { left: true, right: true, top: true, bottom: true }, this._stopped = false, this._interacting = this._doPhase({ interaction: this, event: this.downEvent, phase: "start" }) && !this._stopped, this._interacting);
      } }, { key: "pointerMove", value: function(t3, e2, n2) {
        this.simulation || this.modification && this.modification.endResult || this.updatePointer(t3, e2, n2, false);
        var r2, i2, o2 = this.coords.cur.page.x === this.coords.prev.page.x && this.coords.cur.page.y === this.coords.prev.page.y && this.coords.cur.client.x === this.coords.prev.client.x && this.coords.cur.client.y === this.coords.prev.client.y;
        this.pointerIsDown && !this.pointerWasMoved && (r2 = this.coords.cur.client.x - this.coords.start.client.x, i2 = this.coords.cur.client.y - this.coords.start.client.y, this.pointerWasMoved = Q(r2, i2) > this.pointerMoveTolerance);
        var a2, s2, c2, l2 = this.getPointerIndex(t3), u2 = { pointer: t3, pointerIndex: l2, pointerInfo: this.pointers[l2], event: e2, type: "move", eventTarget: n2, dx: r2, dy: i2, duplicate: o2, interaction: this };
        o2 || (a2 = this.coords.velocity, s2 = this.coords.delta, c2 = Math.max(s2.timeStamp / 1e3, 1e-3), a2.page.x = s2.page.x / c2, a2.page.y = s2.page.y / c2, a2.client.x = s2.client.x / c2, a2.client.y = s2.client.y / c2, a2.timeStamp = c2), this._scopeFire("interactions:move", u2), o2 || this.simulation || (this.interacting() && (u2.type = null, this.move(u2)), this.pointerWasMoved && et(this.coords.prev, this.coords.cur));
      } }, { key: "move", value: function(t3) {
        t3 && t3.event || nt(this.coords.delta), (t3 = V({ pointer: this._latestPointer.pointer, event: this._latestPointer.event, eventTarget: this._latestPointer.eventTarget, interaction: this }, t3 || {})).phase = "move", this._doPhase(t3);
      } }, { key: "pointerUp", value: function(t3, e2, n2, r2) {
        var i2 = this.getPointerIndex(t3);
        -1 === i2 && (i2 = this.updatePointer(t3, e2, n2, false));
        var o2 = /cancel$/i.test(e2.type) ? "cancel" : "up";
        this._scopeFire("interactions:".concat(o2), { pointer: t3, pointerIndex: i2, pointerInfo: this.pointers[i2], event: e2, eventTarget: n2, type: o2, curEventTarget: r2, interaction: this }), this.simulation || this.end(e2), this.removePointer(t3, e2);
      } }, { key: "documentBlur", value: function(t3) {
        this.end(t3), this._scopeFire("interactions:blur", { event: t3, type: "blur", interaction: this });
      } }, { key: "end", value: function(t3) {
        var e2;
        this._ending = true, t3 = t3 || this._latestPointer.event, this.interacting() && (e2 = this._doPhase({ event: t3, interaction: this, phase: "end" })), this._ending = false, true === e2 && this.stop();
      } }, { key: "currentAction", value: function() {
        return this._interacting ? this.prepared.name : null;
      } }, { key: "interacting", value: function() {
        return this._interacting;
      } }, { key: "stop", value: function() {
        this._scopeFire("interactions:stop", { interaction: this }), this.interactable = this.element = null, this._interacting = false, this._stopped = true, this.prepared.name = this.prevEvent = null;
      } }, { key: "getPointerIndex", value: function(t3) {
        var e2 = at(t3);
        return "mouse" === this.pointerType || "pen" === this.pointerType ? this.pointers.length - 1 : yt(this.pointers, function(t4) {
          return t4.id === e2;
        });
      } }, { key: "getPointerInfo", value: function(t3) {
        return this.pointers[this.getPointerIndex(t3)];
      } }, { key: "updatePointer", value: function(t3, e2, n2, r2) {
        var i2, o2, a2, s2 = at(t3), c2 = this.getPointerIndex(t3), l2 = this.pointers[c2];
        return r2 = false !== r2 && (r2 || /(down|start)$/i.test(e2.type)), l2 ? l2.pointer = t3 : (l2 = new _e(s2, t3, e2, null, null), c2 = this.pointers.length, this.pointers.push(l2)), st(this.coords.cur, this.pointers.map(function(t4) {
          return t4.pointer;
        }), this._now()), i2 = this.coords.delta, o2 = this.coords.prev, a2 = this.coords.cur, i2.page.x = a2.page.x - o2.page.x, i2.page.y = a2.page.y - o2.page.y, i2.client.x = a2.client.x - o2.client.x, i2.client.y = a2.client.y - o2.client.y, i2.timeStamp = a2.timeStamp - o2.timeStamp, r2 && (this.pointerIsDown = true, l2.downTime = this.coords.cur.timeStamp, l2.downTarget = n2, tt(this.downPointer, t3), this.interacting() || (et(this.coords.start, this.coords.cur), et(this.coords.prev, this.coords.cur), this.downEvent = e2, this.pointerWasMoved = false)), this._updateLatestPointer(t3, e2, n2), this._scopeFire("interactions:update-pointer", { pointer: t3, event: e2, eventTarget: n2, down: r2, pointerInfo: l2, pointerIndex: c2, interaction: this }), c2;
      } }, { key: "removePointer", value: function(t3, e2) {
        var n2 = this.getPointerIndex(t3);
        if (-1 !== n2) {
          var r2 = this.pointers[n2];
          this._scopeFire("interactions:remove-pointer", { pointer: t3, event: e2, eventTarget: null, pointerIndex: n2, pointerInfo: r2, interaction: this }), this.pointers.splice(n2, 1), this.pointerIsDown = false;
        }
      } }, { key: "_updateLatestPointer", value: function(t3, e2, n2) {
        this._latestPointer.pointer = t3, this._latestPointer.event = e2, this._latestPointer.eventTarget = n2;
      } }, { key: "destroy", value: function() {
        this._latestPointer.pointer = null, this._latestPointer.event = null, this._latestPointer.eventTarget = null;
      } }, { key: "_createPreparedEvent", value: function(t3, e2, n2, r2) {
        return new Se(this, t3, this.prepared.name, e2, this.element, n2, r2);
      } }, { key: "_fireEvent", value: function(t3) {
        var e2;
        null == (e2 = this.interactable) || e2.fire(t3), (!this.prevEvent || t3.timeStamp >= this.prevEvent.timeStamp) && (this.prevEvent = t3);
      } }, { key: "_doPhase", value: function(t3) {
        var e2 = t3.event, n2 = t3.phase, r2 = t3.preEnd, i2 = t3.type, o2 = this.rect;
        if (o2 && "move" === n2 && (H(this.edges, o2, this.coords.delta[this.interactable.options.deltaSource]), o2.width = o2.right - o2.left, o2.height = o2.bottom - o2.top), false === this._scopeFire("interactions:before-action-".concat(n2), t3)) return false;
        var a2 = t3.iEvent = this._createPreparedEvent(e2, n2, r2, i2);
        return this._scopeFire("interactions:action-".concat(n2), t3), "start" === n2 && (this.prevEvent = a2), this._fireEvent(a2), this._scopeFire("interactions:after-action-".concat(n2), t3), true;
      } }, { key: "_now", value: function() {
        return Date.now();
      } }]), t2;
    }();
    function Ie(t2) {
      Me(t2.interaction);
    }
    function Me(t2) {
      if (!function(t3) {
        return !(!t3.offset.pending.x && !t3.offset.pending.y);
      }(t2)) return false;
      var e2 = t2.offset.pending;
      return Ae(t2.coords.cur, e2), Ae(t2.coords.delta, e2), H(t2.edges, t2.rect, e2), e2.x = 0, e2.y = 0, true;
    }
    function ze(t2) {
      var e2 = t2.x, n2 = t2.y;
      this.offset.pending.x += e2, this.offset.pending.y += n2, this.offset.total.x += e2, this.offset.total.y += n2;
    }
    function Ae(t2, e2) {
      var n2 = t2.page, r2 = t2.client, i2 = e2.x, o2 = e2.y;
      n2.x += i2, n2.y += o2, r2.x += i2, r2.y += o2;
    }
    Oe.offsetBy = "";
    var Re = { id: "offset", before: ["modifiers", "pointer-events", "actions", "inertia"], install: function(t2) {
      t2.Interaction.prototype.offsetBy = ze;
    }, listeners: { "interactions:new": function(t2) {
      t2.interaction.offset = { total: { x: 0, y: 0 }, pending: { x: 0, y: 0 } };
    }, "interactions:update-pointer": function(t2) {
      return function(t3) {
        t3.pointerIsDown && (Ae(t3.coords.cur, t3.offset.total), t3.offset.pending.x = 0, t3.offset.pending.y = 0);
      }(t2.interaction);
    }, "interactions:before-action-start": Ie, "interactions:before-action-move": Ie, "interactions:before-action-end": function(t2) {
      var e2 = t2.interaction;
      if (Me(e2)) return e2.move({ offset: true }), e2.end(), false;
    }, "interactions:stop": function(t2) {
      var e2 = t2.interaction;
      e2.offset.total.x = 0, e2.offset.total.y = 0, e2.offset.pending.x = 0, e2.offset.pending.y = 0;
    } } }, Ce = Re;
    var je = function() {
      function t2(e2) {
        r(this, t2), this.active = false, this.isModified = false, this.smoothEnd = false, this.allowResume = false, this.modification = void 0, this.modifierCount = 0, this.modifierArg = void 0, this.startCoords = void 0, this.t0 = 0, this.v0 = 0, this.te = 0, this.targetOffset = void 0, this.modifiedOffset = void 0, this.currentOffset = void 0, this.lambda_v0 = 0, this.one_ve_v0 = 0, this.timeout = void 0, this.interaction = void 0, this.interaction = e2;
      }
      return o(t2, [{ key: "start", value: function(t3) {
        var e2 = this.interaction, n2 = Fe(e2);
        if (!n2 || !n2.enabled) return false;
        var r2 = e2.coords.velocity.client, i2 = Q(r2.x, r2.y), o2 = this.modification || (this.modification = new me(e2));
        if (o2.copyFrom(e2.modification), this.t0 = e2._now(), this.allowResume = n2.allowResume, this.v0 = i2, this.currentOffset = { x: 0, y: 0 }, this.startCoords = e2.coords.cur.page, this.modifierArg = o2.fillArg({ pageCoords: this.startCoords, preEnd: true, phase: "inertiastart" }), this.t0 - e2.coords.cur.timeStamp < 50 && i2 > n2.minSpeed && i2 > n2.endSpeed) this.startInertia();
        else {
          if (o2.result = o2.setAll(this.modifierArg), !o2.result.changed) return false;
          this.startSmoothEnd();
        }
        return e2.modification.result.rect = null, e2.offsetBy(this.targetOffset), e2._doPhase({ interaction: e2, event: t3, phase: "inertiastart" }), e2.offsetBy({ x: -this.targetOffset.x, y: -this.targetOffset.y }), e2.modification.result.rect = null, this.active = true, e2.simulation = this, true;
      } }, { key: "startInertia", value: function() {
        var t3 = this, e2 = this.interaction.coords.velocity.client, n2 = Fe(this.interaction), r2 = n2.resistance, i2 = -Math.log(n2.endSpeed / this.v0) / r2;
        this.targetOffset = { x: (e2.x - i2) / r2, y: (e2.y - i2) / r2 }, this.te = i2, this.lambda_v0 = r2 / this.v0, this.one_ve_v0 = 1 - n2.endSpeed / this.v0;
        var o2 = this.modification, a2 = this.modifierArg;
        a2.pageCoords = { x: this.startCoords.x + this.targetOffset.x, y: this.startCoords.y + this.targetOffset.y }, o2.result = o2.setAll(a2), o2.result.changed && (this.isModified = true, this.modifiedOffset = { x: this.targetOffset.x + o2.result.delta.x, y: this.targetOffset.y + o2.result.delta.y }), this.onNextFrame(function() {
          return t3.inertiaTick();
        });
      } }, { key: "startSmoothEnd", value: function() {
        var t3 = this;
        this.smoothEnd = true, this.isModified = true, this.targetOffset = { x: this.modification.result.delta.x, y: this.modification.result.delta.y }, this.onNextFrame(function() {
          return t3.smoothEndTick();
        });
      } }, { key: "onNextFrame", value: function(t3) {
        var e2 = this;
        this.timeout = Lt.request(function() {
          e2.active && t3();
        });
      } }, { key: "inertiaTick", value: function() {
        var t3, e2, n2, r2, i2, o2, a2, s2 = this, c2 = this.interaction, l2 = Fe(c2).resistance, u2 = (c2._now() - this.t0) / 1e3;
        if (u2 < this.te) {
          var p2, f2 = 1 - (Math.exp(-l2 * u2) - this.lambda_v0) / this.one_ve_v0;
          this.isModified ? (t3 = 0, e2 = 0, n2 = this.targetOffset.x, r2 = this.targetOffset.y, i2 = this.modifiedOffset.x, o2 = this.modifiedOffset.y, p2 = { x: Ye(a2 = f2, t3, n2, i2), y: Ye(a2, e2, r2, o2) }) : p2 = { x: this.targetOffset.x * f2, y: this.targetOffset.y * f2 };
          var d2 = { x: p2.x - this.currentOffset.x, y: p2.y - this.currentOffset.y };
          this.currentOffset.x += d2.x, this.currentOffset.y += d2.y, c2.offsetBy(d2), c2.move(), this.onNextFrame(function() {
            return s2.inertiaTick();
          });
        } else c2.offsetBy({ x: this.modifiedOffset.x - this.currentOffset.x, y: this.modifiedOffset.y - this.currentOffset.y }), this.end();
      } }, { key: "smoothEndTick", value: function() {
        var t3 = this, e2 = this.interaction, n2 = e2._now() - this.t0, r2 = Fe(e2).smoothEndDuration;
        if (n2 < r2) {
          var i2 = { x: Le(n2, 0, this.targetOffset.x, r2), y: Le(n2, 0, this.targetOffset.y, r2) }, o2 = { x: i2.x - this.currentOffset.x, y: i2.y - this.currentOffset.y };
          this.currentOffset.x += o2.x, this.currentOffset.y += o2.y, e2.offsetBy(o2), e2.move({ skipModifiers: this.modifierCount }), this.onNextFrame(function() {
            return t3.smoothEndTick();
          });
        } else e2.offsetBy({ x: this.targetOffset.x - this.currentOffset.x, y: this.targetOffset.y - this.currentOffset.y }), this.end();
      } }, { key: "resume", value: function(t3) {
        var e2 = t3.pointer, n2 = t3.event, r2 = t3.eventTarget, i2 = this.interaction;
        i2.offsetBy({ x: -this.currentOffset.x, y: -this.currentOffset.y }), i2.updatePointer(e2, n2, r2, true), i2._doPhase({ interaction: i2, event: n2, phase: "resume" }), et(i2.coords.prev, i2.coords.cur), this.stop();
      } }, { key: "end", value: function() {
        this.interaction.move(), this.interaction.end(), this.stop();
      } }, { key: "stop", value: function() {
        this.active = this.smoothEnd = false, this.interaction.simulation = null, Lt.cancel(this.timeout);
      } }]), t2;
    }();
    function Fe(t2) {
      var e2 = t2.interactable, n2 = t2.prepared;
      return e2 && e2.options && n2.name && e2.options[n2.name].inertia;
    }
    var Xe = { id: "inertia", before: ["modifiers", "actions"], install: function(t2) {
      var e2 = t2.defaults;
      t2.usePlugin(Ce), t2.usePlugin(Ee), t2.actions.phases.inertiastart = true, t2.actions.phases.resume = true, e2.perAction.inertia = { enabled: false, resistance: 10, minSpeed: 100, endSpeed: 10, allowResume: true, smoothEndDuration: 300 };
    }, listeners: { "interactions:new": function(t2) {
      var e2 = t2.interaction;
      e2.inertia = new je(e2);
    }, "interactions:before-action-end": function(t2) {
      var e2 = t2.interaction, n2 = t2.event;
      return (!e2._interacting || e2.simulation || !e2.inertia.start(n2)) && null;
    }, "interactions:down": function(t2) {
      var e2 = t2.interaction, n2 = t2.eventTarget, r2 = e2.inertia;
      if (r2.active) for (var i2 = n2; w.element(i2); ) {
        if (i2 === e2.element) {
          r2.resume(t2);
          break;
        }
        i2 = A(i2);
      }
    }, "interactions:stop": function(t2) {
      var e2 = t2.interaction.inertia;
      e2.active && e2.stop();
    }, "interactions:before-action-resume": function(t2) {
      var e2 = t2.interaction.modification;
      e2.stop(t2), e2.start(t2, t2.interaction.coords.cur.page), e2.applyToInteraction(t2);
    }, "interactions:before-action-inertiastart": function(t2) {
      return t2.interaction.modification.setAndApply(t2);
    }, "interactions:action-resume": xe, "interactions:action-inertiastart": xe, "interactions:after-action-inertiastart": function(t2) {
      return t2.interaction.modification.restoreInteractionCoords(t2);
    }, "interactions:after-action-resume": function(t2) {
      return t2.interaction.modification.restoreInteractionCoords(t2);
    } } };
    function Ye(t2, e2, n2, r2) {
      var i2 = 1 - t2;
      return i2 * i2 * e2 + 2 * i2 * t2 * n2 + t2 * t2 * r2;
    }
    function Le(t2, e2, n2, r2) {
      return -n2 * (t2 /= r2) * (t2 - 2) + e2;
    }
    var qe = Xe;
    function Be(t2, e2) {
      for (var n2 = 0; n2 < e2.length; n2++) {
        var r2 = e2[n2];
        if (t2.immediatePropagationStopped) break;
        r2(t2);
      }
    }
    var Ve = function() {
      function t2(e2) {
        r(this, t2), this.options = void 0, this.types = {}, this.propagationStopped = false, this.immediatePropagationStopped = false, this.global = void 0, this.options = V({}, e2 || {});
      }
      return o(t2, [{ key: "fire", value: function(t3) {
        var e2, n2 = this.global;
        (e2 = this.types[t3.type]) && Be(t3, e2), !t3.propagationStopped && n2 && (e2 = n2[t3.type]) && Be(t3, e2);
      } }, { key: "on", value: function(t3, e2) {
        var n2 = $(t3, e2);
        for (t3 in n2) this.types[t3] = gt(this.types[t3] || [], n2[t3]);
      } }, { key: "off", value: function(t3, e2) {
        var n2 = $(t3, e2);
        for (t3 in n2) {
          var r2 = this.types[t3];
          if (r2 && r2.length) for (var i2 = 0, o2 = n2[t3]; i2 < o2.length; i2++) {
            var a2 = o2[i2], s2 = r2.indexOf(a2);
            -1 !== s2 && r2.splice(s2, 1);
          }
        }
      } }, { key: "getRect", value: function(t3) {
        return null;
      } }]), t2;
    }();
    var We = function() {
      function t2(e2) {
        r(this, t2), this.currentTarget = void 0, this.originalEvent = void 0, this.type = void 0, this.originalEvent = e2, tt(this, e2);
      }
      return o(t2, [{ key: "preventOriginalDefault", value: function() {
        this.originalEvent.preventDefault();
      } }, { key: "stopPropagation", value: function() {
        this.originalEvent.stopPropagation();
      } }, { key: "stopImmediatePropagation", value: function() {
        this.originalEvent.stopImmediatePropagation();
      } }]), t2;
    }();
    function Ge(t2) {
      return w.object(t2) ? { capture: !!t2.capture, passive: !!t2.passive } : { capture: !!t2, passive: false };
    }
    function Ne(t2, e2) {
      return t2 === e2 || ("boolean" == typeof t2 ? !!e2.capture === t2 && false == !!e2.passive : !!t2.capture == !!e2.capture && !!t2.passive == !!e2.passive);
    }
    var Ue = { id: "events", install: function(t2) {
      var e2, n2 = [], r2 = {}, i2 = [], o2 = { add: a2, remove: s2, addDelegate: function(t3, e3, n3, o3, s3) {
        var u2 = Ge(s3);
        if (!r2[n3]) {
          r2[n3] = [];
          for (var p2 = 0; p2 < i2.length; p2++) {
            var f2 = i2[p2];
            a2(f2, n3, c2), a2(f2, n3, l2, true);
          }
        }
        var d2 = r2[n3], h2 = bt(d2, function(n4) {
          return n4.selector === t3 && n4.context === e3;
        });
        h2 || (h2 = { selector: t3, context: e3, listeners: [] }, d2.push(h2));
        h2.listeners.push({ func: o3, options: u2 });
      }, removeDelegate: function(t3, e3, n3, i3, o3) {
        var a3, u2 = Ge(o3), p2 = r2[n3], f2 = false;
        if (!p2) return;
        for (a3 = p2.length - 1; a3 >= 0; a3--) {
          var d2 = p2[a3];
          if (d2.selector === t3 && d2.context === e3) {
            for (var h2 = d2.listeners, v2 = h2.length - 1; v2 >= 0; v2--) {
              var g2 = h2[v2];
              if (g2.func === i3 && Ne(g2.options, u2)) {
                h2.splice(v2, 1), h2.length || (p2.splice(a3, 1), s2(e3, n3, c2), s2(e3, n3, l2, true)), f2 = true;
                break;
              }
            }
            if (f2) break;
          }
        }
      }, delegateListener: c2, delegateUseCapture: l2, delegatedEvents: r2, documents: i2, targets: n2, supportsOptions: false, supportsPassive: false };
      function a2(t3, e3, r3, i3) {
        if (t3.addEventListener) {
          var a3 = Ge(i3), s3 = bt(n2, function(e4) {
            return e4.eventTarget === t3;
          });
          s3 || (s3 = { eventTarget: t3, events: {} }, n2.push(s3)), s3.events[e3] || (s3.events[e3] = []), bt(s3.events[e3], function(t4) {
            return t4.func === r3 && Ne(t4.options, a3);
          }) || (t3.addEventListener(e3, r3, o2.supportsOptions ? a3 : a3.capture), s3.events[e3].push({ func: r3, options: a3 }));
        }
      }
      function s2(t3, e3, r3, i3) {
        if (t3.addEventListener && t3.removeEventListener) {
          var a3 = yt(n2, function(e4) {
            return e4.eventTarget === t3;
          }), c3 = n2[a3];
          if (c3 && c3.events) if ("all" !== e3) {
            var l3 = false, u2 = c3.events[e3];
            if (u2) {
              if ("all" === r3) {
                for (var p2 = u2.length - 1; p2 >= 0; p2--) {
                  var f2 = u2[p2];
                  s2(t3, e3, f2.func, f2.options);
                }
                return;
              }
              for (var d2 = Ge(i3), h2 = 0; h2 < u2.length; h2++) {
                var v2 = u2[h2];
                if (v2.func === r3 && Ne(v2.options, d2)) {
                  t3.removeEventListener(e3, r3, o2.supportsOptions ? d2 : d2.capture), u2.splice(h2, 1), 0 === u2.length && (delete c3.events[e3], l3 = true);
                  break;
                }
              }
            }
            l3 && !Object.keys(c3.events).length && n2.splice(a3, 1);
          } else for (e3 in c3.events) c3.events.hasOwnProperty(e3) && s2(t3, e3, "all");
        }
      }
      function c2(t3, e3) {
        for (var n3 = Ge(e3), i3 = new We(t3), o3 = r2[t3.type], a3 = ht(t3)[0], s3 = a3; w.element(s3); ) {
          for (var c3 = 0; c3 < o3.length; c3++) {
            var l3 = o3[c3], u2 = l3.selector, p2 = l3.context;
            if (R(s3, u2) && M(p2, a3) && M(p2, s3)) {
              var f2 = l3.listeners;
              i3.currentTarget = s3;
              for (var d2 = 0; d2 < f2.length; d2++) {
                var h2 = f2[d2];
                Ne(h2.options, n3) && h2.func(i3);
              }
            }
          }
          s3 = A(s3);
        }
      }
      function l2(t3) {
        return c2(t3, true);
      }
      return null == (e2 = t2.document) || e2.createElement("div").addEventListener("test", null, { get capture() {
        return o2.supportsOptions = true;
      }, get passive() {
        return o2.supportsPassive = true;
      } }), t2.events = o2, o2;
    } }, He = { methodOrder: ["simulationResume", "mouseOrPen", "hasPointer", "idle"], search: function(t2) {
      for (var e2 = 0, n2 = He.methodOrder; e2 < n2.length; e2++) {
        var r2 = n2[e2], i2 = He[r2](t2);
        if (i2) return i2;
      }
      return null;
    }, simulationResume: function(t2) {
      var e2 = t2.pointerType, n2 = t2.eventType, r2 = t2.eventTarget, i2 = t2.scope;
      if (!/down|start/i.test(n2)) return null;
      for (var o2 = 0, a2 = i2.interactions.list; o2 < a2.length; o2++) {
        var s2 = a2[o2], c2 = r2;
        if (s2.simulation && s2.simulation.allowResume && s2.pointerType === e2) for (; c2; ) {
          if (c2 === s2.element) return s2;
          c2 = A(c2);
        }
      }
      return null;
    }, mouseOrPen: function(t2) {
      var e2, n2 = t2.pointerId, r2 = t2.pointerType, i2 = t2.eventType, o2 = t2.scope;
      if ("mouse" !== r2 && "pen" !== r2) return null;
      for (var a2 = 0, s2 = o2.interactions.list; a2 < s2.length; a2++) {
        var c2 = s2[a2];
        if (c2.pointerType === r2) {
          if (c2.simulation && !Ke(c2, n2)) continue;
          if (c2.interacting()) return c2;
          e2 || (e2 = c2);
        }
      }
      if (e2) return e2;
      for (var l2 = 0, u2 = o2.interactions.list; l2 < u2.length; l2++) {
        var p2 = u2[l2];
        if (!(p2.pointerType !== r2 || /down/i.test(i2) && p2.simulation)) return p2;
      }
      return null;
    }, hasPointer: function(t2) {
      for (var e2 = t2.pointerId, n2 = 0, r2 = t2.scope.interactions.list; n2 < r2.length; n2++) {
        var i2 = r2[n2];
        if (Ke(i2, e2)) return i2;
      }
      return null;
    }, idle: function(t2) {
      for (var e2 = t2.pointerType, n2 = 0, r2 = t2.scope.interactions.list; n2 < r2.length; n2++) {
        var i2 = r2[n2];
        if (1 === i2.pointers.length) {
          var o2 = i2.interactable;
          if (o2 && (!o2.options.gesture || !o2.options.gesture.enabled)) continue;
        } else if (i2.pointers.length >= 2) continue;
        if (!i2.interacting() && e2 === i2.pointerType) return i2;
      }
      return null;
    } };
    function Ke(t2, e2) {
      return t2.pointers.some(function(t3) {
        return t3.id === e2;
      });
    }
    var $e = He, Je = ["pointerDown", "pointerMove", "pointerUp", "updatePointer", "removePointer", "windowBlur"];
    function Qe(t2, e2) {
      return function(n2) {
        var r2 = e2.interactions.list, i2 = dt(n2), o2 = ht(n2), a2 = o2[0], s2 = o2[1], c2 = [];
        if (/^touch/.test(n2.type)) {
          e2.prevTouchTime = e2.now();
          for (var l2 = 0, u2 = n2.changedTouches; l2 < u2.length; l2++) {
            var p2 = u2[l2], f2 = { pointer: p2, pointerId: at(p2), pointerType: i2, eventType: n2.type, eventTarget: a2, curEventTarget: s2, scope: e2 }, d2 = Ze(f2);
            c2.push([f2.pointer, f2.eventTarget, f2.curEventTarget, d2]);
          }
        } else {
          var h2 = false;
          if (!I.supportsPointerEvent && /mouse/.test(n2.type)) {
            for (var v2 = 0; v2 < r2.length && !h2; v2++) h2 = "mouse" !== r2[v2].pointerType && r2[v2].pointerIsDown;
            h2 = h2 || e2.now() - e2.prevTouchTime < 500 || 0 === n2.timeStamp;
          }
          if (!h2) {
            var g2 = { pointer: n2, pointerId: at(n2), pointerType: i2, eventType: n2.type, curEventTarget: s2, eventTarget: a2, scope: e2 }, m2 = Ze(g2);
            c2.push([g2.pointer, g2.eventTarget, g2.curEventTarget, m2]);
          }
        }
        for (var y2 = 0; y2 < c2.length; y2++) {
          var b2 = c2[y2], x2 = b2[0], w2 = b2[1], E2 = b2[2];
          b2[3][t2](x2, n2, w2, E2);
        }
      };
    }
    function Ze(t2) {
      var e2 = t2.pointerType, n2 = t2.scope, r2 = { interaction: $e.search(t2), searchDetails: t2 };
      return n2.fire("interactions:find", r2), r2.interaction || n2.interactions.new({ pointerType: e2 });
    }
    function tn(t2, e2) {
      var n2 = t2.doc, r2 = t2.scope, i2 = t2.options, o2 = r2.interactions.docEvents, a2 = r2.events, s2 = a2[e2];
      for (var c2 in r2.browser.isIOS && !i2.events && (i2.events = { passive: false }), a2.delegatedEvents) s2(n2, c2, a2.delegateListener), s2(n2, c2, a2.delegateUseCapture, true);
      for (var l2 = i2 && i2.events, u2 = 0; u2 < o2.length; u2++) {
        var p2 = o2[u2];
        s2(n2, p2.type, p2.listener, l2);
      }
    }
    var en = { id: "core/interactions", install: function(t2) {
      for (var e2 = {}, n2 = 0; n2 < Je.length; n2++) {
        var i2 = Je[n2];
        e2[i2] = Qe(i2, t2);
      }
      var a2, c2 = I.pEventTypes;
      function l2() {
        for (var e3 = 0, n3 = t2.interactions.list; e3 < n3.length; e3++) {
          var r2 = n3[e3];
          if (r2.pointerIsDown && "touch" === r2.pointerType && !r2._interacting) for (var i3 = function() {
            var e4 = a3[o2];
            t2.documents.some(function(t3) {
              return M(t3.doc, e4.downTarget);
            }) || r2.removePointer(e4.pointer, e4.event);
          }, o2 = 0, a3 = r2.pointers; o2 < a3.length; o2++) i3();
        }
      }
      (a2 = k.PointerEvent ? [{ type: c2.down, listener: l2 }, { type: c2.down, listener: e2.pointerDown }, { type: c2.move, listener: e2.pointerMove }, { type: c2.up, listener: e2.pointerUp }, { type: c2.cancel, listener: e2.pointerUp }] : [{ type: "mousedown", listener: e2.pointerDown }, { type: "mousemove", listener: e2.pointerMove }, { type: "mouseup", listener: e2.pointerUp }, { type: "touchstart", listener: l2 }, { type: "touchstart", listener: e2.pointerDown }, { type: "touchmove", listener: e2.pointerMove }, { type: "touchend", listener: e2.pointerUp }, { type: "touchcancel", listener: e2.pointerUp }]).push({ type: "blur", listener: function(e3) {
        for (var n3 = 0, r2 = t2.interactions.list; n3 < r2.length; n3++) {
          r2[n3].documentBlur(e3);
        }
      } }), t2.prevTouchTime = 0, t2.Interaction = function(e3) {
        s(i3, e3);
        var n3 = p(i3);
        function i3() {
          return r(this, i3), n3.apply(this, arguments);
        }
        return o(i3, [{ key: "pointerMoveTolerance", get: function() {
          return t2.interactions.pointerMoveTolerance;
        }, set: function(e4) {
          t2.interactions.pointerMoveTolerance = e4;
        } }, { key: "_now", value: function() {
          return t2.now();
        } }]), i3;
      }(De), t2.interactions = { list: [], new: function(e3) {
        e3.scopeFire = function(e4, n4) {
          return t2.fire(e4, n4);
        };
        var n3 = new t2.Interaction(e3);
        return t2.interactions.list.push(n3), n3;
      }, listeners: e2, docEvents: a2, pointerMoveTolerance: 1 }, t2.usePlugin(he);
    }, listeners: { "scope:add-document": function(t2) {
      return tn(t2, "add");
    }, "scope:remove-document": function(t2) {
      return tn(t2, "remove");
    }, "interactable:unset": function(t2, e2) {
      for (var n2 = t2.interactable, r2 = e2.interactions.list.length - 1; r2 >= 0; r2--) {
        var i2 = e2.interactions.list[r2];
        i2.interactable === n2 && (i2.stop(), e2.fire("interactions:destroy", { interaction: i2 }), i2.destroy(), e2.interactions.list.length > 2 && e2.interactions.list.splice(r2, 1));
      }
    } }, onDocSignal: tn, doOnInteractions: Qe, methodNames: Je }, nn = en, rn = function(t2) {
      return t2[t2.On = 0] = "On", t2[t2.Off = 1] = "Off", t2;
    }(rn || {}), on = function() {
      function t2(e2, n2, i2, o2) {
        r(this, t2), this.target = void 0, this.options = void 0, this._actions = void 0, this.events = new Ve(), this._context = void 0, this._win = void 0, this._doc = void 0, this._scopeEvents = void 0, this._actions = n2.actions, this.target = e2, this._context = n2.context || i2, this._win = y(B(e2) ? this._context : e2), this._doc = this._win.document, this._scopeEvents = o2, this.set(n2);
      }
      return o(t2, [{ key: "_defaults", get: function() {
        return { base: {}, perAction: {}, actions: {} };
      } }, { key: "setOnEvents", value: function(t3, e2) {
        return w.func(e2.onstart) && this.on("".concat(t3, "start"), e2.onstart), w.func(e2.onmove) && this.on("".concat(t3, "move"), e2.onmove), w.func(e2.onend) && this.on("".concat(t3, "end"), e2.onend), w.func(e2.oninertiastart) && this.on("".concat(t3, "inertiastart"), e2.oninertiastart), this;
      } }, { key: "updatePerActionListeners", value: function(t3, e2, n2) {
        var r2, i2 = this, o2 = null == (r2 = this._actions.map[t3]) ? void 0 : r2.filterEventType, a2 = function(t4) {
          return (null == o2 || o2(t4)) && ve(t4, i2._actions);
        };
        (w.array(e2) || w.object(e2)) && this._onOff(rn.Off, t3, e2, void 0, a2), (w.array(n2) || w.object(n2)) && this._onOff(rn.On, t3, n2, void 0, a2);
      } }, { key: "setPerAction", value: function(t3, e2) {
        var n2 = this._defaults;
        for (var r2 in e2) {
          var i2 = r2, o2 = this.options[t3], a2 = e2[i2];
          "listeners" === i2 && this.updatePerActionListeners(t3, o2.listeners, a2), w.array(a2) ? o2[i2] = mt(a2) : w.plainObject(a2) ? (o2[i2] = V(o2[i2] || {}, ge(a2)), w.object(n2.perAction[i2]) && "enabled" in n2.perAction[i2] && (o2[i2].enabled = false !== a2.enabled)) : w.bool(a2) && w.object(n2.perAction[i2]) ? o2[i2].enabled = a2 : o2[i2] = a2;
        }
      } }, { key: "getRect", value: function(t3) {
        return t3 = t3 || (w.element(this.target) ? this.target : null), w.string(this.target) && (t3 = t3 || this._context.querySelector(this.target)), L(t3);
      } }, { key: "rectChecker", value: function(t3) {
        var e2 = this;
        return w.func(t3) ? (this.getRect = function(n2) {
          var r2 = V({}, t3.apply(e2, n2));
          return "width" in r2 || (r2.width = r2.right - r2.left, r2.height = r2.bottom - r2.top), r2;
        }, this) : null === t3 ? (delete this.getRect, this) : this.getRect;
      } }, { key: "_backCompatOption", value: function(t3, e2) {
        if (B(e2) || w.object(e2)) {
          for (var n2 in this.options[t3] = e2, this._actions.map) this.options[n2][t3] = e2;
          return this;
        }
        return this.options[t3];
      } }, { key: "origin", value: function(t3) {
        return this._backCompatOption("origin", t3);
      } }, { key: "deltaSource", value: function(t3) {
        return "page" === t3 || "client" === t3 ? (this.options.deltaSource = t3, this) : this.options.deltaSource;
      } }, { key: "getAllElements", value: function() {
        var t3 = this.target;
        return w.string(t3) ? Array.from(this._context.querySelectorAll(t3)) : w.func(t3) && t3.getAllElements ? t3.getAllElements() : w.element(t3) ? [t3] : [];
      } }, { key: "context", value: function() {
        return this._context;
      } }, { key: "inContext", value: function(t3) {
        return this._context === t3.ownerDocument || M(this._context, t3);
      } }, { key: "testIgnoreAllow", value: function(t3, e2, n2) {
        return !this.testIgnore(t3.ignoreFrom, e2, n2) && this.testAllow(t3.allowFrom, e2, n2);
      } }, { key: "testAllow", value: function(t3, e2, n2) {
        return !t3 || !!w.element(n2) && (w.string(t3) ? F(n2, t3, e2) : !!w.element(t3) && M(t3, n2));
      } }, { key: "testIgnore", value: function(t3, e2, n2) {
        return !(!t3 || !w.element(n2)) && (w.string(t3) ? F(n2, t3, e2) : !!w.element(t3) && M(t3, n2));
      } }, { key: "fire", value: function(t3) {
        return this.events.fire(t3), this;
      } }, { key: "_onOff", value: function(t3, e2, n2, r2, i2) {
        w.object(e2) && !w.array(e2) && (r2 = n2, n2 = null);
        var o2 = $(e2, n2, i2);
        for (var a2 in o2) {
          "wheel" === a2 && (a2 = I.wheelEvent);
          for (var s2 = 0, c2 = o2[a2]; s2 < c2.length; s2++) {
            var l2 = c2[s2];
            ve(a2, this._actions) ? this.events[t3 === rn.On ? "on" : "off"](a2, l2) : w.string(this.target) ? this._scopeEvents[t3 === rn.On ? "addDelegate" : "removeDelegate"](this.target, this._context, a2, l2, r2) : this._scopeEvents[t3 === rn.On ? "add" : "remove"](this.target, a2, l2, r2);
          }
        }
        return this;
      } }, { key: "on", value: function(t3, e2, n2) {
        return this._onOff(rn.On, t3, e2, n2);
      } }, { key: "off", value: function(t3, e2, n2) {
        return this._onOff(rn.Off, t3, e2, n2);
      } }, { key: "set", value: function(t3) {
        var e2 = this._defaults;
        for (var n2 in w.object(t3) || (t3 = {}), this.options = ge(e2.base), this._actions.methodDict) {
          var r2 = n2, i2 = this._actions.methodDict[r2];
          this.options[r2] = {}, this.setPerAction(r2, V(V({}, e2.perAction), e2.actions[r2])), this[i2](t3[r2]);
        }
        for (var o2 in t3) "getRect" !== o2 ? w.func(this[o2]) && this[o2](t3[o2]) : this.rectChecker(t3.getRect);
        return this;
      } }, { key: "unset", value: function() {
        if (w.string(this.target)) for (var t3 in this._scopeEvents.delegatedEvents) for (var e2 = this._scopeEvents.delegatedEvents[t3], n2 = e2.length - 1; n2 >= 0; n2--) {
          var r2 = e2[n2], i2 = r2.selector, o2 = r2.context, a2 = r2.listeners;
          i2 === this.target && o2 === this._context && e2.splice(n2, 1);
          for (var s2 = a2.length - 1; s2 >= 0; s2--) this._scopeEvents.removeDelegate(this.target, this._context, t3, a2[s2][0], a2[s2][1]);
        }
        else this._scopeEvents.remove(this.target, "all");
      } }]), t2;
    }(), an = function() {
      function t2(e2) {
        var n2 = this;
        r(this, t2), this.list = [], this.selectorMap = {}, this.scope = void 0, this.scope = e2, e2.addListeners({ "interactable:unset": function(t3) {
          var e3 = t3.interactable, r2 = e3.target, i2 = w.string(r2) ? n2.selectorMap[r2] : r2[n2.scope.id], o2 = yt(i2, function(t4) {
            return t4 === e3;
          });
          i2.splice(o2, 1);
        } });
      }
      return o(t2, [{ key: "new", value: function(t3, e2) {
        e2 = V(e2 || {}, { actions: this.scope.actions });
        var n2 = new this.scope.Interactable(t3, e2, this.scope.document, this.scope.events);
        return this.scope.addDocument(n2._doc), this.list.push(n2), w.string(t3) ? (this.selectorMap[t3] || (this.selectorMap[t3] = []), this.selectorMap[t3].push(n2)) : (n2.target[this.scope.id] || Object.defineProperty(t3, this.scope.id, { value: [], configurable: true }), t3[this.scope.id].push(n2)), this.scope.fire("interactable:new", { target: t3, options: e2, interactable: n2, win: this.scope._win }), n2;
      } }, { key: "getExisting", value: function(t3, e2) {
        var n2 = e2 && e2.context || this.scope.document, r2 = w.string(t3), i2 = r2 ? this.selectorMap[t3] : t3[this.scope.id];
        if (i2) return bt(i2, function(e3) {
          return e3._context === n2 && (r2 || e3.inContext(t3));
        });
      } }, { key: "forEachMatch", value: function(t3, e2) {
        for (var n2 = 0, r2 = this.list; n2 < r2.length; n2++) {
          var i2 = r2[n2], o2 = void 0;
          if ((w.string(i2.target) ? w.element(t3) && R(t3, i2.target) : t3 === i2.target) && i2.inContext(t3) && (o2 = e2(i2)), void 0 !== o2) return o2;
        }
      } }]), t2;
    }();
    var sn = function() {
      function t2() {
        var e2 = this;
        r(this, t2), this.id = "__interact_scope_".concat(Math.floor(100 * Math.random())), this.isInitialized = false, this.listenerMaps = [], this.browser = I, this.defaults = ge(Te), this.Eventable = Ve, this.actions = { map: {}, phases: { start: true, move: true, end: true }, methodDict: {}, phaselessTypes: {} }, this.interactStatic = function(t3) {
          var e3 = function e4(n3, r2) {
            var i2 = t3.interactables.getExisting(n3, r2);
            return i2 || ((i2 = t3.interactables.new(n3, r2)).events.global = e4.globalEvents), i2;
          };
          return e3.getPointerAverage = lt, e3.getTouchBBox = ut, e3.getTouchDistance = pt, e3.getTouchAngle = ft, e3.getElementRect = L, e3.getElementClientRect = Y, e3.matchesSelector = R, e3.closest = z, e3.globalEvents = {}, e3.version = "1.10.27", e3.scope = t3, e3.use = function(t4, e4) {
            return this.scope.usePlugin(t4, e4), this;
          }, e3.isSet = function(t4, e4) {
            return !!this.scope.interactables.get(t4, e4 && e4.context);
          }, e3.on = Nt(function(t4, e4, n3) {
            if (w.string(t4) && -1 !== t4.search(" ") && (t4 = t4.trim().split(/ +/)), w.array(t4)) {
              for (var r2 = 0, i2 = t4; r2 < i2.length; r2++) {
                var o2 = i2[r2];
                this.on(o2, e4, n3);
              }
              return this;
            }
            if (w.object(t4)) {
              for (var a2 in t4) this.on(a2, t4[a2], e4);
              return this;
            }
            return ve(t4, this.scope.actions) ? this.globalEvents[t4] ? this.globalEvents[t4].push(e4) : this.globalEvents[t4] = [e4] : this.scope.events.add(this.scope.document, t4, e4, { options: n3 }), this;
          }, "The interact.on() method is being deprecated"), e3.off = Nt(function(t4, e4, n3) {
            if (w.string(t4) && -1 !== t4.search(" ") && (t4 = t4.trim().split(/ +/)), w.array(t4)) {
              for (var r2 = 0, i2 = t4; r2 < i2.length; r2++) {
                var o2 = i2[r2];
                this.off(o2, e4, n3);
              }
              return this;
            }
            if (w.object(t4)) {
              for (var a2 in t4) this.off(a2, t4[a2], e4);
              return this;
            }
            var s2;
            return ve(t4, this.scope.actions) ? t4 in this.globalEvents && -1 !== (s2 = this.globalEvents[t4].indexOf(e4)) && this.globalEvents[t4].splice(s2, 1) : this.scope.events.remove(this.scope.document, t4, e4, n3), this;
          }, "The interact.off() method is being deprecated"), e3.debug = function() {
            return this.scope;
          }, e3.supportsTouch = function() {
            return I.supportsTouch;
          }, e3.supportsPointerEvent = function() {
            return I.supportsPointerEvent;
          }, e3.stop = function() {
            for (var t4 = 0, e4 = this.scope.interactions.list; t4 < e4.length; t4++) e4[t4].stop();
            return this;
          }, e3.pointerMoveTolerance = function(t4) {
            return w.number(t4) ? (this.scope.interactions.pointerMoveTolerance = t4, this) : this.scope.interactions.pointerMoveTolerance;
          }, e3.addDocument = function(t4, e4) {
            this.scope.addDocument(t4, e4);
          }, e3.removeDocument = function(t4) {
            this.scope.removeDocument(t4);
          }, e3;
        }(this), this.InteractEvent = Se, this.Interactable = void 0, this.interactables = new an(this), this._win = void 0, this.document = void 0, this.window = void 0, this.documents = [], this._plugins = { list: [], map: {} }, this.onWindowUnload = function(t3) {
          return e2.removeDocument(t3.target);
        };
        var n2 = this;
        this.Interactable = function(t3) {
          s(i2, t3);
          var e3 = p(i2);
          function i2() {
            return r(this, i2), e3.apply(this, arguments);
          }
          return o(i2, [{ key: "_defaults", get: function() {
            return n2.defaults;
          } }, { key: "set", value: function(t4) {
            return f(c(i2.prototype), "set", this).call(this, t4), n2.fire("interactable:set", { options: t4, interactable: this }), this;
          } }, { key: "unset", value: function() {
            f(c(i2.prototype), "unset", this).call(this);
            var t4 = n2.interactables.list.indexOf(this);
            t4 < 0 || (n2.interactables.list.splice(t4, 1), n2.fire("interactable:unset", { interactable: this }));
          } }]), i2;
        }(on);
      }
      return o(t2, [{ key: "addListeners", value: function(t3, e2) {
        this.listenerMaps.push({ id: e2, map: t3 });
      } }, { key: "fire", value: function(t3, e2) {
        for (var n2 = 0, r2 = this.listenerMaps; n2 < r2.length; n2++) {
          var i2 = r2[n2].map[t3];
          if (i2 && false === i2(e2, this, t3)) return false;
        }
      } }, { key: "init", value: function(t3) {
        return this.isInitialized ? this : function(t4, e2) {
          t4.isInitialized = true, w.window(e2) && m(e2);
          return k.init(e2), I.init(e2), Lt.init(e2), t4.window = e2, t4.document = e2.document, t4.usePlugin(nn), t4.usePlugin(Ue), t4;
        }(this, t3);
      } }, { key: "pluginIsInstalled", value: function(t3) {
        var e2 = t3.id;
        return e2 ? !!this._plugins.map[e2] : -1 !== this._plugins.list.indexOf(t3);
      } }, { key: "usePlugin", value: function(t3, e2) {
        if (!this.isInitialized) return this;
        if (this.pluginIsInstalled(t3)) return this;
        if (t3.id && (this._plugins.map[t3.id] = t3), this._plugins.list.push(t3), t3.install && t3.install(this, e2), t3.listeners && t3.before) {
          for (var n2 = 0, r2 = this.listenerMaps.length, i2 = t3.before.reduce(function(t4, e3) {
            return t4[e3] = true, t4[cn(e3)] = true, t4;
          }, {}); n2 < r2; n2++) {
            var o2 = this.listenerMaps[n2].id;
            if (o2 && (i2[o2] || i2[cn(o2)])) break;
          }
          this.listenerMaps.splice(n2, 0, { id: t3.id, map: t3.listeners });
        } else t3.listeners && this.listenerMaps.push({ id: t3.id, map: t3.listeners });
        return this;
      } }, { key: "addDocument", value: function(t3, e2) {
        if (-1 !== this.getDocIndex(t3)) return false;
        var n2 = y(t3);
        e2 = e2 ? V({}, e2) : {}, this.documents.push({ doc: t3, options: e2 }), this.events.documents.push(t3), t3 !== this.document && this.events.add(n2, "unload", this.onWindowUnload), this.fire("scope:add-document", { doc: t3, window: n2, scope: this, options: e2 });
      } }, { key: "removeDocument", value: function(t3) {
        var e2 = this.getDocIndex(t3), n2 = y(t3), r2 = this.documents[e2].options;
        this.events.remove(n2, "unload", this.onWindowUnload), this.documents.splice(e2, 1), this.events.documents.splice(e2, 1), this.fire("scope:remove-document", { doc: t3, window: n2, scope: this, options: r2 });
      } }, { key: "getDocIndex", value: function(t3) {
        for (var e2 = 0; e2 < this.documents.length; e2++) if (this.documents[e2].doc === t3) return e2;
        return -1;
      } }, { key: "getDocOptions", value: function(t3) {
        var e2 = this.getDocIndex(t3);
        return -1 === e2 ? null : this.documents[e2].options;
      } }, { key: "now", value: function() {
        return (this.window.Date || Date).now();
      } }]), t2;
    }();
    function cn(t2) {
      return t2 && t2.replace(/\/.*$/, "");
    }
    var ln = new sn(), un = ln.interactStatic, pn = "undefined" != typeof globalThis ? globalThis : window;
    ln.init(pn);
    var fn = Object.freeze({ __proto__: null, edgeTarget: function() {
    }, elements: function() {
    }, grid: function(t2) {
      var e2 = [["x", "y"], ["left", "top"], ["right", "bottom"], ["width", "height"]].filter(function(e3) {
        var n3 = e3[0], r2 = e3[1];
        return n3 in t2 || r2 in t2;
      }), n2 = function(n3, r2) {
        for (var i2 = t2.range, o2 = t2.limits, a2 = void 0 === o2 ? { left: -1 / 0, right: 1 / 0, top: -1 / 0, bottom: 1 / 0 } : o2, s2 = t2.offset, c2 = void 0 === s2 ? { x: 0, y: 0 } : s2, l2 = { range: i2, grid: t2, x: null, y: null }, u2 = 0; u2 < e2.length; u2++) {
          var p2 = e2[u2], f2 = p2[0], d2 = p2[1], h2 = Math.round((n3 - c2.x) / t2[f2]), v2 = Math.round((r2 - c2.y) / t2[d2]);
          l2[f2] = Math.max(a2.left, Math.min(a2.right, h2 * t2[f2] + c2.x)), l2[d2] = Math.max(a2.top, Math.min(a2.bottom, v2 * t2[d2] + c2.y));
        }
        return l2;
      };
      return n2.grid = t2, n2.coordFields = e2, n2;
    } }), dn = { id: "snappers", install: function(t2) {
      var e2 = t2.interactStatic;
      e2.snappers = V(e2.snappers || {}, fn), e2.createSnapGrid = e2.snappers.grid;
    } }, hn = dn, vn = { start: function(t2) {
      var n2 = t2.state, r2 = t2.rect, i2 = t2.edges, o2 = t2.pageCoords, a2 = n2.options, s2 = a2.ratio, c2 = a2.enabled, l2 = n2.options, u2 = l2.equalDelta, p2 = l2.modifiers;
      "preserve" === s2 && (s2 = r2.width / r2.height), n2.startCoords = V({}, o2), n2.startRect = V({}, r2), n2.ratio = s2, n2.equalDelta = u2;
      var f2 = n2.linkedEdges = { top: i2.top || i2.left && !i2.bottom, left: i2.left || i2.top && !i2.right, bottom: i2.bottom || i2.right && !i2.top, right: i2.right || i2.bottom && !i2.left };
      if (n2.xIsPrimaryAxis = !(!i2.left && !i2.right), n2.equalDelta) {
        var d2 = (f2.left ? 1 : -1) * (f2.top ? 1 : -1);
        n2.edgeSign = { x: d2, y: d2 };
      } else n2.edgeSign = { x: f2.left ? -1 : 1, y: f2.top ? -1 : 1 };
      if (false !== c2 && V(i2, f2), null != p2 && p2.length) {
        var h2 = new me(t2.interaction);
        h2.copyFrom(t2.interaction.modification), h2.prepareStates(p2), n2.subModification = h2, h2.startAll(e({}, t2));
      }
    }, set: function(t2) {
      var n2 = t2.state, r2 = t2.rect, i2 = t2.coords, o2 = n2.linkedEdges, a2 = V({}, i2), s2 = n2.equalDelta ? gn : mn;
      if (V(t2.edges, o2), s2(n2, n2.xIsPrimaryAxis, i2, r2), !n2.subModification) return null;
      var c2 = V({}, r2);
      H(o2, c2, { x: i2.x - a2.x, y: i2.y - a2.y });
      var l2 = n2.subModification.setAll(e(e({}, t2), {}, { rect: c2, edges: o2, pageCoords: i2, prevCoords: i2, prevRect: c2 })), u2 = l2.delta;
      l2.changed && (s2(n2, Math.abs(u2.x) > Math.abs(u2.y), l2.coords, l2.rect), V(i2, l2.coords));
      return l2.eventProps;
    }, defaults: { ratio: "preserve", equalDelta: false, modifiers: [], enabled: false } };
    function gn(t2, e2, n2) {
      var r2 = t2.startCoords, i2 = t2.edgeSign;
      e2 ? n2.y = r2.y + (n2.x - r2.x) * i2.y : n2.x = r2.x + (n2.y - r2.y) * i2.x;
    }
    function mn(t2, e2, n2, r2) {
      var i2 = t2.startRect, o2 = t2.startCoords, a2 = t2.ratio, s2 = t2.edgeSign;
      if (e2) {
        var c2 = r2.width / a2;
        n2.y = o2.y + (c2 - i2.height) * s2.y;
      } else {
        var l2 = r2.height * a2;
        n2.x = o2.x + (l2 - i2.width) * s2.x;
      }
    }
    var yn = be(vn, "aspectRatio"), bn = function() {
    };
    bn._defaults = {};
    var xn = bn;
    function wn(t2, e2, n2) {
      return w.func(t2) ? G(t2, e2.interactable, e2.element, [n2.x, n2.y, e2]) : G(t2, e2.interactable, e2.element);
    }
    var En = { start: function(t2) {
      var e2 = t2.rect, n2 = t2.startOffset, r2 = t2.state, i2 = t2.interaction, o2 = t2.pageCoords, a2 = r2.options, s2 = a2.elementRect, c2 = V({ left: 0, top: 0, right: 0, bottom: 0 }, a2.offset || {});
      if (e2 && s2) {
        var l2 = wn(a2.restriction, i2, o2);
        if (l2) {
          var u2 = l2.right - l2.left - e2.width, p2 = l2.bottom - l2.top - e2.height;
          u2 < 0 && (c2.left += u2, c2.right += u2), p2 < 0 && (c2.top += p2, c2.bottom += p2);
        }
        c2.left += n2.left - e2.width * s2.left, c2.top += n2.top - e2.height * s2.top, c2.right += n2.right - e2.width * (1 - s2.right), c2.bottom += n2.bottom - e2.height * (1 - s2.bottom);
      }
      r2.offset = c2;
    }, set: function(t2) {
      var e2 = t2.coords, n2 = t2.interaction, r2 = t2.state, i2 = r2.options, o2 = r2.offset, a2 = wn(i2.restriction, n2, e2);
      if (a2) {
        var s2 = function(t3) {
          return !t3 || "left" in t3 && "top" in t3 || ((t3 = V({}, t3)).left = t3.x || 0, t3.top = t3.y || 0, t3.right = t3.right || t3.left + t3.width, t3.bottom = t3.bottom || t3.top + t3.height), t3;
        }(a2);
        e2.x = Math.max(Math.min(s2.right - o2.right, e2.x), s2.left + o2.left), e2.y = Math.max(Math.min(s2.bottom - o2.bottom, e2.y), s2.top + o2.top);
      }
    }, defaults: { restriction: null, elementRect: null, offset: null, endOnly: false, enabled: false } }, Tn = be(En, "restrict"), Sn = { top: 1 / 0, left: 1 / 0, bottom: -1 / 0, right: -1 / 0 }, _n = { top: -1 / 0, left: -1 / 0, bottom: 1 / 0, right: 1 / 0 };
    function Pn(t2, e2) {
      for (var n2 = 0, r2 = ["top", "left", "bottom", "right"]; n2 < r2.length; n2++) {
        var i2 = r2[n2];
        i2 in t2 || (t2[i2] = e2[i2]);
      }
      return t2;
    }
    var On = { noInner: Sn, noOuter: _n, start: function(t2) {
      var e2, n2 = t2.interaction, r2 = t2.startOffset, i2 = t2.state, o2 = i2.options;
      o2 && (e2 = N(wn(o2.offset, n2, n2.coords.start.page))), e2 = e2 || { x: 0, y: 0 }, i2.offset = { top: e2.y + r2.top, left: e2.x + r2.left, bottom: e2.y - r2.bottom, right: e2.x - r2.right };
    }, set: function(t2) {
      var e2 = t2.coords, n2 = t2.edges, r2 = t2.interaction, i2 = t2.state, o2 = i2.offset, a2 = i2.options;
      if (n2) {
        var s2 = V({}, e2), c2 = wn(a2.inner, r2, s2) || {}, l2 = wn(a2.outer, r2, s2) || {};
        Pn(c2, Sn), Pn(l2, _n), n2.top ? e2.y = Math.min(Math.max(l2.top + o2.top, s2.y), c2.top + o2.top) : n2.bottom && (e2.y = Math.max(Math.min(l2.bottom + o2.bottom, s2.y), c2.bottom + o2.bottom)), n2.left ? e2.x = Math.min(Math.max(l2.left + o2.left, s2.x), c2.left + o2.left) : n2.right && (e2.x = Math.max(Math.min(l2.right + o2.right, s2.x), c2.right + o2.right));
      }
    }, defaults: { inner: null, outer: null, offset: null, endOnly: false, enabled: false } }, kn = be(On, "restrictEdges"), Dn = V({ get elementRect() {
      return { top: 0, left: 0, bottom: 1, right: 1 };
    }, set elementRect(t2) {
    } }, En.defaults), In = be({ start: En.start, set: En.set, defaults: Dn }, "restrictRect"), Mn = { width: -1 / 0, height: -1 / 0 }, zn = { width: 1 / 0, height: 1 / 0 };
    var An = be({ start: function(t2) {
      return On.start(t2);
    }, set: function(t2) {
      var e2 = t2.interaction, n2 = t2.state, r2 = t2.rect, i2 = t2.edges, o2 = n2.options;
      if (i2) {
        var a2 = U(wn(o2.min, e2, t2.coords)) || Mn, s2 = U(wn(o2.max, e2, t2.coords)) || zn;
        n2.options = { endOnly: o2.endOnly, inner: V({}, On.noInner), outer: V({}, On.noOuter) }, i2.top ? (n2.options.inner.top = r2.bottom - a2.height, n2.options.outer.top = r2.bottom - s2.height) : i2.bottom && (n2.options.inner.bottom = r2.top + a2.height, n2.options.outer.bottom = r2.top + s2.height), i2.left ? (n2.options.inner.left = r2.right - a2.width, n2.options.outer.left = r2.right - s2.width) : i2.right && (n2.options.inner.right = r2.left + a2.width, n2.options.outer.right = r2.left + s2.width), On.set(t2), n2.options = o2;
      }
    }, defaults: { min: null, max: null, endOnly: false, enabled: false } }, "restrictSize");
    var Rn = { start: function(t2) {
      var e2, n2 = t2.interaction, r2 = t2.interactable, i2 = t2.element, o2 = t2.rect, a2 = t2.state, s2 = t2.startOffset, c2 = a2.options, l2 = c2.offsetWithOrigin ? function(t3) {
        var e3 = t3.interaction.element, n3 = N(G(t3.state.options.origin, null, null, [e3])), r3 = n3 || K(t3.interactable, e3, t3.interaction.prepared.name);
        return r3;
      }(t2) : { x: 0, y: 0 };
      if ("startCoords" === c2.offset) e2 = { x: n2.coords.start.page.x, y: n2.coords.start.page.y };
      else {
        var u2 = G(c2.offset, r2, i2, [n2]);
        (e2 = N(u2) || { x: 0, y: 0 }).x += l2.x, e2.y += l2.y;
      }
      var p2 = c2.relativePoints;
      a2.offsets = o2 && p2 && p2.length ? p2.map(function(t3, n3) {
        return { index: n3, relativePoint: t3, x: s2.left - o2.width * t3.x + e2.x, y: s2.top - o2.height * t3.y + e2.y };
      }) : [{ index: 0, relativePoint: null, x: e2.x, y: e2.y }];
    }, set: function(t2) {
      var e2 = t2.interaction, n2 = t2.coords, r2 = t2.state, i2 = r2.options, o2 = r2.offsets, a2 = K(e2.interactable, e2.element, e2.prepared.name), s2 = V({}, n2), c2 = [];
      i2.offsetWithOrigin || (s2.x -= a2.x, s2.y -= a2.y);
      for (var l2 = 0, u2 = o2; l2 < u2.length; l2++) for (var p2 = u2[l2], f2 = s2.x - p2.x, d2 = s2.y - p2.y, h2 = 0, v2 = i2.targets.length; h2 < v2; h2++) {
        var g2 = i2.targets[h2], m2 = void 0;
        (m2 = w.func(g2) ? g2(f2, d2, e2._proxy, p2, h2) : g2) && c2.push({ x: (w.number(m2.x) ? m2.x : f2) + p2.x, y: (w.number(m2.y) ? m2.y : d2) + p2.y, range: w.number(m2.range) ? m2.range : i2.range, source: g2, index: h2, offset: p2 });
      }
      for (var y2 = { target: null, inRange: false, distance: 0, range: 0, delta: { x: 0, y: 0 } }, b2 = 0; b2 < c2.length; b2++) {
        var x2 = c2[b2], E2 = x2.range, T2 = x2.x - s2.x, S2 = x2.y - s2.y, _2 = Q(T2, S2), P2 = _2 <= E2;
        E2 === 1 / 0 && y2.inRange && y2.range !== 1 / 0 && (P2 = false), y2.target && !(P2 ? y2.inRange && E2 !== 1 / 0 ? _2 / E2 < y2.distance / y2.range : E2 === 1 / 0 && y2.range !== 1 / 0 || _2 < y2.distance : !y2.inRange && _2 < y2.distance) || (y2.target = x2, y2.distance = _2, y2.range = E2, y2.inRange = P2, y2.delta.x = T2, y2.delta.y = S2);
      }
      return y2.inRange && (n2.x = y2.target.x, n2.y = y2.target.y), r2.closest = y2, y2;
    }, defaults: { range: 1 / 0, targets: null, offset: null, offsetWithOrigin: true, origin: null, relativePoints: null, endOnly: false, enabled: false } }, Cn = be(Rn, "snap");
    var jn = { start: function(t2) {
      var e2 = t2.state, n2 = t2.edges, r2 = e2.options;
      if (!n2) return null;
      t2.state = { options: { targets: null, relativePoints: [{ x: n2.left ? 0 : 1, y: n2.top ? 0 : 1 }], offset: r2.offset || "self", origin: { x: 0, y: 0 }, range: r2.range } }, e2.targetFields = e2.targetFields || [["width", "height"], ["x", "y"]], Rn.start(t2), e2.offsets = t2.state.offsets, t2.state = e2;
    }, set: function(t2) {
      var e2 = t2.interaction, n2 = t2.state, r2 = t2.coords, i2 = n2.options, o2 = n2.offsets, a2 = { x: r2.x - o2[0].x, y: r2.y - o2[0].y };
      n2.options = V({}, i2), n2.options.targets = [];
      for (var s2 = 0, c2 = i2.targets || []; s2 < c2.length; s2++) {
        var l2 = c2[s2], u2 = void 0;
        if (u2 = w.func(l2) ? l2(a2.x, a2.y, e2) : l2) {
          for (var p2 = 0, f2 = n2.targetFields; p2 < f2.length; p2++) {
            var d2 = f2[p2], h2 = d2[0], v2 = d2[1];
            if (h2 in u2 || v2 in u2) {
              u2.x = u2[h2], u2.y = u2[v2];
              break;
            }
          }
          n2.options.targets.push(u2);
        }
      }
      var g2 = Rn.set(t2);
      return n2.options = i2, g2;
    }, defaults: { range: 1 / 0, targets: null, offset: null, endOnly: false, enabled: false } }, Fn = be(jn, "snapSize");
    var Xn = { aspectRatio: yn, restrictEdges: kn, restrict: Tn, restrictRect: In, restrictSize: An, snapEdges: be({ start: function(t2) {
      var e2 = t2.edges;
      return e2 ? (t2.state.targetFields = t2.state.targetFields || [[e2.left ? "left" : "right", e2.top ? "top" : "bottom"]], jn.start(t2)) : null;
    }, set: jn.set, defaults: V(ge(jn.defaults), { targets: void 0, range: void 0, offset: { x: 0, y: 0 } }) }, "snapEdges"), snap: Cn, snapSize: Fn, spring: xn, avoid: xn, transform: xn, rubberband: xn }, Yn = { id: "modifiers", install: function(t2) {
      var e2 = t2.interactStatic;
      for (var n2 in t2.usePlugin(Ee), t2.usePlugin(hn), e2.modifiers = Xn, Xn) {
        var r2 = Xn[n2], i2 = r2._defaults, o2 = r2._methods;
        i2._methods = o2, t2.defaults.perAction[n2] = i2;
      }
    } }, Ln = Yn, qn = function(t2) {
      s(n2, t2);
      var e2 = p(n2);
      function n2(t3, i2, o2, a2, s2, c2) {
        var l2;
        if (r(this, n2), tt(u(l2 = e2.call(this, s2)), o2), o2 !== i2 && tt(u(l2), i2), l2.timeStamp = c2, l2.originalEvent = o2, l2.type = t3, l2.pointerId = at(i2), l2.pointerType = dt(i2), l2.target = a2, l2.currentTarget = null, "tap" === t3) {
          var p2 = s2.getPointerIndex(i2);
          l2.dt = l2.timeStamp - s2.pointers[p2].downTime;
          var f2 = l2.timeStamp - s2.tapTime;
          l2.double = !!s2.prevTap && "doubletap" !== s2.prevTap.type && s2.prevTap.target === l2.target && f2 < 500;
        } else "doubletap" === t3 && (l2.dt = i2.timeStamp - s2.tapTime, l2.double = true);
        return l2;
      }
      return o(n2, [{ key: "_subtractOrigin", value: function(t3) {
        var e3 = t3.x, n3 = t3.y;
        return this.pageX -= e3, this.pageY -= n3, this.clientX -= e3, this.clientY -= n3, this;
      } }, { key: "_addOrigin", value: function(t3) {
        var e3 = t3.x, n3 = t3.y;
        return this.pageX += e3, this.pageY += n3, this.clientX += e3, this.clientY += n3, this;
      } }, { key: "preventDefault", value: function() {
        this.originalEvent.preventDefault();
      } }]), n2;
    }(vt), Bn = { id: "pointer-events/base", before: ["inertia", "modifiers", "auto-start", "actions"], install: function(t2) {
      t2.pointerEvents = Bn, t2.defaults.actions.pointerEvents = Bn.defaults, V(t2.actions.phaselessTypes, Bn.types);
    }, listeners: { "interactions:new": function(t2) {
      var e2 = t2.interaction;
      e2.prevTap = null, e2.tapTime = 0;
    }, "interactions:update-pointer": function(t2) {
      var e2 = t2.down, n2 = t2.pointerInfo;
      if (!e2 && n2.hold) return;
      n2.hold = { duration: 1 / 0, timeout: null };
    }, "interactions:move": function(t2, e2) {
      var n2 = t2.interaction, r2 = t2.pointer, i2 = t2.event, o2 = t2.eventTarget;
      t2.duplicate || n2.pointerIsDown && !n2.pointerWasMoved || (n2.pointerIsDown && Gn(t2), Vn({ interaction: n2, pointer: r2, event: i2, eventTarget: o2, type: "move" }, e2));
    }, "interactions:down": function(t2, e2) {
      !function(t3, e3) {
        for (var n2 = t3.interaction, r2 = t3.pointer, i2 = t3.event, o2 = t3.eventTarget, a2 = t3.pointerIndex, s2 = n2.pointers[a2].hold, c2 = q(o2), l2 = { interaction: n2, pointer: r2, event: i2, eventTarget: o2, type: "hold", targets: [], path: c2, node: null }, u2 = 0; u2 < c2.length; u2++) {
          var p2 = c2[u2];
          l2.node = p2, e3.fire("pointerEvents:collect-targets", l2);
        }
        if (!l2.targets.length) return;
        for (var f2 = 1 / 0, d2 = 0, h2 = l2.targets; d2 < h2.length; d2++) {
          var v2 = h2[d2].eventable.options.holdDuration;
          v2 < f2 && (f2 = v2);
        }
        s2.duration = f2, s2.timeout = setTimeout(function() {
          Vn({ interaction: n2, eventTarget: o2, pointer: r2, event: i2, type: "hold" }, e3);
        }, f2);
      }(t2, e2), Vn(t2, e2);
    }, "interactions:up": function(t2, e2) {
      Gn(t2), Vn(t2, e2), function(t3, e3) {
        var n2 = t3.interaction, r2 = t3.pointer, i2 = t3.event, o2 = t3.eventTarget;
        n2.pointerWasMoved || Vn({ interaction: n2, eventTarget: o2, pointer: r2, event: i2, type: "tap" }, e3);
      }(t2, e2);
    }, "interactions:cancel": function(t2, e2) {
      Gn(t2), Vn(t2, e2);
    } }, PointerEvent: qn, fire: Vn, collectEventTargets: Wn, defaults: { holdDuration: 600, ignoreFrom: null, allowFrom: null, origin: { x: 0, y: 0 } }, types: { down: true, move: true, up: true, cancel: true, tap: true, doubletap: true, hold: true } };
    function Vn(t2, e2) {
      var n2 = t2.interaction, r2 = t2.pointer, i2 = t2.event, o2 = t2.eventTarget, a2 = t2.type, s2 = t2.targets, c2 = void 0 === s2 ? Wn(t2, e2) : s2, l2 = new qn(a2, r2, i2, o2, n2, e2.now());
      e2.fire("pointerEvents:new", { pointerEvent: l2 });
      for (var u2 = { interaction: n2, pointer: r2, event: i2, eventTarget: o2, targets: c2, type: a2, pointerEvent: l2 }, p2 = 0; p2 < c2.length; p2++) {
        var f2 = c2[p2];
        for (var d2 in f2.props || {}) l2[d2] = f2.props[d2];
        var h2 = K(f2.eventable, f2.node);
        if (l2._subtractOrigin(h2), l2.eventable = f2.eventable, l2.currentTarget = f2.node, f2.eventable.fire(l2), l2._addOrigin(h2), l2.immediatePropagationStopped || l2.propagationStopped && p2 + 1 < c2.length && c2[p2 + 1].node !== l2.currentTarget) break;
      }
      if (e2.fire("pointerEvents:fired", u2), "tap" === a2) {
        var v2 = l2.double ? Vn({ interaction: n2, pointer: r2, event: i2, eventTarget: o2, type: "doubletap" }, e2) : l2;
        n2.prevTap = v2, n2.tapTime = v2.timeStamp;
      }
      return l2;
    }
    function Wn(t2, e2) {
      var n2 = t2.interaction, r2 = t2.pointer, i2 = t2.event, o2 = t2.eventTarget, a2 = t2.type, s2 = n2.getPointerIndex(r2), c2 = n2.pointers[s2];
      if ("tap" === a2 && (n2.pointerWasMoved || !c2 || c2.downTarget !== o2)) return [];
      for (var l2 = q(o2), u2 = { interaction: n2, pointer: r2, event: i2, eventTarget: o2, type: a2, path: l2, targets: [], node: null }, p2 = 0; p2 < l2.length; p2++) {
        var f2 = l2[p2];
        u2.node = f2, e2.fire("pointerEvents:collect-targets", u2);
      }
      return "hold" === a2 && (u2.targets = u2.targets.filter(function(t3) {
        var e3, r3;
        return t3.eventable.options.holdDuration === (null == (e3 = n2.pointers[s2]) || null == (r3 = e3.hold) ? void 0 : r3.duration);
      })), u2.targets;
    }
    function Gn(t2) {
      var e2 = t2.interaction, n2 = t2.pointerIndex, r2 = e2.pointers[n2].hold;
      r2 && r2.timeout && (clearTimeout(r2.timeout), r2.timeout = null);
    }
    var Nn = Object.freeze({ __proto__: null, default: Bn });
    function Un(t2) {
      var e2 = t2.interaction;
      e2.holdIntervalHandle && (clearInterval(e2.holdIntervalHandle), e2.holdIntervalHandle = null);
    }
    var Hn = { id: "pointer-events/holdRepeat", install: function(t2) {
      t2.usePlugin(Bn);
      var e2 = t2.pointerEvents;
      e2.defaults.holdRepeatInterval = 0, e2.types.holdrepeat = t2.actions.phaselessTypes.holdrepeat = true;
    }, listeners: ["move", "up", "cancel", "endall"].reduce(function(t2, e2) {
      return t2["pointerEvents:".concat(e2)] = Un, t2;
    }, { "pointerEvents:new": function(t2) {
      var e2 = t2.pointerEvent;
      "hold" === e2.type && (e2.count = (e2.count || 0) + 1);
    }, "pointerEvents:fired": function(t2, e2) {
      var n2 = t2.interaction, r2 = t2.pointerEvent, i2 = t2.eventTarget, o2 = t2.targets;
      if ("hold" === r2.type && o2.length) {
        var a2 = o2[0].eventable.options.holdRepeatInterval;
        a2 <= 0 || (n2.holdIntervalHandle = setTimeout(function() {
          e2.pointerEvents.fire({ interaction: n2, eventTarget: i2, type: "hold", pointer: r2, event: r2 }, e2);
        }, a2));
      }
    } }) }, Kn = Hn;
    var $n = { id: "pointer-events/interactableTargets", install: function(t2) {
      var e2 = t2.Interactable;
      e2.prototype.pointerEvents = function(t3) {
        return V(this.events.options, t3), this;
      };
      var n2 = e2.prototype._backCompatOption;
      e2.prototype._backCompatOption = function(t3, e3) {
        var r2 = n2.call(this, t3, e3);
        return r2 === this && (this.events.options[t3] = e3), r2;
      };
    }, listeners: { "pointerEvents:collect-targets": function(t2, e2) {
      var n2 = t2.targets, r2 = t2.node, i2 = t2.type, o2 = t2.eventTarget;
      e2.interactables.forEachMatch(r2, function(t3) {
        var e3 = t3.events, a2 = e3.options;
        e3.types[i2] && e3.types[i2].length && t3.testIgnoreAllow(a2, r2, o2) && n2.push({ node: r2, eventable: e3, props: { interactable: t3 } });
      });
    }, "interactable:new": function(t2) {
      var e2 = t2.interactable;
      e2.events.getRect = function(t3) {
        return e2.getRect(t3);
      };
    }, "interactable:set": function(t2, e2) {
      var n2 = t2.interactable, r2 = t2.options;
      V(n2.events.options, e2.pointerEvents.defaults), V(n2.events.options, r2.pointerEvents || {});
    } } }, Jn = $n, Qn = { id: "pointer-events", install: function(t2) {
      t2.usePlugin(Nn), t2.usePlugin(Kn), t2.usePlugin(Jn);
    } }, Zn = Qn;
    var tr = { id: "reflow", install: function(t2) {
      var e2 = t2.Interactable;
      t2.actions.phases.reflow = true, e2.prototype.reflow = function(e3) {
        return function(t3, e4, n2) {
          for (var r2 = t3.getAllElements(), i2 = n2.window.Promise, o2 = i2 ? [] : null, a2 = function() {
            var a3 = r2[s2], c2 = t3.getRect(a3);
            if (!c2) return 1;
            var l2, u2 = bt(n2.interactions.list, function(n3) {
              return n3.interacting() && n3.interactable === t3 && n3.element === a3 && n3.prepared.name === e4.name;
            });
            if (u2) u2.move(), o2 && (l2 = u2._reflowPromise || new i2(function(t4) {
              u2._reflowResolve = t4;
            }));
            else {
              var p2 = U(c2), f2 = /* @__PURE__ */ function(t4) {
                return { coords: t4, get page() {
                  return this.coords.page;
                }, get client() {
                  return this.coords.client;
                }, get timeStamp() {
                  return this.coords.timeStamp;
                }, get pageX() {
                  return this.coords.page.x;
                }, get pageY() {
                  return this.coords.page.y;
                }, get clientX() {
                  return this.coords.client.x;
                }, get clientY() {
                  return this.coords.client.y;
                }, get pointerId() {
                  return this.coords.pointerId;
                }, get target() {
                  return this.coords.target;
                }, get type() {
                  return this.coords.type;
                }, get pointerType() {
                  return this.coords.pointerType;
                }, get buttons() {
                  return this.coords.buttons;
                }, preventDefault: function() {
                } };
              }({ page: { x: p2.x, y: p2.y }, client: { x: p2.x, y: p2.y }, timeStamp: n2.now() });
              l2 = function(t4, e5, n3, r3, i3) {
                var o3 = t4.interactions.new({ pointerType: "reflow" }), a4 = { interaction: o3, event: i3, pointer: i3, eventTarget: n3, phase: "reflow" };
                o3.interactable = e5, o3.element = n3, o3.prevEvent = i3, o3.updatePointer(i3, i3, n3, true), nt(o3.coords.delta), Ut(o3.prepared, r3), o3._doPhase(a4);
                var s3 = t4.window, c3 = s3.Promise, l3 = c3 ? new c3(function(t5) {
                  o3._reflowResolve = t5;
                }) : void 0;
                o3._reflowPromise = l3, o3.start(r3, e5, n3), o3._interacting ? (o3.move(a4), o3.end(i3)) : (o3.stop(), o3._reflowResolve());
                return o3.removePointer(i3, i3), l3;
              }(n2, t3, a3, e4, f2);
            }
            o2 && o2.push(l2);
          }, s2 = 0; s2 < r2.length && !a2(); s2++) ;
          return o2 && i2.all(o2).then(function() {
            return t3;
          });
        }(this, e3, t2);
      };
    }, listeners: { "interactions:stop": function(t2, e2) {
      var n2 = t2.interaction;
      "reflow" === n2.pointerType && (n2._reflowResolve && n2._reflowResolve(), function(t3, e3) {
        t3.splice(t3.indexOf(e3), 1);
      }(e2.interactions.list, n2));
    } } }, er = tr;
    if (un.use(he), un.use(Ce), un.use(Zn), un.use(qe), un.use(Ln), un.use(pe), un.use(Xt), un.use(Gt), un.use(er), un.default = un, "object" === n(module) && module) try {
      module.exports = un;
    } catch (t2) {
    }
    return un.default = un, un;
  });
})(interact_min, interact_min.exports);
var interact_minExports = interact_min.exports;
const interact = /* @__PURE__ */ getDefaultExportFromCjs(interact_minExports);
const imageFocus = (editor, el, node) => {
  event.off(el, "click");
  event.on(el, "click", () => {
    editor.setSelectionBefore(node, "start");
    editor.setSelectionAfter(node, "end");
    editor.updateRealSelection();
  });
};
const imageResizable = (editor, el, node) => {
  const parentWidth = element.width(el.parentElement);
  interact(el).unset();
  interact(el).resizable({
    //是否启用
    enabled: true,
    //指定可以调整大小的边缘
    edges: { left: false, right: true, bottom: false, top: false },
    //启用惯性效果
    inertia: false,
    //调整大小时的自动滚动功能
    autoScroll: true,
    //保持图片的宽高比
    preserveAspectRatio: true,
    //水平调整
    axis: "x",
    listeners: {
      start(event$1) {
        event.on(event$1.target, "dragstart", (e) => e.preventDefault());
      },
      //拖拽
      move(event2) {
        let { width } = event2.rect;
        if (width < 50) width = 50;
        if (width >= parentWidth) width = parentWidth;
        event2.target.style.width = `${width}px`;
      },
      //结束拖拽
      end(event$1) {
        event.off(event$1.target, "dragstart");
        let { width } = event$1.rect;
        if (width < 50) width = 50;
        if (width >= parentWidth) width = parentWidth;
        const percentWidth = Number((width / parentWidth * 100).toFixed(2));
        if (node.hasStyles()) {
          node.styles.width = `${percentWidth}%`;
        } else {
          node.styles = {
            width: `${percentWidth}%`
          };
        }
        editor.setSelectionAfter(node);
        editor.updateView();
      }
    }
  });
};
const ImageExtension = Extension.create({
  name: "image",
  pasteKeepMarks(node) {
    const marks = {};
    if (node.tag == "img" && node.hasMarks()) {
      marks["alt"] = node.marks["alt"] || "";
      marks["src"] = node.marks["src"] || "";
    }
    return marks;
  },
  pasteKeepStyles(node) {
    const styles = {};
    if (node.tag == "img" && node.hasStyles()) {
      styles["width"] = node.styles["width"] || "auto";
    }
    return styles;
  },
  afterUpdateView() {
    if (!this.isEditable()) {
      return;
    }
    const images = this.$el.querySelectorAll("img");
    images.forEach((el) => {
      const node = this.findNode(el);
      imageFocus(this, el, node);
      imageResizable(this, el, node);
    });
  },
  addCommands() {
    const getImage = () => {
      return this.getMatchNodeBySelection({
        tag: "img"
      });
    };
    const hasImage = () => {
      return this.isSelectionNodesSomeMatch({
        tag: "img"
      });
    };
    const setImage = async ({ src, alt, width }) => {
      if (!src) {
        return;
      }
      const imageNode = KNode.create({
        type: "closed",
        tag: "img",
        marks: {
          src,
          alt: alt || ""
        },
        styles: {
          width: width || "auto"
        }
      });
      this.insertNode(imageNode);
      this.setSelectionAfter(imageNode);
      await this.updateView();
    };
    return { getImage, hasImage, setImage };
  }
});
const BoldExtension = Extension.create({
  name: "bold",
  addCommands() {
    const isBold = () => {
      return this.commands.isTextStyle("fontWeight", "bold") || this.commands.isTextStyle("fontWeight", "700");
    };
    const setBold = async () => {
      if (isBold()) {
        return;
      }
      await this.commands.setTextStyle({
        fontWeight: "bold"
      });
    };
    const unsetBold = async () => {
      if (!isBold()) {
        return;
      }
      await this.commands.removeTextStyle(["fontWeight"]);
    };
    return {
      isBold,
      setBold,
      unsetBold
    };
  }
});
const ItalicExtension = Extension.create({
  name: "italic",
  addCommands() {
    const isItalic = () => {
      return this.commands.isTextStyle("fontStyle", "italic");
    };
    const setItalic = async () => {
      if (isItalic()) {
        return;
      }
      await this.commands.setTextStyle({
        fontStyle: "italic"
      });
    };
    const unsetItalic = async () => {
      if (!isItalic()) {
        return;
      }
      await this.commands.removeTextStyle(["fontStyle"]);
    };
    return {
      isItalic,
      setItalic,
      unsetItalic
    };
  }
});
const StrikethroughExtension = Extension.create({
  name: "strikethrough",
  addCommands() {
    const isStrikethrough = () => {
      return this.commands.isTextStyle("textDecoration", "line-through") || this.commands.isTextStyle("textDecorationLine", "line-through");
    };
    const setStrikethrough = async () => {
      if (isStrikethrough()) {
        return;
      }
      await this.commands.setTextStyle({
        textDecorationLine: "line-through"
      });
    };
    const unsetStrikethrough = async () => {
      if (!isStrikethrough()) {
        return;
      }
      await this.commands.removeTextStyle(["textDecoration", "textDecorationLine"]);
    };
    return {
      isStrikethrough,
      setStrikethrough,
      unsetStrikethrough
    };
  }
});
const UnderlineExtension = Extension.create({
  name: "underline",
  addCommands() {
    const isUnderline = () => {
      return this.commands.isTextStyle("textDecoration", "underline") || this.commands.isTextStyle("textDecorationLine", "underline");
    };
    const setUnderline = async () => {
      if (isUnderline()) {
        return;
      }
      await this.commands.setTextStyle({
        textDecorationLine: "underline"
      });
    };
    const unsetUnderline = async () => {
      if (!isUnderline()) {
        return;
      }
      await this.commands.removeTextStyle(["textDecoration", "textDecorationLine"]);
    };
    return {
      isUnderline,
      setUnderline,
      unsetUnderline
    };
  }
});
const SuperscriptExtension = Extension.create({
  name: "superscript",
  addCommands() {
    const isSuperscript = () => {
      return this.commands.isTextStyle("verticalAlign", "super");
    };
    const setSuperscript = async () => {
      if (isSuperscript()) {
        return;
      }
      await this.commands.setTextStyle({
        verticalAlign: "super"
      });
    };
    const unsetSuperscript = async () => {
      if (!isSuperscript()) {
        return;
      }
      await this.commands.removeTextStyle(["verticalAlign"]);
    };
    return {
      isSuperscript,
      setSuperscript,
      unsetSuperscript
    };
  }
});
const SubscriptExtension = Extension.create({
  name: "subscript",
  addCommands() {
    const isSubscript = () => {
      return this.commands.isTextStyle("verticalAlign", "sub");
    };
    const setSubscript = async () => {
      if (isSubscript()) {
        return;
      }
      await this.commands.setTextStyle({
        verticalAlign: "sub"
      });
    };
    const unsetSubscript = async () => {
      if (!isSubscript()) {
        return;
      }
      await this.commands.removeTextStyle(["verticalAlign"]);
    };
    return {
      isSubscript,
      setSubscript,
      unsetSubscript
    };
  }
});
const CodeExtension = Extension.create({
  name: "code",
  addCommands() {
    const getCode = () => {
      return this.getMatchNodeBySelection({
        tag: "code"
      });
    };
    const hasCode = () => {
      return this.isSelectionNodesSomeMatch({
        tag: "code"
      });
    };
    const allCode = () => {
      return this.isSelectionNodesAllMatch({
        tag: "code"
      });
    };
    const setCode = async () => {
    };
    const unsetCode = async () => {
    };
    return {
      getCode,
      hasCode,
      allCode,
      setCode,
      unsetCode
    };
  }
});
const FontSizeExtension = Extension.create({
  name: "fontSize",
  addCommands() {
    const isFontSize = (val) => {
      return this.commands.isTextStyle("fontSize", val);
    };
    const setFontSize = async (val) => {
      if (isFontSize(val)) {
        return;
      }
      await this.commands.setTextStyle({
        fontSize: val
      });
    };
    const unsetFontSize = async (val) => {
      if (!isFontSize(val)) {
        return;
      }
      await this.commands.removeTextStyle(["fontSize"]);
    };
    return {
      isFontSize,
      setFontSize,
      unsetFontSize
    };
  }
});
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
    if (!/(^on)|(^style$)/g.test(attr)) {
      element2.setAttribute(attr, `${opts.attrs[attr]}`);
    }
  });
  Object.keys(opts.styles).forEach((style) => {
    element2.style.setProperty(camelToKebab(style), `${opts.styles[style]}`);
  });
  return element2;
};
const defaultUpdateView = function(init) {
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
            dom.style.removeProperty(camelToKebab(key));
          }
          for (let key in addStyles) {
            dom.style.setProperty(camelToKebab(key), `${addStyles[key]}`);
          }
        } else if (item.update == "marks") {
          const { addMarks, removeMarks } = getDifferentMarks(item.newNode, item.oldNode);
          for (let key in removeMarks) {
            dom.removeAttribute(key);
          }
          for (let key in addMarks) {
            if (!/(^on)|(^style$)/g.test(key)) {
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
          try {
            const previousDom = this.findDom(previousNode);
            previousDom.nextElementSibling ? parentDom.insertBefore(dom, previousDom.nextElementSibling) : parentDom.appendChild(dom);
          } catch (error) {
            parentDom.firstElementChild ? parentDom.insertBefore(dom, parentDom.firstElementChild) : parentDom.appendChild(dom);
          }
        } else {
          parentDom.firstElementChild ? parentDom.insertBefore(dom, parentDom.firstElementChild) : parentDom.appendChild(dom);
        }
      }
    });
  }
};
const FontFamilyExtension = Extension.create({
  name: "fontFamily",
  addCommands() {
    const isFontFamily = (val) => {
      return this.commands.isTextStyle("fontFamily", val);
    };
    const setFontFamily = async (val) => {
      if (isFontFamily(val)) {
        return;
      }
      await this.commands.setTextStyle({
        fontFamily: val
      });
    };
    const unsetFontFamily = async (val) => {
      if (!isFontFamily(val)) {
        return;
      }
      await this.commands.removeTextStyle(["fontFamily"]);
    };
    return {
      isFontFamily,
      setFontFamily,
      unsetFontFamily
    };
  }
});
class Editor {
  constructor() {
    /**
     * 编辑器的真实dom【初始化后不可修改】
     */
    __publicField(this, "$el");
    /**
     * 是否允许复制【初始化后可以修改】
     */
    __publicField(this, "allowCopy", true);
    /**
     * 是否允许粘贴【初始化后可以修改】
     */
    __publicField(this, "allowPaste", true);
    /**
     * 是否允许剪切【初始化后可以修改】
     */
    __publicField(this, "allowCut", true);
    /**
     * 是否允许粘贴html【初始化后可以修改】
     */
    __publicField(this, "allowPasteHtml", false);
    /**
     * 编辑器内渲染文本节点的真实标签【初始化后不建议修改】
     */
    __publicField(this, "textRenderTag", "span");
    /**
     * 编辑内渲染默认块级节点的真实标签，即段落标签【初始化后不建议修改】
     */
    __publicField(this, "blockRenderTag", "p");
    /**
     * 编辑器内定义不显示的标签【初始化后不建议修改】
     */
    __publicField(this, "voidRenderTags", ["colgroup", "col"]);
    /**
     * 编辑器内定义需要置空的标签【初始化后不建议修改】
     */
    __publicField(this, "emptyRenderTags", ["meta", "link", "style", "script", "title", "base", "noscript", "template", "annotation"]);
    /**
     * 编辑器内额外保留的标签【初始化后不建议修改】
     */
    __publicField(this, "extraKeepTags", []);
    /**
     * 插件数组【初始化后不可修改】
     */
    __publicField(this, "extensions", [ImageExtension, TextExtension, HistoryExtension, BoldExtension, ItalicExtension, StrikethroughExtension, UnderlineExtension, SuperscriptExtension, SubscriptExtension, CodeExtension, FontSizeExtension, FontFamilyExtension]);
    /**
     * 编辑器的节点数组格式化规则【初始化后不可修改】
     */
    __publicField(this, "formatRules", [formatBlockInChildren, formatInlineParseText, formatPlaceholderMerge, formatZeroWidthTextMerge, formatSiblingNodesMerge, formatParentNodeMerge]);
    /**
     * 自定义dom转为非文本节点的后续处理【初始化后不可修改】
     */
    __publicField(this, "domParseNodeCallback");
    /**
     * 视图渲染时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要自定义渲染视图【初始化后不可修改】
     */
    __publicField(this, "onUpdateView");
    /**
     * 编辑器粘贴纯文本时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理【初始化后不可修改】
     */
    __publicField(this, "onPasteText");
    /**
     * 编辑器粘贴html内容时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理【初始化后不可修改】
     */
    __publicField(this, "onPasteHtml");
    /**
     * 编辑器粘贴图片时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理【初始化后不可修改】
     */
    __publicField(this, "onPasteImage");
    /**
     * 编辑器粘贴视频时触发，如果返回true则表示继续使用默认逻辑，返回false则不走默认逻辑，需要进行自定义处理【初始化后不可修改】
     */
    __publicField(this, "onPasteVideo");
    /**
     * 编辑器粘贴除了图片和视频以外的文件时触发，需要自定义处理【初始化后不可修改】
     */
    __publicField(this, "onPasteFile");
    /**
     * 编辑器内容改变触发【初始化后不可修改】
     */
    __publicField(this, "onChange");
    /**
     * 编辑器光标发生变化【初始化后不可修改】
     */
    __publicField(this, "onSelectionUpdate");
    /**
     * 插入段落时触发【初始化后不可修改】
     */
    __publicField(this, "onInsertParagraph");
    /**
     * 光标在编辑器起始位置执行删除时触发【初始化后不可修改】
     */
    __publicField(this, "onDeleteInStart");
    /**
     * 完成删除时触发【初始化后不可修改】
     */
    __publicField(this, "onDeleteComplete");
    /**
     * 光标在编辑器内时键盘按下触发【初始化后不可修改】
     */
    __publicField(this, "onKeydown");
    /**
     * 光标在编辑器内时键盘松开触发【初始化后不可修改】
     */
    __publicField(this, "onKeyup");
    /**
     * 编辑器聚焦时触发【初始化后不可修改】
     */
    __publicField(this, "onFocus");
    /**
     * 编辑器失焦时触发【初始化后不可修改】
     */
    __publicField(this, "onBlur");
    /**
     * 节点粘贴保留标记的自定义方法【初始化后不可修改】
     */
    __publicField(this, "pasteKeepMarks");
    /**
     * 节点粘贴保留样式的自定义方法【初始化后不可修改】
     */
    __publicField(this, "pasteKeepStyles");
    /**
     * 视图更新后回调方法【初始化后不可修改】
     */
    __publicField(this, "afterUpdateView");
    /*---------------------下面的属性都是不属于创建编辑器的参数---------------------------*/
    /**
     * 唯一id【不可修改】
     */
    __publicField(this, "guid", createGuid());
    /**
     * 虚拟光标【不建议修改】
     */
    __publicField(this, "selection", new Selection());
    /**
     * 历史记录【不建议修改】
     */
    __publicField(this, "history", new History());
    /**
     * 命令集合
     */
    __publicField(this, "commands", {});
    /**
     * 节点数组【不建议修改】
     */
    __publicField(this, "stackNodes", []);
    /**
     * 旧节点数组【不可修改】
     */
    __publicField(this, "oldStackNodes", []);
    /**
     * 是否在输入中文【不可修改】
     */
    __publicField(this, "isComposition", false);
    /**
     * 是否编辑器内部渲染真实光标引起selctionChange事件【不可修改】
     */
    __publicField(this, "internalCauseSelectionChange", false);
    /**
     * dom监听【不可修改】
     */
    __publicField(this, "domObserver", null);
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
    const uneditableNode = target.getUneditable();
    if (uneditableNode) {
      uneditableNode.toEmpty();
    } else {
      const nodes = target.children.map((item) => {
        item.parent = node;
        return item;
      });
      node.children.push(...nodes);
      target.children = [];
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
        targetNode.textContent = node.textContent;
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
   * 对节点数组使用指定规则进行格式化
   */
  formatNodes(rule, nodes) {
    let i = 0;
    while (i < nodes.length) {
      const node = nodes[i];
      if (node.isEmpty()) {
        if (this.isSelectionInNode(node, "start")) {
          this.updateSelectionRecently("start");
        }
        if (this.isSelectionInNode(node, "end")) {
          this.updateSelectionRecently("end");
        }
        nodes.splice(i, 1);
        continue;
      }
      rule({ editor: this, node });
      if (node.isEmpty()) {
        if (this.isSelectionInNode(node, "start")) {
          this.updateSelectionRecently("start");
        }
        if (this.isSelectionInNode(node, "end")) {
          this.updateSelectionRecently("end");
        }
        const index = nodes.findIndex((item) => item.isEqual(node));
        nodes.splice(index, 1);
        continue;
      }
      if (!node.isBlock() && this.stackNodes === nodes) {
        this.convertToBlock(node);
      }
      if (node.hasChildren()) {
        this.formatNodes(rule, node.children);
      }
      if (node.isEmpty()) {
        if (this.isSelectionInNode(node, "start")) {
          this.updateSelectionRecently("start");
        }
        if (this.isSelectionInNode(node, "end")) {
          this.updateSelectionRecently("end");
        }
        const index = nodes.findIndex((item) => item.isEqual(node));
        nodes.splice(index, 1);
        continue;
      }
      i++;
    }
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
   * 注册插件
   */
  registerExtension(extension) {
    if (extension.registered) return;
    extension.registered = true;
    if (extension.extraKeepTags) {
      this.extraKeepTags = [...extension.extraKeepTags, ...this.extraKeepTags];
    }
    if (extension.domParseNodeCallback) {
      const fn = this.domParseNodeCallback;
      this.domParseNodeCallback = (node) => {
        node = extension.domParseNodeCallback.apply(this, [node]);
        if (fn) node = fn.apply(this, [node]);
        return node;
      };
    }
    if (extension.formatRule) {
      this.formatRules = [extension.formatRule, ...this.formatRules];
    }
    if (extension.pasteKeepMarks) {
      const fn = this.pasteKeepMarks;
      this.pasteKeepMarks = (node) => {
        const marks = extension.pasteKeepMarks.apply(this, [node]);
        if (fn) Object.assign(marks, fn.apply(this, [node]));
        return marks;
      };
    }
    if (extension.pasteKeepStyles) {
      const fn = this.pasteKeepStyles;
      this.pasteKeepStyles = (node) => {
        const styles = extension.pasteKeepStyles.apply(this, [node]);
        if (fn) Object.assign(styles, fn.apply(this, [node]));
        return styles;
      };
    }
    if (extension.afterUpdateView) {
      const fn = this.afterUpdateView;
      this.afterUpdateView = () => {
        extension.afterUpdateView.apply(this);
        if (fn) fn.apply(this);
      };
    }
    if (extension.addCommands) {
      const commands = extension.addCommands.apply(this);
      this.commands = { ...this.commands, ...commands };
    }
  }
  /**
   * 【API】如果编辑器内有滚动条，滚动编辑器到光标可视范围
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
   * 【API】根据dom查找到编辑内的对应节点
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
   * 【API】根据编辑器内的node查找真实dom
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
   * 【API】设置编辑器是否可编辑
   */
  setEditable(editable) {
    var _a, _b, _c;
    if (editable) {
      (_a = this.$el) == null ? void 0 : _a.setAttribute("contenteditable", "true");
    } else {
      (_b = this.$el) == null ? void 0 : _b.removeAttribute("contenteditable");
    }
    (_c = this.$el) == null ? void 0 : _c.setAttribute("spellcheck", "false");
  }
  /**
   * 【API】判断编辑器是否可编辑
   */
  isEditable() {
    var _a;
    return ((_a = this.$el) == null ? void 0 : _a.getAttribute("contenteditable")) == "true";
  }
  /**
   * 【API】初始化校验编辑器的节点数组，如果编辑器的节点数组为空或者都是空节点，则初始化创建一个只有占位符的段落
   */
  checkNodes() {
    const nodes = this.stackNodes.filter((item) => {
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
   * 【API】将编辑器内的某个非块级节点转为默认块级节点
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
   * 【API】dom转KNode
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
      if (block.parse) config.tag = this.blockRenderTag;
      if (block.fixed) config.fixed = block.fixed;
    } else if (inline) {
      config.type = "inline";
      config.children = [];
      if (inline.parse) config.tag = this.textRenderTag;
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
   * 【API】html转KNode
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
   * 【API】将指定节点添加到某个节点的子节点数组里
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
   * 【API】将指定节点添加到某个节点前面
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
   * 【API】将指定节点添加到某个节点后面
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
   * 【API】获取某个节点内的最后一个可以设置光标点的节点
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
   * 【API】获取某个节点内的第一个可以设置光标点的节点
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
   * 【API】查找指定节点之前可以设置为光标点的非空节点
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
   * 【API】查找指定节点之后可以设置为光标点的非空节点
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
   * 【API】设置光标到指定节点头部，如果没有指定节点则设置光标到编辑器头部，start表示只设置起点，end表示只设置终点，all表示起点和终点都设置
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
      if (!selectionNode) selectionNode = this.getNextSelectionNode(firstNode);
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
   * 【API】设置光标到指定节点的末尾，如果没有指定节点则设置光标到编辑器末尾，start表示只设置起点，end表示只设置终点，all表示起点和终点都设置
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
      if (!selectionNode) selectionNode = this.getPreviousSelectionNode(lastNode);
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
   * 【API】更新指定光标到离当前光标点最近的节点上，start表示只更新起点，end表示只更新终点，all表示起点和终点都更新
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
   * 【API】判断光标是否在某个节点内，start表示只判断起点，end表示只判断终点，all表示起点和终点都判断
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
   * 【API】获取光标选区内的节点
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
   * 【API】判断光标范围内的可聚焦节点是否全都在同一个符合条件节点内，如果是返回那个符合条件的节点，否则返回null
   */
  getMatchNodeBySelection(options) {
    if (!this.selection.focused()) {
      return null;
    }
    if (this.selection.collapsed()) {
      return this.selection.start.node.getMatchNode(options);
    }
    const nodes = [];
    this.getSelectedNodes().forEach((item) => {
      nodes.push(...item.node.getFocusNodes("all"));
    });
    const matchNode = nodes[0].getMatchNode(options);
    if (matchNode && nodes.every((item) => matchNode.isContains(item))) {
      return matchNode;
    }
    return null;
  }
  /**
   * 【API】判断光标范围内的可聚焦节点是否全都在符合条件的节点内（不一定是同一个节点）
   */
  isSelectionNodesAllMatch(options) {
    if (!this.selection.focused()) {
      return false;
    }
    if (this.selection.collapsed()) {
      return !!this.selection.start.node.getMatchNode(options);
    }
    const nodes = [];
    this.getSelectedNodes().forEach((item) => {
      nodes.push(...item.node.getFocusNodes("all"));
    });
    return nodes.every((item) => !!item.getMatchNode(options));
  }
  /**
   * 【API】判断光标范围内是否有可聚焦节点在符合条件的节点内
   */
  isSelectionNodesSomeMatch(options) {
    if (!this.selection.focused()) {
      return false;
    }
    if (this.selection.collapsed()) {
      return !!this.selection.start.node.getMatchNode(options);
    }
    const nodes = [];
    this.getSelectedNodes().forEach((item) => {
      nodes.push(...item.node.getFocusNodes("all"));
    });
    return nodes.some((item) => !!item.getMatchNode(options));
  }
  /**
   * 【API】获取所有在光标范围内的可聚焦节点，该方法拿到的可聚焦节点（文本）可能部分区域不在光标范围内
   */
  getFocusNodesBySelection(type = "all") {
    if (!this.selection.focused()) {
      return [];
    }
    if (this.selection.collapsed()) {
      return this.selection.start.node.getFocusNodes(type);
    }
    const nodes = [];
    this.getSelectedNodes().forEach((item) => {
      nodes.push(...item.node.getFocusNodes(type));
    });
    return nodes;
  }
  /**
   * 【API】向选区插入文本
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
   * 【API】向选区进行换行
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
          if (blockNode.allIsPlaceholder() && blockNode.tag != this.blockRenderTag) {
            if (blockNode.tag == "li" && blockNode.parent && ["ol", "ul"].includes(blockNode.parent.tag)) {
              const listNode = blockNode.parent;
              const index = listNode.children.findIndex((item) => item.isEqual(blockNode));
              if (index == 0) {
                listNode.children.splice(index, 1);
                this.addNodeBefore(blockNode, listNode);
              } else if (index == listNode.children.length - 1) {
                listNode.children.splice(index, 1);
                this.addNodeAfter(blockNode, listNode);
              } else {
                const newParent = blockNode.parent.clone(false);
                const listItems = listNode.children;
                listNode.children = listItems.slice(0, index);
                newParent.children = listItems.slice(index + 1);
                this.addNodeAfter(blockNode, listNode);
                this.addNodeAfter(newParent, blockNode);
              }
            }
            blockNode.tag = this.blockRenderTag;
            blockNode.marks = {};
            blockNode.styles = {};
          } else {
            const newBlockNode = blockNode.clone(false);
            const placeholderNode = KNode.createPlaceholder();
            this.addNode(placeholderNode, newBlockNode);
            this.addNodeBefore(newBlockNode, blockNode);
            if (typeof this.onInsertParagraph == "function") {
              this.onInsertParagraph.apply(this, [blockNode, newBlockNode]);
            }
          }
        } else if (lastSelectionNode.isEqual(node) && offset == (node.isText() ? node.textContent.length : 1)) {
          if (blockNode.allIsPlaceholder() && blockNode.tag != this.blockRenderTag) {
            if (blockNode.tag == "li" && blockNode.parent && ["ol", "ul"].includes(blockNode.parent.tag)) {
              const listNode = blockNode.parent;
              const index = listNode.children.findIndex((item) => item.isEqual(blockNode));
              if (index == 0) {
                listNode.children.splice(index, 1);
                this.addNodeBefore(blockNode, listNode);
              } else if (index == listNode.children.length - 1) {
                listNode.children.splice(index, 1);
                this.addNodeAfter(blockNode, listNode);
              } else {
                const newParent = blockNode.parent.clone(false);
                const listItems = listNode.children;
                listNode.children = listItems.slice(0, index);
                newParent.children = listItems.slice(index + 1);
                this.addNodeAfter(blockNode, listNode);
                this.addNodeAfter(newParent, blockNode);
              }
            }
            blockNode.tag = this.blockRenderTag;
            blockNode.marks = {};
            blockNode.styles = {};
          } else {
            const newBlockNode = blockNode.clone(false);
            const placeholderNode = KNode.createPlaceholder();
            this.addNode(placeholderNode, newBlockNode);
            this.addNodeAfter(newBlockNode, blockNode);
            this.setSelectionBefore(placeholderNode);
            if (typeof this.onInsertParagraph == "function") {
              this.onInsertParagraph.apply(this, [newBlockNode, blockNode]);
            }
          }
        } else {
          if (blockNode.allIsPlaceholder() && blockNode.tag != this.blockRenderTag) {
            if (blockNode.tag == "li" && blockNode.parent && ["ol", "ul"].includes(blockNode.parent.tag)) {
              const listNode = blockNode.parent;
              const index = listNode.children.findIndex((item) => item.isEqual(blockNode));
              if (index == 0) {
                listNode.children.splice(index, 1);
                this.addNodeBefore(blockNode, listNode);
              } else if (index == listNode.children.length - 1) {
                listNode.children.splice(index, 1);
                this.addNodeAfter(blockNode, listNode);
              } else {
                const newParent = blockNode.parent.clone(false);
                const listItems = listNode.children;
                listNode.children = listItems.slice(0, index);
                newParent.children = listItems.slice(index + 1);
                this.addNodeAfter(blockNode, listNode);
                this.addNodeAfter(newParent, blockNode);
              }
            }
            blockNode.tag = this.blockRenderTag;
            blockNode.marks = {};
            blockNode.styles = {};
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
      }
    } else {
      this.delete();
      this.insertParagraph();
    }
  }
  /**
   * 【API】向选区插入节点，cover为true表示当向某个只有占位符的非固定块节点被插入另一个非固定块节点时是否覆盖此节点，而不是直接插入进去
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
   * 【API】对选区进行删除
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
   * 【API】更新编辑器视图
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
          this.formatNodes(rule, node.parent ? node.parent.children : this.stackNodes);
        });
      }
    });
    this.checkNodes();
    const oldHtml = this.$el.innerHTML;
    const useDefault = typeof this.onUpdateView == "function" ? await this.onUpdateView.apply(this, [false]) : true;
    if (useDefault) {
      defaultUpdateView.apply(this, [false]);
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
    if (typeof this.afterUpdateView == "function") this.afterUpdateView.apply(this);
  }
  /**
   * 【API】根据selection更新编辑器真实光标
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
   * 【API】根据真实光标更新selection，返回布尔值表示是否更新成功
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
   * 【API】销毁编辑器的方法
   */
  destroy() {
    this.setEditable(false);
    event.off(document, `selectionchange.kaitify_${this.guid}`);
    event.off(this.$el, "beforeinput.kaitify compositionstart.kaitify compositionupdate.kaitify compositionend.kaitify keydown.kaitify keyup.kaitify copy.kaitify focus.kaitify blur.kaitify");
  }
  /**
   * 【API】配置编辑器，返回创建的编辑器
   */
  static async configure(options) {
    const editor = new Editor();
    editor.$el = initEditorDom(options.el);
    if (options.useDefaultCSS !== false) editor.$el.className = "Kaitify";
    if (typeof options.allowCopy == "boolean") editor.allowCopy = options.allowCopy;
    if (typeof options.allowCut == "boolean") editor.allowCut = options.allowCut;
    if (typeof options.allowPaste == "boolean") editor.allowPaste = options.allowPaste;
    if (typeof options.allowPasteHtml == "boolean") editor.allowPasteHtml = options.allowPasteHtml;
    if (options.textRenderTag) editor.textRenderTag = options.textRenderTag;
    if (options.blockRenderTag) editor.blockRenderTag = options.blockRenderTag;
    if (options.voidRenderTags) editor.voidRenderTags = options.voidRenderTags;
    if (options.emptyRenderTags) editor.emptyRenderTags = options.emptyRenderTags;
    if (options.extraKeepTags) editor.extraKeepTags = options.extraKeepTags;
    if (options.extensions) editor.extensions = [...editor.extensions, ...options.extensions];
    if (options.formatRules) editor.formatRules = [...options.formatRules, ...editor.formatRules];
    if (options.domParseNodeCallback) editor.domParseNodeCallback = options.domParseNodeCallback;
    if (options.onUpdateView) editor.onUpdateView = options.onUpdateView;
    if (options.onPasteText) editor.onPasteText = options.onPasteText;
    if (options.onPasteHtml) editor.onPasteHtml = options.onPasteHtml;
    if (options.onPasteImage) editor.onPasteImage = options.onPasteImage;
    if (options.onPasteVideo) editor.onPasteVideo = options.onPasteVideo;
    if (options.onPasteFile) editor.onPasteFile = options.onPasteFile;
    if (options.onChange) editor.onChange = options.onChange;
    if (options.onSelectionUpdate) editor.onSelectionUpdate = options.onSelectionUpdate;
    if (options.onInsertParagraph) editor.onInsertParagraph = options.onInsertParagraph;
    if (options.onDeleteInStart) editor.onDeleteInStart = options.onDeleteInStart;
    if (options.onDeleteComplete) editor.onDeleteComplete = options.onDeleteComplete;
    if (options.onKeydown) editor.onKeydown = options.onKeydown;
    if (options.onKeyup) editor.onKeyup = options.onKeyup;
    if (options.onFocus) editor.onFocus = options.onFocus;
    if (options.onBlur) editor.onBlur = options.onBlur;
    if (options.pasteKeepMarks) editor.pasteKeepMarks = options.pasteKeepMarks;
    if (options.pasteKeepStyles) editor.pasteKeepStyles = options.pasteKeepStyles;
    if (options.afterUpdateView) editor.afterUpdateView = options.afterUpdateView;
    editor.extensions.forEach((item) => editor.registerExtension(item));
    editor.setEditable(typeof options.editable == "boolean" ? options.editable : true);
    editor.stackNodes = editor.htmlParseNode(options.value || "");
    editor.formatRules.forEach((rule) => {
      editor.formatNodes(rule, editor.stackNodes);
    });
    editor.checkNodes();
    const useDefault = typeof editor.onUpdateView == "function" ? await editor.onUpdateView.apply(editor, [true]) : true;
    if (useDefault) {
      defaultUpdateView.apply(editor, [true]);
    }
    editor.history.setState(editor.stackNodes, editor.selection);
    editor.oldStackNodes = editor.stackNodes.map((item) => item.fullClone());
    if (options.autofocus) {
      editor.setSelectionAfter();
      await editor.updateRealSelection();
    }
    if (typeof editor.afterUpdateView == "function") editor.afterUpdateView.apply(editor);
    setDomObserve(editor);
    event.on(document, `selectionchange.kaitify_${editor.guid}`, onSelectionChange.bind(editor));
    event.on(editor.$el, "beforeinput.kaitify", onBeforeInput.bind(editor));
    event.on(editor.$el, "compositionstart.kaitify compositionupdate.kaitify compositionend.kaitify", onComposition.bind(editor));
    event.on(editor.$el, "keydown.kaitify keyup.kaitify", onKeyboard.bind(editor));
    event.on(editor.$el, "focus.kaitify", onFocus.bind(editor));
    event.on(editor.$el, "blur.kaitify", onBlur.bind(editor));
    event.on(editor.$el, "copy.kaitify", onCopy.bind(editor));
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
!function(){"use strict";try{if("undefined"!=typeof document){var i=document.createElement("style");i.appendChild(document.createTextNode(".Kaitify{font-size:14px;font-family:PingFang SC,Helvetica Neue,Helvetica,Roboto,Segoe UI,Microsoft YaHei,Arial,sans-serif;color:#333;-webkit-font-smoothing:antialiased;text-size-adjust:none;line-height:1.5;border:1px solid #dedede;border-radius:3px;padding:10px;transition:border-color .5s;overflow-x:hidden;overflow-y:auto}.Kaitify:focus{border-color:#4bb4ba}.Kaitify ::selection{background-color:#4bb4ba66}.Kaitify *,.Kaitify *:before,.Kaitify *:after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;outline:none}.Kaitify h1,.Kaitify h2,.Kaitify h3,.Kaitify h4,.Kaitify h5,.Kaitify h6,.Kaitify p{line-height:1.5;margin:0 0 15px!important}.Kaitify h1:last-child,.Kaitify h2:last-child,.Kaitify h3:last-child,.Kaitify h4:last-child,.Kaitify h5:last-child,.Kaitify h6:last-child,.Kaitify p:last-child{margin-bottom:0!important}.Kaitify h1{font-size:48px}.Kaitify h2{font-size:36px}.Kaitify h3{font-size:28px}.Kaitify h4{font-size:24px}.Kaitify h5{font-size:18px}.Kaitify h6{font-size:16px}.Kaitify ol,.Kaitify ul{margin:0 0 15px;padding:0 0 0 20px}.Kaitify ol li,.Kaitify ul li{margin:0 0 15px}.Kaitify ol li:last-child,.Kaitify ul li:last-child{margin-bottom:0}.Kaitify table{width:100%;border:1px solid #dedede;border-collapse:collapse;margin:0 0 15px}.Kaitify table th,.Kaitify table td{border:1px solid #dedede;padding:10px}.Kaitify video,.Kaitify img{display:inline-block;width:auto;max-width:100%;padding:0 2px}.Kaitify code{display:inline-block;padding:2px 4px;margin:0 4px;border-radius:3px;font-family:Consolas,monospace,Monaco,Andale Mono,Ubuntu Mono;background-color:#4bb4ba0f;border:1px solid rgba(222,222,222,.2)}")),document.head.appendChild(i)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
