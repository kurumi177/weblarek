import { IProduct } from "../../types";

export class CartModel {
  private _items: IProduct[];

  constructor() {
    this._items = [];
  }

  //получение массива товаров, которые находятся в корзине
  getItems(): IProduct[] {
    return this._items;
  }

  //добавление товара, который был получен в параметре, в массив корзины
  addItem(item: IProduct): void {
    if (!this.hasItem(item.id)) {
      this._items.push(item);
    }
  }

  //проверка наличия товара в корзине по его id, полученному в параметре метода
  hasItem(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }

  //удаление товара, полученного в параметре, из массива корзины
  removeItem(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
  }

  //очистка корзины
  clear(): void {
    this._items = [];
  }

  //получение количества товаров в корзине
  getCount(): number {
    return this._items.length;
  }

  //получение стоимости всех товаров в корзине
  getTotal(): number {
    return this._items.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }
}
