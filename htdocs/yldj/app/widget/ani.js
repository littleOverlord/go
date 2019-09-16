define("app/widget/ani",function(require,exports,module){
"use strict";

var _widget = _interopRequireDefault(require("libs/ni/widget"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/****************** 导出 ******************/

/****************** 本地 ******************/
//组件扩展
var Ani =
/*#__PURE__*/
function (_Widget) {
  _inherits(Ani, _Widget);

  function Ani() {
    _classCallCheck(this, Ani);

    return _possibleConstructorReturn(this, _getPrototypeOf(Ani).apply(this, arguments));
  }

  _createClass(Ani, [{
    key: "setProps",

    /*
    {"id":""}
    */

    /**
     * {
     *   "id":"" //缓存节点在Widget.elements中
     *   "url":"images/ua/equip_light.json" //精灵图片配置
     *   "width":0 //按钮宽度
     *   "height":0 //按钮高度
     *   "x":0 // 按钮相对父节点的x坐标
     *   "y":0 // 按钮相对父节点的y坐标
     *   "speed": 0.08 //动画播放速度
     *   "once": true //是否一次性动画
     *   "anicallback": Function //动画执行完之后的回调
     * }
     */
    value: function setProps(props) {
      _get(_getPrototypeOf(Ani.prototype), "setProps", this).call(this, props);

      var cfg = this.cfg,
          dk = ["id", "url", "width", "height", "x", "y", "speed", "once", "ani"];

      for (var i = 0, len = dk.length; i < len; i++) {
        cfg.data[dk[i]] = props[dk[i]];
      }

      if (!props.id) {
        props.id = id++;
        cfg.data.id = props.id;
      }
    }
  }, {
    key: "added",
    value: function added(o) {
      console.log();
      o.ni.anicallback = this.props.anicallback;
    }
  }]);

  return Ani;
}(_widget.default);

var id = 1;
/****************** 立即执行 ******************/
//注册组件

_widget.default.registW("app-ui-ani", Ani);
})