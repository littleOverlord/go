define("app/rank",function(require,exports,module){
"use strict";

var _widget = _interopRequireDefault(require("libs/ni/widget"));

var _db = _interopRequireDefault(require("libs/ni/db"));

var _appEmitter = require("app/appEmitter");

var _connect = _interopRequireDefault(require("libs/ni/connect"));

var _scene = _interopRequireDefault(require("libs/ni/scene"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/****************** 导出 ******************/

/****************** 本地 ******************/

/**
 * ranksInfo
 * {
 *  "rank":[],
 *  top:0
 * }
 */
var ranksInfo;
var rankNode;
/**
 * @description 用户组件
 */

var WrankTop =
/*#__PURE__*/
function (_Widget) {
  _inherits(WrankTop, _Widget);

  function WrankTop() {
    _classCallCheck(this, WrankTop);

    return _possibleConstructorReturn(this, _getPrototypeOf(WrankTop).apply(this, arguments));
  }

  _createClass(WrankTop, [{
    key: "setProps",
    value: function setProps(props) {
      for (var k in props) {
        this.cfg.data[k] = props[k];
      }
    }
  }, {
    key: "added",
    value: function added(node) {
      rankNode = node;
      updateRankPage();
    }
  }]);

  return WrankTop;
}(_widget.default);

var WrankItem =
/*#__PURE__*/
function (_Widget2) {
  _inherits(WrankItem, _Widget2);

  function WrankItem() {
    _classCallCheck(this, WrankItem);

    return _possibleConstructorReturn(this, _getPrototypeOf(WrankItem).apply(this, arguments));
  }

  _createClass(WrankItem, [{
    key: "setProps",
    value: function setProps(props) {
      this.cfg.data.left = props.index * 90;
      this.cfg.data.top = Math.floor(props.index / 6) * 200;

      if (props.info.head) {
        this.cfg.children[1].data.netUrl = props.info.head;
        delete this.cfg.children[1].data.url;
      } else {
        this.cfg.children[1].data.url = "images/logo/logo.png";
      }

      if (props.info.name) {
        this.cfg.children[2].data.text = props.info.name;
      }

      this.cfg.children[0].data.text = "\u7B2C".concat(props.top, "\u540D");
      this.cfg.children[3].data.text = "".concat(props.info.score);
    }
  }, {
    key: "added",
    value: function added(node) {// TODO 插入排行数据....
    }
  }]);

  return WrankItem;
}(_widget.default);
/**
 * @description 读取玩家积分数据
 */


var readScore = function readScore() {
  _connect.default.request({
    type: "app/score@read",
    arg: {}
  }, function (data) {
    if (data.err) {
      return;
    }

    console.log(data);
    _db.default.data.score.phase = data.ok.phase;
    _db.default.data.score.history = data.ok.history;
  });
};
/**
 * @description 更新得分
 * @param score 
 */


var addScore = function addScore(score) {
  if (score <= _db.default.data.score.phase) {
    return console.log("the score is not enough to update(".concat(score, "<=").concat(_db.default.data.score.phase, ")"));
  }

  _connect.default.request({
    type: "app/score@add",
    arg: {
      score: score
    }
  }, function (data) {
    if (data.err) {
      return;
    }

    console.log(data);
    readRank();
  });
};
/**
 * @description 读取玩家排行榜数据
 */


var readRank = function readRank() {
  _connect.default.request({
    type: "app/score@rank",
    arg: {}
  }, function (data) {
    if (data.err) {
      return;
    }

    console.log(data);
    ranksInfo = data.ok;
    updateRankPage();
  });
};
/**
 * @description 更新排行页面
 */


var updateRankPage = function updateRankPage() {
  if (!rankNode || ranksInfo.rank.length == 0) {
    return;
  }

  var t;
  rankNode.children[0].alpha = 0;

  if (rankNode.children.length > 1) {
    rankNode.removeChildren(1);
  } // TODO 插入排行数据....


  for (var i = 0, len = ranksInfo.rank.length; i < len; i++) {
    t = i + 1;

    if (i > 2) {
      t = i - 2 + ranksInfo.start + 1;
    }

    _scene.default.open("app-ui-rank_item", rankNode, null, {
      "info": ranksInfo.rank[i],
      "top": t,
      "index": i
    });
  }
};
/****************** 立即执行 ******************/
//初始化关卡数据库表


_db.default.init("score", {
  history: 0,
  phase: 0
}); //注册组件


_widget.default.registW("app-ui-rank_top", WrankTop);

_widget.default.registW("app-ui-rank_item", WrankItem);

_appEmitter.AppEmitter.add("gameStart", function () {
  readScore();
  readRank();
});

_appEmitter.AppEmitter.add("newScore", function (score) {
  addScore(score);
});
})