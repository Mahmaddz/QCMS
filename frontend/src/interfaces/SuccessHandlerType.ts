import { AxiosResponse } from 'axios';

interface Notify {
    notifyOnSuccess?: boolean;
    notifyOnFailed?: boolean;
}

export interface SuccessHandlerOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response: AxiosResponse<any>; 
    options?: Notify;
}