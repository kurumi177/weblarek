import { IBuyer, TOrderValidationErrors, TPayment } from "../../types";

export class OrderModels {
  private payment: TPayment | null;
  private address: string;
  private email: string;
  private phone: string;

  constructor() {
    this.payment = null;
    this.address = "";
    this.email = "";
    this.phone = "";
  }

  //сохранение данных в модели. Позволяет сохранить как все данные, так и отдельные поля (например, только адрес или только телефон)
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.address !== undefined) this.address = data.address;
    if (data.phone !== undefined) this.phone = data.phone;
  }

  //получение всех данных покупателя
  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  //очистка всех данных покупателя
  clear(): void {
    this.payment = null;
    this.address = "";
    this.email = "";
    this.phone = "";
  }

  //валидация данных. Возвращает объект с ошибками. Если поле валидно (не пустое), оно отсутствует в объекте. Пример: `{ payment: 'Не выбран вид оплаты', email: 'Укажите email' }
  validate(): TOrderValidationErrors {
    const errors: TOrderValidationErrors = {};

    // Проверка способа оплаты
    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.address.trim()) {
      errors.address = "Введите адрес доставки";
    }

    if (!this.email.trim()) {
      errors.email = "Укажите email";
    }

    if (!this.phone.trim()) {
      errors.phone = "Укажите номер телефона";
    }

    return errors;
  }
}
