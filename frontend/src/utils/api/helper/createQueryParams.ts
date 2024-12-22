// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createQueryParams = (data: Record<string, any> | any) => {
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
    return queryParams;
}