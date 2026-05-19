import { IBuyer, TOrderValidationErrors, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class OrderModels {
  private payment: TPayment | null;
  private address: string;
  private email: string;
  private phone: string;
  formErrors: TOrderValidationErrors = {};

  constructor(protected events: IEvents) {
    this.payment = null;
    this.address = "";
    this.email = "";
    this.phone = "";
  }

  setField(field: keyof IBuyer, value: string) {
    if (field === 'payment') {
      this.payment = value as TPayment;
    } else {
      this[field] = value;
    }
    this.validateOrder();
  }

  getData(): IBuyer {
    return { payment: this.payment, address: this.address, email: this.email, phone: this.phone };
  }

  clear(): void {
    this.payment = null;
    this.address = "";
    this.email = "";
    this.phone = "";
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.payment) errors.payment = "Не выбран вид оплаты";
    if (!this.address) errors.address = "Укажите адрес";
    if (!this.email) errors.email = "Укажите email";
    if (!this.phone) errors.phone = "Укажите телефон";
    
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }
}