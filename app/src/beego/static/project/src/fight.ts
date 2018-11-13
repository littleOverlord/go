/**
 * class
 */
class Fighter{
    public name: string        = ""
    public id: number          = 0
    public camp: number        = 0
    public speed: number       = 0
    // fight attributes
    public hp: number          = 0
    public maxHp: number       = 0
    public attack: number      = 0
    public attackSpeed: number = 10
    // runtime attributes
    public prevAttack: number  = 0
}
class Map{
    private _size: number = 0
    private values = {}
    
    public set(key: any, value: any): void{
        if(this.values[key] !== undefined){
            this._size += 1;
        }
        this.values[key] = value;
    }
    public get(key: any): any{
        return this.values[key];
    }
    public size(): number{
        return this._size;
    }
    public delete(key: any): void{
        if(this.values[key] !== undefined){
            this._size -= 1;
        }
        delete this.values[key];
    }
    public foreach(callback: Function): void{
        for(let k in this.values){
            callback(this.values,k);
        }
    }
}

class Scene{
    //战斗者初始id,递增
    private fid = 1
    //战斗者列表
    private fighters = new Map()
    /**
     * @description 玩家进入战斗
     * @param f 战斗者
     */
    public insert(f: Fighter){
        this.fighters.set(this.fid++,f);
    }
    //主循环
    public loop(){
        this.fighters.foreach((f: Fighter,k: string)=>{
            
        });
    }
}