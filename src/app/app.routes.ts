import { Routes } from '@angular/router';

import { DishListViewComponent } from './views/dishes/dish-list-view/dish-list-view.component';
import { DishViewComponent } from './views/dishes/dish-view/dish-view.component';
import { MenuListComponent } from './views/home/menu-list/menu-list.component';
import { IngredientViewComponent } from './views/ingredients/ingredient-view/ingredient-view.component';
import { ShopListViewComponent } from './views/shoppinglist/shop-list-view/shop-list-view.component';
import { CreateMealViewComponent } from './views/week/create-meal-view/create-meal-view.component';
import { WeekViewComponent } from './views/week/week-view/week-view.component';

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
                                component: CreateMealViewComponent,
                                data: { mealType: 'lunch' }
                            },
                            {
                                path: 'dinner',
                                component: CreateMealViewComponent,
                                data: { mealType: 'dinner' }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: "dishes",
        children: [
            {
                path: "",
                component: DishListViewComponent
            },
            {
                path: ":id",
                children: [
                    {
                        path: "",
                        component: DishViewComponent
                    }
                ]
            }
        ]
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
    },
    {
        path: "shoppinglist",
        component: ShopListViewComponent
    },
    {
        path: "**",
        redirectTo: "home"
    }
];
