define("libs/pixijs/dragonBones",function(require,exports,module){
"use strict";

var PIXI = _interopRequireWildcard(require("libs/pixijs/pixi"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __extends = void 0 && (void 0).__extends || function () {
  var t = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (t, e) {
    t.__proto__ = e;
  } || function (t, e) {
    for (var a in e) {
      if (e.hasOwnProperty(a)) t[a] = e[a];
    }
  };

  return function (e, a) {
    t(e, a);

    function r() {
      this.constructor = e;
    }

    e.prototype = a === null ? Object.create(a) : (r.prototype = a.prototype, new r());
  };
}();

var dragonBones;

(function (t) {
  var e = function () {
    function e(a) {
      this._clock = new t.WorldClock();
      this._events = [];
      this._objects = [];
      this._eventManager = null;
      this._eventManager = a;
      console.info("DragonBones: " + e.VERSION + "\nWebsite: http://dragonbones.com/\nSource and Demo: https://github.com/DragonBones/");
    }

    e.prototype.advanceTime = function (e) {
      if (this._objects.length > 0) {
        for (var a = 0, r = this._objects; a < r.length; a++) {
          var i = r[a];
          i.returnToPool();
        }

        this._objects.length = 0;
      }

      this._clock.advanceTime(e);

      if (this._events.length > 0) {
        for (var n = 0; n < this._events.length; ++n) {
          var s = this._events[n];
          var o = s.armature;

          if (o._armatureData !== null) {
            o.eventDispatcher.dispatchDBEvent(s.type, s);

            if (s.type === t.EventObject.SOUND_EVENT) {
              this._eventManager.dispatchDBEvent(s.type, s);
            }
          }

          this.bufferObject(s);
        }

        this._events.length = 0;
      }
    };

    e.prototype.bufferEvent = function (t) {
      if (this._events.indexOf(t) < 0) {
        this._events.push(t);
      }
    };

    e.prototype.bufferObject = function (t) {
      if (this._objects.indexOf(t) < 0) {
        this._objects.push(t);
      }
    };

    Object.defineProperty(e.prototype, "clock", {
      get: function get() {
        return this._clock;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(e.prototype, "eventManager", {
      get: function get() {
        return this._eventManager;
      },
      enumerable: true,
      configurable: true
    });
    e.VERSION = "5.7.000";
    e.yDown = true;
    e.debug = false;
    e.debugDraw = false;
    return e;
  }();

  t.DragonBones = e;
})(dragonBones || (dragonBones = {}));

if (!console.warn) {
  console.warn = function () {};
}

if (!console.assert) {
  console.assert = function () {};
}

if (!Date.now) {
  Date.now = function t() {
    return new Date().getTime();
  };
}

var __extends = function __extends(t, e) {
  function a() {
    this.constructor = t;
  }

  for (var r in e) {
    if (e.hasOwnProperty(r)) {
      t[r] = e[r];
    }
  }

  a.prototype = e.prototype, t.prototype = new a();
};

if (typeof global === "undefined" && typeof window !== "undefined") {
  var global = window;
}

if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object") {
  module.exports = dragonBones;
} else if (typeof define === "function" && define["amd"]) {
  define(["dragonBones"], function () {
    return dragonBones;
  });
} else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") {
  exports = dragonBones;
} else if (typeof global !== "undefined") {
  global.dragonBones = dragonBones;
}

var dragonBones;

(function (t) {
  var e = function () {
    function t() {
      this.hashCode = t._hashCode++;
      this._isInPool = false;
    }

    t._returnObject = function (e) {
      var a = String(e.constructor);
      var r = a in t._maxCountMap ? t._maxCountMap[a] : t._defaultMaxCount;
      var i = t._poolsMap[a] = t._poolsMap[a] || [];

      if (i.length < r) {
        if (!e._isInPool) {
          e._isInPool = true;
          i.push(e);
        } else {
          console.warn("The object is already in the pool.");
        }
      } else {}
    };

    t.toString = function () {
      throw new Error();
    };

    t.setMaxCount = function (e, a) {
      if (a < 0 || a !== a) {
        a = 0;
      }

      if (e !== null) {
        var r = String(e);
        var i = r in t._poolsMap ? t._poolsMap[r] : null;

        if (i !== null && i.length > a) {
          i.length = a;
        }

        t._maxCountMap[r] = a;
      } else {
        t._defaultMaxCount = a;

        for (var r in t._poolsMap) {
          var i = t._poolsMap[r];

          if (i.length > a) {
            i.length = a;
          }

          if (r in t._maxCountMap) {
            t._maxCountMap[r] = a;
          }
        }
      }
    };

    t.clearPool = function (e) {
      if (e === void 0) {
        e = null;
      }

      if (e !== null) {
        var a = String(e);
        var r = a in t._poolsMap ? t._poolsMap[a] : null;

        if (r !== null && r.length > 0) {
          r.length = 0;
        }
      } else {
        for (var i in t._poolsMap) {
          var r = t._poolsMap[i];
          r.length = 0;
        }
      }
    };

    t.borrowObject = function (e) {
      var a = String(e);
      var r = a in t._poolsMap ? t._poolsMap[a] : null;

      if (r !== null && r.length > 0) {
        var i = r.pop();
        i._isInPool = false;
        return i;
      }

      var n = new e();

      n._onClear();

      return n;
    };

    t.prototype.returnToPool = function () {
      this._onClear();

      t._returnObject(this);
    };

    t._hashCode = 0;
    t._defaultMaxCount = 3e3;
    t._maxCountMap = {};
    t._poolsMap = {};
    return t;
  }();

  t.BaseObject = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function () {
    function t(t, e, a, r, i, n) {
      if (t === void 0) {
        t = 1;
      }

      if (e === void 0) {
        e = 0;
      }

      if (a === void 0) {
        a = 0;
      }

      if (r === void 0) {
        r = 1;
      }

      if (i === void 0) {
        i = 0;
      }

      if (n === void 0) {
        n = 0;
      }

      this.a = t;
      this.b = e;
      this.c = a;
      this.d = r;
      this.tx = i;
      this.ty = n;
    }

    t.prototype.toString = function () {
      return "[object dragonBones.Matrix] a:" + this.a + " b:" + this.b + " c:" + this.c + " d:" + this.d + " tx:" + this.tx + " ty:" + this.ty;
    };

    t.prototype.copyFrom = function (t) {
      this.a = t.a;
      this.b = t.b;
      this.c = t.c;
      this.d = t.d;
      this.tx = t.tx;
      this.ty = t.ty;
      return this;
    };

    t.prototype.copyFromArray = function (t, e) {
      if (e === void 0) {
        e = 0;
      }

      this.a = t[e];
      this.b = t[e + 1];
      this.c = t[e + 2];
      this.d = t[e + 3];
      this.tx = t[e + 4];
      this.ty = t[e + 5];
      return this;
    };

    t.prototype.identity = function () {
      this.a = this.d = 1;
      this.b = this.c = 0;
      this.tx = this.ty = 0;
      return this;
    };

    t.prototype.concat = function (t) {
      var e = this.a * t.a;
      var a = 0;
      var r = 0;
      var i = this.d * t.d;
      var n = this.tx * t.a + t.tx;
      var s = this.ty * t.d + t.ty;

      if (this.b !== 0 || this.c !== 0) {
        e += this.b * t.c;
        a += this.b * t.d;
        r += this.c * t.a;
        i += this.c * t.b;
      }

      if (t.b !== 0 || t.c !== 0) {
        a += this.a * t.b;
        r += this.d * t.c;
        n += this.ty * t.c;
        s += this.tx * t.b;
      }

      this.a = e;
      this.b = a;
      this.c = r;
      this.d = i;
      this.tx = n;
      this.ty = s;
      return this;
    };

    t.prototype.invert = function () {
      var t = this.a;
      var e = this.b;
      var a = this.c;
      var r = this.d;
      var i = this.tx;
      var n = this.ty;

      if (e === 0 && a === 0) {
        this.b = this.c = 0;

        if (t === 0 || r === 0) {
          this.a = this.b = this.tx = this.ty = 0;
        } else {
          t = this.a = 1 / t;
          r = this.d = 1 / r;
          this.tx = -t * i;
          this.ty = -r * n;
        }

        return this;
      }

      var s = t * r - e * a;

      if (s === 0) {
        this.a = this.d = 1;
        this.b = this.c = 0;
        this.tx = this.ty = 0;
        return this;
      }

      s = 1 / s;
      var o = this.a = r * s;
      e = this.b = -e * s;
      a = this.c = -a * s;
      r = this.d = t * s;
      this.tx = -(o * i + a * n);
      this.ty = -(e * i + r * n);
      return this;
    };

    t.prototype.transformPoint = function (t, e, a, r) {
      if (r === void 0) {
        r = false;
      }

      a.x = this.a * t + this.c * e;
      a.y = this.b * t + this.d * e;

      if (!r) {
        a.x += this.tx;
        a.y += this.ty;
      }
    };

    t.prototype.transformRectangle = function (t, e) {
      if (e === void 0) {
        e = false;
      }

      var a = this.a;
      var r = this.b;
      var i = this.c;
      var n = this.d;
      var s = e ? 0 : this.tx;
      var o = e ? 0 : this.ty;
      var l = t.x;
      var h = t.y;
      var u = l + t.width;
      var f = h + t.height;

      var _ = a * l + i * h + s;

      var m = r * l + n * h + o;
      var p = a * u + i * h + s;
      var c = r * u + n * h + o;
      var d = a * u + i * f + s;
      var y = r * u + n * f + o;
      var v = a * l + i * f + s;
      var g = r * l + n * f + o;
      var D = 0;

      if (_ > p) {
        D = _;
        _ = p;
        p = D;
      }

      if (d > v) {
        D = d;
        d = v;
        v = D;
      }

      t.x = Math.floor(_ < d ? _ : d);
      t.width = Math.ceil((p > v ? p : v) - t.x);

      if (m > c) {
        D = m;
        m = c;
        c = D;
      }

      if (y > g) {
        D = y;
        y = g;
        g = D;
      }

      t.y = Math.floor(m < y ? m : y);
      t.height = Math.ceil((c > g ? c : g) - t.y);
    };

    return t;
  }();

  t.Matrix = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function () {
    function t(t, e, a, r, i, n) {
      if (t === void 0) {
        t = 0;
      }

      if (e === void 0) {
        e = 0;
      }

      if (a === void 0) {
        a = 0;
      }

      if (r === void 0) {
        r = 0;
      }

      if (i === void 0) {
        i = 1;
      }

      if (n === void 0) {
        n = 1;
      }

      this.x = t;
      this.y = e;
      this.skew = a;
      this.rotation = r;
      this.scaleX = i;
      this.scaleY = n;
    }

    t.normalizeRadian = function (t) {
      t = (t + Math.PI) % (Math.PI * 2);
      t += t > 0 ? -Math.PI : Math.PI;
      return t;
    };

    t.prototype.toString = function () {
      return "[object dragonBones.Transform] x:" + this.x + " y:" + this.y + " skewX:" + this.skew * 180 / Math.PI + " skewY:" + this.rotation * 180 / Math.PI + " scaleX:" + this.scaleX + " scaleY:" + this.scaleY;
    };

    t.prototype.copyFrom = function (t) {
      this.x = t.x;
      this.y = t.y;
      this.skew = t.skew;
      this.rotation = t.rotation;
      this.scaleX = t.scaleX;
      this.scaleY = t.scaleY;
      return this;
    };

    t.prototype.identity = function () {
      this.x = this.y = 0;
      this.skew = this.rotation = 0;
      this.scaleX = this.scaleY = 1;
      return this;
    };

    t.prototype.add = function (t) {
      this.x += t.x;
      this.y += t.y;
      this.skew += t.skew;
      this.rotation += t.rotation;
      this.scaleX *= t.scaleX;
      this.scaleY *= t.scaleY;
      return this;
    };

    t.prototype.minus = function (t) {
      this.x -= t.x;
      this.y -= t.y;
      this.skew -= t.skew;
      this.rotation -= t.rotation;
      this.scaleX /= t.scaleX;
      this.scaleY /= t.scaleY;
      return this;
    };

    t.prototype.fromMatrix = function (e) {
      var a = this.scaleX,
          r = this.scaleY;
      var i = t.PI_Q;
      this.x = e.tx;
      this.y = e.ty;
      this.rotation = Math.atan(e.b / e.a);
      var n = Math.atan(-e.c / e.d);
      this.scaleX = this.rotation > -i && this.rotation < i ? e.a / Math.cos(this.rotation) : e.b / Math.sin(this.rotation);
      this.scaleY = n > -i && n < i ? e.d / Math.cos(n) : -e.c / Math.sin(n);

      if (a >= 0 && this.scaleX < 0) {
        this.scaleX = -this.scaleX;
        this.rotation = this.rotation - Math.PI;
      }

      if (r >= 0 && this.scaleY < 0) {
        this.scaleY = -this.scaleY;
        n = n - Math.PI;
      }

      this.skew = n - this.rotation;
      return this;
    };

    t.prototype.toMatrix = function (t) {
      if (this.rotation === 0) {
        t.a = 1;
        t.b = 0;
      } else {
        t.a = Math.cos(this.rotation);
        t.b = Math.sin(this.rotation);
      }

      if (this.skew === 0) {
        t.c = -t.b;
        t.d = t.a;
      } else {
        t.c = -Math.sin(this.skew + this.rotation);
        t.d = Math.cos(this.skew + this.rotation);
      }

      if (this.scaleX !== 1) {
        t.a *= this.scaleX;
        t.b *= this.scaleX;
      }

      if (this.scaleY !== 1) {
        t.c *= this.scaleY;
        t.d *= this.scaleY;
      }

      t.tx = this.x;
      t.ty = this.y;
      return this;
    };

    t.PI = Math.PI;
    t.PI_D = Math.PI * 2;
    t.PI_H = Math.PI / 2;
    t.PI_Q = Math.PI / 4;
    t.RAD_DEG = 180 / Math.PI;
    t.DEG_RAD = Math.PI / 180;
    return t;
  }();

  t.Transform = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function () {
    function t(t, e, a, r, i, n, s, o) {
      if (t === void 0) {
        t = 1;
      }

      if (e === void 0) {
        e = 1;
      }

      if (a === void 0) {
        a = 1;
      }

      if (r === void 0) {
        r = 1;
      }

      if (i === void 0) {
        i = 0;
      }

      if (n === void 0) {
        n = 0;
      }

      if (s === void 0) {
        s = 0;
      }

      if (o === void 0) {
        o = 0;
      }

      this.alphaMultiplier = t;
      this.redMultiplier = e;
      this.greenMultiplier = a;
      this.blueMultiplier = r;
      this.alphaOffset = i;
      this.redOffset = n;
      this.greenOffset = s;
      this.blueOffset = o;
    }

    t.prototype.copyFrom = function (t) {
      this.alphaMultiplier = t.alphaMultiplier;
      this.redMultiplier = t.redMultiplier;
      this.greenMultiplier = t.greenMultiplier;
      this.blueMultiplier = t.blueMultiplier;
      this.alphaOffset = t.alphaOffset;
      this.redOffset = t.redOffset;
      this.greenOffset = t.greenOffset;
      this.blueOffset = t.blueOffset;
    };

    t.prototype.identity = function () {
      this.alphaMultiplier = this.redMultiplier = this.greenMultiplier = this.blueMultiplier = 1;
      this.alphaOffset = this.redOffset = this.greenOffset = this.blueOffset = 0;
    };

    return t;
  }();

  t.ColorTransform = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function () {
    function t(t, e) {
      if (t === void 0) {
        t = 0;
      }

      if (e === void 0) {
        e = 0;
      }

      this.x = t;
      this.y = e;
    }

    t.prototype.copyFrom = function (t) {
      this.x = t.x;
      this.y = t.y;
    };

    t.prototype.clear = function () {
      this.x = this.y = 0;
    };

    return t;
  }();

  t.Point = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function () {
    function t(t, e, a, r) {
      if (t === void 0) {
        t = 0;
      }

      if (e === void 0) {
        e = 0;
      }

      if (a === void 0) {
        a = 0;
      }

      if (r === void 0) {
        r = 0;
      }

      this.x = t;
      this.y = e;
      this.width = a;
      this.height = r;
    }

    t.prototype.copyFrom = function (t) {
      this.x = t.x;
      this.y = t.y;
      this.width = t.width;
      this.height = t.height;
    };

    t.prototype.clear = function () {
      this.x = this.y = 0;
      this.width = this.height = 0;
    };

    return t;
  }();

  t.Rectangle = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e.ints = [];
      e.floats = [];
      e.strings = [];
      return e;
    }

    e.toString = function () {
      return "[class dragonBones.UserData]";
    };

    e.prototype._onClear = function () {
      this.ints.length = 0;
      this.floats.length = 0;
      this.strings.length = 0;
    };

    e.prototype.addInt = function (t) {
      this.ints.push(t);
    };

    e.prototype.addFloat = function (t) {
      this.floats.push(t);
    };

    e.prototype.addString = function (t) {
      this.strings.push(t);
    };

    e.prototype.getInt = function (t) {
      if (t === void 0) {
        t = 0;
      }

      return t >= 0 && t < this.ints.length ? this.ints[t] : 0;
    };

    e.prototype.getFloat = function (t) {
      if (t === void 0) {
        t = 0;
      }

      return t >= 0 && t < this.floats.length ? this.floats[t] : 0;
    };

    e.prototype.getString = function (t) {
      if (t === void 0) {
        t = 0;
      }

      return t >= 0 && t < this.strings.length ? this.strings[t] : "";
    };

    return e;
  }(t.BaseObject);

  t.UserData = e;

  var a = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e.data = null;
      return e;
    }

    e.toString = function () {
      return "[class dragonBones.ActionData]";
    };

    e.prototype._onClear = function () {
      if (this.data !== null) {
        this.data.returnToPool();
      }

      this.type = 0;
      this.name = "";
      this.bone = null;
      this.slot = null;
      this.data = null;
    };

    return e;
  }(t.BaseObject);

  t.ActionData = a;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e.frameIndices = [];
      e.cachedFrames = [];
      e.armatureNames = [];
      e.armatures = {};
      e.userData = null;
      return e;
    }

    e.toString = function () {
      return "[class dragonBones.DragonBonesData]";
    };

    e.prototype._onClear = function () {
      for (var t in this.armatures) {
        this.armatures[t].returnToPool();
        delete this.armatures[t];
      }

      if (this.userData !== null) {
        this.userData.returnToPool();
      }

      this.autoSearch = false;
      this.frameRate = 0;
      this.version = "";
      this.name = "";
      this.stage = null;
      this.frameIndices.length = 0;
      this.cachedFrames.length = 0;
      this.armatureNames.length = 0;
      this.binary = null;
      this.intArray = null;
      this.floatArray = null;
      this.frameIntArray = null;
      this.frameFloatArray = null;
      this.frameArray = null;
      this.timelineArray = null;
      this.colorArray = null;
      this.userData = null;
    };

    e.prototype.addArmature = function (t) {
      if (t.name in this.armatures) {
        console.warn("Same armature: " + t.name);
        return;
      }

      t.parent = this;
      this.armatures[t.name] = t;
      this.armatureNames.push(t.name);
    };

    e.prototype.getArmature = function (t) {
      return t in this.armatures ? this.armatures[t] : null;
    };

    return e;
  }(t.BaseObject);

  t.DragonBonesData = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (e) {
    __extends(a, e);

    function a() {
      var a = e !== null && e.apply(this, arguments) || this;
      a.aabb = new t.Rectangle();
      a.animationNames = [];
      a.sortedBones = [];
      a.sortedSlots = [];
      a.defaultActions = [];
      a.actions = [];
      a.bones = {};
      a.slots = {};
      a.constraints = {};
      a.skins = {};
      a.animations = {};
      a.canvas = null;
      a.userData = null;
      return a;
    }

    a.toString = function () {
      return "[class dragonBones.ArmatureData]";
    };

    a.prototype._onClear = function () {
      for (var t = 0, e = this.defaultActions; t < e.length; t++) {
        var a = e[t];
        a.returnToPool();
      }

      for (var r = 0, i = this.actions; r < i.length; r++) {
        var a = i[r];
        a.returnToPool();
      }

      for (var n in this.bones) {
        this.bones[n].returnToPool();
        delete this.bones[n];
      }

      for (var n in this.slots) {
        this.slots[n].returnToPool();
        delete this.slots[n];
      }

      for (var n in this.constraints) {
        this.constraints[n].returnToPool();
        delete this.constraints[n];
      }

      for (var n in this.skins) {
        this.skins[n].returnToPool();
        delete this.skins[n];
      }

      for (var n in this.animations) {
        this.animations[n].returnToPool();
        delete this.animations[n];
      }

      if (this.canvas !== null) {
        this.canvas.returnToPool();
      }

      if (this.userData !== null) {
        this.userData.returnToPool();
      }

      this.type = 0;
      this.frameRate = 0;
      this.cacheFrameRate = 0;
      this.scale = 1;
      this.name = "";
      this.aabb.clear();
      this.animationNames.length = 0;
      this.sortedBones.length = 0;
      this.sortedSlots.length = 0;
      this.defaultActions.length = 0;
      this.actions.length = 0;
      this.defaultSkin = null;
      this.defaultAnimation = null;
      this.canvas = null;
      this.userData = null;
      this.parent = null;
    };

    a.prototype.sortBones = function () {
      var t = this.sortedBones.length;

      if (t <= 0) {
        return;
      }

      var e = this.sortedBones.concat();
      var a = 0;
      var r = 0;
      this.sortedBones.length = 0;

      while (r < t) {
        var i = e[a++];

        if (a >= t) {
          a = 0;
        }

        if (this.sortedBones.indexOf(i) >= 0) {
          continue;
        }

        var n = false;

        for (var s in this.constraints) {
          var o = this.constraints[s];

          if (o.root === i && this.sortedBones.indexOf(o.target) < 0) {
            n = true;
            break;
          }
        }

        if (n) {
          continue;
        }

        if (i.parent !== null && this.sortedBones.indexOf(i.parent) < 0) {
          continue;
        }

        this.sortedBones.push(i);
        r++;
      }
    };

    a.prototype.cacheFrames = function (t) {
      if (this.cacheFrameRate > 0) {
        return;
      }

      this.cacheFrameRate = t;

      for (var e in this.animations) {
        this.animations[e].cacheFrames(this.cacheFrameRate);
      }
    };

    a.prototype.setCacheFrame = function (t, e) {
      var a = this.parent.cachedFrames;
      var r = a.length;
      a.length += 10;
      a[r] = t.a;
      a[r + 1] = t.b;
      a[r + 2] = t.c;
      a[r + 3] = t.d;
      a[r + 4] = t.tx;
      a[r + 5] = t.ty;
      a[r + 6] = e.rotation;
      a[r + 7] = e.skew;
      a[r + 8] = e.scaleX;
      a[r + 9] = e.scaleY;
      return r;
    };

    a.prototype.getCacheFrame = function (t, e, a) {
      var r = this.parent.cachedFrames;
      t.a = r[a];
      t.b = r[a + 1];
      t.c = r[a + 2];
      t.d = r[a + 3];
      t.tx = r[a + 4];
      t.ty = r[a + 5];
      e.rotation = r[a + 6];
      e.skew = r[a + 7];
      e.scaleX = r[a + 8];
      e.scaleY = r[a + 9];
      e.x = t.tx;
      e.y = t.ty;
    };

    a.prototype.addBone = function (t) {
      if (t.name in this.bones) {
        console.warn("Same bone: " + t.name);
        return;
      }

      this.bones[t.name] = t;
      this.sortedBones.push(t);
    };

    a.prototype.addSlot = function (t) {
      if (t.name in this.slots) {
        console.warn("Same slot: " + t.name);
        return;
      }

      this.slots[t.name] = t;
      this.sortedSlots.push(t);
    };

    a.prototype.addConstraint = function (t) {
      if (t.name in this.constraints) {
        console.warn("Same constraint: " + t.name);
        return;
      }

      this.constraints[t.name] = t;
    };

    a.prototype.addSkin = function (t) {
      if (t.name in this.skins) {
        console.warn("Same skin: " + t.name);
        return;
      }

      t.parent = this;
      this.skins[t.name] = t;

      if (this.defaultSkin === null) {
        this.defaultSkin = t;
      }

      if (t.name === "default") {
        this.defaultSkin = t;
      }
    };

    a.prototype.addAnimation = function (t) {
      if (t.name in this.animations) {
        console.warn("Same animation: " + t.name);
        return;
      }

      t.parent = this;
      this.animations[t.name] = t;
      this.animationNames.push(t.name);

      if (this.defaultAnimation === null) {
        this.defaultAnimation = t;
      }
    };

    a.prototype.addAction = function (t, e) {
      if (e) {
        this.defaultActions.push(t);
      } else {
        this.actions.push(t);
      }
    };

    a.prototype.getBone = function (t) {
      return t in this.bones ? this.bones[t] : null;
    };

    a.prototype.getSlot = function (t) {
      return t in this.slots ? this.slots[t] : null;
    };

    a.prototype.getConstraint = function (t) {
      return t in this.constraints ? this.constraints[t] : null;
    };

    a.prototype.getSkin = function (t) {
      return t in this.skins ? this.skins[t] : null;
    };

    a.prototype.getMesh = function (t, e, a) {
      var r = this.getSkin(t);

      if (r === null) {
        return null;
      }

      return r.getDisplay(e, a);
    };

    a.prototype.getAnimation = function (t) {
      return t in this.animations ? this.animations[t] : null;
    };

    return a;
  }(t.BaseObject);

  t.ArmatureData = e;

  var a = function (e) {
    __extends(a, e);

    function a() {
      var a = e !== null && e.apply(this, arguments) || this;
      a.transform = new t.Transform();
      a.userData = null;
      return a;
    }

    a.toString = function () {
      return "[class dragonBones.BoneData]";
    };

    a.prototype._onClear = function () {
      if (this.userData !== null) {
        this.userData.returnToPool();
      }

      this.inheritTranslation = false;
      this.inheritRotation = false;
      this.inheritScale = false;
      this.inheritReflection = false;
      this.type = 0;
      this.length = 0;
      this.alpha = 1;
      this.name = "";
      this.transform.identity();
      this.userData = null;
      this.parent = null;
    };

    return a;
  }(t.BaseObject);

  t.BoneData = a;

  var r = function (e) {
    __extends(a, e);

    function a() {
      var a = e !== null && e.apply(this, arguments) || this;
      a.geometry = new t.GeometryData();
      return a;
    }

    a.toString = function () {
      return "[class dragonBones.SurfaceData]";
    };

    a.prototype._onClear = function () {
      e.prototype._onClear.call(this);

      this.type = 1;
      this.segmentX = 0;
      this.segmentY = 0;
      this.geometry.clear();
    };

    return a;
  }(a);

  t.SurfaceData = r;

  var i = function (e) {
    __extends(a, e);

    function a() {
      var t = e !== null && e.apply(this, arguments) || this;
      t.color = null;
      t.userData = null;
      return t;
    }

    a.createColor = function () {
      return new t.ColorTransform();
    };

    a.toString = function () {
      return "[class dragonBones.SlotData]";
    };

    a.prototype._onClear = function () {
      if (this.userData !== null) {
        this.userData.returnToPool();
      }

      this.blendMode = 0;
      this.displayIndex = 0;
      this.zOrder = 0;
      this.zIndex = 0;
      this.alpha = 1;
      this.name = "";
      this.color = null;
      this.userData = null;
      this.parent = null;
    };

    a.DEFAULT_COLOR = new t.ColorTransform();
    return a;
  }(t.BaseObject);

  t.SlotData = i;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.prototype._onClear = function () {
      this.order = 0;
      this.name = "";
      this.type = 0;
      this.target = null;
      this.root = null;
      this.bone = null;
    };

    return e;
  }(t.BaseObject);

  t.ConstraintData = e;

  var a = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.IKConstraintData]";
    };

    e.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      this.scaleEnabled = false;
      this.bendPositive = false;
      this.weight = 1;
    };

    return e;
  }(e);

  t.IKConstraintData = a;

  var r = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e.bones = [];
      return e;
    }

    e.toString = function () {
      return "[class dragonBones.PathConstraintData]";
    };

    e.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      this.pathSlot = null;
      this.pathDisplayData = null;
      this.bones.length = 0;
      this.positionMode = 0;
      this.spacingMode = 1;
      this.rotateMode = 1;
      this.position = 0;
      this.spacing = 0;
      this.rotateOffset = 0;
      this.rotateMix = 0;
      this.translateMix = 0;
    };

    e.prototype.AddBone = function (t) {
      this.bones.push(t);
    };

    return e;
  }(e);

  t.PathConstraintData = r;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.CanvasData]";
    };

    e.prototype._onClear = function () {
      this.hasBackground = false;
      this.color = 0;
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
    };

    return e;
  }(t.BaseObject);

  t.CanvasData = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e.displays = {};
      return e;
    }

    e.toString = function () {
      return "[class dragonBones.SkinData]";
    };

    e.prototype._onClear = function () {
      for (var t in this.displays) {
        var e = this.displays[t];

        for (var a = 0, r = e; a < r.length; a++) {
          var i = r[a];

          if (i !== null) {
            i.returnToPool();
          }
        }

        delete this.displays[t];
      }

      this.name = "";
      this.parent = null;
    };

    e.prototype.addDisplay = function (t, e) {
      if (!(t in this.displays)) {
        this.displays[t] = [];
      }

      if (e !== null) {
        e.parent = this;
      }

      var a = this.displays[t];
      a.push(e);
    };

    e.prototype.getDisplay = function (t, e) {
      var a = this.getDisplays(t);

      if (a !== null) {
        for (var r = 0, i = a; r < i.length; r++) {
          var n = i[r];

          if (n !== null && n.name === e) {
            return n;
          }
        }
      }

      return null;
    };

    e.prototype.getDisplays = function (t) {
      if (!(t in this.displays)) {
        return null;
      }

      return this.displays[t];
    };

    return e;
  }(t.BaseObject);

  t.SkinData = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function () {
    function t() {
      this.weight = null;
    }

    t.prototype.clear = function () {
      if (!this.isShared && this.weight !== null) {
        this.weight.returnToPool();
      }

      this.isShared = false;
      this.inheritDeform = false;
      this.offset = 0;
      this.data = null;
      this.weight = null;
    };

    t.prototype.shareFrom = function (t) {
      this.isShared = true;
      this.offset = t.offset;
      this.weight = t.weight;
    };

    Object.defineProperty(t.prototype, "vertexCount", {
      get: function get() {
        var t = this.data.intArray;
        return t[this.offset + 0];
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(t.prototype, "triangleCount", {
      get: function get() {
        var t = this.data.intArray;
        return t[this.offset + 1];
      },
      enumerable: true,
      configurable: true
    });
    return t;
  }();

  t.GeometryData = e;

  var a = function (e) {
    __extends(a, e);

    function a() {
      var a = e !== null && e.apply(this, arguments) || this;
      a.transform = new t.Transform();
      return a;
    }

    a.prototype._onClear = function () {
      this.name = "";
      this.path = "";
      this.transform.identity();
      this.parent = null;
    };

    return a;
  }(t.BaseObject);

  t.DisplayData = a;

  var r = function (e) {
    __extends(a, e);

    function a() {
      var a = e !== null && e.apply(this, arguments) || this;
      a.pivot = new t.Point();
      return a;
    }

    a.toString = function () {
      return "[class dragonBones.ImageDisplayData]";
    };

    a.prototype._onClear = function () {
      e.prototype._onClear.call(this);

      this.type = 0;
      this.pivot.clear();
      this.texture = null;
    };

    return a;
  }(a);

  t.ImageDisplayData = r;

  var i = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e.actions = [];
      return e;
    }

    e.toString = function () {
      return "[class dragonBones.ArmatureDisplayData]";
    };

    e.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      for (var e = 0, a = this.actions; e < a.length; e++) {
        var r = a[e];
        r.returnToPool();
      }

      this.type = 1;
      this.inheritAnimation = false;
      this.actions.length = 0;
      this.armature = null;
    };

    e.prototype.addAction = function (t) {
      this.actions.push(t);
    };

    return e;
  }(a);

  t.ArmatureDisplayData = i;

  var n = function (t) {
    __extends(a, t);

    function a() {
      var a = t !== null && t.apply(this, arguments) || this;
      a.geometry = new e();
      return a;
    }

    a.toString = function () {
      return "[class dragonBones.MeshDisplayData]";
    };

    a.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      this.type = 2;
      this.geometry.clear();
      this.texture = null;
    };

    return a;
  }(a);

  t.MeshDisplayData = n;

  var s = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e.boundingBox = null;
      return e;
    }

    e.toString = function () {
      return "[class dragonBones.BoundingBoxDisplayData]";
    };

    e.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      if (this.boundingBox !== null) {
        this.boundingBox.returnToPool();
      }

      this.type = 3;
      this.boundingBox = null;
    };

    return e;
  }(a);

  t.BoundingBoxDisplayData = s;

  var o = function (t) {
    __extends(a, t);

    function a() {
      var a = t !== null && t.apply(this, arguments) || this;
      a.geometry = new e();
      a.curveLengths = [];
      return a;
    }

    a.toString = function () {
      return "[class dragonBones.PathDisplayData]";
    };

    a.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      this.type = 4;
      this.closed = false;
      this.constantSpeed = false;
      this.geometry.clear();
      this.curveLengths.length = 0;
    };

    return a;
  }(a);

  t.PathDisplayData = o;

  var l = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e.bones = [];
      return e;
    }

    e.toString = function () {
      return "[class dragonBones.WeightData]";
    };

    e.prototype._onClear = function () {
      this.count = 0;
      this.offset = 0;
      this.bones.length = 0;
    };

    e.prototype.addBone = function (t) {
      this.bones.push(t);
    };

    return e;
  }(t.BaseObject);

  t.WeightData = l;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.prototype._onClear = function () {
      this.color = 0;
      this.width = 0;
      this.height = 0;
    };

    return e;
  }(t.BaseObject);

  t.BoundingBoxData = e;

  var a = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.RectangleBoundingBoxData]";
    };

    e._computeOutCode = function (t, e, a, r, i, n) {
      var s = 0;

      if (t < a) {
        s |= 1;
      } else if (t > i) {
        s |= 2;
      }

      if (e < r) {
        s |= 4;
      } else if (e > n) {
        s |= 8;
      }

      return s;
    };

    e.rectangleIntersectsSegment = function (t, a, r, i, n, s, o, l, h, u, f) {
      if (h === void 0) {
        h = null;
      }

      if (u === void 0) {
        u = null;
      }

      if (f === void 0) {
        f = null;
      }

      var _ = t > n && t < o && a > s && a < l;

      var m = r > n && r < o && i > s && i < l;

      if (_ && m) {
        return -1;
      }

      var p = 0;

      var c = e._computeOutCode(t, a, n, s, o, l);

      var d = e._computeOutCode(r, i, n, s, o, l);

      while (true) {
        if ((c | d) === 0) {
          p = 2;
          break;
        } else if ((c & d) !== 0) {
          break;
        }

        var y = 0;
        var v = 0;
        var g = 0;
        var D = c !== 0 ? c : d;

        if ((D & 4) !== 0) {
          y = t + (r - t) * (s - a) / (i - a);
          v = s;

          if (f !== null) {
            g = -Math.PI * .5;
          }
        } else if ((D & 8) !== 0) {
          y = t + (r - t) * (l - a) / (i - a);
          v = l;

          if (f !== null) {
            g = Math.PI * .5;
          }
        } else if ((D & 2) !== 0) {
          v = a + (i - a) * (o - t) / (r - t);
          y = o;

          if (f !== null) {
            g = 0;
          }
        } else if ((D & 1) !== 0) {
          v = a + (i - a) * (n - t) / (r - t);
          y = n;

          if (f !== null) {
            g = Math.PI;
          }
        }

        if (D === c) {
          t = y;
          a = v;
          c = e._computeOutCode(t, a, n, s, o, l);

          if (f !== null) {
            f.x = g;
          }
        } else {
          r = y;
          i = v;
          d = e._computeOutCode(r, i, n, s, o, l);

          if (f !== null) {
            f.y = g;
          }
        }
      }

      if (p) {
        if (_) {
          p = 2;

          if (h !== null) {
            h.x = r;
            h.y = i;
          }

          if (u !== null) {
            u.x = r;
            u.y = r;
          }

          if (f !== null) {
            f.x = f.y + Math.PI;
          }
        } else if (m) {
          p = 1;

          if (h !== null) {
            h.x = t;
            h.y = a;
          }

          if (u !== null) {
            u.x = t;
            u.y = a;
          }

          if (f !== null) {
            f.y = f.x + Math.PI;
          }
        } else {
          p = 3;

          if (h !== null) {
            h.x = t;
            h.y = a;
          }

          if (u !== null) {
            u.x = r;
            u.y = i;
          }
        }
      }

      return p;
    };

    e.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      this.type = 0;
    };

    e.prototype.containsPoint = function (t, e) {
      var a = this.width * .5;

      if (t >= -a && t <= a) {
        var r = this.height * .5;

        if (e >= -r && e <= r) {
          return true;
        }
      }

      return false;
    };

    e.prototype.intersectsSegment = function (t, a, r, i, n, s, o) {
      if (n === void 0) {
        n = null;
      }

      if (s === void 0) {
        s = null;
      }

      if (o === void 0) {
        o = null;
      }

      var l = this.width * .5;
      var h = this.height * .5;
      var u = e.rectangleIntersectsSegment(t, a, r, i, -l, -h, l, h, n, s, o);
      return u;
    };

    return e;
  }(e);

  t.RectangleBoundingBoxData = a;

  var r = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.EllipseData]";
    };

    e.ellipseIntersectsSegment = function (t, e, a, r, i, n, s, o, l, h, u) {
      if (l === void 0) {
        l = null;
      }

      if (h === void 0) {
        h = null;
      }

      if (u === void 0) {
        u = null;
      }

      var f = s / o;

      var _ = f * f;

      e *= f;
      r *= f;
      var m = a - t;
      var p = r - e;
      var c = Math.sqrt(m * m + p * p);
      var d = m / c;
      var y = p / c;
      var v = (i - t) * d + (n - e) * y;
      var g = v * v;
      var D = t * t + e * e;
      var T = s * s;
      var b = T - D + g;
      var A = 0;

      if (b >= 0) {
        var P = Math.sqrt(b);
        var S = v - P;
        var O = v + P;
        var x = S < 0 ? -1 : S <= c ? 0 : 1;
        var B = O < 0 ? -1 : O <= c ? 0 : 1;
        var E = x * B;

        if (E < 0) {
          return -1;
        } else if (E === 0) {
          if (x === -1) {
            A = 2;
            a = t + O * d;
            r = (e + O * y) / f;

            if (l !== null) {
              l.x = a;
              l.y = r;
            }

            if (h !== null) {
              h.x = a;
              h.y = r;
            }

            if (u !== null) {
              u.x = Math.atan2(r / T * _, a / T);
              u.y = u.x + Math.PI;
            }
          } else if (B === 1) {
            A = 1;
            t = t + S * d;
            e = (e + S * y) / f;

            if (l !== null) {
              l.x = t;
              l.y = e;
            }

            if (h !== null) {
              h.x = t;
              h.y = e;
            }

            if (u !== null) {
              u.x = Math.atan2(e / T * _, t / T);
              u.y = u.x + Math.PI;
            }
          } else {
            A = 3;

            if (l !== null) {
              l.x = t + S * d;
              l.y = (e + S * y) / f;

              if (u !== null) {
                u.x = Math.atan2(l.y / T * _, l.x / T);
              }
            }

            if (h !== null) {
              h.x = t + O * d;
              h.y = (e + O * y) / f;

              if (u !== null) {
                u.y = Math.atan2(h.y / T * _, h.x / T);
              }
            }
          }
        }
      }

      return A;
    };

    e.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      this.type = 1;
    };

    e.prototype.containsPoint = function (t, e) {
      var a = this.width * .5;

      if (t >= -a && t <= a) {
        var r = this.height * .5;

        if (e >= -r && e <= r) {
          e *= a / r;
          return Math.sqrt(t * t + e * e) <= a;
        }
      }

      return false;
    };

    e.prototype.intersectsSegment = function (t, a, r, i, n, s, o) {
      if (n === void 0) {
        n = null;
      }

      if (s === void 0) {
        s = null;
      }

      if (o === void 0) {
        o = null;
      }

      var l = e.ellipseIntersectsSegment(t, a, r, i, 0, 0, this.width * .5, this.height * .5, n, s, o);
      return l;
    };

    return e;
  }(e);

  t.EllipseBoundingBoxData = r;

  var i = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e.vertices = [];
      return e;
    }

    e.toString = function () {
      return "[class dragonBones.PolygonBoundingBoxData]";
    };

    e.polygonIntersectsSegment = function (t, e, a, r, i, n, s, o) {
      if (n === void 0) {
        n = null;
      }

      if (s === void 0) {
        s = null;
      }

      if (o === void 0) {
        o = null;
      }

      if (t === a) {
        t = a + 1e-6;
      }

      if (e === r) {
        e = r + 1e-6;
      }

      var l = i.length;
      var h = t - a;
      var u = e - r;
      var f = t * r - e * a;
      var _ = 0;
      var m = i[l - 2];
      var p = i[l - 1];
      var c = 0;
      var d = 0;
      var y = 0;
      var v = 0;
      var g = 0;
      var D = 0;

      for (var T = 0; T < l; T += 2) {
        var b = i[T];
        var A = i[T + 1];

        if (m === b) {
          m = b + 1e-4;
        }

        if (p === A) {
          p = A + 1e-4;
        }

        var P = m - b;
        var S = p - A;
        var O = m * A - p * b;
        var x = h * S - u * P;
        var B = (f * P - h * O) / x;

        if ((B >= m && B <= b || B >= b && B <= m) && (h === 0 || B >= t && B <= a || B >= a && B <= t)) {
          var E = (f * S - u * O) / x;

          if ((E >= p && E <= A || E >= A && E <= p) && (u === 0 || E >= e && E <= r || E >= r && E <= e)) {
            if (s !== null) {
              var M = B - t;

              if (M < 0) {
                M = -M;
              }

              if (_ === 0) {
                c = M;
                d = M;
                y = B;
                v = E;
                g = B;
                D = E;

                if (o !== null) {
                  o.x = Math.atan2(A - p, b - m) - Math.PI * .5;
                  o.y = o.x;
                }
              } else {
                if (M < c) {
                  c = M;
                  y = B;
                  v = E;

                  if (o !== null) {
                    o.x = Math.atan2(A - p, b - m) - Math.PI * .5;
                  }
                }

                if (M > d) {
                  d = M;
                  g = B;
                  D = E;

                  if (o !== null) {
                    o.y = Math.atan2(A - p, b - m) - Math.PI * .5;
                  }
                }
              }

              _++;
            } else {
              y = B;
              v = E;
              g = B;
              D = E;
              _++;

              if (o !== null) {
                o.x = Math.atan2(A - p, b - m) - Math.PI * .5;
                o.y = o.x;
              }

              break;
            }
          }
        }

        m = b;
        p = A;
      }

      if (_ === 1) {
        if (n !== null) {
          n.x = y;
          n.y = v;
        }

        if (s !== null) {
          s.x = y;
          s.y = v;
        }

        if (o !== null) {
          o.y = o.x + Math.PI;
        }
      } else if (_ > 1) {
        _++;

        if (n !== null) {
          n.x = y;
          n.y = v;
        }

        if (s !== null) {
          s.x = g;
          s.y = D;
        }
      }

      return _;
    };

    e.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      this.type = 2;
      this.x = 0;
      this.y = 0;
      this.vertices.length = 0;
    };

    e.prototype.containsPoint = function (t, e) {
      var a = false;

      if (t >= this.x && t <= this.width && e >= this.y && e <= this.height) {
        for (var r = 0, i = this.vertices.length, n = i - 2; r < i; r += 2) {
          var s = this.vertices[n + 1];
          var o = this.vertices[r + 1];

          if (o < e && s >= e || s < e && o >= e) {
            var l = this.vertices[n];
            var h = this.vertices[r];

            if ((e - o) * (l - h) / (s - o) + h < t) {
              a = !a;
            }
          }

          n = r;
        }
      }

      return a;
    };

    e.prototype.intersectsSegment = function (t, r, i, n, s, o, l) {
      if (s === void 0) {
        s = null;
      }

      if (o === void 0) {
        o = null;
      }

      if (l === void 0) {
        l = null;
      }

      var h = 0;

      if (a.rectangleIntersectsSegment(t, r, i, n, this.x, this.y, this.x + this.width, this.y + this.height, null, null, null) !== 0) {
        h = e.polygonIntersectsSegment(t, r, i, n, this.vertices, s, o, l);
      }

      return h;
    };

    return e;
  }(e);

  t.PolygonBoundingBoxData = i;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e.cachedFrames = [];
      e.boneTimelines = {};
      e.slotTimelines = {};
      e.constraintTimelines = {};
      e.animationTimelines = {};
      e.boneCachedFrameIndices = {};
      e.slotCachedFrameIndices = {};
      e.actionTimeline = null;
      e.zOrderTimeline = null;
      return e;
    }

    e.toString = function () {
      return "[class dragonBones.AnimationData]";
    };

    e.prototype._onClear = function () {
      for (var t in this.boneTimelines) {
        for (var e = 0, a = this.boneTimelines[t]; e < a.length; e++) {
          var r = a[e];
          r.returnToPool();
        }

        delete this.boneTimelines[t];
      }

      for (var t in this.slotTimelines) {
        for (var i = 0, n = this.slotTimelines[t]; i < n.length; i++) {
          var r = n[i];
          r.returnToPool();
        }

        delete this.slotTimelines[t];
      }

      for (var t in this.constraintTimelines) {
        for (var s = 0, o = this.constraintTimelines[t]; s < o.length; s++) {
          var r = o[s];
          r.returnToPool();
        }

        delete this.constraintTimelines[t];
      }

      for (var t in this.animationTimelines) {
        for (var l = 0, h = this.animationTimelines[t]; l < h.length; l++) {
          var r = h[l];
          r.returnToPool();
        }

        delete this.animationTimelines[t];
      }

      for (var t in this.boneCachedFrameIndices) {
        delete this.boneCachedFrameIndices[t];
      }

      for (var t in this.slotCachedFrameIndices) {
        delete this.slotCachedFrameIndices[t];
      }

      if (this.actionTimeline !== null) {
        this.actionTimeline.returnToPool();
      }

      if (this.zOrderTimeline !== null) {
        this.zOrderTimeline.returnToPool();
      }

      this.frameIntOffset = 0;
      this.frameFloatOffset = 0;
      this.frameOffset = 0;
      this.blendType = 0;
      this.frameCount = 0;
      this.playTimes = 0;
      this.duration = 0;
      this.scale = 1;
      this.fadeInTime = 0;
      this.cacheFrameRate = 0;
      this.name = "";
      this.cachedFrames.length = 0;
      this.actionTimeline = null;
      this.zOrderTimeline = null;
      this.parent = null;
    };

    e.prototype.cacheFrames = function (t) {
      if (this.cacheFrameRate > 0) {
        return;
      }

      this.cacheFrameRate = Math.max(Math.ceil(t * this.scale), 1);
      var e = Math.ceil(this.cacheFrameRate * this.duration) + 1;
      this.cachedFrames.length = e;

      for (var a = 0, r = this.cacheFrames.length; a < r; ++a) {
        this.cachedFrames[a] = false;
      }

      for (var i = 0, n = this.parent.sortedBones; i < n.length; i++) {
        var s = n[i];
        var o = new Array(e);

        for (var a = 0, r = o.length; a < r; ++a) {
          o[a] = -1;
        }

        this.boneCachedFrameIndices[s.name] = o;
      }

      for (var l = 0, h = this.parent.sortedSlots; l < h.length; l++) {
        var u = h[l];
        var o = new Array(e);

        for (var a = 0, r = o.length; a < r; ++a) {
          o[a] = -1;
        }

        this.slotCachedFrameIndices[u.name] = o;
      }
    };

    e.prototype.addBoneTimeline = function (t, e) {
      var a = t in this.boneTimelines ? this.boneTimelines[t] : this.boneTimelines[t] = [];

      if (a.indexOf(e) < 0) {
        a.push(e);
      }
    };

    e.prototype.addSlotTimeline = function (t, e) {
      var a = t in this.slotTimelines ? this.slotTimelines[t] : this.slotTimelines[t] = [];

      if (a.indexOf(e) < 0) {
        a.push(e);
      }
    };

    e.prototype.addConstraintTimeline = function (t, e) {
      var a = t in this.constraintTimelines ? this.constraintTimelines[t] : this.constraintTimelines[t] = [];

      if (a.indexOf(e) < 0) {
        a.push(e);
      }
    };

    e.prototype.addAnimationTimeline = function (t, e) {
      var a = t in this.animationTimelines ? this.animationTimelines[t] : this.animationTimelines[t] = [];

      if (a.indexOf(e) < 0) {
        a.push(e);
      }
    };

    e.prototype.getBoneTimelines = function (t) {
      return t in this.boneTimelines ? this.boneTimelines[t] : null;
    };

    e.prototype.getSlotTimelines = function (t) {
      return t in this.slotTimelines ? this.slotTimelines[t] : null;
    };

    e.prototype.getConstraintTimelines = function (t) {
      return t in this.constraintTimelines ? this.constraintTimelines[t] : null;
    };

    e.prototype.getAnimationTimelines = function (t) {
      return t in this.animationTimelines ? this.animationTimelines[t] : null;
    };

    e.prototype.getBoneCachedFrameIndices = function (t) {
      return t in this.boneCachedFrameIndices ? this.boneCachedFrameIndices[t] : null;
    };

    e.prototype.getSlotCachedFrameIndices = function (t) {
      return t in this.slotCachedFrameIndices ? this.slotCachedFrameIndices[t] : null;
    };

    return e;
  }(t.BaseObject);

  t.AnimationData = e;

  var a = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.TimelineData]";
    };

    e.prototype._onClear = function () {
      this.type = 10;
      this.offset = 0;
      this.frameIndicesOffset = -1;
    };

    return e;
  }(t.BaseObject);

  t.TimelineData = a;

  var r = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.AnimationTimelineData]";
    };

    e.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      this.x = 0;
      this.y = 0;
    };

    return e;
  }(a);

  t.AnimationTimelineData = r;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e.boneMask = [];
      return e;
    }

    e.toString = function () {
      return "[class dragonBones.AnimationConfig]";
    };

    e.prototype._onClear = function () {
      this.pauseFadeOut = true;
      this.fadeOutMode = 4;
      this.fadeOutTweenType = 1;
      this.fadeOutTime = -1;
      this.actionEnabled = true;
      this.additive = false;
      this.displayControl = true;
      this.pauseFadeIn = true;
      this.resetToPose = true;
      this.fadeInTweenType = 1;
      this.playTimes = -1;
      this.layer = 0;
      this.position = 0;
      this.duration = -1;
      this.timeScale = -100;
      this.weight = 1;
      this.fadeInTime = -1;
      this.autoFadeOutTime = -1;
      this.name = "";
      this.animation = "";
      this.group = "";
      this.boneMask.length = 0;
    };

    e.prototype.clear = function () {
      this._onClear();
    };

    e.prototype.copyFrom = function (t) {
      this.pauseFadeOut = t.pauseFadeOut;
      this.fadeOutMode = t.fadeOutMode;
      this.autoFadeOutTime = t.autoFadeOutTime;
      this.fadeOutTweenType = t.fadeOutTweenType;
      this.actionEnabled = t.actionEnabled;
      this.additive = t.additive;
      this.displayControl = t.displayControl;
      this.pauseFadeIn = t.pauseFadeIn;
      this.resetToPose = t.resetToPose;
      this.playTimes = t.playTimes;
      this.layer = t.layer;
      this.position = t.position;
      this.duration = t.duration;
      this.timeScale = t.timeScale;
      this.fadeInTime = t.fadeInTime;
      this.fadeOutTime = t.fadeOutTime;
      this.fadeInTweenType = t.fadeInTweenType;
      this.weight = t.weight;
      this.name = t.name;
      this.animation = t.animation;
      this.group = t.group;
      this.boneMask.length = t.boneMask.length;

      for (var e = 0, a = this.boneMask.length; e < a; ++e) {
        this.boneMask[e] = t.boneMask[e];
      }
    };

    return e;
  }(t.BaseObject);

  t.AnimationConfig = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e.textures = {};
      return e;
    }

    e.prototype._onClear = function () {
      for (var t in this.textures) {
        this.textures[t].returnToPool();
        delete this.textures[t];
      }

      this.autoSearch = false;
      this.width = 0;
      this.height = 0;
      this.scale = 1;
      this.name = "";
      this.imagePath = "";
    };

    e.prototype.copyFrom = function (t) {
      this.autoSearch = t.autoSearch;
      this.scale = t.scale;
      this.width = t.width;
      this.height = t.height;
      this.name = t.name;
      this.imagePath = t.imagePath;

      for (var e in this.textures) {
        this.textures[e].returnToPool();
        delete this.textures[e];
      }

      for (var e in t.textures) {
        var a = this.createTexture();
        a.copyFrom(t.textures[e]);
        this.textures[e] = a;
      }
    };

    e.prototype.addTexture = function (t) {
      if (t.name in this.textures) {
        console.warn("Same texture: " + t.name);
        return;
      }

      t.parent = this;
      this.textures[t.name] = t;
    };

    e.prototype.getTexture = function (t) {
      return t in this.textures ? this.textures[t] : null;
    };

    return e;
  }(t.BaseObject);

  t.TextureAtlasData = e;

  var a = function (e) {
    __extends(a, e);

    function a() {
      var a = e !== null && e.apply(this, arguments) || this;
      a.region = new t.Rectangle();
      a.frame = null;
      return a;
    }

    a.createRectangle = function () {
      return new t.Rectangle();
    };

    a.prototype._onClear = function () {
      this.rotated = false;
      this.name = "";
      this.region.clear();
      this.parent = null;
      this.frame = null;
    };

    a.prototype.copyFrom = function (t) {
      this.rotated = t.rotated;
      this.name = t.name;
      this.region.copyFrom(t.region);
      this.parent = t.parent;

      if (this.frame === null && t.frame !== null) {
        this.frame = a.createRectangle();
      } else if (this.frame !== null && t.frame === null) {
        this.frame = null;
      }

      if (this.frame !== null && t.frame !== null) {
        this.frame.copyFrom(t.frame);
      }
    };

    return a;
  }(t.BaseObject);

  t.TextureData = a;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (e) {
    __extends(a, e);

    function a() {
      var t = e !== null && e.apply(this, arguments) || this;
      t._bones = [];
      t._slots = [];
      t._constraints = [];
      t._actions = [];
      t._animation = null;
      t._proxy = null;
      t._replaceTextureAtlasData = null;
      t._clock = null;
      return t;
    }

    a.toString = function () {
      return "[class dragonBones.Armature]";
    };

    a._onSortSlots = function (t, e) {
      return t._zIndex * 1e3 + t._zOrder > e._zIndex * 1e3 + e._zOrder ? 1 : -1;
    };

    a.prototype._onClear = function () {
      if (this._clock !== null) {
        this._clock.remove(this);
      }

      for (var t = 0, e = this._bones; t < e.length; t++) {
        var a = e[t];
        a.returnToPool();
      }

      for (var r = 0, i = this._slots; r < i.length; r++) {
        var n = i[r];
        n.returnToPool();
      }

      for (var s = 0, o = this._constraints; s < o.length; s++) {
        var l = o[s];
        l.returnToPool();
      }

      for (var h = 0, u = this._actions; h < u.length; h++) {
        var f = u[h];
        f.returnToPool();
      }

      if (this._animation !== null) {
        this._animation.returnToPool();
      }

      if (this._proxy !== null) {
        this._proxy.dbClear();
      }

      if (this._replaceTextureAtlasData !== null) {
        this._replaceTextureAtlasData.returnToPool();
      }

      this.inheritAnimation = true;
      this.userData = null;
      this._lockUpdate = false;
      this._slotsDirty = true;
      this._zOrderDirty = false;
      this._zIndexDirty = false;
      this._alphaDirty = true;
      this._flipX = false;
      this._flipY = false;
      this._cacheFrameIndex = -1;
      this._alpha = 1;
      this._globalAlpha = 1;
      this._bones.length = 0;
      this._slots.length = 0;
      this._constraints.length = 0;
      this._actions.length = 0;
      this._armatureData = null;
      this._animation = null;
      this._proxy = null;
      this._display = null;
      this._replaceTextureAtlasData = null;
      this._replacedTexture = null;
      this._dragonBones = null;
      this._clock = null;
      this._parent = null;
    };

    a.prototype._sortZOrder = function (t, e) {
      var a = this._armatureData.sortedSlots;
      var r = t === null;

      if (this._zOrderDirty || !r) {
        for (var i = 0, n = a.length; i < n; ++i) {
          var s = r ? i : t[e + i];

          if (s < 0 || s >= n) {
            continue;
          }

          var o = a[s];
          var l = this.getSlot(o.name);

          if (l !== null) {
            l._setZOrder(i);
          }
        }

        this._slotsDirty = true;
        this._zOrderDirty = !r;
      }
    };

    a.prototype._addBone = function (t) {
      if (this._bones.indexOf(t) < 0) {
        this._bones.push(t);
      }
    };

    a.prototype._addSlot = function (t) {
      if (this._slots.indexOf(t) < 0) {
        this._slots.push(t);
      }
    };

    a.prototype._addConstraint = function (t) {
      if (this._constraints.indexOf(t) < 0) {
        this._constraints.push(t);
      }
    };

    a.prototype._bufferAction = function (t, e) {
      if (this._actions.indexOf(t) < 0) {
        if (e) {
          this._actions.push(t);
        } else {
          this._actions.unshift(t);
        }
      }
    };

    a.prototype.dispose = function () {
      if (this._armatureData !== null) {
        this._lockUpdate = true;

        this._dragonBones.bufferObject(this);
      }
    };

    a.prototype.init = function (e, a, r, i) {
      if (this._armatureData !== null) {
        return;
      }

      this._armatureData = e;
      this._animation = t.BaseObject.borrowObject(t.Animation);
      this._proxy = a;
      this._display = r;
      this._dragonBones = i;

      this._proxy.dbInit(this);

      this._animation.init(this);

      this._animation.animations = this._armatureData.animations;
    };

    a.prototype.advanceTime = function (t) {
      if (this._lockUpdate) {
        return;
      }

      this._lockUpdate = true;

      if (this._armatureData === null) {
        console.warn("The armature has been disposed.");
        return;
      } else if (this._armatureData.parent === null) {
        console.warn("The armature data has been disposed.\nPlease make sure dispose armature before call factory.clear().");
        return;
      }

      var e = this._cacheFrameIndex;

      this._animation.advanceTime(t);

      if (this._slotsDirty || this._zIndexDirty) {
        this._slots.sort(a._onSortSlots);

        if (this._zIndexDirty) {
          for (var r = 0, i = this._slots.length; r < i; ++r) {
            this._slots[r]._setZOrder(r);
          }
        }

        this._slotsDirty = false;
        this._zIndexDirty = false;
      }

      if (this._alphaDirty) {
        this._alphaDirty = false;
        this._globalAlpha = this._alpha * (this._parent !== null ? this._parent._globalAlpha : 1);

        for (var n = 0, s = this._bones; n < s.length; n++) {
          var o = s[n];

          o._updateAlpha();
        }

        for (var l = 0, h = this._slots; l < h.length; l++) {
          var u = h[l];

          u._updateAlpha();
        }
      }

      if (this._cacheFrameIndex < 0 || this._cacheFrameIndex !== e) {
        var r = 0,
            i = 0;

        for (r = 0, i = this._bones.length; r < i; ++r) {
          this._bones[r].update(this._cacheFrameIndex);
        }

        for (r = 0, i = this._slots.length; r < i; ++r) {
          this._slots[r].update(this._cacheFrameIndex);
        }
      }

      if (this._actions.length > 0) {
        for (var f = 0, _ = this._actions; f < _.length; f++) {
          var m = _[f];
          var p = m.actionData;

          if (p !== null) {
            if (p.type === 0) {
              if (m.slot !== null) {
                var c = m.slot.childArmature;

                if (c !== null) {
                  c.animation.fadeIn(p.name);
                }
              } else if (m.bone !== null) {
                for (var d = 0, y = this.getSlots(); d < y.length; d++) {
                  var u = y[d];

                  if (u.parent === m.bone) {
                    var c = u.childArmature;

                    if (c !== null) {
                      c.animation.fadeIn(p.name);
                    }
                  }
                }
              } else {
                this._animation.fadeIn(p.name);
              }
            }
          }

          m.returnToPool();
        }

        this._actions.length = 0;
      }

      this._lockUpdate = false;

      this._proxy.dbUpdate();
    };

    a.prototype.invalidUpdate = function (t, e) {
      if (t === void 0) {
        t = null;
      }

      if (e === void 0) {
        e = false;
      }

      if (t !== null && t.length > 0) {
        var a = this.getBone(t);

        if (a !== null) {
          a.invalidUpdate();

          if (e) {
            for (var r = 0, i = this._slots; r < i.length; r++) {
              var n = i[r];

              if (n.parent === a) {
                n.invalidUpdate();
              }
            }
          }
        }
      } else {
        for (var s = 0, o = this._bones; s < o.length; s++) {
          var a = o[s];
          a.invalidUpdate();
        }

        if (e) {
          for (var l = 0, h = this._slots; l < h.length; l++) {
            var n = h[l];
            n.invalidUpdate();
          }
        }
      }
    };

    a.prototype.containsPoint = function (t, e) {
      for (var a = 0, r = this._slots; a < r.length; a++) {
        var i = r[a];

        if (i.containsPoint(t, e)) {
          return i;
        }
      }

      return null;
    };

    a.prototype.intersectsSegment = function (t, e, a, r, i, n, s) {
      if (i === void 0) {
        i = null;
      }

      if (n === void 0) {
        n = null;
      }

      if (s === void 0) {
        s = null;
      }

      var o = t === a;
      var l = 0;
      var h = 0;
      var u = 0;
      var f = 0;
      var _ = 0;
      var m = 0;
      var p = 0;
      var c = 0;
      var d = null;
      var y = null;

      for (var v = 0, g = this._slots; v < g.length; v++) {
        var D = g[v];
        var T = D.intersectsSegment(t, e, a, r, i, n, s);

        if (T > 0) {
          if (i !== null || n !== null) {
            if (i !== null) {
              var b = o ? i.y - e : i.x - t;

              if (b < 0) {
                b = -b;
              }

              if (d === null || b < l) {
                l = b;
                u = i.x;
                f = i.y;
                d = D;

                if (s) {
                  p = s.x;
                }
              }
            }

            if (n !== null) {
              var b = n.x - t;

              if (b < 0) {
                b = -b;
              }

              if (y === null || b > h) {
                h = b;
                _ = n.x;
                m = n.y;
                y = D;

                if (s !== null) {
                  c = s.y;
                }
              }
            }
          } else {
            d = D;
            break;
          }
        }
      }

      if (d !== null && i !== null) {
        i.x = u;
        i.y = f;

        if (s !== null) {
          s.x = p;
        }
      }

      if (y !== null && n !== null) {
        n.x = _;
        n.y = m;

        if (s !== null) {
          s.y = c;
        }
      }

      return d;
    };

    a.prototype.getBone = function (t) {
      for (var e = 0, a = this._bones; e < a.length; e++) {
        var r = a[e];

        if (r.name === t) {
          return r;
        }
      }

      return null;
    };

    a.prototype.getBoneByDisplay = function (t) {
      var e = this.getSlotByDisplay(t);
      return e !== null ? e.parent : null;
    };

    a.prototype.getSlot = function (t) {
      for (var e = 0, a = this._slots; e < a.length; e++) {
        var r = a[e];

        if (r.name === t) {
          return r;
        }
      }

      return null;
    };

    a.prototype.getSlotByDisplay = function (t) {
      if (t !== null) {
        for (var e = 0, a = this._slots; e < a.length; e++) {
          var r = a[e];

          if (r.display === t) {
            return r;
          }
        }
      }

      return null;
    };

    a.prototype.getBones = function () {
      return this._bones;
    };

    a.prototype.getSlots = function () {
      return this._slots;
    };

    Object.defineProperty(a.prototype, "flipX", {
      get: function get() {
        return this._flipX;
      },
      set: function set(t) {
        if (this._flipX === t) {
          return;
        }

        this._flipX = t;
        this.invalidUpdate();
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "flipY", {
      get: function get() {
        return this._flipY;
      },
      set: function set(t) {
        if (this._flipY === t) {
          return;
        }

        this._flipY = t;
        this.invalidUpdate();
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "cacheFrameRate", {
      get: function get() {
        return this._armatureData.cacheFrameRate;
      },
      set: function set(t) {
        if (this._armatureData.cacheFrameRate !== t) {
          this._armatureData.cacheFrames(t);

          for (var e = 0, a = this._slots; e < a.length; e++) {
            var r = a[e];
            var i = r.childArmature;

            if (i !== null) {
              i.cacheFrameRate = t;
            }
          }
        }
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "name", {
      get: function get() {
        return this._armatureData.name;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "armatureData", {
      get: function get() {
        return this._armatureData;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "animation", {
      get: function get() {
        return this._animation;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "proxy", {
      get: function get() {
        return this._proxy;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "eventDispatcher", {
      get: function get() {
        return this._proxy;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "display", {
      get: function get() {
        return this._display;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "replacedTexture", {
      get: function get() {
        return this._replacedTexture;
      },
      set: function set(t) {
        if (this._replacedTexture === t) {
          return;
        }

        if (this._replaceTextureAtlasData !== null) {
          this._replaceTextureAtlasData.returnToPool();

          this._replaceTextureAtlasData = null;
        }

        this._replacedTexture = t;

        for (var e = 0, a = this._slots; e < a.length; e++) {
          var r = a[e];
          r.invalidUpdate();
          r.update(-1);
        }
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "clock", {
      get: function get() {
        return this._clock;
      },
      set: function set(t) {
        if (this._clock === t) {
          return;
        }

        if (this._clock !== null) {
          this._clock.remove(this);
        }

        this._clock = t;

        if (this._clock) {
          this._clock.add(this);
        }

        for (var e = 0, a = this._slots; e < a.length; e++) {
          var r = a[e];
          var i = r.childArmature;

          if (i !== null) {
            i.clock = this._clock;
          }
        }
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "parent", {
      get: function get() {
        return this._parent;
      },
      enumerable: true,
      configurable: true
    });

    a.prototype.getDisplay = function () {
      return this._display;
    };

    return a;
  }(t.BaseObject);

  t.Armature = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (e) {
    __extends(a, e);

    function a() {
      var a = e !== null && e.apply(this, arguments) || this;
      a.globalTransformMatrix = new t.Matrix();
      a.global = new t.Transform();
      a.offset = new t.Transform();
      return a;
    }

    a.prototype._onClear = function () {
      this.globalTransformMatrix.identity();
      this.global.identity();
      this.offset.identity();
      this.origin = null;
      this.userData = null;
      this._globalDirty = false;
      this._alpha = 1;
      this._globalAlpha = 1;
      this._armature = null;
    };

    a.prototype.updateGlobalTransform = function () {
      if (this._globalDirty) {
        this._globalDirty = false;
        this.global.fromMatrix(this.globalTransformMatrix);
      }
    };

    Object.defineProperty(a.prototype, "armature", {
      get: function get() {
        return this._armature;
      },
      enumerable: true,
      configurable: true
    });
    a._helpMatrix = new t.Matrix();
    a._helpTransform = new t.Transform();
    a._helpPoint = new t.Point();
    return a;
  }(t.BaseObject);

  t.TransformObject = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (e) {
    __extends(a, e);

    function a() {
      var a = e !== null && e.apply(this, arguments) || this;
      a.animationPose = new t.Transform();
      return a;
    }

    a.toString = function () {
      return "[class dragonBones.Bone]";
    };

    a.prototype._onClear = function () {
      e.prototype._onClear.call(this);

      this.offsetMode = 1;
      this.animationPose.identity();
      this._transformDirty = false;
      this._childrenTransformDirty = false;
      this._localDirty = true;
      this._hasConstraint = false;
      this._visible = true;
      this._cachedFrameIndex = -1;
      this._boneData = null;
      this._parent = null;
      this._cachedFrameIndices = null;
    };

    a.prototype._updateGlobalTransformMatrix = function (e) {
      var a = this._boneData;
      var r = this.global;
      var i = this.globalTransformMatrix;
      var n = this.origin;
      var s = this.offset;
      var o = this.animationPose;
      var l = this._parent;
      var h = this._armature.flipX;
      var u = this._armature.flipY === t.DragonBones.yDown;
      var f = l !== null;
      var _ = 0;

      if (this.offsetMode === 1) {
        if (n !== null) {
          r.x = n.x + s.x + o.x;
          r.y = n.y + s.y + o.y;
          r.skew = n.skew + s.skew + o.skew;
          r.rotation = n.rotation + s.rotation + o.rotation;
          r.scaleX = n.scaleX * s.scaleX * o.scaleX;
          r.scaleY = n.scaleY * s.scaleY * o.scaleY;
        } else {
          r.copyFrom(s).add(o);
        }
      } else if (this.offsetMode === 0) {
        if (n !== null) {
          r.copyFrom(n).add(o);
        } else {
          r.copyFrom(o);
        }
      } else {
        f = false;
        r.copyFrom(s);
      }

      if (f) {
        var m = l._boneData.type === 1;
        var p = m ? l._bone : null;
        var c = m ? l._getGlobalTransformMatrix(r.x, r.y) : l.globalTransformMatrix;

        if (a.inheritScale && (!m || p !== null)) {
          if (m) {
            if (a.inheritRotation) {
              r.rotation += l.global.rotation;
            }

            p.updateGlobalTransform();
            r.scaleX *= p.global.scaleX;
            r.scaleY *= p.global.scaleY;
            c.transformPoint(r.x, r.y, r);
            r.toMatrix(i);

            if (a.inheritTranslation) {
              r.x = i.tx;
              r.y = i.ty;
            } else {
              i.tx = r.x;
              i.ty = r.y;
            }
          } else {
            if (!a.inheritRotation) {
              l.updateGlobalTransform();

              if (h && u) {
                _ = r.rotation - (l.global.rotation + Math.PI);
              } else if (h) {
                _ = r.rotation + l.global.rotation + Math.PI;
              } else if (u) {
                _ = r.rotation + l.global.rotation;
              } else {
                _ = r.rotation - l.global.rotation;
              }

              r.rotation = _;
            }

            r.toMatrix(i);
            i.concat(c);

            if (a.inheritTranslation) {
              r.x = i.tx;
              r.y = i.ty;
            } else {
              i.tx = r.x;
              i.ty = r.y;
            }

            if (e) {
              r.fromMatrix(i);
            } else {
              this._globalDirty = true;
            }
          }
        } else {
          if (a.inheritTranslation) {
            var d = r.x;
            var y = r.y;
            r.x = c.a * d + c.c * y + c.tx;
            r.y = c.b * d + c.d * y + c.ty;
          } else {
            if (h) {
              r.x = -r.x;
            }

            if (u) {
              r.y = -r.y;
            }
          }

          if (a.inheritRotation) {
            l.updateGlobalTransform();

            if (l.global.scaleX < 0) {
              _ = r.rotation + l.global.rotation + Math.PI;
            } else {
              _ = r.rotation + l.global.rotation;
            }

            if (c.a * c.d - c.b * c.c < 0) {
              _ -= r.rotation * 2;

              if (h !== u || a.inheritReflection) {
                r.skew += Math.PI;
              }
            }

            r.rotation = _;
          } else if (h || u) {
            if (h && u) {
              _ = r.rotation + Math.PI;
            } else {
              if (h) {
                _ = Math.PI - r.rotation;
              } else {
                _ = -r.rotation;
              }

              r.skew += Math.PI;
            }

            r.rotation = _;
          }

          r.toMatrix(i);
        }
      } else {
        if (h || u) {
          if (h) {
            r.x = -r.x;
          }

          if (u) {
            r.y = -r.y;
          }

          if (h && u) {
            _ = r.rotation + Math.PI;
          } else {
            if (h) {
              _ = Math.PI - r.rotation;
            } else {
              _ = -r.rotation;
            }

            r.skew += Math.PI;
          }

          r.rotation = _;
        }

        r.toMatrix(i);
      }
    };

    a.prototype._updateAlpha = function () {
      if (this._parent !== null) {
        this._globalAlpha = this._alpha * this._parent._globalAlpha;
      } else {
        this._globalAlpha = this._alpha * this._armature._globalAlpha;
      }
    };

    a.prototype.init = function (t, e) {
      if (this._boneData !== null) {
        return;
      }

      this._boneData = t;
      this._armature = e;
      this._alpha = this._boneData.alpha;

      if (this._boneData.parent !== null) {
        this._parent = this._armature.getBone(this._boneData.parent.name);
      }

      this._armature._addBone(this);

      this.origin = this._boneData.transform;
    };

    a.prototype.update = function (t) {
      if (t >= 0 && this._cachedFrameIndices !== null) {
        var e = this._cachedFrameIndices[t];

        if (e >= 0 && this._cachedFrameIndex === e) {
          this._transformDirty = false;
        } else if (e >= 0) {
          this._transformDirty = true;
          this._cachedFrameIndex = e;
        } else {
          if (this._hasConstraint) {
            for (var a = 0, r = this._armature._constraints; a < r.length; a++) {
              var i = r[a];

              if (i._root === this) {
                i.update();
              }
            }
          }

          if (this._transformDirty || this._parent !== null && this._parent._childrenTransformDirty) {
            this._transformDirty = true;
            this._cachedFrameIndex = -1;
          } else if (this._cachedFrameIndex >= 0) {
            this._transformDirty = false;
            this._cachedFrameIndices[t] = this._cachedFrameIndex;
          } else {
            this._transformDirty = true;
            this._cachedFrameIndex = -1;
          }
        }
      } else {
        if (this._hasConstraint) {
          for (var n = 0, s = this._armature._constraints; n < s.length; n++) {
            var i = s[n];

            if (i._root === this) {
              i.update();
            }
          }
        }

        if (this._transformDirty || this._parent !== null && this._parent._childrenTransformDirty) {
          t = -1;
          this._transformDirty = true;
          this._cachedFrameIndex = -1;
        }
      }

      if (this._transformDirty) {
        this._transformDirty = false;
        this._childrenTransformDirty = true;

        if (this._cachedFrameIndex < 0) {
          var o = t >= 0;

          if (this._localDirty) {
            this._updateGlobalTransformMatrix(o);
          }

          if (o && this._cachedFrameIndices !== null) {
            this._cachedFrameIndex = this._cachedFrameIndices[t] = this._armature._armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
          }
        } else {
          this._armature._armatureData.getCacheFrame(this.globalTransformMatrix, this.global, this._cachedFrameIndex);
        }
      } else if (this._childrenTransformDirty) {
        this._childrenTransformDirty = false;
      }

      this._localDirty = true;
    };

    a.prototype.updateByConstraint = function () {
      if (this._localDirty) {
        this._localDirty = false;

        if (this._transformDirty || this._parent !== null && this._parent._childrenTransformDirty) {
          this._updateGlobalTransformMatrix(true);
        }

        this._transformDirty = true;
      }
    };

    a.prototype.invalidUpdate = function () {
      this._transformDirty = true;
    };

    a.prototype.contains = function (t) {
      if (t === this) {
        return false;
      }

      var e = t;

      while (e !== this && e !== null) {
        e = e.parent;
      }

      return e === this;
    };

    Object.defineProperty(a.prototype, "boneData", {
      get: function get() {
        return this._boneData;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "visible", {
      get: function get() {
        return this._visible;
      },
      set: function set(t) {
        if (this._visible === t) {
          return;
        }

        this._visible = t;

        for (var e = 0, a = this._armature.getSlots(); e < a.length; e++) {
          var r = a[e];

          if (r.parent === this) {
            r._updateVisible();
          }
        }
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "name", {
      get: function get() {
        return this._boneData.name;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "parent", {
      get: function get() {
        return this._parent;
      },
      enumerable: true,
      configurable: true
    });
    return a;
  }(t.TransformObject);

  t.Bone = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e._vertices = [];
      e._deformVertices = [];
      e._hullCache = [];
      e._matrixCahce = [];
      return e;
    }

    e.toString = function () {
      return "[class dragonBones.Surface]";
    };

    e.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      this._dX = 0;
      this._dY = 0;
      this._k = 0;
      this._kX = 0;
      this._kY = 0;
      this._vertices.length = 0;
      this._deformVertices.length = 0;
      this._matrixCahce.length = 0;
      this._hullCache.length = 0;
      this._bone = null;
    };

    e.prototype._getAffineTransform = function (t, e, a, r, i, n, s, o, l, h, u, f, _) {
      var m = s - i;
      var p = o - n;
      var c = l - i;
      var d = h - n;
      u.rotation = Math.atan2(p, m);
      u.skew = Math.atan2(d, c) - Math.PI * .5 - u.rotation;

      if (_) {
        u.rotation += Math.PI;
      }

      u.scaleX = Math.sqrt(m * m + p * p) / a;
      u.scaleY = Math.sqrt(c * c + d * d) / r;
      u.toMatrix(f);
      u.x = f.tx = i - (f.a * t + f.c * e);
      u.y = f.ty = n - (f.b * t + f.d * e);
    };

    e.prototype._updateVertices = function () {
      var t = this._armature.armatureData.parent;
      var e = this._boneData.geometry;
      var a = t.intArray;
      var r = t.floatArray;
      var i = a[e.offset + 0];
      var n = a[e.offset + 2];
      var s = this._vertices;
      var o = this._deformVertices;

      if (this._parent !== null) {
        if (this._parent._boneData.type === 1) {
          for (var l = 0, h = i; l < h; ++l) {
            var u = l * 2;
            var f = r[n + u] + o[u];

            var _ = r[n + u + 1] + o[u + 1];

            var m = this._parent._getGlobalTransformMatrix(f, _);

            s[u] = m.a * f + m.c * _ + m.tx;
            s[u + 1] = m.b * f + m.d * _ + m.ty;
          }
        } else {
          var p = this._parent.globalTransformMatrix;

          for (var l = 0, h = i; l < h; ++l) {
            var u = l * 2;
            var f = r[n + u] + o[u];

            var _ = r[n + u + 1] + o[u + 1];

            s[u] = p.a * f + p.c * _ + p.tx;
            s[u + 1] = p.b * f + p.d * _ + p.ty;
          }
        }
      } else {
        for (var l = 0, h = i; l < h; ++l) {
          var u = l * 2;
          s[u] = r[n + u] + o[u];
          s[u + 1] = r[n + u + 1] + o[u + 1];
        }
      }
    };

    e.prototype._updateGlobalTransformMatrix = function (t) {
      t;
      var e = this._boneData.segmentX * 2;
      var a = this._vertices.length - 2;
      var r = 200;
      var i = this._vertices[0];
      var n = this._vertices[1];
      var s = this._vertices[e];
      var o = this._vertices[e + 1];
      var l = this._vertices[a];
      var h = this._vertices[a + 1];
      var u = this._vertices[a - e];
      var f = this._vertices[a - e + 1];

      var _ = i + (l - i) * .5;

      var m = n + (h - n) * .5;
      var p = s + (u - s) * .5;
      var c = o + (f - o) * .5;
      var d = _ + (p - _) * .5;
      var y = m + (c - m) * .5;
      var v = s + (l - s) * .5;
      var g = o + (h - o) * .5;
      var D = u + (l - u) * .5;
      var T = f + (h - f) * .5;

      this._getAffineTransform(0, 0, r, r, d, y, v, g, D, T, this.global, this.globalTransformMatrix, false);

      this._globalDirty = false;
    };

    e.prototype._getGlobalTransformMatrix = function (t, a) {
      var r = 200;
      var i = 1e3;

      if (t < -i || i < t || a < -i || i < a) {
        return this.globalTransformMatrix;
      }

      var n = false;
      var s = this._boneData;
      var o = s.segmentX;
      var l = s.segmentY;
      var h = s.segmentX * 2;
      var u = this._dX;
      var f = this._dY;

      var _ = Math.floor((t + r) / u);

      var m = Math.floor((a + r) / f);
      var p = 0;
      var c = _ * u - r;
      var d = m * f - r;
      var y = this._matrixCahce;
      var v = e._helpMatrix;

      if (t < -r) {
        if (a < -r || a >= r) {
          return this.globalTransformMatrix;
        }

        n = a > this._kX * (t + r) + d;
        p = ((o * l + o + l + l + m) * 2 + (n ? 1 : 0)) * 7;

        if (y[p] > 0) {
          v.copyFromArray(y, p + 1);
        } else {
          var g = m * (h + 2);
          var D = this._hullCache[4];
          var T = this._hullCache[5];
          var b = this._hullCache[2] - (l - m) * D;
          var A = this._hullCache[3] - (l - m) * T;
          var P = this._vertices;

          if (n) {
            this._getAffineTransform(-r, d + f, i - r, f, P[g + h + 2], P[g + h + 3], b + D, A + T, P[g], P[g + 1], e._helpTransform, v, true);
          } else {
            this._getAffineTransform(-i, d, i - r, f, b, A, P[g], P[g + 1], b + D, A + T, e._helpTransform, v, false);
          }

          y[p] = 1;
          y[p + 1] = v.a;
          y[p + 2] = v.b;
          y[p + 3] = v.c;
          y[p + 4] = v.d;
          y[p + 5] = v.tx;
          y[p + 6] = v.ty;
        }
      } else if (t >= r) {
        if (a < -r || a >= r) {
          return this.globalTransformMatrix;
        }

        n = a > this._kX * (t - i) + d;
        p = ((o * l + o + m) * 2 + (n ? 1 : 0)) * 7;

        if (y[p] > 0) {
          v.copyFromArray(y, p + 1);
        } else {
          var g = (m + 1) * (h + 2) - 2;
          var D = this._hullCache[4];
          var T = this._hullCache[5];
          var b = this._hullCache[0] + m * D;
          var A = this._hullCache[1] + m * T;
          var P = this._vertices;

          if (n) {
            this._getAffineTransform(i, d + f, i - r, f, b + D, A + T, P[g + h + 2], P[g + h + 3], b, A, e._helpTransform, v, true);
          } else {
            this._getAffineTransform(r, d, i - r, f, P[g], P[g + 1], b, A, P[g + h + 2], P[g + h + 3], e._helpTransform, v, false);
          }

          y[p] = 1;
          y[p + 1] = v.a;
          y[p + 2] = v.b;
          y[p + 3] = v.c;
          y[p + 4] = v.d;
          y[p + 5] = v.tx;
          y[p + 6] = v.ty;
        }
      } else if (a < -r) {
        if (t < -r || t >= r) {
          return this.globalTransformMatrix;
        }

        n = a > this._kY * (t - c - u) - i;
        p = ((o * l + _) * 2 + (n ? 1 : 0)) * 7;

        if (y[p] > 0) {
          v.copyFromArray(y, p + 1);
        } else {
          var g = _ * 2;
          var D = this._hullCache[10];
          var T = this._hullCache[11];
          var b = this._hullCache[8] + _ * D;
          var A = this._hullCache[9] + _ * T;
          var P = this._vertices;

          if (n) {
            this._getAffineTransform(c + u, -r, u, i - r, P[g + 2], P[g + 3], P[g], P[g + 1], b + D, A + T, e._helpTransform, v, true);
          } else {
            this._getAffineTransform(c, -i, u, i - r, b, A, b + D, A + T, P[g], P[g + 1], e._helpTransform, v, false);
          }

          y[p] = 1;
          y[p + 1] = v.a;
          y[p + 2] = v.b;
          y[p + 3] = v.c;
          y[p + 4] = v.d;
          y[p + 5] = v.tx;
          y[p + 6] = v.ty;
        }
      } else if (a >= r) {
        if (t < -r || t >= r) {
          return this.globalTransformMatrix;
        }

        n = a > this._kY * (t - c - u) + r;
        p = ((o * l + o + l + _) * 2 + (n ? 1 : 0)) * 7;

        if (y[p] > 0) {
          v.copyFromArray(y, p + 1);
        } else {
          var g = l * (h + 2) + _ * 2;
          var D = this._hullCache[10];
          var T = this._hullCache[11];
          var b = this._hullCache[6] - (o - _) * D;
          var A = this._hullCache[7] - (o - _) * T;
          var P = this._vertices;

          if (n) {
            this._getAffineTransform(c + u, i, u, i - r, b + D, A + T, b, A, P[g + 2], P[g + 3], e._helpTransform, v, true);
          } else {
            this._getAffineTransform(c, r, u, i - r, P[g], P[g + 1], P[g + 2], P[g + 3], b, A, e._helpTransform, v, false);
          }

          y[p] = 1;
          y[p + 1] = v.a;
          y[p + 2] = v.b;
          y[p + 3] = v.c;
          y[p + 4] = v.d;
          y[p + 5] = v.tx;
          y[p + 6] = v.ty;
        }
      } else {
        n = a > this._k * (t - c - u) + d;
        p = ((o * m + _) * 2 + (n ? 1 : 0)) * 7;

        if (y[p] > 0) {
          v.copyFromArray(y, p + 1);
        } else {
          var g = _ * 2 + m * (h + 2);
          var P = this._vertices;

          if (n) {
            this._getAffineTransform(c + u, d + f, u, f, P[g + h + 4], P[g + h + 5], P[g + h + 2], P[g + h + 3], P[g + 2], P[g + 3], e._helpTransform, v, true);
          } else {
            this._getAffineTransform(c, d, u, f, P[g], P[g + 1], P[g + 2], P[g + 3], P[g + h + 2], P[g + h + 3], e._helpTransform, v, false);
          }

          y[p] = 1;
          y[p + 1] = v.a;
          y[p + 2] = v.b;
          y[p + 3] = v.c;
          y[p + 4] = v.d;
          y[p + 5] = v.tx;
          y[p + 6] = v.ty;
        }
      }

      return v;
    };

    e.prototype.init = function (e, a) {
      if (this._boneData !== null) {
        return;
      }

      t.prototype.init.call(this, e, a);
      var r = e.segmentX;
      var i = e.segmentY;
      var n = this._armature.armatureData.parent.intArray[e.geometry.offset + 0];
      var s = 1e3;
      var o = 200;
      this._dX = o * 2 / r;
      this._dY = o * 2 / i;
      this._k = -this._dY / this._dX;
      this._kX = -this._dY / (s - o);
      this._kY = -(s - o) / this._dX;
      this._vertices.length = n * 2;
      this._deformVertices.length = n * 2;
      this._matrixCahce.length = (r * i + r * 2 + i * 2) * 2 * 7;
      this._hullCache.length = 10;

      for (var l = 0; l < n * 2; ++l) {
        this._deformVertices[l] = 0;
      }

      if (this._parent !== null) {
        if (this._parent.boneData.type === 0) {
          this._bone = this._parent;
        } else {
          this._bone = this._parent._bone;
        }
      }
    };

    e.prototype.update = function (t) {
      if (t >= 0 && this._cachedFrameIndices !== null) {
        var a = this._cachedFrameIndices[t];

        if (a >= 0 && this._cachedFrameIndex === a) {
          this._transformDirty = false;
        } else if (a >= 0) {
          this._transformDirty = true;
          this._cachedFrameIndex = a;
        } else {
          if (this._hasConstraint) {
            for (var r = 0, i = this._armature._constraints; r < i.length; r++) {
              var n = i[r];

              if (n._root === this) {
                n.update();
              }
            }
          }

          if (this._transformDirty || this._parent !== null && this._parent._childrenTransformDirty) {
            this._transformDirty = true;
            this._cachedFrameIndex = -1;
          } else if (this._cachedFrameIndex >= 0) {
            this._transformDirty = false;
            this._cachedFrameIndices[t] = this._cachedFrameIndex;
          } else {
            this._transformDirty = true;
            this._cachedFrameIndex = -1;
          }
        }
      } else {
        if (this._hasConstraint) {
          for (var s = 0, o = this._armature._constraints; s < o.length; s++) {
            var n = o[s];

            if (n._root === this) {
              n.update();
            }
          }
        }

        if (this._transformDirty || this._parent !== null && this._parent._childrenTransformDirty) {
          t = -1;
          this._transformDirty = true;
          this._cachedFrameIndex = -1;
        }
      }

      if (this._transformDirty) {
        this._transformDirty = false;
        this._childrenTransformDirty = true;

        for (var l = 0, h = this._matrixCahce.length; l < h; l += 7) {
          this._matrixCahce[l] = -1;
        }

        this._updateVertices();

        if (this._cachedFrameIndex < 0) {
          var u = t >= 0;

          if (this._localDirty) {
            this._updateGlobalTransformMatrix(u);
          }

          if (u && this._cachedFrameIndices !== null) {
            this._cachedFrameIndex = this._cachedFrameIndices[t] = this._armature._armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
          }
        } else {
          this._armature._armatureData.getCacheFrame(this.globalTransformMatrix, this.global, this._cachedFrameIndex);
        }

        var f = 1e3;
        var _ = 200;
        var m = 2 * this.global.x;
        var p = 2 * this.global.y;
        var c = e._helpPoint;
        this.globalTransformMatrix.transformPoint(f, -_, c);
        this._hullCache[0] = c.x;
        this._hullCache[1] = c.y;
        this._hullCache[2] = m - c.x;
        this._hullCache[3] = p - c.y;
        this.globalTransformMatrix.transformPoint(0, this._dY, c, true);
        this._hullCache[4] = c.x;
        this._hullCache[5] = c.y;
        this.globalTransformMatrix.transformPoint(_, f, c);
        this._hullCache[6] = c.x;
        this._hullCache[7] = c.y;
        this._hullCache[8] = m - c.x;
        this._hullCache[9] = p - c.y;
        this.globalTransformMatrix.transformPoint(this._dX, 0, c, true);
        this._hullCache[10] = c.x;
        this._hullCache[11] = c.y;
      } else if (this._childrenTransformDirty) {
        this._childrenTransformDirty = false;
      }

      this._localDirty = true;
    };

    return e;
  }(t.Bone);

  t.Surface = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e.deformVertices = [];
      return e;
    }

    e.toString = function () {
      return "[class dragonBones.DisplayFrame]";
    };

    e.prototype._onClear = function () {
      this.rawDisplayData = null;
      this.displayData = null;
      this.textureData = null;
      this.display = null;
      this.deformVertices.length = 0;
    };

    e.prototype.updateDeformVertices = function () {
      if (this.rawDisplayData === null || this.deformVertices.length !== 0) {
        return;
      }

      var t;

      if (this.rawDisplayData.type === 2) {
        t = this.rawDisplayData.geometry;
      } else if (this.rawDisplayData.type === 4) {
        t = this.rawDisplayData.geometry;
      } else {
        return;
      }

      var e = 0;

      if (t.weight !== null) {
        e = t.weight.count * 2;
      } else {
        e = t.data.intArray[t.offset + 0] * 2;
      }

      this.deformVertices.length = e;

      for (var a = 0, r = this.deformVertices.length; a < r; ++a) {
        this.deformVertices[a] = 0;
      }
    };

    e.prototype.getGeometryData = function () {
      if (this.displayData !== null) {
        if (this.displayData.type === 2) {
          return this.displayData.geometry;
        }

        if (this.displayData.type === 4) {
          return this.displayData.geometry;
        }
      }

      if (this.rawDisplayData !== null) {
        if (this.rawDisplayData.type === 2) {
          return this.rawDisplayData.geometry;
        }

        if (this.rawDisplayData.type === 4) {
          return this.rawDisplayData.geometry;
        }
      }

      return null;
    };

    e.prototype.getBoundingBox = function () {
      if (this.displayData !== null && this.displayData.type === 3) {
        return this.displayData.boundingBox;
      }

      if (this.rawDisplayData !== null && this.rawDisplayData.type === 3) {
        return this.rawDisplayData.boundingBox;
      }

      return null;
    };

    e.prototype.getTextureData = function () {
      if (this.displayData !== null) {
        if (this.displayData.type === 0) {
          return this.displayData.texture;
        }

        if (this.displayData.type === 2) {
          return this.displayData.texture;
        }
      }

      if (this.textureData !== null) {
        return this.textureData;
      }

      if (this.rawDisplayData !== null) {
        if (this.rawDisplayData.type === 0) {
          return this.rawDisplayData.texture;
        }

        if (this.rawDisplayData.type === 2) {
          return this.rawDisplayData.texture;
        }
      }

      return null;
    };

    return e;
  }(t.BaseObject);

  t.DisplayFrame = e;

  var a = function (a) {
    __extends(r, a);

    function r() {
      var e = a !== null && a.apply(this, arguments) || this;
      e._localMatrix = new t.Matrix();
      e._colorTransform = new t.ColorTransform();
      e._displayFrames = [];
      e._geometryBones = [];
      e._rawDisplay = null;
      e._meshDisplay = null;
      e._display = null;
      return e;
    }

    r.prototype._onClear = function () {
      a.prototype._onClear.call(this);

      var e = [];

      for (var r = 0, i = this._displayFrames; r < i.length; r++) {
        var n = i[r];
        var s = n.display;

        if (s !== this._rawDisplay && s !== this._meshDisplay && e.indexOf(s) < 0) {
          e.push(s);
        }

        n.returnToPool();
      }

      for (var o = 0, l = e; o < l.length; o++) {
        var h = l[o];

        if (h instanceof t.Armature) {
          h.dispose();
        } else {
          this._disposeDisplay(h, true);
        }
      }

      if (this._meshDisplay !== null && this._meshDisplay !== this._rawDisplay) {
        this._disposeDisplay(this._meshDisplay, false);
      }

      if (this._rawDisplay !== null) {
        this._disposeDisplay(this._rawDisplay, false);
      }

      this.displayController = null;
      this._displayDataDirty = false;
      this._displayDirty = false;
      this._geometryDirty = false;
      this._textureDirty = false;
      this._visibleDirty = false;
      this._blendModeDirty = false;
      this._zOrderDirty = false;
      this._colorDirty = false;
      this._verticesDirty = false;
      this._transformDirty = false;
      this._visible = true;
      this._blendMode = 0;
      this._displayIndex = -1;
      this._animationDisplayIndex = -1;
      this._zOrder = 0;
      this._zIndex = 0;
      this._cachedFrameIndex = -1;
      this._pivotX = 0;
      this._pivotY = 0;

      this._localMatrix.identity();

      this._colorTransform.identity();

      this._displayFrames.length = 0;
      this._geometryBones.length = 0;
      this._slotData = null;
      this._displayFrame = null;
      this._geometryData = null;
      this._boundingBoxData = null;
      this._textureData = null;
      this._rawDisplay = null;
      this._meshDisplay = null;
      this._display = null;
      this._childArmature = null;
      this._parent = null;
      this._cachedFrameIndices = null;
    };

    r.prototype._hasDisplay = function (t) {
      for (var e = 0, a = this._displayFrames; e < a.length; e++) {
        var r = a[e];

        if (r.display === t) {
          return true;
        }
      }

      return false;
    };

    r.prototype._isBonesUpdate = function () {
      for (var t = 0, e = this._geometryBones; t < e.length; t++) {
        var a = e[t];

        if (a !== null && a._childrenTransformDirty) {
          return true;
        }
      }

      return false;
    };

    r.prototype._updateAlpha = function () {
      var t = this._alpha * this._parent._globalAlpha;

      if (this._globalAlpha !== t) {
        this._globalAlpha = t;
        this._colorDirty = true;
      }
    };

    r.prototype._updateDisplayData = function () {
      var e = this._displayFrame;
      var a = this._geometryData;
      var i = this._textureData;
      var n = null;
      var s = null;
      this._displayFrame = null;
      this._geometryData = null;
      this._boundingBoxData = null;
      this._textureData = null;

      if (this._displayIndex >= 0 && this._displayIndex < this._displayFrames.length) {
        this._displayFrame = this._displayFrames[this._displayIndex];
        n = this._displayFrame.rawDisplayData;
        s = this._displayFrame.displayData;
        this._geometryData = this._displayFrame.getGeometryData();
        this._boundingBoxData = this._displayFrame.getBoundingBox();
        this._textureData = this._displayFrame.getTextureData();
      }

      if (this._displayFrame !== e || this._geometryData !== a || this._textureData !== i) {
        if (this._geometryData === null && this._textureData !== null) {
          var o = s !== null && s.type === 0 ? s : n;
          var l = this._textureData.parent.scale * this._armature._armatureData.scale;
          var h = this._textureData.frame;
          this._pivotX = o.pivot.x;
          this._pivotY = o.pivot.y;
          var u = h !== null ? h : this._textureData.region;
          var f = u.width;
          var _ = u.height;

          if (this._textureData.rotated && h === null) {
            f = u.height;
            _ = u.width;
          }

          this._pivotX *= f * l;
          this._pivotY *= _ * l;

          if (h !== null) {
            this._pivotX += h.x * l;
            this._pivotY += h.y * l;
          }

          if (n !== null && o !== n) {
            n.transform.toMatrix(r._helpMatrix);

            r._helpMatrix.invert();

            r._helpMatrix.transformPoint(0, 0, r._helpPoint);

            this._pivotX -= r._helpPoint.x;
            this._pivotY -= r._helpPoint.y;
            o.transform.toMatrix(r._helpMatrix);

            r._helpMatrix.invert();

            r._helpMatrix.transformPoint(0, 0, r._helpPoint);

            this._pivotX += r._helpPoint.x;
            this._pivotY += r._helpPoint.y;
          }

          if (!t.DragonBones.yDown) {
            this._pivotY = (this._textureData.rotated ? this._textureData.region.width : this._textureData.region.height) * l - this._pivotY;
          }
        } else {
          this._pivotX = 0;
          this._pivotY = 0;
        }

        if (n !== null) {
          this.origin = n.transform;
        } else if (s !== null) {
          this.origin = s.transform;
        } else {
          this.origin = null;
        }

        if (this.origin !== null) {
          this.global.copyFrom(this.origin).add(this.offset).toMatrix(this._localMatrix);
        } else {
          this.global.copyFrom(this.offset).toMatrix(this._localMatrix);
        }

        if (this._geometryData !== a) {
          this._geometryDirty = true;
          this._verticesDirty = true;

          if (this._geometryData !== null) {
            this._geometryBones.length = 0;

            if (this._geometryData.weight !== null) {
              for (var m = 0, p = this._geometryData.weight.bones.length; m < p; ++m) {
                var c = this._armature.getBone(this._geometryData.weight.bones[m].name);

                this._geometryBones.push(c);
              }
            }
          } else {
            this._geometryBones.length = 0;
            this._geometryData = null;
          }
        }

        this._textureDirty = this._textureData !== i;
        this._transformDirty = true;
      }
    };

    r.prototype._updateDisplay = function () {
      var e = this._display !== null ? this._display : this._rawDisplay;
      var a = this._childArmature;

      if (this._displayFrame !== null) {
        this._display = this._displayFrame.display;

        if (this._display !== null && this._display instanceof t.Armature) {
          this._childArmature = this._display;
          this._display = this._childArmature.display;
        } else {
          this._childArmature = null;
        }
      } else {
        this._display = null;
        this._childArmature = null;
      }

      var r = this._display !== null ? this._display : this._rawDisplay;

      if (r !== e) {
        this._textureDirty = true;
        this._visibleDirty = true;
        this._blendModeDirty = true;
        this._colorDirty = true;
        this._transformDirty = true;

        this._onUpdateDisplay();

        this._replaceDisplay(e);
      }

      if (this._childArmature !== a) {
        if (a !== null) {
          a._parent = null;
          a.clock = null;

          if (a.inheritAnimation) {
            a.animation.reset();
          }
        }

        if (this._childArmature !== null) {
          this._childArmature._parent = this;
          this._childArmature.clock = this._armature.clock;

          if (this._childArmature.inheritAnimation) {
            if (this._childArmature.cacheFrameRate === 0) {
              var i = this._armature.cacheFrameRate;

              if (i !== 0) {
                this._childArmature.cacheFrameRate = i;
              }
            }

            if (this._displayFrame !== null) {
              var n = null;
              var s = this._displayFrame.displayData !== null ? this._displayFrame.displayData : this._displayFrame.rawDisplayData;

              if (s !== null && s.type === 1) {
                n = s.actions;
              }

              if (n !== null && n.length > 0) {
                for (var o = 0, l = n; o < l.length; o++) {
                  var h = l[o];
                  var u = t.BaseObject.borrowObject(t.EventObject);
                  t.EventObject.actionDataToInstance(h, u, this._armature);
                  u.slot = this;

                  this._armature._bufferAction(u, false);
                }
              } else {
                this._childArmature.animation.play();
              }
            }
          }
        }
      }
    };

    r.prototype._updateGlobalTransformMatrix = function (t) {
      var e = this._parent._boneData.type === 0 ? this._parent.globalTransformMatrix : this._parent._getGlobalTransformMatrix(this.global.x, this.global.y);
      this.globalTransformMatrix.copyFrom(this._localMatrix);
      this.globalTransformMatrix.concat(e);

      if (t) {
        this.global.fromMatrix(this.globalTransformMatrix);
      } else {
        this._globalDirty = true;
      }
    };

    r.prototype._setDisplayIndex = function (t, e) {
      if (e === void 0) {
        e = false;
      }

      if (e) {
        if (this._animationDisplayIndex === t) {
          return;
        }

        this._animationDisplayIndex = t;
      }

      if (this._displayIndex === t) {
        return;
      }

      this._displayIndex = t < this._displayFrames.length ? t : this._displayFrames.length - 1;
      this._displayDataDirty = true;
      this._displayDirty = this._displayIndex < 0 || this._display !== this._displayFrames[this._displayIndex].display;
    };

    r.prototype._setZOrder = function (t) {
      if (this._zOrder === t) {}

      this._zOrder = t;
      this._zOrderDirty = true;
      return this._zOrderDirty;
    };

    r.prototype._setColor = function (t) {
      this._colorTransform.copyFrom(t);

      return this._colorDirty = true;
    };

    r.prototype.init = function (t, e, a, r) {
      if (this._slotData !== null) {
        return;
      }

      this._slotData = t;
      this._colorDirty = true;
      this._blendModeDirty = true;
      this._blendMode = this._slotData.blendMode;
      this._zOrder = this._slotData.zOrder;
      this._zIndex = this._slotData.zIndex;
      this._alpha = this._slotData.alpha;

      this._colorTransform.copyFrom(this._slotData.color);

      this._rawDisplay = a;
      this._meshDisplay = r;
      this._armature = e;

      var i = this._armature.getBone(this._slotData.parent.name);

      if (i !== null) {
        this._parent = i;
      } else {}

      this._armature._addSlot(this);

      this._initDisplay(this._rawDisplay, false);

      if (this._rawDisplay !== this._meshDisplay) {
        this._initDisplay(this._meshDisplay, false);
      }

      this._onUpdateDisplay();

      this._addDisplay();
    };

    r.prototype.update = function (t) {
      if (this._displayDataDirty) {
        this._updateDisplayData();

        this._displayDataDirty = false;
      }

      if (this._displayDirty) {
        this._updateDisplay();

        this._displayDirty = false;
      }

      if (this._geometryDirty || this._textureDirty) {
        if (this._display === null || this._display === this._rawDisplay || this._display === this._meshDisplay) {
          this._updateFrame();
        }

        this._geometryDirty = false;
        this._textureDirty = false;
      }

      if (this._display === null) {
        return;
      }

      if (this._visibleDirty) {
        this._updateVisible();

        this._visibleDirty = false;
      }

      if (this._blendModeDirty) {
        this._updateBlendMode();

        this._blendModeDirty = false;
      }

      if (this._colorDirty) {
        this._updateColor();

        this._colorDirty = false;
      }

      if (this._zOrderDirty) {
        this._updateZOrder();

        this._zOrderDirty = false;
      }

      if (this._geometryData !== null && this._display === this._meshDisplay) {
        var e = this._geometryData.weight !== null;
        var a = this._parent._boneData.type !== 0;

        if (this._verticesDirty || e && this._isBonesUpdate() || a && this._parent._childrenTransformDirty) {
          this._updateMesh();

          this._verticesDirty = false;
        }

        if (e || a) {
          return;
        }
      }

      if (t >= 0 && this._cachedFrameIndices !== null) {
        var r = this._cachedFrameIndices[t];

        if (r >= 0 && this._cachedFrameIndex === r) {
          this._transformDirty = false;
        } else if (r >= 0) {
          this._transformDirty = true;
          this._cachedFrameIndex = r;
        } else if (this._transformDirty || this._parent._childrenTransformDirty) {
          this._transformDirty = true;
          this._cachedFrameIndex = -1;
        } else if (this._cachedFrameIndex >= 0) {
          this._transformDirty = false;
          this._cachedFrameIndices[t] = this._cachedFrameIndex;
        } else {
          this._transformDirty = true;
          this._cachedFrameIndex = -1;
        }
      } else if (this._transformDirty || this._parent._childrenTransformDirty) {
        t = -1;
        this._transformDirty = true;
        this._cachedFrameIndex = -1;
      }

      if (this._transformDirty) {
        if (this._cachedFrameIndex < 0) {
          var i = t >= 0;

          this._updateGlobalTransformMatrix(i);

          if (i && this._cachedFrameIndices !== null) {
            this._cachedFrameIndex = this._cachedFrameIndices[t] = this._armature._armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
          }
        } else {
          this._armature._armatureData.getCacheFrame(this.globalTransformMatrix, this.global, this._cachedFrameIndex);
        }

        this._updateTransform();

        this._transformDirty = false;
      }
    };

    r.prototype.invalidUpdate = function () {
      this._displayDataDirty = true;
      this._displayDirty = true;
      this._transformDirty = true;
    };

    r.prototype.updateTransformAndMatrix = function () {
      if (this._transformDirty) {
        this._updateGlobalTransformMatrix(false);

        this._transformDirty = false;
      }
    };

    r.prototype.replaceRawDisplayData = function (t, e) {
      if (e === void 0) {
        e = -1;
      }

      if (e < 0) {
        e = this._displayIndex < 0 ? 0 : this._displayIndex;
      } else if (e >= this._displayFrames.length) {
        return;
      }

      var a = this._displayFrames[e];

      if (a.rawDisplayData !== t) {
        a.deformVertices.length = 0;
        a.rawDisplayData = t;

        if (a.rawDisplayData === null) {
          var r = this._armature._armatureData.defaultSkin;

          if (r !== null) {
            var i = r.getDisplays(this._slotData.name);

            if (i !== null && e < i.length) {
              a.rawDisplayData = i[e];
            }
          }
        }

        if (e === this._displayIndex) {
          this._displayDataDirty = true;
        }
      }
    };

    r.prototype.replaceDisplayData = function (t, e) {
      if (e === void 0) {
        e = -1;
      }

      if (e < 0) {
        e = this._displayIndex < 0 ? 0 : this._displayIndex;
      } else if (e >= this._displayFrames.length) {
        return;
      }

      var a = this._displayFrames[e];

      if (a.displayData !== t && a.rawDisplayData !== t) {
        a.displayData = t;

        if (e === this._displayIndex) {
          this._displayDataDirty = true;
        }
      }
    };

    r.prototype.replaceTextureData = function (t, e) {
      if (e === void 0) {
        e = -1;
      }

      if (e < 0) {
        e = this._displayIndex < 0 ? 0 : this._displayIndex;
      } else if (e >= this._displayFrames.length) {
        return;
      }

      var a = this._displayFrames[e];

      if (a.textureData !== t) {
        a.textureData = t;

        if (e === this._displayIndex) {
          this._displayDataDirty = true;
        }
      }
    };

    r.prototype.replaceDisplay = function (e, a) {
      if (a === void 0) {
        a = -1;
      }

      if (a < 0) {
        a = this._displayIndex < 0 ? 0 : this._displayIndex;
      } else if (a >= this._displayFrames.length) {
        return;
      }

      var r = this._displayFrames[a];

      if (r.display !== e) {
        var i = r.display;
        r.display = e;

        if (i !== null && i !== this._rawDisplay && i !== this._meshDisplay && !this._hasDisplay(i)) {
          if (i instanceof t.Armature) {} else {
            this._disposeDisplay(i, true);
          }
        }

        if (e !== null && e !== this._rawDisplay && e !== this._meshDisplay && !this._hasDisplay(i) && !(e instanceof t.Armature)) {
          this._initDisplay(e, true);
        }

        if (a === this._displayIndex) {
          this._displayDirty = true;
        }
      }
    };

    r.prototype.containsPoint = function (t, e) {
      if (this._boundingBoxData === null) {
        return false;
      }

      this.updateTransformAndMatrix();

      r._helpMatrix.copyFrom(this.globalTransformMatrix);

      r._helpMatrix.invert();

      r._helpMatrix.transformPoint(t, e, r._helpPoint);

      return this._boundingBoxData.containsPoint(r._helpPoint.x, r._helpPoint.y);
    };

    r.prototype.intersectsSegment = function (t, e, a, i, n, s, o) {
      if (n === void 0) {
        n = null;
      }

      if (s === void 0) {
        s = null;
      }

      if (o === void 0) {
        o = null;
      }

      if (this._boundingBoxData === null) {
        return 0;
      }

      this.updateTransformAndMatrix();

      r._helpMatrix.copyFrom(this.globalTransformMatrix);

      r._helpMatrix.invert();

      r._helpMatrix.transformPoint(t, e, r._helpPoint);

      t = r._helpPoint.x;
      e = r._helpPoint.y;

      r._helpMatrix.transformPoint(a, i, r._helpPoint);

      a = r._helpPoint.x;
      i = r._helpPoint.y;

      var l = this._boundingBoxData.intersectsSegment(t, e, a, i, n, s, o);

      if (l > 0) {
        if (l === 1 || l === 2) {
          if (n !== null) {
            this.globalTransformMatrix.transformPoint(n.x, n.y, n);

            if (s !== null) {
              s.x = n.x;
              s.y = n.y;
            }
          } else if (s !== null) {
            this.globalTransformMatrix.transformPoint(s.x, s.y, s);
          }
        } else {
          if (n !== null) {
            this.globalTransformMatrix.transformPoint(n.x, n.y, n);
          }

          if (s !== null) {
            this.globalTransformMatrix.transformPoint(s.x, s.y, s);
          }
        }

        if (o !== null) {
          this.globalTransformMatrix.transformPoint(Math.cos(o.x), Math.sin(o.x), r._helpPoint, true);
          o.x = Math.atan2(r._helpPoint.y, r._helpPoint.x);
          this.globalTransformMatrix.transformPoint(Math.cos(o.y), Math.sin(o.y), r._helpPoint, true);
          o.y = Math.atan2(r._helpPoint.y, r._helpPoint.x);
        }
      }

      return l;
    };

    r.prototype.getDisplayFrameAt = function (t) {
      return this._displayFrames[t];
    };

    Object.defineProperty(r.prototype, "visible", {
      get: function get() {
        return this._visible;
      },
      set: function set(t) {
        if (this._visible === t) {
          return;
        }

        this._visible = t;

        this._updateVisible();
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "displayFrameCount", {
      get: function get() {
        return this._displayFrames.length;
      },
      set: function set(a) {
        var r = this._displayFrames.length;

        if (r < a) {
          this._displayFrames.length = a;

          for (var i = r; i < a; ++i) {
            this._displayFrames[i] = t.BaseObject.borrowObject(e);
          }
        } else if (r > a) {
          for (var i = r - 1; i < a; --i) {
            this.replaceDisplay(null, i);

            this._displayFrames[i].returnToPool();
          }

          this._displayFrames.length = a;
        }
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "displayIndex", {
      get: function get() {
        return this._displayIndex;
      },
      set: function set(t) {
        this._setDisplayIndex(t);

        this.update(-1);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "name", {
      get: function get() {
        return this._slotData.name;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "displayList", {
      get: function get() {
        var t = new Array();

        for (var e = 0, a = this._displayFrames; e < a.length; e++) {
          var r = a[e];
          t.push(r.display);
        }

        return t;
      },
      set: function set(t) {
        this.displayFrameCount = t.length;
        var e = 0;

        for (var a = 0, r = t; a < r.length; a++) {
          var i = r[a];
          this.replaceDisplay(i, e++);
        }
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "slotData", {
      get: function get() {
        return this._slotData;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "boundingBoxData", {
      get: function get() {
        return this._boundingBoxData;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "rawDisplay", {
      get: function get() {
        return this._rawDisplay;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "meshDisplay", {
      get: function get() {
        return this._meshDisplay;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "display", {
      get: function get() {
        return this._display;
      },
      set: function set(t) {
        if (this._display === t) {
          return;
        }

        if (this._displayFrames.length === 0) {
          this.displayFrameCount = 1;
          this._displayIndex = 0;
        }

        this.replaceDisplay(t, this._displayIndex);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "childArmature", {
      get: function get() {
        return this._childArmature;
      },
      set: function set(t) {
        if (this._childArmature === t) {
          return;
        }

        this.display = t;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "parent", {
      get: function get() {
        return this._parent;
      },
      enumerable: true,
      configurable: true
    });

    r.prototype.getDisplay = function () {
      return this._display;
    };

    r.prototype.setDisplay = function (t) {
      this.display = t;
    };

    return r;
  }(t.TransformObject);

  t.Slot = a;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (e) {
    __extends(a, e);

    function a() {
      return e !== null && e.apply(this, arguments) || this;
    }

    a.prototype._onClear = function () {
      this._armature = null;
      this._target = null;
      this._root = null;
      this._bone = null;
    };

    Object.defineProperty(a.prototype, "name", {
      get: function get() {
        return this._constraintData.name;
      },
      enumerable: true,
      configurable: true
    });
    a._helpMatrix = new t.Matrix();
    a._helpTransform = new t.Transform();
    a._helpPoint = new t.Point();
    return a;
  }(t.BaseObject);

  t.Constraint = e;

  var a = function (e) {
    __extends(a, e);

    function a() {
      return e !== null && e.apply(this, arguments) || this;
    }

    a.toString = function () {
      return "[class dragonBones.IKConstraint]";
    };

    a.prototype._onClear = function () {
      e.prototype._onClear.call(this);

      this._scaleEnabled = false;
      this._bendPositive = false;
      this._weight = 1;
      this._constraintData = null;
    };

    a.prototype._computeA = function () {
      var e = this._target.global;
      var a = this._root.global;
      var r = this._root.globalTransformMatrix;
      var i = Math.atan2(e.y - a.y, e.x - a.x);

      if (a.scaleX < 0) {
        i += Math.PI;
      }

      a.rotation += t.Transform.normalizeRadian(i - a.rotation) * this._weight;
      a.toMatrix(r);
    };

    a.prototype._computeB = function () {
      var e = this._bone._boneData.length;
      var a = this._root;
      var r = this._target.global;
      var i = a.global;
      var n = this._bone.global;
      var s = this._bone.globalTransformMatrix;
      var o = s.a * e;
      var l = s.b * e;
      var h = o * o + l * l;
      var u = Math.sqrt(h);
      var f = n.x - i.x;

      var _ = n.y - i.y;

      var m = f * f + _ * _;
      var p = Math.sqrt(m);
      var c = n.rotation;
      var d = i.rotation;
      var y = Math.atan2(_, f);
      f = r.x - i.x;
      _ = r.y - i.y;
      var v = f * f + _ * _;
      var g = Math.sqrt(v);
      var D = 0;

      if (u + p <= g || g + u <= p || g + p <= u) {
        D = Math.atan2(r.y - i.y, r.x - i.x);

        if (u + p <= g) {} else if (p < u) {
          D += Math.PI;
        }
      } else {
        var T = (m - h + v) / (2 * v);
        var b = Math.sqrt(m - T * T * v) / g;
        var A = i.x + f * T;
        var P = i.y + _ * T;
        var S = -_ * b;
        var O = f * b;
        var x = false;
        var B = a.parent;

        if (B !== null) {
          var E = B.globalTransformMatrix;
          x = E.a * E.d - E.b * E.c < 0;
        }

        if (x !== this._bendPositive) {
          n.x = A - S;
          n.y = P - O;
        } else {
          n.x = A + S;
          n.y = P + O;
        }

        D = Math.atan2(n.y - i.y, n.x - i.x);
      }

      var M = t.Transform.normalizeRadian(D - y);
      i.rotation = d + M * this._weight;
      i.toMatrix(a.globalTransformMatrix);
      var I = y + M * this._weight;
      n.x = i.x + Math.cos(I) * p;
      n.y = i.y + Math.sin(I) * p;
      var F = Math.atan2(r.y - n.y, r.x - n.x);

      if (n.scaleX < 0) {
        F += Math.PI;
      }

      n.rotation = i.rotation + c - d + t.Transform.normalizeRadian(F - M - c) * this._weight;
      n.toMatrix(s);
    };

    a.prototype.init = function (t, e) {
      if (this._constraintData !== null) {
        return;
      }

      this._constraintData = t;
      this._armature = e;
      this._target = this._armature.getBone(this._constraintData.target.name);
      this._root = this._armature.getBone(this._constraintData.root.name);
      this._bone = this._constraintData.bone !== null ? this._armature.getBone(this._constraintData.bone.name) : null;
      {
        var a = this._constraintData;
        this._scaleEnabled = a.scaleEnabled;
        this._bendPositive = a.bendPositive;
        this._weight = a.weight;
      }
      this._root._hasConstraint = true;
    };

    a.prototype.update = function () {
      this._root.updateByConstraint();

      if (this._bone !== null) {
        this._bone.updateByConstraint();

        this._computeB();
      } else {
        this._computeA();
      }
    };

    a.prototype.invalidUpdate = function () {
      this._root.invalidUpdate();

      if (this._bone !== null) {
        this._bone.invalidUpdate();
      }
    };

    return a;
  }(e);

  t.IKConstraint = a;

  var r = function (e) {
    __extends(a, e);

    function a() {
      var t = e !== null && e.apply(this, arguments) || this;
      t._bones = [];
      t._spaces = [];
      t._positions = [];
      t._curves = [];
      t._boneLengths = [];
      t._pathGlobalVertices = [];
      t._segments = [10];
      return t;
    }

    a.toString = function () {
      return "[class dragonBones.PathConstraint]";
    };

    a.prototype._onClear = function () {
      e.prototype._onClear.call(this);

      this.dirty = false;
      this.pathOffset = 0;
      this.position = 0;
      this.spacing = 0;
      this.rotateOffset = 0;
      this.rotateMix = 1;
      this.translateMix = 1;
      this._pathSlot = null;
      this._bones.length = 0;
      this._spaces.length = 0;
      this._positions.length = 0;
      this._curves.length = 0;
      this._boneLengths.length = 0;
      this._pathGlobalVertices.length = 0;
    };

    a.prototype._updatePathVertices = function (t) {
      var e = this._armature;
      var a = e.armatureData.parent;
      var r = e.armatureData.scale;
      var i = a.intArray;
      var n = a.floatArray;
      var s = t.offset;
      var o = i[s + 0];
      var l = i[s + 2];
      this._pathGlobalVertices.length = o * 2;
      var h = t.weight;

      if (h === null) {
        var u = this._pathSlot.parent;
        u.updateByConstraint();
        var f = u.globalTransformMatrix;

        for (var _ = 0, m = l; _ < o; _ += 2) {
          var p = n[m++] * r;
          var c = n[m++] * r;
          var d = f.a * p + f.c * c + f.tx;
          var y = f.b * p + f.d * c + f.ty;
          this._pathGlobalVertices[_] = d;
          this._pathGlobalVertices[_ + 1] = y;
        }

        return;
      }

      var v = this._pathSlot._geometryBones;
      var g = h.bones.length;
      var D = h.offset;
      var T = i[D + 1];
      var b = T;
      var A = D + 2 + g;

      for (var _ = 0, P = 0; _ < o; _++) {
        var S = i[A++];
        var O = 0,
            x = 0;

        for (var B = 0, E = S; B < E; B++) {
          var M = i[A++];
          var I = v[M];

          if (I === null) {
            continue;
          }

          I.updateByConstraint();
          var f = I.globalTransformMatrix;
          var F = n[b++];
          var p = n[b++] * r;
          var c = n[b++] * r;
          O += (f.a * p + f.c * c + f.tx) * F;
          x += (f.b * p + f.d * c + f.ty) * F;
        }

        this._pathGlobalVertices[P++] = O;
        this._pathGlobalVertices[P++] = x;
      }
    };

    a.prototype._computeVertices = function (t, e, a, r) {
      for (var i = a, n = t; i < e; i += 2) {
        r[i] = this._pathGlobalVertices[n++];
        r[i + 1] = this._pathGlobalVertices[n++];
      }
    };

    a.prototype._computeBezierCurve = function (t, e, a, r, i) {
      var n = this._armature;
      var s = n.armatureData.parent.intArray;
      var o = s[t.geometry.offset + 0];
      var l = this._positions;
      var h = this._spaces;
      var u = t.closed;
      var f = Array();

      var _ = o * 2;

      var m = _ / 6;
      var p = -1;
      var c = this.position;
      l.length = e * 3 + 2;
      var d = 0;

      if (!t.constantSpeed) {
        var y = t.curveLengths;
        m -= u ? 1 : 2;
        d = y[m];

        if (r) {
          c *= d;
        }

        if (i) {
          for (var v = 0; v < e; v++) {
            h[v] *= d;
          }
        }

        f.length = 8;

        for (var v = 0, g = 0, D = 0; v < e; v++, g += 3) {
          var T = h[v];
          c += T;

          if (u) {
            c %= d;

            if (c < 0) {
              c += d;
            }

            D = 0;
          } else if (c < 0) {
            continue;
          } else if (c > d) {
            continue;
          }

          var b = 0;

          for (;; D++) {
            var A = y[D];

            if (c > A) {
              continue;
            }

            if (D === 0) {
              b = c / A;
            } else {
              var P = y[D - 1];
              b = (c - P) / (A - P);
            }

            break;
          }

          if (D !== p) {
            p = D;

            if (u && D === m) {
              this._computeVertices(_ - 4, 4, 0, f);

              this._computeVertices(0, 4, 4, f);
            } else {
              this._computeVertices(D * 6 + 2, 8, 0, f);
            }
          }

          this.addCurvePosition(b, f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7], l, g, a);
        }

        return;
      }

      if (u) {
        _ += 2;
        f.length = o;

        this._computeVertices(2, _ - 4, 0, f);

        this._computeVertices(0, 2, _ - 4, f);

        f[_ - 2] = f[0];
        f[_ - 1] = f[1];
      } else {
        m--;
        _ -= 4;
        f.length = _;

        this._computeVertices(2, _, 0, f);
      }

      var S = new Array(m);
      d = 0;
      var O = f[0],
          x = f[1],
          B = 0,
          E = 0,
          M = 0,
          I = 0,
          F = 0,
          C = 0;
      var w, N, R, k, j, L, V, Y;

      for (var v = 0, X = 2; v < m; v++, X += 6) {
        B = f[X];
        E = f[X + 1];
        M = f[X + 2];
        I = f[X + 3];
        F = f[X + 4];
        C = f[X + 5];
        w = (O - B * 2 + M) * .1875;
        N = (x - E * 2 + I) * .1875;
        R = ((B - M) * 3 - O + F) * .09375;
        k = ((E - I) * 3 - x + C) * .09375;
        j = w * 2 + R;
        L = N * 2 + k;
        V = (B - O) * .75 + w + R * .16666667;
        Y = (E - x) * .75 + N + k * .16666667;
        d += Math.sqrt(V * V + Y * Y);
        V += j;
        Y += L;
        j += R;
        L += k;
        d += Math.sqrt(V * V + Y * Y);
        V += j;
        Y += L;
        d += Math.sqrt(V * V + Y * Y);
        V += j + R;
        Y += L + k;
        d += Math.sqrt(V * V + Y * Y);
        S[v] = d;
        O = F;
        x = C;
      }

      if (r) {
        c *= d;
      }

      if (i) {
        for (var v = 0; v < e; v++) {
          h[v] *= d;
        }
      }

      var U = this._segments;
      var G = 0;

      for (var v = 0, g = 0, D = 0, H = 0; v < e; v++, g += 3) {
        var T = h[v];
        c += T;
        var z = c;

        if (u) {
          z %= d;
          if (z < 0) z += d;
          D = 0;
        } else if (z < 0) {
          continue;
        } else if (z > d) {
          continue;
        }

        for (;; D++) {
          var W = S[D];
          if (z > W) continue;
          if (D === 0) z /= W;else {
            var K = S[D - 1];
            z = (z - K) / (W - K);
          }
          break;
        }

        if (D !== p) {
          p = D;
          var Z = D * 6;
          O = f[Z];
          x = f[Z + 1];
          B = f[Z + 2];
          E = f[Z + 3];
          M = f[Z + 4];
          I = f[Z + 5];
          F = f[Z + 6];
          C = f[Z + 7];
          w = (O - B * 2 + M) * .03;
          N = (x - E * 2 + I) * .03;
          R = ((B - M) * 3 - O + F) * .006;
          k = ((E - I) * 3 - x + C) * .006;
          j = w * 2 + R;
          L = N * 2 + k;
          V = (B - O) * .3 + w + R * .16666667;
          Y = (E - x) * .3 + N + k * .16666667;
          G = Math.sqrt(V * V + Y * Y);
          U[0] = G;

          for (Z = 1; Z < 8; Z++) {
            V += j;
            Y += L;
            j += R;
            L += k;
            G += Math.sqrt(V * V + Y * Y);
            U[Z] = G;
          }

          V += j;
          Y += L;
          G += Math.sqrt(V * V + Y * Y);
          U[8] = G;
          V += j + R;
          Y += L + k;
          G += Math.sqrt(V * V + Y * Y);
          U[9] = G;
          H = 0;
        }

        z *= G;

        for (;; H++) {
          var q = U[H];
          if (z > q) continue;
          if (H === 0) z /= q;else {
            var K = U[H - 1];
            z = H + (z - K) / (q - K);
          }
          break;
        }

        this.addCurvePosition(z * .1, O, x, B, E, M, I, F, C, l, g, a);
      }
    };

    a.prototype.addCurvePosition = function (t, e, a, r, i, n, s, o, l, h, u, f) {
      if (t === 0) {
        h[u] = e;
        h[u + 1] = a;
        h[u + 2] = 0;
        return;
      }

      if (t === 1) {
        h[u] = o;
        h[u + 1] = l;
        h[u + 2] = 0;
        return;
      }

      var _ = 1 - t;

      var m = _ * _;
      var p = t * t;
      var c = m * _;
      var d = m * t * 3;
      var y = _ * p * 3;
      var v = t * p;
      var g = c * e + d * r + y * n + v * o;
      var D = c * a + d * i + y * s + v * l;
      h[u] = g;
      h[u + 1] = D;

      if (f) {
        h[u + 2] = Math.atan2(D - (c * a + d * i + y * s), g - (c * e + d * r + y * n));
      } else {
        h[u + 2] = 0;
      }
    };

    a.prototype.init = function (t, e) {
      this._constraintData = t;
      this._armature = e;
      var a = t;
      this.pathOffset = a.pathDisplayData.geometry.offset;
      this.position = a.position;
      this.spacing = a.spacing;
      this.rotateOffset = a.rotateOffset;
      this.rotateMix = a.rotateMix;
      this.translateMix = a.translateMix;
      this._root = this._armature.getBone(a.root.name);
      this._target = this._armature.getBone(a.target.name);
      this._pathSlot = this._armature.getSlot(a.pathSlot.name);

      for (var r = 0, i = a.bones.length; r < i; r++) {
        var n = this._armature.getBone(a.bones[r].name);

        if (n !== null) {
          this._bones.push(n);
        }
      }

      if (a.rotateMode === 2) {
        this._boneLengths.length = this._bones.length;
      }

      this._root._hasConstraint = true;
    };

    a.prototype.update = function () {
      var e = this._pathSlot;

      if (e._geometryData === null || e._geometryData.offset !== this.pathOffset) {
        return;
      }

      var a = this._constraintData;
      var r = false;

      if (this._root._childrenTransformDirty) {
        this._updatePathVertices(e._geometryData);

        r = true;
      } else if (e._verticesDirty || e._isBonesUpdate()) {
        this._updatePathVertices(e._geometryData);

        e._verticesDirty = false;
        r = true;
      }

      if (!r && !this.dirty) {
        return;
      }

      var i = a.positionMode;
      var n = a.spacingMode;
      var s = a.rotateMode;
      var o = this._bones;
      var l = n === 0;
      var h = s === 2;
      var u = s === 0;
      var f = o.length;

      var _ = u ? f : f + 1;

      var m = this.spacing;
      var p = this._spaces;
      p.length = _;

      if (h || l) {
        p[0] = 0;

        for (var c = 0, d = _ - 1; c < d; c++) {
          var y = o[c];
          y.updateByConstraint();
          var v = y._boneData.length;
          var g = y.globalTransformMatrix;
          var D = v * g.a;
          var T = v * g.b;
          var b = Math.sqrt(D * D + T * T);

          if (h) {
            this._boneLengths[c] = b;
          }

          p[c + 1] = (v + m) * b / v;
        }
      } else {
        for (var c = 0; c < _; c++) {
          p[c] = m;
        }
      }

      this._computeBezierCurve(e._displayFrame.rawDisplayData, _, u, i === 1, n === 2);

      var A = this._positions;
      var P = this.rotateOffset;
      var S = A[0],
          O = A[1];
      var x;

      if (P === 0) {
        x = s === 1;
      } else {
        x = false;
        var y = e.parent;

        if (y !== null) {
          var g = y.globalTransformMatrix;
          P *= g.a * g.d - g.b * g.c > 0 ? t.Transform.DEG_RAD : -t.Transform.DEG_RAD;
        }
      }

      var B = this.rotateMix;
      var E = this.translateMix;

      for (var c = 0, M = 3; c < f; c++, M += 3) {
        var y = o[c];
        y.updateByConstraint();
        var g = y.globalTransformMatrix;
        g.tx += (S - g.tx) * E;
        g.ty += (O - g.ty) * E;
        var D = A[M],
            T = A[M + 1];
        var I = D - S,
            F = T - O;

        if (h) {
          var C = this._boneLengths[c];
          var w = (Math.sqrt(I * I + F * F) / C - 1) * B + 1;
          g.a *= w;
          g.b *= w;
        }

        S = D;
        O = T;

        if (B > 0) {
          var N = g.a,
              R = g.b,
              k = g.c,
              j = g.d,
              L = void 0,
              V = void 0,
              Y = void 0;

          if (u) {
            L = A[M - 1];
          } else {
            L = Math.atan2(F, I);
          }

          L -= Math.atan2(R, N);

          if (x) {
            V = Math.cos(L);
            Y = Math.sin(L);
            var X = y._boneData.length;
            S += (X * (V * N - Y * R) - I) * B;
            O += (X * (Y * N + V * R) - F) * B;
          } else {
            L += P;
          }

          if (L > t.Transform.PI) {
            L -= t.Transform.PI_D;
          } else if (L < -t.Transform.PI) {
            L += t.Transform.PI_D;
          }

          L *= B;
          V = Math.cos(L);
          Y = Math.sin(L);
          g.a = V * N - Y * R;
          g.b = Y * N + V * R;
          g.c = V * k - Y * j;
          g.d = Y * k + V * j;
        }

        y.global.fromMatrix(g);
      }

      this.dirty = false;
    };

    a.prototype.invalidUpdate = function () {};

    return a;
  }(e);

  t.PathConstraint = r;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function () {
    function t(t) {
      if (t === void 0) {
        t = 0;
      }

      this.time = 0;
      this.timeScale = 1;
      this._systemTime = 0;
      this._animatebles = [];
      this._clock = null;
      this.time = t;
      this._systemTime = new Date().getTime() * .001;
    }

    t.prototype.advanceTime = function (t) {
      if (t !== t) {
        t = 0;
      }

      var e = Date.now() * .001;

      if (t < 0) {
        t = e - this._systemTime;
      }

      this._systemTime = e;

      if (this.timeScale !== 1) {
        t *= this.timeScale;
      }

      if (t === 0) {
        return;
      }

      if (t < 0) {
        this.time -= t;
      } else {
        this.time += t;
      }

      var a = 0,
          r = 0,
          i = this._animatebles.length;

      for (; a < i; ++a) {
        var n = this._animatebles[a];

        if (n !== null) {
          if (r > 0) {
            this._animatebles[a - r] = n;
            this._animatebles[a] = null;
          }

          n.advanceTime(t);
        } else {
          r++;
        }
      }

      if (r > 0) {
        i = this._animatebles.length;

        for (; a < i; ++a) {
          var s = this._animatebles[a];

          if (s !== null) {
            this._animatebles[a - r] = s;
          } else {
            r++;
          }
        }

        this._animatebles.length -= r;
      }
    };

    t.prototype.contains = function (t) {
      if (t === this) {
        return false;
      }

      var e = t;

      while (e !== this && e !== null) {
        e = e.clock;
      }

      return e === this;
    };

    t.prototype.add = function (t) {
      if (this._animatebles.indexOf(t) < 0) {
        this._animatebles.push(t);

        t.clock = this;
      }
    };

    t.prototype.remove = function (t) {
      var e = this._animatebles.indexOf(t);

      if (e >= 0) {
        this._animatebles[e] = null;
        t.clock = null;
      }
    };

    t.prototype.clear = function () {
      for (var t = 0, e = this._animatebles; t < e.length; t++) {
        var a = e[t];

        if (a !== null) {
          a.clock = null;
        }
      }
    };

    Object.defineProperty(t.prototype, "clock", {
      get: function get() {
        return this._clock;
      },
      set: function set(t) {
        if (this._clock === t) {
          return;
        }

        if (this._clock !== null) {
          this._clock.remove(this);
        }

        this._clock = t;

        if (this._clock !== null) {
          this._clock.add(this);
        }
      },
      enumerable: true,
      configurable: true
    });
    return t;
  }();

  t.WorldClock = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (e) {
    __extends(a, e);

    function a() {
      var t = e !== null && e.apply(this, arguments) || this;
      t._animationNames = [];
      t._animationStates = [];
      t._animations = {};
      t._blendStates = {};
      t._animationConfig = null;
      return t;
    }

    a.toString = function () {
      return "[class dragonBones.Animation]";
    };

    a.prototype._onClear = function () {
      for (var t = 0, e = this._animationStates; t < e.length; t++) {
        var a = e[t];
        a.returnToPool();
      }

      for (var r in this._animations) {
        delete this._animations[r];
      }

      for (var r in this._blendStates) {
        var i = this._blendStates[r];

        for (var n in i) {
          i[n].returnToPool();
        }

        delete this._blendStates[r];
      }

      if (this._animationConfig !== null) {
        this._animationConfig.returnToPool();
      }

      this.timeScale = 1;
      this._animationDirty = false;
      this._inheritTimeScale = 1;
      this._animationNames.length = 0;
      this._animationStates.length = 0;
      this._armature = null;
      this._animationConfig = null;
      this._lastAnimationState = null;
    };

    a.prototype._fadeOut = function (t) {
      switch (t.fadeOutMode) {
        case 1:
          for (var e = 0, a = this._animationStates; e < a.length; e++) {
            var r = a[e];

            if (r._parent !== null) {
              continue;
            }

            if (r.layer === t.layer) {
              r.fadeOut(t.fadeOutTime, t.pauseFadeOut);
            }
          }

          break;

        case 2:
          for (var i = 0, n = this._animationStates; i < n.length; i++) {
            var r = n[i];

            if (r._parent !== null) {
              continue;
            }

            if (r.group === t.group) {
              r.fadeOut(t.fadeOutTime, t.pauseFadeOut);
            }
          }

          break;

        case 3:
          for (var s = 0, o = this._animationStates; s < o.length; s++) {
            var r = o[s];

            if (r._parent !== null) {
              continue;
            }

            if (r.layer === t.layer && r.group === t.group) {
              r.fadeOut(t.fadeOutTime, t.pauseFadeOut);
            }
          }

          break;

        case 4:
          for (var l = 0, h = this._animationStates; l < h.length; l++) {
            var r = h[l];

            if (r._parent !== null) {
              continue;
            }

            r.fadeOut(t.fadeOutTime, t.pauseFadeOut);
          }

          break;

        case 5:
        default:
          break;
      }
    };

    a.prototype.init = function (e) {
      if (this._armature !== null) {
        return;
      }

      this._armature = e;
      this._animationConfig = t.BaseObject.borrowObject(t.AnimationConfig);
    };

    a.prototype.advanceTime = function (t) {
      if (t < 0) {
        t = -t;
      }

      if (this._armature.inheritAnimation && this._armature._parent !== null) {
        this._inheritTimeScale = this._armature._parent._armature.animation._inheritTimeScale * this.timeScale;
      } else {
        this._inheritTimeScale = this.timeScale;
      }

      if (this._inheritTimeScale !== 1) {
        t *= this._inheritTimeScale;
      }

      for (var e in this._blendStates) {
        var a = this._blendStates[e];

        for (var r in a) {
          a[r].reset();
        }
      }

      var i = this._animationStates.length;

      if (i === 1) {
        var n = this._animationStates[0];

        if (n._fadeState > 0 && n._subFadeState > 0) {
          this._armature._dragonBones.bufferObject(n);

          this._animationStates.length = 0;
          this._lastAnimationState = null;
        } else {
          var s = n.animationData;
          var o = s.cacheFrameRate;

          if (this._animationDirty && o > 0) {
            this._animationDirty = false;

            for (var l = 0, h = this._armature.getBones(); l < h.length; l++) {
              var u = h[l];
              u._cachedFrameIndices = s.getBoneCachedFrameIndices(u.name);
            }

            for (var f = 0, _ = this._armature.getSlots(); f < _.length; f++) {
              var m = _[f];

              if (m.displayFrameCount > 0) {
                var p = m.getDisplayFrameAt(0).rawDisplayData;

                if (p !== null && p.parent === this._armature.armatureData.defaultSkin) {
                  m._cachedFrameIndices = s.getSlotCachedFrameIndices(m.name);
                  continue;
                }
              }

              m._cachedFrameIndices = null;
            }
          }

          n.advanceTime(t, o);
        }
      } else if (i > 1) {
        for (var c = 0, d = 0; c < i; ++c) {
          var n = this._animationStates[c];

          if (n._fadeState > 0 && n._subFadeState > 0) {
            d++;

            this._armature._dragonBones.bufferObject(n);

            this._animationDirty = true;

            if (this._lastAnimationState === n) {
              this._lastAnimationState = null;
            }
          } else {
            if (d > 0) {
              this._animationStates[c - d] = n;
            }

            n.advanceTime(t, 0);
          }

          if (c === i - 1 && d > 0) {
            this._animationStates.length -= d;

            if (this._lastAnimationState === null && this._animationStates.length > 0) {
              this._lastAnimationState = this._animationStates[this._animationStates.length - 1];
            }
          }
        }

        this._armature._cacheFrameIndex = -1;
      } else {
        this._armature._cacheFrameIndex = -1;
      }
    };

    a.prototype.reset = function () {
      for (var t = 0, e = this._animationStates; t < e.length; t++) {
        var a = e[t];
        a.returnToPool();
      }

      this._animationDirty = false;

      this._animationConfig.clear();

      this._animationStates.length = 0;
      this._lastAnimationState = null;
    };

    a.prototype.stop = function (t) {
      if (t === void 0) {
        t = null;
      }

      if (t !== null) {
        var e = this.getState(t);

        if (e !== null) {
          e.stop();
        }
      } else {
        for (var a = 0, r = this._animationStates; a < r.length; a++) {
          var e = r[a];
          e.stop();
        }
      }
    };

    a.prototype.playConfig = function (e) {
      var a = e.animation;

      if (!(a in this._animations)) {
        console.warn("Non-existent animation.\n", "DragonBones name: " + this._armature.armatureData.parent.name, "Armature name: " + this._armature.name, "Animation name: " + a);
        return null;
      }

      var r = this._animations[a];

      if (e.fadeOutMode === 5) {
        for (var i = 0, n = this._animationStates; i < n.length; i++) {
          var s = n[i];

          if (s._fadeState < 1 && s.layer === e.layer && s.animationData === r) {
            return s;
          }
        }
      }

      if (this._animationStates.length === 0) {
        e.fadeInTime = 0;
      } else if (e.fadeInTime < 0) {
        e.fadeInTime = r.fadeInTime;
      }

      if (e.fadeOutTime < 0) {
        e.fadeOutTime = e.fadeInTime;
      }

      if (e.timeScale <= -100) {
        e.timeScale = 1 / r.scale;
      }

      if (r.frameCount > 0) {
        if (e.position < 0) {
          e.position %= r.duration;
          e.position = r.duration - e.position;
        } else if (e.position === r.duration) {
          e.position -= 1e-6;
        } else if (e.position > r.duration) {
          e.position %= r.duration;
        }

        if (e.duration > 0 && e.position + e.duration > r.duration) {
          e.duration = r.duration - e.position;
        }

        if (e.playTimes < 0) {
          e.playTimes = r.playTimes;
        }
      } else {
        e.playTimes = 1;
        e.position = 0;

        if (e.duration > 0) {
          e.duration = 0;
        }
      }

      if (e.duration === 0) {
        e.duration = -1;
      }

      this._fadeOut(e);

      var o = t.BaseObject.borrowObject(t.AnimationState);
      o.init(this._armature, r, e);
      this._animationDirty = true;
      this._armature._cacheFrameIndex = -1;

      if (this._animationStates.length > 0) {
        var l = false;

        for (var h = 0, u = this._animationStates.length; h < u; ++h) {
          if (o.layer > this._animationStates[h].layer) {
            l = true;

            this._animationStates.splice(h, 0, o);

            break;
          } else if (h !== u - 1 && o.layer > this._animationStates[h + 1].layer) {
            l = true;

            this._animationStates.splice(h + 1, 0, o);

            break;
          }
        }

        if (!l) {
          this._animationStates.push(o);
        }
      } else {
        this._animationStates.push(o);
      }

      for (var f = 0, _ = this._armature.getSlots(); f < _.length; f++) {
        var m = _[f];
        var p = m.childArmature;

        if (p !== null && p.inheritAnimation && p.animation.hasAnimation(a) && p.animation.getState(a) === null) {
          p.animation.fadeIn(a);
        }
      }

      for (var c in r.animationTimelines) {
        var d = this.fadeIn(c, 0, 1, o.layer, "", 5);

        if (d === null) {
          continue;
        }

        var y = r.animationTimelines[c];
        d.actionEnabled = false;
        d.resetToPose = false;
        d.stop();
        o.addState(d, y);

        var v = this._animationStates.indexOf(o);

        var g = this._animationStates.indexOf(d);

        if (g < v) {
          this._animationStates.splice(v, 1);

          this._animationStates.splice(g, 0, o);
        }
      }

      this._lastAnimationState = o;
      return o;
    };

    a.prototype.play = function (t, e) {
      if (t === void 0) {
        t = null;
      }

      if (e === void 0) {
        e = -1;
      }

      this._animationConfig.clear();

      this._animationConfig.resetToPose = true;
      this._animationConfig.playTimes = e;
      this._animationConfig.fadeInTime = 0;
      this._animationConfig.animation = t !== null ? t : "";

      if (t !== null && t.length > 0) {
        this.playConfig(this._animationConfig);
      } else if (this._lastAnimationState === null) {
        var a = this._armature.armatureData.defaultAnimation;

        if (a !== null) {
          this._animationConfig.animation = a.name;
          this.playConfig(this._animationConfig);
        }
      } else if (!this._lastAnimationState.isPlaying && !this._lastAnimationState.isCompleted) {
        this._lastAnimationState.play();
      } else {
        this._animationConfig.animation = this._lastAnimationState.name;
        this.playConfig(this._animationConfig);
      }

      return this._lastAnimationState;
    };

    a.prototype.fadeIn = function (t, e, a, r, i, n) {
      if (e === void 0) {
        e = -1;
      }

      if (a === void 0) {
        a = -1;
      }

      if (r === void 0) {
        r = 0;
      }

      if (i === void 0) {
        i = null;
      }

      if (n === void 0) {
        n = 3;
      }

      this._animationConfig.clear();

      this._animationConfig.fadeOutMode = n;
      this._animationConfig.playTimes = a;
      this._animationConfig.layer = r;
      this._animationConfig.fadeInTime = e;
      this._animationConfig.animation = t;
      this._animationConfig.group = i !== null ? i : "";
      return this.playConfig(this._animationConfig);
    };

    a.prototype.gotoAndPlayByTime = function (t, e, a) {
      if (e === void 0) {
        e = 0;
      }

      if (a === void 0) {
        a = -1;
      }

      this._animationConfig.clear();

      this._animationConfig.resetToPose = true;
      this._animationConfig.playTimes = a;
      this._animationConfig.position = e;
      this._animationConfig.fadeInTime = 0;
      this._animationConfig.animation = t;
      return this.playConfig(this._animationConfig);
    };

    a.prototype.gotoAndPlayByFrame = function (t, e, a) {
      if (e === void 0) {
        e = 0;
      }

      if (a === void 0) {
        a = -1;
      }

      this._animationConfig.clear();

      this._animationConfig.resetToPose = true;
      this._animationConfig.playTimes = a;
      this._animationConfig.fadeInTime = 0;
      this._animationConfig.animation = t;
      var r = t in this._animations ? this._animations[t] : null;

      if (r !== null) {
        this._animationConfig.position = r.frameCount > 0 ? r.duration * e / r.frameCount : 0;
      }

      return this.playConfig(this._animationConfig);
    };

    a.prototype.gotoAndPlayByProgress = function (t, e, a) {
      if (e === void 0) {
        e = 0;
      }

      if (a === void 0) {
        a = -1;
      }

      this._animationConfig.clear();

      this._animationConfig.resetToPose = true;
      this._animationConfig.playTimes = a;
      this._animationConfig.fadeInTime = 0;
      this._animationConfig.animation = t;
      var r = t in this._animations ? this._animations[t] : null;

      if (r !== null) {
        this._animationConfig.position = r.duration * (e > 0 ? e : 0);
      }

      return this.playConfig(this._animationConfig);
    };

    a.prototype.gotoAndStopByTime = function (t, e) {
      if (e === void 0) {
        e = 0;
      }

      var a = this.gotoAndPlayByTime(t, e, 1);

      if (a !== null) {
        a.stop();
      }

      return a;
    };

    a.prototype.gotoAndStopByFrame = function (t, e) {
      if (e === void 0) {
        e = 0;
      }

      var a = this.gotoAndPlayByFrame(t, e, 1);

      if (a !== null) {
        a.stop();
      }

      return a;
    };

    a.prototype.gotoAndStopByProgress = function (t, e) {
      if (e === void 0) {
        e = 0;
      }

      var a = this.gotoAndPlayByProgress(t, e, 1);

      if (a !== null) {
        a.stop();
      }

      return a;
    };

    a.prototype.getBlendState = function (e, a, r) {
      if (!(e in this._blendStates)) {
        this._blendStates[e] = {};
      }

      var i = this._blendStates[e];

      if (!(a in i)) {
        var n = i[a] = t.BaseObject.borrowObject(t.BlendState);
        n.target = r;
      }

      return i[a];
    };

    a.prototype.getState = function (t, e) {
      if (e === void 0) {
        e = -1;
      }

      var a = this._animationStates.length;

      while (a--) {
        var r = this._animationStates[a];

        if (r.name === t && (e < 0 || r.layer === e)) {
          return r;
        }
      }

      return null;
    };

    a.prototype.hasAnimation = function (t) {
      return t in this._animations;
    };

    a.prototype.getStates = function () {
      return this._animationStates;
    };

    Object.defineProperty(a.prototype, "isPlaying", {
      get: function get() {
        for (var t = 0, e = this._animationStates; t < e.length; t++) {
          var a = e[t];

          if (a.isPlaying) {
            return true;
          }
        }

        return false;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "isCompleted", {
      get: function get() {
        for (var t = 0, e = this._animationStates; t < e.length; t++) {
          var a = e[t];

          if (!a.isCompleted) {
            return false;
          }
        }

        return this._animationStates.length > 0;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "lastAnimationName", {
      get: function get() {
        return this._lastAnimationState !== null ? this._lastAnimationState.name : "";
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "animationNames", {
      get: function get() {
        return this._animationNames;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "animations", {
      get: function get() {
        return this._animations;
      },
      set: function set(t) {
        if (this._animations === t) {
          return;
        }

        this._animationNames.length = 0;

        for (var e in this._animations) {
          delete this._animations[e];
        }

        for (var e in t) {
          this._animationNames.push(e);

          this._animations[e] = t[e];
        }
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "animationConfig", {
      get: function get() {
        this._animationConfig.clear();

        return this._animationConfig;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "lastAnimationState", {
      get: function get() {
        return this._lastAnimationState;
      },
      enumerable: true,
      configurable: true
    });
    return a;
  }(t.BaseObject);

  t.Animation = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (e) {
    __extends(r, e);

    function r() {
      var t = e !== null && e.apply(this, arguments) || this;
      t._boneMask = [];
      t._boneTimelines = [];
      t._boneBlendTimelines = [];
      t._slotTimelines = [];
      t._slotBlendTimelines = [];
      t._constraintTimelines = [];
      t._animationTimelines = [];
      t._poseTimelines = [];
      t._actionTimeline = null;
      t._zOrderTimeline = null;
      return t;
    }

    r.toString = function () {
      return "[class dragonBones.AnimationState]";
    };

    r.prototype._onClear = function () {
      for (var t = 0, e = this._boneTimelines; t < e.length; t++) {
        var a = e[t];
        a.returnToPool();
      }

      for (var r = 0, i = this._boneBlendTimelines; r < i.length; r++) {
        var a = i[r];
        a.returnToPool();
      }

      for (var n = 0, s = this._slotTimelines; n < s.length; n++) {
        var a = s[n];
        a.returnToPool();
      }

      for (var o = 0, l = this._slotBlendTimelines; o < l.length; o++) {
        var a = l[o];
        a.returnToPool();
      }

      for (var h = 0, u = this._constraintTimelines; h < u.length; h++) {
        var a = u[h];
        a.returnToPool();
      }

      for (var f = 0, _ = this._animationTimelines; f < _.length; f++) {
        var a = _[f];
        var m = a.target;

        if (m._parent === this) {
          m._fadeState = 1;
          m._subFadeState = 1;
          m._parent = null;
        }

        a.returnToPool();
      }

      if (this._actionTimeline !== null) {
        this._actionTimeline.returnToPool();
      }

      if (this._zOrderTimeline !== null) {
        this._zOrderTimeline.returnToPool();
      }

      this.actionEnabled = false;
      this.additive = false;
      this.displayControl = false;
      this.resetToPose = false;
      this.blendType = 0;
      this.playTimes = 1;
      this.layer = 0;
      this.timeScale = 1;
      this._weight = 1;
      this.parameterX = 0;
      this.parameterY = 0;
      this.positionX = 0;
      this.positionY = 0;
      this.autoFadeOutTime = 0;
      this.fadeTotalTime = 0;
      this.name = "";
      this.group = "";
      this._timelineDirty = 2;
      this._playheadState = 0;
      this._fadeState = -1;
      this._subFadeState = -1;
      this._position = 0;
      this._duration = 0;
      this._fadeTime = 0;
      this._time = 0;
      this._fadeProgress = 0;
      this._weightResult = 0;
      this._boneMask.length = 0;
      this._boneTimelines.length = 0;
      this._boneBlendTimelines.length = 0;
      this._slotTimelines.length = 0;
      this._slotBlendTimelines.length = 0;
      this._constraintTimelines.length = 0;
      this._animationTimelines.length = 0;
      this._poseTimelines.length = 0;
      this._animationData = null;
      this._armature = null;
      this._actionTimeline = null;
      this._zOrderTimeline = null;
      this._activeChildA = null;
      this._activeChildB = null;
      this._parent = null;
    };

    r.prototype._updateTimelines = function () {
      {
        for (var e = 0, a = this._armature._constraints; e < a.length; e++) {
          var r = a[e];

          var i = this._animationData.getConstraintTimelines(r.name);

          if (i !== null) {
            for (var n = 0, s = i; n < s.length; n++) {
              var o = s[n];

              switch (o.type) {
                case 30:
                  {
                    var l = t.BaseObject.borrowObject(t.IKConstraintTimelineState);
                    l.target = r;
                    l.init(this._armature, this, o);

                    this._constraintTimelines.push(l);

                    break;
                  }

                default:
                  break;
              }
            }
          } else if (this.resetToPose) {
            var l = t.BaseObject.borrowObject(t.IKConstraintTimelineState);
            l.target = r;
            l.init(this._armature, this, null);

            this._constraintTimelines.push(l);

            this._poseTimelines.push(l);
          }
        }
      }
    };

    r.prototype._updateBoneAndSlotTimelines = function () {
      {
        var e = {};

        for (var r = 0, i = this._boneTimelines; r < i.length; r++) {
          var n = i[r];
          var s = n.target.target.name;

          if (!(s in e)) {
            e[s] = [];
          }

          e[s].push(n);
        }

        for (var o = 0, l = this._boneBlendTimelines; o < l.length; o++) {
          var n = l[o];
          var s = n.target.target.name;

          if (!(s in e)) {
            e[s] = [];
          }

          e[s].push(n);
        }

        for (var h = 0, u = this._armature.getBones(); h < u.length; h++) {
          var f = u[h];
          var s = f.name;

          if (!this.containsBoneMask(s)) {
            continue;
          }

          if (s in e) {
            delete e[s];
          } else {
            var _ = this._animationData.getBoneTimelines(s);

            var m = this._armature.animation.getBlendState(a.BONE_TRANSFORM, f.name, f);

            if (_ !== null) {
              for (var p = 0, c = _; p < c.length; p++) {
                var d = c[p];

                switch (d.type) {
                  case 10:
                    {
                      var n = t.BaseObject.borrowObject(t.BoneAllTimelineState);
                      n.target = m;
                      n.init(this._armature, this, d);

                      this._boneTimelines.push(n);

                      break;
                    }

                  case 11:
                    {
                      var n = t.BaseObject.borrowObject(t.BoneTranslateTimelineState);
                      n.target = m;
                      n.init(this._armature, this, d);

                      this._boneTimelines.push(n);

                      break;
                    }

                  case 12:
                    {
                      var n = t.BaseObject.borrowObject(t.BoneRotateTimelineState);
                      n.target = m;
                      n.init(this._armature, this, d);

                      this._boneTimelines.push(n);

                      break;
                    }

                  case 13:
                    {
                      var n = t.BaseObject.borrowObject(t.BoneScaleTimelineState);
                      n.target = m;
                      n.init(this._armature, this, d);

                      this._boneTimelines.push(n);

                      break;
                    }

                  case 60:
                    {
                      var n = t.BaseObject.borrowObject(t.AlphaTimelineState);
                      n.target = this._armature.animation.getBlendState(a.BONE_ALPHA, f.name, f);
                      n.init(this._armature, this, d);

                      this._boneBlendTimelines.push(n);

                      break;
                    }

                  case 50:
                    {
                      var n = t.BaseObject.borrowObject(t.SurfaceTimelineState);
                      n.target = this._armature.animation.getBlendState(a.SURFACE, f.name, f);
                      n.init(this._armature, this, d);

                      this._boneBlendTimelines.push(n);

                      break;
                    }

                  default:
                    break;
                }
              }
            } else if (this.resetToPose) {
              if (f._boneData.type === 0) {
                var n = t.BaseObject.borrowObject(t.BoneAllTimelineState);
                n.target = m;
                n.init(this._armature, this, null);

                this._boneTimelines.push(n);

                this._poseTimelines.push(n);
              } else {
                var n = t.BaseObject.borrowObject(t.SurfaceTimelineState);
                n.target = this._armature.animation.getBlendState(a.SURFACE, f.name, f);
                n.init(this._armature, this, null);

                this._boneBlendTimelines.push(n);

                this._poseTimelines.push(n);
              }
            }
          }
        }

        for (var y in e) {
          for (var v = 0, g = e[y]; v < g.length; v++) {
            var n = g[v];

            var D = this._boneTimelines.indexOf(n);

            if (D >= 0) {
              this._boneTimelines.splice(D, 1);

              n.returnToPool();
            }

            D = this._boneBlendTimelines.indexOf(n);

            if (D >= 0) {
              this._boneBlendTimelines.splice(D, 1);

              n.returnToPool();
            }
          }
        }
      }
      {
        var T = {};
        var b = [];

        for (var A = 0, P = this._slotTimelines; A < P.length; A++) {
          var n = P[A];
          var s = n.target.name;

          if (!(s in T)) {
            T[s] = [];
          }

          T[s].push(n);
        }

        for (var S = 0, O = this._slotBlendTimelines; S < O.length; S++) {
          var n = O[S];
          var s = n.target.target.name;

          if (!(s in T)) {
            T[s] = [];
          }

          T[s].push(n);
        }

        for (var x = 0, B = this._armature.getSlots(); x < B.length; x++) {
          var E = B[x];
          var M = E.parent.name;

          if (!this.containsBoneMask(M)) {
            continue;
          }

          var s = E.name;

          if (s in T) {
            delete T[s];
          } else {
            var I = false;
            var F = false;
            b.length = 0;

            var _ = this._animationData.getSlotTimelines(s);

            if (_ !== null) {
              for (var C = 0, w = _; C < w.length; C++) {
                var d = w[C];

                switch (d.type) {
                  case 20:
                    {
                      var n = t.BaseObject.borrowObject(t.SlotDislayTimelineState);
                      n.target = E;
                      n.init(this._armature, this, d);

                      this._slotTimelines.push(n);

                      I = true;
                      break;
                    }

                  case 23:
                    {
                      var n = t.BaseObject.borrowObject(t.SlotZIndexTimelineState);
                      n.target = this._armature.animation.getBlendState(a.SLOT_Z_INDEX, E.name, E);
                      n.init(this._armature, this, d);

                      this._slotBlendTimelines.push(n);

                      break;
                    }

                  case 21:
                    {
                      var n = t.BaseObject.borrowObject(t.SlotColorTimelineState);
                      n.target = E;
                      n.init(this._armature, this, d);

                      this._slotTimelines.push(n);

                      F = true;
                      break;
                    }

                  case 22:
                    {
                      var n = t.BaseObject.borrowObject(t.DeformTimelineState);
                      n.target = this._armature.animation.getBlendState(a.SLOT_DEFORM, E.name, E);
                      n.init(this._armature, this, d);

                      if (n.target !== null) {
                        this._slotBlendTimelines.push(n);

                        b.push(n.geometryOffset);
                      } else {
                        n.returnToPool();
                      }

                      break;
                    }

                  case 24:
                    {
                      var n = t.BaseObject.borrowObject(t.AlphaTimelineState);
                      n.target = this._armature.animation.getBlendState(a.SLOT_ALPHA, E.name, E);
                      n.init(this._armature, this, d);

                      this._slotBlendTimelines.push(n);

                      break;
                    }

                  default:
                    break;
                }
              }
            }

            if (this.resetToPose) {
              if (!I) {
                var n = t.BaseObject.borrowObject(t.SlotDislayTimelineState);
                n.target = E;
                n.init(this._armature, this, null);

                this._slotTimelines.push(n);

                this._poseTimelines.push(n);
              }

              if (!F) {
                var n = t.BaseObject.borrowObject(t.SlotColorTimelineState);
                n.target = E;
                n.init(this._armature, this, null);

                this._slotTimelines.push(n);

                this._poseTimelines.push(n);
              }

              for (var N = 0, R = E.displayFrameCount; N < R; ++N) {
                var k = E.getDisplayFrameAt(N);

                if (k.deformVertices.length === 0) {
                  continue;
                }

                var j = k.getGeometryData();

                if (j !== null && b.indexOf(j.offset) < 0) {
                  var n = t.BaseObject.borrowObject(t.DeformTimelineState);
                  n.geometryOffset = j.offset;
                  n.displayFrame = k;
                  n.target = this._armature.animation.getBlendState(a.SLOT_DEFORM, E.name, E);
                  n.init(this._armature, this, null);

                  this._slotBlendTimelines.push(n);

                  this._poseTimelines.push(n);
                }
              }
            }
          }
        }

        for (var y in T) {
          for (var L = 0, V = T[y]; L < V.length; L++) {
            var n = V[L];

            var D = this._slotTimelines.indexOf(n);

            if (D >= 0) {
              this._slotTimelines.splice(D, 1);

              n.returnToPool();
            }

            D = this._slotBlendTimelines.indexOf(n);

            if (D >= 0) {
              this._slotBlendTimelines.splice(D, 1);

              n.returnToPool();
            }
          }
        }
      }
    };

    r.prototype._advanceFadeTime = function (e) {
      var a = this._fadeState > 0;

      if (this._subFadeState < 0) {
        this._subFadeState = 0;
        var r = this._parent === null && this.actionEnabled;

        if (r) {
          var i = a ? t.EventObject.FADE_OUT : t.EventObject.FADE_IN;

          if (this._armature.eventDispatcher.hasDBEventListener(i)) {
            var n = t.BaseObject.borrowObject(t.EventObject);
            n.type = i;
            n.armature = this._armature;
            n.animationState = this;

            this._armature._dragonBones.bufferEvent(n);
          }
        }
      }

      if (e < 0) {
        e = -e;
      }

      this._fadeTime += e;

      if (this._fadeTime >= this.fadeTotalTime) {
        this._subFadeState = 1;
        this._fadeProgress = a ? 0 : 1;
      } else if (this._fadeTime > 0) {
        this._fadeProgress = a ? 1 - this._fadeTime / this.fadeTotalTime : this._fadeTime / this.fadeTotalTime;
      } else {
        this._fadeProgress = a ? 1 : 0;
      }

      if (this._subFadeState > 0) {
        if (!a) {
          this._playheadState |= 1;
          this._fadeState = 0;
        }

        var r = this._parent === null && this.actionEnabled;

        if (r) {
          var i = a ? t.EventObject.FADE_OUT_COMPLETE : t.EventObject.FADE_IN_COMPLETE;

          if (this._armature.eventDispatcher.hasDBEventListener(i)) {
            var n = t.BaseObject.borrowObject(t.EventObject);
            n.type = i;
            n.armature = this._armature;
            n.animationState = this;

            this._armature._dragonBones.bufferEvent(n);
          }
        }
      }
    };

    r.prototype.init = function (e, a, r) {
      if (this._armature !== null) {
        return;
      }

      this._armature = e;
      this._animationData = a;
      this.resetToPose = r.resetToPose;
      this.additive = r.additive;
      this.displayControl = r.displayControl;
      this.actionEnabled = r.actionEnabled;
      this.blendType = a.blendType;
      this.layer = r.layer;
      this.playTimes = r.playTimes;
      this.timeScale = r.timeScale;
      this.fadeTotalTime = r.fadeInTime;
      this.autoFadeOutTime = r.autoFadeOutTime;
      this.name = r.name.length > 0 ? r.name : r.animation;
      this.group = r.group;
      this._weight = r.weight;

      if (r.pauseFadeIn) {
        this._playheadState = 2;
      } else {
        this._playheadState = 3;
      }

      if (r.duration < 0) {
        this._position = 0;
        this._duration = this._animationData.duration;

        if (r.position !== 0) {
          if (this.timeScale >= 0) {
            this._time = r.position;
          } else {
            this._time = r.position - this._duration;
          }
        } else {
          this._time = 0;
        }
      } else {
        this._position = r.position;
        this._duration = r.duration;
        this._time = 0;
      }

      if (this.timeScale < 0 && this._time === 0) {
        this._time = -1e-6;
      }

      if (this.fadeTotalTime <= 0) {
        this._fadeProgress = .999999;
      }

      if (r.boneMask.length > 0) {
        this._boneMask.length = r.boneMask.length;

        for (var i = 0, n = this._boneMask.length; i < n; ++i) {
          this._boneMask[i] = r.boneMask[i];
        }
      }

      this._actionTimeline = t.BaseObject.borrowObject(t.ActionTimelineState);

      this._actionTimeline.init(this._armature, this, this._animationData.actionTimeline);

      this._actionTimeline.currentTime = this._time;

      if (this._actionTimeline.currentTime < 0) {
        this._actionTimeline.currentTime = this._duration - this._actionTimeline.currentTime;
      }

      if (this._animationData.zOrderTimeline !== null) {
        this._zOrderTimeline = t.BaseObject.borrowObject(t.ZOrderTimelineState);

        this._zOrderTimeline.init(this._armature, this, this._animationData.zOrderTimeline);
      }
    };

    r.prototype.advanceTime = function (t, e) {
      if (this._fadeState !== 0 || this._subFadeState !== 0) {
        this._advanceFadeTime(t);
      }

      if (this._playheadState === 3) {
        if (this.timeScale !== 1) {
          t *= this.timeScale;
        }

        this._time += t;
      }

      if (this._timelineDirty !== 0) {
        if (this._timelineDirty === 2) {
          this._updateTimelines();
        }

        this._timelineDirty = 0;

        this._updateBoneAndSlotTimelines();
      }

      var a = this._fadeState !== 0 || this._subFadeState === 0;
      var r = this._fadeState === 0 && e > 0;
      var i = true;
      var n = true;
      var s = this._time;
      this._weightResult = this._weight * this._fadeProgress;

      if (this._parent !== null) {
        this._weightResult *= this._parent._weightResult;
      }

      if (this._actionTimeline.playState <= 0) {
        this._actionTimeline.update(s);
      }

      if (this._weight === 0) {
        return;
      }

      if (r) {
        var o = e * 2;
        this._actionTimeline.currentTime = Math.floor(this._actionTimeline.currentTime * o) / o;
      }

      if (this._zOrderTimeline !== null && this._zOrderTimeline.playState <= 0) {
        this._zOrderTimeline.update(s);
      }

      if (r) {
        var l = Math.floor(this._actionTimeline.currentTime * e);

        if (this._armature._cacheFrameIndex === l) {
          i = false;
          n = false;
        } else {
          this._armature._cacheFrameIndex = l;

          if (this._animationData.cachedFrames[l]) {
            n = false;
          } else {
            this._animationData.cachedFrames[l] = true;
          }
        }
      }

      if (i) {
        var h = false;
        var u = null;

        if (n) {
          for (var f = 0, _ = this._boneTimelines.length; f < _; ++f) {
            var m = this._boneTimelines[f];

            if (m.playState <= 0) {
              m.update(s);
            }

            if (m.target !== u) {
              var p = m.target;
              h = p.update(this);
              u = p;

              if (p.dirty === 1) {
                var c = p.target.animationPose;
                c.x = 0;
                c.y = 0;
                c.rotation = 0;
                c.skew = 0;
                c.scaleX = 1;
                c.scaleY = 1;
              }
            }

            if (h) {
              m.blend(a);
            }
          }
        }

        for (var f = 0, _ = this._boneBlendTimelines.length; f < _; ++f) {
          var m = this._boneBlendTimelines[f];

          if (m.playState <= 0) {
            m.update(s);
          }

          if (m.target.update(this)) {
            m.blend(a);
          }
        }

        if (this.displayControl) {
          for (var f = 0, _ = this._slotTimelines.length; f < _; ++f) {
            var m = this._slotTimelines[f];

            if (m.playState <= 0) {
              var d = m.target;
              var y = d.displayController;

              if (y === null || y === this.name || y === this.group) {
                m.update(s);
              }
            }
          }
        }

        for (var f = 0, _ = this._slotBlendTimelines.length; f < _; ++f) {
          var m = this._slotBlendTimelines[f];

          if (m.playState <= 0) {
            var p = m.target;
            m.update(s);

            if (p.update(this)) {
              m.blend(a);
            }
          }
        }

        for (var f = 0, _ = this._constraintTimelines.length; f < _; ++f) {
          var m = this._constraintTimelines[f];

          if (m.playState <= 0) {
            m.update(s);
          }
        }

        if (this._animationTimelines.length > 0) {
          var v = 100;
          var g = 100;
          var D = null;
          var T = null;

          for (var f = 0, _ = this._animationTimelines.length; f < _; ++f) {
            var m = this._animationTimelines[f];

            if (m.playState <= 0) {
              m.update(s);
            }

            if (this.blendType === 1) {
              var b = m.target;
              var A = this.parameterX - b.positionX;

              if (A >= 0) {
                if (A < v) {
                  v = A;
                  D = b;
                }
              } else {
                if (-A < g) {
                  g = -A;
                  T = b;
                }
              }
            }
          }

          if (D !== null) {
            if (this._activeChildA !== D) {
              if (this._activeChildA !== null) {
                this._activeChildA.weight = 0;
              }

              this._activeChildA = D;

              this._activeChildA.activeTimeline();
            }

            if (this._activeChildB !== T) {
              if (this._activeChildB !== null) {
                this._activeChildB.weight = 0;
              }

              this._activeChildB = T;
            }

            D.weight = g / (v + g);

            if (T) {
              T.weight = 1 - D.weight;
            }
          }
        }
      }

      if (this._fadeState === 0) {
        if (this._subFadeState > 0) {
          this._subFadeState = 0;

          if (this._poseTimelines.length > 0) {
            for (var P = 0, S = this._poseTimelines; P < S.length; P++) {
              var m = S[P];

              var O = this._boneTimelines.indexOf(m);

              if (O >= 0) {
                this._boneTimelines.splice(O, 1);

                m.returnToPool();
                continue;
              }

              O = this._boneBlendTimelines.indexOf(m);

              if (O >= 0) {
                this._boneBlendTimelines.splice(O, 1);

                m.returnToPool();
                continue;
              }

              O = this._slotTimelines.indexOf(m);

              if (O >= 0) {
                this._slotTimelines.splice(O, 1);

                m.returnToPool();
                continue;
              }

              O = this._slotBlendTimelines.indexOf(m);

              if (O >= 0) {
                this._slotBlendTimelines.splice(O, 1);

                m.returnToPool();
                continue;
              }

              O = this._constraintTimelines.indexOf(m);

              if (O >= 0) {
                this._constraintTimelines.splice(O, 1);

                m.returnToPool();
                continue;
              }
            }

            this._poseTimelines.length = 0;
          }
        }

        if (this._actionTimeline.playState > 0) {
          if (this.autoFadeOutTime >= 0) {
            this.fadeOut(this.autoFadeOutTime);
          }
        }
      }
    };

    r.prototype.play = function () {
      this._playheadState = 3;
    };

    r.prototype.stop = function () {
      this._playheadState &= 1;
    };

    r.prototype.fadeOut = function (t, e) {
      if (e === void 0) {
        e = true;
      }

      if (t < 0) {
        t = 0;
      }

      if (e) {
        this._playheadState &= 2;
      }

      if (this._fadeState > 0) {
        if (t > this.fadeTotalTime - this._fadeTime) {
          return;
        }
      } else {
        this._fadeState = 1;
        this._subFadeState = -1;

        if (t <= 0 || this._fadeProgress <= 0) {
          this._fadeProgress = 1e-6;
        }

        for (var a = 0, r = this._boneTimelines; a < r.length; a++) {
          var i = r[a];
          i.fadeOut();
        }

        for (var n = 0, s = this._boneBlendTimelines; n < s.length; n++) {
          var i = s[n];
          i.fadeOut();
        }

        for (var o = 0, l = this._slotTimelines; o < l.length; o++) {
          var i = l[o];
          i.fadeOut();
        }

        for (var h = 0, u = this._slotBlendTimelines; h < u.length; h++) {
          var i = u[h];
          i.fadeOut();
        }

        for (var f = 0, _ = this._constraintTimelines; f < _.length; f++) {
          var i = _[f];
          i.fadeOut();
        }

        for (var m = 0, p = this._animationTimelines; m < p.length; m++) {
          var i = p[m];
          i.fadeOut();
          var c = i.target;
          c.fadeOut(999999, true);
        }
      }

      this.displayControl = false;
      this.fadeTotalTime = this._fadeProgress > 1e-6 ? t / this._fadeProgress : 0;
      this._fadeTime = this.fadeTotalTime * (1 - this._fadeProgress);
    };

    r.prototype.containsBoneMask = function (t) {
      return this._boneMask.length === 0 || this._boneMask.indexOf(t) >= 0;
    };

    r.prototype.addBoneMask = function (t, e) {
      if (e === void 0) {
        e = true;
      }

      var a = this._armature.getBone(t);

      if (a === null) {
        return;
      }

      if (this._boneMask.indexOf(t) < 0) {
        this._boneMask.push(t);
      }

      if (e) {
        for (var r = 0, i = this._armature.getBones(); r < i.length; r++) {
          var n = i[r];

          if (this._boneMask.indexOf(n.name) < 0 && a.contains(n)) {
            this._boneMask.push(n.name);
          }
        }
      }

      this._timelineDirty = 1;
    };

    r.prototype.removeBoneMask = function (t, e) {
      if (e === void 0) {
        e = true;
      }

      var a = this._boneMask.indexOf(t);

      if (a >= 0) {
        this._boneMask.splice(a, 1);
      }

      if (e) {
        var r = this._armature.getBone(t);

        if (r !== null) {
          var i = this._armature.getBones();

          if (this._boneMask.length > 0) {
            for (var n = 0, s = i; n < s.length; n++) {
              var o = s[n];

              var l = this._boneMask.indexOf(o.name);

              if (l >= 0 && r.contains(o)) {
                this._boneMask.splice(l, 1);
              }
            }
          } else {
            for (var h = 0, u = i; h < u.length; h++) {
              var o = u[h];

              if (o === r) {
                continue;
              }

              if (!r.contains(o)) {
                this._boneMask.push(o.name);
              }
            }
          }
        }
      }

      this._timelineDirty = 1;
    };

    r.prototype.removeAllBoneMask = function () {
      this._boneMask.length = 0;
      this._timelineDirty = 1;
    };

    r.prototype.addState = function (e, a) {
      if (a === void 0) {
        a = null;
      }

      if (a !== null) {
        for (var r = 0, i = a; r < i.length; r++) {
          var n = i[r];

          switch (n.type) {
            case 40:
              {
                var s = t.BaseObject.borrowObject(t.AnimationProgressTimelineState);
                s.target = e;
                s.init(this._armature, this, n);

                this._animationTimelines.push(s);

                if (this.blendType !== 0) {
                  var o = n;
                  e.positionX = o.x;
                  e.positionY = o.y;
                  e.weight = 0;
                }

                e._parent = this;
                this.resetToPose = false;
                break;
              }

            case 41:
              {
                var s = t.BaseObject.borrowObject(t.AnimationWeightTimelineState);
                s.target = e;
                s.init(this._armature, this, n);

                this._animationTimelines.push(s);

                break;
              }

            case 42:
              {
                var s = t.BaseObject.borrowObject(t.AnimationParametersTimelineState);
                s.target = e;
                s.init(this._armature, this, n);

                this._animationTimelines.push(s);

                break;
              }

            default:
              break;
          }
        }
      }

      if (e._parent === null) {
        e._parent = this;
      }
    };

    r.prototype.activeTimeline = function () {
      for (var t = 0, e = this._slotTimelines; t < e.length; t++) {
        var a = e[t];
        a.dirty = true;
        a.currentTime = -1;
      }
    };

    Object.defineProperty(r.prototype, "isFadeIn", {
      get: function get() {
        return this._fadeState < 0;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "isFadeOut", {
      get: function get() {
        return this._fadeState > 0;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "isFadeComplete", {
      get: function get() {
        return this._fadeState === 0;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "isPlaying", {
      get: function get() {
        return (this._playheadState & 2) !== 0 && this._actionTimeline.playState <= 0;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "isCompleted", {
      get: function get() {
        return this._actionTimeline.playState > 0;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "currentPlayTimes", {
      get: function get() {
        return this._actionTimeline.currentPlayTimes;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "totalTime", {
      get: function get() {
        return this._duration;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "currentTime", {
      get: function get() {
        return this._actionTimeline.currentTime;
      },
      set: function set(t) {
        var e = this._actionTimeline.currentPlayTimes - (this._actionTimeline.playState > 0 ? 1 : 0);

        if (t < 0 || this._duration < t) {
          t = t % this._duration + e * this._duration;

          if (t < 0) {
            t += this._duration;
          }
        }

        if (this.playTimes > 0 && e === this.playTimes - 1 && t === this._duration && this._parent === null) {
          t = this._duration - 1e-6;
        }

        if (this._time === t) {
          return;
        }

        this._time = t;

        this._actionTimeline.setCurrentTime(this._time);

        if (this._zOrderTimeline !== null) {
          this._zOrderTimeline.playState = -1;
        }

        for (var a = 0, r = this._boneTimelines; a < r.length; a++) {
          var i = r[a];
          i.playState = -1;
        }

        for (var n = 0, s = this._slotTimelines; n < s.length; n++) {
          var i = s[n];
          i.playState = -1;
        }
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "weight", {
      get: function get() {
        return this._weight;
      },
      set: function set(t) {
        if (this._weight === t) {
          return;
        }

        this._weight = t;

        for (var e = 0, a = this._boneTimelines; e < a.length; e++) {
          var r = a[e];
          r.dirty = true;
        }

        for (var i = 0, n = this._boneBlendTimelines; i < n.length; i++) {
          var r = n[i];
          r.dirty = true;
        }

        for (var s = 0, o = this._slotBlendTimelines; s < o.length; s++) {
          var r = o[s];
          r.dirty = true;
        }
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(r.prototype, "animationData", {
      get: function get() {
        return this._animationData;
      },
      enumerable: true,
      configurable: true
    });
    return r;
  }(t.BaseObject);

  t.AnimationState = e;

  var a = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.BlendState]";
    };

    e.prototype._onClear = function () {
      this.reset();
      this.target = null;
    };

    e.prototype.update = function (t) {
      var e = t.layer;
      var a = t._weightResult;

      if (this.dirty > 0) {
        if (this.leftWeight > 0) {
          if (this.layer !== e) {
            if (this.layerWeight >= this.leftWeight) {
              this.dirty++;
              this.layer = e;
              this.leftWeight = 0;
              this.blendWeight = 0;
              return false;
            }

            this.layer = e;
            this.leftWeight -= this.layerWeight;
            this.layerWeight = 0;
          }

          a *= this.leftWeight;
          this.dirty++;
          this.blendWeight = a;
          this.layerWeight += this.blendWeight;
          return true;
        }

        return false;
      }

      this.dirty++;
      this.layer = e;
      this.leftWeight = 1;
      this.blendWeight = a;
      this.layerWeight = a;
      return true;
    };

    e.prototype.reset = function () {
      this.dirty = 0;
      this.layer = 0;
      this.leftWeight = 0;
      this.layerWeight = 0;
      this.blendWeight = 0;
    };

    e.BONE_TRANSFORM = "boneTransform";
    e.BONE_ALPHA = "boneAlpha";
    e.SURFACE = "surface";
    e.SLOT_DEFORM = "slotDeform";
    e.SLOT_ALPHA = "slotAlpha";
    e.SLOT_Z_INDEX = "slotZIndex";
    return e;
  }(t.BaseObject);

  t.BlendState = a;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.prototype._onClear = function () {
      this.dirty = false;
      this.playState = -1;
      this.currentPlayTimes = -1;
      this.currentTime = -1;
      this.target = null;
      this._isTween = false;
      this._valueOffset = 0;
      this._frameValueOffset = 0;
      this._frameOffset = 0;
      this._frameRate = 0;
      this._frameCount = 0;
      this._frameIndex = -1;
      this._frameRateR = 0;
      this._position = 0;
      this._duration = 0;
      this._timeScale = 1;
      this._timeOffset = 0;
      this._animationData = null;
      this._timelineData = null;
      this._armature = null;
      this._animationState = null;
      this._actionTimeline = null;
      this._frameArray = null;
      this._valueArray = null;
      this._timelineArray = null;
      this._frameIndices = null;
    };

    e.prototype._setCurrentTime = function (t) {
      var e = this.playState;
      var a = this.currentPlayTimes;
      var r = this.currentTime;

      if (this._actionTimeline !== null && this._frameCount <= 1) {
        this.playState = this._actionTimeline.playState >= 0 ? 1 : -1;
        this.currentPlayTimes = 1;
        this.currentTime = this._actionTimeline.currentTime;
      } else if (this._actionTimeline === null || this._timeScale !== 1 || this._timeOffset !== 0) {
        var i = this._animationState.playTimes;
        var n = i * this._duration;
        t *= this._timeScale;

        if (this._timeOffset !== 0) {
          t += this._timeOffset * this._animationData.duration;
        }

        if (i > 0 && (t >= n || t <= -n)) {
          if (this.playState <= 0 && this._animationState._playheadState === 3) {
            this.playState = 1;
          }

          this.currentPlayTimes = i;

          if (t < 0) {
            this.currentTime = 0;
          } else {
            this.currentTime = this._duration + 1e-6;
          }
        } else {
          if (this.playState !== 0 && this._animationState._playheadState === 3) {
            this.playState = 0;
          }

          if (t < 0) {
            t = -t;
            this.currentPlayTimes = Math.floor(t / this._duration);
            this.currentTime = this._duration - t % this._duration;
          } else {
            this.currentPlayTimes = Math.floor(t / this._duration);
            this.currentTime = t % this._duration;
          }
        }

        this.currentTime += this._position;
      } else {
        this.playState = this._actionTimeline.playState;
        this.currentPlayTimes = this._actionTimeline.currentPlayTimes;
        this.currentTime = this._actionTimeline.currentTime;
      }

      if (this.currentPlayTimes === a && this.currentTime === r) {
        return false;
      }

      if (e < 0 && this.playState !== e || this.playState <= 0 && this.currentPlayTimes !== a) {
        this._frameIndex = -1;
      }

      return true;
    };

    e.prototype.init = function (t, e, a) {
      this._armature = t;
      this._animationState = e;
      this._timelineData = a;
      this._actionTimeline = this._animationState._actionTimeline;

      if (this === this._actionTimeline) {
        this._actionTimeline = null;
      }

      this._animationData = this._animationState.animationData;
      this._frameRate = this._animationData.parent.frameRate;
      this._frameRateR = 1 / this._frameRate;
      this._position = this._animationState._position;
      this._duration = this._animationState._duration;

      if (this._timelineData !== null) {
        var r = this._animationData.parent.parent;
        this._frameArray = r.frameArray;
        this._timelineArray = r.timelineArray;
        this._frameIndices = r.frameIndices;
        this._frameCount = this._timelineArray[this._timelineData.offset + 2];
        this._frameValueOffset = this._timelineArray[this._timelineData.offset + 4];
        this._timeScale = 100 / this._timelineArray[this._timelineData.offset + 0];
        this._timeOffset = this._timelineArray[this._timelineData.offset + 1] * .01;
      }
    };

    e.prototype.fadeOut = function () {
      this.dirty = false;
    };

    e.prototype.update = function (t) {
      if (this._setCurrentTime(t)) {
        if (this._frameCount > 1) {
          var e = Math.floor(this.currentTime * this._frameRate);
          var a = this._frameIndices[this._timelineData.frameIndicesOffset + e];

          if (this._frameIndex !== a) {
            this._frameIndex = a;
            this._frameOffset = this._animationData.frameOffset + this._timelineArray[this._timelineData.offset + 5 + this._frameIndex];

            this._onArriveAtFrame();
          }
        } else if (this._frameIndex < 0) {
          this._frameIndex = 0;

          if (this._timelineData !== null) {
            this._frameOffset = this._animationData.frameOffset + this._timelineArray[this._timelineData.offset + 5];
          }

          this._onArriveAtFrame();
        }

        if (this._isTween || this.dirty) {
          this._onUpdateFrame();
        }
      }
    };

    e.prototype.blend = function (t) {};

    return e;
  }(t.BaseObject);

  t.TimelineState = e;

  var a = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e._getEasingValue = function (t, e, a) {
      var r = e;

      switch (t) {
        case 3:
          r = Math.pow(e, 2);
          break;

        case 4:
          r = 1 - Math.pow(1 - e, 2);
          break;

        case 5:
          r = .5 * (1 - Math.cos(e * Math.PI));
          break;
      }

      return (r - e) * a + e;
    };

    e._getEasingCurveValue = function (t, e, a, r) {
      if (t <= 0) {
        return 0;
      } else if (t >= 1) {
        return 1;
      }

      var i = a > 0;
      var n = a + 1;
      var s = Math.floor(t * n);
      var o = 0;
      var l = 0;

      if (i) {
        o = s === 0 ? 0 : e[r + s - 1];
        l = s === n - 1 ? 1e4 : e[r + s];
      } else {
        o = e[r + s - 1];
        l = e[r + s];
      }

      return (o + (l - o) * (t * n - s)) * 1e-4;
    };

    e.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      this._tweenType = 0;
      this._curveCount = 0;
      this._framePosition = 0;
      this._frameDurationR = 0;
      this._tweenEasing = 0;
      this._tweenProgress = 0;
      this._valueScale = 1;
    };

    e.prototype._onArriveAtFrame = function () {
      if (this._frameCount > 1 && (this._frameIndex !== this._frameCount - 1 || this._animationState.playTimes === 0 || this._animationState.currentPlayTimes < this._animationState.playTimes - 1)) {
        this._tweenType = this._frameArray[this._frameOffset + 1];
        this._isTween = this._tweenType !== 0;

        if (this._isTween) {
          if (this._tweenType === 2) {
            this._curveCount = this._frameArray[this._frameOffset + 2];
          } else if (this._tweenType !== 0 && this._tweenType !== 1) {
            this._tweenEasing = this._frameArray[this._frameOffset + 2] * .01;
          }
        } else {
          this.dirty = true;
        }

        this._framePosition = this._frameArray[this._frameOffset] * this._frameRateR;

        if (this._frameIndex === this._frameCount - 1) {
          this._frameDurationR = 1 / (this._animationData.duration - this._framePosition);
        } else {
          var t = this._animationData.frameOffset + this._timelineArray[this._timelineData.offset + 5 + this._frameIndex + 1];
          var e = this._frameArray[t] * this._frameRateR - this._framePosition;

          if (e > 0) {
            this._frameDurationR = 1 / e;
          } else {
            this._frameDurationR = 0;
          }
        }
      } else {
        this.dirty = true;
        this._isTween = false;
      }
    };

    e.prototype._onUpdateFrame = function () {
      if (this._isTween) {
        this.dirty = true;
        this._tweenProgress = (this.currentTime - this._framePosition) * this._frameDurationR;

        if (this._tweenType === 2) {
          this._tweenProgress = e._getEasingCurveValue(this._tweenProgress, this._frameArray, this._curveCount, this._frameOffset + 3);
        } else if (this._tweenType !== 1) {
          this._tweenProgress = e._getEasingValue(this._tweenType, this._tweenProgress, this._tweenEasing);
        }
      }
    };

    return e;
  }(e);

  t.TweenTimelineState = a;

  var r = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      this._current = 0;
      this._difference = 0;
      this._result = 0;
    };

    e.prototype._onArriveAtFrame = function () {
      t.prototype._onArriveAtFrame.call(this);

      if (this._timelineData !== null) {
        var e = this._valueScale;
        var a = this._valueArray;
        var r = this._valueOffset + this._frameValueOffset + this._frameIndex;

        if (this._isTween) {
          var i = this._frameIndex === this._frameCount - 1 ? this._valueOffset + this._frameValueOffset : r + 1;

          if (e === 1) {
            this._current = a[r];
            this._difference = a[i] - this._current;
          } else {
            this._current = a[r] * e;
            this._difference = a[i] * e - this._current;
          }
        } else {
          this._result = a[r] * e;
        }
      } else {
        this._result = 0;
      }
    };

    e.prototype._onUpdateFrame = function () {
      t.prototype._onUpdateFrame.call(this);

      if (this._isTween) {
        this._result = this._current + this._difference * this._tweenProgress;
      }
    };

    return e;
  }(a);

  t.SingleValueTimelineState = r;

  var i = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      this._currentA = 0;
      this._currentB = 0;
      this._differenceA = 0;
      this._differenceB = 0;
      this._resultA = 0;
      this._resultB = 0;
    };

    e.prototype._onArriveAtFrame = function () {
      t.prototype._onArriveAtFrame.call(this);

      if (this._timelineData !== null) {
        var e = this._valueScale;
        var a = this._valueArray;
        var r = this._valueOffset + this._frameValueOffset + this._frameIndex * 2;

        if (this._isTween) {
          var i = this._frameIndex === this._frameCount - 1 ? this._valueOffset + this._frameValueOffset : r + 2;

          if (e === 1) {
            this._currentA = a[r];
            this._currentB = a[r + 1];
            this._differenceA = a[i] - this._currentA;
            this._differenceB = a[i + 1] - this._currentB;
          } else {
            this._currentA = a[r] * e;
            this._currentB = a[r + 1] * e;
            this._differenceA = a[i] * e - this._currentA;
            this._differenceB = a[i + 1] * e - this._currentB;
          }
        } else {
          this._resultA = a[r] * e;
          this._resultB = a[r + 1] * e;
        }
      } else {
        this._resultA = 0;
        this._resultB = 0;
      }
    };

    e.prototype._onUpdateFrame = function () {
      t.prototype._onUpdateFrame.call(this);

      if (this._isTween) {
        this._resultA = this._currentA + this._differenceA * this._tweenProgress;
        this._resultB = this._currentB + this._differenceB * this._tweenProgress;
      }
    };

    return e;
  }(a);

  t.DoubleValueTimelineState = i;

  var n = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e._rd = [];
      return e;
    }

    e.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      this._valueCount = 0;
      this._rd.length = 0;
    };

    e.prototype._onArriveAtFrame = function () {
      t.prototype._onArriveAtFrame.call(this);

      var e = this._valueCount;
      var a = this._rd;

      if (this._timelineData !== null) {
        var r = this._valueScale;
        var i = this._valueArray;
        var n = this._valueOffset + this._frameValueOffset + this._frameIndex * e;

        if (this._isTween) {
          var s = this._frameIndex === this._frameCount - 1 ? this._valueOffset + this._frameValueOffset : n + e;

          if (r === 1) {
            for (var o = 0; o < e; ++o) {
              a[e + o] = i[s + o] - i[n + o];
            }
          } else {
            for (var o = 0; o < e; ++o) {
              a[e + o] = (i[s + o] - i[n + o]) * r;
            }
          }
        } else if (r === 1) {
          for (var o = 0; o < e; ++o) {
            a[o] = i[n + o];
          }
        } else {
          for (var o = 0; o < e; ++o) {
            a[o] = i[n + o] * r;
          }
        }
      } else {
        for (var o = 0; o < e; ++o) {
          a[o] = 0;
        }
      }
    };

    e.prototype._onUpdateFrame = function () {
      t.prototype._onUpdateFrame.call(this);

      if (this._isTween) {
        var e = this._valueCount;
        var a = this._valueScale;
        var r = this._tweenProgress;
        var i = this._valueArray;
        var n = this._rd;
        var s = this._valueOffset + this._frameValueOffset + this._frameIndex * e;

        if (a === 1) {
          for (var o = 0; o < e; ++o) {
            n[o] = i[s + o] + n[e + o] * r;
          }
        } else {
          for (var o = 0; o < e; ++o) {
            n[o] = i[s + o] * a + n[e + o] * r;
          }
        }
      }
    };

    return e;
  }(a);

  t.MutilpleValueTimelineState = n;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (e) {
    __extends(a, e);

    function a() {
      return e !== null && e.apply(this, arguments) || this;
    }

    a.toString = function () {
      return "[class dragonBones.ActionTimelineState]";
    };

    a.prototype._onCrossFrame = function (e) {
      var a = this._armature.eventDispatcher;

      if (this._animationState.actionEnabled) {
        var r = this._animationData.frameOffset + this._timelineArray[this._timelineData.offset + 5 + e];
        var i = this._frameArray[r + 1];
        var n = this._animationData.parent.actions;

        for (var s = 0; s < i; ++s) {
          var o = this._frameArray[r + 2 + s];
          var l = n[o];

          if (l.type === 0) {
            var h = t.BaseObject.borrowObject(t.EventObject);
            h.time = this._frameArray[r] / this._frameRate;
            h.animationState = this._animationState;
            t.EventObject.actionDataToInstance(l, h, this._armature);

            this._armature._bufferAction(h, true);
          } else {
            var u = l.type === 10 ? t.EventObject.FRAME_EVENT : t.EventObject.SOUND_EVENT;

            if (l.type === 11 || a.hasDBEventListener(u)) {
              var h = t.BaseObject.borrowObject(t.EventObject);
              h.time = this._frameArray[r] / this._frameRate;
              h.animationState = this._animationState;
              t.EventObject.actionDataToInstance(l, h, this._armature);

              this._armature._dragonBones.bufferEvent(h);
            }
          }
        }
      }
    };

    a.prototype._onArriveAtFrame = function () {};

    a.prototype._onUpdateFrame = function () {};

    a.prototype.update = function (e) {
      var a = this.playState;
      var r = this.currentPlayTimes;
      var i = this.currentTime;

      if (this._setCurrentTime(e)) {
        var n = this._animationState._parent === null && this._animationState.actionEnabled;
        var s = this._armature.eventDispatcher;

        if (a < 0) {
          if (this.playState !== a) {
            if (this._animationState.displayControl && this._animationState.resetToPose) {
              this._armature._sortZOrder(null, 0);
            }

            r = this.currentPlayTimes;

            if (n && s.hasDBEventListener(t.EventObject.START)) {
              var o = t.BaseObject.borrowObject(t.EventObject);
              o.type = t.EventObject.START;
              o.armature = this._armature;
              o.animationState = this._animationState;

              this._armature._dragonBones.bufferEvent(o);
            }
          } else {
            return;
          }
        }

        var l = this._animationState.timeScale < 0;
        var h = null;
        var u = null;

        if (n && this.currentPlayTimes !== r) {
          if (s.hasDBEventListener(t.EventObject.LOOP_COMPLETE)) {
            h = t.BaseObject.borrowObject(t.EventObject);
            h.type = t.EventObject.LOOP_COMPLETE;
            h.armature = this._armature;
            h.animationState = this._animationState;
          }

          if (this.playState > 0) {
            if (s.hasDBEventListener(t.EventObject.COMPLETE)) {
              u = t.BaseObject.borrowObject(t.EventObject);
              u.type = t.EventObject.COMPLETE;
              u.armature = this._armature;
              u.animationState = this._animationState;
            }
          }
        }

        if (this._frameCount > 1) {
          var f = this._timelineData;

          var _ = Math.floor(this.currentTime * this._frameRate);

          var m = this._frameIndices[f.frameIndicesOffset + _];

          if (this._frameIndex !== m) {
            var p = this._frameIndex;
            this._frameIndex = m;

            if (this._timelineArray !== null) {
              this._frameOffset = this._animationData.frameOffset + this._timelineArray[f.offset + 5 + this._frameIndex];

              if (l) {
                if (p < 0) {
                  var c = Math.floor(i * this._frameRate);
                  p = this._frameIndices[f.frameIndicesOffset + c];

                  if (this.currentPlayTimes === r) {
                    if (p === m) {
                      p = -1;
                    }
                  }
                }

                while (p >= 0) {
                  var d = this._animationData.frameOffset + this._timelineArray[f.offset + 5 + p];
                  var y = this._frameArray[d] / this._frameRate;

                  if (this._position <= y && y <= this._position + this._duration) {
                    this._onCrossFrame(p);
                  }

                  if (h !== null && p === 0) {
                    this._armature._dragonBones.bufferEvent(h);

                    h = null;
                  }

                  if (p > 0) {
                    p--;
                  } else {
                    p = this._frameCount - 1;
                  }

                  if (p === m) {
                    break;
                  }
                }
              } else {
                if (p < 0) {
                  var c = Math.floor(i * this._frameRate);
                  p = this._frameIndices[f.frameIndicesOffset + c];
                  var d = this._animationData.frameOffset + this._timelineArray[f.offset + 5 + p];
                  var y = this._frameArray[d] / this._frameRate;

                  if (this.currentPlayTimes === r) {
                    if (i <= y) {
                      if (p > 0) {
                        p--;
                      } else {
                        p = this._frameCount - 1;
                      }
                    } else if (p === m) {
                      p = -1;
                    }
                  }
                }

                while (p >= 0) {
                  if (p < this._frameCount - 1) {
                    p++;
                  } else {
                    p = 0;
                  }

                  var d = this._animationData.frameOffset + this._timelineArray[f.offset + 5 + p];
                  var y = this._frameArray[d] / this._frameRate;

                  if (this._position <= y && y <= this._position + this._duration) {
                    this._onCrossFrame(p);
                  }

                  if (h !== null && p === 0) {
                    this._armature._dragonBones.bufferEvent(h);

                    h = null;
                  }

                  if (p === m) {
                    break;
                  }
                }
              }
            }
          }
        } else if (this._frameIndex < 0) {
          this._frameIndex = 0;

          if (this._timelineData !== null) {
            this._frameOffset = this._animationData.frameOffset + this._timelineArray[this._timelineData.offset + 5];
            var y = this._frameArray[this._frameOffset] / this._frameRate;

            if (this.currentPlayTimes === r) {
              if (i <= y) {
                this._onCrossFrame(this._frameIndex);
              }
            } else if (this._position <= y) {
              if (!l && h !== null) {
                this._armature._dragonBones.bufferEvent(h);

                h = null;
              }

              this._onCrossFrame(this._frameIndex);
            }
          }
        }

        if (h !== null) {
          this._armature._dragonBones.bufferEvent(h);
        }

        if (u !== null) {
          this._armature._dragonBones.bufferEvent(u);
        }
      }
    };

    a.prototype.setCurrentTime = function (t) {
      this._setCurrentTime(t);

      this._frameIndex = -1;
    };

    return a;
  }(t.TimelineState);

  t.ActionTimelineState = e;

  var a = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.ZOrderTimelineState]";
    };

    e.prototype._onArriveAtFrame = function () {
      if (this.playState >= 0) {
        var t = this._frameArray[this._frameOffset + 1];

        if (t > 0) {
          this._armature._sortZOrder(this._frameArray, this._frameOffset + 2);
        } else {
          this._armature._sortZOrder(null, 0);
        }
      }
    };

    e.prototype._onUpdateFrame = function () {};

    return e;
  }(t.TimelineState);

  t.ZOrderTimelineState = a;

  var r = function (e) {
    __extends(a, e);

    function a() {
      return e !== null && e.apply(this, arguments) || this;
    }

    a.toString = function () {
      return "[class dragonBones.BoneAllTimelineState]";
    };

    a.prototype._onArriveAtFrame = function () {
      e.prototype._onArriveAtFrame.call(this);

      if (this._isTween && this._frameIndex === this._frameCount - 1) {
        this._rd[2] = t.Transform.normalizeRadian(this._rd[2]);
        this._rd[3] = t.Transform.normalizeRadian(this._rd[3]);
      }

      if (this._timelineData === null) {
        this._rd[4] = 1;
        this._rd[5] = 1;
      }
    };

    a.prototype.init = function (t, a, r) {
      e.prototype.init.call(this, t, a, r);
      this._valueOffset = this._animationData.frameFloatOffset;
      this._valueCount = 6;
      this._valueArray = this._animationData.parent.parent.frameFloatArray;
    };

    a.prototype.fadeOut = function () {
      this.dirty = false;
      this._rd[2] = t.Transform.normalizeRadian(this._rd[2]);
      this._rd[3] = t.Transform.normalizeRadian(this._rd[3]);
    };

    a.prototype.blend = function (t) {
      var e = this._armature.armatureData.scale;
      var a = this._rd;
      var r = this.target;
      var i = r.target;
      var n = r.blendWeight;
      var s = i.animationPose;

      if (r.dirty > 1) {
        s.x += a[0] * n * e;
        s.y += a[1] * n * e;
        s.rotation += a[2] * n;
        s.skew += a[3] * n;
        s.scaleX += (a[4] - 1) * n;
        s.scaleY += (a[5] - 1) * n;
      } else {
        s.x = a[0] * n * e;
        s.y = a[1] * n * e;
        s.rotation = a[2] * n;
        s.skew = a[3] * n;
        s.scaleX = (a[4] - 1) * n + 1;
        s.scaleY = (a[5] - 1) * n + 1;
      }

      if (t || this.dirty) {
        this.dirty = false;
        i._transformDirty = true;
      }
    };

    return a;
  }(t.MutilpleValueTimelineState);

  t.BoneAllTimelineState = r;

  var i = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.BoneTranslateTimelineState]";
    };

    e.prototype.init = function (e, a, r) {
      t.prototype.init.call(this, e, a, r);
      this._valueOffset = this._animationData.frameFloatOffset;
      this._valueScale = this._armature.armatureData.scale;
      this._valueArray = this._animationData.parent.parent.frameFloatArray;
    };

    e.prototype.blend = function (t) {
      var e = this.target;
      var a = e.target;
      var r = e.blendWeight;
      var i = a.animationPose;

      if (e.dirty > 1) {
        i.x += this._resultA * r;
        i.y += this._resultB * r;
      } else if (r !== 1) {
        i.x = this._resultA * r;
        i.y = this._resultB * r;
      } else {
        i.x = this._resultA;
        i.y = this._resultB;
      }

      if (t || this.dirty) {
        this.dirty = false;
        a._transformDirty = true;
      }
    };

    return e;
  }(t.DoubleValueTimelineState);

  t.BoneTranslateTimelineState = i;

  var n = function (e) {
    __extends(a, e);

    function a() {
      return e !== null && e.apply(this, arguments) || this;
    }

    a.toString = function () {
      return "[class dragonBones.BoneRotateTimelineState]";
    };

    a.prototype._onArriveAtFrame = function () {
      e.prototype._onArriveAtFrame.call(this);

      if (this._isTween && this._frameIndex === this._frameCount - 1) {
        this._differenceA = t.Transform.normalizeRadian(this._differenceA);
        this._differenceB = t.Transform.normalizeRadian(this._differenceB);
      }
    };

    a.prototype.init = function (t, a, r) {
      e.prototype.init.call(this, t, a, r);
      this._valueOffset = this._animationData.frameFloatOffset;
      this._valueArray = this._animationData.parent.parent.frameFloatArray;
    };

    a.prototype.fadeOut = function () {
      this.dirty = false;
      this._resultA = t.Transform.normalizeRadian(this._resultA);
      this._resultB = t.Transform.normalizeRadian(this._resultB);
    };

    a.prototype.blend = function (t) {
      var e = this.target;
      var a = e.target;
      var r = e.blendWeight;
      var i = a.animationPose;

      if (e.dirty > 1) {
        i.rotation += this._resultA * r;
        i.skew += this._resultB * r;
      } else if (r !== 1) {
        i.rotation = this._resultA * r;
        i.skew = this._resultB * r;
      } else {
        i.rotation = this._resultA;
        i.skew = this._resultB;
      }

      if (t || this.dirty) {
        this.dirty = false;
        a._transformDirty = true;
      }
    };

    return a;
  }(t.DoubleValueTimelineState);

  t.BoneRotateTimelineState = n;

  var s = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.BoneScaleTimelineState]";
    };

    e.prototype._onArriveAtFrame = function () {
      t.prototype._onArriveAtFrame.call(this);

      if (this._timelineData === null) {
        this._resultA = 1;
        this._resultB = 1;
      }
    };

    e.prototype.init = function (e, a, r) {
      t.prototype.init.call(this, e, a, r);
      this._valueOffset = this._animationData.frameFloatOffset;
      this._valueArray = this._animationData.parent.parent.frameFloatArray;
    };

    e.prototype.blend = function (t) {
      var e = this.target;
      var a = e.target;
      var r = e.blendWeight;
      var i = a.animationPose;

      if (e.dirty > 1) {
        i.scaleX += (this._resultA - 1) * r;
        i.scaleY += (this._resultB - 1) * r;
      } else if (r !== 1) {
        i.scaleX = (this._resultA - 1) * r + 1;
        i.scaleY = (this._resultB - 1) * r + 1;
      } else {
        i.scaleX = this._resultA;
        i.scaleY = this._resultB;
      }

      if (t || this.dirty) {
        this.dirty = false;
        a._transformDirty = true;
      }
    };

    return e;
  }(t.DoubleValueTimelineState);

  t.BoneScaleTimelineState = s;

  var o = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.SurfaceTimelineState]";
    };

    e.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      this._deformCount = 0;
      this._deformOffset = 0;
      this._sameValueOffset = 0;
    };

    e.prototype.init = function (e, a, r) {
      t.prototype.init.call(this, e, a, r);

      if (this._timelineData !== null) {
        var i = this._animationData.parent.parent;
        var n = i.frameIntArray;
        var s = this._animationData.frameIntOffset + this._timelineArray[this._timelineData.offset + 3];
        this._valueOffset = this._animationData.frameFloatOffset;
        this._valueCount = n[s + 2];
        this._deformCount = n[s + 1];
        this._deformOffset = n[s + 3];
        this._sameValueOffset = n[s + 4] + this._animationData.frameFloatOffset;
        this._valueScale = this._armature.armatureData.scale;
        this._valueArray = i.frameFloatArray;
        this._rd.length = this._valueCount * 2;
      } else {
        this._deformCount = this.target.target._deformVertices.length;
      }
    };

    e.prototype.blend = function (t) {
      var e = this.target;
      var a = e.target;
      var r = e.blendWeight;
      var i = a._deformVertices;
      var n = this._valueArray;

      if (n !== null) {
        var s = this._valueCount;
        var o = this._deformOffset;
        var l = this._sameValueOffset;
        var h = this._rd;

        for (var u = 0; u < this._deformCount; ++u) {
          var f = 0;

          if (u < o) {
            f = n[l + u];
          } else if (u < o + s) {
            f = h[u - o];
          } else {
            f = n[l + u - s];
          }

          if (e.dirty > 1) {
            i[u] += f * r;
          } else {
            i[u] = f * r;
          }
        }
      } else if (e.dirty === 1) {
        for (var u = 0; u < this._deformCount; ++u) {
          i[u] = 0;
        }
      }

      if (t || this.dirty) {
        this.dirty = false;
        a._transformDirty = true;
      }
    };

    return e;
  }(t.MutilpleValueTimelineState);

  t.SurfaceTimelineState = o;

  var l = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.AlphaTimelineState]";
    };

    e.prototype._onArriveAtFrame = function () {
      t.prototype._onArriveAtFrame.call(this);

      if (this._timelineData === null) {
        this._result = 1;
      }
    };

    e.prototype.init = function (e, a, r) {
      t.prototype.init.call(this, e, a, r);
      this._valueOffset = this._animationData.frameIntOffset;
      this._valueScale = .01;
      this._valueArray = this._animationData.parent.parent.frameIntArray;
    };

    e.prototype.blend = function (t) {
      var e = this.target;
      var a = e.target;
      var r = e.blendWeight;

      if (e.dirty > 1) {
        a._alpha += this._result * r;

        if (a._alpha > 1) {
          a._alpha = 1;
        }
      } else {
        a._alpha = this._result * r;
      }

      if (t || this.dirty) {
        this.dirty = false;
        this._armature._alphaDirty = true;
      }
    };

    return e;
  }(t.SingleValueTimelineState);

  t.AlphaTimelineState = l;

  var h = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.SlotDislayTimelineState]";
    };

    e.prototype._onArriveAtFrame = function () {
      if (this.playState >= 0) {
        var t = this.target;
        var e = this._timelineData !== null ? this._frameArray[this._frameOffset + 1] : t._slotData.displayIndex;

        if (t.displayIndex !== e) {
          t._setDisplayIndex(e, true);
        }
      }
    };

    e.prototype._onUpdateFrame = function () {};

    return e;
  }(t.TimelineState);

  t.SlotDislayTimelineState = h;

  var u = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e._current = [0, 0, 0, 0, 0, 0, 0, 0];
      e._difference = [0, 0, 0, 0, 0, 0, 0, 0];
      e._result = [0, 0, 0, 0, 0, 0, 0, 0];
      return e;
    }

    e.toString = function () {
      return "[class dragonBones.SlotColorTimelineState]";
    };

    e.prototype._onArriveAtFrame = function () {
      t.prototype._onArriveAtFrame.call(this);

      if (this._timelineData !== null) {
        var e = this._animationData.parent.parent;
        var a = e.colorArray;
        var r = e.frameIntArray;
        var i = this._animationData.frameIntOffset + this._frameValueOffset + this._frameIndex;
        var n = r[i];

        if (n < 0) {
          n += 65536;
        }

        if (this._isTween) {
          this._current[0] = a[n++];
          this._current[1] = a[n++];
          this._current[2] = a[n++];
          this._current[3] = a[n++];
          this._current[4] = a[n++];
          this._current[5] = a[n++];
          this._current[6] = a[n++];
          this._current[7] = a[n++];

          if (this._frameIndex === this._frameCount - 1) {
            n = r[this._animationData.frameIntOffset + this._frameValueOffset];
          } else {
            n = r[i + 1];
          }

          if (n < 0) {
            n += 65536;
          }

          this._difference[0] = a[n++] - this._current[0];
          this._difference[1] = a[n++] - this._current[1];
          this._difference[2] = a[n++] - this._current[2];
          this._difference[3] = a[n++] - this._current[3];
          this._difference[4] = a[n++] - this._current[4];
          this._difference[5] = a[n++] - this._current[5];
          this._difference[6] = a[n++] - this._current[6];
          this._difference[7] = a[n++] - this._current[7];
        } else {
          this._result[0] = a[n++] * .01;
          this._result[1] = a[n++] * .01;
          this._result[2] = a[n++] * .01;
          this._result[3] = a[n++] * .01;
          this._result[4] = a[n++];
          this._result[5] = a[n++];
          this._result[6] = a[n++];
          this._result[7] = a[n++];
        }
      } else {
        var s = this.target;
        var o = s.slotData.color;
        this._result[0] = o.alphaMultiplier;
        this._result[1] = o.redMultiplier;
        this._result[2] = o.greenMultiplier;
        this._result[3] = o.blueMultiplier;
        this._result[4] = o.alphaOffset;
        this._result[5] = o.redOffset;
        this._result[6] = o.greenOffset;
        this._result[7] = o.blueOffset;
      }
    };

    e.prototype._onUpdateFrame = function () {
      t.prototype._onUpdateFrame.call(this);

      if (this._isTween) {
        this._result[0] = (this._current[0] + this._difference[0] * this._tweenProgress) * .01;
        this._result[1] = (this._current[1] + this._difference[1] * this._tweenProgress) * .01;
        this._result[2] = (this._current[2] + this._difference[2] * this._tweenProgress) * .01;
        this._result[3] = (this._current[3] + this._difference[3] * this._tweenProgress) * .01;
        this._result[4] = this._current[4] + this._difference[4] * this._tweenProgress;
        this._result[5] = this._current[5] + this._difference[5] * this._tweenProgress;
        this._result[6] = this._current[6] + this._difference[6] * this._tweenProgress;
        this._result[7] = this._current[7] + this._difference[7] * this._tweenProgress;
      }
    };

    e.prototype.fadeOut = function () {
      this._isTween = false;
    };

    e.prototype.update = function (e) {
      t.prototype.update.call(this, e);

      if (this._isTween || this.dirty) {
        var a = this.target;
        var r = a._colorTransform;

        if (this._animationState._fadeState !== 0 || this._animationState._subFadeState !== 0) {
          if (r.alphaMultiplier !== this._result[0] || r.redMultiplier !== this._result[1] || r.greenMultiplier !== this._result[2] || r.blueMultiplier !== this._result[3] || r.alphaOffset !== this._result[4] || r.redOffset !== this._result[5] || r.greenOffset !== this._result[6] || r.blueOffset !== this._result[7]) {
            var i = Math.pow(this._animationState._fadeProgress, 4);
            r.alphaMultiplier += (this._result[0] - r.alphaMultiplier) * i;
            r.redMultiplier += (this._result[1] - r.redMultiplier) * i;
            r.greenMultiplier += (this._result[2] - r.greenMultiplier) * i;
            r.blueMultiplier += (this._result[3] - r.blueMultiplier) * i;
            r.alphaOffset += (this._result[4] - r.alphaOffset) * i;
            r.redOffset += (this._result[5] - r.redOffset) * i;
            r.greenOffset += (this._result[6] - r.greenOffset) * i;
            r.blueOffset += (this._result[7] - r.blueOffset) * i;
            a._colorDirty = true;
          }
        } else if (this.dirty) {
          this.dirty = false;

          if (r.alphaMultiplier !== this._result[0] || r.redMultiplier !== this._result[1] || r.greenMultiplier !== this._result[2] || r.blueMultiplier !== this._result[3] || r.alphaOffset !== this._result[4] || r.redOffset !== this._result[5] || r.greenOffset !== this._result[6] || r.blueOffset !== this._result[7]) {
            r.alphaMultiplier = this._result[0];
            r.redMultiplier = this._result[1];
            r.greenMultiplier = this._result[2];
            r.blueMultiplier = this._result[3];
            r.alphaOffset = this._result[4];
            r.redOffset = this._result[5];
            r.greenOffset = this._result[6];
            r.blueOffset = this._result[7];
            a._colorDirty = true;
          }
        }
      }
    };

    return e;
  }(t.TweenTimelineState);

  t.SlotColorTimelineState = u;

  var f = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.SlotZIndexTimelineState]";
    };

    e.prototype._onArriveAtFrame = function () {
      t.prototype._onArriveAtFrame.call(this);

      if (this._timelineData === null) {
        var e = this.target;
        var a = e.target;
        this._result = a.slotData.zIndex;
      }
    };

    e.prototype.init = function (e, a, r) {
      t.prototype.init.call(this, e, a, r);
      this._valueOffset = this._animationData.frameIntOffset;
      this._valueArray = this._animationData.parent.parent.frameIntArray;
    };

    e.prototype.blend = function (t) {
      var e = this.target;
      var a = e.target;
      var r = e.blendWeight;

      if (e.dirty > 1) {
        a._zIndex += this._result * r;
      } else {
        a._zIndex = this._result * r;
      }

      if (t || this.dirty) {
        this.dirty = false;
        this._armature._zIndexDirty = true;
      }
    };

    return e;
  }(t.SingleValueTimelineState);

  t.SlotZIndexTimelineState = f;

  var _ = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.DeformTimelineState]";
    };

    e.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      this.geometryOffset = 0;
      this.displayFrame = null;
      this._deformCount = 0;
      this._deformOffset = 0;
      this._sameValueOffset = 0;
    };

    e.prototype.init = function (e, a, r) {
      t.prototype.init.call(this, e, a, r);

      if (this._timelineData !== null) {
        var i = this._animationData.frameIntOffset + this._timelineArray[this._timelineData.offset + 3];
        var n = this._animationData.parent.parent;
        var s = n.frameIntArray;
        var o = this.target.target;
        this.geometryOffset = s[i + 0];

        if (this.geometryOffset < 0) {
          this.geometryOffset += 65536;
        }

        for (var l = 0, h = o.displayFrameCount; l < h; ++l) {
          var u = o.getDisplayFrameAt(l);
          var f = u.getGeometryData();

          if (f === null) {
            continue;
          }

          if (f.offset === this.geometryOffset) {
            this.displayFrame = u;
            this.displayFrame.updateDeformVertices();
            break;
          }
        }

        if (this.displayFrame === null) {
          this.returnToPool();
          return;
        }

        this._valueOffset = this._animationData.frameFloatOffset;
        this._valueCount = s[i + 2];
        this._deformCount = s[i + 1];
        this._deformOffset = s[i + 3];
        this._sameValueOffset = s[i + 4] + this._animationData.frameFloatOffset;
        this._valueScale = this._armature.armatureData.scale;
        this._valueArray = n.frameFloatArray;
        this._rd.length = this._valueCount * 2;
      } else {
        this._deformCount = this.displayFrame.deformVertices.length;
      }
    };

    e.prototype.blend = function (t) {
      var e = this.target;
      var a = e.target;
      var r = e.blendWeight;
      var i = this.displayFrame.deformVertices;
      var n = this._valueArray;

      if (n !== null) {
        var s = this._valueCount;
        var o = this._deformOffset;
        var l = this._sameValueOffset;
        var h = this._rd;

        for (var u = 0; u < this._deformCount; ++u) {
          var f = 0;

          if (u < o) {
            f = n[l + u];
          } else if (u < o + s) {
            f = h[u - o];
          } else {
            f = n[l + u - s];
          }

          if (e.dirty > 1) {
            i[u] += f * r;
          } else {
            i[u] = f * r;
          }
        }
      } else if (e.dirty === 1) {
        for (var u = 0; u < this._deformCount; ++u) {
          i[u] = 0;
        }
      }

      if (t || this.dirty) {
        this.dirty = false;

        if (a._geometryData === this.displayFrame.getGeometryData()) {
          a._verticesDirty = true;
        }
      }
    };

    return e;
  }(t.MutilpleValueTimelineState);

  t.DeformTimelineState = _;

  var m = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.IKConstraintTimelineState]";
    };

    e.prototype._onUpdateFrame = function () {
      t.prototype._onUpdateFrame.call(this);

      var e = this.target;

      if (this._timelineData !== null) {
        e._bendPositive = this._currentA > 0;
        e._weight = this._currentB;
      } else {
        var a = e._constraintData;
        e._bendPositive = a.bendPositive;
        e._weight = a.weight;
      }

      e.invalidUpdate();
      this.dirty = false;
    };

    e.prototype.init = function (e, a, r) {
      t.prototype.init.call(this, e, a, r);
      this._valueOffset = this._animationData.frameIntOffset;
      this._valueScale = .01;
      this._valueArray = this._animationData.parent.parent.frameIntArray;
    };

    return e;
  }(t.DoubleValueTimelineState);

  t.IKConstraintTimelineState = m;

  var p = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.AnimationProgressTimelineState]";
    };

    e.prototype._onUpdateFrame = function () {
      t.prototype._onUpdateFrame.call(this);

      var e = this.target;

      if (e._parent !== null) {
        e.currentTime = this._result * e.totalTime;
      }

      this.dirty = false;
    };

    e.prototype.init = function (e, a, r) {
      t.prototype.init.call(this, e, a, r);
      this._valueOffset = this._animationData.frameIntOffset;
      this._valueScale = 1e-4;
      this._valueArray = this._animationData.parent.parent.frameIntArray;
    };

    return e;
  }(t.SingleValueTimelineState);

  t.AnimationProgressTimelineState = p;

  var c = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.AnimationWeightTimelineState]";
    };

    e.prototype._onUpdateFrame = function () {
      t.prototype._onUpdateFrame.call(this);

      var e = this.target;

      if (e._parent !== null) {
        e.weight = this._result;
      }

      this.dirty = false;
    };

    e.prototype.init = function (e, a, r) {
      t.prototype.init.call(this, e, a, r);
      this._valueOffset = this._animationData.frameIntOffset;
      this._valueScale = 1e-4;
      this._valueArray = this._animationData.parent.parent.frameIntArray;
    };

    return e;
  }(t.SingleValueTimelineState);

  t.AnimationWeightTimelineState = c;

  var d = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.toString = function () {
      return "[class dragonBones.AnimationParametersTimelineState]";
    };

    e.prototype._onUpdateFrame = function () {
      t.prototype._onUpdateFrame.call(this);

      var e = this.target;

      if (e._parent !== null) {
        e.parameterX = this._resultA;
        e.parameterY = this._resultB;
      }

      this.dirty = false;
    };

    e.prototype.init = function (e, a, r) {
      t.prototype.init.call(this, e, a, r);
      this._valueOffset = this._animationData.frameIntOffset;
      this._valueScale = 1e-4;
      this._valueArray = this._animationData.parent.parent.frameIntArray;
    };

    return e;
  }(t.DoubleValueTimelineState);

  t.AnimationParametersTimelineState = d;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (t) {
    __extends(e, t);

    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }

    e.actionDataToInstance = function (t, a, r) {
      if (t.type === 0) {
        a.type = e.FRAME_EVENT;
      } else {
        a.type = t.type === 10 ? e.FRAME_EVENT : e.SOUND_EVENT;
      }

      a.name = t.name;
      a.armature = r;
      a.actionData = t;
      a.data = t.data;

      if (t.bone !== null) {
        a.bone = r.getBone(t.bone.name);
      }

      if (t.slot !== null) {
        a.slot = r.getSlot(t.slot.name);
      }
    };

    e.toString = function () {
      return "[class dragonBones.EventObject]";
    };

    e.prototype._onClear = function () {
      this.time = 0;
      this.type = "";
      this.name = "";
      this.armature = null;
      this.bone = null;
      this.slot = null;
      this.animationState = null;
      this.actionData = null;
      this.data = null;
    };

    e.START = "start";
    e.LOOP_COMPLETE = "loopComplete";
    e.COMPLETE = "complete";
    e.FADE_IN = "fadeIn";
    e.FADE_IN_COMPLETE = "fadeInComplete";
    e.FADE_OUT = "fadeOut";
    e.FADE_OUT_COMPLETE = "fadeOutComplete";
    e.FRAME_EVENT = "frameEvent";
    e.SOUND_EVENT = "soundEvent";
    return e;
  }(t.BaseObject);

  t.EventObject = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function () {
    function t() {}

    t._getArmatureType = function (t) {
      switch (t.toLowerCase()) {
        case "stage":
          return 2;

        case "armature":
          return 0;

        case "movieclip":
          return 1;

        default:
          return 0;
      }
    };

    t._getBoneType = function (t) {
      switch (t.toLowerCase()) {
        case "bone":
          return 0;

        case "surface":
          return 1;

        default:
          return 0;
      }
    };

    t._getPositionMode = function (t) {
      switch (t.toLocaleLowerCase()) {
        case "percent":
          return 1;

        case "fixed":
          return 0;

        default:
          return 1;
      }
    };

    t._getSpacingMode = function (t) {
      switch (t.toLocaleLowerCase()) {
        case "length":
          return 0;

        case "percent":
          return 2;

        case "fixed":
          return 1;

        default:
          return 0;
      }
    };

    t._getRotateMode = function (t) {
      switch (t.toLocaleLowerCase()) {
        case "tangent":
          return 0;

        case "chain":
          return 1;

        case "chainscale":
          return 2;

        default:
          return 0;
      }
    };

    t._getDisplayType = function (t) {
      switch (t.toLowerCase()) {
        case "image":
          return 0;

        case "mesh":
          return 2;

        case "armature":
          return 1;

        case "boundingbox":
          return 3;

        case "path":
          return 4;

        default:
          return 0;
      }
    };

    t._getBoundingBoxType = function (t) {
      switch (t.toLowerCase()) {
        case "rectangle":
          return 0;

        case "ellipse":
          return 1;

        case "polygon":
          return 2;

        default:
          return 0;
      }
    };

    t._getBlendMode = function (t) {
      switch (t.toLowerCase()) {
        case "normal":
          return 0;

        case "add":
          return 1;

        case "alpha":
          return 2;

        case "darken":
          return 3;

        case "difference":
          return 4;

        case "erase":
          return 5;

        case "hardlight":
          return 6;

        case "invert":
          return 7;

        case "layer":
          return 8;

        case "lighten":
          return 9;

        case "multiply":
          return 10;

        case "overlay":
          return 11;

        case "screen":
          return 12;

        case "subtract":
          return 13;

        default:
          return 0;
      }
    };

    t._getAnimationBlendType = function (t) {
      switch (t.toLowerCase()) {
        case "none":
          return 0;

        case "1d":
          return 1;

        default:
          return 0;
      }
    };

    t._getActionType = function (t) {
      switch (t.toLowerCase()) {
        case "play":
          return 0;

        case "frame":
          return 10;

        case "sound":
          return 11;

        default:
          return 0;
      }
    };

    t.DATA_VERSION_2_3 = "2.3";
    t.DATA_VERSION_3_0 = "3.0";
    t.DATA_VERSION_4_0 = "4.0";
    t.DATA_VERSION_4_5 = "4.5";
    t.DATA_VERSION_5_0 = "5.0";
    t.DATA_VERSION_5_5 = "5.5";
    t.DATA_VERSION_5_6 = "5.6";
    t.DATA_VERSION = t.DATA_VERSION_5_6;
    t.DATA_VERSIONS = [t.DATA_VERSION_4_0, t.DATA_VERSION_4_5, t.DATA_VERSION_5_0, t.DATA_VERSION_5_5, t.DATA_VERSION_5_6];
    t.TEXTURE_ATLAS = "textureAtlas";
    t.SUB_TEXTURE = "SubTexture";
    t.FORMAT = "format";
    t.IMAGE_PATH = "imagePath";
    t.WIDTH = "width";
    t.HEIGHT = "height";
    t.ROTATED = "rotated";
    t.FRAME_X = "frameX";
    t.FRAME_Y = "frameY";
    t.FRAME_WIDTH = "frameWidth";
    t.FRAME_HEIGHT = "frameHeight";
    t.DRADON_BONES = "dragonBones";
    t.USER_DATA = "userData";
    t.ARMATURE = "armature";
    t.CANVAS = "canvas";
    t.BONE = "bone";
    t.SURFACE = "surface";
    t.SLOT = "slot";
    t.CONSTRAINT = "constraint";
    t.SKIN = "skin";
    t.DISPLAY = "display";
    t.FRAME = "frame";
    t.IK = "ik";
    t.PATH_CONSTRAINT = "path";
    t.ANIMATION = "animation";
    t.TIMELINE = "timeline";
    t.FFD = "ffd";
    t.TRANSLATE_FRAME = "translateFrame";
    t.ROTATE_FRAME = "rotateFrame";
    t.SCALE_FRAME = "scaleFrame";
    t.DISPLAY_FRAME = "displayFrame";
    t.COLOR_FRAME = "colorFrame";
    t.DEFAULT_ACTIONS = "defaultActions";
    t.ACTIONS = "actions";
    t.EVENTS = "events";
    t.INTS = "ints";
    t.FLOATS = "floats";
    t.STRINGS = "strings";
    t.TRANSFORM = "transform";
    t.PIVOT = "pivot";
    t.AABB = "aabb";
    t.COLOR = "color";
    t.VERSION = "version";
    t.COMPATIBLE_VERSION = "compatibleVersion";
    t.FRAME_RATE = "frameRate";
    t.TYPE = "type";
    t.SUB_TYPE = "subType";
    t.NAME = "name";
    t.PARENT = "parent";
    t.TARGET = "target";
    t.STAGE = "stage";
    t.SHARE = "share";
    t.PATH = "path";
    t.LENGTH = "length";
    t.DISPLAY_INDEX = "displayIndex";
    t.Z_ORDER = "zOrder";
    t.Z_INDEX = "zIndex";
    t.BLEND_MODE = "blendMode";
    t.INHERIT_TRANSLATION = "inheritTranslation";
    t.INHERIT_ROTATION = "inheritRotation";
    t.INHERIT_SCALE = "inheritScale";
    t.INHERIT_REFLECTION = "inheritReflection";
    t.INHERIT_ANIMATION = "inheritAnimation";
    t.INHERIT_DEFORM = "inheritDeform";
    t.SEGMENT_X = "segmentX";
    t.SEGMENT_Y = "segmentY";
    t.BEND_POSITIVE = "bendPositive";
    t.CHAIN = "chain";
    t.WEIGHT = "weight";
    t.BLEND_TYPE = "blendType";
    t.FADE_IN_TIME = "fadeInTime";
    t.PLAY_TIMES = "playTimes";
    t.SCALE = "scale";
    t.OFFSET = "offset";
    t.POSITION = "position";
    t.DURATION = "duration";
    t.TWEEN_EASING = "tweenEasing";
    t.TWEEN_ROTATE = "tweenRotate";
    t.TWEEN_SCALE = "tweenScale";
    t.CLOCK_WISE = "clockwise";
    t.CURVE = "curve";
    t.SOUND = "sound";
    t.EVENT = "event";
    t.ACTION = "action";
    t.X = "x";
    t.Y = "y";
    t.SKEW_X = "skX";
    t.SKEW_Y = "skY";
    t.SCALE_X = "scX";
    t.SCALE_Y = "scY";
    t.VALUE = "value";
    t.ROTATE = "rotate";
    t.SKEW = "skew";
    t.ALPHA = "alpha";
    t.ALPHA_OFFSET = "aO";
    t.RED_OFFSET = "rO";
    t.GREEN_OFFSET = "gO";
    t.BLUE_OFFSET = "bO";
    t.ALPHA_MULTIPLIER = "aM";
    t.RED_MULTIPLIER = "rM";
    t.GREEN_MULTIPLIER = "gM";
    t.BLUE_MULTIPLIER = "bM";
    t.UVS = "uvs";
    t.VERTICES = "vertices";
    t.TRIANGLES = "triangles";
    t.WEIGHTS = "weights";
    t.SLOT_POSE = "slotPose";
    t.BONE_POSE = "bonePose";
    t.BONES = "bones";
    t.POSITION_MODE = "positionMode";
    t.SPACING_MODE = "spacingMode";
    t.ROTATE_MODE = "rotateMode";
    t.SPACING = "spacing";
    t.ROTATE_OFFSET = "rotateOffset";
    t.ROTATE_MIX = "rotateMix";
    t.TRANSLATE_MIX = "translateMix";
    t.TARGET_DISPLAY = "targetDisplay";
    t.CLOSED = "closed";
    t.CONSTANT_SPEED = "constantSpeed";
    t.VERTEX_COUNT = "vertexCount";
    t.LENGTHS = "lengths";
    t.GOTO_AND_PLAY = "gotoAndPlay";
    t.DEFAULT_NAME = "default";
    return t;
  }();

  t.DataParser = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (e) {
    __extends(r, e);

    function r() {
      var a = e !== null && e.apply(this, arguments) || this;
      a._rawTextureAtlasIndex = 0;
      a._rawBones = [];
      a._data = null;
      a._armature = null;
      a._bone = null;
      a._geometry = null;
      a._slot = null;
      a._skin = null;
      a._mesh = null;
      a._animation = null;
      a._timeline = null;
      a._rawTextureAtlases = null;
      a._frameValueType = 0;
      a._defaultColorOffset = -1;
      a._prevClockwise = 0;
      a._prevRotation = 0;
      a._frameDefaultValue = 0;
      a._frameValueScale = 1;
      a._helpMatrixA = new t.Matrix();
      a._helpMatrixB = new t.Matrix();
      a._helpTransform = new t.Transform();
      a._helpColorTransform = new t.ColorTransform();
      a._helpPoint = new t.Point();
      a._helpArray = [];
      a._intArray = [];
      a._floatArray = [];
      a._frameIntArray = [];
      a._frameFloatArray = [];
      a._frameArray = [];
      a._timelineArray = [];
      a._colorArray = [];
      a._cacheRawMeshes = [];
      a._cacheMeshes = [];
      a._actionFrames = [];
      a._weightSlotPose = {};
      a._weightBonePoses = {};
      a._cacheBones = {};
      a._slotChildActions = {};
      return a;
    }

    r._getBoolean = function (t, e, a) {
      if (e in t) {
        var r = t[e];

        var i = _typeof(r);

        if (i === "boolean") {
          return r;
        } else if (i === "string") {
          switch (r) {
            case "0":
            case "NaN":
            case "":
            case "false":
            case "null":
            case "undefined":
              return false;

            default:
              return true;
          }
        } else {
          return !!r;
        }
      }

      return a;
    };

    r._getNumber = function (t, e, a) {
      if (e in t) {
        var r = t[e];

        if (r === null || r === "NaN") {
          return a;
        }

        return +r || 0;
      }

      return a;
    };

    r._getString = function (t, e, a) {
      if (e in t) {
        var r = t[e];

        var i = _typeof(r);

        if (i === "string") {
          return r;
        }

        return String(r);
      }

      return a;
    };

    r.prototype._getCurvePoint = function (t, e, a, r, i, n, s, o, l, h) {
      var u = 1 - l;
      var f = u * u;

      var _ = l * l;

      var m = u * f;
      var p = 3 * l * f;
      var c = 3 * u * _;
      var d = l * _;
      h.x = m * t + p * a + c * i + d * s;
      h.y = m * e + p * r + c * n + d * o;
    };

    r.prototype._samplingEasingCurve = function (t, e) {
      var a = t.length;

      if (a % 3 === 1) {
        var r = -2;

        for (var i = 0, n = e.length; i < n; ++i) {
          var s = (i + 1) / (n + 1);

          while ((r + 6 < a ? t[r + 6] : 1) < s) {
            r += 6;
          }

          var o = r >= 0 && r + 6 < a;
          var l = o ? t[r] : 0;
          var h = o ? t[r + 1] : 0;
          var u = t[r + 2];
          var f = t[r + 3];
          var _ = t[r + 4];
          var m = t[r + 5];
          var p = o ? t[r + 6] : 1;
          var c = o ? t[r + 7] : 1;
          var d = 0;
          var y = 1;

          while (y - d > 1e-4) {
            var v = (y + d) * .5;

            this._getCurvePoint(l, h, u, f, _, m, p, c, v, this._helpPoint);

            if (s - this._helpPoint.x > 0) {
              d = v;
            } else {
              y = v;
            }
          }

          e[i] = this._helpPoint.y;
        }

        return true;
      } else {
        var r = 0;

        for (var i = 0, n = e.length; i < n; ++i) {
          var s = (i + 1) / (n + 1);

          while (t[r + 6] < s) {
            r += 6;
          }

          var l = t[r];
          var h = t[r + 1];
          var u = t[r + 2];
          var f = t[r + 3];
          var _ = t[r + 4];
          var m = t[r + 5];
          var p = t[r + 6];
          var c = t[r + 7];
          var d = 0;
          var y = 1;

          while (y - d > 1e-4) {
            var v = (y + d) * .5;

            this._getCurvePoint(l, h, u, f, _, m, p, c, v, this._helpPoint);

            if (s - this._helpPoint.x > 0) {
              d = v;
            } else {
              y = v;
            }
          }

          e[i] = this._helpPoint.y;
        }

        return false;
      }
    };

    r.prototype._parseActionDataInFrame = function (e, a, r, i) {
      if (t.DataParser.EVENT in e) {
        this._mergeActionFrame(e[t.DataParser.EVENT], a, 10, r, i);
      }

      if (t.DataParser.SOUND in e) {
        this._mergeActionFrame(e[t.DataParser.SOUND], a, 11, r, i);
      }

      if (t.DataParser.ACTION in e) {
        this._mergeActionFrame(e[t.DataParser.ACTION], a, 0, r, i);
      }

      if (t.DataParser.EVENTS in e) {
        this._mergeActionFrame(e[t.DataParser.EVENTS], a, 10, r, i);
      }

      if (t.DataParser.ACTIONS in e) {
        this._mergeActionFrame(e[t.DataParser.ACTIONS], a, 0, r, i);
      }
    };

    r.prototype._mergeActionFrame = function (t, e, r, i, n) {
      var s = this._armature.actions.length;

      var o = this._parseActionData(t, r, i, n);

      var l = 0;
      var h = null;

      for (var u = 0, f = o; u < f.length; u++) {
        var _ = f[u];

        this._armature.addAction(_, false);
      }

      if (this._actionFrames.length === 0) {
        h = new a();
        h.frameStart = 0;

        this._actionFrames.push(h);

        h = null;
      }

      for (var m = 0, p = this._actionFrames; m < p.length; m++) {
        var c = p[m];

        if (c.frameStart === e) {
          h = c;
          break;
        } else if (c.frameStart > e) {
          break;
        }

        l++;
      }

      if (h === null) {
        h = new a();
        h.frameStart = e;

        this._actionFrames.splice(l, 0, h);
      }

      for (var d = 0; d < o.length; ++d) {
        h.actions.push(s + d);
      }
    };

    r.prototype._parseArmature = function (e, a) {
      var i = t.BaseObject.borrowObject(t.ArmatureData);
      i.name = r._getString(e, t.DataParser.NAME, "");
      i.frameRate = r._getNumber(e, t.DataParser.FRAME_RATE, this._data.frameRate);
      i.scale = a;

      if (t.DataParser.TYPE in e && typeof e[t.DataParser.TYPE] === "string") {
        i.type = t.DataParser._getArmatureType(e[t.DataParser.TYPE]);
      } else {
        i.type = r._getNumber(e, t.DataParser.TYPE, 0);
      }

      if (i.frameRate === 0) {
        i.frameRate = 24;
      }

      this._armature = i;

      if (t.DataParser.CANVAS in e) {
        var n = e[t.DataParser.CANVAS];
        var s = t.BaseObject.borrowObject(t.CanvasData);

        if (t.DataParser.COLOR in n) {
          s.hasBackground = true;
        } else {
          s.hasBackground = false;
        }

        s.color = r._getNumber(n, t.DataParser.COLOR, 0);
        s.x = r._getNumber(n, t.DataParser.X, 0) * i.scale;
        s.y = r._getNumber(n, t.DataParser.Y, 0) * i.scale;
        s.width = r._getNumber(n, t.DataParser.WIDTH, 0) * i.scale;
        s.height = r._getNumber(n, t.DataParser.HEIGHT, 0) * i.scale;
        i.canvas = s;
      }

      if (t.DataParser.AABB in e) {
        var o = e[t.DataParser.AABB];
        i.aabb.x = r._getNumber(o, t.DataParser.X, 0) * i.scale;
        i.aabb.y = r._getNumber(o, t.DataParser.Y, 0) * i.scale;
        i.aabb.width = r._getNumber(o, t.DataParser.WIDTH, 0) * i.scale;
        i.aabb.height = r._getNumber(o, t.DataParser.HEIGHT, 0) * i.scale;
      }

      if (t.DataParser.BONE in e) {
        var l = e[t.DataParser.BONE];

        for (var h = 0, u = l; h < u.length; h++) {
          var f = u[h];

          var _ = r._getString(f, t.DataParser.PARENT, "");

          var m = this._parseBone(f);

          if (_.length > 0) {
            var p = i.getBone(_);

            if (p !== null) {
              m.parent = p;
            } else {
              if (!(_ in this._cacheBones)) {
                this._cacheBones[_] = [];
              }

              this._cacheBones[_].push(m);
            }
          }

          if (m.name in this._cacheBones) {
            for (var c = 0, d = this._cacheBones[m.name]; c < d.length; c++) {
              var y = d[c];
              y.parent = m;
            }

            delete this._cacheBones[m.name];
          }

          i.addBone(m);

          this._rawBones.push(m);
        }
      }

      if (t.DataParser.IK in e) {
        var v = e[t.DataParser.IK];

        for (var g = 0, D = v; g < D.length; g++) {
          var T = D[g];

          var b = this._parseIKConstraint(T);

          if (b) {
            i.addConstraint(b);
          }
        }
      }

      i.sortBones();

      if (t.DataParser.SLOT in e) {
        var A = 0;
        var P = e[t.DataParser.SLOT];

        for (var S = 0, O = P; S < O.length; S++) {
          var x = O[S];
          i.addSlot(this._parseSlot(x, A++));
        }
      }

      if (t.DataParser.SKIN in e) {
        var B = e[t.DataParser.SKIN];

        for (var E = 0, M = B; E < M.length; E++) {
          var I = M[E];
          i.addSkin(this._parseSkin(I));
        }
      }

      if (t.DataParser.PATH_CONSTRAINT in e) {
        var F = e[t.DataParser.PATH_CONSTRAINT];

        for (var C = 0, w = F; C < w.length; C++) {
          var N = w[C];

          var b = this._parsePathConstraint(N);

          if (b) {
            i.addConstraint(b);
          }
        }
      }

      for (var R = 0, k = this._cacheRawMeshes.length; R < k; ++R) {
        var j = this._cacheRawMeshes[R];

        var L = r._getString(j, t.DataParser.SHARE, "");

        if (L.length === 0) {
          continue;
        }

        var V = r._getString(j, t.DataParser.SKIN, t.DataParser.DEFAULT_NAME);

        if (V.length === 0) {
          V = t.DataParser.DEFAULT_NAME;
        }

        var Y = i.getMesh(V, "", L);

        if (Y === null) {
          continue;
        }

        var X = this._cacheMeshes[R];
        X.geometry.shareFrom(Y.geometry);
      }

      if (t.DataParser.ANIMATION in e) {
        var U = e[t.DataParser.ANIMATION];

        for (var G = 0, H = U; G < H.length; G++) {
          var z = H[G];

          var W = this._parseAnimation(z);

          i.addAnimation(W);
        }
      }

      if (t.DataParser.DEFAULT_ACTIONS in e) {
        var K = this._parseActionData(e[t.DataParser.DEFAULT_ACTIONS], 0, null, null);

        for (var Z = 0, q = K; Z < q.length; Z++) {
          var Q = q[Z];
          i.addAction(Q, true);

          if (Q.type === 0) {
            var W = i.getAnimation(Q.name);

            if (W !== null) {
              i.defaultAnimation = W;
            }
          }
        }
      }

      if (t.DataParser.ACTIONS in e) {
        var K = this._parseActionData(e[t.DataParser.ACTIONS], 0, null, null);

        for (var J = 0, $ = K; J < $.length; J++) {
          var Q = $[J];
          i.addAction(Q, false);
        }
      }

      this._rawBones.length = 0;
      this._cacheRawMeshes.length = 0;
      this._cacheMeshes.length = 0;
      this._armature = null;

      for (var tt in this._weightSlotPose) {
        delete this._weightSlotPose[tt];
      }

      for (var tt in this._weightBonePoses) {
        delete this._weightBonePoses[tt];
      }

      for (var tt in this._cacheBones) {
        delete this._cacheBones[tt];
      }

      for (var tt in this._slotChildActions) {
        delete this._slotChildActions[tt];
      }

      return i;
    };

    r.prototype._parseBone = function (e) {
      var a = 0;

      if (t.DataParser.TYPE in e && typeof e[t.DataParser.TYPE] === "string") {
        a = t.DataParser._getBoneType(e[t.DataParser.TYPE]);
      } else {
        a = r._getNumber(e, t.DataParser.TYPE, 0);
      }

      if (a === 0) {
        var i = this._armature.scale;
        var n = t.BaseObject.borrowObject(t.BoneData);
        n.inheritTranslation = r._getBoolean(e, t.DataParser.INHERIT_TRANSLATION, true);
        n.inheritRotation = r._getBoolean(e, t.DataParser.INHERIT_ROTATION, true);
        n.inheritScale = r._getBoolean(e, t.DataParser.INHERIT_SCALE, true);
        n.inheritReflection = r._getBoolean(e, t.DataParser.INHERIT_REFLECTION, true);
        n.length = r._getNumber(e, t.DataParser.LENGTH, 0) * i;
        n.alpha = r._getNumber(e, t.DataParser.ALPHA, 1);
        n.name = r._getString(e, t.DataParser.NAME, "");

        if (t.DataParser.TRANSFORM in e) {
          this._parseTransform(e[t.DataParser.TRANSFORM], n.transform, i);
        }

        return n;
      }

      var s = t.BaseObject.borrowObject(t.SurfaceData);
      s.alpha = r._getNumber(e, t.DataParser.ALPHA, 1);
      s.name = r._getString(e, t.DataParser.NAME, "");
      s.segmentX = r._getNumber(e, t.DataParser.SEGMENT_X, 0);
      s.segmentY = r._getNumber(e, t.DataParser.SEGMENT_Y, 0);

      this._parseGeometry(e, s.geometry);

      return s;
    };

    r.prototype._parseIKConstraint = function (e) {
      var a = this._armature.getBone(r._getString(e, t.DataParser.BONE, ""));

      if (a === null) {
        return null;
      }

      var i = this._armature.getBone(r._getString(e, t.DataParser.TARGET, ""));

      if (i === null) {
        return null;
      }

      var n = r._getNumber(e, t.DataParser.CHAIN, 0);

      var s = t.BaseObject.borrowObject(t.IKConstraintData);
      s.scaleEnabled = r._getBoolean(e, t.DataParser.SCALE, false);
      s.bendPositive = r._getBoolean(e, t.DataParser.BEND_POSITIVE, true);
      s.weight = r._getNumber(e, t.DataParser.WEIGHT, 1);
      s.name = r._getString(e, t.DataParser.NAME, "");
      s.type = 0;
      s.target = i;

      if (n > 0 && a.parent !== null) {
        s.root = a.parent;
        s.bone = a;
      } else {
        s.root = a;
        s.bone = null;
      }

      return s;
    };

    r.prototype._parsePathConstraint = function (e) {
      var a = this._armature.getSlot(r._getString(e, t.DataParser.TARGET, ""));

      if (a === null) {
        return null;
      }

      var i = this._armature.defaultSkin;

      if (i === null) {
        return null;
      }

      var n = i.getDisplay(a.name, r._getString(e, t.DataParser.TARGET_DISPLAY, a.name));

      if (n === null || !(n instanceof t.PathDisplayData)) {
        return null;
      }

      var s = e[t.DataParser.BONES];

      if (s === null || s.length === 0) {
        return null;
      }

      var o = t.BaseObject.borrowObject(t.PathConstraintData);
      o.name = r._getString(e, t.DataParser.NAME, "");
      o.type = 1;
      o.pathSlot = a;
      o.pathDisplayData = n;
      o.target = a.parent;
      o.positionMode = t.DataParser._getPositionMode(r._getString(e, t.DataParser.POSITION_MODE, ""));
      o.spacingMode = t.DataParser._getSpacingMode(r._getString(e, t.DataParser.SPACING_MODE, ""));
      o.rotateMode = t.DataParser._getRotateMode(r._getString(e, t.DataParser.ROTATE_MODE, ""));
      o.position = r._getNumber(e, t.DataParser.POSITION, 0);
      o.spacing = r._getNumber(e, t.DataParser.SPACING, 0);
      o.rotateOffset = r._getNumber(e, t.DataParser.ROTATE_OFFSET, 0);
      o.rotateMix = r._getNumber(e, t.DataParser.ROTATE_MIX, 1);
      o.translateMix = r._getNumber(e, t.DataParser.TRANSLATE_MIX, 1);

      for (var l = 0, h = s; l < h.length; l++) {
        var u = h[l];

        var f = this._armature.getBone(u);

        if (f !== null) {
          o.AddBone(f);

          if (o.root === null) {
            o.root = f;
          }
        }
      }

      return o;
    };

    r.prototype._parseSlot = function (e, a) {
      var i = t.BaseObject.borrowObject(t.SlotData);
      i.displayIndex = r._getNumber(e, t.DataParser.DISPLAY_INDEX, 0);
      i.zOrder = a;
      i.zIndex = r._getNumber(e, t.DataParser.Z_INDEX, 0);
      i.alpha = r._getNumber(e, t.DataParser.ALPHA, 1);
      i.name = r._getString(e, t.DataParser.NAME, "");
      i.parent = this._armature.getBone(r._getString(e, t.DataParser.PARENT, ""));

      if (t.DataParser.BLEND_MODE in e && typeof e[t.DataParser.BLEND_MODE] === "string") {
        i.blendMode = t.DataParser._getBlendMode(e[t.DataParser.BLEND_MODE]);
      } else {
        i.blendMode = r._getNumber(e, t.DataParser.BLEND_MODE, 0);
      }

      if (t.DataParser.COLOR in e) {
        i.color = t.SlotData.createColor();

        this._parseColorTransform(e[t.DataParser.COLOR], i.color);
      } else {
        i.color = t.SlotData.DEFAULT_COLOR;
      }

      if (t.DataParser.ACTIONS in e) {
        this._slotChildActions[i.name] = this._parseActionData(e[t.DataParser.ACTIONS], 0, null, null);
      }

      return i;
    };

    r.prototype._parseSkin = function (e) {
      var a = t.BaseObject.borrowObject(t.SkinData);
      a.name = r._getString(e, t.DataParser.NAME, t.DataParser.DEFAULT_NAME);

      if (a.name.length === 0) {
        a.name = t.DataParser.DEFAULT_NAME;
      }

      if (t.DataParser.SLOT in e) {
        var i = e[t.DataParser.SLOT];
        this._skin = a;

        for (var n = 0, s = i; n < s.length; n++) {
          var o = s[n];

          var l = r._getString(o, t.DataParser.NAME, "");

          var h = this._armature.getSlot(l);

          if (h !== null) {
            this._slot = h;

            if (t.DataParser.DISPLAY in o) {
              var u = o[t.DataParser.DISPLAY];

              for (var f = 0, _ = u; f < _.length; f++) {
                var m = _[f];

                if (m) {
                  a.addDisplay(l, this._parseDisplay(m));
                } else {
                  a.addDisplay(l, null);
                }
              }
            }

            this._slot = null;
          }
        }

        this._skin = null;
      }

      return a;
    };

    r.prototype._parseDisplay = function (e) {
      var a = r._getString(e, t.DataParser.NAME, "");

      var i = r._getString(e, t.DataParser.PATH, "");

      var n = 0;
      var s = null;

      if (t.DataParser.TYPE in e && typeof e[t.DataParser.TYPE] === "string") {
        n = t.DataParser._getDisplayType(e[t.DataParser.TYPE]);
      } else {
        n = r._getNumber(e, t.DataParser.TYPE, n);
      }

      switch (n) {
        case 0:
          {
            var o = s = t.BaseObject.borrowObject(t.ImageDisplayData);
            o.name = a;
            o.path = i.length > 0 ? i : a;

            this._parsePivot(e, o);

            break;
          }

        case 1:
          {
            var l = s = t.BaseObject.borrowObject(t.ArmatureDisplayData);
            l.name = a;
            l.path = i.length > 0 ? i : a;
            l.inheritAnimation = true;

            if (t.DataParser.ACTIONS in e) {
              var h = this._parseActionData(e[t.DataParser.ACTIONS], 0, null, null);

              for (var u = 0, f = h; u < f.length; u++) {
                var _ = f[u];
                l.addAction(_);
              }
            } else if (this._slot.name in this._slotChildActions) {
              var m = this._skin.getDisplays(this._slot.name);

              if (m === null ? this._slot.displayIndex === 0 : this._slot.displayIndex === m.length) {
                for (var p = 0, c = this._slotChildActions[this._slot.name]; p < c.length; p++) {
                  var _ = c[p];
                  l.addAction(_);
                }

                delete this._slotChildActions[this._slot.name];
              }
            }

            break;
          }

        case 2:
          {
            var d = s = t.BaseObject.borrowObject(t.MeshDisplayData);
            d.geometry.inheritDeform = r._getBoolean(e, t.DataParser.INHERIT_DEFORM, true);
            d.name = a;
            d.path = i.length > 0 ? i : a;

            if (t.DataParser.SHARE in e) {
              d.geometry.data = this._data;

              this._cacheRawMeshes.push(e);

              this._cacheMeshes.push(d);
            } else {
              this._parseMesh(e, d);
            }

            break;
          }

        case 3:
          {
            var y = this._parseBoundingBox(e);

            if (y !== null) {
              var v = s = t.BaseObject.borrowObject(t.BoundingBoxDisplayData);
              v.name = a;
              v.path = i.length > 0 ? i : a;
              v.boundingBox = y;
            }

            break;
          }

        case 4:
          {
            var g = e[t.DataParser.LENGTHS];
            var D = s = t.BaseObject.borrowObject(t.PathDisplayData);
            D.closed = r._getBoolean(e, t.DataParser.CLOSED, false);
            D.constantSpeed = r._getBoolean(e, t.DataParser.CONSTANT_SPEED, false);
            D.name = a;
            D.path = i.length > 0 ? i : a;
            D.curveLengths.length = g.length;

            for (var T = 0, b = g.length; T < b; ++T) {
              D.curveLengths[T] = g[T];
            }

            this._parsePath(e, D);

            break;
          }
      }

      if (s !== null && t.DataParser.TRANSFORM in e) {
        this._parseTransform(e[t.DataParser.TRANSFORM], s.transform, this._armature.scale);
      }

      return s;
    };

    r.prototype._parsePath = function (t, e) {
      this._parseGeometry(t, e.geometry);
    };

    r.prototype._parsePivot = function (e, a) {
      if (t.DataParser.PIVOT in e) {
        var i = e[t.DataParser.PIVOT];
        a.pivot.x = r._getNumber(i, t.DataParser.X, 0);
        a.pivot.y = r._getNumber(i, t.DataParser.Y, 0);
      } else {
        a.pivot.x = .5;
        a.pivot.y = .5;
      }
    };

    r.prototype._parseMesh = function (e, a) {
      this._parseGeometry(e, a.geometry);

      if (t.DataParser.WEIGHTS in e) {
        var r = e[t.DataParser.SLOT_POSE];
        var i = e[t.DataParser.BONE_POSE];
        var n = this._skin.name + "_" + this._slot.name + "_" + a.name;
        this._weightSlotPose[n] = r;
        this._weightBonePoses[n] = i;
      }
    };

    r.prototype._parseBoundingBox = function (e) {
      var a = null;
      var i = 0;

      if (t.DataParser.SUB_TYPE in e && typeof e[t.DataParser.SUB_TYPE] === "string") {
        i = t.DataParser._getBoundingBoxType(e[t.DataParser.SUB_TYPE]);
      } else {
        i = r._getNumber(e, t.DataParser.SUB_TYPE, i);
      }

      switch (i) {
        case 0:
          a = t.BaseObject.borrowObject(t.RectangleBoundingBoxData);
          break;

        case 1:
          a = t.BaseObject.borrowObject(t.EllipseBoundingBoxData);
          break;

        case 2:
          a = this._parsePolygonBoundingBox(e);
          break;
      }

      if (a !== null) {
        a.color = r._getNumber(e, t.DataParser.COLOR, 0);

        if (a.type === 0 || a.type === 1) {
          a.width = r._getNumber(e, t.DataParser.WIDTH, 0);
          a.height = r._getNumber(e, t.DataParser.HEIGHT, 0);
        }
      }

      return a;
    };

    r.prototype._parsePolygonBoundingBox = function (e) {
      var a = t.BaseObject.borrowObject(t.PolygonBoundingBoxData);

      if (t.DataParser.VERTICES in e) {
        var r = this._armature.scale;
        var i = e[t.DataParser.VERTICES];
        var n = a.vertices;
        n.length = i.length;

        for (var s = 0, o = i.length; s < o; s += 2) {
          var l = i[s] * r;
          var h = i[s + 1] * r;
          n[s] = l;
          n[s + 1] = h;

          if (s === 0) {
            a.x = l;
            a.y = h;
            a.width = l;
            a.height = h;
          } else {
            if (l < a.x) {
              a.x = l;
            } else if (l > a.width) {
              a.width = l;
            }

            if (h < a.y) {
              a.y = h;
            } else if (h > a.height) {
              a.height = h;
            }
          }
        }

        a.width -= a.x;
        a.height -= a.y;
      } else {
        console.warn("Data error.\n Please reexport DragonBones Data to fixed the bug.");
      }

      return a;
    };

    r.prototype._parseAnimation = function (e) {
      var a = t.BaseObject.borrowObject(t.AnimationData);
      a.blendType = t.DataParser._getAnimationBlendType(r._getString(e, t.DataParser.BLEND_TYPE, ""));
      a.frameCount = r._getNumber(e, t.DataParser.DURATION, 0);
      a.playTimes = r._getNumber(e, t.DataParser.PLAY_TIMES, 1);
      a.duration = a.frameCount / this._armature.frameRate;
      a.fadeInTime = r._getNumber(e, t.DataParser.FADE_IN_TIME, 0);
      a.scale = r._getNumber(e, t.DataParser.SCALE, 1);
      a.name = r._getString(e, t.DataParser.NAME, t.DataParser.DEFAULT_NAME);

      if (a.name.length === 0) {
        a.name = t.DataParser.DEFAULT_NAME;
      }

      a.frameIntOffset = this._frameIntArray.length;
      a.frameFloatOffset = this._frameFloatArray.length;
      a.frameOffset = this._frameArray.length;
      this._animation = a;

      if (t.DataParser.FRAME in e) {
        var i = e[t.DataParser.FRAME];
        var n = i.length;

        if (n > 0) {
          for (var s = 0, o = 0; s < n; ++s) {
            var l = i[s];

            this._parseActionDataInFrame(l, o, null, null);

            o += r._getNumber(l, t.DataParser.DURATION, 1);
          }
        }
      }

      if (t.DataParser.Z_ORDER in e) {
        this._animation.zOrderTimeline = this._parseTimeline(e[t.DataParser.Z_ORDER], null, t.DataParser.FRAME, 1, 0, 0, this._parseZOrderFrame);
      }

      if (t.DataParser.BONE in e) {
        var h = e[t.DataParser.BONE];

        for (var u = 0, f = h; u < f.length; u++) {
          var _ = f[u];

          this._parseBoneTimeline(_);
        }
      }

      if (t.DataParser.SLOT in e) {
        var h = e[t.DataParser.SLOT];

        for (var m = 0, p = h; m < p.length; m++) {
          var _ = p[m];

          this._parseSlotTimeline(_);
        }
      }

      if (t.DataParser.FFD in e) {
        var h = e[t.DataParser.FFD];

        for (var c = 0, d = h; c < d.length; c++) {
          var _ = d[c];

          var y = r._getString(_, t.DataParser.SKIN, t.DataParser.DEFAULT_NAME);

          var v = r._getString(_, t.DataParser.SLOT, "");

          var g = r._getString(_, t.DataParser.NAME, "");

          if (y.length === 0) {
            y = t.DataParser.DEFAULT_NAME;
          }

          this._slot = this._armature.getSlot(v);
          this._mesh = this._armature.getMesh(y, v, g);

          if (this._slot === null || this._mesh === null) {
            continue;
          }

          var D = this._parseTimeline(_, null, t.DataParser.FRAME, 22, 2, 0, this._parseSlotDeformFrame);

          if (D !== null) {
            this._animation.addSlotTimeline(v, D);
          }

          this._slot = null;
          this._mesh = null;
        }
      }

      if (t.DataParser.IK in e) {
        var h = e[t.DataParser.IK];

        for (var T = 0, b = h; T < b.length; T++) {
          var _ = b[T];

          var A = r._getString(_, t.DataParser.NAME, "");

          var P = this._armature.getConstraint(A);

          if (P === null) {
            continue;
          }

          var D = this._parseTimeline(_, null, t.DataParser.FRAME, 30, 1, 2, this._parseIKConstraintFrame);

          if (D !== null) {
            this._animation.addConstraintTimeline(A, D);
          }
        }
      }

      if (this._actionFrames.length > 0) {
        this._animation.actionTimeline = this._parseTimeline(null, this._actionFrames, "", 0, 0, 0, this._parseActionFrame);
        this._actionFrames.length = 0;
      }

      if (t.DataParser.TIMELINE in e) {
        var h = e[t.DataParser.TIMELINE];

        for (var S = 0, O = h; S < O.length; S++) {
          var _ = O[S];

          var x = r._getNumber(_, t.DataParser.TYPE, 0);

          var B = r._getString(_, t.DataParser.NAME, "");

          var D = null;

          switch (x) {
            case 0:
              break;

            case 20:
            case 23:
            case 60:
            case 24:
            case 40:
            case 41:
              if (x === 20) {
                this._frameValueType = 0;
                this._frameValueScale = 1;
              } else {
                this._frameValueType = 1;

                if (x === 23) {
                  this._frameValueScale = 1;
                } else if (x === 40 || x === 41) {
                  this._frameValueScale = 1e4;
                } else {
                  this._frameValueScale = 100;
                }
              }

              if (x === 60 || x === 24 || x === 41) {
                this._frameDefaultValue = 1;
              } else {
                this._frameDefaultValue = 0;
              }

              if (x === 40 && a.blendType !== 0) {
                D = t.BaseObject.borrowObject(t.AnimationTimelineData);
                var E = D;
                E.x = r._getNumber(_, t.DataParser.X, 0);
                E.y = r._getNumber(_, t.DataParser.Y, 0);
              }

              D = this._parseTimeline(_, null, t.DataParser.FRAME, x, this._frameValueType, 1, this._parseSingleValueFrame, D);
              break;

            case 11:
            case 12:
            case 13:
            case 30:
            case 42:
              if (x === 30 || x === 42) {
                this._frameValueType = 1;

                if (x === 42) {
                  this._frameValueScale = 1e4;
                } else {
                  this._frameValueScale = 100;
                }
              } else {
                if (x === 12) {
                  this._frameValueScale = t.Transform.DEG_RAD;
                } else {
                  this._frameValueScale = 1;
                }

                this._frameValueType = 2;
              }

              if (x === 13 || x === 30) {
                this._frameDefaultValue = 1;
              } else {
                this._frameDefaultValue = 0;
              }

              D = this._parseTimeline(_, null, t.DataParser.FRAME, x, this._frameValueType, 2, this._parseDoubleValueFrame);
              break;

            case 1:
              break;

            case 50:
              {
                var M = this._armature.getBone(B);

                if (M === null) {
                  continue;
                }

                this._geometry = M.geometry;
                D = this._parseTimeline(_, null, t.DataParser.FRAME, x, 2, 0, this._parseDeformFrame);
                this._geometry = null;
                break;
              }

            case 22:
              {
                this._geometry = null;

                for (var y in this._armature.skins) {
                  var I = this._armature.skins[y];

                  for (var F in I.displays) {
                    var C = I.displays[F];

                    for (var w = 0, N = C; w < N.length; w++) {
                      var R = N[w];

                      if (R !== null && R.name === B) {
                        this._geometry = R.geometry;
                        break;
                      }
                    }
                  }
                }

                if (this._geometry === null) {
                  continue;
                }

                D = this._parseTimeline(_, null, t.DataParser.FRAME, x, 2, 0, this._parseDeformFrame);
                this._geometry = null;
                break;
              }

            case 21:
              D = this._parseTimeline(_, null, t.DataParser.FRAME, x, 1, 1, this._parseSlotColorFrame);
              break;
          }

          if (D !== null) {
            switch (x) {
              case 0:
                break;

              case 1:
                break;

              case 11:
              case 12:
              case 13:
              case 50:
              case 60:
                this._animation.addBoneTimeline(B, D);

                break;

              case 20:
              case 21:
              case 22:
              case 23:
              case 24:
                this._animation.addSlotTimeline(B, D);

                break;

              case 30:
                this._animation.addConstraintTimeline(B, D);

                break;

              case 40:
              case 41:
              case 42:
                this._animation.addAnimationTimeline(B, D);

                break;
            }
          }
        }
      }

      this._animation = null;
      return a;
    };

    r.prototype._parseTimeline = function (e, i, n, s, o, l, h, u) {
      if (u === void 0) {
        u = null;
      }

      if (e !== null && n.length > 0 && n in e) {
        i = e[n];
      }

      if (i === null) {
        return null;
      }

      var f = i.length;

      if (f === 0) {
        return null;
      }

      var _ = this._frameIntArray.length;
      var m = this._frameFloatArray.length;
      var p = this._timelineArray.length;

      if (u === null) {
        u = t.BaseObject.borrowObject(t.TimelineData);
      }

      u.type = s;
      u.offset = p;
      this._frameValueType = o;
      this._timeline = u;
      this._timelineArray.length += 1 + 1 + 1 + 1 + 1 + f;

      if (e !== null) {
        this._timelineArray[p + 0] = Math.round(r._getNumber(e, t.DataParser.SCALE, 1) * 100);
        this._timelineArray[p + 1] = Math.round(r._getNumber(e, t.DataParser.OFFSET, 0) * 100);
      } else {
        this._timelineArray[p + 0] = 100;
        this._timelineArray[p + 1] = 0;
      }

      this._timelineArray[p + 2] = f;
      this._timelineArray[p + 3] = l;

      switch (this._frameValueType) {
        case 0:
          this._timelineArray[p + 4] = 0;
          break;

        case 1:
          this._timelineArray[p + 4] = _ - this._animation.frameIntOffset;
          break;

        case 2:
          this._timelineArray[p + 4] = m - this._animation.frameFloatOffset;
          break;
      }

      if (f === 1) {
        u.frameIndicesOffset = -1;
        this._timelineArray[p + 5 + 0] = h.call(this, i[0], 0, 0) - this._animation.frameOffset;
      } else {
        var c = this._animation.frameCount + 1;
        var d = this._data.frameIndices;
        var y = d.length;
        d.length += c;
        u.frameIndicesOffset = y;

        for (var v = 0, g = 0, D = 0, T = 0; v < c; ++v) {
          if (D + T <= v && g < f) {
            var b = i[g];
            D = v;

            if (g === f - 1) {
              T = this._animation.frameCount - D;
            } else {
              if (b instanceof a) {
                T = this._actionFrames[g + 1].frameStart - D;
              } else {
                T = r._getNumber(b, t.DataParser.DURATION, 1);
              }
            }

            this._timelineArray[p + 5 + g] = h.call(this, b, D, T) - this._animation.frameOffset;
            g++;
          }

          d[y + v] = g - 1;
        }
      }

      this._timeline = null;
      return u;
    };

    r.prototype._parseBoneTimeline = function (e) {
      var a = this._armature.getBone(r._getString(e, t.DataParser.NAME, ""));

      if (a === null) {
        return;
      }

      this._bone = a;
      this._slot = this._armature.getSlot(this._bone.name);

      if (t.DataParser.TRANSLATE_FRAME in e) {
        this._frameDefaultValue = 0;
        this._frameValueScale = 1;

        var i = this._parseTimeline(e, null, t.DataParser.TRANSLATE_FRAME, 11, 2, 2, this._parseDoubleValueFrame);

        if (i !== null) {
          this._animation.addBoneTimeline(a.name, i);
        }
      }

      if (t.DataParser.ROTATE_FRAME in e) {
        this._frameDefaultValue = 0;
        this._frameValueScale = 1;

        var i = this._parseTimeline(e, null, t.DataParser.ROTATE_FRAME, 12, 2, 2, this._parseBoneRotateFrame);

        if (i !== null) {
          this._animation.addBoneTimeline(a.name, i);
        }
      }

      if (t.DataParser.SCALE_FRAME in e) {
        this._frameDefaultValue = 1;
        this._frameValueScale = 1;

        var i = this._parseTimeline(e, null, t.DataParser.SCALE_FRAME, 13, 2, 2, this._parseBoneScaleFrame);

        if (i !== null) {
          this._animation.addBoneTimeline(a.name, i);
        }
      }

      if (t.DataParser.FRAME in e) {
        var i = this._parseTimeline(e, null, t.DataParser.FRAME, 10, 2, 6, this._parseBoneAllFrame);

        if (i !== null) {
          this._animation.addBoneTimeline(a.name, i);
        }
      }

      this._bone = null;
      this._slot = null;
    };

    r.prototype._parseSlotTimeline = function (e) {
      var a = this._armature.getSlot(r._getString(e, t.DataParser.NAME, ""));

      if (a === null) {
        return;
      }

      var i = null;
      var n = null;
      this._slot = a;

      if (t.DataParser.DISPLAY_FRAME in e) {
        i = this._parseTimeline(e, null, t.DataParser.DISPLAY_FRAME, 20, 0, 0, this._parseSlotDisplayFrame);
      } else {
        i = this._parseTimeline(e, null, t.DataParser.FRAME, 20, 0, 0, this._parseSlotDisplayFrame);
      }

      if (t.DataParser.COLOR_FRAME in e) {
        n = this._parseTimeline(e, null, t.DataParser.COLOR_FRAME, 21, 1, 1, this._parseSlotColorFrame);
      } else {
        n = this._parseTimeline(e, null, t.DataParser.FRAME, 21, 1, 1, this._parseSlotColorFrame);
      }

      if (i !== null) {
        this._animation.addSlotTimeline(a.name, i);
      }

      if (n !== null) {
        this._animation.addSlotTimeline(a.name, n);
      }

      this._slot = null;
    };

    r.prototype._parseFrame = function (t, e, a) {
      t;
      a;
      var r = this._frameArray.length;
      this._frameArray.length += 1;
      this._frameArray[r + 0] = e;
      return r;
    };

    r.prototype._parseTweenFrame = function (e, a, i) {
      var n = this._parseFrame(e, a, i);

      if (i > 0) {
        if (t.DataParser.CURVE in e) {
          var s = i + 1;
          this._helpArray.length = s;

          var o = this._samplingEasingCurve(e[t.DataParser.CURVE], this._helpArray);

          this._frameArray.length += 1 + 1 + this._helpArray.length;
          this._frameArray[n + 1] = 2;
          this._frameArray[n + 2] = o ? s : -s;

          for (var l = 0; l < s; ++l) {
            this._frameArray[n + 3 + l] = Math.round(this._helpArray[l] * 1e4);
          }
        } else {
          var h = -2;
          var u = h;

          if (t.DataParser.TWEEN_EASING in e) {
            u = r._getNumber(e, t.DataParser.TWEEN_EASING, h);
          }

          if (u === h) {
            this._frameArray.length += 1;
            this._frameArray[n + 1] = 0;
          } else if (u === 0) {
            this._frameArray.length += 1;
            this._frameArray[n + 1] = 1;
          } else if (u < 0) {
            this._frameArray.length += 1 + 1;
            this._frameArray[n + 1] = 3;
            this._frameArray[n + 2] = Math.round(-u * 100);
          } else if (u <= 1) {
            this._frameArray.length += 1 + 1;
            this._frameArray[n + 1] = 4;
            this._frameArray[n + 2] = Math.round(u * 100);
          } else {
            this._frameArray.length += 1 + 1;
            this._frameArray[n + 1] = 5;
            this._frameArray[n + 2] = Math.round(u * 100 - 100);
          }
        }
      } else {
        this._frameArray.length += 1;
        this._frameArray[n + 1] = 0;
      }

      return n;
    };

    r.prototype._parseSingleValueFrame = function (e, a, i) {
      var n = 0;

      switch (this._frameValueType) {
        case 0:
          {
            n = this._parseFrame(e, a, i);
            this._frameArray.length += 1;
            this._frameArray[n + 1] = r._getNumber(e, t.DataParser.VALUE, this._frameDefaultValue);
            break;
          }

        case 1:
          {
            n = this._parseTweenFrame(e, a, i);
            var s = this._frameIntArray.length;
            this._frameIntArray.length += 1;
            this._frameIntArray[s] = Math.round(r._getNumber(e, t.DataParser.VALUE, this._frameDefaultValue) * this._frameValueScale);
            break;
          }

        case 2:
          {
            n = this._parseTweenFrame(e, a, i);
            var s = this._frameFloatArray.length;
            this._frameFloatArray.length += 1;
            this._frameFloatArray[s] = r._getNumber(e, t.DataParser.VALUE, this._frameDefaultValue) * this._frameValueScale;
            break;
          }
      }

      return n;
    };

    r.prototype._parseDoubleValueFrame = function (e, a, i) {
      var n = 0;

      switch (this._frameValueType) {
        case 0:
          {
            n = this._parseFrame(e, a, i);
            this._frameArray.length += 2;
            this._frameArray[n + 1] = r._getNumber(e, t.DataParser.X, this._frameDefaultValue);
            this._frameArray[n + 2] = r._getNumber(e, t.DataParser.Y, this._frameDefaultValue);
            break;
          }

        case 1:
          {
            n = this._parseTweenFrame(e, a, i);
            var s = this._frameIntArray.length;
            this._frameIntArray.length += 2;
            this._frameIntArray[s] = Math.round(r._getNumber(e, t.DataParser.X, this._frameDefaultValue) * this._frameValueScale);
            this._frameIntArray[s + 1] = Math.round(r._getNumber(e, t.DataParser.Y, this._frameDefaultValue) * this._frameValueScale);
            break;
          }

        case 2:
          {
            n = this._parseTweenFrame(e, a, i);
            var s = this._frameFloatArray.length;
            this._frameFloatArray.length += 2;
            this._frameFloatArray[s] = r._getNumber(e, t.DataParser.X, this._frameDefaultValue) * this._frameValueScale;
            this._frameFloatArray[s + 1] = r._getNumber(e, t.DataParser.Y, this._frameDefaultValue) * this._frameValueScale;
            break;
          }
      }

      return n;
    };

    r.prototype._parseActionFrame = function (t, e, a) {
      a;
      var r = this._frameArray.length;
      var i = t.actions.length;
      this._frameArray.length += 1 + 1 + i;
      this._frameArray[r + 0] = e;
      this._frameArray[r + 0 + 1] = i;

      for (var n = 0; n < i; ++n) {
        this._frameArray[r + 0 + 2 + n] = t.actions[n];
      }

      return r;
    };

    r.prototype._parseZOrderFrame = function (e, a, r) {
      var i = this._parseFrame(e, a, r);

      if (t.DataParser.Z_ORDER in e) {
        var n = e[t.DataParser.Z_ORDER];

        if (n.length > 0) {
          var s = this._armature.sortedSlots.length;
          var o = new Array(s - n.length / 2);
          var l = new Array(s);

          for (var h = 0; h < o.length; ++h) {
            o[h] = 0;
          }

          for (var u = 0; u < s; ++u) {
            l[u] = -1;
          }

          var f = 0;
          var _ = 0;

          for (var m = 0, p = n.length; m < p; m += 2) {
            var c = n[m];
            var d = n[m + 1];

            while (f !== c) {
              o[_++] = f++;
            }

            var y = f + d;
            l[y] = f++;
          }

          while (f < s) {
            o[_++] = f++;
          }

          this._frameArray.length += 1 + s;
          this._frameArray[i + 1] = s;
          var v = s;

          while (v--) {
            if (l[v] === -1) {
              this._frameArray[i + 2 + v] = o[--_] || 0;
            } else {
              this._frameArray[i + 2 + v] = l[v] || 0;
            }
          }

          return i;
        }
      }

      this._frameArray.length += 1;
      this._frameArray[i + 1] = 0;
      return i;
    };

    r.prototype._parseBoneAllFrame = function (e, a, i) {
      this._helpTransform.identity();

      if (t.DataParser.TRANSFORM in e) {
        this._parseTransform(e[t.DataParser.TRANSFORM], this._helpTransform, 1);
      }

      var n = this._helpTransform.rotation;

      if (a !== 0) {
        if (this._prevClockwise === 0) {
          n = this._prevRotation + t.Transform.normalizeRadian(n - this._prevRotation);
        } else {
          if (this._prevClockwise > 0 ? n >= this._prevRotation : n <= this._prevRotation) {
            this._prevClockwise = this._prevClockwise > 0 ? this._prevClockwise - 1 : this._prevClockwise + 1;
          }

          n = this._prevRotation + n - this._prevRotation + t.Transform.PI_D * this._prevClockwise;
        }
      }

      this._prevClockwise = r._getNumber(e, t.DataParser.TWEEN_ROTATE, 0);
      this._prevRotation = n;

      var s = this._parseTweenFrame(e, a, i);

      var o = this._frameFloatArray.length;
      this._frameFloatArray.length += 6;
      this._frameFloatArray[o++] = this._helpTransform.x;
      this._frameFloatArray[o++] = this._helpTransform.y;
      this._frameFloatArray[o++] = n;
      this._frameFloatArray[o++] = this._helpTransform.skew;
      this._frameFloatArray[o++] = this._helpTransform.scaleX;
      this._frameFloatArray[o++] = this._helpTransform.scaleY;

      this._parseActionDataInFrame(e, a, this._bone, this._slot);

      return s;
    };

    r.prototype._parseBoneTranslateFrame = function (e, a, i) {
      var n = this._parseTweenFrame(e, a, i);

      var s = this._frameFloatArray.length;
      this._frameFloatArray.length += 2;
      this._frameFloatArray[s++] = r._getNumber(e, t.DataParser.X, 0);
      this._frameFloatArray[s++] = r._getNumber(e, t.DataParser.Y, 0);
      return n;
    };

    r.prototype._parseBoneRotateFrame = function (e, a, i) {
      var n = r._getNumber(e, t.DataParser.ROTATE, 0) * t.Transform.DEG_RAD;

      if (a !== 0) {
        if (this._prevClockwise === 0) {
          n = this._prevRotation + t.Transform.normalizeRadian(n - this._prevRotation);
        } else {
          if (this._prevClockwise > 0 ? n >= this._prevRotation : n <= this._prevRotation) {
            this._prevClockwise = this._prevClockwise > 0 ? this._prevClockwise - 1 : this._prevClockwise + 1;
          }

          n = this._prevRotation + n - this._prevRotation + t.Transform.PI_D * this._prevClockwise;
        }
      }

      this._prevClockwise = r._getNumber(e, t.DataParser.CLOCK_WISE, 0);
      this._prevRotation = n;

      var s = this._parseTweenFrame(e, a, i);

      var o = this._frameFloatArray.length;
      this._frameFloatArray.length += 2;
      this._frameFloatArray[o++] = n;
      this._frameFloatArray[o++] = r._getNumber(e, t.DataParser.SKEW, 0) * t.Transform.DEG_RAD;
      return s;
    };

    r.prototype._parseBoneScaleFrame = function (e, a, i) {
      var n = this._parseTweenFrame(e, a, i);

      var s = this._frameFloatArray.length;
      this._frameFloatArray.length += 2;
      this._frameFloatArray[s++] = r._getNumber(e, t.DataParser.X, 1);
      this._frameFloatArray[s++] = r._getNumber(e, t.DataParser.Y, 1);
      return n;
    };

    r.prototype._parseSlotDisplayFrame = function (e, a, i) {
      var n = this._parseFrame(e, a, i);

      this._frameArray.length += 1;

      if (t.DataParser.VALUE in e) {
        this._frameArray[n + 1] = r._getNumber(e, t.DataParser.VALUE, 0);
      } else {
        this._frameArray[n + 1] = r._getNumber(e, t.DataParser.DISPLAY_INDEX, 0);
      }

      this._parseActionDataInFrame(e, a, this._slot.parent, this._slot);

      return n;
    };

    r.prototype._parseSlotColorFrame = function (e, a, r) {
      var i = this._parseTweenFrame(e, a, r);

      var n = -1;

      if (t.DataParser.VALUE in e || t.DataParser.COLOR in e) {
        var s = t.DataParser.VALUE in e ? e[t.DataParser.VALUE] : e[t.DataParser.COLOR];

        for (var o in s) {
          o;

          this._parseColorTransform(s, this._helpColorTransform);

          n = this._colorArray.length;
          this._colorArray.length += 8;
          this._colorArray[n++] = Math.round(this._helpColorTransform.alphaMultiplier * 100);
          this._colorArray[n++] = Math.round(this._helpColorTransform.redMultiplier * 100);
          this._colorArray[n++] = Math.round(this._helpColorTransform.greenMultiplier * 100);
          this._colorArray[n++] = Math.round(this._helpColorTransform.blueMultiplier * 100);
          this._colorArray[n++] = Math.round(this._helpColorTransform.alphaOffset);
          this._colorArray[n++] = Math.round(this._helpColorTransform.redOffset);
          this._colorArray[n++] = Math.round(this._helpColorTransform.greenOffset);
          this._colorArray[n++] = Math.round(this._helpColorTransform.blueOffset);
          n -= 8;
          break;
        }
      }

      if (n < 0) {
        if (this._defaultColorOffset < 0) {
          this._defaultColorOffset = n = this._colorArray.length;
          this._colorArray.length += 8;
          this._colorArray[n++] = 100;
          this._colorArray[n++] = 100;
          this._colorArray[n++] = 100;
          this._colorArray[n++] = 100;
          this._colorArray[n++] = 0;
          this._colorArray[n++] = 0;
          this._colorArray[n++] = 0;
          this._colorArray[n++] = 0;
        }

        n = this._defaultColorOffset;
      }

      var l = this._frameIntArray.length;
      this._frameIntArray.length += 1;
      this._frameIntArray[l] = n;
      return i;
    };

    r.prototype._parseSlotDeformFrame = function (e, a, i) {
      var n = this._frameFloatArray.length;

      var s = this._parseTweenFrame(e, a, i);

      var o = t.DataParser.VERTICES in e ? e[t.DataParser.VERTICES] : null;

      var l = r._getNumber(e, t.DataParser.OFFSET, 0);

      var h = this._intArray[this._mesh.geometry.offset + 0];
      var u = this._mesh.parent.name + "_" + this._slot.name + "_" + this._mesh.name;
      var f = this._mesh.geometry.weight;
      var _ = 0;
      var m = 0;
      var p = 0;
      var c = 0;

      if (f !== null) {
        var d = this._weightSlotPose[u];

        this._helpMatrixA.copyFromArray(d, 0);

        this._frameFloatArray.length += f.count * 2;
        p = f.offset + 2 + f.bones.length;
      } else {
        this._frameFloatArray.length += h * 2;
      }

      for (var y = 0; y < h * 2; y += 2) {
        if (o === null) {
          _ = 0;
          m = 0;
        } else {
          if (y < l || y - l >= o.length) {
            _ = 0;
          } else {
            _ = o[y - l];
          }

          if (y + 1 < l || y + 1 - l >= o.length) {
            m = 0;
          } else {
            m = o[y + 1 - l];
          }
        }

        if (f !== null) {
          var v = this._weightBonePoses[u];
          var g = this._intArray[p++];

          this._helpMatrixA.transformPoint(_, m, this._helpPoint, true);

          _ = this._helpPoint.x;
          m = this._helpPoint.y;

          for (var D = 0; D < g; ++D) {
            var T = this._intArray[p++];

            this._helpMatrixB.copyFromArray(v, T * 7 + 1);

            this._helpMatrixB.invert();

            this._helpMatrixB.transformPoint(_, m, this._helpPoint, true);

            this._frameFloatArray[n + c++] = this._helpPoint.x;
            this._frameFloatArray[n + c++] = this._helpPoint.y;
          }
        } else {
          this._frameFloatArray[n + y] = _;
          this._frameFloatArray[n + y + 1] = m;
        }
      }

      if (a === 0) {
        var b = this._frameIntArray.length;
        this._frameIntArray.length += 1 + 1 + 1 + 1 + 1;
        this._frameIntArray[b + 0] = this._mesh.geometry.offset;
        this._frameIntArray[b + 1] = this._frameFloatArray.length - n;
        this._frameIntArray[b + 2] = this._frameFloatArray.length - n;
        this._frameIntArray[b + 3] = 0;
        this._frameIntArray[b + 4] = n - this._animation.frameFloatOffset;
        this._timelineArray[this._timeline.offset + 3] = b - this._animation.frameIntOffset;
      }

      return s;
    };

    r.prototype._parseIKConstraintFrame = function (e, a, i) {
      var n = this._parseTweenFrame(e, a, i);

      var s = this._frameIntArray.length;
      this._frameIntArray.length += 2;
      this._frameIntArray[s++] = r._getBoolean(e, t.DataParser.BEND_POSITIVE, true) ? 1 : 0;
      this._frameIntArray[s++] = Math.round(r._getNumber(e, t.DataParser.WEIGHT, 1) * 100);
      return n;
    };

    r.prototype._parseActionData = function (e, a, i, n) {
      var s = new Array();

      if (typeof e === "string") {
        var o = t.BaseObject.borrowObject(t.ActionData);
        o.type = a;
        o.name = e;
        o.bone = i;
        o.slot = n;
        s.push(o);
      } else if (e instanceof Array) {
        for (var l = 0, h = e; l < h.length; l++) {
          var u = h[l];
          var o = t.BaseObject.borrowObject(t.ActionData);

          if (t.DataParser.GOTO_AND_PLAY in u) {
            o.type = 0;
            o.name = r._getString(u, t.DataParser.GOTO_AND_PLAY, "");
          } else {
            if (t.DataParser.TYPE in u && typeof u[t.DataParser.TYPE] === "string") {
              o.type = t.DataParser._getActionType(u[t.DataParser.TYPE]);
            } else {
              o.type = r._getNumber(u, t.DataParser.TYPE, a);
            }

            o.name = r._getString(u, t.DataParser.NAME, "");
          }

          if (t.DataParser.BONE in u) {
            var f = r._getString(u, t.DataParser.BONE, "");

            o.bone = this._armature.getBone(f);
          } else {
            o.bone = i;
          }

          if (t.DataParser.SLOT in u) {
            var _ = r._getString(u, t.DataParser.SLOT, "");

            o.slot = this._armature.getSlot(_);
          } else {
            o.slot = n;
          }

          var m = null;

          if (t.DataParser.INTS in u) {
            if (m === null) {
              m = t.BaseObject.borrowObject(t.UserData);
            }

            var p = u[t.DataParser.INTS];

            for (var c = 0, d = p; c < d.length; c++) {
              var y = d[c];
              m.addInt(y);
            }
          }

          if (t.DataParser.FLOATS in u) {
            if (m === null) {
              m = t.BaseObject.borrowObject(t.UserData);
            }

            var v = u[t.DataParser.FLOATS];

            for (var g = 0, D = v; g < D.length; g++) {
              var y = D[g];
              m.addFloat(y);
            }
          }

          if (t.DataParser.STRINGS in u) {
            if (m === null) {
              m = t.BaseObject.borrowObject(t.UserData);
            }

            var T = u[t.DataParser.STRINGS];

            for (var b = 0, A = T; b < A.length; b++) {
              var y = A[b];
              m.addString(y);
            }
          }

          o.data = m;
          s.push(o);
        }
      }

      return s;
    };

    r.prototype._parseDeformFrame = function (e, a, i) {
      var n = this._frameFloatArray.length;

      var s = this._parseTweenFrame(e, a, i);

      var o = t.DataParser.VERTICES in e ? e[t.DataParser.VERTICES] : t.DataParser.VALUE in e ? e[t.DataParser.VALUE] : null;

      var l = r._getNumber(e, t.DataParser.OFFSET, 0);

      var h = this._intArray[this._geometry.offset + 0];
      var u = this._geometry.weight;
      var f = 0;
      var _ = 0;

      if (u !== null) {} else {
        this._frameFloatArray.length += h * 2;

        for (var m = 0; m < h * 2; m += 2) {
          if (o !== null) {
            if (m < l || m - l >= o.length) {
              f = 0;
            } else {
              f = o[m - l];
            }

            if (m + 1 < l || m + 1 - l >= o.length) {
              _ = 0;
            } else {
              _ = o[m + 1 - l];
            }
          } else {
            f = 0;
            _ = 0;
          }

          this._frameFloatArray[n + m] = f;
          this._frameFloatArray[n + m + 1] = _;
        }
      }

      if (a === 0) {
        var p = this._frameIntArray.length;
        this._frameIntArray.length += 1 + 1 + 1 + 1 + 1;
        this._frameIntArray[p + 0] = this._geometry.offset;
        this._frameIntArray[p + 1] = this._frameFloatArray.length - n;
        this._frameIntArray[p + 2] = this._frameFloatArray.length - n;
        this._frameIntArray[p + 3] = 0;
        this._frameIntArray[p + 4] = n - this._animation.frameFloatOffset;
        this._timelineArray[this._timeline.offset + 3] = p - this._animation.frameIntOffset;
      }

      return s;
    };

    r.prototype._parseTransform = function (e, a, i) {
      a.x = r._getNumber(e, t.DataParser.X, 0) * i;
      a.y = r._getNumber(e, t.DataParser.Y, 0) * i;

      if (t.DataParser.ROTATE in e || t.DataParser.SKEW in e) {
        a.rotation = t.Transform.normalizeRadian(r._getNumber(e, t.DataParser.ROTATE, 0) * t.Transform.DEG_RAD);
        a.skew = t.Transform.normalizeRadian(r._getNumber(e, t.DataParser.SKEW, 0) * t.Transform.DEG_RAD);
      } else if (t.DataParser.SKEW_X in e || t.DataParser.SKEW_Y in e) {
        a.rotation = t.Transform.normalizeRadian(r._getNumber(e, t.DataParser.SKEW_Y, 0) * t.Transform.DEG_RAD);
        a.skew = t.Transform.normalizeRadian(r._getNumber(e, t.DataParser.SKEW_X, 0) * t.Transform.DEG_RAD) - a.rotation;
      }

      a.scaleX = r._getNumber(e, t.DataParser.SCALE_X, 1);
      a.scaleY = r._getNumber(e, t.DataParser.SCALE_Y, 1);
    };

    r.prototype._parseColorTransform = function (e, a) {
      a.alphaMultiplier = r._getNumber(e, t.DataParser.ALPHA_MULTIPLIER, 100) * .01;
      a.redMultiplier = r._getNumber(e, t.DataParser.RED_MULTIPLIER, 100) * .01;
      a.greenMultiplier = r._getNumber(e, t.DataParser.GREEN_MULTIPLIER, 100) * .01;
      a.blueMultiplier = r._getNumber(e, t.DataParser.BLUE_MULTIPLIER, 100) * .01;
      a.alphaOffset = r._getNumber(e, t.DataParser.ALPHA_OFFSET, 0);
      a.redOffset = r._getNumber(e, t.DataParser.RED_OFFSET, 0);
      a.greenOffset = r._getNumber(e, t.DataParser.GREEN_OFFSET, 0);
      a.blueOffset = r._getNumber(e, t.DataParser.BLUE_OFFSET, 0);
    };

    r.prototype._parseGeometry = function (e, a) {
      var r = e[t.DataParser.VERTICES];
      var i = Math.floor(r.length / 2);
      var n = 0;
      var s = this._intArray.length;
      var o = this._floatArray.length;
      a.offset = s;
      a.data = this._data;
      this._intArray.length += 1 + 1 + 1 + 1;
      this._intArray[s + 0] = i;
      this._intArray[s + 2] = o;
      this._intArray[s + 3] = -1;
      this._floatArray.length += i * 2;

      for (var l = 0, h = i * 2; l < h; ++l) {
        this._floatArray[o + l] = r[l];
      }

      if (t.DataParser.TRIANGLES in e) {
        var u = e[t.DataParser.TRIANGLES];
        n = Math.floor(u.length / 3);
        this._intArray.length += n * 3;

        for (var l = 0, h = n * 3; l < h; ++l) {
          this._intArray[s + 4 + l] = u[l];
        }
      }

      this._intArray[s + 1] = n;

      if (t.DataParser.UVS in e) {
        var f = e[t.DataParser.UVS];

        var _ = o + i * 2;

        this._floatArray.length += i * 2;

        for (var l = 0, h = i * 2; l < h; ++l) {
          this._floatArray[_ + l] = f[l];
        }
      }

      if (t.DataParser.WEIGHTS in e) {
        var m = e[t.DataParser.WEIGHTS];
        var p = Math.floor(m.length - i) / 2;
        var c = this._intArray.length;
        var d = this._floatArray.length;
        var y = 0;
        var v = this._armature.sortedBones;
        var g = t.BaseObject.borrowObject(t.WeightData);
        g.count = p;
        g.offset = c;
        this._intArray.length += 1 + 1 + y + i + p;
        this._intArray[c + 1] = d;

        if (t.DataParser.BONE_POSE in e) {
          var D = e[t.DataParser.SLOT_POSE];
          var T = e[t.DataParser.BONE_POSE];
          var b = new Array();
          y = Math.floor(T.length / 7);
          b.length = y;

          for (var l = 0; l < y; ++l) {
            var A = T[l * 7];
            var P = this._rawBones[A];
            g.addBone(P);
            b[l] = A;
            this._intArray[c + 2 + l] = v.indexOf(P);
          }

          this._floatArray.length += p * 3;

          this._helpMatrixA.copyFromArray(D, 0);

          for (var l = 0, S = 0, O = c + 2 + y, x = d; l < i; ++l) {
            var B = l * 2;
            var E = this._intArray[O++] = m[S++];
            var M = this._floatArray[o + B];
            var I = this._floatArray[o + B + 1];

            this._helpMatrixA.transformPoint(M, I, this._helpPoint);

            M = this._helpPoint.x;
            I = this._helpPoint.y;

            for (var F = 0; F < E; ++F) {
              var A = m[S++];
              var C = b.indexOf(A);

              this._helpMatrixB.copyFromArray(T, C * 7 + 1);

              this._helpMatrixB.invert();

              this._helpMatrixB.transformPoint(M, I, this._helpPoint);

              this._intArray[O++] = C;
              this._floatArray[x++] = m[S++];
              this._floatArray[x++] = this._helpPoint.x;
              this._floatArray[x++] = this._helpPoint.y;
            }
          }
        } else {
          var w = e[t.DataParser.BONES];
          y = w.length;

          for (var l = 0; l < y; l++) {
            var A = w[l];
            var P = this._rawBones[A];
            g.addBone(P);
            this._intArray[c + 2 + l] = v.indexOf(P);
          }

          this._floatArray.length += p * 3;

          for (var l = 0, S = 0, x = 0, O = c + 2 + y, N = d; l < p; l++) {
            var E = m[S++];
            this._intArray[O++] = E;

            for (var F = 0; F < E; F++) {
              var C = m[S++];
              var R = m[S++];
              var M = r[x++];
              var I = r[x++];
              this._intArray[O++] = w.indexOf(C);
              this._floatArray[N++] = R;
              this._floatArray[N++] = M;
              this._floatArray[N++] = I;
            }
          }
        }

        a.weight = g;
      }
    };

    r.prototype._parseArray = function (t) {
      t;
      this._intArray.length = 0;
      this._floatArray.length = 0;
      this._frameIntArray.length = 0;
      this._frameFloatArray.length = 0;
      this._frameArray.length = 0;
      this._timelineArray.length = 0;
      this._colorArray.length = 0;
    };

    r.prototype._modifyArray = function () {
      if (this._intArray.length % Int16Array.BYTES_PER_ELEMENT !== 0) {
        this._intArray.push(0);
      }

      if (this._frameIntArray.length % Int16Array.BYTES_PER_ELEMENT !== 0) {
        this._frameIntArray.push(0);
      }

      if (this._frameArray.length % Int16Array.BYTES_PER_ELEMENT !== 0) {
        this._frameArray.push(0);
      }

      if (this._timelineArray.length % Uint16Array.BYTES_PER_ELEMENT !== 0) {
        this._timelineArray.push(0);
      }

      if (this._timelineArray.length % Int16Array.BYTES_PER_ELEMENT !== 0) {
        this._colorArray.push(0);
      }

      var t = this._intArray.length * Int16Array.BYTES_PER_ELEMENT;
      var e = this._floatArray.length * Float32Array.BYTES_PER_ELEMENT;
      var a = this._frameIntArray.length * Int16Array.BYTES_PER_ELEMENT;
      var r = this._frameFloatArray.length * Float32Array.BYTES_PER_ELEMENT;
      var i = this._frameArray.length * Int16Array.BYTES_PER_ELEMENT;
      var n = this._timelineArray.length * Uint16Array.BYTES_PER_ELEMENT;
      var s = this._colorArray.length * Int16Array.BYTES_PER_ELEMENT;
      var o = t + e + a + r + i + n + s;
      var l = new ArrayBuffer(o);
      var h = new Int16Array(l, 0, this._intArray.length);
      var u = new Float32Array(l, t, this._floatArray.length);
      var f = new Int16Array(l, t + e, this._frameIntArray.length);

      var _ = new Float32Array(l, t + e + a, this._frameFloatArray.length);

      var m = new Int16Array(l, t + e + a + r, this._frameArray.length);
      var p = new Uint16Array(l, t + e + a + r + i, this._timelineArray.length);
      var c = new Int16Array(l, t + e + a + r + i + n, this._colorArray.length);

      for (var d = 0, y = this._intArray.length; d < y; ++d) {
        h[d] = this._intArray[d];
      }

      for (var d = 0, y = this._floatArray.length; d < y; ++d) {
        u[d] = this._floatArray[d];
      }

      for (var d = 0, y = this._frameIntArray.length; d < y; ++d) {
        f[d] = this._frameIntArray[d];
      }

      for (var d = 0, y = this._frameFloatArray.length; d < y; ++d) {
        _[d] = this._frameFloatArray[d];
      }

      for (var d = 0, y = this._frameArray.length; d < y; ++d) {
        m[d] = this._frameArray[d];
      }

      for (var d = 0, y = this._timelineArray.length; d < y; ++d) {
        p[d] = this._timelineArray[d];
      }

      for (var d = 0, y = this._colorArray.length; d < y; ++d) {
        c[d] = this._colorArray[d];
      }

      this._data.binary = l;
      this._data.intArray = h;
      this._data.floatArray = u;
      this._data.frameIntArray = f;
      this._data.frameFloatArray = _;
      this._data.frameArray = m;
      this._data.timelineArray = p;
      this._data.colorArray = c;
      this._defaultColorOffset = -1;
    };

    r.prototype.parseDragonBonesData = function (e, a) {
      if (a === void 0) {
        a = 1;
      }

      console.assert(e !== null && e !== undefined, "Data error.");

      var i = r._getString(e, t.DataParser.VERSION, "");

      var n = r._getString(e, t.DataParser.COMPATIBLE_VERSION, "");

      if (t.DataParser.DATA_VERSIONS.indexOf(i) >= 0 || t.DataParser.DATA_VERSIONS.indexOf(n) >= 0) {
        var s = t.BaseObject.borrowObject(t.DragonBonesData);
        s.version = i;
        s.name = r._getString(e, t.DataParser.NAME, "");
        s.frameRate = r._getNumber(e, t.DataParser.FRAME_RATE, 24);

        if (s.frameRate === 0) {
          s.frameRate = 24;
        }

        if (t.DataParser.ARMATURE in e) {
          this._data = s;

          this._parseArray(e);

          var o = e[t.DataParser.ARMATURE];

          for (var l = 0, h = o; l < h.length; l++) {
            var u = h[l];
            s.addArmature(this._parseArmature(u, a));
          }

          if (!this._data.binary) {
            this._modifyArray();
          }

          if (t.DataParser.STAGE in e) {
            s.stage = s.getArmature(r._getString(e, t.DataParser.STAGE, ""));
          } else if (s.armatureNames.length > 0) {
            s.stage = s.getArmature(s.armatureNames[0]);
          }

          this._data = null;
        }

        if (t.DataParser.TEXTURE_ATLAS in e) {
          this._rawTextureAtlases = e[t.DataParser.TEXTURE_ATLAS];
        }

        return s;
      } else {
        console.assert(false, "Nonsupport data version: " + i + "\n" + "Please convert DragonBones data to support version.\n" + "Read more: https://github.com/DragonBones/Tools/");
      }

      return null;
    };

    r.prototype.parseTextureAtlasData = function (e, a, i) {
      if (i === void 0) {
        i = 1;
      }

      console.assert(e !== undefined);

      if (e === null) {
        if (this._rawTextureAtlases === null || this._rawTextureAtlases.length === 0) {
          return false;
        }

        var n = this._rawTextureAtlases[this._rawTextureAtlasIndex++];
        this.parseTextureAtlasData(n, a, i);

        if (this._rawTextureAtlasIndex >= this._rawTextureAtlases.length) {
          this._rawTextureAtlasIndex = 0;
          this._rawTextureAtlases = null;
        }

        return true;
      }

      a.width = r._getNumber(e, t.DataParser.WIDTH, 0);
      a.height = r._getNumber(e, t.DataParser.HEIGHT, 0);
      a.scale = i === 1 ? 1 / r._getNumber(e, t.DataParser.SCALE, 1) : i;
      a.name = r._getString(e, t.DataParser.NAME, "");
      a.imagePath = r._getString(e, t.DataParser.IMAGE_PATH, "");

      if (t.DataParser.SUB_TEXTURE in e) {
        var s = e[t.DataParser.SUB_TEXTURE];

        for (var o = 0, l = s.length; o < l; ++o) {
          var h = s[o];

          var u = r._getNumber(h, t.DataParser.FRAME_WIDTH, -1);

          var f = r._getNumber(h, t.DataParser.FRAME_HEIGHT, -1);

          var _ = a.createTexture();

          _.rotated = r._getBoolean(h, t.DataParser.ROTATED, false);
          _.name = r._getString(h, t.DataParser.NAME, "");
          _.region.x = r._getNumber(h, t.DataParser.X, 0);
          _.region.y = r._getNumber(h, t.DataParser.Y, 0);
          _.region.width = r._getNumber(h, t.DataParser.WIDTH, 0);
          _.region.height = r._getNumber(h, t.DataParser.HEIGHT, 0);

          if (u > 0 && f > 0) {
            _.frame = t.TextureData.createRectangle();
            _.frame.x = r._getNumber(h, t.DataParser.FRAME_X, 0);
            _.frame.y = r._getNumber(h, t.DataParser.FRAME_Y, 0);
            _.frame.width = u;
            _.frame.height = f;
          }

          a.addTexture(_);
        }
      }

      return true;
    };

    r.getInstance = function () {
      if (r._objectDataParserInstance === null) {
        r._objectDataParserInstance = new r();
      }

      return r._objectDataParserInstance;
    };

    r._objectDataParserInstance = null;
    return r;
  }(t.DataParser);

  t.ObjectDataParser = e;

  var a = function () {
    function t() {
      this.frameStart = 0;
      this.actions = [];
    }

    return t;
  }();

  t.ActionFrame = a;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (e) {
    __extends(a, e);

    function a() {
      return e !== null && e.apply(this, arguments) || this;
    }

    a.prototype._inRange = function (t, e, a) {
      return e <= t && t <= a;
    };

    a.prototype._decodeUTF8 = function (t) {
      var e = -1;
      var a = -1;
      var r = 65533;
      var i = 0;
      var n = "";
      var s;
      var o = 0;
      var l = 0;
      var h = 0;
      var u = 0;

      while (t.length > i) {
        var f = t[i++];

        if (f === e) {
          if (l !== 0) {
            s = r;
          } else {
            s = a;
          }
        } else {
          if (l === 0) {
            if (this._inRange(f, 0, 127)) {
              s = f;
            } else {
              if (this._inRange(f, 194, 223)) {
                l = 1;
                u = 128;
                o = f - 192;
              } else if (this._inRange(f, 224, 239)) {
                l = 2;
                u = 2048;
                o = f - 224;
              } else if (this._inRange(f, 240, 244)) {
                l = 3;
                u = 65536;
                o = f - 240;
              } else {}

              o = o * Math.pow(64, l);
              s = null;
            }
          } else if (!this._inRange(f, 128, 191)) {
            o = 0;
            l = 0;
            h = 0;
            u = 0;
            i--;
            s = f;
          } else {
            h += 1;
            o = o + (f - 128) * Math.pow(64, l - h);

            if (h !== l) {
              s = null;
            } else {
              var _ = o;
              var m = u;
              o = 0;
              l = 0;
              h = 0;
              u = 0;

              if (this._inRange(_, m, 1114111) && !this._inRange(_, 55296, 57343)) {
                s = _;
              } else {
                s = f;
              }
            }
          }
        }

        if (s !== null && s !== a) {
          if (s <= 65535) {
            if (s > 0) n += String.fromCharCode(s);
          } else {
            s -= 65536;
            n += String.fromCharCode(55296 + (s >> 10 & 1023));
            n += String.fromCharCode(56320 + (s & 1023));
          }
        }
      }

      return n;
    };

    a.prototype._parseBinaryTimeline = function (e, a, r) {
      if (r === void 0) {
        r = null;
      }

      var i = r !== null ? r : t.BaseObject.borrowObject(t.TimelineData);
      i.type = e;
      i.offset = a;
      this._timeline = i;
      var n = this._timelineArrayBuffer[i.offset + 2];

      if (n === 1) {
        i.frameIndicesOffset = -1;
      } else {
        var s = 0;
        var o = this._animation.frameCount + 1;
        var l = this._data.frameIndices;
        s = l.length;
        l.length += o;
        i.frameIndicesOffset = s;

        for (var h = 0, u = 0, f = 0, _ = 0; h < o; ++h) {
          if (f + _ <= h && u < n) {
            f = this._frameArrayBuffer[this._animation.frameOffset + this._timelineArrayBuffer[i.offset + 5 + u]];

            if (u === n - 1) {
              _ = this._animation.frameCount - f;
            } else {
              _ = this._frameArrayBuffer[this._animation.frameOffset + this._timelineArrayBuffer[i.offset + 5 + u + 1]] - f;
            }

            u++;
          }

          l[s + h] = u - 1;
        }
      }

      this._timeline = null;
      return i;
    };

    a.prototype._parseAnimation = function (e) {
      var a = t.BaseObject.borrowObject(t.AnimationData);
      a.blendType = t.DataParser._getAnimationBlendType(t.ObjectDataParser._getString(e, t.DataParser.BLEND_TYPE, ""));
      a.frameCount = t.ObjectDataParser._getNumber(e, t.DataParser.DURATION, 0);
      a.playTimes = t.ObjectDataParser._getNumber(e, t.DataParser.PLAY_TIMES, 1);
      a.duration = a.frameCount / this._armature.frameRate;
      a.fadeInTime = t.ObjectDataParser._getNumber(e, t.DataParser.FADE_IN_TIME, 0);
      a.scale = t.ObjectDataParser._getNumber(e, t.DataParser.SCALE, 1);
      a.name = t.ObjectDataParser._getString(e, t.DataParser.NAME, t.DataParser.DEFAULT_NAME);

      if (a.name.length === 0) {
        a.name = t.DataParser.DEFAULT_NAME;
      }

      var r = e[t.DataParser.OFFSET];
      a.frameIntOffset = r[0];
      a.frameFloatOffset = r[1];
      a.frameOffset = r[2];
      this._animation = a;

      if (t.DataParser.ACTION in e) {
        a.actionTimeline = this._parseBinaryTimeline(0, e[t.DataParser.ACTION]);
      }

      if (t.DataParser.Z_ORDER in e) {
        a.zOrderTimeline = this._parseBinaryTimeline(1, e[t.DataParser.Z_ORDER]);
      }

      if (t.DataParser.BONE in e) {
        var i = e[t.DataParser.BONE];

        for (var n in i) {
          var s = i[n];

          var o = this._armature.getBone(n);

          if (o === null) {
            continue;
          }

          for (var l = 0, h = s.length; l < h; l += 2) {
            var u = s[l];
            var f = s[l + 1];

            var _ = this._parseBinaryTimeline(u, f);

            this._animation.addBoneTimeline(o.name, _);
          }
        }
      }

      if (t.DataParser.SLOT in e) {
        var i = e[t.DataParser.SLOT];

        for (var n in i) {
          var s = i[n];

          var m = this._armature.getSlot(n);

          if (m === null) {
            continue;
          }

          for (var l = 0, h = s.length; l < h; l += 2) {
            var u = s[l];
            var f = s[l + 1];

            var _ = this._parseBinaryTimeline(u, f);

            this._animation.addSlotTimeline(m.name, _);
          }
        }
      }

      if (t.DataParser.CONSTRAINT in e) {
        var i = e[t.DataParser.CONSTRAINT];

        for (var n in i) {
          var s = i[n];

          var p = this._armature.getConstraint(n);

          if (p === null) {
            continue;
          }

          for (var l = 0, h = s.length; l < h; l += 2) {
            var u = s[l];
            var f = s[l + 1];

            var _ = this._parseBinaryTimeline(u, f);

            this._animation.addConstraintTimeline(p.name, _);
          }
        }
      }

      if (t.DataParser.TIMELINE in e) {
        var s = e[t.DataParser.TIMELINE];

        for (var c = 0, d = s; c < d.length; c++) {
          var y = d[c];

          var f = t.ObjectDataParser._getNumber(y, t.DataParser.OFFSET, 0);

          if (f >= 0) {
            var u = t.ObjectDataParser._getNumber(y, t.DataParser.TYPE, 0);

            var v = t.ObjectDataParser._getString(y, t.DataParser.NAME, "");

            var _ = null;

            if (u === 40 && a.blendType !== 0) {
              _ = t.BaseObject.borrowObject(t.AnimationTimelineData);
              var g = _;
              g.x = t.ObjectDataParser._getNumber(y, t.DataParser.X, 0);
              g.y = t.ObjectDataParser._getNumber(y, t.DataParser.Y, 0);
            }

            _ = this._parseBinaryTimeline(u, f, _);

            switch (u) {
              case 0:
                break;

              case 1:
                break;

              case 11:
              case 12:
              case 13:
              case 50:
              case 60:
                this._animation.addBoneTimeline(v, _);

                break;

              case 20:
              case 21:
              case 22:
              case 23:
              case 24:
                this._animation.addSlotTimeline(v, _);

                break;

              case 30:
                this._animation.addConstraintTimeline(v, _);

                break;

              case 40:
              case 41:
              case 42:
                this._animation.addAnimationTimeline(v, _);

                break;
            }
          }
        }
      }

      this._animation = null;
      return a;
    };

    a.prototype._parseGeometry = function (e, a) {
      a.offset = e[t.DataParser.OFFSET];
      a.data = this._data;
      var r = this._intArrayBuffer[a.offset + 3];

      if (r >= 0) {
        var i = t.BaseObject.borrowObject(t.WeightData);
        var n = this._intArrayBuffer[a.offset + 0];
        var s = this._intArrayBuffer[r + 0];
        i.offset = r;

        for (var o = 0; o < s; ++o) {
          var l = this._intArrayBuffer[r + 2 + o];
          i.addBone(this._rawBones[l]);
        }

        var h = r + 2 + s;
        var u = 0;

        for (var o = 0, f = n; o < f; ++o) {
          var _ = this._intArrayBuffer[h++];
          u += _;
          h += _;
        }

        i.count = u;
        a.weight = i;
      }
    };

    a.prototype._parseArray = function (e) {
      var a = e[t.DataParser.OFFSET];
      var r = a[1];
      var i = a[3];
      var n = a[5];
      var s = a[7];
      var o = a[9];
      var l = a[11];
      var h = a.length > 12 ? a[13] : 0;
      var u = new Int16Array(this._binary, this._binaryOffset + a[0], r / Int16Array.BYTES_PER_ELEMENT);
      var f = new Float32Array(this._binary, this._binaryOffset + a[2], i / Float32Array.BYTES_PER_ELEMENT);

      var _ = new Int16Array(this._binary, this._binaryOffset + a[4], n / Int16Array.BYTES_PER_ELEMENT);

      var m = new Float32Array(this._binary, this._binaryOffset + a[6], s / Float32Array.BYTES_PER_ELEMENT);
      var p = new Int16Array(this._binary, this._binaryOffset + a[8], o / Int16Array.BYTES_PER_ELEMENT);
      var c = new Uint16Array(this._binary, this._binaryOffset + a[10], l / Uint16Array.BYTES_PER_ELEMENT);
      var d = h > 0 ? new Int16Array(this._binary, this._binaryOffset + a[12], h / Int16Array.BYTES_PER_ELEMENT) : u;
      this._data.binary = this._binary;
      this._data.intArray = this._intArrayBuffer = u;
      this._data.floatArray = f;
      this._data.frameIntArray = _;
      this._data.frameFloatArray = m;
      this._data.frameArray = this._frameArrayBuffer = p;
      this._data.timelineArray = this._timelineArrayBuffer = c;
      this._data.colorArray = d;
    };

    a.prototype.parseDragonBonesData = function (t, a) {
      if (a === void 0) {
        a = 1;
      }

      console.assert(t !== null && t !== undefined && t instanceof ArrayBuffer, "Data error.");
      var r = new Uint8Array(t, 0, 8);

      if (r[0] !== "D".charCodeAt(0) || r[1] !== "B".charCodeAt(0) || r[2] !== "D".charCodeAt(0) || r[3] !== "T".charCodeAt(0)) {
        console.assert(false, "Nonsupport data.");
        return null;
      }

      var i = new Uint32Array(t, 8, 1)[0];
      var n = new Uint8Array(t, 8 + 4, i);

      var s = this._decodeUTF8(n);

      var o = JSON.parse(s);
      this._binaryOffset = 8 + 4 + i;
      this._binary = t;
      return e.prototype.parseDragonBonesData.call(this, o, a);
    };

    a.getInstance = function () {
      if (a._binaryDataParserInstance === null) {
        a._binaryDataParserInstance = new a();
      }

      return a._binaryDataParserInstance;
    };

    a._binaryDataParserInstance = null;
    return a;
  }(t.ObjectDataParser);

  t.BinaryDataParser = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function () {
    function e(a) {
      if (a === void 0) {
        a = null;
      }

      this.autoSearch = false;
      this._dragonBonesDataMap = {};
      this._textureAtlasDataMap = {};
      this._dragonBones = null;
      this._dataParser = null;

      if (e._objectParser === null) {
        e._objectParser = new t.ObjectDataParser();
      }

      if (e._binaryParser === null) {
        e._binaryParser = new t.BinaryDataParser();
      }

      this._dataParser = a !== null ? a : e._objectParser;
    }

    e.prototype._isSupportMesh = function () {
      return true;
    };

    e.prototype._getTextureData = function (t, e) {
      if (t in this._textureAtlasDataMap) {
        for (var a = 0, r = this._textureAtlasDataMap[t]; a < r.length; a++) {
          var i = r[a];
          var n = i.getTexture(e);

          if (n !== null) {
            return n;
          }
        }
      }

      if (this.autoSearch) {
        for (var s in this._textureAtlasDataMap) {
          for (var o = 0, l = this._textureAtlasDataMap[s]; o < l.length; o++) {
            var i = l[o];

            if (i.autoSearch) {
              var n = i.getTexture(e);

              if (n !== null) {
                return n;
              }
            }
          }
        }
      }

      return null;
    };

    e.prototype._fillBuildArmaturePackage = function (t, e, a, r, i) {
      var n = null;
      var s = null;

      if (e.length > 0) {
        if (e in this._dragonBonesDataMap) {
          n = this._dragonBonesDataMap[e];
          s = n.getArmature(a);
        }
      }

      if (s === null && (e.length === 0 || this.autoSearch)) {
        for (var o in this._dragonBonesDataMap) {
          n = this._dragonBonesDataMap[o];

          if (e.length === 0 || n.autoSearch) {
            s = n.getArmature(a);

            if (s !== null) {
              e = o;
              break;
            }
          }
        }
      }

      if (s !== null) {
        t.dataName = e;
        t.textureAtlasName = i;
        t.data = n;
        t.armature = s;
        t.skin = null;

        if (r.length > 0) {
          t.skin = s.getSkin(r);

          if (t.skin === null && this.autoSearch) {
            for (var o in this._dragonBonesDataMap) {
              var l = this._dragonBonesDataMap[o];
              var h = l.getArmature(r);

              if (h !== null) {
                t.skin = h.defaultSkin;
                break;
              }
            }
          }
        }

        if (t.skin === null) {
          t.skin = s.defaultSkin;
        }

        return true;
      }

      return false;
    };

    e.prototype._buildBones = function (e, a) {
      for (var r = 0, i = e.armature.sortedBones; r < i.length; r++) {
        var n = i[r];
        var s = t.BaseObject.borrowObject(n.type === 0 ? t.Bone : t.Surface);
        s.init(n, a);
      }
    };

    e.prototype._buildSlots = function (t, e) {
      var a = t.skin;
      var r = t.armature.defaultSkin;

      if (a === null || r === null) {
        return;
      }

      var i = {};

      for (var n in r.displays) {
        var s = r.getDisplays(n);
        i[n] = s;
      }

      if (a !== r) {
        for (var n in a.displays) {
          var s = a.getDisplays(n);
          i[n] = s;
        }
      }

      for (var o = 0, l = t.armature.sortedSlots; o < l.length; o++) {
        var h = l[o];
        var u = h.name in i ? i[h.name] : null;

        var f = this._buildSlot(t, h, e);

        if (u !== null) {
          f.displayFrameCount = u.length;

          for (var _ = 0, m = f.displayFrameCount; _ < m; ++_) {
            var p = u[_];
            f.replaceRawDisplayData(p, _);

            if (p !== null) {
              if (t.textureAtlasName.length > 0) {
                var c = this._getTextureData(t.textureAtlasName, p.path);

                f.replaceTextureData(c, _);
              }

              var d = this._getSlotDisplay(t, p, f);

              f.replaceDisplay(d, _);
            } else {
              f.replaceDisplay(null);
            }
          }
        }

        f._setDisplayIndex(h.displayIndex, true);
      }
    };

    e.prototype._buildConstraints = function (e, a) {
      var r = e.armature.constraints;

      for (var i in r) {
        var n = r[i];

        switch (n.type) {
          case 0:
            var s = t.BaseObject.borrowObject(t.IKConstraint);
            s.init(n, a);

            a._addConstraint(s);

            break;

          case 1:
            var o = t.BaseObject.borrowObject(t.PathConstraint);
            o.init(n, a);

            a._addConstraint(o);

            break;

          default:
            var l = t.BaseObject.borrowObject(t.IKConstraint);
            l.init(n, a);

            a._addConstraint(l);

            break;
        }
      }
    };

    e.prototype._buildChildArmature = function (t, e, a) {
      return this.buildArmature(a.path, t !== null ? t.dataName : "", "", t !== null ? t.textureAtlasName : "");
    };

    e.prototype._getSlotDisplay = function (e, a, r) {
      var i = e !== null ? e.dataName : a.parent.parent.parent.name;
      var n = null;

      switch (a.type) {
        case 0:
          {
            var s = a;

            if (s.texture === null) {
              s.texture = this._getTextureData(i, a.path);
            }

            n = r.rawDisplay;
            break;
          }

        case 2:
          {
            var o = a;

            if (o.texture === null) {
              o.texture = this._getTextureData(i, o.path);
            }

            if (this._isSupportMesh()) {
              n = r.meshDisplay;
            } else {
              n = r.rawDisplay;
            }

            break;
          }

        case 1:
          {
            var l = a;

            var h = this._buildChildArmature(e, r, l);

            if (h !== null) {
              h.inheritAnimation = l.inheritAnimation;

              if (!h.inheritAnimation) {
                var u = l.actions.length > 0 ? l.actions : h.armatureData.defaultActions;

                if (u.length > 0) {
                  for (var f = 0, _ = u; f < _.length; f++) {
                    var m = _[f];
                    var p = t.BaseObject.borrowObject(t.EventObject);
                    t.EventObject.actionDataToInstance(m, p, r.armature);
                    p.slot = r;

                    r.armature._bufferAction(p, false);
                  }
                } else {
                  h.animation.play();
                }
              }

              l.armature = h.armatureData;
            }

            n = h;
            break;
          }

        case 3:
          break;

        default:
          break;
      }

      return n;
    };

    e.prototype.parseDragonBonesData = function (t, a, r) {
      if (a === void 0) {
        a = null;
      }

      if (r === void 0) {
        r = 1;
      }

      var i = t instanceof ArrayBuffer ? e._binaryParser : this._dataParser;
      var n = i.parseDragonBonesData(t, r);

      while (true) {
        var s = this._buildTextureAtlasData(null, null);

        if (i.parseTextureAtlasData(null, s, r)) {
          this.addTextureAtlasData(s, a);
        } else {
          s.returnToPool();
          break;
        }
      }

      if (n !== null) {
        this.addDragonBonesData(n, a);
      }

      return n;
    };

    e.prototype.parseTextureAtlasData = function (t, e, a, r) {
      if (a === void 0) {
        a = null;
      }

      if (r === void 0) {
        r = 1;
      }

      var i = this._buildTextureAtlasData(null, null);

      this._dataParser.parseTextureAtlasData(t, i, r);

      this._buildTextureAtlasData(i, e || null);

      this.addTextureAtlasData(i, a);
      return i;
    };

    e.prototype.updateTextureAtlases = function (t, e) {
      var a = this.getTextureAtlasData(e);

      if (a !== null) {
        for (var r = 0, i = a.length; r < i; ++r) {
          if (r < t.length) {
            this._buildTextureAtlasData(a[r], t[r]);
          }
        }
      }
    };

    e.prototype.getDragonBonesData = function (t) {
      return t in this._dragonBonesDataMap ? this._dragonBonesDataMap[t] : null;
    };

    e.prototype.addDragonBonesData = function (t, e) {
      if (e === void 0) {
        e = null;
      }

      e = e !== null ? e : t.name;

      if (e in this._dragonBonesDataMap) {
        if (this._dragonBonesDataMap[e] === t) {
          return;
        }

        console.warn("Can not add same name data: " + e);
        return;
      }

      this._dragonBonesDataMap[e] = t;
    };

    e.prototype.removeDragonBonesData = function (t, e) {
      if (e === void 0) {
        e = true;
      }

      if (t in this._dragonBonesDataMap) {
        if (e) {
          this._dragonBones.bufferObject(this._dragonBonesDataMap[t]);
        }

        delete this._dragonBonesDataMap[t];
      }
    };

    e.prototype.getTextureAtlasData = function (t) {
      return t in this._textureAtlasDataMap ? this._textureAtlasDataMap[t] : null;
    };

    e.prototype.addTextureAtlasData = function (t, e) {
      if (e === void 0) {
        e = null;
      }

      e = e !== null ? e : t.name;
      var a = e in this._textureAtlasDataMap ? this._textureAtlasDataMap[e] : this._textureAtlasDataMap[e] = [];

      if (a.indexOf(t) < 0) {
        a.push(t);
      }
    };

    e.prototype.removeTextureAtlasData = function (t, e) {
      if (e === void 0) {
        e = true;
      }

      if (t in this._textureAtlasDataMap) {
        var a = this._textureAtlasDataMap[t];

        if (e) {
          for (var r = 0, i = a; r < i.length; r++) {
            var n = i[r];

            this._dragonBones.bufferObject(n);
          }
        }

        delete this._textureAtlasDataMap[t];
      }
    };

    e.prototype.getArmatureData = function (t, e) {
      if (e === void 0) {
        e = "";
      }

      var r = new a();

      if (!this._fillBuildArmaturePackage(r, e, t, "", "")) {
        return null;
      }

      return r.armature;
    };

    e.prototype.clear = function (t) {
      if (t === void 0) {
        t = true;
      }

      for (var e in this._dragonBonesDataMap) {
        if (t) {
          this._dragonBones.bufferObject(this._dragonBonesDataMap[e]);
        }

        delete this._dragonBonesDataMap[e];
      }

      for (var e in this._textureAtlasDataMap) {
        if (t) {
          var a = this._textureAtlasDataMap[e];

          for (var r = 0, i = a; r < i.length; r++) {
            var n = i[r];

            this._dragonBones.bufferObject(n);
          }
        }

        delete this._textureAtlasDataMap[e];
      }
    };

    e.prototype.buildArmature = function (t, e, r, i) {
      if (e === void 0) {
        e = "";
      }

      if (r === void 0) {
        r = "";
      }

      if (i === void 0) {
        i = "";
      }

      var n = new a();

      if (!this._fillBuildArmaturePackage(n, e || "", t, r || "", i || "")) {
        console.warn("No armature data: " + t + ", " + (e !== null ? e : ""));
        return null;
      }

      var s = this._buildArmature(n);

      this._buildBones(n, s);

      this._buildSlots(n, s);

      this._buildConstraints(n, s);

      s.invalidUpdate(null, true);
      s.advanceTime(0);
      return s;
    };

    e.prototype.replaceDisplay = function (t, e, a) {
      if (a === void 0) {
        a = -1;
      }

      if (a < 0) {
        a = t.displayIndex;
      }

      if (a < 0) {
        a = 0;
      }

      t.replaceDisplayData(e, a);

      if (e !== null) {
        var r = this._getSlotDisplay(null, e, t);

        if (e.type === 0) {
          var i = t.getDisplayFrameAt(a).rawDisplayData;

          if (i !== null && i.type === 2) {
            r = t.meshDisplay;
          }
        }

        t.replaceDisplay(r, a);
      } else {
        t.replaceDisplay(null, a);
      }
    };

    e.prototype.replaceSlotDisplay = function (t, e, a, r, i, n) {
      if (n === void 0) {
        n = -1;
      }

      var s = this.getArmatureData(e, t || "");

      if (s === null || s.defaultSkin === null) {
        return false;
      }

      var o = s.defaultSkin.getDisplay(a, r);
      this.replaceDisplay(i, o, n);
      return true;
    };

    e.prototype.replaceSlotDisplayList = function (t, e, a, r) {
      var i = this.getArmatureData(e, t || "");

      if (!i || !i.defaultSkin) {
        return false;
      }

      var n = i.defaultSkin.getDisplays(a);

      if (!n) {
        return false;
      }

      r.displayFrameCount = n.length;

      for (var s = 0, o = r.displayFrameCount; s < o; ++s) {
        var l = n[s];
        this.replaceDisplay(r, l, s);
      }

      return true;
    };

    e.prototype.replaceSkin = function (t, e, a, r) {
      if (a === void 0) {
        a = false;
      }

      if (r === void 0) {
        r = null;
      }

      var i = false;
      var n = e.parent.defaultSkin;

      for (var s = 0, o = t.getSlots(); s < o.length; s++) {
        var l = o[s];

        if (r !== null && r.indexOf(l.name) >= 0) {
          continue;
        }

        var h = e.getDisplays(l.name);

        if (h === null) {
          if (n !== null && e !== n) {
            h = n.getDisplays(l.name);
          }

          if (h === null) {
            if (a) {
              l.displayFrameCount = 0;
            }

            continue;
          }
        }

        l.displayFrameCount = h.length;

        for (var u = 0, f = l.displayFrameCount; u < f; ++u) {
          var _ = h[u];
          l.replaceRawDisplayData(_, u);

          if (_ !== null) {
            l.replaceDisplay(this._getSlotDisplay(null, _, l), u);
          } else {
            l.replaceDisplay(null, u);
          }
        }

        i = true;
      }

      return i;
    };

    e.prototype.replaceAnimation = function (e, a, r) {
      if (r === void 0) {
        r = true;
      }

      var i = a.defaultSkin;

      if (i === null) {
        return false;
      }

      if (r) {
        e.animation.animations = a.animations;
      } else {
        var n = e.animation.animations;
        var s = {};

        for (var o in n) {
          s[o] = n[o];
        }

        for (var o in a.animations) {
          s[o] = a.animations[o];
        }

        e.animation.animations = s;
      }

      for (var l = 0, h = e.getSlots(); l < h.length; l++) {
        var u = h[l];
        var f = 0;

        for (var _ = 0, m = u.displayList; _ < m.length; _++) {
          var p = m[_];

          if (p instanceof t.Armature) {
            var c = i.getDisplays(u.name);

            if (c !== null && f < c.length) {
              var d = c[f];

              if (d !== null && d.type === 1) {
                var y = this.getArmatureData(d.path, d.parent.parent.parent.name);

                if (y) {
                  this.replaceAnimation(p, y, r);
                }
              }
            }
          }

          f++;
        }
      }

      return true;
    };

    e.prototype.getAllDragonBonesData = function () {
      return this._dragonBonesDataMap;
    };

    e.prototype.getAllTextureAtlasData = function () {
      return this._textureAtlasDataMap;
    };

    Object.defineProperty(e.prototype, "clock", {
      get: function get() {
        return this._dragonBones.clock;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(e.prototype, "dragonBones", {
      get: function get() {
        return this._dragonBones;
      },
      enumerable: true,
      configurable: true
    });
    e._objectParser = null;
    e._binaryParser = null;
    return e;
  }();

  t.BaseFactory = e;

  var a = function () {
    function t() {
      this.dataName = "";
      this.textureAtlasName = "";
      this.skin = null;
    }

    return t;
  }();

  t.BuildArmaturePackage = a;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (e) {
    __extends(r, e);

    function r() {
      var t = e !== null && e.apply(this, arguments) || this;
      t._renderTexture = null;
      return t;
    }

    r.toString = function () {
      return "[class dragonBones.PixiTextureAtlasData]";
    };

    r.prototype._onClear = function () {
      e.prototype._onClear.call(this);

      if (this._renderTexture !== null) {}

      this._renderTexture = null;
    };

    r.prototype.createTexture = function () {
      return t.BaseObject.borrowObject(a);
    };

    Object.defineProperty(r.prototype, "renderTexture", {
      get: function get() {
        return this._renderTexture;
      },
      set: function set(t) {
        if (this._renderTexture === t) {
          return;
        }

        this._renderTexture = t;

        if (this._renderTexture !== null) {
          for (var e in this.textures) {
            var a = this.textures[e];
            a.renderTexture = new PIXI.Texture(this._renderTexture, new PIXI.Rectangle(a.region.x, a.region.y, a.region.width, a.region.height), new PIXI.Rectangle(a.region.x, a.region.y, a.region.width, a.region.height), new PIXI.Rectangle(0, 0, a.region.width, a.region.height), a.rotated);
          }
        } else {
          for (var e in this.textures) {
            var a = this.textures[e];
            a.renderTexture = null;
          }
        }
      },
      enumerable: true,
      configurable: true
    });
    return r;
  }(t.TextureAtlasData);

  t.PixiTextureAtlasData = e;

  var a = function (t) {
    __extends(e, t);

    function e() {
      var e = t !== null && t.apply(this, arguments) || this;
      e.renderTexture = null;
      return e;
    }

    e.toString = function () {
      return "[class dragonBones.PixiTextureData]";
    };

    e.prototype._onClear = function () {
      t.prototype._onClear.call(this);

      if (this.renderTexture !== null) {
        this.renderTexture.destroy(false);
      }

      this.renderTexture = null;
    };

    return e;
  }(t.TextureData);

  t.PixiTextureData = a;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (e) {
    __extends(a, e);

    function a() {
      var t = e !== null && e.apply(this, arguments) || this;
      t.debugDraw = false;
      t._debugDraw = false;
      t._armature = null;
      t._debugDrawer = null;
      return t;
    }

    a.prototype.dbInit = function (t) {
      this._armature = t;
    };

    a.prototype.dbClear = function () {
      if (this._debugDrawer !== null) {
        this._debugDrawer.destroy(true);
      }

      this._armature = null;
      this._debugDrawer = null;
      e.prototype.destroy.call(this);
    };

    a.prototype.dbUpdate = function () {
      var e = t.DragonBones.debugDraw || this.debugDraw;

      if (e || this._debugDraw) {
        this._debugDraw = e;

        if (this._debugDraw) {
          if (this._debugDrawer === null) {
            this._debugDrawer = new PIXI.Sprite();
            var a = new PIXI.Graphics();

            this._debugDrawer.addChild(a);
          }

          this.addChild(this._debugDrawer);

          var r = this._debugDrawer.getChildAt(0);

          r.clear();

          var i = this._armature.getBones();

          for (var n = 0, s = i.length; n < s; ++n) {
            var o = i[n];
            var l = o.boneData.length;
            var h = o.globalTransformMatrix.tx;
            var u = o.globalTransformMatrix.ty;
            var f = h + o.globalTransformMatrix.a * l;

            var _ = u + o.globalTransformMatrix.b * l;

            r.lineStyle(2, 65535, .7);
            r.moveTo(h, u);
            r.lineTo(f, _);
            r.lineStyle(0, 0, 0);
            r.beginFill(65535, .7);
            r.drawCircle(h, u, 3);
            r.endFill();
          }

          var m = this._armature.getSlots();

          for (var n = 0, s = m.length; n < s; ++n) {
            var p = m[n];
            var c = p.boundingBoxData;

            if (c) {
              var d = this._debugDrawer.getChildByName(p.name);

              if (!d) {
                d = new PIXI.Graphics();
                d.name = p.name;

                this._debugDrawer.addChild(d);
              }

              d.clear();
              d.lineStyle(2, 16711935, .7);

              switch (c.type) {
                case 0:
                  d.drawRect(-c.width * .5, -c.height * .5, c.width, c.height);
                  break;

                case 1:
                  d.drawEllipse(-c.width * .5, -c.height * .5, c.width, c.height);
                  break;

                case 2:
                  var y = c.vertices;

                  for (var v = 0, g = y.length; v < g; v += 2) {
                    var D = y[v];
                    var T = y[v + 1];

                    if (v === 0) {
                      d.moveTo(D, T);
                    } else {
                      d.lineTo(D, T);
                    }
                  }

                  d.lineTo(y[0], y[1]);
                  break;

                default:
                  break;
              }

              d.endFill();
              p.updateTransformAndMatrix();
              p.updateGlobalTransform();
              var b = p.global;
              d.setTransform(b.x, b.y, b.scaleX, b.scaleY, b.rotation, b.skew, 0, p._pivotX, p._pivotY);
            } else {
              var d = this._debugDrawer.getChildByName(p.name);

              if (d) {
                this._debugDrawer.removeChild(d);
              }
            }
          }
        } else if (this._debugDrawer !== null && this._debugDrawer.parent === this) {
          this.removeChild(this._debugDrawer);
        }
      }
    };

    a.prototype.dispose = function (t) {
      if (t === void 0) {
        t = true;
      }

      t;

      if (this._armature !== null) {
        this._armature.dispose();

        this._armature = null;
      }
    };

    a.prototype.destroy = function () {
      this.dispose();
    };

    a.prototype.dispatchDBEvent = function (t, e) {
      this.emit(t, e);
    };

    a.prototype.hasDBEventListener = function (t) {
      return this.listeners(t, true);
    };

    a.prototype.addDBEventListener = function (t, e, a) {
      this.addListener(t, e, a);
    };

    a.prototype.removeDBEventListener = function (t, e, a) {
      this.removeListener(t, e, a);
    };

    Object.defineProperty(a.prototype, "armature", {
      get: function get() {
        return this._armature;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(a.prototype, "animation", {
      get: function get() {
        return this._armature.animation;
      },
      enumerable: true,
      configurable: true
    });
    return a;
  }(PIXI.Sprite);

  t.PixiArmatureDisplay = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (e) {
    __extends(a, e);

    function a() {
      return e !== null && e.apply(this, arguments) || this;
    }

    a.toString = function () {
      return "[class dragonBones.PixiSlot]";
    };

    a.prototype._onClear = function () {
      e.prototype._onClear.call(this);

      this._textureScale = 1;
      this._renderDisplay = null;
      this._updateTransform = PIXI.VERSION[0] === "3" ? this._updateTransformV3 : this._updateTransformV4;
    };

    a.prototype._initDisplay = function (t, e) {
      t;
      e;
    };

    a.prototype._disposeDisplay = function (t, e) {
      t;

      if (!e) {
        t.destroy();
      }
    };

    a.prototype._onUpdateDisplay = function () {
      this._renderDisplay = this._display ? this._display : this._rawDisplay;
    };

    a.prototype._addDisplay = function () {
      var t = this._armature.display;
      t.addChild(this._renderDisplay);
    };

    a.prototype._replaceDisplay = function (t) {
      var e = this._armature.display;
      var a = t;
      e.addChild(this._renderDisplay);
      e.swapChildren(this._renderDisplay, a);
      e.removeChild(a);
      this._textureScale = 1;
    };

    a.prototype._removeDisplay = function () {
      this._renderDisplay.parent.removeChild(this._renderDisplay);
    };

    a.prototype._updateZOrder = function () {
      var t = this._armature.display;
      var e = t.getChildIndex(this._renderDisplay);

      if (e === this._zOrder) {
        return;
      }

      t.addChildAt(this._renderDisplay, this._zOrder);
    };

    a.prototype._updateVisible = function () {
      this._renderDisplay.visible = this._parent.visible && this._visible;
    };

    a.prototype._updateBlendMode = function () {
      if (this._renderDisplay instanceof PIXI.Sprite) {
        switch (this._blendMode) {
          case 0:
            this._renderDisplay.blendMode = PIXI.BLEND_MODES.NORMAL;
            break;

          case 1:
            this._renderDisplay.blendMode = PIXI.BLEND_MODES.ADD;
            break;

          case 3:
            this._renderDisplay.blendMode = PIXI.BLEND_MODES.DARKEN;
            break;

          case 4:
            this._renderDisplay.blendMode = PIXI.BLEND_MODES.DIFFERENCE;
            break;

          case 6:
            this._renderDisplay.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;
            break;

          case 9:
            this._renderDisplay.blendMode = PIXI.BLEND_MODES.LIGHTEN;
            break;

          case 10:
            this._renderDisplay.blendMode = PIXI.BLEND_MODES.MULTIPLY;
            break;

          case 11:
            this._renderDisplay.blendMode = PIXI.BLEND_MODES.OVERLAY;
            break;

          case 12:
            this._renderDisplay.blendMode = PIXI.BLEND_MODES.SCREEN;
            break;

          default:
            break;
        }
      }
    };

    a.prototype._updateColor = function () {
      var t = this._colorTransform.alphaMultiplier * this._globalAlpha;
      this._renderDisplay.alpha = t;

      if (this._renderDisplay instanceof PIXI.Sprite || this._renderDisplay instanceof PIXI.mesh.Mesh) {
        var e = (Math.round(this._colorTransform.redMultiplier * 255) << 16) + (Math.round(this._colorTransform.greenMultiplier * 255) << 8) + Math.round(this._colorTransform.blueMultiplier * 255);
        this._renderDisplay.tint = e;
      }
    };

    a.prototype._updateFrame = function () {
      var e = this._textureData;

      if (this._displayIndex >= 0 && this._display !== null && e !== null) {
        var a = e.parent;

        if (this._armature.replacedTexture !== null) {
          if (this._armature._replaceTextureAtlasData === null) {
            a = t.BaseObject.borrowObject(t.PixiTextureAtlasData);
            a.copyFrom(e.parent);
            a.renderTexture = this._armature.replacedTexture;
            this._armature._replaceTextureAtlasData = a;
          } else {
            a = this._armature._replaceTextureAtlasData;
          }

          e = a.getTexture(e.name);
        }

        var r = e.renderTexture;

        if (r !== null) {
          if (this._geometryData !== null) {
            var i = this._geometryData.data;
            var n = i.intArray;
            var s = i.floatArray;
            var o = n[this._geometryData.offset + 0];
            var l = n[this._geometryData.offset + 1];
            var h = n[this._geometryData.offset + 2];

            if (h < 0) {
              h += 65536;
            }

            var u = h + o * 2;
            var f = this._armature._armatureData.scale;
            var _ = this._renderDisplay;
            var m = a.width > 0 ? a.width : r.baseTexture.width;
            var p = a.height > 0 ? a.height : r.baseTexture.height;
            var c = e.region;
            _.vertices = new Float32Array(o * 2);
            _.uvs = new Float32Array(o * 2);
            _.indices = new Uint16Array(l * 3);

            for (var d = 0, y = o * 2; d < y; ++d) {
              _.vertices[d] = s[h + d] * f;
            }

            for (var d = 0; d < l * 3; ++d) {
              _.indices[d] = n[this._geometryData.offset + 4 + d];
            }

            for (var d = 0, y = o * 2; d < y; d += 2) {
              var v = s[u + d];
              var g = s[u + d + 1];

              if (e.rotated) {
                _.uvs[d] = (c.x + (1 - g) * c.width) / m;
                _.uvs[d + 1] = (c.y + v * c.height) / p;
              } else {
                _.uvs[d] = (c.x + v * c.width) / m;
                _.uvs[d + 1] = (c.y + g * c.height) / p;
              }
            }

            this._textureScale = 1;
            _.texture = r;
            _.dirty++;
            _.indexDirty++;
            var D = this._geometryData.weight !== null;
            var T = this._parent._boneData.type !== 0;

            if (D || T) {
              this._identityTransform();
            }
          } else {
            this._textureScale = e.parent.scale * this._armature._armatureData.scale;
            var b = this._renderDisplay;
            b.texture = r;
          }

          this._visibleDirty = true;
          return;
        }
      }

      if (this._geometryData !== null) {
        var _ = this._renderDisplay;
        _.texture = null;
        _.x = 0;
        _.y = 0;
        _.visible = false;
      } else {
        var b = this._renderDisplay;
        b.texture = null;
        b.x = 0;
        b.y = 0;
        b.visible = false;
      }
    };

    a.prototype._updateMesh = function () {
      var t = this._armature._armatureData.scale;
      var e = this._displayFrame.deformVertices;
      var a = this._geometryBones;
      var r = this._geometryData;
      var i = r.weight;
      var n = e.length > 0 && r.inheritDeform;
      var s = this._renderDisplay;

      if (i !== null) {
        var o = r.data;
        var l = o.intArray;
        var h = o.floatArray;
        var u = l[r.offset + 0];
        var f = l[i.offset + 1];

        if (f < 0) {
          f += 65536;
        }

        for (var _ = 0, m = 0, p = i.offset + 2 + a.length, c = f, d = 0; _ < u; ++_) {
          var y = l[p++];
          var v = 0,
              g = 0;

          for (var D = 0; D < y; ++D) {
            var T = l[p++];
            var b = a[T];

            if (b !== null) {
              var A = b.globalTransformMatrix;
              var P = h[c++];
              var S = h[c++] * t;
              var O = h[c++] * t;

              if (n) {
                S += e[d++];
                O += e[d++];
              }

              v += (A.a * S + A.c * O + A.tx) * P;
              g += (A.b * S + A.d * O + A.ty) * P;
            }
          }

          s.vertices[m++] = v;
          s.vertices[m++] = g;
        }
      } else {
        var x = this._parent._boneData.type !== 0;
        var o = r.data;
        var l = o.intArray;
        var h = o.floatArray;
        var u = l[r.offset + 0];
        var B = l[r.offset + 2];

        if (B < 0) {
          B += 65536;
        }

        for (var _ = 0, E = u * 2; _ < E; _ += 2) {
          var M = h[B + _] * t;
          var I = h[B + _ + 1] * t;

          if (n) {
            M += e[_];
            I += e[_ + 1];
          }

          if (x) {
            var A = this._parent._getGlobalTransformMatrix(M, I);

            s.vertices[_] = A.a * M + A.c * I + A.tx;
            s.vertices[_ + 1] = A.b * M + A.d * I + A.ty;
          } else {
            s.vertices[_] = M;
            s.vertices[_ + 1] = I;
          }
        }
      }
    };

    a.prototype._updateTransform = function () {
      throw new Error();
    };

    a.prototype._updateTransformV3 = function () {
      this.updateGlobalTransform();
      var t = this.global;

      if (this._renderDisplay === this._rawDisplay || this._renderDisplay === this._meshDisplay) {
        var e = t.x - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
        var a = t.y - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);

        this._renderDisplay.setTransform(e, a, t.scaleX * this._textureScale, t.scaleY * this._textureScale, t.rotation, t.skew, 0);
      } else {
        this._renderDisplay.position.set(t.x, t.y);

        this._renderDisplay.rotation = t.rotation;

        this._renderDisplay.skew.set(t.skew, 0);

        this._renderDisplay.scale.set(t.scaleX, t.scaleY);
      }
    };

    a.prototype._updateTransformV4 = function () {
      this.updateGlobalTransform();
      var t = this.global;

      if (this._renderDisplay === this._rawDisplay || this._renderDisplay === this._meshDisplay) {
        var e = t.x - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
        var a = t.y - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);

        this._renderDisplay.setTransform(e, a, t.scaleX * this._textureScale, t.scaleY * this._textureScale, t.rotation, -t.skew, 0);
      } else {
        this._renderDisplay.position.set(t.x, t.y);

        this._renderDisplay.rotation = t.rotation;

        this._renderDisplay.skew.set(-t.skew, 0);

        this._renderDisplay.scale.set(t.scaleX, t.scaleY);
      }
    };

    a.prototype._identityTransform = function () {
      this._renderDisplay.setTransform(0, 0, 1, 1, 0, 0, 0);
    };

    return a;
  }(t.Slot);

  t.PixiSlot = e;
})(dragonBones || (dragonBones = {}));

var dragonBones;

(function (t) {
  var e = function (e) {
    __extends(a, e);

    function a(r) {
      if (r === void 0) {
        r = null;
      }

      var i = e.call(this, r) || this;

      if (a._dragonBonesInstance === null) {
        var n = new t.PixiArmatureDisplay();
        a._dragonBonesInstance = new t.DragonBones(n);
        PIXI.ticker.shared.add(a._clockHandler, a);
      }

      i._dragonBones = a._dragonBonesInstance;
      return i;
    }

    a._clockHandler = function (t) {
      this._dragonBonesInstance.advanceTime(PIXI.ticker.shared.elapsedMS * t * .001);
    };

    Object.defineProperty(a, "factory", {
      get: function get() {
        if (a._factory === null) {
          a._factory = new a();
        }

        return a._factory;
      },
      enumerable: true,
      configurable: true
    });

    a.prototype._buildTextureAtlasData = function (e, a) {
      if (e) {
        e.renderTexture = a;
      } else {
        e = t.BaseObject.borrowObject(t.PixiTextureAtlasData);
      }

      return e;
    };

    a.prototype._buildArmature = function (e) {
      var a = t.BaseObject.borrowObject(t.Armature);
      var r = new t.PixiArmatureDisplay();
      a.init(e.armature, r, r, this._dragonBones);
      return a;
    };

    a.prototype._buildSlot = function (e, a, r) {
      var i = t.BaseObject.borrowObject(t.PixiSlot);
      i.init(a, r, new PIXI.Sprite(), new PIXI.mesh.Mesh(null, null, null, null, PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES));
      return i;
    };

    a.prototype.buildArmatureDisplay = function (t, e, a, r) {
      if (e === void 0) {
        e = "";
      }

      if (a === void 0) {
        a = "";
      }

      if (r === void 0) {
        r = "";
      }

      var i = this.buildArmature(t, e || "", a || "", r || "");

      if (i !== null) {
        this._dragonBones.clock.add(i);

        return i.display;
      }

      return null;
    };

    a.prototype.getTextureDisplay = function (t, e) {
      if (e === void 0) {
        e = null;
      }

      var a = this._getTextureData(e !== null ? e : "", t);

      if (a !== null && a.renderTexture !== null) {
        return new PIXI.Sprite(a.renderTexture);
      }

      return null;
    };

    Object.defineProperty(a.prototype, "soundEventManager", {
      get: function get() {
        return this._dragonBones.eventManager;
      },
      enumerable: true,
      configurable: true
    });
    a._dragonBonesInstance = null;
    a._factory = null;
    return a;
  }(t.BaseFactory);

  t.PixiFactory = e;
})(dragonBones || (dragonBones = {}));
})