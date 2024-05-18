import { guid } from "../app.component";
import { Ingredient } from "./ingredient.model";

export class Meal {
    id: string;
    private _name: string;
    ingredients: Ingredient[] = []; // Liste des ingrédients

    constructor(data: any = {}) {
        this.id = data.id || guid();
        this._name = data.name ?? "";
        this.ingredients = (data.ingredients || []).map((i: any) => new Ingredient(i));
    }

    get name(): string {
        if (this._name) {
            return this._name;
        }

        if (this.ingredients.length == 0) {
            return "";
        }
        // returns the ingredients list in order, separated by spaces
        return this.ingredients.map(ing => ing.name).join(", ");
    }

    set name(n: string) {
        this._name = n;
    }

    toJson() {
        return {
            id: this.id,
            name: this._name,
            ingredients: this.ingredients.map(ingredient => ingredient.toJson())
        };
    }

    getIngredients(): string {
        return this.ingredients.map(ing => ing.name).join(', ');
    }
}
