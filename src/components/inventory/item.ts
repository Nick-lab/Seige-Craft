export function Item () {

    this.init = (options) => {
        return new Promise((res)=>{
            Object.keys(options).forEach((key)=>{this[key] = options[key]});
            this.id = this.getId();
            this.createElement();
            res(this.id)
        });
    }

    this.createElement = () => {
        let item = document.createElement('div');
        item.setAttribute('draggable', 'true');
        item.id = this.id;
        item.style.width = this.getSize(this.size.x) + 'px';
        item.style.height = this.getSize(this.size.y) + 'px';
        item.classList.add('item');

        if(this.icon){
            item.style.backgroundImage = `url(${this.icon})`;
        }

        this.element = item;
        
        this.getTypeFunctionallity()

        // this.items.push(item);
        // this.cells[index].appendChild(item);
    }

    this.save = () => {
        return {
            id: this.id,
            size: this.size,
            invPos: this.invPos,
            icon: this.icon,
            type: this.type,
            name: this.name,
            attributes: this.attributes,
            lore: this.lore
        };
    }

    this.getSize = (num) => {
        return (30 * num) + (2 * (num - 1)) 
    }

    this.getId = () => {
        return (new Date().getTime()+Math.random()*100).toString(36).substr(2,9);
    }

    this.getTypeFunctionallity = () => {
        
        if(this.type == 'bag'){
            // load listeners
            
                this.element.ondblclick  = () => {
                    console.log('double click', this.inventories.windows.indexOf(this.id));
                    if(this.inventories.windows.indexOf(this.id) == -1){
                        this.inventories.loadInventory(this.id).then((inventory)=>{
                            console.log('bag load', inventory);
                            if(inventory){
                                this.inventories.windows.push(this.id);
                            }else{
                                this.inventories.createInventory({id: this.id, width: this.attributes.width, height: this.attributes.height, label: this.name}).then((inventory)=>{
                                    this.inventories.windows.push(this.id);
                                })
                            }
                        })
                    }
                }
            
        }
    }
}