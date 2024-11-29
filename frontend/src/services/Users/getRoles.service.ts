import { GetRolesType, GetRolesResponse } from "../../interfaces/service/GetRoles"
import { request } from "../../utils/api/Request"

export const getRoles: GetRolesType = async () => {
    return await request.get({
        url: '/v1/roles/',
        showToast: false,
    }) as GetRolesResponse;
}