import { Component } from "@angular/core";
import { Inventories } from "../../../providers/Inventories";

@Component({
    selector: 'stash',
    templateUrl: 'stash.html'
})
export class StashPage{
    constructor(private inventories: Inventories) {}

    
}