import { Injectable } from "@angular/core";
import { LoginRequest } from "../interfaces/login-request.interface";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { ApiResponse } from "../../../shared/interfaces/api-response.interface";
import { LoginResponse } from "../interfaces/login-response.interface";
import { APIInterfaceService } from "../../../shared/services/api-interface.service";
import { API_ROUTES } from "../../../shared/common/api-routes";
import { Router } from "@angular/router";
import { TokenClaims } from "../interfaces/token-claims.interface";


@Injectable({
    providedIn: "root",
})
export class AuthService {

    constructor(
        private apiInterface: APIInterfaceService,
        private router: Router
    ) { }

    login(formDetails: LoginRequest): Observable<ApiResponse<LoginResponse>> {
        return this.apiInterface.post<LoginResponse>(
            API_ROUTES.AUTH.LOGIN,
            formDetails
        );
    }

    isTokenExists(): boolean {
        var token = localStorage?.getItem("accessToken");
        return token != null && token != "" ? true : false;
    }

    taskAfterLogout() {
        this.clearLocalStorageExcept();
        this.router.navigate(["/auth/login"]);
    }

    private clearLocalStorageExcept(): void {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
            localStorage.removeItem(key);
        });
    }

    getToken(): string {
        return localStorage.getItem("accessToken") ?? "";
    }

    getClaims(): TokenClaims {
        const jwtHelper = new JwtHelperService();
        const decodedToken = jwtHelper.decodeToken(this.getToken());
        return {
            UserId: Number(decodedToken["UserId"]),
            RoleId: Number(decodedToken["RoleId"]),
            Name: decodedToken["Name"],
            LoginTimeStamp: decodedToken["LoginTimeStamp"],
            IsAdmin: decodedToken["IsAdmin"],
            IsInterviewer: decodedToken["IsInterviewer"],
            RoleName: decodedToken["RoleName"],
        };
    }

    setToken(accessToken: string, refreshToken: string): void {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    }

    logout() {
        if (!this.isTokenExists()) {
            this.taskAfterLogout();
        }
    }
}