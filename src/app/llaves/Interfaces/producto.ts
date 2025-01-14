import {Categorias} from './categorias';


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
}
