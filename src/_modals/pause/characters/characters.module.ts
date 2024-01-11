import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CharactersComponent } from "./characters.component";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CharactersComponent
    ],
    exports: [
        CharactersComponent
    ]
})
export class CharactersComponentModule {}