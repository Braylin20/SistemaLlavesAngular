import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Compra} from '../Interfaces/compra';
import {Observable} from 'rxjs';
import {apiUrl} from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class CompraServiceService implements OnInit {

  constructor(private readonly httpClient: HttpClient) {

  }
  ngOnInit() {

  }
  addCompra(compra: Compra): Observable<Compra>{
    return this.httpClient.post<Compra>(`${apiUrl}/compras`, compra);
  }

}
