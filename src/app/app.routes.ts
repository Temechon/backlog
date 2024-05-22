import { Routes } from '@angular/router';

import { IngredientViewComponent } from './views/ingredient-view/ingredient-view.component';
import { MealViewComponent } from './views/meal-view/meal-view.component';
import { MealsViewComponent } from './views/meals-view/meals-view.component';
import { MenuListComponent } from './views/menulist/menu-list/menu-list.component';
import { WeekViewComponent } from './views/menulist/week-view/week-view.component';

export const routes: Routes = [
    {
        path: "home",
        component: MenuListComponent,
    },
    {
        path: "week",
        children: [
            {
                path: "",
                pathMatch: 'full',
                redirectTo: "/home"
            },
            {
                path: ":weekid",
                children: [
                    {
                        path: "",
                        component: WeekViewComponent,
                    },
                    {
                        path: ':dayid',
                        children: [
                            {
                                path: 'lunch',
                                component: MealsViewComponent,
                                data: { mode: 'select', mealType: 'lunch' }
                            },
                            {
                                path: 'dinner',
                                component: MealsViewComponent,
                                data: { mode: 'select', mealType: 'dinner' }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: "meals",
        children: [
            {
                path: "",
                component: MealsViewComponent,
                data: { mode: 'edit' }
            },
            {
                path: ":id",
                children: [
                    {
                        path: "",
                        component: MealViewComponent
                    },
                    {
                        path: "ingredient",
                        children: [
                            {
                                path: "",
                                component: IngredientViewComponent
                            },
                            {
                                path: ":iding",
                                component: IngredientViewComponent
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: "**",
        redirectTo: "home"
    }
];
