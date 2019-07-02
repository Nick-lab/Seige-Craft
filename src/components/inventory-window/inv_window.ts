import { Component, AfterViewInit, ViewChild, Input } from "@angular/core";
import { Inventory } from "../inventory/inventory";


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

    ngAfterViewInit() {
        this.dragElement(this.header.nativeElement, this.window.nativeElement);
        console.log('window inventory', this.inventory);
    }

    dragElement(head, body) {
        
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        head.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            console.log(head, body);
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