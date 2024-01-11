import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GameComponent } from "./game.component";
import { FormsModule } from "@angular/forms";

const Routes: Routes = [
    {
        path: '',
        component: GameComponent
    }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(Routes)
    ],
    declarations: [
        GameComponent
    ],
    exports: []
})
export class GamePageModule {}