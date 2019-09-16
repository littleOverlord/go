define("libs/ni/dragonbones",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Dragon = _interopRequireWildcard(require("libs/pixijs/dragonBones"));

var _loader = _interopRequireDefault(require("libs/ni/loader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导出 ******************/
var DragonBones =
/*#__PURE__*/
function () {
  function DragonBones() {
    _classCallCheck(this, DragonBones);
  }

  _createClass(DragonBones, null, [{
    key: "addDragonData",

    /**
     * @description 动画列表
     */

    /**
     * @description 配置缓存
     */

    /**
     * @description 配置解析后的spine数据，直接用来创建spine动画对象
     */

    /**
     * @description 龙骨动画管理对象
     */

    /**
     * @description 添加配置
     */
    value: function addDragonData(data) {
      console.log(Dragon);
      var name, tex;

      if (!DragonBones.factory) {
        DragonBones.factory = Dragon.PixiFactory.factory;
      }

      for (var k in data) {
        if (k.indexOf("_ske.json") > 0) {
          name = k.match(/\/([^\/]+)_ske\.json$/)[1];

          if (!DragonBones.factory.getDragonBonesData(name)) {
            DragonBones.factory.parseDragonBonesData(JSON.parse(data[k]));
          }

          if (!DragonBones.factory.getTextureAtlasData(name)) {
            tex = k.replace("_ske.json", "_tex.json");
            DragonBones.factory.parseTextureAtlasData(JSON.parse(data[tex]), _loader.default.resources[k.replace("_ske.json", "_tex.png")].texture);
          }

          delete data[k];
          delete data[tex];
        }
      }
    }
    /**
     * @description 创建龙骨动画
     */

  }, {
    key: "create",
    value: function create(cfg) {
      var o;
      o = DragonBones.factory.buildArmatureDisplay(cfg.armature);
      return o;
    }
    /**
     * @description 更新动画
     */

  }, {
    key: "update",
    value: function update() {
      DragonBones.anims.forEach(function (v, k) {
        if (v.isCompleted) {
          DragonBones.anims.delete(k);
          k.anicallback("completed", v.name);
        }
      });
    }
    /**
     * @description 添加动画状态
     * @param type "play"|"stop"
     * @param status 龙骨动画状态
     * @param o 龙骨动画显示对象
     */

    /**static addStatus(type,status,o){
    	}
     * @description 更新龙骨动画状态
     * @param { Ni }o 
     */

  }, {
    key: "play",
    value: function play(o) {
      var last = DragonBones.anims.get(o),
          status;

      if (o.animate.times <= 0) {
        o.show.animation.play(o.animate.ani, o.animate.times);

        if (last && last.name !== o.animate.ani) {
          DragonBones.anims.delete(o);
          o.anicallback("stop", last.name);
        }

        return;
      } else if (last && last.name == o.animate.ani && last.time) {
        status = o.show.animation.gotoAndPlayByTime(o.animate.ani, last.time, o.animate.times);
      } else {
        status = o.show.animation.play(o.animate.ani, o.animate.times);
      }

      DragonBones.anims.set(o, status);
    }
    /**
     * @description 暂停龙骨动画
     * @param ani 动作名
     * @param { Ni }o 高层动画封装
     */

  }, {
    key: "stop",
    value: function stop(ani, o) {
      var last = DragonBones.anims.get(o);
      o.show.animation.stop(ani, o.animate.times);

      if (last.name = ani && !last.isCompleted) {
        last.lt = last._time;
        DragonBones.anims.set(o, {
          time: last._time,
          name: ani,
          isCompleted: false
        });
        o.anicallback("stop", ani);
      }
    }
    /**
     * @description 移除显示对象
     * @param { Ni }o 高层动画封装
     */

  }, {
    key: "remove",
    value: function remove(o) {
      if (DragonBones.anims.get(o)) {
        DragonBones.anims.delete(o);
      }
    }
  }]);

  return DragonBones;
}();
/****************** 本地 ******************/

/****************** 立即执行 ******************/
//绑定资源监听


exports.default = DragonBones;
DragonBones.anims = new Map();
DragonBones.cfgs = {};
DragonBones.data = {};
DragonBones.factory = void 0;

_loader.default.addResListener("addDragonData", DragonBones.addDragonData);
})