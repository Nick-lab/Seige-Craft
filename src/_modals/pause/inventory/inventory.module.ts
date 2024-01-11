import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { InventoryComponent } from "./inventory.component";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        InventoryComponent
    ],
    exports: [
        InventoryComponent
    ]
})
export class InventoryComponentModule {}