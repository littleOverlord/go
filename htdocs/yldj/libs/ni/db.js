define("libs/ni/db",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _emitter = _interopRequireDefault(require("libs/ni/emitter"));

var _frame = _interopRequireDefault(require("libs/ni/frame"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导出 ******************/
var DB =
/*#__PURE__*/
function () {
  function DB() {
    _classCallCheck(this, DB);
  }

  _createClass(DB, null, [{
    key: "init",
    //存储数据
    //数据库监听器
    //初始化数据表
    value: function init(key, value) {
      addGetterSetter(DB.data, key, value);
    }
  }]);

  return DB;
}();

exports.default = DB;
DB.attrPrefix = "-_-";
DB.data = void 0;
DB.emitter = new _emitter.default();
;
/****************** 本地 ******************/

/**
 * @description 监听事件缓存列表，16毫秒跑一次
 */

var cache = {};
/**
 * @description 初始化数据绑定，完成数据监听
 * @param o 绑定父节点
 * @param k 绑定的属性key
 * @param v 绑定的值，如果为对象，则遍历层层绑定
 */

var addGetterSetter = function addGetterSetter(o, k, v) {
  var _o = {},
      path = o[DB.attrPrefix] || [];

  if (_typeof(v) == "object") {
    if (v.length != undefined) {
      _o = [];
    }

    o[k] = new Proxy(_o, {
      "get": function get(target, key) {
        return target[key];
      },
      "set": function set(target, key, value) {
        var p;

        if (key != DB.attrPrefix && target[key] != value) {
          p = target[DB.attrPrefix].slice();
          p.push(key);
          addCache(p, target[key]);
        }

        target[key] = value;
        return true;
      },
      "deleteProperty": function deleteProperty(target, key) {
        var p;

        if (target[key] !== undefined) {
          p = target[DB.attrPrefix].slice();
          p.push(key);
          addCache(p, target[key]);
        }

        return delete target[key];
      }
    });
    o[k][DB.attrPrefix] = path.slice();
    o[k][DB.attrPrefix].push(k);

    for (var _k in v) {
      addGetterSetter(o[k], _k, v[_k]);
    }
  } else {
    o[k] = v;
  }
};
/**
 * @description 添加需要触发的监听到缓存列表
 * @param path 路径数组，由每层的key组成
 * @param old 老的数据
 */


var addCache = function addCache(path, old) {
  var p, k;

  for (var i = 0, len = path.length; i < len; i++) {
    p = path.slice(0, i + 1);
    k = p.join(".");

    if (!DB.emitter.list[k]) {
      continue;
    }

    cache[k] = old;
  }
};

var loop = function loop() {
  for (var k in cache) {
    DB.emitter.emit(k, cache[k]);
    delete cache[k];
  }
};
/****************** 立即执行 ******************/
//初始化数据库对象


addGetterSetter(DB, "data", {});
DB.data[DB.attrPrefix] = []; //添加到帧循环中

_frame.default.add(loop);
})