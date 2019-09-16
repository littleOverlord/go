define("libs/ni/scene",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var PIXI = _interopRequireWildcard(require("libs/pixijs/pixi"));

var _loader = _interopRequireDefault(require("libs/ni/loader"));

var _frame = _interopRequireDefault(require("libs/ni/frame"));

var _animate = _interopRequireDefault(require("libs/ni/animate"));

var _events = require("libs/ni/events");

var _dragonbones = _interopRequireDefault(require("libs/ni/dragonbones"));

var _widget = _interopRequireDefault(require("libs/ni/widget"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导出 ******************/
var Scene =
/*#__PURE__*/
function () {
  function Scene() {
    _classCallCheck(this, Scene);
  }

  _createClass(Scene, null, [{
    key: "Application",
    // render
    //屏幕尺寸
    // root node
    // fps node
    // object cache
    //SpriteSheets
    // rectTextures

    /**
     * @description create scene
     */
    value: function Application(option, cfg) {
      initCanvas(option, cfg); // option.sharedTicker = false;
      // option.sharedLoader	= false;

      app = new _Application(option); //映射pixi坐标

      app.renderer.plugins.interaction.mapPositionToPoint = function (point, x, y) {
        point.x = x * cfg.screen.scale - cfg.screen.left;
        point.y = y * cfg.screen.scale - cfg.screen.top;
      }; //创建根节点


      this.root = new Container();
      this.root.width = cfg.screen.width;
      this.root.height = cfg.screen.height;
      this.root.ni = {
        z: 0
      }; // this.root.position.set(cfg.screen.left,cfg.screen.top);

      _events.Events.bindGlobal(this.root);

      app.stage.addChild(this.root);
      this.root.calculateBounds(); //FPS

      this.FPS.node = new Text("FPS 0", {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xff1010,
        strokeThickness: 2
      });
      this.FPS.node.position.set(15, 115);
      this.FPS.node.ni = {
        z: 1
      };
      app.stage.addChild(this.FPS.node);
      this.screen = cfg.screen; //添加主循环

      _frame.default.add(function () {
        Scene.FPS.loop();
        app.render();

        _events.Events.loop();

        _dragonbones.default.update();
      });

      console.log(PIXI.spine);
      return app;
    }
    /**
     * @description 打开组件,w 与 logic配合使用，用来分离显示逻辑和业务逻辑
     * @param option 渲染数据，同create
     * @param w 组件，主要响应组件逻辑事件
     * @param parent 父显示对象
     * @param logic 应用层对象，主要用来响应业务逻辑事件
     */

  }, {
    key: "open",
    value: function open(name, parent, logic, props) {
      var w = _widget.default.factory(name, name, props),
          o = Scene.create(null, w, parent, logic);

      w.added(o);
      return o;
    }
    /**
     * 
     * @param {object} option {type:"sprite || container || particleContainer",data:{}}
     * @return {} 创建渲染对象
     * @example {
    	* 	type:"sprite || container || particleContainer || text || animatedSprite || widget name" ,
    	*	script: "app-ui-name", // wiget 类
    	*	prop: {}, // widget 专用
    	* 	data:{
    	* 		id:"",
    	* 		url: "images/xx.png",
    	* 		width: 10,
    	* 		height: 10,
    	* 		x: 0,
    	* 		y: 0,
    	* 		z: 0
    	* 	},
    	* 	children: [
    	* 		{type:"",data:{},children:[]},
    	* 		{}
    	* 	]
    	* } 
    	*/

  }, {
    key: "create",
    value: function create(option, w, parent, logic) {
      var o, i, leng;
      option = option || w.cfg;
      w = w || parent.widget;
      parent = parent || app.stage;

      if (!creater[option.type]) {
        w = _widget.default.factory(option.type, option.script || option.type, option.props);
        o = Scene.create(null, w, parent, logic);
        w.added(o);
      } else {
        o = creater[option.type](option.data, parent);
        o.widget = w;
        o.logic = logic;
        parent.addChild(o);
        Scene.addCache(o);

        _events.Events.bindEvent(o, option);

        o.ni.resize();
        o.on("removed", function (pr) {
          if (this.ni.animate) {
            this.stop();
          }

          if (this.ni.id) {
            // console.log(`Delete the node which id is ${this.ni.id} from cache!!`);
            o.widget.elements.delete(o.ni.id);
          }

          if (this.ni.type === "dragonbones") {
            _dragonbones.default.remove(this.ni);
          }
        });

        if (option.children && option.children.length) {
          for (i = 0, leng = option.children.length; i < leng; i++) {
            Scene.create(option.children[i], w, o, logic);
          }
        }

        parent.children.sort(function (a, b) {
          return a.ni.z - b.ni.z;
        });
      }

      return o;
    }
    /**
     * 
     * @param {*} obj 
     */

  }, {
    key: "addCache",
    value: function addCache(o) {
      if (o.ni.id) {
        o.widget.elements.set(o.ni.id, o);
      }
    }
    /**
     * @description 移除渲染对象
     * @param obj 渲染对象
     */

  }, {
    key: "remove",
    value: function remove(obj) {
      var isTop;

      if (obj.parent) {
        isTop = obj.widget != obj.parent.widget;
        obj.parent.removeChild(obj);

        if (isTop) {
          obj.widget.destory();
        }
      } else {
        throw "removeChild fail";
      }
    }
    /**
     * @description 在某个节点上绑定事件
     */

  }, {
    key: "bindEvent",
    value: function bindEvent(param, type, func) {
      var o = typeof param == "string" ? this.cache[param] : param;

      if (!o) {
        return console.error("The node is not find by ".concat(param));
      }

      o.interactive = true;
      o.on(type, func);
    }
    /**
     * @description 更新texture
     */

  }, {
    key: "modifyTexture",
    value: function modifyTexture(param, name) {
      if (typeof param == "string") {
        param = Scene.cache[param];
      }

      if (!param) {
        return console.error("Don't find the node!");
      }

      param.texture = Scene.getTextureFromSpritesheet(name);
    }
    /**
     * @description 更新lookat
     * @param {Sprite} s
     * @param {object} lookAt {x,y}
     */

  }, {
    key: "modifyLookAt",
    value: function modifyLookAt(s, lookAt) {
      var dif = lookAt.x - s.x,
          m2 = dif / Math.abs(dif);
      s.scale.x = Math.abs(s.scale.x) * m2;
    }
    /**
     * @description 根据spritesheet json 创建 PIXI.Spritesheet
     * @param data spritesheet json
     */

  }, {
    key: "createSpriteSheets",
    value: function createSpriteSheets(data) {
      for (var k in data) {
        var texture = _loader.default.resources[k.replace(".json", ".png")].texture.baseTexture;

        Scene.spriteSheets[k] = new Spritesheet(texture, JSON.parse(data[k]));
        Scene.spriteSheets[k].parse(function (sps) {
          console.log(sps);
        });
        delete data[k];
      }

      console.log(Scene.spriteSheets);
      console.log(PIXI.loader);
    }
    /**
     * @description 根据图片路径获取spriteSheets
     * @param path like "app/images/arms/1222.png"
     */

  }, {
    key: "getTextureFromSpritesheet",
    value: function getTextureFromSpritesheet(path) {
      var m = path.match(/(\/[^\/\.]+)\.(png|jpg)/),
          name,
          t;

      if (!m) {
        return console.log("The path \"".concat(path, "\" isn't irregular."));
      }

      name = path.replace(m[0], ".json");

      if (!Scene.spriteSheets[name]) {
        return console.log("don't has the spriteSheet of ".concat(name));
      }

      t = Scene.spriteSheets[name].textures[m[0].replace(/\//, "")];
      return t;
    }
    /**
     * @description 获取对象全局位置
     * @returns PIXI.Rectangle
     */

  }, {
    key: "getGlobal",
    value: function getGlobal(o) {
      var r = new Rectangle(),
          g = o.toGlobal(new Point(0, 0), null, true);
      r.width = o.width;
      r.height = o.height;
      r.x = g.x;
      r.y = g.y;
      return r;
    }
    /**
     * @description 缓存rect texture
     * @param name 
     * @param texture 
     */

  }, {
    key: "setRectTexture",
    value: function setRectTexture(name, texture) {
      if (Scene.rectTextures[name]) {
        return console.log("Has ".concat(name, " rect texture"));
      }

      Scene.rectTextures[name] = texture;
    }
    /**
     * @description 获取rect texture
     * @param name 
     */

  }, {
    key: "getRectTexture",
    value: function getRectTexture(name) {
      return Scene.rectTextures[name];
    }
  }]);

  return Scene;
}();
/****************** 本地 ******************/


exports.default = Scene;

Scene.app = function () {
  return app;
};

Scene.screen = void 0;
Scene.root = void 0;

Scene.FPS = function () {
  var m = {},
      c = 0,
      t = Date.now();

  m.loop = function () {
    c += 1;

    if (Date.now() - t >= 1000) {
      if (m.node) {
        m.node.text = "FPS ".concat(c);
      }

      c = 0;
      t = Date.now();
    }
  };

  m.node = null;
  return m;
}();

Scene.cache = {};
Scene.spriteSheets = {};
Scene.rectTextures = {};
var _Application = PIXI.Application,
    Container = PIXI.Container,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    Text = PIXI.Text,
    Spritesheet = PIXI.Spritesheet,
    AnimatedSprite = PIXI.extras.AnimatedSprite,
    Point = PIXI.Point,
    Graphics = PIXI.Graphics,
    //当前渲染实例 new PIXI.Application()
app;

var Ni =
/*#__PURE__*/
function () {
  //resize的定时器,连续改变，将会只更新一次
  //显示对象

  /**
   * @description 帧动画动作列表
   */

  /**
   * @description 画状态表
   */
  function Ni(show, cfg, type, parent) {
    _classCallCheck(this, Ni);

    this.rsTimer = void 0;
    this._width = void 0;
    this._height = void 0;
    this._left = void 0;
    this._top = void 0;
    this._bottom = void 0;
    this._right = void 0;
    this.z = 0;
    this.id = "";
    this.show = void 0;
    this.actions = {};
    this.animate = {
      "ani": "",
      "times": 0,
      "speed": 1 // times 0: 无限循环播放, [1~N]: 循环播放 N 次

      /**
       * @description 创建应用层管理对象
       * @param show 显示对象
       * @param cfg 显示配置
       */

    };
    var isAni = false;

    if (cfg.z != undefined) {
      this.z = cfg.z;
    }

    if (cfg.id) {
      this.id = cfg.id;
    }

    this._width = cfg.width;
    this._height = cfg.height;
    this._left = cfg.left;
    this._top = cfg.top;
    this._bottom = cfg.bottom;
    this._right = cfg.right;

    for (var k in this.animate) {
      if (cfg[k] != undefined) {
        this.animate[k] = cfg[k];
        isAni = true;
      }
    }

    if (!isAni) {
      this.animate = null;
    }

    if (cfg.anicallback) {
      this.anicallback = cfg.anicallback;
    }

    this.show = show;
    this.resize(parent);
  }
  /**
   * @description 延迟resize执行
   */


  _createClass(Ni, [{
    key: "delayRS",
    value: function delayRS() {
      var _this2 = this;

      var _this = this;

      if (this.rsTimer) {
        return;
      }

      this.rsTimer = setTimeout(function () {
        _this.resize();

        _this2.rsTimer = null;
      }, 0);
    }
    /**
     * 
     * @param status 
     * @param ani 
     */

  }, {
    key: "setBound",
    value: function setBound(key, val) {
      if (this[key] == val) {
        return;
      }

      this[key] = val;
      this.delayRS();
    }
    /**
     * @description 动画回调
     */

  }, {
    key: "anicallback",
    value: function anicallback(status, ani) {}
    /**
     * @description 播放骨骼动画
     */

  }, {
    key: "play",
    value: function play() {
      var ani = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.animate.ani;
      var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.animate.times;

      if (this.type !== "dragonbones") {
        return;
      }

      this.animate.ani = ani;
      this.animate.times = times;

      _dragonbones.default.play(this);
    }
    /**
     * @description 暂停骨骼动画
     */

  }, {
    key: "stop",
    value: function stop() {
      var ani = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.animate.ani;

      if (this.type !== "dragonbones") {
        return;
      }

      _dragonbones.default.stop(ani, this);
    }
    /**
     * @description 重新计算位置大小
     */

  }, {
    key: "resize",
    value: function resize(parent) {
      var bound = Ni.caclBound(this, parent);
      bound.w !== undefined && (this.show.width = bound.w);
      bound.h !== undefined && (this.show.height = bound.h);
      this.show.position.set(bound.x, bound.y);
    }
  }, {
    key: "top",
    get: function get() {
      return this._top;
    },
    set: function set(val) {
      this.setBound("_top", val);
    }
  }, {
    key: "left",
    get: function get() {
      return this._left;
    },
    set: function set(val) {
      this.setBound("_left", val);
    }
  }, {
    key: "right",
    get: function get() {
      return this._right;
    },
    set: function set(val) {
      this.setBound("_right", val);
    }
  }, {
    key: "bottom",
    get: function get() {
      return this._bottom;
    },
    set: function set(val) {
      this.setBound("_bottom", val);
    }
  }, {
    key: "width",
    get: function get() {
      return this._width;
    },
    set: function set(val) {
      this.setBound("_width", val);
    }
  }, {
    key: "height",
    get: function get() {
      return this._height;
    },
    set: function set(val) {
      this.setBound("_height", val);
    }
  }], [{
    key: "caclBound",
    value: function caclBound(o, parent) {
      var x,
          y,
          w,
          h,
          l,
          r,
          t,
          b,
          parseNumber = function parseNumber(s, b) {
        if (typeof s === "string") {
          s = s.replace("%", "");
          s = Number(s);

          if (b) {
            s = b * (s / 100);
          }
        }

        return s;
      };

      parent = parent || o.show.parent;
      w = parseNumber(o._width, parent._width);
      h = parseNumber(o._height, parent._height);
      l = parseNumber(o._left, parent._width);
      r = parseNumber(o._right, parent._width);
      t = parseNumber(o._top, parent._height);
      b = parseNumber(o._bottom, parent._height);

      if (l !== undefined) {
        x = l;
      }

      if (r !== undefined) {
        if (x !== undefined) {
          w = parent._width - x - r;
        } else {
          x = parent._width - o.show.width - r;
        }
      }

      if (t !== undefined) {
        y = t;
      }

      if (b !== undefined) {
        if (y !== undefined) {
          h = parent._height - y - b;
        } else {
          y = parent._height - o.show._height - b;
        }
      }

      w = w !== undefined ? w : o._width;
      h = h !== undefined ? h : o._height;
      return {
        x: x || 0,
        y: y || 0,
        w: w,
        h: h
      }; // w !== undefined && (this.show.width = w);
      // h !== undefined && (this.show.height = h);
      // this.show.position.set(x || 0, y || 0);
    }
  }]);

  return Ni;
}();
/**
 * @description 渲染对象创建器
 */


var creater = {
  /**
   * @description 初始化默认属性
   */
  init: function init(type, o, data, parent) {
    o.ni = new Ni(o, data, type, parent);

    if (typeof data.alpha == "number") {
      o.alpha = data.alpha;
    }

    if (data.anchor != undefined) {
      o.anchor.x = data.anchor[0];
      o.anchor.y = data.anchor[1];
    }

    data.rotation != undefined && (o.rotation = data.rotation);
  },

  /**
   * @description 创建 PIXI.Container
   */
  container: function container(data, parent) {
    var o = new Container();
    creater.init("container", o, data, parent);
    return o;
  },

  /**
   * @description
   * @param data {
   * 	width:0
   * 	height:0
   * 	x:0
   * 	y:0
   * 	border-color:0xFF3300
   * 	border-width:0
   * 	border-alpha:1
   * 	border-align:0.5
   * 	background-color:0x66CCFF
   * 	background-alpha:1
   * }
   */
  rect: function rect(data, parent) {
    var rectangle,
        rectTexture = Scene.getRectTexture(data.name),
        o;

    if (!rectTexture) {
      rectangle = new Graphics();
      creater.init("rect", rectangle, data, parent);
      rectangle.lineStyle(data["border-width"] || 0, data["border-color"] || 0, data["border-alpha"] || 1, data["border-align"] || 0.5);
      rectangle.beginFill(data["background-color"] || 0, data["background-alpha"] || (data["background-color"] ? 1 : 0.0001));
      rectangle.drawRect(0, 0, rectangle._width, rectangle._height);
      rectangle.endFill();
      rectTexture = rectangle.generateCanvasTexture();

      if (data.name) {
        Scene.setRectTexture(data.name, rectTexture);
      }
    }

    o = new Sprite(rectTexture);
    creater.init("rect", o, data, parent);
    return o;
  },

  /**
   * @description 创建 PIXI.Sprite
   * @param data {
   * 		url: ""    //通过Spritesheet加载纹理
   * 		netUrl: "" //通过网络直接加载纹理
   * }
   */
  sprite: function sprite(data, parent) {
    var t = data.url ? Scene.getTextureFromSpritesheet(data.url) : null,
        o;

    if (!t && !data.netUrl) {
      return console.error("Can't create the sprite by \"".concat(data.url, "\""));
    } else if (data.netUrl) {
      o = new Sprite.from(data.netUrl);
    } else if (t) {
      o = new Sprite(t); //根据中心点调整sprite位置

      if (t.defaultAnchor.x || t.defaultAnchor.y) {
        o.position.set((data.x || 0) - data.width * t.defaultAnchor.x, (data.y || 0) - data.height * t.defaultAnchor.y);
      }
    }

    creater.init("sprite", o, data, parent);
    return o;
  },

  /**
   * @param data {
   * 	text: "",
   * 	style: {
  	* 	fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center',
  	* 	wordWrapWidth:100, 换行宽度
  	* 	wordWrap:true 是否换行
   * 	}
   * }
   * PIXI.TextStyle http://pixijs.download/release/docs/PIXI.TextStyle.html
   */
  text: function text(data, parent) {
    var o = new Text(data.text, data.style);
    creater.init("text", o, data, parent);
    return o;
  },

  /**
   * @description 创建帧动画
   * @param data {
   * 		...,
   * 		ani: "",
   * 		once: false,
   * 		speed: 1, 越高越快，越低越慢,
   * 		actions: {"standby":[0,5],...}//每个动作配置帧数区间，左右都是闭区间
   * 		anicallback: function(e){} //e string "complete" 
   * 	}
   */
  animatedSprite: function animatedSprite(data, parent) {
    if (!Scene.spriteSheets[data.url]) {
      return console.error("Can't find the spriteSheet by \"".concat(data.url, "\"."));
    }

    var m = data.url.match(/\/([^\/\.]+)\./),
        o = new AnimatedSprite(Scene.spriteSheets[data.url].animations[m[1]]);
    creater.init("animatedSprite", o, data, parent);
    o.animationSpeed = data.speed;
    o.ni.actions = Scene.spriteSheets[data.url].data.actions || {};

    if ((!o.ni.actions || o.ni.actions.length == 0) && data.once) {
      o.loop = !data.once;
    } // Scene.animations.push(o);
    //绑定动画回调


    o.onComplete = function (obj) {
      return function () {
        _animate.default.onComplete(obj);
      };
    }(o);

    o.onFrameChange = function (obj) {
      return function () {
        _animate.default.onFrameChange(obj);
      };
    }(o);

    o.onLoop = function (obj) {
      return function () {
        _animate.default.onLoop(obj);
      };
    }(o); //默认立即播放


    o.play();
    return o;
  },

  /**
   * @description 创建dragonbones
   */
  dragonbones: function dragonbones(data, parent) {
    var o = _dragonbones.default.create(data);

    if (!o) {
      return console.error("Can't find the dragonbones data by \"".concat(data.url, "\"."));
    }

    creater.init("dragonbones", o, data, parent);
    o.ni.play();
    return o;
  }
  /**
   * @description 初始化canvas
   * @param option 
   */

};

var initCanvas = function initCanvas(option, cfg) {
  if (option.view) {
    return;
  }

  var timer,
      cacl = function cacl() {
    var maxTime = 1.5,
        curr;

    if (cfg.screen.width / cfg.screen._width > maxTime) {
      curr = maxTime * cfg.screen._width;
      cfg.screen.left = (cfg.screen.width - curr) / 2;
      cfg.screen.width = option.width = curr;
    }

    if (cfg.screen.height / cfg.screen._height > maxTime) {
      curr = maxTime * cfg.screen._height;
      cfg.screen.top = (cfg.screen.height - curr) / 2;
      cfg.screen.height = option.height = curr;
    }

    option.view.setAttribute("style", "position:absolute;left:50%;top:50%;margin-left:-".concat(cfg.screen.width / 2, "px;margin-top:-").concat(cfg.screen.height / 2, "px;-webkit-transform:scale(").concat(1 / cfg.screen.scale, ",").concat(1 / cfg.screen.scale, ");-moz-transform:scale(").concat(1 / cfg.screen.scale, ",").concat(1 / cfg.screen.scale, ");-ms-transform:scale(").concat(1 / cfg.screen.scale, ",").concat(1 / cfg.screen.scale, ");transform:scale(").concat(1 / cfg.screen.scale, ",").concat(1 / cfg.screen.scale, ");"));
  };

  option.view = document.createElement("canvas");
  cacl();
  document.body.appendChild(option.view);

  window.onresize = function () {
    if (timer) {
      return;
    }

    timer = setTimeout(function () {
      timer = null;
      var windowWidth = document.documentElement.clientWidth || document.body.clientWidth,
          windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      var w,
          h,
          sw = cfg.screen._width / windowWidth,
          sh = cfg.screen._height / windowHeight,
          s = Math.max(sw, sh);
      w = windowWidth * s;
      h = windowHeight * s;
      cfg.screen.width = w;
      cfg.screen.height = h;
      cfg.screen.scale = s;
      cacl();
      app.renderer.resize(cfg.screen.width, cfg.screen.height);
      Scene.root.width = cfg.screen.width;
      Scene.root.height = cfg.screen.height;
      Scene.root.position.set(0, 0);
      resizeNode(Scene.root);
    }, 100);
  };
};
/**
 * @description resize all render
 * @param node render node
 */


var resizeNode = function resizeNode(node) {
  var children = node.children;

  for (var i = 0, len = children.length; i < len; i++) {
    if (children[i].ni) {
      children[i].ni.resize();
    }

    if (children[i].children) {
      resizeNode(children[i]);
    }
  }
};
/****************** 立即执行 ******************/
//绑定资源监听


_loader.default.addResListener("createSpriteSheets", Scene.createSpriteSheets);
})