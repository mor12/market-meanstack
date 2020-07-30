import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';
import { ICombo } from '../interfaces/combo';

@Injectable({
    providedIn: 'root',
})
export class ComboService {

    constructor(
        private globals: GlobalService,
        private http: HttpClient,
    ) { }

    private _pathEndpoint = `${this.globals.PATH}api/combo`;

    post(val: ICombo): Observable<ICombo> {
        return this.http.post<ICombo>(this._pathEndpoint, val);
    }
    put(val: ICombo): Observable<ICombo> {
        return this.http.put<ICombo>(this._pathEndpoint, val);
    }
    get(): Observable<ICombo[]> {
        return this.http.get<ICombo[]>(this._pathEndpoint);
    }
    delete(_id: string): Observable<ICombo> {
        return this.http.delete<ICombo>(`${this._pathEndpoint}/${_id}`);
    }
}
