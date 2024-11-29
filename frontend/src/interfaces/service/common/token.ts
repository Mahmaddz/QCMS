// Interface for Access Token object
interface AccessToken {
    token: string;
    expires: string; // ISO 8601 format
}

// Interface for Refresh Token object
interface RefreshToken {
    token: string;
    expires: string; // ISO 8601 format
}

// Interface for Tokens object
export interface Tokens {
    access: AccessToken;
    refresh: RefreshToken;
}