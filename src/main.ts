import "./scss/styles.scss";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { LarekApi } from "./components/models/LarekApi";
import { CatalogModel } from "./components/models/CatalogModel";
import { CartModel } from "./components/models/CartModel";
import { OrderModels } from "./components/models/OrderModel";
import { apiProducts } from "./utils/data";

// СОЗДАЁМ ЭКЗЕМПЛЯРЫ КЛАССОВ

const productsModel = new CatalogModel();
const cartModel = new CartModel();
const orderModel = new OrderModels();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

// ТЕСТИРОВАНИЕ МЕТОДОВ МОДЕЛЕЙ

// Тестирование CatalogModel
productsModel.setItems(apiProducts.items);
console.log("Массив товаров из каталога:", productsModel.getItems());

// Тестирование getItemById
const firstProduct = productsModel.getItems()[0];
console.log("Первый товар в каталоге:", firstProduct);

const foundProduct = productsModel.getItemById(firstProduct.id);
console.log(`Товар найден по id "${firstProduct.id}":`, foundProduct);

// Тестирование setSelectedItem и getSelectedItem
productsModel.setSelectedItem(firstProduct);
console.log(
  "Выбранный товар (setSelectedItem):",
  productsModel.getSelectedItem(),
);

// Тестирование CartModel
// Добавляем товар в корзину
cartModel.addItem(apiProducts.items[0]);
console.log("Корзина после добавления:", cartModel.getItems());
console.log("Количество товаров в корзине:", cartModel.getCount());
console.log("Общая стоимость корзины:", cartModel.getTotal());

// Объявляем переменную productId
const productId = apiProducts.items[0].id;
console.log(
  `hasItem("${productId}") до удаления:`,
  cartModel.hasItem(productId),
);

// Тестирование removeItem
cartModel.removeItem(productId);
console.log(
  `Корзина после удаления товара с id "${productId}":`,
  cartModel.getItems(),
);
console.log("Количество товаров после удаления:", cartModel.getCount());
console.log(
  `hasItem("${productId}") после удаления:`,
  cartModel.hasItem(productId),
);

// Тестирование удаления несуществующего товара
cartModel.removeItem("non-existent-id");
console.log("Удаление несуществующего товара не вызвало ошибку");

// Тестирование clear
cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log("Корзина перед очисткой:", cartModel.getCount(), "товаров");
cartModel.clear();
console.log("Корзина после очистки:", cartModel.getItems());

// Тестирование OrderModel
orderModel.setData({ payment: "card", address: "ул. Красноармейская, д. 1" });
console.log("Данные покупателя:", orderModel.getData());
console.log("Валидация:", orderModel.validate());

// ЗАПРОС К СЕРВЕРУ

larekApi
  .getProducts()
  .then((products) => {
    productsModel.setItems(products.items);
    console.log("Каталог с сервера:", productsModel.getItems());
  })
  .catch((err) => console.error("Ошибка:", err));
