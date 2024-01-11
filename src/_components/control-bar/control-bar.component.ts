import { Component } from "@angular/core";
import { Location } from '@angular/common';
import { ActivatedRoute, ActivationStart, NavigationEnd, Router } from "@angular/router";
import { filter } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from "@angular/animations";
import { ElectronProvider } from "src/_services/electron";


@Component({
    selector: 'control-bar',
    templateUrl: 'control-bar.component.html',
    styleUrls: [
        'control-bar.component.scss'
    ],
    animations: [
        trigger('navBack', [
            state('true', style({
              left: '0px'
            })),
            state('false', style({
              left: '-60px'
            })),
            transition('true => false', animate('100ms ease-in')),
            transition('false => true', animate('100ms ease-out'))
        ])
    ]
})
export class ControlBarComponent {
    // private isFullScreen: boolean = false;

    public canNavBack: boolean = false;
    public canNavHome: boolean = false;
    private navigatingBack: boolean = false;
    private history: string[] = [];


    private _title?: string;
    get title(): string {
        return this._title ? this._title : this.electron.window_title;
    }

    constructor(
        public electron: ElectronProvider,
        private location: Location,
        private router: Router,
    ) {
        // this.isFullScreen = electron.isFullScreen(); 
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd || event instanceof ActivationStart))
            .subscribe((event) => {
                if(event) {
                    if (event instanceof ActivationStart) {
                        if(event.snapshot.data['title']) {
                            this._title = event.snapshot.data['title'];
                        } else {
                            this._title = undefined;
                        }
                    } else if (event instanceof NavigationEnd) {
                        let {urlAfterRedirects} = <NavigationEnd>event;
                        if(!this.navigatingBack) {
                            this.history.push(urlAfterRedirects);
                        } else {
                            this.navigatingBack = false;
                        }
                        this.canNavBack = this.history.length > 1;

                        if (!this.canNavBack && !urlAfterRedirects.includes('main')) {
                            //console.log("Can Nav Home");
                            this.canNavHome = true;
                        }
                    }
                }
            });
    }



    onNavBack() {
        if(this.canNavBack) {
            this.navigatingBack = true;
            this.history.pop();
            this.location.back();
        }
    }

    onNavHome() {
        this.router.navigate(['/main']);
        this.canNavHome = false;
        this.history = [];
    }

    onMinimize() {
        this.electron.minimizeWindow();
    }

    onToggleFullscreen() {
        console.log('toggle fullscreen', this.electron.isFullScreen);
        
        if(this.electron.isFullScreen) {
            this.electron.unmaximizeWindow();
        } else {
            this.electron.maximizeWindow();
        }
    }

    onClose() {
        console.log('close');
        
        this.electron.closeWindow();
    }

    changeTheme() {
        // if(this.settings.theme == 'light') {
        //     this.settings.theme = 'dark';
        // } else {
        //     this.settings.theme = 'light';
        // }

        // this.settings.saveSettings();
    }
}