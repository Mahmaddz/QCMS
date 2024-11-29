import { Request, Response } from "../../interfaces/service/Login";
import { request } from "../../utils/api/Request"

export const login: Request = async (email, password) => {
    return await request.post({ url: "/v1/auth/login", data: {email, password}, useToken: false, }) as Response;
}