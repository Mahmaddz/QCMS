import { Comment } from "../../interfaces/Comment"
import { ErrorResponse } from "../../interfaces/service/error/error"
import { request } from "../../utils/api/Request"

export const getAllComments = async (suraNo: number, ayaNo: number, tagId: number) => {
    return await request.get({
        url: '/v1/comments/',
        data: { suraNo, ayaNo, tagId },
        showToast: false,
    }) as ErrorResponse & { data: Comment[] }
}