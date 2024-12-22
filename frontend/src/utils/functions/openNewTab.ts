import { createQueryParams } from "../api/helper/createQueryParams";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const openNewTab = (path: string = "/", data: any) => {
    const queryParams = createQueryParams(data);
    window.open(`${window.location.origin}${path}${queryParams}`, '_blank');
}