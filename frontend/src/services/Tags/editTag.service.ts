import { ErrorResponse } from "../../interfaces/service/error/error";
import { request } from "../../utils/api/Request";

export const editTagAgainstAya = async (tagId: number, suraNo: number, ayaNo: number, en: string, ar: string) => {
    return await request.patch({
        url: '/v1/tags/update',
        data: { tagId, suraNo, ayaNo, en, ar },
    }) as ErrorResponse
}