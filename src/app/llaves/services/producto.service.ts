import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Categorias} from '../Interfaces/categorias';
import {apiUrl} from '../utils/utils';
import {Proveedores} from '../Interfaces/proveedores';
import {Garantias} from '../Interfaces/garantias';
import {Producto} from '../Interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService implements OnInit {

  constructor(private readonly httpClient: HttpClient) {
    this.getCategorias()
  }

  ngOnInit() {
    this.getCategorias();
    this.getProductos();
  }

  addProducto(producto: Producto): Observable<Producto> {
    return this.httpClient.post<Producto>(`${apiUrl}/productos`, producto)
  }

  getCategorias(): Observable<Categorias[]> {
     return this.httpClient.get<Categorias[]>(`${apiUrl}/categorias`)
  }

  getProveedores(): Observable<Proveedores[]> {
    return this.httpClient.get<Proveedores[]>(`${apiUrl}/proveedores`)
  }
  getGarantias(): Observable<Garantias[]> {
    return this.httpClient.get<Garantias[]>(`${apiUrl}/garantias`)
  }

  getProductos(): Observable<Producto[]> {
    return this.httpClient.get<Producto[]>(`${apiUrl}/productos`)
  }
}
