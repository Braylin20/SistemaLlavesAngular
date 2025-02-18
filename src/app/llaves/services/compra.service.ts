import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Compra} from '../Interfaces/compra';
import {Observable} from 'rxjs';
import {apiUrl} from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  constructor(private readonly httpClient: HttpClient) {
  }
  addCompra(compra: Compra): Observable<Compra>{
    return this.httpClient.post<Compra>(`${apiUrl}/compras`, compra);
  }

  getCompras(): Observable<Compra[]> {
    return this.httpClient.get<Compra[]>(`${apiUrl}/compras`);
  }

}
