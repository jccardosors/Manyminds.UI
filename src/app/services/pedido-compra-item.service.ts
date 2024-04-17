import { Injectable } from '@angular/core';
import { PedidoCompraItem } from '../models/PedidoCompraItem';

@Injectable({
  providedIn: 'root'
})
export class PedidoCompraItemService {

  constructor() { }

  getData() {
    return ELEMENT_DATA;
  }

  addData(formData: PedidoCompraItem){
    ELEMENT_DATA.push(formData);
  }
}

const ELEMENT_DATA: PedidoCompraItem[] = [];