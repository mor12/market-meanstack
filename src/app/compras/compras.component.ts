import { IProduct } from './../interfaces/product';
import { ICategory } from './../interfaces/category';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../services/product.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import Swal from 'sweetalert2';
import { EmployeeService } from '../services/employee.service';
import { CompraService } from '../services/compra.service';
import { IEmployee } from '../interfaces/employee';
import { ICompra } from '../interfaces/compra';
import { CategoryService } from '../services/category.service';

@Component({
    selector: 'app-compras',
    templateUrl: './compras.component.html',
    styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {

    public product_list: IProduct[] = [];
    public filtered_produc_list: IProduct[] = [];
    public categoryList: ICategory[] = []
    public cart: IProduct[] = [];
    public total: number;
    public scannedId: any;
    public compraSelected = false;
    public employeeFinded = false;
    public employeeNotFound = true;
    public employeeSelected: IEmployee;
    public employee_list: IEmployee[] = [];
    public products_bu : IProduct[] = [];
    public search: string;
    public lottieConfigBag = {
        path: 'assets/animations/shop_bag.json',
        renderer: 'canvas',
        autoplay: true,
        loop: true,
    };
    public loading = false;;
    public lottieConfigScan = {
        path: 'assets/animations/scan.json',
        renderer: 'canvas',
        autoplay: true,
        loop: true,
    };
    @ViewChild('scanInput') scanElement: ElementRef;

    constructor(
        private productProvider: ProductService,
        public ngxSmartModalService: NgxSmartModalService,
        public employeeProvider: EmployeeService,
        public compraProvider: CompraService,
        private categoryProvider: CategoryService,
    ) {
        productProvider.get().subscribe(res => {
            this.product_list  = res;
            this.filtered_produc_list = res;
        });

        categoryProvider.get().subscribe(res => {
            this.categoryList = res;
        });

        employeeProvider.get().subscribe(res => {
            this.employee_list = res;
        });
     }

    ngOnInit() {

    }



    filter(id: string) {
        this.search = '';
        this.filtered_produc_list = this.product_list.filter(
            a => a.category._id === id
        );
    }

    searchFilter() {

        if (this.search !== '') { 
            this.filtered_produc_list = this.product_list.filter(
                a => a.name.toLowerCase().indexOf(this.search.toLowerCase()) >= 0
            );
        } else {
            this.filtered_produc_list = this.product_list;
        }

    }
    getALl() {
        this.filtered_produc_list = this.product_list;
    }
    getImage(name: string): string {
        return this.productProvider.getImage(name);
    }

    getImageEmployee(name: string): string {
        return this.employeeProvider.getImage(name);
    }

    addToCart(product: IProduct) {
        this.cart.push(product);
        this.total = this.cart.reduce((sum, item) => sum + item.price, 0);
    }

    removeFromCart(index: number) {
        this.cart.splice(index, 1);
        this.total = this.cart.reduce((sum, item) => sum + item.price, 0);
    }

    changedScanned() {
        if (this.scannedId !== '') {

            this.employeeSelected = this.employee_list.filter(
                e => e.qr_code === this.scannedId || e.ext == this.scannedId
            )[0];

            if (this.employeeSelected) {
                this.employeeFinded  = true;
            } else {
                this.employeeFinded = false;
            }
            // this.employeeProvider.getByQr(this.scannedId).subscribe(r => {
            //     if (r) {
            //         this.employeeFinded = true;
            //         this.employeeSelected = r;
            //     } else {
            //         this.employeeNotFound = true;
            //     }
            // }, err => {
            //     this.employeeNotFound = true;
            // });
        }
    }

    findEmployee() {
        this.employeeProvider.getByQr(this.scannedId).subscribe(r => {
            if (r) {
                this.employeeFinded = true;
                this.employeeSelected = r;
            } else {
                this.employeeNotFound = true;
            }
        }, err => {
            this.employeeNotFound = true;
        });
    }

    showDetail() {
        this.employeeNotFound = false;
        this.employeeFinded = false;
        this.scannedId = '';
        this.ngxSmartModalService.getModal('showDetailCompra').open();
        this.compraSelected = true;
         setTimeout(() => { // this will make the execution after the above boolean has changed
            this.scanElement.nativeElement.focus();
        }, 0);
    }

    completarPago() {
        const compra: ICompra = {};

        compra.products = this.cart;
        compra.total = this.total;
        compra.employee = this.employeeSelected._id;
        compra.user =  localStorage.getItem('u_id');
        this.loading = true;
        this.compraProvider.post(compra).subscribe(r => {
            this.loading = false;
            this.cart = [];
            this.ngxSmartModalService.getModal('showDetailCompra').close();
            Swal.fire({
                position: 'center',
                type: 'success',
                title: 'Compra Creada con exito',
                showConfirmButton: false,
                timer: 1500,
                animation: false,
                customClass: 'animated tada'
              });
        }, err => {
            this.ngxSmartModalService.getModal('showDetailCompra').close();
            Swal.fire({
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                type: 'error',
                title: 'Oops...',
                text: 'Error al guardar la compra!',
              });
        });
    }

    limpiar() {
        Swal.fire({
            title: 'Estas seguro?',
            text: 'si aceptas se limpiara el carrito de compra!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#02174c',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, delete it!',
            confirmButtonClass: 'btn btn-primary btn-round',
            cancelButtonClass: 'btn btn-primary btn-round',
          }).then((result) => {
            if (result.value) {
                this.cart  = [];
            }
          });
    }
}
