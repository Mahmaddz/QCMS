import { User } from "./service/common/user";

export interface AuthContextType {
    userRole: number;
    setUserRole: (role: number) => void;
    user?: User,
    setUser: (userIn: User | undefined) => void
}