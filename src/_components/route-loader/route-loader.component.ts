
import { Component, OnInit, HostBinding, Input } from "@angular/core";
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'route-loader',
    template: `<span class="progress {{ loadingRoute }}"></span>`,
    styleUrls: ['route-loader.component.scss'],
})
export class RouteLoaderComponent implements OnInit {
    _loadingRoute: 'start' | 'loading' | 'complete' | undefined;
    @HostBinding('class.show') get loadingShow(): boolean {
        return this._loadingRoute != undefined;
    }
    // @HostBinding('class.horizontal') get isHorizontal(): boolean {
    //     return (['horizontal', 'hr']).includes(this.direction)
    // }
    // @HostBinding('class.virtical') get isVirticle(): boolean {
    //     return (['virtical', 'vr']).includes(this.direction)
    // }

    // @Input('direction') direction: 'horizontal' | 'virtical' | 'hr' | 'vr' = 'horizontal';

    get loadingRoute() {
        return this._loadingRoute;
    }
    set loadingRoute(val: 'start' | 'loading' | 'complete' | undefined) {
        switch(val) {
            case 'start':
                this.timeoutStartLoading();
                break;
            case 'complete':
                this.timeoutCompleteLoading();
                break;
        }
        this._loadingRoute = val;
    }
    startTimeout: NodeJS.Timeout | undefined;

    timeoutCompleteLoading() {
        if(this.startTimeout) clearTimeout(this.startTimeout);
        setTimeout(() => {
            this.loadingRoute = undefined;
        }, 400)
    }
    timeoutStartLoading() {
        this.startTimeout = setTimeout(() => {
            this.loadingRoute = 'loading';
        }, 250)
    }

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.router.events.pipe(filter(event => event instanceof RouteConfigLoadStart || event instanceof RouteConfigLoadEnd ))
        .subscribe((event) => {
            if (event instanceof RouteConfigLoadStart) {
                this.loadingRoute = 'start';
            } else if (event instanceof RouteConfigLoadEnd) {
                this.loadingRoute = 'complete';
            }
        });
    }
}