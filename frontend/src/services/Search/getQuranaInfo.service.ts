import { GetQuranaRequest, GetQuranaResponse } from "../../interfaces/service/SuraAyaInfo"
import { request } from "../../utils/api/Request"

export const getQuranaInfo: GetQuranaRequest = async (concept, ayaNo = null, suraNo = null) => {
    return await request.get({
        url: '/v1/qurana/info',
        data: {concept, ayaNo, suraNo},
        useToken: false,
        // showToast: false
    }) as GetQuranaResponse;
}