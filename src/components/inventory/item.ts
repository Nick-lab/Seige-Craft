export function Item () {

    this.init = (options) => {
        return new Promise((res)=>{
            // set properties
            Object.keys(options).forEach((key)=>{this[key] = options[key]});
            // generate new id if new item
            if(!this.id){this.id = this.getId();}

            // create html element
            this.createElement();
            res(this.id);
        });
    }

    this.createElement = () => {
        let item = this.element = document.createElement('div');
        item.setAttribute('draggable', 'true');
        item.id = this.id;
        item.style.width = this.getSize(this.size.x) + 'px';
        item.style.height = this.getSize(this.size.y) + 'px';
        item.classList.add('item');

        if(this.icon){
            item.style.backgroundImage = `url(${this.icon})`;
        }

        if(this.stackable){
            let stack = document.createElement('span');
            stack.classList.add('stack');
            stack.innerHTML = this.getAmount();
            item.appendChild(stack);
        }



        this.element = item;
        
        this.getTypeFunctionallity()

        // this.items.push(item);
        // this.cells[index].appendChild(item);
    }

    this.save = () => {
        // return savable object
        let tmp: any = {
            id: this.id,
            size: this.size,
            invPos: this.invPos,
            icon: this.icon,
            type: this.type,
            name: this.name,
            attributes: this.attributes,
            lore: this.lore
        };

        if(this.stackable && this.amount){
            tmp.stackable = this.stackable;
            tmp.amount = this.amount;
        }
        
        return tmp;
    }

    this.rotate = () => {
        this.size = {
            x: this.size.y,
            y: this.size.x
        };
        this.element.style.width = this.getSize(this.size.x) + 'px';
        this.element.style.height = this.getSize(this.size.y) + 'px';
    }

    this.getSize = (num) => {
        return (30 * num) + (2 * (num - 1)) 
    }

    this.getId = () => {
        return (new Date().getTime()+Math.random()*100).toString(36).substr(2,9);
    }

    this.getTypeFunctionallity = () => {
        // load item functionallity

        if(this.type == 'bag' || this.type == "case"){
            // load listeners
            
                this.element.ondblclick  = () => {
                    // on double click if window not open load inventory
                    if(this.inventories.windows.indexOf(this.id) == -1){
                        this.inventories.loadInventory(this.id).then((inventory)=>{
                            // if inventory exists display it
                            if(inventory){
                                this.inventories.windows.push(this.id);
                                if(this.inventories.windows.length > 5) {
                                    this.inventories.closeWindow(this.inventories.windows[0]);
                                }
                            }else{
                                // create then display inventory
                                this.inventories.createInventory({
                                    id: this.id, 
                                    width: this.attributes.width, 
                                    height: this.attributes.height, 
                                    filters:  this.attributes.filters ? this.attributes.filters : [], 
                                    label: this.name
                                }).then((inventory)=>{
                                    this.inventories.windows.push(this.id);
                                    if(this.inventories.windows.length > 5) {
                                        this.inventories.closeWindow(this.inventories.windows[0]);
                                    }
                                })
                            }

                        })
                    }
                }
            
        }

        if(this.type == 'ammo') {

        }

        else {
            this.element.onclick = (ev: KeyboardEvent) => {
                if(ev.shiftKey){
                    console.log('Send to inventory');
                }
            }
        }
    }

    this.getAmount = () => {
        if(this.amount) {
            if(this.amount > 999){
                return Math.round(this.amount / 10) / 100 + 'k';
            } else return this.amount;
        } else return 0;
    }
}