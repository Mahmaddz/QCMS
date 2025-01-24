import { ErrorResponse } from "../../interfaces/service/error/error"
import { STRING } from "../../interfaces/service/types/ApiRequest"
import { request } from "../../utils/api/Request"

export const addTagAgainstAya = async (en: STRING, ar: STRING, suraNo: number, verseNo: number) => {
    return await request.post({
        url: '/v1/tags/add',
        data: { en, ar, suraNo, verseNo },
    }) as ErrorResponse & { insertedTagId?: number }
}