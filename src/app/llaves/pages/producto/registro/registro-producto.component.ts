import {Component, OnInit} from '@angular/core';
import {ProductoService} from '../../../services/producto.service';
import {Categorias} from '../../../Interfaces/categorias';
import {Proveedores} from '../../../Interfaces/proveedores';
import {Garantias} from '../../../Interfaces/garantias';
import {MessageProducto, Producto} from '../../../Interfaces/producto';
import {MessageService} from 'primeng/api';
import {MessageProductoFactory, ProductFactory} from '../../../factories/product.factory';

@Component({
  selector: 'llaves-producto',
  standalone: false,

  templateUrl: './registro-producto.component.html',
  providers: [MessageService]
})
export class RegistroProductoComponent implements OnInit {

  public producto: Producto = ProductFactory.createDefault()
  public message: MessageProducto = MessageProductoFactory.createDefault()


  public categorias: Categorias[] = [];
  public proveedores: Proveedores[] = [];
  public garantias: Garantias[] = [];
  public classValidation = ''

  constructor(
    private readonly productoService: ProductoService,
    private readonly messageService: MessageService
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
    if(!this.cantidadValida())
      productoValido = false;
    if(!this.itbisValido())
      productoValido = false;
    if(!this.descuentoValido())
      productoValido = false;
    if(!this.categoriaValida())
      productoValido = false;
    if(!this.proveedorValido())
      productoValido = false;
    if(!this.garantiaValida())
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
      return false
    }
    return true;
  }

  public cantidadValida(): boolean{
    if(!this.producto.cantidad){
      this.message.errorCantidad = 'Debe llenar este campo';
      return false;
    }
    if(this.producto.cantidad < 1 || this.producto.cantidad > 100){
      this.message.errorCantidad = 'El valor debe se mayor a 1';
      return false;
    }
    return true;
  }

  public itbisValido(): boolean{
    if(!this.producto.itbis){
      this.message.errorItbis = 'Debe llenar este campo';
      return false;
    }
    if(this.producto.itbis < 0 || this.producto.itbis > 18){
      this.message.errorItbis = 'Debe ser válido';
    }
    return true;
  }

  public descuentoValido(): boolean{
    if(!this.producto.descuento){
      this.message.errorDescuento = 'Debe llenar este campo';
      return false;
    }
    if(this.producto.descuento < 0){
      this.message.errorDescuento = 'No puede ser menor a 0';
      return false;
    }
    if(this.producto.descuento > 1000){
      this.message.errorDescuento = 'No puede ser mayor a 1000';
      return false;
    }
    if(this.producto.descuento > (this.producto.costo ?? 0)){
      this.message.errorDescuento = 'No puede ser mayor al costo';
    }
    return true;
  }

  public categoriaValida(): boolean{
    if(!this.producto.categoriaId){
      this.message.errorCategoria = 'Debe llenar este campo';
      return false;
    }
    return true;
  }

  public proveedorValido(): boolean{
    if(!this.producto.proveedorId){
      this.message.errorProveedor = 'Debe llenar este campo';
      return false;
    }
    return true;
  }

  public garantiaValida(): boolean{
    if(!this.producto.garantiaId){
      this.message.errorGarantia = 'Debe llenar este campo';
      return false;
    }
    return true;
  }
}
