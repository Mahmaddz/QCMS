import { ErrorResponse } from "../../interfaces/service/error/error";
import { request } from "../../utils/api/Request";

export const deleteTagAgainstAya = async (tagId: number, forceDelete: boolean = false) => {
    return await request.delete({
        url: '/v1/tags/delete',
        data: { tagId, forceDelete },
    }) as ErrorResponse
}