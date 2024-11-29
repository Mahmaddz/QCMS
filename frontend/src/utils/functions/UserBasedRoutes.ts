import { componentRoutes } from "../../routes/AllRoutes";

// THIS IS TO EXCLUDE SOME ROUTES FROM HEADER
const excludeRoutes: string[] = ["/reset-password"]

export const userBasedRoutes = (role: number) => (
    componentRoutes
        .filter(cr => (cr.path !== "*" && !excludeRoutes.includes(cr.path)) && cr?.allowedRoles?.includes(role)) 
)