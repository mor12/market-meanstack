import { ICompra } from './../interfaces/compra';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';


@Injectable({
    providedIn: 'root',
})
export class ReportService {

    constructor(
        private globals: GlobalService,
        private http: HttpClient,
    ) { }

    private _pathEndpoint = `${this.globals.PATH}api/report`;

    getHistorialActual(cant: number): Observable<ICompra[]> {
        return this.http.get<ICompra[]>(`${this._pathEndpoint}/getHistorialActual/${cant}`);
    }

    stadisticsByEmployeeSchedule(date_init, date_finish) :Observable<any>{
        return this.http.get<any>(`${this._pathEndpoint}/stadisticsByEmployeeSchedule/${date_init}/${date_finish}`);
    }

    employeesSalesByHour(date_init, date_finish) :Observable<any>{
        return this.http.get<any>(`${this._pathEndpoint}/employeesSalesByHour/${date_init}/${date_finish}`);
    }

    getHistorialActualDateFilter(
        cant: number,
        date_init: Date,
        date_finish: Date
    ): Observable<ICompra[]> {
        return this.http.get<ICompra[]>(
            `${this._pathEndpoint}/getHistorialActualDateFilter/${cant}/${date_init}/${date_finish}`
        );
    }

    getHistorialActualDateFilterCash(
        cant: number,
        date_init: Date,
        date_finish: Date
    ): Observable<ICompra[]> {
        return this.http.get<ICompra[]>(
            `${this._pathEndpoint}/getHistorialActualDateFilterCash/${cant}/${date_init}/${date_finish}`
        );
    }

    getTotalCompra(): Observable<any> {
        return this.http.get<any>(`${this._pathEndpoint}/getTotalCompra`);
    }

    weekSalesReport(): Observable<any> {
        return this.http.get<any>(`${this._pathEndpoint}/weekSalesReport`);
    }

    getTotalCompraDateFilter(
        date_init: Date,
        date_finish: Date
    ): Observable<any> {
        return this.http.get<any>(
            `${this._pathEndpoint}/getTotalCompraDateFilter/${date_init}/${date_finish}`
        );
    }
    getTotalCompraCashDateFilter(
        date_init: Date,
        date_finish: Date
    ): Observable<any> {
        return this.http.get<any>(
            `${this._pathEndpoint}/getTotalCompraCashDateFilter/${date_init}/${date_finish}`
        );
    }
}
