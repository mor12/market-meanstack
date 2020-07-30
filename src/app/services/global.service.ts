import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    constructor() { }
    // private _API_PATH_DEV = "http://35.202.78.81/";
    private _API_PATH_DEV = 'http://localhost:8080/';
    private _API_PATH_PROD = '/';

    get PATH() {
        if (environment.production) { return this._API_PATH_PROD; }
        return this._API_PATH_DEV;
    }
}
