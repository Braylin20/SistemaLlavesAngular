

export interface Producto {
  productoId: number;
  nombre: string ;
  precio: number ;
  costo: number ;
  cantidad: number ;
  itbis: number;
  descuento: number ;
  descripcion: string;
  categoriaId: number ;
  proveedorId: number ;
  garantiaId: number ;
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
