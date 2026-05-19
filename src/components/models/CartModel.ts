import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CartModel {
  private items: IProduct[];

  constructor(protected events: IEvents) {
    this.items = [];
  }

  getItems(): IProduct[] { return this.items; }

  addItem(item: IProduct): void {
    if (!this.hasItem(item.id)) {
      this.items.push(item);
      this.events.emit('basket:changed', this.items);
    }
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }

  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit('basket:changed', this.items);
  }

  clear(): void {
    this.items = [];
    this.events.emit('basket:changed', this.items);
  }

  getCount(): number { return this.items.length; }

  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }
}