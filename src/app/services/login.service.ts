import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';
import { IUser } from '../interfaces/user';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(
        private http: HttpClient,
        private globals: GlobalService
    ) { }

    login(data: any): Observable<any> {
        return this.http.post(`${this.globals.PATH}auth/login`, {
            email: data.email,
            password: data.password
        });
    }

    validateToken(_id: string): Observable<IUser> {
        return this.http.get<IUser>(`${this.globals.PATH}api/user/${_id}`);
    }
}
