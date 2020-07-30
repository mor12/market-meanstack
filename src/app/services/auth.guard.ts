import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardAdmin implements CanActivate {
    constructor(
        private router: Router,
        private authProvider: LoginService
    ) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        try {
            return new Promise<boolean>((rs) => {
                const token = localStorage.getItem('token');
                if (token == null) {
                    rs(false);
                    this.router.navigate(['/login']);
                } else {
                    const uid = localStorage.getItem('u_id');
                    this.authProvider.validateToken(uid).subscribe(r => {
                        if (r) {
                            if ('rol' in r) {

                                if (r && r.rol === 'admin' || r.rol === 'super' || r.rol === 'common' || r.rol === 'chef') {
                                    rs(true);
                                    localStorage.setItem('utype', btoa(r.rol));
                                } else {
                                    rs(false);
                                    this.router.navigate(['/login']);
                                }
                            } else {
                                rs(false);
                                this.router.navigate(['/login']);
                            }
                        } else {
                            rs(false);
                            this.router.navigate(['/login']);
                        }
                    }, () => {
                        rs(false);
                        this.router.navigate(['/login']);
                    });
                }
            });
        } catch (ex) {
             // tslint:disable-next-line:no-console

            return new Promise<boolean>((rs) => {
                rs(false);
                this.router.navigate(['/login']);
            });
        }
    }
}
