/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RequestParams {
    url: string;
    data?: Record<string, any> | any ;
    useToken?: boolean;
    showToast?: boolean;
}