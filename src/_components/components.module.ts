import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ControlBarComponent } from "./control-bar/control-bar.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouteLoaderModule } from "./route-loader/route-loader.module";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule,
        RouteLoaderModule
    ],
    declarations: [
        ControlBarComponent
    ],
    exports: [
        ControlBarComponent
    ]
})
export class ComponentsModule {}