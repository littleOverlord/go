define("libs/ni/spine",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var PIXI = _interopRequireWildcard(require("libs/pixijs/pixi"));

var _util = _interopRequireDefault(require("libs/ni/util"));

var _loader = _interopRequireDefault(require("libs/ni/loader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导出 ******************/
var Spine =
/*#__PURE__*/
function () {
  function Spine() {
    _classCallCheck(this, Spine);
  }

  _createClass(Spine, null, [{
    key: "addSpineData",

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
     * @description 添加配置
     */
    value: function addSpineData(data) {
      var jk, rawSkeletonData, rawAtlasData, spineAtlas, spineAtlasLoader, spineJsonParser, spineData;

      var _loop = function _loop(k) {
        Spine.cfgs[k] = data[k];

        if (_util.default.fileSuffix(k) == ".atlas") {
          jk = k.replace(".atlas", ".json");
          rawSkeletonData = JSON.parse(data[jk]);
          rawAtlasData = data[k];
          spineAtlas = new PIXI.spine.core.TextureAtlas(rawAtlasData, function (line, callback) {
            callback(_loader.default.resources[k.replace(".atlas", ".png")].texture.baseTexture);
          });
          spineAtlasLoader = new PIXI.spine.core.AtlasAttachmentLoader(spineAtlas);
          spineJsonParser = new PIXI.spine.core.SkeletonJson(spineAtlasLoader);
          spineData = spineJsonParser.readSkeletonData(rawSkeletonData);
          console.log(spineData);
          Spine.spineData[k] = spineData;
          delete data[k];
          delete data[jk];
        }
      };

      for (var k in data) {
        _loop(k);
      }
    }
    /**
     * @description 创建pine动画
     */

  }, {
    key: "create",
    value: function create(name) {
      if (!Spine.spineData[name]) {
        return;
      }

      return new PIXI.spine.Spine(Spine.spineData[name]);
    }
    /**
     * @description 更新动画
     */

  }, {
    key: "update",
    value: function update() {}
  }]);

  return Spine;
}();
/****************** 本地 ******************/

/****************** 立即执行 ******************/
//绑定资源监听


exports.default = Spine;
Spine.anims = [];
Spine.cfgs = {};
Spine.spineData = {};

_loader.default.addResListener("addSpineData", Spine.addSpineData);
})