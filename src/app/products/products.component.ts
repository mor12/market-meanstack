import { Component, OnInit } from '@angular/core';
import { IProduct } from '../interfaces/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ProductService } from '../services/product.service';
import Swal from 'sweetalert2';
import { CategoryService } from '../services/category.service';
import { ICategory } from '../interfaces/category';


@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductComponent implements OnInit {

    public product_list: IProduct[] = [];
    public category_list: ICategory[] = [];
    public create_form: FormGroup;
    public update_form: FormGroup;
    public temporal_image: File = null;
    public imageSrc: string | ArrayBuffer;
    public lottieConfig = {
        path: 'assets/animations/notfound.json',
        renderer: 'canvas',
        autoplay: true,
        loop: true,
    };

    constructor(
        public ngxSmartModalService: NgxSmartModalService,
        private _form: FormBuilder,
        private productProvider: ProductService,
        private categoriaProvider: CategoryService,
    ) {
        // init formulario create
        this.create_form = _form.group({
            name: ['', Validators.required],
            category: ['', Validators.required],
            price: ['', Validators.required],
            quantity: [''],
            image_path: [''],
            description: [''],
        });

        this.update_form = _form.group({
            name: ['', Validators.required],
            category: ['', Validators.required],
            price: ['', Validators.required],
            quantity: [''],
            image_path: [''],
            description: [''],
        });

        categoriaProvider.get().subscribe(res => {
            this.category_list = res;
        });

        this.getProducts();
     }

    ngOnInit() {

    }

     // Get all products
     private getProducts() {
        this.productProvider.get().subscribe(res => {
            this.product_list = res;
        });
    }

    editar(product: IProduct) {
        this.update_form = this._form.group({
            _id: [product._id],
            name: [product.name, Validators.required],
            category: [product.category, Validators.required],
            price: [product.price, Validators.required],
            quantity: [product.quantity],
            image_path: [product.image_path],
            description: [product.description],
        });

        this.ngxSmartModalService.getModal('editModal').open();

        this.getProducts();
    }

    update() {
        if (this.update_form.valid) {

                this.productProvider.put(
                    this.update_form.value
                ).subscribe(res => {
                    this.ngxSmartModalService.getModal('editModal').close();
                    Swal.fire({
                        position: 'top-end',
                        type: 'success',
                        title: 'Producto editado con exito',
                        showConfirmButton: false,
                        timer: 1500
                      });
                    this.getProducts();
                });

        }
    }

    // Delete product
    delete(_id: string) {

        Swal.fire({
            title: 'Estas seguro?',
            text: 'si eliminas este producto eliminaras los combos en los que el aparece!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) {
                this.productProvider.delete(_id).subscribe(r => {
                    Swal.fire({
                        position: 'top-end',
                        type: 'success',
                        title: 'Producto eliminado con exito',
                        showConfirmButton: false,
                        timer: 1500
                      });
                    this.getProducts();
                });
            }
          });
    }

    // Creeate product
    create() {

        if (this.create_form.valid) {

            this.productProvider.saveProductImage(this.temporal_image).subscribe(uploadR => {

                this.create_form.controls['image_path'].setValue(uploadR.imageName);

                this.productProvider.post(
                    this.create_form.value
                ).subscribe(res => {
                    this.ngxSmartModalService.getModal('createModal').close();
                    Swal.fire({
                        position: 'top-end',
                        type: 'success',
                        title: 'Producto Creado con exito',
                        showConfirmButton: false,
                        timer: 1500
                      });
                    this.getProducts();
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
        return this.productProvider.getImage(name);
    }

}
