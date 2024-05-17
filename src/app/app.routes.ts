import { Routes } from '@angular/router';
import { MenuListComponentComponent } from './views/menu-list-component/menu-list-component.component';
import { MealsViewComponent } from './views/meals-view/meals-view.component';

export const routes: Routes = [

    {
        path: "menulist",
        component: MenuListComponentComponent
    },
    {
        path: "meals",
        component: MealsViewComponent
    },
    {
        path: "**",
        redirectTo: "menulist"
    }
];
