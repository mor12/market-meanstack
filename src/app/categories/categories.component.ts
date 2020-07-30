import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ICategory } from '../interfaces/category';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../services/category.service';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

    public category_list: ICategory[] = [];
    public create_form: FormGroup;
    public edit_form: FormGroup;
    public lottieConfig = {
        path: 'assets/animations/notfound.json',
        renderer: 'canvas',
        autoplay: true,
        loop: true,
    };

    constructor(
        public ngxSmartModalService: NgxSmartModalService,
        private _form: FormBuilder,
        private categoryProvider: CategoryService,
    ) {

        // init formulario create
        this.create_form = _form.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            available_time: ['', Validators.required],
        });

        this.edit_form = _form.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            available_time: ['', Validators.required],
        });

        // Get categories
        this.getCategories();
     }

    ngOnInit() {

    }

     // Get all categories
     private getCategories() {
        this.categoryProvider.get().subscribe(res => {
            this.category_list = res;
        });
    }

    editar(category: ICategory) {

        this.edit_form = this._form.group({
            _id: [category._id],
            name: [category.name, Validators.required],
            description: [category.description, Validators.required],
            available_time: [category.available_time, Validators.required],
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
                this.categoryProvider.delete(_id).subscribe(r => {
                    Swal.fire({
                        position: 'top-end',
                        type: 'success',
                        title: 'Categoria Eliminada con exito',
                        showConfirmButton: false,
                        timer: 1500
                      });
                    this.getCategories();
                });
            }
          });
    }

    // Creeate category
    create() {

        if (this.create_form.valid) {

            this.categoryProvider.post(
                this.create_form.value
            ).subscribe(res => {
                this.ngxSmartModalService.getModal('createModal').close();
                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: 'Categoria Creada con exito',
                    showConfirmButton: false,
                    timer: 1500
                  });
                this.getCategories();
            });
            console.log(this.create_form.value);
        }
    }

    update() {

        if (this.edit_form.valid) {
            this.categoryProvider.put(
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
                this.getCategories();
            })
        }
    }

}
