import { guid } from "../app.component";
import { Ingredient } from "./ingredient.model";


export class Dish {
    id: string;
    name: string;
    ingredients: Ingredient[] = []; // Liste des ingrédients

    constructor(data: any = {}) {
        this.id = data.id || guid();
        this.name = data.name ?? "";
        this.ingredients = (data.ingredients || []).map((ingData: any) => new Ingredient(ingData));
    }

    getIngredients(): string {
        return this.ingredients.map(ing => ing.name).join(', ');
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            ingredients: this.ingredients.map(ing => ing.toJson())
        };
    }

    get isVegetarian(): boolean {
        return this.ingredients.filter(ing => ing.isMeat).length === 0;
    }

}

export class Meal {
    id: string;
    ingredients: Ingredient[] = []; // Liste des ingrédients
    mainDish: Dish;

    constructor(data: any = {}) {
        this.id = data.id || guid();
        this.ingredients = (data.ingredients || []).map((ingData: any) => new Ingredient(ingData));
        if (data.mainDish) {
            this.mainDish = new Dish(data.mainDish);
        } else {
            this.mainDish = null;
        }
    }

    get name(): string {
        if (!this.mainDish && this.ingredients.length === 0) {
            return "";
        }

        const ingredients = this.ingredients.map(ing => ing.name).join(", ");
        if (!this.mainDish) {
            return ingredients;
        }

        const mainDishName = this.mainDish.name;
        if (this.ingredients.length === 0) {
            return mainDishName;
        }

        return `${mainDishName} avec ${ingredients}`;
    }

    toJson() {
        const obj = {
            id: this.id,
            ingredients: this.ingredients.map(ingredient => ingredient.toJson()),
            mainDish: this.mainDish?.toJson() ?? null
        };

        return Object.fromEntries(
            Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined)
        );
    }

    getIngredients(): string {
        return this.ingredients.map(ing => ing.name).join(', ');
    }

    isEmpty(): boolean {
        if (this.mainDish) {
            return false;
        }
        if (this.ingredients.length > 0) {
            return false;
        }
        return true;
    }
}
