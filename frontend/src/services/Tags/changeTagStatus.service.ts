import { ErrorResponse } from "../../interfaces/service/error/error"
import { request } from "../../utils/api/Request"

export const changeTagStatus = async (tagId: number, statusId: number) => {
    return request.patch({
        url: `/v1/tags/change-status`,
        data: { tagId, statusId },
    }) as ErrorResponse
}