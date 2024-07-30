import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { InventoryComponent } from "./inventory";
import { ComponentsModule } from "src/_components/components.module";

const Routes: Routes = [
    {
        path: '',
        component: InventoryComponent
    }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ComponentsModule,
        RouterModule.forChild(Routes)
    ],
    declarations: [
        InventoryComponent
    ],
    exports: []
})
export class InvenotryPageModule {}