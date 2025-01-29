import Toaster from "../../helper/Toaster";
import { responseMessages } from "./ResponseMessages";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorHandler = (error: any) => {
    if (error.name === 'AxiosError') {

        if (error.code === 'ERR_NETWORK') {
            Toaster("SERVER NOT WORKING", "error")
            return {success: false, msg: "SERVER NOT WORKING"}
        }

        const { response, status } = error;
        const text = response?.data?.error?.message || responseMessages[response.status];

        if (status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }

        if (response.status >= 300 && response.status < 400) {
            Toaster(text, "info")
        }
        else if (status>=400 && status<500) {
            Toaster(text, "warn")
            return response.data;
        }
        else if (status>=500 && status<600) {
            Toaster(text, "error")
            return { success: false, ...response.data };
        }

        if (response.data.success) {
            Toaster(text, "info")
        }

        return response.data.success ? response.data : {"msg": "error handler didnt return"};
    }
    else {
        console.error("ELSE ERR: ", error)
        return {success: false, err: error}
    }
};

export default errorHandler;
