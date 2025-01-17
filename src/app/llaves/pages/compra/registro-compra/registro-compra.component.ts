import { Component } from '@angular/core';

@Component({
  selector: 'app-registro-compra',
  standalone: false,

  templateUrl: './registro-compra.component.html',
  styleUrl: './registro-compra.component.css'
})
export class RegistroCompraComponent {

  public descripcion: string = '';
  loading: boolean = false;

  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false
    }, 2000);
  }
}
