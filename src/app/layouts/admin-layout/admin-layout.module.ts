import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { CategoriesComponent } from '../../categories/categories.component';
import { CombosComponent } from '../../combos/combos.component';
import { ComprasComponent } from '../../compras/compras.component';
import { EmployeeComponent } from '../../employees/employees.component';
import { ProductComponent } from '../../products/products.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { LottieAnimationViewModule } from 'ng-lottie';
import { QRCodeModule } from 'angular2-qrcode';
import { ReporteGeneralComponent } from '../../reporte-general/reporte-general.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ComprasCashComponent } from '../../compras-cash/compras-cash.component';
import { ReporteGeneralCashComponent } from '../../reporte-general-cash/reporte-general-cash.component';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { WalletComponent } from '../../wallet/wallet.component';
import { ComprasFreeComponent } from '../../compras-free/compras-free.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    NgbModule,
    ToastrModule.forRoot(),
    NgxSmartModalModule.forRoot(),
    LottieAnimationViewModule.forRoot(),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
    }),
    QRCodeModule,
    InfiniteScrollModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  declarations: [
    CategoriesComponent,
    CombosComponent,
    ComprasComponent,
    ComprasCashComponent,
    ComprasFreeComponent,
    EmployeeComponent,
    ProductComponent,
    ReporteGeneralComponent,
    ReporteGeneralCashComponent,
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    WalletComponent
  ]
})

export class AdminLayoutModule {}
