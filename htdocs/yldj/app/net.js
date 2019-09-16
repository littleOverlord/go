define("app/net",function(require,exports,module){
"use strict";

var _connect = _interopRequireDefault(require("libs/ni/connect"));

var _cfgmrg = _interopRequireDefault(require("libs/ni/cfgmrg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @description 模拟后台测试
 */
//存储
var saveDb = function saveDb(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}; //权重


var Weight =
/*#__PURE__*/
function () {
  /**
   * @description 初始化权重
   * @param wTable 权重表 [10,2,3,...]
   */
  function Weight(wTable) {
    _classCallCheck(this, Weight);

    this.all = 0;
    this.table = [];
    var w = [];

    for (var i = 0, len = wTable.length; i < len; i++) {
      w.push(this.all);
      this.all += wTable[i];
      w.push(this.all);
      this.table[i] = w;
      w = [];
    }
  }

  _createClass(Weight, [{
    key: "cacl",

    /**
     * @description 计算权重是否通过
     * @returns index 第几个权重，0开始, 对应 table
     */
    value: function cacl() {
      var p = Math.random(),
          l,
          r;

      for (var i = 0, len = this.table.length; i < len; i++) {
        l = this.table[i][0] / this.all;
        r = this.table[i][1] / this.all;

        if (p >= l && p < r) {
          return i;
        }
      }

      return -1;
    }
  }]);

  return Weight;
}();
/****************** player ******************/


var dataPlayer = {
  money: 0
}; //读取玩家信息

var readPlayer = function readPlayer(param, callback) {
  var d = localStorage.getItem("player");

  if (d) {
    d = JSON.parse(d);
    dataPlayer = d;
  } else {
    d = dataPlayer;
  }

  callback({
    ok: d
  });
}; //添加金币


var addMoney = function addMoney(m) {
  dataPlayer.money += m;
  saveDb("player", dataPlayer);
  return dataPlayer.money;
};

_connect.default.setTest("app/player@read", readPlayer);
/****************** stage ******************/


var dataStage = {
  level: 1,
  fightCount: 0,
  lastFightTime: 0
}; //获取当前关卡怪物属性[attack,hp,attackSpeed,attackDistance,speed]

var findMonster = function findMonster(type) {
  var a = ["attack", "hp", "attackSpeed", "attackDistance", "speed"],
      cfg = _cfgmrg.default.getOne("app/cfg/pve.json@stage")[dataStage.level],
      scale = cfg["attr".concat(type + 1)],
      attr = _cfgmrg.default.getOne("app/cfg/pve.json@attribute")[cfg["level".concat(type + 1)]],
      r = [];

  for (var i = 0, len = a.length; i < len; i++) {
    r[i] = scale[i] * attr[a[i]];
  } // console.log(cfg,attr);


  return {
    module: cfg["id".concat(type + 1)],
    attr: r
  };
}; //模拟后台读取接口


var readStage = function readStage(param, callback) {
  var d = localStorage.getItem("stage");

  if (d) {
    d = JSON.parse(d);
    dataStage = d;
  } else {
    d = dataStage;
  }

  callback({
    ok: d
  });
}; //模拟后台战斗接口


var fightTest = function fightTest(param, callback) {
  var r = {};

  if (param.type == 1 && dataStage.fightCount < 5) {
    r.err = {
      reson: "Can't fight boss!"
    };
    return callback(r);
  }

  saveDb("stage", dataStage);
  callback(findMonster(param.type));
}; //模拟后台结算接口
//装备 [[1(装备类型0武器 1防具),1(等级),1(位置)]]


var accountTest = function accountTest(param, callback) {
  var award = param.result ? fightAward(param.type) : {};

  if (param.type == 1 && param.result) {
    dataStage.fightCount = 0;
    dataStage.level += 1;
  } else if (param.result) {
    dataStage.fightCount += 1;
  }

  saveDb("stage", dataStage);
  callback({
    ok: {
      award: award,
      fightCount: dataStage.fightCount,
      level: dataStage.level
    }
  });
};

var equipWeight = new Weight([4, 2, 1]); //获取关卡奖励

var fightAward = function fightAward(type) {
  var cfg = _cfgmrg.default.getOne("app/cfg/pve.json@stage")[dataStage.level],
      p = [[0.95, 1.05], [0.98, 1.02]],
      mp = p[type],
      dm = cfg["money" + (type + 1)],
      ed = cfg["drop" + (type + 1)] || 1,
      dl = cfg["dropLevel" + (type + 1)],
      w,
      r = {};

  r.money = addMoney(Math.round(dm * (mp[0] + (mp[1] - mp[0]) * Math.random())));
  r.equip = [];

  if (type == 1) {
    for (var i = 0; i < 4; i++) {
      r.equip.push([Math.round(Math.random()), dl]);
    }
  } else if (Math.random() < ed) {
    w = equipWeight.cacl();

    switch (w) {
      case 0:
        r.equip.push([Math.round(Math.random()), dl - 1 < 1 ? dl : dl - 1]);
        break;

      case 1:
        r.equip.push([Math.round(Math.random()), dl]);
        break;

      case 2:
        r.equip.push([Math.round(Math.random()), dl + 1]);
        break;
    }
  }

  if (r.equip.length) {
    r.equip = addEquip(r.equip);
  }

  if (r.equip.length == 0) {
    delete r.equip;
  }

  return r;
};

_connect.default.setTest("app/stage@read", readStage);

_connect.default.setTest("app/stage@fight", fightTest);

_connect.default.setTest("app/stage@account", accountTest);
/****************** equip ******************/
//[[武器等级,..],[防具等级,...]]


var dataEquip = [[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]; //模拟读取装备

var readEquip = function readEquip(param, callback) {
  var d = localStorage.getItem("equip");

  if (d) {
    d = JSON.parse(d);
    dataEquip = d;
  } else {
    d = dataEquip;
  }

  callback({
    ok: d
  });
}; //模拟合成装备
//param {src:装备源位置, target:目标装备位置, type: 武器(1)||防具(2)}


var mixtureEquip = function mixtureEquip(param, callback) {
  var type = param.type - 1,
      eq = dataEquip[type],
      s = eq[param.src],
      t = eq[param.target],
      r = [];

  if (s != t) {// eq[param.src] = t;
    // eq[param.target] = s;
    // r = [t,s];
  } else {
    eq[param.target] = s + 1;
    eq[param.src] = 0;
    r = [0, s + 1];
  }

  saveDb("equip", dataEquip);
  callback({
    ok: r
  });
};
/**
 * @description 模拟出售装备
 * @param param {index:装备源位置, type: 武器(1)||防具(2)}
 * @param callback 
 */


var saleEquip = function saleEquip(param, callback) {
  var type = param.type - 1,
      eq = dataEquip[type],
      s = eq[param.index],
      cfg = _cfgmrg.default.getOne("app/cfg/pve.json@equipment"),
      r = {};

  if (!s) {
    r.err = {
      reson: "It's not a equip at index of " + param.index
    };
    return callback(r);
  }

  dataPlayer.money += cfg[s].money;
  eq[param.index] = 0;
  r.money = dataPlayer.money;
  saveDb("equip", dataEquip);
  saveDb("player", dataPlayer);
  callback({
    ok: r
  });
}; //添加装备
// [level,level,...]

/**
 * @description 添加装备
 * @param data [[type,level],[type,level],...]
 * @returns [[1(装备类型0武器 1防具),1(等级),1(位置)]]
 */


var addEquip = function addEquip(data) {
  var item = data.shift(),
      e,
      ei = {
    "0": 0,
    "1": 0
  },
      r = [];

  while (item) {
    e = dataEquip[item[0]];

    for (var len = e.length; ei[item[0]] < len; ei[item[0]]++) {
      if (e[ei[item[0]]] == 0) {
        e[ei[item[0]]] = item[1];
        r.push([item[0], item[1], ei[item[0]]]);
        break;
      }
    }

    item = data.shift();
  }

  saveDb("equip", dataEquip);
  return r;
};

_connect.default.setTest("app/equip@read", readEquip);

_connect.default.setTest("app/equip@mixture", mixtureEquip);

_connect.default.setTest("app/equip@sale", saleEquip);
/****************** equip ******************/

/**
 * {
 *  fast:[level,money] // 
 * }
 */


var dataStore = {
  fast: [[1, 5], [1, 5]]
}; //模拟读取商店数据

var readStore = function readStore(param, callback) {
  var d = localStorage.getItem("store");

  if (d) {
    d = JSON.parse(d);
    dataStore = d;
  } else {
    d = dataStore;
  }

  callback({
    ok: d
  });
}; //模拟快速购买装备
//param {type: 武器(1)||防具(2)}


var fastBuy = function fastBuy(param, callback) {
  var fast = dataStore.fast[param.type - 1],
      dm = dataPlayer.money - fast[1],
      eruips,
      r = {};

  if (dm < 0) {
    r.err = {
      reson: "not enough money"
    };
    return callback(r);
  }

  eruips = addEquip([[param.type - 1, fast[0]]]);

  if (eruips.length == 0) {
    r.err = {
      reson: "bag is full"
    };
    return callback(r);
  }

  r.ok = {};
  r.ok.equip = eruips;
  r.ok.money = dm;
  r.ok.fast = dataStore.fast[param.type - 1] = caclFast(param.type - 1);
  dataPlayer.money = dm;
  saveDb("store", dataStore);
  saveDb("player", dataPlayer);
  callback(r);
}; //模拟快速购买装备
//param {type: 武器(1)||防具(2)}


var caclFast = function caclFast(type) {
  var list = [-7, -6, -5],
      w = equipWeight.cacl(),
      diff = list[w],
      equips = dataEquip[type],
      level,
      max = 0,
      cfg = _cfgmrg.default.getOne("app/cfg/pve.json@equipment"),
      money;

  for (var i = 0, len = equips.length; i < len; i++) {
    if (equips[i] > max) {
      max = equips[i];
    }
  }

  level = max + diff;

  if (level < 1) {
    level = 1;
  }

  money = cfg[level].money;
  return [level, money];
};

_connect.default.setTest("app/store@read", readStore);

_connect.default.setTest("app/store@fastbuy", fastBuy);
})