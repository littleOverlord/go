define("libs/ni/textani",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scene = _interopRequireDefault(require("libs/ni/scene"));

var _util = _interopRequireDefault(require("libs/ni/util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导出 ******************/
var TextAnimate =
/*#__PURE__*/
function () {
  function TextAnimate(aniFunc, style) {
    _classCallCheck(this, TextAnimate);

    this.cache = [];
    this.playing = [];
    this.style = void 0;
    this.aniFunc = void 0;
    this.aniFunc = aniFunc;
    this.style = style;
  } //动画缓存


  _createClass(TextAnimate, [{
    key: "create",
    //创建text

    /**
     * 
     * @param option {text,x,y,alpha}
     * @param parent 渲染对象
     */
    value: function create(option, parent) {
      var o = this.cache.shift(),
          d = {};

      if (o) {
        _util.default.setValueO2O(option, o);
      } else {
        _util.default.setValueO2O(option, d);

        d.style = d.style || this.style;
        o = _scene.default.create({
          type: "text",
          data: d
        }, null, parent, null);
      }

      this.playing.push(o);
      return o;
    } //动画循环

  }, {
    key: "loop",
    value: function loop() {
      for (var i = this.playing.length - 1; i >= 0; i--) {
        if (this.aniFunc(this.playing[i])) {
          this.cache.push(this.playing[i]);
          this.playing.splice(i, 1);
        }
      }
    }
  }]);

  return TextAnimate;
}();
/****************** 本地 ******************/


exports.default = TextAnimate;
})