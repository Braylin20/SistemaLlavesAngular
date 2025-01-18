import {Compra} from '../Interfaces/compra';


export class CompraFactory{
  static createDefault(): Compra {
    return {
      compraId:0,
      itbis: 0,
      fecha: new Date,
      subtotal: 0,
      total: 0,
      comprasDetalles: null,
      loading: false
    }
  }
}
