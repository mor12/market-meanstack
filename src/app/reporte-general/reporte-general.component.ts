import { ReportService } from './../services/report.service';
import { OnInit, Component } from '@angular/core';
import { CompraService } from '../services/compra.service';
import { ICompra } from '../interfaces/compra';
import { EmployeeService } from '../services/employee.service';
import { ProductService } from '../services/product.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-reporte-general',
    templateUrl: './reporte-general.component.html',
    styleUrls: ['./reporte-general.component.scss']
})
export class ReporteGeneralComponent implements OnInit {

    public compras: ICompra[] = [];
    public global_total: number;
    public global_total_cash: number;
    public date_init: Date;
    public date_finish: Date;
    public date_init_filter: Date;
    public date_finish_filter: Date;
    public count = 10;
    public lottieConfig = {
        path: 'assets/animations/notfound.json',
        renderer: 'canvas',
        autoplay: true,
        loop: true,
    };

    constructor(
        private reportProvider: ReportService,
        private employeeProvider: EmployeeService,
        private productProvider: ProductService,
    ) {
        const date = new Date();
        if (date.getDate() > 14 &&
            date.getDate() < new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) {
            this.date_init = new Date(new Date(`${date.getMonth() + 1}/14/${date.getFullYear()}`).setHours(0));
            this.date_finish = new Date(new Date(date.getFullYear(), date.getMonth() + 1, 0).setHours(-1));
        } else {
            this.date_init = new Date(new Date(date.getFullYear(), date.getMonth() + 1, 0).setHours(1));
            this.date_finish = new Date(new Date(`${date.getMonth() + 2}/14/${date.getFullYear()}`).setHours(23));
        }

        this.date_init = new Date("2019-09-30T00:00:00");
        this.date_finish = new Date("2019-10-15T23:59:00");

        reportProvider.getHistorialActualDateFilter(
            this.count,
            this.date_init,
            this.date_finish
        ).subscribe(r => {
            this.compras = r;
        });

        reportProvider.getTotalCompraDateFilter(
            this.date_init,
            this.date_finish
        ).subscribe(r => {
            this.global_total = r[0].counter;
        });

        reportProvider.getTotalCompraCashDateFilter(
            this.date_init,
            this.date_finish
        ).subscribe(r => {
            this.global_total_cash = r[0].counter;
        });
    }

    ngOnInit(): void {

    }

    getImageProduct(name: string): string {
        return this.productProvider.getImage(name);
    }

    getImageEmployee(name: string): string {
        return this.employeeProvider.getImage(name);
    }

    onScroll() {
        this.count += 10;
        this.reportProvider.getHistorialActualDateFilter(this.count,
            this.date_init,
            this.date_finish).subscribe(r => {
            this.compras = r;
        });
    }

    applyFilter() {
        if (this.date_finish_filter < this.date_init_filter) {
            Swal.fire({
                position: 'top-end',
                type: 'error',
                title: 'La fecha final debe ser mayor o igual a la fecha de hoy',
                showConfirmButton: false,
                timer: 2000
              });
        } else {
            this.reportProvider.getHistorialActualDateFilter(
                this.count,
                this.date_init,
                this.date_finish
            ).subscribe(r => {
                this.compras = r;
            });

            this.reportProvider.getTotalCompraDateFilter(
                this.date_init,
                this.date_finish
            ).subscribe(r => {
                this.global_total = r[0].counter;
            });

            this.reportProvider.getTotalCompraCashDateFilter(
                this.date_init,
                this.date_finish
            ).subscribe(r => {
                this.global_total_cash = r[0].counter;
            });

        }
    }
}
