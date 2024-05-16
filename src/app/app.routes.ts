import { Routes } from '@angular/router';
import { MenuListComponentComponent } from './views/menu-list-component/menu-list-component.component';

export const routes: Routes = [

    {
        path: "menulist",
        component: MenuListComponentComponent
    },
    {
        path: "**",
        redirectTo: "menulist"
    }
];
