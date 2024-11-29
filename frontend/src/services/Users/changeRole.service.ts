import { FnChangeRole, } from "../../interfaces/service/ChangeRole";
import { ErrorResponse } from "../../interfaces/service/error/error";
import { request } from "../../utils/api/Request";

export const changeUserRole: FnChangeRole = async (userId, newRole) => {
    return request.patch({
        url: '/v1/users/updateRole',
        data: {userId, newRole}
    }) as ErrorResponse;
}