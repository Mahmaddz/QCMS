import React from "react";

export interface PageRoute {
    path: string,
    element: React.ReactElement,
    allowedRoles?: number[],
    displayName?: string
}