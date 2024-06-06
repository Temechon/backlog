import { Ingredient } from "./ingredient.model";
import * as _ from 'underscore';

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

    updateIngredient(ing: Ingredient) {
        let found = false;

        // Utiliser _.each pour parcourir les catégories
        _.each(this.categories, (items, category) => {
            console.log(items, category);

            if (!found) {
                // Trouver l'index de l'ingrédient dans la catégorie actuelle
                const index = _.findIndex(items, item => item.ingredient.id === ing.id);

                if (index !== -1) {
                    found = true;
                    // Vérifier si la catégorie a changé
                    if (category !== ing.shopCategory) {
                        // Supprimer l'ingrédient de l'ancienne catégorie
                        items.splice(index, 1);
                        // Ajouter l'ingrédient à la nouvelle catégorie
                        this.addIngredient(ing.name, ing.shopCategory);
                    } else {
                        // Mettre à jour l'ingrédient dans la même catégorie
                        items[index] = new ShoppingItem({ ingredient: ing, checked: items[index].checked });
                    }
                }
            }
        });

        // Si l'ingrédient n'a pas été trouvé, ajouter comme un nouvel ingrédient
        if (!found) {
            this.addIngredient(ing.name, ing.shopCategory);
        }
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