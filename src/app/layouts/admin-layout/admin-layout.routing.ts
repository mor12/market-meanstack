import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { CategoriesComponent } from '../../categories/categories.component';
import { CombosComponent } from '../../combos/combos.component';
import { ComprasComponent } from '../../compras/compras.component';
import { EmployeeComponent } from '../../employees/employees.component';
import { ProductComponent } from '../../products/products.component';
import { AuthGuardAdmin } from '../../services/auth.guard';
import { ReporteGeneralComponent } from '../../reporte-general/reporte-general.component';
import { ComprasCashComponent } from '../../compras-cash/compras-cash.component';
import { ReporteGeneralCashComponent } from '../../reporte-general-cash/reporte-general-cash.component';
import { WalletComponent } from '../../wallet/wallet.component';
import { ComprasFreeComponent } from '../../compras-free/compras-free.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'categories',      component: CategoriesComponent, canActivate: [AuthGuardAdmin] },
    { path: 'wallet',          component: WalletComponent, canActivate: [AuthGuardAdmin] },
    { path: 'combos',          component: CombosComponent, canActivate: [AuthGuardAdmin] },
    { path: 'compras',         component: ComprasComponent, canActivate: [AuthGuardAdmin] },
    { path: 'compras-free',    component: ComprasFreeComponent, canActivate: [AuthGuardAdmin] },
    { path: 'employees',       component: EmployeeComponent, canActivate: [AuthGuardAdmin] },
    { path: 'products',        component: ProductComponent, canActivate: [AuthGuardAdmin] },
    { path: 'reporte-general', component: ReporteGeneralComponent, canActivate: [AuthGuardAdmin] },
    { path: 'reporte-general-cash', component: ReporteGeneralCashComponent, canActivate: [AuthGuardAdmin] },
    { path: 'compras-cash',    component: ComprasCashComponent, canActivate: [AuthGuardAdmin] },
    { path: 'dashboard',       component: DashboardComponent, canActivate: [AuthGuardAdmin] },
    { path: 'user-profile',    component: UserProfileComponent, canActivate: [AuthGuardAdmin] },
    { path: 'table-list',      component: TableListComponent, canActivate: [AuthGuardAdmin] },
    { path: 'typography',      component: TypographyComponent, canActivate: [AuthGuardAdmin] },
    { path: 'icons',           component: IconsComponent, canActivate: [AuthGuardAdmin] },
    { path: 'maps',            component: MapsComponent, canActivate: [AuthGuardAdmin] },
    { path: 'notifications',   component: NotificationsComponent, canActivate: [AuthGuardAdmin] },
    { path: 'upgrade',         component: UpgradeComponent, canActivate: [AuthGuardAdmin] }
];
