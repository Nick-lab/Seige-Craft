import { Component, HostBinding, HostListener, Input, OnInit, ViewChild, ElementRef } from "@angular/core";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Inventories } from "src/_services/Inventories";
import { Inventory } from "src/_objects/inventory";
import { Context, Item, ItemType } from "src/_game-objects/items";


@Component({
    selector: 'item',
    templateUrl: 'item.html',
    styleUrls: ['item.scss'],
    animations: [
        trigger('context', [
            state('true', style({

            })),
            state('false', style({
                height: '0px'
            })),
            transition('true => false', animate('100ms ease-in')),
            transition('false => true', animate('100ms ease-out'))
        ])
    ]
})
export class ItemComponent implements OnInit {
    public contextOpen: boolean = false;
    public contexts: Context[] = [];
    public contextPos = {
        x: 0,
        y: 0
    }

    get getAmount(): number | string {
        if(this.item && this.item.amount) {
            if(this.item.amount > 999){
                return Math.round(this.item.amount / 10) / 100 + 'k';
            } else return this.item.amount;
        } else return 0;
    }

    @Input() inventory?: Inventory;
    @Input() item?: Item;
    @HostBinding('style.width') width?: string;
    @HostBinding('style.height') height?: string;
    @HostBinding('style.display') display: string = 'block';
    @ViewChild('Image') image?: ElementRef<HTMLImageElement>;

    @HostListener('dblclick') onDoubleClick() {
        if(this.item)
        if(([ItemType.Bag, ItemType.Case]).indexOf(this.item.type) > -1) {
            this.onOpen();
        }
    }

    @HostListener('dragstart', ['$event']) onDrag(ev: DragEvent){
        
        // starting event listener defines starting info
        if(!this.item) return false;
        // console.log('drag start', ev);
        if(ev.dataTransfer) {
            let item = this.item;
            this.inventories.pickedSize = item.size;
            
            let itemRect = this.itemRef.nativeElement.getBoundingClientRect()
            let layerX = ev.clientX - itemRect.left;
            let layery = ev.clientY - itemRect.top;
            // calculate what cell the item was picked up at
            
            
            this.inventories.pickedUp = {
                x: Math.floor(layerX / (itemRect.width / item.size.x)),
                y: Math.floor(layery / (itemRect.height / item.size.y))
            }
            // console.log(itemRect, this.inventories.pickedUp);
            
            
            this.inventories.item = this.item;
            // set drag image and data transfer 
            if(this.image){
                this.image.nativeElement.style.background = 'rgba(200,200,200,.0)';
                if(this.width && this.height) {
                    this.image.nativeElement.width = parseInt(this.width);
                    this.image.nativeElement.height = parseInt(this.height);
                    // console.log(this.image.nativeElement);
                    
                }
                ev.dataTransfer.setDragImage(this.image.nativeElement, ev.offsetX, ev.offsetY);
            }
            ev.dataTransfer.setData('item', JSON.stringify(item));
            
            
            if(this.inventory) { 
                this.inventories.picked_inventory = this.inventory.id;
                ev.dataTransfer.setData('inventory', this.inventory.id);
                // console.log('DRAG START INV ID', this.inventory.id);
                
            } 
            // clear items cells to allow for placing over old cells it took up
            for(let x = 0; x < item.size.x; x ++) {
                for(let y = 0; y < item.size.y; y ++){
                    if(x > 0 || y > 0){
                        if(item.pos) {
                            let cellPos = {
                                x: x + item.pos.x,
                                y: y + item.pos.y
                            }
                            if(this.inventory)
                            this.inventory.cells[cellPos.y][cellPos.x] = 0;
                        }
                    }
                }
            }
            // hide element to not drop on itself
            setTimeout(()=>{
                this.display = 'none';
            }, 10)
        }

        return true;
    }

    // @HostListener('touchstart', ['$event']) onTouchStart(ev: PointerEvent) {
    //     if((<HTMLElement>ev.target).offsetParent?.tagName == 'ITEM') {
    //         console.log('TOUCH START', ev);
    //     }
    // }

    @HostListener('dragover', ['$event']) onDragOver(ev: DragEvent) {
        // stop propagation to cell element
        ev.stopPropagation();
        let action = '';
        if(
            this.item && this.inventories.item &&
            this.item.name === this.inventories.item.name
            && this.item.stackable && this.item.amount
            && this.item.amount < this.item.stackable
        ){
            // allow stacking
            action = 'stack';
            ev.preventDefault();
        }
        
        if(this.inventories.itemAction !== action) this.inventories.itemAction = action;
    }

    @HostListener('dragenter', ['$event']) onDragEnter(ev: DragEvent) {
        // stop propagation to cell element
        ev.stopPropagation();
        let action = '';
        if(
            this.item && this.inventories.item &&
            this.item.name === this.inventories.item.name
            && this.item.stackable && this.item.amount
            && this.item.amount < this.item.stackable
        ){
            // allow stacking
            action = 'stack';
            ev.preventDefault();
        }
        
        if(this.inventories.itemAction !== action) this.inventories.itemAction = action;
    }

    @HostListener('touchmove', ['$event']) onTouchMove(ev: PointerEvent) {
        // if((<HTMLElement>ev.target).offsetParent?.tagName == 'ITEM') {
        //     ev.stopPropagation()
        //     console.log('TOUCH START', ev);
        // }
    }

    @HostListener('drop', ['$event']) onDrop(ev: DragEvent) {
        // Item being droped
        if(ev.dataTransfer) {
            if(!this.item) return;
            let item:Item = JSON.parse(ev.dataTransfer.getData('item'));
            ev.stopPropagation();
            ev.preventDefault();
            // check for action to do with item dropping on item
            if(this.inventories.itemAction === 'stack'){
                let a = item.amount;
                let b = this.item.amount;
    
                // need to retreive inventory in case item came from another inventory
                let inventory = this.inventories.getInventory(ev.dataTransfer.getData('inventory'))
                // remove item from old inventory
                if(inventory && this.inventory && this.item && this.item.amount && item.amount) {
                    if(item.id) inventory.removeItem(item.id);
                    
                    // if old item + new item more than stacking limit
                    if(this.item && this.item.stackable && item.stackable && a && b && b + a > item.stackable){
                        // set dropped on item to stack limit
                        this.item.amount = item.stackable;
                        item = JSON.parse(JSON.stringify(this.item));
                        item.amount = b + a - this.item.stackable;
    
                        // delete dropped item position and id so new inventory can assign it a spot
                        delete item.pos;
                        delete item.id;
    
                        this.inventory.pushItem(item);
                    }else{
                        // simple set dropped on item to new amount
                        this.item.amount += item.amount;
                    }
                }
            }
        }
    }

    @HostListener('dragend', ['$event']) onDragEnd() {
        if(this.image)
        this.image.nativeElement.style.background = '';
        this.display = 'block';
    }

    // @HostListener('touchend', ['$event']) onTouchEnd(ev: PointerEvent) {
    //     if((<HTMLElement>ev.target).offsetParent?.tagName == 'ITEM') {
    //         ev.stopPropagation()
    //         console.log('ITEM TOUCH END', ev);
    //     }
    // }

    @HostListener('contextmenu', ['$event']) onContext(ev: MouseEvent) {
        console.log(ev);
        ev.preventDefault();
        this.contextOpen = true;
        let target: HTMLElement = <HTMLElement>ev.target;
        if(target.nodeName != "ITEM" && target.parentElement) target = target.parentElement;

        //setTimeout(()=>{
            target = <HTMLElement>target.lastElementChild;
            console.log(target);
            console.log(ev.clientX, target.clientWidth, ev.clientX + target.clientWidth, window.innerWidth)
            this.contextPos = {
                x: ev.clientX + target.clientWidth + 10 > window.innerWidth ? ev.offsetX - target.clientWidth + 2 : ev.offsetX - 2,
                y: ev.offsetY - 2,
            }

        //},1)
        
    }

    @HostListener('mouseleave', ['$event']) onCloseContext(ev: MouseEvent) {
        // console.log('Close Context', ev);
        if(this.contextOpen) this.contextOpen = false;
    }

    constructor(private inventories: Inventories, private itemRef: ElementRef<HTMLElement>) {
        
    }

    ngOnInit() {
        if(this.item && this.inventory) {
            this.width = this.inventories.getSize(this.item.size.x) + 'px';
            this.height = this.inventories.getSize(this.item.size.y) + 'px';
            
            // this.width = this.item.size.x * 100 + '%';
            // this.height = this.item.size.y * 100 + '%';
            let item = this.item;
            // console.log(this.item);

            if(item.stackable) this.contexts.push({label: 'Split', action: this.onContextSplit.bind(this)});
            if(([ItemType.Case, ItemType.Bag]).indexOf(item.type) >= 0) this.contexts.push({label: 'Open', action: this.onOpen.bind(this)});
            this.contexts.push({label: 'Delete', action: this.onContextDelete.bind(this)});
        }
    }

    /*
        CONTEXT ACTIONS
    */

    onContextDelete() {
        if(this.inventory && this.item && this.item.id)
        this.inventory.removeItem(this.item.id);
    }

    onContextSplit() {
        // split item stack
        if(this.inventory && this.item && this.item.amount && this.item.amount >= 2) {
            let item: Item = JSON.parse(JSON.stringify(this.item));
            if (this.inventory.findSPace(item)) {
                item.amount = Math.ceil(this.item.amount / 2);
                delete item.id;
                delete item.pos;
                this.item.amount = Math.floor(this.item.amount / 2);
                this.inventory.pushItem(item);
            } else {
                console.log('No Space to Split');
            }
        }

    }

    onOpen() {
        if(this.item && this.item.id) {
            // open inventory window
            let id = this.item.id;
            let item = this.item;
            // check if inventory is open alread
            if(this.inventories.windows.indexOf(id) < 0){
                let inventory = this.inventories.getInventory(id)
                // inventory exists just open otherwise create new empty inventory
                if(!inventory && item.attributes.width && item.attributes.height){
                    this.inventories.saveInventory({
                        id,
                        label: item.name,
                        rows: item.attributes.height,
                        columns: item.attributes.width,
                        items: []
                    }, id);
                }
                // push inventory to windows
                this.inventories.windows.push(id);
            }
        }
    }

    /*
        CONTEXT ACTIONS END
    */
}
