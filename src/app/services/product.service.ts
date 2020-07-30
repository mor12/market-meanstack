import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';
import { IProduct } from '../interfaces/product';
import { Response } from '../interfaces/response';

@Injectable({
    providedIn: 'root',
})
export class ProductService {

    constructor(
        private globals: GlobalService,
        private http: HttpClient,
    ) { }

    private _pathEndpoint = `${this.globals.PATH}api/product`;

    post(val: IProduct): Observable<IProduct> {
        return this.http.post<IProduct>(this._pathEndpoint, val);
    }
    put(val: IProduct): Observable<IProduct> {
        return this.http.put<IProduct>(this._pathEndpoint, val);
    }
    get(): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(this._pathEndpoint);
    }
    delete(_id: string): Observable<IProduct> {
        return this.http.delete<IProduct>(`${this._pathEndpoint}/${_id}`);
    }
    saveProductImage(file: File): Observable<Response> {
        const f: FormData = new FormData;
        f.append('product', file);
        return this.http.post<Response>(`${this._pathEndpoint}/image`, f);
    }
    getImage(name: string): string {
        return `${this.globals.PATH}file/img:p/${name}`;
    }
}
