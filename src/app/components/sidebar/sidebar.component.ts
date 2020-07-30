import { Component, OnInit } from '@angular/core';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/categories', title: 'Categoria de productos',  icon: 'icon-Categoria-de-Productos', class: '' },
  { path: '/products', title: 'Productos',  icon: 'icon-Productos', class: '' },
  // { path: '/combos', title: 'Combos',  icon: 'icon-Combos', class: '' },
  { path: '/compras', title: 'Compras',  icon: 'icon-Compras', class: '' },
  { path: '/compras-cash', title: 'Compras cash',  icon: 'icon-Compras', class: '' },
  { path: '/compras-free', title: 'Compras free',  icon: 'icon-Compras', class: '' },
  { path: '/employees', title: 'Empleados',  icon: 'icon-Empleados', class: '' },
  { path: '/reporte-general', title: 'Reporte General',  icon: 'icon-Reporte-de-Compras', class: '' },
  { path: '/reporte-general-cash', title: 'Reporte Cash',  icon: 'icon-Reporte-de-Compras', class: '' },

    { path: '/dashboard', title: 'Dashboard',  icon: 'design_app', class: '' },
    { path: '/wallet', title: 'Wallet',  icon: 'business_money-coins', class: 'business_money-coins' },
    // { path: '/icons', title: 'Icons',  icon: 'education_atom', class: '' },
    // { path: '/maps', title: 'Maps',  icon: 'location_map-big', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon: 'ui-1_bell-53', class: '' },
    // { path: '/user-profile', title: 'User Profile',  icon: 'users_single-02', class: '' },
    // { path: '/table-list', title: 'Table List',  icon: 'design_bullet-list-67', class: '' },
    // { path: '/typography', title: 'Typography',  icon: 'text_caps-small', class: '' },

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  }
}
