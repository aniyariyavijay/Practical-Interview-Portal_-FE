import { Routes } from "@angular/router";

export const authRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "login",
        loadComponent: () =>
          import("./components/login/login").then(
            (m) => m.Login
          ),
      }
    ],
  },
];
