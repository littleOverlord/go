define("libs/ni/fs",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _http = _interopRequireDefault(require("libs/ni/http"));

var _util = _interopRequireDefault(require("libs/ni/util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导出 ******************/
var Fs =
/*#__PURE__*/
function () {
  function Fs() {
    _classCallCheck(this, Fs);
  }

  _createClass(Fs, null, [{
    key: "init",

    /**
     * @description 文件处理具体模块，根据不同平台匹配
     */

    /**
     * @description depend处理对象
     */

    /**
     * @description 文件处理列表
     * @elements {method:"read"||"write",path:"",callback: Function}
     */

    /**
     * @description 缓存depend文件写入定时器
     */

    /**
     * @description 后缀名对应的Blob类型
     */

    /**
     * @description 初始化,根据cfg匹配不同平台处理文件对象
     */
    value: function init(cfg, callback) {
      Fs.appName = cfg.name;
      Fs.remote = cfg.appPath || cfg.remote + "/" + cfg.name;
      Fs.from = cfg.platForm;

      if (cfg.platForm == "wx") {
        Fs.fs = new WXFS(cfg, function () {
          Fs.mkDirs();
          callback();
        });
      } else if (cfg.platForm == "pc") {
        Fs.fs = new PC(cfg.debug);
        callback && callback();
      } else if (cfg.platForm == "browser" || cfg.platForm == "app") {
        Fs.fs = new Browser(cfg, callback);
      }
    }
    /**
     * @description 读文件,如果本地没有则去远端下载
     */

  }, {
    key: "read",
    value: function read(paths, callback, process) {
      var arr = Fs.depend.getFiles(paths, Fs.fs.except),
          fileMap = {},
          loaded = function () {
        var c = 0,
            total = arr.length;
        return function () {
          c += 1;
          process && process(c / total);

          if (c == total) {
            callback(fileMap);
          }
        };
      }(),
          deal = function deal(p, isLocal) {
        return function (err, data) {
          if (err) {
            return console.log(err);
          }

          fileMap[p] = data;

          if (_util.default.fileSuffix(p) == ".png") {
            console.log(_typeof(data));
          }

          if (!isLocal) {
            Fs.fs.write(p, data, function (_err, rp) {
              if (_err) {
                return console.log(_err);
              }

              loaded();
            });
          } else {
            loaded();
          }
        };
      };

      for (var i = 0, len = arr.length; i < len; i++) {
        fileMap[arr[i]] = 0;

        if (Fs.fs.isLocal(arr[i], this.depend.all[arr[i]].sign)) {
          Fs.fs.read(arr[i], deal(arr[i], true));
        } else {
          if (Fs.fs.get && this.BlobType[_util.default.fileSuffix(arr[i])]) {
            Fs.fs.get(arr[i], Fs.remote, deal(arr[i], true));
          } else {
            _http.default.get("".concat(Fs.remote, "/").concat(arr[i]), "", this.BlobType[_util.default.fileSuffix(arr[i])] ? "BIN" : "", deal(arr[i], false));
          }
        }
      }

      return fileMap;
    }
    /**
     * @description 执行等待列表
     */

  }, {
    key: "runWait",
    value: function runWait() {
      if (Fs.waits.length === 0) {
        return;
      }
    }
    /**
     * @description 解析项目全资源表
     */

  }, {
    key: "parseDepend",
    value: function parseDepend(data) {
      Fs.depend = new Depend(data);
      console.log(Fs.depend);
    }
    /**
     * @description 写缓存depend文件，方便查找是否已经存储到本地缓存
     */

  }, {
    key: "writeCacheDpend",
    value: function writeCacheDpend() {
      if (Fs.writeCacheDependTimer) {
        clearTimeout(Fs.writeCacheDependTimer);
      }

      Fs.writeCacheDependTimer = setTimeout(function () {
        Fs.fs.writeDepend(function () {});
        Fs.writeCacheDependTimer = null;
      }, 10000);
    }
    /**
     * @
     */

  }, {
    key: "mkDirs",
    value: function mkDirs() {
      if (Fs.fs && Fs.fs.mkDir) {
        for (var k in Fs.depend.dir) {
          Fs.fs.mkDir(k);
        }
      }
    }
  }]);

  return Fs;
}();
/****************** 本地 ******************/

/**
 * @description 微信文件处理类
 */


exports.default = Fs;
Fs.remote = "";
Fs.appName = "";
Fs.from = "";
Fs.fs = void 0;
Fs.depend = void 0;
Fs.waits = [];
Fs.writeCacheDependTimer = void 0;
Fs.BlobType = {
  ".png": 'image/png',
  ".jpg": 'image/jpeg',
  ".jpeg": 'image/jpeg',
  ".webp": 'image/webp',
  ".gif": 'image/gif',
  ".svg": 'image/svg+xml',
  ".ttf": 'application/x-font-ttf',
  ".otf": 'application/x-font-opentype',
  ".woff": 'application/x-font-woff',
  ".woff2": 'application/x-font-woff2',
  ".mp3": 'audio/mpeg3'
};

var WXFS =
/*#__PURE__*/
function () {
  function WXFS(cfg, callback) {
    var _this2 = this;

    _classCallCheck(this, WXFS);

    this.fs = void 0;
    this.userDir = void 0;
    this.depend = void 0;
    this.waitDir = {};
    this.except = [".js"];
    this.isReady = false;
    this.fs = wx.getFileSystemManager();
    this.userDir = wx.env.USER_DATA_PATH;
    this.read("_.depend", function (err, data) {
      _this2.depend = err ? {} : JSON.parse(data);
      callback && callback();
    });
  }

  _createClass(WXFS, [{
    key: "isLocal",
    value: function isLocal(path, sign) {
      return this.depend[path] == sign;
    }
  }, {
    key: "read",
    value: function read(path, callback) {
      this.fs.readFile({
        filePath: "".concat(this.userDir, "/").concat(path),
        encoding: Fs.BlobType[_util.default.fileSuffix(path)] ? "binary" : "utf8",
        success: function success(data) {
          callback(null, data.data);
        },
        fail: function fail(error) {
          callback(error, null);
        }
      });
    }
  }, {
    key: "write",
    value: function write(path, data, callback, notWriteDepend) {
      var _this3 = this;

      var dir = _util.default.fileDir(path);

      this.mkDir(dir);
      this.fs.writeFile({
        filePath: "".concat(this.userDir, "/").concat(path),
        data: data,
        encoding: typeof data == "string" ? "utf8" : "binary",
        success: function success() {
          callback(null, "".concat(_this3.userDir, "/").concat(path));
          console.log(path);

          if (!notWriteDepend) {
            _this3.depend[path] = Fs.depend.all[path].sign;
            Fs.writeCacheDpend();
          }
        },
        fail: function fail(error) {
          callback(error, null);
        }
      });
    }
  }, {
    key: "get",
    value: function get(path, remote, callback) {
      var _this4 = this;

      var _this = this,
          header = {},
          binary = Fs.BlobType[_util.default.fileSuffix(path)];

      if (binary) {
        header["content-type"] = "application/octet-stream";
      }

      wx.downloadFile({
        url: "".concat(remote, "/").concat(path),
        filePath: "".concat(this.userDir, "/").concat(path),
        header: header,
        success: function success(res) {
          console.log(res);
          _this4.depend[path] = Fs.depend.all[path].sign;

          if (binary) {
            callback(null, res);
          } else {
            Fs.writeCacheDpend();

            _this.read(path, function (err, data) {
              callback(err, data);
            });
          }
        },
        fail: function fail(error) {
          callback(error, null);
        }
      });
    }
  }, {
    key: "mkDir",
    value: function mkDir(dir) {
      dir = dir.replace(/\/$/, "");

      if (!dir) {
        return;
      }

      try {
        this.fs.statSync("".concat(this.userDir, "/").concat(dir));
      } catch (e) {
        try {
          this.fs.mkdirSync("".concat(this.userDir, "/").concat(dir), true);
        } catch (err) {
          console.log(e, err);
        }
      }
    }
  }, {
    key: "createImg",
    value: function createImg(path, data) {
      return "".concat(this.userDir, "/").concat(path);
    }
    /**
     * @description 写入缓存depend
     * @param callback 
     */

  }, {
    key: "writeDepend",
    value: function writeDepend(callback) {
      this.write("_.depend", JSON.stringify(this.depend), function (err) {
        callback(err);
      }, true);
    }
  }]);

  return WXFS;
}();
/**
 * @description pc端文件处理类
 */


var PC =
/*#__PURE__*/
function () {
  function PC(debug) {
    _classCallCheck(this, PC);

    this.fs = void 0;
    this.path = void 0;
    this.resPath = "";
    this.except = [];
    this.isReady = true;
    var rp = debug ? "src" : "resources\\app.asar\\src";
    this.fs = require("libs/ni/fs");
    this.path = require("libs/ni/path");
    this.resPath = this.path.join(process.cwd(), rp);
  }

  _createClass(PC, [{
    key: "isLocal",
    value: function isLocal(path) {
      return true;
    }
  }, {
    key: "read",
    value: function read(path, callback) {
      console.log(path);
      this.fs.readFile(this.path.join(this.resPath, path), {
        encoding: "utf8"
      }, callback);
    }
  }, {
    key: "write",
    value: function write(path, data, callback) {
      callback();
    }
  }, {
    key: "delete",
    value: function _delete(path, callback) {}
  }, {
    key: "createImg",
    value: function createImg(path, data) {
      return this.path.join(this.resPath, path);
    }
  }]);

  return PC;
}();
/**
 * @description 浏览器文件处理类
 */


var Browser =
/*#__PURE__*/
function () {
  _createClass(Browser, [{
    key: "init",
    value: function init(callback, errorCallback) {
      var _this = this;

      if (!_this.iDB) {
        _this.db = {};
        return callback && setTimeout(callback, 0);
      }

      try {
        var request = _this.iDB.open(_this.dbName, 1);

        request.onupgradeneeded = function (e) {
          // 创建table
          e.currentTarget.result.createObjectStore(_this.tabName, {
            autoIncrement: false
          });
        };

        request.onsuccess = function (e) {
          _this.db = e.currentTarget.result;
          callback && callback();
        };

        request.onerror = errorCallback;
      } catch (e) {
        _this.iDB = undefined;
        _this.db = {};
        return callback && setTimeout(callback, 0);
      }
    }
  }]);

  function Browser(cfg, callback) {
    _classCallCheck(this, Browser);

    this.iDB = void 0;
    this.dbName = void 0;
    this.tabName = void 0;
    this.depend = void 0;
    this.db = void 0;
    this.except = [];
    this.isReady = false;

    var _this = this;

    _this.dbName = cfg.name;
    _this.tabName = cfg.name;
    _this.iDB = self.indexedDB || self.webkitIndexedDB || self.mozIndexedDB || self.OIndexedDB || self.msIndexedDB;

    _this.init(function () {
      setTimeout(function () {
        _this.read("_.depend", function (err, data) {
          _this.depend = err || !data ? {} : JSON.parse(data);
          callback && callback();
        });
      }, 0);
    }, function (err) {
      console.log(err);
    });
  }

  _createClass(Browser, [{
    key: "isLocal",
    value: function isLocal(path, sign) {
      if (Fs.from == "app") {
        return false;
      } else {
        return this.depend[path] == sign;
      }
    }
    /**
     * @description 读取数据
     * @example
     */

  }, {
    key: "read",
    value: function read(path, callback) {
      if (!this.iDB) {
        return setTimeout(function () {
          callback(this.db[path], path);
        }, 0);
      }

      var request = this.db.transaction(this.tabName, "readonly").objectStore(this.tabName).get(path);

      request.onsuccess = function (e) {
        callback(null, e.target.result);
      };

      request.onerror = function (error) {
        callback(error);
      };
    }
  }, {
    key: "write",

    /**
     * @description 写入数据，如果键名存在则替换
     * @example
     */
    value: function write(path, data, callback, notWriteDepend) {
      var _this5 = this;

      if (!this.iDB) {
        this.db[path] = data;
        return callback && setTimeout(callback, 0);
      }

      var tx = this.db.transaction(this.tabName, "readwrite");
      tx.objectStore(this.tabName).put(data, path);

      tx.oncomplete = function () {
        if (!notWriteDepend) {
          _this5.depend[path] = Fs.depend.all[path].sign;
          Fs.writeCacheDpend();
        }
      };

      tx.onerror = function (error) {// callback(error);
      };

      setTimeout(function () {
        callback(null, path);
      }, 0);
    }
  }, {
    key: "createImg",

    /**
     * @description 创建可用图片url
     * @param path 
     * @param data 
     */
    value: function createImg(path, data) {
      var suf = _util.default.fileSuffix(path);

      var blob = new Blob([data], {
        type: Fs.BlobType[suf]
      });
      return URL.createObjectURL(blob);
    }
    /**
     * @description 删除数据
     * @example
     */

  }, {
    key: "delete",
    value: function _delete(path, callback) {
      if (!this.iDB) {
        delete this.db[path];
        return callback && setTimeout(callback, 0);
      }

      var tx = this.db.transaction(this.tabName, "readwrite");
      tx.objectStore(this.tabName).delete(path);

      tx.oncomplete = function () {
        callback();
      };

      tx.onerror = function (error) {
        callback(error);
      };
    }
  }, {
    key: "writeDepend",

    /**
     * @description 写入缓存depend
     * @param callback 
     */
    value: function writeDepend(callback) {
      this.write("_.depend", JSON.stringify(this.depend), function (err) {
        callback(err);
      }, true);
    }
  }]);

  return Browser;
}();
/**
 * @description 解析depend
 */


var Depend =
/*#__PURE__*/
function () {
  /**
   * @description 全资源列表，同depend文件，唯一去除了路径的"/"开头
   */

  /**
   * @description 文件夹资源列表
   * @element dir: [file,file,...]
   */
  function Depend(data) {
    _classCallCheck(this, Depend);

    this.all = {};
    this.dir = {};
    var p, d;

    for (var k in data) {
      p = k.replace("/", "");
      this.all[p] = data[k];
      data[k].path = p;

      if (data[k].depends) {
        for (var i = 0, len = data[k].depends.length; i < len; i++) {
          data[k].depends[i] = data[k].depends[i].replace("/", "");
        }
      }

      d = p.replace(/[^\/]+$/, "");
      this.adddir(d);

      if (d) {
        this.dir[d].push(p);
      }
    }
  }

  _createClass(Depend, [{
    key: "adddir",
    value: function adddir(d) {
      var ds = d.split("/"),
          curr = "",
          next = "";

      for (var i = 0, len = ds.length; i < len; i++) {
        if (!ds[i]) {
          continue;
        }

        curr += "".concat(ds[i], "/");

        if (!this.dir[curr]) {
          this.dir[curr] = [];
        }

        if (ds[i + 1]) {
          next = curr + "".concat(ds[i + 1], "/");

          if (this.dir[curr].indexOf(next) >= 0) {
            continue;
          }

          this.dir[curr].push(next);
        }
      }
    }
    /**
     * @description 获取文件
     * @param arr 路径或者目录组成的数组
     */

  }, {
    key: "getFiles",
    value: function getFiles(arr, except) {
      var _this6 = this;

      var r = [],
          dir = function dir(_arr) {
        for (var i = 0, len = _arr.length; i < len; i++) {
          if (_this6.dir[_arr[i]]) {
            dir(_this6.dir[_arr[i]]);
          } else if (except.indexOf(_util.default.fileSuffix(_arr[i])) < 0) {
            r.push(_arr[i]);
          }
        }
      };

      dir(arr);
      return r;
    }
    /**
     * @description 寻找模块依赖
     */

  }, {
    key: "findModDepend",
    value: function findModDepend(path, _arr) {
      var _this7 = this;

      var arr = _arr || [],
          file,
          find = function find(src) {
        for (var i = src.length - 1; i >= 0; i--) {
          file = _this7.all[src[i]];

          if (file.depends && file.depends.length) {
            find(file.depends);
          }

          if (arr.indexOf(src[i]) < 0) {
            arr.push(src[i]);
          }
        }
      };

      find([path]);
      return arr;
    }
  }]);

  return Depend;
}();
})