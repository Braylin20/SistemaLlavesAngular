import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CompraFactory} from '../../../factories/compra.factory';
import {Compra, ComprasDetalle} from '../../../Interfaces/compra';
import {CompraService} from '../../../services/compra.service';
import {ProductoService} from '../../../services/producto.service';
import {Proveedores} from '../../../Interfaces/proveedores';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Producto} from '../../../Interfaces/producto';
import {SelectItem} from 'primeng/api';
import {TableLazyLoadEvent} from 'primeng/table';
import {CategoriaService} from '../../../services/categoria.service';
import {Categorias} from '../../../Interfaces/categorias';


@Component({
  selector: 'app-registro-compra',
  standalone: false,

  templateUrl: './registro-compra.component.html',
  styleUrl: './registro-compra.component.css'
})
export class RegistroCompraComponent  implements OnInit {
  registroForm!: FormGroup;
  matchModeOptions?: SelectItem[];
  public descripcion: string = '';
  loading: boolean = false;
  public proveedores: Proveedores[] = [];
  public productos: Producto[] = [];
  public proximaCompraId: string = "";
  public virtualProducts?: Producto[];
  protected searchValue: string = '';
  public productosFiltrados: Producto[] = []
  public compra: Compra = CompraFactory.createDefault();
  public categorias : Categorias[] = [];

  AddCompraLoad() {
    this.loading = true;

    this.addCompra(this.compra)

    setTimeout(() => {
      this.loading = false
    }, 2000);
  }
  constructor(
    private readonly compraService: CompraService,
    private readonly productoService: ProductoService,
    private readonly categoriaService: CategoriaService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
  }
  ngOnInit() {
    this.getProveedores()
    this.compra.fecha.getTime();
    this.getCompras();
    this.getProductos();
    this.productosFiltrados = [...this.productos];
    this.getProductosConCategorias();
    this.registroForm = this.fb.group({
      fecha: ['', Validators.required],
      concepto: ['', Validators.required],
    })
    this.virtualProducts = Array(100).fill(null);

    this.getCategorias()
    setTimeout(() => {
      this.getProductosConCategorias();
    }, 500);

  }

  public getProductosConCategorias(): void {
    this.productoService.getProductos().subscribe((productos) => {
      this.productos = productos.map((producto) => {
        producto.categoria = this.categorias.find(cat => cat.categoriaId === producto.categoriaId) ;
        return producto;
      });
      this.productosFiltrados = [...this.productos];
      console.log('Productos con categorías asignadas:', this.productos);
    });
  }

  public getCategorias(): void {
    this.categoriaService.getCategorias().subscribe((categorias) => {
      this.categorias = categorias;
      console.log('Categorías cargadas:', this.categorias);
    });
  }
  public getProveedores() {
    this.productoService.getProveedores()
      .subscribe(proveedores => this.proveedores = proveedores);
  }
  public getProductos() {
    this.productoService.getProductos()
      .subscribe(productos => {this.productos = productos
        this.productosFiltrados = [...this.productos];
      });
  }
  public getCompras() {
    this.compraService.getCompras()
      .subscribe(compras => {
        const siguienteId = compras.length + 1;
        this.proximaCompraId = siguienteId.toString().padStart(5, '0');
      });
  }
  public addCompra(compra: Compra){
    this.compraService.addCompra(compra).subscribe(

    )
  }
  loadCarsLazy(event: TableLazyLoadEvent) {

    setTimeout(() => {

      const start = event.first ?? 0;
      const rows = event.rows ?? 10;
      const loadedCars = this.productos.slice(start, start + rows);
      this.virtualProducts?.splice(start, rows, ...loadedCars);
      if (event.forceUpdate) {
        event.forceUpdate();
      }
    }, Math.random() * 1000 + 250);
  }

  filtrarGlobal(value: string): void {
    const lowerValue = value.toLowerCase();
    this.productosFiltrados = this.productos.filter((producto) =>
      producto.productoId?.toString().includes(lowerValue) ||
      producto.nombre.toLowerCase().includes(lowerValue)
    );
  }
  recalcularTotales(): void {
    const subTotal = this.compra.comprasDetalles?.reduce(
      (suma, detalle) => suma + (detalle.producto.precio! * detalle.cantidad),
      0
    ) || 0;

    const itbis = this.compra.comprasDetalles?.reduce(
      (suma, detalle) => suma + (detalle.producto.precio! * detalle.cantidad * 0.18), // ITBIS del 18%
      0
    ) || 0;

    const total = subTotal + itbis
    this.compra.subtotal = parseFloat(subTotal.toFixed(2));
    this.compra.itbis = parseFloat(itbis.toFixed(2));
    this.compra.total = parseFloat(total.toFixed(2));
  }
  eliminarProducto(productoId: number): void {
    const detallesOriginales = this.compra.comprasDetalles || [];
    const detallesFiltrados = detallesOriginales.filter(
      detalle => detalle.productoId !== productoId
    );

    if (detallesFiltrados.length !== detallesOriginales.length) {
      this.compra.comprasDetalles = [...detallesFiltrados];
      console.log(`Producto con ID ${productoId} eliminado`);
      this.recalcularTotales();
    } else {
      console.warn(`Producto con ID ${productoId} no encontrado`);
    }
  }

  public calcularTotalItbis(producto: Producto): number {
    return parseFloat((producto.precio! * producto.cantidad! * 0.18).toFixed(2));
  }

  public compraDetalles: ComprasDetalle[] = [];
  public totalProducto: number = 0;
  onRowSelect(event: any): void {
    const productoSeleccionado = event.data;

    if (!this.compra.comprasDetalles) {
      this.compra.comprasDetalles = [];
    }

    // Verificar si el producto ya está en la lista
    const existe = this.compra.comprasDetalles.some(
      detalle => detalle.productoId === productoSeleccionado.productoId
    );

    if (!existe) {
      const cantidad = productoSeleccionado.cantidad || 1;
      const total = productoSeleccionado.precio * cantidad;
      const itbis = total * 0.18;

      this.compra.comprasDetalles = [
        ...this.compra.comprasDetalles,
        {
          compraDetalleId: 0,
          productoId: productoSeleccionado.productoId,
          compraId: 0,
          producto: productoSeleccionado,
          cantidad,
          total: 2,
        },
      ];

      console.log(`Producto con ID ${productoSeleccionado.productoId} agregado.`);
      this.recalcularTotales();
    } else {
      console.warn(`El producto con ID ${productoSeleccionado.productoId} ya existe en la lista.`);
    }
  }
}
