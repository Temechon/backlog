import { Routes } from '@angular/router';
import { MenuListComponentComponent } from './views/menu-list-component/menu-list-component.component';
import { MealsViewComponent } from './views/meals-view/meals-view.component';
import { AddMealViewComponent } from './views/add-meal-view/add-meal-view.component';

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
                path: "add",
                component: AddMealViewComponent
            }
        ]
    },
    {
        path: "**",
        redirectTo: "menulist"
    }
];
