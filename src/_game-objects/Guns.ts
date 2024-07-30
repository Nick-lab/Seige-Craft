import { getModuleFactory } from "@angular/core";

export class Guns {
    guns: Gun[] = [
        {
            name: 'm4a1',
            bullet_speed: 300,
            rpm: 600,
            mode: 'auto',
            select: ['semi','auto'],
            sound: 'rifle',
            zoom: .4,
            recoilAngle: 0,
            maxRecoil: 10,
            shootDelay: 0,
            rotation: 0,
            capacity: 30,
            magazine: 30,
            canShoot: true,
            display: {
                left:{
                    deg: 25,
                    dist: 0
                },
                right: {
                    deg: 3,
                    dist: 13
                },
                muzzle: {
                    deg: 0,
                    dist: 30
                }
            },
            muzzle: {
                x: 0,
                y: 0
            }
        },
        {
            name: 'mp5',
            bullet_speed: 270,
            rpm: 900,
            mode: 'auto',
            select: ['semi','auto', 3],
            sound: 'pistol',
            zoom: .2,
            recoilAngle: 0,
            maxRecoil: 20,
            shootDelay: 0,
            rotation: 0,
            capacity: 30,
            magazine: 30,
            canShoot: true,
            display: {
                left:{
                    deg: 20,
                    dist: 0
                },
                right: {
                    deg: 3,
                    dist: 10
                },
                muzzle: {
                    deg: 0,
                    dist: 17
                }
            },
            muzzle: {
                x: 0,
                y: 0
            }
        },
        {
            name: 'sks',
            bullet_speed: 500,
            rpm: 60,
            mode: 'semi',
            select: ['semi'],
            sound: 'rifle',
            zoom: .6,
            recoilAngle: 0,
            maxRecoil: 40,
            shootDelay: 0,
            rotation: 0,
            capacity: 6,
            magazine: 6,
            canShoot: true,
            display: {
                left:{
                    deg: 5,
                    dist: 0
                },
                right: {
                    deg: 3,
                    dist: 15
                },
                muzzle: {
                    deg: 2,
                    dist: 35
                }
            },
            muzzle: {
                x: 0,
                y: 0
            }
        }
    ];

    getGun(name: any, choose = false) {
        this.loadGuns();
        if (!choose) {
            for(let i = 0; i < this.guns.length; i++){
                let gun = this.guns[i];
                if( gun.name == name) {
                    console.log('get exact', gun);
                    return gun;
                }

                if( i == this.guns.length -1){
                    console.log('not found return first', this.guns[0]);
                    return this.guns[0];
                }
            }
            // let index = Object.keys(this.guns).indexOf(name);
            // if(index > -1){
            //     return this.guns[Object.keys(this.guns)[index]];
            // }
        } else {
            for(let i = 0; i < this.guns.length; i++){
                let gun = this.guns[i];
                if (gun.name == name) {
                    
                    if (i + 1 >= this.guns.length) {
                        console.log('get fist', this.guns[0]);
                        return this.guns[0];
                    } else {
                        console.log('get next', this.guns[i+1]);
                        return this.guns[i+1];
                    }
                }
            }
            // let at = Object.keys(this.guns).indexOf(name);
            // if(at + 1 >= Object.keys(this.guns).length){
            //     at = 0
            // }else{
            //     at += 1
            // }
            // return this.guns[Object.keys(this.guns)[at]];
        }
        return undefined;
    }

    loadGuns(){
        // load guns from json
    }
    
}

export interface Gun{
    name: string;
    bullet_speed: integer;
    rpm: number;
    mode: 'semi' | 'auto' | number,
    select: ('semi' | 'auto' | number)[],
    sound: string,
    zoom: number,
    recoilAngle: number,
    maxRecoil: number,
    shootDelay: number,
    rotation: number;
    capacity: number;
    magazine: number;
    canShoot: boolean;
    display: {
        left:{
            deg: number;
            dist: number;
        },
        right: {
            deg: number;
            dist: number;
        },
        muzzle: {
            deg: number;
            dist: number;
        }
    },
    muzzle: {
        x: number;
        y: number;
    }
}