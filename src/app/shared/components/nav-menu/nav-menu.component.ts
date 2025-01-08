import { Component } from '@angular/core';

@Component({
  selector: 'shared-nav-menu',
  standalone: false,

  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent {

  public submenus: { [key: string]: boolean } = {
    productos: false,
    ventas: false,
    compras: false,
  };

  toggleSubmenu(menu: string): void {
    this.submenus[menu] = !this.submenus[menu];
  }
}
