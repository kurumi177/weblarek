import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CatalogModel {
  private items: IProduct[];
  private selectedItem: IProduct | null;

  constructor(protected events: IEvents) {
    this.items = [];
    this.selectedItem = null;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('items:changed', this.items);
  }

  getItems(): IProduct[] { return this.items; }

  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
    this.events.emit('preview:changed', item);
  }

  getSelectedItem(): IProduct | null { return this.selectedItem; }
}