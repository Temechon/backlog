import { guid } from "../app.component";
import { Day, SystemDay } from "./day.model";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

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
    days: Day[] = []; // Liste des jours de la semaine
    systemWeek: SystemWeek;

    constructor(systemWeek: SystemWeek) {

        this.id = guid();
        this.systemWeek = systemWeek;

        for (let sd of systemWeek.systemDays) {
            const day = new Day(sd.name);
            this.days.push(day);
        }
    }

}