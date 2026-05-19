import { Component } from "../base/Component";
import { categoryMap } from "../../utils/constants"; 

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    id: string;
    title: string;
    category?: string;
    description?: string;
    image?: string;
    price: number | null;
    index?: number;
    buttonTitle?: string;
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _index?: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._title = container.querySelector(`.${blockName}__title`) as HTMLElement;
        this._price = container.querySelector(`.${blockName}__price`) as HTMLElement;
        this._image = container.querySelector(`.${blockName}__image`) as HTMLImageElement;
        this._category = container.querySelector(`.${blockName}__category`) as HTMLElement;
        this._description = container.querySelector(`.${blockName}__text`) as HTMLElement;
        this._button = container.querySelector(`.${blockName}__button`) as HTMLButtonElement;
        this._index = container.querySelector('.basket__item-index') as HTMLElement;

        if (actions?.onClick) {
            if (this._button) this._button.addEventListener('click', actions.onClick);
            else container.addEventListener('click', actions.onClick);
        }
    }

    set id(value: string) { this.container.dataset.id = value; }
    set title(value: string) { this._title.textContent = value; }
    
    set price(value: number | null) {
        this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
        if (this._button && !value) {
            this._button.disabled = true;
            this._button.textContent = 'Недоступно';
        }
    }
    
    set image(value: string) { this.setImage(this._image!, value, this.title); }
    
    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
            this._category.className = `card__category ${categoryClass}`;
        }
    }
    
    set description(value: string) { if (this._description) this._description.textContent = value; }
    set index(value: number) { if (this._index) this._index.textContent = String(value); }
    set buttonTitle(value: string) { if (this._button) this._button.textContent = value; }
}

export class CardCatalog extends Card {
    constructor(container: HTMLElement, actions?: ICardActions) { super('card', container, actions); }
}

export class CardPreview extends Card {
    constructor(container: HTMLElement, actions?: ICardActions) { super('card', container, actions); }
}

export class CardBasket extends Card {
    constructor(container: HTMLElement, actions?: ICardActions) { super('card', container, actions); }
}