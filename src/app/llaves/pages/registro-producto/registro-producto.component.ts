import {Component, OnInit} from '@angular/core';
import {ProductoService} from '../../services/producto.service';
import {Categorias} from '../../Interfaces/categorias';
import {Proveedores} from '../../Interfaces/proveedores';
import {Garantias} from '../../Interfaces/garantias';
import {MessageProducto, Producto} from '../../Interfaces/producto';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'llaves-registro-producto',
  standalone: false,

  templateUrl: './registro-producto.component.html',
  providers: [MessageService]
})
export class RegistroProductoComponent implements OnInit {

  public producto: Producto = {
    productoId: 0,
    nombre: '',
    precio: null,
    costo: null,
    cantidad: null,
    itbis: null,
    descuento: null,
    descripcion: '',
    categoriaId: null,
    proveedorId: null,
    garantiaId: null,
    loading: false
  };
  public message: MessageProducto = {
    errorNombre: '',
    errorGarantia: '',
    errorCantidad: '',
    errorCategoria: '',
    errorItbis: '',
    errorDescripcion: '',
    errorDescuento: '',
    errorPrecio: '',
    errorProveedor: '',
    errorCosto: '',
    message: ''
  };
  public categorias: Categorias[] = [];
  public proveedores: Proveedores[] = [];
  public garantias: Garantias[] = [];
  public classValidation = ''

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.getCategorias();
    this.getProveedores();
    this.getGarantias();
  }

  public showSuccess() {
    this.messageService.add({severity: 'success', summary: 'Éxito', detail: this.message.message});
  }



  public addProducto() {
    if (!this.productoValido()) {
      this.classValidation ='ng-invalid ng-dirty'
      return;
    }
    this.producto.loading = true
    this.productoService.addProducto(this.producto)
      .subscribe(producto => {
        if (producto) {
          this.nuevo()
          this.message.message = 'Agregado Correctamente'
          this.showSuccess()
        }
      })
  }

  public getCategorias() {
    this.productoService.getCategorias()
      .subscribe(categorias => this.categorias = categorias);
  }

  public getProveedores() {
    this.productoService.getProveedores()
      .subscribe(proveedores => this.proveedores = proveedores);
  }

  public getGarantias() {
    this.productoService.getGarantias()
      .subscribe(garantias => this.garantias = garantias);
  }

  public nuevo(): void {
    this.producto = {
      nombre: '',
      precio: null,
      loading: false,
      descripcion: '',
      categoriaId: null,
      garantiaId: null,
      proveedorId: null,
      costo: null,
      itbis: null,
      descuento: null,
      cantidad: null,
    }
  }
  public productoValido(): boolean {
    let productoValido = true;
    if(!this.nombreValido())
      productoValido = false;
    if(!this.precioValido())
      productoValido = false;
    if(!this.costoValido())
      productoValido = false;
    return productoValido
  }

  public nombreValido(): boolean {
    if (!this.producto.nombre){
      this.message.errorNombre = 'Debe llenar este campo';
      return false;
    }
    if (this.producto.nombre.length < 5){
      this.message.errorNombre = 'Escriba un nombre valido';
      return false;
    }
    return true;

  }

  public precioValido(): boolean{
    if(!this.producto.precio){
      this.message.errorPrecio = 'Debe llenar este campo';
      return false;
    }
    if(this.producto.precio < 0 || this.producto.precio > 50000){
      this.message.errorPrecio = 'Valor no valido';
      return false;
    }
    return true;
  }

  public costoValido(): boolean{
    if(!this.producto.costo){
      this.message.errorCosto = 'Debe llenar este campo';
      return false;
    }
    if(this.producto.costo < 0 || this.producto.costo > 50000){
      this.message.errorPrecio = 'Valor no valido';
      return false;
    }
    if(this.producto.costo > (this.producto.precio ?? 0)){
      this.message.errorCosto = 'Costo debe ser menor al precio'
    }
    return true;
  }
}
