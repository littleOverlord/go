define("libs/ni/widget",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("libs/ni/util"));

var _loader = _interopRequireDefault(require("libs/ni/loader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导出 ******************/
var Widget =
/*#__PURE__*/
function () {
  function Widget(url, props) {
    _classCallCheck(this, Widget);

    this.url = void 0;
    this.cfg = void 0;
    this.props = void 0;
    this.elements = new Map();

    if (!this.url) {
      this.url = url;
    }

    this.cfg = _util.default.copy(Widget.cfgCache.get(this.url));
    this.setProps(props);
  }

  _createClass(Widget, [{
    key: "setProps",
    //设置props
    value: function setProps(props) {
      this.props = props;
    } //组件被添加到场景,渲染周期内调用，谨慎使用

    /**
     * 
     * @param o 渲染对象
     */

  }, {
    key: "added",
    value: function added(o) {} //组件被销毁

  }, {
    key: "destory",
    value: function destory() {} //组件扩展类缓存

  }], [{
    key: "registW",

    /**
     * @description 注册组件
     * @param name 组件名
     * @param w 组件类
     */
    value: function registW(name, w) {
      Widget.wCache.set(name, w);
    }
    /**
     * @description 注册组件配置
     * @param cfgs 组件配置
     */

  }, {
    key: "registWC",
    value: function registWC(cfgs) {
      for (var k in cfgs) {
        if (k.indexOf(Widget.cfgDir) == 0) {
          Widget.cfgCache.set(k.replace(".json", "").replace(/\//g, "-"), JSON.parse(cfgs[k]));
          delete cfgs[k];
        }
      }
    }
    /**
     * @description 查找组件配置
     * @param name 组件名字("app-ui-player")
     */

  }, {
    key: "findWC",
    value: function findWC(name) {
      return _util.default.copy(Widget.cfgCache.get(name));
    }
    /**
     * @description 创建组件
     * @param name 组件名
     */

  }, {
    key: "factory",
    value: function factory(name, wName, prop) {
      var w = Widget.wCache.get(wName) || Widget;
      return new w(name, prop);
    }
  }]);

  return Widget;
}();

exports.default = Widget;
Widget.cfgDir = "app/ui/";
Widget.wCache = new Map();
Widget.cfgCache = new Map();
;
/****************** 立即执行 ******************/
//绑定资源监听

_loader.default.addResListener("registWC", Widget.registWC);
})