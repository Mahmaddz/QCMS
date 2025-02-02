import { ErrorResponse } from "../../interfaces/service/error/error"
import { request } from "../../utils/api/Request"

export const modifyComment = async (id: number, suraNo: number, ayaNo: number, text: string, tagId: number) => {
    return await request.patch({
        url: '/v1/comments/',
        data: { id, suraNo, ayaNo, text, tagId },
        showToast: false
    }) as ErrorResponse
}