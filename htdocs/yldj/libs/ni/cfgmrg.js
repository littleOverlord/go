define("libs/ni/cfgmrg",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _loader = _interopRequireDefault(require("libs/ni/loader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导出 ******************/
var CfgMgr =
/*#__PURE__*/
function () {
  function CfgMgr() {
    _classCallCheck(this, CfgMgr);
  }

  _createClass(CfgMgr, null, [{
    key: "registCfg",
    //配置资源目录

    /**
     * @description 初始化配置表
     * @param data 配置数据{"cfg/xx":{"sheetName":{"keys":[],"values":{}}}}
     */
    value: function registCfg(data) {
      var _data;

      for (var k in data) {
        if (k.indexOf(CfgMgr.cfgDir) == 0) {
          _data = JSON.parse(data[k]);

          for (var vk in _data) {
            caches["".concat(k, "@").concat(vk)] = parse(_data[vk].keys, _data[vk].values);
          }

          delete data[k];
        }
      }

      console.log(caches);
    }
    /**
     * @description 获取某张配置表
     * @param {string} path "cfg/xx@sheetName" 
     */

  }, {
    key: "getOne",
    value: function getOne(path) {
      return caches[path];
    }
  }]);

  return CfgMgr;
}();
/****************** 本地 ******************/

/**
 * @deprecated 配置表缓存
 * @example {"cfg/xx@sheetName":{},...}
 */


exports.default = CfgMgr;
CfgMgr.cfgDir = "app/cfg/";
var caches = {};
/**
 * @description 解析配置表数据，返回缓存结构
 */

var parse = function parse(keys, data) {
  var r = {},
      e = {};

  for (var kk in data) {
    for (var i = 0, len = keys.length; i < len; i++) {
      e[keys[i]] = data[kk][i];
    }

    r[kk] = e;
    e = {};
  }

  return r;
};
/****************** 立即执行 ******************/
//绑定资源监听


_loader.default.addResListener("registCfg", CfgMgr.registCfg);
})