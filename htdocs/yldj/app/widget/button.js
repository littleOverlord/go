define("app/widget/button",function(require,exports,module){
"use strict";

var _widget = _interopRequireDefault(require("libs/ni/widget"));

var _events = require("libs/ni/events");

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
var Button =
/*#__PURE__*/
function (_Widget) {
  _inherits(Button, _Widget);

  function Button() {
    _classCallCheck(this, Button);

    return _possibleConstructorReturn(this, _getPrototypeOf(Button).apply(this, arguments));
  }

  _createClass(Button, [{
    key: "setProps",

    /*
    {"id":""}
    */

    /**
     * {
     *   "id":"" //缓存节点在Widget.elements中
     *   "url":"" //背景图片
     *   "width":0 //按钮宽度
     *   "height":0 //按钮高度
     *   "left":0 // 按钮相对父节点的x坐标
     *   "top":0 // 按钮相对父节点的y坐标
     *   "text":"" // 按钮的文字，如果没有则会删除文字节点
     *   "size":20 // 文字大小
     *   "color":#000000 //文字颜色
     *   "on":{"tap":{"func":"tab","arg":[1]}} //事件
     * }
     */
    value: function setProps(props) {
      var _this = this;

      _get(_getPrototypeOf(Button.prototype), "setProps", this).call(this, props);

      var cfg = this.cfg,
          text = cfg.children[0].data,
          dk = ["id", "url", "width", "height", "left", "top"];

      for (var i = 0, len = dk.length; i < len; i++) {
        cfg.data[dk[i]] = props[dk[i]];
      }

      cfg.on = props.on || {
        "tap": {
          "func": "buttonTap",
          arg: []
        }
      };
      text.text = props.text;
      text.style.fontSize = props.size;
      text.style.fill = props.color;

      if (props.on && props.on.tap) {
        this[cfg.on.tap.func] = function () {
          return _this.buttonTap();
        };
      }

      cfg.on.start = {
        "func": "tapStart",
        "arg": []
      };
    }
  }, {
    key: "added",
    value: function added() {
      var node = this.elements.get(this.props.id),
          text = this.elements.get(this.props.id).children[0];
      node.anchor.set(0.5, 0.5);
      node.ni.left = this.props.left + this.props.width / 2;
      node.ni.top = this.props.top + this.props.height / 2;
      text.ni.left = (this.props.width - text.width) / 2 - this.props.width / 2;
      text.ni.top = (this.props.height - text.height) / 2 - this.props.height / 2;
      console.log(text.width, text.height);
    }
  }, {
    key: "tapStart",
    value: function tapStart() {
      var btn = this.elements.get(this.props.id);
      btn.scale.x = btn.scale.y = 0.8;
      console.log("tapStart");
    }
  }, {
    key: "buttonTap",
    value: function buttonTap() {
      var btn = this.elements.get(this.props.id);
      btn.scale.x = btn.scale.y = 1;
      console.log("buttonTap");
      return _events.HandlerResult.OK;
    }
  }]);

  return Button;
}(_widget.default);
/****************** 立即执行 ******************/
//注册组件


_widget.default.registW("app-ui-button", Button);
})