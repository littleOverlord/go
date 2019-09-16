define("libs/ni/events",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Events = exports.HandlerResult = void 0;

var _util = _interopRequireDefault(require("libs/ni/util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导出 ******************/
var HandlerResult;
exports.HandlerResult = HandlerResult;

(function (HandlerResult) {
  HandlerResult[HandlerResult["BREAK_OK"] = 0] = "BREAK_OK";
  HandlerResult[HandlerResult["OK"] = 1] = "OK";
})(HandlerResult || (exports.HandlerResult = HandlerResult = {}));

var Events =
/*#__PURE__*/
function () {
  function Events() {
    _classCallCheck(this, Events);
  }

  _createClass(Events, null, [{
    key: "init",
    //支持的事件类型
    //绑定函数

    /**
     * @description 初始化设备数据
     */
    value: function init() {
      var ua = navigator.userAgent.toLowerCase() || "";
      Events.mobile = ua.indexOf('mobile') > -1 ? true : false;
      Events.bindFunc = Events.mobile ? bindMobile : bindPc;
    }
    /**
     * @description 事件监听循环,主要处理长按
     */

  }, {
    key: "loop",
    value: function loop() {
      if (!Events.status.currTarget) {
        return;
      }

      Events.longTap(Events.status.event);
    }
    /**
     * @description 在渲染节点上绑定事件
     * @param cfg {
     *  ...,
     *  "on":{"tap":{"func":"tab","arg":[1]}}
     *  ...
     * }
     */

  }, {
    key: "bindEvent",
    value: function bindEvent(o, cfg) {
      if (!cfg.on) {
        return;
      }

      o.interactive = true;
      o.ni.on = cfg.on;
      o.on(Events.mobile ? "touchstart" : "mousedown", Events.start);
    }
    /**
     * @description 绑定根节点事件
     * @param o
     */

  }, {
    key: "bindGlobal",
    value: function bindGlobal(o) {
      o.interactive = true;
      Events.bindFunc(o);
    }
    /**
     * @description 开始事件
     */

  }, {
    key: "start",
    value: function start(e) {
      Events.status.currTarget = this;
      Events.status.startPos = {
        x: e.data.global.x,
        y: e.data.global.y
      };
      Events.status.time = Date.now();
      Events.status.event = e;
      e.start = Events.status.startPos;

      var _Events$findEvent = Events.findEvent(Events.eventsType.start),
          o = _Events$findEvent.o,
          on = _Events$findEvent.on,
          func = _Events$findEvent.func,
          arg = _Events$findEvent.arg;

      if (on) {
        Events.responseEvent(o, e, arg, func, Events.eventsType.start);
      }

      e.stopPropagation(); // console.log("start ",e,this);
    }
    /**
     * @description 移动事件
     */

  }, {
    key: "move",
    value: function move(e) {
      // console.log("move this ",this);
      if (!Events.status.currTarget) {
        return;
      }

      var _Events$findEvent2 = Events.findEvent(Events.eventsType.drag),
          o = _Events$findEvent2.o,
          on = _Events$findEvent2.on,
          func = _Events$findEvent2.func,
          arg = _Events$findEvent2.arg;

      if (!on || Events.status.eventType != Events.eventsType.drag && !Events.ismove(e.data.global)) {
        return;
      }

      Events.responseEvent(o, e, arg, func, Events.eventsType.drag);
    }
    /**
     * @description 结束事件
     */

  }, {
    key: "end",
    value: function end(e) {
      if (!Events.status.currTarget) {
        return Events.clear();
      }

      var _Events$tap = Events.tap(e),
          o = _Events$tap.o,
          on = _Events$tap.on,
          func = _Events$tap.func,
          arg = _Events$tap.arg;

      if (!on) {
        return Events.clear();
      }

      Events.responseEvent(o, e, arg, func, Events.eventsType.end);
      Events.clear();
    }
    /**
     * @description 触发点击事件
     * @param e 
     */

  }, {
    key: "tap",
    value: function tap(e) {
      var _Events$findEvent3 = Events.findEvent(Events.eventsType.tap),
          o = _Events$findEvent3.o,
          on = _Events$findEvent3.on,
          func = _Events$findEvent3.func,
          arg = _Events$findEvent3.arg;

      if (on) {
        Events.responseEvent(o, e, arg, func, Events.eventsType.tap);
      } else {
        // if(Events.status.eventType && Events.status.eventType != Events.eventsType.start){
        return Events.findEvent(Events.eventsType.end);
      }

      return {
        o: null,
        on: null,
        func: null,
        arg: null
      };
    }
    /**
     * @description 检查是否执行长按事件
     * @param e 
     */

  }, {
    key: "longTap",
    value: function longTap(e) {
      var t = Date.now();

      if (Events.status.eventType || t - Events.status.time < 300) {
        return;
      }

      var _Events$findEvent4 = Events.findEvent(Events.eventsType.longtap),
          o = _Events$findEvent4.o,
          on = _Events$findEvent4.on,
          func = _Events$findEvent4.func,
          arg = _Events$findEvent4.arg;

      if (!on) {
        return;
      }

      Events.responseEvent(o, e, arg, func, Events.eventsType.longtap);
    }
    /**
     * @description 清除事件缓存
     */

  }, {
    key: "clear",
    value: function clear() {
      for (var k in Events.status) {
        Events.status[k] = null;
      }
    }
    /**
     * @description 判断是否可以触发移动事件
     * @param pos 新的触发点坐标
     */

  }, {
    key: "ismove",
    value: function ismove(pos) {
      var dx = pos.x - Events.status.startPos.x,
          dy = pos.y - Events.status.startPos.y,
          rang = 3;
      return dx * dx + dy * dy >= rang * rang;
    }
    /**
     * @description 按事件类型获取某个节点上的事件
     * @param type 事件类型
     */

  }, {
    key: "findEvent",
    value: function findEvent(type) {
      var o = Events.status.currTarget,
          on = o.ni.on[type],
          func = on ? on.func : null,
          arg = on ? _util.default.copy(on.arg) : null;
      return {
        o: o,
        on: on,
        func: func,
        arg: arg
      };
    }
    /**
     * @description 找到事件，执行
     */

  }, {
    key: "eventCall",
    value: function eventCall(name, o, arg) {
      var w, l;

      while (o) {
        if (o.widget && w != o.widget && o.widget[name]) {
          w = o.widget;

          if (_util.default.objCall(w, name, arg) !== HandlerResult.OK) {
            return;
          }
        }

        if (o.logic && l != o.logic && o.logic[name]) {
          l = o.logic;

          if (_util.default.objCall(l, name, arg) !== HandlerResult.OK) {
            return;
          }
        }

        o = o.parent;
      }
    }
    /**
     * @description 响应事件
     */

  }, {
    key: "responseEvent",
    value: function responseEvent(o, e, arg, func, type) {
      Events.status.eventType = type;
      arg = arg || [];
      arg.push(e);
      arg.push(o);

      try {
        Events.eventCall(func, o, arg);
      } catch (e) {
        console.error(e);
      }
    }
  }]);

  return Events;
}();

exports.Events = Events;
Events.eventsType = {
  start: "start",
  tap: "tap",
  longtap: "longtap",
  drag: "drag",
  end: "end" // 正在触发的事件状态

};
Events.status = {
  currTarget: null,
  // 当前触发事件的渲染对象
  event: null,
  // 事件对象 PIXI.interaction.InteractionEvent
  startPos: null,
  // 起始位置 {x:0,y:0}
  moving: null,
  // 
  eventType: null,
  // 触发的事件类型
  time: 0 // 触发时间点
  //是否移动端

};
Events.mobile = void 0;
Events.bindFunc = void 0;
;
/****************** 本地 ******************/

/**
 * @description 绑定移动端事件
 * @param o 渲染对象
 */

var bindMobile = function bindMobile(o) {
  o.on("touchmove", Events.move);
  o.on("touchend", Events.end);
  o.on("touchendoutside", Events.end);
  o.on("touchcancel", Events.end);
};
/**
 * @description 绑定pc端事件
 * @param o 渲染对象
 */


var bindPc = function bindPc(o) {
  o.on("mousemove", Events.move);
  o.on("mouseup", Events.end);
  o.on("mouseupoutside", Events.end);
};
/****************** 立即执行 ******************/
//初始化


Events.init();
})