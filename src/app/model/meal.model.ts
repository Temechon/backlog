import { guid } from "../app.component";
import { Ingredient } from "./ingredient.model";


export class Dish {
    id: string;
    name: string;
    ingredients: Ingredient[] = []; // Liste des ingrédients

    constructor(data: any = {}) {
        this.id = data.id || guid();
        this.name = data.name ?? "";
        this.ingredients = (data.ingredients || []).map((ingredientWithOnlyId: string) => new Ingredient({ id: ingredientWithOnlyId }));
    }

    getIngredients(): string {
        return this.ingredients.map(ing => ing.name).join(', ');
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            ingredients: this.ingredients.map(ing => ing.id)
        };
    }

}

export class Meal {
    id: string;
    ingredients: Ingredient[] = []; // Liste des ingrédients
    mainDish: Dish;

    constructor(data: any = {}) {
        this.id = data.id || guid();
        this.ingredients = (data.ingredients || []).map((ingredientWithOnlyId: string) => new Ingredient({ id: ingredientWithOnlyId }));
        this.mainDish = new Dish(data.dish);
    }

    get name(): string {
        let name = "";
        if (this.mainDish) {
            name = this.mainDish.name;
        }

        if (this.ingredients.length == 0) {
            return name;
        }
        // returns the ingredients list in order, separated by spaces
        name += this.ingredients.map(ing => ing.name).join(", ");

        return name;
    }

    toJson() {
        return {
            id: this.id,
            ingredients: this.ingredients.map(ingredient => ingredient.id),
            mainDish: this.mainDish.toJson()
        };
    }

    getIngredients(): string {
        return this.ingredients.map(ing => ing.name).join(', ');
    }
}
