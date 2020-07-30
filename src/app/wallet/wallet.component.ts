import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IWallet } from '../interfaces/wallet';
import { WalletService } from '../services/wallet.service';


@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

    public wallet_list: IWallet[] = [];
    public create_form: FormGroup;
    public edit_form: FormGroup;
    public saldo: any = 0;
    public lottieConfig = {
        path: 'assets/animations/notfound.json',
        renderer: 'canvas',
        autoplay: true,
        loop: true,
    };

    constructor(
        public ngxSmartModalService: NgxSmartModalService,
        private _form: FormBuilder,
        private walletProvider: WalletService,
    ) {

        this.create_form = _form.group({
            type: ['', Validators.required],
            quantity: ['', Validators.required],
            after: [''],
            before: [''],
            reason: ['', Validators.required],
        });

        this.edit_form = _form.group({
            _id: [''],
            type: ['', Validators.required],
            quantity: ['', Validators.required],
            after: [''],
            before: [''],
            reason: ['', Validators.required],
        });

        // Get categories
        this.getDetails();
     }

    ngOnInit() {

    }

     // Get all categories
     private getDetails() {
        this.walletProvider.get().subscribe(res => {
            this.wallet_list = res;
            this.saldo = this.wallet_list[0].before;
            console.log( this.wallet_list[0].before );
        });
    }

    editar(wallet: IWallet) {

        this.edit_form = this._form.group({
            _id: [wallet._id],
            type: [wallet.type, Validators.required],
            quantity: [wallet.quantity, Validators.required],
            after: [wallet.after, Validators.required],
            before: [wallet.before, Validators.required],
            reason: [wallet.reason, Validators.required],
        });

        this.ngxSmartModalService.getModal('editModal').open();
    }
    // Delete Category
    delete(_id: string) {

        Swal.fire({
            title: 'Estas seguro?',
            text: 'si eliminas esta categoria se eliminaran los productos relacionada a ella!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) {
                this.walletProvider.delete(_id).subscribe(r => {
                    Swal.fire({
                        position: 'top-end',
                        type: 'success',
                        title: 'Categoria Eliminada con exito',
                        showConfirmButton: false,
                        timer: 1500
                      });
                    this.getDetails();
                });
            }
          });
    }

    // Creeate category
    create() {

        if (this.create_form.valid) {
            let after = 0;
            let before = 0;
            if (this.create_form.controls['type'].value == "entrada") {
                before = this.wallet_list[0] ? this.wallet_list[0].before + this.create_form.controls['quantity'].value  : 0 + this.create_form.controls['quantity'].value  ;
                after = this.wallet_list[0] ? this.wallet_list[0].before : 0;
            } else {
                before = this.wallet_list[0] ? this.wallet_list[0].before - this.create_form.controls['quantity'].value  : 0 - this.create_form.controls['quantity'].value  ;
                after = this.wallet_list[0] ? this.wallet_list[0].before : 0;
            }
            this.saldo = before.toFixed(2)
            this.create_form.controls['after'].setValue(after.toFixed(2))
            this.create_form.controls['before'].setValue(before.toFixed(2))
            this.walletProvider.post(
                this.create_form.value
            ).subscribe(res => {
                this.ngxSmartModalService.getModal('createModal').close();
                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: 'Registro Creado con exito',
                    showConfirmButton: false,
                    timer: 1500
                  });
                this.getDetails();
            });
            console.log(this.create_form.value);
        }
    }

    update() {

        if (this.edit_form.valid) {
            this.walletProvider.put(
                this.edit_form.value
            ).subscribe(r => {
                this.ngxSmartModalService.getModal('editModal').close();
                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: 'Categoria Editada con exito',
                    showConfirmButton: false,
                    timer: 1500
                  });
                this.getDetails();
            })
        }
    }

}
