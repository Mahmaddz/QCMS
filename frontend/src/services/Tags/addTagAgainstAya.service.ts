import { ErrorResponse } from "../../interfaces/service/error/error"
import { STRING } from "../../interfaces/service/types/ApiRequest"
import { Tag } from "../../interfaces/Tag"
import { request } from "../../utils/api/Request"

export const addTagAgainstAya = async (tag: Tag, sura: STRING, aya: STRING) => {
    return await request.post({
        url: '',
        data: { tag, sura, aya },
    }) as ErrorResponse
}