import { Component } from "@angular/core";
import { Inventories } from "src/_services/Inventories";

@Component({
    selector: 'app-inventory',
    styleUrls: ['inventory.scss'],
    templateUrl: 'inventory.html'
})
export class InventoryComponent {
    constructor(public inventories: Inventories) {
        document.addEventListener("keydown", (event: KeyboardEvent) => {
            if(event.keyCode === 82) {
                console.log('Rotate Item')
                
            }
        });
    }

    
}