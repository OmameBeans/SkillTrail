import { createContext, useContext } from "react";
import type { User } from "../../../entities/user";

type CurrentUserContextType = {
    currentUser: User;
}

export const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export const useCurrentUser = () => {
    const context = useContext(CurrentUserContext);
    if (!context) {
        throw new Error("現在のユーザー情報が取得できませんでした");
    }
    return context;
}