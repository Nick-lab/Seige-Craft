import { Component, AfterViewInit, ViewChild, Input } from "@angular/core";
import { Events } from 'ionic-angular';
import { Inventory } from "../inventory/inventory";
import { Inventories } from "../../providers/Inventories";


@Component({
    selector: 'inventory-window',
    templateUrl: 'inv_window.html'
})
export class InventoryWindow implements AfterViewInit{
    @ViewChild('invWindow') window: any;
    @ViewChild('header') header: any;
    @ViewChild('inventory') inventory: Inventory;
    @Input() id: string = undefined;
    inventoryTitle: string = "";
    offsetAmount = 30;
    index = 100;
    ignoreEvent = false;

    constructor(private inventories: Inventories, private events: Events) {
        this.events.subscribe('window-move-back', ()=>{
            if(!this.ignoreEvent){
                this.index -= 1;
            }else{
                this.ignoreEvent = false;
            }
        })
    }

    ngAfterViewInit() {
        let window = <HTMLElement>this.window.nativeElement;
        this.index += this.inventories.windows.length;
        window.style.zIndex = this.index.toString();
        window.style.top = this.inventories.windows.length * this.offsetAmount + "px";
        window.style.left = this.inventories.windows.length * this.offsetAmount + "px";
        this.dragElement(this.header.nativeElement, this.window.nativeElement, this);
    }

    onClose() {
        this.inventories.closeWindow(this.id);
    }

    bringToFront() {
        console.log('bring to from');
        this.ignoreEvent = true;
        this.index = 100 + this.inventories.windows.length;
        this.window.nativeElement.style.zIndex = this.index;
        this.events.publish('window-move-back');
    }

    dragElement(head, body, parent) {
        
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        head.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            // move dragging element to top
            parent.bringToFront();

            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }
    
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            body.style.top = (body.offsetTop - pos2) + "px";
            body.style.left = (body.offsetLeft - pos1) + "px";
        }
    
        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}