import { ErrorResponse } from "../../interfaces/service/error/error"
import { request } from "../../utils/api/Request"

export const insertComment = async (suraNo: number, ayaNo: number, text: string) => {
    return await request.post({
        url: '/v1/comments/',
        data: { suraNo, ayaNo, text }
    }) as ErrorResponse & { insertedCommentId: number }
}