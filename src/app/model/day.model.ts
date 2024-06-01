import { guid } from "../app.component";
import { Meal } from "./meal.model";

export class SystemDay {
    id: string;
    index: number;
    name: string;
    preferences: DayPreferences; // Préférences alimentaires pour le jour

    constructor(name: string) {
        this.name = name;
        this.preferences = new DayPreferences();
    }
}


export class Day {
    id: string;
    lunch: Meal = null; // Repas de midi
    dinner: Meal = null; // Repas du soir

    constructor(data?: any) {
        this.id = data.id;
        if (data.lunch) {
            this.lunch = new Meal(data.lunch);
        }
        if (data.dinner) {
            this.dinner = new Meal(data.dinner);
        }

    }

    toJson() {
        const obj = {
            id: this.id,
            lunch: this.lunch?.toJson() ?? null,
            dinner: this.dinner?.toJson() ?? null
        };
        return Object.fromEntries(
            Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined)
        );
    }
}

export class DayPreferences {
    id: string;
    lunchWithMeat: boolean; // Indique si la viande est autorisée pour le repas de midi
    dinnerWithMeat: boolean; // Indique si la viande est autorisée pour le repas du soir
    lunchWithFriends: boolean; // Indique si le repas de midi est un repas entre amis
    dinnerWithFriends: boolean; // Indique si le repas du soir est un repas entre amis

    constructor() {
        this.id = guid();
        this.lunchWithMeat = false;
        this.dinnerWithMeat = false;
        this.lunchWithFriends = false;
        this.dinnerWithFriends = false;
    }
}