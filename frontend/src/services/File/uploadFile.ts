import { ErrorResponse } from "../../interfaces/service/error/error"
import { request } from "../../utils/api/Request"

// File Nature
export type nature = 'verses' | 'tags'

export const uploadXlsFile = async (fileNature: nature, file: FormData) => {
    return await request.put({
        url: `/v1/file/upload/${fileNature}`,
        data: file
    }) as ErrorResponse
}