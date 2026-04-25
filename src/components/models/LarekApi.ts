import {
  IApi,
  IProduct,
  IProductsResponse,
  IOrderRequest,
  IOrderResponse,
} from "../../types";

export class LarekApi {
  private _api: IApi;
  private _baseUri: string;

  constructor(api: IApi, baseUri: string = "") {
    this._api = api;
    this._baseUri = baseUri;
  }

  // Метод для получения товаров (GET)
  async getProducts(): Promise<IProduct[]> {
    const response = await this._api.get<IProductsResponse>(
      `${this._baseUri}/product`,
    );
    return response.items;
  }

  // Метод для отправки заказа (POST)
  async createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    const response = await this._api.post<IOrderResponse>(
      `${this._baseUri}/order`,
      order,
    );
    return response;
  }
}
