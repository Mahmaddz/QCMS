import { Roles } from "../service/GetRoles";

export interface ASColumnsParams {
    changeUserRole: (userId: number, newRole: string | number) => void;
    roles: Roles[] | undefined;
}