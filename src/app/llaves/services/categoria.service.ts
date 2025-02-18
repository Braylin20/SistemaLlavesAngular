import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Categorias} from '../Interfaces/categorias';
import {Observable} from 'rxjs';
import {apiUrl} from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private readonly httpClient: HttpClient) { }


  public getCategoriabyId(id: number): Observable<Categorias> {
    return this.httpClient.get<Categorias>(`${apiUrl}/categorias/${id}`)
  }

  public getCategorias(): Observable<Categorias[]> {
    return this.httpClient.get<Categorias[]>(`${apiUrl}/categorias`);
  }
}
