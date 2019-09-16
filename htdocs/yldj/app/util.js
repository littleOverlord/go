define("app/util",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppUtil = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导入 ******************/

/****************** 导出 ******************/
var AppUtil =
/*#__PURE__*/
function () {
  function AppUtil() {
    _classCallCheck(this, AppUtil);
  }

  _createClass(AppUtil, null, [{
    key: "Rectangle",

    /**
    * 矩形区域碰撞检测
    * @param ab {x,y,width,height}
    */
    value: function Rectangle(a, b) {
      var a_x_w = Math.abs(a.x + a.width / 2 - (b.x + b.width / 2));
      var b_w_w = Math.abs((a.width + b.width) / 2);
      var a_y_h = Math.abs(a.y + a.height / 2 - (b.y + b.height / 2));
      var b_h_h = Math.abs((a.height + b.height) / 2);
      if (a_x_w < b_w_w && a_y_h < b_h_h) return true;else return false;
    }
    /**
     * @description 计算 !! 为true的元素个数
     * @param o []
     */

  }, {
    key: "caclEmptyInObj",
    value: function caclEmptyInObj(o) {
      var c = 0;

      for (var i = 0, len = o.length; i < len; i++) {
        if (!!o[i]) {
          c++;
        }
      }

      return c;
    }
  }]);

  return AppUtil;
}();
/****************** 立即执行 ******************/


exports.AppUtil = AppUtil;
})