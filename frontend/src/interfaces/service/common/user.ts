import { Role } from "./role";

export interface User {
    id: number;
    email: string;
    password: string;
    roleID: number;
    role: Role;
}