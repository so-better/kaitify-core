var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var dapUtil = { exports: {} };
(function(module, exports) {
  !function(e, t) {
    module.exports = t();
  }(window, function() {
    return function(e) {
      var t = {};
      function n(r) {
        if (t[r])
          return t[r].exports;
        var o = t[r] = { i: r, l: false, exports: {} };
        return e[r].call(o.exports, o, o.exports, n), o.l = true, o.exports;
      }
      return n.m = e, n.c = t, n.d = function(e2, t2, r) {
        n.o(e2, t2) || Object.defineProperty(e2, t2, { enumerable: true, get: r });
      }, n.r = function(e2) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
      }, n.t = function(e2, t2) {
        if (1 & t2 && (e2 = n(e2)), 8 & t2)
          return e2;
        if (4 & t2 && "object" == typeof e2 && e2 && e2.__esModule)
          return e2;
        var r = /* @__PURE__ */ Object.create(null);
        if (n.r(r), Object.defineProperty(r, "default", { enumerable: true, value: e2 }), 2 & t2 && "string" != typeof e2)
          for (var o in e2)
            n.d(r, o, function(t3) {
              return e2[t3];
            }.bind(null, o));
        return r;
      }, n.n = function(e2) {
        var t2 = e2 && e2.__esModule ? function() {
          return e2.default;
        } : function() {
          return e2;
        };
        return n.d(t2, "a", t2), t2;
      }, n.o = function(e2, t2) {
        return Object.prototype.hasOwnProperty.call(e2, t2);
      }, n.p = "", n(n.s = 5);
    }([function(e, t, n) {
      e.exports = { formatNumber: function(e2) {
        return this.isNumber(e2) ? e2.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,") : e2;
      }, isNumber: function(e2) {
        return "number" == typeof e2 && !isNaN(e2);
      }, add: function() {
        for (var e2 = arguments.length, t2 = Array(e2), n2 = 0; n2 < e2; n2++)
          t2[n2] = arguments[n2];
        return t2.reduce(function(e3, t3) {
          var n3, r = 0, o = 0;
          try {
            r = e3.toString().split(".")[1].length;
          } catch (e4) {
          }
          try {
            o = t3.toString().split(".")[1].length;
          } catch (e4) {
          }
          return (e3 * (n3 = Math.pow(10, Math.max(r, o))) + t3 * n3) / n3;
        });
      }, subtract: function() {
        for (var e2 = arguments.length, t2 = Array(e2), n2 = 0; n2 < e2; n2++)
          t2[n2] = arguments[n2];
        return t2.reduce(function(e3, t3) {
          var n3, r = 0, o = 0;
          try {
            r = e3.toString().split(".")[1].length;
          } catch (e4) {
          }
          try {
            o = t3.toString().split(".")[1].length;
          } catch (e4) {
          }
          return (e3 * (n3 = Math.pow(10, Math.max(r, o))) - t3 * n3) / n3;
        });
      }, mutiply: function() {
        for (var e2 = arguments.length, t2 = Array(e2), n2 = 0; n2 < e2; n2++)
          t2[n2] = arguments[n2];
        return t2.reduce(function(e3, t3) {
          var n3 = 0, r = e3.toString(), o = t3.toString();
          try {
            n3 += r.split(".")[1].length;
          } catch (e4) {
          }
          try {
            n3 += o.split(".")[1].length;
          } catch (e4) {
          }
          return Number(r.replace(".", "")) * Number(o.replace(".", "")) / Math.pow(10, n3);
        });
      }, divide: function() {
        for (var e2 = arguments.length, t2 = Array(e2), n2 = 0; n2 < e2; n2++)
          t2[n2] = arguments[n2];
        return t2.reduce(function(e3, t3) {
          var n3 = 0, r = 0, o = e3.toString(), i = t3.toString();
          try {
            n3 = o.split(".")[1].length;
          } catch (e4) {
          }
          try {
            r = i.split(".")[1].length;
          } catch (e4) {
          }
          return (o = Number(o.replace(".", ""))) / (i = Number(i.replace(".", ""))) * Math.pow(10, r - n3);
        });
      } };
    }, function(e, t, n) {
      function r(e2) {
        if (Array.isArray(e2)) {
          for (var t2 = 0, n2 = Array(e2.length); t2 < e2.length; t2++)
            n2[t2] = e2[t2];
          return n2;
        }
        return Array.from(e2);
      }
      var o = n(4), i = n(0);
      e.exports = { isWindow: function(e2) {
        return !!(e2 && e2.constructor && e2.constructor.name) && "Window" == e2.constructor.name;
      }, getElementPoint: function(e2, t2) {
        if (!this.isElement(e2))
          throw new TypeError("The first argument must be an element");
        if (this.isElement(t2) || (t2 = document.body), !this.isContains(t2, e2))
          throw new Error("The second argument and the first argument have no hierarchical relationship");
        for (var n2 = e2, r2 = 0, o2 = 0; this.isElement(e2) && this.isContains(t2, e2) && t2 !== e2; )
          r2 += e2.offsetTop, o2 += e2.offsetLeft, e2 = e2.offsetParent;
        return { top: r2, left: o2, right: t2.offsetWidth - o2 - n2.offsetWidth, bottom: t2.offsetHeight - r2 - n2.offsetHeight };
      }, isContains: function(e2, t2) {
        if (!this.isElement(e2))
          throw new TypeError("The first argument must be an element");
        if (!this.isElement(t2, true))
          throw new TypeError("The second argument must be an element");
        return e2 === t2 || (e2.contains ? e2.contains(t2) : e2.compareDocumentPosition ? !!(16 & e2.compareDocumentPosition(t2)) : void 0);
      }, isParentNode: function(e2, t2) {
        if (!this.isElement(e2))
          throw new TypeError("The first argument must be an element");
        if (!this.isElement(t2, true))
          throw new TypeError("The second argument must be an element");
        return e2 !== t2 && t2.parentNode === e2;
      }, children: function(e2, t2) {
        if (!this.isElement(e2))
          throw new TypeError("The first argument must be an element");
        if (t2 && "string" != typeof t2)
          throw new TypeError("The second argument must be a string");
        var n2 = e2.querySelectorAll(t2 || "*");
        return [].concat(r(n2)).filter(function(t3) {
          return t3.parentNode === e2;
        });
      }, siblings: function(e2, t2) {
        if (!this.isElement(e2))
          throw new TypeError("The first argument must be an element");
        if (t2 && "string" != typeof t2)
          throw new TypeError("The second argument must be a string");
        if (!e2.parentNode)
          return [];
        var n2 = e2.parentNode.querySelectorAll(t2 || "*");
        return [].concat(r(n2)).filter(function(t3) {
          return t3.parentNode === e2.parentNode && t3 != e2;
        });
      }, rem2px: function(e2) {
        if (!i.isNumber(e2))
          throw new TypeError("The argument must be a number");
        var t2 = this.getCssStyle(document.documentElement, "font-size");
        return i.mutiply(e2, parseFloat(t2));
      }, px2rem: function(e2) {
        if (!i.isNumber(e2))
          throw new TypeError("The argument must be a number");
        var t2 = this.getCssStyle(document.documentElement, "font-size");
        return i.divide(e2, parseFloat(t2));
      }, width: function(e2) {
        "string" == typeof e2 && e2 && (e2 = document.body.querySelector(e2)), this.isElement(e2) || (e2 = document.body);
        var t2 = e2.clientWidth, n2 = parseFloat(this.getCssStyle(e2, "padding-left")), r2 = parseFloat(this.getCssStyle(e2, "padding-right"));
        return i.subtract(t2, n2, r2);
      }, height: function(e2) {
        "string" == typeof e2 && e2 && (e2 = document.body.querySelector(e2)), this.isElement(e2) || (e2 = document.body);
        var t2 = e2.clientHeight, n2 = parseFloat(this.getCssStyle(e2, "padding-top")), r2 = parseFloat(this.getCssStyle(e2, "padding-bottom"));
        return i.subtract(t2, n2, r2);
      }, removeClass: function(e2, t2) {
        if (!this.isElement(e2))
          throw new TypeError("The first argument must be an element");
        if (!t2 || "string" != typeof t2)
          throw new TypeError("The second argument must be a string");
        var n2 = e2.classList;
        o.trim(t2).split(/\s+/).forEach(function(e3, t3) {
          n2.remove(e3);
        });
      }, addClass: function(e2, t2) {
        if (!this.isElement(e2))
          throw new TypeError("The first argument must be an element");
        if (!t2 || "string" != typeof t2)
          throw new TypeError("The second argument must be a string");
        var n2 = e2.classList;
        o.trim(t2).split(/\s+/).forEach(function(e3, t3) {
          n2.add(e3);
        });
      }, hasClass: function(e2, t2) {
        if (!this.isElement(e2))
          throw new TypeError("The first argument must be an element");
        if (!t2 || "string" != typeof t2)
          throw new TypeError("The second argument must be a string");
        var n2 = e2.classList;
        return o.trim(t2).split(/\s+/).every(function(e3, t3) {
          return n2.contains(e3);
        });
      }, scrollTopBottomTrigger: function(e2, t2) {
        var n2 = this;
        "string" == typeof e2 && e2 && (e2 = document.body.querySelector(e2));
        var r2 = window;
        this.isElement(e2) && e2 != document.body && e2 != document.documentElement && (r2 = e2), "function" == typeof e2 && (t2 = e2);
        var o2 = true;
        r2.addEventListener("scroll", function(e3) {
          if (n2.getScrollTop(r2) <= 0) {
            if (!o2)
              return;
            "function" == typeof t2 && (o2 = false, t2({ state: "top", target: r2 }));
          } else {
            var s = { state: "bottom", target: r2 }, u = 0;
            if (u = r2 == window ? window.innerHeight : r2.clientHeight, i.add(n2.getScrollTop(r2), u) + 1 >= n2.getScrollHeight(r2) && u != n2.getScrollHeight(r2)) {
              if (!o2)
                return;
              "function" == typeof t2 && (o2 = false, t2(s));
            } else
              o2 = true;
          }
        });
      }, getScrollWidth: function(e2) {
        "string" == typeof e2 && e2 && (e2 = document.body.querySelector(e2));
        return this.isElement(e2) && e2 != document.documentElement && e2 != document.body ? e2.scrollWidth : 0 == document.documentElement.scrollWidth || 0 == document.body.scrollWidth ? document.documentElement.scrollWidth || document.body.scrollWidth : document.documentElement.scrollWidth > document.body.scrollWidth ? document.documentElement.scrollWidth : document.body.scrollWidth;
      }, getScrollHeight: function(e2) {
        "string" == typeof e2 && e2 && (e2 = document.body.querySelector(e2));
        return this.isElement(e2) && e2 != document.documentElement && e2 != document.body ? e2.scrollHeight : 0 == document.documentElement.scrollHeight || 0 == document.body.scrollHeight ? document.documentElement.scrollHeight || document.body.scrollHeight : document.documentElement.scrollHeight > document.body.scrollHeight ? document.documentElement.scrollHeight : document.body.scrollHeight;
      }, setScrollTop: function(e2) {
        var t2 = this, n2 = false, r2 = e2.el;
        "string" == typeof r2 && r2 && (r2 = document.body.querySelector(r2));
        var o2 = e2.number || 0, s = e2.time || 0;
        return this.isElement(r2) && r2 != document.body && r2 != document.documentElement && r2 != window || (n2 = true), new Promise(function(e3, u) {
          if (s <= 0)
            n2 ? document.documentElement.scrollTop = document.body.scrollTop = o2 : r2.scrollTop = o2, e3();
          else
            var c = i.divide(s, 10), a = t2.getScrollTop(r2), d = i.divide(i.subtract(o2, a), c), l = setInterval(function() {
              c > 0 ? (c--, n2 ? document.documentElement.scrollTop = document.body.scrollTop = a = i.add(a, d) : r2.scrollTop = a = i.add(a, d)) : (clearInterval(l), e3());
            }, 10);
        });
      }, getScrollTop: function(e2) {
        "string" == typeof e2 && e2 && (e2 = document.body.querySelector(e2));
        return this.isElement(e2) && e2 != document.body && e2 != document.documentElement && e2 != window ? e2.scrollTop : 0 == document.documentElement.scrollTop || 0 == document.body.scrollTop ? document.documentElement.scrollTop || document.body.scrollTop : document.documentElement.scrollTop > document.body.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
      }, getScrollLeft: function(e2) {
        "string" == typeof e2 && e2 && (e2 = document.body.querySelector(e2));
        return this.isElement(e2) && e2 != document.body && e2 != document.documentElement && e2 != window ? e2.scrollLeft : 0 == document.documentElement.scrollLeft || 0 == document.body.scrollLeft ? document.documentElement.scrollLeft || document.body.scrollLeft : document.documentElement.scrollLeft > document.body.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft;
      }, setScrollLeft: function(e2) {
        var t2 = this, n2 = false, r2 = e2.el;
        "string" == typeof r2 && r2 && (r2 = document.body.querySelector(r2));
        var o2 = e2.number || 0, s = e2.time || 0;
        return this.isElement(r2) && r2 != document.body && r2 != document.documentElement && r2 != window || (n2 = true), new Promise(function(e3, u) {
          if (s <= 0)
            n2 ? document.documentElement.scrollLeft = document.body.scrollLeft = o2 : r2.scrollLeft = o2, e3();
          else
            var c = i.divide(s, 10), a = t2.getScrollLeft(r2), d = i.divide(i.subtract(o2, a), c), l = setInterval(function() {
              c > 0 ? (c--, n2 ? document.documentElement.scrollLeft = document.body.scrollLeft = a = i.add(a, d) : r2.scrollLeft = a = i.add(a, d)) : (clearInterval(l), e3());
            }, 10);
        });
      }, getCssStyle: function(e2, t2) {
        if (!this.isElement(e2))
          throw new TypeError("The first argument must be an element");
        if (!t2 || "string" != typeof t2)
          throw new TypeError("The second argument must be a string");
        return document.defaultView && document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(e2)[t2] : e2.currentStyle[t2];
      }, getCssSelector: function(e2) {
        if (!e2 || "string" != typeof e2)
          throw new TypeError("The argument must be a selector string");
        if (/^#{1}/.test(e2))
          return { type: "id", value: e2.substr(1) };
        if (/^\./.test(e2))
          return { type: "class", value: e2.substr(1) };
        if (/^\[(.+)\]$/.test(e2)) {
          var t2 = "", n2 = o.trim(e2, true).substring(1, o.trim(e2, true).length - 1).split("=");
          return 1 == n2.length && (t2 = n2[0]), 2 == n2.length && (t2 = { attributeName: n2[0], attributeValue: n2[1].replace(/\'/g, "").replace(/\"/g, "") }), { type: "attribute", value: t2 };
        }
        return { type: "tag", value: e2 };
      }, getElementBounding: function(e2) {
        "string" == typeof e2 && e2 && (e2 = document.body.querySelector(e2)), this.isElement(e2) || (e2 = document.body);
        var t2 = e2.getBoundingClientRect();
        return { top: t2.top, bottom: i.subtract(document.documentElement.clientHeight || window.innerHeight, t2.bottom), left: t2.left, right: i.subtract(document.documentElement.clientWidth || window.innerWidth, t2.right) };
      }, isElement: function(e2) {
        var t2 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        return t2 ? e2 && (1 === e2.nodeType || 3 === e2.nodeType) && e2 instanceof Node : e2 && 1 === e2.nodeType && e2 instanceof Node;
      }, string2dom: function(e2) {
        if (!e2 || "string" != typeof e2)
          throw new TypeError("The argument must be an HTML string");
        var t2 = document.createElement("div");
        return t2.innerHTML = e2, 1 == t2.children.length ? t2.children[0] : t2.children;
      } };
    }, function(e, t, n) {
      var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e2) {
        return typeof e2;
      } : function(e2) {
        return e2 && "function" == typeof Symbol && e2.constructor === Symbol && e2 !== Symbol.prototype ? "symbol" : typeof e2;
      }, o = n(1);
      e.exports = { matchingText: function(e2, t2) {
        if (!e2 || "string" != typeof e2)
          throw new TypeError("The first argument must be a string");
        if (!t2 || "string" != typeof t2)
          throw new TypeError("The second argument must be a string");
        var n2 = null;
        if ("Chinese" == t2 && (n2 = /^[\u4e00-\u9fa5]+$/), "chinese" == t2 && (n2 = /[\u4e00-\u9fa5]/), "email" == t2 && (n2 = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/), "userName" == t2 && (n2 = /^[a-zA-Z0-9_]{4,16}$/), "int+" == t2 && (n2 = /^\d+$/), "int-" == t2 && (n2 = /^-\d+$/), "int" == t2 && (n2 = /^-?\d+$/), "pos" == t2 && (n2 = /^\d*\.?\d+$/), "neg" == t2 && (n2 = /^-\d*\.?\d+$/), "number" == t2 && (n2 = /^-?\d*\.?\d+$/), "phone" == t2 && (n2 = /^1[0-9]\d{9}$/), "idCard" == t2 && (n2 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/), "url" == t2 && (n2 = /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/), "IPv4" == t2 && (n2 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/), "hex" == t2 && (n2 = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/), "date" == t2) {
          return /^((\d{4})(-)(\d{2})(-)(\d{2}))$/.test(e2) || /^(\d{4})(\/)(\d{2})(\/)(\d{2})$/.test(e2) || /^(\d{4})(\.)(\d{2})(\.)(\d{2})$/.test(e2) || /^(\d{4})(年)(\d{2})(月)(\d{2})(日)$/.test(e2);
        }
        if ("time" == t2 && (n2 = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/), "QQ" == t2 && (n2 = /^[1-9][0-9]{4,10}$/), "weixin" == t2 && (n2 = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/), "plate" == t2 && (n2 = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/), !n2)
          throw new Error("The second parameter is out of scope");
        return n2.test(e2);
      }, getUrlParams: function(e2) {
        if (!e2 || "string" != typeof e2)
          throw new TypeError("The argument must be a string");
        var t2 = new RegExp("(^|&)" + e2 + "=([^&]*)(&|$)"), n2 = window.location.search.substr(1);
        if (!n2) {
          var r2 = window.location.hash.split("?");
          2 == r2.length && (n2 = r2[1]);
        }
        var o2 = n2.match(t2);
        return o2 ? decodeURIComponent(o2[2]) : null;
      }, isEmptyObject: function(e2) {
        return !!this.isObject(e2) && 0 == Object.keys(e2).length;
      }, equal: function(e2, t2) {
        if ((void 0 === e2 ? "undefined" : r(e2)) !== (void 0 === t2 ? "undefined" : r(t2)))
          return false;
        if (this.isObject(e2) && this.isObject(t2)) {
          e2 = Object.assign({}, e2), t2 = Object.assign({}, t2);
          var n2 = Object.getOwnPropertyNames(e2), o2 = Object.getOwnPropertyNames(t2);
          if (n2.length != o2.length)
            return false;
          for (var i = n2.length, s = 0; s < i; s++) {
            var u = n2[s], c = e2[u], a = t2[u];
            if (this.isObject(c))
              return !!this.equal(c, a);
            if (c !== a)
              return false;
          }
          return true;
        }
        return e2 === t2;
      }, isObject: function(e2) {
        return !("object" !== (void 0 === e2 ? "undefined" : r(e2)) || !e2);
      }, copyText: function(e2) {
        if (!e2 || "string" != typeof e2)
          throw new TypeError("No text to copy is defined");
        var t2 = o.string2dom('<input type="text" />');
        document.body.appendChild(t2), t2.value = e2, t2.select(), document.execCommand("copy"), document.body.removeChild(t2);
      } };
    }, function(e, t, n) {
      var r = n(1), o = "_dap-datas";
      e.exports = { remove: function(e2, t2) {
        if (!(e2 instanceof Document || r.isElement(e2, true) || r.isWindow(e2)))
          throw new TypeError("The first argument must be an element node or window or document");
        var n2 = e2[o] || {};
        null == t2 || "" === t2 ? e2[o] = {} : (delete n2[t2], e2[o] = n2);
      }, has: function(e2, t2) {
        if (!(e2 instanceof Document || r.isElement(e2, true) || r.isWindow(e2)))
          throw new TypeError("The first argument must be an element node or window or document");
        if (null == t2 || "" === t2)
          throw new TypeError("The second parameter must be a unique key");
        return (e2[o] || {}).hasOwnProperty(t2);
      }, get: function(e2, t2) {
        if (!(e2 instanceof Document || r.isElement(e2, true) || r.isWindow(e2)))
          throw new TypeError("The first argument must be an element node or window or document");
        var n2 = e2[o] || {};
        return null == t2 || "" === t2 ? n2 : n2[t2];
      }, set: function(e2, t2, n2) {
        if (!(e2 instanceof Document || r.isElement(e2, true) || r.isWindow(e2)))
          throw new TypeError("The first argument must be an element node or window or document");
        if (null == t2 || "" === t2)
          throw new TypeError("The second parameter must be a unique key");
        var i = e2[o] || {};
        i[t2] = n2, e2[o] = i;
      } };
    }, function(e, t, n) {
      var r = n(0);
      e.exports = { insert: function(e2, t2, n2) {
        if (!e2 || "string" != typeof e2)
          throw new TypeError("The first argument must be a string");
        if ("string" != typeof t2)
          throw new TypeError("The second argument must be a string");
        if (!r.isNumber(n2))
          throw new TypeError("The third argument must be a number");
        if (n2 < 0)
          throw new Error("The third argument cannot be less than 0");
        return e2.substring(0, n2) + t2 + e2.substring(n2, e2.length);
      }, delete: function(e2, t2, n2) {
        if (!e2 || "string" != typeof e2)
          throw new TypeError("The first argument must be a string");
        if (!r.isNumber(t2))
          throw new TypeError("The second argument must be a number");
        if (t2 < 0)
          throw new Error("The second argument cannot be less than 0");
        if (!r.isNumber(n2))
          throw new TypeError("The third argument must be a number");
        if (n2 < 0)
          throw new Error("The third argument cannot be less than 0");
        return e2.substring(0, t2) + e2.substring(t2 + n2, e2.length);
      }, replace: function(e2, t2, n2, o) {
        if (!e2 || "string" != typeof e2)
          throw new TypeError("The first argument must be a string");
        if (!r.isNumber(t2))
          throw new TypeError("The second argument must be a number");
        if (t2 < 0)
          throw new Error("The second argument cannot be less than 0");
        if (!r.isNumber(n2))
          throw new TypeError("The third argument must be a number");
        if (n2 < 0)
          throw new Error("The third argument cannot be less than 0");
        if ("string" != typeof o)
          throw new TypeError("The fourth argument must be a string");
        return e2.substring(0, t2) + o + e2.substring(n2, e2.length);
      }, trim: function(e2, t2) {
        if ("string" != typeof e2)
          throw new TypeError("The first argument must be a string");
        var n2 = e2.replace(/(^\s+)|(\s+$)/g, "");
        return t2 && (n2 = n2.replace(/\s/g, "")), n2;
      } };
    }, function(e, t, n) {
      var r = n(0), o = n(3), i = n(1), s = n(6), u = n(2), c = n(7), a = n(8), d = n(9), l = n(4), m = n(10), f = n(11);
      e.exports = { number: r, data: o, element: i, event: s, common: u, date: c, color: a, file: d, string: l, platform: m, speech: f };
    }, function(e, t, n) {
      var r = n(3), o = n(1), i = n(2), s = function(e2) {
        var t2 = e2.split(/[\s]+/g), n2 = [];
        return t2.forEach(function(e3) {
          var t3 = e3.split("."), r2 = { eventName: t3[0] };
          t3.length > 1 && (r2.guid = t3[1]), n2.push(r2);
        }), n2;
      }, u = function(e2, t2, n2) {
        for (var o2 = r.get(e2, "dap-defined-events") || {}, i2 = Object.keys(o2), s2 = i2.length, u2 = 0; u2 < s2; u2++) {
          var c = i2[u2];
          o2[c].type == t2 && (n2 ? c == t2 + "_" + n2 && (e2.removeEventListener(o2[c].type, o2[c].fn, o2[c].options), o2[c] = void 0) : (e2.removeEventListener(o2[c].type, o2[c].fn, o2[c].options), o2[c] = void 0));
        }
        o2 = function(e3) {
          var t3 = {};
          return Object.keys(e3).forEach(function(n3) {
            e3[n3] && (t3[n3] = e3[n3]);
          }), t3;
        }(o2), r.set(e2, "dap-defined-events", o2);
      };
      e.exports = { on: function(e2, t2, n2, u2) {
        if (!(e2 instanceof Document || o.isElement(e2) || o.isWindow(e2)))
          throw new TypeError("The first argument must be an element node or window or document");
        if (!t2 || "string" != typeof t2)
          throw new TypeError("The second argument must be a string");
        if (!n2 || "function" != typeof n2)
          throw new TypeError("The third argument must be a function");
        i.isObject(u2) || (u2 = {}), s(t2).forEach(function(t3) {
          !function(e3, t4, n3, o2, i2) {
            var s2 = r.get(e3, "dap-defined-events") || {};
            n3 || (n3 = r.get(e3, "dap-event-guid") || 0, r.set(e3, "dap-event-guid", n3 + 1)), s2[n3 = t4 + "_" + n3] && s2[n3].type == t4 && e3.removeEventListener(t4, s2[n3].fn, s2[n3].options), e3.addEventListener(t4, o2, i2), s2[n3] = { type: t4, fn: o2, options: i2 }, r.set(e3, "dap-defined-events", s2);
          }(e2, t3.eventName, t3.guid, n2.bind(e2), u2);
        });
      }, off: function(e2, t2) {
        if (!(e2 instanceof Document || o.isElement(e2) || o.isWindow(e2)))
          throw new TypeError("The first argument must be an element node or window or document");
        var n2 = r.get(e2, "dap-defined-events");
        if (n2) {
          if (!t2) {
            for (var i2 = Object.keys(n2), c = i2.length, a = 0; a < c; a++) {
              var d = i2[a];
              e2.removeEventListener(n2[d].type, n2[d].fn, n2[d].options);
            }
            return r.remove(e2, "dap-defined-events"), void r.remove(e2, "dap-event-guid");
          }
          s(t2).forEach(function(t3) {
            u(e2, t3.eventName, t3.guid);
          });
        }
      } };
    }, function(e, t, n) {
      var r = n(0);
      e.exports = { getPrevMonths: function(e2, t2) {
        e2 && e2 instanceof Date || (e2 = /* @__PURE__ */ new Date()), r.isNumber(t2) || (t2 = 1);
        for (var n2 = [e2], o = 0; o < t2 - 1; o++) {
          var i = e2.getFullYear(), s = e2.getMonth();
          0 == s && (s = 12, i--);
          var u = /* @__PURE__ */ new Date();
          u.setMonth(s - 1), u.setFullYear(i), n2.push(u), e2 = u;
        }
        return n2;
      }, getNextMonths: function(e2, t2) {
        e2 && e2 instanceof Date || (e2 = /* @__PURE__ */ new Date()), r.isNumber(t2) || (t2 = 1);
        for (var n2 = [e2], o = 0; o < t2 - 1; o++) {
          var i = e2.getFullYear(), s = e2.getMonth();
          11 == s && (s = -1, i++);
          var u = /* @__PURE__ */ new Date();
          u.setMonth(s + 1), u.setFullYear(i), n2.push(u), e2 = u;
        }
        return n2;
      }, getDateAfter: function(e2, t2) {
        return e2 && e2 instanceof Date || (e2 = /* @__PURE__ */ new Date()), r.isNumber(t2) || (t2 = 1), new Date(e2.getTime() + 24 * t2 * 60 * 60 * 1e3);
      }, getDateBefore: function(e2, t2) {
        return e2 && e2 instanceof Date || (e2 = /* @__PURE__ */ new Date()), r.isNumber(t2) || (t2 = 1), new Date(e2.getTime() - 24 * t2 * 60 * 60 * 1e3);
      }, getDays: function(e2, t2) {
        if (!r.isNumber(e2))
          throw new TypeError("The first parameter must be a number representing the year");
        if (!r.isNumber(t2))
          throw new TypeError("The second argument must be a number representing the month");
        return e2 = parseInt(e2), t2 = parseInt(t2), new Date(e2, t2, 0).getDate();
      } };
    }, function(e, t, n) {
      var r = n(2);
      e.exports = { rgb2hsv: function(e2) {
        if (!Array.isArray(e2) || 3 != e2.length)
          throw new TypeError("Invalid argument");
        var t2 = 0, n2 = 0, r2 = 0, o = e2[0] >= 255 ? 255 : e2[0], i = e2[1] >= 255 ? 255 : e2[1], s = e2[2] >= 255 ? 255 : e2[2];
        o = o <= 0 ? 0 : o, i = i <= 0 ? 0 : i, s = s <= 0 ? 0 : s;
        var u = Math.max(o, i, s), c = Math.min(o, i, s);
        return r2 = u / 255, n2 = 0 === u ? 0 : 1 - c / u, u === c ? t2 = 0 : u === o && i >= s ? t2 = (i - s) / (u - c) * 60 + 0 : u === o && i < s ? t2 = (i - s) / (u - c) * 60 + 360 : u === i ? t2 = (s - o) / (u - c) * 60 + 120 : u === s && (t2 = (o - i) / (u - c) * 60 + 240), [t2 = parseInt(t2), n2 = parseInt(100 * n2), r2 = parseInt(100 * r2)];
      }, hsv2rgb: function(e2) {
        if (!Array.isArray(e2) || 3 != e2.length)
          throw new TypeError("Invalid argument");
        var t2 = e2[0] >= 360 || e2[0] <= 0 ? 0 : e2[0], n2 = e2[1] >= 100 ? 100 : e2[1];
        n2 = n2 <= 0 ? 0 : n2;
        var r2 = e2[2] >= 100 ? 100 : e2[2];
        r2 = r2 <= 0 ? 0 : r2, n2 /= 100, r2 /= 100;
        var o = 0, i = 0, s = 0, u = parseInt(t2 / 60 % 6), c = t2 / 60 - u, a = r2 * (1 - n2), d = r2 * (1 - c * n2), l = r2 * (1 - (1 - c) * n2);
        switch (u) {
          case 0:
            o = r2, i = l, s = a;
            break;
          case 1:
            o = d, i = r2, s = a;
            break;
          case 2:
            o = a, i = r2, s = l;
            break;
          case 3:
            o = a, i = d, s = r2;
            break;
          case 4:
            o = l, i = a, s = r2;
            break;
          case 5:
            o = r2, i = a, s = d;
        }
        return [o = parseInt(255 * o), i = parseInt(255 * i), s = parseInt(255 * s)];
      }, rgb2hex: function(e2) {
        if (!Array.isArray(e2) || 3 != e2.length)
          throw new TypeError("Invalid argument");
        return "#" + ((1 << 24) + (e2[0] << 16) + (e2[1] << 8) + e2[2]).toString(16).slice(1);
      }, hex2rgb: function(e2) {
        if (!e2 || "string" != typeof e2)
          throw new TypeError("The argument must be a string");
        var t2 = e2.toLowerCase();
        if (!r.matchingText(t2, "hex"))
          throw new TypeError("The argument must be a hexadecimal color value");
        if (4 === t2.length) {
          for (var n2 = "#", o = 1; o < 4; o += 1)
            n2 += t2.slice(o, o + 1).concat(t2.slice(o, o + 1));
          t2 = n2;
        }
        for (var i = [], s = 1; s < 7; s += 2)
          i.push(parseInt("0x" + t2.slice(s, s + 2)));
        return i;
      } };
    }, function(e, t, n) {
      e.exports = { getImageUrl: function(e2) {
        if (!(e2 && e2 instanceof File))
          throw new TypeError("The argument must be a File object");
        return window.URL.createObjectURL(e2);
      }, dataFileToBase64: function(e2) {
        return new Promise(function(t2, n2) {
          e2 && e2 instanceof File || n2(new TypeError("The argument must be a File object"));
          var r = new FileReader();
          r.readAsDataURL(e2), r.onloadend = function() {
            var e3 = r.result;
            t2(e3);
          };
        });
      }, dataBase64toFile: function(e2, t2) {
        if (!e2 || "string" != typeof e2)
          throw new TypeError("The first argument must be a string");
        if (!t2 || "string" != typeof t2)
          throw new TypeError("The second argument must be a string");
        for (var n2 = e2.split(","), r = n2[0].match(/:(.*?);/)[1], o = atob(n2[1]), i = o.length, s = new Uint8Array(i); i--; )
          s[i] = o.charCodeAt(i);
        return new File([s], t2, { type: r });
      } };
    }, function(e, t, n) {
      e.exports = { language: function() {
        return window.navigator.browserLanguage || window.navigator.language;
      }, device: function() {
        var e2 = window.navigator.userAgent;
        return { PC: !e2.match(/AppleWebKit.*Mobile.*/), Mobile: !!e2.match(/AppleWebKit.*Mobile.*/), iPhone: e2.includes("iPhone"), Phone: e2.includes("Android") && /(?:Mobile)/.test(e2) || e2.includes("iPhone") || /(?:Windows Phone)/.test(e2), iPad: e2.includes("iPad"), Tablet: e2.includes("iPad") || e2.includes("Android") && !/(?:Mobile)/.test(e2) || e2.includes("Firefox") && /(?:Tablet)/.test(e2), WindowsPhone: /(?:Windows Phone)/.test(e2) };
      }, browser: function() {
        var e2 = window.navigator.userAgent;
        return { Edge: !!e2.match(/Edg\/([\d.]+)/), weixin: e2.includes("MicroMessenger"), QQ: e2.includes("QQ"), QQBrowser: e2.includes("MQQBrowser"), UC: e2.includes("UCBrowser"), Chrome: e2.includes("Chrome"), Firefox: e2.includes("Firefox"), sougou: e2.toLocaleLowerCase().includes("se 2.x") || e2.toLocaleLowerCase().includes("metasr") || e2.toLocaleLowerCase().includes("sogou"), Safari: e2.includes("Safari") && !e2.includes("Chrome") };
      }, browserKernel: function() {
        var e2 = window.navigator.userAgent;
        return e2.includes("Presto") ? "opera" : e2.includes("AppleWebKit") ? "webkit" : e2.includes("Gecko") && !e2.includes("KHTML") ? "gecko" : "";
      }, os: function() {
        var e2, t2 = window.navigator.userAgent;
        return { Windows: t2.includes("Windows"), Windows_CPU: t2.toLocaleLowerCase().includes("win64") || t2.toLocaleLowerCase().includes("wow64") ? "x64" : t2.toLocaleLowerCase().includes("win32") || t2.toLocaleLowerCase().includes("wow32") ? "x32" : "", Windows_Version: t2.includes("Windows NT 6.1") || t2.includes("Windows 7") ? "Win7" : t2.includes("Windows NT 6.3") || t2.includes("Windows NT 6.2") || t2.includes("Windows NT 8") ? "Win8" : t2.includes("Windows NT 10") || t2.includes("Windows NT 6.4") ? "Win10" : "", Mac: t2.includes("Macintosh"), Mac_Version: function() {
          if (t2.includes("Macintosh")) {
            var e3 = t2.match(/Mac OS X ([^\s]+)\)/);
            if (e3 && e3[1])
              return e3[1].split(/_|\./).join(".");
          }
          return "";
        }(), ios: !!t2.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), ios_Version: function() {
          if (t2.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            var e3 = t2.match(/CPU.+OS ([^\s]+) like Mac OS X/);
            if (e3 && e3[1])
              return e3[1].split(/_|\./).join(".");
          }
          return "";
        }(), Android: t2.includes("Android"), Android_Version: (e2 = t2.match(/Android ([^\s]+);/), e2 && e2[1] ? e2[1].split(/_|\./).join(".") : ""), Linux: t2.includes("Linux"), HarmonyOS: t2.includes("HarmonyOS"), Ubuntu: t2.includes("Ubuntu") };
      } };
    }, function(e, t, n) {
      var r = n(0), o = n(2);
      e.exports = { start: function(e2, t2) {
        if (!window.SpeechSynthesisUtterance || !window.speechSynthesis)
          throw new Error("The current browser does not support this syntax");
        var n2 = { pitch: 0.8, rate: 1, volume: 1, start: function() {
        }, end: function() {
        }, pause: function() {
        }, resume: function() {
        }, error: function() {
        } };
        o.isObject(t2) || (t2 = {}), r.isNumber(t2.pitch) && (n2.pitch = t2.pitch), r.isNumber(t2.rate) && (n2.rate = t2.rate), r.isNumber(t2.volume) && (n2.volume = t2.volume), "function" == typeof t2.start && (n2.start = t2.start), "function" == typeof t2.end && (n2.end = t2.end), "function" == typeof t2.pause && (n2.pause = t2.pause), "function" == typeof t2.resume && (n2.resume = t2.resume), "function" == typeof t2.error && (n2.error = t2.error);
        var i = new SpeechSynthesisUtterance();
        i.text = e2, i.pitch = n2.pitch, i.rate = n2.rate, i.volume = n2.volume, i.lang = "zh-CN", i.onstart = function(t3) {
          n2.start.apply(i, [t3, { text: e2, pitch: n2.pitch, rate: n2.rate, volume: n2.volume }]);
        }, i.onend = function(t3) {
          n2.end.apply(i, [t3, { text: e2, pitch: n2.pitch, rate: n2.rate, volume: n2.volume }]);
        }, i.onpause = function(t3) {
          n2.pause.apply(i, [t3, { text: e2, pitch: n2.pitch, rate: n2.rate, volume: n2.volume }]);
        }, i.onresume = function(t3) {
          n2.resume.apply(i, [t3, { text: e2, pitch: n2.pitch, rate: n2.rate, volume: n2.volume }]);
        }, i.onerror = function(t3) {
          n2.error.apply(i, [t3, { text: e2, pitch: n2.pitch, rate: n2.rate, volume: n2.volume }]);
        }, window.speechSynthesis.speak(i);
      }, stop: function() {
        if (!window.SpeechSynthesisUtterance || !window.speechSynthesis)
          throw new Error("The current browser does not support this syntax");
        window.speechSynthesis.cancel();
      }, pause: function() {
        if (!window.SpeechSynthesisUtterance || !window.speechSynthesis)
          throw new Error("The current browser does not support this syntax");
        window.speechSynthesis.pause();
      }, resume: function() {
        if (!window.SpeechSynthesisUtterance || !window.speechSynthesis)
          throw new Error("The current browser does not support this syntax");
        window.speechSynthesis.resume();
      } };
    }]);
  });
})(dapUtil);
var dapUtilExports = dapUtil.exports;
const Dap = /* @__PURE__ */ getDefaultExportFromCjs(dapUtilExports);
const Util = {
  //获取属性集合
  getAttributes(el) {
    let o = {};
    for (let attribute of el.attributes) {
      if (!/(^on)|(^style$)|(^class$)/g.test(attribute.nodeName)) {
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
    let key = Dap.data.get(window, "data-alex-editor-key") || 0;
    key++;
    Dap.data.set(window, "data-alex-editor-key", key);
    return key;
  },
  //扁平化处理节点
  flatNodes(nodes) {
    const flat = (arr) => {
      let result = [];
      arr.forEach((node) => {
        if (Dap.element.isElement(node, true)) {
          result.push(node);
          const childNodes = Array.from(node.childNodes);
          if (childNodes.length) {
            let arr2 = flat(childNodes);
            result = [...result, ...arr2];
          }
        }
      });
      return result;
    };
    return flat(nodes);
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
  //是否空白占位元素
  isSpaceText() {
    return this.isText() && !this.isEmpty() && /^\s+$/g.test(this.textContent);
  }
  //是否根元素
  isRoot() {
    return !this.parent;
  }
  //判断两个Element是否相等
  isEqual(element) {
    if (!_AlexElement.isElement(element)) {
      return false;
    }
    return this.key == element.key;
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
  //判断是否保留空白和换行符
  isPreStyle() {
    if (!this.isBlock()) {
      return false;
    }
    if (this.parsedom == "pre") {
      return true;
    }
    if (this.hasStyles()) {
      return ["pre-wrap", "pre"].includes(this.styles["white-space"]);
    }
    return false;
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
    if (Dap.common.isObject) {
      return !Dap.common.isEmptyObject(this.marks);
    }
    return false;
  }
  //是否含有样式
  hasStyles() {
    if (!this.styles) {
      return false;
    }
    if (Dap.common.isObject) {
      return !Dap.common.isEmptyObject(this.styles);
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
  //设置为空元素
  setEmpty() {
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
  //渲染成真实dom
  _renderElement() {
    let el = null;
    if (this.isText()) {
      el = document.createTextNode(this.textContent);
    } else {
      el = document.createElement(this.parsedom);
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
      if (this.hasChildren()) {
        for (let child of this.children) {
          let childElm = child._renderElement();
          el.appendChild(childElm);
        }
      }
    }
    Dap.data.set(el, "data-alex-editor-key", this.key);
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
        if (_AlexElement.isElement(element)) {
          result.push(element);
          if (element.hasChildren()) {
            let arr2 = flat(element.children);
            result = [...result, ...arr2];
          }
        }
      });
      return result;
    };
    return flat(elements);
  }
  //获取一个空白字符，用来占位防止行内元素没有内容被删除
  static getSpaceElement() {
    let span = document.createElement("span");
    span.innerHTML = "&#xFEFF;";
    let el = new _AlexElement("text", null, null, null, span.innerText);
    span = null;
    return el;
  }
};
let AlexElement = _AlexElement;
//定义段落标签
__publicField(AlexElement, "paragraph", "p");
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
      throw new Error("The argument must be an AlexElement instance");
    }
    if (element.isEmpty()) {
      throw new Error("The argument cannot be an empty element");
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
      throw new Error("The argument must be an AlexElement instance");
    }
    if (element.isEmpty()) {
      throw new Error("The argument cannot be an empty element");
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
const { Mac } = Dap.platform.os();
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
class AlexEditor {
  constructor(el, options) {
    //校验函数数组，用于格式化
    __publicField(this, "_formatUnchangeableRules", [
      //修改元素的属性和自定义格式化规则
      (element) => {
        if (element.parsedom) {
          if (["br", "img", "video"].includes(element.parsedom)) {
            element.type = "closed";
            element.children = null;
          } else if (["span", "a", "label", "code"].includes(element.parsedom)) {
            element.type = "inline";
          } else if (["input", "textarea", "select", "script", "style", "html", "body", "meta", "link", "head", "title"].includes(element.parsedom)) {
            element.type = "closed";
            element.parsedom = "br";
            element.children = null;
          } else if (["b", "strong"].includes(element.parsedom)) {
            element.type = "inline";
            element.parsedom = "span";
            if (Dap.common.isObject(element.styles)) {
              Object.assign(element.styles, {
                "font-weight": "bold"
              });
            } else {
              element.styles = {
                "font-weight": "bold"
              };
            }
          } else if (["sup"].includes(element.parsedom)) {
            element.type = "inline";
            element.parsedom = "span";
            if (Dap.common.isObject(element.styles)) {
              Object.assign(element.styles, {
                "vertical-align": "super"
              });
            } else {
              element.styles = {
                "vertical-align": "super"
              };
            }
          } else if (["sub"].includes(element.parsedom)) {
            element.type = "inline";
            element.parsedom = "span";
            if (Dap.common.isObject(element.styles)) {
              Object.assign(element.styles, {
                "vertical-align": "sub"
              });
            } else {
              element.styles = {
                "vertical-align": "sub"
              };
            }
          } else if (["i"].includes(element.parsedom)) {
            element.type = "inline";
            element.parsedom = "span";
            if (Dap.common.isObject(element.styles)) {
              Object.assign(element.styles, {
                "font-style": "italic"
              });
            } else {
              element.styles = {
                "font-style": "italic"
              };
            }
          } else if (["u"].includes(element.parsedom)) {
            element.type = "inline";
            element.parsedom = "span";
            if (Dap.common.isObject(element.styles)) {
              Object.assign(element.styles, {
                "text-decoration-line": "underline"
              });
            } else {
              element.styles = {
                "text-decoration-line": "underline"
              };
            }
          } else if (["del"].includes(element.parsedom)) {
            element.type = "inline";
            element.parsedom = "span";
            if (Dap.common.isObject(element.styles)) {
              Object.assign(element.styles, {
                "text-decoration-line": "line-through"
              });
            } else {
              element.styles = {
                "text-decoration-line": "line-through"
              };
            }
          } else if (["pre"].includes(element.parsedom)) {
            element.type = "block";
          } else if (["blockquote"].includes(element.parsedom)) {
            element.type = "block";
            if (Dap.common.isObject(element.styles)) {
              Object.assign(element.styles, {
                "white-space": "pre-wrap"
              });
            } else {
              element.styles = {
                "white-space": "pre-wrap"
              };
            }
          }
        } else {
          element.type = "text";
        }
        if (typeof this.renderRules == "function") {
          element = this.renderRules.apply(this, [element]);
        }
        return element;
      },
      //合并相似子元素（如果光标在子元素中可能会重新设置）
      (element) => {
        if (element.hasChildren() && element.children.length > 1) {
          const canMerge = (pel, nel) => {
            if (pel.isBreak() && nel.isBreak()) {
              return true;
            }
            if (pel.isText() && nel.isText()) {
              return true;
            }
            if (pel.isInline() && nel.isInline()) {
              let sameStyles = false;
              if (pel.hasStyles() && nel.hasStyles() && Dap.common.equal(pel.styles, nel.styles)) {
                sameStyles = true;
              } else if (!pel.hasStyles() && !nel.hasStyles()) {
                sameStyles = true;
              }
              let sameMarks = false;
              if (pel.hasMarks() && nel.hasMarks() && Dap.common.equal(pel.marks, nel.marks)) {
                sameMarks = true;
              } else if (!pel.hasMarks() && !nel.hasMarks()) {
                sameMarks = true;
              }
              return pel.parsedom == nel.parsedom && sameMarks && sameStyles;
            }
            return false;
          };
          const merge = (pel, nel) => {
            if (canMerge(pel, nel)) {
              if (pel.isText()) {
                if (this.range && this.range.anchor.element.isEqual(nel)) {
                  this.range.anchor.element = pel;
                  this.range.anchor.offset = pel.textContent.length + this.range.anchor.offset;
                }
                if (this.range && this.range.focus.element.isEqual(nel)) {
                  this.range.focus.element = pel;
                  this.range.focus.offset = pel.textContent.length + this.range.focus.offset;
                }
                pel.textContent += nel.textContent;
              } else if (pel.isBreak()) {
                if (this.range && this.range.anchor.element.isEqual(nel)) {
                  this.range.anchor.element = pel;
                }
                if (this.range && this.range.focus.element.isEqual(nel)) {
                  this.range.focus.element = pel;
                }
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
              }
              const index2 = nel.parent.children.findIndex((item) => {
                return nel.isEqual(item);
              });
              nel.parent.children.splice(index2, 1);
            }
          };
          let index = 0;
          while (index <= element.children.length - 2) {
            if (canMerge(element.children[index], element.children[index + 1])) {
              merge(element.children[index], element.children[index + 1]);
            } else {
              index++;
            }
          }
        }
        return element;
      },
      //换行符清除规则
      (element) => {
        if (element.hasChildren()) {
          if (element.isBlock()) {
            const children = element.children.filter((el) => {
              return !el.isEmpty();
            });
            let hasBreak = children.some((el) => {
              return el.isBreak();
            });
            let hasOther = children.some((el) => {
              return !el.isBreak();
            });
            if (hasBreak && hasOther) {
              element.children = element.children.map((el) => {
                if (el.isBreak()) {
                  el.setEmpty();
                }
                return el;
              });
            } else if (hasBreak && children.length > 1) {
              element.children = element.children.map((el, index) => {
                if (el.isBreak() && index > 0) {
                  el.setEmpty();
                }
                return el;
              });
            }
          } else if (element.isInline()) {
            element.children.map((el) => {
              if (el.isBreak()) {
                el.setEmpty();
              }
            });
          }
        }
        return element;
      },
      //其他类型元素与block元素在同一父元素下不能共存
      (element) => {
        if (element.hasChildren()) {
          let hasBlock = element.children.some((el) => {
            return !el.isEmpty() && el.isBlock();
          });
          if (hasBlock) {
            element.children.forEach((el) => {
              if (!el.isEmpty() && !el.isBlock()) {
                el.convertToBlock();
              }
            });
          }
        }
        return element;
      },
      //光标所在元素为空元素的情况下重新设置光标
      (element) => {
        if (element.isEmpty()) {
          if (this.range && this.range.anchor.element.isEqual(element)) {
            this.setRecentlyPoint(this.range.anchor);
          }
          if (this.range && this.range.focus.element.isEqual(element)) {
            this.setRecentlyPoint(this.range.focus);
          }
        }
        return element;
      }
    ]);
    if (typeof el == "string" && el) {
      el = document.body.querySelector(el);
    }
    if (!Dap.element.isElement(el)) {
      throw new Error("You must specify a dom container to initialize the editor");
    }
    if (Dap.data.get(el, "data-alex-editor-init")) {
      throw new Error("The element node has been initialized to the editor");
    }
    Dap.data.set(el, "data-alex-editor-init", true);
    options = this._formatOptions(options);
    this.$el = el;
    this.disabled = options.disabled;
    this.value = options.value;
    this.renderRules = options.renderRules;
    this.htmlPaste = options.htmlPaste;
    this.range = null;
    this._events = {};
    this._isInputChinese = false;
    this._oldValue = options.value;
    this.stack = this.parseHtml(this.value);
    this.history = new AlexHistory();
    this.formatElementStack();
    this.stack.length == 0 ? this._initStack() : null;
    this._initRange();
    this.domRender();
    this.disabled ? this.setDisabled() : this.setEnabled();
    Dap.event.on(document, "selectionchange.alex_editor", this._handleSelectionChange.bind(this));
    Dap.event.on(this.$el, "beforeinput.alex_editor", this._handleBeforeInput.bind(this));
    Dap.event.on(this.$el, "compositionstart.alex_editor compositionupdate.alex_editor compositionend.alex_editor", this._handleChineseInput.bind(this));
    Dap.event.on(this.$el, "keydown.alex_editor", this._handleKeydown.bind(this));
    Dap.event.on(this.$el, "cut.alex_editor", this._handleCut.bind(this));
    Dap.event.on(this.$el, "paste.alex_editor", this._handlePaste.bind(this));
    Dap.event.on(this.$el, "drop.alex_editor", this._handleNodesChange.bind(this));
    Dap.event.on(this.$el, "focus.alex_editor", () => {
      this.emit("focus", this.value);
    });
    Dap.event.on(this.$el, "blur.alex_editor", () => {
      this.emit("blur", this.value);
    });
  }
  //格式化options参数
  _formatOptions(options) {
    let opts = {
      disabled: false,
      renderRules: null,
      htmlPaste: false,
      value: "<p><br></p>"
    };
    if (Dap.common.isObject(options)) {
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
  _initStack() {
    const ele = new AlexElement("block", AlexElement.paragraph, null, null, null);
    const breakEle = new AlexElement("closed", "br", null, null, null);
    this.addElementTo(breakEle, ele);
    this.stack = [ele];
  }
  //初始设置range
  _initRange() {
    const lastElement = this.stack[this.stack.length - 1];
    const anchor = new AlexPoint(lastElement, 0);
    const focus = new AlexPoint(lastElement, 0);
    this.range = new AlexRange(anchor, focus);
    this.range.anchor.moveToEnd(lastElement);
    this.range.focus.moveToEnd(lastElement);
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
    const anchorBlock = this.range.anchor.element.getBlock();
    const anchorInline = this.range.anchor.element.getInline();
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
  _handleSelectionChange() {
    if (this.disabled) {
      return;
    }
    if (this._isInputChinese) {
      return;
    }
    const selection = window.getSelection();
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      if (range.startContainer.isEqualNode(this.$el) || range.endContainer.isEqualNode(this.$el)) {
        return;
      }
      if (Dap.element.isContains(this.$el, range.startContainer) && Dap.element.isContains(this.$el, range.endContainer)) {
        const anchorKey = Dap.data.get(range.startContainer, "data-alex-editor-key");
        const focusKey = Dap.data.get(range.endContainer, "data-alex-editor-key");
        const anchorEle = this.getElementByKey(anchorKey);
        const focusEle = this.getElementByKey(focusKey);
        const anchor = new AlexPoint(anchorEle, range.startOffset);
        const focus = new AlexPoint(focusEle, range.endOffset);
        this.range = new AlexRange(anchor, focus);
      }
    }
  }
  //监听beforeinput
  _handleBeforeInput(e) {
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
        this.setCursor();
      }
      return;
    }
    if (e.inputType == "insertParagraph" || e.inputType == "insertLineBreak") {
      this.insertParagraph();
      this.formatElementStack();
      this.domRender();
      this.setCursor();
      return;
    }
    if (e.inputType == "deleteContentBackward") {
      this.delete();
      this.formatElementStack();
      this.domRender();
      this.setCursor();
      return;
    }
    console.log("beforeInput没有监听到的inputType", e.inputType, e);
  }
  //监听中文输入
  _handleChineseInput(e) {
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
        this.setCursor();
      }
    }
  }
  //监听键盘按下
  _handleKeydown(e) {
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
        this.setCursor();
      }
    } else if (Keyboard.Redo(e)) {
      e.preventDefault();
      const historyRecord = this.history.get(1);
      if (historyRecord) {
        this.stack = historyRecord.stack;
        this.range = historyRecord.range;
        this.formatElementStack();
        this.domRender(true);
        this.setCursor();
      }
    }
  }
  //监听粘贴事件
  _handlePaste(e) {
    if (this.disabled) {
      return;
    }
    const files = e.clipboardData.files;
    if (files.length) {
      e.preventDefault();
      if (!this.emit("pasteFile", files)) {
        let parseImageFn = [];
        Array.from(files).forEach((file) => {
          if (file.type && /^((image\/)|(video\/))/g.test(file.type)) {
            parseImageFn.push(Dap.file.dataFileToBase64(file));
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
            this.setCursor();
          });
        });
      }
    } else if (!this.htmlPaste) {
      e.preventDefault();
      const data = e.clipboardData.getData("text/plain");
      if (data) {
        this.insertText(data);
        this.formatElementStack();
        this.domRender();
        this.setCursor();
      }
    } else {
      let element = null;
      const end = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1;
      if (this.range.focus.offset == end) {
        const nextElement = this.getNextElementOfPoint(this.range.focus);
        if (nextElement) {
          element = nextElement;
        }
      } else {
        element = this.range.focus.element;
      }
      const elements = AlexElement.flatElements(this.stack);
      const index = elements.findIndex((item) => {
        return element && item.isEqual(element);
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
        this.setCursor();
      }, 0);
    }
  }
  //监听剪切事件
  _handleCut(e) {
    if (this.disabled) {
      return;
    }
    setTimeout(() => {
      this.delete();
      this.formatElementStack();
      this.domRender();
      this.setCursor();
    }, 0);
  }
  //解决编辑器内元素节点与stack数据不符的情况，进行数据纠正
  _handleNodesChange() {
    setTimeout(() => {
      this.stack = this.parseHtml(this.$el.innerHTML);
      this.formatElementStack();
      const flatElements = AlexElement.flatElements(this.stack);
      this.range.anchor.moveToEnd(flatElements[flatElements.length - 1]);
      this.range.focus.moveToEnd(flatElements[flatElements.length - 1]);
      this.domRender();
      this.setCursor();
    }, 0);
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
  //格式化单个元素
  formatElement(ele) {
    if (!AlexElement.isElement(ele)) {
      throw new Error("The argument must be an AlexElement instance");
    }
    const format = (element, fn) => {
      if (element.hasChildren()) {
        element.children = element.children.map((item) => {
          return format(item, fn);
        });
      }
      return fn(element);
    };
    const removeEmptyElement = (element) => {
      if (element.hasChildren()) {
        element.children.forEach((item) => {
          if (!item.isEmpty()) {
            item = removeEmptyElement(item);
          }
        });
        element.children = element.children.filter((item) => {
          return !item.isEmpty();
        });
      }
      return element;
    };
    this._formatUnchangeableRules.forEach((fn) => {
      ele = format(ele, fn);
    });
    ele = removeEmptyElement(ele);
    return ele;
  }
  //格式化stack
  formatElementStack() {
    this.stack = this.stack.map((ele) => {
      if (!ele.isBlock()) {
        ele.convertToBlock();
      }
      ele = this.formatElement(ele);
      return ele;
    }).filter((ele) => {
      return !ele.isEmpty();
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
      this.emit("change", this.value, this._oldValue);
      if (!unPushHistory) {
        this.history.push(this.stack, this.range);
      }
    }
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
        const focusBlock = this.range.focus.element.getBlock();
        let hasMerge = !focusBlock.hasContains(this.range.anchor.element);
        if (this.range.focus.offset > 0) {
          let anchorElement = this.range.anchor.element;
          let anchorOffset = this.range.anchor.offset;
          this.range.anchor.element = this.range.focus.element;
          this.range.anchor.offset = 0;
          this._deleteInSameElement();
          this.range.anchor.element = anchorElement;
          this.range.anchor.offset = anchorOffset;
        }
        const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1;
        if (this.range.anchor.offset < endOffset) {
          this.range.focus.element = this.range.anchor.element;
          this.range.focus.offset = endOffset;
          this._deleteInSameElement();
        }
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
    if (this.range.anchor.isEqual(this.range.focus)) {
      if (!this.range.anchor.element.getBlock().isPreStyle()) {
        data = data.replace(/\s+/g, () => {
          const span = document.createElement("span");
          span.innerHTML = "&nbsp;";
          return span.innerText;
        });
      }
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
      const anchorBlock = this.range.anchor.element.getBlock();
      const endOffset = this.range.anchor.element.isText() ? this.range.anchor.element.textContent.length : 1;
      if (anchorBlock.isPreStyle()) {
        if (this.range.anchor.offset == endOffset && !(nextElement && anchorBlock.isContains(nextElement))) {
          this.insertText("\n\n");
          this.range.anchor.offset -= 1;
          this.range.focus.offset -= 1;
        } else {
          this.insertText("\n");
        }
      } else {
        if (this.range.anchor.offset == 0 && !(previousElement && anchorBlock.isContains(previousElement))) {
          const paragraph = new AlexElement("block", anchorBlock.parsedom, { ...anchorBlock.marks }, { ...anchorBlock.styles }, null);
          const breakEle = new AlexElement("closed", "br", null, null, null);
          this.addElementTo(breakEle, paragraph);
          this.addElementBefore(paragraph, anchorBlock);
          this.range.anchor.moveToStart(anchorBlock);
          this.range.focus.moveToStart(anchorBlock);
        } else if (this.range.anchor.offset == endOffset && !(nextElement && anchorBlock.isContains(nextElement))) {
          const paragraph = new AlexElement("block", anchorBlock.parsedom, { ...anchorBlock.marks }, { ...anchorBlock.styles }, null);
          const breakEle = new AlexElement("closed", "br", null, null, null);
          this.addElementTo(breakEle, paragraph);
          this.addElementAfter(paragraph, anchorBlock);
          this.range.anchor.moveToStart(paragraph);
          this.range.focus.moveToStart(paragraph);
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
        }
      }
    } else {
      this.delete();
      this.insertParagraph();
    }
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
  //更新焦点的元素为最近的可设置光标的元素
  setRecentlyPoint(point) {
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
    if (node.nodeType != 1 && node.nodeType != 3) {
      throw new Error("Nodes that are not elements or text cannot be parsed");
    }
    if (node.nodeType == 3) {
      return this.formatElement(new AlexElement("text", null, null, null, node.nodeValue));
    } else {
      const marks = Util.getAttributes(node);
      const styles = Util.getStyles(node);
      let element = new AlexElement("block", node.nodeName.toLocaleLowerCase(), marks, styles, null);
      Array.from(node.childNodes).forEach((childNode) => {
        if (childNode.nodeType == 1 || childNode.nodeType == 3) {
          const childEle = this.parseNode(childNode);
          childEle.parent = element;
          if (element.hasChildren()) {
            element.children.push(childEle);
          } else {
            element.children = [childEle];
          }
        }
      });
      return this.formatElement(element);
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
        if (this.range.anchor.offset == 0 && this.range.focus.offset == this.range.anchor.element.textContent.length) {
          elements = [this.range.anchor.element];
        } else if (this.range.anchor.offset == 0) {
          let val = this.range.anchor.element.textContent;
          this.range.anchor.element.textContent = val.substring(0, this.range.focus.offset);
          let newFocus = new AlexElement("text", null, null, null, val.substring(this.range.focus.offset));
          this.addElementAfter(newFocus, this.range.anchor.element);
          elements = [this.range.anchor.element];
        } else if (this.range.focus.offset == this.range.anchor.element.textContent.length) {
          let val = this.range.anchor.element.textContent;
          this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset);
          let newFocus = new AlexElement("text", null, null, null, val.substring(this.range.anchor.offset));
          this.addElementAfter(newFocus, this.range.anchor.element);
          elements = [newFocus];
          this.range.anchor.moveToStart(newFocus);
          this.range.focus.moveToEnd(newFocus);
        } else {
          let val = this.range.anchor.element.textContent;
          this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset);
          let newEl = new AlexElement("text", null, null, null, val.substring(this.range.anchor.offset, this.range.focus.offset));
          this.addElementAfter(newEl, this.range.anchor.element);
          let newFocus = new AlexElement("text", null, null, null, val.substring(this.range.focus.offset));
          this.addElementAfter(newFocus, newEl);
          this.range.anchor.moveToStart(newEl);
          this.range.focus.moveToEnd(newEl);
          elements = [newEl];
        }
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
        if (this.range.anchor.offset == 0) {
          elements.unshift(this.range.anchor.element);
        } else if (this.range.anchor.offset < this.range.anchor.element.textContent.length) {
          let val = this.range.anchor.element.textContent;
          this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset);
          let newEl = new AlexElement("text", null, null, null, val.substring(this.range.anchor.offset));
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
          let val = this.range.focus.element.textContent;
          this.range.focus.element.textContent = val.substring(0, this.range.focus.offset);
          let newEl = new AlexElement("text", null, null, null, val.substring(this.range.focus.offset));
          this.addElementAfter(newEl, this.range.focus.element);
          elements.push(this.range.focus.element);
        }
      } else if (this.range.focus.offset == 1) {
        elements.push(this.range.focus.element);
      }
    }
    return elements;
  }
  //将真实的光标设置到指定元素开始
  collapseToStart(element) {
    if (this.disabled) {
      return;
    }
    if (AlexElement.isElement(element)) {
      this.range.anchor.moveToStart(element);
      this.range.focus.moveToStart(element);
      this.setCursor();
    } else {
      const flatElements = AlexElement.flatElements(this.stack);
      this.collapseToStart(flatElements[0]);
    }
  }
  //将真实的光标设置到指定元素最后
  collapseToEnd(element) {
    if (this.disabled) {
      return;
    }
    if (AlexElement.isElement(element)) {
      this.range.anchor.moveToEnd(element);
      this.range.focus.moveToEnd(element);
      this.setCursor();
    } else {
      const flatElements = AlexElement.flatElements(this.stack);
      const length = flatElements.length;
      this.collapseToEnd(flatElements[length - 1]);
    }
  }
  //根据anchor和focus来设置真实的光标
  setCursor() {
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
        node = point.element._elm;
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
  }
  //根据光标设置css样式
  setStyle(styleObject) {
    if (!Dap.common.isObject) {
      throw new Error("The argument must be an object");
    }
    if (this.range.anchor.isEqual(this.range.focus)) {
      if (this.range.anchor.element.isText()) {
        const children = this.range.anchor.element.parent.children.filter((item) => {
          return !item.isEmpty();
        });
        if (this.range.anchor.element.isSpaceText() && this.range.anchor.element.parent.isInline() && children.length == 1) {
          if (this.range.anchor.element.parent.hasStyles()) {
            Object.assign(this.range.anchor.element.parent.styles, styleObject);
          } else {
            this.range.anchor.element.parent.styles = { ...styleObject };
          }
        } else {
          let spanEl = new AlexElement("inline", "span", null, { ...styleObject }, null);
          let spaceEl = AlexElement.getSpaceElement();
          this.addElementTo(spaceEl, spanEl);
          let val = this.range.anchor.element.textContent;
          this.range.anchor.element.textContent = val.substring(0, this.range.anchor.offset);
          let newEl = new AlexElement("text", null, null, null, val.substring(this.range.anchor.offset));
          this.addElementAfter(newEl, this.range.anchor.element);
          this.addElementBefore(spanEl, newEl);
          this.range.anchor.moveToEnd(spanEl);
          this.range.focus.moveToEnd(spanEl);
        }
      } else {
        let spanEl = new AlexElement("inline", "span", null, { ...styleObject }, null);
        let spaceEl = AlexElement.getSpaceElement();
        this.addElementTo(spaceEl, spanEl);
        if (this.range.anchor.offset == 0) {
          this.addElementBefore(spanEl, this.range.anchor.element);
        } else {
          this.addElementAfter(spanEl, this.range.anchor.element);
        }
        this.range.anchor.moveToEnd(spanEl);
        this.range.focus.moveToEnd(spanEl);
      }
    } else {
      const elements = this.getElementsByRange();
      elements.forEach((el) => {
        if (el.isText()) {
          const children = el.parent.children.filter((item) => {
            return !item.isEmpty() && !item.isSpaceText();
          });
          if (children.length == 1 && el.parent.isInline()) {
            if (el.parent.hasStyles()) {
              Object.assign(el.parent.styles, styleObject);
            } else {
              el.parent.styles = { ...styleObject };
            }
          } else {
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
            this.addElementTo(cloneEl, el);
          }
        } else if (el.isClosed()) {
          for (let key in styleObject) {
            if (!el.hasStyles()) {
              el.styles = {};
            }
            el.styles[key] = styleObject[key];
          }
        }
      });
      this.range.anchor.moveToStart(elements[0]);
      this.range.focus.moveToEnd(elements[elements.length - 1]);
    }
  }
  //销毁编辑器的方法
  destroy() {
    this.setDisabled();
    Dap.event.off(document, "selectionchange.alex_editor");
    Dap.event.off(this.$el, "beforeinput.alex_editor compositionstart.alex_editor compositionupdate.alex_editor compositionend.alex_editor keydown.alex_editor cut.alex_editor paste.alex_editor drop.alex_editor focus.alex_editor blur.alex_editor");
  }
  //触发自定义事件
  emit(eventName, ...value) {
    if (typeof this._events[eventName] == "function") {
      this._events[eventName].apply(this, [...value]);
      return true;
    }
    return false;
  }
  //监听自定义事件
  on(eventName, eventHandle) {
    this._events[eventName] = eventHandle;
  }
}
export {
  AlexEditor,
  AlexElement,
  AlexEditor as default
};
