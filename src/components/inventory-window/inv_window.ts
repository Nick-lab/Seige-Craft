import { Component, AfterViewInit, ViewChild, Input } from "@angular/core";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Events } from 'ionic-angular';
import { Inventory } from "../inventory/inventory";
import { Inventories } from "../../providers/Inventories";


@Component({
    selector: 'inventory-window',
    templateUrl: 'inv_window.html',
    // animations: [
    //     trigger('window', [
    //         state('true', style({
    //             opacity: '1'
    //         })),
    //         state('false', style({
    //             opacity: '0',
    //             height: '0px'
    //         })),
    //         transition('true => false', animate('100ms ease-in')),
    //         transition('false => true', animate('100ms ease-out'))
    //     ])
    // ]
})
export class InventoryWindow implements AfterViewInit{
    @ViewChild('invWindow') window: any;
    @ViewChild('header') header: any;
    @ViewChild('inventory') inventory: Inventory;
    @Input() id: string = undefined;
    inventoryTitle: string = "";
    offsetAmount = 30;
    index = 0;
    open = false;
    width;

    constructor(private inventories: Inventories, private events: Events) {
        this.events.subscribe('window-move-back', ()=>{
            this.inventories.windows.forEach((id, i)=>{if(id === this.id) this.index = i});
        });
        this.index += this.inventories.windows.length;
    }

    ngAfterViewInit() {
        let window = <HTMLElement>this.window.nativeElement;
        window.style.zIndex = this.index.toString();
        window.style.top = this.inventories.windows.length * this.offsetAmount + "px";
        window.style.left = this.inventories.windows.length * this.offsetAmount + "px";
        this.dragElement(this.header.nativeElement, this.window.nativeElement, this);
        this.open = true;
    }

    setWidth(ev) {
        this.width = parseInt(ev);
    }

    onClose() {
        this.open = false;
        //setTimeout(()=>{
            this.inventories.closeWindow(this.id);
        //}, 200);
    }

    bringToFront() {
        console.log('bring to front');
        for(let i = 0; i < this.inventories.windows.length; i++) {
            let id = this.inventories.windows[i];
            if(id == this.id && i !== this.inventories.windows.length - 1) this.inventories.windows.push(this.inventories.windows.splice(i, 1));
        }
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