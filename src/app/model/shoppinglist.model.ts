import { Ingredient } from "./ingredient.model";

export class ShoppingItem {
    ingredient: Ingredient;
    checked: boolean;

    constructor(data: any) {
        if (data instanceof Ingredient) {
            this.ingredient = data;
            this.checked = false;
        } else {
            this.ingredient = data.ingredient ? new Ingredient(data.ingredient) : null;
            this.checked = data.checked ?? false;
        }
    }

    toJson(): any {
        return {
            ingredient: this.ingredient.toJson(),
            checked: this.checked
        };
    }
}

export class ShoppingList {

    categories: { [category: string]: ShoppingItem[] } = {};

    constructor(data: any) {
        if (data) {
            for (const category in data) {
                if (data.hasOwnProperty(category)) {
                    this.categories[category] = data[category].map((item: any) => new ShoppingItem(item));
                }
            }
        }
    }

    get length(): number {
        return Object.keys(this.categories).length;
    }

    addIngredient(name: string, shopCategory: string) {
        const newIngredient = new Ingredient({
            name: name,
            shopCategory: shopCategory
        });

        if (!this.categories[shopCategory]) {
            this.categories[shopCategory] = [];
        }
        this.categories[shopCategory].push(new ShoppingItem({ ingredient: newIngredient, checked: false }));
    }

    [Symbol.iterator]() {
        const categories = Object.keys(this.categories).sort()
        let index = 0;
        const ingredientsByCategory = this.categories;

        return {
            next(): IteratorResult<{ shopCategory: string; ingredients: ShoppingItem[] }> {
                if (index < categories.length) {
                    const shopCategory = categories[index++];
                    return { value: { shopCategory, ingredients: ingredientsByCategory[shopCategory] }, done: false };
                } else {
                    return { value: null, done: true };
                }
            }
        };
    }

    toJson() {
        const json: { [category: string]: any[] } = {};
        for (const category in this.categories) {
            if (this.categories.hasOwnProperty(category)) {
                json[category] = this.categories[category].map(item => item.toJson());
            }
        }
        return json;
    }
}