import { ICompra } from './../interfaces/compra';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';
import { IEmployee } from '../interfaces/employee';
import { Response } from '../interfaces/response';

@Injectable({
    providedIn: 'root',
})
export class EmployeeService {

    constructor(
        private globals: GlobalService,
        private http: HttpClient,
    ) { }

    private _pathEndpoint = `${this.globals.PATH}api/employee`;

    post(val: IEmployee): Observable<IEmployee> {
        return this.http.post<IEmployee>(this._pathEndpoint, val);
    }
    put(val: IEmployee): Observable<IEmployee> {
        return this.http.put<IEmployee>(this._pathEndpoint, val);
    }
    get(): Observable<IEmployee[]> {
        return this.http.get<IEmployee[]>(this._pathEndpoint);
    }
    delete(_id: string): Observable<IEmployee> {
        return this.http.delete<IEmployee>(`${this._pathEndpoint}/${_id}`);
    }
    saveImage(file: File): Observable<Response> {
        const f: FormData = new FormData;
        f.append('employee', file);
        return this.http.post<Response>(`${this._pathEndpoint}/image`, f);
    }
    getImage(name: string): string {
        return `${this.globals.PATH}file/img:e/${name}`;
    }
    getById(_id: string): Observable<IEmployee> {
        return this.http.get<IEmployee>(`${this._pathEndpoint}/${_id}`);
    }
    getByQr(qr: string): Observable<IEmployee> {
        return this.http.get<IEmployee>(`${this._pathEndpoint}/qr/${qr}`);
    }
    getComprasActual(_id: string): Observable<ICompra[]> {
        return this.http.get<ICompra[]>(`${this._pathEndpoint}/getComprasActual/${_id}`);
    }
    getComprasActualFilterDate(
        _id: string,
        date_init: Date,
        date_finish: Date
    ): Observable<ICompra[]> {
        return this.http.get<ICompra[]>(
            `${this._pathEndpoint}/getComprasActualFilter/${_id}/${date_init}/${date_finish}`
        );
    }
}
