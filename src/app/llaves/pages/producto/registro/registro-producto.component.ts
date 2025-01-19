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
    public classValidation = ''

    constructor(
        private readonly productoService: ProductoService,
        private readonly messageService: MessageService,
        private readonly validatorService: ValidatorService,
    ) {
    }

    public productoForm: FormGroup = this.formBuilder.group({
        productoId: [0],
        nombre: ['', [Validators.required, Validators.minLength(8)]],
        precio: [0],
        costo: [0],
        cantidad: [0],
        itbis: [0],
        descuento: [0],
        descripcion: [''],
        categoriaId: [0],
        proveedorId: [0],
        garantiaId: [0],
        loading: [0],
    })
    ngOnInit() {
        this.getCategorias();
        this.getProveedores();
        this.getGarantias();
    }

    public showSuccess() {
        this.messageService.add({severity: 'success', summary: 'Éxito', detail: this.message.message});
    }

    public get currentProducto(): Producto {
        return this.productoForm.value as unknown as Producto;
    }

    public onSubmit() {
        if (this.productoForm.invalid) return;

        this.productoService.addProducto(this.currentProducto)
            .subscribe(() => {
                this.message.message = 'Agregado Correctamente';
                this.showSuccess();
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


    public isNotValidFiel(field: string){
      return this.validatorService.isNotValidField(this.productoForm, field);
    }

}
