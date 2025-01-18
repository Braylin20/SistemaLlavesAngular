import {MessageProducto, Producto} from '../Interfaces/producto';


export class ProductFactory{
  static createDefault(): Producto {
    return {
      productoId: 0,
      nombre: '',
      precio: null,
      costo: null,
      cantidad: null,
      itbis: 18,
      descuento: null,
      descripcion: '',
      categoriaId: null,
      proveedorId: null,
      garantiaId: null,
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
