import { ReactNode, useEffect, useState } from "react";
import { USER } from "../../utils/UserRoles";
import { AuthContext } from "./AuthContext";
import { User } from "../../interfaces/service/common/user";
import { jwtDecode } from "jwt-decode";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userRole, setUserRole] = useState<number>(USER.PUBLIC); 
    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token) as { exp: number; sub: User };
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem('accessToken');
                    setUser(undefined);
                    setUserRole(USER.PUBLIC);
                } else {
                    setUser(decodedToken.sub);
                }
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem('accessToken');
                setUser(undefined);
                setUserRole(USER.PUBLIC);
            }
        }
        else {
            localStorage.clear();
            setUser(undefined);
            setUserRole(USER.PUBLIC);
        }
    }, []);

    useEffect(() => {
        if (user) {
            const role = user.roleID || USER.ADMIN;
            setUserRole(role);
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ userRole, setUserRole, setUser, user }}>
            {children}
        </AuthContext.Provider>
    );
};
