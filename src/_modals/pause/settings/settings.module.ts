import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SettingsComponent } from "./settings.component";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        SettingsComponent
    ],
    exports: [
        SettingsComponent
    ]
})
export class SettingsComponentModule {}