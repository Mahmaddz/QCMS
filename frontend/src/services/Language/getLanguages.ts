import { GetLanguagesResponse, GetLanguagesRequest } from "../../interfaces/service/GetLanguages"
import { request } from "../../utils/api/Request"

export const getAllLanguages: GetLanguagesRequest = async () => {
    return await request.get({
        url: '/v1/quran-languages/language-list',
        showToast: false,
        useToken: false,
    }) as GetLanguagesResponse
}