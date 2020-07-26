interface IItem {
    count: number
    get:() => number
    inc:() => void
}

class Item implements IItem{
    count = 1
    public get():number{
        return this.count
    }
    public inc(){
        this.count++;
    }
}

export default class CalculateItems{
    private items:Map<string, Item> = new Map<string, Item>();

    public Calculate(name: string){
        let item = this.items.get(name)
        if(!item){
            this.items.set(name, new Item())
        }
        else{
            item.inc()
        }
    }

    public getItemsJSON():string{
        return JSON.stringify(Array.from(this.items.entries()))
    }
}
