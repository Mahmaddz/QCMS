import { GetAyaWordsRequest, GetAyaWordsResponse } from "../../interfaces/service/GetAyaRequest"
import { request } from "../../utils/api/Request"

export const getAyaWords: GetAyaWordsRequest = async (sura, aya=[]) => {
    return await request.get({
        url: '/v1/ayat/verse-words',
        data: { suraNo: sura, ayaNo: aya.join(',')},
        showToast: false
    }) as GetAyaWordsResponse;
}