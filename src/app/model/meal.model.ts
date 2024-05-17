import { guid } from "../app.component";
import { Ingredient } from "./ingredient.model";

export class Meal {
    id: string;
    private _name: string;
    ingredients: Ingredient[] = []; // Liste des ingrédients

    constructor(name?: string) {
        this.id = guid();
        this._name = name || "";
    }

    get name(): string {
        if (this._name) {
            return this._name;
        }

        // returns the ingredients list in order, separated by spaces
        return "liste des ingrédients";
    }

    set name(n: string) {
        this._name = n;
    }
}