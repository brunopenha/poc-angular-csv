import { Component } from '@angular/core';
import { CommonModule} from '@angular/common';
import { Papa } from 'ngx-papaparse';
import { Item } from './Item';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    CommonModule
  ],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent {

  items: Item[] = [
    {id: 1, name: 'Item 1', price: 10.0},
    {id: 2, name: 'Item 2', price: 15.5},
    {id: 3, name: 'Item 3', price: 8.9}
  ];

  constructor(private papa: Papa) { }

  exportCSV() {
    const csv = this.papa.unparse({
      fields: ['id', 'name', 'price'],
      data: this.items.map(item => [item.id, item.name, item.price])
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'items.csv');
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
}
