import { SimpleSearchRequest, SimpleSearchResponse } from "../../interfaces/service/SimpleSearch";
import { request } from "../../utils/api/Request"

export const searchAyats: SimpleSearchRequest = async (term, words=[]) => {
    return request.get({
        url: `/v1/ayat/search`,
        data: { term: term, words: words.join(',') },
        // showToast: false
    }) as unknown as SimpleSearchResponse;
}