import {Component, inject, OnInit} from '@angular/core';
import {ProductoService} from '../../../services/producto.service';
import {Categorias} from '../../../Interfaces/categorias';
import {Proveedores} from '../../../Interfaces/proveedores';
import {Garantias} from '../../../Interfaces/garantias';
import {MessageProducto, Producto} from '../../../Interfaces/producto';
import {MessageService} from 'primeng/api';
import {MessageProductoFactory} from '../../../factories/product.factory';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidatorService} from '../../../validators/validator.service';

@Component({
  selector: 'llaves-producto',
  standalone: false,

  templateUrl: './registro-producto.component.html',
  providers: [MessageService]
})
export class RegistroProductoComponent implements OnInit {


  public formBuilder = inject(FormBuilder)
  public message: MessageProducto = MessageProductoFactory.createDefault()


  public categorias: Categorias[] = [];
  public proveedores: Proveedores[] = [];
  public garantias: Garantias[] = [];
  public classValidation = 'ng-dirty ng-invalid'

  constructor(
    private readonly productoService: ProductoService,
    private readonly messageService: MessageService,
    private readonly validatorService: ValidatorService,
  ) {
  }

  public productoForm!: FormGroup;

  ngOnInit() {
    this.getCategorias();
    this.getProveedores();
    this.getGarantias();
    this.productoForm = this.formBuilder.group({
      productoId: [0],
      nombre: ['', [Validators.required]],
      precio: [null, [Validators.required, Validators.max(100000)]],
      costo: [null, [Validators.required]],
      cantidad: [null, [Validators.required, Validators.max(100000)]],
      itbis: [18, [ Validators.max(18)]],
      descuento: [null,[Validators.required, Validators.max(100)]],
      descripcion: [''],
      categoriaId: [null,[Validators.required]],
      proveedorId: [null,[Validators.required]],
      garantiaId: [null,[Validators.required]],
      loading: [null],
    }, {
      validators: [
        this.validatorService.isCostoFewerPrecio('precio', 'costo')
      ]
    })
  }

  public showSuccess() {
    this.messageService.add({severity: 'success', summary: 'Éxito', detail: this.message.message});
  }

  public get currentProducto(): Producto {
    return this.productoForm.value as Producto;
  }

  public onSubmit() {
    if (this.productoForm.invalid) return;

    this.productoService.addProducto(this.currentProducto)
      .subscribe((prodcuto) => {
        if(prodcuto){
          this.showSuccess();
          this.productoForm.reset()
        }
      });

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

  public isNotValidField(field: string) {
    return this.validatorService.isNotValidField(this.productoForm, field);
  }

  public hasMaxError(field: string) {
    return this.validatorService.hasMaxError(this.productoForm, field);
  }

  public isCostoHigherPrecio(field: string) {
    return this.productoForm.get(field)?.hasError('isHigher')
  }
}
