import { SimpleSearchResponse } from "../../interfaces/service/SimpleSearch";
import { STRING } from "../../interfaces/service/types/ApiRequest";
import { request } from "../../utils/api/Request";

export const getAyatsByTag = async (term: STRING, surah: STRING, aya: STRING, abortRef: AbortController) => {
    return request.get({
        url: `/v1/ayat/tags-search`,
        data: { term, surah, aya },
        showToast: false,
        abortRef,
    }) as unknown as SimpleSearchResponse;
}