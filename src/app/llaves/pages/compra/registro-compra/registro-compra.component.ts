import { Component, OnInit} from '@angular/core';
import {CompraFactory} from '../../../factories/compra.factory';
import {Compra} from '../../../Interfaces/compra';
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
  public registroForm!: FormGroup;
  loading: boolean = false;
  public proveedores: Proveedores[] = [];
  public productos: Producto[] = [];
  public proximaCompraId: string = "";
  public virtualProducts?: Producto[];
  protected searchValue: string = '';
  public productosFiltrados: Producto[] = []
  public compra: Compra = CompraFactory.createDefault();
  public categorias: Categorias[] = [];


  constructor(
    private readonly compraService: CompraService,
    private readonly productoService: ProductoService,
    private readonly categoriaService: CategoriaService,
    private readonly fb: FormBuilder,
    private readonly validatorService: ValidatorService,
  ) {
  }

  ngOnInit() {

    this.getProveedores()
    this.getCompras();
    this.getProductos();
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


  public minLengthArray(minLength: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const array = control.value as Array<any>;
      if (!array || array.length < minLength) {
        return { minLengthArray: { requiredLength: minLength, actualLength: array?.length || 0 } };
      }
      return null;
    };
  }


  public addCompraLoad(): void {
    console.log('Validando objeto de compra antes de enviar:', this.registroForm.value);

    this.registroForm.markAllAsTouched();

    if (this.registroForm.invalid) {
      console.warn('El formulario es inválido:', this.registroForm.errors);
      return;
    }
    const {total} = this.currentCompra();
    console.log('Objeto de compra listo para enviar:', total);
    const productosActualizados = this.compraDetalle.controls.map(control => {
      const producto = control.value.producto;
      return this.productoService.updateProducto(control.value.productoId, {
        ...producto,
        cantidad: producto.cantidad + control.value.cantidad,
        costo: control.value.costo,
        precio: control.value.precio,
      }).toPromise();
    });

    Promise.all(productosActualizados)
      .then(() => {
        console.log('Todos los productos actualizados correctamente.');
        this.addCompra(this.currentCompra());
        this.resetForm();
        this.getCompras();
        this.getProductos();

      })
      .catch(error => {
        console.error('Error al actualizar los productos:', error);
      });
  }

  private resetForm(): void {
    this.siguienteCompraId += 1;
    this.proximaCompraId = this.siguienteCompraId.toString().padStart(5, '0');

    this.registroForm.reset({
      compraId: this.siguienteCompraId,
      fecha: new Date(),
      concepto: '',
      subTotal: 0,
      itbis: 0,
      total: 0,
      comprasDetalle: [],
      proovedorId: null,
    });

    this.compraDetalle.clear();
    this.registroForm.markAsPristine();
    this.registroForm.markAsUntouched();

    console.log('Formulario reseteado correctamente. Nueva compra ID:', this.proximaCompraId);
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
      ...this.registroForm.value,
      comprasDetalles: compraDetalles,
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

  public siguienteCompraId: number = 0;
  public getCompras() {
    this.compraService.getCompras().subscribe(compras => {
      this.siguienteCompraId = compras.length + 1;
      this.proximaCompraId = this.siguienteCompraId.toString().padStart(5, '0');
      console.log('Próxima compra ID actualizada:', this.proximaCompraId);
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
    },2000);
  }

  filtrarGlobal(value: string): void {
    const lowerValue = value.toLowerCase();
    this.productosFiltrados = this.productos.filter((producto) =>
      producto.productoId?.toString().includes(lowerValue) ||
      producto.nombre.toLowerCase().includes(lowerValue)
    );
  }

  recalcularTotales(): void {
    const comprasDetalleArray = this.compraDetalle;
    const subTotal = comprasDetalleArray.controls.reduce(
      (suma, control) => suma + (control.value.costo * control.value.cantidad),
      0
    );
    const itbis = comprasDetalleArray.controls.reduce(
      (suma, control) => suma + (control.value.cantidad * control.value.precio * 0.18 ), // ITBIS del 18%
      0
    );
    const total = subTotal + itbis;
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
  calcularDetalle(detalle: AbstractControl): void {
    const cantidad = detalle.get('cantidad')?.value || 0;
    const precio = detalle.get('precio')?.value || 0;

    const itbisProducto = precio  * 0.18; // ITBIS del 18%
    const total = precio * cantidad + itbisProducto;

    detalle.patchValue({
      itbis: parseFloat(itbisProducto.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    }, { emitEvent: false }); // Evitar bucles infinitos
  }
  onRowSelect(event: any): void {
    const productoSeleccionado = event.data;

    const comprasDetalleArray = this.registroForm.get('comprasDetalle') as FormArray;

    const existe = comprasDetalleArray.controls.some(control => control.value.productoId === productoSeleccionado.productoId);

    if (!existe) {
      const cantidad = 1;
      const precio = productoSeleccionado.precio;
      const costo = productoSeleccionado.costo;
      const total = parseFloat(((precio * cantidad) + (precio * cantidad * 0.18)).toFixed(2));

      const detalleFormGroup = this.fb.group({
        productoId: [productoSeleccionado.productoId, Validators.required],
        producto: [productoSeleccionado],
        cantidad: [cantidad, [Validators.required, Validators.min(1)]],
        costo: [costo, Validators.required],
        precio: [precio, Validators.required],
        itbis: [0], // Calculado automáticamente
        total: [total], // Calculado automáticamente
      });
      detalleFormGroup.get('cantidad')?.valueChanges.subscribe(() => {
        this.calcularDetalle(detalleFormGroup);
        this.recalcularTotales();
      });
      detalleFormGroup.get('costo')?.valueChanges.subscribe(() => {
        this.calcularDetalle(detalleFormGroup);
        this.recalcularTotales();
      });
      detalleFormGroup.get('precio')?.valueChanges.subscribe(() => {
        this.calcularDetalle(detalleFormGroup);
        this.recalcularTotales();
      });

      comprasDetalleArray.push(detalleFormGroup);
      this.calcularDetalle(detalleFormGroup);
      this.recalcularTotales();

      console.log(`Producto con ID ${productoSeleccionado.productoId} agregado.`);
    } else {
      console.warn(`El producto con ID ${productoSeleccionado.productoId} ya existe en el detalle.`);
    }
  }

}
