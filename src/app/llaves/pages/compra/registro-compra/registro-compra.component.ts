import {Component, OnInit} from '@angular/core';
import {CompraFactory} from '../../../factories/compra.factory';
import {Compra} from '../../../Interfaces/compra';
import {CompraService} from '../../../services/compra.service';
import {ProductoService} from '../../../services/producto.service';
import {Proveedores} from '../../../Interfaces/proveedores';

@Component({
  selector: 'app-registro-compra',
  standalone: false,

  templateUrl: './registro-compra.component.html',
  styleUrl: './registro-compra.component.css'
})
export class RegistroCompraComponent  implements OnInit {

  public descripcion: string = '';
  loading: boolean = false;
  public proveedores: Proveedores[] = [];
  public compras: Compra[] = [];
  public proximaCompraId: number = 0;

  load() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false
    }, 2000);
  }
  public compra: Compra = CompraFactory.createDefault();

  constructor(private readonly compraService: CompraService, private readonly productoService: ProductoService) {

  }
  ngOnInit() {
    this.getProveedores()
    this.compra.fecha.getTime();
    this.getCompras()
  }
  public getProveedores() {
    this.productoService.getProveedores()
      .subscribe(proveedores => this.proveedores = proveedores);
  }

  public getCompras(){
    this.compraService.getCompras()
      .subscribe(compras => {
        this.proximaCompraId = (compras.length) + 1;
      });
  }


}
