/**
 * class
 */
//战斗事件
enum EType{
    insert = "insert",
    move   = "move",
    damage = "damage"
}
//战斗者
export class Fighter{
	constructor(obj){
		for(let k in obj){
			this[k] = obj[k];
		}
	}
    public name: string        = "" // 名字
    public camp: number        = 0 // 阵营 1为己方，0为对方
    public speed: number       = 3 // 移动速度
    public passive: number     = 0 // 是否被动
    // fight attributes
    public hp: number          = 0
    public maxHp: number       = 0
    public attack: number      = 0
    public attackSpeed: number = 1500 // 攻击速度,每次出手的时间间隔(ms)
    public attackDistance: number = 7 // 攻击距离 
	// runtime attributes
	public x: number           = 0 
    public y: number           = 0 
	public id: number          = 0 // 场景内的fighter id, 出场顺序递增
    public prevAttack: number  = 0 // 上次出手时间
    public target: number      = 0 // 攻击目标的id
}

//战斗场景
export class Scene{
    constructor(listener: Function){
        this.listener = listener;
    }
    //战斗者初始id,递增
    private fid = 1
    //战斗者列表
    private fighters = new Map()
    // 场景时间轴
    private now = 0
    //场景事件监听器
    private listener: Function
    //事件列表
    private events = [];
    
    /**
     * @description 玩家进入战斗
     * @param f 战斗者
     */
    public insert(f: Fighter){
        let id = this.fid++;
        f.id = id;
        this.fighters.set(id,f);
        this.addEvents([EType.insert,f]);
    }
    //主循环
    public loop(){
        let now = Date.now(),evs;
        this.now = now;
        this.fighters.forEach((f: Fighter,k: string)=>{
            if(f.hp <= 0 || f.passive || f.attackSpeed > (now - f.prevAttack)){
                return;
            }
            let t = this.fighters.get(f.target);
            if(!t || t.hp <= 0){
                t = Policy.selectTargets(f,this.fighters);
                if(t){
                    f.target = t.id;
				}
				return f.prevAttack = now;
            }
            if(t && !Policy.move(f,t,this)){
				Policy.calc(f,t,this);
				f.prevAttack = now;
            }
        });
        evs = this.events;
        this.events = [];
        return evs;
    }
    //添加事件
    public addEvents(es: Array<any>){
        this.listener && this.events.push(es);
	}
	//检查胜负
	public checkResult(){
        var left = 0, right = 0;
        this.fighters.forEach(f => {
            if (f.camp === 1 && f.hp > 0)
                left++;
            if (f.camp === 0 && f.hp > 0)
                right++;
        });
        if (left > 0 && right > 0)
            return 0;
        return left > 0 ? 1 : 2;
	}
}
//战斗决策
class Policy{
    /**
     * @description 移动
     * @param f Fighter
     * @param t Fighter
     */
    static move(f: Fighter, t: Fighter, s: Scene){
        let dis = Math.abs(t.x - f.x),d = dis/f.attackDistance;
        if(d <= 1){
            return false;
        }
        d = f.speed / dis;
        f.x += (t.x - f.x)*d;
        s.addEvents([EType.move,f.id,[f.x]]);
        return true;
    }
    /**
     * @description 战斗计算
     * @param f 
     * @param t 
     * @param s 
     */
    static calc(f: Fighter, t: Fighter, s: Scene){
        let r = f.attack;
		t.hp -= r;
		if(t.passive){
			t.passive = 0;
		}
        s.addEvents([EType.damage,f.id,t.id,r]);
    }
    /**
     * @description 选择攻击目标
     * @param f fighter
     * @param fighters 
     */
    static selectTargets(f: Fighter, fighters: Map<number,Fighter>): Fighter{
        const camp = Math.abs(f.camp - 1),r = Policy.select(fighters,[["hp",">",0],["camp",camp]]);
        r.sort((a,b):number=>{
            return a.x - b.x;
        })
        return r[0];
    }
    /**
     * @description 选择满足条件的fighter
     * @param fighters 
     * @param conds 条件列表 [["hp",">",0],["camp",1]]
     */
    static select(fighters: Map<number,Fighter>,conds: Array<any>): Array<Fighter>{
        let r: Array<Fighter> = [];
        fighters.forEach((e)=>{
            if(Policy.condsCheck(e,conds)){
                r.push(e);
            }
        });
        return r;
    }
    /**
     * @description 条件变量
     */
    static condValue(obj:{}, cond:any): {}{
        var i, n;
        if (typeof cond === typeof "") {
            return obj[cond];
        }
        for (i = 0, n = cond.length; i < n; i++) {
            obj = obj[cond];
            if (obj === undefined)
                return;
        }
        return obj;
    }
    // 条件判断表
    static condMap = {
        '>': function (a, b) {
            return a > b;
        },
        '>=': function (a, b) {
            return a >= b;
        },
        '<': function (a, b) {
            return a < b;
        },
        '=<': function (a, b) {
            return a <= b;
        },
        '!=': function (a, b) {
            return a !== b
        }
    }
    static calculate = {
        "=": (a,b) => {
            return b;
        },
        "+": (a,b) => {
            return a + b;
        },
        "*": (a,b) => {
            return a * b;
        },
        "/": (a,b) => {
            return a / b;
        },
        "-": (a,b) => {
            return a - b;
        },
        "^": (a,b) => {
            return Math.pow(a,b);
        }
    }
    /**
     * @description 判断对象是否满足条件conds
     * @param obj 需要判断的对象
     * @param conds 条件列表 [["hp",">",0],["camp",1],["or",["type",1],...]]
     */
    static condsCheck (obj:{}, conds:Array<any>): boolean{
        var i,j, c, 
            and = (_c):boolean => {
                if (_c.length == 2) {
                    return this.condValue(obj, _c[0]) === _c[1];
                } else{
                    return this.condMap[_c[1]](this.condValue(obj, _c[0]), _c[2]);
                }
            },
            or = (_c):boolean => {
                for(j = _c.length - 1; j > 0; j--){
                    if(and(_c[j])){
                        return true;
                    }
                } 
                return false;
            };
        for (i = conds.length - 1; i >= 0; i--) {
            c = conds[i];
            if(c[0]=="or"){
                if(!or(c)){
                    return false;
                }
            }else if(!and(c)){
                return false
            }
        }
        return true;
    }
}