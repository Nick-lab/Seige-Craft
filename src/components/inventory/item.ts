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
    
        this.element = item;
    
        // this.items.push(item);
        // this.cells[index].appendChild(item);
    }

    this.save = () => {
        return {
            size: this.size,
            invPos: this.invPos,
            type: this.type,
            name: this.name,
            attributes: this.attributes,
            lore: this.loar
        }
    }

    this.getSize = (num) => {
        return (30 * num) + (2 * (num - 1)) 
    }

    this.getId = () => {
        return new Date().getTime().toString(36).substr(2,9);
    }
}