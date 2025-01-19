import {MessageProducto, Producto} from '../Interfaces/producto';


export class ProductFactory{
  static createDefault(): Producto {
    return {
      productoId: 0,
      nombre: '',
      precio: 0,
      costo: 0,
      cantidad: 0,
      itbis: 18,
      descuento: 0,
      descripcion: '',
      categoriaId: 0,
      proveedorId: 0,
      garantiaId: 0,
      loading: false,
    };
  }
}

export class MessageProductoFactory{
  static createDefault(): MessageProducto{
    return {
      errorNombre: '',
      errorGarantia: '',
      errorCantidad: '',
      errorCategoria: '',
      errorItbis: '',
      errorDescripcion: '',
      errorDescuento: '',
      errorPrecio: '',
      errorProveedor: '',
      errorCosto: '',
      message: ''
    }
  }
}
