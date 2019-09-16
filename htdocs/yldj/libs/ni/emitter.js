define("libs/ni/emitter",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导入 ******************/

/****************** 导出 ******************/
var Emitter =
/*#__PURE__*/
function () {
  function Emitter() {
    _classCallCheck(this, Emitter);

    this.list = {};
  }

  _createClass(Emitter, [{
    key: "add",

    /**
     * @description 注册全局广播函数
     * @param {string} key 函数注册的key,作为调用的唯一凭证
     * @param {Function} func 注册接收消息的函数
     */
    value: function add(key, func) {
      if (!this.list[key]) {
        this.list[key] = [];
      }

      if (this.list[key].indexOf(func) >= 0) {
        // return console.error("Has a same handler in the Emitter.list ",func);
        return;
      }

      this.list[key].push(func);
    }
    /**
     * @description 向所有注册为key的函数广播消息
     * @param {string} key 注册函数的key
     * @param {any} param 注册函数接收的参数
     */

  }, {
    key: "emit",
    value: function emit(key, param) {
      var evs = this.list[key],
          r = [];

      if (!evs) {
        // console.error(`There is no handler match '${key}'`);
        return;
      }

      for (var i = 0, len = evs.length; i < len; i++) {
        r.push(evs[i](param));
      }

      return r;
    }
  }]);

  return Emitter;
}();
/****************** 本地 ******************/

/****************** 立即执行 ******************/


exports.default = Emitter;
})