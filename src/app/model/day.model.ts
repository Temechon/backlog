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
    lunch: Meal; // Repas de midi
    dinner: Meal; // Repas du soir

    constructor(data?: any) {
        this.id = data.id;
        if (data?.lunch) {
            this.lunch = new Meal(data?.lunch);
        } else {
            this.lunch = null;
        }
        if (data?.dinner) {
            this.dinner = new Meal(data?.dinner);
        } else {
            this.dinner = null;
        }
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