import {Component, OnInit} from '@angular/core';
import {ProductoService} from '../../services/producto.service';
import {Categorias} from '../../Interfaces/categorias';
import {Proveedores} from '../../Interfaces/proveedores';
import {Garantias} from '../../Interfaces/garantias';
import {Producto} from '../../Interfaces/producto';

@Component({
  selector: 'llaves-registro-producto',
  standalone: false,

  templateUrl: './registro-producto.component.html',
})
export class RegistroProductoComponent implements OnInit{

  public producto: Producto = {
    productoId : 0,
    nombre : '',
    precio :null,
    costo:null,
    cantidad:null,
    itbis:null,
    descuento:null,
    descripcion:'',
    categoriaId:null,
    proveedorId:null,
    garantiaId:null,
  };
  public categorias: Categorias[] = [];
  public proveedores: Proveedores[] = [];
  public garantias: Garantias[] = [];
  public message: string = ''
  constructor(private productoService: ProductoService) {
  }
  ngOnInit() {
    this.getCategorias();
    this.getProveedores();
    this.getGarantias();
  }

  addProducto() {
    this.productoService.addProducto(this.producto)
      .subscribe()
  }

  getCategorias() {
    this.productoService.getCategorias()
      .subscribe(categorias => this.categorias = categorias);
  }

  getProveedores() {
    this.productoService.getProveedores()
      .subscribe(proveedores => this.proveedores = proveedores);
  }

  getGarantias(){
    this.productoService.getGarantias()
      .subscribe(garantias => this.garantias = garantias);
  }
}
