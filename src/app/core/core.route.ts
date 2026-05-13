import { Routes } from "@angular/router";
import { Core } from "./core";
import { AuthGuard } from "./auth/AuthGuard";

export const coreRoutes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "/dashboard",
    },
    {
        path: "",
        component: Core,
        children: [
            {
                path: "dashboard",
                loadComponent: () =>
                    import("../modules/dashboard/components/dashboard/dashboard").then(
                        (m) => m.Dashboard
                    ),
                canActivate: [AuthGuard()],
            },
        ],
    },
]