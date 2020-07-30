import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';
import { ICompra } from '../interfaces/compra';

@Injectable({
    providedIn: 'root',
})
export class CompraFreeService {

    constructor(
        private globals: GlobalService,
        private http: HttpClient,
    ) { }

    private _pathEndpoint = `${this.globals.PATH}api/comprafree`;

    post(val: ICompra): Observable<ICompra> {
        return this.http.post<ICompra>(this._pathEndpoint, val);
    }
    put(val: ICompra): Observable<ICompra> {
        return this.http.put<ICompra>(this._pathEndpoint, val);
    }
    get(): Observable<ICompra[]> {
        return this.http.get<ICompra[]>(this._pathEndpoint);
    }
    delete(_id: string): Observable<ICompra> {
        return this.http.delete<ICompra>(`${this._pathEndpoint}/${_id}`);
    }
}
