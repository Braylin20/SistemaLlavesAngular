import {Producto} from './producto';

export interface Compra {
  compraId: number;
  fecha: string;
  subtotal: number;
  itbis: number;
  total: number;
  comprasDetalles: ComprasDetalle[];

}

interface ComprasDetalle {
  compraDetalleId: number;
  productoId: number;
  compraId: number;
  producto: Producto;
  cantidad: number;
  total: number;
}


