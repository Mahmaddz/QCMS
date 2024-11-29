import { ErrorResponse } from "../../interfaces/service/error/error"
import { request } from "../../utils/api/Request"

export const getWords = async (suraNo: string, ayaNo: string) => {
    return await request.get({
        url: '/v1/words',
        data: {suraNo, ayaNo},
        useToken: false,
        showToast: false
    }) as {success: boolean, data: string} | ErrorResponse;
}