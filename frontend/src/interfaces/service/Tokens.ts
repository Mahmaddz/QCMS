interface TokenData {
    token: string;
    expires: string;
}

export interface TokenResponse {
    access: TokenData;
    refresh: TokenData;
}