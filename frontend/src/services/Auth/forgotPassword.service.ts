import { ErrorResponse } from "../../interfaces/service/error/error"
import { request } from "../../utils/api/Request"

export const forgotPassword = (email: string) => {
    return request.patch({
        url: '/v1/auth/forgot-password',
        data: {email}
    }) as ErrorResponse;
}