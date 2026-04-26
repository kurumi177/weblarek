import {
  IApi,
  IProduct,
  IProductsResponse,
  IOrderRequest,
  IOrderResponse,
} from "../../types";

export class LarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // Метод для получения товаров (GET)
  async getProducts(): Promise<IProductsResponse> {
    const response = await this.api.get<IProductsResponse>(`/product`);
    return response;
  }

  // Метод для отправки заказа (POST)
  async createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    const response = await this.api.post<IOrderResponse>(`/order`, order);
    return response;
  }
}
