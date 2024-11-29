import axios from "axios";
import { RequestParams } from "../../interfaces/RequestParams";
import successHandler from "./helper/successHandler";
import { baseUrl } from "./BaseUrl";
import errorHandler from "./helper/ErrorHandler";

// axios.defaults.withCredentials = true;

//////////////////////////////////////////////////////
/* 
    BASIC HEADERS TO USE
*/
//////////////////////////////////////////////////////

// const getToken = async () => {
//     const accessToken = localStorage.getItem('accessToken');
//     // if (!accessToken) window.location.reload() 
//     return accessToken;
// }

const headerJson = () => {
    return {
        'Content-Type': 'application/json',
    }
}

const headerJsonWithToken = () => {
    // const accessToken = getToken();
    return {    
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
};

const headerToSendFileWithToken = () => {
    // const accessToken = getToken();
    return {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
};

const options = {
    'default': { headers: headerJson(), withCredentials: true },
    'file': { headers: headerToSendFileWithToken(), withCredentials: true },
    'withToken': { headers: headerJsonWithToken(), withCredentials: true }
};

//////////////////////////////////////////////////////
/*
    ALL API REQUESTS [GET POST PUT DELETE]
*/
//////////////////////////////////////////////////////

export const request = {

    post: async ({ url, data, showToast = true, useToken = true }: RequestParams): Promise<unknown> => {
        try {
            const response = await axios.post(
                `${baseUrl}${url}`, 
                data, 
                useToken ? options['withToken'] : options['default']
            );
            if (showToast) successHandler({ response });
            return response.data;
        } catch (error) {
            return errorHandler(error);
        }
    },

    get: async ({ url, data = {}, useToken = true, showToast = true }: RequestParams): Promise<unknown> => {
        try {
            const result: { [key: string]: string } = {};
            let queryParams: string = "";

            if (Object.keys(data).length !== 0) {
                for (const key in data) {
                    if (Object.prototype.hasOwnProperty.call(data, key)) {
                        if (data[key] !== null && data[key] !== undefined && data[key] !== 0 && data[key] !== '0' && data[key] !== '') {
                            result[key] = typeof data[key] === 'string' ? data[key] : String(data[key]);
                        }
                    }
                }
                if (Object.keys(result).length > 0) {
                    queryParams = `?${new URLSearchParams(result).toString()}`;
                }
            }

            const response = await axios.get(
                `${baseUrl}${url}${queryParams}`, 
                useToken ? options['withToken'] : options['default']
            );
            if (showToast) successHandler({ response });
            return response.data;
        } catch (error) {
            return errorHandler(error);
        }
    },

    patch: async ({ url, data, showToast = true, useToken = true }: RequestParams): Promise<unknown> => {
        try {
            const response = await axios.patch(
                `${baseUrl}${url}`, 
                data, 
                useToken ? options['withToken'] : options['default']
            );
            if (showToast) successHandler({ response });
            return response.data;
        } catch (error) {
            return errorHandler(error);
        }
    },

    put: async ({ url, data, showToast = true }: RequestParams): Promise<unknown> => {
        try {
            const response = await axios.put(
                `${baseUrl}${url}`, 
                data, 
                options['file']
            );
            if (showToast) successHandler({ response });
            return response.data;
        } catch (error) {
            return errorHandler(error);
        }
    }
};