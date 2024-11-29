import { USER } from "../UserRoles";

export const getRoleName = (id: number) => Object.entries(USER).find(([, v]) => v === id)?.[0] || null;