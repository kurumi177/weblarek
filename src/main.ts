import "./scss/styles.scss";
import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";
import { CatalogModel } from "./components/models/CatalogModel";
import { CartModel } from "./components/models/CartModel";
import { OrderModels } from "./components/models/OrderModel";
import { LarekApi } from "./components/models/LarekApi";
import { Page } from "./components/view/Page";
import { CardCatalog, CardPreview, CardBasket } from "./components/view/Card";
import { Modal } from "./components/common/Modal";
import { Basket } from "./components/view/Basket";
import { OrderForm, ContactsForm } from "./components/view/Forms";
import { Success } from "./components/view/Success";
import { cloneTemplate } from "./utils/utils";

// 1. Инициализация брокера событий
const events = new EventEmitter();

// 2. Создание экземпляров моделей с передачей брокера (измененные конструкторы)
const productsModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const orderModel = new OrderModels(events);

// 3. Настройка API слоя
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

// 4. Поиск HTML-шаблонов в разметке index.html
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// 5. Инициализация глобальных UI-компонентов
const page = new Page(document.body, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

// ЛОГИКА ВЗАИМОДЕЙСТВИЯ (ПРЕЗЕНТЕР)

// Отображение каталога при изменении данных в CatalogModel
events.on('items:changed', () => {
    page.catalog = productsModel.getItems().map(item => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: CDN_URL + item.image,
            price: item.price,
            category: item.category
        });
    });
});

// Клик по карточке в каталоге
events.on('card:select', (item: any) => {
    productsModel.setSelectedItem(item);
});

// Открытие модального окна с подробным описанием товара
events.on('preview:changed', (item: any) => {
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (cartModel.hasItem(item.id)) {
                cartModel.removeItem(item.id);
            } else {
                cartModel.addItem(item);
            }
            card.buttonTitle = cartModel.hasItem(item.id) ? 'Удалить из корзины' : 'Купить';
        }
    });

    modal.render({
        content: card.render({
            title: item.title,
            image: CDN_URL + item.image,
            description: item.description,
            price: item.price,
            category: item.category,
            buttonTitle: cartModel.hasItem(item.id) ? 'Удалить из корзины' : 'Купить'
        })
    });
});

// Обновление корзины (счетчик на главной странице и список внутри попапа)
events.on('basket:changed', () => {
    page.counter = cartModel.getCount();
    
    basket.items = cartModel.getItems().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => cartModel.removeItem(item.id)
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });
    basket.total = cartModel.getTotal();
});

// Открытие модалки корзины
events.on('basket:open', () => {
    modal.render({ content: basket.render() });
});

// Шаг заказа 1: Открытие формы адреса и оплаты
events.on('order:open', () => {
    orderModel.clear();
    modal.render({
        content: orderForm.render({
            payment: null,
            address: '',
            valid: false,
            errors: []
        })
    });
});

// Слушаем изменения ввода полей в формах
events.on(/^(order\..*):change/, (data: { field: string, value: string }) => {
    orderModel.setField(data.field as any, data.value);
});

// Валидация форм
events.on('formErrors:change', (errors: Partial<any>) => {
    const { payment, address, email, phone } = errors;
    orderForm.valid = !payment && !address;
    orderForm.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
    
    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});

// Шаг заказа 2: Переход к вводу Email и телефона
events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
});

// Финальная оплата и отправка заказа на бэкенд
events.on('contacts:submit', () => {
    const finalOrderData = {
        ...orderModel.getData(),
        total: cartModel.getTotal(),
        items: cartModel.getItems().map(item => item.id)
    };

    larekApi.createOrder(finalOrderData as any)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => modal.close()
            });
            modal.render({ content: success.render({ total: result.total }) });
            cartModel.clear();
            orderModel.clear();
        })
        .catch(console.error);
});

// Управление блокировкой страницы при прокрутке модалок
events.on('modal:open', () => { page.locked = true; });
events.on('modal:close', () => { page.locked = false; });

// ИНИЦИАЛЬНЫЙ ЗАПРОС ТОВАРОВ 
larekApi.getProducts()
    .then(apiProducts => {
        productsModel.setItems(apiProducts.items);
    })
    .catch(console.error);