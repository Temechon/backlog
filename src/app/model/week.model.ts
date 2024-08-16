import * as _ from 'underscore';
import { guid } from "../app.component";
import { Day, SystemDay } from "./day.model";
import { Ingredient } from "./ingredient.model";

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

    static FIRSTDAY_OF_THE_WEEK = "samedi";

    constructor(data?: any) {
        this.id = data?.id ?? guid();

        // Trouver l'index du premier jour de la semaine
        const startIndex = days.indexOf(Week.FIRSTDAY_OF_THE_WEEK);

        // Réorganiser la liste des jours pour commencer par le jour défini
        const orderedDays = [
            ...days.slice(startIndex),
            ...days.slice(0, startIndex)
        ];

        // Créer les objets Day dans l'ordre souhaité
        for (let dayname of orderedDays) {
            const dbday = data?.days?.filter((dbobj: any) => dbobj.id === dayname).pop();
            if (dbday) {
                this.days.push(new Day({ ...dbday, id: dbday.id }));
            } else {
                this.days.push(new Day({ id: dayname }));
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

    /**
     * Shifts the days in the week so that the specified day becomes the first day.
     * 
     * @param dayname - The name of the day to set as the first day in the week.
     * @returns An array of the days that were removed from the beginning of the week.
     * 
     * @throws Error if the specified day is not found in the current list of days.
     * 
     * The method searches for the index of the specified day and removes all days 
     * that come before it in the `days` array. These removed days are returned as 
     * an array. The remaining days in the array start with the specified day.
    */
    setToDay(dayname: string): Array<Day> {
        const index = _.findIndex(this.days, (day: Day) => day.id.toLowerCase() === dayname.toLowerCase());

        if (index === -1) {
            throw new Error(`Day with name ${dayname} not found`);
        }

        // Retire les jours précédents de la semaine actuelle
        const removedDays = this.days.splice(0, index);
        return removedDays;
    }

}