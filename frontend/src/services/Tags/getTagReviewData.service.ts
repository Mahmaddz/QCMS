import { ErrorResponse } from "../../interfaces/service/error/error"
import { TagDetails } from "../../interfaces/TagDetails"
import { request } from "../../utils/api/Request"

export const getTagReviewData = async () => {
    return await request.get({
        url: `/v1/tags/review`,
        showToast: false,
    }) as ErrorResponse & { data: TagDetails[] }
}