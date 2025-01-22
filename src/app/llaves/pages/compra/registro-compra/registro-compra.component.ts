import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CompraFactory} from '../../../factories/compra.factory';
import {Compra, ComprasDetalle} from '../../../Interfaces/compra';
import {CompraService} from '../../../services/compra.service';
import {ProductoService} from '../../../services/producto.service';
import {Proveedores} from '../../../Interfaces/proveedores';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Producto} from '../../../Interfaces/producto';
import {SelectItem} from 'primeng/api';
import {TableLazyLoadEvent} from 'primeng/table';
import {CategoriaService} from '../../../services/categoria.service';
import {Categorias} from '../../../Interfaces/categorias';
import {catchError} from 'rxjs';
import {ValidatorService} from '../../../validators/validator.service';


@Component({
  selector: 'app-registro-compra',
  standalone: false,

  templateUrl: './registro-compra.component.html',
  styleUrl: './registro-compra.component.css'
})
export class RegistroCompraComponent  implements OnInit {
  registroForm!: FormGroup;
  loading: boolean = false;
  public proveedores: Proveedores[] = [];
  public productos: Producto[] = [];
  public proximaCompraId: string = "";
  public virtualProducts?: Producto[];
  protected searchValue: string = '';
  public productosFiltrados: Producto[] = []
  public compra: Compra = CompraFactory.createDefault();
  public categorias : Categorias[] = [];


  public time = new Date()
  constructor(
    private readonly compraService: CompraService,
    private readonly productoService: ProductoService,
    private readonly categoriaService: CategoriaService,
    private fb: FormBuilder,
    private readonly validatorService: ValidatorService,
  ) {
  }
  ngOnInit() {

    this.getProveedores()
    this.getCompras();
    this.getProductos();
    this.compra.fecha.getTime();
    this.productosFiltrados = [...this.productos];
    this.getProductosConCategorias();

    this.registroForm = this.fb.group({
      compraId:[0],
      fecha: [new Date(), Validators.required],
      concepto: [''],
      subTotal: [{ value: 0, disabled: true }],
      itbis:  [{ value: 0, disabled: true }],
      total: [{ value: 0, disabled: true }],
      comprasDetalle: this.fb.array([]),
      proovedorId: [null, Validators.required],

    })
    this.virtualProducts = Array(100).fill(null);

    this.getCategorias()
    setTimeout(() => {
      this.getProductosConCategorias();
    }, 500);

  }

  public get compraDetalle(){
    return this.registroForm.get('comprasDetalle') as FormArray;
  }



  public getFecha() {
    const hoy = new Date();
    return hoy.toISOString().split('.')[0] + 'Z';
  }
  public addCompraLoad() {
    console.log('Validando objeto de compra antes de enviar:', this.registroForm.value);
    this.addCompra(this.currentCompra());
  }
  public currentCompra():Compra{
    const compraDetalles = this.compraDetalle.controls.map(control => ({
      compraDetalleId: control.value.compraDetalleId,
      productoId: control.value.productoId,
      compraId: this.registroForm.value.compraId,
      cantidad: control.value.cantidad,
      total: control.value.total,
    }));

    return {
      ...this.registroForm.value, // Incluye los valores principales del formulario
      comprasDetalles: compraDetalles, // Agrega el detalle mapeado
    } as Compra;
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
    this.compraService.addCompra(compra).subscribe(compra => {
      this.compra = compra
      console.log(compra)
    });
  }

  public isNotValidField(field: string) {
    return this.validatorService.isNotValidField(this.registroForm, field);
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
    const comprasDetalleArray = this.registroForm.get('comprasDetalle') as FormArray;

    const subTotal = comprasDetalleArray.controls.reduce(
      (suma, control) => suma + (control.value.producto.precio * control.value.cantidad),
      0
    );
    const itbis = comprasDetalleArray.controls.reduce(
      (suma, control) => suma + (control.value.producto.precio * control.value.cantidad * 0.18), // ITBIS del 18%
      0
    );
    const total = subTotal + itbis;

    // Actualiza los totales en el formulario
    this.registroForm.patchValue({
      subTotal: parseFloat(subTotal.toFixed(2)),
      itbis: parseFloat(itbis.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    });
  }

  public eliminarProducto(productoId: number): void {
    const comprasDetalleArray = this.compraDetalle;

    const index = comprasDetalleArray.controls.findIndex(
      control => control.value.productoId === productoId
    );

    if (index !== -1) {
      comprasDetalleArray.removeAt(index);
      this.recalcularTotales();
      console.log(`Producto con ID ${productoId} eliminado del detalle.`);
    } else {
      console.warn(`Producto con ID ${productoId} no encontrado en el detalle.`);
    }
  }
  onRowSelect(event: any): void {
    const productoSeleccionado = event.data;

    // Obtén el FormArray desde el FormGroup
    const comprasDetalleArray = this.registroForm.get('comprasDetalle') as FormArray;

    // Verifica si el producto ya está en el FormArray
    const existe = comprasDetalleArray.controls.some(control => control.value.productoId === productoSeleccionado.productoId);

    if (!existe) {
      // Calcula el total inicial para el producto seleccionado
      const cantidad = 1;
      const precio = productoSeleccionado.precio;
      const total = parseFloat(((precio * cantidad) + (precio * cantidad * 0.18)).toFixed(2));

      // Crea un nuevo FormGroup para el producto seleccionado
      const detalleFormGroup = this.fb.group({
        compraDetalleId: [0],
        productoId: [productoSeleccionado.productoId],
        producto: [productoSeleccionado], // Solo para la vista
        cantidad: [cantidad, Validators.required],
        total: [total], // Total inicial calculado
      });

      // Agrega el FormGroup al FormArray
      comprasDetalleArray.push(detalleFormGroup);

      console.log(`Producto con ID ${productoSeleccionado.productoId} agregado.`);

      // Recalcula los totales generales
      this.recalcularTotales();
    } else {
      console.warn(`El producto con ID ${productoSeleccionado.productoId} ya existe en el detalle.`);
    }
  }

}
