export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = 'card' | 'cash' | '';

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Тип для ответа сервера со списком товаров
export interface IProductsResponse {
    items: IProduct[];
    total: number;
}

// Тип для отправки заказа на сервер (используем существующий IBuyer + добавляем new поля)
export interface IOrderRequest {
    payment: TPayment;
    email: string;    
    phone: string;    
    address: string;  
    total: number;          
    items: string[];        
}

// Тип для ответа сервера после оформления заказа
export interface IOrderResponse {
    id: string;             
    total: number;       
}