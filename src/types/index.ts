export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = "card" | "cash" | "";

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Интерфейс для ответа сервера при запросе списка товаров
export interface IProductsResponse {
  items: IProduct[]; // массив товаров
  total: number; // общее количество товаров
}

// Интерфейс для отправки заказа на сервер
export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

// Интерфейс для ответа сервера после оформления заказа
export interface IOrderResponse {
  id: string; //номер заказа
  total: number; // общая сумма заказа
}
