import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { InventoryComponentModule } from "./inventory/inventory.module";
import { CharactersComponentModule } from "./characters/characters.module";
import { SettingsComponentModule } from "./settings/settings.module";
import { PauseModal } from "./pause.modal";

const PauseComponents = [
    InventoryComponentModule,
    CharactersComponentModule,
    SettingsComponentModule
]

@NgModule({
    imports: [
        CommonModule,
        ...PauseComponents
    ],
    declarations: [
        PauseModal
    ],
    exports: [
        PauseModal
    ]
})
export class PauseComponentModule {}