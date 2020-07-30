import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';
import { ICategory } from '../interfaces/category';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {

    constructor(
        private globals: GlobalService,
        private http: HttpClient,
    ) { }

    private _pathEndpoint = `${this.globals.PATH}api/category`;

    post(val: ICategory): Observable<ICategory> {
        return this.http.post<ICategory>(this._pathEndpoint, val);
    }
    put(val: ICategory): Observable<ICategory> {
        return this.http.put<ICategory>(this._pathEndpoint, val);
    }
    get(): Observable<ICategory[]> {
        return this.http.get<ICategory[]>(this._pathEndpoint);
    }
    delete(_id: string): Observable<ICategory> {
        return this.http.delete<ICategory>(`${this._pathEndpoint}/${_id}`);
    }
}
