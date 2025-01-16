import { SimpleSearchRequest, SimpleSearchResponse } from "../../interfaces/service/SimpleSearch";
import { request } from "../../utils/api/Request"

export const searchAyats: SimpleSearchRequest = async (term, words=[], surah, aya) => {
    if (!term && !words.length) return {"success":false,"isError":true,};
    return request.get({
        url: `/v1/ayat/search`,
        data: { term: term, words: words.join(','), surah, aya },
        showToast: false
    }) as unknown as SimpleSearchResponse;
}