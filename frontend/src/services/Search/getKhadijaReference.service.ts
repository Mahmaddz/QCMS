import { SimpleSearchResponse } from "../../interfaces/service/SimpleSearch"
import { STRING } from "../../interfaces/service/types/ApiRequest"
import { request } from "../../utils/api/Request"

export const getKhadijaReference = async (term: STRING, surah: STRING, aya: STRING) => {
    return await request.get({
        url: '/v1/ayat/reference',
        data: { term, surah, aya },
        showToast: false,
    }) as SimpleSearchResponse
}