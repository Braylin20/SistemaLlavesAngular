import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CompraFactory} from '../../../factories/compra.factory';
import {Compra, ComprasDetalle} from '../../../Interfaces/compra';
import {CompraService} from '../../../services/compra.service';
import {ProductoService} from '../../../services/producto.service';
import {Proveedores} from '../../../Interfaces/proveedores';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Producto} from '../../../Interfaces/producto';

import {TableLazyLoadEvent} from 'primeng/table';
import {CategoriaService} from '../../../services/categoria.service';
import {Categorias} from '../../../Interfaces/categorias';

import {ValidatorService} from '../../../validators/validator.service';


@Component({
  selector: 'app-registro-compra',
  standalone: false,

  templateUrl: './registro-compra.component.html',
  styleUrl: './registro-compra.component.css'
})
export class RegistroCompraComponent implements OnInit {
  registroForm!: FormGroup;
  loading: boolean = false;
  public proveedores: Proveedores[] = [];
  public productos: Producto[] = [];
  public proximaCompraId: string = "";
  public virtualProducts?: Producto[];
  protected searchValue: string = '';
  public productosFiltrados: Producto[] = []
  public compra: Compra = CompraFactory.createDefault();
  public categorias: Categorias[] = [];


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
      compraId: [0],
      fecha: [new Date(), Validators.required],
      concepto: [''],
      subTotal: [{value: 0, disabled: true}],
      itbis: [{value: 0, disabled: true}],
      total: [{value: 0, disabled: true}],
      comprasDetalle: this.fb.array([], this.minLengthArray(1)),
      proovedorId: [null, Validators.required],

    })
    this.virtualProducts = Array(100).fill(null);

    this.getCategorias()
    setTimeout(() => {
      this.getProductosConCategorias();
    }, 500);

  }

  public get compraDetalle() {
    return this.registroForm.get('comprasDetalle') as FormArray;
  }

  public actualizarProducto(): void {
    const detalles = this.compraDetalle.controls;

    detalles.forEach((detalle) => {
      const productoActualizado: Producto = {
        ...detalle.value.producto,
        cantidad: detalle.value.cantidad, // Nueva cantidad
        costo: detalle.value.producto.costo, // Actualiza el costo si es necesario
        precio: detalle.value.producto.precio, // Actualiza el precio si es necesario
      };

      this.productoService.updateProducto(productoActualizado.productoId, productoActualizado).subscribe({
        next: () => console.log(`Producto ${productoActualizado.productoId} actualizado correctamente`),
        error: (err) => console.error(`Error al actualizar el producto ${productoActualizado.productoId}:`, err),
      });
    });
  }
  public minLengthArray(minLength: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const array = control.value as Array<any>;
      if (!array || array.length < minLength) {
        return { minLengthArray: { requiredLength: minLength, actualLength: array?.length || 0 } };
      }
      return null;
    };
  }

  public getFecha() {
    const hoy = new Date();
    return hoy.toISOString().split('.')[0] + 'Z';
  }

  public addCompraLoad() {
    console.log('Validando objeto de compra antes de enviar:', this.registroForm.value);

    this.registroForm.markAllAsTouched();

    if (this.registroForm.invalid) {
      console.warn('Formulario inválido.');
      return;
    }

    // Crear objeto de compra
    const compra = this.currentCompra();

    // Guardar la compra en el backend
    this.addCompra(compra);

    // Actualizar productos en el backend
    this.actualizarProducto();
  }

  public currentCompra(): Compra {
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
        producto.categoria = this.categorias.find(cat => cat.categoriaId === producto.categoriaId);
        return producto;
      });
      this.productosFiltrados = [...this.productos];
      console.log('Productos con categorías asignadas:', this.productos);
    });
  }

  public validaDetalle(){
    return this.registroForm.get('comprasDetalle')?.invalid && this.registroForm.get('comprasDetalle')?.touched
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
      .subscribe(productos => {
        this.productos = productos
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

  public addCompra(compra: Compra) {
    this.compraService.addCompra(compra).subscribe(compra => {
     if(compra) {
       this.registroForm.reset()
     }
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

  public recalcularTotales(): void {
    const comprasDetalleArray = this.compraDetalle;

    let subTotal = 0;
    let itbisTotal = 0;

    comprasDetalleArray.controls.forEach((control) => {
      const cantidad = control.value.cantidad || 0;
      const costo = control.value.costo || 0;
      const precio = control.value.precio || 0;

      // Calcular ITBIS y Total
      const itbis = precio * cantidad * 0.18;
      const total = precio * cantidad + itbis;

      // Actualizar valores calculados en el FormGroup
      control.patchValue({
        itbis: parseFloat(itbis.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      }, { emitEvent: false }); // Evitar bucles infinitos

      subTotal += precio * cantidad;
      itbisTotal += itbis;
    });

    const totalGeneral = subTotal + itbisTotal;

    // Actualiza los totales en el formulario principal
    this.registroForm.patchValue({
      subTotal: parseFloat(subTotal.toFixed(2)),
      itbis: parseFloat(itbisTotal.toFixed(2)),
      total: parseFloat(totalGeneral.toFixed(2)),
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

    // Verifica si ya existe el producto en el detalle
    if (this.compraDetalle.controls.some(control => control.value.productoId === productoSeleccionado.productoId)) {
      console.warn('El producto ya está en el detalle.');
      return;
    }

    // Inicializa los valores de los campos
    const cantidad = 1;
    const costo = productoSeleccionado.costo || 0;
    const precio = productoSeleccionado.precio || 0;

    // Calcula el total inicial
    const itbis = precio * cantidad * 0.18;
    const total = precio * cantidad + itbis;

    // Agrega el producto como FormGroup al FormArray
    const detalleFormGroup = this.fb.group({
      compraDetalleId: [0],
      productoId: [productoSeleccionado.productoId],
      producto: [productoSeleccionado], // Solo para referencia en la vista
      cantidad: [cantidad, Validators.required],
      costo: [costo, Validators.required],
      precio: [precio, Validators.required],
      itbis: [parseFloat(itbis.toFixed(2))], // Calculado
      total: [parseFloat(total.toFixed(2))], // Calculado
    });

    // Escucha los cambios en los campos para recalcular valores
    detalleFormGroup.get('cantidad')?.valueChanges.subscribe(() => this.recalcularTotales());
    detalleFormGroup.get('costo')?.valueChanges.subscribe(() => this.recalcularTotales());
    detalleFormGroup.get('precio')?.valueChanges.subscribe(() => this.recalcularTotales());

    this.compraDetalle.push(detalleFormGroup);
    this.recalcularTotales();
  }

}
