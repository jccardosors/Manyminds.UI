import { PedidoCompra } from "../PedidoCompra";
import { PedidoCompraItem } from "../PedidoCompraItem";

export class RetornarListaPedidoCompraItemResponse{
    Pedido: PedidoCompra;
    Items: PedidoCompraItem[];
}