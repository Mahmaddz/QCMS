import { SurahWithAyaatRequest, SurahWithAyaatResponse } from "../../interfaces/service/GetCompleteSurah"
import { request } from "../../utils/api/Request"

export const getCompleteSura: SurahWithAyaatRequest = async (suraNo) => {
    return await request.get({
        url: '/v1/ayat/surah',
        data: { suraNo },
        showToast: false
    }) as SurahWithAyaatResponse
}