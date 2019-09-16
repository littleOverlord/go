define("libs/ni/loader",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var PIXI = _interopRequireWildcard(require("libs/pixijs/pixi"));

var _util = _interopRequireDefault(require("libs/ni/util"));

var _fs = _interopRequireDefault(require("libs/ni/fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导出 ******************/
var Loader =
/*#__PURE__*/
function () {
  function Loader() {
    _classCallCheck(this, Loader);
  }

  _createClass(Loader, null, [{
    key: "add",

    /**
     * @description 下载状态
     */

    /**
     * @description 等待下载的任务，先进先下
     */

    /**
     * @description 图片资源缓存
     */

    /**
     * @description 资源下载监听
     */

    /**
     * @description 下载进度回调,由外部重载
     */

    /**
     * @description 添加下载任务
     * @param arr ["url","images/xxx.png",....]
     * @param successCallback 下载完成的回调
     */
    value: function add(arr, successCallback, process) {
      if (Loader.status === Loader.LOADSTATUS.loading) {
        return Loader.wait.push(new Waiter(arr, successCallback, process));
      }

      new Waiter(arr, successCallback, process).start();
    }
    /**
     * @description 下载下一批资源
     */

  }, {
    key: "next",
    value: function next() {
      var next = Loader.wait.shift();

      if (Loader.status === Loader.LOADSTATUS.free && next) {
        next.start();
      }
    }
    /**
     * @description 更新图片资源
     * @param res 
     */

  }, {
    key: "addResource",
    value: function addResource(k, res) {
      Loader.resources[k] = res;
    }
    /**
     * @description 设置资源监听
     * @param name 函数名字
     * @param func 函数
     */

  }, {
    key: "addResListener",
    value: function addResListener(name, func) {
      Loader.resListener[name] = func;
    }
    /**
     * @description 分发资源到各个模块，暂时只有json
     */

  }, {
    key: "distributeResource",
    value: function distributeResource(res) {
      Loader.resListener.registWC(res);
      Loader.resListener.registCfg(res); // Loader.resListener.addSpineData(res);

      Loader.resListener.addDragonData(res);
      Loader.resListener.registMusic(res);
      Loader.resListener.createSpriteSheets(res);
    }
  }]);

  return Loader;
}();
/****************** 本地 ******************/


exports.default = Loader;
Loader.LOADSTATUS = {
  free: 0,
  // 空闲
  loading: 1 // 加载中

};
Loader.status = Loader.LOADSTATUS.free;
Loader.wait = [];
Loader.resources = {};
Loader.resListener = {};

Loader.process = function (r) {
  console.log("load progress\uFF1A".concat(r));
};

var loader = PIXI.loader;
var fs = window.wx ? window.wx.getFileSystemManager() : function () {}; //图片资源后缀

var Image; //资源下载类，每批资源都通过该类封装下载

(function (Image) {
  Image[Image[".png"] = 1] = ".png";
  Image[Image[".jpg"] = 2] = ".jpg";
})(Image || (Image = {}));

var Waiter =
/*#__PURE__*/
function () {
  function Waiter(arr, callback, process) {
    _classCallCheck(this, Waiter);

    this.text = [];
    this.images = [];
    this.callback = null;
    this.total = 0;
    this.loaded = 0;
    this.resource = {};
    this.list = [];
    this._process = void 0;
    this.list = arr;
    this.callback = callback;
    this._process = process;
  }
  /**
   * @description 找出
   * @param res 
   */


  _createClass(Waiter, [{
    key: "findImg",
    value: function findImg(res) {
      var suffix;

      for (var k in res) {
        suffix = _util.default.fileSuffix(k);

        if (Image[suffix]) {
          this.images.push(k);
        } else {
          this.text.push(k);
        }
      }
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;

      Loader.status = Loader.LOADSTATUS.loading;
      this.resource = _fs.default.read(this.list, function () {
        _this.downloaded();
      }, function (r) {
        _this.process();
      });
      this.findImg(this.resource);
      this.total = this.images.length * 2 + this.text.length;
    }
  }, {
    key: "process",
    value: function process() {
      this.loaded += 1;

      if (this._process) {
        this._process(this.loaded / this.total);
      } else {
        Loader.process(this.loaded / this.total);
      }
    }
  }, {
    key: "downloaded",
    value: function downloaded() {
      for (var i = 0, len = this.images.length; i < len; i++) {
        // loader.add(this.images[i],Fs.fs.createImg(this.images[i],this.resource[this.images[i]]));
        Loader.addResource(this.images[i], {
          name: this.images[i],
          texture: PIXI.Texture.fromImage(_fs.default.fs.createImg(this.images[i], this.resource[this.images[i]]))
        });
        delete this.resource[this.images[i]];
        this.process();
      } // loader.on("progress", ()=>{
      // 	_this.process();
      // })
      // .load((ld,res)=>{
      // 	console.log(res);
      // 	Loader.addResource(res);


      this.complete(); // });
    }
  }, {
    key: "complete",
    value: function complete() {
      if (this.loaded === this.total) {
        Loader.status = Loader.LOADSTATUS.free;
        loader.reset();
        Loader.distributeResource(this.resource);
        this.callback && this.callback();
        Loader.next();
      }
    }
  }]);

  return Waiter;
}();
})