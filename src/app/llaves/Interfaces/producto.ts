

export interface Producto {
  productoId?: number;
  nombre: string ;
  precio?: number | null;
  costo?: number | null;
  cantidad?: number | null;
  itbis?: number | null;
  descuento?: number | null;
  descripcion: string;
  categoriaId?: number | null;
  proveedorId?: number | null;
  garantiaId?: number | null;
  loading: boolean;
}


export interface MessageProducto{
  message: string;
  errorNombre: string;
  errorPrecio: string;
  errorCosto: string;
  errorCantidad: string;
  errorItbis: string;
  errorDescuento: string;
  errorDescripcion: string;
  errorCategoria: string;
  errorProveedor: string;
  errorGarantia: string;
}
