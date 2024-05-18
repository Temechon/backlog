import { Routes } from '@angular/router';
import { MenuListComponentComponent } from './views/menu-list-component/menu-list-component.component';
import { MealsViewComponent } from './views/meals-view/meals-view.component';
import { MealViewComponent } from './views/meal-view/meal-view.component';

export const routes: Routes = [

    {
        path: "menulist",
        component: MenuListComponentComponent
    },
    {
        path: "meals",
        children: [
            {
                path: "",
                component: MealsViewComponent
            },
            {
                path: ":id",
                component: MealViewComponent
            },
            {
                path: "add",
                component: MealViewComponent
            }
        ]
    },
    {
        path: "**",
        redirectTo: "menulist"
    }
];
