import { ICompra } from './../interfaces/compra';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IEmployee } from '../interfaces/employee';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { EmployeeService } from '../services/employee.service';
import Swal from 'sweetalert2';
import { ProductService } from '../services/product.service';

@Component({
    selector: 'app-employees',
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.scss']
})
export class EmployeeComponent implements OnInit {

    public employee_list_bu: IEmployee[] = [];
    public employee_list: IEmployee[] = [];
    public create_form: FormGroup;
    public temporal_image: File = null;
    public imageSrc: string | ArrayBuffer;
    public employeeSelected: IEmployee;
    public compras: ICompra[] = [];
    public mime_qr: any;
    public total_compra: number;
    public search: string;
    public date_init;
    public date_finish;
    public employeeEditId = "";
    public lottieConfig = {
        path: 'assets/animations/notfound.json',
        renderer: 'canvas',
        autoplay: true,
        loop: true,
    };
    public code_erp_edit = '';

    constructor(
        public ngxSmartModalService: NgxSmartModalService,
        private _form: FormBuilder,
        private employeeProvider: EmployeeService,
        private productProvider: ProductService,
    ) {

        const date = new Date();
        if (date.getDate() > 14 &&
            date.getDate() < new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) {
            this.date_init = new Date(new Date(`${date.getMonth() + 1}/15/${date.getFullYear()}`).setHours(0));
            this.date_finish = new Date(new Date(date.getFullYear(), date.getMonth() + 1, 0).setHours(-1));
        } else {
            this.date_init = new Date(new Date(date.getFullYear(), date.getMonth() , 0).setHours(1));
            this.date_finish = new Date(new Date(`${date.getMonth() + 1}/14/${date.getFullYear()}`).setHours(23));
        }

        this.date_init = new Date("2019-09-30T00:00:00");
        this.date_finish = new Date("2019-10-15T23:59:00");

        // init formulario create
        this.create_form = _form.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            ext: ['', Validators.required],
            image_path: [''],
        });

        this.getEmployees();
    }

    ngOnInit() {

    }

     // Get all employees
     private getEmployees() {
        this.employeeProvider.get().subscribe(res => {
            this.employee_list = res;
            this.employee_list_bu = res;
        });
    }

    showQR(employee: IEmployee) {
        this.compras = [];
        this.employeeSelected = employee;
        this.ngxSmartModalService.getModal('qrModal').open();
        this.employeeProvider.getComprasActualFilterDate(
            employee._id,
            this.date_init,
            this.date_finish
        ).subscribe(r => {
            this.compras = r;
            this.total_compra = this.compras.reduce((total, c) => total + c.total, 0);
        })
    }

    searchFilter() {

        if (this.search !== '') {
            this.employee_list = this.employee_list_bu.filter(
                e => e.name.toLowerCase().indexOf(this.search.toLowerCase()) >= 0
            );
        } else {
            this.employee_list = this.employee_list_bu;
        }

    }

    // Delete product
    delete(_id: string) {

        Swal.fire({
            title: 'Estas seguro?',
            text: 'si eliminas este empleado eliminaras todos sus registros!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) {
                this.employeeProvider.delete(_id).subscribe(r => {
                    Swal.fire({
                        position: 'top-end',
                        type: 'success',
                        title: 'Producto eliminado con exito',
                        showConfirmButton: false,
                        timer: 1500
                      });
                    this.getEmployees();
                });
            }
          });
    }

    edit_erp(id) {
        this.employeeEditId = id;
        this.ngxSmartModalService.getModal('erpModal').open();

    }

    saveErp() {
        this.employeeProvider.put({
            _id: this.employeeEditId,
            code_erp: this.code_erp_edit
        }).subscribe(res => {
            Swal.fire({
                position: 'top-end',
                type: 'success',
                title: 'Empleado editado con exito',
                showConfirmButton: false,
                timer: 1500
              });
            this.getEmployees();
        this.ngxSmartModalService.getModal('erpModal').close();

        })
    }
    // Creeate product
    create() {

        if (this.create_form.valid) {

            this.employeeProvider.saveImage(this.temporal_image).subscribe(uploadR => {

                this.create_form.controls['image_path'].setValue(uploadR.imageName);

                this.employeeProvider.post(
                    this.create_form.value
                ).subscribe(res => {
                    this.ngxSmartModalService.getModal('createModal').close();
                    Swal.fire({
                        position: 'top-end',
                        type: 'success',
                        title: 'Empleado Creado con exito',
                        showConfirmButton: false,
                        timer: 1500
                      });
                    this.getEmployees();
                });
            }, err => {
                this.ngxSmartModalService.getModal('createModal').close();

                Swal.fire({
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    type: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                  });
            });

        }
    }

    changeFile(evento: any) {
        this.temporal_image = <File>evento.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.imageSrc = reader.result;

        reader.readAsDataURL(this.temporal_image);
        console.log(this.temporal_image);
    }

    getImage(name: string): string {
        return this.employeeProvider.getImage(name);
    }

    getImageProduct(name: string): string {
        return this.productProvider.getImage(name);
    }
    getDetail(employee: IEmployee) {
        this.employeeSelected = employee;
        this.ngxSmartModalService.getModal('detailEmployee').open();
    }
}
