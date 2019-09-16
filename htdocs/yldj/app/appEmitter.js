define("app/appEmitter",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppEmitter = void 0;

var _emitter = _interopRequireDefault(require("libs/ni/emitter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/****************** 导入 ******************/

/****************** 导出 ******************/

/**
 * 游戏主函数
 */
var AppEmitter = new _emitter.default();
exports.AppEmitter = AppEmitter;
})