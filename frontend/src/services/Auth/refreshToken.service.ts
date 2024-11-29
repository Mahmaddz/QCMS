import { TokenResponse } from "../../interfaces/service/Tokens"
import { request } from "../../utils/api/Request"

export const refreshTokens = async () => {
    const response = await request.post({
        url: "/v1/auth/refresh-tokens",
        data: {refreshToken: localStorage.getItem("refreshToken")},
        showToast: false
    }) as TokenResponse

    if (response) {
        localStorage.setItem('accessToken', response.access.token);
        localStorage.setItem('refreshToken', response.refresh.token);
    }
}