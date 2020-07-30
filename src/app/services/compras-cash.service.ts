import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';
import { ICompraCash } from '../interfaces/compra-cash';

@Injectable({
    providedIn: 'root',
})
export class CompraCashService {

    constructor(
        private globals: GlobalService,
        private http: HttpClient,
    ) { }

    private _pathEndpoint = `${this.globals.PATH}api/compracash`;

    post(val: ICompraCash): Observable<ICompraCash> {
        return this.http.post<ICompraCash>(this._pathEndpoint, val);
    }
    put(val: ICompraCash): Observable<ICompraCash> {
        return this.http.put<ICompraCash>(this._pathEndpoint, val);
    }
    get(): Observable<ICompraCash[]> {
        return this.http.get<ICompraCash[]>(this._pathEndpoint);
    }
    delete(_id: string): Observable<ICompraCash> {
        return this.http.delete<ICompraCash>(`${this._pathEndpoint}/${_id}`);
    }
}
