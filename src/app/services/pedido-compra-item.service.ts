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
    debugger;
    ELEMENT_DATA.push(formData);
  }

  deleteData(){

    ELEMENT_DATA.splice(0, ELEMENT_DATA.length);
  }
}

const ELEMENT_DATA: PedidoCompraItem[] = [];