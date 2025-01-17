
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
  categoriaId: number;
  proveedorId: number;
  garantiaId: number;
  cantidad: number;
  total: number;
}


