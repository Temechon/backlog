import { guid } from "../app.component";
import { Day, SystemDay } from "./day.model";

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
            const dbday = data?.days.filter((dbobj: any) => dbobj.id === dayname).pop();
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

    // [Symbol.iterator](): Iterator<Day> {
    //     const days = [this.lundi, this.mardi, this.mercredi, this.jeudi, this.vendredi, this.samedi, this.dimanche];
    //     let index = 0;
    //     return {
    //         next: (): IteratorResult<Day> => {
    //             if (index < days.length) {
    //                 return { value: days[index++], done: false };
    //             } else {
    //                 return { value: null, done: true };
    //             }
    //         }
    //     };
    // }

}