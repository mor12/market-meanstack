import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public loginForm: FormGroup;
    constructor(
        private _form: FormBuilder,
        private loginProvider: LoginService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loginForm = this._form.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    login(): void {
        if (this.loginForm.valid) {
            this.loginProvider.login(this.loginForm.value).subscribe(r => {
                if (r.token) {
                    localStorage.setItem('token', r.token);
                    localStorage.setItem('user', JSON.stringify(r.user));
                    localStorage.setItem('u_id', r.user._id);
                    localStorage.setItem('utype', btoa(r.user.rol));
                    this.router.navigate(['/categories']);
                } else {

                }
            });
        }
    }
}
