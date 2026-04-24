//import './scss/styles.scss';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/models/LarekApi';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { OrderModels } from './components/models/OrderModel';
import { apiProducts } from './utils/data';

// ========== СОЗДАЁМ ЭКЗЕМПЛЯРЫ КЛАССОВ ==========

const productsModel = new CatalogModel();
const cartModel = new CartModel();
const orderModel = new OrderModels();
const api = new Api(API_URL);
const larekApi = new LarekApi(api, API_URL);

// ========== ТЕСТИРОВАНИЕ МЕТОДОВ МОДЕЛЕЙ ==========

// Тестирование CatalogModel
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems());

// Тестирование CartModel
cartModel.addItem(apiProducts.items[0]);
console.log('Корзина после добавления:', cartModel.getItems());
console.log('Количество товаров в корзине:', cartModel.getCount());
console.log('Общая стоимость корзины:', cartModel.getTotal());

// Тестирование OrderModel
orderModel.setData({ payment: 'card', address: 'ул. Тестовая, д. 1' });
console.log('Данные покупателя:', orderModel.getData());
console.log('Валидация:', orderModel.validate());

// ========== ЗАПРОС К СЕРВЕРУ ==========

larekApi.getProducts()
    .then(products => {  
        productsModel.setItems(products); 
        console.log('Каталог с сервера:', productsModel.getItems());
    })
    .catch(err => console.error('Ошибка:', err));