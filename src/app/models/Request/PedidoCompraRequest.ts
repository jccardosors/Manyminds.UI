import { PedidoCompra } from "../PedidoCompra";
import { PedidoCompraItem } from "../PedidoCompraItem";

export class PedidoCompraRequest {
    Pedido: PedidoCompra;
    items: PedidoCompraItem[] | [];
}