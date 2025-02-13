import { GetUserResponse, Response } from "../../interfaces/service/GetUsers";
import { request } from "../../utils/api/Request";

export const getUsers: GetUserResponse = async () => {
    return await request.get({
        url: '/v1/users/allUsers',
        useToken: true,
        showToast: false,
    }) as Response;
};
