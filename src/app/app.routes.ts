import { Routes } from '@angular/router';
import { MenuListComponentComponent } from './views/menu-list-component/menu-list-component.component';
import { MealsViewComponent } from './views/meals-view/meals-view.component';
import { MealViewComponent } from './views/meal-view/meal-view.component';
import { IngredientViewComponent } from './views/ingredient-view/ingredient-view.component';

export const routes: Routes = [

    {
        path: "menus",
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
        redirectTo: "menus"
    }
];
