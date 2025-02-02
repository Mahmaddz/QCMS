import { ErrorResponse } from "../../interfaces/service/error/error"
import { request } from "../../utils/api/Request"

export const removeComment = async (id: number) => {
    return await request.delete({
        url: '/v1/comments/',
        data: { id },
        showToast: false,
    }) as ErrorResponse
}