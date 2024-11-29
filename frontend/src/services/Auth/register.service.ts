import { ReqRegister, ResRegister } from "../../interfaces/service/Register";
import { request } from "../../utils/api/Request";

export const registerUser: ReqRegister = async (email, password, confirmPassword) => (
    await request.post({
        url: '/v1/auth/register', 
        data: {email, password, confirmPassword}, 
        useToken: false
    }) as ResRegister
)