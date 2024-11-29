import { ErrorResponse } from "../../interfaces/service/error/error"
import { request } from "../../utils/api/Request"

export const resetPassword = async (newPwd: string, curPwd: string) => {
    return await request.post({
        url: '/v1/auth/reset-password',
        data: {newPassword: newPwd, currentPassword: curPwd}
    }) as ErrorResponse
}