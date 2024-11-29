import { ErrorResponse } from "./error/error";

export interface Roles {
    id: number,
    roleName: string,
    roleDescription: string
}

export interface GetRolesResponse extends ErrorResponse {
    data: Roles[]
}

export interface GetRolesType extends ErrorResponse {
    (): Promise<GetRolesResponse>
}