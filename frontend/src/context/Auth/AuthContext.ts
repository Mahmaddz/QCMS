import { createContext } from "react";
import { AuthContextType } from "../../interfaces/AuthContextType";

export const AuthContext = createContext<AuthContextType | null>(null);