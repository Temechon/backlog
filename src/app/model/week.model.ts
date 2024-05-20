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

    lundi: Day;
    mardi: Day;
    mercredi: Day;
    jeudi: Day;
    vendredi: Day;
    samedi: Day;
    dimanche: Day;

    constructor(data?: any) {
        this.id = data?.id ?? guid();

        this.lundi = new Day(data?.lundi);
        this.mardi = new Day(data?.mardi);
        this.mercredi = new Day(data?.mercredi);
        this.jeudi = new Day(data?.jeudi);
        this.vendredi = new Day(data?.vendredi);
        this.samedi = new Day(data?.samedi);
        this.dimanche = new Day(data?.dimanche);
    }

}