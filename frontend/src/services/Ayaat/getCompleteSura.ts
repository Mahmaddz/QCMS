import { ErrorResponse } from "../../interfaces/service/error/error"
import { request } from "../../utils/api/Request"
import { AyahCompleteData } from "./getCompleteVerses.service"

export const getCompleteSura = async (suraNo: number) => {
    return await request.get({
        url: '/v1/ayat/surah-words',
        data: { suraNo },
        showToast: false
    }) as ErrorResponse & { result: AyahCompleteData[] }
}