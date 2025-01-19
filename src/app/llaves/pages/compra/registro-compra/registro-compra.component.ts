import {Component, OnInit} from '@angular/core';
import {CompraFactory} from '../../../factories/compra.factory';
import {Compra} from '../../../Interfaces/compra';
import {CompraService} from '../../../services/compra.service';
import {ProductoService} from '../../../services/producto.service';
import {Proveedores} from '../../../Interfaces/proveedores';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Producto} from '../../../Interfaces/producto';

@Component({
  selector: 'app-registro-compra',
  standalone: false,

  templateUrl: './registro-compra.component.html',
  styleUrl: './registro-compra.component.css'
})
export class RegistroCompraComponent  implements OnInit {
  registroForm!: FormGroup;

  public descripcion: string = '';
  loading: boolean = false;
  public proveedores: Proveedores[] = [];
  public productos: Producto[] = [];
  public proximaCompraId: string = "";

  load() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false
    }, 2000);
  }
  public compra: Compra = CompraFactory.createDefault();

  constructor(
    private readonly compraService: CompraService,
    private readonly productoService: ProductoService,
    private fb: FormBuilder
  ) {

  }
  ngOnInit() {
    this.getProveedores()
    this.compra.fecha.getTime();
    this.getCompras();
    this.getProductos();

    this.registroForm = this.fb.group({
      fecha: ['', Validators.required],
      concepto: ['', Validators.required],
    })
  }
  public getProveedores() {
    this.productoService.getProveedores()
      .subscribe(proveedores => this.proveedores = proveedores);
  }

  public getProductos() {
    this.productoService.getProductos()
      .subscribe(productos => this.productos = productos);
  }

  public getCompras() {
    this.compraService.getCompras()
      .subscribe(compras => {
        const siguienteId = compras.length + 1;
        this.proximaCompraId = siguienteId.toString().padStart(5, '0');
      });
  }


}
