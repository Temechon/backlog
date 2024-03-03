import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { BacklogViewComponent } from './views/backlog-view/backlog-view.component';

export const routes: Routes = [

    {
        path: "home",
        component: HomeComponent
    },
    {
        path: "backlog",
        children: [
            {
                path: "",
                redirectTo: "home",
                pathMatch: 'full',
            },
            {
                path: ":id",
                children: [
                    {
                        path: "",
                        component: BacklogViewComponent
                    },
                    // {
                    //     path: "vote",
                    //     component: BacklogVoteComponent
                    // },
                ]
            }
        ]
    },
    {
        path: "**",
        redirectTo: "home"
    }
];
