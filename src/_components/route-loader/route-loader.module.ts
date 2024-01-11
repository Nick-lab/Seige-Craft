import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RouteLoaderComponent } from "./route-loader.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        RouteLoaderComponent
    ],
    exports: [
        RouteLoaderComponent
    ]
})
export class RouteLoaderModule {}