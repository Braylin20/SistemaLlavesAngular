import {Producto} from './producto';

export interface Compra {
  compraId: number;
  fecha: Date;
  subtotal: number;
  itbis: number;
  total: number;
  comprasDetalles: ComprasDetalle[] | null;
  loading: boolean;

}

interface ComprasDetalle {
  compraDetalleId: number;
  productoId: number;
  compraId: number;
  producto: Producto;
  cantidad: number;
  total: number;
}


