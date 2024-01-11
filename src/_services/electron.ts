import { Injectable } from "@angular/core";
declare var electronAPI: ElectronAPI;

@Injectable()
export class ElectronProvider {
    
    window_title: string = `Roguelike`;

    constructor() {
        
    }

    isFullScreen: boolean = false
    
    minimizeWindow() {
        electronAPI.minimizeWindow();
    }

    maximizeWindow() {
        electronAPI.maximizeWindow();
        this.isFullScreen = true;
    }
    unmaximizeWindow() {
        electronAPI.unmaximizeWindow();
        this.isFullScreen = false;
    }

    updateAvailable() {
        console.log('update available');
        
        electronAPI.updateAvailable();
    }

    closeWindow() {
        electronAPI.closeWindow();
    }
    
}

export interface ElectronAPI {
    isMaxamized: boolean;
    minimizeWindow: () => void;
    maximizeWindow: () => void;
    unmaximizeWindow: () => void;
    closeWindow: () => void;
    updateAvailable: () => void;
}
