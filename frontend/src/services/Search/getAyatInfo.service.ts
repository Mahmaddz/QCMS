import { GetQuranaRequest, GetQuranaResponse } from "../../interfaces/service/SuraAyaInfo"
import { request } from "../../utils/api/Request"

export const getAyatInfo: GetQuranaRequest = async (ayatText, ayaNo, suraNo) => {
    return await request.get({
        url: '/v1/ayat/info',
        data: { ayatText, ayaNo, suraNo },
        useToken: false,
        // showToast: false
    }) as GetQuranaResponse
}