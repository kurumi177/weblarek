import { IBuyer, TPayment } from "../../types";

export class OrderModels {
  private _payment: TPayment;
  private _address: string;
  private _email: string;
  private _phone: string;

  constructor() {
    this._payment = "";
    this._address = "";
    this._email = "";
    this._phone = "";
  }

  //сохранение данных в модели. Позволяет сохранить как все данные, так и отдельные поля (например, только адрес или только телефон)
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.email !== undefined) this._email = data.email;
    if (data.address !== undefined) this._address = data.address;
    if (data.phone !== undefined) this._phone = data.phone;
  }

  //получение всех данных покупателя
  getData(): IBuyer {
    return {
      payment: this._payment,
      address: this._address,
      email: this._email,
      phone: this._phone,
    };
  }

  //очистка всех данных покупателя
  clear(): void {
    this._payment = "";
    this._address = "";
    this._email = "";
    this._phone = "";
  }

  //валидация данных. Возвращает объект с ошибками. Если поле валидно (не пустое), оно отсутствует в объекте. Пример: `{ payment: 'Не выбран вид оплаты', email: 'Укажите email' }
  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    // Проверка способа оплаты
    if (!this._payment) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this._address || this._address.trim() === "") {
      errors.address = "Введите адрес доставки";
    }

    if (!this._email || this._email.trim() === "") {
      errors.email = "Укажите email";
    }

    if (!this._phone || this._phone.trim() === "") {
      errors.phone = "Укажите номер телефона";
    }

    return errors;
  }
}
