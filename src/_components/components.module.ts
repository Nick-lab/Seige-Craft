import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouteLoaderModule } from "./route-loader/route-loader.module";

import { ControlBarComponent } from "./control-bar/control-bar.component";
import { ItemComponent } from "./item/item";
import { InventoryComponent } from "./inventory/inventory";
import { InventoryWindow } from "./inventory-window/inv_window";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule,
        RouteLoaderModule
    ],
    declarations: [
        ControlBarComponent,
        InventoryComponent,
        InventoryWindow,
        ItemComponent,
    ],
    exports: [
        ControlBarComponent,
        InventoryComponent,
        InventoryWindow,
        ItemComponent,
    ]
})
export class ComponentsModule {}