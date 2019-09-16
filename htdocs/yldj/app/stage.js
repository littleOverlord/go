define("app/stage",function(require,exports,module){
"use strict";

var _scene = _interopRequireDefault(require("libs/ni/scene"));

var _frame = _interopRequireDefault(require("libs/ni/frame"));

var _db = _interopRequireDefault(require("libs/ni/db"));

var _widget = _interopRequireDefault(require("libs/ni/widget"));

var _music = _interopRequireDefault(require("libs/ni/music"));

var _appEmitter = require("app/appEmitter");

var _util = require("app/util");

var _connect = _interopRequireDefault(require("libs/ni/connect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导出 ******************/

/****************** 本地 ******************/
var stageNode, // 关卡渲染节点
scoreNode, // 积分节点
magnet, // 磁铁
stageBox, // 游戏主容器
startNode; // 开始游戏界面
// 速度处理对象

var BASE_V =
/*#__PURE__*/
function () {
  function BASE_V() {
    _classCallCheck(this, BASE_V);
  }

  _createClass(BASE_V, null, [{
    key: "caclGrad",

    /**
     * @description 积分变化，重新计算初始速度
     * @param score 
     */
    value: function caclGrad(score) {
      var next = BASE_V.grad[BASE_V.currGrad + 1];

      if (!next) {
        return;
      }

      if (score >= next[0]) {
        BASE_V.currGrad++;
        BASE_V.init();
      }
    }
    /**
     * @description 初始速度
     */

  }, {
    key: "init",
    value: function init() {
      BASE_V._player = BASE_V.player = BASE_V.grad[BASE_V.currGrad][2];
      BASE_V._shap = BASE_V.shap = BASE_V.grad[BASE_V.currGrad][1];

      if (Stage.width > _scene.default.screen._width) {
        BASE_V.player = Math.floor(BASE_V.player / _scene.default.screen._width * Stage.width);
      }

      if (Stage.height > _scene.default.screen._height) {
        BASE_V.shap = Math.floor(BASE_V.shap / _scene.default.screen._height * Stage.height);
      }

      console.log(BASE_V._player, BASE_V.player, BASE_V._shap, BASE_V.shap);
    }
  }, {
    key: "reset",
    value: function reset() {
      BASE_V.currGrad = 0;
      BASE_V.init();
    }
  }]);

  return BASE_V;
}();
/**
 * @description 公式
 */


BASE_V.grad = [[0, 2.5, 2], [20, 4, 2], [70, 4, 4], [140, 5.5, 4], [360, 5.5, 7], [1000, 6, 7.5]];
BASE_V._player = void 0;
BASE_V._shap = void 0;
BASE_V.player = void 0;
BASE_V.shap = void 0;
BASE_V.currGrad = 0;

var Formula =
/*#__PURE__*/
function () {
  function Formula() {
    _classCallCheck(this, Formula);
  }

  _createClass(Formula, null, [{
    key: "shapScore",

    /**
     * @description 计算形状分数
     * @param v 速度
     * @param area 面积
     */
    value: function shapScore(v, area) {
      return Math.round((v + 2) * 76825 / (10000 + area) / 4);
    }
    /**
     * @description 计算形状插入最小时间间隔
     * @param t 关卡进行时间(s)
     */

  }, {
    key: "insertRangMin",
    value: function insertRangMin(t) {
      return Math.max(1200 - t * 15, 600);
    }
    /**
     * @description 计算形状插入最小时间间隔
     * @param t 关卡进行时间(s)
     */

  }, {
    key: "insertRangMax",
    value: function insertRangMax(t) {
      return Math.max(2400 - t * 10, 2000);
    }
    /**
     * @description 计算下一次插入形状的时间
     * @param t 关卡进行时间(s)
     */

  }, {
    key: "insertShapTime",
    value: function insertShapTime(t) {
      var rmin = Formula.insertRangMin(t),
          rmax = Formula.insertRangMax(t);
      return Date.now() + rmin + Math.floor(Math.random() * (rmax - rmin));
    }
    /**
     * @description 随机一定范围的自然时间点
     * @param last 最大持续时间
     */

  }, {
    key: "randomTime",
    value: function randomTime(last) {
      return Date.now() + Math.random() * last;
    }
    /**
     * @description 形状旋转随机速度和方向
     * @param v 速度
     */

  }, {
    key: "shapAniRandomV",
    value: function shapAniRandomV(v) {
      return v * (0.1 + 1 * Math.random()) * (Math.random() > 0.5 ? -1 : 1);
    }
    /**
     * @description 计算掉落速度,在一定范围上下浮动
     * @param rang 浮动范围(0.3)
     */

  }, {
    key: "dorpV",
    value: function dorpV(rang) {
      var rad = Math.random() * rang,
          mk = Math.random() > 0.5 ? -1 : 1;
      return BASE_V.shap * (1 + rad * mk);
    }
  }]);

  return Formula;
}();
/**
 * @description 关卡状态机
 */


var Stage =
/*#__PURE__*/
function () {
  function Stage() {
    _classCallCheck(this, Stage);
  }

  _createClass(Stage, null, [{
    key: "getId",

    /**
     * @description 自己
     */

    /**
     * @description 非自己
     */
    //事件列表
    //添加新形状的频率区间
    //down
    //up
    //shap id
    //insert boom time
    // 获取shap id
    value: function getId() {
      return Stage.id++;
    } // 插入shap

  }, {
    key: "insert",
    value: function insert(shap) {
      shap.id = Stage.getId();

      if (shap.camp) {
        Stage.self = shap;
      } else {
        Stage.shaps.push(shap);
      }

      Stage.events.push({
        type: "insert",
        shap: shap
      });
    }
  }, {
    key: "run",
    value: function run() {
      Stage.move(Stage.self);

      for (var i = Stage.shaps.length - 1; i >= 0; i--) {
        Stage.move(Stage.shaps[i]);

        if (_util.AppUtil.Rectangle(Stage.self, Stage.shaps[i])) {
          Stage.effect(Stage.shaps[i], Stage.self);

          if (Stage.result()) {
            if (Stage.self.hp <= 0) {
              Stage.events.push({
                type: "remove",
                target: Stage.shaps[i].id
              });
            }

            return;
          }

          Stage.effect(Stage.self, Stage.shaps[i]);
        }

        if (Stage.result()) {
          return;
        }

        if (Stage.shaps[i].hp <= 0 || Stage.shaps[i].y >= Stage.height) {
          Stage.events.push({
            type: "remove",
            target: Stage.shaps[i].id
          });
          Stage.shaps.splice(i, 1);
        }
      }
    }
  }, {
    key: "loop",
    value: function loop() {
      var evs;

      if (!Stage.pause) {
        Stage.run();
      }

      evs = Stage.events;
      Stage.events = [];
      return evs;
    }
  }, {
    key: "effect",
    value: function effect(src, target) {
      target[src.effect] += src.value;
      Stage.events.push({
        type: "effect",
        effect: src.effect,
        value: src.value,
        src: src.id,
        target: target.id
      });
    }
  }, {
    key: "move",
    value: function move(shap) {
      var x = shap.x,
          y = shap.y,
          cacl = function cacl(s, key) {
        var d = s["v" + key],
            ad = Math.abs(d),
            to = s.to[key],
            at = Math.abs(to),
            m = to / at;

        if (at > ad) {
          s[key] += ad * m;
          s.to[key] = (at - ad) * m;
          return false;
        } else {
          s[key] += to;
          s.to[key] = 0;
          return true;
        }
      };

      if (shap.to) {
        if (cacl(shap, "x") && cacl(shap, "y") && !shap.to.moving) {
          shap.to = null;
        }
      } else {
        shap.x += shap.vx;
        shap.y += shap.vy;
      }

      if (x != shap.x || y != shap.y) {
        Stage.events.push({
          type: "move",
          value: {
            x: shap.x,
            y: shap.y
          },
          target: shap.id
        });
      }
    }
  }, {
    key: "result",
    value: function result() {
      var r = Stage.self.x <= 0 || Stage.self.x >= Stage.width - Stage.self.width || Stage.self.hp <= 0;

      if (r) {
        Stage.pause = 1;
        Stage.events.push({
          type: "over",
          result: r
        });
      }

      return r;
    }
  }, {
    key: "checkOut",
    value: function checkOut(shap) {}
  }, {
    key: "clear",
    value: function clear() {
      Stage.shaps = [];
      Stage.self = null;
      Stage.id = 1;
      Stage.events = [];
      Stage.startTime = 0;
    }
  }]);

  return Stage;
}();

Stage.startTime = 0;
Stage.width = 0;
Stage.height = 0;
Stage.self = void 0;
Stage.shaps = [];
Stage.events = [];
Stage.insertRang = [600, 2000];
Stage.insertTimer = void 0;
Stage.down = 0;
Stage.up = 0;
Stage.id = 1;
Stage.pause = 1;
Stage.boomTime = 0;

var Shap = function Shap(options) {
  _classCallCheck(this, Shap);

  this.id = 0;
  this.camp = 1;
  this.type = "";
  this.effect = "";
  this.value = 0;
  this.score = 0;
  this.width = 0;
  this.height = 0;
  this.hp = 1;
  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 0;
  this.to = void 0;

  for (var k in options) {
    this[k] = options[k];
  }
};
/**
 * @description  关卡界面组件
 */


var WStage =
/*#__PURE__*/
function (_Widget) {
  _inherits(WStage, _Widget);

  function WStage() {
    _classCallCheck(this, WStage);

    return _possibleConstructorReturn(this, _getPrototypeOf(WStage).apply(this, arguments));
  }

  _createClass(WStage, [{
    key: "start",
    value: function start() {
      Stage.down = Date.now();
    }
  }, {
    key: "end",
    value: function end() {
      Stage.up = Date.now();
    }
  }, {
    key: "added",
    value: function added(node) {
      scoreNode = this.elements.get("score");
      stageBox = this.elements.get("stageBox");
      magnet = new Magnet(this.elements);
    }
  }]);

  return WStage;
}(_widget.default);

var Magnet =
/*#__PURE__*/
function () {
  function Magnet(elements) {
    _classCallCheck(this, Magnet);

    this.cutDown = null;
    this.list = [];
    this.curr = 0;
    this.nearTime = 0;
    this.during = 10000;
    this.list[0] = elements.get("magnet0");
    this.list[1] = elements.get("magnet1");
    this.list[1].scale.x = -1;
    this.cutDown = _scene.default.open("app-ui-magnet_tip", _scene.default.root);
  }

  _createClass(Magnet, [{
    key: "init",
    value: function init() {
      this.nearTime = this.caclTime();
      this.change(0);
    }
  }, {
    key: "caclTime",
    value: function caclTime() {
      return Date.now() + this.during + Math.floor(this.during * Math.random() * 2);
    }
  }, {
    key: "change",
    value: function change(curr) {
      console.log(curr);
      this.curr = curr;
      this.list[1 - curr].alpha = 0.3;
      this.list[curr].alpha = 1;
    }
  }, {
    key: "update",
    value: function update() {
      if (Stage.pause) {
        return;
      }

      var diff = this.nearTime - Date.now(),
          v;

      if (this.cutDown.children[1].text == "0" && this.cutDown.alpha == 1) {
        this.reset();
        this.nearTime = this.caclTime();
        this.change(1 - this.curr);
        return;
      }

      v = Math.ceil(diff / 1000);

      if (v < 0) {
        v = 0;
      }

      if (v > 5) {
        return;
      }

      this.cutDown.alpha = 1;
      this.cutDown.children[1].text = v + "";
    }
  }, {
    key: "reset",
    value: function reset() {
      this.cutDown.alpha = 0;
      this.cutDown.children[1].text = "5";
    }
  }, {
    key: "clear",
    value: function clear() {
      _scene.default.remove(this.cutDown);

      this.cutDown = null;
    }
  }]);

  return Magnet;
}();
/**
 * @description 形状组件
 */


var WShap =
/*#__PURE__*/
function (_Widget2) {
  _inherits(WShap, _Widget2);

  function WShap() {
    _classCallCheck(this, WShap);

    return _possibleConstructorReturn(this, _getPrototypeOf(WShap).apply(this, arguments));
  }

  _createClass(WShap, [{
    key: "setProps",
    value: function setProps(props) {
      _get(_getPrototypeOf(WShap.prototype), "setProps", this).call(this, props);

      var sc = props.width / this.cfg.data.width; // ss = this.cfg.children[1].data.style.fontSize * sc;
      // ss = ss < 24?24:ss;

      this.cfg.data.width = props.width;
      this.cfg.data.height = props.height;
      this.cfg.data.left = props.x;
      this.cfg.data.top = props.y;
      this.cfg.children[0].data.url = props.type == "player" ? "images/ui/circular.png" : "images/shap/".concat(props.type, ".png");
      this.cfg.children[0].data.left = props.width / 2;
      this.cfg.children[0].data.top = props.height / 2;

      if (props.effect == "score") {} // this.cfg.children[1].data.text = props.value.toString();
      // this.cfg.children[1].data.style.fontSize = ss;

    }
  }, {
    key: "added",
    value: function added(shap) {// let text = shap.children[1];
      // text.ni.left = (shap._width - text.width)/2;
      // text.ni.top = (shap._height - text.height)/2;
    }
  }]);

  return WShap;
}(_widget.default);
/**
 * @description 玩家组件
 */


var WPlayer =
/*#__PURE__*/
function (_Widget3) {
  _inherits(WPlayer, _Widget3);

  function WPlayer() {
    _classCallCheck(this, WPlayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(WPlayer).apply(this, arguments));
  }

  _createClass(WPlayer, [{
    key: "setProps",
    value: function setProps(props) {
      _get(_getPrototypeOf(WPlayer.prototype), "setProps", this).call(this, props);

      this.cfg.data.width = props.width;
      this.cfg.data.height = props.height;
      this.cfg.data.left = props.x;
      this.cfg.data.top = props.y;
    }
  }]);

  return WPlayer;
}(_widget.default);
/**
 * @description 开始游戏界面
 */


var WStart =
/*#__PURE__*/
function (_Widget4) {
  _inherits(WStart, _Widget4);

  function WStart() {
    _classCallCheck(this, WStart);

    return _possibleConstructorReturn(this, _getPrototypeOf(WStart).apply(this, arguments));
  }

  _createClass(WStart, [{
    key: "setProps",
    value: function setProps(props) {
      _get(_getPrototypeOf(WStart.prototype), "setProps", this).call(this, props);

      this.cfg.children[2].data.text = scoreNode.text;
    }
  }, {
    key: "added",
    value: function added() {
      var title = this.elements.get("lastScoreTitle"),
          lastScore = this.elements.get("lastScore");
      title.ni.left = (Stage.width - title.width) / 2;
      lastScore.ni.left = (Stage.width - lastScore.width) / 2;
    }
  }, {
    key: "startGame",
    value: function startGame() {
      BASE_V.reset();

      _startGame();
    }
  }]);

  return WStart;
}(_widget.default);
/**
 * @description 显示事件处理
 */


var Show =
/*#__PURE__*/
function () {
  function Show() {
    _classCallCheck(this, Show);
  }

  _createClass(Show, null, [{
    key: "distribute",

    /**
     * @description 分发事件
     * @param evs 事件列表
     */
    value: function distribute(evs) {
      for (var i = 0, len = evs.length; i < len; i++) {
        Show[evs[i].type] && Show[evs[i].type](evs[i]);
      }
    }
  }, {
    key: "insert",
    value: function insert(ev) {
      var shap; // shap = Scene.open(ev.shap.camp?"app-ui-player":"app-ui-shap",stageNode,null,ev.shap);

      shap = _scene.default.open("app-ui-shap", stageBox, null, ev.shap);

      if (!ev.shap.camp) {
        ShapAni.init(shap);
      }

      Show.table[ev.shap.id] = shap;
    }
  }, {
    key: "move",
    value: function move(ev) {
      var shap = Show.table[ev.target];
      shap.x = ev.value.x;
      shap.y = ev.value.y;
    }
  }, {
    key: "effect",
    value: function effect(ev) {
      if (ev.effect == "score") {
        BASE_V.caclGrad(Stage.self.score);
        scoreNode.text = Stage.self.score.toString();
      } else if (ev.effect == "boom") {
        _music.default.play("audio/boom.mp3");
      }
    }
  }, {
    key: "remove",
    value: function remove(ev) {
      var shap = Show.table[ev.target];

      _scene.default.remove(shap);

      delete Show.table[ev.target];
    }
  }, {
    key: "over",
    value: function over() {
      _appEmitter.AppEmitter.emit("newScore", Stage.self.score);

      openStart();
      Stage.clear();
      magnet.reset();
    }
  }]);

  return Show;
}();
/**
 * @description 打开关卡界面
 */


Show.table = {};

var open = function open() {
  stageNode = _scene.default.open("app-ui-stage", _scene.default.root);
  Stage.width = stageNode._width;
  Stage.height = stageNode._height;
  BASE_V.init();
};
/**
 * @description 打开重新开始界面
 */


var openStart = function openStart() {
  startNode = _scene.default.open("app-ui-start", _scene.default.root);
};
/**
 * @description 开始游戏
 */


var _startGame = function _startGame() {
  if (!Stage.self) {
    for (var key in Show.table) {
      _scene.default.remove(Show.table[key]);

      delete Show.table[key];
    }

    insertSelf();
  }

  if (startNode) {
    _scene.default.remove(startNode);

    startNode = null;
  }

  Stage.pause = 0;
  Stage.startTime = Date.now();
  scoreNode.text = "0";
  magnet.init();
};
/**
 * @description 插入自己
 */


var insertSelf = function insertSelf() {
  var s = new Shap({
    type: "player",
    camp: 1,
    width: 80,
    height: 80,
    x: Stage.width - 80,
    y: Stage.height - 195,
    effect: "hp",
    value: -1,
    vx: -BASE_V.player
  });
  Stage.insert(s);
};
/**
 * @description 随机一个形状
 */


var shapArray = ["diamond", "rectangle", "hexagon", "triangle"];

var insertShap = function insertShap() {
  if (Stage.insertTimer && Date.now() < Stage.insertTimer) {
    return;
  }

  var dt = (Date.now() - Stage.startTime) / 1000;
  Stage.insertTimer = Formula.insertShapTime(dt);
  var index = Math.floor(Math.random() * shapArray.length),
      size = 50 + Math.floor(Math.random() * 200),
      x = Math.floor(Math.random() * (Stage.width - size)),
      vy = Formula.dorpV(0.3),
      s = new Shap({
    type: shapArray[index],
    camp: 0,
    width: size,
    height: size,
    x: x,
    y: -size,
    effect: "score",
    value: Formula.shapScore(vy, size * size),
    vy: vy
  }); // console.log(Stage.width,size,x);

  Stage.insert(s);
};
/**
 * @description 插入炸弹
 */


var insertBoom = function insertBoom() {
  var random = Math.random(),
      probability = 0.5,
      s;

  if (random < probability || Date.now() - Stage.boomTime < 5000) {
    return;
  }

  Stage.boomTime = Date.now();
  s = new Shap({
    type: "boom",
    camp: 0,
    width: 170,
    height: 170,
    x: Math.floor(Math.random() * (Stage.width - 170)),
    y: -170,
    effect: "hp",
    value: -1,
    vy: Formula.dorpV(0.3)
  });
  Stage.insert(s);
};
/**
 * @description 重置玩家速度
 */


var resetPV = function resetPV() {
  if (!Stage.self || Stage.pause) {
    return;
  }

  var dt = Stage.up - Stage.down;

  if (dt > 0) {
    Stage.self.vx = magnet.curr ? BASE_V.player : -BASE_V.player;
  } else if (dt < 0) {
    Stage.self.vx = magnet.curr ? -BASE_V.player * 2 : BASE_V.player * 2;
  } //    console.log(Stage.self.vx);

};
/**
 * @description 形状动画
 */


var ShapAni =
/*#__PURE__*/
function () {
  function ShapAni(o) {
    _classCallCheck(this, ShapAni);

    this.show = void 0;
    this.v = void 0;
    this.vt = void 0;
    this.time = void 0;
    this.show = o;
    this.v = this.vt = Formula.shapAniRandomV(ShapAni.vs);
    this.time = Formula.randomTime(ShapAni.during);
    o.sa = this;
  } //显示对象


  _createClass(ShapAni, null, [{
    key: "init",

    /**
     * @description 初始化形状动画数据
     * @param o 
     */
    value: function init(o) {
      new ShapAni(o);
    }
    /**
     * @description 动画循环
     */

  }, {
    key: "run",
    value: function run() {
      var table = Show.table,
          o;

      for (var k in table) {
        o = table[k];

        if (!o.sa) {
          continue;
        }

        ShapAni.syncSpeed(o.sa);
        o.children[0].rotation += o.sa.v;

        if (o.children[0].rotation >= Math.PI * 2) {
          o.children[0].rotation -= Math.PI * 2;
        }
      }
    }
    /**
     * @description 同步速度
     * @param sa 
     */

  }, {
    key: "syncSpeed",
    value: function syncSpeed(sa) {
      var d, ds;

      if (sa.vt == sa.v) {
        if (Date.now() >= sa.time) {
          sa.time = Formula.randomTime(ShapAni.during);
          sa.vt = Formula.shapAniRandomV(ShapAni.vs);
        }

        return;
      }

      d = sa.vt - sa.v;
      ds = Math.abs(d);

      if (ds > ShapAni.vs) {
        sa.v += ShapAni.vs * (d / ds);
      } else {
        sa.v = sa.vt;
      }
    }
  }]);

  return ShapAni;
}();
/**
 * @description 通讯连接断开
 */


ShapAni.during = 3000;
ShapAni.vs = Math.PI / 200;

var connectClose = function connectClose() {
  Stage.pause = 1;
  Stage.clear();

  if (stageNode) {
    _scene.default.remove(stageNode);

    stageNode = null;
  }

  if (magnet) {
    magnet.clear();
    magnet = null;
  }

  if (startNode) {
    _scene.default.remove(startNode);

    startNode = null;
  }
};
/****************** 立即执行 ******************/
//初始化关卡数据库表


_db.default.init("stage", {
  level: 1,
  fightCount: 0,
  lastFightTime: 0
}); //注册组件


_widget.default.registW("app-ui-stage", WStage);

_widget.default.registW("app-ui-shap", WShap);

_widget.default.registW("app-ui-player", WPlayer);

_widget.default.registW("app-ui-start", WStart); //注册循环
// Frame.add(()=>{
// },50);


_frame.default.add(function () {
  if (!stageNode) {
    return;
  }

  if (!Stage.pause) {
    insertShap();
    insertBoom();
    Show.distribute(Stage.loop());
    magnet.update();
  }

  resetPV();
  ShapAni.run();
}); //注册页面打开事件


_appEmitter.AppEmitter.add("intoMain", function (node) {
  open();
  insertSelf();
});

_appEmitter.AppEmitter.add("gameStart", function (node) {
  _startGame();
});

_connect.default.notify.add("close", connectClose);
})