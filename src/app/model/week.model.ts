import { guid } from "../app.component";
import { Day, SystemDay } from "./day.model";
import * as _ from 'underscore';
import { Ingredient } from "./ingredient.model";
import { Meal } from "./meal.model";

const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]

/**
 * Used to manage global preferences for the week
 */
export class SystemWeek {

    systemDays: SystemDay[];

    constructor() {

        for (let i = 0; i < days.length; i++) {
            const sd = new SystemDay(days[i]);
            this.systemDays.push(sd);
        }
    }
}

/**
 * Created from a system week : creates a menu for each day of the week
 */
export class Week {
    id: string;
    days: Array<Day> = [];

    constructor(data?: any) {
        this.id = data?.id ?? guid();

        for (let dayname of days) {
            const dbday = data?.days?.filter((dbobj: any) => dbobj.id === dayname).pop();
            if (dbday) {
                this.days.push(new Day({ ...dbday, id: dbday.id }))
            } else {
                this.days.push(new Day({ id: dayname }))
            }
        }
    }

    getDay(name: string): Day {
        return this.days.filter(day => day.id.toLowerCase() === name.toLowerCase()).pop();
    }

    toJson() {
        return {
            id: this.id,
            days: this.days.map(day => day.toJson())
        };
    }

    replace(day: Day) {
        const index = _.findIndex(this.days, (d: Day) => d.id === day.id);
        this.days[index] = day;
    }

    updateIngredient(ing: Ingredient) {
        for (let day of this.days) {
            if (day.lunch) {
                day.lunch.updateIngredient(ing);
            }
            if (day.dinner) {
                day.dinner.updateIngredient(ing);
            }
        }
    }
}