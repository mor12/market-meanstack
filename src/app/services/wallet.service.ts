import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';
import { IWallet } from '../interfaces/wallet';

@Injectable({
    providedIn: 'root',
})
export class WalletService {

    constructor(
        private globals: GlobalService,
        private http: HttpClient,
    ) { }

    private _pathEndpoint = `${this.globals.PATH}api/wallet`;

    post(val: IWallet): Observable<IWallet> {
        return this.http.post<IWallet>(this._pathEndpoint, val);
    }
    put(val: IWallet): Observable<IWallet> {
        return this.http.put<IWallet>(this._pathEndpoint, val);
    }
    get(): Observable<IWallet[]> {
        return this.http.get<IWallet[]>(this._pathEndpoint);
    }
    delete(_id: string): Observable<IWallet> {
        return this.http.delete<IWallet>(`${this._pathEndpoint}/${_id}`);
    }
}
