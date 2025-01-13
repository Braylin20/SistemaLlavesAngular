import {Component, OnInit} from '@angular/core';
import {ProductoService} from '../../services/producto.service';
import {Categorias} from '../../Interfaces/categorias';
import {Subscription} from 'rxjs';
import {Proveedores} from '../../Interfaces/proveedores';

@Component({
  selector: 'llaves-registro-producto',
  standalone: false,

  templateUrl: './registro-producto.component.html',
})
export class RegistroProductoComponent implements OnInit{

  public categorias: Categorias[] = [];
  public proveedores: Proveedores[] = [];

  constructor(private productoService: ProductoService) {
  }
  ngOnInit() {
    this.getCategorias();
    this.getProveedores();
  }

  getCategorias() {
    this.productoService.getCategorias()
      .subscribe(categorias => this.categorias = categorias);
  }

  getProveedores() {
    this.productoService.getProveedores()
      .subscribe(proveedores => this.proveedores = proveedores);
  }
}
