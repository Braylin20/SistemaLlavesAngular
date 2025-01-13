import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Categorias} from '../Interfaces/categorias';
import {apiUrl} from '../utils/utils';
import {Proveedores} from '../Interfaces/proveedores';

@Injectable({
  providedIn: 'root'
})
export class ProductoService implements OnInit {

  constructor(private httpClient: HttpClient) {
    this.getCategorias()
  }

  ngOnInit() {
    this.getCategorias();
  }

  getCategorias(): Observable<Categorias[]> {
     return this.httpClient.get<Categorias[]>(`${apiUrl}/categorias`)
  }

  getProveedores(): Observable<Proveedores[]> {
    return this.httpClient.get<Proveedores[]>(`${apiUrl}/proveedores`)
  }
}
