define("app/process",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scene = _interopRequireDefault(require("libs/ni/scene"));

var _widget = _interopRequireDefault(require("libs/ni/widget"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导出 ******************/
var Process =
/*#__PURE__*/
function () {
  function Process() {
    _classCallCheck(this, Process);
  }

  _createClass(Process, null, [{
    key: "add",
    value: function add() {
      var index = Process.table.length;
      Process.table.push(0);
      createBar();
      return processHandler(index);
    }
  }, {
    key: "clear",
    value: function clear() {
      if (!Process.node) {
        return;
      }

      _scene.default.remove(Process.node);

      Process.timer = null;
      Process.node = null;
      Process.table = [];
    }
  }]);

  return Process;
}();
/****************** 本地 ******************/


exports.default = Process;
Process.timer = void 0;
Process.node = void 0;
Process.table = [];
var barData = {
  "type": "rect",
  "data": {
    "width": "100%",
    "height": "100%",
    "left": 0,
    "top": 0,
    "background-color": "0x000000",
    "background-alpha": 0.5
  },
  "children": [{
    "type": "rect",
    "data": {
      "width": "80%",
      "height": 20,
      "left": "10%",
      "bottom": 200,
      "border-color": "0xffff00",
      "border-width": 1,
      "border-align": 1
    },
    "children": [{
      "type": "rect",
      "data": {
        "id": "processBar",
        "width": "100%",
        "height": 20,
        "left": 0,
        "top": 0,
        "background-color": "0x00ffff"
      }
    }, {
      "type": "text",
      "data": {
        "text": "资源加载中...",
        "style": {
          "fontSize": 24,
          "fill": "#ffffff"
        },
        "left": 0,
        "top": 25
      }
    }, {
      "type": "text",
      "data": {
        "text": "000.0%",
        "style": {
          "fontSize": 24,
          "fill": "#ffffff"
        },
        "right": 0,
        "top": 25
      }
    }]
  }]
  /**
   * @description 打开进度界面
   */

};

var createBar = function createBar() {
  if (Process.node) {
    return;
  }

  Process.node = _scene.default.create(barData, new _widget.default("app-ui-process"), _scene.default.root);
  Process.node.children[0].children[0].scale.x = 0.0001;
};
/**
 * @description 返回进度处理函数
 * @param index 
 */


var processHandler = function processHandler(index) {
  return function (point) {
    Process.table[index] = point;
    updateBar();
  };
};
/**
 * @description 更新进度条
 */


var updateBar = function updateBar() {
  var total = Process.table.length,
      _process = 0;

  for (var i = 0; i < total; i++) {
    _process += Process.table[i];
  }

  console.log(_process);
  Process.node.children[0].children[0].scale.x = _process || 0.0001;
  Process.node.children[0].children[2].text = (_process * 100).toFixed(1);
};
/****************** 立即执行 ******************/
})